var _ = require("./common");
var tb = require("./tables.js");
var db = require("./database");

exports.register = function (api) {
    api.get('/:gameId/get/:rewardName.:format', exports.getReward);
    api.get('/:gameId/all.:format', exports.getRewards);
    api.get('/:gameId/count.:format', exports.getCount);
    api.post('/:gameId/get.:format', exports.getRewardPost);
    api.post('/:gameId/set.:format', exports.addOrUpdateReward);
    api.post('/:gameId/del.:format', exports.deleteReward);
};

exports.getReward = function (request, response) {

    var rewardName = request.params.rewardName;
    var gameId = +request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    db.getRows(request, 'reward', { Name: rewardName, gameId: gameId }, responder);

};

exports.getRewards = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    db.getRows(request, 'reward', { gameId: gameId }, responder);
};

exports.getRewardPost = function (request, response) {
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

    db.getRows(request, 'reward', where, fields, order, responder);

}

exports.addOrUpdateReward = function (request, response) {

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
    options.gameId = gameId;

    if (_.isNull(options.name) && _.isNull(options.id)) {
        _.responseError(response, format, "The name property is mandatory when creating a new reward.");
        return;
    }

    var fields;
    if (!_.isNull(options.fields)) {
        fields = options.fields.split(",");
        delete options.fields;
    }


    // normalize my instance to get back my f property
    options = tb.parseToDb('reward', options);

    // Merge the reward
    db.mergeTable(request, "reward", options, {
        success: function (result) {

            if (_.isNullOrEmpty(result)) {
                _.response(response, format, "Insertion failed.");
                return;
            }

            db.getRows(request, 'reward', { id: result[0].id }, fields, responder);
        },
        error: function (err) {
            _.responseError(response, format, err)
        }
    });

};

exports.deleteReward = function (request, response) {

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
        "The reward id property is mandatory.");
        return;
    }

    if (!options.name) {
        _.responseError(response, format,
        "The name property is mandatory.");
        return;
    }

    db.getRows(request, 'reward', { id: options.id, gameId: options.gameId, name: options.name },
        {
            success: function (r) {
                if (!r || r.length == 0) {
                    _.response(response, format, "This reward doesn't exist.");
                    return;
                }

                db.deleteRow(request, 'reward', r[0].id, responder);
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

    db.getTableRowsCount(request, "reward", gameId, responder);
};

