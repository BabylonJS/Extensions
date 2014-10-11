var _ = require("./common");
var db = require("./database");
var blob = require("./blob");

exports.register = function (api) {
    api.post('/createGame.:format', exports.create);
    api.get('/deleteGame/:gameId.:format', exports.deleteGame);
    api.get('/getGames.:format', exports.getgames);
    api.get('/deleteGames.:format', exports.deleteGames);
    api.get('/dropDatabase.:format', exports.dropdatabase);
    api.get('/createSample/:gameId.:format', exports.createSampleDatas);
};


exports.getgames = function (request, response) {

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    db.getRows(request, 'game', responder);

}

exports.dropdatabase = function (request, response) {

    var format = request.params.format || 'json';

    var deleteimages = "IF EXISTS (select * from sys.tables where name = \'image\') Delete from [image]";
    var deletecharacterRewards = "IF EXISTS (select * from sys.tables where name = \'characterReward\') Delete from [characterReward]";
    var deletecharacterScores = "IF EXISTS (select * from sys.tables where name = \'characterScore\') Delete from [characterScore]";
    var deleterewards = "IF EXISTS (select * from sys.tables where name = \'reward\') Delete from [reward]";
    var deleteachievements = "IF EXISTS (select * from sys.tables where name = \'achievement\') Delete from [achievement]";
    var deletecharacters = "IF EXISTS (select * from sys.tables where name = \'character\') Delete from [character]";
    var deletegame = "IF EXISTS (select * from sys.tables where name = \'game\') Delete from [game]";

    var dropimages = "IF EXISTS (select * from sys.tables where name = \'image\') Drop Table [image]";
    var dropcharacterRewards = "IF EXISTS (select * from sys.tables where name = \'characterReward\') Drop Table [characterReward]";
    var dropcharacterScores = "IF EXISTS (select * from sys.tables where name = \'characterScore\') Drop Table [characterScore]";
    var droprewards = "IF EXISTS (select * from sys.tables where name = \'reward\') Drop Table [reward]";
    var dropachievements = "IF EXISTS (select * from sys.tables where name = \'achievement\') Drop Table [achievement]";
    var dropcharacters = "IF EXISTS (select * from sys.tables where name = \'character\') Drop Table [character]";
    var dropgame = "IF EXISTS (select * from sys.tables where name = \'game\') Drop Table [game]";


    var mssql = request.service.mssql;

    var arr = [
		{ query: deleteimages, params: null },
		{ query: deletecharacterRewards, params: null },
		{ query: deletecharacterScores, params: null },
		{ query: deleterewards, params: null },
		{ query: deleteachievements, params: null },
		{ query: deletecharacters, params: null },
		{ query: deletegame, params: null },
		{ query: dropimages, params: null },
		{ query: dropcharacterRewards, params: null },
		{ query: dropcharacterScores, params: null },
		{ query: droprewards, params: null },
		{ query: dropachievements, params: null },
		{ query: dropcharacters, params: null },
		{ query: dropgame, params: null },
    ]

    // iterate through all sql statements 
    db.iterateSql(request, arr, {
        success: function (r) { _.response(response, format, 'database dropped') },
        error: function (err) { _.responseError(response, format, 'error during iterate ' + err) }
    });

}

exports.deleteGames = function (request, response) {

    var format = request.params.format || 'json';


    var deleteimages = "IF EXISTS (select * from sys.tables where name = \'image\') Delete from [image]";
    var deletecharacterRewards = "IF EXISTS (select * from sys.tables where name = \'characterReward\') Delete from [characterReward]";
    var deletecharacterScores = "IF EXISTS (select * from sys.tables where name = \'characterScore\') Delete from [characterScore]";
    var deleterewards = "IF EXISTS (select * from sys.tables where name = \'reward\') Delete from [reward]";
    var deleteachievements = "IF EXISTS (select * from sys.tables where name = \'achievement\') Delete from [achievement]";
    var deletecharacters = "IF EXISTS (select * from sys.tables where name = \'character\') Delete from [character]";
    var deletegame = "IF EXISTS (select * from sys.tables where name = \'game\') Delete from [game]";

    var mssql = request.service.mssql;

    var arr = [
		{ query: deleteimages, params: null },
		{ query: deletecharacterRewards, params: null },
		{ query: deletecharacterScores, params: null },
		{ query: deleterewards, params: null },
		{ query: deleteachievements, params: null },
		{ query: deletecharacters, params: null },
		{ query: deletegame, params: null }
    ]

    // iterate through all sql statements 
    db.iterateSql(request, arr, {
        success: function (r) { _.response(response, format, 'database clean') },
        error: function (err) { _.responseError(response, format, 'error during iterate ' + err) }
    });

}

