/// <reference path="./Panel.ts"/>
module DIALOG{
    /**
     * A way to map a mesh into a panel.  Very similar to Letter, except it is an actual sub-class of BasePanel.
     */
    export class MeshWrapperPanel extends BasePanel{
        
        // These are similar to those generated in BoundingBox, except they are done without regard to scaling.
        // They are only done ONCE.  Public for sub-classing
        public _minWorld : BABYLON.Vector3;
        public _maxWorld : BABYLON.Vector3;
        
        constructor(public _inside : BABYLON.Mesh, private _needBorders? : boolean){
            // Panel's _layoutDir & _topLevel constructor parms, forced to default to LAYOUT_HORIZONTAL & false
            super(_inside.name + "_wrapper", _inside.getScene() );
            _inside.parent = this;
            
        }        
        
        public setMaterial(mat : BABYLON.StandardMaterial) : void{
            this._inside.material = mat;
        }
        // ======================================== Overrides ========================================
        /**
         * @override
         */
        public useGeometryForBorder() : boolean{
            return this._needBorders;
        }

        /**
         * @override
         * No actual layout of sub-panels.  Need to set the _actual members, as super does though. 
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
         */
        public _calcRequiredSize() : void{ 
            // done only once.  Deferred till now, since putting this instead of setVerticesData is never called in clones
            if (!this._minWorld){
                var extend = BABYLON.Tools.ExtractMinAndMax(this._inside.getVerticesData(BABYLON.VertexBuffer.PositionKind), 0, this._inside.getTotalVertices());
                this._minWorld = extend.minimum;
                this._maxWorld = extend.maximum;                
            }
            
            this._maxAboveOrigin.x = this._maxWorld.x * this._inside.scaling.x;
            this._maxAboveOrigin.y = this._maxWorld.y * this._inside.scaling.y;
            this._maxAboveOrigin.z = this._maxWorld.z * this._inside.scaling.z;
            
            if (this._needBorders){                      
                this._maxAboveOrigin.x += this.horizontalMargin;
                this._maxAboveOrigin.y += this.verticalMargin;
            }
            
            this._minBelowOrigin.x = this._minWorld.x * this._inside.scaling.x;
            this._minBelowOrigin.y = this._minWorld.y * this._inside.scaling.y;
            this._minBelowOrigin.z = this._minWorld.z * this._inside.scaling.z;
            
            if (this._needBorders){                      
                this._minBelowOrigin.x -= this.horizontalMargin;
                this._minBelowOrigin.y -= this.verticalMargin;
            }
         }

        /** 
         * @override 
         * Change layermask of this._inside and any children
         */
        public setLayerMask(maskId :number){
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--){
                (<BABYLON.AbstractMesh> insideKids[i]).layerMask = maskId;
                (<BABYLON.AbstractMesh> insideKids[i]).setEnabled(maskId !== DialogSys.SUSPENDED_DIALOG_LAYER);
            }
            this._inside.layerMask = maskId;
            this._inside.setEnabled(maskId !== DialogSys.SUSPENDED_DIALOG_LAYER);
            
            this.layerMask = maskId;
            this.setEnabled(maskId !== DialogSys.SUSPENDED_DIALOG_LAYER);
        }
        
        /**
         * @override
         * Do the entire hierarchy, in addition
         */ 
        public freezeWorldMatrixTree() {
            this.freezeWorldMatrix();
            this._inside.freezeWorldMatrix();
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--){
                 (<BABYLON.Mesh> insideKids[i]).freezeWorldMatrix();
            }
        }
        
        /**
         * @override
         * Do the entire hierarchy, in addition
         */ 
         public unfreezeWorldMatrixTree() {
            super.unfreezeWorldMatrix();
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--){
                 (<BABYLON.Mesh> insideKids[i]).unfreezeWorldMatrix();
            }
        }
        
        /** @override */
        public addSubPanel(sub : BasePanel, index? :number) : void{
            BABYLON.Tools.Error("wrappers can have no sub-panels");
        }
        
        /** @override */ public getSubPanel() : Array<Panel>{ return <Array<Panel>> null; }
        /** @override */ public removeAt(index : number, doNotDispose? : boolean) : void {}
        /** @override */ public removeAll(doNotDispose? : boolean) : void {}
        
        /** @override */
        public setSubsFaceSize(size : number, relative? : boolean) : BasePanel{
            if (relative){
                this._xyScale *= size;
            }else{
                this._xyScale = size;
            }
            this._inside.scaling.x = this._xyScale;
            this._inside.scaling.y = this._xyScale;
            
            this.invalidateLayout();
            
            return this;
        }
        
     }
}