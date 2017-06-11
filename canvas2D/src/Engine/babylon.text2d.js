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
    var Text2DRenderCache = (function (_super) {
        __extends(Text2DRenderCache, _super);
        function Text2DRenderCache() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.effectsReady = false;
            _this.vb = null;
            _this.ib = null;
            _this.instancingAttributes = null;
            _this.fontTexture = null;
            _this.effect = null;
            _this.effectInstanced = null;
            _this.fontPremulAlpha = false;
            return _this;
        }
        Text2DRenderCache.prototype.render = function (instanceInfo, context) {
            // Do nothing if the shader is still loading/preparing 
            if (!this.effectsReady) {
                if ((this.effect && (!this.effect.isReady() || (this.effectInstanced && !this.effectInstanced.isReady())))) {
                    return false;
                }
                this.effectsReady = true;
            }
            var canvas = instanceInfo.owner.owner;
            var engine = canvas.engine;
            this.fontTexture.update();
            var effect = context.useInstancing ? this.effectInstanced : this.effect;
            engine.enableEffect(effect);
            effect.setTexture("diffuseSampler", this.fontTexture);
            engine.bindBuffersDirectly(this.vb, this.ib, [1], 4, effect);
            var sdf = this.fontTexture.isSignedDistanceField;
            // Enable alpha mode only if the texture is not using SDF, SDF is rendered in AlphaTest mode, which mean no alpha blend
            var curAlphaMode;
            if (!sdf) {
                curAlphaMode = engine.getAlphaMode();
                engine.setAlphaMode(this.fontPremulAlpha ? BABYLON.Engine.ALPHA_PREMULTIPLIED : BABYLON.Engine.ALPHA_COMBINE, true);
            }
            var pid = context.groupInfoPartData[0];
            if (context.useInstancing) {
                if (!this.instancingAttributes) {
                    this.instancingAttributes = this.loadInstancingAttributes(Text2D.TEXT2D_MAINPARTID, effect);
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
            if (!sdf) {
                engine.setAlphaMode(curAlphaMode, true);
            }
            return true;
        };
        Text2DRenderCache.prototype.dispose = function () {
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
            if (this.fontTexture) {
                this.fontTexture.decCachedFontTextureCounter();
                this.fontTexture = null;
            }
            this.effect = null;
            this.effectInstanced = null;
            return true;
        };
        return Text2DRenderCache;
    }(BABYLON.ModelRenderCache));
    BABYLON.Text2DRenderCache = Text2DRenderCache;
    var Text2DInstanceData = (function (_super) {
        __extends(Text2DInstanceData, _super);
        function Text2DInstanceData(partId, dataElementCount) {
            return _super.call(this, partId, dataElementCount) || this;
        }
        Object.defineProperty(Text2DInstanceData.prototype, "topLeftUV", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2DInstanceData.prototype, "sizeUV", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2DInstanceData.prototype, "textureSize", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2DInstanceData.prototype, "color", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2DInstanceData.prototype, "superSampleFactor", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return Text2DInstanceData;
    }(BABYLON.InstanceDataBase));
    __decorate([
        BABYLON.instanceData()
    ], Text2DInstanceData.prototype, "topLeftUV", null);
    __decorate([
        BABYLON.instanceData()
    ], Text2DInstanceData.prototype, "sizeUV", null);
    __decorate([
        BABYLON.instanceData()
    ], Text2DInstanceData.prototype, "textureSize", null);
    __decorate([
        BABYLON.instanceData()
    ], Text2DInstanceData.prototype, "color", null);
    __decorate([
        BABYLON.instanceData()
    ], Text2DInstanceData.prototype, "superSampleFactor", null);
    BABYLON.Text2DInstanceData = Text2DInstanceData;
    var Text2D = Text2D_1 = (function (_super) {
        __extends(Text2D, _super);
        /**
         * Create a Text primitive
         * @param text the text to display
         * @param settings a combination of settings, possible ones are
         * - parent: the parent primitive/canvas, must be specified if the primitive is not constructed as a child of another one (i.e. as part of the children array setting)
         * - children: an array of direct children
         * - id a text identifier, for information purpose
         * - position: the X & Y positions relative to its parent. Alternatively the x and y properties can be set. Default is [0;0]
         * - rotation: the initial rotation (in radian) of the primitive. default is 0
         * - scale: the initial scale of the primitive. default is 1. You can alternatively use scaleX &| scaleY to apply non uniform scale
         * - dontInheritParentScale: if set the parent's scale won't be taken into consideration to compute the actualScale property
         * - alignToPixel: if true the primitive will be aligned to the target rendering device's pixel
         * - opacity: set the overall opacity of the primitive, 1 to be opaque (default), less than 1 to be transparent.
         * - zOrder: override the zOrder with the specified value
         * - origin: define the normalized origin point location, default [0.5;0.5]
         * - fontName: the name/size/style of the font to use, following the CSS notation. Default is "12pt Arial".
         * - fontSuperSample: if true the text will be rendered with a superSampled font (the font is twice the given size). Use this settings if the text lies in world space or if it's scaled in.
         * - signedDistanceField: if true the text will be rendered using the SignedDistanceField technique. This technique has the advantage to be rendered order independent (then much less drawing calls), but only works on font that are a little more than one pixel wide on the screen but the rendering quality is excellent whatever the font size is on the screen (which is the purpose of this technique). Outlining/Shadow is not supported right now. If you can, you should use this mode, the quality and the performances are the best. Note that fontSuperSample has no effect when this mode is on.
         * - bitmapFontTexture: set a BitmapFontTexture to use instead of a fontName.
         * - defaultFontColor: the color by default to apply on each letter of the text to display, default is plain white.
         * - useBilinearFiltering: if true a FontTexture using Bilinear filtering will be used, if false a FontTexture using Nearest filtering will be used. If not specified then bilinear will be chosen for Signed Distance Field mode or a Text2D inside a WorldSpaceCanvas2D, otherwise nearest will be chose.
         * - areaSize: the size of the area in which to display the text, default is auto-fit from text content.
         * - tabulationSize: number of space character to insert when a tabulation is encountered, default is 4
         * - isVisible: true if the text must be visible, false for hidden. Default is true.
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
         * - textAlignmentH: align text horizontally (Text2D.AlignLeft, Text2D.AlignCenter, Text2D.AlignRight)
         * - textAlignmentV: align text vertically (Text2D.AlignTop, Text2D.AlignCenter, Text2D.AlignBottom)
         * - textAlignment: a string defining the text alignment, text can be: [<h:|horizontal:><left|right|center>], [<v:|vertical:><top|bottom|center>]
         * - wordWrap: if true the text will wrap inside content area
         */
        function Text2D(text, settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            if (settings.bitmapFontTexture != null) {
                _this._fontTexture = settings.bitmapFontTexture;
                _this._fontName = null;
                _this._fontSuperSample = false;
                _this._fontSDF = false;
                _this._textureIsPremulAlpha = _this._fontTexture.isPremultipliedAlpha;
                var ft = _this._fontTexture;
                if (ft != null && !ft.isReady()) {
                    ft.onLoadObservable.add(function () {
                        _this._positioningDirty();
                        _this._setLayoutDirty();
                        _this._instanceDirtyFlags |= BABYLON.Prim2DBase.originProperty.flagId; // To make sure the Text2D is issued again for render
                    });
                }
            }
            else {
                _this._fontName = (settings.fontName == null) ? "12pt Arial" : settings.fontName;
                _this._fontSuperSample = (settings.fontSuperSample != null && settings.fontSuperSample);
                _this._fontSDF = (settings.fontSignedDistanceField != null && settings.fontSignedDistanceField);
            }
            _this._defaultFontColor = (settings.defaultFontColor == null) ? new BABYLON.Color4(1, 1, 1, 1) : settings.defaultFontColor.clone();
            _this._tabulationSize = (settings.tabulationSize == null) ? 4 : settings.tabulationSize;
            _this._textureIsPremulAlpha = true; //settings.fontTexturePremulAlpha === true;
            _this._textSize = null;
            _this.text = text;
            if (settings.size != null) {
                _this.size = settings.size;
                _this._sizeSetByUser = true;
            }
            else {
                _this.size = null;
            }
            _this._useBilinearFiltering = (settings.useBilinearFiltering != null) ? settings.useBilinearFiltering : null;
            _this._fontBilinearFiltering = false;
            // Text rendering must always be aligned to the target's pixel to ensure a good quality
            _this.alignToPixel = true;
            _this.textAlignmentH = (settings.textAlignmentH == null) ? Text2D_1.AlignLeft : settings.textAlignmentH;
            _this.textAlignmentV = (settings.textAlignmentV == null) ? Text2D_1.AlignTop : settings.textAlignmentV;
            _this.textAlignment = (settings.textAlignment == null) ? "" : settings.textAlignment;
            _this._wordWrap = (settings.wordWrap == null) ? false : settings.wordWrap;
            _this._updateRenderMode();
            return _this;
        }
        Object.defineProperty(Text2D, "AlignLeft", {
            /**
             * Alignment is made relative to the left edge of the Content Area. Valid for horizontal alignment only.
             */
            get: function () { return Text2D_1._AlignLeft; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D, "AlignTop", {
            /**
             * Alignment is made relative to the top edge of the Content Area. Valid for vertical alignment only.
             */
            get: function () { return Text2D_1._AlignTop; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D, "AlignRight", {
            /**
             * Alignment is made relative to the right edge of the Content Area. Valid for horizontal alignment only.
             */
            get: function () { return Text2D_1._AlignRight; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D, "AlignBottom", {
            /**
             * Alignment is made relative to the bottom edge of the Content Area. Valid for vertical alignment only.
             */
            get: function () { return Text2D_1._AlignBottom; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D, "AlignCenter", {
            /**
             * Alignment is made to center the text from equal distance to the opposite edges of the Content Area
             */
            get: function () { return Text2D_1._AlignCenter; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "fontName", {
            get: function () {
                return this._fontName;
            },
            set: function (value) {
                if (this._fontName) {
                    throw new Error("Font Name change is not supported right now.");
                }
                this._fontName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "defaultFontColor", {
            get: function () {
                return this._defaultFontColor;
            },
            set: function (value) {
                if (!this._defaultFontColor) {
                    this._defaultFontColor = value.clone();
                }
                else {
                    this._defaultFontColor.copyFrom(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                if (!value) {
                    value = "";
                }
                this._text = value;
                this._textSize = null; // A change of text will reset the TextSize which will be recomputed next time it's used
                if (!this._sizeSetByUser) {
                    this._size = null;
                    this._actualSize = null;
                }
                this._updateCharCount();
                // Trigger a textSize to for a sizeChange if necessary, which is needed for layout to recompute
                var s = this.textSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "size", {
            get: function () {
                if (this._size != null) {
                    return this._size;
                }
                return this.textSize;
            },
            set: function (value) {
                this.internalSetSize(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "fontSuperSample", {
            get: function () {
                return this._fontTexture && this._fontTexture.isSuperSampled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "fontSignedDistanceField", {
            get: function () {
                return this._fontTexture && this._fontTexture.isSignedDistanceField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "textureIsPremulAlpha", {
            get: function () {
                return this._textureIsPremulAlpha;
            },
            set: function (value) {
                this._textureIsPremulAlpha = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "isSizeAuto", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "isVerticalSizeAuto", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "isHorizontalSizeAuto", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text2D.prototype, "textSize", {
            /**
             * Get the area that bounds the text associated to the primitive
             */
            get: function () {
                if (!this._textSize) {
                    if (this.owner && this._text) {
                        var ft = this.fontTexture;
                        if (ft == null) {
                            return Text2D_1.nullSize;
                        }
                        var newSize = ft.measureText(this._text, this._tabulationSize);
                        if (!newSize.equals(this._textSize)) {
                            this.onPrimitivePropertyDirty(BABYLON.Prim2DBase.sizeProperty.flagId);
                            this._positioningDirty();
                        }
                        this._textSize = newSize;
                    }
                    else {
                        return Text2D_1.nullSize;
                    }
                }
                return this._textSize;
            },
            enumerable: true,
            configurable: true
        });
        Text2D.prototype.onSetOwner = function () {
            if (!this._textSize) {
                this.onPrimitivePropertyDirty(BABYLON.Prim2DBase.sizeProperty.flagId);
                this._setLayoutDirty();
                this._positioningDirty();
                this._actualSize = null;
                this._setFlags(BABYLON.SmartPropertyPrim.flagLevelBoundingInfoDirty | BABYLON.SmartPropertyPrim.flagBoundingInfoDirty);
            }
        };
        Object.defineProperty(Text2D.prototype, "fontTexture", {
            get: function () {
                if (this._fontTexture) {
                    return this._fontTexture;
                }
                if (this.fontName == null || this.owner == null || this.owner.scene == null) {
                    return null;
                }
                this._fontBilinearFiltering = (this._useBilinearFiltering === null) ? (this.owner instanceof BABYLON.WorldSpaceCanvas2D) : this._useBilinearFiltering;
                this._fontTexture = BABYLON.FontTexture.GetCachedFontTexture(this.owner.scene, this.fontName, this._fontSuperSample, this._fontSDF, this._fontBilinearFiltering);
                this._textureIsPremulAlpha = this._fontTexture.isPremultipliedAlpha;
                return this._fontTexture;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Dispose the primitive, remove it from its parent
         */
        Text2D.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this._fontTexture) {
                BABYLON.FontTexture.ReleaseCachedFontTexture(this.owner.scene, this.fontName, this._fontSuperSample, this._fontSDF, this._fontBilinearFiltering);
                this._fontTexture = null;
            }
            return true;
        };
        Text2D.prototype.updateLevelBoundingInfo = function () {
            if (!this.owner || !this._text) {
                return false;
            }
            var asize = this.actualSize;
            if (asize.width === 0 && asize.height === 0) {
                return false;
            }
            BABYLON.BoundingInfo2D.CreateFromSizeToRef(this.actualSize, this._levelBoundingInfo);
            return true;
        };
        Object.defineProperty(Text2D.prototype, "textAlignment", {
            /**
             * You can get/set the text alignment through this property
             */
            get: function () {
                return this._textAlignment;
            },
            set: function (value) {
                this._textAlignment = value;
                this._setTextAlignmentfromString(value);
            },
            enumerable: true,
            configurable: true
        });
        Text2D.prototype.levelIntersect = function (intersectInfo) {
            // For now I can't do something better that boundingInfo is a hit, detecting an intersection on a particular letter would be possible, but do we really need it? Not for now...
            return true;
        };
        Text2D.prototype.createModelRenderCache = function (modelKey) {
            var renderCache = new Text2DRenderCache(this.owner.engine, modelKey);
            return renderCache;
        };
        Text2D.prototype.setupModelRenderCache = function (modelRenderCache) {
            var renderCache = modelRenderCache;
            var engine = this.owner.engine;
            renderCache.fontTexture = this.fontTexture;
            renderCache.fontTexture.incCachedFontTextureCounter();
            renderCache.fontPremulAlpha = this.textureIsPremulAlpha;
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
            // Get the instanced version of the effect, if the engine does not support it, null is return and we'll only draw on by one
            var ei = this.getDataPartEffectInfo(Text2D_1.TEXT2D_MAINPARTID, ["index"], null, true);
            if (ei) {
                renderCache.effectInstanced = engine.createEffect("text2d", ei.attributes, ei.uniforms, ["diffuseSampler"], ei.defines, null);
            }
            ei = this.getDataPartEffectInfo(Text2D_1.TEXT2D_MAINPARTID, ["index"], null, false);
            renderCache.effect = engine.createEffect("text2d", ei.attributes, ei.uniforms, ["diffuseSampler"], ei.defines, null);
            return renderCache;
        };
        Text2D.prototype.createInstanceDataParts = function () {
            return [new Text2DInstanceData(Text2D_1.TEXT2D_MAINPARTID, this._charCount)];
        };
        // Looks like a hack!? Yes! Because that's what it is!
        // For the InstanceData layer to compute correctly we need to set all the properties involved, which won't be the case if there's no text
        // This method is called before the layout construction for us to detect this case, set some text and return the initial one to restore it after (there can be some text without char to display, say "\t\n" for instance)
        Text2D.prototype.beforeRefreshForLayoutConstruction = function (part) {
            if (!this._charCount) {
                var curText = this._text;
                this.text = "A";
                return curText;
            }
        };
        // if obj contains something, we restore the _text property
        Text2D.prototype.afterRefreshForLayoutConstruction = function (part, obj) {
            if (obj !== undefined) {
                this.text = obj;
            }
        };
        Text2D.prototype.getUsedShaderCategories = function (dataPart) {
            var cat = _super.prototype.getUsedShaderCategories.call(this, dataPart);
            if (this._fontSDF) {
                cat.push(Text2D_1.TEXT2D_CATEGORY_SDF);
            }
            if (this._fontTexture instanceof BABYLON.FontTexture) {
                cat.push(Text2D_1.TEXT2D_CATEGORY_FONTTEXTURE);
            }
            return cat;
        };
        Text2D.prototype.refreshInstanceDataPart = function (part) {
            if (!_super.prototype.refreshInstanceDataPart.call(this, part)) {
                return false;
            }
            if (part.id === Text2D_1.TEXT2D_MAINPARTID) {
                var d = part;
                var ft = this.fontTexture;
                var texture = ft;
                if (!texture) {
                    return false;
                }
                var superSampleFactor = texture.isSuperSampled ? 0.5 : 1;
                var ts = texture.getSize();
                var offset = BABYLON.Vector2.Zero();
                var lh = ft.lineHeight;
                d.dataElementCount = this._charCount;
                d.curElement = 0;
                var lineLengths = [];
                var charWidths = [];
                var charsPerLine = [];
                var numCharsCurrenLine = 0;
                var contentAreaWidth = this.contentArea.width;
                var contentAreaHeight = this.contentArea.height;
                var numCharsCurrentWord = 0;
                var widthCurrentWord = 0;
                var numWordsPerLine = 0;
                var text = this.text;
                var tabWidth = this._tabulationSize * texture.spaceWidth;
                // First pass: analyze the text to build data like pixel length of each lines, width of each char, number of char per line
                for (var i_1 = 0; i_1 < text.length; i_1++) {
                    var char = text[i_1];
                    numCharsCurrenLine++;
                    charWidths[i_1] = 0;
                    // Line feed
                    if (this._isWhiteSpaceCharVert(char)) {
                        lineLengths.push(offset.x);
                        charsPerLine.push(numCharsCurrenLine - 1);
                        numCharsCurrenLine = 1;
                        offset.x = 0;
                        if (widthCurrentWord > 0) {
                            numWordsPerLine++;
                        }
                        numWordsPerLine = 0;
                        numCharsCurrentWord = 0;
                        widthCurrentWord = 0;
                        continue;
                    }
                    var ci = texture.getChar(char);
                    var charWidth = 0;
                    if (char === "\t") {
                        charWidth = tabWidth;
                    }
                    else {
                        charWidth = ci.xAdvance;
                    }
                    offset.x += charWidth;
                    charWidths[i_1] = charWidth;
                    if (this._isWhiteSpaceCharHoriz(char)) {
                        if (widthCurrentWord > 0) {
                            numWordsPerLine++;
                        }
                        numCharsCurrentWord = 0;
                        widthCurrentWord = 0;
                    }
                    else {
                        widthCurrentWord += ci.xAdvance;
                        numCharsCurrentWord++;
                    }
                    if (this._wordWrap && numWordsPerLine > 0 && offset.x > contentAreaWidth) {
                        lineLengths.push(offset.x - widthCurrentWord);
                        numCharsCurrenLine -= numCharsCurrentWord;
                        var j = i_1 - numCharsCurrentWord;
                        //skip white space at the end of this line
                        while (this._isWhiteSpaceCharHoriz(text[j])) {
                            lineLengths[lineLengths.length - 1] -= charWidths[j];
                            j--;
                        }
                        charsPerLine.push(numCharsCurrenLine);
                        if (this._isWhiteSpaceCharHoriz(text[i_1])) {
                            //skip white space at the beginning of next line
                            var numSpaces = 0;
                            while (this._isWhiteSpaceCharHoriz(text[i_1 + numSpaces])) {
                                numSpaces++;
                                charWidths[i_1 + numSpaces] = 0;
                            }
                            i_1 += numSpaces - 1;
                            offset.x = 0;
                            numCharsCurrenLine = numSpaces - 1;
                        }
                        else {
                            numCharsCurrenLine = numCharsCurrentWord;
                            offset.x = widthCurrentWord;
                        }
                        numWordsPerLine = 0;
                    }
                }
                lineLengths.push(offset.x);
                charsPerLine.push(numCharsCurrenLine);
                //skip white space at the end
                var i = text.length - 1;
                while (this._isWhiteSpaceCharHoriz(text[i])) {
                    lineLengths[lineLengths.length - 1] -= charWidths[i];
                    i--;
                }
                var charNum = 0;
                var maxLineLen = 0;
                var alignH = this.textAlignmentH;
                var alignV = this.textAlignmentV;
                offset.x = 0;
                if (alignH == Text2D_1.AlignRight || alignH == Text2D_1.AlignCenter) {
                    for (var i_2 = 0; i_2 < lineLengths.length; i_2++) {
                        if (lineLengths[i_2] > maxLineLen) {
                            maxLineLen = lineLengths[i_2];
                        }
                    }
                }
                var textHeight = lineLengths.length * lh;
                var offsetX = this.padding.leftPixels;
                if (alignH == Text2D_1.AlignRight) {
                    offsetX += contentAreaWidth - maxLineLen;
                }
                else if (alignH == Text2D_1.AlignCenter) {
                    offsetX += (contentAreaWidth - maxLineLen) * .5;
                }
                offset.x += Math.floor(offsetX);
                offset.y += contentAreaHeight + textHeight - lh;
                offset.y += this.padding.bottomPixels;
                if (alignV == Text2D_1.AlignBottom) {
                    offset.y -= contentAreaHeight;
                }
                else if (alignV == Text2D_1.AlignCenter) {
                    offset.y -= (contentAreaHeight - textHeight) * .5 + lineLengths.length * lh;
                }
                else {
                    offset.y -= lineLengths.length * lh;
                }
                var lineHeight = texture.lineHeight;
                for (var i_3 = 0; i_3 < lineLengths.length; i_3++) {
                    var numChars = charsPerLine[i_3];
                    var lineLength = lineLengths[i_3];
                    if (alignH == Text2D_1.AlignRight) {
                        offset.x += maxLineLen - lineLength;
                    }
                    else if (alignH == Text2D_1.AlignCenter) {
                        offset.x += (maxLineLen - lineLength) * .5;
                    }
                    for (var j = 0; j < numChars; j++) {
                        var char = text[charNum];
                        var charWidth = charWidths[charNum];
                        if (char !== "\t" && !this._isWhiteSpaceCharVert(char)) {
                            //make sure space char gets processed here or overlapping can occur when text is set
                            var ci = texture.getChar(char);
                            var partOffset = new BABYLON.Vector2(Math.floor(offset.x + ci.xOffset), Math.floor(offset.y + ci.yOffset));
                            this.updateInstanceDataPart(d, partOffset);
                            d.topLeftUV = ci.topLeftUV;
                            var suv = ci.bottomRightUV.subtract(ci.topLeftUV);
                            d.sizeUV = suv;
                            d.textureSize = new BABYLON.Vector2(ts.width, ts.height);
                            d.color = this.defaultFontColor;
                            d.superSampleFactor = superSampleFactor;
                            //console.log(`Char: ${char}, Offset: ${partOffset}`);
                            ++d.curElement;
                        }
                        offset.x += Math.floor(charWidth);
                        charNum++;
                    }
                    offset.x = offsetX;
                    offset.y -= lineHeight;
                }
            }
            return true;
        };
        Text2D.prototype._isWhiteSpaceCharHoriz = function (char) {
            if (char === " " || char === "\t") {
                return true;
            }
        };
        Text2D.prototype._isWhiteSpaceCharVert = function (char) {
            if (char === "\n" || char === "\r") {
                return true;
            }
        };
        Text2D.prototype._updateCharCount = function () {
            var count = 0;
            for (var _i = 0, _a = this._text; _i < _a.length; _i++) {
                var char = _a[_i];
                if (char === "\r" || char === "\n" || char === "\t" || char < " ") {
                    continue;
                }
                ++count;
            }
            this._charCount = count;
        };
        Text2D.prototype._setTextAlignmentfromString = function (value) {
            var m = value.trim().split(",");
            for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
                var v = m_1[_i];
                v = v.toLocaleLowerCase().trim();
                // Horizontal
                var i = v.indexOf("h:");
                if (i === -1) {
                    i = v.indexOf("horizontal:");
                }
                if (i !== -1) {
                    v = v.substr(v.indexOf(":") + 1);
                    this._setTextAlignmentHorizontal(v);
                    continue;
                }
                // Vertical
                i = v.indexOf("v:");
                if (i === -1) {
                    i = v.indexOf("vertical:");
                }
                if (i !== -1) {
                    v = v.substr(v.indexOf(":") + 1);
                    this._setTextAlignmentVertical(v);
                    continue;
                }
            }
        };
        Text2D.prototype._setTextAlignmentHorizontal = function (text) {
            var v = text.trim().toLocaleLowerCase();
            switch (v) {
                case "left":
                    this.textAlignmentH = Text2D_1.AlignLeft;
                    return;
                case "right":
                    this.textAlignmentH = Text2D_1.AlignRight;
                    return;
                case "center":
                    this.textAlignmentH = Text2D_1.AlignCenter;
                    return;
            }
        };
        Text2D.prototype._setTextAlignmentVertical = function (text) {
            var v = text.trim().toLocaleLowerCase();
            switch (v) {
                case "top":
                    this.textAlignmentV = Text2D_1.AlignTop;
                    return;
                case "bottom":
                    this.textAlignmentV = Text2D_1.AlignBottom;
                    return;
                case "center":
                    this.textAlignmentV = Text2D_1.AlignCenter;
                    return;
            }
        };
        Text2D.prototype._useTextureAlpha = function () {
            return this._fontSDF;
        };
        Text2D.prototype._shouldUseAlphaFromTexture = function () {
            return !this._fontSDF;
        };
        return Text2D;
    }(BABYLON.RenderablePrim2D));
    Text2D.TEXT2D_MAINPARTID = 1;
    Text2D.TEXT2D_CATEGORY_SDF = "SignedDistanceField";
    Text2D.TEXT2D_CATEGORY_FONTTEXTURE = "FontTexture";
    Text2D._AlignLeft = 1;
    Text2D._AlignTop = 1; // Same as left
    Text2D._AlignRight = 2;
    Text2D._AlignBottom = 2; // Same as right
    Text2D._AlignCenter = 3;
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 1, function (pi) { return Text2D_1.fontProperty = pi; }, false, true)
        /**
         * Get/set the font name to use, using HTML CSS notation.
         * Set is not supported right now.
         */
    ], Text2D.prototype, "fontName", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 2, function (pi) { return Text2D_1.defaultFontColorProperty = pi; })
        /**
         * Get/set the font default color
         */
    ], Text2D.prototype, "defaultFontColor", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 3, function (pi) { return Text2D_1.textProperty = pi; }, false, true)
        /**
         * Get/set the text to render.
         * \n \t character are supported.
         */
    ], Text2D.prototype, "text", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 4, function (pi) { return Text2D_1.sizeProperty = pi; })
        /**
         * Get/set the size of the area where the text is drawn.
         * You should not set this size, the default behavior compute the size based on the actual text.
         */
    ], Text2D.prototype, "size", null);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 5, function (pi) { return Text2D_1.fontSuperSampleProperty = pi; }, false, false)
        /**
         * Get/set the font name to use, using HTML CSS notation.
         * Set is not supported right now.
         */
    ], Text2D.prototype, "fontSuperSample", null);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 6, function (pi) { return Text2D_1.fontSignedDistanceFieldProperty = pi; }, false, false)
        /**
         * Get/set the font name to use, using HTML CSS notation.
         * Set is not supported right now.
         */
    ], Text2D.prototype, "fontSignedDistanceField", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 7, function (pi) { return Text2D_1.textureIsPremulAlphaProperty = pi; })
        /**
         * Set to true if the FontTexture use Premultiplied Alpha, default is false
         */
    ], Text2D.prototype, "textureIsPremulAlpha", null);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 8, function (pi) { return Text2D_1.fontTextureProperty = pi; })
    ], Text2D.prototype, "fontTexture", null);
    Text2D = Text2D_1 = __decorate([
        BABYLON.className("Text2D", "BABYLON")
        /**
         * Primitive that render text using a specific font
         */
    ], Text2D);
    BABYLON.Text2D = Text2D;
    var Text2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.text2d.js.map
