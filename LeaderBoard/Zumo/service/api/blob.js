var fs = require('fs');
var _ = require("./common");
var db = require("./database");
var azure = require('azure');
var qs = require('querystring');
var crypto = require('crypto');
var req = require('request');
var xmlbuilder = require('xmlbuilder');
var xml2js = require('xml2js');
var blob = require('./blob')


exports.register = function (api) {
    api.get('/:gameId/getCors.:format', exports.getCors);
    api.get('/:gameId/setCors.:format', exports.setCors);
    api.get('/:gameId/test.:format', exports.test);
}

function getSignedRequest(accountName, accountKey, method, contentType, contentLength) {

    var url = 'https://' + accountName + '.blob.core.windows.net?comp=properties&restype=service&timeout=90';

    var requestDate = (new Date()).toUTCString().replace('UTC', 'GMT');

    var signature = method.toUpperCase() + '\n' /*HTTP Verb*/ +
                    '\n'    /*Content-Encoding*/ +
                    '\n'    /*Content-Language*/ +
                    contentLength + '\n'    /*Content-Length*/ +
                    '\n'    /*Content-MD5*/ +
                    contentType + '\n'    /*Content-Type*/ +
                    '\n'    /*Date*/ +
                    '\n'    /*If-Modified-Since */ +
                    '\n'    /*If-Match*/ +
                    '\n'    /*If-None-Match*/ +
                    '\n'    /*If-Unmodified-Since*/ +
                    '\n'    /*Range*/ +
                    'x-ms-date:' + requestDate + '\n' + /*CanonicalizedHeaders*/
                    'x-ms-version:2013-08-15' + '\n' +
                    '/' + accountName + '/' + '\n' + /*CanonicalizedResource*/
                    'comp:properties\n' +
                    'restype:service\n' +
                    'timeout:90';

    var _decodedAccessKey = new Buffer(accountKey, 'base64');

    var sign = crypto.createHmac('sha256', _decodedAccessKey).update(signature, 'utf-8').digest('base64');
    var signString = 'SharedKey ' + accountName + ':' + sign;

    var headers = {};
    headers['x-ms-date'] = requestDate;
    headers['x-ms-version'] = '2013-08-15';
    headers['Authorization'] = signString;

    var reqParams = {
        uri: url,
        headers: headers
    };

    return reqParams;
}

function serializeMetrics(doc, metrics) {
    if (typeof metrics.Version !== 'undefined') {
        doc = doc.ele('Version').txt(metrics.Version).up();
    } else {
        doc = doc.ele('Version').txt('1.0').up();
    }

    if (typeof metrics.Enabled !== 'undefined') {
        doc = doc.ele('Enabled')
                .txt(metrics.Enabled)
              .up();
    } else {
        doc = doc.ele('Enabled').txt(false).up();
    }

    if (typeof metrics.IncludeAPIs !== 'undefined') {
        doc = doc.ele('IncludeAPIs').txt(metrics.IncludeAPIs).up();
    } else if (metrics.Enabled === true) {
        doc = doc.ele('IncludeAPIs').txt(false).up();
    }

    serializeRetentionPolicy(doc, metrics.RetentionPolicy);
}

function serializeCorsRules(doc, rules) {
    if (typeof rules !== 'undefined' && rules !== null) {
        rules.forEach(function (rule) {
            doc = doc.ele('CorsRule');

            if (typeof rule.AllowedMethods !== 'undefined') {
                doc = doc.ele('AllowedMethods').txt(rule.AllowedMethods.join(',')).up();
            }

            if (typeof rule.AllowedOrigins !== 'undefined') {
                doc = doc.ele('AllowedOrigins').txt(rule.AllowedOrigins.join(',')).up();
            }

            if (typeof rule.AllowedHeaders !== 'undefined') {
                doc = doc.ele('AllowedHeaders').txt(rule.AllowedHeaders.join(',')).up();
            }

            if (typeof rule.ExposedHeaders !== 'undefined') {
                doc = doc.ele('ExposedHeaders').txt(rule.ExposedHeaders.join(',')).up();
            }

            if (typeof rule.MaxAgeInSeconds !== 'undefined') {
                doc = doc.ele('MaxAgeInSeconds').txt(rule.MaxAgeInSeconds).up();
            }

            doc = doc.up();
        });
    }
}

