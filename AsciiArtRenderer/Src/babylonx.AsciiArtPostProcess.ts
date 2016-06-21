/// <reference path="../Libs/babylon.d.ts"/>

module BABYLONX {
    
    /**
     * Empty container to avoid prepare a namespace to receive the compiled shader.
     */
    export class AsciiArtRenderer {
        /**
         * Redirect the ShadersStore to avoid transpilation issue.
         */
        public static ShadersStore = {};
    }

    /**
     * Option available in the Ascii Art Post Process.
     */
    export interface IAsciiArtPostProcessOptions {

        /**
         * The font to use following the w3c font definition.
         */
        font?: string;

        /**
         * The caracter set to use in the postprocess.
         */
        caracterSet?: string;

        /**
         * This defines the amount you want to mix the "tile" or caracter space colored in the ascii art.
         * This number is defined between 0 and 1;
         */
        mixToTile?:number;

        /**
         * This defines the amount you want to mix the normal rendering pass in the ascii art.
         * This number is defined between 0 and 1;
         */
        mixToNormal?:number;
    }

    /**
     * AsciiArtPostProcess helps rendering everithing in Ascii Art.
     * 
     * Simmply add it to your scene and let the nerd that lives in you have fun.
     * Example usage: var pp = new AsciiArtPostProcess("myAscii", "20px Monospace", camera);
     */
    export class AsciiArtPostProcess extends BABYLON.PostProcess {

        /**
         * The font texture used to render the char in the post process.
         */
        private _asciiArtFontTexture: BABYLONX.AsciiArtFontTexture;

        /**
         * This defines the amount you want to mix the "tile" or caracter space colored in the ascii art.
         * This number is defined between 0 and 1;
         */
        public mixToTile:number = 0;

        /**
         * This defines the amount you want to mix the normal rendering pass in the ascii art.
         * This number is defined between 0 and 1;
         */
        public mixToNormal:number = 0;

        /**
         * Instantiates a new Ascii Art Post Process.
         * @param name the name to give to the postprocess
         * @camera the camera to apply the post process to.
         * @param options can either be the font name or an option object following the IAsciiArtPostProcessOptions format
         */
        constructor(name: string, camera: BABYLON.Camera, options?: string | IAsciiArtPostProcessOptions) {
            super(name, 
                'asciiart', 
                ['asciiArtFontInfos', 'asciiArtOptions'], 
                ['asciiArtFont'],
                { 
                    width: camera.getEngine().getRenderWidth(), 
                    height: camera.getEngine().getRenderHeight()
                }, 
                camera, 
                BABYLON.Texture.TRILINEAR_SAMPLINGMODE, 
                camera.getEngine(), 
                true);

            // Default values.
            var font = "40px Monospace";
            var caracterSet =  " `-.'_:,\"=^;<+!*?/cL\\zrs7TivJtC{3F)Il(xZfY5S2eajo14[nuyE]P6V9kXpKwGhqAUbOd8#HRDB0$mgMW&Q%N@";

            // Use options.
            if (options) {
                if (typeof(options) === "string") {
                    font = <string>options;
                }   
                else {
                    font = (<IAsciiArtPostProcessOptions>options).font || font;
                    caracterSet = (<IAsciiArtPostProcessOptions>options).caracterSet || caracterSet;
                    this.mixToTile = (<IAsciiArtPostProcessOptions>options).mixToTile || this.mixToTile;
                    this.mixToNormal = (<IAsciiArtPostProcessOptions>options).mixToNormal || this.mixToNormal;
                } 
            }

            this._asciiArtFontTexture = new AsciiArtFontTexture(name, font, caracterSet, camera.getScene());
            var textureSize = this._asciiArtFontTexture.getSize();

            this.onApply = (effect: BABYLON.Effect) => {
                effect.setTexture("asciiArtFont", this._asciiArtFontTexture);
				
                effect.setFloat4("asciiArtFontInfos", 
                    this._asciiArtFontTexture.charSize, 
                    caracterSet.length, 
                    textureSize.width, 
                    textureSize.height);

                effect.setFloat4("asciiArtOptions",
                    this.width, 
                    this.height,
                    this.mixToNormal, 
                    this.mixToTile);
            };
        }
    }
}