var _ = require("./common");

exports.getTable = function (tableName) {

    var tables = {}

    tables['character'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        name: { type: typeof (string), isNullable: false },
        email: { type: typeof (string), isNullable: true },
        firstName: { type: typeof (string), isNullable: true },
        lastName: { type: typeof (string), isNullable: true },
        createdDate: { type: typeof (Date), isNullable: false },
        updatedDate: { type: typeof (Date), isNullable: true },
        facebookId: { type: typeof (string), isNullable: true },
        twitterId: { type: typeof (string), isNullable: true },
        googleId: { type: typeof (string), isNullable: true },
        liveId: { type: typeof (string), isNullable: true },
        imageUrl: { type: typeof (string), isNullable: true },
        achievementPoints: { type: typeof (numeric), isNullable: true },
        kills: { type: typeof (numeric), isNullable: true },
        lives: { type: typeof (numeric), isNullable: true },
        rank: { type: typeof (numeric), isNullable: true },
        timePlayed: { type: typeof (numeric), isNullable: true },
        inventory: { type: typeof (string), isNullable: true },
        lastLevel: { type: typeof (numeric), isNullable: true },
        currentLevel: { type: typeof (numeric), isNullable: true },
        currentTime: { type: typeof (numeric), isNullable: true },
        currentBonus: { type: typeof (numeric), isNullable: true },
        currentKills: { type: typeof (numeric), isNullable: true },
        currentGolds: { type: typeof (numeric), isNullable: true },
        currentLives: { type: typeof (numeric), isNullable: true },
        experience: { type: typeof (numeric), isNullable: true },
        latitude: { type: typeof (numeric), isNullable: true },
        longitude: { type: typeof (numeric), isNullable: true },
        f: { type: typeof (string), isNullable: true }
    }

    tables['game'] = {
        id: { type: typeof (numeric), isNullable: false },
        name: { type: typeof (string), isNullable: false },
        shortDescription: { type: typeof (string), isNullable: true },
        longDescription: { type: typeof (string), isNullable: true },
        blobAccountName: { type: typeof (string), isNullable: true },
        blobAccountKey: { type: typeof (string), isNullable: true },
        blobContainerName: { type: typeof (string), isNullable: true },
        sendgridSmtpServer: { type: typeof (string), isNullable: true },
        sendgridPassword: { type: typeof (string), isNullable: true },
        sendgridUsername: { type: typeof (string), isNullable: true },
        createdDate: { type: typeof (Date), isNullable: true },
        updatedDate: { type: typeof (Date), isNullable: true },
        levelsCount: { type: typeof (numeric), isNullable: true },
        platform: { type: typeof (string), isNullable: true },
        gameUrl: { type: typeof (string), isNullable: true },
        websiteUrl: { type: typeof (string), isNullable: true },
        playersCount: { type: typeof (numeric), isNullable: true },
        status: { type: typeof (Boolean), isNullable: true },
        iconFile: { type: typeof (string), isNullable: true },
        f: { type: typeof (string), isNullable: true }

    }

    tables['achievement'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        name: { type: typeof (string), isNullable: false },
        shortDescription: { type: typeof (string), isNullable: true },
        longDescription: { type: typeof (string), isNullable: true },
        createdDate: { type: typeof (Date), isNullable: true },
        updatedDate: { type: typeof (Date), isNullable: true },
        points: { type: typeof (numeric), isNullable: true },
        iconFile: { type: typeof (string), isNullable: true },
        f: { type: typeof (string), isNullable: true }
    }

    tables['characterScore'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        characterId: { type: typeof (numeric), isNullable: false },
        createdDate: { type: typeof (Date), isNullable: false },
        updatedDate: { type: typeof (Date), isNullable: true },
        score: { type: typeof (numeric), isNullable: true },
        f: { type: typeof (string), isNullable: true }

    }

    tables['reward'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        name: { type: typeof (string), isNullable: false },
        points: { type: typeof (numeric), isNullable: true },
        shortDescription: { type: typeof (string), isNullable: true },
        longDescription: { type: typeof (string), isNullable: true },
        createdDate: { type: typeof (Date), isNullable: false },
        updatedDate: { type: typeof (Date), isNullable: true },
        f: { type: typeof (string), isNullable: true }
    }

    tables['characterReward'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        rewardId: { type: typeof (numeric), isNullable: false },
        characterId: { type: typeof (numeric), isNullable: false },
        points: { type: typeof (numeric), isNullable: true },
        createdDate: { type: typeof (Date), isNullable: false },
        updatedDate: { type: typeof (Date), isNullable: true },
        obtentionDate: { type: typeof (Date), isNullable: true },
        f: { type: typeof (string), isNullable: true }
    }
    tables['image'] = {
        id: { type: typeof (numeric), isNullable: false },
        gameId: { type: typeof (numeric), isNullable: false },
        createdDate: { type: typeof (Date), isNullable: false },
        updatedDate: { type: typeof (Date), isNullable: true },
        name: { type: typeof (string), isNullable: true },
        imageFormat: { type: typeof (string), isNullable: true},
        length: { type: typeof (numeric), isNullable: true},
        imageBlob: { type: typeof (string), isNullable: true },
    }

    return tables[tableName];
}

exports.parseToDb = function (tableName, instance) {

    var columns = exports.getTable(tableName);

    var f = {};
    if (!_.isNull(instance.f))
        f = instance.f;

    // get all columns from current instance
    for (var prop in instance) {

        // through all propreties from table struct
        // if prop (aka columnName) already exist, continue
        if (columns.hasOwnProperty(prop)) {
            continue;
        }

        // prop doesn't exist in my original table struct, so it's an f prop
        f[prop] = instance[prop];

        // delete from current instance since this prop doesnt exist as a column
        delete instance[prop];

        instance.f = f;

    }

    return instance;

}


exports.parseFromDb = function (tableName, instance, optionalFields) {

    var columns = exports.getTable(tableName);

    // if my instance from my database contains the f JSON structure
    if (instance.hasOwnProperty('f') && instance.f != null) {

        // parse the f field
        var fieldsAdded = JSON.parse(instance.f);

        // for each property in my new object
        for (var propertyName in fieldsAdded) {
            // get the name and value
            var propertyValue = fieldsAdded[propertyName];

            if (!_.isNullOrEmpty(optionalFields) && optionalFields.indexOf(propertyName) >= 0) {
                // we have some fields to filter
                instance[propertyName] = propertyValue;
            } else if (_.isNullOrEmpty(optionalFields)) {
                // we have an empty optionalFields, that means all
                instance[propertyName] = propertyValue;
            }
        }
    }

    if (instance.hasOwnProperty('f'))
        delete instance['f'];

    return instance;

}