var fs = require('fs');
var _ = require("./common");
var db = require("./database");
var azure = require('azure');
var qs = require('querystring');
var url = require('url');

 
exports.register = function (api) {
    api.get('/:gameId/get/:imageName', exports.getImage);
    api.post('/:gameId/set.:format', exports.uploadImage);
    api.post('/:gameId/getnewbloburl.:format', exports.getUploadUrl);
}
 
exports.getImage = function (request, response) {
 
  
    var imageName = request.params.imageName;
    var tableImage = request.service.tables.getTable('Image');
    var gameId = request.params.gameId; 
    var format = request.params.format || 'json';
 
    tableImage
        .where({name:imageName, gameId:gameId})
        .read({
            success: function (results) {
                
                if (!results || results.length == 0){
                    _.responseError(response, format, 'Image doesn\'t exist');
                }
                
                var img = results[0];
 
                
                var format = img.imageFormat;
                
                if (img.imageFormat.indexOf('image/') == -1){
                    format = 'image/' + format;
                }
             
                var decodedImage = new Buffer(img.imageBlob, 'base64');
                var contentType = img.imageFormat;
 
                response.set('Content-Type', format);
                response.send(decodedImage);
            },
            error: function (err) {
                _.responseError(response, format, err);
            }
        });
}
 
exports.getUploadUrl = function (request, response) {

    var gameId = request.params.gameId;
    var format = request.params.format || 'json';

    if (_.isNull(request.body)) {
        _.responseError(response, format,
            'error trying parse your json request. Make sure your json structure is correct ');
        return;
    }
  
    if (_.isNull(gameId)) {
        _.responseError(response, format, "gameId property is mandatory");
        return;
    }

    var options = request.body;

    db.getRows(request, 'game', { id: gameId }, {
        success: function (results) {
            var game = results[0];

            if (_.isNullOrEmpty(game.blobContainerName) || 
                _.isNullOrEmpty(game.blobAccountName) || 
                _.isNullOrEmpty(game.blobAccountKey)) {

                return _.responseError(response, format, 'blob containers parameters are empty');
            }
            var containerName = game.blobContainerName || 'assets';
            var accountName = game.blobAccountName;
            var accountKey = game.blobAccountKey;

            var relativeFilePath = '/' + containerName + '/' + options.fileName;

            var host = accountName + '.blob.core.windows.net';
            
            // Create the container if it does not exist 
            // Use public read access for the blobs, and the SAS to upload         
            var blobService = azure.createBlobService(accountName, accountKey, host);
          
            // Create container if not exist
            blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, function (error) {
                if (!error) {
                    // Container exists now define a policy for write access 
                    // that starts immediately and expires in 5 mins 
                    var sharedAccessPolicy = createAccessPolicy();

                    var sasQueryUrl = blobService.generateSharedAccessSignature(containerName, options.fileName, sharedAccessPolicy);

                    var blobUrl = blobService.getUrl(containerName, options.fileName, sasQueryUrl);

                    var imageUrlWihQuery = url.parse(blobUrl);
                    var imageUrlWithoutQuery = {
                        hostname: imageUrlWihQuery.hostname,
                        protocol: imageUrlWihQuery.protocol,
                        pathname: imageUrlWihQuery.pathname,

                    }

                    // Create the blobs urls with the SAS 
                    _.response(response, format, { blobUrl: blobUrl, imageUrl: url.format(imageUrlWithoutQuery) });
                }
                else {
                    _.responseError(response, format, 'container creation failed');
                }

            });


        },
        error: function (err) {
            _.responseError(response, format, err);
        }
    });

}

