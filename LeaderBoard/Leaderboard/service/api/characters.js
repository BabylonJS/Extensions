var _ = require("./common");
var tb = require("./tables.js");
var db = require("./database");
var req = require('request');
var util = require('util');


exports.register = function (api) {
    api.get('/:gameId/get/:characterName.:format', exports.getCharacter);
    api.get('/:gameId/id/facebook.:format', exports.getFacebookProfile);
    api.get('/:gameId/id/google.:format', exports.getGoogleProfile);
    api.get('/:gameId/id/microsoftaccount.:format', exports.getMicrosoftProfile);
    api.get('/:gameId/me/:source.:format', exports.getCharacterFromProfile);
    api.get('/:gameId/all.:format', exports.getCharacters);
    api.get('/:gameId/count.:format', exports.getCount);
    api.post('/:gameId/get.:format', exports.getCharacterPost);
    api.post('/:gameId/set.:format', exports.addOrUpdateCharacter);
    api.post('/:gameId/del.:format', exports.deleteCharacter);

};
exports.getCharacter = function (request, response) {

    var characterName = request.params.characterName;
    var gameId = +request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    db.getRows(request, 'character', { Name: characterName, gameId: gameId }, responder);

};

exports.getCharacters = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    db.getRows(request, 'character', { GameId: gameId }, responder);
};

exports.getCharacterPost = function (request, response) {
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = +request.params.gameId;

    var options = request.body;

    var order = options.order;
    var fields = options.fields;

    var where = options.where;
    if (_.isNull(where)) {
        where = {};
    }

    if (_.isNull(where.gameId)) {
        where.gameId = gameId;
    }

    db.getRows(request, 'character', where, fields, order, responder);

}

exports.addOrUpdateCharacter = function (request, response) {

    var fields;

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    if (_.isNull(request.body)) {
        _.responseError(response, format,
            'error trying parse your json request. Make sure your json structure is correct ');
        return;
    }
    var options = request.body;

    if (_.isNull(gameId)) {
        _.responseError(response, format, "GameId property is mandatory");
        return;
    }
    options.gameId = gameId;

    if (_.isNull(options.name) && _.isNull(options.id)) {
        _.responseError(response, format, "The name property is mandatory when creating a new character.");
        return;
    }

    if (!_.isNull(options.fields)) {
        fields = options.fields;
        delete options.fields;
    }

    // normalize my instance to get back my f property
    options = tb.parseToDb('character', options);

    // Merge the character
    db.mergeTable(request, "character", options, {
        success: function (result) {

            if (_.isNullOrEmpty(result)) {
                _.responseError(response, format, "Insertion failed.");
                return;
            }

            db.getRows(request, 'character', { id: result[0].id }, fields, responder);
        },
        error: function (err) {
            _.responseError(response, format, err)
        }
    });

};

exports.deleteCharacter = function (request, response) {

    var fields;

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    if (_.isNull(request.body)) {
        _.responseError(response, format,
            'error trying parse your json request. Make sure your json structure is correct ');
        return;
    }
    var options = request.body;

    if (!gameId) {
        _.responseError(response, format, "GameId property is mandatory");
        return;
    }
    options.gameId = gameId;

    if (!options.id) {
        _.responseError(response, format,
        "The character id property is mandatory.");
        return;
    }

    if (!options.name) {
        _.responseError(response, format,
        "The name property is mandatory.");
        return;
    }

    db.getRows(request, 'character', { id: options.id, gameId: options.gameId, name: options.name },
        {
            success: function (r) {
                if (!r || r.length == 0) {
                    _.response(response, format, "This character doesn't exist.");
                    return;
                }

                db.deleteRow(request, 'character', r[0].id, responder);
            },
            error: function (err) {
                _.responseError(response, format, err);
            }
        });
};

exports.getCount = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    var gameId = request.params.gameId;

    db.getTableRowsCount(request, "character", gameId, responder);
};


