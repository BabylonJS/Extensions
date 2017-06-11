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
    var FocusScopeData = (function () {
        function FocusScopeData(focusScope) {
            this.focusScope = focusScope;
            this.focusedElement = null;
        }
        return FocusScopeData;
    }());
    var FocusManager = (function () {
        function FocusManager() {
            this._focusScopes = new BABYLON.StringDictionary();
            this._rootScope = new FocusScopeData(null);
            this._activeScope = null;
        }
        FocusManager.prototype.setFocusOn = function (el, focusScope) {
            var fsd = (focusScope != null) ? this._focusScopes.getOrAddWithFactory(focusScope.uid, function (k) { return new FocusScopeData(focusScope); }) : this._rootScope;
            if (fsd.focusedElement !== el) {
                // Remove focus from current
                if (fsd.focusedElement) {
                    fsd.focusedElement.isFocused = false;
                }
                fsd.focusedElement = el;
            }
            if (this._activeScope !== fsd) {
                this._activeScope = fsd;
            }
        };
        return FocusManager;
    }());
    BABYLON.FocusManager = FocusManager;
    var GUISceneData = (function () {
        function GUISceneData(scene) {
            this.scene = scene;
            this.screenSpaceCanvas = new BABYLON.ScreenSpaceCanvas2D(scene, { id: "GUI Canvas", cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE });
            this.focusManager = new FocusManager();
        }
        return GUISceneData;
    }());
    var Window = Window_1 = (function (_super) {
        __extends(Window, _super);
        function Window(scene, settings) {
            var _this = this;
            if (!settings) {
                settings = {};
            }
            _this = _super.call(this, settings) || this;
            // Per default a Window is focus scope
            _this.isFocusScope = true;
            _this.isActive = false;
            if (!_this._UIElementVisualToBuildList) {
                _this._UIElementVisualToBuildList = new Array();
            }
            // Patch the owner and also the parent property through the whole tree
            _this._patchUIElement(_this, null);
            // Screen Space UI
            if (!settings.worldPosition && !settings.worldRotation) {
                _this._sceneData = Window_1.getSceneData(scene);
                _this._canvas = _this._sceneData.screenSpaceCanvas;
                _this._isWorldSpaceCanvas = false;
                _this._left = (settings.left != null) ? settings.left : 0;
                _this._bottom = (settings.bottom != null) ? settings.bottom : 0;
            }
            else {
                var w = (settings.width == null) ? 100 : settings.width;
                var h = (settings.height == null) ? 100 : settings.height;
                var wpos = (settings.worldPosition == null) ? BABYLON.Vector3.Zero() : settings.worldPosition;
                var wrot = (settings.worldRotation == null) ? BABYLON.Quaternion.Identity() : settings.worldRotation;
                _this._canvas = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(w, h), { id: "GUI Canvas", cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE, worldPosition: wpos, worldRotation: wrot });
                _this._isWorldSpaceCanvas = true;
            }
            _this._renderObserver = _this._canvas.renderObservable.add(function (e, s) { return _this._canvasPreRender(); }, BABYLON.Canvas2D.RENDEROBSERVABLE_PRE);
            _this._disposeObserver = _this._canvas.disposeObservable.add(function (e, s) { return _this._canvasDisposed(); });
            _this._canvas.propertyChanged.add(function (e, s) {
                if (e.propertyName === "overPrim") {
                    _this._overPrimChanged(e.oldValue, e.newValue);
                }
            });
            _this._mouseOverUIElement = null;
            return _this;
        }
        Object.defineProperty(Window.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (value) {
                var old = new BABYLON.Vector2(this._left, this._bottom);
                this._left = value;
                this.onPropertyChanged("_position", old, this._position);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "bottom", {
            get: function () {
                return this._bottom;
            },
            set: function (value) {
                var old = new BABYLON.Vector2(this._left, this._bottom);
                this._bottom = value;
                this.onPropertyChanged("_position", old, this._position);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._left = value.x;
                this._bottom = value.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "isActive", {
            get: function () {
                return this._isActive;
            },
            set: function (value) {
                this._isActive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "focusManager", {
            get: function () {
                return this._sceneData.focusManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "_position", {
            get: function () {
                return new BABYLON.Vector2(this.left, this.bottom);
            },
            enumerable: true,
            configurable: true
        });
        Window.prototype.createVisualTree = function () {
            _super.prototype.createVisualTree.call(this);
            var p = this._visualPlaceholder;
            p.createSimpleDataBinding(BABYLON.Group2D.positionProperty, "position");
        };
        Window.prototype._registerVisualToBuild = function (uiel) {
            if (uiel._isFlagSet(BABYLON.UIElement.flagVisualToBuild)) {
                return;
            }
            if (!this._UIElementVisualToBuildList) {
                this._UIElementVisualToBuildList = new Array();
            }
            this._UIElementVisualToBuildList.push(uiel);
            uiel._setFlags(BABYLON.UIElement.flagVisualToBuild);
        };
        Window.prototype._overPrimChanged = function (oldPrim, newPrim) {
            var curOverEl = this._mouseOverUIElement;
            var newOverEl = null;
            var curGroup = newPrim ? newPrim.traverseUp(function (p) { return p instanceof BABYLON.Group2D; }) : null;
            while (curGroup) {
                var uiel = curGroup.getExternalData("_GUIOwnerElement_");
                if (uiel) {
                    newOverEl = uiel;
                    break;
                }
                curGroup = curGroup.parent ? curGroup.parent.traverseUp(function (p) { return p instanceof BABYLON.Group2D; }) : null;
            }
            if (curOverEl === newOverEl) {
                return;
            }
            if (curOverEl) {
                curOverEl.isMouseOver = false;
            }
            if (newOverEl) {
                newOverEl.isMouseOver = true;
            }
            this._mouseOverUIElement = newOverEl;
        };
        Window.prototype._canvasPreRender = function () {
            // Check if we have visual to create
            if (this._UIElementVisualToBuildList.length > 0) {
                // Sort the UI Element to get the highest (so lowest hierarchy depth) in the hierarchy tree first
                var sortedElementList = this._UIElementVisualToBuildList.sort(function (a, b) { return a.hierarchyDepth - b.hierarchyDepth; });
                for (var _i = 0, sortedElementList_1 = sortedElementList; _i < sortedElementList_1.length; _i++) {
                    var el = sortedElementList_1[_i];
                    el._createVisualTree();
                }
                this._UIElementVisualToBuildList.splice(0);
            }
        };
        Window.prototype._canvasDisposed = function () {
            this._canvas.disposeObservable.remove(this._disposeObserver);
            this._canvas.renderObservable.remove(this._renderObserver);
        };
        Window.getSceneData = function (scene) {
            return Window_1._sceneData.getOrAddWithFactory(scene.uid, function (k) { return new GUISceneData(scene); });
        };
        return Window;
    }(BABYLON.ContentControl));
    Window.WINDOW_PROPCOUNT = BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 4;
    Window._sceneData = new BABYLON.StringDictionary();
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 0, function (pi) { return Window_1.leftProperty = pi; })
    ], Window.prototype, "left", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 1, function (pi) { return Window_1.bottomProperty = pi; })
    ], Window.prototype, "bottom", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 2, function (pi) { return Window_1.positionProperty = pi; })
    ], Window.prototype, "position", null);
    __decorate([
        BABYLON.dependencyProperty(BABYLON.ContentControl.CONTENTCONTROL_PROPCOUNT + 3, function (pi) { return Window_1.isActiveProperty = pi; })
    ], Window.prototype, "isActive", null);
    Window = Window_1 = __decorate([
        BABYLON.className("Window", "BABYLON")
    ], Window);
    BABYLON.Window = Window;
    var DefaultWindowRenderingTemplate = DefaultWindowRenderingTemplate_1 = (function (_super) {
        __extends(DefaultWindowRenderingTemplate, _super);
        function DefaultWindowRenderingTemplate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultWindowRenderingTemplate.prototype.createVisualTree = function (owner, visualPlaceholder) {
            var r = new BABYLON.Rectangle2D({ parent: visualPlaceholder, fill: "#808080FF" });
            return { root: r, contentPlaceholder: r };
        };
        return DefaultWindowRenderingTemplate;
    }(BABYLON.UIElementRenderingTemplateBase));
    DefaultWindowRenderingTemplate = DefaultWindowRenderingTemplate_1 = __decorate([
        BABYLON.registerWindowRenderingTemplate("BABYLON.Window", "Default", function () { return new DefaultWindowRenderingTemplate_1(); })
    ], DefaultWindowRenderingTemplate);
    BABYLON.DefaultWindowRenderingTemplate = DefaultWindowRenderingTemplate;
    var Window_1, DefaultWindowRenderingTemplate_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gui.window.js.map
