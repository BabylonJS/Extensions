/// <reference path="./Panel.ts"/>
/// <reference path="./Label.ts"/>
module DIALOG{
    export class Button extends Label{
        // these are the look and feel materials to use for buttons when selected or not
        public static MAT           : BABYLON.MultiMaterial;
        public static SELECTED_MAT  : BABYLON.MultiMaterial;
       
        // group for when this is a radio button
        private _group : RadioGroup;
        
        // afterRender items
        private _chngInProgress = false;
        
        /**
         * @param {string} label - The text to display on the button.
         * @param {number} _button_type - Either Button.ACTION_BUTTON or Button.RADIO_BUTTON
         * @param {string} typeFace - Optional module name of the font to use instead of default
         */
        constructor(label: string, public _button_type = Button.ACTION_BUTTON, typeFace? : string){
            super(label, typeFace, null, true);
            
            // initialize the 2 materials for button on first call
            if (!Button.MAT){
                var multiMaterial = new BABYLON.MultiMaterial("button", DialogSys._scene);
                multiMaterial.subMaterials.push(DialogSys.GREY [1]   ); // for sides, culling off
                multiMaterial.subMaterials.push(DialogSys.GREY [0]   ); // for back
                Button.MAT = multiMaterial;

                multiMaterial = new BABYLON.MultiMaterial("button selected", DialogSys._scene);
                multiMaterial.subMaterials.push(DialogSys.ORANGE[1]); // for sides, culling off
                multiMaterial.subMaterials.push(DialogSys.GREY [0]); // for back
                Button.SELECTED_MAT = multiMaterial;
            }
            
            // customize settings for buttons            
            this.setBorderVisible(true);
            this.borderInsideVert  *= 1.5;
            this.horizontalMargin *= 1.5;
            this.verticalMargin   *= 1.5;
            this.setFontSize(0.65);
            this.setSelected(false); // assigns the multi material too
            this.enableButton(true);   // assigns the material of the letters too
            
            var ref = this;
            this.registerPickAction(
                function () {
                    if (!ref._panelEnabled) return;               
                    ref.setSelected(true); 
                }
            );
            
            //register after Renderer, when Button.ACTION_BUTTON
            if (this._button_type === Button.ACTION_BUTTON){
                super.registerAfterRender(Button._delayedStart);
            }
        }
         /**
         * _delayedStart() registered only for Button.ACTION_BUTTON types
         */
        private static _delayedStart(mesh: BABYLON.AbstractMesh) : void {
            var asButton = <Button> mesh;
            if (asButton._chngInProgress){
                asButton._chngInProgress = false;
                asButton.setSelected(false);  // after delay change back to un-selected           
                if (asButton._callback) asButton._callback(asButton);
            
            }else if (asButton.material !== Button.MAT){
                asButton._chngInProgress = true;
            }
        }
        // =============================== Selection / Action Methods ================================
        /**
         * Indicate whether button is selected or not.  Callable in user code regardless of enabled or not.
         * Visibly changes out the material to indicate button is selected or not.
         * @param {boolean} selected - new value to set to
         * @param {boolean} noCallbacks - when true, do nothing in addition but change material.
         * Used in constructor and by after renderer to unselect after click.
         */
        public setSelected(selected : boolean, noCallbacks? :boolean) {
            this._selected = selected;
            this.material = selected ? Button.SELECTED_MAT : Button.MAT;
            if (!noCallbacks){
                if (this._group) this._group.reportSelected(this);               
            }
        }
        
        /**
         * Method to indicate clicks should be proecessed. Also assigns material of the letters.
         * Sets the member _panelEnabled in BasePanel.  NOT using 'enabled', since already in use by Babylon.
         * DO NOT change to 'set Enabled' due to that.
         * @param {boolean} enabled - New value to assign
         */
        public enableButton(enabled : boolean) {
            this._panelEnabled = enabled;
            this.setLetterMaterial(enabled ? DialogSys.BLACK : DialogSys.LT_GREY);
        }
        
        /**
         * Setter of the member identifying the radio group the button belongs to.  Called by Menu.
         * @param
         */
        public set radioGroup(group : RadioGroup) {
            if (this._button_type === Button.RADIO_BUTTON){
                this._group = group;
            
            }else BABYLON.Tools.Error("Button not radio type");
        }
        // ======================================== Overrides ========================================       
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        public dispose(doNotRecurse?: boolean): void {
            super.dispose(false);
            this.unregisterAfterRender(Button._delayedStart);
        }
        // ========================================== Enums  =========================================    
        private static _ACTION_BUTTON = 0; 
        private static _RADIO_BUTTON  = 2; 

        public static get ACTION_BUTTON(): number { return Button._ACTION_BUTTON; }
        public static get RADIO_BUTTON (): number { return Button._RADIO_BUTTON ; }
    }
}