function serializeRetentionPolicy(doc, policy) {
    if (policy !== null) {
        if (typeof policy === 'undefined') {
            policy = {};
        }

        doc = doc.ele('RetentionPolicy');
        if (typeof policy.Enabled !== 'undefined') {
            doc = doc.ele('Enabled').txt(policy.Enabled).up();
        } else {
            doc = doc.ele('Enabled').txt(false).up();
        }

        if (typeof policy.Days !== 'undefined') {
            doc = doc.ele('Days').txt(policy.Days).up();
        } else if (policy.Enabled === true) {
            doc = doc.ele('Days').txt(1).up();
        }

        doc = doc.up();
    }
}

function serializeLogging(doc, logging) {
    if (typeof logging.Version !== 'undefined') {
        doc = doc.ele('Version').txt(logging.Version).up();
    } else {
        doc = doc.ele('Version').txt('1.0').up();
    }

    if (typeof logging.Delete !== 'undefined') {
        doc = doc.ele('Delete').txt(logging.Delete).up();
    } else {
        doc = doc.ele('Delete').txt(false).up();
    }

    if (typeof logging.Read !== 'undefined') {
        doc = doc.ele('Read').txt(logging.Read).up();
    } else {
        doc = doc.ele('Read').txt(false).up();
    }

    if (typeof logging.Write !== 'undefined') {
        doc = doc.ele('Write').txt(logging.Write).up();
    } else {
        doc = doc.ele('Write').txt(false).up();
    }

    serializeRetentionPolicy(doc, logging.RetentionPolicy);

    doc = doc.up();
}

exports.setCors = function (request, response) {

    var gameId = request.params.gameId;
    var format = request.params.format || 'json';

    db.getRows(request, 'game', { id: gameId }, {
        success: function (results) {
            var game = results[0];

            if (_.isNullOrEmpty(game.blobContainerName) ||
                _.isNullOrEmpty(game.blobAccountName) ||
                _.isNullOrEmpty(game.blobAccountKey)) {

                _.responseError(response, format, 'blob containers parameters are empty');
                return;
            }

            var containerName = game.blobContainerName || 'assets';
            var accountName = game.blobAccountName;
            var accountKey = game.blobAccountKey;

            blob._setCors(containerName, accountName, accountKey, function (err, res) {
                if (!_.isNullOrEmpty(err)) {
                    return _.responseError(response, format, err);
                }
                return _.response(response, format, res);

            });

        },
        error: function (err) {
            _.responseError(response, format, err);
        }
    });
};

exports._setCors = function (containerName, accountName, accountKey, callback) {


    var reqParams = getSignedRequest(accountName, accountKey, 'GET', '', '0');

    req.get(reqParams, function (e, res, body) {

        if (e || res.statusCode != 200) {
            return callback(body, null);

        }
        var spJs = body;

        var xml2jsSettings = xml2js.defaults['0.2'];
        // these determine what happens if the xml contains attributes
        xml2jsSettings.attrkey = '$';
        xml2jsSettings.charkey = '_';
        // from xml2js guide: always put child nodes in an array if true; otherwise an array is created only if there is more than one.
        xml2jsSettings.explicitArray = false;

        var parser = new xml2js.Parser(xml2jsSettings);
        body = body.toString();
        if (body.charCodeAt(0) === 0xfeff || body.charCodeAt(0) === 0xffef) {
            body = body.substring(1);
        }

        parser.parseString(body, function (err, parsedBody) {
            if (err) {
                return callback(err, null);
            }
            else {

                var spJs = parsedBody.StorageServiceProperties;

                // if Cors exist, delete
                if (spJs.Cors != null) {
                    delete spJs.Cors;
                }

                spJs.Cors = {};
                spJs.Cors.CorsRule = [];
                var rule = {};
                rule.AllowedMethods = [];
                rule.AllowedMethods.push("POST");
                rule.AllowedMethods.push("PUT");
                rule.AllowedOrigins = [];
                rule.AllowedOrigins.push("*");
                rule.AllowedHeaders = [];
                rule.AllowedHeaders.push("*");
                rule.ExposedHeaders = [];
                rule.ExposedHeaders.push("*");
                rule.MaxAgeInSeconds = 3600;
                spJs.Cors.CorsRule.push(rule);

                var doc = xmlbuilder.create();
                doc = doc.begin('StorageServiceProperties', { version: '1.0', encoding: 'utf-8' });

                if (spJs.Logging != null) {
                    doc = doc.ele('Logging');
                    serializeLogging(doc, spJs.Logging);
                    doc = doc.up();
                }

                if (spJs.HourMetrics != null) {
                    doc = doc.ele('HourMetrics');
                    serializeMetrics(doc, spJs.HourMetrics);
                    doc = doc.up();
                }

                if (spJs.MinuteMetrics != null) {
                    doc = doc.ele('MinuteMetrics');
                    serializeMetrics(doc, spJs.MinuteMetrics);
                    doc = doc.up();
                }

                if (spJs.Cors != null) {
                    doc = doc.ele('Cors');
                    serializeCorsRules(doc, spJs.Cors.CorsRule);
                    doc = doc.up();
                }

                if (spJs.DefaultServiceVersion != null) {
                    doc = doc.ele('DefaultServiceVersion').txt(spJs.DefaultServiceVersion).up();
                }

                var s = doc.doc().toString();

                var reqParams = getSignedRequest(accountName, accountKey, 'PUT', '', Buffer.byteLength(s).toString());

                reqParams.body = s;
                reqParams.method = 'PUT';
                reqParams.headers['Host'] = accountName + '.blob.core.windows.net';
                reqParams.headers['Content-Length'] = Buffer.byteLength(s);


                req.put(reqParams, function (e, res, body) {

                    if (res.statusCode == 202) {
                        return callback(null, spJs);
                    }

                    if (e || res.statusCode != 202) {
                        var errorStr = "";

                        if (e != undefined)
                            errorStr += e;
                        if (body != undefined)
                            errorStr += body;

                        errorStr += res;

                        return callback(errorStr, null);
                    }
                });
            }
        });


    });

}

