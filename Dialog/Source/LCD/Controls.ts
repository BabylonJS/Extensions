/// <reference path="../Panel.ts"/>
/// <reference path="../MeshWrapperPanel.ts"/>
module DIALOG{
    var factory : DigitParts.MeshFactory;
    
    class DigitWtLogic extends MeshWrapperPanel{
        public static _maxWorld : BABYLON.Vector3;
        private static _minVisibility = 0;
        
        constructor(){
            if (!factory){
                factory = new DigitParts.MeshFactory(DialogSys._scene);
                
                // there is only ever 1 version from factory of a node, so get now for measuring
                var inst = <DigitParts.Geometry> factory.instance('Geometry');
                var maxX = Panel.ExtractMax(inst.dot).x + inst.dot.position.x + 0.05;
                var maxY = Panel.ExtractMax(inst.top).y + inst.top.position.y;
                DigitWtLogic._maxWorld = new BABYLON.Vector3(maxX, maxY, 0);
                inst.dispose(false);
            }
            
            // call super with a clone of DigitWtLogic._innerMesh
            super(factory.instance('Geometry') );
            
            this.setMaterial(LCD.MAT);
            
            // need to set min/maxWorlds outselves, since done using children
            this._minWorld = BABYLON.Vector3.Zero();
            this._maxWorld = DigitWtLogic._maxWorld;
            
            // initialize to 0, but not a visible 0
            this.setDigit('0', false);
        }

