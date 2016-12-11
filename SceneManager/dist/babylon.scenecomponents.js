var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BABYLON;
(function (BABYLON) {
    var SceneComponent = (function () {
        function SceneComponent(owner, host, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            this.register = null;
            this.dispose = null;
            this.tick = false;
            this._engine = null;
            this._scene = null;
            this._before = null;
            this._after = null;
            this._started = false;
            this._initialized = false;
            this._properties = null;
            this._manager = null;
            this._owned = null;
            if (owner == null)
                throw new Error("Null owner scene obejct specified.");
            if (host == null)
                throw new Error("Null host scene obejct specified.");
            this._owned = owner;
            this._started = false;
            this._manager = null;
            this._initialized = false;
            this._properties = propertyBag;
            this._engine = host.getEngine();
            this._scene = host;
            this.tick = enableUpdate;
            /* Scene Component Instance Handlers */
            var instance = this;
            instance.register = function () { instance.registerInstance(instance); };
            instance._before = function () { instance.updateInstance(instance); };
            instance._after = function () { instance.afterInstance(instance); };
            instance.dispose = function () { instance.disposeInstance(instance); };
        }
        Object.defineProperty(SceneComponent.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneComponent.prototype, "engine", {
            get: function () {
                return this._engine;
            },
            enumerable: true,
            configurable: true
        });
        /* Scene Component Life Cycle Functions */
        SceneComponent.prototype.start = function () { };
        SceneComponent.prototype.update = function () { };
        SceneComponent.prototype.after = function () { };
        SceneComponent.prototype.destroy = function () { };
        Object.defineProperty(SceneComponent.prototype, "manager", {
            /* Scene Component Helper Member Functions */
            get: function () {
                if (this._manager == null) {
                    this._manager = BABYLON.SceneManager.GetInstance(this.scene);
                }
                return this._manager;
            },
            enumerable: true,
            configurable: true
        });
        SceneComponent.prototype.setProperty = function (name, propertyValue) {
            if (this._properties != null) {
                this._properties[name] = propertyValue;
            }
        };
        SceneComponent.prototype.getProperty = function (name, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var result = null;
            if (this._properties != null) {
                result = this._properties[name];
            }
            if (result == null)
                result = defaultValue;
            return (result != null) ? result : null;
        };
        SceneComponent.prototype.findComponent = function (klass) {
            return this.manager.findSceneComponent(klass, this._owned);
        };
        SceneComponent.prototype.findComponents = function (klass) {
            return this.manager.findSceneComponents(klass, this._owned);
        };
        SceneComponent.prototype.getOwnerMetadata = function () {
            return this.manager.getObjectMetadata(this._owned);
        };
        /* Private Scene Component Instance Worker Functions */
        SceneComponent.prototype.registerInstance = function (instance) {
            instance.scene.registerBeforeRender(instance._before);
            instance.scene.registerAfterRender(instance._after);
        };
        SceneComponent.prototype.updateInstance = function (instance) {
            if (!instance._started) {
                /* First frame starts component */
                instance.start();
                instance._started = true;
            }
            else if (instance._started && instance.tick) {
                /* All other frames tick component */
                instance.update();
            }
        };
        SceneComponent.prototype.afterInstance = function (instance) {
            if (instance._started && instance.tick) {
                instance.after();
            }
        };
        SceneComponent.prototype.disposeInstance = function (instance) {
            instance.scene.unregisterBeforeRender(instance._before);
            instance.scene.unregisterAfterRender(instance._after);
            instance.destroy();
            instance.tick = false;
            instance._before = null;
            instance._after = null;
            instance._started = false;
            instance._properties = null;
            instance._engine = null;
            instance._scene = null;
            instance._manager = null;
            instance.register = null;
            instance.dispose = null;
        };
        return SceneComponent;
    }());
    BABYLON.SceneComponent = SceneComponent;
    var CameraComponent = (function (_super) {
        __extends(CameraComponent, _super);
        function CameraComponent(owner, scene, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            _super.call(this, owner, scene, enableUpdate, propertyBag);
            this._camera = owner;
        }
        Object.defineProperty(CameraComponent.prototype, "camera", {
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });
        return CameraComponent;
    }(BABYLON.SceneComponent));
    BABYLON.CameraComponent = CameraComponent;
    var LightComponent = (function (_super) {
        __extends(LightComponent, _super);
        function LightComponent(owner, scene, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            _super.call(this, owner, scene, enableUpdate, propertyBag);
            this._light = owner;
        }
        Object.defineProperty(LightComponent.prototype, "light", {
            get: function () {
                return this._light;
            },
            enumerable: true,
            configurable: true
        });
        return LightComponent;
    }(BABYLON.SceneComponent));
    BABYLON.LightComponent = LightComponent;
    var MeshComponent = (function (_super) {
        __extends(MeshComponent, _super);
        function MeshComponent(owner, scene, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            _super.call(this, owner, scene, enableUpdate, propertyBag);
            this._mesh = owner;
        }
        Object.defineProperty(MeshComponent.prototype, "mesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        return MeshComponent;
    }(BABYLON.SceneComponent));
    BABYLON.MeshComponent = MeshComponent;
    var SceneController = (function (_super) {
        __extends(SceneController, _super);
        function SceneController(owner, scene, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            _super.call(this, owner, scene, enableUpdate, propertyBag);
        }
        return SceneController;
    }(BABYLON.MeshComponent));
    BABYLON.SceneController = SceneController;
    var ObjectMetadata = (function () {
        function ObjectMetadata(data) {
            this._metadata = null;
            this._metadata = data;
        }
        Object.defineProperty(ObjectMetadata.prototype, "type", {
            get: function () {
                return this._metadata.type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "objectId", {
            get: function () {
                return this._metadata.objectId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "objectName", {
            get: function () {
                return this._metadata.objectName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "tagName", {
            get: function () {
                return this._metadata.tagName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "layerIndex", {
            get: function () {
                return this._metadata.layerIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "layerName", {
            get: function () {
                return this._metadata.layerName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "areaIndex", {
            get: function () {
                return this._metadata.areaIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "navAgent", {
            get: function () {
                return this._metadata.navAgent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "meshLink", {
            get: function () {
                return this._metadata.meshLink;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMetadata.prototype, "meshObstacle", {
            get: function () {
                return this._metadata.meshObstacle;
            },
            enumerable: true,
            configurable: true
        });
        ObjectMetadata.prototype.setProperty = function (name, propertyValue) {
            if (this._metadata.properties != null) {
                this._metadata.properties[name] = propertyValue;
            }
        };
        ObjectMetadata.prototype.getProperty = function (name, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var result = null;
            if (this._metadata.properties != null) {
                result = this._metadata.properties[name];
            }
            if (result == null)
                result = defaultValue;
            return (result != null) ? result : null;
        };
        return ObjectMetadata;
    }());
    BABYLON.ObjectMetadata = ObjectMetadata;
    (function (GamepadType) {
        GamepadType[GamepadType["None"] = -1] = "None";
        GamepadType[GamepadType["Generic"] = 0] = "Generic";
        GamepadType[GamepadType["Xbox360"] = 1] = "Xbox360";
    })(BABYLON.GamepadType || (BABYLON.GamepadType = {}));
    var GamepadType = BABYLON.GamepadType;
    (function (Xbox360Trigger) {
        Xbox360Trigger[Xbox360Trigger["Left"] = 0] = "Left";
        Xbox360Trigger[Xbox360Trigger["Right"] = 1] = "Right";
    })(BABYLON.Xbox360Trigger || (BABYLON.Xbox360Trigger = {}));
    var Xbox360Trigger = BABYLON.Xbox360Trigger;
    (function (UserInputPointer) {
        UserInputPointer[UserInputPointer["Left"] = 0] = "Left";
        UserInputPointer[UserInputPointer["Middle"] = 1] = "Middle";
        UserInputPointer[UserInputPointer["Right"] = 2] = "Right";
    })(BABYLON.UserInputPointer || (BABYLON.UserInputPointer = {}));
    var UserInputPointer = BABYLON.UserInputPointer;
    (function (UserInputAxis) {
        UserInputAxis[UserInputAxis["Horizontal"] = 0] = "Horizontal";
        UserInputAxis[UserInputAxis["Vertical"] = 1] = "Vertical";
        UserInputAxis[UserInputAxis["ClientX"] = 2] = "ClientX";
        UserInputAxis[UserInputAxis["ClientY"] = 3] = "ClientY";
        UserInputAxis[UserInputAxis["MouseX"] = 4] = "MouseX";
        UserInputAxis[UserInputAxis["MouseY"] = 5] = "MouseY";
    })(BABYLON.UserInputAxis || (BABYLON.UserInputAxis = {}));
    var UserInputAxis = BABYLON.UserInputAxis;
    (function (UserInputKey) {
        UserInputKey[UserInputKey["Backspace"] = 8] = "Backspace";
        UserInputKey[UserInputKey["Tab"] = 9] = "Tab";
        UserInputKey[UserInputKey["Enter"] = 13] = "Enter";
        UserInputKey[UserInputKey["Shift"] = 16] = "Shift";
        UserInputKey[UserInputKey["Ctrl"] = 17] = "Ctrl";
        UserInputKey[UserInputKey["Alt"] = 18] = "Alt";
        UserInputKey[UserInputKey["Pause"] = 19] = "Pause";
        UserInputKey[UserInputKey["Break"] = 19] = "Break";
        UserInputKey[UserInputKey["CapsLock"] = 20] = "CapsLock";
        UserInputKey[UserInputKey["Escape"] = 27] = "Escape";
        UserInputKey[UserInputKey["PageUp"] = 33] = "PageUp";
        UserInputKey[UserInputKey["PageDown"] = 34] = "PageDown";
        UserInputKey[UserInputKey["End"] = 35] = "End";
        UserInputKey[UserInputKey["Home"] = 36] = "Home";
        UserInputKey[UserInputKey["LeftArrow"] = 37] = "LeftArrow";
        UserInputKey[UserInputKey["UpArrow"] = 38] = "UpArrow";
        UserInputKey[UserInputKey["RightArrow"] = 39] = "RightArrow";
        UserInputKey[UserInputKey["DownArrow"] = 40] = "DownArrow";
        UserInputKey[UserInputKey["Insert"] = 45] = "Insert";
        UserInputKey[UserInputKey["Delete"] = 46] = "Delete";
        UserInputKey[UserInputKey["Num0"] = 48] = "Num0";
        UserInputKey[UserInputKey["Num1"] = 49] = "Num1";
        UserInputKey[UserInputKey["Num2"] = 50] = "Num2";
        UserInputKey[UserInputKey["Num3"] = 51] = "Num3";
        UserInputKey[UserInputKey["Num4"] = 52] = "Num4";
        UserInputKey[UserInputKey["Num5"] = 53] = "Num5";
        UserInputKey[UserInputKey["Num6"] = 54] = "Num6";
        UserInputKey[UserInputKey["Num7"] = 55] = "Num7";
        UserInputKey[UserInputKey["Num8"] = 56] = "Num8";
        UserInputKey[UserInputKey["Num9"] = 57] = "Num9";
        UserInputKey[UserInputKey["A"] = 65] = "A";
        UserInputKey[UserInputKey["B"] = 66] = "B";
        UserInputKey[UserInputKey["C"] = 67] = "C";
        UserInputKey[UserInputKey["D"] = 68] = "D";
        UserInputKey[UserInputKey["E"] = 69] = "E";
        UserInputKey[UserInputKey["F"] = 70] = "F";
        UserInputKey[UserInputKey["G"] = 71] = "G";
        UserInputKey[UserInputKey["H"] = 72] = "H";
        UserInputKey[UserInputKey["I"] = 73] = "I";
        UserInputKey[UserInputKey["J"] = 74] = "J";
        UserInputKey[UserInputKey["K"] = 75] = "K";
        UserInputKey[UserInputKey["L"] = 76] = "L";
        UserInputKey[UserInputKey["M"] = 77] = "M";
        UserInputKey[UserInputKey["N"] = 78] = "N";
        UserInputKey[UserInputKey["O"] = 79] = "O";
        UserInputKey[UserInputKey["P"] = 80] = "P";
        UserInputKey[UserInputKey["Q"] = 81] = "Q";
        UserInputKey[UserInputKey["R"] = 82] = "R";
        UserInputKey[UserInputKey["S"] = 83] = "S";
        UserInputKey[UserInputKey["T"] = 84] = "T";
        UserInputKey[UserInputKey["U"] = 85] = "U";
        UserInputKey[UserInputKey["V"] = 86] = "V";
        UserInputKey[UserInputKey["W"] = 87] = "W";
        UserInputKey[UserInputKey["X"] = 88] = "X";
        UserInputKey[UserInputKey["Y"] = 89] = "Y";
        UserInputKey[UserInputKey["Z"] = 90] = "Z";
        UserInputKey[UserInputKey["LeftWindowKey"] = 91] = "LeftWindowKey";
        UserInputKey[UserInputKey["RightWindowKey"] = 92] = "RightWindowKey";
        UserInputKey[UserInputKey["SelectKey"] = 93] = "SelectKey";
        UserInputKey[UserInputKey["Numpad0"] = 96] = "Numpad0";
        UserInputKey[UserInputKey["Numpad1"] = 97] = "Numpad1";
        UserInputKey[UserInputKey["Numpad2"] = 98] = "Numpad2";
        UserInputKey[UserInputKey["Numpad3"] = 99] = "Numpad3";
        UserInputKey[UserInputKey["Numpad4"] = 100] = "Numpad4";
        UserInputKey[UserInputKey["Numpad5"] = 101] = "Numpad5";
        UserInputKey[UserInputKey["Numpad6"] = 102] = "Numpad6";
        UserInputKey[UserInputKey["Numpad7"] = 103] = "Numpad7";
        UserInputKey[UserInputKey["Numpad8"] = 104] = "Numpad8";
        UserInputKey[UserInputKey["Numpad9"] = 105] = "Numpad9";
        UserInputKey[UserInputKey["Multiply"] = 106] = "Multiply";
        UserInputKey[UserInputKey["Add"] = 107] = "Add";
        UserInputKey[UserInputKey["Subtract"] = 109] = "Subtract";
        UserInputKey[UserInputKey["DecimalPoint"] = 110] = "DecimalPoint";
        UserInputKey[UserInputKey["Divide"] = 111] = "Divide";
        UserInputKey[UserInputKey["F1"] = 112] = "F1";
        UserInputKey[UserInputKey["F2"] = 113] = "F2";
        UserInputKey[UserInputKey["F3"] = 114] = "F3";
        UserInputKey[UserInputKey["F4"] = 115] = "F4";
        UserInputKey[UserInputKey["F5"] = 116] = "F5";
        UserInputKey[UserInputKey["F6"] = 117] = "F6";
        UserInputKey[UserInputKey["F7"] = 118] = "F7";
        UserInputKey[UserInputKey["F8"] = 119] = "F8";
        UserInputKey[UserInputKey["F9"] = 120] = "F9";
        UserInputKey[UserInputKey["F10"] = 121] = "F10";
        UserInputKey[UserInputKey["F11"] = 122] = "F11";
        UserInputKey[UserInputKey["F12"] = 123] = "F12";
        UserInputKey[UserInputKey["NumLock"] = 144] = "NumLock";
        UserInputKey[UserInputKey["ScrollLock"] = 145] = "ScrollLock";
        UserInputKey[UserInputKey["SemiColon"] = 186] = "SemiColon";
        UserInputKey[UserInputKey["EqualSign"] = 187] = "EqualSign";
        UserInputKey[UserInputKey["Comma"] = 188] = "Comma";
        UserInputKey[UserInputKey["Dash"] = 189] = "Dash";
        UserInputKey[UserInputKey["Period"] = 190] = "Period";
        UserInputKey[UserInputKey["ForwardSlash"] = 191] = "ForwardSlash";
        UserInputKey[UserInputKey["GraveAccent"] = 192] = "GraveAccent";
        UserInputKey[UserInputKey["OpenBracket"] = 219] = "OpenBracket";
        UserInputKey[UserInputKey["BackSlash"] = 220] = "BackSlash";
        UserInputKey[UserInputKey["CloseBraket"] = 221] = "CloseBraket";
        UserInputKey[UserInputKey["SingleQuote"] = 222] = "SingleQuote";
    })(BABYLON.UserInputKey || (BABYLON.UserInputKey = {}));
    var UserInputKey = BABYLON.UserInputKey;
    var UserInputOptions = (function () {
        function UserInputOptions() {
        }
        UserInputOptions.PointerAngularSensibility = 10.0;
        UserInputOptions.GamepadDeadStickValue = 0.25;
        UserInputOptions.GamepadLStickXInverted = false;
        UserInputOptions.GamepadLStickYInverted = false;
        UserInputOptions.GamepadRStickXInverted = false;
        UserInputOptions.GamepadRStickYInverted = false;
        UserInputOptions.GamepadAngularSensibility = 1.0;
        UserInputOptions.GamepadMovementSensibility = 1.0;
        return UserInputOptions;
    }());
    BABYLON.UserInputOptions = UserInputOptions;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.scenecomponents.js.map
