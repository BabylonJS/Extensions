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
    var WireFrame2DRenderCache = (function (_super) {
        __extends(WireFrame2DRenderCache, _super);
        function WireFrame2DRenderCache() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.effectsReady = false;
            _this.vb = null;
            _this.vtxCount = 0;
            _this.instancingAttributes = null;
            _this.effect = null;
            _this.effectInstanced = null;
            return _this;
        }
        WireFrame2DRenderCache.prototype.render = function (instanceInfo, context) {
            // Do nothing if the shader is still loading/preparing 
            if (!this.effectsReady) {
                if ((this.effect && (!this.effect.isReady() || (this.effectInstanced && !this.effectInstanced.isReady())))) {
                    return false;
                }
                this.effectsReady = true;
            }
            // Compute the offset locations of the attributes in the vertex shader that will be mapped to the instance buffer data
            var canvas = instanceInfo.owner.owner;
            var engine = canvas.engine;
            var cur = engine.getAlphaMode();
            var effect = context.useInstancing ? this.effectInstanced : this.effect;
            engine.enableEffect(effect);
            engine.bindBuffersDirectly(this.vb, null, [2, 4], 24, effect);
            if (context.renderMode !== BABYLON.Render2DContext.RenderModeOpaque) {
                engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE, true);
            }
            var pid = context.groupInfoPartData[0];
            if (context.useInstancing) {
                if (!this.instancingAttributes) {
                    this.instancingAttributes = this.loadInstancingAttributes(WireFrame2D.WIREFRAME2D_MAINPARTID, effect);
                }
                var glBuffer = context.instancedBuffers ? context.instancedBuffers[0] : pid._partBuffer;
                var count = context.instancedBuffers ? context.instancesCount : pid._partData.usedElementCount;
                canvas._addDrawCallCount(1, context.renderMode);
                engine.updateAndBindInstancesBuffer(glBuffer, null, this.instancingAttributes);
                engine.drawUnIndexed(false, 0, this.vtxCount, count);
                //                engine.draw(true, 0, 6, count);
                engine.unbindInstanceAttributes();
            }
            else {
                canvas._addDrawCallCount(context.partDataEndIndex - context.partDataStartIndex, context.renderMode);
                for (var i = context.partDataStartIndex; i < context.partDataEndIndex; i++) {
                    this.setupUniforms(effect, 0, pid._partData, i);
                    engine.drawUnIndexed(false, 0, this.vtxCount);
                    //                  engine.draw(true, 0, 6);
                }
            }
            engine.setAlphaMode(cur, true);
            return true;
        };
        WireFrame2DRenderCache.prototype.updateModelRenderCache = function (prim) {
            var w = prim;
            w._updateVertexBuffer(this);
            return true;
        };
        WireFrame2DRenderCache.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this.vb) {
                this._engine._releaseBuffer(this.vb);
                this.vb = null;
            }
            this.effect = null;
            this.effectInstanced = null;
            return true;
        };
        return WireFrame2DRenderCache;
    }(BABYLON.ModelRenderCache));
    BABYLON.WireFrame2DRenderCache = WireFrame2DRenderCache;
    var WireFrameVertex2D = (function () {
        function WireFrameVertex2D(p, c) {
            if (c === void 0) { c = null; }
            this.fromVector2(p);
            if (c != null) {
                this.fromColor4(c);
            }
            else {
                this.r = this.g = this.b = this.a = 1;
            }
        }
        WireFrameVertex2D.prototype.fromVector2 = function (p) {
            this.x = p.x;
            this.y = p.y;
        };
        WireFrameVertex2D.prototype.fromColor3 = function (c) {
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = 1;
        };
        WireFrameVertex2D.prototype.fromColor4 = function (c) {
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = c.a;
        };
        return WireFrameVertex2D;
    }());
    WireFrameVertex2D = __decorate([
        BABYLON.className("WireFrameVertex2D", "BABYLON")
    ], WireFrameVertex2D);
    BABYLON.WireFrameVertex2D = WireFrameVertex2D;
    var WireFrameGroup2D = (function () {
        /**
         * Construct a WireFrameGroup2D object
         * @param id a unique ID among the Groups added to a given WireFrame2D primitive, if you don't specify an id, a random one will be generated. The id is immutable.
         * @param defaultColor specify the default color that will be used when a vertex is pushed, white will be used if not specified.
         */
        function WireFrameGroup2D(id, defaultColor) {
            if (id === void 0) { id = null; }
            if (defaultColor === void 0) { defaultColor = null; }
            this._id = (id == null) ? BABYLON.Tools.RandomId() : id;
            this._uid = BABYLON.Tools.RandomId();
            this._defaultColor = (defaultColor == null) ? new BABYLON.Color4(1, 1, 1, 1) : defaultColor;
            this._buildingStrip = false;
            this._vertices = new Array();
        }
        Object.defineProperty(WireFrameGroup2D.prototype, "uid", {
            get: function () {
                return this._uid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WireFrameGroup2D.prototype, "id", {
            /**
             * Retrieve the ID of the group
             */
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Push a vertex in the array of vertices.
         * If you're previously called startLineStrip, the vertex will be pushed twice in order to describe the end of a line and the start of a new one.
         * @param p Position of the vertex
         * @param c Color of the vertex, if null the default color of the group will be used
         */
        WireFrameGroup2D.prototype.pushVertex = function (p, c) {
            if (c === void 0) { c = null; }
            var v = new WireFrameVertex2D(p, (c == null) ? this._defaultColor : c);
            this._vertices.push(v);
            if (this._buildingStrip) {
                var v2 = new WireFrameVertex2D(p, (c == null) ? this._defaultColor : c);
                this._vertices.push(v2);
            }
        };
        /**
         * Start to store a Line Strip. The given vertex will be pushed in the array. The you have to call pushVertex to add subsequent vertices describing the strip and don't forget to call endLineStrip to close the strip!!!
         * @param p Position of the vertex
         * @param c Color of the vertex, if null the default color of the group will be used
         */
        WireFrameGroup2D.prototype.startLineStrip = function (p, c) {
            if (c === void 0) { c = null; }
            this.pushVertex(p, (c == null) ? this._defaultColor : c);
            this._buildingStrip = true;
        };
        /**
         * Close the Strip by storing a last vertex
         * @param p Position of the vertex
         * @param c Color of the vertex, if null the default color of the group will be used
         */
        WireFrameGroup2D.prototype.endLineStrip = function (p, c) {
            if (c === void 0) { c = null; }
            this._buildingStrip = false;
            this.pushVertex(p, (c == null) ? this._defaultColor : c);
        };
        Object.defineProperty(WireFrameGroup2D.prototype, "vertices", {
            /**
             * Access to the array of Vertices, you can manipulate its content but BEWARE of what you're doing!
             */
            get: function () {
                return this._vertices;
            },
            enumerable: true,
            configurable: true
        });
        return WireFrameGroup2D;
    }());
    WireFrameGroup2D = __decorate([
        BABYLON.className("WireFrameGroup2D", "BABYLON")
        /**
         * A WireFrameGroup2D has a unique id (among the WireFrame2D primitive) and a collection of WireFrameVertex2D which form a Line list.
         * A Line is defined by two vertices, the storage of vertices doesn't follow the Line Strip convention, so to create consecutive lines the intermediate vertex must be doubled. The best way to build a Line Strip is to use the startLineStrip, pushVertex and endLineStrip methods.
         * You can manually add vertices using the pushVertex method, but mind that the vertices array must be a multiple of 2 as each line are defined with TWO SEPARATED vertices. I hope this is clear enough.
         */
    ], WireFrameGroup2D);
    BABYLON.WireFrameGroup2D = WireFrameGroup2D;
    var WireFrame2D = WireFrame2D_1 = (function (_super) {
        __extends(WireFrame2D, _super);
        /**
         * Create an WireFrame 2D primitive
         * @param wireFrameGroups an array of WireFrameGroup.
         * @param settings a combination of settings, possible ones are
         * - parent: the parent primitive/canvas, must be specified if the primitive is not constructed as a child of another one (i.e. as part of the children array setting)
         * - children: an array of direct children
         * - id a text identifier, for information purpose
         * - position: the X & Y positions relative to its parent. Alternatively the x and y properties can be set. Default is [0;0]
         * - rotation: the initial rotation (in radian) of the primitive. default is 0
         * - scale: the initial scale of the primitive. default is 1. You can alternatively use scaleX &| scaleY to apply non uniform scale
         * - size: the size of the sprite displayed in the canvas, if not specified the spriteSize will be used
         * - dontInheritParentScale: if set the parent's scale won't be taken into consideration to compute the actualScale property
         * - opacity: set the overall opacity of the primitive, 1 to be opaque (default), less than 1 to be transparent.
         * - zOrder: override the zOrder with the specified value
         * - origin: define the normalized origin point location, default [0.5;0.5]
         * - alignToPixel: the rendered lines will be aligned to the rendering device' pixels
         * - isVisible: true if the sprite must be visible, false for hidden. Default is true.
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
        function WireFrame2D(wireFrameGroups, settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            _this._wireFrameGroups = new BABYLON.StringDictionary();
            for (var _i = 0, wireFrameGroups_1 = wireFrameGroups; _i < wireFrameGroups_1.length; _i++) {
                var wfg = wireFrameGroups_1[_i];
                _this._wireFrameGroups.add(wfg.id, wfg);
            }
            _this._vtxTransparent = false;
            if (settings.size != null) {
                _this.size = settings.size;
            }
            _this.alignToPixel = (settings.alignToPixel == null) ? true : settings.alignToPixel;
            return _this;
        }
        Object.defineProperty(WireFrame2D.prototype, "wireFrameGroups", {
            get: function () {
                return this._wireFrameGroups;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * If you change the content of the wireFrameGroups you MUST call this method for the changes to be reflected during rendering
         */
        WireFrame2D.prototype.wireFrameGroupsDirty = function () {
            this._setFlags(BABYLON.SmartPropertyPrim.flagModelUpdate);
            this.onPrimBecomesDirty();
        };
        Object.defineProperty(WireFrame2D.prototype, "size", {
            get: function () {
                if (this._size == null) {
                    this._computeMinMaxTrans();
                }
                return this._size;
            },
            set: function (value) {
                this.internalSetSize(value);
            },
            enumerable: true,
            configurable: true
        });
        WireFrame2D.prototype.updateLevelBoundingInfo = function () {
            var v = this._computeMinMaxTrans();
            BABYLON.BoundingInfo2D.CreateFromMinMaxToRef(v.x, v.z, v.y, v.w, this._levelBoundingInfo);
            return true;
        };
        WireFrame2D.prototype.levelIntersect = function (intersectInfo) {
            // TODO !
            return true;
        };
        Object.defineProperty(WireFrame2D.prototype, "alignToPixel", {
            /**
             * Get/set if the sprite rendering should be aligned to the target rendering device pixel or not
             */
            get: function () {
                return this._alignToPixel;
            },
            set: function (value) {
                this._alignToPixel = value;
            },
            enumerable: true,
            configurable: true
        });
        WireFrame2D.prototype.createModelRenderCache = function (modelKey) {
            var renderCache = new WireFrame2DRenderCache(this.owner.engine, modelKey);
            return renderCache;
        };
        WireFrame2D.prototype.setupModelRenderCache = function (modelRenderCache) {
            var renderCache = modelRenderCache;
            var engine = this.owner.engine;
            // Create the VertexBuffer
            this._updateVertexBuffer(renderCache);
            // Get the instanced version of the effect, if the engine does not support it, null is return and we'll only draw on by one
            var ei = this.getDataPartEffectInfo(WireFrame2D_1.WIREFRAME2D_MAINPARTID, ["pos", "col"], [], true);
            if (ei) {
                renderCache.effectInstanced = engine.createEffect("wireframe2d", ei.attributes, ei.uniforms, [], ei.defines, null);
            }
            ei = this.getDataPartEffectInfo(WireFrame2D_1.WIREFRAME2D_MAINPARTID, ["pos", "col"], [], false);
            renderCache.effect = engine.createEffect("wireframe2d", ei.attributes, ei.uniforms, [], ei.defines, null);
            return renderCache;
        };
        WireFrame2D.prototype._updateVertexBuffer = function (mrc) {
            var engine = this.owner.engine;
            if (mrc.vb != null) {
                engine._releaseBuffer(mrc.vb);
            }
            var vtxCount = 0;
            this._wireFrameGroups.forEach(function (k, v) { return vtxCount += v.vertices.length; });
            var vb = new Float32Array(vtxCount * 6);
            var i = 0;
            this._wireFrameGroups.forEach(function (k, v) {
                for (var _i = 0, _a = v.vertices; _i < _a.length; _i++) {
                    var vtx = _a[_i];
                    vb[i++] = vtx.x;
                    vb[i++] = vtx.y;
                    vb[i++] = vtx.r;
                    vb[i++] = vtx.g;
                    vb[i++] = vtx.b;
                    vb[i++] = vtx.a;
                }
            });
            mrc.vb = engine.createVertexBuffer(vb);
            mrc.vtxCount = vtxCount;
        };
        WireFrame2D.prototype.refreshInstanceDataPart = function (part) {
            if (!_super.prototype.refreshInstanceDataPart.call(this, part)) {
                return false;
            }
            return true;
        };
        WireFrame2D.prototype._computeMinMaxTrans = function () {
            var xmin = Number.MAX_VALUE;
            var xmax = Number.MIN_VALUE;
            var ymin = Number.MAX_VALUE;
            var ymax = Number.MIN_VALUE;
            var transparent = false;
            this._wireFrameGroups.forEach(function (k, v) {
                for (var _i = 0, _a = v.vertices; _i < _a.length; _i++) {
                    var vtx = _a[_i];
                    xmin = Math.min(xmin, vtx.x);
                    xmax = Math.max(xmax, vtx.x);
                    ymin = Math.min(ymin, vtx.y);
                    ymax = Math.max(ymax, vtx.y);
                    if (vtx.a < 1) {
                        transparent = true;
                    }
                }
            });
            this._vtxTransparent = transparent;
            this._size = new BABYLON.Size(xmax - xmin, ymax - ymin);
            return new BABYLON.Vector4(xmin, ymin, xmax, ymax);
        };
        WireFrame2D.prototype.createInstanceDataParts = function () {
            return [new WireFrame2DInstanceData(WireFrame2D_1.WIREFRAME2D_MAINPARTID)];
        };
        return WireFrame2D;
    }(BABYLON.RenderablePrim2D));
    WireFrame2D.WIREFRAME2D_MAINPARTID = 1;
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 1, function (pi) { return WireFrame2D_1.wireFrameGroupsProperty = pi; })
        /**
         * Get/set the texture that contains the sprite to display
         */
    ], WireFrame2D.prototype, "wireFrameGroups", null);
    WireFrame2D = WireFrame2D_1 = __decorate([
        BABYLON.className("WireFrame2D", "BABYLON")
        /**
         * Primitive that displays a WireFrame
         */
    ], WireFrame2D);
    BABYLON.WireFrame2D = WireFrame2D;
    var WireFrame2DInstanceData = (function (_super) {
        __extends(WireFrame2DInstanceData, _super);
        function WireFrame2DInstanceData(partId) {
            return _super.call(this, partId, 1) || this;
        }
        return WireFrame2DInstanceData;
    }(BABYLON.InstanceDataBase));
    BABYLON.WireFrame2DInstanceData = WireFrame2DInstanceData;
    var WireFrame2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.wireFrame2d.js.map