exports.deleteGame = function (request, response) {

    var format = request.params.format || 'json';
    var gameId = request.params.gameId;

    if (!gameId) {
        _.responseError(response, format, "gameId property is mandatory");
        return;
    }

    var deleteimages = "Delete from [image] where gameId = ?";
    var deletecharacterRewards = "Delete from [characterReward] where gameId = ?";
    var deletecharacterScores = "Delete from [characterScore] where gameId = ?";
    var deleterewards = "Delete from [reward] where gameId = ?";
    var deleteachievements = "Delete from [achievement] where gameId = ?";
    var deletecharacters = "Delete from [character] where gameId = ?";
    var deletegame = "Delete from [game] where id = ?";

    var mssql = request.service.mssql;
    var arr = [
		 { query: deleteimages, params: [gameId] },
		 { query: deletecharacterRewards, params: [gameId] },
		 { query: deletecharacterScores, params: [gameId] },
		 { query: deleterewards, params: [gameId] },
		 { query: deleteachievements, params: [gameId] },
		 { query: deletecharacters, params: [gameId] },
		 { query: deletegame, params: [gameId] },
    ]
    // iterate through all sql statements 
    db.iterateSql(request, arr, {
        success: function (r) { _.response(response, format, 'game deleted') },
        error: function (err) { _.responseError(response, format, 'error during iterate ' + err) }
    });


}

