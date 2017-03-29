/// <reference path="./Mesh.ts"/>
module QI {
    export class Preloader {
        public static READ_AHEAD_LOGGING = false;
        
        private _characters = new Array<Character>();
        private _busts      = new Array<Character>();
        private _relPath : string;
        private _engine  : BABYLON.Engine;
        
        private static _images = new Array<TextureBuffer>();
        
        constructor(public _relMaterialsRootDir : string) { }
         
        /**
         * getter of the engine
         */
        public get engine() : BABYLON.Engine {
            return this._engine;
        }
        
        /**
         * setter of the engine.  Not passed as part of the constructor, so re-usable character assignment can be in different js file.
         */
        public set engine(value : BABYLON.Engine) {
            this._engine = value;
        }
        
        public addCharacter(player : Character) : void {
            player._preloader = this;
            this._characters.push(player);
        }
        
        public addBust(player : Character) : void {
            player._preloader = this;
            this._busts.push(player);
        }
         
        public static addtextureBuffer(image : TextureBuffer) : void {
            Preloader._images.push(image);
        }
        
        public get numCharacters() : number {
            return this._characters.length;
        }
        
        public get numBusts() : number {
            return this._busts.length;
        }
        
        public set relPath(value : string) {
            this._relPath = value;
            if (this._relPath.lastIndexOf("/") + 1  !== this._relPath.length)  this._relPath  += "/";
        }
        
        public get relPath() : string {
            return this._relPath;
        }
        
        public prepRemainingCharacters() : void {
            for (var i = 0, len = this._characters.length; i < len; i++) {
                // does nothing once ready
                this._characters[i].makeReady();
            }
        }
        
        public prepRemainingBusts() : void {
            for (var i = 0, len = this._busts.length; i < len; i++) {
                // does nothing once ready
                this._busts[i].makeReady();
            }
        }
        
        public pickCharacter(bustOnly : boolean, index? : number) : Character {
            var bank = bustOnly ? this._busts : this._characters;
            // not using a ! test, since index can be zero
            if (typeof index === "undefined") {
                index = Math.floor(Math.random() * bank.length);
            }
            
            return bank[index];
        }
    }
    //==================================== Preloadable JS ==========================================
    export class PreLoadable {
        public _preloader : Preloader;
        public  _onPath = false;
        private _inProgress = false;
        private _loadStart : number;
        private _userCallback  : () => void;
        
        constructor (public name : string, private _jsFile : string) { }
        
        public makeReady(readyCallback? : () => void) : boolean {
            if (this._onPath) {
                if (readyCallback) readyCallback();
                return true;
            }
            if (this._inProgress) {
                if (!this._userCallback) this._userCallback = readyCallback;
                 return false;
            }
            this._inProgress = true;
            this._loadStart = BABYLON.Tools.Now;
            
            // record the user callback, if passed
            if (readyCallback) this._userCallback = readyCallback;
            
            // DOM: Create the script element
            var jsElem = document.createElement("script");
            
            // set the type attribute
            jsElem.type = "application/javascript";
            
            // make the script element load file
            jsElem.src = this._preloader.relPath + this._jsFile;
            
            // finally insert the element to the body element in order to load the script
            document.body.appendChild(jsElem);
            
            var ref = this;
            jsElem.onload  = () => { 
                ref._onPath = ref._inProgress = true;
                if (Preloader.READ_AHEAD_LOGGING) BABYLON.Tools.Log(ref._jsFile + " loaded in " + ((BABYLON.Tools.Now - ref._loadStart) / 1000).toFixed(3) + " secs");
                
                if (ref._userCallback) this._userCallback();
                ref._userCallback = null;
            };
            
            jsElem.onerror = () => {
                BABYLON.Tools.Error(jsElem.src + " failed to load.");
            };
            return false;
        }
    }
    
    export class Character extends PreLoadable {
        constructor (name : string, jsFile : string, private _instanceCode: (name : string, scene : BABYLON.Scene, materialsRootDir : string) => Mesh) {
            super(name, jsFile);
        }
        
        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor.
         */
        public instance(name : string, scene : BABYLON.Scene) : Mesh {
            if (!this._onPath) {
                BABYLON.Tools.Error("QI.Character: Not correctly made ready.");
                return null;
            }
            return this._instanceCode(name, scene, this._preloader.relPath + this._preloader._relMaterialsRootDir);
        } 
    }
    
    export class SceneChunk extends PreLoadable {
        constructor (name : string, jsFile : string, private _instanceCode: (scene : BABYLON.Scene, materialsRootDir : string) => Mesh) {
            super(name, jsFile);
        }
        
        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor(s) of the scene chunk's meshes / lights / etc.
         */
        public instance(scene : BABYLON.Scene) : void {
            if (!this._onPath) {
                BABYLON.Tools.Error("QI.SceneChunk: Not correctly made ready.");
                return;
            }
            this._instanceCode(scene, this._preloader.relPath + this._preloader._relMaterialsRootDir);
        } 
    }
    //===================================== Asset Buffers ==========================================
    //=============================================================================================
    /**
     * a class to hold the buffer of pre-fetched texture
     */
    export class TextureBuffer {
        public static DIFFUSE_TEX    = 0;
        public static BUMP_TEX       = 1;
        public static AMBIENT_TEX    = 2;
        public static OPACITY_TEX    = 3;
        public static EMISSIVE_TEX   = 4;
        public static SPECULAR_TEX   = 5;
        public static REFLECTION_TEX = 6;
        
