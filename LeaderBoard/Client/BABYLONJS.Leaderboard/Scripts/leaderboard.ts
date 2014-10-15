module BABYLON {

    export module LeaderBoard {

        export class Client {

            public zumo: Microsoft.WindowsAzure.MobileServiceClient;

            constructor(public applicationUrl: string, public applicationKey: string, public gameId: number, public masterKey?: string) {

                // Check url / key
                if (!applicationUrl || applicationUrl.length == 0)
                    throw new Error("applicationUrl required");
                if (!applicationKey || applicationKey.length == 0)
                    throw new Error("applicationKey required");

                try {

                    if (!masterKey || masterKey == "") {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey);
                    }
                    else {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey)
                            .withFilter((request: any, next: (request: any, callback: (error: any, response: any) => void) => void, callback: (error: any, response: any) => void) => {
                                request.headers['X-ZUMO-MASTER'] = masterKey;
                                next(request, callback);
                            });
                    }

                    this.getCurrentUser();
                }
                catch (e) {
                    throw new Error("can't initialize to Mobile Service");
                }

            }

            public getCurrentUser(): Microsoft.WindowsAzure.User {

                if (this.zumo.currentUser == null) {
                    this.zumo.currentUser = this._getSavedUser();
                }
                return this.zumo.currentUser;
            }

            private _saveUser() {
                sessionStorage.setItem('babylonleaderboardclientuser', JSON.stringify(this.zumo.currentUser));
            }

            private _deleteUser() {
                sessionStorage.clear();
            }

            private _getSavedUser(): Microsoft.WindowsAzure.User {
                var uStr = sessionStorage.getItem('babylonleaderboardclientuser');

                if (uStr == null) {
                    return null;
                }

                return <Microsoft.WindowsAzure.User>JSON.parse(uStr);

            }

            public logout() {

                this._deleteUser();
                this.zumo.logout();
            }

            public getLoginProvider() {


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

            }

            public loginWithProfile(source: string, done: (chars: Character[]) => void, error?: (e) => void) {

                var profile = this.getLoginProvider();

                // already logged with correct provider
                if (profile && profile.source == source) {
                    return this.getCharacterFromProfile(profile.source, done, error);
                }

                this.zumo.login(source, null, false, (err, user) => {
                    if (err != null) {
                        error(err);
                        return;
                    }
                    this._saveUser();

                    profile = this.getLoginProvider();
                    return this.getCharacterFromProfile(profile.source, done, error);
                });

            }

            public loginWithFacebook(done: (chars: Character[]) => void, error?: (e) => void) {
                return this.loginWithProfile('facebook', done, error);
            }

            public loginWithMicrosoft(done: (chars: Character[]) => void, error?: (e) => void) {
                return this.loginWithProfile('microsoftaccount', done, error);
            }

            public loginWithGoogle(done: (chars: Character[]) => void, error?: (e) => void) {
                return this.loginWithProfile('google', done, error);
            }

            public uploadBlob(file: File, done: (blob: any) => void, error?: (e) => void) {

                this.getNewBlobUrl(file.name, (r: Array<any>) => {

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

                    var _pad = (number, length) => {
                        var str = '' + number;
                        while (str.length < length) {
                            str = '0' + str;
                        }
                        return str;
                    };

                    var _commitBlockList = () => {
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

                    var _uploadFileInBlocks = () => {

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

                    var _readerLoad = (evt: any) => {
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

                    reader.onload = (evt: any) => _readerLoad(evt);

                    _uploadFileInBlocks();

                },
                    (err) => {
                        return error(err);
                    });
            }

            public uploadImage(file: File, done: (img: any) => void, error?: (e) => void) {

                if (!file) {
                    return error('file is mandatory');
                }

                if (file.size > (500 * 1024)) {
                    return error('only small images (size < 512ko) are valid when you want to upload directly in database\nFor large file use uploadBlob instead.');
                }

                var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];

                // get type and see if allowed
                var imgType = file.type.toLowerCase(); // On utilise toLowerCase() pour éviter les extensions en majuscules

                if (allowedTypes.indexOf(imgType) >= 0) {
                    return error('only images (PNG, JPG, JPEG, GIF) are authorized.');
                }


                var reader = new FileReader();

                var req = 'image/' + this.gameId + '/set.json';
                var z = this.zumo;

                reader.onload = (e) => {

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

            }

            public getNewBlobUrl(blobName: string, done: (fileUrl: Array<any>) => void, error?: (e) => void) {
                var req = 'image/' + this.gameId + '/getnewbloburl.json';

                Util.zumoInvoker(this.zumo, req, "post", { fileName: blobName }, done, error);

            }

            // Game

            public getGame(done: (game: Game) => void, error?: (e) => void) {

                var req = 'games/' + this.gameId + '/fetch.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public getBlobAccount(done: (blob: any) => void, error?: (e) => void) {

                var req = 'games/' + this.gameId + '/get.json';

                var game = {
                    id: this.gameId,
                    fields: 'blobAccountName,blobAccountKey,blobContainerName'
                };

                Util.zumoInvoker(this.zumo, req, "post", game, done, error);
            }

            // Characters

            public addOrUpdateCharacter(character: Character, done?: (c: Character) => void, error?: (e) => void) {

                var req = 'characters/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", character, done, error);
            }

            public deleteCharacter(character: Character, done: (c: Character) => void, error?: (e) => void) {

                var req = 'characters/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", character, done, error);
            }

            public getCharactersCount(done: (count: number) => void, error?: (e) => void) {

                var req = 'characters/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public getCharacter(name: string, fields?: any, done?: (c: Character) => void, error?: (e) => void) {

                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof fields === 'function')) {
                    error = <any>done;
                    done = <any>fields;
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
            }

            public getCharacters(params?: any, done?: (c: Character[]) => void, error?: (e) => void) {

                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = <any>done;
                    done = <any>params;
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
            }

            public getCharacterFromProfile(source: string, done: (characters: Character[]) => void, error?: (e) => void) {

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
            }

            public getFacebookProfile(done: any, error?: (e) => void) {

                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/facebook.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public getMicrosoftProfile(done: any, error?: (e) => void) {

                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/microsoftaccount.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public getGoogleProfile(done: any, error?: (e) => void) {

                if (this.getCurrentUser() == null) {
                    error('you need to be authenticated to get a character from social profile');
                    return;
                }

                var req = 'characters/' + this.gameId + '/id/google.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            // Rewards

            public getReward(rewardName: string, done: (c: Reward) => void, error?: (e) => void) {

                var req = 'rewards/' + this.gameId + '/get/' + rewardName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public addOrUpdateReward(reward: Reward, done: (c: Reward) => void, error?: (e) => void) {

                var req = 'rewards/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", reward, done, error);
            }

            public deleteReward(reward: Reward, done: (c: Reward) => void, error?: (e) => void) {

                var req = 'rewards/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", reward, done, error);
            }

            public getRewards(params?: any, done?: (c: Reward) => void, error?: (e) => void) {

                // Absent optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = <any>done;
                    done = <any>params;
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
            }

            public getRewardsCount(done: (count: number) => void, error?: (e) => void) {

                var req = 'rewards/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            // Achievements

            public getAchievement(achievementName: string, done: (c: Achievement) => void, error?: (e) => void) {

                var req = 'achievements/' + this.gameId + '/get/' + achievementName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public addOrUpdateAchievement(achievement: Achievement, done: (c: Achievement) => void, error?: (e) => void) {

                var req = 'achievements/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", achievement, done, error);
            }

            public deleteAchievement(achievement: Achievement, done: (c: Achievement) => void, error?: (e) => void) {

                var req = 'achievements/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", achievement, done, error);
            }

            public getAchievements(params?: any, done?: (c: Achievement[]) => void, error?: (e) => void) {

                // Optional arguments
                if ((error == null || error == undefined) && (typeof params === 'function')) {
                    error = <any>done;
                    done = <any>params;
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
            }

            public getAchievementsCount(done: (count: number) => void, error?: (e) => void) {

                var req = 'achievements/' + this.gameId + '/count.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            // Character rewards

            public getCharacterRewards(characterName: string, done: (rewards: any[]) => void, error?: (e) => void) {

                var req = 'characterrewards/' + this.gameId + '/get/' + characterName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public addOrUpdateCharacterReward(cr: any, done: (c: any) => void, error?: (e) => void) {

                var req = 'characterrewards/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            }

            public deleteCharacterReward(cr: any, done: (c: any) => void, error?: (e) => void) {

                var req = 'characterrewards/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            }

            // Character Scores

            public getCharacterScores(characterName: string, done: (scores: any[]) => void, error?: (e) => void) {

                var req = 'characterscores/' + this.gameId + '/get/' + characterName + '.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public addOrUpdateCharacterScore(cr: any, done: (c: any) => void, error?: (e) => void) {

                var req = 'characterscores/' + this.gameId + '/set.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            }

            public deleteCharacterScore(cr: any, done: (c: any) => void, error?: (e) => void) {

                var req = 'characterscores/' + this.gameId + '/del.json';

                Util.zumoInvoker(this.zumo, req, "post", cr, done, error);
            }

            // email

            public sendEmail(email: any, done: (r: any) => void, error?: (e) => void) {

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
            }

        }

        export class Setup {

            zumo: Microsoft.WindowsAzure.MobileServiceClient;

            constructor(public applicationUrl: string, public applicationKey: string, public masterKey?: string) {

                // Check url / key
                if (!applicationUrl || applicationUrl.length == 0)
                    throw new Error("applicationUrl required");
                if (!applicationKey || applicationKey.length == 0)
                    throw new Error("applicationKey required");

                try {
                    if (!masterKey || masterKey == "") {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey);
                    }
                    else {
                        this.zumo = new WindowsAzure.MobileServiceClient(applicationUrl, applicationKey)
                            .withFilter((request: any, next: (request: any, callback: (error: any, response: any) => void) => void, callback: (error: any, response: any) => void) => {
                                request.headers['X-ZUMO-MASTER'] = masterKey;
                                next(request, callback);
                            });

                    }
                }
                catch (e) {
                    throw new Error("can't initialize to Mobile Service");
                }

            }

            public getCors(gameId: number, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    var req = 'blob/' + gameId + '/getCors.json';

                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);

                } catch (e) {
                    error(e);
                }

            }

            public setCors(gameId: number, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    var req = 'blob/' + gameId + '/setCors.json';

                    Util.zumoInvoker(this.zumo, req, 'get', null, done, error);

                } catch (e) {
                    error(e);
                }

            }


            public getTableCharacter(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('character').read().done(
                        (chars: any[]) => done(chars),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableCharacter(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('character').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public updateTableCharacter(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('character').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public deleteTableCharacter(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('character').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public getTableAchievement(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('achievement').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public insertTableAchievement(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('achievement').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public updateTableAchievement(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('achievement').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public deleteTableAchievement(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('achievement').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public getTableCharacterReward(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterReward').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableCharacterReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterReward').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public updateTableCharacterReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterReward').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public deleteTableCharacterReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterReward').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public getTableCharacterScore(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterScore').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableCharacterScore(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterScore').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public updateTableCharacterScore(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterScore').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public deleteTableCharacterScore(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('characterScore').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public getTableGame(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('game').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableGame(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('game').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public updateTableGame(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('game').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public deleteTableGame(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('game').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public getTableImage(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('image').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableImage(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('image').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public updateTableImage(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('image').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public deleteTableImage(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('image').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public getTableReward(done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('reward').read().done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }

            }
            public insertTableReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('reward').insert(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public updateTableReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('reward').update(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }
            public deleteTableReward(instance: any, done: (c: any[]) => void, error: (e: any) => void) {
                try {
                    this.zumo.getTable('reward').del(instance).done(
                        (r: any[]) => done(r),
                        (err: any) => error(err));
                } catch (e) {
                    error(e);
                }
            }

            public dropDatabase(done: (res: any) => void, error: (e: any) => void) {
                try {
                    var req = 'setupGame/dropDatabase.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);
                } catch (e) {
                    error(e);
                }

            }

            public getGame(gameId: number, done: (game: Game) => void, error?: (e) => void) {

                var req = 'games/' + gameId + '/fetch.json';

                Util.zumoInvoker(this.zumo, req, "get", null, done, error);
            }

            public getGames(done: (res: Game[]) => void, error: (e: any) => void) {
                try {


                    var req = 'games/all.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);

                } catch (e) {
                    error(e);
                }

            }

            public deleteGame(gameId: number, done: (res: any) => void, error: (e: any) => void) {
                try {
                    if (!gameId)
                        throw new Error("gameId required");

                    var req = 'setupGame/deleteGame/' + gameId + '.json';

                    Util.zumoInvoker(this.zumo, req, "get", gameId, done, error);

                } catch (e) {
                    error(e);
                }

            }

            public deleteGames(done: (res: any) => void, error: (e: any) => void) {
                try {

                    var req = 'setupGame/deleteGames.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);

                } catch (e) {
                    error(e);
                }

            }

            public createSampleDatas(gameId: number, done: (res: any) => void, error: (e: any) => void) {
                try {

                    var req = 'setupGame/createSample/' + gameId + '.json';

                    Util.zumoInvoker(this.zumo, req, "get", null, done, error);

                } catch (e) {
                    error(e);
                }

            }

            public createGame(game: Game, char: Character, done: (res: any) => void, error: (e: any) => void) {

                var req = 'setupGame/createGame.json';

                try {

                    if (Util.isNullOrEmpty(game.name))
                        throw new Error("The game name is required");

                    if (Util.isNullOrEmpty(char.name))
                        throw new Error("The character name is required");

                    if (Util.isNullOrEmpty(char.email))
                        throw new Error("The character email is required");

                    Util.zumoInvoker(this.zumo, req, "post", [game, char], done, error);

                }
                catch (e) {
                    error(e);
                }


            }

            public setBlobAccount(gameId: number, blobAccountName: string, blobAccountKey: string, blobContainerName: string, done: (blob: any) => void, error?: (e: any) => void) {
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

                try {

                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);

                } catch (e) {
                    error(e);
                }
            }

            public setSendgridAccount(gameId: number, sendgridSmtpServer: string, sendgridUsername: string, sendgridPassword: string, done: (blob: any) => void, error?: (e: any) => void) {
                var req = 'games/' + gameId + '/set.json';

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

                try {

                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);

                } catch (e) {
                    error(e);
                }
            }

            public updateGame(game: Game, done: (g: Game) => void, error?: (e) => void) {

                var req = 'games/' + game.id + '/set.json';

                try {

                    Util.zumoInvoker(this.zumo, req, "post", game, done, error);

                } catch (e) {
                    error(e);
                }
            }

        }

        export class Util {

            public static zumoInvoker(zumo: Microsoft.WindowsAzure.MobileServiceClient, url: string, method: string, options: any, done: (res: any) => void, error?: (e: any) => void) {
                error = error != null ? error : (e) => console.error(e);
                done = done != null ? done : (r) => { };

                zumo.invokeApi(url, { method: method, parameters: null, body: options })
                    .done(response => {
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
                    }, e => {
                        if (error != null)
                            error(e.message);
                    });
            }

            public static directInvoker(options: any, done: (res: any) => void, error?: (e: any) => void) {
                error = error != null ? error : (e) => console.error(e);
                done = done != null ? done : (r) => { };

                var headers = options.headers || {},
                    url = options.url.replace(/#.*$/, ""),
                    httpMethod = options.type ? options.type.toUpperCase() : "GET",
                    xhr = new XMLHttpRequest();

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

            }

            public static isNull(value: any) {

                return value === null || value === undefined;
            }

            public static isNullOrZero(value: any) {

                return value === null || value === undefined || value === 0 || value === '';
            }

            public static isNullOrEmpty(value: any) {

                return Util.isNull(value) || value.length === 0;
            }

            public static format(message: string) {

                if (!Util.isNullOrEmpty(message) && arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        var pattern = '{' + (i - 1) + '}';
                        while (message.indexOf(pattern) !== -1) {
                            message = message.replace(pattern, arguments[i]);
                        }
                    }
                }
                return message;
            }

            public static has(value: any, key: any) {
                return !Util.isNull(value) && value.hasOwnProperty(key);
            }

            public static hasProperty(object: any, properties: any) {
                for (var i = 0; i < properties.length; i++) {
                    if (Util.has(object, properties[i])) {
                        return true;
                    }
                }
                return false;
            }

            public static isObject(value: any) {
                return Util.isNull(value) || (typeof value === 'object' && !Util.isDate(value));
            }

            public static isString(value: any) {

                return Util.isNull(value) || (typeof value === 'string');
            }

            public static isNumber(value: any) {

                return !Util.isNull(value) && (typeof value === 'number');
            }

            public static isBool(value: any) {
                return !Util.isNull(value) && (typeof value == 'boolean');
            }

            public static classOf(value) {
                return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
            }

            public static isDate(value: any) {
                return !Util.isNull(value) && (Util.classOf(value) == 'date');
            }

            public static pad(value: any, length: any, ch: any) {
                var text = value.toString();
                while (text.length < length) {
                    text = ch + text;
                }
                return text;
            }

            public static trimEnd(text: any, ch: any) {

                var end = text.length - 1;
                while (end >= 0 && text[end] === ch) {
                    end--;
                }

                return end >= 0 ? text.substr(0, end + 1) : '';
            }

            public static trimStart(text: any, ch: any) {

                var start = 0;
                while (start < text.length && text[start] === ch) {
                    start++;
                }

                return start < text.length ?
                    text.substr(start, text.length - start) :
                    '';
            }

            public static compareCaseInsensitive(first: any, second: any) {

                if (Util.isString(first) && !Util.isNullOrEmpty(first)) {
                    first = first.toUpperCase();
                }

                if (Util.isString(first) && !Util.isNullOrEmpty(second)) {
                    second = second.toUpperCase();
                }

                return first === second;
            }

            public static tryParseIsoDateString(text: any) {

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
                    var dateWithoutFraction = matchedDate[1],
                        fraction = matchedDate[2] || "0",
                        milliseconds = Math.round(1000 * Number("0." + fraction)); // 6 -> 600, 65 -> 650, etc.
                    dateWithoutFraction = dateWithoutFraction
                        .replace(/\-/g, "/")   // yyyy-mm-ddThh:mm:ss -> yyyy/mm/ddThh:mm:ss
                        .replace("T", " ");    // yyyy/mm/ddThh:mm:ss -> yyyy/mm/dd hh:mm:ss

                    // Try and parse - it will return NaN if invalid
                    var ticks = Date.parse(dateWithoutFraction + " UTC");
                    if (!isNaN(ticks)) {
                        return new Date(ticks + milliseconds); // ticks are just milliseconds since 1970/01/01
                    }
                }

                // Doesn't look like a date
                return null;
            }

        }

        export class Game {
            id: number;
            name: string;
            shortDescription: string;
            longDescription: string;
            blobAccountName: string;
            blobAccountKey: string;
            blobContainerName: string;
            sendgridSmtpServer: string;
            sendgridPassword: string;
            sendgridUsername: string;
            createdDate: Date;
            updatedDate: Date;
            levelsCount: number;
            platform: string;
            gameUrl: string;
            websiteUrl: string;
            playersCount: number;
            status: boolean;
            iconFile: string;
        }

        export class Reward {
            id: number;
            gameId: number;
            name: string;
            points: number;
            shortDescription: string;
            longDescription: string;
            createdDate: Date;
            updatedDate: Date;
        }

        export class CharacterScore {
            id: number;
            gameId: number;
            characterId: number;
            score: number;
            createdDate: Date;
            updatedDate: Date;
        }

        export class CharacterReward {
            id: number;
            gameId: number;
            characterId: number;
            rewardId: number;
            points: number;
            createdDate: Date;
            updatedDate: Date;
            obtentionDate: Date;
        }

        export class Achievement {
            id: number;
            name: string;
            shortDescription: string;
            longDescription: string;
            createdDate: Date;
            updatedDate: Date;
            obtentionDate: Date;
            points: number;
            iconFile: string;
        }

        export class Character {
            id: number;
            gameId: number;
            name: string;
            email: string;
            firstName: string;
            lastName: string;
            createdDate: Date;
            updatedDate: Date;
            facebookId: string;
            twitterId: string;
            googleId: string;
            liveId: string;
            imageUrl: string;
            achievementsPoints: number;
            kills: number;
            lives: number;
            rank: number;
            timePlayed: number;
            inventory: string;
            lastLevel: number;
            currentLevel: number;
            currentGolds: number;
            currentLives: number;
            experience: number;
            latitude: number;
            longitude: number;
        }
    }
}