exports.create = function (request, response) {

    var game;
    var character;
    var jsonBody

    var format = request.params.format || 'json';

    if (!request.body) {
        _.responseError(response, format,
			'error trying parse your json request. Make sure your json structure is correct ');
        return;
    }
    jsonBody = request.body;

    if (!jsonBody || jsonBody.length < 2) {
        _.responseError(response, format, 'You must provide a valid json structure with game and character');
        return;
    }

    game = jsonBody[0];
    character = jsonBody[1];

    if (game.name === undefined) {
        _.responseError(response, format, 'game name is mandatory');
        return;
    }

    if (character.name === undefined) {
        _.responseError(response, format, 'character name is mandatory');
        return;
    }
    if (character.email === undefined) {
        _.responseError(response, format, 'character email is mandatory');
        return;
    }

    var sqlgame = 'IF  not EXISTS (select * from sys.tables where name = \'game\') ' +
	'CREATE TABLE [game] ( ' +
	'[id]               int         IDENTITY (1, 1) NOT NULL, ' +
	'[name]             NVARCHAR (150)  NOT NULL, ' +
	'[shortDescription] NVARCHAR (150) NULL, ' +
	'[longDescription]  NVARCHAR (MAX) NULL, ' +
	'[blobAccountName]  NVARCHAR (250) NULL, ' +
	'[blobAccountKey]   NVARCHAR (250) NULL, ' +
	'[blobContainerName] NVARCHAR (250) NULL, ' +
	'[sendgridSmtpServer] NVARCHAR(250) NULL, ' +
	'[sendgridPassword] NVARCHAR(250) NULL, ' +
	'[sendgridUsername] NVARCHAR(250) NULL, ' +
	'[createdDate]      DATETIME       DEFAULT (getdate()) NOT NULL, ' +
	'[updatedDate]      DATETIME       DEFAULT (getdate()) NULL, ' +
	'[levelsCount]      INT            NULL, ' +
	'[platform]         NVARCHAR (50)  NULL, ' +
	'[gameUrl]          NVARCHAR (250) NULL, ' +
	'[websiteUrl]       NVARCHAR (250) NULL, ' +
	'[playersCount]     INT            NULL, ' +
	'[status]           BIT            NULL, ' +
	'[iconFile]         NVARCHAR (250) NULL, ' +
	'[f]                 NVARCHAR(MAX)  NULL, ' +
	'PRIMARY KEY CLUSTERED ([id] ASC));';

    var sqlcharacter = 'IF  not EXISTS (select * from sys.tables where name = \'character\') ' +
	'CREATE TABLE [character] ( ' +
	'[id]                int         IDENTITY (1, 1) NOT NULL, ' +
	'[gameId]            int         NOT NULL, ' +
	'[name]              NVARCHAR (150) NOT NULL, ' +
	'[email]             NVARCHAR (250) NULL, ' +
	'[firstName]         NVARCHAR (250) NULL, ' +
	'[lastName]          NVARCHAR (250) NULL, ' +
	'[createdDate]       DATETIME       DEFAULT (getdate()) NOT NULL, ' +
	'[updatedDate]       DATETIME       DEFAULT (getdate()) NULL, ' +
	'[facebookId]        NVARCHAR (250) NULL, ' +
	'[twitterId]         NVARCHAR (250) NULL, ' +
	'[googleId]          NVARCHAR (250) NULL, ' +
	'[liveId]            NVARCHAR (250) NULL, ' +
	'[imageUrl]          NVARCHAR (MAX) NULL, ' +
	'[achievementPoints] INT            NULL, ' +
	'[kills]             INT            NULL, ' +
	'[lives]             INT            NULL, ' +
	'[rank]              INT            NULL, ' +
	'[timePlayed]        INT            NULL, ' +
	'[inventory]         NVARCHAR (MAX) NULL, ' +
	'[lastLevel]         INT            NULL, ' +
	'[currentLevel]      INT            NULL, ' +
	'[currentTime]       INT            NULL, ' +
	'[currentBonus]      INT            NULL, ' +
	'[currentKills]      INT            NULL, ' +
	'[currentGolds]      INT            NULL, ' +
	'[currentLives]      INT            NULL, ' +
	'[experience]        INT            NULL, ' +
	'[latitude]          DECIMAL(10,6)  NULL, ' +
	'[longitude]         DECIMAL(10,6)  NULL, ' +
	'[f]                 NVARCHAR(MAX)  NULL, ' +
	'PRIMARY KEY CLUSTERED ([id] ASC));'

    var sqlscore = 'IF  not EXISTS (select * from sys.tables where name = \'characterScore\') ' +
	'CREATE TABLE [characterScore] ( ' +
	'[id]          int   IDENTITY (1, 1) NOT NULL, ' +
	'[gameId]      int   NOT NULL, ' +
	'[characterId] INT      NOT NULL, ' +
	'[createdDate] DATETIME NOT NULL, ' +
	'[updatedDate] DATETIME NULL, ' +
	'[score]       INT      NULL, ' +
	'[f]                 NVARCHAR(MAX)  NULL, ' +
	'PRIMARY KEY CLUSTERED ([id] ASC));';

    var sqlreward = 'If not EXISTS (select * from sys.tables where name = \'reward\') ' +
	'CREATE TABLE [reward] ( ' +
	'[id]               int         IDENTITY (1, 1) NOT NULL, ' +
	'[gameId]           int         NOT NULL, ' +
	'[name]             NVARCHAR (150) NOT NULL, ' +
	'[points]           INT            NULL, ' +
	'[shortDescription] NVARCHAR (250) NULL, ' +
	'[longDescription]  NVARCHAR (MAX) NULL, ' +
	'[createdDate]      DATETIME       NOT NULL, ' +
	'[updatedDate]      DATETIME       NULL, ' +
	'[f]                 NVARCHAR(MAX)  NULL, ' +
	'PRIMARY KEY CLUSTERED ([id] ASC));';

    var sqlcharacterReward = 'If not EXISTS (select * from sys.tables where name = \'characterReward\') ' +
	'CREATE TABLE [characterReward] ( ' +
	'[id]            int   IDENTITY (1, 1) NOT NULL, ' +
	'[gameId]        int   NOT NULL, ' +
	'[characterId]   INT      NOT NULL, ' +
	'[rewardId]      INT      NOT NULL, ' +
	'[points]        INT      NULL, ' +
	'[createdDate]   DATETIME NOT NULL, ' +
	'[updatedDate]   DATETIME NULL, ' +
	'[obtentionDate] DATETIME NULL, ' +
	'[f]                 NVARCHAR(MAX)  NULL, ' +
	'PRIMARY KEY CLUSTERED ([id] ASC));';

    var sqlimage = 'If not EXISTS (select * from sys.tables where name = \'image\') ' +
	 'CREATE TABLE [image]( ' +
	 '[id]            int        IDENTITY (1, 1) NOT NULL, ' +
	 '[gameId]        int        NOT NULL, ' +
	 '[createdDate]   DATETIME      NOT NULL, ' +
	 '[updatedDate]   DATETIME      NULL, ' +
	 '[name]          NVARCHAR(150) NULL, ' +
	 '[imageFormat]   NVARCHAR(50) NULL, ' +
	 '[length]        FLOAT         NULL, ' +
	 '[imageBlob]     NVARCHAR(max) NULL, ' +
	 'PRIMARY KEY CLUSTERED ([id] ASC));';

    var sqlachievement = 'If not EXISTS (select * from sys.tables where name = \'achievement\') ' +
	 'CREATE TABLE [achievement]( ' +
	 '[id]                  int        IDENTITY (1, 1) NOT NULL, ' +
	 '[gameId]              int        NOT NULL, ' +
	 '[name]                NVARCHAR(150) NULL, ' +
	 '[shortDescription]    NVARCHAR (250) NULL, ' +
	 '[longDescription]     NVARCHAR (MAX) NULL, ' +
	 '[createdDate]         DATETIME      NOT NULL, ' +
	 '[updatedDate]         DATETIME      NULL, ' +
	 '[points]              INT      NULL, ' +
	 '[iconFile]            NVARCHAR (250) NULL, ' +
	 '[f]                 NVARCHAR(MAX)  NULL, ' +
	 'PRIMARY KEY CLUSTERED ([id] ASC));';


    var sqlIndexnamegame = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_game_name\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_game_name ON [game] (name) ';

    var sqlIndexnamecharacter = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_character_name\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_character_name ON [character] (gameId, name) ';

    var sqlIndexnamereward = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_reward_name_gameId\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_reward_name_gameId ON [reward] (gameId, name) ';

    var sqlIndexnameimage = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_image_name_gameId\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_image_name_gameId ON [image] (gameId, name) ';

    var sqlIndexcharacterScore = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_characterScore_gameId_characterId\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_characterScore_gameId_characterId ON [characterScore] (gameId, characterId) ';

    var sqlIndexcharacterReward = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_characterReward_gameId_characterId\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_characterReward_gameId_characterId ON [characterReward] (gameId, characterId) ';

    var sqlIndexnameachievement = 'If not EXISTS (SELECT * FROM sys.indexes where [type] = 2 and name = \'IX_achievement_name_gameId\') ' +
	 'CREATE UNIQUE NONCLUSTERED INDEX IX_achievement_name_gameId ON [achievement] (gameId, name) ';


    var sqlForeignKeycharactergame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_character_game\') ' +
	 'ALTER TABLE [character] ADD CONSTRAINT FK_character_game ' +
	 'FOREIGN KEY (gameId) REFERENCES [game] (id);';

    var sqlForeignKeycharacterRewardgame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_characterReward_game\') ' +
	 'ALTER TABLE [characterReward] ADD CONSTRAINT FK_characterReward_game ' +
	 'FOREIGN KEY (gameId) REFERENCES [game] (id);';

    var sqlForeignKeycharacterRewardcharacter = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_characterReward_character\') ' +
	 'ALTER TABLE [characterReward] ADD CONSTRAINT FK_characterReward_charactere ' +
	 'FOREIGN KEY (characterId) REFERENCES [character] (id);';

    var sqlForeignKeycharacterRewardreward = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_characterReward_reward\') ' +
	 'ALTER TABLE [characterReward] ADD CONSTRAINT FK_characterReward_reward ' +
	 'FOREIGN KEY (rewardId) REFERENCES [reward] (id);';

    var sqlForeignKeycharacterScoregame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_characterScore_game\') ' +
	 'ALTER TABLE [characterScore] ADD CONSTRAINT FK_characterScore_game ' +
	 'FOREIGN KEY (gameId) REFERENCES [game] (id);';

    var sqlForeignKeycharacterScorecharacter = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_characterScore_character\') ' +
		 'ALTER TABLE [characterScore] ADD CONSTRAINT FK_characterScore_character ' +
		 'FOREIGN KEY (characterId) REFERENCES [character] (id);';

    var sqlForeignKeyrewardgame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_reward_game\') ' +
	 'ALTER TABLE [reward] ADD CONSTRAINT FK_reward_game ' +
	 'FOREIGN KEY (gameId) REFERENCES [game] (id);';

    var sqlForeignKeyimagegame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_image_game\') ' +
	'ALTER TABLE [image] ADD CONSTRAINT FK_image_game ' +
	'FOREIGN KEY (gameId) REFERENCES [game] (id);';

    var sqlForeignKeyachievementgame = 'If not EXISTS (SELECT * FROM sys.foreign_keys WHERE name = \'FK_achievement_game\') ' +
	'ALTER TABLE [achievement] ADD CONSTRAINT FK_achievement_game ' +
	'FOREIGN KEY (gameId) REFERENCES [game] (id);';


    var mssql = request.service.mssql;

    var arr = [
		 { query: sqlgame, params: [] },
		 { query: sqlcharacter, params: [] },
		 { query: sqlreward, params: [] },
		 { query: sqlcharacterReward, params: [] },
		 { query: sqlscore, params: [] },
		 { query: sqlimage, params: [] },
		 { query: sqlachievement, params: [] },
		 { query: sqlForeignKeycharactergame, params: [] },
		 { query: sqlForeignKeycharacterRewardgame, params: [] },
		 { query: sqlForeignKeycharacterRewardcharacter, params: [] },
		 { query: sqlForeignKeycharacterRewardreward, params: [] },
		 { query: sqlForeignKeycharacterScoregame, params: [] },
		 { query: sqlForeignKeycharacterScorecharacter, params: [] },
		 { query: sqlForeignKeyrewardgame, params: [] },
		 { query: sqlForeignKeyimagegame, params: [] },
		 { query: sqlIndexnamegame, params: [] },
		 { query: sqlIndexnamecharacter, params: [] },
		 { query: sqlIndexnamereward, params: [] },
		 { query: sqlIndexnameimage, params: [] },
		 { query: sqlIndexcharacterScore, params: [] },
		 { query: sqlIndexcharacterReward, params: [] },
		 { query: sqlIndexnameachievement, params: [] },
		 { query: sqlForeignKeyachievementgame, params: [] }
    ];

    // iterate through all sql statements 
    db.iterateSql(request, arr, {
        success: function (r) { insertgame() },
        error: function (err) { _.responseError(response, format, 'error during iterate ' + err) }
    });

    var insertcharacter = function (character, game) {
        character.gameId = +game.id;
        // trying to get game if already exists
        mssql.query('select id from character where name = ? and gameId = ?', [character.name, character.gameId], {
            success: function (results) {
                character.id = results.length ? results[0].id : null;

                // Merge the character
                db.mergeTable(request, "character", character, {
                    success: function (c) {
                        if (!c || c.length == 0) {
                            _.responseError(response, format, 'Error trying to insert the character');
                            return;
                        }
                        character = c[0];
                        _.response(response, format, [game, character]);
                    },
                    error: function (err) {
                        _.responseError(response, format, err)
                    }
                });
            }
        });
    }

    var insertgame = function () {

        // trying to get game if already exists
        mssql.query('select id from game where name = ?', [game.name], {
            success: function (results) {
                game.id = results.length ? results[0].id : null;
                // merge the game
                db.mergeTable(request, 'game', game, {
                    success: function (r) {
                        if (!r || r.length == 0) {
                            _.responseError(response, format, 'Error trying to insert the game');
                            return;
                        }
                        game = r[0];

                        if (!_.isNullOrEmpty(game.blobAccountName) &&
                            !_.isNullOrEmpty(game.blobAccountKey) &&
                            !_.isNullOrEmpty(game.blobContainerName)) {

                            blob._setCors(game.blobContainerName, game.blobAccountName, game.blobAccountKey, function (err, res) {

                                insertcharacter(character, game);

                            });

                        } else {
                            insertcharacter(character, game);
                        }
                    },
                    error: function (err) {
                        _.responseError(response, format, err)
                    }
                });
            }
        });

    }




};

