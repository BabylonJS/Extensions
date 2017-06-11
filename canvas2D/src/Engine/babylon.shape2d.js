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
    var Shape2D = Shape2D_1 = (function (_super) {
        __extends(Shape2D, _super);
        function Shape2D(settings) {
            var _this = _super.call(this, settings) || this;
            if (!settings) {
                settings = {};
            }
            var borderBrush = null;
            if (settings.border) {
                if (typeof (settings.border) === "string") {
                    borderBrush = BABYLON.Canvas2D.GetBrushFromString(settings.border);
                }
                else {
                    borderBrush = settings.border;
                }
            }
            var fillBrush = null;
            if (settings.fill) {
                if (typeof (settings.fill) === "string") {
                    fillBrush = BABYLON.Canvas2D.GetBrushFromString(settings.fill);
                }
                else {
                    fillBrush = settings.fill;
                }
            }
            _this._isTransparent = false;
            _this._oldTransparent = false;
            _this.border = borderBrush;
            _this.fill = fillBrush;
            _this._updateTransparencyStatus();
            _this.borderThickness = settings.borderThickness;
            return _this;
        }
        Object.defineProperty(Shape2D.prototype, "border", {
            get: function () {
                return this._border;
            },
            set: function (value) {
                this._border = value;
                this._updateTransparencyStatus();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2D.prototype, "fill", {
            /**
             * Get/set the brush to render the Fill part of the Primitive
             */
            get: function () {
                return this._fill;
            },
            set: function (value) {
                this._fill = value;
                this._updateTransparencyStatus();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2D.prototype, "borderThickness", {
            get: function () {
                return this._borderThickness;
            },
            set: function (value) {
                this._borderThickness = value;
            },
            enumerable: true,
            configurable: true
        });
        Shape2D.prototype.getUsedShaderCategories = function (dataPart) {
            var cat = _super.prototype.getUsedShaderCategories.call(this, dataPart);
            // Fill Part
            if (dataPart.id === Shape2D_1.SHAPE2D_FILLPARTID) {
                var fill = this.fill;
                if (fill instanceof BABYLON.SolidColorBrush2D) {
                    cat.push(Shape2D_1.SHAPE2D_CATEGORY_FILLSOLID);
                }
                if (fill instanceof BABYLON.GradientColorBrush2D) {
                    cat.push(Shape2D_1.SHAPE2D_CATEGORY_FILLGRADIENT);
                }
            }
            // Border Part
            if (dataPart.id === Shape2D_1.SHAPE2D_BORDERPARTID) {
                cat.push(Shape2D_1.SHAPE2D_CATEGORY_BORDER);
                var border = this.border;
                if (border instanceof BABYLON.SolidColorBrush2D) {
                    cat.push(Shape2D_1.SHAPE2D_CATEGORY_BORDERSOLID);
                }
                if (border instanceof BABYLON.GradientColorBrush2D) {
                    cat.push(Shape2D_1.SHAPE2D_CATEGORY_BORDERGRADIENT);
                }
            }
            return cat;
        };
        //protected applyActualScaleOnTransform(): boolean {
        //    return false;
        //}
        Shape2D.prototype.refreshInstanceDataPart = function (part) {
            if (!_super.prototype.refreshInstanceDataPart.call(this, part)) {
                return false;
            }
            // Fill Part
            if (part.id === Shape2D_1.SHAPE2D_FILLPARTID) {
                var d = part;
                if (this.fill) {
                    var fill = this.fill;
                    if (fill instanceof BABYLON.SolidColorBrush2D) {
                        d.fillSolidColor = fill.color;
                    }
                    else if (fill instanceof BABYLON.GradientColorBrush2D) {
                        d.fillGradientColor1 = fill.color1;
                        d.fillGradientColor2 = fill.color2;
                        var t = BABYLON.Matrix2D.Compose(new BABYLON.Vector2(fill.scale, fill.scale), fill.rotation, new BABYLON.Vector2(fill.translation.x, fill.translation.y));
                        var ty = new BABYLON.Vector4(t.m[1], t.m[3], 0, t.m[5]);
                        d.fillGradientTY = ty;
                    }
                }
            }
            else if (part.id === Shape2D_1.SHAPE2D_BORDERPARTID) {
                var d = part;
                if (this.border) {
                    d.borderThickness = this.borderThickness;
                    var border = this.border;
                    if (border instanceof BABYLON.SolidColorBrush2D) {
                        d.borderSolidColor = border.color;
                    }
                    else if (border instanceof BABYLON.GradientColorBrush2D) {
                        d.borderGradientColor1 = border.color1;
                        d.borderGradientColor2 = border.color2;
                        var t = BABYLON.Matrix2D.Compose(new BABYLON.Vector2(border.scale, border.scale), border.rotation, new BABYLON.Vector2(border.translation.x, border.translation.y));
                        var ty = new BABYLON.Vector4(t.m[1], t.m[3], 0, t.m[5]);
                        d.borderGradientTY = ty;
                    }
                }
            }
            return true;
        };
        Shape2D.prototype._updateTransparencyStatus = function () {
            this._isTransparent = (this._border && this._border.isTransparent()) || (this._fill && this._fill.isTransparent()) || (this.actualOpacity < 1);
            if (this._isTransparent !== this._oldTransparent) {
                this._oldTransparent = this._isTransparent;
                this._updateRenderMode();
            }
        };
        Shape2D.prototype._mustUpdateInstance = function () {
            var res = this._oldTransparent !== this._isTransparent;
            if (res) {
                this._updateRenderMode();
                this._oldTransparent = this._isTransparent;
            }
            return res;
        };
        Shape2D.prototype._isPrimTransparent = function () {
            return this._isTransparent;
        };
        return Shape2D;
    }(BABYLON.RenderablePrim2D));
    Shape2D.SHAPE2D_BORDERPARTID = 1;
    Shape2D.SHAPE2D_FILLPARTID = 2;
    Shape2D.SHAPE2D_CATEGORY_BORDER = "Border";
    Shape2D.SHAPE2D_CATEGORY_BORDERSOLID = "BorderSolid";
    Shape2D.SHAPE2D_CATEGORY_BORDERGRADIENT = "BorderGradient";
    Shape2D.SHAPE2D_CATEGORY_FILLSOLID = "FillSolid";
    Shape2D.SHAPE2D_CATEGORY_FILLGRADIENT = "FillGradient";
    Shape2D.SHAPE2D_PROPCOUNT = BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 5;
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 1, function (pi) { return Shape2D_1.borderProperty = pi; }, true)
        /**
         * Get/set the brush to render the Border part of the Primitive
         */
    ], Shape2D.prototype, "border", null);
    __decorate([
        BABYLON.modelLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 2, function (pi) { return Shape2D_1.fillProperty = pi; }, true)
    ], Shape2D.prototype, "fill", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.RenderablePrim2D.RENDERABLEPRIM2D_PROPCOUNT + 3, function (pi) { return Shape2D_1.borderThicknessProperty = pi; })
        /**
         * Get/set the thickness of the border part.
         */
    ], Shape2D.prototype, "borderThickness", null);
    Shape2D = Shape2D_1 = __decorate([
        BABYLON.className("Shape2D", "BABYLON")
        /**
         * The abstract class for parametric shape based Primitives types.
         * Shape2D based primitives are composed of two parts: fill and border, both are optional but at least one must be specified.
         * The fill part is the primitive 'body', the border is a border around this body. The border has a thickness that can be changed.
         */
    ], Shape2D);
    BABYLON.Shape2D = Shape2D;
    var Shape2DInstanceData = (function (_super) {
        __extends(Shape2DInstanceData, _super);
        function Shape2DInstanceData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Shape2DInstanceData.prototype, "fillSolidColor", {
            // FILL ATTRIBUTES
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "fillGradientColor1", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "fillGradientColor2", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "fillGradientTY", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "borderThickness", {
            // BORDER ATTRIBUTES
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "borderSolidColor", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "borderGradientColor1", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "borderGradientColor2", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape2DInstanceData.prototype, "borderGradientTY", {
            get: function () {
                return null;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return Shape2DInstanceData;
    }(BABYLON.InstanceDataBase));
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_FILLSOLID)
    ], Shape2DInstanceData.prototype, "fillSolidColor", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_FILLGRADIENT)
    ], Shape2DInstanceData.prototype, "fillGradientColor1", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_FILLGRADIENT)
    ], Shape2DInstanceData.prototype, "fillGradientColor2", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_FILLGRADIENT)
    ], Shape2DInstanceData.prototype, "fillGradientTY", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_BORDER)
    ], Shape2DInstanceData.prototype, "borderThickness", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_BORDERSOLID)
    ], Shape2DInstanceData.prototype, "borderSolidColor", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_BORDERGRADIENT)
    ], Shape2DInstanceData.prototype, "borderGradientColor1", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_BORDERGRADIENT)
    ], Shape2DInstanceData.prototype, "borderGradientColor2", null);
    __decorate([
        BABYLON.instanceData(Shape2D.SHAPE2D_CATEGORY_BORDERGRADIENT)
    ], Shape2DInstanceData.prototype, "borderGradientTY", null);
    BABYLON.Shape2DInstanceData = Shape2DInstanceData;
    var Shape2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.shape2d.js.map