exports.uploadImage = function (request, response) {
 
    if (!request.body) {
        _.responseError(response, format, "Erreur, no data available on request.body");
        return;
    }
    var fields;

    var format = request.params.format || 'json';
    var responder = new _.responder(response, format);
    var gameId = request.params.gameId;

    var image = request.body;
 
    var img = {
        name : image.name,
        imageBlob : image.data,
        imageFormat : image.type,
        length : image.size,
        gameId : gameId
    };
   
    db.getRows(request, 'image', { name: img.name, gameId: img.gameId }, {
        success: function (r) {
            if (r != null && r.length > 0)
                img.id = r[0].id;

            db.mergeTable(request, "image", img, {
                success: function (result) {

                    if (!result || result.length == 0) {
                        _.responseError(response, format, "Insertion failed.");
                        return;
                    }

                    db.getRows(request, 'image', { id: result[0].id }, 'name',
                        {
                            success: function (images) {
                                if (!images || images.length == 0) {
                                    _.responseError(response, format, 'Insertion failed');
                                }

                                var i = images[0];
                                var url = '/api/image/' + gameId + '/get/' + i.name;

                                _.response(response, format, url);
                            },
                            error: function (err) {
                                _.responseError(response, format, err)
                            }
                        });
                },
                error: function (err) {
                    _.responseError(response, format, err)
                }
            });

        },
        error: function (err) {
            _.responseError(response, format, err)
        }
    });
      

   
   
  //  tableImage.insert(img, {
    //    success: function () {
//
  //          var decodedImage = new Buffer(image.data, 'base64');
    //        response.set('Content-Type', request.files.image.type);
      //      response.send(decodedImage);
//
  //      },
    //    error: function (err) {
      //      response.send('error inserting image : ' + err);
       // }
   // });
 
}

exports.uploadImage2 = function (request, response) {
 
    if (!request.body) {
        console.log("Erreur, no data available on request.body");
        return;
    }
 
     var options = request.body;
     var imageId = request.body.imageId;
 
    console.log("image filename : " + request.files.image.name);
    console.log("image filepath : " + request.files.image.path);
    console.log("image size : " + request.files.image.size);
    console.log("image type : " + request.files.image.type);
    console.log("image lastModifiedate : " + request.files.image.lastModifiedate);
    console.log("image _writeStream.encoding  : " + request.files.image._writeStream.encoding);
 
    fs.readFile(request.files.image.path, 'base64', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
 
        var tableImage = request.service.tables.getTable('Image');
 
        tableImage
            .where({ id: imageId })
            .read({
                success: function (results) {
                    var img = results[0];
 
                    img.id = imageId;
                    img.name = request.files.image.name;
                    img.imageblob = data;
                    img.imageformat = request.files.image.type;
                    img.length = request.files.image.size;
                   
                    tableImage.update(img, {
                        success: function () {
 
                            var decodedImage = new Buffer(data, 'base64');
                            response.set('Content-Type', request.files.image.type);
                            response.send(decodedImage);
 
                        },
                        error: function (err) {
                            response.send('error DB update : ' + err);
                        }
                    });
 
                },
                error: function (err) {
                    response.send('error DB read : ' + err);
                }
            });
    });
 
}


function createResourceURLWithSAS(accountName, accountKey, blobRelativePath, sharedAccessPolicy, host) {
    // Generate the SAS for your BLOB 
    var sasQueryString = getSAS(accountName,
                        accountKey,
                        blobRelativePath,
                        azure.Constants.BlobConstants.ResourceTypes.BLOB,
                        sharedAccessPolicy);
  
    // Full path for resource with SAS 
    return 'https://' + host + blobRelativePath + '?' + sasQueryString;
}

function createResourceName(containerName, blobName) {
    

    // return URI encoded resource name
    if (blobName) {
        return containerName + '/' + blobName;
    }
    else {
        return containerName;
    }
}

function createAccessPolicy() {
    return {
        AccessPolicy: {
            Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.WRITE,
            // Start: use for start time in future, beware of server time skew  
            Expiry: formatDate(new Date(new Date().getTime() + 5 * 60 * 1000)) // 5 minutes from now 
        }
    };
}

function getSAS(accountName, accountKey, path, resourceType, sharedAccessPolicy) {
    return qs.encode(new azure.SharedAccessSignature(accountName, accountKey)
                                    .generateSignedQueryString(path, {}, resourceType, sharedAccessPolicy));
}

function formatDate(date) {
    var raw = date.toJSON();
    // Blob service does not like milliseconds on the end of the time so strip 
    return raw.substr(0, raw.lastIndexOf('.')) + 'Z';
}