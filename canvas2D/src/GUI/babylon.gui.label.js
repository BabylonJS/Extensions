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
    var Label = Label_1 = (function (_super) {
        __extends(Label, _super);
        function Label(settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            if (settings.text != null) {
                _this.text = settings.text;
            }
            return _this;
        }
        Object.defineProperty(Label.prototype, "_position", {
            get: function () {
                return BABYLON.Vector2.Zero();
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype._getChildren = function () {
            return Label_1._emptyArray;
        };
        Label.prototype.createVisualTree = function () {
            _super.prototype.createVisualTree.call(this);
            var p = this._visualChildrenPlaceholder;
        };
        Object.defineProperty(Label.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
            },
            enumerable: true,
            configurable: true
        });
        return Label;
    }(BABYLON.Control));
    Label._emptyArray = new Array();
    __decorate([
        BABYLON.dependencyProperty(BABYLON.Control.CONTROL_PROPCOUNT + 0, function (pi) { return Label_1.textProperty = pi; })
    ], Label.prototype, "text", null);
    Label = Label_1 = __decorate([
        BABYLON.className("Label", "BABYLON")
    ], Label);
    BABYLON.Label = Label;
    var DefaultLabelRenderingTemplate = DefaultLabelRenderingTemplate_1 = (function (_super) {
        __extends(DefaultLabelRenderingTemplate, _super);
        function DefaultLabelRenderingTemplate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultLabelRenderingTemplate.prototype.createVisualTree = function (owner, visualPlaceholder) {
            var r = new BABYLON.Text2D("", { parent: visualPlaceholder });
            r.createSimpleDataBinding(BABYLON.Text2D.textProperty, "text");
            r.dataSource = owner;
            return { root: r, contentPlaceholder: r };
        };
        return DefaultLabelRenderingTemplate;
    }(BABYLON.UIElementRenderingTemplateBase));
    DefaultLabelRenderingTemplate = DefaultLabelRenderingTemplate_1 = __decorate([
        BABYLON.registerWindowRenderingTemplate("BABYLON.Label", "Default", function () { return new DefaultLabelRenderingTemplate_1(); })
    ], DefaultLabelRenderingTemplate);
    BABYLON.DefaultLabelRenderingTemplate = DefaultLabelRenderingTemplate;
    var Label_1, DefaultLabelRenderingTemplate_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.label.js.map
