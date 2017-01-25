/// <reference path="./Letter.ts"/>
module DIALOG{
    /**
     * class to retrieve Letters from Mesh factories.  load your own fonts to TOWER_OF_BABEL.MeshFactory.MODULES
     */
    export class FontFactory{
        /**
         * Initialize the stock Typeface modules, could not do in getLetters, without passing scene everytime.
         * When both Font2D & Font3D are found, Label.DEFAULT_FONT_MODULE is set to Font2D.
         * @param {BABYLON.Scene} scene - needed to instance meshes.
         */
        public static loadStockTypefaces(scene : BABYLON.Scene){
            if (typeof (Font3D) !== 'undefined'){
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font3D.MeshFactory(scene));
                Label.DEFAULT_FONT_MODULE = 'Font3D'; 
                BABYLON.Tools.Log('Font3D loaded');
            }
            if (typeof (Font2D) !== 'undefined'){ 
               TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font2D.MeshFactory(scene));
               Label.DEFAULT_FONT_MODULE = 'Font2D'; 
                BABYLON.Tools.Log('Font2D loaded');
            }
            
            // see if an extensions is found
            if (typeof (Font3D_EXT) !== 'undefined'){
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font3D_EXT.MeshFactory(scene));
                BABYLON.Tools.Log('Font3D_EXT loaded');
            }
            if (typeof (Font2D_EXT) !== 'undefined'){ 
               TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font2D_EXT.MeshFactory(scene));
                BABYLON.Tools.Log('Font2D_EXT loaded');
            }
        }
                
        /**
         * Get an array of meshes <Letter> which match match the string passed
         * @param {string} letters - list of characters
         * @param {string} typeface - the identifier of the font to retrieve
         * @param {BABYLON.Material} customMaterial - optional material to override with, stock material probably 'White'
         * @return {Array} - Same length letters arg. ' ', space chars & those not found are null.
         */
        public static getLetters(letters : string, typeface : string, customMaterial? : BABYLON.Material) : Array<Letter> {
            var ret = new Array<Letter>(letters.length);
            var isTypeface3D = typeface.indexOf("3D") > -1;
            var fullTypeface : string;

            for (var i = letters.length - 1; i >= 0; i--){
                fullTypeface = typeface + ((letters[i].charCodeAt(0) > 128) ? "_EXT" : "");
                
                // no lookup for space, since it would generate an error, since not an actual mesh
                var letter =  <Letter> ((letters[i] !== ' ') ? TOWER_OF_BABEL.MeshFactory.instance(fullTypeface, letters[i]) : null);
                
                // check if typeface was loaded
                if (letter){
                    // check if character found in typeface
                    if (letter !== null){
                        letter.material = customMaterial ? customMaterial : DialogSys.CURRENT_FONT_MAT_ARRAY[(isTypeface3D || DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
                        if (isTypeface3D){
                            letter.scaling.z = DialogSys.DEPTH_SCALING_3D;
                        }
                    }
                
                }else letter = null; // typeface module not loaded, make calling code not have to care, at least
                
                ret[i] = letter;
            }
            return ret;
        }
    }
}