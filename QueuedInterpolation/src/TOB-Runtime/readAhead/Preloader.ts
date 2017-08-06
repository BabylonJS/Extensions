module TOWER_OF_BABEL {
    export class Preloader {
        //TODO iOS has problem with preloader; use Alert to track down
        public static READ_AHEAD_LOGGING = false; // when true, write timings to the console
        public static MAKE_MULTI_SCENE = false;   // when true, data retrieved is not deleted after texture is assigned
        public static SCENE : BABYLON.Scene;      // simplify having scene as an argument all over the place.

        public _characters   : { [desc: string] : Character;  } = {};
        public _busts        : { [desc: string] : Character;  } = {};
        private _sceneChunks : { [desc: string] : SceneChunk; } = {};

        // A common TextureBuffer array across all PreLoaders, if multiples.
        // Also allows generated code to be put statically in header section of html, where no Preloader is instanced.
        private static _images = new Array<TextureBuffer>();

        /**
         * A Preloader holds the info to dynamically load TOB generated files, which are both in the
         * same directory & have the same directory for images.  There are methods to add files (characters, bust, & scene chunks),
         * and methods to request they start loading.
         */
        constructor(public jsPath : string, public matPath : string) {
           if (this.jsPath .lastIndexOf("/") + 1  !== this.jsPath .length)  this.jsPath  += "/";
           if (this.matPath.lastIndexOf("/") + 1  !== this.matPath.length)  this.matPath += "/";
        }

        /**
         * Register a character as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingCharacters() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        public addCharacter(player : Character, desc : string) : void {
            player._preloader = this;
            this._characters[desc] = player;
        }

        /**
         * Register a bust as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingBusts() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        public addBust(player : Character, desc : string) : void {
            player._preloader = this;
            this._busts[desc] = player;
        }

        /**
         * Register a scene chunk as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingChunks() is called.
         * @param {SceneChunk} chunk - An instance of the SceneChunk, PreLoadable, to add.
         */
        public addSceneChunk(chunk : SceneChunk, desc : string) : void {
            chunk._preloader = this;
            this._sceneChunks[desc] = chunk;
        }

        public static addtextureBuffer(image : TextureBuffer) : void {
            Preloader._images.push(image);
        }

        /**
         * Called by defineMaterials(), generated code, to finally assign the pre-loaded texture data to a BABYLON.Texture.
         * Called also by readAhead(), generated code, to detect if there was already an attempt.  Materials using the same texture data, 
         * should have the same fName, & namespace .eg. 'shared'. 
         * @param {string} fName - The name of the data given when pre-loaded, the base file name before and reduced texture swaps.
         * @returns {TextureBuffer} - The buffer object which might have already been loaded or not yet.
         */
        public static findTextureBuffer(fName : string) : TextureBuffer {
            for (var i = 0, len = this._images.length; i < len; i++) {
                if (Preloader._images[i].fName === fName) return Preloader._images[i];
            }
            return null;
        }

        public get numCharacters () : number { return Object.keys(this._characters ).length; }
        public get numBusts      () : number { return Object.keys(this._busts      ).length; }
        public get numSceneChunks() : number { return Object.keys(this._sceneChunks).length; }
        
        public getCharacterKeys () : string[] { return Object.keys(this._characters ); }
        public getBustKeys      () : string[] { return Object.keys(this._busts      ); }
        public getSceneChunkKeys() : string[] { return Object.keys(this._sceneChunks); }
        
        public prepRemainingCharacters () : void { this._prepRemaining(this._characters ); }
        public prepRemainingBusts      () : void { this._prepRemaining(this._busts      ); }
        public prepRemainingSceneChunks() : void { this._prepRemaining(this._sceneChunks); }

        private _prepRemaining(dict : {[desc: string] : PreLoadable}) : void {
            for (var desc in dict) {
                dict[desc].makeReady();
             }
        }
        
        /** return a character
         *  @param {number | string} indexOrKey - The order in the dictionary, or the key.  Random when not specified
         */
        public pickCharacter(indexOrKey? : number | string) : Character { return this._pick(this._characters, indexOrKey); }
        
        /** return a bust
         *  @param {number | string} indexOrKey - The order in the dictionary, or the key.  Random when not specified
         */
        public pickBust(indexOrKey? : number | string) : Character { return this._pick(this._busts, indexOrKey); }
        
        private _pick(dict : {[desc: string] : PreLoadable}, indexOrKey? : number | string) : Character {
            
            // not using a ! test, since index can be zero
            if (typeof indexOrKey === "undefined") {
                return this._getNth(dict, Math.floor(Math.random() * Object.keys(dict).length));
            }
            
            if  (typeof indexOrKey === "string") return <Character> dict[<string> indexOrKey];
            else return  this._getNth(dict, <number> indexOrKey);
        }
        
        private _getNth(dict : {[desc: string] : PreLoadable}, index : number) : Character {
            var i = 0;
            for (var desc in dict) {
                if (i++ === index) return <Character> dict[desc];
             }
            return null;
        }
    }
}