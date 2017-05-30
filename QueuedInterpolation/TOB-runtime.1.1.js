var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __extends = (this && this.__extends) || function (d, b) {
for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
function __() { this.constructor = d; }
__.prototype = b.prototype;
d.prototype = new __();
};
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    var MeshFactory = (function () {
        function MeshFactory() {
        }
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        MeshFactory.instance = function (moduleName, meshName, cloneSkeleton) {
            var ret;
            for (var i = 0, len = MeshFactory.MODULES.length; i < len; i++) {
                if (moduleName === MeshFactory.MODULES[i].getModuleName()) {
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret)
                BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        };
        return MeshFactory;
    }());
    MeshFactory.MODULES = new Array();
    TOWER_OF_BABEL.MeshFactory = MeshFactory;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    var Preloader = (function () {
        /**
         * A Preloader holds the info to dynamically load TOB generated files, which are both in the
         * same directory & have the same directory for images.  There are methods to add files (characters, bust, & scene chunks),
         * and methods to request they start loading.
         */
        function Preloader(jsPath, matPath) {
            this.jsPath = jsPath;
            this.matPath = matPath;
            this._characters = new Array();
            this._busts = new Array();
            this._sceneChunks = new Array();
            if (this.jsPath.lastIndexOf("/") + 1 !== this.jsPath.length)
                this.jsPath += "/";
            if (this.matPath.lastIndexOf("/") + 1 !== this.matPath.length)
                this.matPath += "/";
        }
        /**
         * Register a character as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingCharacters() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        Preloader.prototype.addCharacter = function (player) {
            player._preloader = this;
            this._characters.push(player);
        };
        /**
         * Register a bust as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingBusts() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        Preloader.prototype.addBust = function (player) {
            player._preloader = this;
            this._busts.push(player);
        };
        /**
         * Register a scene chunk as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingChunks() is called.
         * @param {SceneChunk} chunk - An instance of the SceneChunk, PreLoadable, to add.
         */
        Preloader.prototype.addSceneChunk = function (chunk) {
            chunk._preloader = this;
            this._sceneChunks.push(chunk);
        };
        Preloader.addtextureBuffer = function (image) {
            Preloader._images.push(image);
        };
        /**
         * Called by defineMaterials(), generated code, to finally assign the pre-loaded texture data to a BABYLON.Texture.
         * Called also by readAhead(), generated code, to detect if there was already an attempt.  Materials using the same texture data,
         * should have the same fName, & namespace .eg. 'shared'.
         * @param {string} fName - The name of the data given when pre-loaded, the base file name before and reduced texture swaps.
         * @returns {TextureBuffer} - The buffer object which might have already been loaded or not yet.
         */
        Preloader.findTextureBuffer = function (fName) {
            for (var i = 0, len = this._images.length; i < len; i++) {
                if (Preloader._images[i].fName === fName)
                    return Preloader._images[i];
            }
            return null;
        };
        Object.defineProperty(Preloader.prototype, "numCharacters", {
            get: function () {
                return this._characters.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Preloader.prototype, "numBusts", {
            get: function () {
                return this._busts.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Preloader.prototype, "numSceneChunks", {
            get: function () {
                return this._sceneChunks.length;
            },
            enumerable: true,
            configurable: true
        });
        Preloader.prototype.prepRemainingCharacters = function () {
            for (var i = 0, len = this._characters.length; i < len; i++) {
                // does nothing once ready
                this._characters[i].makeReady();
            }
        };
        Preloader.prototype.prepRemainingBusts = function () {
            for (var i = 0, len = this._busts.length; i < len; i++) {
                // does nothing once ready
                this._busts[i].makeReady();
            }
        };
        Preloader.prototype.pickCharacter = function (bustOnly, index) {
            var bank = bustOnly ? this._busts : this._characters;
            // not using a ! test, since index can be zero
            if (typeof index === "undefined") {
                index = Math.floor(Math.random() * bank.length);
            }
            return bank[index];
        };
        return Preloader;
    }());
    Preloader.READ_AHEAD_LOGGING = false; // when true, write timings to the console
    Preloader.MAKE_MULTI_SCENE = false; // when true, data retrieved is not deleted after texture is assigned
    // A common TextureBuffer array across all PreLoaders, if multiples.
    // Also allows generated code to be put statically in header section of html, where no Preloader is instanced.
    Preloader._images = new Array();
    TOWER_OF_BABEL.Preloader = Preloader;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));


/// <reference path="./Preloader.ts"/>
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * A Preloadable is a Tower of Babel generated Javascript file.  This class is not intended to
     * be directly instanced.  Use Character or SceneChunk sub-classes.
     *
     * The Character class is a Mesh sub-class within the Javascript file.
     *
     * The SceneChunk class is for calling the initScene of the Javascript file(creating all meshes of .blend).
     * There can be meshes & lights in export, but probably should not have a camera unless it will always be
     * the only or first chunk.
     */
    var PreLoadable = (function () {
        function PreLoadable(moduleName, _jsFile) {
            this.moduleName = moduleName;
            this._jsFile = _jsFile;
            this._onPath = false;
            this._inProgress = false;
        }
        PreLoadable.prototype.makeReady = function (readyCallback) {
            var _this = this;
            if (this._onPath) {
                if (readyCallback)
                    readyCallback();
                return true;
            }
            if (this._inProgress) {
                if (!this._userCallback)
                    this._userCallback = readyCallback;
                return false;
            }
            this._inProgress = true;
            this._loadStart = BABYLON.Tools.Now;
            // record the user callback, if passed
            if (readyCallback)
                this._userCallback = readyCallback;
            // DOM: Create the script element
            var jsElem = document.createElement("script");
            // set the type attribute
            jsElem.type = "application/javascript";
            // make the script element load file
            jsElem.src = this._preloader.jsPath + this._jsFile;
            // finally insert the element to the body element in order to load the script
            document.body.appendChild(jsElem);
            var ref = this;
            jsElem.onload = function () {
                ref._onPath = ref._inProgress = true;
                if (TOWER_OF_BABEL.Preloader.READ_AHEAD_LOGGING)
                    BABYLON.Tools.Log(ref._jsFile + " loaded in " + ((BABYLON.Tools.Now - ref._loadStart) / 1000).toFixed(3) + " secs");
                // begin read ahead for textures
                try {
                    eval(ref.moduleName + '.matReadAhead("' + ref._preloader.matPath + '");');
                }
                catch (err) {
                    BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: module " + ref.moduleName + ".matReadAhead() failed");
                }
                if (ref._userCallback)
                    _this._userCallback();
                ref._userCallback = null;
            };
            jsElem.onerror = function () {
                BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: " + jsElem.src + " failed to load.");
            };
            return false;
        };
        return PreLoadable;
    }());
    TOWER_OF_BABEL.PreLoadable = PreLoadable;
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(moduleName, jsFile, className) {
            var _this = _super.call(this, moduleName, jsFile) || this;
            _this.className = className;
            return _this;
        }
        /**
         * Should be part of the callback passed to makeReady().
         */
        Character.prototype.instance = function (name) {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.Character: Not correctly made ready.");
                return null;
            }
            var ret;
            eval('ret = new ' + this.moduleName + '.' + this.className + '("' + name + '", TOWER_OF_BABEL.Preloader.SCENE, "' + this._preloader.matPath + '")');
            return ret;
        };
        return Character;
    }(PreLoadable));
    TOWER_OF_BABEL.Character = Character;
    var SceneChunk = (function (_super) {
        __extends(SceneChunk, _super);
        function SceneChunk() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor(s) of the scene chunk's meshes / lights / etc.
         */
        SceneChunk.prototype.instance = function (scene) {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.SceneChunk: Not correctly made ready.");
                return;
            }
            //            this._instanceCode(scene, this._preloader.matPath);
        };
        return SceneChunk;
    }(PreLoadable));
    TOWER_OF_BABEL.SceneChunk = SceneChunk;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

