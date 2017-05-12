module TOWER_OF_BABEL {
    export class Preloader {
        public static READ_AHEAD_LOGGING = false; // when true, write timings to the console
        public static MAKE_MULTI_SCENE = false;   // when true, data retrieved is not deleted after texture is assigned
        public static SCENE : BABYLON.Scene;      // simplify having scene as an argument all over the place.

        private _characters  = new Array<Character >();
        private _busts       = new Array<Character >();
        private _sceneChunks = new Array<SceneChunk>();

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
        public addCharacter(player : Character) : void {
            player._preloader = this;
            this._characters.push(player);
        }

        /**
         * Register a bust as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingBusts() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        public addBust(player : Character) : void {
            player._preloader = this;
            this._busts.push(player);
        }

        /**
         * Register a scene chunk as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingChunks() is called.
         * @param {SceneChunk} chunk - An instance of the SceneChunk, PreLoadable, to add.
         */
        public addSceneChunk(chunk : SceneChunk) : void {
            chunk._preloader = this;
            this._sceneChunks.push(chunk);
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

        public get numCharacters() : number {
            return this._characters.length;
        }

        public get numBusts() : number {
            return this._busts.length;
        }

        public get numSceneChunks() : number {
            return this._sceneChunks.length;
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
}