/// <reference path="./Panel.ts"/>
/// <reference path="./Letter.ts"/>
module DIALOG{
    export class Label extends BasePanel{        
        public static DEFAULT_FONT_MODULE : string;
        
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
            
            if (! _button){
                this.material = DialogSys.ORANGE[1];
                this.verticalMargin = 0.02;
            }    
        }
        // =================================== Appearance Methods ====================================
        /**
         * Change the scaling.x & scaling.y of each letter mesh.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {Label} For convenience of stringing methods together
         */
        public setFontSize(size : number, relative? : boolean) : BasePanel{
            return this.setSubsFaceSize(size, relative);
        }

        /**
         * Set the material of each letter.
         * @param {Array<BABYLON.StandardMaterial>} matArray - An array of materials to choose from based on geometry
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         * @return {Label} For convenience of stringing methods together
         */
        public setLetterMaterial(matArray : Array<BABYLON.StandardMaterial>, selectedText? : string) : Label{
            var mat = matArray[(this._isTypeface3D || DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
            var letters = this.getSubPanels();
            
            var startIdx = -1;
            var endIdx   : number;            
            if (selectedText){
                startIdx = this.name.indexOf(selectedText);
                endIdx = startIdx + selectedText.length;    
            }
            
            if (startIdx === -1){
                startIdx = 0;
                endIdx = letters.length - 1;
            }
            
            for (var i = startIdx; i <= endIdx; i++){
                if (letters[i] !== null){
                    letters[i].material = mat;
                }
            }
            return this;
        }
        // ======================================== Overrides ========================================
        /** @override */ public getFullScalePlaceholderWidth () : number { return 0.15; }
        
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