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
    var ContentControl = ContentControl_1 = (function (_super) {
        __extends(ContentControl, _super);
        function ContentControl(settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            if (settings.content != null) {
                _this._content = settings.content;
            }
            return _this;
        }
        ContentControl.prototype.dispose = function () {
            if (this.isDisposed) {
                return false;
            }
            if (this.content && this.content.dispose) {
                this.content.dispose();
                this.content = null;
            }
            if (this.__contentUIElement) {
                this.__contentUIElement.dispose();
                this.__contentUIElement = null;
            }
            _super.prototype.dispose.call(this);
            return true;
        };
        Object.defineProperty(ContentControl.prototype, "content", {
            get: function () {
                return this._content;
            },
            set: function (value) {
                this._content = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContentControl.prototype, "_contentUIElement", {
            get: function () {
                if (!this.__contentUIElement) {
                    this._buildContentUIElement();
                }
                return this.__contentUIElement;
            },
            enumerable: true,
            configurable: true
        });
        ContentControl.prototype._createVisualTree = function () {
            // Base implementation will create the Group2D for the Visual Placeholder and its Visual Tree
            _super.prototype._createVisualTree.call(this);
            // A Content Control has a Group2D, child of the visualPlaceHolder, which is the Content placeholder.
            // The Content UIElement Tree will be create inside this placeholder.
            this._contentPlaceholder = new BABYLON.Group2D({ parent: this._visualPlaceholder, id: "ContentControl Content Placeholder of " + this.id });
            var p = this._contentPlaceholder;
            // The UIElement padding properties (padding and paddingAlignment) are bound to the Group2D Content placeholder, we bound to the Margin properties as the Group2D acts as an inner element already, so margin of inner is padding.
            p.dataSource = this;
            p.createSimpleDataBinding(BABYLON.Prim2DBase.marginProperty, "padding", BABYLON.DataBinding.MODE_ONEWAY);
            p.createSimpleDataBinding(BABYLON.Prim2DBase.marginAlignmentProperty, "paddingAlignment", BABYLON.DataBinding.MODE_ONEWAY);
            // The UIElement set the childrenPlaceholder with the visual returned by the renderingTemplate.
            // But it's not the case for a ContentControl, the placeholder of UIElement Children (the content)
            this._visualChildrenPlaceholder = this._contentPlaceholder;
        };
        ContentControl.prototype._buildContentUIElement = function () {
            var c = this._content;
            this.__contentUIElement = null;
            // Already a UIElement
            if (c instanceof BABYLON.UIElement) {
                this.__contentUIElement = c;
            }
            else if ((typeof c === "string") || (typeof c === "boolean") || (typeof c === "number")) {
                var l = new BABYLON.Label({ parent: this, id: "Content of " + this.id });
                var binding = new BABYLON.DataBinding();
                binding.propertyPathName = "content";
                binding.stringFormat = function (v) { return "" + v; };
                binding.dataSource = this;
                l.createDataBinding(BABYLON.Label.textProperty, binding);
                this.__contentUIElement = l;
            }
            else {
                // TODO: DataTemplate lookup and create instance
            }
            if (this.__contentUIElement) {
                this.__contentUIElement._patchUIElement(this.ownerWindow, this);
            }
        };
        ContentControl.prototype._getChildren = function () {
            var children = new Array();
            if (this.content) {
                children.push(this._contentUIElement);
            }
            return children;
        };
        return ContentControl;
    }(BABYLON.Control));
    ContentControl.CONTENTCONTROL_PROPCOUNT = BABYLON.Control.CONTROL_PROPCOUNT + 2;
    __decorate([
        BABYLON.dependencyProperty(BABYLON.Control.CONTROL_PROPCOUNT + 0, function (pi) { return ContentControl_1.contentProperty = pi; })
    ], ContentControl.prototype, "content", null);
    ContentControl = ContentControl_1 = __decorate([
        BABYLON.className("ContentControl", "BABYLON")
    ], ContentControl);
    BABYLON.ContentControl = ContentControl;
    var ContentControl_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.contentControl.js.map