var _mergeAfterAuth = function (request, profile, done, error) {


    var c = {};
    var filter = {};

    filter.gameId = profile.gameId;
    filter.name = profile.name;

    c.name = profile.name;
    c.firstName = profile.firstName;
    c.lastName = profile.lastName;

    if (profile.source == "facebook") {
        c.facebookId = profile.id;
    }
    if (profile.source == "microsoftaccount") {
        c.liveId = profile.id;
    }

    if (profile.source == "twitter") {
        c.twitterId = profile.id;
    }

    if (profile.source == "google") {
        c.googleId = profile.id;
    }

    c.imageUrl = profile.smallImageUrl;
    c.gameId = profile.gameId;

    if (!_.isNullOrEmpty(profile.email))
        c.email = profile.email;

    // try to get the existing character
    db.getRows(request, 'character', filter, {
        success: function (chars) {

            // it's an update
            if (chars && chars.length > 0) {
                c.id = chars[0].id;
            }

            db.mergeTable(request, "character", c, {
                success: function (result) {

                    if (!result || result.length == 0) {
                        error("Merge after authentication failed.");
                        return;
                    }
                    db.getRows(request, 'character', { id: result[0].id },
                        {
                            success: function (r) { done(r); },
                            error: function (e) { error(e); }
                        });
                },
                error: function (err) {
                    error(err);
                }
            });
        },
        error: function (err) {
            error(err);
        }
    });

}

exports.getFacebookProfile = function (request, response) {
    var gameId = request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var user = request.user;

    if (!user) {
        _.responseError(response, format, 'You must be logged to use this API');
        return;
    }

    user.getIdentities({
        success: function (identities) {
            if (identities.facebook) {

                var fbAccessToken = identities.facebook.accessToken;

                _getSocialProfile('facebook', identities.facebook.accessToken, function (p) {
                    p.gameId = +gameId;
                    _.response(response, format, [p]);

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from Facebook API: ', e);
                });
            } else {
                _.responseError(response, format, 'Character does not have any Facebook account registered');
            }
        },
        error: function (e) {
            _.responseError(response, format, e);
        }
    });

}

exports.getMicrosoftProfile = function (request, response) {
    var gameId = request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var user = request.user;

    if (!user) {
        _.responseError(response, format, 'You must be logged to use this API');
        return;
    }

    user.getIdentities({
        success: function (identities) {
            if (identities.microsoft) {

                var fbAccessToken = identities.microsoft.accessToken;

                _getSocialProfile('microsoftaccount', identities.microsoft.accessToken, function (p) {
                    p.gameId = +gameId;
                    _.response(response, format, [p]);

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from Live API: ', e);
                });
            } else {
                _.responseError(response, format, 'Character does not have any Live account registered');
            }
        },
        error: function (e) {
            _.responseError(response, format, e);
        }
    });

}

exports.getGoogleProfile = function (request, response) {
    var gameId = request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var user = request.user;

    if (!user) {
        _.responseError(response, format, 'You must be logged to use this API');
        return;
    }

    user.getIdentities({
        success: function (identities) {
            if (identities.google) {

                var fbAccessToken = identities.google.accessToken;

                _getSocialProfile('google', identities.google.accessToken, function (p) {
                    p.gameId = +gameId;
                    _.response(response, format, [p]);

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from google API: ', e);
                });
            } else {
                _.responseError(response, format, 'Character does not have any google account registered');
            }
        },
        error: function (e) {
            _.responseError(response, format, e);
        }
    });

}

exports.getCharacterFromProfile = function (request, response) {

    var responder = new _.responder(response, format);

    var gameId = request.params.gameId;
    var format = request.params.format || 'json';
    var user = request.user;
    var source = request.params.source;

    if (!user) {
        _.responseError(response, format, 'You must be logged to use this API');
        return;
    }

    if (source != 'facebook' && source != 'microsoftaccount' && source != 'google') {
        _.responseError(response, format, 'This source is not authorized');
        return;
    }


    user.getIdentities({
        success: function (identities) {

            console.log(identities);

            if (identities.facebook) {

                var accessToken = identities.facebook.accessToken;

                _getSocialProfile('facebook', accessToken, function (p) {
                    p.gameId = +gameId;

                    _mergeAfterAuth(request, p,
                        function (r) { _.response(response, format, r); },
                        function (e) { _.responseError(response, format, e); });
                    return;

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from facebook API: ' + e);
                    return;

                });

            } else if (identities.google) {

                var accessToken = identities.google.accessToken;

                _getSocialProfile('google', accessToken, function (p) {
                    p.gameId = +gameId;
                    _mergeAfterAuth(request, p,
                        function (r) { _.response(response, format, r); },
                        function (e) { _.responseError(response, format, e); });
                    return;

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from google API: ' + e);
                    return;

                });

            } else if (identities.microsoft) {
                var accessToken = identities.microsoft.accessToken;

                _getSocialProfile('microsoftaccount', accessToken, function (p) {
                    p.gameId = +gameId;

                    _mergeAfterAuth(request, p,
                        function (r) { _.response(response, format, r); },
                        function (e) { _.responseError(response, format, e); });
                    return;

                }, function (e) {
                    _.responseError(response, format, 'Error parsing response from microsoft API: ' + e);
                    return;

                });



            } else {
                _.responseError(response, format, 'identities doesn\'t have facebook profile');
            }



        },
        error: function (err) {
            _.responseError(response, format, err)
        }
    });

}

