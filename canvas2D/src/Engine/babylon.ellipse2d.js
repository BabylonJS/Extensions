var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BABYLON;
(function (BABYLON) {
    var Ellipse2DRenderCache = (function (_super) {
        __extends(Ellipse2DRenderCache, _super);
        function Ellipse2DRenderCache(engine, modelKey) {
            var _this = _super.call(this, engine, modelKey) || this;
            _this.effectsReady = false;
            _this.fillVB = null;
            _this.fillIB = null;
            _this.fillIndicesCount = 0;
            _this.instancingFillAttributes = null;
            _this.effectFillInstanced = null;
            _this.effectFill = null;
            _this.borderVB = null;
            _this.borderIB = null;
            _this.borderIndicesCount = 0;
            _this.instancingBorderAttributes = null;
            _this.effectBorderInstanced = null;
            _this.effectBorder = null;
            return _this;
        }
        Ellipse2DRenderCache.prototype.render = function (instanceInfo, context) {
            // Do nothing if the shader is still loading/preparing 
            if (!this.effectsReady) {
                if ((this.effectFill && (!this.effectFill.isReady() || (this.effectFillInstanced && !this.effectFillInstanced.isReady()))) ||
                    (this.effectBorder && (!this.effectBorder.isReady() || (this.effectBorderInstanced && !this.effectBorderInstanced.isReady())))) {
                    return false;
                }
                this.effectsReady = true;
            }
            var canvas = instanceInfo.owner.owner;
            var engine = canvas.engine;
            var depthFunction = 0;
            if (this.effectFill && this.effectBorder) {
                depthFunction = engine.getDepthFunction();
                engine.setDepthFunctionToLessOrEqual();
            }
            var curAlphaMode = engine.getAlphaMode();
            if (this.effectFill) {
                var partIndex = instanceInfo.partIndexFromId.get(BABYLON.Shape2D.SHAPE2D_FILLPARTID.toString());
                var pid = context.groupInfoPartData[partIndex];
                if (context.renderMode !== BABYLON.Render2DContext.RenderModeOpaque) {
                    engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE, true);
                }
                var effect = context.useInstancing ? this.effectFillInstanced : this.effectFill;
                engine.enableEffect(effect);
                engine.bindBuffersDirectly(this.fillVB, this.fillIB, [1], 4, effect);
                if (context.useInstancing) {
                    if (!this.instancingFillAttributes) {
                        this.instancingFillAttributes = this.loadInstancingAttributes(BABYLON.Shape2D.SHAPE2D_FILLPARTID, effect);
                    }
                    var glBuffer = context.instancedBuffers ? context.instancedBuffers[partIndex] : pid._partBuffer;
                    var count = context.instancedBuffers ? context.instancesCount : pid._partData.usedElementCount;
                    canvas._addDrawCallCount(1, context.renderMode);
                    engine.updateAndBindInstancesBuffer(glBuffer, null, this.instancingFillAttributes);
                    engine.draw(true, 0, this.fillIndicesCount, count);
                    engine.unbindInstanceAttributes();
                }
                else {
                    canvas._addDrawCallCount(context.partDataEndIndex - context.partDataStartIndex, context.renderMode);
                    for (var i = context.partDataStartIndex; i < context.partDataEndIndex; i++) {
                        this.setupUniforms(effect, partIndex, pid._partData, i);
                        engine.draw(true, 0, this.fillIndicesCount);
                    }
                }
            }
            if (this.effectBorder) {
                var partIndex = instanceInfo.partIndexFromId.get(BABYLON.Shape2D.SHAPE2D_BORDERPARTID.toString());
                var pid = context.groupInfoPartData[partIndex];
                if (context.renderMode !== BABYLON.Render2DContext.RenderModeOpaque) {
                    engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE, true);
                }
                var effect = context.useInstancing ? this.effectBorderInstanced : this.effectBorder;
                engine.enableEffect(effect);
                engine.bindBuffersDirectly(this.borderVB, this.borderIB, [1], 4, effect);
                if (context.useInstancing) {
                    if (!this.instancingBorderAttributes) {
                        this.instancingBorderAttributes = this.loadInstancingAttributes(BABYLON.Shape2D.SHAPE2D_BORDERPARTID, effect);
                    }
                    var glBuffer = context.instancedBuffers ? context.instancedBuffers[partIndex] : pid._partBuffer;
                    var count = context.instancedBuffers ? context.instancesCount : pid._partData.usedElementCount;
                    canvas._addDrawCallCount(1, context.renderMode);
                    engine.updateAndBindInstancesBuffer(glBuffer, null, this.instancingBorderAttributes);
                    engine.draw(true, 0, this.borderIndicesCount, count);
                    engine.unbindInstanceAttributes();
                }
                else {
                    canvas._addDrawCallCount(context.partDataEndIndex - context.partDataStartIndex, context.renderMode);
                    for (var i = context.partDataStartIndex; i < context.partDataEndIndex; i++) {
                        this.setupUniforms(effect, partIndex, pid._partData, i);
                        engine.draw(true, 0, this.borderIndicesCount);
                    }
                }
            }
            engine.setAlphaMode(curAlphaMode, true);
            if (this.effectFill && this.effectBorder) {
                engine.setDepthFunction(depthFunction);
            }
            return true;
        };
        Ellipse2DRenderCache.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this.fillVB) {
                this._engine._releaseBuffer(this.fillVB);
                this.fillVB = null;
            }
            if (this.fillIB) {
                this._engine._releaseBuffer(this.fillIB);
                this.fillIB = null;
            }
            this.effectFill = null;
            this.effectFillInstanced = null;
            this.effectBorder = null;
            this.effectBorderInstanced = null;
            if (this.borderVB) {
                this._engine._releaseBuffer(this.borderVB);
                this.borderVB = null;
            }
            if (this.borderIB) {
                this._engine._releaseBuffer(this.borderIB);
                this.borderIB = null;
            }
            return true;
        };
        return Ellipse2DRenderCache;
    }(BABYLON.ModelRenderCache));
    BABYLON.Ellipse2DRenderCache = Ellipse2DRenderCache;
    var Ellipse2DInstanceData = (function (_super) {
        __extends(Ellipse2DInstanceData, _super);
        function Ellipse2DInstanceData(partId) {
            return _super.call(this, partId, 1) || this;
        }
        Object.defineProperty(Ellipse2DInstanceData.prototype, "properties", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return Ellipse2DInstanceData;
    }(BABYLON.Shape2DInstanceData));
    __decorate([
        BABYLON.instanceData()
    ], Ellipse2DInstanceData.prototype, "properties", null);
    BABYLON.Ellipse2DInstanceData = Ellipse2DInstanceData;
    var Ellipse2D = Ellipse2D_1 = (function (_super) {
        __extends(Ellipse2D, _super);
        /**
         * Create an Ellipse 2D Shape primitive
         * @param settings a combination of settings, possible ones are
         * - parent: the parent primitive/canvas, must be specified if the primitive is not constructed as a child of another one (i.e. as part of the children array setting)
         * - children: an array of direct children
         * - id: a text identifier, for information purpose
         * - position: the X & Y positions relative to its parent. Alternatively the x and y properties can be set. Default is [0;0]
         * - rotation: the initial rotation (in radian) of the primitive. default is 0
         * - scale: the initial scale of the primitive. default is 1. You can alternatively use scaleX &| scaleY to apply non uniform scale
         * - dontInheritParentScale: if set the parent's scale won't be taken into consideration to compute the actualScale property
         * - alignToPixel: if true the primitive will be aligned to the target rendering device's pixel
         * - opacity: set the overall opacity of the primitive, 1 to be opaque (default), less than 1 to be transparent.
         * - zOrder: override the zOrder with the specified value
         * - origin: define the normalized origin point location, default [0.5;0.5]
         * - size: the size of the group. Alternatively the width and height properties can be set. Default will be [10;10].
         * - subdivision: the number of subdivision to create the ellipse perimeter, default is 64.
         * - fill: the brush used to draw the fill content of the ellipse, you can set null to draw nothing (but you will have to set a border brush), default is a SolidColorBrush of plain white. can also be a string value (see Canvas2D.GetBrushFromString)
         * - border: the brush used to draw the border of the ellipse, you can set null to draw nothing (but you will have to set a fill brush), default is null. can be a string value (see Canvas2D.GetBrushFromString)
         * - borderThickness: the thickness of the drawn border, default is 1.
         * - isVisible: true if the group must be visible, false for hidden. Default is true.
         * - isPickable: if true the Primitive can be used with interaction mode and will issue Pointer Event. If false it will be ignored for interaction/intersection test. Default value is true.
         * - isContainer: if true the Primitive acts as a container for interaction, if the primitive is not pickable or doesn't intersection, no further test will be perform on its children. If set to false, children will always be considered for intersection/interaction. Default value is true.
         * - childrenFlatZOrder: if true all the children (direct and indirect) will share the same Z-Order. Use this when there's a lot of children which don't overlap. The drawing order IS NOT GUARANTED!
         * - levelCollision: this primitive is an actor of the Collision Manager and only this level will be used for collision (i.e. not the children). Use deepCollision if you want collision detection on the primitives and its children.
         * - deepCollision: this primitive is an actor of the Collision Manager, this level AND ALSO its children will be used for collision (note: you don't need to set the children as level/deepCollision).
         * - layoutData: a instance of a class implementing the ILayoutData interface that contain data to pass to the primitive parent's layout engine
         * - marginTop: top margin, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - marginLeft: left margin, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - marginRight: right margin, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - marginBottom: bottom margin, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - margin: top, left, right and bottom margin formatted as a single string (see PrimitiveThickness.fromString)
         * - marginHAlignment: one value of the PrimitiveAlignment type's static properties
         * - marginVAlignment: one value of the PrimitiveAlignment type's static properties
         * - marginAlignment: a string defining the alignment, see PrimitiveAlignment.fromString
         * - paddingTop: top padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingLeft: left padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingRight: right padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingBottom: bottom padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - padding: top, left, right and bottom padding formatted as a single string (see PrimitiveThickness.fromString)
         */
        function Ellipse2D(settings) {
            var _this = this;
            // Avoid checking every time if the object exists
            if (settings == null) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            if (settings.size != null) {
                _this.size = settings.size;
            }
            else if (settings.width || settings.height) {
                var size = new BABYLON.Size(settings.width, settings.height);
                _this.size = size;
            }
            var sub = (settings.subdivisions == null) ? 64 : settings.subdivisions;
            _this.subdivisions = sub;
            return _this;
        }
        Object.defineProperty(Ellipse2D.prototype, "subdivisions", {
            get: function () {
                return this._subdivisions;
            },
            set: function (value) {
                this._subdivisions = value;
            },
            enumerable: true,
            configurable: true
        });
        Ellipse2D.prototype.levelIntersect = function (intersectInfo) {
            var w = this.size.width / 2;
            var h = this.size.height / 2;
            var x = intersectInfo._localPickPosition.x - w;
            var y = intersectInfo._localPickPosition.y - h;
            return ((x * x) / (w * w) + (y * y) / (h * h)) <= 1;
        };
        Ellipse2D.prototype.updateLevelBoundingInfo = function () {
            BABYLON.BoundingInfo2D.CreateFromSizeToRef(this.actualSize, this._levelBoundingInfo);
            return true;
        };
        Ellipse2D.prototype.updateTriArray = function () {
            var subDiv = this._subdivisions;
            if (this._primTriArray == null) {
                this._primTriArray = new BABYLON.Tri2DArray(subDiv);
            }
            else {
                this._primTriArray.clear(subDiv);
            }
            var size = this.actualSize;
            var center = new BABYLON.Vector2(0.5 * size.width, 0.5 * size.height);
            var v1 = BABYLON.Vector2.Zero();
            var v2 = BABYLON.Vector2.Zero();
            for (var i = 0; i < subDiv; i++) {
                var angle1 = Math.PI * 2 * (i - 1) / subDiv;
                var angle2 = Math.PI * 2 * i / subDiv;
                v1.x = ((Math.cos(angle1) / 2.0) + 0.5) * size.width;
                v1.y = ((Math.sin(angle1) / 2.0) + 0.5) * size.height;
                v2.x = ((Math.cos(angle2) / 2.0) + 0.5) * size.width;
                v2.y = ((Math.sin(angle2) / 2.0) + 0.5) * size.height;
                this._primTriArray.storeTriangle(i, center, v1, v2);
            }
        };
        Ellipse2D.prototype.createModelRenderCache = function (modelKey) {
            var renderCache = new Ellipse2DRenderCache(this.owner.engine, modelKey);
            return renderCache;
        };
        Ellipse2D.prototype.setupModelRenderCache = function (modelRenderCache) {
            var renderCache = modelRenderCache;
            var engine = this.owner.engine;
            // Need to create WebGL resources for fill part?
            if (this.fill) {
                var vbSize = this.subdivisions + 1;
                var vb = new Float32Array(vbSize);
                for (var i = 0; i < vbSize; i++) {
                    vb[i] = i;
                }
                renderCache.fillVB = engine.createVertexBuffer(vb);
                var triCount = vbSize - 1;
                var ib = new Float32Array(triCount * 3);
                for (var i = 0; i < triCount; i++) {
                    ib[i * 3 + 0] = 0;
                    ib[i * 3 + 2] = i + 2;
                    ib[i * 3 + 1] = i + 1;
                }
                ib[triCount * 3 - 1] = 1;
                renderCache.fillIB = engine.createIndexBuffer(ib);
                renderCache.fillIndicesCount = triCount * 3;
                // Get the instanced version of the effect, if the engine does not support it, null is return and we'll only draw on by one
                var ei = this.getDataPartEffectInfo(BABYLON.Shape2D.SHAPE2D_FILLPARTID, ["index"], null, true);
                if (ei) {
                    renderCache.effectFillInstanced = engine.createEffect({ vertex: "ellipse2d", fragment: "ellipse2d" }, ei.attributes, ei.uniforms, [], ei.defines, null);
                }
                // Get the non instanced version
                ei = this.getDataPartEffectInfo(BABYLON.Shape2D.SHAPE2D_FILLPARTID, ["index"], null, false);
                renderCache.effectFill = engine.createEffect({ vertex: "ellipse2d", fragment: "ellipse2d" }, ei.attributes, ei.uniforms, [], ei.defines, null);
            }
            // Need to create WebGL resource for border part?
            if (this.border) {
                var vbSize = this.subdivisions * 2;
                var vb = new Float32Array(vbSize);
                for (var i = 0; i < vbSize; i++) {
                    vb[i] = i;
                }
                renderCache.borderVB = engine.createVertexBuffer(vb);
                var triCount = vbSize;
                var rs = triCount / 2;
                var ib = new Float32Array(triCount * 3);
                for (var i = 0; i < rs; i++) {
                    var r0 = i;
                    var r1 = (i + 1) % rs;
                    ib[i * 6 + 0] = rs + r1;
                    ib[i * 6 + 1] = rs + r0;
                    ib[i * 6 + 2] = r0;
                    ib[i * 6 + 3] = r1;
                    ib[i * 6 + 4] = rs + r1;
                    ib[i * 6 + 5] = r0;
                }
                renderCache.borderIB = engine.createIndexBuffer(ib);
                renderCache.borderIndicesCount = (triCount * 3);
                // Get the instanced version of the effect, if the engine does not support it, null is return and we'll only draw on by one
                var ei = this.getDataPartEffectInfo(BABYLON.Shape2D.SHAPE2D_BORDERPARTID, ["index"], null, true);
                if (ei) {
                    renderCache.effectBorderInstanced = engine.createEffect("ellipse2d", ei.attributes, ei.uniforms, [], ei.defines, null);
                }
                // Get the non instanced version
                ei = this.getDataPartEffectInfo(BABYLON.Shape2D.SHAPE2D_BORDERPARTID, ["index"], null, false);
                renderCache.effectBorder = engine.createEffect("ellipse2d", ei.attributes, ei.uniforms, [], ei.defines, null);
            }
            return renderCache;
        };
        Ellipse2D.prototype.createInstanceDataParts = function () {
            var res = new Array();
            if (this.border) {
                res.push(new Ellipse2DInstanceData(BABYLON.Shape2D.SHAPE2D_BORDERPARTID));
            }
            if (this.fill) {
                res.push(new Ellipse2DInstanceData(BABYLON.Shape2D.SHAPE2D_FILLPARTID));
            }
            return res;
        };
        Ellipse2D.prototype.refreshInstanceDataPart = function (part) {
            if (!_super.prototype.refreshInstanceDataPart.call(this, part)) {
                return false;
            }
            //let s = Ellipse2D._riv0;
            //this.getActualGlobalScaleToRef(s);
            if (part.id === BABYLON.Shape2D.SHAPE2D_BORDERPARTID) {
                var d = part;
                var size = this.actualSize;
                d.properties = new BABYLON.Vector3(size.width /* * s.x*/, size.height /* * s.y*/, this.subdivisions);
            }
            else if (part.id === BABYLON.Shape2D.SHAPE2D_FILLPARTID) {
                var d = part;
                var size = this.actualSize;
                d.properties = new BABYLON.Vector3(size.width /* * s.x*/, size.height /* * s.y*/, this.subdivisions);
            }
            return true;
        };
        return Ellipse2D;
    }(BABYLON.Shape2D));
    Ellipse2D._riv0 = new BABYLON.Vector2(0, 0);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.Shape2D.SHAPE2D_PROPCOUNT + 2, function (pi) { return Ellipse2D_1.subdivisionsProperty = pi; })
        /**
         * Get/set the number of subdivisions used to draw the ellipsis. Default is 64.
         */
    ], Ellipse2D.prototype, "subdivisions", null);
    Ellipse2D = Ellipse2D_1 = __decorate([
        BABYLON.className("Ellipse2D", "BABYLON")
        /**
         * Ellipse Primitive class
         */
    ], Ellipse2D);
    BABYLON.Ellipse2D = Ellipse2D;
    var Ellipse2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.ellipse2d.js.map
