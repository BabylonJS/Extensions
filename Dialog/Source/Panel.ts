module DIALOG{
    export interface RadioGroup {
        reportSelected(panel : BasePanel) : void;
    }
    
    export class BasePanel extends BABYLON.Mesh{   
        // the public members below can be changed by application code, but must call invalidateLayout()
        public  horizontal_margin = 0.1; 
        public  vertical_margin   = 0.1; 
                 
        public horizontalAlignment =  Panel.ALIGN_LEFT;
        public verticalAlignment   =  Panel.ALIGN_BOTTOM;
        
        public stretchHorizontal = false;
        public stretchVertical   = false;
                
        public placeHolderWidth  = 0.3;
        public placeHolderHeight = 0.5;
        
        // members to hold the result of the required size calc
        public _maxAboveOrigin    = BABYLON.Vector3.Zero();
        public _minBelowOrigin    = BABYLON.Vector3.Zero(); // expressed as either 0, or a negative number of the smallest vertex in each dimension
        
        private _nStretchers = [0,0];
        private _dirty = true;
        
        // statics for borders
        private static _BORDER_WIDTH = 0.0476; // not the actual width, which is 0.02.  This is really loc of vertex moved in 0.02 in 2 directions  0238
        private static _NORMALS = [
                    0,0,-1,0,0,-1,0.7071,0,-0.7071,0.7071,0,0.7071,0.7071,0,-0.7071,0,0,1,0,0,1,-0.7071,0,-0.7071,-0.7071,0,-0.7071,-0.7071,0,0.7071,0,0,1,-0.7071,0,0.7071,0,0,-1,0,-0.7071,-0.7071,0,0,-1,0,-0.7071,-0.7071,0,0.7071,0.7071,0,0,1,-0.7071,0,-0.7071,-0.5773,0.5773,-0.5773,-0.5773,0.5773,0.5773,0.7071,0,0.7071,0.5774,0.5773,0.5773,0.5773,0.5773,-0.5773,-0.7071,0,0.7071,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,-0.5773,0,-0.7071,0.7071,0.7071,0,-0.7071,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.5773,0,0.7071,-0.7071,0,0.7071,-0.7071,0.7071,0,0.7071,0,0.7071,0.7071,-0.7071,0,-0.7071,-0.7071,0,0.7071,0.7071,0,-0.7071,0,-0.7071,0.7071,0.7071,0,0.7071
                ];
        
        private static _INDICES = [
                    0,1,2,3,4,2,5,6,3,7,8,9,10,11,9,12,8,7,13,14,15,16,6,17,18,19,20,21,22,23,24,25,26,27,25,24,28,29,30,31,19,18,16,31,32,15,26,25,4,0,2,33,3,2,33,5,3,11,7,9,17,10,9,14,12,7,29,28,1,22,21,6,13,29,1,22,6,34,13,1,14,14,35,15,35,26,15,36,20,16,36,16,17,36,18,20,37,21,23,6,16,34,35,24,26,27,5,38,5,39,30,5,27,10,39,28,30,31,0,32,5,30,38,27,24,10,0,37,23,0,31,12,23,22,34,31,18,12,23,34,32,0,23,32,20,19,31,20,31,16,30,29,13,34,16,32,38,30,13,15,27,13,27,38,13,15,25,27
                ];
            
        private _subs = new Array<BasePanel>(); // essentially same as children, but both type defined & in order of layout
        
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.Mesh, doNotCloneChildren?: boolean, private _layoutDir = Panel.LAYOUT_HORIZONTAL, public _topLevel? : boolean){
            super(name, scene, parent, source, doNotCloneChildren);
            
            if (this.useGeometryForBorder() ){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(1, 1), true );
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind  , BasePanel._NORMALS              , false);
                this.setIndices(Panel._INDICES);
            
                this.material = Panel.BORDER_MAT;
                this.visibility = (this._topLevel || Panel.SHOW_ALL_BORDERS) ? 1 : 0;
            }
            
            if (this._topLevel){
                // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
                var ref = this;
                super.registerBeforeRender(function(){ref._beforeRender();});
            }
        }
        
        /**
         * Method for sub-classes to override.  Keeps the # of constructor arg down
         */
        public useGeometryForBorder() : boolean{
            return true;
        }
        
        /**
         * Method for sub-classes to override.  Keeps the # of constructor arg down
         */
        public isButton() : boolean{
            return false;
        }
        
        private _computePositionsData(widthConstraint : number, heightConstraint : number) : [number]{
            var bWidth = Panel._BORDER_WIDTH;

            var oRite = widthConstraint / 2;
            var oLeft = -oRite;
            
            var iRite = oRite - bWidth;
            var iLeft = oLeft + bWidth;
            
            var oHigh = heightConstraint /2;
            var oLow  = -oHigh;
            
            var iHigh = oHigh - bWidth;
            var iLow  = oLow  + bWidth;
            
            var depth = DialogSys.DEPTH_SCALING_3D;
            
            return [
                    iRite, iHigh, 0,
                    iRite, iLow , 0,
                    oRite, iLow , 0,
                    oRite, iHigh, depth,
                    oRite, iHigh, 0,
                    iRite, iLow , depth,
                    iRite, iHigh, depth,
                    oLeft, iLow , 0,
                    oLeft, iHigh, 0,
                    oLeft, iHigh, depth,
                    iLeft, iLow , depth,
                    oLeft, iLow , depth,
                    iLeft, iHigh, 0,
                    iRite, oLow   , 0,
                    iLeft, iLow , 0,
                    iLeft, oLow   , 0,
                    iLeft, oHigh , depth,
                    iLeft, iHigh, depth,
                    oLeft, iHigh, 0,
                    oLeft, oHigh , 0,
                    oLeft, oHigh , depth,
                    oRite, iHigh, depth,
                    oRite, oHigh , depth,
                    oRite, oHigh , 0,
                    oLeft, iLow , depth,
                    oLeft, oLow   , depth,
                    oLeft, oLow   , 0,
                    iLeft, oLow   , depth,
                    oRite, iLow , 0,
                    oRite, oLow   , 0,
                    oRite, oLow   , depth,
                    iLeft, oHigh , 0,
                    iRite, oHigh , 0,
                    oRite, iLow , depth,
                    iRite, oHigh , depth,
                    oLeft, iLow , 0,
                    oLeft, iHigh, depth,
                    oRite, iHigh, 0,
                    iRite, oLow   , depth,
                    oRite, iLow , depth                    
                ];
         }
        
         /**
         * beforeRender() registered only for toplevel Panels
         */
        private _beforeRender() : void {
            if (this._dirty){  
                this.layout();              
            }
        }
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
            console.log("top widthConstraint " +  this.getWidth() + ", top heightConstraint: " + this.getHeight() );       
            this._layout(this.getWidth(), this.getHeight() );
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
            widthConstraint  = this.stretchHorizontal ? widthConstraint  : this.getWidth ();
            heightConstraint = this.stretchVertical   ? heightConstraint : this.getHeight();
                       
            if (this.useGeometryForBorder() ){
                // update the border to fit the new size
                this.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(widthConstraint, heightConstraint) ); 
            }   
             
            // position subs according to the layout of this panel
            if (this._layoutDir === Panel.LAYOUT_HORIZONTAL){
                this._horizontalLayout(widthConstraint, heightConstraint);
                
            } else {
                this._verticalLayout(widthConstraint, heightConstraint);    
            }
            
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
            var sub : Panel;
            var subFinalwidth : number;         
            var spareAmountPerStretcher = (this._nStretchers[0] > 0) ? (widthConstraint - this.getWidth()) / this._nStretchers[0] : 0;
            
            // call layout of each sub & set the position.y
            var heightLessMargins = heightConstraint - (this.vertical_margin * 2);
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    subFinalwidth = sub.getWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);

                    // call the layout of the sub-panel
                    sub._layout(subFinalwidth, heightLessMargins);  
                    
                    // position y
                    if (sub.stretchVertical || sub.verticalAlignment === Panel.ALIGN_BOTTOM){                   
                        sub.position.y = this.vertical_margin - sub._minBelowOrigin.y;
                    
                    }else if (sub.verticalAlignment === Panel.ALIGN_VCENTER){
                        sub.position.y = ((heightConstraint - sub.getHeight()) / 2) - sub._minBelowOrigin.y;
                        
                    }else{
                        sub.position.y = heightConstraint - (this.vertical_margin + sub._maxAboveOrigin.y);                        
                    }
                }
            }
                
            // position.x each sub with either LEFT or HCENTER alignment
            var left = this.horizontal_margin;
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.horizontalAlignment === Panel.ALIGN_RIGHT){
                        break; // once a right is encountered, no more lefts or a center
                    }
                    subFinalwidth = sub.getWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);

                    if (sub.horizontalAlignment === Panel.ALIGN_LEFT){
                        sub.position.x = left - sub._minBelowOrigin.x;
                        left += subFinalwidth;
                    
                    }else{
                        sub.position.x = ((widthConstraint - subFinalwidth) / 2) - sub._minBelowOrigin.x;
                        break; // lefts first then only up to 1 center, so done
                    }
                }else{
                    left += this.placeHolderWidth;
                }
            }
                
            // position.x each sub with RIGHT alignment
            var right = widthConstraint - this.horizontal_margin; 
            
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.horizontalAlignment !== Panel.ALIGN_RIGHT){
                        break;  // done after the last right, since going in reverse order
                    }
                    subFinalwidth = sub.getWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);
                    
                    sub.position.x = right - sub._maxAboveOrigin.x;  
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
            var sub : Panel;
            var subFinalHeight : number;      
            var spareAmountPerStretcher = (this._nStretchers[1] > 0) ? (heightConstraint - this.getHeight()) / this._nStretchers[1] : 0;
            
            // call layout of each sub & set the position.x
            var widthLessMargins = widthConstraint - (this.horizontal_margin * 2);   
            
            var hCenterOffset = this._maxAboveOrigin.x / 2
            var vCenterOffset = this._maxAboveOrigin.y / 2;
                 
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    subFinalHeight = sub.getHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);

                    // call the layout of the sub-panel
                    sub._layout(widthLessMargins, subFinalHeight);  
                    
                    // position x
                    if (sub.stretchHorizontal || sub.horizontalAlignment === Panel.ALIGN_LEFT){
                        sub.position.x = this.horizontal_margin - sub._minBelowOrigin.x;
                    
                    }else if (sub.horizontalAlignment === Panel.ALIGN_HCENTER){
                        sub.position.x = ((widthConstraint - sub.getWidth()) / 2) - sub._minBelowOrigin.x;
                        
                    }else{
                        sub.position.x =  widthConstraint - (this.horizontal_margin + sub._maxAboveOrigin.x);                        
                    }
                }                  
            }
                
            // position.y each sub with either TOP or VCENTER alignment
            var top = heightConstraint - this.vertical_margin; 
            
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM){
                        break; // once a bottom is encountered, no more tops or a center
                    }
                    subFinalHeight = sub.getHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);

                    if (sub.verticalAlignment === Panel.ALIGN_TOP){
                        sub.position.y = top - sub._maxAboveOrigin.y;  
                        top -= subFinalHeight;
                    
                    }else{
                        sub.position.y = ((heightConstraint - subFinalHeight) / 2) - sub._minBelowOrigin.y;
                        break; // tops first then only up to 1 center, so done
                    }
                }else{
                    top -= this.placeHolderHeight;
                }
            }
                
            // position.y each sub with BOTTOM alignment
            var bot = this.vertical_margin;
            
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    if (sub.verticalAlignment !== Panel.ALIGN_BOTTOM){
                        break; // done after the last bottom, since going in reverse order
                    }
                    subFinalHeight = sub.getHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);
                    
                    sub.position.y = bot - sub._minBelowOrigin.y;
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
            var sub : Panel;
                 
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                if (sub && sub !== null){
                    // adjust for centering
                    sub.position.x += this._minBelowOrigin.x; 
                    sub.position.y += this._minBelowOrigin.y;                 
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
            var lowestLegal  = isHorizontal ? Panel.ALIGN_LEFT    : Panel.ALIGN_TOP;
            var highestLegal = isHorizontal ? Panel.ALIGN_RIGHT   : Panel.ALIGN_BOTTOM;
            var centerValue  = isHorizontal ? Panel.ALIGN_HCENTER : Panel.ALIGN_VCENTER;
            var hasStretcher = this._nStretchers[isHorizontal ? 0 : 1] > 0;
            
            var nCenters = 0;
            var lastFound = -4;
            
            for (var i = 0; i < this._subs.length; i++){
                if (this._subs[i] && this._subs[i] !== null){
                    if (this._subs[i]._topLevel){
                        BABYLON.Tools.Error("Panel._validateAlignmnent:  cannot embed top level panel in others");
                        return false;
                    }
                    var value = isHorizontal ? this._subs[i].horizontalAlignment : this._subs[i].verticalAlignment;
                    if (lastFound <= value && value >= lowestLegal && value <= highestLegal){
                        lastFound = value;
                        if (value === centerValue){
                            if (hasStretcher){
                              BABYLON.Tools.Error("Panel._validateAlignmnent: stretch & center alignments not valid amoung sub-panels");
                              return false;
                            } 
                            nCenters++;
                        } 
                        
                    }else{
                        BABYLON.Tools.Error("Panel._validateAlignmnent:  must be in " + (isHorizontal ? "Lefts, up to 1 center, rights" : "tops, up to 1 center, bottoms" ) + " order");
                        return false;
                    } 
                }
            }
            if (nCenters > 1){
                BABYLON.Tools.Error("Panel._validateAlignmnent:  multiple center alignments not valid");
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
            this.computeWorldMatrix(true);
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
            var sub : Panel;
            
            // iternate through each of the sub-panels
            for (var i = 0; i < this._subs.length; i++){
                sub = this._subs[i];
                
                if (sub && sub !== null){
                    if (sub.stretchHorizontal) this._nStretchers[0]++;
                    if (sub.stretchVertical  ) this._nStretchers[1]++;
                    
                    sub._calcRequiredSize();                    
                    subWidth  = sub.getWidth ();
                    subHeight = sub.getHeight();
                    subDepth  = sub.getDepth ();
                    
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
            this._maxAboveOrigin.x =  (this.horizontal_margin + maxWidth  / 2);
            this._maxAboveOrigin.y =  (this.vertical_margin   + maxHeight / 2);
            this._maxAboveOrigin.z =  (depth / 2);
            
            this._minBelowOrigin.x =  - this._maxAboveOrigin.x;
            this._minBelowOrigin.y =  - this._maxAboveOrigin.y;
            this._minBelowOrigin.z =  - this._maxAboveOrigin.z;
        }
        /**
         * @return {number} - This returns the sum of the max X of a vertex, above 0, & the min X of a vertex, when less than 0
         * This handle Letter kerning, where the min X is positive.  Want to include this space as part of width.
         */
        public getWidth() : number {
            return this._maxAboveOrigin.x - ((this._minBelowOrigin.x < 0) ? this._minBelowOrigin.x : 0);
        }
        
        /**
         * @return {number} - This returns the sum of the max Y of a vertex, above 0, & the min Y of a vertex, when less than 0
         * This handle Letter baselining, though no letters start above baseline.
         */
        public getHeight() : number {
            return this._maxAboveOrigin.y - ((this._minBelowOrigin.y < 0) ? this._minBelowOrigin.y : 0);
        }
        
        /**
         * @return {number} - This returns the sum of the max Z of a vertex, above 0, & the min Z of a vertex, when less than 0
         */
        public getDepth() : number {
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
        public getSubPanels() : Array<Panel>{ return this._subs; }
        
        /**
         * Add a sub-panel to the end, or at the index passed.
         * Also sets the parent of the sub-panel to itself.
         * 
         * @param {DIALOG.Panel} sub - Panel to be added.
         * @param {number} index - the position at which to add the sub-panel
         */
        public addSubPanel(sub : Panel, index? :number) : void{
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
        removeAt(index : number) : void{
            this._subs.splice(index, 1);
            this.invalidateLayout();
        }

        /** align all of the sub-panels in z dim.
         *  @param {number} z - the value each sub-panel should achieve
         */
        public setUniformZ(z : number) : void{
            var sub : Panel;
            for (var i = this._subs.length - 1; i >= 0; i--){
                sub = this._subs[i];
                if (sub && sub !== null){
                    var bBox = sub.getBoundingInfo().boundingBox;
                    sub.position.z = z + this._minBelowOrigin.z;
                }
            }
        } 
        // ======================================== Overrides ========================================
        /**
         * recursing disposes of letter clones & original when no more in use.  Must make MeshFactory work.
         * @param {boolean} doNotRecurse - ignored
         */
        public dispose(doNotRecurse?: boolean): void {
            super.dispose(false);
        }
    }
    
    export class Panel extends BasePanel{
        public static BORDER_MAT : BABYLON.StandardMaterial;
        public static SHOW_ALL_BORDERS = false;
        
        constructor(name: string, _layoutDir? : number, _topLevel? : boolean){
            super(name, DialogSys._scene, null, null, false, _layoutDir, _topLevel);
            
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