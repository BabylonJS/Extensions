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
    var StackPanel = StackPanel_1 = (function (_super) {
        __extends(StackPanel, _super);
        function StackPanel(settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            _this.isOrientationHorizontal = (settings.isOrientationHorizontal == null) ? true : settings.isOrientationHorizontal;
            _this._children = new Array();
            if (settings.children != null) {
                for (var _i = 0, _a = settings.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    _this._children.push(child);
                }
            }
            return _this;
        }
        Object.defineProperty(StackPanel.prototype, "isOrientationHorizontal", {
            get: function () {
                return this._isOrientationHorizontal;
            },
            set: function (value) {
                this._isOrientationHorizontal = value;
            },
            enumerable: true,
            configurable: true
        });
        StackPanel.prototype.createVisualTree = function () {
            _super.prototype.createVisualTree.call(this);
            // A StackPanel Control has a Group2D, child of the visualPlaceHolder, which is the Children placeholder.
            // The Children UIElement Tree will be create inside this placeholder.
            this._childrenPlaceholder = new BABYLON.Group2D({ parent: this._visualPlaceholder, id: "StackPanel Children Placeholder of " + this.id });
            var p = this._childrenPlaceholder;
            p.layoutEngine = this.isOrientationHorizontal ? BABYLON.StackPanelLayoutEngine.Horizontal : BABYLON.StackPanelLayoutEngine.Vertical;
            // The UIElement padding properties (padding and paddingAlignment) are bound to the Group2D Children placeholder, we bound to the Margin properties as the Group2D acts as an inner element already, so margin of inner is padding.
            p.dataSource = this;
            p.createSimpleDataBinding(BABYLON.Prim2DBase.marginProperty, "padding", BABYLON.DataBinding.MODE_ONEWAY);
            p.createSimpleDataBinding(BABYLON.Prim2DBase.marginAlignmentProperty, "paddingAlignment", BABYLON.DataBinding.MODE_ONEWAY);
            // The UIElement set the childrenPlaceholder with the visual returned by the renderingTemplate.
            // But it's not the case for a StackPanel, the placeholder of UIElement Children (the content)
            this._visualChildrenPlaceholder = this._childrenPlaceholder;
        };
        Object.defineProperty(StackPanel.prototype, "children", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        StackPanel.prototype._getChildren = function () {
            return this.children;
        };
        return StackPanel;
    }(BABYLON.UIElement));
    StackPanel.STACKPANEL_PROPCOUNT = BABYLON.UIElement.UIELEMENT_PROPCOUNT + 3;
    __decorate([
        BABYLON.dependencyProperty(StackPanel_1.STACKPANEL_PROPCOUNT + 0, function (pi) { return StackPanel_1.orientationHorizontalProperty = pi; })
    ], StackPanel.prototype, "isOrientationHorizontal", null);
    StackPanel = StackPanel_1 = __decorate([
        BABYLON.className("StackPanel", "BABYLON")
    ], StackPanel);
    BABYLON.StackPanel = StackPanel;
    var DefaultStackPanelRenderingTemplate = DefaultStackPanelRenderingTemplate_1 = (function (_super) {
        __extends(DefaultStackPanelRenderingTemplate, _super);
        function DefaultStackPanelRenderingTemplate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultStackPanelRenderingTemplate.prototype.createVisualTree = function (owner, visualPlaceholder) {
            return { root: visualPlaceholder, contentPlaceholder: visualPlaceholder };
        };
        DefaultStackPanelRenderingTemplate.prototype.attach = function (owner) {
            _super.prototype.attach.call(this, owner);
        };
        return DefaultStackPanelRenderingTemplate;
    }(BABYLON.UIElementRenderingTemplateBase));
    DefaultStackPanelRenderingTemplate = DefaultStackPanelRenderingTemplate_1 = __decorate([
        BABYLON.registerWindowRenderingTemplate("BABYLON.StackPanel", "Default", function () { return new DefaultStackPanelRenderingTemplate_1(); })
    ], DefaultStackPanelRenderingTemplate);
    BABYLON.DefaultStackPanelRenderingTemplate = DefaultStackPanelRenderingTemplate;
    var StackPanel_1, DefaultStackPanelRenderingTemplate_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.stackPanel.js.map