exports.createSampleDatas = function (request, response) {

    var format = request.params.format || 'json';
    var gameId = request.params.gameId;

    if (!gameId) {
        _.responseError(response, format, "gameId property is mandatory");
        return;
    }

    var characters = [];
    var rewards = [];
    var game = {};

    var insertimages = function (callback) {

        db.getRows(request, "image", { name: "Shirley.jpg", gameId: game.id }, {
            success: function (r) {
                if (r.length == 0) {
                    db.mergeTable(request, "image",
						{
						    gameId: game.id, imageFormat: "Jpeg",
						    length: 5600,
						    name: "Shirley.jpg",
						    imageBlob: "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",
						}, {
						    success: function (r) {
						        callback.success();
						    },
						    error: function (e) {
						        console.error(e);
						    }
						});
                } else {
                    callback.success();
                }

            }
        });
    }

    var insertrewards = function (callback) {

        db.getRows(request, "reward", { name: "Beginner", gameId: game.id }, {
            success: function (r) {
                if (r.length === 0) {
                    db.mergeTable(request, "reward", { gameId: game.id, name: "Beginner", shortDescription: "kills 1 ennemy", points: 1 }, {
                        success: function (c) {
                            rewards.push(c[0]);
                            db.mergeTable(request, "reward", { gameId: game.id, name: "Soldier", shortDescription: "kills 1 ennemy", points: 50 }, {
                                success: function (c) {
                                    rewards.push(c[0]);
                                    db.mergeTable(request, "reward", { gameId: game.id, name: "Expert", shortDescription: "kills 1OO ennemies", points: 100 }, {
                                        success: function (c) {
                                            rewards.push(c[0]);
                                            db.mergeTable(request, "reward", { gameId: game.id, name: "Killer", shortDescription: "kills 500 ennemies", points: 500 }, {
                                                success: function (c) {
                                                    rewards.push(c[0]);
                                                    db.mergeTable(request, "reward", { gameId: game.id, name: "God", shortDescription: "kills 1500 ennemies", points: 1500 }, {
                                                        success: function (c) {
                                                            rewards.push(c[0]);
                                                            db.mergeTable(request, "reward", { gameId: game.id, name: "Silver speed", shortDescription: "Finish 10 levels in less than 5 minutes" }, {
                                                                success: function (c) {
                                                                    rewards.push(c[0]);
                                                                    db.mergeTable(request, "reward", { gameId: game.id, name: "Gold speed", shortDescription: "Finish 10 levels in less than 4 minutes" }, {
                                                                        success: function (c) {
                                                                            rewards.push(c[0]);
                                                                            callback.success();
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    db.getRows(request, "reward", {
                        success: function (r) {
                            rewards = r;
                            callback.success();
                        }
                    });
                }
            }
        });
    }

    var insertcharacters = function (callback) {

        db.getRows(request, "character", { name: "Achum", gameId: game.id }, {
            success: function (r) {
                if (r.length === 0) {
                    db.mergeTable(request, "character", { gameId: game.id, name: "Achum", email: "Achum@live.com", firstName: "Nicolas", lastName: "Camard", kills: 0, lives: 10, rank: 10, timePlayed: 0 }, {
                        success: function (c) {
                            characters.push(c[0]);
                            db.mergeTable(request, "character", { gameId: game.id, name: "Jexyna", email: "Jexyna@live.com", firstName: "Jessie", lastName: "Na", kills: 10, lives: 8, rank: 9, timePlayed: 130 }, {
                                success: function (c) {
                                    characters.push(c[0]);
                                    db.mergeTable(request, "character", { gameId: game.id, name: "Imi", email: "Imi@live.com", firstName: "Imi", lastName: "Lord", kills: 20, lives: 10, rank: 8, timePlayed: 170 }, {
                                        success: function (c) {
                                            characters.push(c[0]);
                                            db.mergeTable(request, "character", { gameId: game.id, name: "Urnnhon", email: "Urnnhon@live.com", firstName: "Ugo", lastName: "Hon", kills: 0, lives: 10, rank: 7, timePlayed: 200 }, {
                                                success: function (c) {
                                                    characters.push(c[0]);
                                                    db.mergeTable(request, "character", { gameId: game.id, name: "Awary", email: "Awary@live.com", firstName: "Arwen", lastName: "Wary", kills: 100, lives: 5, rank: 6, timePlayed: 230 }, {
                                                        success: function (c) {
                                                            characters.push(c[0]);
                                                            db.mergeTable(request, "character", { gameId: game.id, name: "Sayem", email: "Sayem@live.com", firstName: "Sam", lastName: "Ayem", kills: 156, lives: 10, rank: 5, timePlayed: 340 }, {
                                                                success: function (c) {
                                                                    characters.push(c[0]);
                                                                    db.mergeTable(request, "character", { gameId: game.id, name: "Sasyto", email: "Sasyto@live.com", firstName: "Sarah", lastName: "Toryn", kills: 180, lives: 10, rank: 4, timePlayed: 1450 }, {
                                                                        success: function (c) {
                                                                            characters.push(c[0]);
                                                                            db.mergeTable(request, "character", { gameId: game.id, name: "Eldori", email: "Eldori@live.com", firstName: "Elise", lastName: "Dori", kills: 200, lives: 10, rank: 3, timePlayed: 2000 }, {
                                                                                success: function (c) {
                                                                                    characters.push(c[0]);
                                                                                    db.mergeTable(request, "character", { gameId: game.id, name: "Rothest", email: "Rothest@live.com", firstName: "Robert", lastName: "Green", kills: 307, lives: 2, rank: 2, timePlayed: 2300 }, {
                                                                                        success: function (c) {
                                                                                            characters.push(c[0]);
                                                                                            db.mergeTable(request, "character", { gameId: game.id, name: "Elionc", email: "Elionc@live.com", firstName: "John", lastName: "Doe", kills: 0, lives: 10, rank: 1, timePlayed: 0 }, {
                                                                                                success: function (c) {
                                                                                                    characters.push(c[0]);
                                                                                                    callback.success();
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    db.getRows(request, "character", {
                        success: function (r) {
                            characters = r;
                            callback.success();
                        }
                    });
                }
            }
        });
    }

    var insertscores = function (callback) {

        db.getRows(request, "characterScore", { characterId: characters[0].id, gameId: game.id }, {
            success: function (r) {
                if (r.length === 0) {
                    db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[0].id, score: 0 }, {
                        success: function (c) {
                            db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[1].id, score: 10 }, {
                                success: function (c) {
                                    db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[2].id, score: 20 }, {
                                        success: function (c) {
                                            db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[3].id, score: 30 }, {
                                                success: function (c) {
                                                    db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[4].id, score: 40 }, {
                                                        success: function (c) {
                                                            db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[5].id, score: 50 }, {
                                                                success: function (c) {
                                                                    db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[6].id, score: 60 }, {
                                                                        success: function (c) {
                                                                            db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[7].id, score: 70 }, {
                                                                                success: function (c) {
                                                                                    db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[8].id, score: 80 }, {
                                                                                        success: function (c) {
                                                                                            db.mergeTable(request, "characterScore", { gameId: game.id, characterId: characters[9].id, score: 90 }, {
                                                                                                success: function (c) {
                                                                                                    callback.success();
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    callback.success();
                }
            }
        });


    }

    var insertcharacterRewards = function (callback) {

        db.getRows(request, "characterReward", { characterId: characters[0].id, gameId: game.id, rewardId: rewards[0].id }, {
            success: function (r) {
                if (r.length === 0) {
                    for (var i = 0; i < 10; i++) {
                        db.mergeTable(request, "characterReward",
												{
												    gameId: game.id,
												    characterId: characters[i].id,
												    rewardId: rewards[0].id,
												    points: 1
												});
                    }
                    for (var j = 2; j < 10; j++) {
                        db.mergeTable(request, "characterReward",
												{
												    gameId: game.id,
												    characterId: characters[j].id,
												    rewardId: rewards[1].id,
												    points: 50
												});
                    }
                    for (var k = 5; k < 10; k++) {
                        db.mergeTable(request, "characterReward",
												{
												    gameId: game.id,
												    characterId: characters[k].id,
												    rewardId: rewards[2].id,
												    points: 100
												});
                    }
                    for (var l = 7; l < 10; l++) {
                        db.mergeTable(request, "characterReward",
												{
												    gameId: game.id,
												    characterId: characters[l].id,
												    rewardId: rewards[3].id,
												    points: 500
												});
                    }
                    for (var m = 8; m < 10; m++) {
                        db.mergeTable(request, "characterReward",
												{
												    gameId: game.id,
												    characterId: characters[m].id,
												    rewardId: rewards[4].id,
												    points: 500
												});
                    }
                }
                callback.success();
            }
        });

    }

    db.getRows(request, 'game', { id: gameId }, {
        success: function (games) {
            if (!games || games.length == 0) {
                _.responseError(response, format, "game " + gameId + " doesn't exist");
                return;
            }

            game = games[0];
            insertrewards({
                success: function () {
                    insertcharacters({
                        success: function () {
                            insertscores({
                                success: function () {
                                    insertcharacterRewards({
                                        success: function () {
                                            insertimages({
                                                success: function () {
                                                    _.response(response, format, 'end insert all sample datas.');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },
        error: function (e) {
            _.responseError(response, format, "game " + gameId + " doesn't exist");
        }

    });
}
