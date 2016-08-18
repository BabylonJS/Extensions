var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DIALOG;
(function (DIALOG) {
    var BasePanel = (function (_super) {
        __extends(BasePanel, _super);
        function BasePanel(name, scene, parent, source, doNotCloneChildren, _layoutDir, _button, _topLevel) {
            if (parent === void 0) { parent = null; }
            if (_layoutDir === void 0) { _layoutDir = Panel.LAYOUT_HORIZONTAL; }
            _super.call(this, name, scene, parent, source, doNotCloneChildren);
            this._layoutDir = _layoutDir;
            this._button = _button;
            this._topLevel = _topLevel;
            // Instance level Look & Feel (must call invalidateLayout() or use setter once visible)
            this.horizontalMargin = 0.1; // setter available
            this.verticalMargin = 0.1; // setter available
            this.horizontalAlignment = Panel.ALIGN_LEFT; // setter available
            this.verticalAlignment = Panel.ALIGN_TOP; // setter available
            // used to control the width of the border in the XY dimension
            this.borderInsideVert = 0.05;
            this.borderDepth = DIALOG.DialogSys.DEPTH_SCALING_3D;
            this.stretchHorizontal = false; // setter available
            this.stretchVertical = false; // setter available
            this._bold = false;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            // members for top level panels to hold settings when on the dialog modal stack
            this.maxViewportWidth = 1;
            this.maxViewportHeight = 1;
            this._fitToWindow = false;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            // members to hold the result of the required size calc
            // are public only for sub-classing
            this._maxAboveOrigin = BABYLON.Vector3.Zero();
            this._minBelowOrigin = BABYLON.Vector3.Zero(); // expressed as either 0, or a negative number of the smallest vertex in each dimension
            this._nStretchers = [0, 0];
            this._xyScale = 1;
            this._dirty = true;
            this._visibleBorder = false;
            this._panelEnabled = true;
            this._selected = false;
            this._subs = new Array(); // essentially same as children, but both type defined & in order of layout
            if (!Panel.BORDER_MAT) {
                Panel.BORDER_MAT = DIALOG.DialogSys.GOLD[1]; // need no culling
                var multiMaterial = new BABYLON.MultiMaterial("Top Level mat", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(DIALOG.DialogSys.GOLD[1]); // for sides, culling off
                var transBlack = DIALOG.DialogSys.BLACK[0].clone("transBlack");
                transBlack.alpha = 0.3;
                multiMaterial.subMaterials.push(transBlack); // for back
                Panel.TOP_LEVEL_BORDER_MAT = multiMaterial;
            }
            if (this.useGeometryForBorder()) {
                var needBack = this._topLevel || this._button;
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(1, 1), true);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, needBack ? BasePanel._TOP_LEVEL_NORMALS : BasePanel._NORMALS, false);
                this.setIndices(needBack ? BasePanel._TOP_LEVEL_INDICES : BasePanel._INDICES);
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 40, 0, 168, this);
                if (needBack) {
                    new BABYLON.SubMesh(1, 40, 4, 168, 6, this);
                    this.material = Panel.TOP_LEVEL_BORDER_MAT;
                }
                else {
                    this.material = Panel.BORDER_MAT;
                }
                this.setBorderVisible(this._topLevel);
            }
            if (this._topLevel) {
                _super.prototype.registerBeforeRender.call(this, BasePanel._beforeRender);
            }
            this.placeHolderWidth = this.getFullScalePlaceholderWidth();
            this.placeHolderHeight = this.getFullScalePlaceholderHeight();
            this.isPickable = this._button;
        }
        // =================================== Rendering Methods =====================================        
        BasePanel.prototype._computePositionsData = function (widthConstraint, heightConstraint) {
            var bWidth = this.borderInsideVert;
            var oRite = widthConstraint / 2;
            var oLeft = -oRite;
            var iRite = oRite - bWidth;
            var iLeft = oLeft + bWidth;
            var oHigh = heightConstraint / 2;
            var oLow = -oHigh;
            var iHigh = oHigh - bWidth;
            var iLow = oLow + bWidth;
            var depth = this.borderDepth;
            var ret = [
                iRite, iHigh, 0,
                iRite, iLow, 0,
                oRite, iLow, 0,
                oRite, iHigh, depth,
                oRite, iHigh, 0,
                iRite, iHigh, depth,
                oRite, iLow, depth,
                oLeft, iHigh, 0,
                oLeft, iHigh, depth,
                oLeft, iLow, depth,
                iLeft, iLow, depth,
                iLeft, iHigh, 0,
                oLeft, iLow, 0,
                iLeft, oLow, 0,
                iLeft, iLow, 0,
                iLeft, oHigh, depth,
                iLeft, iHigh, depth,
                oLeft, iHigh, 0,
                oLeft, oHigh, 0,
                oLeft, oHigh, depth,
                oRite, iHigh, depth,
                oRite, oHigh, depth,
                oRite, oHigh, 0,
                oLeft, iLow, depth,
                oLeft, oLow, depth,
                oLeft, oLow, 0,
                iLeft, oLow, depth,
                oRite, iLow, 0,
                oRite, oLow, 0,
                oRite, oLow, depth,
                iLeft, oHigh, 0,
                iRite, oHigh, 0,
                iRite, iLow, depth,
                iRite, oLow, 0,
                oLeft, iLow, 0,
                iRite, oHigh, depth,
                oLeft, iHigh, depth,
                oRite, iHigh, 0,
                iRite, oLow, depth,
                oRite, iLow, depth
            ];
            if (this._topLevel || this._button) {
                if (this._button) {
                    depth *= .1;
                }
                var back = [
                    iRite, iLow, depth,
                    iRite, iHigh, depth,
                    iLeft, iHigh, depth,
                    iLeft, iLow, depth
                ];
                ret.push.apply(ret, back);
            }
            return ret;
        };
        /**
        * beforeRender() registered only for toplevel Panels
        */
        BasePanel._beforeRender = function (mesh) {
            var asPanel = mesh;
            if (asPanel._dirty) {
                asPanel.layout();
                DIALOG.DialogSys._adjustCameraForPanel();
            }
        };
        BasePanel.prototype.setBorderVisible = function (show) {
            this._visibleBorder = show;
            if (this.useGeometryForBorder)
                this.visibility = show ? 1 : 0;
        };
        BasePanel.prototype.isBorderVisible = function () { return this._visibleBorder; };
        // =============================== Selection / Action Methods ================================
        /**
         *
         */
        BasePanel.prototype.registerPickAction = function (func) {
            this._pickFunc = func;
            // register pick action to call this._pickFunc
            this.actionManager = new BABYLON.ActionManager(DIALOG.DialogSys._scene);
            var ref = this;
            this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                ref._pickFunc();
            }));
        };
        BasePanel.prototype.assignCallback = function (func) {
            this._callback = func;
        };
        BasePanel.prototype.isSelected = function () { return this._selected; };
        BasePanel.prototype.isPanelEnabled = function () { return this._panelEnabled; };
        BasePanel.prototype.isButton = function () { return this._button; };
        /** for those who cannot set it in constructor, like buttons for NumberScroller */
        BasePanel.prototype.setButton = function (button) {
            this.isPickable = this._button = button;
        };
        Object.defineProperty(BasePanel.prototype, "fitToWindow", {
            // ===================================== Layout Methods ======================================
            get: function () { return this._fitToWindow; },
            /**
             * Assign whether Top Level Panel to conform to window dimensions.
             */
            set: function (fitToWindow) {
                if (!this._topLevel)
                    return;
                this._fitToWindow = fitToWindow;
                // record original reqd sizes
                if (!this._originalReqdWidth) {
                    this._originalReqdWidth = this.getReqdWidth();
                    this._originalReqdHeight = this.getReqdHeight();
                }
                // only need to do a layout here when not fitting, since _adjustCameraForPanel will for fitToWindow
                if (!fitToWindow) {
                    this.layout();
                }
                // does not actual do anything till on stack                    
                DIALOG.DialogSys._adjustCameraForPanel();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * signal to the beforeRenderer of the top level Panel, to re-layout on next call
         */
        BasePanel.prototype.invalidateLayout = function () {
            this._dirty = true;
            var insideOf = this.parent; // casting gymnastics for Typescript
            if (insideOf && typeof insideOf.invalidateLayout === "function")
                insideOf.invalidateLayout();
        };
        BasePanel.prototype.layout = function () {
            this._calcRequiredSize(); // determine what the requirements are for the entire heirarchy 
            this._layout(this.getReqdWidth(), this.getReqdHeight());
            this.freezeWorldMatrixTree();
            this._dirty = false;
        };
        /**
         * Layout the positions of this panel's sub-panels, based on this panel's layoutDir.
         * Only public for recursive calling across the instance hierarchy.
         *
         * @param {number} widthConstraint  - Will always be >= getReqdWidth ()
         * @param {number} heightConstraint - Will always be >= getReqdHeight()
         */
        BasePanel.prototype._layout = function (widthConstraint, heightConstraint) {
            if (!this._validateAlignmnent(this._layoutDir === Panel.LAYOUT_HORIZONTAL))
                return;
            // adjust constraints down to only required, when not stretching
            widthConstraint = this.stretchHorizontal ? widthConstraint : this.getReqdWidth();
            heightConstraint = this.stretchVertical ? heightConstraint : this.getReqdHeight();
            if (this.useGeometryForBorder()) {
                // update the border to fit the new size
                this.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._computePositionsData(widthConstraint, heightConstraint), true);
            }
            // position subs according to the layout of this panel
            if (this._layoutDir === Panel.LAYOUT_HORIZONTAL) {
                this._horizontalLayout(widthConstraint, heightConstraint);
            }
            else {
                this._verticalLayout(widthConstraint, heightConstraint);
            }
            // record the actual belowOrigins accounting for stretch; for adjustLayoutForOrigin() & positioning by parent Panel
            this._actualAboveOriginX = widthConstraint / 2;
            this._actualAboveOriginY = heightConstraint / 2;
            this._actualBelowOriginX = -widthConstraint / 2;
            this._actualBelowOriginY = -heightConstraint / 2;
            this._adjustLayoutForOrigin();
        };
        /**
         * Layout the positions of this panel's sub-panels, based horizontal layoutDir,
         * but without regard to origin of this panel.
         *
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        BasePanel.prototype._horizontalLayout = function (widthConstraint, heightConstraint) {
            var sub;
            var subFinalwidth;
            var spareAmountPerStretcher = (this._nStretchers[0] > 0) ? (widthConstraint - this.getReqdWidth()) / this._nStretchers[0] : 0;
            // call layout of each sub & set the position.y
            var heightLessMargins = heightConstraint - (this.verticalMargin * 2);
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);
                    // call the layout of the sub-panel
                    sub._layout(subFinalwidth, heightLessMargins);
                    // position y
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM) {
                        sub.position.y = this.verticalMargin - sub._actualBelowOriginY;
                    }
                    else if (sub.verticalAlignment === Panel.ALIGN_VCENTER) {
                        sub.position.y = ((heightConstraint - sub.getReqdHeight()) / 2) - sub._actualBelowOriginY;
                    }
                    else {
                        sub.position.y = heightConstraint - (this.verticalMargin + sub._actualAboveOriginY);
                    }
                }
            }
            // position.x each sub with either LEFT or HCENTER alignment
            var left = this.horizontalMargin;
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub.horizontalAlignment === Panel.ALIGN_RIGHT) {
                        break; // once a right is encountered, no more lefts or a center
                    }
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);
                    if (sub.horizontalAlignment === Panel.ALIGN_LEFT) {
                        sub.position.x = left - sub._actualBelowOriginX;
                        left += subFinalwidth;
                    }
                    else {
                        sub.position.x = ((widthConstraint - subFinalwidth) / 2) - sub._actualBelowOriginX;
                        break; // lefts first then only up to 1 center, so done
                    }
                }
                else {
                    left += this.placeHolderWidth;
                }
            }
            // position.x each sub with RIGHT alignment
            var right = widthConstraint - this.horizontalMargin;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub.horizontalAlignment !== Panel.ALIGN_RIGHT) {
                        break; // done after the last right, since going in reverse order
                    }
                    subFinalwidth = sub.getReqdWidth() + (sub.stretchHorizontal ? spareAmountPerStretcher : 0);
                    sub.position.x = right - sub._actualAboveOriginX;
                    right -= subFinalwidth;
                }
                else {
                    right -= this.placeHolderWidth;
                }
            }
        };
        /**
         * Layout the positions of this panel's sub-panels, based vertical layoutDir,
         * but without regard to origin of this panel.
         *
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        BasePanel.prototype._verticalLayout = function (widthConstraint, heightConstraint) {
            var sub;
            var subFinalHeight;
            var spareAmountPerStretcher = (this._nStretchers[1] > 0) ? (heightConstraint - this.getReqdHeight()) / this._nStretchers[1] : 0;
            // call layout of each sub & set the position.x
            var widthLessMargins = widthConstraint - (this.horizontalMargin * 2);
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);
                    // call the layout of the sub-panel
                    sub._layout(widthLessMargins, subFinalHeight);
                    // position x
                    if (sub.stretchHorizontal) {
                        sub.position.x = this.horizontalMargin - sub._actualBelowOriginX;
                    }
                    else if (sub.horizontalAlignment === Panel.ALIGN_LEFT) {
                        sub.position.x = this.horizontalMargin - sub._actualBelowOriginX;
                    }
                    else if (sub.horizontalAlignment === Panel.ALIGN_HCENTER) {
                        sub.position.x = ((widthConstraint - sub.getReqdWidth()) / 2) - sub._actualBelowOriginX;
                    }
                    else {
                        sub.position.x = widthConstraint - (this.horizontalMargin + sub._actualAboveOriginX);
                    }
                }
            }
            // position.y each sub with either TOP or VCENTER alignment
            var top = heightConstraint - this.verticalMargin;
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM) {
                        break; // once a bottom is encountered, no more tops or a center
                    }
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);
                    if (sub.verticalAlignment === Panel.ALIGN_TOP) {
                        sub.position.y = top - sub._actualAboveOriginY;
                        top -= subFinalHeight;
                    }
                    else {
                        sub.position.y = ((heightConstraint - subFinalHeight) / 2) - sub._actualBelowOriginY;
                        break; // tops first then only up to 1 center, so done
                    }
                }
                else {
                    top -= this.placeHolderHeight;
                }
            }
            // position.y each sub with BOTTOM alignment
            var bot = this.verticalMargin;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub.verticalAlignment !== Panel.ALIGN_BOTTOM) {
                        break; // done after the last bottom, since going in reverse order
                    }
                    subFinalHeight = sub.getReqdHeight() + (sub.stretchVertical ? spareAmountPerStretcher : 0);
                    sub.position.y = bot - sub._actualBelowOriginY;
                    bot += subFinalHeight;
                }
                else {
                    bot += this.placeHolderHeight;
                }
            }
        };
        /**
         * Applied after all sub-panels have been placed.  Allows for easier to understand code
         *
         */
        BasePanel.prototype._adjustLayoutForOrigin = function () {
            var sub;
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    // adjust for centering, use _actualAboveOrigin.. incase of stretching
                    sub.position.x += this._actualBelowOriginX;
                    sub.position.y += this._actualBelowOriginY;
                }
            }
        };
        /**
         * @param {boolean} isHorizontal - the layout direction to check for, vertical when false
         * @return {boolean} true, when:
         *       - follows (Lefts, tops), up to 1 center, (rights, bottoms) order
         *       - has no stretchers if it also has a center
         */
        BasePanel.prototype._validateAlignmnent = function (isHorizontal) {
            var centerValue = isHorizontal ? Panel.ALIGN_HCENTER : Panel.ALIGN_VCENTER;
            var hasStretcher = this._nStretchers[isHorizontal ? 0 : 1] > 0;
            var nCenters = 0;
            var lastFound = -4;
            var value, hValue, vValue;
            for (var i = 0; i < this._subs.length; i++) {
                if (this._subs[i] && this._subs[i] !== null) {
                    if (this._subs[i]._topLevel) {
                        BABYLON.Tools.Error("Cannot embed top level panel in others.  Found in: " + this.name);
                        return false;
                    }
                    hValue = this._subs[i].horizontalAlignment;
                    if (hValue < Panel.ALIGN_LEFT || hValue > Panel.ALIGN_RIGHT) {
                        BABYLON.Tools.Error("Horizontal Layout value invalid for " + this._subs[i].name);
                        return false;
                    }
                    vValue = this._subs[i].verticalAlignment;
                    if (vValue < Panel.ALIGN_TOP || vValue > Panel.ALIGN_BOTTOM) {
                        BABYLON.Tools.Error("Vertical Layout value invalid for " + this._subs[i].name);
                        return false;
                    }
                    var value = isHorizontal ? hValue : vValue;
                    if (lastFound <= value) {
                        lastFound = value;
                        if (value === centerValue) {
                            if (hasStretcher) {
                                BABYLON.Tools.Error("Stretch & center alignments not compatible.  found amoung sub-panels of: " + this.name);
                                return false;
                            }
                            nCenters++;
                        }
                    }
                    else {
                        BABYLON.Tools.Error("Must be in " + (isHorizontal ? "Lefts, up to 1 center, rights" : "tops, up to 1 center, bottoms") + " order for: " + this.name);
                        return false;
                    }
                }
            }
            if (nCenters > 1) {
                BABYLON.Tools.Error("Multiple center alignments not valid for: " + this.name);
                return false;
            }
            return true;
        };
        /**
         * responsible for setting a number of attributes, based on interogating its sub-panels
         *
         * _maxAboveOrigin   :  The width of the sub-panels (added together or widest), / 2 for centering / rotation
         * _minBelowOrigin   :  _maxAboveOrigin with sign flipped, for centering / rotation
         * _nStretchers      :  # of sub-panels specifying stretch,[0] & [1], (horizontal & vertical)
         */
        BasePanel.prototype._calcRequiredSize = function () {
            // accumulators of dimensions, when orienting in their direction
            var width = [0, 0, 0]; //left, hcenter, right
            var height = [0, 0, 0]; //top , vcenter, bottom
            var depth = 0;
            var maxWidth = 0;
            var maxHeight = 0;
            var subWidth;
            var subHeight;
            var subDepth;
            var idxWidth;
            var idxHeight;
            // accumulators of the number of sub-panels specifying stretch 
            this._nStretchers[0] = 0; // stretchHorizontal
            this._nStretchers[1] = 0; // stretchVertical
            // internal ref vars to reduce code
            var sub;
            // iternate through each of the sub-panels
            for (var i = 0; i < this._subs.length; i++) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub.stretchHorizontal)
                        this._nStretchers[0]++;
                    if (sub.stretchVertical)
                        this._nStretchers[1]++;
                    sub._calcRequiredSize();
                    subWidth = sub.getReqdWidth();
                    subHeight = sub.getReqdHeight();
                    subDepth = sub.getReqdDepth();
                    if (sub.horizontalAlignment === Panel.ALIGN_LEFT)
                        idxWidth = 0;
                    if (sub.horizontalAlignment === Panel.ALIGN_HCENTER)
                        idxWidth = 1;
                    if (sub.horizontalAlignment === Panel.ALIGN_RIGHT)
                        idxWidth = 2;
                    if (sub.verticalAlignment === Panel.ALIGN_TOP)
                        idxHeight = 0;
                    if (sub.verticalAlignment === Panel.ALIGN_HCENTER)
                        idxHeight = 1;
                    if (sub.verticalAlignment === Panel.ALIGN_BOTTOM)
                        idxHeight = 2;
                    // determine if this sub is the thickest
                    if (depth < subDepth) {
                        depth = subDepth;
                    }
                    // for horizontal add the width & determine if this sub is the highest
                    if (this._layoutDir === Panel.LAYOUT_HORIZONTAL) {
                        if (maxHeight < subHeight) {
                            maxHeight = subHeight;
                        }
                        width[idxWidth] += subWidth;
                    }
                    else {
                        if (maxWidth < subWidth) {
                            maxWidth = subWidth;
                        }
                        height[idxHeight] += subHeight;
                    }
                }
                else {
                    // when a sub-panel is null, give it a plaeholder allocation
                    if (this._layoutDir === Panel.LAYOUT_HORIZONTAL) {
                        width[idxWidth] += this.placeHolderWidth;
                    }
                    else {
                        height[idxHeight] += this.placeHolderHeight;
                    }
                }
            }
            // boil the 3 widths / heights down to the max versions, according to layout 
            if (this._layoutDir === Panel.LAYOUT_HORIZONTAL) {
                maxWidth = width[1]; // always add center 
                if (width[1] > 0) {
                    // when there is a centered sub, always used the larger of left-right for both
                    if (width[0] < width[2]) {
                        width[0] = width[2];
                    }
                    else {
                        width[2] = width[0];
                    }
                }
                maxWidth += width[0] + width[2];
            }
            else {
                maxHeight = height[1]; // always add center 
                if (height[1] > 0) {
                    // when there is a centered sub, always used the larger of top-bottom for both
                    if (height[0] < height[2]) {
                        height[0] = height[2];
                    }
                    else {
                        height[2] = height[0];
                    }
                }
                maxHeight += height[0] + height[2];
            }
            this._maxAboveOrigin.z = (depth / 2);
            this._minBelowOrigin.z = -this._maxAboveOrigin.z;
            this._assignRequirements(maxWidth, maxHeight, depth);
        };
        /**
         * @return {number} - This returns the sum of the max X of a vertex, above 0, & the min X of a vertex, when less than 0
         * This handle Letter kerning, where the min X is positive.  Want to include this space as part of width.
         */
        BasePanel.prototype.getReqdWidth = function () {
            return this._maxAboveOrigin.x - ((this._minBelowOrigin.x < 0) ? this._minBelowOrigin.x : 0);
        };
        /**
         * @return {number} - This returns the sum of the max Y of a vertex, above 0, & the min Y of a vertex, when less than 0
         * This handle Letter baselining, though no letters start above baseline.
         */
        BasePanel.prototype.getReqdHeight = function () {
            return this._maxAboveOrigin.y - ((this._minBelowOrigin.y < 0) ? this._minBelowOrigin.y : 0);
        };
        /**
         * make the actual assignments out of _calcRequiredSize, so can be called from DialogSys._adjustCameraForPanel,
         * when fitToWindow.  There is no gauranttee that all width & height will be used, if the is no align_right or
         * align_bottom direct child, or a stretcher somewhere in the tree.
         */
        BasePanel.prototype._assignRequirements = function (width, height, depth) {
            // to ensure centered rotation the width, height, & depth are spread above and below origin.
            this._maxAboveOrigin.x = this.horizontalMargin + width / 2;
            this._minBelowOrigin.x = -this._maxAboveOrigin.x;
            this._maxAboveOrigin.y = this.verticalMargin + height / 2;
            this._minBelowOrigin.y = -this._maxAboveOrigin.y;
            if (!depth || depth < this.borderDepth)
                depth = this.borderDepth;
            this._maxAboveOrigin.z = depth / 2;
            this._minBelowOrigin.z = -this._maxAboveOrigin.z;
        };
        /**
         * @return {number} - This returns the sum of the max Z of a vertex, above 0, & the min Z of a vertex, when less than 0
         */
        BasePanel.prototype.getReqdDepth = function () {
            return this._maxAboveOrigin.z - ((this._minBelowOrigin.z < 0) ? this._minBelowOrigin.z : 0);
        };
        BasePanel.prototype.setLayerMask = function (maskId) {
            for (var i = this._subs.length - 1; i >= 0; i--) {
                if (this._subs[i] !== null) {
                    this._subs[i].setLayerMask(maskId);
                    // not required at lower level, since setEnabled walks up tree, but should be faster
                    this._subs[i].setEnabled(maskId !== DIALOG.DialogSys.SUSPENDED_DIALOG_LAYER);
                }
            }
            this.layerMask = maskId;
            // need to make sure not pickable, when mask is for suspended level
            this.setEnabled(maskId !== DIALOG.DialogSys.SUSPENDED_DIALOG_LAYER);
        };
        // ================================= Sub-Panel Access / Mod ==================================
        /**
         * Provide the list of sub-panels.  Not getChildren(), since in use by BABYLON.Node.
         * Cannot use getChildren, since this is in order of adding only.
         */
        BasePanel.prototype.getSubPanels = function () { return this._subs; };
        /**
         * Add a sub-panel to the end, or at the index passed.
         * Also sets the parent of the sub-panel to itself.
         *
         * @param {DIALOG.Panel} sub - Panel to be added.
         * @param {number} index - the position at which to add the sub-panel
         */
        BasePanel.prototype.addSubPanel = function (sub, index) {
            if (index !== undefined) {
                this._subs.splice(index, 0, sub);
            }
            else {
                this._subs.push(sub);
            }
            if (sub && sub !== null) {
                sub.parent = this;
                this.setLayerMask(this.layerMask);
            }
            this.invalidateLayout();
        };
        /**
         * remove a sub-panel
         * @param {number} index - the index of the panel to be removed
         */
        BasePanel.prototype.removeAt = function (index, doNotDispose) {
            if ((!doNotDispose) && this._subs[index] && this._subs[index])
                this._subs[index].dispose();
            this._subs.splice(index, 1);
            this.invalidateLayout();
        };
        /**
         * remove all sub-panels
         */
        BasePanel.prototype.removeAll = function (doNotDispose) {
            if ((!doNotDispose)) {
                for (var i = this._subs.length - 1; i >= 0; i--) {
                    if (this._subs[i] && this._subs[i])
                        this._subs[i].dispose();
                }
            }
            this._subs = new Array();
            this.invalidateLayout();
        };
        BasePanel.prototype.getRootPanel = function () {
            var parent = this.parent;
            return (parent) ? parent.getRootPanel() : this;
        };
        // =================================== Appearance Methods ====================================
        /**
         * Method for sub-classes to override.  Keeps the # of constructor arg down
         */
        BasePanel.prototype.useGeometryForBorder = function () {
            return true;
        };
        BasePanel.prototype.getFullScalePlaceholderWidth = function () { return 0.3; };
        BasePanel.prototype.getFullScalePlaceholderHeight = function () { return 0.2; };
        /** align all of the sub-panels in z dim.
         *  @param {number} z - the value each sub-panel should achieve
         */
        BasePanel.prototype.setUniformZ = function (z) {
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.position.z = z + this._minBelowOrigin.z;
                }
            }
            this.invalidateLayout();
        };
        /**
         * Change the scaling.x & scaling.y recursively of each sub-panel.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {BasePanel} For convenience of stringing methods together
         */
        BasePanel.prototype.setSubsFaceSize = function (size, relative) {
            // _xyScale has no meaning in anything other than a letter, but recording for merging in a Label
            if (relative) {
                this._xyScale *= size;
            }
            else {
                this._xyScale = size;
            }
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    if (sub instanceof DIALOG.Letter) {
                        sub.setFaceSize(size, relative);
                    }
                    else {
                        sub.setSubsFaceSize(size, relative);
                    }
                }
            }
            var x = this._bold ? this._xyScale * BasePanel.BOLD_MULT : this._xyScale;
            this.placeHolderWidth = this.getFullScalePlaceholderWidth() * x;
            this.placeHolderHeight = this.getFullScalePlaceholderHeight() * this._xyScale;
            return this;
        };
        /**
         * Change the scaling.x & scaling.y of each panel.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {BasePanel} For convenience of stringing methods together
         */
        BasePanel.prototype.setFaceSize = function (size, relative) {
            if (relative) {
                this._xyScale *= size;
            }
            else {
                this._xyScale = size;
            }
            this._scaleXY();
            return this;
        };
        /**
         * Change the scaling.x of each letter, based on the bold setting
         * @param {boolean} bold - when true make wider in scaling.x than in scaling.y
         * @return {BasePanel} For convenience of stringing methods together
         */
        BasePanel.prototype.setBold = function (bold) {
            this._bold = bold;
            this._scaleXY();
            return this;
        };
        /**
         * Change the scaling.x & scaling.y of each panel.
         */
        BasePanel.prototype._scaleXY = function () {
            var x = this._bold ? this._xyScale * BasePanel.BOLD_MULT : this._xyScale;
            this.scaling.x = x;
            this.scaling.y = this._xyScale;
            this.invalidateLayout();
        };
        /**
         * Change the scaling.z  of each panel.
         * @param {number} z - Value for the Z dimension
         * @return {BasePanel} For convenience of stringing methods together
         */
        BasePanel.prototype.scaleZ = function (z) {
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.scaling.z = z;
                }
            }
            return this;
        };
        BasePanel.prototype.stretch = function (vert, horiz) {
            this.stretchVertical = vert;
            this.stretchHorizontal = horiz;
            this.invalidateLayout();
            return this;
        };
        BasePanel.prototype.vertAlign = function (align) {
            this.verticalAlignment = align;
            this.invalidateLayout();
            return this;
        };
        BasePanel.prototype.horizontalAlign = function (align) {
            this.horizontalAlignment = align;
            this.invalidateLayout();
            return this;
        };
        BasePanel.prototype.margin = function (vert, horz) {
            this.verticalMargin = vert;
            this.horizontalMargin = horz;
            this.invalidateLayout();
            return this;
        };
        BasePanel.prototype.disolve = function (visibility, exceptionButton) {
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.disolve(visibility, exceptionButton);
                }
            }
            if (this !== exceptionButton) {
                this.visibility = this.isBorderVisible() ? visibility : 0;
                if (this._button) {
                    this.isPickable = false;
                }
            }
        };
        BasePanel.prototype.reAppear = function () {
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.reAppear();
                }
            }
            this.visibility = this.isBorderVisible() ? 1 : 0;
            if (this._button) {
                this.isPickable = true;
            }
        };
        // ======================================== Overrides ========================================
        /**
         * recursing disposes of letter clones & original when no more in use.  Must make MeshFactory work.
         * @param {boolean} doNotRecurse - ignored
         */
        BasePanel.prototype.dispose = function (doNotRecurse) {
            this.unregisterBeforeRender(BasePanel._beforeRender);
            _super.prototype.dispose.call(this, false);
        };
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        BasePanel.prototype.freezeWorldMatrixTree = function () {
            this.freezeWorldMatrix();
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.freezeWorldMatrixTree();
                }
            }
        };
        /**
          * @override
          * Do the entire hierarchy, in addition
          */
        BasePanel.prototype.unfreezeWorldMatrixTree = function () {
            _super.prototype.unfreezeWorldMatrix.call(this);
            var sub;
            for (var i = this._subs.length - 1; i >= 0; i--) {
                sub = this._subs[i];
                if (sub && sub !== null) {
                    sub.unfreezeWorldMatrixTree();
                }
            }
        };
        BasePanel.BOLD_MULT = 1.4;
        // statics for borders
        BasePanel._NORMALS = [
            0, 0, -1, 0, 0, -1, 0.7071, 0, -0.7071, 0.7071, 0, 0.7071, 0.7071, 0, -0.7071, 0, 0, 1, 0.7071, 0, 0.7071, -0.7071, 0, -0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0.7071, 0, 0, 1, 0, 0, -1, -0.7071, 0, -0.7071, 0, -0.7071, -0.7071, 0, 0, -1, 0, 0.7071, 0.7071, 0, 0, 1, -0.7071, 0, -0.7071, -0.5773, 0.5773, -0.5773, -0.5773,
            0.5773, 0.5773, 0.7071, 0, 0.7071, 0.5773, 0.5773, 0.5773, 0.5773, 0.5773, -0.5773, -0.7071, 0, 0.7071, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, -0.5773, 0, -0.7071, 0.7071, 0.7071, 0, -0.7071, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.5773, 0, 0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0, 1, 0, -0.7071,
            -0.7071, -0.7071, 0, -0.7071, 0, 0.7071, 0.7071, -0.7071, 0, 0.7071, 0.7071, 0, -0.7071, 0, -0.7071, 0.7071, 0.7071, 0, 0.7071 //,0,0,-1,   0,0,-1,   0,0,-1,   0,0,-1
        ];
        BasePanel._TOP_LEVEL_NORMALS = [
            0, 0, -1, 0, 0, -1, 0.7071, 0, -0.7071, 0.7071, 0, 0.7071, 0.7071, 0, -0.7071, 0, 0, 1, 0.7071, 0, 0.7071, -0.7071, 0, -0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0.7071, 0, 0, 1, 0, 0, -1, -0.7071, 0, -0.7071, 0, -0.7071, -0.7071, 0, 0, -1, 0, 0.7071, 0.7071, 0, 0, 1, -0.7071, 0, -0.7071, -0.5773, 0.5773, -0.5773, -0.5773,
            0.5773, 0.5773, 0.7071, 0, 0.7071, 0.5773, 0.5773, 0.5773, 0.5773, 0.5773, -0.5773, -0.7071, 0, 0.7071, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, -0.5773, 0, -0.7071, 0.7071, 0.7071, 0, -0.7071, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.5773, 0, 0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0, 1, 0, -0.7071,
            -0.7071, -0.7071, 0, -0.7071, 0, 0.7071, 0.7071, -0.7071, 0, 0.7071, 0.7071, 0, -0.7071, 0, -0.7071, 0.7071, 0.7071, 0, 0.7071, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
        ];
        BasePanel._INDICES = [
            0, 1, 2, 3, 4, 2, 5, 3, 6, 7, 8, 9, 10, 9, 8, 11, 7, 12, 13, 1, 14, 15, 5, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 24, 23, 27, 28, 29, 30, 18, 17, 15, 30, 31, 13, 25, 24, 4, 0, 2, 6, 3, 2, 32, 5, 6, 12, 7, 9, 16, 10, 8, 14, 11, 12, 28, 27, 1, 28, 1, 33, 34, 25, 13, 34, 13, 14, 21, 5, 35, 1, 13, 33, 21, 20, 5, 36, 19, 15, 36, 15, 16, 36, 17, 19, 37, 20, 22, 5,
            15, 35, 34, 23, 25, 26, 32, 38, 32, 39, 29, 32, 26, 10, 39, 27, 29, 30, 0, 31, 32, 29, 38, 26, 23, 10, 0, 37, 22, 0, 30, 11, 22, 21, 35, 30, 17, 11, 22, 35, 31, 0, 22, 31, 19, 18, 30, 19, 30, 15, 29, 28, 33, 35, 15, 31, 38, 29, 33, 13, 26, 33, 26, 38, 33, 13, 24, 26 //,40,41,42,43,40,42
        ];
        BasePanel._TOP_LEVEL_INDICES = [
            0, 1, 2, 3, 4, 2, 5, 3, 6, 7, 8, 9, 10, 9, 8, 11, 7, 12, 13, 1, 14, 15, 5, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 24, 23, 27, 28, 29, 30, 18, 17, 15, 30, 31, 13, 25, 24, 4, 0, 2, 6, 3, 2, 32, 5, 6, 12, 7, 9, 16, 10, 8, 14, 11, 12, 28, 27, 1, 28, 1, 33, 34, 25, 13, 34, 13, 14, 21, 5, 35, 1, 13, 33, 21, 20, 5, 36, 19, 15, 36, 15, 16, 36, 17, 19, 37, 20, 22, 5,
            15, 35, 34, 23, 25, 26, 32, 38, 32, 39, 29, 32, 26, 10, 39, 27, 29, 30, 0, 31, 32, 29, 38, 26, 23, 10, 0, 37, 22, 0, 30, 11, 22, 21, 35, 30, 17, 11, 22, 35, 31, 0, 22, 31, 19, 18, 30, 19, 30, 15, 29, 28, 33, 35, 15, 31, 38, 29, 33, 13, 26, 33, 26, 38, 33, 13, 24, 26, 40, 41, 42, 43, 40, 42
        ];
        return BasePanel;
    }(BABYLON.Mesh));
    DIALOG.BasePanel = BasePanel;
    //================================================================================================
    //================================================================================================
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel(name, _layoutDir, topLevel) {
            _super.call(this, name, DIALOG.DialogSys._scene, null, null, false, _layoutDir, false, topLevel);
        }
        // ========================================= Statics  ========================================
        /**
         * Make a Panel with a sublist & optional title
         * @param {string} title -
         */
        Panel.makeList = function (title, labels, layoutDir, listFontSize, titleMaterial, topLevel) {
            if (layoutDir === void 0) { layoutDir = Panel.LAYOUT_VERTICAL; }
            if (listFontSize === void 0) { listFontSize = 1.0; }
            var ret = new Panel('list-' + title, Panel.LAYOUT_VERTICAL, topLevel);
            ret.setBorderVisible(true);
            var needInnerBorder = title && title != null && title.replace(' ', '').length > 0;
            if (needInnerBorder) {
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = Panel.ALIGN_HCENTER;
                if (titleMaterial && titleMaterial !== null) {
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
            for (var i = 0; i < labels.length; i++) {
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
        };
        Panel.nestPanels = function (title, innerPs, layoutDir, showOuterBorder, titleMaterial, topLevel) {
            if (layoutDir === void 0) { layoutDir = Panel.LAYOUT_VERTICAL; }
            if (showOuterBorder === void 0) { showOuterBorder = false; }
            var ret = new Panel('nest-' + title, Panel.LAYOUT_VERTICAL, topLevel);
            ret.setBorderVisible(showOuterBorder);
            if (title && title != null && title.replace(' ', '').length > 0) {
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = Panel.ALIGN_HCENTER;
                if (titleMaterial && titleMaterial !== null) {
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
            for (var i = 0; i < innerPs.length; i++) {
                if (layoutDir === Panel.LAYOUT_VERTICAL)
                    innerPs[i].stretchHorizontal = true;
                else
                    innerPs[i].stretchVertical = true;
                kids.addSubPanel(innerPs[i]);
            }
            ret.addSubPanel(kids);
            return ret;
        };
        Panel.ExtractMax = function (mesh) {
            var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var maximum = new BABYLON.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            var nVert = mesh.getTotalVertices();
            for (var i = 0; i < nVert; i++) {
                var current = new BABYLON.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                maximum = BABYLON.Vector3.Maximize(current, maximum);
            }
            return maximum;
        };
        Object.defineProperty(Panel, "LAYOUT_HORIZONTAL", {
            get: function () { return Panel._LAYOUT_HORIZONTAL; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "LAYOUT_VERTICAL", {
            get: function () { return Panel._LAYOUT_VERTICAL; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_LEFT", {
            get: function () { return Panel._ALIGN_LEFT; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_HCENTER", {
            get: function () { return Panel._ALIGN_HCENTER; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_RIGHT", {
            get: function () { return Panel._ALIGN_RIGHT; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_TOP", {
            get: function () { return Panel._ALIGN_TOP; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_VCENTER", {
            get: function () { return Panel._ALIGN_VCENTER; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel, "ALIGN_BOTTOM", {
            get: function () { return Panel._ALIGN_BOTTOM; },
            enumerable: true,
            configurable: true
        });
        // ========================================== Enums  =========================================    
        Panel._LAYOUT_HORIZONTAL = 0;
        Panel._LAYOUT_VERTICAL = 1;
        Panel._ALIGN_LEFT = -3;
        Panel._ALIGN_HCENTER = -2;
        Panel._ALIGN_RIGHT = -1;
        Panel._ALIGN_TOP = 1;
        Panel._ALIGN_VCENTER = 2;
        Panel._ALIGN_BOTTOM = 3;
        return Panel;
    }(BasePanel));
    DIALOG.Panel = Panel;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
var DIALOG;
(function (DIALOG) {
    var Letter = (function (_super) {
        __extends(Letter, _super);
        /**
         * Full BABYLON.Mesh parameter to support cloning.  Defaulting on BasePanel parameter additions.
         */
        function Letter(name, scene, parent, source, doNotCloneChildren) {
            if (parent === void 0) { parent = null; }
            // Panel's _layoutDir, _button,  & _topLevel constructor parms, forced to default to (LAYOUT_HORIZONTAL, false, & false)
            _super.call(this, name, scene, parent, source, doNotCloneChildren);
            // values for max above & min below; defaults good for most; Fontfactory overrides for extended letters
            this.maxAboveY = Letter.LETTER_ABOVE; // H, T, I, etc
            this.minBelowY = -0.23; // g is the lowest   
            // indicate this letter is really a result of merged meshes
            this._consolidated = false;
            // remove inner margins
            this.horizontalMargin = 0;
            this.verticalMargin = 0;
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
        Letter.prototype.useGeometryForBorder = function () {
            return false;
        };
        /**
         * @override
         * No actual layout of subs.  Need to set the _actual members, as super does though.
         */
        Letter.prototype._layout = function (widthConstraint, heightConstraint) {
            if (!this._actualAboveOriginX) {
                this.visibility = 1;
            }
            this._actualAboveOriginX = this._maxAboveOrigin.x;
            this._actualAboveOriginY = this._maxAboveOrigin.y;
            this._actualBelowOriginX = this._minBelowOrigin.x;
            this._actualBelowOriginY = this._minBelowOrigin.y;
        };
        /**
         * @override
         * No subs to deal with.  Use .682 for _maxAboveOrigin.y & -.23 for _minBelowOrigin.y.
         * This way all letters line up, and all lines of same scale always same height.
         */
        Letter.prototype._calcRequiredSize = function () {
            // done only once.  Deferred till now, since putting in setVerticesData is never called in clones
            if (!this._minWorld) {
                var extend = BABYLON.Tools.ExtractMinAndMax(this.getVerticesData(BABYLON.VertexBuffer.PositionKind), 0, this.getTotalVertices());
                this._minWorld = extend.minimum;
                this._maxWorld = extend.maximum;
            }
            this._maxAboveOrigin.x = this._maxWorld.x * (this._consolidated ? 1 : this.scaling.x);
            this._maxAboveOrigin.y = this.maxAboveY * (this._consolidated ? this._xyScale : this.scaling.y);
            this._maxAboveOrigin.z = this._maxWorld.z * this.scaling.z;
            this._minBelowOrigin.x = this._minWorld.x * (this._consolidated ? 1 : this.scaling.x);
            this._minBelowOrigin.y = this.minBelowY * (this._consolidated ? this._xyScale : this.scaling.y);
            this._minBelowOrigin.z = this._minWorld.z * this.scaling.z;
        };
        /**
         * @override
         * No meaning for letters
         */
        Letter.prototype.addSubPanel = function (sub, index) {
            BABYLON.Tools.Error("Letters can have no sub-panels");
        };
        /** @override */ Letter.prototype.getSubPanel = function () { return null; };
        /** @override */ Letter.prototype.removeAt = function (index, doNotDispose) { };
        /** @override */ Letter.prototype.removeAll = function (doNotDispose) { };
        Letter.LETTER_ABOVE = 0.682;
        return Letter;
    }(DIALOG.BasePanel));
    DIALOG.Letter = Letter;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
/// <reference path="./Letter.ts"/>
var DIALOG;
(function (DIALOG) {
    var Label = (function (_super) {
        __extends(Label, _super);
        /**
         * Sub-class of BasePanel containing a set of Letter subPanels.
         * @param {string} letters - The list of characters to use.  Those not found in typeface & ' ' result in subPanels of null.
         * @param {string} typeFace - The module name to use for Meshes.  User modules must be loaded via:
         *                            TOWER_OF_BABEL.MeshFactory.MODULES.push(new myFont3D.MeshFactory(scene));
         * @param {BABYLON.Material} customMaterial - Optional material to use, otherwise DialogSys.CURRENT_FONT_MAT_ARRAY is used.
         * @param {boolean} _button - Indicate this is to be used as a button, so install no border material.
         * @param {boolean} _prohibitMerging - Indicate this is to be kept as separate Letter meshes
         */
        function Label(letters, typeFace, customMaterial, _button, _prohibitMerging) {
            if (typeFace === void 0) { typeFace = Label.DEFAULT_FONT_MODULE; }
            _super.call(this, letters, DIALOG.DialogSys._scene, null, null, false, DIALOG.Panel.LAYOUT_HORIZONTAL, _button);
            this._prohibitMerging = _prohibitMerging;
            this._merged = false;
            this._isTypeface3D = typeFace.indexOf("3D") > -1;
            var meshes = DIALOG.FontFactory.getLetters(letters, typeFace, customMaterial);
            // add all meshes as subPanels, null or not
            for (var i = 0; i < meshes.length; i++) {
                this.addSubPanel(meshes[i]);
            }
            // align in Z dim, so 3D letters, re scaled by factory, are positioned at 0 in Z.  No effect in 2D.
            this.setUniformZ(0);
            if (!_button) {
                this.material = DIALOG.DialogSys.ORANGE[1];
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
        Label.prototype.setFontSize = function (size, relative) {
            return this.setSubsFaceSize(size, relative);
        };
        /**
         * Set the material of each letter.
         * @param {Array<BABYLON.StandardMaterial>} matArray - An array of materials to choose from based on geometry
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         * @return {Label} For convenience of stringing methods together
         */
        Label.prototype.setLetterMaterial = function (matArray, selectedText) {
            var mat = matArray[(this._isTypeface3D || DIALOG.DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
            var letters = this.getSubPanels();
            var startIdx = -1;
            var endIdx;
            if (selectedText) {
                startIdx = this.name.indexOf(selectedText);
                endIdx = startIdx + selectedText.length - 1;
            }
            if (startIdx === -1) {
                startIdx = 0;
                endIdx = letters.length - 1;
            }
            for (var i = startIdx; i <= endIdx; i++) {
                if (letters[i] !== null) {
                    letters[i].material = mat;
                }
            }
            return this;
        };
        // ======================================== Overrides ========================================
        /** @override */ Label.prototype.getFullScalePlaceholderWidth = function () { return 0.15; };
        /**
         * @override
         * Restrict adds of only Letters.
         */
        Label.prototype.addSubPanel = function (sub, index) {
            if (sub && !(sub instanceof DIALOG.Letter)) {
                BABYLON.Tools.Error("Labels can contain only letters");
                return;
            }
            _super.prototype.addSubPanel.call(this, sub, index);
        };
        /**
         * @override
         */
        Label.prototype._calcRequiredSize = function () {
            _super.prototype._calcRequiredSize.call(this);
            if (!Label.NO_MERGING && !this._prohibitMerging && this.getSubPanels().length > 1 && !this._merged) {
                this._mergeMeshes();
                // do super again, just to be sure
                _super.prototype._calcRequiredSize.call(this);
            }
        };
        /**
         * called from _layout, so _calcRequiredSize already run for entire heirarchy.
         * Essentially, going to take each letter and make a big letter(s)
         */
        Label.prototype._mergeMeshes = function () {
            var subs = this.getSubPanels();
            var nSubs = subs.length;
            var sub;
            var currentMaterial;
            var vertsSoFar = 0;
            var xOffset = 0;
            var letterWidth;
            var priorSpaces = 0;
            var vertexData;
            var otherVertexData;
            var mergedLetters = new Array();
            var maxVerts = DIALOG.DialogSys._scene.getEngine().getCaps().uintIndices ? 1000000 : 65536;
            for (var index = 0; index < nSubs; index++) {
                sub = subs[index];
                if (!sub || sub === null) {
                    priorSpaces++;
                    continue;
                }
                sub.parent = null; // for later computeWorldMatrix
                letterWidth = sub.getReqdWidth();
                vertsSoFar += sub.getTotalVertices();
                if (vertexData) {
                    if (sub.material !== currentMaterial || vertsSoFar > maxVerts) {
                        mergedLetters.push(this._bigLetter(currentMaterial, vertexData));
                        vertexData = undefined;
                        vertsSoFar = 0;
                        xOffset = 0;
                    }
                    else {
                        otherVertexData = this._extractVertexData(sub, xOffset + priorSpaces * this.placeHolderWidth);
                        vertexData.merge(otherVertexData);
                    }
                }
                // starting a new consolidation
                if (!vertexData) {
                    currentMaterial = sub.material;
                    vertexData = this._extractVertexData(sub, priorSpaces * this.placeHolderWidth);
                }
                xOffset += letterWidth + priorSpaces * this.placeHolderWidth;
                priorSpaces = 0;
            }
            // push the last (possibly only) set of merged letters
            mergedLetters.push(this._bigLetter(currentMaterial, vertexData));
            this.removeAll();
            for (var i = 0; i < mergedLetters.length; i++) {
                this.addSubPanel(mergedLetters[i]);
            }
            this._merged = true;
        };
        Label.prototype._extractVertexData = function (letter, xOffset) {
            var vertexData = BABYLON.VertexData.ExtractFromMesh(letter, true);
            letter.position.x = xOffset;
            letter.computeWorldMatrix(true);
            vertexData.transform(letter.worldMatrixFromCache);
            letter.dispose();
            return vertexData;
        };
        Label.prototype._bigLetter = function (material, vertexData) {
            var ret = new DIALOG.Letter(this.name + "-merged", DIALOG.DialogSys._scene);
            vertexData.applyToMesh(ret);
            ret.material = material;
            ret._xyScale = this._xyScale;
            ret._consolidated = true;
            ret._calcRequiredSize();
            return ret;
        };
        Label.NO_MERGING = false;
        return Label;
    }(DIALOG.BasePanel));
    DIALOG.Label = Label;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
/// <reference path="./Label.ts"/>
var DIALOG;
(function (DIALOG) {
    var Button = (function (_super) {
        __extends(Button, _super);
        /**
         * @param {string} label - The text to display on the button.
         * @param {number} _button_type - Either Button.ACTION_BUTTON or Button.RADIO_BUTTON
         * @param {string} typeFace - Optional module name of the font to use instead of default
         */
        function Button(label, _button_type, typeFace) {
            if (_button_type === void 0) { _button_type = Button.ACTION_BUTTON; }
            _super.call(this, label, typeFace, null, true);
            this._button_type = _button_type;
            // afterRender items
            this._chngInProgress = false;
            // for disolving
            this._sysHideButton = false;
            this._disolvedState = 1;
            // initialize the 2 materials for button on first call
            if (!Button.MAT) {
                var multiMaterial = new BABYLON.MultiMaterial("button", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(DIALOG.DialogSys.GREY[1]); // for sides, culling off
                multiMaterial.subMaterials.push(DIALOG.DialogSys.GREY[0]); // for back
                Button.MAT = multiMaterial;
                multiMaterial = new BABYLON.MultiMaterial("button selected", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(DIALOG.DialogSys.ORANGE[1]); // for sides, culling off
                multiMaterial.subMaterials.push(DIALOG.DialogSys.GREY[0]); // for back
                Button.SELECTED_MAT = multiMaterial;
            }
            // customize settings for buttons            
            this.setBorderVisible(true);
            this.borderInsideVert *= 1.5;
            this.horizontalMargin *= 1.5;
            this.verticalMargin *= 1.5;
            this.setFontSize(0.65);
            this.setSelected(false); // assigns the multi material too
            this.enableButton(true); // assigns the material of the letters too
            var ref = this;
            this.registerPickAction(function () {
                if (!ref._panelEnabled)
                    return;
                ref.setSelected(true);
            });
            //register after Renderer, when Button.ACTION_BUTTON
            if (this._button_type === Button.ACTION_BUTTON) {
                _super.prototype.registerAfterRender.call(this, Button._delayedStart);
            }
        }
        /**
        * _delayedStart() registered only for Button.ACTION_BUTTON types
        */
        Button._delayedStart = function (mesh) {
            var asButton = mesh;
            if (asButton._chngInProgress) {
                if (asButton._disolvedState === 1 || asButton._disolvedState === 0) {
                    // after delay change back to un-selected, do not change _chngInProgress till after, so can be used when disolving
                    asButton.setSelected(false);
                    asButton._chngInProgress = false;
                    if (asButton._callback) {
                        asButton._callback(asButton);
                    }
                }
                else {
                    asButton._disolvedState = Math.max(asButton._disolvedState - Button.DISOLVE_STEP_RATE, 0);
                    asButton._rootPanel.disolve(asButton._disolvedState, asButton);
                }
            }
            else if (asButton.material == Button.SELECTED_MAT) {
                asButton._chngInProgress = true;
            }
        };
        // =============================== Selection / Action Methods ================================
        /**
         * Indicate whether button is selected or not.  Callable in user code regardless of enabled or not.
         * Visibly changes out the material to indicate button is selected or not.
         * @param {boolean} selected - new value to set to
         * @param {boolean} noCallbacks - when true, do nothing in addition but change material.
         * Used in constructor and by after renderer to unselect after click.
         */
        Button.prototype.setSelected = function (selected, noCallbacks) {
            this._selected = selected;
            var isDisolved = this._disolvedState === 0;
            this.material = isDisolved ? Button._DISOLVED_MAT : (selected ? Button.SELECTED_MAT : Button.MAT);
            if (!noCallbacks) {
                if (this._group)
                    this._group.reportSelected(this);
            }
            if (this._sysHideButton) {
                if (!this._chngInProgress) {
                    this._rootPanel = this.getRootPanel();
                    if (isDisolved) {
                        this._rootPanel.reAppear();
                        this._disolvedState = 1;
                        this.material = Button.SELECTED_MAT;
                    }
                    else {
                        // anything less than 1 & afterrenderer knows to disolve
                        this._disolvedState = 0.99;
                    }
                }
            }
        };
        /**
         * Method to indicate clicks should be proecessed. Also assigns material of the letters.
         * Sets the member _panelEnabled in BasePanel.  NOT using 'enabled', since already in use by Babylon.
         * DO NOT change to 'set Enabled' due to that.
         * @param {boolean} enabled - New value to assign
         */
        Button.prototype.enableButton = function (enabled) {
            this._panelEnabled = enabled;
            this.setLetterMaterial(enabled ? DIALOG.DialogSys.BLACK : DIALOG.DialogSys.LT_GREY);
        };
        Object.defineProperty(Button.prototype, "radioGroup", {
            /**
             * Setter of the member identifying the radio group the button belongs to.  Called by Menu.
             * @param
             */
            set: function (group) {
                if (this._button_type === Button.RADIO_BUTTON) {
                    this._group = group;
                }
                else
                    BABYLON.Tools.Error("Button not radio type");
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.hideSystemOnClick = function (hide) {
            this._sysHideButton = hide;
            if (hide && !Button._DISOLVED_MAT) {
                var clear = new BABYLON.StandardMaterial("Clear", DIALOG.DialogSys._scene);
                clear.checkReadyOnlyOnce = true;
                clear.emissiveColor = new BABYLON.Color3(1, 1, 1);
                clear.alpha = 0;
                var multiMaterial = new BABYLON.MultiMaterial("disolved_button", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(clear);
                multiMaterial.subMaterials.push(clear);
                Button._DISOLVED_MAT = multiMaterial;
            }
        };
        Button.prototype.isSystemHidden = function () { return this._disolvedState === 0; };
        // ======================================== Overrides ========================================       
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        Button.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, false);
            this.unregisterAfterRender(Button._delayedStart);
        };
        Button.prototype.reAppearNoCallback = function () {
            this._rootPanel = this.getRootPanel();
            this._rootPanel.reAppear();
            this._disolvedState = 1;
            this.material = Button.MAT;
        };
        Object.defineProperty(Button, "ACTION_BUTTON", {
            get: function () { return Button._ACTION_BUTTON; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button, "RADIO_BUTTON", {
            get: function () { return Button._RADIO_BUTTON; },
            enumerable: true,
            configurable: true
        });
        Button.DISOLVE_STEP_RATE = 0.012; // @ 60 FPS, 1.39 seconds
        // ========================================== Enums  =========================================    
        Button._ACTION_BUTTON = 0;
        Button._RADIO_BUTTON = 2;
        return Button;
    }(DIALOG.Label));
    DIALOG.Button = Button;
})(DIALOG || (DIALOG = {}));
// File generated with Tower of Babel version: 2.2.0 on 05/15/15
var DigitParts;
(function (DigitParts) {
    var meshLib = new Array(3);
    var cloneCount = 1;
    var originalVerts = 0;
    var clonedVerts = 0;
    var MeshFactory = (function () {
        function MeshFactory(_scene, materialsRootDir) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            this._scene = _scene;
            DigitParts.defineMaterials(_scene, materialsRootDir); //embedded version check
        }
        MeshFactory.prototype.getModuleName = function () { return "DigitParts"; };
        MeshFactory.prototype.instance = function (meshName, cloneSkeleton) {
            var ret = null;
            var src;
            switch (meshName) {
                case "Geometry":
                    src = getViable(0, true);
                    if (src === null) {
                        ret = new Geometry("Geometry", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[0].push(ret);
                    }
                    else {
                        ret = new Geometry("Geometry" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "Down":
                    src = getViable(1);
                    if (src === null) {
                        ret = new Down("Down", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[1].push(ret);
                    }
                    else {
                        ret = new Down("Down" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "Up":
                    src = getViable(2);
                    if (src === null) {
                        ret = new Up("Up", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[2].push(ret);
                    }
                    else {
                        ret = new Up("Up" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
            }
            if (ret !== null) {
                if (cloneSkeleton && src && src.skeleton) {
                    var skelName = src.skeleton.name + cloneCount;
                    ret.skeleton = src.skeleton.clone(skelName, skelName);
                }
            }
            else
                BABYLON.Tools.Error("Mesh not found: " + meshName);
            return ret;
        };
        return MeshFactory;
    }());
    DigitParts.MeshFactory = MeshFactory;
    function getViable(libIdx, isNode) {
        var meshes = meshLib[libIdx];
        if (!meshes || meshes === null) {
            if (!meshes)
                meshLib[libIdx] = new Array();
            return null;
        }
        for (var i = meshes.length - 1; i >= 0; i--) {
            if (meshes[i].geometry || isNode)
                return meshes[i];
        }
        return null;
    }
    function clean(libIdx) {
        var meshes = meshLib[libIdx];
        if (!meshes || meshes === null)
            return;
        var stillViable = false;
        for (var i = meshes.length - 1; i >= 0; i--) {
            if (!meshes[i].geometry)
                meshes[i] = null;
            else
                stillViable = true;
        }
        if (!stillViable)
            meshLib[libIdx] = null;
    }
    function getStats() { return [cloneCount, originalVerts, clonedVerts]; }
    DigitParts.getStats = getStats;
    var matLoaded = false;
    // to keep from checkReadyOnlyOnce = true, defineMaterials() must be explicitly called with neverCheckReadyOnlyOnce = true,
    // before any other functions in this module
    function defineMaterials(scene, materialsRootDir, neverCheckReadyOnlyOnce) {
        if (materialsRootDir === void 0) { materialsRootDir = "./"; }
        if (neverCheckReadyOnlyOnce === void 0) { neverCheckReadyOnlyOnce = false; }
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        if (matLoaded)
            return;
        if (materialsRootDir.lastIndexOf("/") + 1 !== materialsRootDir.length) {
            materialsRootDir += "/";
        }
        var material;
        var texture;
        material = new BABYLON.StandardMaterial("DigitParts.border", scene);
        material.ambientColor = new BABYLON.Color3(0.0574, 0.8, 0.0876);
        material.diffuseColor = new BABYLON.Color3(0.0459, 0.64, 0.0701);
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        material.specularPower = 50;
        material.alpha = 1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.border.001", scene);
        material.ambientColor = new BABYLON.Color3(0.0574, 0.8, 0.0876);
        material.diffuseColor = new BABYLON.Color3(0.0459, 0.64, 0.0701);
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        material.specularPower = 50;
        material.alpha = 1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.face", scene);
        material.ambientColor = new BABYLON.Color3(0.8, 0.1603, 0.7314);
        material.diffuseColor = new BABYLON.Color3(0.64, 0.1283, 0.5851);
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        material.specularPower = 50;
        material.alpha = 1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.face.001", scene);
        material.ambientColor = new BABYLON.Color3(0.8, 0.1603, 0.7314);
        material.diffuseColor = new BABYLON.Color3(0.64, 0.1283, 0.5851);
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        material.specularPower = 50;
        material.alpha = 1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        defineMultiMaterials(scene);
        matLoaded = true;
    }
    DigitParts.defineMaterials = defineMaterials;
    function defineMultiMaterials(scene) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var multiMaterial;
        multiMaterial = new BABYLON.MultiMaterial("DigitParts.Multimaterial#0", scene);
        multiMaterial.id = "DigitParts.Multimaterial#0";
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.border"));
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.face"));
        multiMaterial = new BABYLON.MultiMaterial("DigitParts.Multimaterial#1", scene);
        multiMaterial.id = "DigitParts.Multimaterial#1";
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.border.001"));
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.face.001"));
    }
    DigitParts.defineMultiMaterials = defineMultiMaterials;
    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        function Geometry(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.botLeft = cloning ? child_botLeft(scene, this, source.botLeft) : child_botLeft(scene, this);
            this.topLeft = cloning ? child_topLeft(scene, this, source.topLeft) : child_topLeft(scene, this);
            this.top = cloning ? child_top(scene, this, source.top) : child_top(scene, this);
            this.topRite = cloning ? child_topRite(scene, this, source.topRite) : child_topRite(scene, this);
            this.botRite = cloning ? child_botRite(scene, this, source.botRite) : child_botRite(scene, this);
            this.bottom = cloning ? child_bottom(scene, this, source.bottom) : child_bottom(scene, this);
            this.dot = cloning ? child_dot(scene, this, source.dot) : child_dot(scene, this);
            this.center = cloning ? child_center(scene, this, source.center) : child_center(scene, this);
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 0.9523;
            this.scaling.z = 1;
            this.isVisible = false;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
        }
        Geometry.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(0);
        };
        return Geometry;
    }(BABYLON.Mesh));
    DigitParts.Geometry = Geometry;
    function child_botLeft(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".botLeft", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0;
        ret.position.y = 0;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12, 0.12, 0, 0.12, 0.46, 0, 0, 0.46, 0, 0, 0.12, 0, 0, 0, 0, 0.12, 0.12, 0, 0, 0.5196, 0, 0, 0.46, 0, 0.1198, 0.46, 0, 0, 0.12, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_topLeft(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".topLeft", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0;
        ret.position.y = 0.5396;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0, 0.0596, 0, 0.12, 0.0596, 0, 0.12, 0.3996, 0, 0, 0.3996, 0, 0.12, 0.3996, 0, 0, 0.5196, 0, 0, 0, 0, 0.1198, 0.0596, 0, 0, 0.0596, 0, 0, 0.3996, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_top(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".top", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.03;
        ret.position.y = 1.0579;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.42, 0, 0, 0.12, 0, 0, 0.12, -0.12, 0, 0.42, 0, 0, 0.42, -0.12, 0, 0.54, 0, 0, 0.12, 0, 0, 0, 0, 0, 0.12, -0.12, 0, 0.42, -0.12, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_topRite(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".topRite", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.6;
        ret.position.y = 0.5396;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                -0.12, 0.3996, 0, -0.12, 0.0596, 0, 0, 0.0596, 0, 0, 0.3996, 0, 0, 0.5196, 0, -0.12, 0.3996, 0, 0, 0, 0, 0, 0.0596, 0, -0.1198, 0.0596, 0, 0, 0.3996, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_botRite(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".botRite", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.6;
        ret.position.y = 0.5196;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0, -0.0596, 0, -0.12, -0.0596, 0, -0.12, -0.3996, 0, 0, -0.3996, 0, -0.12, -0.3996, 0, 0, -0.5196, 0, 0, 0, 0, -0.1198, -0.0596, 0, 0, -0.0596, 0, 0, -0.3996, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_bottom(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".bottom", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.03;
        ret.position.y = 0;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12, 0.12, 0, 0.12, 0, 0, 0.42, 0, 0, 0.12, 0, 0, 0.12, 0.12, 0, 0, 0, 0, 0.42, 0, 0, 0.54, 0, 0, 0.42, 0.12, 0, 0.42, 0.12, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_dot(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".dot", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.64;
        ret.position.y = -0.0004;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12, 0, 0, 0.12, 0.12, 0, 0, 0.12, 0, 0, 0, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 0, 2
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 4, 0, 6, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    function child_center(scene, parent, source) {
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        var ret = new BABYLON.Mesh(parent.name + ".center", scene, parent, source);
        var cloning = source && source !== null;
        ret.id = ret.name;
        ret.billboardMode = 0;
        ret.position.x = 0.3;
        ret.position.y = 0.5296;
        ret.position.z = 0;
        ret.rotation.x = 0;
        ret.rotation.y = 0;
        ret.rotation.z = 0;
        ret.scaling.x = 1;
        ret.scaling.y = 1;
        ret.scaling.z = 1;
        ret.isVisible = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows = false;
        ret["castShadows"] = false; // typescript safe
        if (!cloning) {
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                -0.1451, -0.06, 0, -0.1451, 0.06, 0, -0.27, -0.0004, 0, -0.0289, -0.06, 0, 0.1449, -0.06, 0, -0.0289, 0.06, 0, 0.1449, 0.06, 0, 0.27, 0, 0
            ], false);
            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
            ], false);
            ret.setIndices([
                0, 1, 2, 3, 4, 5, 6, 4, 7, 1, 0, 3, 4, 6, 5, 5, 1, 3
            ]);
            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 8, 0, 18, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }
    var Down = (function (_super) {
        __extends(Down, _super);
        function Down(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 0.9523;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    0, -0.0034, 0, 0.0024, -0.0017, 0, 0, 0, 0, 0.8105, -0.6441, 0.02, 0.8105, 0.6359, 0.02, -0.0866, -0.0021, 0.02, -0.0895, -0.0041, 0.02, -0.0895, 0, 0.02, 0.75, -0.5368, 0, 0.75, 0.5299, 0, 0.0024, -0.0017, 0
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
                ], false);
                this.setIndices([
                    0, 1, 2, 3, 4, 5, 6, 5, 7, 8, 9, 10
                ]);
                this.setMaterialByID("DigitParts.Multimaterial#0");
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 8, 0, 9, this);
                new BABYLON.SubMesh(1, 8, 3, 9, 3, this);
                this.computeWorldMatrix(true);
            }
        }
        Down.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(1);
        };
        return Down;
    }(DIALOG.Letter));
    DigitParts.Down = Down;
    var Up = (function (_super) {
        __extends(Up, _super);
        function Up(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 0.9523;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    0, 0.0034, 0, -0.0024, 0.0017, 0, 0, 0, 0, -0.8105, 0.6441, 0.02, -0.8105, -0.6359, 0.02, 0.0866, 0.0021, 0.02, 0.0895, 0.0041, 0.02, 0.0895, 0, 0.02, -0.75, 0.5368, 0, -0.75, -0.5299, 0, -0.0024, 0.0017, 0
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
                ], false);
                this.setIndices([
                    0, 1, 2, 3, 4, 5, 6, 5, 7, 8, 9, 10
                ]);
                this.setMaterialByID("DigitParts.Multimaterial#1");
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 8, 0, 9, this);
                new BABYLON.SubMesh(1, 8, 3, 9, 3, this);
                this.computeWorldMatrix(true);
            }
        }
        Up.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(2);
        };
        return Up;
    }(DIALOG.Letter));
    DigitParts.Up = Up;
})(DigitParts || (DigitParts = {}));
/// <reference path="./Letter.ts"/>
var DIALOG;
(function (DIALOG) {
    /**
     * class to retrieve Letters from Mesh factories.  load your own fonts to TOWER_OF_BABEL.MeshFactory.MODULES
     */
    var FontFactory = (function () {
        function FontFactory() {
        }
        /**
         * Initialize the stock Typeface modules, could not do in getLetters, without passing scene everytime.
         * When both Font2D & Font3D are found, Label.DEFAULT_FONT_MODULE is set to Font2D.
         * @param {BABYLON.Scene} scene - needed to instance meshes.
         */
        FontFactory.loadStockTypefaces = function (scene) {
            if (typeof (Font3D) !== 'undefined') {
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font3D.MeshFactory(scene));
                DIALOG.Label.DEFAULT_FONT_MODULE = 'Font3D';
                BABYLON.Tools.Log('Font3D loaded');
            }
            if (typeof (Font2D) !== 'undefined') {
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font2D.MeshFactory(scene));
                DIALOG.Label.DEFAULT_FONT_MODULE = 'Font2D';
                BABYLON.Tools.Log('Font2D loaded');
            }
            // see if an extensions is found
            if (typeof (Font3D_EXT) !== 'undefined') {
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font3D_EXT.MeshFactory(scene));
                BABYLON.Tools.Log('Font3D_EXT loaded');
            }
            if (typeof (Font2D_EXT) !== 'undefined') {
                TOWER_OF_BABEL.MeshFactory.MODULES.push(new Font2D_EXT.MeshFactory(scene));
                BABYLON.Tools.Log('Font2D_EXT loaded');
            }
        };
        /**
         * Get an array of meshes <Letter> which match match the string passed
         * @param {string} letters - list of characters
         * @param {string} typeface - the identifier of the font to retrieve
         * @param {BABYLON.Material} customMaterial - optional material to override with, stock material probably 'White'
         * @return {Array} - Same length letters arg. ' ', space chars & those not found are null.
         */
        FontFactory.getLetters = function (letters, typeface, customMaterial) {
            var ret = new Array(letters.length);
            var isTypeface3D = typeface.indexOf("3D") > -1;
            var fullTypeface;
            for (var i = letters.length - 1; i >= 0; i--) {
                fullTypeface = typeface + ((letters[i].charCodeAt(0) > 128) ? "_EXT" : "");
                // no lookup for space, since it would generate an error, since not an actual mesh
                var letter = ((letters[i] !== ' ') ? TOWER_OF_BABEL.MeshFactory.instance(fullTypeface, letters[i]) : null);
                // check if typeface was loaded
                if (letter) {
                    // check if character found in typeface
                    if (letter !== null) {
                        letter.material = customMaterial ? customMaterial : DIALOG.DialogSys.CURRENT_FONT_MAT_ARRAY[(isTypeface3D || DIALOG.DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
                        if (isTypeface3D) {
                            letter.scaling.z = DIALOG.DialogSys.DEPTH_SCALING_3D;
                        }
                    }
                }
                else
                    letter = null; // typeface module not loaded, make calling code not have to care, at least
                ret[i] = letter;
            }
            return ret;
        };
        return FontFactory;
    }());
    DIALOG.FontFactory = FontFactory;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
/// <reference path="./FontFactory.ts"/>
var DIALOG;
(function (DIALOG) {
    var DialogSys = (function () {
        function DialogSys() {
        }
        /**
         * Must be run before instancing any panels.  Stores scene, so does not have to be part of Panel constructors.
         * Also instances system camera / lights, load stock fonts in TOB runtime, & build font materials.
         * @param {BABYLON.Scene} scene - The scene to construct Panels in.
         */
        DialogSys.initialize = function (scene) {
            DialogSys._scene = scene;
            if (!DialogSys._camera) {
                // distance not that important with ortho cameras, as long as not too close or panels are behind camera
                DialogSys._camera = new BABYLON.FreeCamera("DialogSysCamera", new BABYLON.Vector3(0, 0, -2000), scene);
                DialogSys._camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                DialogSys._camera.layerMask = DialogSys.ACTIVE_DIALOG_LAYER;
                scene.removeCamera(DialogSys._camera);
                var lightPosition = new BABYLON.Vector3(-20, 50, -100);
                DialogSys._light = new BABYLON.PointLight("DialogSysLamp", lightPosition, scene);
                DialogSys._light.intensity = 1;
                DialogSys._light.includeOnlyWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;
                window.addEventListener("resize", function () {
                    DIALOG.DialogSys._adjustCameraForPanel();
                });
                BABYLON.Tools.Log("Dialog system (" + DialogSys.Version + ") initialized");
            }
            // - - - - - - - -
            DialogSys.WHITE = DialogSys.buildFontMaterials("DialogSys.WHITE", new BABYLON.Color3(1, 1, 1));
            DialogSys.BLACK = DialogSys.buildFontMaterials("DialogSys.BLACK", new BABYLON.Color3(0, 0, 0));
            DialogSys.BLUE = DialogSys.buildFontMaterials("DialogSys.BLUE", new BABYLON.Color3(0.0815, 0.162, 0.8), 0.8);
            DialogSys.GOLD = DialogSys.buildFontMaterials("DialogSys.GOLD", new BABYLON.Color3(1, 0.8136, 0.2218));
            DialogSys.RED = DialogSys.buildFontMaterials("DialogSys.RED", new BABYLON.Color3(1, 0.0046, 0.0286));
            DialogSys.GREY = DialogSys.buildFontMaterials("DialogSys.GREY", new BABYLON.Color3(0.5, 0.5, 0.5));
            DialogSys.LT_GREY = DialogSys.buildFontMaterials("DialogSys.LT_GREY", new BABYLON.Color3(0.6, 0.6, 0.6));
            DialogSys.ORANGE = DialogSys.buildFontMaterials("DialogSys.ORANGE", new BABYLON.Color3(1, 0.5, 0));
            DialogSys.GREEN = DialogSys.buildFontMaterials("DialogSys.GREEN", new BABYLON.Color3(0.004, 0.319, 0.002));
            // - - - - - - - -
            DIALOG.FontFactory.loadStockTypefaces(scene);
            DialogSys.CURRENT_FONT_MAT_ARRAY = DialogSys.WHITE;
            // exclude the scene lights from dialog system meshes on stack
            for (var i = scene.lights.length - 1; i >= 0; i--) {
                if (scene.lights[i] !== DialogSys._light) {
                    scene.lights[i].excludeWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;
                }
            }
            scene;
            this._onNewLightObserver = scene.onNewLightAddedObservable.add(DialogSys.onNewLight);
        };
        /**
         *
         */
        DialogSys.onNewLight = function (newLight) {
            newLight.excludeWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;
        };
        /**
         * Remove all the things made / done in initialize().
         */
        DialogSys.dispose = function () {
            DialogSys._camera.dispose();
            DialogSys._light.dispose();
            DialogSys.WHITE[0].dispose();
            DialogSys.WHITE[1].dispose();
            DialogSys.BLACK[0].dispose();
            DialogSys.BLACK[1].dispose();
            DialogSys.BLUE[0].dispose();
            DialogSys.BLUE[1].dispose();
            DialogSys.GOLD[0].dispose();
            DialogSys.GOLD[1].dispose();
            DialogSys.RED[0].dispose();
            DialogSys.RED[1].dispose();
            DialogSys.GREY[0].dispose();
            DialogSys.GREY[1].dispose();
            DialogSys.LT_GREY[0].dispose();
            DialogSys.LT_GREY[1].dispose();
            DialogSys.ORANGE[0].dispose();
            DialogSys.ORANGE[1].dispose();
            DialogSys.GREEN[0].dispose();
            DialogSys.GREEN[1].dispose();
            DialogSys._scene.onNewLightAddedObservable.remove(DialogSys._onNewLightObserver);
            DialogSys._scene = null;
        };
        /**
         * Build sets of materials for Letter generation.  Output should be to DialogSys.CURRENT_FONT_MAT_ARRAY,
         * prior to Letter creation.
         *
         * @return {Array<BABYLON.StandardMaterial>}:
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         */
        DialogSys.buildFontMaterials = function (baseName, color, intensity, alpha) {
            if (intensity === void 0) { intensity = 1; }
            if (alpha === void 0) { alpha = 1; }
            var ret = new Array(2);
            var mat = new BABYLON.StandardMaterial(baseName + "-3D", DialogSys._scene);
            mat.checkReadyOnlyOnce = true;
            mat.ambientColor = color;
            mat.diffuseColor = (intensity === 1) ? color : new BABYLON.Color3(color.r * intensity, color.g * intensity, color.b * intensity);
            mat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            mat.specularPower = 80;
            mat.alpha = alpha;
            ret[0] = mat;
            mat = mat.clone(baseName + "-2D");
            mat.backFaceCulling = false;
            ret[1] = mat;
            return ret;
        };
        /**
         * Add a top level panel to the modal stack.  When first panel re-enable system camera,
         * otherwise hide the previous panel using layermask.
         * @param {BasePanel} panel - The new top of the stack panel.
         */
        DialogSys.pushPanel = function (panel) {
            if (!panel._topLevel) {
                BABYLON.Tools.Error("Only top Level panels can be used in displayPanel()");
            }
            // prep a new panel, never layed out, except for layermast
            if (panel.getReqdWidth() === 0) {
                panel.layout();
            }
            // suspend current Panel, if one is showing
            if (DialogSys._dialogStack.length > 0) {
                DialogSys._dialogStack[DialogSys._dialogStack.length - 1].setLayerMask(DialogSys.SUSPENDED_DIALOG_LAYER);
            }
            else {
                DialogSys._scene.addCamera(DialogSys._camera);
                //                DialogSys._scene.cameraToUseForPointers = DialogSys._camera;
                if (DialogSys._scene.activeCameras.length === 0) {
                    DialogSys._scene.activeCameras.push(DialogSys._scene.activeCamera);
                }
                DialogSys._scene.activeCameras.push(DialogSys._camera);
            }
            // always set so dialogs cannot be seen on scene camera
            DialogSys._scene.activeCameras[0].layerMask = DialogSys.DEFAULT_LAYERMASK;
            // push new panel & show
            DialogSys._dialogStack.push(panel);
            DialogSys._adjustCameraForPanel();
            panel.setLayerMask(DialogSys.ACTIVE_DIALOG_LAYER);
        };
        DialogSys.popPanel = function (doNotDispose) {
            var gone = DialogSys._dialogStack.pop();
            var ret = gone.modalReturnedValue;
            if (doNotDispose) {
                gone.setLayerMask(DialogSys.DEFAULT_LAYERMASK);
            }
            else {
                gone.dispose();
            }
            // suspend current container, if showing
            if (DialogSys._dialogStack.length > 0) {
                var current = DialogSys._dialogStack[DialogSys._dialogStack.length - 1];
                current.setLayerMask(DialogSys.ACTIVE_DIALOG_LAYER);
                DialogSys._adjustCameraForPanel();
                current.modalReturnedValue = ret;
                if (current.modalReturnCallBack) {
                    current.modalReturnCallBack();
                }
            }
            else {
                DialogSys._scene.activeCameras.pop();
                DialogSys._scene.removeCamera(DialogSys._camera);
            }
            return ret;
        };
        /**
         * Adjusts camera ortho settings & viewport based on the top panel on the stack.
         * Called by pushPanel(), popPanel(), & window resize event registered for above.
         * Called externally in BasePanel._beforeRender(), for top level Panels.
         */
        DialogSys._adjustCameraForPanel = function () {
            if (!DialogSys._dialogStack || DialogSys._dialogStack.length === 0)
                return;
            // work with the panel on the top of the stack
            var panel = DialogSys._dialogStack[DialogSys._dialogStack.length - 1];
            // call _layout, when Panel, after manually assigning requirements,says to fit to window
            if (panel.fitToWindow) {
                // need to adjust the reqd size of one of the dimensions, so that re-laying out will cause it to now be in the shape of window             
                var scaling = DialogSys._getScalingToWindow(panel._originalReqdWidth, panel._originalReqdHeight);
                var w = panel._originalReqdWidth * ((scaling.y < scaling.x) ? scaling.x / scaling.y : 1);
                var h = panel._originalReqdHeight * ((scaling.y > scaling.x) ? scaling.y / scaling.x : 1);
                panel._assignRequirements(w, h);
                panel._layout(panel.getReqdWidth(), panel.getReqdHeight());
                panel.freezeWorldMatrix();
            }
            // assign the ortho, based on the half width & height
            var halfWidth = panel.getReqdWidth() / 2;
            var halfHeight = panel.getReqdHeight() / 2;
            DialogSys._camera.orthoTop = halfHeight;
            DialogSys._camera.orthoBottom = -halfHeight;
            DialogSys._camera.orthoLeft = -halfWidth;
            DialogSys._camera.orthoRight = halfWidth;
            DialogSys._camera.getProjectionMatrix(); // required to force ortho to take effect after first setting
            // keep dialog from being distorted by window size
            var scaling = DialogSys._getScalingToWindow(halfWidth, halfHeight);
            var w = window.innerWidth * ((scaling.y < scaling.x) ? scaling.y / scaling.x : 1);
            var h = window.innerHeight * ((scaling.y > scaling.x) ? scaling.x / scaling.y : 1);
            // derive width & height
            var width = panel.maxViewportWidth * w / window.innerWidth;
            var height = panel.maxViewportHeight * h / window.innerHeight;
            // assign x & y, based on layout of panel
            var x;
            switch (panel.fitToWindow ? DIALOG.Panel.ALIGN_HCENTER : panel.horizontalAlignment) {
                case DIALOG.Panel.ALIGN_LEFT:
                    x = 0;
                    break;
                case DIALOG.Panel.ALIGN_HCENTER:
                    x = (1 - width) / 2;
                    break;
                case DIALOG.Panel.ALIGN_RIGHT:
                    x = 1 - width;
            }
            var y;
            switch (panel.fitToWindow ? DIALOG.Panel.ALIGN_VCENTER : panel.verticalAlignment) {
                case DIALOG.Panel.ALIGN_TOP:
                    y = 1 - height;
                    break;
                case DIALOG.Panel.ALIGN_VCENTER:
                    y = (1 - height) / 2;
                    break;
                case DIALOG.Panel.ALIGN_BOTTOM:
                    y = 0;
            }
            DialogSys._camera.viewport = new BABYLON.Viewport(x, y, width, height);
        };
        /**
         * called internally to get the ratios of a panel relative to thecurrent window size
         */
        DialogSys._getScalingToWindow = function (width, height) {
            return new BABYLON.Vector2(window.innerWidth / width, window.innerHeight / height);
        };
        Object.defineProperty(DialogSys, "Version", {
            get: function () {
                return "1.1.1";
            },
            enumerable: true,
            configurable: true
        });
        // constants for 2 camera management
        DialogSys.ACTIVE_DIALOG_LAYER = 0x10000000;
        DialogSys.SUSPENDED_DIALOG_LAYER = 0;
        DialogSys.DEFAULT_LAYERMASK = 0x0FFFFFFF; // BJS does not explicitly have
        // state equivalent static vars
        DialogSys._dialogStack = new Array();
        DialogSys.USE_CULLING_MAT_FOR_2D = true;
        DialogSys.DEPTH_SCALING_3D = .05;
        return DialogSys;
    }());
    DIALOG.DialogSys = DialogSys;
})(DIALOG || (DIALOG = {}));
// File generated with Tower of Babel version: 2.0.0 on 03/24/15
var CheckBoxFont;
(function (CheckBoxFont) {
    var meshLib = new Array(4);
    var cloneCount = 1;
    var originalVerts = 0;
    var clonedVerts = 0;
    var MeshFactory = (function () {
        function MeshFactory(_scene, materialsRootDir) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            this._scene = _scene;
            CheckBoxFont.defineMaterials(_scene, materialsRootDir); //embedded version check
        }
        MeshFactory.prototype.getModuleName = function () { return "CheckBoxFont"; };
        MeshFactory.prototype.instance = function (meshName, cloneSkeleton) {
            var ret = null;
            var src;
            switch (meshName) {
                case "unchecked2D":
                    src = getViable(0);
                    if (src === null) {
                        ret = new unchecked2D("unchecked2D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[0].push(ret);
                    }
                    else {
                        ret = new unchecked2D("unchecked2D" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "checked2D":
                    src = getViable(1);
                    if (src === null) {
                        ret = new checked2D("checked2D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[1].push(ret);
                    }
                    else {
                        ret = new checked2D("checked2D" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "checked3D":
                    src = getViable(2);
                    if (src === null) {
                        ret = new checked3D("checked3D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[2].push(ret);
                    }
                    else {
                        ret = new checked3D("checked3D" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "unchecked3D":
                    src = getViable(3);
                    if (src === null) {
                        ret = new unchecked3D("unchecked3D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[3].push(ret);
                    }
                    else {
                        ret = new unchecked3D("unchecked3D" + "_" + cloneCount++, this._scene, null, src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
            }
            if (ret !== null) {
                if (cloneSkeleton && src && src.skeleton) {
                    var skelName = src.skeleton.name + cloneCount;
                    ret.skeleton = src.skeleton.clone(skelName, skelName);
                }
            }
            else
                BABYLON.Tools.Error("Mesh not found: " + meshName);
            return ret;
        };
        return MeshFactory;
    }());
    CheckBoxFont.MeshFactory = MeshFactory;
    function getViable(libIdx, isNode) {
        var meshes = meshLib[libIdx];
        if (!meshes || meshes === null) {
            if (!meshes)
                meshLib[libIdx] = new Array();
            return null;
        }
        for (var i = meshes.length - 1; i >= 0; i--) {
            if (meshes[i].geometry || isNode)
                return meshes[i];
        }
        return null;
    }
    function clean(libIdx) {
        var meshes = meshLib[libIdx];
        if (!meshes || meshes === null)
            return;
        var stillViable = false;
        for (var i = meshes.length - 1; i >= 0; i--) {
            if (!meshes[i].geometry)
                meshes[i] = null;
            else
                stillViable = true;
        }
        if (!stillViable)
            meshLib[libIdx] = null;
    }
    function getStats() { return [cloneCount, originalVerts, clonedVerts]; }
    CheckBoxFont.getStats = getStats;
    var matLoaded = false;
    function defineMaterials(scene, materialsRootDir) {
        if (materialsRootDir === void 0) { materialsRootDir = "./"; }
        if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0)
            throw "Babylon version too old";
        if (matLoaded)
            return;
        if (materialsRootDir.lastIndexOf("/") + 1 !== materialsRootDir.length) {
            materialsRootDir += "/";
        }
        var material;
        var texture;
        matLoaded = true;
    }
    CheckBoxFont.defineMaterials = defineMaterials;
    var unchecked2D = (function (_super) {
        __extends(unchecked2D, _super);
        function unchecked2D(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 1;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.6, 0, 0, -0.05, 0, 0, -0.05, 0.05, 0, -0.6, 0, 0, -0.6, 0.65, 0, -0.65, 0.65, 0, -0.6, 0.6, 0, -0.05, 0.6, 0, -0.05, 0.65, 0, 0, 0, 0, 0, 0.65, 0, -0.05, 0.65, 0, -0.6, 0.05, 0, -0.65, 0, 0, -0.6, 0.65, 0, -0.05, 0, 0
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
                ], false);
                this.setIndices([
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 2, 13, 3, 5, 14, 6, 8, 15, 9, 11
                ]);
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 16, 0, 24, this);
                this.computeWorldMatrix(true);
            }
        }
        unchecked2D.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(0);
        };
        return unchecked2D;
    }(DIALOG.Letter));
    CheckBoxFont.unchecked2D = unchecked2D;
    var checked2D = (function (_super) {
        __extends(checked2D, _super);
        function checked2D(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 1;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.1305, 0.1659, 0, -0.4841, 0.5195, 0, -0.5195, 0.4841, 0, -0.4841, 0.1305, 0, -0.1305, 0.4841, 0, -0.1659, 0.5195, 0, -0.6, 0, 0, -0.05, 0, 0, -0.05, 0.05, 0, -0.6, 0, 0, -0.6, 0.65, 0, -0.65, 0.65, 0, -0.6, 0.6, 0, -0.05, 0.6, 0, -0.05, 0.65, 0, 0, 0, 0, 0, 0.65, 0, -0.05, 0.65, 0, -0.1659, 0.1305, 0, -0.5195, 0.1659, 0, -0.6, 0.05, 0, -0.65, 0, 0, -0.6, 0.65, 0, -0.05, 0, 0
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
                ], false);
                this.setIndices([
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 0, 2, 19, 3, 5, 20, 6, 8, 21, 9, 11, 22, 12, 14, 23, 15, 17
                ]);
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 24, 0, 36, this);
                this.computeWorldMatrix(true);
            }
        }
        checked2D.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(1);
        };
        return checked2D;
    }(DIALOG.Letter));
    CheckBoxFont.checked2D = checked2D;
    var checked3D = (function (_super) {
        __extends(checked3D, _super);
        function checked3D(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 1;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.1305, 0.1659, 0, -0.4841, 0.5195, 0, -0.5195, 0.4841, 0, -0.1659, 0.1305, 0, -0.1659, 0.1305, 1, -0.4841, 0.5195, 1, -0.5195, 0.4841, 1, -0.4841, 0.1305, 0, -0.1305, 0.4841, 0, -0.1659, 0.5195, 0, -0.5195, 0.1659, 0, -0.5195, 0.1659, 1, -0.4841, 0.1305, 1, -0.1305, 0.4841, 1, -0.1659, 0.5195, 1, -0.6, 0, 0, -0.05, 0, 0, -0.05, 0.05, 0, -0.6, 0.05, 0, -0.6, 0.05, 1, -0.6, 0, 1, -0.05, 0, 1, -0.05, 0.05, 1, -0.6, 0, 0, -0.6, 0.65, 0, -0.65, 0.65, 0, -0.6, 0, 1, -0.65, 0, 0, -0.6, 0.65, 1, -0.65, 0.65, 1, -0.6, 0.6, 0, -0.05, 0.6, 0, -0.05, 0.65, 0, -0.6, 0.6, 1, -0.6, 0.65, 0, -0.05, 0.65, 1, 0, 0, 0, 0, 0.65, 0, -0.05, 0.65, 0, 0, 0, 1, -0.05, 0, 0, 0, 0.65, 1, -0.05, 0.65, 1, -0.1305, 0.1659, 1, -0.65, 0, 1, -0.6, 0.65, 1, -0.05, 0.6, 1, -0.05, 0, 1
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0.8165, 0, -0.5773, 0, 0.8165, -0.5773, -0.8165, 0, -0.5773, 0, -0.8165, -0.5773, 0, -1, 0, 0, 1, 0, -1, 0, 0, 0, -0.8165, -0.5773, 0.8165, 0, -0.5773, 0, 0.8165, -0.5773, -0.8165, 0, -0.5773, -1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0, -0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.7071, 0.7071, 0, -0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0.7071, 0.7071, 0, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.7071, -0.7071, 0, -0.5773, -0.5773, -0.5773, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, -0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.7071, -0.7071, 0, -0.5773, 0.5773, -0.5773, 0.7071, 0.7071, 0, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.7071, -0.7071, 0, -0.5773, -0.5773, -0.5773, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, 1, 0, 0, -0.7071, -0.7071, 0, -0.7071, 0.7071, 0, 0.7071, -0.7071, 0, -0.7071, -0.7071, 0
                ], false);
                this.setIndices([
                    0, 1, 2, 0, 3, 4, 5, 1, 0, 2, 1, 5, 3, 2, 6, 7, 8, 9, 7, 10, 11, 8, 7, 12, 9, 8, 13, 10, 9, 14, 15, 16, 17, 15, 18, 19, 16, 15, 20, 17, 16, 21, 18, 17, 22, 23, 24, 25, 26, 23, 27, 28, 24, 23, 29, 25, 24, 27, 25, 29, 30, 31, 32, 33, 30, 34, 31, 30, 33, 35, 32, 31, 34, 32, 35, 36, 37, 38, 39, 36, 40, 41, 37, 36, 42, 38, 37, 40, 38, 42, 3, 0, 2, 43, 0, 4, 43, 5, 0, 6, 2, 5, 4, 3, 6, 10, 7, 9, 12, 7, 11, 13, 8, 12, 14, 9, 13, 11, 10, 14, 18, 15, 17, 20, 15, 19, 21, 16, 20, 22, 17, 21, 19, 18, 22, 27, 23, 25, 44, 26, 27, 26, 28, 23, 28, 29, 24, 44, 27, 29, 34, 30, 32, 45, 33, 34, 46, 31, 33, 46, 35, 31, 45, 34, 35, 40, 36, 38, 47, 39, 40, 39, 41, 36, 41, 42, 37, 47, 40, 42
                ]);
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 48, 0, 180, this);
                this.computeWorldMatrix(true);
            }
        }
        checked3D.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(2);
        };
        return checked3D;
    }(DIALOG.Letter));
    CheckBoxFont.checked3D = checked3D;
    var unchecked3D = (function (_super) {
        __extends(unchecked3D, _super);
        function unchecked3D(name, scene, materialsRootDir, source) {
            if (materialsRootDir === void 0) { materialsRootDir = "./"; }
            _super.call(this, name, scene, null, source, true);
            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.id = this.name;
            this.billboardMode = 0;
            this.position.x = 0;
            this.position.y = 0;
            this.position.z = 0;
            this.rotation.x = 0;
            this.rotation.y = 0;
            this.rotation.z = 0;
            this.scaling.x = 1;
            this.scaling.y = 1;
            this.scaling.z = 1;
            this.isVisible = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows = false;
            this["castShadows"] = false; // typescript safe
            if (!cloning) {
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.6, 0, 0, -0.05, 0, 0, -0.05, 0.05, 0, -0.6, 0.05, 0, -0.6, 0.05, 1, -0.6, 0, 1, -0.05, 0, 1, -0.05, 0.05, 1, -0.6, 0, 0, -0.6, 0.65, 0, -0.65, 0.65, 0, -0.6, 0, 1, -0.65, 0, 0, -0.6, 0.65, 1, -0.65, 0.65, 1, -0.6, 0.6, 0, -0.05, 0.6, 0, -0.05, 0.65, 0, -0.6, 0.6, 1, -0.6, 0.65, 0, -0.05, 0.65, 1, 0, 0, 0, 0, 0.65, 0, -0.05, 0.65, 0, 0, 0, 1, -0.05, 0, 0, 0, 0.65, 1, -0.05, 0.65, 1, -0.65, 0, 1, -0.6, 0.65, 1, -0.05, 0.6, 1, -0.05, 0, 1
                ], false);
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    -0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.7071, 0.7071, 0, -0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0.7071, 0.7071, 0, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.7071, -0.7071, 0, -0.5773, -0.5773, -0.5773, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, -0.5773, -0.5773, -0.5773, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.7071, -0.7071, 0, -0.5773, 0.5773, -0.5773, 0.7071, 0.7071, 0, 0.5773, -0.5773, -0.5773, 0.5773, 0.5773, -0.5773, -0.5773, 0.5773, -0.5773, 0.7071, -0.7071, 0, -0.5773, -0.5773, -0.5773, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, -0.7071, -0.7071, 0, -0.7071, 0.7071, 0, 0.7071, -0.7071, 0, -0.7071, -0.7071, 0
                ], false);
                this.setIndices([
                    0, 1, 2, 0, 3, 4, 1, 0, 5, 2, 1, 6, 3, 2, 7, 8, 9, 10, 11, 8, 12, 13, 9, 8, 14, 10, 9, 12, 10, 14, 15, 16, 17, 18, 15, 19, 16, 15, 18, 20, 17, 16, 19, 17, 20, 21, 22, 23, 24, 21, 25, 26, 22, 21, 27, 23, 22, 25, 23, 27, 3, 0, 2, 5, 0, 4, 6, 1, 5, 7, 2, 6, 4, 3, 7, 12, 8, 10, 28, 11, 12, 11, 13, 8, 13, 14, 9, 28, 12, 14, 19, 15, 17, 29, 18, 19, 30, 16, 18, 30, 20, 16, 29, 19, 20, 25, 21, 23, 31, 24, 25, 24, 26, 21, 26, 27, 22, 31, 25, 27
                ]);
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 32, 0, 120, this);
                this.computeWorldMatrix(true);
            }
        }
        unchecked3D.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            clean(3);
        };
        return unchecked3D;
    }(DIALOG.Letter));
    CheckBoxFont.unchecked3D = unchecked3D;
})(CheckBoxFont || (CheckBoxFont = {}));
/// <reference path="./Panel.ts"/>
/// <reference path="./Label.ts"/>
/// <reference path="./CheckBoxFont.ts"/>
var DIALOG;
(function (DIALOG) {
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox(letters, typeFace, _prohibitMerging) {
            if (typeFace === void 0) { typeFace = DIALOG.Label.DEFAULT_FONT_MODULE; }
            _super.call(this, letters, typeFace, null, true, _prohibitMerging); // add space for box to replace later
            if (!CheckBox.factory) {
                CheckBox.factory = new CheckBoxFont.MeshFactory(DIALOG.DialogSys._scene);
            }
            var ref = this;
            this.registerPickAction(function () {
                if (!ref._panelEnabled)
                    return;
                ref.setSelected(!this._selected);
            });
        }
        /**
         * all meshes within 2D & 3D consume same space, so no layout required. to switch them out.
         */
        CheckBox.prototype._assignCheckMesh = function () {
            var subs = this.getSubPanels();
            var previousPosition;
            if (subs[0] !== null) {
                previousPosition = subs[0].position;
                subs[0].dispose();
            }
            if (this._isTypeface3D) {
                subs[0] = CheckBox.factory.instance(this._selected ? "checked3D" : "unchecked3D");
                subs[0].scaling.z = DIALOG.DialogSys.DEPTH_SCALING_3D;
            }
            else {
                subs[0] = CheckBox.factory.instance(this._selected ? "checked2D" : "unchecked2D");
            }
            var found = subs.length - 1;
            while (subs[found] === null) {
                found--;
            }
            subs[0].material = subs[found].material;
            subs[0].scaling.x = subs[found]._xyScale;
            subs[0].scaling.y = subs[found]._xyScale;
            subs[0].layerMask = subs[found].layerMask;
            subs[0].parent = this;
            // mini layout for mesh, which does not cause overall layout due to Letter overrides
            subs[0]._calcRequiredSize();
            subs[0].visibility = 1;
            if (previousPosition)
                subs[0].position = previousPosition;
        };
        // =============================== Selection / Action Methods ================================
        CheckBox.prototype.setSelected = function (selected) {
            this._selected = selected;
            this._assignCheckMesh();
            if (this._callback)
                this._callback(this);
        };
        CheckBox.prototype.enableButton = function (enabled) {
            this._panelEnabled = enabled;
            this.setLetterMaterial(enabled ? DIALOG.DialogSys.CURRENT_FONT_MAT_ARRAY : DIALOG.DialogSys.LT_GREY);
        };
        /**
         * @override
         */
        CheckBox.prototype._calcRequiredSize = function () {
            // call label's _calcRequiredSize, which merges meshes
            _super.prototype._calcRequiredSize.call(this);
            var subs = this.getSubPanels();
            // add space for the check letter, when the first Letter not 1 of the 4 possible 
            if (!(subs[0] instanceof CheckBoxFont.unchecked2D) &&
                !(subs[0] instanceof CheckBoxFont.checked2D) &&
                !(subs[0] instanceof CheckBoxFont.unchecked3D) &&
                !(subs[0] instanceof CheckBoxFont.checked3D)) {
                this.addSubPanel(null, 0);
                this.addSubPanel(null, 0);
                this._assignCheckMesh();
                _super.prototype._calcRequiredSize.call(this);
            }
        };
        return CheckBox;
    }(DIALOG.Label));
    DIALOG.CheckBox = CheckBox;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
var DIALOG;
(function (DIALOG) {
    /**
     * A way to map a mesh into a panel.  Very similar to Letter, except it is an actual sub-class of BasePanel.
     */
    var MeshWrapperPanel = (function (_super) {
        __extends(MeshWrapperPanel, _super);
        function MeshWrapperPanel(_inside, _needBorders) {
            // Panel's _layoutDir & _topLevel constructor parms, forced to default to LAYOUT_HORIZONTAL & false
            _super.call(this, _inside.name + "_wrapper", _inside.getScene());
            this._inside = _inside;
            this._needBorders = _needBorders;
            _inside.parent = this;
        }
        MeshWrapperPanel.prototype.setMaterial = function (mat) {
            this._inside.material = mat;
        };
        // ======================================== Overrides ========================================
        /**
         * @override
         */
        MeshWrapperPanel.prototype.useGeometryForBorder = function () {
            return this._needBorders;
        };
        /**
         * @override
         * No actual layout of sub-panels.  Need to set the _actual members, as super does though.
         */
        MeshWrapperPanel.prototype._layout = function (widthConstraint, heightConstraint) {
            if (!this._actualAboveOriginX) {
                this.visibility = 1;
            }
            this._actualAboveOriginX = this._maxAboveOrigin.x;
            this._actualAboveOriginY = this._maxAboveOrigin.y;
            this._actualBelowOriginX = this._minBelowOrigin.x;
            this._actualBelowOriginY = this._minBelowOrigin.y;
        };
        /**
         * @override
         */
        MeshWrapperPanel.prototype._calcRequiredSize = function () {
            // done only once.  Deferred till now, since putting this instead of setVerticesData is never called in clones
            if (!this._minWorld) {
                var extend = BABYLON.Tools.ExtractMinAndMax(this._inside.getVerticesData(BABYLON.VertexBuffer.PositionKind), 0, this._inside.getTotalVertices());
                this._minWorld = extend.minimum;
                this._maxWorld = extend.maximum;
            }
            this._maxAboveOrigin.x = this._maxWorld.x * this._inside.scaling.x;
            this._maxAboveOrigin.y = this._maxWorld.y * this._inside.scaling.y;
            this._maxAboveOrigin.z = this._maxWorld.z * this._inside.scaling.z;
            if (this._needBorders) {
                this._maxAboveOrigin.x += this.horizontalMargin;
                this._maxAboveOrigin.y += this.verticalMargin;
            }
            this._minBelowOrigin.x = this._minWorld.x * this._inside.scaling.x;
            this._minBelowOrigin.y = this._minWorld.y * this._inside.scaling.y;
            this._minBelowOrigin.z = this._minWorld.z * this._inside.scaling.z;
            if (this._needBorders) {
                this._minBelowOrigin.x -= this.horizontalMargin;
                this._minBelowOrigin.y -= this.verticalMargin;
            }
        };
        /**
         * @override
         * Change layermask of this._inside and any children
         */
        MeshWrapperPanel.prototype.setLayerMask = function (maskId) {
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--) {
                insideKids[i].layerMask = maskId;
                insideKids[i].setEnabled(maskId !== DIALOG.DialogSys.SUSPENDED_DIALOG_LAYER);
            }
            this._inside.layerMask = maskId;
            this._inside.setEnabled(maskId !== DIALOG.DialogSys.SUSPENDED_DIALOG_LAYER);
            this.layerMask = maskId;
            this.setEnabled(maskId !== DIALOG.DialogSys.SUSPENDED_DIALOG_LAYER);
        };
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        MeshWrapperPanel.prototype.freezeWorldMatrixTree = function () {
            this.freezeWorldMatrix();
            this._inside.freezeWorldMatrix();
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--) {
                insideKids[i].freezeWorldMatrix();
            }
        };
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        MeshWrapperPanel.prototype.unfreezeWorldMatrixTree = function () {
            _super.prototype.unfreezeWorldMatrix.call(this);
            var insideKids = this._inside.getChildren();
            for (var i = insideKids.length - 1; i >= 0; i--) {
                insideKids[i].unfreezeWorldMatrix();
            }
        };
        /** @override */
        MeshWrapperPanel.prototype.addSubPanel = function (sub, index) {
            BABYLON.Tools.Error("wrappers can have no sub-panels");
        };
        /** @override */ MeshWrapperPanel.prototype.getSubPanel = function () { return null; };
        /** @override */ MeshWrapperPanel.prototype.removeAt = function (index, doNotDispose) { };
        /** @override */ MeshWrapperPanel.prototype.removeAll = function (doNotDispose) { };
        /** @override */
        MeshWrapperPanel.prototype.setSubsFaceSize = function (size, relative) {
            if (relative) {
                this._xyScale *= size;
            }
            else {
                this._xyScale = size;
            }
            this._inside.scaling.x = this._xyScale;
            this._inside.scaling.y = this._xyScale;
            this.invalidateLayout();
            return this;
        };
        return MeshWrapperPanel;
    }(DIALOG.BasePanel));
    DIALOG.MeshWrapperPanel = MeshWrapperPanel;
})(DIALOG || (DIALOG = {}));
/// <reference path="../Panel.ts"/>
/// <reference path="../MeshWrapperPanel.ts"/>
var DIALOG;
(function (DIALOG) {
    var factory;
    var DigitWtLogic = (function (_super) {
        __extends(DigitWtLogic, _super);
        function DigitWtLogic() {
            if (!factory) {
                factory = new DigitParts.MeshFactory(DIALOG.DialogSys._scene);
                // there is only ever 1 version from factory of a node, so get now for measuring
                var inst = factory.instance('Geometry');
                var maxX = DIALOG.Panel.ExtractMax(inst.dot).x + inst.dot.position.x + 0.05;
                var maxY = DIALOG.Panel.ExtractMax(inst.top).y + inst.top.position.y;
                DigitWtLogic._maxWorld = new BABYLON.Vector3(maxX, maxY, 0);
                inst.dispose(false);
            }
            // call super with a clone of DigitWtLogic._innerMesh
            _super.call(this, factory.instance('Geometry'));
            this.setMaterial(LCD.MAT);
            // need to set min/maxWorlds outselves, since done using children
            this._minWorld = BABYLON.Vector3.Zero();
            this._maxWorld = DigitWtLogic._maxWorld;
            this._maxVisibility = 1;
            // initialize to 0, but not a visible 0
            this.setDigit('0', false);
        }
        DigitWtLogic.prototype.setDigit = function (val, show0, showDot) {
            var geo = this._inside;
            if ('E0123456789-'.indexOf(val) === -1 || val.length !== 1) {
                BABYLON.Tools.Error(val + ' is not a valid setting for Digit');
                return;
            }
            this._val = val;
            this._show0 = show0;
            this._showDot = showDot;
            var visible0 = show0 && '0'.indexOf(val) !== -1;
            geo.botLeft.visibility = ('E268'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.topLeft.visibility = ('E45689'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.top.visibility = ('E2356789'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.bottom.visibility = ('E235689'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.botRite.visibility = ('13456789'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.topRite.visibility = ('1234789'.indexOf(val) !== -1 || visible0) ? this._maxVisibility : 0;
            geo.center.visibility = ('E2345689-'.indexOf(val) !== -1) ? this._maxVisibility : 0;
            geo.dot.visibility = (showDot) ? this._maxVisibility : 0;
        };
        // ======================================== Overrides ========================================
        DigitWtLogic.prototype.setMaterial = function (mat) {
            var geo = this._inside;
            geo.botLeft.material = mat;
            geo.topLeft.material = mat;
            geo.top.material = mat;
            geo.bottom.material = mat;
            geo.botRite.material = mat;
            geo.topRite.material = mat;
            geo.center.material = mat;
            geo.dot.material = mat;
        };
        DigitWtLogic.prototype.disolve = function (visibility, exceptionButton) {
            this._maxVisibility = visibility;
            this.setDigit(this._val, this._show0, this._showDot);
        };
        DigitWtLogic.prototype.reAppear = function () {
            this._maxVisibility = 1;
            this.setDigit(this._val, this._show0, this._showDot);
        };
        /**
         * @override
         * Do not want _innerMesh static to disposed of, for future cloning duty
         */
        DigitWtLogic.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this);
        };
        return DigitWtLogic;
    }(DIALOG.MeshWrapperPanel));
    //================================================================================================
    //================================================================================================
    var LCD = (function (_super) {
        __extends(LCD, _super);
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.
         */
        function LCD(name, _nDigits, _alwaysDot, _fixed) {
            _super.call(this, name, DIALOG.DialogSys._scene);
            this._nDigits = _nDigits;
            this._alwaysDot = _alwaysDot;
            this._fixed = _fixed;
            this.name = name;
            LCD._initMaterial();
            this.material = LCD.MAT;
            // add all meshes as subPanels, null or not
            for (var i = 0; i < _nDigits; i++) {
                this.addSubPanel(new DigitWtLogic());
            }
            this.value = 0;
        }
        Object.defineProperty(LCD.prototype, "value", {
            get: function () { return this._value; },
            set: function (value) {
                this._value = value;
                var asString = this._fixed ? value.toFixed(this._fixed) : value.toString();
                var nDigits = asString.length;
                // reduce nDigits if none of them is a '.', otherwise put a '.' at the end
                if (asString.indexOf('.') !== -1) {
                    nDigits--;
                }
                else if (this._alwaysDot) {
                    asString += '.';
                }
                // no matter what, gonna need the sub-panels
                var subs = this.getSubPanels();
                // check for and response to a number too big to display
                if (nDigits > this._nDigits) {
                    subs[0].setDigit('E');
                    for (var i = 1; i < this._nDigits; i++) {
                        subs[i].setDigit('0', false);
                    }
                    return;
                }
                var unUsed = this._nDigits - nDigits;
                // fill unused digits with non-showing 0
                for (var i = 0; i < unUsed; i++) {
                    subs[i].setDigit('0', false);
                }
                // show rest one at a time, unless next on is a '.'
                var d = 0;
                for (var i = unUsed; i < this._nDigits; i++) {
                    var dotNext = asString.charAt(d + 1) === '.';
                    subs[i].setDigit(asString.charAt(d++), true, dotNext);
                    if (dotNext)
                        d++;
                }
            },
            enumerable: true,
            configurable: true
        });
        LCD._initMaterial = function () {
            if (!LCD.MAT) {
                LCD.MAT = DIALOG.DialogSys.BLACK[(DIALOG.DialogSys.USE_CULLING_MAT_FOR_2D) ? 0 : 1];
            }
        };
        return LCD;
    }(DIALOG.BasePanel));
    DIALOG.LCD = LCD;
    //================================================================================================
    //================================================================================================
    var NumberScroller = (function (_super) {
        __extends(NumberScroller, _super);
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.
         */
        function NumberScroller(label, _nDigits, minValue, maxValue, initialValue, increment, fixed) {
            if (increment === void 0) { increment = 1; }
            _super.call(this, label, DIALOG.DialogSys._scene);
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.increment = increment;
            if (!NumberScroller.MAT) {
                LCD._initMaterial();
                var multiMaterial = new BABYLON.MultiMaterial("button", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(LCD.MAT); // for sides
                multiMaterial.subMaterials.push(LCD.MAT); // for back
                NumberScroller.MAT = multiMaterial;
                multiMaterial = new BABYLON.MultiMaterial("button selected", DIALOG.DialogSys._scene);
                multiMaterial.subMaterials.push(LCD.MAT); // for sides
                multiMaterial.subMaterials.push(DIALOG.DialogSys.ORANGE[0]); // for back
                NumberScroller.SELECTED_MAT = multiMaterial;
            }
            if (increment <= 0) {
                BABYLON.Tools.Error('increment must positive');
                return;
            }
            if (this.minValue + increment > this.maxValue) {
                BABYLON.Tools.Error('min value + increment must be <= max value');
                return;
            }
            if (initialValue < this.minValue || initialValue > this.maxValue) {
                BABYLON.Tools.Error('initialValue not within min & max values');
                return;
            }
            var alwaysDot = Math.floor(this.minValue) !== this.minValue || Math.floor(this.maxValue) !== this.maxValue || Math.floor(this.increment) !== this.increment;
            if (!alwaysDot && Math.floor(initialValue) !== initialValue) {
                BABYLON.Tools.Error('initialValue must be integer, since minValue, maxValue, & increment are');
                return;
            }
            // do the display first, since not sure if mesh factory instanced
            this._display = new LCD(name + '-lcd', _nDigits, alwaysDot, fixed);
            this._display.setBorderVisible(true);
            this._display.verticalAlignment = DIALOG.Panel.ALIGN_VCENTER;
            this.value = initialValue;
            this._display._calcRequiredSize();
            if (label && label != null && label.replace(' ', '').length > 0) {
                var labelPanel = new DIALOG.Label(label);
                labelPanel.verticalAlignment = DIALOG.Panel.ALIGN_BOTTOM;
                this.addSubPanel(labelPanel);
            }
            this.addSubPanel(this._downButton = this._getButton('Down', this));
            this.addSubPanel(this._display);
            this.addSubPanel(this._upButton = this._getButton('Up', this));
        }
        // ======================================== Overrides ========================================       
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        NumberScroller.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, false);
            this.unregisterAfterRender(NumberScroller._normalMaterials);
        };
        // =============================== Selection / Action Methods ================================
        NumberScroller.prototype._getButton = function (className, nScroller) {
            var ret = factory.instance(className);
            var halfHeight = DIALOG.Panel.ExtractMax(ret).y;
            ret.verticalAlignment = DIALOG.Panel.ALIGN_VCENTER;
            ret.maxAboveY = halfHeight;
            ret.minBelowY = -halfHeight;
            ret.material = NumberScroller.MAT;
            ret.setButton(true);
            ret.registerAfterRender(NumberScroller._normalMaterials);
            var ref = this;
            ret.registerPickAction(function () {
                if (!ret._panelEnabled)
                    return;
                ret.material = NumberScroller.SELECTED_MAT;
                if (className === 'Down')
                    ref._decrement();
                else
                    ref._increment();
                if (nScroller._callback) {
                    nScroller._callback(nScroller);
                }
            });
            return ret;
        };
        /**
         * After renderer
         */
        NumberScroller._normalMaterials = function (mesh) {
            var asScrollerButton = mesh;
            if (asScrollerButton._chngInProgress) {
                asScrollerButton._chngInProgress = false;
                asScrollerButton.material = NumberScroller.MAT;
            }
            else if (asScrollerButton.material !== NumberScroller.MAT) {
                asScrollerButton._chngInProgress = true;
            }
        };
        // ============================== value getter/setters Methods ===============================
        NumberScroller.prototype._increment = function () {
            if (this.value + this.increment <= this.maxValue) {
                this.value += this.increment;
            }
        };
        NumberScroller.prototype._decrement = function () {
            if (this.value - this.increment >= this.minValue) {
                this.value -= this.increment;
            }
        };
        Object.defineProperty(NumberScroller.prototype, "value", {
            get: function () { return this._display.value; },
            set: function (val) {
                this._display.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return NumberScroller;
    }(DIALOG.BasePanel));
    DIALOG.NumberScroller = NumberScroller;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
/// <reference path="./Label.ts"/>
/// <reference path="./Button.ts"/>
var DIALOG;
(function (DIALOG) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        /**
         * @param {string} title - Optional mesh to display above the menu buttons
         * @param {[string]} labels - Each string results in a menu button created using it as the text
         * @param {number} layoutDir - Vertical for menus, but allow sub-classes like a TabbedPanel to set to horizontal
         * @param {boolean} topLevel - Give a menu the opportunity to be a top level panel
         */
        function Menu(title, labels, layoutDir, topLevel) {
            if (layoutDir === void 0) { layoutDir = DIALOG.Panel.LAYOUT_VERTICAL; }
            _super.call(this, title, DIALOG.DialogSys._scene, null, null, false, DIALOG.Panel.LAYOUT_VERTICAL, topLevel);
            this._callbacks = new Array();
            this.setBorderVisible(true);
            if (title && title != null && title.replace(' ', '').length > 0) {
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
                _super.prototype.addSubPanel.call(this, titlePanel);
            }
            this._menu = new DIALOG.BasePanel('menu-' + title, DIALOG.DialogSys._scene, null, null, false, layoutDir);
            for (var i = 0; i < labels.length; i++) {
                var button = new DIALOG.Button(labels[i], DIALOG.Button.RADIO_BUTTON);
                button.stretchHorizontal = layoutDir === DIALOG.Panel.LAYOUT_VERTICAL;
                button.radioGroup = this;
                this._menu.addSubPanel(button);
            }
            _super.prototype.addSubPanel.call(this, this._menu);
        }
        Menu.prototype.assignMenuCallback = function (itemIdx, func) {
            this._callbacks[itemIdx] = func;
        };
        // ===================================== RadioGroup Impl =====================================
        /**
         * called by Buttons that have a RadioGroup (this) assigned to them
         * @param {BasePanel} reporter - This is the button report in that it has been clicked
         */
        Menu.prototype.reportSelected = function (reporter) {
            var subs = this._menu.getSubPanels();
            for (var i = 0; i < subs.length; i++) {
                var sub = subs[i];
                if (sub != reporter) {
                    (sub).setSelected(false, true);
                }
                else {
                    this._selectedIndex = i;
                    if (this._callbacks[i] && this._callbacks[i] !== null)
                        this._callbacks[i](sub);
                }
            }
        };
        Object.defineProperty(Menu.prototype, "selectedIndex", {
            get: function () { return this._selectedIndex; },
            set: function (index) {
                this._menu.getSubPanels()[index].setSelected(true);
            },
            enumerable: true,
            configurable: true
        });
        // ======================================== Overrides ========================================
        /**
         * @override
         * Add a Button to the end of the menu, or at the index passed.
         * Also make room in _callbacks.
         *
         * @param {BasePanel} sub - Button to be added.
         * @param {number} index - the position at which to add the Gutton
         */
        Menu.prototype.addSubPanel = function (sub, index) {
            if (sub && !(sub instanceof DIALOG.Button)) {
                BABYLON.Tools.Error("Labels can contain only Buttons");
                return;
            }
            this._menu.addSubPanel(sub, index);
            // keep _callbacks in sync
            if (index) {
                this._callbacks.splice(index, 0, null);
            }
            else {
                this._callbacks.push(null);
            }
        };
        /**
         * @override
         * remove a sub-panel & callback
         * @param {number} index - the index of the button to be removed
         */
        Menu.prototype.removeAt = function (index) {
            _super.prototype.removeAt.call(this, index);
            this._callbacks.splice(index, 1);
        };
        /**
         * @override
         * remove all menu buttons  & callback
         */
        Menu.prototype.removeAll = function () {
            _super.prototype.removeAll.call(this);
            this._callbacks = new Array();
        };
        return Menu;
    }(DIALOG.BasePanel));
    DIALOG.Menu = Menu;
})(DIALOG || (DIALOG = {}));
/// <reference path="./Panel.ts"/>
var DIALOG;
(function (DIALOG) {
    var Spacer = (function (_super) {
        __extends(Spacer, _super);
        /**
         * Sub-class of BasePanel containing no geometry.  Used to assign blank space.  Actual space
         * that a unit occupies is relative to the total units that the top level panel requires in that
         * dimension.  Best to put in spacer with 0,0 during dev.  Once rest is settled, then tune here.
         *
         * @param {number} vertUnits       - The amount of space in the vertical   dimension.
         * @param {number} horizontalUnits - The amount of space in the horizontal dimension.
         */
        function Spacer(vertUnits, horizontalUnits) {
            _super.call(this, null, DIALOG.DialogSys._scene);
            this.verticalMargin = vertUnits;
            this.horizontalMargin = horizontalUnits;
            this.setEnabled(false);
        }
        // ======================================== Overrides ========================================
        /**
         * @override
         */
        Spacer.prototype.useGeometryForBorder = function () {
            return false;
        };
        /**
         * @override
         * No meaning for spacers
         */
        Spacer.prototype.addSubPanel = function (sub, index) {
            BABYLON.Tools.Error("spacers can have no sub-panels");
        };
        /** @override */ Spacer.prototype.getSubPanel = function () { return null; };
        /** @override */ Spacer.prototype.removeAt = function (index, doNotDispose) { };
        /** @override */ Spacer.prototype.removeAll = function (doNotDispose) { };
        return Spacer;
    }(DIALOG.BasePanel));
    DIALOG.Spacer = Spacer;
})(DIALOG || (DIALOG = {}));
