var _ = require("./common");

var fs = require('fs');

exports.register = function (api) {
    api.post('/module.:format', exports.module);
    api.get('/modules.:format', exports.getmodules);
    api.get('/test.:format', exports.test);
}


exports.test = function (request, response) {
    var format = request.params.format || 'json';
  
    _.response(response, format, 'hello');
};

exports.module = function (request, response) {
    var format = request.params.format || 'json';
    var module = request.body.module;
    var r = {
        name: module,
        isFound: true,
        fullpath: undefined,
        error: undefined
    };

    try {

        var m = require(module);
        var fullpath = require.resolve(module)
        r.isFound = true;
        r.fullpath = fullpath;
        r.error = undefined;
    } catch (e) {
        r.isFound = false;
        r.fullpath = undefined;
        r.error = e;
    }

    var t = _.response(response, format, r);

};



exports.getmodules = function (request, response) {

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
                acc.files.push(fullPath.replace(start, ''));
            }
        }
    }

    _r(start, acc);

    return callback(null, start, acc);

};
