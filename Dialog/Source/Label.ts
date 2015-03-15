/// <reference path="./Panel.ts"/>
/// <reference path="./Letter.ts"/>
module DIALOG{
    export class Label extends BasePanel{
        private static FULL_SCALE_PLACEHOLDER_WIDTH  = 0.3;
        private static FULL_SCALE_PLACEHOLDER_HEIGHT = 0.5;
        private static BOLD_MULT = 1.4;
        
        public static DEFAULT_FONT_MODULE : string;
        
        private _fontSize = 1;
        private _bold = false;
        public  _isTypeface3D :boolean; // public for CheckBox sub-class
        /**
         * Sub-class of BasePanel containing a set of Letter subPanels.
         * @param {string} letters - The list of characters to use.  Those not found in typeface & ' ' result in subPanels of null.
         * @param {string} typeFace - The module name to use for Meshes.  User modules must be loaded via:
         *                            TOWER_OF_BABEL.MeshFactory.MODULES.push(new myFont3D.MeshFactory(scene));
         * @param {BABYLON.Material} customMaterial - Optional material to use, otherwise DialogSys.CURRENT_FONT_MAT_ARRAY is used.
         * @param {boolean} _button - Indicate this is to be used as a button, so install no border material.
         */
        constructor(letters: string, typeFace = Label.DEFAULT_FONT_MODULE, customMaterial? : BABYLON.Material, _button? : boolean){
            super(letters, DialogSys._scene, null, null, false, Panel.LAYOUT_HORIZONTAL, _button);
            this._isTypeface3D = typeFace.indexOf("3D") > -1;
             
            var meshes = FontFactory.getLetters(letters, typeFace, customMaterial);
             
            // add all meshes as subPanels, null or not
            for (var i = 0; i < meshes.length; i++){
                this.addSubPanel(meshes[i]);
            }
            // align in Z dim, so 3D letters, re scaled by factory, are positioned at 0 in Z.  No effect in 2D.
            this.setUniformZ(0);
             
            // spaces are null, override values for placeholder
            this.placeHolderWidth  = Label.FULL_SCALE_PLACEHOLDER_WIDTH;
            this.placeHolderHeight = Label.FULL_SCALE_PLACEHOLDER_HEIGHT;
            
            if (! _button){
                this.material = DialogSys.ORANGE[1];
            }    
        }
        // =================================== Appearance Methods ====================================
        /**
         * Change the scaling.x & scaling.y of each letter mesh.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         */
        public setFontSize(size : number, relative? : boolean){
            if (relative){
                this._fontSize *= size;
            }else{
                this._fontSize = size;
            }
            this._scaleLetters();
        }
        
        /**
         * Change the scaling.x of each letter, based on the bold setting
         * @param {boolean} bold - when true make wider in scaling.x than in scaling.y
         */
        public setBold(bold : boolean){
            this._bold = bold;
            this._scaleLetters();
        }
        
        /**
         * Change the scaling.x & scaling.y of each letter mesh.
         * @param {number} x - Value for the X dimension
         * @param {number} y - Value for the Y dimension
         */
        private _scaleLetters(){
            var x = this._bold ? this._fontSize * Label.BOLD_MULT : this._fontSize;
            var letters = this.getSubPanels();
            for (var i = letters.length - 1; i >= 0; i--){
                if (letters[i] !== null){
                    letters[i].scaling.x = x;
                    letters[i].scaling.y = this._fontSize;
                }
            }
            this.placeHolderWidth = Label.FULL_SCALE_PLACEHOLDER_WIDTH   * x;
            this.placeHolderHeight = Label.FULL_SCALE_PLACEHOLDER_HEIGHT * this._fontSize;
            this.invalidateLayout();
        }
        /**
         * Set the material of each letter.
         * @param {Array<BABYLON.StandardMaterial>} matArray - An array of materials to choose from based on geometry
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         */
        public setLetterMaterial(matArray : Array<BABYLON.StandardMaterial>){
            var mat = matArray[this._isTypeface3D ? 0 : 1];
            
            var letters = this.getSubPanels();
            for (var i = letters.length - 1; i >= 0; i--){
                if (letters[i] !== null){
                    letters[i].material = mat;
                }
            }
        }
        // ======================================== Overrides ========================================
        /**
         * @override
         * Restrict adds of only Letters.
         */
        public addSubPanel(sub : BasePanel, index? :number) : void{
            if (sub && !(sub instanceof Letter)){
                BABYLON.Tools.Error("Labels can contain only letters");
                return;
            }
            super.addSubPanel(sub, index);
        }
    }
}