/// <reference path="./Preloader.ts"/>
module TOWER_OF_BABEL {
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
    export class PreLoadable {
        public _preloader : Preloader;
        public  _onPath = false;
        private _inProgress = false;
        private _loadStart : number;
        private _userCallback  : () => void;

        constructor (public moduleName : string, private _jsFile : string) { }

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
            jsElem.src = this._preloader.jsPath + this._jsFile;

            // finally insert the element to the body element in order to load the script
            document.body.appendChild(jsElem);

            var ref = this;
            jsElem.onload  = () => {
                ref._onPath = ref._inProgress = true;
                if (Preloader.READ_AHEAD_LOGGING) BABYLON.Tools.Log(ref._jsFile + " loaded in " + ((BABYLON.Tools.Now - ref._loadStart) / 1000).toFixed(3) + " secs");

                // begin read ahead for textures
                try{
                    eval(ref.moduleName + '.matReadAhead("' + ref._preloader.matPath + '");');
                } catch(err) {
                    BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: module " + ref.moduleName + ".matReadAhead() failed");
                }

                if (ref._userCallback) this._userCallback();
                ref._userCallback = null;
            };

            jsElem.onerror = () => {
                BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: " + jsElem.src + " failed to load.");
            };
            return false;
        }
    }

    export class Character extends PreLoadable {
        constructor (moduleName : string, jsFile : string, public className : string) {
            super(moduleName, jsFile);
        }

        /**
         * Should be part of the callback passed to makeReady().
         */
        public instance(name : string) : BABYLON.Mesh {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.Character: Not correctly made ready.");
                return null;
            }
            var ret;
            eval('ret = new ' + this.moduleName + '.' + this.className + '("' + name + '", TOWER_OF_BABEL.Preloader.SCENE, "' + this._preloader.matPath + '")');
            return ret;
        }
    }

    export class SceneChunk extends PreLoadable {

        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor(s) of the scene chunk's meshes / lights / etc.
         */
        public instance(scene : BABYLON.Scene) : void {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.SceneChunk: Not correctly made ready.");
                return;
            }
//            this._instanceCode(scene, this._preloader.matPath);
        }
    }
}