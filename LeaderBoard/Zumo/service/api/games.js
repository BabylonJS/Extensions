var _ = require("./common");
var tb = require("./tables.js");
var db = require("./database");
var req = require('request');
var util = require('util');


exports.register = function (api) {
    api.get('/:gameId/fetch.:format', exports.getGame);
    api.get('/all.:format', exports.getGames);
    api.get('/count.:format', exports.getCount);
    api.post('/:gameId/get.:format', exports.getGamePost);
    api.post('/:gameId/set.:format', exports.updateGame);
};

exports.getGame = function (request, response) {

    var gameId = +request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    db.getRows(request, 'game', { id: gameId }, responder);

};

exports.getGames = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    db.getRows(request, 'game', responder);
};

exports.getGamePost = function (request, response) {
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = +request.params.gameId;

    var options = request.body;

    var order = options.order;
    var fields = null;
    
    if (!_.isNull(options.fields)){
        fields = options.fields;
        delete options.fields;
    }
    
    var where = options.where;
    if (_.isNull(where)) {
        where = {};
    }

    if (_.isNull(where.gameId)) {
        where.id = gameId;
    }

    db.getRows(request, 'game', where, fields, order, responder);

}

exports.updateGame = function (request, response) {

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
        _.responseError(response, format, "gameId property is mandatory");
        return;
    }
    options.id = gameId;

    if (_.isNull(options.name) && _.isNull(options.id)) {
        _.responseError(response, format, "The name property is mandatory when creating a new game.");
        return;
    }

    var fields;
    if (!_.isNull(options.fields)) {
        fields = options.fields;
		delete options.fields;
    }


    // normalize my instance to get back my f property
    options = tb.parseToDb('game', options);

    // Merge the game
    db.mergeTable(request, "game", options, {
        success: function (result) {

            if (_.isNullOrEmpty(result)) {
                _.response(response, format, "Insertion failed.");
                return;
            }

            db.getRows(request, 'game', { id: result[0].id }, fields, responder);
        },
        error: function (err) {
            _.responseError(response, format, err)
        }
    });

};


exports.getCount = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    var gameId = request.params.gameId;

    db.getTableRowsCount(request, "game", gameId, responder);
};
