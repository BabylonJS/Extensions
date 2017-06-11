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
    var Button = Button_1 = (function (_super) {
        __extends(Button, _super);
        function Button(settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            if (settings.paddingAlignment == null) {
                _this.paddingAlignment.horizontal = BABYLON.PrimitiveAlignment.AlignCenter;
                _this.paddingAlignment.vertical = BABYLON.PrimitiveAlignment.AlignCenter;
            }
            _this._normalStateBackground = new BABYLON.ObservableStringDictionary(false);
            _this._normalStateBorder = new BABYLON.ObservableStringDictionary(false);
            _this._defaultStateBackground = new BABYLON.ObservableStringDictionary(false);
            _this._defaultStateBorder = new BABYLON.ObservableStringDictionary(false);
            _this._normalStateBackground.add(BABYLON.UIElement.enabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#337AB7FF"));
            _this._normalStateBackground.add(BABYLON.UIElement.disabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#7BA9D0FF"));
            _this._normalStateBackground.add(BABYLON.UIElement.mouseOverState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#286090FF"));
            _this._normalStateBackground.add(Button_1.pushedState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#1E496EFF"));
            _this._normalStateBorder.add(BABYLON.UIElement.enabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#2E6DA4FF"));
            _this._normalStateBorder.add(BABYLON.UIElement.disabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#77A0C4FF"));
            _this._normalStateBorder.add(BABYLON.UIElement.mouseOverState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#204D74FF"));
            _this._normalStateBorder.add(Button_1.pushedState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#2E5D9EFF"));
            _this._defaultStateBackground.add(BABYLON.UIElement.enabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#FFFFFFFF"));
            _this._defaultStateBackground.add(BABYLON.UIElement.disabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#FFFFFFFF"));
            _this._defaultStateBackground.add(BABYLON.UIElement.mouseOverState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#E6E6E6FF"));
            _this._defaultStateBackground.add(Button_1.pushedState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#D4D4D4FF"));
            _this._defaultStateBorder.add(BABYLON.UIElement.enabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#CCCCCCFF"));
            _this._defaultStateBorder.add(BABYLON.UIElement.disabledState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#DEDEDEFF"));
            _this._defaultStateBorder.add(BABYLON.UIElement.mouseOverState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#ADADADFF"));
            _this._defaultStateBorder.add(Button_1.pushedState, BABYLON.Canvas2D.GetSolidColorBrushFromHex("#6C8EC5FF"));
            return _this;
        }
        Object.defineProperty(Button, "pushedState", {
            get: function () {
                return Button_1._pushedState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "isPushed", {
            get: function () {
                return this._isPushed;
            },
            set: function (value) {
                this._isPushed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "isDefault", {
            get: function () {
                return this._isDefault;
            },
            set: function (value) {
                this._isDefault = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "isOutline", {
            get: function () {
                return this._isOutline;
            },
            set: function (value) {
                this._isOutline = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "clickObservable", {
            get: function () {
                if (!this._clickObservable) {
                    this._clickObservable = new BABYLON.Observable();
                }
                return this._clickObservable;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype._raiseClick = function () {
            if (this._clickObservable && this._clickObservable.hasObservers()) {
                this._clickObservable.notifyObservers(this);
            }
        };
        Button.prototype.createVisualTree = function () {
            var _this = this;
            _super.prototype.createVisualTree.call(this);
            var p = this._visualPlaceholder;
            p.pointerEventObservable.add(function (e, s) {
                // check if input must be discarded
                if (!_this.isVisible || !_this.isEnabled) {
                    return;
                }
                // We reject an event coming from the placeholder because it means it's on an empty spot, so it's not valid.
                if (e.relatedTarget === _this._visualPlaceholder) {
                    return;
                }
                if (s.mask === BABYLON.PrimitivePointerInfo.PointerUp) {
                    _this._raiseClick();
                    _this.isPushed = false;
                }
                else if (s.mask === BABYLON.PrimitivePointerInfo.PointerDown) {
                    _this.isPushed = true;
                    _this.isFocused = true;
                }
            }, BABYLON.PrimitivePointerInfo.PointerUp | BABYLON.PrimitivePointerInfo.PointerDown);
        };
        Object.defineProperty(Button.prototype, "normalStateBackground", {
            get: function () {
                return this._normalStateBackground;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "defaultStateBackground", {
            get: function () {
                return this._defaultStateBackground;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "normalStateBorder", {
            get: function () {
                return this._normalStateBorder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "defaultStateBorder", {
            get: function () {
                return this._defaultStateBorder;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(BABYLON.ContentControl));
    Button.BUTTON_PROPCOUNT = BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 3;
    Button._pushedState = "Pushed";
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTROL_PROPCOUNT + 0, function (pi) { return Button_1.isPushedProperty = pi; })
    ], Button.prototype, "isPushed", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTROL_PROPCOUNT + 1, function (pi) { return Button_1.isDefaultProperty = pi; })
    ], Button.prototype, "isDefault", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTROL_PROPCOUNT + 2, function (pi) { return Button_1.isOutlineProperty = pi; })
    ], Button.prototype, "isOutline", null);
    Button = Button_1 = __decorate([
        BABYLON.className("Button", "BABYLON")
    ], Button);
    BABYLON.Button = Button;
    var DefaultButtonRenderingTemplate = DefaultButtonRenderingTemplate_1 = (function (_super) {
        __extends(DefaultButtonRenderingTemplate, _super);
        function DefaultButtonRenderingTemplate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultButtonRenderingTemplate.prototype.createVisualTree = function (owner, visualPlaceholder) {
            this._rect = new BABYLON.Rectangle2D({ parent: visualPlaceholder, fill: "#FF8080FF", border: "#FF8080FF", roundRadius: 10, borderThickness: 2 });
            this.stateChange();
            return { root: this._rect, contentPlaceholder: this._rect };
        };
        DefaultButtonRenderingTemplate.prototype.attach = function (owner) {
            var _this = this;
            _super.prototype.attach.call(this, owner);
            this.owner.propertyChanged.add(function (e, s) { return _this.stateChange(); }, BABYLON.UIElement.isEnabledProperty.flagId |
                BABYLON.UIElement.isFocusedProperty.flagId |
                BABYLON.UIElement.isMouseOverProperty.flagId |
                Button.isDefaultProperty.flagId |
                Button.isOutlineProperty.flagId |
                Button.isPushedProperty.flagId);
            // Register for brush change and update the Visual
            var button = owner;
            button.normalStateBackground.dictionaryChanged.add(function (e, c) { return _this.stateChange(); });
            button.normalStateBorder.dictionaryChanged.add(function (e, c) { return _this.stateChange(); });
            button.defaultStateBackground.dictionaryChanged.add(function (e, c) { return _this.stateChange(); });
            button.defaultStateBorder.dictionaryChanged.add(function (e, c) { return _this.stateChange(); });
        };
        DefaultButtonRenderingTemplate.prototype.stateChange = function () {
            //console.log("state changed");
            var b = this.owner;
            var state = BABYLON.UIElement.enabledState;
            var bg = b.isDefault ? b.defaultStateBackground.get(state) : b.normalStateBackground.get(state);
            var bd = b.isDefault ? b.defaultStateBorder.get(state) : b.normalStateBorder.get(state);
            if (b.isPushed) {
                state = Button.pushedState;
                if (b.isDefault) {
                    bg = b.defaultStateBackground.get(state);
                    bd = b.defaultStateBorder.get(state);
                }
                else {
                    bg = b.normalStateBackground.get(state);
                    bd = b.normalStateBorder.get(state);
                }
            }
            else if (b.isMouseOver) {
                state = BABYLON.UIElement.mouseOverState;
                if (b.isDefault) {
                    bg = b.defaultStateBackground.get(state);
                    bd = b.defaultStateBorder.get(state);
                }
                else {
                    bg = b.normalStateBackground.get(state);
                    bd = b.normalStateBorder.get(state);
                }
            }
            else if (!b.isEnabled) {
                state = BABYLON.UIElement.disabledState;
                if (b.isDefault) {
                    bg = b.defaultStateBackground.get(state);
                    bd = b.defaultStateBorder.get(state);
                }
                else {
                    bg = b.normalStateBackground.get(state);
                    bd = b.normalStateBorder.get(state);
                }
            }
            this._rect.fill = bg;
            this._rect.border = bd;
        };
        return DefaultButtonRenderingTemplate;
    }(BABYLON.UIElementRenderingTemplateBase));
    DefaultButtonRenderingTemplate = DefaultButtonRenderingTemplate_1 = __decorate([
        BABYLON.registerWindowRenderingTemplate("BABYLON.Button", "Default", function () { return new DefaultButtonRenderingTemplate_1(); })
    ], DefaultButtonRenderingTemplate);
    BABYLON.DefaultButtonRenderingTemplate = DefaultButtonRenderingTemplate;
    var Button_1, DefaultButtonRenderingTemplate_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.button.js.map
