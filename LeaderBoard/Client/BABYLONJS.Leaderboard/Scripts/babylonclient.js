var BABYLON;
(function (BABYLON) {
    // master key : tiWpkSanvzZlnELRpmhytpqXLUmYfj74
    // smtp pass : c5fFb7NGjUKwOH6
    // smtp user : azure_905b65ac871de83aecc963733e80813b@azure.com
    // blob account : portalvhdsg8bc0x95lgq8p
    // blob key : ylmBsijxpT5iDmJd0fcH1y3hL0NB2SMOk5WA4E3kgV2Ed8kfCwqapfqkB/gpdXZej69DUFM/rj+oiDp8p+90pw==
    // blob container name : lightspeed
    (function (LeaderBoard) {
        var Client = (function () {
            function Client(applicationUrl, applicationKey, gameId, masterKey) {
                this.applicationUrl = applicationUrl;
                this.applicationKey = applicationKey;
                this.gameId = gameId;
                this.masterKey = masterKey;
                // Check url / key
                if (!applicationUrl || applicationUrl.length == 0)
                    throw new Error("applicationUrl required");
                if (!applicationKey || applicationKey.length == 0)
                    throw new Error("applicationKey required");

                try  {
                    if (!masterKey || masterKey == "") {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey);
                    } else {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey).withFilter(function (request, next, callback) {
                            request.headers['X-ZUMO-MASTER'] = masterKey;
                            next(request, callback);
                        });
                    }

                    this.getCurrentUser();
                } catch (e) {
                    throw new Error("can't initialize to Mobile Service");
                }
            }
            Client.prototype.getCurrentUser = function () {
                if (this.zumo.currentUser == null) {
                    this.zumo.currentUser = this._getSavedUser();
                }
                return this.zumo.currentUser;
            };

            Client.prototype._saveUser = function () {
                sessionStorage.setItem('babylonleaderboardclientuser', JSON.stringify(this.zumo.currentUser));
            };

            Client.prototype._deleteUser = function () {
                sessionStorage.clear();
            };

            Client.prototype._getSavedUser = function () {
                var uStr = sessionStorage.getItem('babylonleaderboardclientuser');

                if (uStr == null) {
                    return null;
                }

                return JSON.parse(uStr);
            };

            Client.prototype.logout = function () {
                this._deleteUser();
                this.zumo.logout();
            };

            Client.prototype.getLoginProvider = function () {
                var profile = {
                    source: null,
                    id: null
                };

                if (this.getCurrentUser() == null) {
                    return profile;
                }

                var id = this.getCurrentUser().userId;
                var sep = id.indexOf(':');
                profile.source = id.substring(0, sep).toLowerCase();
                profile.id = id.substring(sep + 1);

                return profile;
            };

            Client.prototype.loginWithProfile = function (source, done, error) {
                var _this = this;
                var profile = this.getLoginProvider();

                // already logged with correct provider
                if (profile && profile.source == source) {
                    return this.getCharacterFromProfile(profile.source, done, error);
                }

                this.zumo.login(source, null, false, function (err, user) {
                    if (err != null) {
                        error(err);
                        return;
                    }
                    _this._saveUser();

                    profile = _this.getLoginProvider();
                    return _this.getCharacterFromProfile(profile.source, done, error);
                });
            };

            Client.prototype.loginWithFacebook = function (done, error) {
                return this.loginWithProfile('facebook', done, error);
            };

            Client.prototype.loginWithMicrosoft = function (done, error) {
                return this.loginWithProfile('microsoftaccount', done, error);
            };

            Client.prototype.loginWithGoogle = function (done, error) {
                return this.loginWithProfile('google', done, error);
            };

            Client.prototype.uploadBlob = function (file, done, error) {
                this.getNewBlobUrl(file.name, function (r) {
                    if (r == null || r.length <= 0) {
                        return error('response from your blob storage is not valid');
                    }

                    // get the file url
                    var blobUrl = r[0].blobUrl;
                    var fileUrl = r[0].imageUrl;

                    // get a file reader
                    var reader = new FileReader();

                    // block size
                    var maxBlockSize = 1024 * 512;

                    // file pointer in blocks
                    var currentFilePointer = 0;

                    // remaining bytes
                    var totalBytesRemaining = 0;

                    // number of blocks
                    var numberOfBlocks = 1;

                    // blocks ids
                    var blockIds = new Array();

                    // uploads bytes
                    var bytesUploaded = 0;

                    // get file size
                    var fileSize = file.size;
                    totalBytesRemaining = fileSize;

                    // if size < 256ko
                    if (fileSize < maxBlockSize) {
                        maxBlockSize = fileSize;
                    }

                    // calculating the number of blocks needed
                    if (fileSize % maxBlockSize == 0) {
                        numberOfBlocks = fileSize / maxBlockSize;
                    } else {
                        numberOfBlocks = parseInt((fileSize / maxBlockSize).toString(), 10) + 1;
                    }

                    var _pad = function (number, length) {
                        var str = '' + number;
                        while (str.length < length) {
                            str = '0' + str;
                        }
                        return str;
                    };

                    var _commitBlockList = function () {
                        var comp = '&comp=blockList';
                        var uri = blobUrl + comp;

                        //var requestBody = '<?xml version="1.0" encoding="utf-8"?>\n<BlockList>\n';
                        var requestBody = '<?xml version="1.0" encoding="utf-8"?>';
                        requestBody += '<BlockList>';
                        for (var i = 0; i < blockIds.length; i++) {
                            requestBody += '<Latest>' + blockIds[i] + '</Latest>';
                        }
                        requestBody += '</BlockList>';

                        var xhr = new XMLHttpRequest();

                        xhr.open('PUT', uri);

                        xhr.setRequestHeader('x-ms-blob-content-type', 'application/octet-stream');
                        xhr.setRequestHeader('Content-Length', requestBody.length.toString());
                        xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                done([fileUrl]);
                            }
                        };

                        xhr.send(requestBody);
                    };

                    var _uploadFileInBlocks = function () {
                        if (totalBytesRemaining <= 0) {
                            if (numberOfBlocks > 1) {
                                return _commitBlockList();
                            } else {
                                return done([fileUrl]);
                            }
                        }

                        // get the sliced content
                        var fileContent = file.slice(currentFilePointer, currentFilePointer + maxBlockSize);

                        //get the blockId
                        var blockId = "" + _pad(blockIds.length, 6);

                        // push in
                        blockIds.push(btoa(blockId));

                        // read it
                        reader.readAsArrayBuffer(fileContent);

                        currentFilePointer += maxBlockSize;

                        totalBytesRemaining -= maxBlockSize;

                        if (totalBytesRemaining < maxBlockSize) {
                            maxBlockSize = totalBytesRemaining;
                        }
                    };

                    var _readerLoad = function (evt) {
                        var comp = '';
                        if (numberOfBlocks > 1)
                            comp += '&comp=block&blockid=' + blockIds[blockIds.length - 1];

                        var uri = blobUrl + comp;

                        var requestData = new Uint8Array(reader.result);

                        var xhr = new XMLHttpRequest();
                        xhr.open('PUT', uri);
                        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                        xhr.setRequestHeader('Content-Length', requestData.length.toString());

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                bytesUploaded += requestData.length;
                                var percentComplete = ((parseFloat(bytesUploaded.toString()) / parseFloat(file.size.toString())) * 100).toFixed(2);
                                _uploadFileInBlocks();
                            }
                        };

                        xhr.send(requestData);
                    };

                    reader.onload = function (evt) {
                        return _readerLoad(evt);
                    };

                    _uploadFileInBlocks();
                }, function (err) {
                    return error(err);
                });
            };

            Client.prototype.uploadImage = function (file, done, error) {
                if (!file) {
                    return error('file is mandatory');
                }

                if (file.size > (500 * 1024)) {
                    return error('only small images (size < 512ko) are valid when you want to upload directly in database\nFor large file use uploadBlob instead.');
                }

                var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];

                // get type and see if allowed
                var imgType = file.type.toLowerCase();

                if (allowedTypes.indexOf(imgType) >= 0) {
                    return error('only images (PNG, JPG, JPEG, GIF) are authorized.');
                }

                var reader = new FileReader();

                var req = 'image/' + this.gameId + '/set.json';
                var z = this.zumo;

                reader.onload = function (e) {
                    var data = reader.result;
                    data = data.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

                    var image = {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        data: data
                    };

                    Util.zumoInvoker(z, req, "post", image, done, error);
                };

                reader.readAsDataURL(file);
                //-------------------------------------------------------------------
                // we can't use this method if we want use the MobileService SDK ..
                //-------------------------------------------------------------------
                //var req = 'image/upload';
                //var xhr = new XMLHttpRequest();
                //xhr.open('POST', 'https://babylonjs.azure-mobile.net/api/image/upload');
                //xhr.upload.onprogress = function (e) {
                //    progress.value = e.loaded;
                //    progress.max = e.total;
                //};
                //xhr.onload = function () {
                //    console.log('Upload terminé !');
                //};
                //xhr.onreadystatechange = function () {
                //    if (xhr.readyState === 4) {
                //        done(xhr);
                //    }
                //};
                //var form = new FormData();
                //form.append('image', file);
                //xhr.send(form);
            };

            Client.prototype.getNewBlobUrl = function (blobName, done, error) {
                var req = 'image/' + this.gameId + '/getnewbloburl.json';

                Util.zumoInvoker(this.zumo, req, "post", { fileName: blobName }, done, error);
            };

            // Game
            Client.prototype.getGame = function (done, error) {
                var req = 'games/' + this.gameId + '/fetch.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getBlobAccount = function (done, error) {
                var req = 'games/' + this.gameId + '/get.json';

                var game = {
                    id: this.gameId,
                    fields: 'blobAccountName,blobAccountKey,blobContainerName'
                };

                Util.zumoInvoker(this.zumo, req, "post", game, done, error);
            };

            // Characters
            Client.prototype.addOrUpdateCharacter = function (character, done, error) {
                var req = 'characters/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", character, done, error);
            };

            Client.prototype.deleteCharacter = function (character, done, error) {
                var req = 'characters/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", character, done, error);
            };

            Client.prototype.getCharactersCount = function (done, error) {
                var req = 'characters/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getCharacter = function (name, fields, done, error) {
                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof fields === 'function')) {
                    error = done;
                    done = fields;
                    fields = null;
                }
                var req = "";
                if (fields == null) {
                    req = 'characters/' + this.gameId + '/get/' + name + '.json';
                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } else {
                    var params = fields;
                    params['where'] = {
                        gameId: this.gameId,
                        name: name
                    };

                    req = 'characters/' + this.gameId + '/get.json';
                    Util.zumoInvoker(this.zumo, req, "post", params, done, error);
                }
            };

            Client.prototype.getCharacters = function (params, done, error) {
                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = done;
                    done = params;
                    params = null;
                }
                var req = "";
                if (params == null) {
                    req = 'characters/' + this.gameId + '/all.json';
                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);
                } else {
                    req = 'characters/' + this.gameId + '/get.json';
                    Util.zumoInvoker(this.zumo, req, 'post', params, done, error);
                }
            };

            Client.prototype.getCharacterFromProfile = function (source, done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                if (source != 'facebook' && source != 'microsoftaccount' && source != 'google') {
                    error('This source is not authorized');
                    return;
                }

                var req = 'characters/' + this.gameId + '/me/' + source + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getFacebookProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/facebook.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getMicrosoftProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/microsoftaccount.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getGoogleProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/google.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            // Rewards
            Client.prototype.getReward = function (rewardName, done, error) {
                var req = 'rewards/' + this.gameId + '/get/' + rewardName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateReward = function (reward, done, error) {
                var req = 'rewards/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", reward, done, error);
            };

            Client.prototype.deleteReward = function (reward, done, error) {
                var req = 'rewards/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", reward, done, error);
            };

            Client.prototype.getRewards = function (params, done, error) {
                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = done;
                    done = params;
                    params = null;
                }
                var req = "";
                if (params == null) {
                    req = 'rewards/' + this.gameId + '/all.json';
                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);
                } else {
                    req = 'rewards/' + this.gameId + '/get.json';
                    Util.zumoInvoker(this.zumo, req, 'post', params, done, error);
                }
            };

            Client.prototype.getRewardsCount = function (done, error) {
                var req = 'rewards/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            // Achievements
            Client.prototype.getAchievement = function (achievementName, done, error) {
                var req = 'achievements/' + this.gameId + '/get/' + achievementName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateAchievement = function (achievement, done, error) {
                var req = 'achievements/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", achievement, done, error);
            };

            Client.prototype.deleteAchievement = function (achievement, done, error) {
                var req = 'achievements/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", achievement, done, error);
            };

            Client.prototype.getAchievements = function (params, done, error) {
                // Optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = done;
                    done = params;
                    params = null;
                }
                var req = "";
                if (params == null) {
                    req = 'achievements/' + this.gameId + '/all.json';
                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);
                } else {
                    req = 'achievements/' + this.gameId + '/get.json';
                    Util.zumoInvoker(this.zumo, req, 'post', params, done, error);
                }
            };

            Client.prototype.getAchievementsCount = function (done, error) {
                var req = 'achievements/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            // Character rewards
            Client.prototype.getCharacterRewards = function (characterName, done, error) {
                var req = 'characterrewards/' + this.gameId + '/get/' + characterName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateCharacterReward = function (cr, done, error) {
                var req = 'characterrewards/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            };

            Client.prototype.deleteCharacterReward = function (cr, done, error) {
                var req = 'characterrewards/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            };

            // Character Scores
            Client.prototype.getCharacterScores = function (characterName, done, error) {
                var req = 'characterscores/' + this.gameId + '/get/' + characterName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateCharacterScore = function (cr, done, error) {
                var req = 'characterscores/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            };

            Client.prototype.deleteCharacterScore = function (cr, done, error) {
                var req = 'characterscores/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            };

            // email
            Client.prototype.sendEmail = function (email, done, error) {
                if (!email.to)
                    throw new Error("to required");
                if (!email.from)
                    throw new Error("from required");
                if (!email.subject)
                    throw new Error("subject required");
                if (!email.text)
                    throw new Error("text required");

                var req = 'emails/' + this.gameId + '/sendemail.json';

                Util.zumoInvoker(this.zumo, req, 'post', email, done, error);
            };
            return Client;
        })();
        LeaderBoard.Client = Client;

        var Setup = (function () {
            function Setup(applicationUrl, applicationKey, masterKey) {
                this.applicationUrl = applicationUrl;
                this.applicationKey = applicationKey;
                this.masterKey = masterKey;
                // Check url / key
                if (!applicationUrl || applicationUrl.length == 0)
                    throw new Error("applicationUrl required");
                if (!applicationKey || applicationKey.length == 0)
                    throw new Error("applicationKey required");

                try  {
                    if (!masterKey || masterKey == "") {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey);
                    } else {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey).withFilter(function (request, next, callback) {
                            request.headers['X-ZUMO-MASTER'] = masterKey;
                            next(request, callback);
                        });
                    }
                } catch (e) {
                    throw new Error("can't initialize to Mobile Service");
                }
            }
            Setup.prototype.getCors = function (gameId, done, error) {
                try  {
                    var req = 'blob/' + gameId + '/getCors.json';

                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.setCors = function (gameId, done, error) {
                try  {
                    var req = 'blob/' + gameId + '/setCors.json';

                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.getTableCharacter = function (done, error) {
                try  {
                    this.zumo.getTable('character').read().done(function (chars) {
                        return done(chars);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableCharacter = function (instance, done, error) {
                try  {
                    this.zumo.getTable('character').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableCharacter = function (instance, done, error) {
                try  {
                    this.zumo.getTable('character').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableCharacter = function (instance, done, error) {
                try  {
                    this.zumo.getTable('character').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableAchievement = function (done, error) {
                try  {
                    this.zumo.getTable('achievement').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableAchievement = function (instance, done, error) {
                try  {
                    this.zumo.getTable('achievement').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableAchievement = function (instance, done, error) {
                try  {
                    this.zumo.getTable('achievement').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableAchievement = function (instance, done, error) {
                try  {
                    this.zumo.getTable('achievement').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableCharacterReward = function (done, error) {
                try  {
                    this.zumo.getTable('characterReward').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableCharacterReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterReward').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableCharacterReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterReward').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableCharacterReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterReward').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableCharacterScore = function (done, error) {
                try  {
                    this.zumo.getTable('characterScore').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableCharacterScore = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterScore').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableCharacterScore = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterScore').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableCharacterScore = function (instance, done, error) {
                try  {
                    this.zumo.getTable('characterScore').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableGame = function (done, error) {
                try  {
                    this.zumo.getTable('game').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableGame = function (instance, done, error) {
                try  {
                    this.zumo.getTable('game').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableGame = function (instance, done, error) {
                try  {
                    this.zumo.getTable('game').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableGame = function (instance, done, error) {
                try  {
                    this.zumo.getTable('game').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableImage = function (done, error) {
                try  {
                    this.zumo.getTable('image').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableImage = function (instance, done, error) {
                try  {
                    this.zumo.getTable('image').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableImage = function (instance, done, error) {
                try  {
                    this.zumo.getTable('image').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableImage = function (instance, done, error) {
                try  {
                    this.zumo.getTable('image').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.getTableReward = function (done, error) {
                try  {
                    this.zumo.getTable('reward').read().done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.insertTableReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('reward').insert(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.updateTableReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('reward').update(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };
            Setup.prototype.deleteTableReward = function (instance, done, error) {
                try  {
                    this.zumo.getTable('reward').del(instance).done(function (r) {
                        return done(r);
                    }, function (err) {
                        return error(err);
                    });
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.dropDatabase = function (done, error) {
                try  {
                    var req = 'setupGame/dropDatabase.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.getGame = function (gameId, done, error) {
                var req = 'games/' + gameId + '/fetch.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            };

            Setup.prototype.getGames = function (done, error) {
                try  {
                    var req = 'games/all.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.deleteGame = function (gameId, done, error) {
                try  {
                    if (!gameId)
                        throw new Error("gameId required");

                    var req = 'setupGame/deleteGame/' + gameId + '.json';

                    Util.zumoInvoker(this.zumo, req, "get", gameId, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.deleteGames = function (done, error) {
                try  {
                    var req = 'setupGame/deleteGames.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.createSampleDatas = function (gameId, done, error) {
                try  {
                    var req = 'setupGame/createSample/' + gameId + '.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.createGame = function (game, char, done, error) {
                var req = 'setupGame/createGame.json';

                try  {
                    if (Util.isNullOrEmpty(game.name))
                        throw new Error("The game name is required");

                    if (Util.isNullOrEmpty(char.name))
                        throw new Error("The character name is required");

                    if (Util.isNullOrEmpty(char.email))
                        throw new Error("The character email is required");

                    Util.zumoInvoker(this.zumo, req, "post", [game, char], done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.setBlobAccount = function (gameId, blobAccountName, blobAccountKey, blobContainerName, done, error) {
                var req = 'games/' + gameId + '/set.json';

                if (!gameId)
                    throw new Error("The game id is required");
                if (!blobAccountName)
                    throw new Error("The blobAccountName is required");
                if (!blobAccountKey)
                    throw new Error("The blobAccountKey is required");
                if (!blobContainerName)
                    throw new Error("The blobContainerName is required");

                var game = {
                    id: gameId,
                    blobAccountName: blobAccountName,
                    blobAccountKey: blobAccountKey,
                    blobContainerName: blobContainerName,
                    fields: 'id,blobAccountName,blobAccountKey,blobContainerName'
                };

                try  {
                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.setSendgridAccount = function (gameId, sendgridSmtpServer, sendgridUsername, sendgridPassword, done, error) {
                var req = 'setgame/' + gameId + '.json';

                if (!gameId)
                    throw new Error("The game id is required");
                if (!sendgridSmtpServer)
                    throw new Error("The sendgridSmtpServer is required");
                if (!sendgridUsername)
                    throw new Error("The sendgridUsername is required");
                if (!sendgridPassword)
                    throw new Error("The sendgridPassword is required");

                var game = {
                    id: gameId,
                    sendgridSmtpServer: sendgridSmtpServer,
                    sendgridUsername: sendgridUsername,
                    sendgridPassword: sendgridPassword,
                    fields: 'id,sendgridSmtpServer,sendgridUsername,sendgridPassword'
                };

                try  {
                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.updateGame = function (game, done, error) {
                var req = 'games/' + game.id + '/set.json';

                try  {
                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);
                } catch (e) {
                    error(e);
                }
            };
            return Setup;
        })();
        LeaderBoard.Setup = Setup;

        var Util = (function () {
            function Util() {
            }
            Util.zumoInvoker = function (zumo, url, method, options, done, error) {
                error = error != null ? error : function (e) {
                    return console.error(e);
                };
                done = done != null ? done : function (r) {
                };

                zumo.invokeApi(url, { method: method, parameters: null, body: options }).done(function (response) {
                    if (!response.result || response.result == 0) {
                        if (done != null)
                            done([]);
                        return;
                    }
                    if (response.error) {
                        if (error != null)
                            error(response);

                        return;
                    }
                    if (done != null)
                        done(response.result);
                }, function (e) {
                    if (error != null)
                        error(e.message);
                });
            };

            Util.directInvoker = function (options, done, error) {
                error = error != null ? error : function (e) {
                    return console.error(e);
                };
                done = done != null ? done : function (r) {
                };

                var headers = options.headers || {}, url = options.url.replace(/#.*$/, ""), httpMethod = options.type ? options.type.toUpperCase() : "GET", xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        done(xhr);
                    }
                };

                xhr.open(httpMethod, url);

                for (var key in headers) {
                    if (options.headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    }
                }

                xhr.send(options.data);
            };

            Util.isNull = function (value) {
                return value === null || value === undefined;
            };

            Util.isNullOrZero = function (value) {
                return value === null || value === undefined || value === 0 || value === '';
            };

            Util.isNullOrEmpty = function (value) {
                return Util.isNull(value) || value.length === 0;
            };

            Util.format = function (message) {
                if (!Util.isNullOrEmpty(message) && arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        var pattern = '{' + (i - 1) + '}';
                        while (message.indexOf(pattern) !== -1) {
                            message = message.replace(pattern, arguments[i]);
                        }
                    }
                }
                return message;
            };

            Util.has = function (value, key) {
                return !Util.isNull(value) && value.hasOwnProperty(key);
            };

            Util.hasProperty = function (object, properties) {
                for (var i = 0; i < properties.length; i++) {
                    if (Util.has(object, properties[i])) {
                        return true;
                    }
                }
                return false;
            };

            Util.isObject = function (value) {
                return Util.isNull(value) || (typeof value === 'object' && !Util.isDate(value));
            };

            Util.isString = function (value) {
                return Util.isNull(value) || (typeof value === 'string');
            };

            Util.isNumber = function (value) {
                return !Util.isNull(value) && (typeof value === 'number');
            };

            Util.isBool = function (value) {
                return !Util.isNull(value) && (typeof value == 'boolean');
            };

            Util.classOf = function (value) {
                return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
            };

            Util.isDate = function (value) {
                return !Util.isNull(value) && (Util.classOf(value) == 'date');
            };

            Util.pad = function (value, length, ch) {
                var text = value.toString();
                while (text.length < length) {
                    text = ch + text;
                }
                return text;
            };

            Util.trimEnd = function (text, ch) {
                var end = text.length - 1;
                while (end >= 0 && text[end] === ch) {
                    end--;
                }

                return end >= 0 ? text.substr(0, end + 1) : '';
            };

            Util.trimStart = function (text, ch) {
                var start = 0;
                while (start < text.length && text[start] === ch) {
                    start++;
                }

                return start < text.length ? text.substr(start, text.length - start) : '';
            };

            Util.compareCaseInsensitive = function (first, second) {
                if (Util.isString(first) && !Util.isNullOrEmpty(first)) {
                    first = first.toUpperCase();
                }

                if (Util.isString(first) && !Util.isNullOrEmpty(second)) {
                    second = second.toUpperCase();
                }

                return first === second;
            };

            Util.tryParseIsoDateString = function (text) {
                // Matches an ISO date and separates out the fractional part of the seconds
                // because IE < 10 has quirks parsing fractional seconds
                var isoDateRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d*))?Z$/;

                // Check against a lenient regex
                var matchedDate = isoDateRegex.exec(text);
                if (matchedDate) {
                    // IE9 only handles precisely 0 or 3 decimal places when parsing ISO dates,
                    // and IE8 doesn't parse them at all. Fortunately, all browsers can handle
                    // 'yyyy/mm/dd hh:MM:ss UTC' (without fractional seconds), so we can rewrite
                    // the date to that format, and the apply fractional seconds.
                    var dateWithoutFraction = matchedDate[1], fraction = matchedDate[2] || "0", milliseconds = Math.round(1000 * Number("0." + fraction));
                    dateWithoutFraction = dateWithoutFraction.replace(/\-/g, "/").replace("T", " "); // yyyy/mm/ddThh:mm:ss -> yyyy/mm/dd hh:mm:ss

                    // Try and parse - it will return NaN if invalid
                    var ticks = Date.parse(dateWithoutFraction + " UTC");
                    if (!isNaN(ticks)) {
                        return new Date(ticks + milliseconds);
                    }
                }

                // Doesn't look like a date
                return null;
            };
            return Util;
        })();
        LeaderBoard.Util = Util;

        var Game = (function () {
            function Game() {
            }
            return Game;
        })();
        LeaderBoard.Game = Game;

        var Reward = (function () {
            function Reward() {
            }
            return Reward;
        })();
        LeaderBoard.Reward = Reward;

        var CharacterScore = (function () {
            function CharacterScore() {
            }
            return CharacterScore;
        })();
        LeaderBoard.CharacterScore = CharacterScore;

        var CharacterReward = (function () {
            function CharacterReward() {
            }
            return CharacterReward;
        })();
        LeaderBoard.CharacterReward = CharacterReward;

        var Achievement = (function () {
            function Achievement() {
            }
            return Achievement;
        })();
        LeaderBoard.Achievement = Achievement;

        var Character = (function () {
            function Character() {
            }
            return Character;
        })();
        LeaderBoard.Character = Character;
    })(BABYLON.LeaderBoard || (BABYLON.LeaderBoard = {}));
    var LeaderBoard = BABYLON.LeaderBoard;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=babylonclient.js.map
