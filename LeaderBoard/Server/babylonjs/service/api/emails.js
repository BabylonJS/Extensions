var _ = require("./common");
var db = require("./database");
var SendGrid = require('sendgrid').SendGrid;

exports.register = function (api) {
    api.post('/:gameId/sendemail.:format', exports.sendEmail);

}


exports.sendEmail = function (request, response) {
    var gameId = request.params.gameId;
    var format = request.params.format || 'json';

    var options;
    if (!request.body) {
        _.responseError(response, format,
            'error trying parse your json request. Make sure your json structure is correct ');
        return;
    }
    options = request.body;

    var to = options.to.split(',');
    var from = options.from;
    var subject = options.subject;
    var text = options.text;

    db.getRows(request, 'Game', { id: gameId }, {
        success: function (results) {
            if (!results || results.length == 0) {
                _.responseError(response, format, 'This game is not valid');
            }

            var game = results[0];
            var sendgridSmtpServer = game.sendgridSmtpServer;
            var sendgridPassword = game.sendgridPassword;
            var sendgridUsername = game.sendgridUsername;
            
            if (!sendgridUsername || !sendgridPassword){
                 _.responseError(response, format, 'sendgrid account not configured');
                 return;
            }
            
            var sendgrid = new SendGrid(sendgridUsername, sendgridPassword);

            sendgrid.send({
                to: to,
                from: from,
                subject:subject,
                text: text
            }, function (success, message) {
                // If the email failed to send, log it as an error so we can investigate
                if (!success) {
                    _.responseError(response, format, message);
                    return;
                }
                _.response(response, format, message);

            });


        },
        error: function (err) {
            _.responseError(response, format, err);

        }
    });
};