        public setDigit(val : string, show0? : boolean, showDot? : boolean) : boolean{
            var geo = <DigitParts.Geometry> this._inside;
            if ('E0123456789-'.indexOf(val) === -1 || val.length !== 1){
                BABYLON.Tools.Error(val + ' is not a valid setting for Digit');
                return;
            }
            var visible0 = show0 && '0'.indexOf(val) !== -1;
            geo.botLeft.visibility = ('E268'     .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.topLeft.visibility = ('E45689'   .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.top    .visibility = ('E2356789' .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.bottom .visibility = ('E235689'  .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.botRite.visibility = ('13456789' .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.topRite.visibility = ('1234789'  .indexOf(val) !== -1 || visible0) ? 1 : DigitWtLogic._minVisibility;
            geo.center .visibility = ('E2345689-'.indexOf(val) !== -1            ) ? 1 : DigitWtLogic._minVisibility;
            geo.dot    .visibility = showDot ? 1 : DigitWtLogic._minVisibility;
        }        
        // ======================================== Overrides ========================================
        public setMaterial(mat : BABYLON.StandardMaterial) : void{
            var geo = <DigitParts.Geometry> this._inside;
            geo.botLeft.material = mat;
            geo.topLeft.material = mat;
            geo.top    .material = mat;
            geo.bottom .material = mat;
            geo.botRite.material = mat;
            geo.topRite.material = mat;
            geo.center .material = mat;
            geo.dot    .material = mat;
        }
        /**
         * @override
         * Do not want _innerMesh static to disposed of, for future cloning duty
         */
        public dispose(doNotRecurse? : boolean) : void{
            super.dispose();
        }
    }
    //================================================================================================
    //================================================================================================
    export class LCD extends BasePanel{
        public static MAT : BABYLON.StandardMaterial;
        
        private _value : number;
        
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.  
         */
        constructor(name : string, private _nDigits : number, private _alwaysDot? :boolean, private _fixed? : number){
            super(name, DialogSys._scene);
            this.name = name;
             
            if (!LCD.MAT){
                LCD.MAT = DialogSys.BLACK[(DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
            }
            this.material = LCD.MAT;
            
            // add all meshes as subPanels, null or not
            for (var i = 0; i < _nDigits; i++){
                this.addSubPanel(new DigitWtLogic() );
            }
            this._value = 0;
        }
        
        public set value(value : number){
            this._value = value;
            
            
            var asString = this._fixed ? value.toFixed(this._fixed) : value.toString();
            var nDigits = asString.length;

            // reduce nDigits if none of them is a '.', otherwise put a '.' at the end
            if (asString.indexOf('.') !== -1){
                nDigits--;
            }else if (this._alwaysDot){
               asString += '.';
            } 
            
            // no matter what, gonna need the sub-panels
            var subs = this.getSubPanels();
            
            // check for and response to a number too big to display
            if (nDigits > this._nDigits){                
                (<DigitWtLogic> subs[0]).setDigit('E');
                for (var i = 1; i < this._nDigits; i++){
                    (<DigitWtLogic> subs[i]).setDigit('0', false);
                }
                return;
            }

            var unUsed = this._nDigits - nDigits;
            
            // fill unused digits with non-showing 0
            for (var i = 0; i < unUsed; i++){
                (<DigitWtLogic> subs[i]).setDigit('0', false);
            }
            
            // show rest one at a time, unless next on is a '.'
            var d = 0;
            for (var i = unUsed; i < this._nDigits; i++){
                var dotNext = asString.charAt(d + 1) === '.';
                (<DigitWtLogic> subs[i]).setDigit(asString.charAt(d++), true, dotNext);
                if (dotNext) d++;
            }
        }
        
        public get value() : number { return this._value; }
    }
    //================================================================================================
    //================================================================================================
    export class NumberScroller extends BasePanel{
        // these are the look and feel materials to use for buttons when selected or not
        public static MAT           : BABYLON.MultiMaterial;
        public static SELECTED_MAT  : BABYLON.MultiMaterial;
        
        private _display : LCD;
        private _value : number;
        private _downButton : Letter;
        private _upButton   : Letter;
                
        // after Renderer items
        private _chngInProgress = false;
        
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.  
         */
        constructor(label : string, _nDigits : number, public minValue : number, public maxValue : number, initialValue : number, public increment = 1){
            super(label, DialogSys._scene);
            
            if (!NumberScroller.MAT){
                var multiMaterial = new BABYLON.MultiMaterial("button", DialogSys._scene);
                multiMaterial.subMaterials.push(DialogSys.BLACK [0]   ); // for sides, culling off
                multiMaterial.subMaterials.push(DialogSys.BLACK [0]   ); // for back
                NumberScroller.MAT = multiMaterial;

                multiMaterial = new BABYLON.MultiMaterial("button selected", DialogSys._scene);
                multiMaterial.subMaterials.push(DialogSys.BLACK[0]); // for sides, culling off
                multiMaterial.subMaterials.push(DialogSys.ORANGE [0]); // for back
                NumberScroller.SELECTED_MAT = multiMaterial;
            }
            
            if (increment <= 0){
                BABYLON.Tools.Error('increment must positive');
                return;
            }
            
            if (this.minValue + increment > this.maxValue){
                BABYLON.Tools.Error('min value + increment must be <= max value');
                return;
            }
            
            if (initialValue < this.minValue || initialValue > this.maxValue){
                BABYLON.Tools.Error('initialValue not within min & max values');
                return;
            }
            
            var alwaysDot = Math.floor(this.minValue) !== this.minValue || Math.floor(this.maxValue) !== this.maxValue || Math.floor(this.increment) !== this.increment;
            
            if (!alwaysDot && Math.floor(initialValue) !== initialValue){
                BABYLON.Tools.Error('initialValue must be integer minValue, maxValue, & increment are');
                return;
            }
            
            // do the display first, since not sure if mesh factory instanced
            this._display = new LCD(name + '-lcd', _nDigits, alwaysDot);
            this._display.setBorderVisible(true);
            this._display.verticalAlignment = Panel.ALIGN_VCENTER;
            this.value = initialValue;
            
            this._display._calcRequiredSize();
            
            if (label && label != null && label.replace(' ', '').length > 0){
                var labelPanel = new Label(label);
                labelPanel.verticalAlignment = Panel.ALIGN_BOTTOM;
                this.addSubPanel(labelPanel);
            }
            this.addSubPanel(this._downButton = this._getButton('Down') );
            this.addSubPanel(this._display);
            this.addSubPanel(this._upButton   = this._getButton('Up') );
            
            super.registerAfterRender(NumberScroller._normalMaterials);
            this.setBorderVisible(true); // nothing shown, needed for after renderer to always fire
        }  
        // ======================================== Overrides ========================================       
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        public dispose(doNotRecurse?: boolean): void {
            super.dispose(false);
            this.unregisterAfterRender(NumberScroller._normalMaterials);
        }
        // =============================== Selection / Action Methods ================================
        private _getButton(className : string) : Letter{
            var ret = <Letter> factory.instance(className);
            var halfHeight = Panel.ExtractMax(ret).y;
            ret.verticalAlignment = Panel.ALIGN_VCENTER;
            ret.maxAboveY =  halfHeight;
            ret.minBelowY = -halfHeight;
            ret.material = NumberScroller.MAT;
            
            var ref = this;
            ret.registerPickAction(
                function () {
                    if (!ret._panelEnabled) return;
                    ret.material = NumberScroller.SELECTED_MAT;
                                      
                    if (className === 'Down') ref._decrement(); 
                    else ref._increment(); 
                }
            );
            return ret;
        }
        /**
         * After renderer
         */
        private static _normalMaterials(mesh: BABYLON.AbstractMesh) : void {
            var asScroller = <NumberScroller> mesh;
            if (asScroller._chngInProgress){
                asScroller._chngInProgress = false;
                asScroller._downButton.material = NumberScroller.MAT;
                asScroller._upButton  .material = NumberScroller.MAT;
            
            }else if (asScroller._downButton.material !== NumberScroller.MAT || asScroller._upButton.material !== NumberScroller.MAT){
                asScroller._chngInProgress = true;
            }
        }
        // ============================== value getter/setters Methods ===============================
        private _increment(){
            if (this.value + this.increment <= this.maxValue){
                this.value += this.increment;
            }
        }
        
        private _decrement(){
            if (this.value - this.increment >= this.minValue){
                this.value -= this.increment;
            }
        }
        
        public set value(val : number){
            this._display.value = val;
        }               
        public get value() : number { return this._display.value; }
        
    }
}