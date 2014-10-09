var BABYLON;
(function (BABYLON) {
    // master key : tiWpkSanvzZlnELRpmhytpqXLUmYfj74
    // smtp pass : c5fFb7NGjUKwOH6
    // smtp user : azure_905b65ac871de83aecc963733e80813b@azure.com
    (function (LeaderBoard) {
        var invoker = function (zumo, url, method, options, done, error) {
            error = error != null ? error : function (e) {
                return console.error(e);
            };
            done = done != null ? done : function (r) {
            };

            zumo.invokeApi(url, { method: method, parameters: null, body: options }).done(function (response) {
                if (!response.result || response.result == 0) {
                    done([]);
                    return;
                }
                if (response.error) {
                    error(response);
                    return;
                }

                done(response.result);
            }, function (e) {
                error(e.message);
            });
        };

        var reader = new FileReader();

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

            Client.prototype._getSavedUser = function () {
                var uStr = sessionStorage.getItem('babylonleaderboardclientuser');

                if (uStr == null) {
                    return null;
                }

                return JSON.parse(uStr);
            };

            Client.prototype._getLoginProvider = function () {
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

            Client.prototype._loginWithProfile = function (source, done, error) {
                var _this = this;
                var profile = this._getLoginProvider();

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

                    return _this.getCharacterFromProfile(profile.source, done, error);
                });
            };

            Client.prototype.loginWithFacebook = function (done, error) {
                return this._loginWithProfile('facebook', done, error);
            };

            Client.prototype.loginWithMicrosoft = function (done, error) {
                return this._loginWithProfile('microsoft', done, error);
            };

            Client.prototype.loginWithGoogle = function (done, error) {
                return this._loginWithProfile('google', done, error);
            };

            // Image
            Client.prototype.getBase64Image = function (imgElem) {
                // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
                var canvas = document.createElement("canvas");
                canvas.width = imgElem.clientWidth;
                canvas.height = imgElem.clientHeight;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(imgElem, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            };

            Client.prototype._readeronload = function (e, callback) {
                var data = reader.result;
                data = data.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

                callback(data);
            };

            Client.prototype.uploadImage = function (file, done, error) {
                var _this = this;
                if (!file) {
                    error('file is mandatory');
                }

                var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

                // get type and see if allowed
                var imgType = file.type.toLowerCase();

                if (allowedTypes.indexOf(imgType) != -1) {
                    var req = 'image/' + this.gameId + '/set.json';
                    var z = this.zumo;

                    reader.onload = function (e) {
                        return _this._readeronload(e, function (data) {
                            var image = {
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                data: data
                            };

                            invoker(z, req, "post", image, done, error);
                        });
                    };

                    reader.readAsDataURL(file);
                } else {
                    error('this type is not allowed for an image');
                }
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

            // Game
            Client.prototype.getGame = function (done, error) {
                var req = 'getGame/' + this.gameId + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getBlobAccount = function (done, error) {
                var req = 'getGame/' + this.gameId + '.json';

                var game = {
                    id: this.gameId,
                    fields: 'blobAccountName,blobAccountKey,blobContainerName'
                };

                invoker(this.zumo, req, "post", game, done, error);
            };

            // Characters
            Client.prototype.getCharacter = function (characterName, done, error) {
                var req = 'characters/' + this.gameId + '/get/' + characterName + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateCharacter = function (character, done, error) {
                var req = 'characters/' + this.gameId + '/set.json';

                invoker(this.zumo, req, "post", character, done, error);
            };

            Client.prototype.deleteCharacter = function (character, done, error) {
                var req = 'characters/' + this.gameId + '/del.json';

                invoker(this.zumo, req, "post", character, done, error);
            };

            Client.prototype.getCharacters = function (done, error) {
                var req = 'characters/' + this.gameId + '/all.json';

                invoker(this.zumo, req, 'get', null, done, error);
            };

            Client.prototype.getCharactersCount = function (done, error) {
                var req = 'characters/' + this.gameId + '/count.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getCharactersWithOptions = function (params, done, error) {
                var req = 'characters/' + this.gameId + '/get.json';

                invoker(this.zumo, req, 'post', params, done, error);
            };

            Client.prototype.getCharacterFromProfile = function (source, done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                if (source != 'facebook' || source != 'microsoft' || source != 'google') {
                    error('This source is not authorized');
                    return;
                }

                var req = 'characters/' + this.gameId + '/me/' + source + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getFacebookProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/facebook.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getMicrosoftProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/microsoft.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getGoogleProfile = function (done, error) {
                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/google.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            // Rewards
            Client.prototype.getReward = function (rewardName, done, error) {
                var req = 'rewards/' + this.gameId + '/get/' + rewardName + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateReward = function (reward, done, error) {
                var req = 'rewards/' + this.gameId + '/set.json';

                invoker(this.zumo, req, "post", reward, done, error);
            };

            Client.prototype.deleteReward = function (reward, done, error) {
                var req = 'rewards/' + this.gameId + '/del.json';

                invoker(this.zumo, req, "post", reward, done, error);
            };

            Client.prototype.getRewards = function (done, error) {
                var req = 'rewards/' + this.gameId + '/all.json';

                invoker(this.zumo, req, 'get', null, done, error);
            };

            Client.prototype.getRewardsCount = function (done, error) {
                var req = 'rewards/' + this.gameId + '/count.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getRewardsWithOptions = function (params, done, error) {
                var req = 'rewards/' + this.gameId + '/get.json';

                invoker(this.zumo, req, 'post', params, done, error);
            };

            // Achievements
            Client.prototype.getAchievement = function (achievementName, done, error) {
                var req = 'achievements/' + this.gameId + '/get/' + achievementName + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateAchievement = function (achievement, done, error) {
                var req = 'achievements/' + this.gameId + '/set.json';

                invoker(this.zumo, req, "post", achievement, done, error);
            };

            Client.prototype.deleteAchievement = function (achievement, done, error) {
                var req = 'achievements/' + this.gameId + '/del.json';

                invoker(this.zumo, req, "post", achievement, done, error);
            };

            Client.prototype.getAchievements = function (done, error) {
                var req = 'achievements/' + this.gameId + '/all.json';

                invoker(this.zumo, req, 'get', null, done, error);
            };

            Client.prototype.getAchievementsCount = function (done, error) {
                var req = 'achievements/' + this.gameId + '/count.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.getAchievementsWithOptions = function (params, done, error) {
                var req = 'achievements/' + this.gameId + '/get.json';

                invoker(this.zumo, req, 'post', params, done, error);
            };

            // Character rewards
            Client.prototype.getCharacterRewards = function (characterName, done, error) {
                var req = 'characterrewards/' + this.gameId + '/get/' + characterName + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateCharacterReward = function (cr, done, error) {
                var req = 'characterrewards/' + this.gameId + '/set.json';

                invoker(this.zumo, req, "post", cr, done, error);
            };
            Client.prototype.deleteCharacterReward = function (cr, done, error) {
                var req = 'characterrewards/' + this.gameId + '/del.json';

                invoker(this.zumo, req, "post", cr, done, error);
            };

            // Character Scores
            Client.prototype.getCharacterScores = function (characterName, done, error) {
                var req = 'characterscores/' + this.gameId + '/get/' + characterName + '.json';

                invoker(this.zumo, req, "get", null, done, error);
            };

            Client.prototype.addOrUpdateCharacterScore = function (cr, done, error) {
                var req = 'characterscores/' + this.gameId + '/set.json';

                invoker(this.zumo, req, "post", cr, done, error);
            };
            Client.prototype.deleteCharacterScore = function (cr, done, error) {
                var req = 'characterscores/' + this.gameId + '/del.json';

                invoker(this.zumo, req, "post", cr, done, error);
            };

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

                invoker(this.zumo, req, 'post', email, done, error);
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

                    invoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.getGames = function (done, error) {
                try  {
                    var req = 'setupGame/getgames.json';

                    invoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.deleteGame = function (gameId, done, error) {
                try  {
                    if (!gameId)
                        throw new Error("gameId required");

                    var req = 'setupGame/deleteGame/' + gameId + '.json';

                    invoker(this.zumo, req, "get", gameId, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.deleteGames = function (done, error) {
                try  {
                    var req = 'setupGame/deleteGames.json';

                    invoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.createSampleDatas = function (gameId, done, error) {
                try  {
                    var req = 'setupGame/createSample/' + gameId + '.json';

                    invoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.createDatabase = function (name, shortdescription, username, email, done, error) {
                var req = 'setupGame/createDatabase.json';

                try  {
                    if (!name)
                        throw new Error("The game name is required");
                    if (!username)
                        throw new Error("The first character name is required");
                    if (!email)
                        throw new Error("The email is required");

                    var game = {
                        name: name,
                        shortDescription: shortdescription
                    };
                    var char = {
                        name: username,
                        email: email
                    };

                    invoker(this.zumo, req, "post", [game, char], done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.setBlobAccount = function (gameId, blobAccountName, blobAccountKey, blobContainerName, done, error) {
                var req = 'setgame/' + gameId + '.json';

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
                    invoker(this.zumo, req, "post", game, done, error);
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
                    invoker(this.zumo, req, "post", game, done, error);
                } catch (e) {
                    error(e);
                }
            };

            Setup.prototype.updateGame = function (game, done, error) {
                var req = 'setgame/' + game.id + '.json';

                try  {
                    invoker(this.zumo, req, "post", game, done, error);
                } catch (e) {
                    error(e);
                }
            };
            return Setup;
        })();
        LeaderBoard.Setup = Setup;
    })(BABYLON.LeaderBoard || (BABYLON.LeaderBoard = {}));
    var LeaderBoard = BABYLON.LeaderBoard;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=babylonclient.js.map