var _getSocialProfile = function (source, accessToken, done, error) {

    var url = '';
    var reqParams = {
        uri: '',
        headers: {
            Accept: 'application/json'
        }
    };

    if (source == 'facebook') {
        reqParams.uri = 'https://graph.facebook.com/v2.1/me?access_token=' + accessToken + '&fields=id,first_name,last_name,link,name,picture.type(normal)';
    } else if (source == 'google') {
        reqParams.uri = 'https://www.googleapis.com/userinfo/v2/me?access_token=' + accessToken;
        //reqParams.uri = 'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + accessToken;
    } else if (source == 'microsoftaccount') {
        reqParams.uri = 'https://apis.live.net/v5.0/me?access_token=' + accessToken;

    }

    req.get(reqParams, function (e, res, body) {

        if (e || res.statusCode != 200) {
            error(e);
            return;
        }

        try {

            var rmt = JSON.parse(body);

            console.log(rmt);

            var profile = {};

            profile.source = source;
            profile.id = rmt.id
            profile.name = rmt.name;

            if (!_.isNullOrEmpty(rmt.first_name))
                profile.firstName = rmt.first_name;

            if (!_.isNullOrEmpty(rmt.email))
                profile.email = rmt.email;

            if (!_.isNullOrEmpty(rmt.given_name))
                profile.firstName = rmt.given_name;

            if (!_.isNullOrEmpty(rmt.last_name))
                profile.lastName = rmt.last_name;

            if (!_.isNullOrEmpty(rmt.family_name))
                profile.lastName = rmt.family_name;

            if (rmt.picture && rmt.picture.data && rmt.picture.data.url)
                profile.smallImageUrl = rmt.picture.data.url;
            else if (!_.isNullOrEmpty(rmt.picture))
                profile.smallImageUrl = rmt.picture;
            else if (profile.source == "microsoftaccount")
                profile.smallImageUrl = "https://apis.live.net/v5.0/" + profile.id + "/picture"

            console.log(profile);

            done(profile);

        } catch (ex) {
            error(ex);
            return;
        }

    });
};

function fetchBasicProfile(user, callback) {
    var req = require('request');
    var util = require('util');

    var sep = user.userId.indexOf(':');
    var profile = {};
    profile.source = user.userId.substring(0, sep).toLowerCase();
    profile.id = user.userId.substring(sep + 1);

    var createError = function (e, r) {
        var newError = {};
        newError.message = e ? e.toString() : r.body;
        newError.statusCode = r.statusCode;
        newError.responseText = r.body;
        return newError;
    }

    switch (profile.source) {
        case 'facebook':
            var url = util.format('https://graph.facebook.com/%s', profile.id);
            req.get(url, function (error, response, body) {
                if (error || response.statusCode != 200) callback(createError(error, response));
                else {
                    var rmt = JSON.parse(body);
                    profile.name = rmt.name;
                    profile.firstName = rmt.first_name;
                    profile.lastName = rmt.last_name;
                    profile.userName = rmt.username;
                    profile.smallImageUrl = url + '/picture?type=small';
                    profile.largeImageUrl = url + '/picture?type=large';
                    callback(null, profile);
                    return;
                }
            });
            break;
        case 'twitter':
            var url = util.format('https://api.twitter.com/1/users/show.json?user_id=%s', profile.id);
            req.get(url, function (error, response, body) {
                if (error || response.statusCode != 200) callback(createError(error, response));
                else {
                    var rmt = JSON.parse(body);
                    profile.name = rmt.name;
                    profile.userName = rmt.screen_name;
                    profile.smallImageUrl = util.format('http://api.twitter.com/1/users/profile_image/%s.normal', profile.userName);
                    profile.largeImageUrl = util.format('http://api.twitter.com/1/users/profile_image/%s.bigger', profile.userName);
                    callback(null, profile);
                }
            });
            break;
        default:
            callback(null, profile);
    }
}
