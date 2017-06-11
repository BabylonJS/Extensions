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
    var Sprite2DRenderCache = (function (_super) {
        __extends(Sprite2DRenderCache, _super);
        function Sprite2DRenderCache() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.effectsReady = false;
            _this.vb = null;
            _this.ib = null;
            _this.instancingAttributes = null;
            _this.texture = null;
            _this.effect = null;
            _this.effectInstanced = null;
            return _this;
        }
        Sprite2DRenderCache.prototype.render = function (instanceInfo, context) {
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
            effect.setTexture("diffuseSampler", this.texture);
            engine.bindBuffersDirectly(this.vb, this.ib, [1], 4, effect);
            if (context.renderMode !== BABYLON.Render2DContext.RenderModeOpaque) {
                engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE, true);
            }
            effect.setBool("alphaTest", context.renderMode === BABYLON.Render2DContext.RenderModeAlphaTest);
            var pid = context.groupInfoPartData[0];
            if (context.useInstancing) {
                if (!this.instancingAttributes) {
                    this.instancingAttributes = this.loadInstancingAttributes(Sprite2D.SPRITE2D_MAINPARTID, effect);
                }
                var glBuffer = context.instancedBuffers ? context.instancedBuffers[0] : pid._partBuffer;
                var count = context.instancedBuffers ? context.instancesCount : pid._partData.usedElementCount;
                canvas._addDrawCallCount(1, context.renderMode);
                engine.updateAndBindInstancesBuffer(glBuffer, null, this.instancingAttributes);
                engine.draw(true, 0, 6, count);
                engine.unbindInstanceAttributes();
            }
            else {
                canvas._addDrawCallCount(context.partDataEndIndex - context.partDataStartIndex, context.renderMode);
                for (var i = context.partDataStartIndex; i < context.partDataEndIndex; i++) {
                    this.setupUniforms(effect, 0, pid._partData, i);
                    engine.draw(true, 0, 6);
                }
            }
            engine.setAlphaMode(cur, true);
            return true;
        };
        Sprite2DRenderCache.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this.vb) {
                this._engine._releaseBuffer(this.vb);
                this.vb = null;
            }
            if (this.ib) {
                this._engine._releaseBuffer(this.ib);
                this.ib = null;
            }
            //if (this.texture) {
            //    this.texture.dispose();
            //    this.texture = null;
            //}
            this.effect = null;
            this.effectInstanced = null;
            return true;
        };
        return Sprite2DRenderCache;
    }(BABYLON.ModelRenderCache));
    BABYLON.Sprite2DRenderCache = Sprite2DRenderCache;
    var Sprite2D = Sprite2D_1 = (function (_super) {
        __extends(Sprite2D, _super);
        /**
         * Create an 2D Sprite primitive
         * @param texture the texture that stores the sprite to render
         * @param settings a combination of settings, possible ones are
         * - parent: the parent primitive/canvas, must be specified if the primitive is not constructed as a child of another one (i.e. as part of the children array setting)
         * - children: an array of direct children
         * - id a text identifier, for information purpose
         * - position: the X & Y positions relative to its parent. Alternatively the x and y properties can be set. Default is [0;0]
         * - rotation: the initial rotation (in radian) of the primitive. default is 0
         * - scale: the initial scale of the primitive. default is 1. You can alternatively use scaleX &| scaleY to apply non uniform scale
         * - size: the size of the sprite displayed in the canvas, if not specified the spriteSize will be used
         * - dontInheritParentScale: if set the parent's scale won't be taken into consideration to compute the actualScale property
         * - alignToPixel: if true the sprite's texels will be aligned to the rendering viewport pixels, ensuring the best rendering quality but slow animations won't be done as smooth as if you set false. If false a texel could lies between two pixels, being blended by the texture sampling mode you choose, the rendering result won't be as good, but very slow animation will be overall better looking. Default is true: content will be aligned.
         * - opacity: set the overall opacity of the primitive, 1 to be opaque (default), less than 1 to be transparent.
         * - zOrder: override the zOrder with the specified value
         * - origin: define the normalized origin point location, default [0.5;0.5]
         * - spriteSize: the size of the sprite (in pixels) as it is stored in the texture, if null the size of the given texture will be used, default is null.
         * - spriteLocation: the location (in pixels) in the texture of the top/left corner of the Sprite to display, default is null (0,0)
         * - scale9: draw the sprite as a Scale9 sprite, see http://yannickloriot.com/2013/03/9-patch-technique-in-cocos2d/ for more info. x, y, w, z are left, bottom, right, top coordinate of the resizable box
         * - invertY: if true the texture Y will be inverted, default is false.
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
        function Sprite2D(texture, settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            _this.texture = texture;
            // This is removed to let the user the possibility to setup the addressing mode he wants
            //this.texture.wrapU = Texture.CLAMP_ADDRESSMODE;
            //this.texture.wrapV = Texture.CLAMP_ADDRESSMODE;
            _this._useSize = false;
            _this._spriteSize = (settings.spriteSize != null) ? settings.spriteSize.clone() : null;
            _this._spriteLocation = (settings.spriteLocation != null) ? settings.spriteLocation.clone() : new BABYLON.Vector2(0, 0);
            if (settings.size != null) {
                _this.size = settings.size;
            }
            _this._updatePositioningState();
            _this.spriteFrame = 0;
            _this.invertY = (settings.invertY == null) ? false : settings.invertY;
            _this.alignToPixel = (settings.alignToPixel == null) ? true : settings.alignToPixel;
            _this.useAlphaFromTexture = true;
            _this._scale9 = (settings.scale9 != null) ? settings.scale9.clone() : null;
            // If the user doesn't set a size, we'll use the texture's one, but if the texture is not loading, we HAVE to set a temporary dummy size otherwise the positioning engine will switch the marginAlignement to stretch/stretch, and WE DON'T WANT THAT.
            // The fucking delayed texture sprite bug is fixed!
            if (settings.spriteSize == null) {
                _this.spriteSize = new BABYLON.Size(10, 10);
            }
            if (settings.spriteSize == null || !texture.isReady()) {
                if (texture.isReady()) {
                    var s = texture.getBaseSize();
                    _this.spriteSize = new BABYLON.Size(s.width, s.height);
                    _this._updateSpriteScaleFactor();
                }
                else {
                    texture.onLoadObservable.add(function () {
                        if (settings.spriteSize == null) {
                            var s = texture.getBaseSize();
                            _this.spriteSize = new BABYLON.Size(s.width, s.height);
                        }
                        _this._updateSpriteScaleFactor();
                        _this._positioningDirty();
                        _this._setLayoutDirty();
                        _this._instanceDirtyFlags |= BABYLON.Prim2DBase.originProperty.flagId | Sprite2D_1.textureProperty.flagId; // To make sure the sprite is issued again for render
                    });
                }
            }
            return _this;
        }
        Object.defineProperty(Sprite2D.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = value;
                this._oldTextureHasAlpha = this._texture && this.texture.hasAlpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "useAlphaFromTexture", {
            get: function () {
                return this._useAlphaFromTexture;
            },
            set: function (value) {
                if (this._useAlphaFromTexture === value) {
                    return;
                }
                this._useAlphaFromTexture = value;
                this._updateRenderMode();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "size", {
            get: function () {
                if (this._size == null) {
                    return this.spriteSize;
                }
                return this.internalGetSize();
            },
            set: function (value) {
                this._useSize = value != null;
                this.internalSetSize(value);
                this._updateSpriteScaleFactor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "spriteSize", {
            get: function () {
                return this._spriteSize;
            },
            set: function (value) {
                if (!this._spriteSize) {
                    this._spriteSize = value.clone();
                }
                else {
                    this._spriteSize.copyFrom(value);
                }
                this._updateSpriteScaleFactor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "spriteLocation", {
            get: function () {
                return this._spriteLocation;
            },
            set: function (value) {
                if (!this._spriteLocation) {
                    this._spriteLocation = value.clone();
                }
                else {
                    this._spriteLocation.copyFrom(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "spriteFrame", {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value) {
                this._spriteFrame = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "invertY", {
            get: function () {
                return this._invertY;
            },
            set: function (value) {
                this._invertY = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2D.prototype, "isScale9", {
            get: function () {
                return this._scale9 !== null;
            },
            enumerable: true,
            configurable: true
        });
        //@instanceLevelProperty(RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 7, pi => Sprite2D.spriteScaleFactorProperty = pi)
        ///**
        // * Get/set the sprite location (in pixels) in the texture
        // */
        //public get spriteScaleFactor(): Vector2 {
        //    return this._spriteScaleFactor;
        //}
        //public set spriteScaleFactor(value: Vector2) {
        //    this._spriteScaleFactor = value;
        //}
        Sprite2D.prototype.updateLevelBoundingInfo = function () {
            BABYLON.BoundingInfo2D.CreateFromSizeToRef(this.size, this._levelBoundingInfo);
            return true;
        };
        /**
         * Get the animatable array (see http://doc.babylonjs.com/tutorials/Animations)
         */
        Sprite2D.prototype.getAnimatables = function () {
            var res = new Array();
            if (this.texture && this.texture.animations && this.texture.animations.length > 0) {
                res.push(this.texture);
            }
            return res;
        };
        Sprite2D.prototype.levelIntersect = function (intersectInfo) {
            // If we've made it so far it means the boundingInfo intersection test succeed, the Sprite2D is shaped the same, so we always return true
            return true;
        };
        Object.defineProperty(Sprite2D.prototype, "isSizeAuto", {
            get: function () {
                return this.size == null;
            },
            enumerable: true,
            configurable: true
        });
        Sprite2D.prototype.createModelRenderCache = function (modelKey) {
            var renderCache = new Sprite2DRenderCache(this.owner.engine, modelKey);
            return renderCache;
        };
        Sprite2D.prototype.setupModelRenderCache = function (modelRenderCache) {
            var renderCache = modelRenderCache;
            var engine = this.owner.engine;
            var vb = new Float32Array(4);
            for (var i = 0; i < 4; i++) {
                vb[i] = i;
            }
            renderCache.vb = engine.createVertexBuffer(vb);
            var ib = new Float32Array(6);
            ib[0] = 0;
            ib[1] = 2;
            ib[2] = 1;
            ib[3] = 0;
            ib[4] = 3;
            ib[5] = 2;
            renderCache.ib = engine.createIndexBuffer(ib);
            renderCache.texture = this.texture;
            // Get the instanced version of the effect, if the engine does not support it, null is return and we'll only draw on by one
            var ei = this.getDataPartEffectInfo(Sprite2D_1.SPRITE2D_MAINPARTID, ["index"], ["alphaTest"], true);
            if (ei) {
                renderCache.effectInstanced = engine.createEffect("sprite2d", ei.attributes, ei.uniforms, ["diffuseSampler"], ei.defines, null);
            }
            ei = this.getDataPartEffectInfo(Sprite2D_1.SPRITE2D_MAINPARTID, ["index"], ["alphaTest"], false);
            renderCache.effect = engine.createEffect("sprite2d", ei.attributes, ei.uniforms, ["diffuseSampler"], ei.defines, null);
            return renderCache;
        };
        Sprite2D.prototype.getUsedShaderCategories = function (dataPart) {
            var cat = _super.prototype.getUsedShaderCategories.call(this, dataPart);
            if (dataPart.id === Sprite2D_1.SPRITE2D_MAINPARTID) {
                var useScale9 = this._scale9 != null;
                if (useScale9) {
                    cat.push(Sprite2D_1.SHAPE2D_CATEGORY_SCALE9);
                }
            }
            return cat;
        };
        Sprite2D.prototype.createInstanceDataParts = function () {
            return [new Sprite2DInstanceData(Sprite2D_1.SPRITE2D_MAINPARTID)];
        };
        Sprite2D.prototype.beforeRefreshForLayoutConstruction = function (part) {
            Sprite2D_1.layoutConstructMode = true;
        };
        // if obj contains something, we restore the _text property
        Sprite2D.prototype.afterRefreshForLayoutConstruction = function (part, obj) {
            Sprite2D_1.layoutConstructMode = false;
        };
        Sprite2D.prototype.refreshInstanceDataPart = function (part) {
            if (!_super.prototype.refreshInstanceDataPart.call(this, part)) {
                return false;
            }
            if (!this.texture.isReady() && !Sprite2D_1.layoutConstructMode) {
                return false;
            }
            if (part.id === Sprite2D_1.SPRITE2D_MAINPARTID) {
                var d = this._instanceDataParts[0];
                if (Sprite2D_1.layoutConstructMode) {
                    d.topLeftUV = BABYLON.Vector2.Zero();
                    d.sizeUV = BABYLON.Vector2.Zero();
                    d.properties = BABYLON.Vector3.Zero();
                    d.textureSize = BABYLON.Vector2.Zero();
                    d.scaleFactor = BABYLON.Vector2.Zero();
                    if (this.isScale9) {
                        d.scale9 = BABYLON.Vector4.Zero();
                    }
                }
                else {
                    var ts = this.texture.getBaseSize();
                    var ss = this.spriteSize;
                    var sl = this.spriteLocation;
                    var ssf = this.actualScale;
                    d.topLeftUV = new BABYLON.Vector2(sl.x / ts.width, sl.y / ts.height);
                    var suv = new BABYLON.Vector2(ss.width / ts.width, ss.height / ts.height);
                    d.sizeUV = suv;
                    d.scaleFactor = ssf;
                    Sprite2D_1._prop.x = this.spriteFrame;
                    Sprite2D_1._prop.y = this.invertY ? 1 : 0;
                    Sprite2D_1._prop.z = this.alignToPixel ? 1 : 0;
                    d.properties = Sprite2D_1._prop;
                    d.textureSize = new BABYLON.Vector2(ts.width, ts.height);
                    var scale9 = this._scale9;
                    if (scale9 != null) {
                        var normalizedScale9 = new BABYLON.Vector4(scale9.x * suv.x / ss.width, scale9.y * suv.y / ss.height, scale9.z * suv.x / ss.width, scale9.w * suv.y / ss.height);
                        d.scale9 = normalizedScale9;
                    }
                }
            }
            return true;
        };
        Sprite2D.prototype._mustUpdateInstance = function () {
            var res = this._oldTextureHasAlpha !== (this.texture != null && this.texture.hasAlpha);
            this._oldTextureHasAlpha = this.texture != null && this.texture.hasAlpha;
            if (res) {
                this._updateRenderMode();
            }
            return res;
        };
        Sprite2D.prototype._useTextureAlpha = function () {
            return this.texture != null && this.texture.hasAlpha;
        };
        Sprite2D.prototype._shouldUseAlphaFromTexture = function () {
            return this.texture != null && this.texture.hasAlpha && this.useAlphaFromTexture;
        };
        Sprite2D.prototype._updateSpriteScaleFactor = function () {
            if (!this._useSize) {
                return;
            }
            var sS = this.spriteSize;
            var s = this.size;
            if (s == null || sS == null) {
                return;
            }
            this._postScale.x = s.width / sS.width;
            this._postScale.y = s.height / sS.height;
        };
        return Sprite2D;
    }(BABYLON.RenderablePrim2D));
    Sprite2D.SPRITE2D_MAINPARTID = 1;
    Sprite2D.SHAPE2D_CATEGORY_SCALE9 = "Scale9";
    Sprite2D._prop = BABYLON.Vector3.Zero();
    Sprite2D.layoutConstructMode = false;
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 1, function (pi) { return Sprite2D_1.textureProperty = pi; })
        /**
         * Get/set the texture that contains the sprite to display
         */
    ], Sprite2D.prototype, "texture", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 2, function (pi) { return Sprite2D_1.useAlphaFromTextureProperty = pi; })
        /**
         * If true and the texture has an Alpha Channel which is used (BaseTexture.hasAlpha = true) the Sprite2d will be rendered as a Transparent Primitive, if false and the texture has an Alpha Channel which is used (BaseTexture.hasAlpha = true) the Sprite2d will be rendered as Alpha Test. If false or if the Texture has no alpha or it's not used (BaseTexture.hasAlpha = false) the Sprite2d will be rendered as an Opaque Primitive
         */
    ], Sprite2D.prototype, "useAlphaFromTexture", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 4, function (pi) { return Sprite2D_1.spriteSizeProperty = pi; }, false, true)
        /**
         * Get/set the sprite location (in pixels) in the texture
         */
    ], Sprite2D.prototype, "spriteSize", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 5, function (pi) { return Sprite2D_1.spriteLocationProperty = pi; })
        /**
         * Get/set the sprite location (in pixels) in the texture
         */
    ], Sprite2D.prototype, "spriteLocation", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 6, function (pi) { return Sprite2D_1.spriteFrameProperty = pi; })
        /**
         * Get/set the sprite frame to display.
         * The frame number is just an offset applied horizontally, based on the sprite's width. it does not wrap, all the frames must be on the same line.
         */
    ], Sprite2D.prototype, "spriteFrame", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 7, function (pi) { return Sprite2D_1.invertYProperty = pi; })
        /**
         * Get/set if the sprite texture coordinates should be inverted on the Y axis
         */
    ], Sprite2D.prototype, "invertY", null);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 8, function (pi) { return Sprite2D_1.spriteScale9Property = pi; })
        /**
         * Get/set the texture that contains the sprite to display
         */
    ], Sprite2D.prototype, "isScale9", null);
    Sprite2D = Sprite2D_1 = __decorate([
        BABYLON.className("Sprite2D", "BABYLON")
        /**
         * Primitive that displays a Sprite/Picture
         */
    ], Sprite2D);
    BABYLON.Sprite2D = Sprite2D;
    var Sprite2DInstanceData = (function (_super) {
        __extends(Sprite2DInstanceData, _super);
        function Sprite2DInstanceData(partId) {
            return _super.call(this, partId, 1) || this;
        }
        Object.defineProperty(Sprite2DInstanceData.prototype, "topLeftUV", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2DInstanceData.prototype, "sizeUV", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2DInstanceData.prototype, "scaleFactor", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2DInstanceData.prototype, "textureSize", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2DInstanceData.prototype, "properties", {
            // 3 floats being:
            // - x: frame number to display
            // - y: invertY setting
            // - z: alignToPixel setting
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite2DInstanceData.prototype, "scale9", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return Sprite2DInstanceData;
    }(BABYLON.InstanceDataBase));
    __decorate([
        BABYLON.instanceData()
    ], Sprite2DInstanceData.prototype, "topLeftUV", null);
    __decorate([
        BABYLON.instanceData()
    ], Sprite2DInstanceData.prototype, "sizeUV", null);
    __decorate([
        BABYLON.instanceData(Sprite2D.SHAPE2D_CATEGORY_SCALE9)
    ], Sprite2DInstanceData.prototype, "scaleFactor", null);
    __decorate([
        BABYLON.instanceData()
    ], Sprite2DInstanceData.prototype, "textureSize", null);
    __decorate([
        BABYLON.instanceData()
    ], Sprite2DInstanceData.prototype, "properties", null);
    __decorate([
        BABYLON.instanceData(Sprite2D.SHAPE2D_CATEGORY_SCALE9)
    ], Sprite2DInstanceData.prototype, "scale9", null);
    BABYLON.Sprite2DInstanceData = Sprite2DInstanceData;
    var Sprite2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.sprite2d.js.map