        // captured properties of texture, not part of constructor for readability
        public hasAlpha : boolean;
        public level : number;
        public coordinatesIndex : number;
        public coordinatesMode : number;
        public uOffset : number;
        public vOffset : number;
        public uScale : number;
        public vScale : number;
        public uAng : number;
        public vAng : number;
        public wAng : number;
        public wrapU : number;
        public wrapV : number;
        
        // assigned by _load()
        public _buffer : ArrayBuffer | HTMLImageElement = null;
        private _fetchStart : number;
        public failed = false;  
        
        // assigned by applyWhenReady()
        private _mat : BABYLON.StandardMaterial;
        private _txType : number;
        private _userCallback  : () => void;
        
        /**
         * Called from the matReadAhead() of the generated code with the info needed to perform fetch.
         */
        constructor(private _scene : BABYLON.Scene, public path : string, public name : string) {
            this._fetchStart = BABYLON.Tools.Now;
            if (this.path.lastIndexOf("/") + 1  !== this.path.length) { this.path  += "/"; }
            this._load(false);
        }
        
        /**
         * function broken out so can call while falling back, if required.
         * @param {boolean} fallingBack - indicates being called a 2nd time after failing
         */
        private _load(fallingBack : boolean) : void {
            var url = this.path + this.name;
            var textureFormatInUse = this._scene.getEngine().textureFormatInUse;
            
            // section a replication of the beginning part of engine.createTexture()
            var lastDot = url.lastIndexOf('.');
            var isKTX = !fallingBack && textureFormatInUse;
            if (isKTX) {
                url = url.substring(0, lastDot) + textureFormatInUse;
            }
            
            var onError = () => {
                // fallback for when compressed file not found to try again.  For instance, etc1 does not have an alpha capable type
                if (!fallingBack) {
                    this._load(true);
                } else {
                    BABYLON.Tools.Error(url + " could not be loaded");
                    this.failed = true;
                }
            };

            var ref = this;
            if (isKTX) {
                BABYLON.Tools.LoadFile(url, data => { ref._notifyReady(data) }, null, this._scene.database, true, onError);
            } else {
                BABYLON.Tools.LoadImage(url, data => { ref._notifyReady(data) }, onError, this._scene.database);
            }
        }
        
        /**
         * The callback called by either LoadFile or LoadImage.  Does assignment if by the time fetch done, a request has come in.
         * @param {ArrayBuffer | HTMLImageElement} result - buffer of the texture.
         */
        private _notifyReady(result : ArrayBuffer | HTMLImageElement) : void {
            this._buffer = result;
            if (Preloader.READ_AHEAD_LOGGING) BABYLON.Tools.Log(this.name + " fetched in " + ((BABYLON.Tools.Now - this._fetchStart) / 1000).toFixed(3) + " secs");
            
            // assignment of callback is used as the test of whether a request has already been made
            if (this._userCallback) this._assign(this._userCallback);
        }
        
        
        public applyWhenReady(mat : BABYLON.StandardMaterial, txType : number, readyCallback : () => void) : void {
            this._mat = mat;
            this._txType = txType;          
            
            if (this._buffer || this.failed) {
                this._assign(readyCallback);
            } 
            else this._userCallback = readyCallback;
        }
        
        /**
         * 
         */
        private _assign(readyCallback : () => void) : void {
            // if this failed in _load, then _buffer will be null.  Should fail fast here & get error texture.
            // any rename to a ktx should happen again, just like in _load()
            var texture = new BABYLON.Texture(this.path + this.name, this._scene, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, readyCallback, null, this._buffer);
            if (this._buffer) delete this._buffer;
            
            texture.name = this.name;
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
                case TextureBuffer.DIFFUSE_TEX   : this._mat.diffuseTexture    = texture; break;
                case TextureBuffer.BUMP_TEX      : this._mat.bumpTexture       = texture; break;
                case TextureBuffer.AMBIENT_TEX   : this._mat.ambientTexture    = texture; break;
                case TextureBuffer.OPACITY_TEX   : this._mat.opacityTexture    = texture; break;
                case TextureBuffer.EMISSIVE_TEX  : this._mat.emissiveTexture   = texture; break;
                case TextureBuffer.SPECULAR_TEX  : this._mat.specularTexture   = texture; break;
                case TextureBuffer.REFLECTION_TEX: this._mat.reflectionTexture = texture; break;
            }
        }
    }    
}