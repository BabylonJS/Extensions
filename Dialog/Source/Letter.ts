/// <reference path="./Panel.ts"/>
module DIALOG{
    export class Letter extends BasePanel{
        public static LETTER_ABOVE = 0.682;
        // values for max above & min below; defaults good for most; Fontfactory overrides for extended letters
        public maxAboveY =  Letter.LETTER_ABOVE; // H, T, I, etc
        public minBelowY = -0.23;                // g is the lowest   
        
        // These are similar to those generated in BoundingBox, except they are done without regard to scaling.
        // They are only done ONCE.
        private _minWorld : BABYLON.Vector3;
        private _maxWorld : BABYLON.Vector3; 
        
        // indicate this letter is really a result of merged meshes
        public _consolidated = false;
        
        /**
         * Full BABYLON.Mesh parameter to support cloning.  Defaulting on BasePanel parameter additions.
         */
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.Mesh, doNotCloneChildren?: boolean){
            // Panel's _layoutDir, _button,  & _topLevel constructor parms, forced to default to (LAYOUT_HORIZONTAL, false, & false)
            super(name, scene, parent, source, doNotCloneChildren); 
            
            // remove inner margins
            this.horizontalMargin = 0;
            this.verticalMargin   = 0;
            
            // initially not visible.  Changed in first call to _calcRequiredSize.  Elliminates messy
            // first appearance, when dynamically adding panels after the first layout of top level panel.
            this.visibility = 0;
            
            this.setBorderVisible(true); // set so can reappear, once disolved
        }
        // ======================================== Overrides ========================================       
        /**
         * @override
         * The letter is the geometry.
         */
        public useGeometryForBorder() : boolean{
            return false;
        }

        /**
         * @override
         * No actual layout of subs.  Need to set the _actual members, as super does though. 
         */
        public _layout(widthConstraint : number, heightConstraint : number): void {
            if (!this._actualAboveOriginX){
                this.visibility = 1;                
            }
            this._actualAboveOriginX = this._maxAboveOrigin.x;
            this._actualAboveOriginY = this._maxAboveOrigin.y;
            this._actualBelowOriginX = this._minBelowOrigin.x;
            this._actualBelowOriginY = this._minBelowOrigin.y;
        }
        
        /**
         * @override
         * No subs to deal with.  Use .682 for _maxAboveOrigin.y & -.23 for _minBelowOrigin.y.
         * This way all letters line up, and all lines of same scale always same height. 
         */
        public _calcRequiredSize() : void{ 
            // done only once.  Deferred till now, since putting in setVerticesData is never called in clones
            if (!this._minWorld){
                var extend = BABYLON.Tools.ExtractMinAndMax(this.getVerticesData(BABYLON.VertexBuffer.PositionKind), 0, this.getTotalVertices());
                this._minWorld = extend.minimum;
                this._maxWorld = extend.maximum;
            }
            
            this._maxAboveOrigin.x = this._maxWorld.x * (this._consolidated ? 1             : this.scaling.x);
            this._maxAboveOrigin.y = this.maxAboveY   * (this._consolidated ? this._xyScale : this.scaling.y);
            this._maxAboveOrigin.z = this._maxWorld.z * this.scaling.z;
            
            this._minBelowOrigin.x = this._minWorld.x * (this._consolidated ? 1             : this.scaling.x);
            this._minBelowOrigin.y = this.minBelowY   * (this._consolidated ? this._xyScale : this.scaling.y);
            this._minBelowOrigin.z = this._minWorld.z * this.scaling.z;
         }
        
        /**
         * @override
         * No meaning for letters
         */
        public addSubPanel(sub : Panel, index? :number) : void{
            BABYLON.Tools.Error("Letters can have no sub-panels");
        }
        
        /** @override */ public getSubPanel() : Array<Panel>{ return <Array<Panel>> null; }
        /** @override */ public removeAt(index : number, doNotDispose? : boolean) : void{}
        /** @override */ public removeAll(doNotDispose? : boolean) : void{}
     }
     // ========================================= Statics =========================================
//    public static sizeToLetterHeight(target : BasePanel) : BasePanel){
//        var aspectRatio = target
//    }     
}