exports.getCors = function (request, response) {
    var gameId = request.params.gameId;
    var format = request.params.format || 'json';

    db.getRows(request, 'game', { id: gameId }, {
        success: function (results) {
            var game = results[0];

            if (_.isNullOrEmpty(game.blobContainerName) ||
                _.isNullOrEmpty(game.blobAccountName) ||
                _.isNullOrEmpty(game.blobAccountKey)) {

                _.responseError(response, format, 'blob containers parameters are empty');
                return;
            }

            var containerName = game.blobContainerName || 'assets';
            var accountName = game.blobAccountName;
            var accountKey = game.blobAccountKey;

            var reqParams = getSignedRequest(accountName, accountKey, 'GET', '', '0');

            req.get(reqParams, function (e, res, body) {

                if (e || res.statusCode != 200) {
                    return _.responseError(response, format, body);
                }

                var xml2jsSettings = xml2js.defaults['0.2'];
                // these determine what happens if the xml contains attributes
                xml2jsSettings.attrkey = '$';
                xml2jsSettings.charkey = '_';
                // from xml2js guide: always put child nodes in an array if true; otherwise an array is created only if there is more than one.
                xml2jsSettings.explicitArray = false;

                var parser = new xml2js.Parser(xml2jsSettings);
                body = body.toString();

                if (body.charCodeAt(0) === 0xfeff || body.charCodeAt(0) === 0xffef) {
                    body = body.substring(1);
                }


                parser.parseString(body, function (err, parsedBody) {
                    if (err) {
                        return _.responseError(response, format, err);
                    }

                    _.response(response, format, parsedBody.StorageServiceProperties);

                });

            });

        },
        error: function (err) {
            _.responseError(response, format, err);
        }
    });

}

exports.test = function (request, response) {

    var gameId = request.params.gameId;
    var format = request.params.format || 'json';

    var f = {
        __dirname: __dirname,
        __filename: __filename
    }

    var acc = {
        files: [],
        dirs: []
    };

    walk('D:\\home\\site\\wwwroot', acc, function (err, start, acc) {
        if (err != null) {
            _.responseError(response, format, err);
            return;
        }
        _.response(response, format, acc);
    })


};


function walk(start, acc, callback) {


    var _r = function (currentStart, acc) {

        var files = fs.readdirSync(currentStart);

        if (files == null || files.length == 0) {
            return;
        }

        for (var f in files) {

            var fileOrDir = files[f];
            var fullPath = currentStart + '\\' + fileOrDir;

            var currentStat = fs.statSync(fullPath);

            if (currentStat.isDirectory()) {
                acc.dirs.push(fullPath.replace(start, ''));
                _r(fullPath, acc);

            } else {
                if (fileOrDir.indexOf('.js') >= 0)
                    acc.files.push(fullPath.replace(start, ''));
            }
        }
    }

    _r(start, acc);

    return callback(null, start, acc);

};

