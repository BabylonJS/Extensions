module DIALOG{
    export interface RadioGroup {
        reportSelected(panel : BasePanel) : void;
    }
    
    export class BasePanel extends BABYLON.Mesh{   
        // Instance level Look & Feel (must call invalidateLayout() once visible)
        public horizontalMargin = 0.1; 
        public verticalMargin   = 0.1; 
                 
        public horizontalAlignment =  Panel.ALIGN_LEFT;
        public verticalAlignment   =  Panel.ALIGN_TOP;
        
        // used to control the width of the border in the XY dimension
        public borderInsideVert = 0.05;
        public borderDepth = DialogSys.DEPTH_SCALING_3D;
        
        public stretchHorizontal = false;
        public stretchVertical   = false;
        
        private static BOLD_MULT = 1.4;
        private _bold = false;
        
        public placeHolderWidth  : number;
        public placeHolderHeight : number;
        
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        // members to hold the result of the required size calc
        // any that are public are only so for sub-classing
        public _maxAboveOrigin    = BABYLON.Vector3.Zero();
        public _minBelowOrigin    = BABYLON.Vector3.Zero(); // expressed as either 0, or a negative number of the smallest vertex in each dimension
        
        // used by parent panel to assign position when stretched
        public _actualAboveOriginX : number;
        public _actualAboveOriginY : number;
        public _actualBelowOriginX : number;
        public _actualBelowOriginY : number;
                
        private _nStretchers = [0,0];
        public  _xyScale = 1; // only publix for MeshWrapperPanel
        private _dirty = true;
        private _visibleBorder = false;
        private _bRenderer : () => void;
        
        // common members used by various buttons, public for sub-classing
        public _pickFunc : () => void; // only public for access in PickAction
        public _callback : (control: BasePanel) => void;
        public _panelEnabled  = true;
        public _selected = false;
        
        // statics for borders
        private static _NORMALS = [
                    0,0,-1,0,0,-1,0.7071,0,-0.7071,0.7071,0,0.7071,0.7071,0,-0.7071,0,0,1,0.7071,0,0.7071,-0.7071,0,-0.7071,-0.7071,0,0.7071,-0.7071,0,0.7071,0,0,1,0,0,-1,-0.7071,0,-0.7071,0,-0.7071,-0.7071,0,0,-1,0,0.7071,0.7071,0,0,1,-0.7071,0,-0.7071,-0.5773,0.5773,-0.5773,-0.5773,
                    0.5773,0.5773,0.7071,0,0.7071,0.5773,0.5773,0.5773,0.5773,0.5773,-0.5773,-0.7071,0,0.7071,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,-0.5773,0,-0.7071,0.7071,0.7071,0,-0.7071,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.5773,0,0.7071,-0.7071,0,0.7071,-0.7071,0,0,1,0,-0.7071,
                    -0.7071,-0.7071,0,-0.7071,0,0.7071,0.7071,-0.7071,0,0.7071,0.7071,0,-0.7071,0,-0.7071,0.7071,0.7071,0,0.7071 //,0,0,-1,   0,0,-1,   0,0,-1,   0,0,-1
                ];
        private static _TOP_LEVEL_NORMALS = [
                    0,0,-1,0,0,-1,0.7071,0,-0.7071,0.7071,0,0.7071,0.7071,0,-0.7071,0,0,1,0.7071,0,0.7071,-0.7071,0,-0.7071,-0.7071,0,0.7071,-0.7071,0,0.7071,0,0,1,0,0,-1,-0.7071,0,-0.7071,0,-0.7071,-0.7071,0,0,-1,0,0.7071,0.7071,0,0,1,-0.7071,0,-0.7071,-0.5773,0.5773,-0.5773,-0.5773,
                    0.5773,0.5773,0.7071,0,0.7071,0.5773,0.5773,0.5773,0.5773,0.5773,-0.5773,-0.7071,0,0.7071,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,-0.5773,0,-0.7071,0.7071,0.7071,0,-0.7071,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.5773,0,0.7071,-0.7071,0,0.7071,-0.7071,0,0,1,0,-0.7071,
                    -0.7071,-0.7071,0,-0.7071,0,0.7071,0.7071,-0.7071,0,0.7071,0.7071,0,-0.7071,0,-0.7071,0.7071,0.7071,0,0.7071,   0,0,-1,   0,0,-1,   0,0,-1,   0,0,-1
                ];
        
        private static _INDICES = [
                    0,1,2,3,4,2,5,3,6,7,8,9,10,9,8,11,7,12,13,1,14,15,5,16,17,18,19,20,21,22,23,24,25,26,24,23,27,28,29,30,18,17,15,30,31,13,25,24,4,0,2,6,3,2,32,5,6,12,7,9,16,10,8,14,11,12,28,27,1,28,1,33,34,25,13,34,13,14,21,5,35,1,13,33,21,20,5,36,19,15,36,15,16,36,17,19,37,20,22,5,
                    15,35,34,23,25,26,32,38,32,39,29,32,26,10,39,27,29,30,0,31,32,29,38,26,23,10,0,37,22,0,30,11,22,21,35,30,17,11,22,35,31,0,22,31,19,18,30,19,30,15,29,28,33,35,15,31,38,29,33,13,26,33,26,38,33,13,24,26 //,40,41,42,43,40,42
                ];
        private static _TOP_LEVEL_INDICES = [
                    0,1,2,3,4,2,5,3,6,7,8,9,10, 9,8,11,7,12,13,1,14,15,5,16,17,18,19,20,21,22,23,24,25,26,24,23,27,28,29,30,18,17,15,30,31,13,25,24,4,0,2,6,3,2,32,5,6,12,7,9,16,10,8,14,11,12,28,27,1,28,1,33,34,25,13,34,13,14,21,5,35,1,13,33,21,20,5,36,19,15,36,15,16,36,17,19,37,20,22,5,
                    15,35,34,23,25,26,32,38,32,39,29,32,26,10,39,27,29,30,0,31,32,29,38,26,23,10,0,37,22,0,30,11,22,21,35,30,17,11,22,35,31,0,22,31,19,18,30,19,30,15,29,28,33,35,15,31,38,29,33,13,26,33,26,38,33,13,24,26,40,41,42,43,40,42
                ];
        
            
        private _subs = new Array<BasePanel>(); // essentially same as children, but both type defined & in order of layout
        
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.Mesh, doNotCloneChildren?: boolean, private _layoutDir = Panel.LAYOUT_HORIZONTAL, private _button? : boolean, public _topLevel? : boolean){
            super(name, scene, parent, source, doNotCloneChildren);

            if (!Panel.BORDER_MAT){
                Panel.BORDER_MAT = DialogSys.GOLD[1]; // need no culling
            
                var multiMaterial = new BABYLON.MultiMaterial("Top Level mat", DialogSys._scene);
                multiMaterial.subMaterials.push(DialogSys.GOLD [1]   ); // for sides, culling off
                
                var transBlack = DialogSys.BLACK[0].clone("transBlack");
                transBlack.alpha =  0.3;
                multiMaterial.subMaterials.push(transBlack); // for back
                
                Panel.TOP_LEVEL_BORDER_MAT = multiMaterial;                
            }
            
            if (this.useGeometryForBorder() ){
                var needBack = this._topLevel || this._button;
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(1, 1), true );
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind  , needBack ? BasePanel._TOP_LEVEL_NORMALS :BasePanel._NORMALS, false);
                this.setIndices(needBack ? BasePanel._TOP_LEVEL_INDICES : BasePanel._INDICES);
                
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 40, 0, 168, this);
                if (needBack){
                    new BABYLON.SubMesh(1, 40, 4, 168, 6, this);
                       this.material = Panel.TOP_LEVEL_BORDER_MAT; 
                }else{
                    this.material = Panel.BORDER_MAT;
                }
                this.setBorderVisible(this._topLevel);           
            }
            
            if (this._topLevel){
                // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
                var ref = this;
                this._bRenderer = function(){ref._beforeRender();}
                super.registerBeforeRender(this._bRenderer);
            }
            this.placeHolderWidth  = this.getFullScalePlaceholderWidth ();
            this.placeHolderHeight = this.getFullScalePlaceholderHeight();
        }
        
        // =================================== Rendering Methods =====================================        
        private _computePositionsData(widthConstraint : number, heightConstraint : number) : number[]{
            var bWidth = this.borderInsideVert;

            var oRite = widthConstraint / 2;
            var oLeft = -oRite;
            
            var iRite = oRite - bWidth;
            var iLeft = oLeft + bWidth;
            
            var oHigh = heightConstraint /2;
            var oLow  = -oHigh;
            
            var iHigh = oHigh - bWidth;
            var iLow  = oLow  + bWidth;
            
            var depth = this.borderDepth;
            
            var ret = [
                     iRite, iHigh, 0
                    ,iRite, iLow , 0
                    ,oRite, iLow , 0
                    ,oRite, iHigh, depth
                    ,oRite, iHigh, 0
                    ,iRite, iHigh, depth
                    ,oRite, iLow , depth
                    ,oLeft, iHigh, 0
                    ,oLeft, iHigh, depth
                    ,oLeft, iLow , depth
                    ,iLeft, iLow , depth
                    ,iLeft, iHigh, 0
                    ,oLeft, iLow , 0
                    ,iLeft, oLow , 0
                    ,iLeft, iLow , 0
                    ,iLeft, oHigh, depth
                    ,iLeft, iHigh, depth
                    ,oLeft, iHigh, 0
                    ,oLeft, oHigh, 0
                    ,oLeft, oHigh, depth
                    ,oRite, iHigh, depth
                    ,oRite, oHigh, depth
                    ,oRite, oHigh, 0
                    ,oLeft, iLow , depth
                    ,oLeft, oLow , depth
                    ,oLeft, oLow , 0
                    ,iLeft, oLow , depth
                    ,oRite, iLow , 0
                    ,oRite, oLow , 0
                    ,oRite, oLow , depth
                    ,iLeft, oHigh, 0
                    ,iRite, oHigh, 0
                    ,iRite, iLow , depth
                    ,iRite, oLow , 0
                    ,oLeft, iLow , 0
                    ,iRite, oHigh, depth
                    ,oLeft, iHigh, depth
                    ,oRite, iHigh, 0
                    ,iRite, oLow , depth
                    ,oRite, iLow , depth
                ];
                    
            if (this._topLevel || this._button){
                if (this._button){
                    depth *= .1;
                }
                var back = [
                     iRite, iLow , depth
                    ,iRite, iHigh, depth
                    ,iLeft, iHigh, depth
                    ,iLeft, iLow , depth
                ];
                ret.push.apply(ret, back);
            }
            return ret;    
         }
         /**
         * beforeRender() registered only for toplevel Panels
         */
        private _beforeRender() : void {
            if (this._dirty){  
                this.layout();
            }
        }
        
        public setBorderVisible(show : boolean){
            this._visibleBorder = show;
            if (this.useGeometryForBorder) this.visibility = show ? 1 : 0;
        }
        
        public isBorderVisible() : boolean{ return this._visibleBorder; }
        // =============================== Selection / Action Methods ================================
        /**
         * 
         */
        public registerPickAction(func: () => void) : void {
            this._pickFunc = func;
                        
            // register pick action to call this._pickFunc
            this.actionManager = new BABYLON.ActionManager(DialogSys._scene);
            var ref = this;
            this.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
                function () {
                    ref._pickFunc(); 
                })
            );
        }
        
        public assignCallback(func: (control: BasePanel) => void): void {
            this._callback = func;
        }
        
        public isSelected() : boolean { return this._selected; }
        public isPanelEnabled() : boolean { return this._panelEnabled; }
         // ===================================== Layout Methods ======================================
        /**
         * signal to the beforeRenderer of the top level Panel, to re-layout on next call
         */
        public invalidateLayout(){
            this._dirty = true;
            var insideOf = <Panel> (<any> this.parent); // casting gymnastics for Typescript
            if (insideOf && typeof insideOf.invalidateLayout === "function") insideOf.invalidateLayout();
        } 
        
        public layout() : void{
            this._calcRequiredSize(); // determine what the requirements are for the entire heirarchy 
            this._layout(this.getReqdWidth(), this.getReqdHeight() );
        }
         
        /**
         * Layout the positions of this panel's sub-panels, based on this panel's layoutDir.
         * Only public for recursive calling across the instance hierarchy.
         * 
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        public _layout(widthConstraint : number, heightConstraint : number): void { 
            if (!this._validateAlignmnent(this._layoutDir === Panel.LAYOUT_HORIZONTAL) ) return;

            // adjust constraints down to only required, when not stretching
            widthConstraint  = this.stretchHorizontal ? widthConstraint  : this.getReqdWidth ();
            heightConstraint = this.stretchVertical   ? heightConstraint : this.getReqdHeight();
            
            if (this.useGeometryForBorder() ){
                // update the border to fit the new size
                this.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(widthConstraint, heightConstraint), true); 
            }   
             
            // position subs according to the layout of this panel
            if (this._layoutDir === Panel.LAYOUT_HORIZONTAL){
                this._horizontalLayout(widthConstraint, heightConstraint);
                
            } else {
                this._verticalLayout(widthConstraint, heightConstraint);    
            }
            
            // record the actual belowOrigins accounting for stretch; for adjustLayoutForOrigin() & positioning by parent Panel
            this._actualAboveOriginX =  widthConstraint  / 2;
            this._actualAboveOriginY =  heightConstraint / 2;
            this._actualBelowOriginX = -widthConstraint  / 2;
            this._actualBelowOriginY = -heightConstraint / 2;
                       
            this._adjustLayoutForOrigin();
            this._dirty = false;
        }
        
        /**
         * Layout the positions of this panel's sub-panels, based horizontal layoutDir, 
         * but without regard to origin of this panel.
         * 
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        private _horizontalLayout(widthConstraint : number, heightConstraint : number): void { 
            var sub : BasePanel;
            var subFinalwidth : number;         
            var spareAmountPerStretcher = (this._nStretchers[0] > 0) ? (widthConstraint - this.getReqdWidth()) / this._nStretchers[0] : 0;
            
            // call layout of each sub & set the position.y
            var heightLessMargins = heightConstraint - (this.verticalMargin * 2);
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);

                    // call the layout of the sub-panel
                    sub._layout(subFinalwidth, heightLessMargins);  
                    
                    // position y
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM){                   
                        sub.position.y = this.verticalMargin - sub._actualBelowOriginY;
                    
                    }else if (sub.verticalAlignment === Panel.ALIGN_VCENTER){
                        sub.position.y = ((heightConstraint - sub.getReqdHeight()) / 2) - sub._actualBelowOriginY;
                        
                    }else{
                        sub.position.y = heightConstraint - (this.verticalMargin + sub._actualAboveOriginY);                        
                    }
                }
            }
                
            // position.x each sub with either LEFT or HCENTER alignment
            var left = this.horizontalMargin;
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.horizontalAlignment === Panel.ALIGN_RIGHT){
                        break; // once a right is encountered, no more lefts or a center
                    }
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);

                    if (sub.horizontalAlignment === Panel.ALIGN_LEFT){
                        sub.position.x = left - sub._actualBelowOriginX;
                        left += subFinalwidth;
                    
                    }else{
                        sub.position.x = ((widthConstraint - subFinalwidth) / 2) - sub._actualBelowOriginX;
                        break; // lefts first then only up to 1 center, so done
                    }
                }else{
                    left += this.placeHolderWidth;
                }
            }
                
            // position.x each sub with RIGHT alignment
            var right = widthConstraint - this.horizontalMargin; 
            
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.horizontalAlignment !== Panel.ALIGN_RIGHT){
                        break;  // done after the last right, since going in reverse order
                    }
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);
                    
                    sub.position.x = right - sub._actualAboveOriginX;  
                    right -= subFinalwidth;
                }else{
                    right -= this.placeHolderWidth;
                }
            }
        }
        
        /**
         * Layout the positions of this panel's sub-panels, based vertical layoutDir,
         * but without regard to origin of this panel.
         * 
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        private _verticalLayout(widthConstraint : number, heightConstraint : number): void { 
            var sub : BasePanel;
            var subFinalHeight : number;      
            var spareAmountPerStretcher = (this._nStretchers[1] > 0) ? (heightConstraint - this.getReqdHeight()) / this._nStretchers[1] : 0;
            
            // call layout of each sub & set the position.x
            var widthLessMargins = widthConstraint - (this.horizontalMargin * 2);   
                 
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);

                    // call the layout of the sub-panel
                    sub._layout(widthLessMargins, subFinalHeight);  
                    
                    // position x
                    if (sub.stretchHorizontal){
                        sub.position.x = this.horizontalMargin - sub._actualBelowOriginX;
                        
                    }else if (sub.horizontalAlignment === Panel.ALIGN_LEFT){
                        sub.position.x = this.horizontalMargin - sub._actualBelowOriginX;
                    
                    }else if (sub.horizontalAlignment === Panel.ALIGN_HCENTER){
                        sub.position.x = ((widthConstraint - sub.getReqdWidth()) / 2) - sub._actualBelowOriginX;
                        
                    }else{
                        sub.position.x =  widthConstraint - (this.horizontalMargin + sub._actualAboveOriginX);                        
                    }
                }                  
            }
                
            // position.y each sub with either TOP or VCENTER alignment
            var top = heightConstraint - this.verticalMargin; 
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM){
                        break; // once a bottom is encountered, no more tops or a center
                    }
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);

                    if (sub.verticalAlignment === Panel.ALIGN_TOP){
                        sub.position.y = top - sub._actualAboveOriginY;  
                        top -= subFinalHeight;
                    
                    }else{
                        sub.position.y = ((heightConstraint - subFinalHeight) / 2) - sub._actualBelowOriginY;
                        break; // tops first then only up to 1 center, so done
                    }
                }else{
                    top -= this.placeHolderHeight;
                }
            }
                
            // position.y each sub with BOTTOM alignment
            var bot = this.verticalMargin;
            
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.verticalAlignment !== Panel.ALIGN_BOTTOM){
                        break; // done after the last bottom, since going in reverse order
                    }
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);
                    
                    sub.position.y = bot - sub._actualBelowOriginY;
                    bot += subFinalHeight;
                }else{
                    bot += this.placeHolderHeight;
                }
            }
        }
        /**
         * Applied after all sub-panels have been placed.  Allows for easier to understand code
         * 
         */
        private _adjustLayoutForOrigin(): void { 
            var sub : BasePanel;
                 
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    // adjust for centering, use _actualAboveOrigin.. incase of stretching
                    sub.position.x += this._actualBelowOriginX; 
                    sub.position.y += this._actualBelowOriginY;  
                }                  
            }
        }
        
        /**
         * @param {boolean} isHorizontal - the layout direction to check for, vertical when false
         * @return {boolean} true, when:
         *       - follows (Lefts, tops), up to 1 center, (rights, bottoms) order
         *       - has no stretchers if it also has a center
         */
        private _validateAlignmnent(isHorizontal : boolean) : boolean{
            var centerValue  = isHorizontal ? Panel.ALIGN_HCENTER : Panel.ALIGN_VCENTER;
            var hasStretcher = this._nStretchers[isHorizontal ? 0 : 1] > 0;
            
            var nCenters = 0;
            var lastFound = -4;
            var value, hValue, vValue;
            
            for (var i = 0; i < this._subs.length; i++){
                if (this._subs[i] && this._subs[i] !== null){
                    if (this._subs[i]._topLevel){
                        BABYLON.Tools.Error("Cannot embed top level panel in others.  Found in: " + this.name);
                        return false;
                    }
                    
                    hValue = this._subs[i].horizontalAlignment;
                    if (hValue < Panel.ALIGN_LEFT || hValue > Panel.ALIGN_RIGHT){
                          BABYLON.Tools.Error("Horizontal Layout value invalid for " + this._subs[i].name);
                          return false;
                    }
                    
                    vValue = this._subs[i].verticalAlignment  ;
                    if (vValue < Panel.ALIGN_TOP || vValue > Panel.ALIGN_BOTTOM){
                          BABYLON.Tools.Error("Vertical Layout value invalid for " + this._subs[i].name);
                          return false;
                    }
                    
                    var value = isHorizontal ? hValue : vValue;
                    if (lastFound <= value){
                        lastFound = value;
                        if (value === centerValue){
                            if (hasStretcher){
                              BABYLON.Tools.Error("Stretch & center alignments not compatible.  found amoung sub-panels of: " + this.name);
                              return false;
                            } 
                            nCenters++;
                        } 
                        
                    }else{
                        BABYLON.Tools.Error("Must be in " + (isHorizontal ? "Lefts, up to 1 center, rights" : "tops, up to 1 center, bottoms" ) + " order for: " + this.name);
                        return false;
                    } 
                }
            }
            if (nCenters > 1){
                BABYLON.Tools.Error("Multiple center alignments not valid for: " + this.name);
                return false;
            }
            return true;
        }
        
        /**
         * responsible for setting a number of attributes, based on interogating its sub-panels
         * 
         * _maxAboveOrigin   :  The width of the sub-panels (added together or widest), / 2 for centering / rotation
         * _minBelowOrigin   :  _maxAboveOrigin with sign flipped, for centering / rotation
         * _nStretchers      :  # of sub-panels specifying stretch,[0] & [1], (horizontal & vertical)
         */
        public _calcRequiredSize() : void { 
            // accumulators of dimensions, when orienting in their direction
            var width  = [0, 0, 0];   //left, hcenter, right
            var height = [0, 0, 0];   //top , vcenter, bottom
            var depth  = 0;
            
            var maxWidth  = 0;
            var maxHeight = 0;
            
            var subWidth  : number;
            var subHeight : number;
            var subDepth  : number;
            
            var idxWidth  : number;
            var idxHeight : number;
            
            // accumulators of the number of sub-panels specifying stretch 
            this._nStretchers[0] = 0; // stretchHorizontal
            this._nStretchers[1] = 0; // stretchVertical
            
            // internal ref vars to reduce code
            var sub : BasePanel;
            
            // iternate through each of the sub-panels
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                
                if (sub && sub !== null){
                    if (sub.stretchHorizontal) this._nStretchers[0]++;
                    if (sub.stretchVertical  ) this._nStretchers[1]++;
                    
                    sub._calcRequiredSize();                    
                    subWidth  = sub.getReqdWidth ();
                    subHeight = sub.getReqdHeight();
                    subDepth  = sub.getReqdDepth ();
                    
                    if (sub.horizontalAlignment  === Panel.ALIGN_LEFT   ) idxWidth = 0;
                    if (sub.horizontalAlignment  === Panel.ALIGN_HCENTER) idxWidth = 1;
                    if (sub.horizontalAlignment  === Panel.ALIGN_RIGHT  ) idxWidth = 2;

                    if (sub.verticalAlignment  === Panel.ALIGN_TOP    ) idxHeight = 0;
                    if (sub.verticalAlignment  === Panel.ALIGN_HCENTER) idxHeight = 1;
                    if (sub.verticalAlignment  === Panel.ALIGN_BOTTOM ) idxHeight = 2;

                    // determine if this sub is the thickest
                    if (depth < subDepth){
                        depth = subDepth;
                    }
                    
                    // for horizontal add the width & determine if this sub is the highest
                    if (this._layoutDir === Panel.LAYOUT_HORIZONTAL){
                        if (maxHeight < subHeight){
                            maxHeight = subHeight;
                        }
                        width[idxWidth] += subWidth;
                        
                    // for vertical add the height & determine if this sub is the widest
                    }else{
                        if (maxWidth < subWidth){
                            maxWidth = subWidth;
                        }
                        height[idxHeight] += subHeight;                
                    }
                    
               }else{
                    // when a sub-panel is null, give it a plaeholder allocation
                    if (this._layoutDir === Panel.LAYOUT_HORIZONTAL){
                        width [idxWidth ] += this.placeHolderWidth;
                    }else{
                        height[idxHeight] += this.placeHolderHeight;
                    }
                }
            }
            
            // boil the 3 widths / heights down to the max versions, according to layout 
            if (this._layoutDir === Panel.LAYOUT_HORIZONTAL){
                maxWidth = width[1]; // always add center 
                if (width[1] > 0){
                    // when there is a centered sub, always used the larger of left-right for both
                    if (width[0] < width[2]){
                        width[0] = width[2];
                    }else{
                        width[2] = width[0];
                    }
                }
                maxWidth += width[0] + width[2];
                
            }else{
                maxHeight = height[1]; // always add center 
                if (height[1] > 0){
                    // when there is a centered sub, always used the larger of top-bottom for both
                    if (height[0] < height[2]){
                        height[0] = height[2];
                    }else{
                        height[2] = height[0];
                    }
                }
                maxHeight += height[0] + height[2];
            }
            
            // to ensure centered rotation the the width, height, & depth are spread above and below origin.
            this._maxAboveOrigin.x =  (this.horizontalMargin + maxWidth  / 2);
            this._maxAboveOrigin.y =  (this.verticalMargin   + maxHeight / 2);
            this._maxAboveOrigin.z =  (depth / 2);
            
            this._minBelowOrigin.x =  - this._maxAboveOrigin.x;
            this._minBelowOrigin.y =  - this._maxAboveOrigin.y;
            this._minBelowOrigin.z =  - this._maxAboveOrigin.z;
        }
        /**
         * @return {number} - This returns the sum of the max X of a vertex, above 0, & the min X of a vertex, when less than 0
         * This handle Letter kerning, where the min X is positive.  Want to include this space as part of width.
         */
        public getReqdWidth() : number {
            return this._maxAboveOrigin.x - ((this._minBelowOrigin.x < 0) ? this._minBelowOrigin.x : 0);
        }
        
        /**
         * @return {number} - This returns the sum of the max Y of a vertex, above 0, & the min Y of a vertex, when less than 0
         * This handle Letter baselining, though no letters start above baseline.
         */
        public getReqdHeight() : number {
            return this._maxAboveOrigin.y - ((this._minBelowOrigin.y < 0) ? this._minBelowOrigin.y : 0);
        }
        
        /**
         * @return {number} - This returns the sum of the max Z of a vertex, above 0, & the min Z of a vertex, when less than 0
         */
        public getReqdDepth() : number {
            return this._maxAboveOrigin.z - ((this._minBelowOrigin.z < 0) ? this._minBelowOrigin.z : 0);
        }
        
        public setLayerMask(maskId :number){
            for (var i = this._subs.length - 1; i >= 0; i--){
                this._subs[i].setLayerMask(maskId);
            }
            this.layerMask = maskId;
        }
        // ================================= Sub-Panel Access / Mod ==================================
        /**
         * Provide the list of sub-panels.  Not getChildren(), since in use by BABYLON.Node.
         * Cannot use getChildren, since this is in order of adding only.
         */
        public getSubPanels() : Array<BasePanel>{ return this._subs; }
        
        /**
         * Add a sub-panel to the end, or at the index passed.
         * Also sets the parent of the sub-panel to itself.
         * 
         * @param {DIALOG.Panel} sub - Panel to be added.
         * @param {number} index - the position at which to add the sub-panel
         */
        public addSubPanel(sub : BasePanel, index? :number) : void{
            if (index){
                this._subs.splice(index, 0, sub);
            }else{
                this._subs.push(sub);
            }
            
            if (sub && sub !== null){
                (<any> sub).parent = this;
            }
            this.invalidateLayout();
        }
        
        /**
         * remove a sub-panel
         * @param {number} index - the index of the panel to be removed
         */
        removeAt(index : number, doNotDispose? : boolean) : void{
            if ((!doNotDispose) && this._subs[index] && this._subs[index]) this._subs[index].dispose();
            this._subs.splice(index, 1);
            this.invalidateLayout();
        }
        
        /**
         * remove all sub-panels
         */
        removeAll(doNotDispose? : boolean) : void{
            if ((!doNotDispose)){
                for (var i = this._subs.length - 1; i >= 0; i--){
                    if (this._subs[i] && this._subs[i]) this._subs[i].dispose()
                }
            }
            this._subs = new Array<BasePanel>();
            this.invalidateLayout();
        }
        // =================================== Appearance Methods ====================================
        /**
         * Method for sub-classes to override.  Keeps the # of constructor arg down
         */
        public useGeometryForBorder() : boolean{
            return true;
        }
        
        public getFullScalePlaceholderWidth () : number { return 0.3; }
        public getFullScalePlaceholderHeight() : number { return 0.2; }
                
        /** align all of the sub-panels in z dim.
         *  @param {number} z - the value each sub-panel should achieve
         */
        public setUniformZ(z : number) : void{
            var sub : BasePanel;
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    var bBox = sub.getBoundingInfo().boundingBox;
                    sub.position.z = z + this._minBelowOrigin.z;
                }
            }
            this.invalidateLayout();
        } 
        
        public setSubsFaceSize(size : number, relative? : boolean) : BasePanel{
            var sub : BasePanel;
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub instanceof Letter){
                        sub.setFaceSize(size, relative);
                    }else{
                        sub.setSubsFaceSize(size, relative);
                        var x = this._bold ? this._xyScale * BasePanel.BOLD_MULT : this._xyScale;
                        this.placeHolderWidth  = this.getFullScalePlaceholderWidth () * x;
                        this.placeHolderHeight = this.getFullScalePlaceholderHeight() * this._xyScale;
                    }
                }
            }
            return this;
        }
        
        /**
         * Change the scaling.x & scaling.y of each panel.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {BasePanel} For convenience of stringing methods together
         */
        public setFaceSize(size : number, relative? : boolean) : BasePanel{
            if (relative){
                this._xyScale *= size;
            }else{
                this._xyScale = size;
            }
            this._scaleXY();
            return this;
        }
        
        /**
         * Change the scaling.x of each letter, based on the bold setting
         * @param {boolean} bold - when true make wider in scaling.x than in scaling.y
         * @return {BasePanel} For convenience of stringing methods together
         */
        public setBold(bold : boolean) : BasePanel{
            this._bold = bold;
            this._scaleXY();
            return this;
        }
        
        /**
         * Change the scaling.x & scaling.y of each letter mesh.
         * @param {number} x - Value for the X dimension
         * @param {number} y - Value for the Y dimension
         */
        public _scaleXY(){
            var x = this._bold ? this._xyScale * BasePanel.BOLD_MULT : this._xyScale;
            this.scaling.x = x;
            this.scaling.y = this._xyScale;
            this.invalidateLayout();
        }

        public stretch(vert : boolean, horiz : boolean) : BasePanel{
            this.stretchVertical   = vert;
            this.stretchHorizontal = horiz;
            this.invalidateLayout();
            return this;
        }
        
        public vertAlign(align : number) : BasePanel{
            this.verticalAlignment   = align;
            this.invalidateLayout();
            return this;
        }
        
        public horizontalAlign(align : number) : BasePanel{
            this.horizontalAlignment = align;
            this.invalidateLayout();
            return this;
        }
        
        public margin(vert : number, horz : number) : BasePanel{
            this.verticalMargin   = vert;
            this.horizontalMargin = horz;
            this.invalidateLayout();
            return this;
        }
        // ======================================== Overrides ========================================
        /**
         * recursing disposes of letter clones & original when no more in use.  Must make MeshFactory work.
         * @param {boolean} doNotRecurse - ignored
         */
        public dispose(doNotRecurse?: boolean): void {
            super.dispose(false);
            if (this._bRenderer){
                this.unregisterBeforeRender(this._bRenderer);                
            }
        }
    }
    //================================================================================================
    //================================================================================================
    export class Panel extends BasePanel{
        public static BORDER_MAT           : BABYLON.StandardMaterial;
        public static TOP_LEVEL_BORDER_MAT : BABYLON.MultiMaterial;
        
        constructor(name: string, _layoutDir? : number, topLevel? : boolean){
            super(name, DialogSys._scene, null, null, false, _layoutDir, false, topLevel);
            
        }
        // ========================================= Statics  ========================================
        /**
         * Make a Panel with a sublist & optional title
         * @param {string} title - 
         */
        public static makeList(title : string, labels: [string], layoutDir = Panel.LAYOUT_VERTICAL, listFontSize = 1.0, titleMaterial? : Array<BABYLON.StandardMaterial>, topLevel? : boolean) : BasePanel{
            var ret = new Panel('list-' + title, Panel.LAYOUT_VERTICAL, topLevel);
            ret.setBorderVisible(true);
            
            var needInnerBorder = title && title != null && title.replace(' ', '').length > 0;
            if (needInnerBorder){
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = Panel.ALIGN_HCENTER;
                if (titleMaterial && titleMaterial !== null){
                    titlePanel.setLetterMaterial(titleMaterial);
                }
                ret.addSubPanel(titlePanel);
            }
            var kids = new Panel('listKids-' + title, layoutDir);
            kids.setBorderVisible(needInnerBorder);
            
            if (layoutDir === Panel.LAYOUT_VERTICAL)
                kids.stretchHorizontal = true;
            else
                kids.stretchVertical = true;           

            for (var i = 0; i < labels.length; i++){
                var kid = new DIALOG.Label(labels[i]);
                kid.setFontSize(listFontSize);
                
                if (layoutDir === Panel.LAYOUT_VERTICAL)
                    kid.stretchHorizontal = true;
                else
                    kid.stretchVertical = true;           
                    
                kids.addSubPanel(kid);
            }
            ret.addSubPanel(kids);
            return ret;
        }
    
        public static nestPanels(title : string, innerPs: [BasePanel], layoutDir = Panel.LAYOUT_VERTICAL, showOuterBorder = false, titleMaterial? : Array<BABYLON.StandardMaterial>, topLevel? : boolean) : BasePanel{
            var ret = new Panel('nest-' + title, Panel.LAYOUT_VERTICAL, topLevel);
            ret.setBorderVisible(showOuterBorder);
            
            if (title && title != null && title.replace(' ', '').length > 0){
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = Panel.ALIGN_HCENTER;
                if (titleMaterial && titleMaterial !== null){
                    titlePanel.setLetterMaterial(titleMaterial);
                }
                ret.addSubPanel(titlePanel);
            }
            var kids = new Panel('nestKids-' + title, layoutDir);
            kids.setBorderVisible(showOuterBorder);
            if (layoutDir === Panel.LAYOUT_VERTICAL)
                kids.stretchHorizontal = true;
            else
                kids.stretchVertical = true;           

            for (var i = 0; i < innerPs.length; i++){ 
                if (layoutDir === Panel.LAYOUT_VERTICAL)
                    innerPs[i].stretchHorizontal = true;
                else
                    innerPs[i].stretchVertical = true;           
                    
                kids.addSubPanel(innerPs[i]);
            }
            ret.addSubPanel(kids);
            return ret;
        }
        
        public static ExtractMax(mesh : BABYLON.Mesh): BABYLON.Vector3 {
            var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var maximum = new BABYLON.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            var nVert = mesh.getTotalVertices();
            
            for (var i = 0; i < nVert; i++) {
                var current = new BABYLON.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                maximum = BABYLON.Vector3.Maximize(current, maximum);
            }

            return maximum;
        }
    
        // ========================================== Enums  =========================================    
        private static _LAYOUT_HORIZONTAL = 0;
        private static _LAYOUT_VERTICAL   = 1;

        public static get LAYOUT_HORIZONTAL(): number { return Panel._LAYOUT_HORIZONTAL; }
        public static get LAYOUT_VERTICAL  (): number { return Panel._LAYOUT_VERTICAL  ; }
        
        private static _ALIGN_LEFT    = -3;
        private static _ALIGN_HCENTER = -2;
        private static _ALIGN_RIGHT   = -1;
        
        private static _ALIGN_TOP     =  1;
        private static _ALIGN_VCENTER =  2;
        private static _ALIGN_BOTTOM  =  3;

        public static get ALIGN_LEFT    (): number { return Panel._ALIGN_LEFT   ; }
        public static get ALIGN_HCENTER (): number { return Panel._ALIGN_HCENTER; }
        public static get ALIGN_RIGHT   (): number { return Panel._ALIGN_RIGHT  ; }
        
        public static get ALIGN_TOP     (): number { return Panel._ALIGN_TOP    ; }
        public static get ALIGN_VCENTER (): number { return Panel._ALIGN_VCENTER; }
        public static get ALIGN_BOTTOM  (): number { return Panel._ALIGN_BOTTOM ; } 
    }   
}