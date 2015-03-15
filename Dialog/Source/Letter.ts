/// <reference path="./Panel.ts"/>
module DIALOG{
    export class Letter extends BasePanel{
        
        // These are similar to those generated in BoundingBox, except they are done without regard to scaling.
        // They are only done ONCE.
        private _minWorld : BABYLON.Vector3;
        private _maxWorld : BABYLON.Vector3; 
        
        /**
         * Full BABYLON.Mesh parameter to support cloning.  Defaulting on BasePanel parameter additions.
         */
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.Mesh, doNotCloneChildren?: boolean){
            // Panel's _layoutDir, _button,  & _topLevel constructor parms, forced to default to (LAYOUT_HORIZONTAL, false, & false)
            super(name, scene, parent, source, doNotCloneChildren); 
            
            // remove inner margins
            this.horizontal_margin = 0;
            this.vertical_margin   = 0;
            
            // initially not visible.  Changed in first call to _calcRequiredSize.  Elliminates messy
            // first appearance, when dynamically adding panels after the first layout of top level panel.
            this.visibility = 0;
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
                
                this.visibility = 1;
            }
            
            this._maxAboveOrigin.x = this._maxWorld.x * this.scaling.x;
            this._maxAboveOrigin.y = .682             * this.scaling.y; // H, T, I, etc
            this._maxAboveOrigin.z = this._maxWorld.z * this.scaling.z;
            
            this._minBelowOrigin.x = this._minWorld.x * this.scaling.x;
            this._minBelowOrigin.y = -0.23            * this.scaling.y; // g is the lowest
            this._minBelowOrigin.z = this._minWorld.z * this.scaling.z;
         }
        
        public addSubPanel(sub : Panel, index? :number) : void{
            BABYLON.Tools.Error("Letters can have no sub-panels");
        }
        
        public getSubPanel() : Array<Panel>{ return <Array<Panel>> null; }
        public removeAt(index : number, doNotDispose? : boolean) : void{}
        public removeAll(doNotDispose? : boolean) : void{}
     }
}