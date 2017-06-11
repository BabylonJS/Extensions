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
    var Control = Control_1 = (function (_super) {
        __extends(Control, _super);
        function Control(settings) {
            return _super.call(this, settings) || this;
        }
        Object.defineProperty(Control.prototype, "background", {
            get: function () {
                if (!this._background) {
                    this._background = new BABYLON.ObservableStringDictionary(false);
                }
                return this._background;
            },
            set: function (value) {
                this.background.copyFrom(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "border", {
            get: function () {
                return this._border;
            },
            set: function (value) {
                this._border = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "borderThickness", {
            get: function () {
                return this._borderThickness;
            },
            set: function (value) {
                this._borderThickness = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "fontName", {
            get: function () {
                return this._fontName;
            },
            set: function (value) {
                this._fontName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "foreground", {
            get: function () {
                return this._foreground;
            },
            set: function (value) {
                this._foreground = value;
            },
            enumerable: true,
            configurable: true
        });
        return Control;
    }(BABYLON.UIElement));
    Control.CONTROL_PROPCOUNT = BABYLON.UIElement.UIELEMENT_PROPCOUNT + 5;
    __decorate([
        BABYLON.dependencyProperty(BABYLON.UIElement.UIELEMENT_PROPCOUNT + 0, function (pi) { return Control_1.backgroundProperty = pi; })
    ], Control.prototype, "background", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.UIElement.UIELEMENT_PROPCOUNT + 1, function (pi) { return Control_1.borderProperty = pi; })
    ], Control.prototype, "border", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.UIElement.UIELEMENT_PROPCOUNT + 2, function (pi) { return Control_1.borderThicknessProperty = pi; })
    ], Control.prototype, "borderThickness", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.UIElement.UIELEMENT_PROPCOUNT + 3, function (pi) { return Control_1.fontNameProperty = pi; })
    ], Control.prototype, "fontName", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.UIElement.UIELEMENT_PROPCOUNT + 4, function (pi) { return Control_1.foregroundProperty = pi; })
    ], Control.prototype, "foreground", null);
    Control = Control_1 = __decorate([
        BABYLON.className("Control", "BABYLON")
    ], Control);
    BABYLON.Control = Control;
    var Control_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.control.js.map
