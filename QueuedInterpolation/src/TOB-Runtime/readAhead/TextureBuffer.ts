/// <reference path="./Preloader.ts"/>
module TOWER_OF_BABEL {
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

        // assigned by applyWhenReady()
        private _mat : BABYLON.StandardMaterial;
        private _txType : number;
        private _userCallback  : () => void;

        /**
         * Called from the matReadAhead() of the generated code with the info needed to perform fetch.
         * @param {string} path - This is the site / directory part of the URL.  When using read ahead,
         * this is the matPath property of the preloader.  When static, this is passed originally
         * from the Mesh constructor.
         * @param {string} fName - This is the base filename, generated in the matReadAhead() code.
         */
        constructor(public path : string, public fName : string) {
            this._fetchStart = BABYLON.Tools.Now;
            if (this.path.lastIndexOf("/") + 1  !== this.path.length) { this.path  += "/"; }
            this._load(false);
        }

        /**
         * function broken out so can call while falling back, if required.
         * @param {boolean} fallingBack - indicates being called a 2nd time after failing
         */
        private _load(fallingBack : boolean) : void {
            var onError : () => void = null;
            var ref = this;

            var url = this.path + this.fName;
            var textureFormatInUse = Preloader.SCENE.getEngine().textureFormatInUse;

            // section a replication of the beginning part of engine.createTexture()
            var lastDot = url.lastIndexOf('.');
            var isKTX = !fallingBack && textureFormatInUse;
            if (isKTX) {
                url = url.substring(0, lastDot) + textureFormatInUse;
                // fallback for when compressed file not found to try again.  For instance, etc1 does not have an alpha capable type.
                onError = () => { ref._load(true); };
            }

            if (isKTX) {
                BABYLON.Tools.LoadFile(url, data => { ref._notifyReady(data) }, null, Preloader.SCENE.database, true, onError);
            } else {
                BABYLON.Tools.LoadImage(url, data => { ref._notifyReady(data) }, onError, Preloader.SCENE.database);
            }
        }

        /**
         * The callback called by either LoadFile or LoadImage.  Does assignment if by the time fetch done, a request has come in.
         * @param {ArrayBuffer | HTMLImageElement} result - buffer of the texture.
         */
        private _notifyReady(result : ArrayBuffer | HTMLImageElement) : void {
            this._buffer = result;
            if (Preloader.READ_AHEAD_LOGGING) BABYLON.Tools.Log(this.fName + " fetched in " + ((BABYLON.Tools.Now - this._fetchStart) / 1000).toFixed(3) + " secs");

            // assignment of callback is used as the test of whether a request has already been made
            if (this._userCallback) this._assign(this._userCallback);
        }

        /**
         * Called in defineMaterials(), generated code, to actually create the texture & assign it to a material.
         * When the preloader has already retrieved the data, the assignment
         */
        public applyWhenReady(mat : BABYLON.StandardMaterial, txType : number, readyCallback : () => void) : void {
            this._mat = mat;
            this._txType = txType;

            if (this._buffer) {
                this._assign(readyCallback);
            }
            else this._userCallback = readyCallback;
        }

        /**
         *  Broken out so can be called by either _notifyReady(), or applyWhenReady().
         */
        private _assign(readyCallback : () => void) : void {
            // any rename to a ktx should happen again, just like in _load()
            var texture = new BABYLON.Texture(this.path + this.fName, Preloader.SCENE, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, readyCallback, null, this._buffer);
            if (this._buffer && !Preloader.MAKE_MULTI_SCENE) delete this._buffer;

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