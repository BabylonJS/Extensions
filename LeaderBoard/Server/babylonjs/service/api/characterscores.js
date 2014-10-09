var _ = require("./common");
var tb = require("./tables.js");
var db = require("./database");

exports.register = function (api) {
    api.get('/:gameId/get/:name.:format', exports.getCharacterScore);
    api.post('/:gameId/set.:format', exports.addOrUpdateCharacterScore);
    api.post('/:gameId/del.:format', exports.deleteCharacterScore);
};

exports.getCharacterScore = function (request, response) {

    var characterName = request.params.name;
    var gameId = +request.params.gameId;
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    if (_.isNullOrEmpty(characterName)) {
        _.responseError(response, format, "The character name property is mandatory.");
        return;
    }


    db.getRows(request, 'character', { gameId: gameId, name: characterName }, "id,name,gameId",
          {
              success: function (chars) {

                  if (_.isNullOrEmpty(chars)) {
                      _.responseError(response, format, 'this character doesn\'t exist.');
                      return;
                  }
                  var c = chars[0];

                  db.getRows(request, 'characterScore', { gameid: gameId, characterId: c.id },
                      {
                          success: function (scores) {
                              c.scores = scores;
                              _.response(response, format, c);

                          },
                          error: function (err) {
                              _.responseError(response, format, err);
                          }
                      });

              },
              error: function (err) {
                  _.responseError(response, format, err);
              }
          });
};


exports.addOrUpdateCharacterScore = function (request, response) {

  
    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = +request.params.gameId;

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

    if (_.isNullOrEmpty(options.name)) {
        _.responseError(response, format, "The character name property is mandatory.");
        return;
    }

    var fields;
    if (!_.isNull(options.fields)) {
        fields = options.fields.split(",");
        delete options.fields;
    }


    db.getRows(request, 'character', { gameId: gameId, name: options.name }, "id,name,gameId",
       {
           success: function (chars) {

               if (_.isNullOrEmpty(chars)) {
                   _.responseError(response, format, 'this character doesn\'t exist.');
                   return;
               }
               var c = chars[0];

               options.characterId = c.id;
               delete options['name'];

               // normalize my instance to get back my f property
               options = tb.parseToDb('characterScore', options);

               // Merge the characterScore
               db.mergeTable(request, "characterScore", options, {
                   success: function (result) {

                       if (_.isNullOrEmpty(result)) {
                           _.responseError(response, format, "Insertion failed.");
                           return;
                       }

                       db.getRows(request, 'characterScore', { id: result[0].id }, fields, responder);
                   },
                   error: function (err) {
                       _.responseError(response, format, err)
                   }
               });

           },
           error: function (err) {
               _.responseError(response, format, err);
           }
       });
};

exports.deleteCharacterScore = function (request, response) {

    var fields;

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = +request.params.gameId;

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
        "The characterScore id property is mandatory.");
        return;
    }

    if (!options.name) {
        _.responseError(response, format,
        "The name property is mandatory.");
        return;
    }

    db.getRows(request, 'characterScore', { id: options.id, gameId: options.gameId},
        {
            success: function (r) {
                if (!r || r.length == 0) {
                    _.response(response, format, "This characterScore doesn't exist.");
                    return;
                }

                db.deleteRow(request, 'characterScore', r[0].id, responder);
            },
            error: function (err) {
                _.responseError(response, format, err);
            }
        });
};

exports.getCount = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);

    var gameId = +request.params.gameId;

    db.getTableRowsCount(request, "characterScore", gameId, responder);
};