/// <reference path="./Preloader.ts"/>
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * a class to hold the buffer of pre-fetched texture
     */
    var TextureBuffer = (function () {
        /**
         * Called from the matReadAhead() of the generated code with the info needed to perform fetch.
         * @param {string} path - This is the site / directory part of the URL.  When using read ahead,
         * this is the matPath property of the preloader.  When static, this is passed originally
         * from the Mesh constructor.
         * @param {string} fName - This is the base filename, generated in the matReadAhead() code.
         */
        function TextureBuffer(path, fName) {
            this.path = path;
            this.fName = fName;
            // assigned by _load()
            this._buffer = null;
            this._fetchStart = BABYLON.Tools.Now;
            if (this.path.lastIndexOf("/") + 1 !== this.path.length) {
                this.path += "/";
            }
            this._load(false);
        }
        /**
         * function broken out so can call while falling back, if required.
         * @param {boolean} fallingBack - indicates being called a 2nd time after failing
         */
        TextureBuffer.prototype._load = function (fallingBack) {
            var onError = null;
            var ref = this;
            var url = this.path + this.fName;
            var textureFormatInUse = TOWER_OF_BABEL.Preloader.SCENE.getEngine().textureFormatInUse;
            // section a replication of the beginning part of engine.createTexture()
            var lastDot = url.lastIndexOf('.');
            var isKTX = !fallingBack && textureFormatInUse;
            if (isKTX) {
                url = url.substring(0, lastDot) + textureFormatInUse;
                // fallback for when compressed file not found to try again.  For instance, etc1 does not have an alpha capable type.
                onError = function () { ref._load(true); };
            }
            if (isKTX) {
                BABYLON.Tools.LoadFile(url, function (data) { ref._notifyReady(data); }, null, TOWER_OF_BABEL.Preloader.SCENE.database, true, onError);
            }
            else {
                BABYLON.Tools.LoadImage(url, function (data) { ref._notifyReady(data); }, onError, TOWER_OF_BABEL.Preloader.SCENE.database);
            }
        };
        /**
         * The callback called by either LoadFile or LoadImage.  Does assignment if by the time fetch done, a request has come in.
         * @param {ArrayBuffer | HTMLImageElement} result - buffer of the texture.
         */
        TextureBuffer.prototype._notifyReady = function (result) {
            this._buffer = result;
            if (TOWER_OF_BABEL.Preloader.READ_AHEAD_LOGGING)
                BABYLON.Tools.Log(this.fName + " fetched in " + ((BABYLON.Tools.Now - this._fetchStart) / 1000).toFixed(3) + " secs");
            // assignment of callback is used as the test of whether a request has already been made
            if (this._userCallback)
                this._assign(this._userCallback);
        };
        /**
         * Called in defineMaterials(), generated code, to actually create the texture & assign it to a material.
         * When the preloader has already retrieved the data, the assignment
         */
        TextureBuffer.prototype.applyWhenReady = function (mat, txType, readyCallback) {
            this._mat = mat;
            this._txType = txType;
            if (this._buffer) {
                this._assign(readyCallback);
            }
            else
                this._userCallback = readyCallback;
        };
        /**
         *  Broken out so can be called by either _notifyReady(), or applyWhenReady().
         */
        TextureBuffer.prototype._assign = function (readyCallback) {
            // any rename to a ktx should happen again, just like in _load()
            var texture = new BABYLON.Texture(this.path + this.fName, TOWER_OF_BABEL.Preloader.SCENE, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, readyCallback, null, this._buffer);
            if (this._buffer && !TOWER_OF_BABEL.Preloader.MAKE_MULTI_SCENE)
                delete this._buffer;
            texture.name = this.fName;
            texture.hasAlpha = this.hasAlpha;
            texture.level = this.level;
            texture.coordinatesIndex = this.coordinatesIndex;
            texture.coordinatesMode = this.coordinatesMode;
            texture.uOffset = this.uOffset;
            texture.vOffset = this.vOffset;
            texture.uScale = this.uScale;
            texture.vScale = this.vScale;
            texture.uAng = this.uAng;
            texture.vAng = this.vAng;
            texture.wAng = this.wAng;
            texture.wrapU = this.wrapU;
            texture.wrapV = this.wrapV;
            switch (this._txType) {
                case TextureBuffer.DIFFUSE_TEX:
                    this._mat.diffuseTexture = texture;
                    break;
                case TextureBuffer.BUMP_TEX:
                    this._mat.bumpTexture = texture;
                    break;
                case TextureBuffer.AMBIENT_TEX:
                    this._mat.ambientTexture = texture;
                    break;
                case TextureBuffer.OPACITY_TEX:
                    this._mat.opacityTexture = texture;
                    break;
                case TextureBuffer.EMISSIVE_TEX:
                    this._mat.emissiveTexture = texture;
                    break;
                case TextureBuffer.SPECULAR_TEX:
                    this._mat.specularTexture = texture;
                    break;
                case TextureBuffer.REFLECTION_TEX:
                    this._mat.reflectionTexture = texture;
                    break;
            }
        };
        return TextureBuffer;
    }());
    TextureBuffer.DIFFUSE_TEX = 0;
    TextureBuffer.BUMP_TEX = 1;
    TextureBuffer.AMBIENT_TEX = 2;
    TextureBuffer.OPACITY_TEX = 3;
    TextureBuffer.EMISSIVE_TEX = 4;
    TextureBuffer.SPECULAR_TEX = 5;
    TextureBuffer.REFLECTION_TEX = 6;
    TOWER_OF_BABEL.TextureBuffer = TextureBuffer;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

if (((typeof window != "undefined" && window.module) || (typeof module != "undefined")) && typeof module.exports != "undefined") {
    module.exports = TOWER_OF_BABEL;
};
