//var data2xml = require("../shared/node_modules/data2xml");
//var convert  = data2xml();

exports.responder = function(response, format){

   this.success = function(results){
       exports.response(response, format, results);
   };
   this.error = function(err, format){
        exports.responseError(response, format, err);
   }
};    

// Send error with a good json format
exports.responseError = function(response, format, err)
{


    console.error('error occured : ' + err);

    if (format === "xml"){
      //  response.send(400, convert("error", err));
        response.send(400, err);
    } else {
        response.send(400, err);
    }

};

exports.response = function (response, format, msg) {

    // response is always an array, to be consistent
    var r = [];

    if (msg instanceof Array) {
        r = msg;
    } else {
        // if my msg is just a number or a string, contruct a simple object {code, result}
        if (!(msg instanceof Object)) {
            r.push({ code: 200, result: msg });
        } else {
            r.push(msg);
        }

    }
    console.log(r);

    if (format === "xml") {
     //   response.send(200, convert("d", r));
        response.send(200, r);
    } else {
        response.send(200, r);
    }

};

exports.getIdentities = function(user, callback){
    callback = callback || function () {
       this.success=function(r){};
       this.error=function(err){console.error(err)}
    };

    var identities = user.getIdentities();
    var url = '';
    if (identities.google) {
        var googleAccessToken = identities.google.accessToken;
        url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + googleAccessToken;
    } else if (identities.facebook) {
        var fbAccessToken = identities.facebook.accessToken;
        url = 'https://graph.facebook.com/me?access_token=' + fbAccessToken;
    } else if (identities.microsoft) {
        var liveAccessToken = identities.microsoft.accessToken;
        url = 'https://apis.live.net/v5.0/me/?method=GET&access_token=' + liveAccessToken;
    } else if (identities.twitter) {
        var userId = user.userId;
        var twitterId = userId.substring(userId.indexOf(':') + 1);
        url = 'https://api.twitter.com/users/' + twitterId;
    }
    if (url === ''){
        callback.error('no identities supplied');
        return;
    }
    
    sendRequest(url, {
        success:function(userData){
           callback.success(userData);
        },
        error:function(err){
            callback.error(err);
        }
    });
}

var sendRequest = function(url, callback){
    callback = callback || function () {
       this.success=function(r){};
       this.error=function(err){console.error(err)}
    };

    var req = require('request');
    
    var requestCallback = function (err, resp, body) {
        if (err || resp.statusCode !== 200) {
            console.error('Error sending data to the provider: ', err);
            callback.error('Error sending data to the provider: ', err);
        } else {
            try {
                var userData = JSON.parse(body);
                callback.success(userData);
            } catch (ex) {
                console.error('Error parsing response from the provider API: ', ex);
                callback.error('Error parsing response from the provider API: ', err);
            }
        }
    }
    var reqOptions = {
        uri: url,
        headers: { Accept: "application/json" }
    };
    
    req(reqOptions, requestCallback);
     
}

exports.isNull = function (value) {
    /// <summary>
    /// Gets a value indicating whether the provided value is null (or
    /// undefined).
    /// </summary>
    /// <param name="value" type="Object" mayBeNull="true">
    /// The value to check.
    /// </param>
    /// <returns type="Boolean">
    /// A value indicating whether the provided value is null (or undefined).
    /// </returns>

    return value === null || value === undefined;
};

exports.isNullOrZero = function (value) {
    /// <summary>
    /// Gets a value indicating whether the provided value is null (or
    /// undefined) or zero / empty string
    /// </summary>
    /// <param name="value" type="Object" mayBeNull="true">
    /// The value to check.
    /// </param>
    /// <returns type="Boolean">
    /// A value indicating whether the provided value is null (or undefined) or zero or empty string.
    /// </returns>

    return value === null || value === undefined || value === 0 || value === '';
};

exports.isNullOrEmpty = function (value) {
    /// <summary>
    /// Gets a value indicating whether the provided value is null (or
    /// undefined) or empty.
    /// </summary>
    /// <param name="value" type="Object" mayBeNull="true">
    /// The value to check.
    /// </param>
    /// <returns type="Boolean">
    /// A value inHdicating whether the provided value is null (or undefined).
    /// </returns>

    return exports.isNull(value) || value.length === 0;
};

exports.format = function (message) {
    /// <summary>
    /// Format a string by replacing all of its numbered arguments with
    /// parameters to the method. Arguments are of the form {0}, {1}, ..., like
    /// in .NET.
    /// </summary>
    /// <param name="message" type="string" mayBeNull="false">
    /// The format string for the message.
    /// </param>
    /// <param name="arguments" type="array" optional="true">
    /// A variable number of arguments that can be used to format the message.
    /// </param>
    /// <returns type="string">The formatted string.</returns>

    // Note: There are several flaws in this implementation that we are
    // ignoring for simplicity as it's only used internally.  Examples that
    // could be handled better include:
    //    format('{0} {1}', 'arg') => 'arg {1}'
    //    format('{0} {1}', '{1}', 'abc') => 'abc abc'
    //    format('{0}', '{0}') => <stops responding>

    if (!exports.isNullOrEmpty(message) && arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            var pattern = '{' + (i - 1) + '}';
            while (message.indexOf(pattern) !== -1) {
                message = message.replace(pattern, arguments[i]);
            }
        }
    }

    return message;
};

exports.has = function (value, key) {
    /// <summary>
    /// Determine if an object defines a given property.
    /// </summary>
    /// <param name="value" type="Object">The object to check.</param>
    /// <param name="key" type="String">
    /// The name of the property to check for.
    /// </param>
    /// <returns type="Boolean">
    /// A value indicating whether the object defines the property.
    /// </returns>

    return !exports.isNull(value) && value.hasOwnProperty(key);
};

exports.hasProperty = function (object, properties) {
    /// <summary>
    /// Determines if an object has any of the passed in properties
    /// </summary>
    /// <returns type="boolean">True if it contains any one of the properties
    /// </returns>
    for (var i = 0; i < properties.length; i++) {
        if (exports.has(object, properties[i])) {
            return true;
        }
    }
    return false;
};


exports.isObject = function (value) {
    /// <summary>
    /// Determine if a value is an object.
    /// </summary>
    /// <param name="value" type="Object">The value to check.</param>
    /// <returns type="boolean">
    /// True if the value is an object (or null), false othwerise.
    /// </returns>

    return exports.isNull(value) || (typeof value === 'object');
};


exports.isString = function (value) {
    /// <summary>
    /// Determine if a value is a string.
    /// </summary>
    /// <param name="value" type="Object">The value to check.</param>
    /// <returns type="boolean">
    /// True if the value is a string (or null), false othwerise.
    /// </returns>

    return exports.isNull(value) || (typeof value === 'string');
};

exports.isNumber = function (value) {
    /// <summary>
    /// Determine if a value is a number.
    /// </summary>
    /// <param name="value" type="Object">The value to check.</param>
    /// <returns type="boolean">
    /// True if the value is a number, false othwerise.
    /// </returns>

    return !exports.isNull(value) && (typeof value === 'number');
};

exports.isBool = function (value) {
    /// <summary>
    /// Determine if a value is a boolean.
    /// </summary>
    /// <param name="value" type="Object">The value to check.</param>
    /// <returns type="boolean">
    /// True if the value is a boolean, false othwerise.
    /// </returns>
    return !exports.isNull(value) && (typeof value == 'boolean');
};

