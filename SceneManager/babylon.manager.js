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
var BABYLON;
(function (BABYLON) {
    var SceneManager = (function () {
        function SceneManager(rootUrl, sceneFilename, scene) {
            var _this = this;
            // *********************************** //
            // * Babylon Scene Manager Component * //
            // *********************************** //
            this.onrender = null;
            this.controller = null;
            this._ie = false;
            this._url = "";
            this._filename = "";
            this._render = null;
            this._running = false;
            this._markup = "";
            this._gui = "None";
            this._input = false;
            this._scene = null;
            this._navmesh = null;
            this._navigation = null;
            if (scene == null)
                throw new Error("Null host scene obejct specified.");
            this._ie = document.all ? true : false;
            this._url = rootUrl;
            this._filename = sceneFilename;
            this._scene = scene;
            this._input = false;
            this._navmesh = null;
            this._navigation = null;
            // Reset scene manager engine instance
            BABYLON.SceneManager.engine = this._scene.getEngine();
            BABYLON.SceneManager.rightHanded = this._scene.useRightHandedSystem;
            // Parse, create and store component instances
            var ticklist = [];
            BABYLON.SceneManager.parseSceneCameras(this._scene.cameras, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneLights(this._scene.lights, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneMeshes(this._scene.meshes, this._scene, ticklist);
            // Parse and intialize scene raw metadata properties
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
                if (this._scene.metadata.properties.controllerPresent) {
                    var sceneController = this.findSceneController();
                    if (sceneController != null && sceneController instanceof BABYLON.SceneController) {
                        this.controller = sceneController;
                    }
                    else {
                        var msg2 = "Failed to locate valid BABYLON.SceneController metadata instance";
                        if (console)
                            console.warn(msg2);
                    }
                }
                // Parse scene html markup
                if (this._scene.metadata.properties.interfaceMode != null) {
                    this._gui = this._scene.metadata.properties.interfaceMode;
                    if (this._scene.metadata.properties.userInterface != null) {
                        var ui = this._scene.metadata.properties.userInterface;
                        if (window && ui.embedded && ui.base64 != null) {
                            this._markup = window.atob(ui.base64);
                            if (this._scene.metadata.properties.autoDraw === true && this._gui != null && this._gui !== "" && this._gui !== "None" && this._markup != null && this._markup !== "") {
                                this.drawSceneMarkup(this._markup);
                            }
                        }
                    }
                }
                // Parse scene navigation mesh
                if (this._scene.metadata.properties.hasNavigationMesh != null && this._scene.metadata.properties.hasNavigationMesh == true) {
                    this._navmesh = this._scene.getMeshByName("sceneNavigationMesh");
                    if (this._navmesh != null) {
                        var navigation = this.getNavigationTool();
                        var zoneNodes = navigation.buildNodes(this._navmesh);
                        if (zoneNodes != null) {
                            navigation.setZoneData(this.getNavigationZone(), zoneNodes);
                        }
                        else {
                            if (console)
                                console.warn("Failed to set scene navigation zone");
                        }
                    }
                    else {
                        if (console)
                            console.warn("Failed to load scene navigation mesh");
                    }
                }
                // Parse scene terrain heightmaps
                if (this._scene.metadata.properties.hasTerrainMeshes != null && this._scene.metadata.properties.hasTerrainMeshes == true) {
                    var terrains = this._scene.getMeshesByTags("[TERRAIN]");
                    if (terrains != null) {
                        terrains.forEach(function (terrain) {
                            terrain.isVisible = true;
                            terrain.visibility = 1;
                            terrain.checkCollisions = false;
                            if (terrain.metadata != null && terrain.metadata.properties != null) {
                                if (terrain.metadata.properties.heightmapBase64) {
                                    var tempBase64 = terrain.metadata.properties.heightmapBase64;
                                    var terrainWidth = terrain.metadata.properties.width;
                                    var terrainLength = terrain.metadata.properties.length;
                                    var terrainHeight = terrain.metadata.properties.height;
                                    var physicsState = terrain.metadata.properties.physicsState;
                                    var physicsMass = terrain.metadata.properties.physicsMass;
                                    var physicsFriction = terrain.metadata.properties.physicsFriction;
                                    var physicsRestitution = terrain.metadata.properties.physicsRestitution;
                                    var physicsImpostor = terrain.metadata.properties.physicsImpostor;
                                    var groundTessellation = terrain.metadata.properties.groundTessellation;
                                    BABYLON.SceneManager.createGroundTerrain((terrain.name + "_Ground"), tempBase64, {
                                        width: terrainWidth,
                                        height: terrainLength,
                                        minHeight: 0,
                                        maxHeight: terrainHeight,
                                        updatable: false,
                                        subdivisions: groundTessellation,
                                        onReady: function (mesh) {
                                            tempBase64 = null;
                                            mesh.isVisible = false;
                                            mesh.visibility = 0.75;
                                            mesh.checkCollisions = true;
                                            mesh.position = BABYLON.Vector3.Zero();
                                            mesh.rotation = terrain.rotation.clone();
                                            mesh.scaling = terrain.scaling.clone();
                                            mesh.parent = terrain;
                                            if (physicsState)
                                                mesh.setPhysicsState(physicsImpostor, { mass: physicsMass, friction: physicsFriction, restitution: physicsRestitution });
                                            terrain.metadata.properties.heightmapBase64 = 0; // Note: Clear Internal Heightmap Metadata
                                        }
                                    }, _this._scene);
                                }
                            }
                        });
                    }
                    else {
                        if (console)
                            console.warn("Failed to load scene terrain mesh(s)");
                    }
                }
            }
            // Register scene component ticklist
            if (ticklist.length > 0) {
                ticklist.sort(function (left, right) {
                    if (left.order < right.order)
                        return -1;
                    if (left.order > right.order)
                        return 1;
                    return 0;
                });
                ticklist.forEach(function (scriptComponent) {
                    scriptComponent.instance.register();
                });
            }
            // Scene component start, update and destroy proxies 
            var instance = this;
            this._render = function () {
                if (instance != null) {
                    if (instance._input) {
                        BABYLON.SceneManager.updateUserInputState();
                    }
                    if (instance._scene != null) {
                        instance._scene.render();
                    }
                    if (instance.onrender != null) {
                        instance.onrender();
                    }
                }
            };
            this._scene.onDispose = function () {
                if (instance != null) {
                    instance.dispose();
                }
            };
        }
        SceneManager.GetInstance = function (scene) {
            return (scene.manager) ? scene.manager : null;
        };
        SceneManager.CreateScene = function (name, engine) {
            var result = new BABYLON.Scene(engine);
            BABYLON.SceneManager.parseSceneMetadata("/", name, result);
            return result;
        };
        SceneManager.LoadScene = function (rootUrl, sceneFilename, engine, onsuccess, progressCallBack, onerror) {
            var onparse = function (scene) {
                BABYLON.SceneManager.parseSceneMetadata(rootUrl, sceneFilename, scene);
                if (onsuccess)
                    onsuccess(scene);
            };
            BABYLON.SceneLoader.Append(rootUrl, sceneFilename, new BABYLON.Scene(engine), onparse, progressCallBack, onerror);
        };
        SceneManager.ImportMesh = function (meshesNames, rootUrl, sceneFilename, scene, onsuccess, progressCallBack, onerror) {
            var onparse = function (meshes, particleSystems, skeletons) {
                BABYLON.SceneManager.parseMeshMetadata(meshes, scene);
                if (onsuccess)
                    onsuccess(meshes, particleSystems, skeletons);
            };
            BABYLON.SceneLoader.ImportMesh(meshesNames, rootUrl, sceneFilename, scene, onparse, progressCallBack, onerror);
        };
        SceneManager.RegisterLoader = function (handler) {
            BABYLON.SceneManager.loader = handler;
        };
        Object.defineProperty(SceneManager.prototype, "ie", {
            get: function () {
                return this._ie;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        SceneManager.prototype.dispose = function () {
            this.disableUserInput();
            this._gui = null;
            this._render = null;
            this._markup = null;
            this._navmesh = null;
            this._navigation = null;
            this.onrender = null;
            this.controller = null;
            var scenex = this._scene;
            if (scenex.manager)
                scenex.manager = null;
            scenex = null;
            this._scene = null;
        };
        SceneManager.prototype.isRunning = function () {
            return this._running;
        };
        SceneManager.prototype.loadLevel = function (name, path) {
            if (path === void 0) { path = null; }
            if (BABYLON.SceneManager.loader != null) {
                var folder = (path != null && path !== "") ? path : this.getScenePath();
                this.stop();
                this.clearSceneMarkup();
                this._scene.dispose();
                BABYLON.SceneManager.loader(folder, name);
            }
            else {
                throw new Error("No scene loader function registered.");
            }
        };
        SceneManager.prototype.toggleDebug = function () {
            if (this._scene.debugLayer.isVisible()) {
                this._scene.debugLayer.hide();
            }
            else {
                this._scene.debugLayer.show();
            }
        };
        SceneManager.prototype.getSceneName = function () {
            return this._filename;
        };
        SceneManager.prototype.getScenePath = function () {
            var result = "/";
            if (this.url != null && this.url !== "") {
                result = this.url;
            }
            else {
                if (this._scene.database != null && this._scene.database.currentSceneUrl != null) {
                    var xurl = this._scene.database.currentSceneUrl;
                    result = xurl.substr(0, xurl.lastIndexOf("/")) + "/";
                }
            }
            return result;
        };
        SceneManager.prototype.getObjectMetadata = function (owner) {
            var result = null;
            if (owner.metadata != null && owner.metadata.api) {
                var metadata = owner.metadata;
                result = new BABYLON.ObjectMetadata(metadata);
            }
            return result;
        };
        SceneManager.prototype.showFullscreen = function () {
            BABYLON.Tools.RequestFullscreen(document.documentElement);
            document.documentElement.focus();
        };
        // ********************************** //
        // *  Scene Manager Helper Support  * //
        // ********************************** //
        SceneManager.prototype.start = function () {
            this._running = true;
            this._scene.getEngine().runRenderLoop(this._render);
        };
        SceneManager.prototype.stop = function () {
            this._running = false;
            this._scene.getEngine().stopRenderLoop(this._render);
        };
        SceneManager.prototype.toggle = function () {
            if (!this._running) {
                this.resumeAudio();
                this.start();
            }
            else {
                this.pauseAudio();
                this.stop();
            }
        };
        SceneManager.prototype.stepFrame = function () {
            if (!this._running) {
                this._render();
            }
            else {
                this.toggle();
            }
        };
        SceneManager.prototype.pauseAudio = function () {
            if (this._scene.audioEnabled === true) {
                this._scene.audioEnabled = false;
            }
        };
        SceneManager.prototype.resumeAudio = function () {
            if (this._scene.audioEnabled === false) {
                this._scene.audioEnabled = true;
            }
        };
        // ********************************* //
        // *  Scene Markup Helper Support  * //
        // ********************************* //
        SceneManager.prototype.getGuiMode = function () {
            return this._gui;
        };
        SceneManager.prototype.getSceneMarkup = function () {
            return this._markup;
        };
        SceneManager.prototype.drawSceneMarkup = function (markup) {
            if (this._gui === "Html") {
                var element = document.getElementById("gui");
                if (element == null) {
                    var gui = document.createElement("div");
                    gui.id = "gui";
                    gui.style.width = "100%";
                    gui.style.height = "100%";
                    gui.style.opacity = "1";
                    gui.style.zIndex = "10";
                    gui.style.outline = "none";
                    gui.style.backgroundColor = "transparent";
                    document.body.appendChild(gui);
                    gui.innerHTML = markup;
                }
                else {
                    element.innerHTML = markup;
                }
            }
            else {
                var msg2 = "Scene controller gui disabled.";
                if (console)
                    console.warn(msg2);
            }
        };
        SceneManager.prototype.clearSceneMarkup = function () {
            if (this._gui === "Html") {
                var element = document.getElementById("gui");
                if (element != null) {
                    element.innerHTML = "";
                }
            }
            else {
                var msg2 = "Scene controller gui disabled.";
                if (console)
                    console.warn(msg2);
            }
        };
        // ************************************* //
        // *   Scene Component Helper Support  * //
        // ************************************* //
        SceneManager.prototype.addSceneComponent = function (owner, klass, enableUpdate, propertyBag) {
            if (enableUpdate === void 0) { enableUpdate = true; }
            if (propertyBag === void 0) { propertyBag = {}; }
            var result = null;
            if (owner == null)
                throw new Error("Null owner scene obejct specified.");
            if (klass == null || klass === "")
                throw new Error("Null scene obejct klass specified.");
            if (owner.metadata == null || !owner.metadata.api) {
                var metadata = {
                    api: true,
                    type: "Babylon",
                    objectName: "Scene Component",
                    objectId: "0",
                    tagName: "Untagged",
                    layerIndex: 0,
                    layerName: "Default",
                    areaIndex: -1,
                    navAgent: null,
                    meshLink: null,
                    meshObstacle: null,
                    components: [],
                    properties: {}
                };
                owner.metadata = metadata;
            }
            var ownercomps = null;
            if (owner.metadata != null && owner.metadata.api) {
                if (owner.metadata.disposal == null || owner.metadata.disposal === false) {
                    owner.onDispose = function () { BABYLON.SceneManager.destroySceneComponents(owner); };
                    owner.metadata.disposal = true;
                }
                var metadata = owner.metadata;
                if (metadata.components != null) {
                    ownercomps = metadata.components;
                }
                else {
                    ownercomps = [];
                }
                if (ownercomps != null) {
                    var SceneComponentClass = BABYLON.SceneManager.createComponentClass(klass);
                    if (SceneComponentClass != null) {
                        result = new SceneComponentClass(owner, this._scene, enableUpdate, propertyBag);
                        if (result != null) {
                            var compscript = {
                                order: 1000,
                                name: "BabylonScriptComponent",
                                klass: klass,
                                update: enableUpdate,
                                controller: false,
                                properties: propertyBag,
                                instance: result,
                                tag: {}
                            };
                            ownercomps.push(compscript);
                            result.register();
                        }
                        else {
                            if (console)
                                console.error("Failed to create component instance");
                        }
                    }
                    else {
                        if (console)
                            console.error("Failed to create component class");
                    }
                }
                else {
                    if (console)
                        console.error("Failed to parse metadata components");
                }
            }
            else {
                if (console)
                    console.error("Null owner object metadata");
            }
            return result;
        };
        SceneManager.prototype.findSceneComponent = function (klass, owner) {
            var result = null;
            if (owner.metadata != null && owner.metadata.api) {
                var metadata = owner.metadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    for (var ii = 0; ii < metadata.components.length; ii++) {
                        var ownerscript = metadata.components[ii];
                        if (ownerscript.instance != null && ownerscript.klass === klass) {
                            result = ownerscript.instance;
                            break;
                        }
                    }
                }
            }
            return result;
        };
        SceneManager.prototype.findSceneComponents = function (klass, owner) {
            var result = [];
            if (owner.metadata != null && owner.metadata.api) {
                var metadata = owner.metadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    for (var ii = 0; ii < metadata.components.length; ii++) {
                        var ownerscript = metadata.components[ii];
                        if (ownerscript.instance != null && ownerscript.klass === klass) {
                            result.push(ownerscript.instance);
                        }
                    }
                }
            }
            return result;
        };
        SceneManager.prototype.findSceneController = function () {
            var meshes = this._scene.meshes;
            var result = null;
            if (meshes != null && meshes.length > 0) {
                for (var ii = 0; ii < meshes.length; ii++) {
                    var mesh = meshes[ii];
                    if (mesh.metadata != null && mesh.metadata.api) {
                        var metadata = mesh.metadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            for (var iii = 0; iii < metadata.components.length; iii++) {
                                var meshscript = metadata.components[iii];
                                if (meshscript.instance != null && meshscript.controller === true) {
                                    result = meshscript.instance;
                                    break;
                                }
                            }
                        }
                    }
                    if (result != null)
                        break;
                }
            }
            return result;
        };
        SceneManager.prototype.createSceneController = function (klass) {
            if (this.controller == null) {
                this.controller = this.addSceneComponent(new BABYLON.Mesh("SceneController", this._scene), klass);
                if (this.controller != null) {
                    this.controller.ready();
                }
            }
            else {
                throw new Error("Scene controller already exists.");
            }
            return this.controller;
        };
        // ********************************* //
        // *   Scene Input State Support   * //
        // ********************************* //
        SceneManager.prototype.resetUserInput = function () {
            BABYLON.SceneManager.keymap = {};
            BABYLON.SceneManager.clientx = 0;
            BABYLON.SceneManager.clienty = 0;
            BABYLON.SceneManager.mousex = 0;
            BABYLON.SceneManager.mousey = 0;
            BABYLON.SceneManager.vertical = 0;
            BABYLON.SceneManager.horizontal = 0;
            BABYLON.SceneManager.x_mousex = 0;
            BABYLON.SceneManager.x_mousey = 0;
            BABYLON.SceneManager.x_vertical = 0;
            BABYLON.SceneManager.x_horizontal = 0;
            BABYLON.SceneManager.k_mousex = 0;
            BABYLON.SceneManager.k_mousey = 0;
            BABYLON.SceneManager.k_vertical = 0;
            BABYLON.SceneManager.k_horizontal = 0;
            BABYLON.SceneManager.j_mousex = 0;
            BABYLON.SceneManager.j_mousey = 0;
            BABYLON.SceneManager.j_vertical = 0;
            BABYLON.SceneManager.j_horizontal = 0;
            BABYLON.SceneManager.g_mousex = 0;
            BABYLON.SceneManager.g_mousey = 0;
            BABYLON.SceneManager.g_vertical = 0;
            BABYLON.SceneManager.g_horizontal = 0;
            BABYLON.SceneManager.preventDefault = false;
            BABYLON.SceneManager.gamepadButtonUp = [];
            BABYLON.SceneManager.gamepadButtonDown = [];
            BABYLON.SceneManager.gamepadButtonPress = [];
            BABYLON.SceneManager.gamepadDpadUp = [];
            BABYLON.SceneManager.gamepadDpadDown = [];
            BABYLON.SceneManager.gamepadDpadPress = [];
            BABYLON.SceneManager.gamepadLeftTrigger = [];
            BABYLON.SceneManager.gamepadRightTrigger = [];
            BABYLON.SceneManager.mouseButtonUp = [];
            BABYLON.SceneManager.mouseButtonDown = [];
            BABYLON.SceneManager.mouseButtonPress = [];
            BABYLON.SceneManager.keyButtonUp = [];
            BABYLON.SceneManager.keyButtonDown = [];
            BABYLON.SceneManager.keyButtonPress = [];
        };
        SceneManager.prototype.enableUserInput = function (preventDefault, useCapture, gamepadConnected) {
            if (preventDefault === void 0) { preventDefault = false; }
            if (useCapture === void 0) { useCapture = false; }
            if (gamepadConnected === void 0) { gamepadConnected = null; }
            if (!this._input) {
                this.resetUserInput();
                document.documentElement.tabIndex = 1;
                document.documentElement.addEventListener("keyup", BABYLON.SceneManager.inputKeyUpHandler, useCapture);
                document.documentElement.addEventListener("keydown", BABYLON.SceneManager.inputKeyDownHandler, useCapture);
                document.documentElement.addEventListener("pointerup", BABYLON.SceneManager.inputPointerUpHandler, useCapture);
                //document.documentElement.addEventListener("pointerout", BABYLON.SceneManager.inputPointerUpHandler, useCapture); - ???
                document.documentElement.addEventListener("pointerdown", BABYLON.SceneManager.inputPointerDownHandler, useCapture);
                document.documentElement.addEventListener("pointermove", BABYLON.SceneManager.inputPointerMoveHandler, useCapture);
                BABYLON.SceneManager.preventDefault = preventDefault;
                if (BABYLON.SceneManager.gamepads == null) {
                    BABYLON.SceneManager.gamepadConnected = gamepadConnected;
                    BABYLON.SceneManager.gamepads = new BABYLON.Gamepads(function (pad) { BABYLON.SceneManager.inputGamepadConnected(pad); });
                }
                if (BABYLON.SceneManager.leftJoystick == null) {
                }
                if (BABYLON.SceneManager.rightJoystick == null) {
                }
                this._input = true;
                document.documentElement.focus();
            }
        };
        SceneManager.prototype.disableUserInput = function (useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (this._input) {
                document.documentElement.removeEventListener("keyup", BABYLON.SceneManager.inputKeyUpHandler, useCapture);
                document.documentElement.removeEventListener("keydown", BABYLON.SceneManager.inputKeyDownHandler, useCapture);
                document.documentElement.removeEventListener("pointerup", BABYLON.SceneManager.inputPointerUpHandler, useCapture);
                //document.documentElement.removeEventListener("pointerout", BABYLON.SceneManager.inputPointerUpHandler, useCapture); - ???
                document.documentElement.removeEventListener("pointerdown", BABYLON.SceneManager.inputPointerDownHandler, useCapture);
                document.documentElement.removeEventListener("pointermove", BABYLON.SceneManager.inputPointerMoveHandler, useCapture);
                BABYLON.SceneManager.preventDefault = false;
                this.resetUserInput();
                this._input = false;
            }
        };
        SceneManager.prototype.getUserInput = function (input) {
            var result = 0;
            if (this._input) {
                switch (input) {
                    case BABYLON.UserInputAxis.Vertical:
                    case BABYLON.UserInputAxis.Horizontal:
                        result = (input === BABYLON.UserInputAxis.Horizontal) ? BABYLON.SceneManager.horizontal : BABYLON.SceneManager.vertical;
                        break;
                    case BABYLON.UserInputAxis.MouseX:
                    case BABYLON.UserInputAxis.MouseY:
                        result = (input === BABYLON.UserInputAxis.MouseX) ? BABYLON.SceneManager.mousex : BABYLON.SceneManager.mousey;
                        break;
                    case BABYLON.UserInputAxis.ClientX:
                    case BABYLON.UserInputAxis.ClientY:
                        result = (input === BABYLON.UserInputAxis.ClientX) ? BABYLON.SceneManager.clientx : BABYLON.SceneManager.clienty;
                        break;
                }
            }
            return result;
        };
        // ********************************* //
        // *  Scene Keycode State Support  * //
        // ********************************* //
        SceneManager.prototype.onKeyUp = function (callback) {
            if (this._input)
                BABYLON.SceneManager.keyButtonUp.push(callback);
        };
        SceneManager.prototype.onKeyDown = function (callback) {
            if (this._input)
                BABYLON.SceneManager.keyButtonDown.push(callback);
        };
        SceneManager.prototype.onKeyPress = function (keycode, callback) {
            if (this._input)
                BABYLON.SceneManager.keyButtonPress.push({ index: keycode, action: callback });
        };
        SceneManager.prototype.getKeyInput = function (keycode) {
            var result = false;
            if (this._input) {
                var key = "k" + keycode.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        };
        // ********************************* //
        // *   Scene Mouse State Support   * //
        // ********************************* //
        SceneManager.prototype.onPointerUp = function (callback) {
            if (this._input)
                BABYLON.SceneManager.mouseButtonUp.push(callback);
        };
        SceneManager.prototype.onPointerDown = function (callback) {
            if (this._input)
                BABYLON.SceneManager.mouseButtonDown.push(callback);
        };
        SceneManager.prototype.onPointerPress = function (button, callback) {
            if (this._input)
                BABYLON.SceneManager.mouseButtonPress.push({ index: button, action: callback });
        };
        SceneManager.prototype.getPointerInput = function (button) {
            var result = false;
            if (this._input) {
                var key = "p" + button.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        };
        // ********************************* //
        // *  Scene Gamepad State Support  * //
        // ********************************* //
        SceneManager.prototype.onButtonUp = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadButtonUp.push(callback);
        };
        SceneManager.prototype.onButtonDown = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadButtonDown.push(callback);
        };
        SceneManager.prototype.onButtonPress = function (button, callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadButtonPress.push({ index: button, action: callback });
        };
        SceneManager.prototype.getButtonInput = function (button) {
            var result = false;
            if (this._input) {
                var key = "b" + button.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        };
        SceneManager.prototype.onDpadUp = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadDpadUp.push(callback);
        };
        SceneManager.prototype.onDpadDown = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadDpadDown.push(callback);
        };
        SceneManager.prototype.onDpadPress = function (direction, callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadDpadPress.push({ index: direction, action: callback });
        };
        SceneManager.prototype.getDpadInput = function (direction) {
            var result = false;
            if (this._input) {
                var key = "d" + direction.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        };
        SceneManager.prototype.onTriggerLeft = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadLeftTrigger.push(callback);
        };
        SceneManager.prototype.onTriggerRight = function (callback) {
            if (this._input)
                BABYLON.SceneManager.gamepadRightTrigger.push(callback);
        };
        SceneManager.prototype.getTriggerInput = function (trigger) {
            var result = 0;
            if (this._input) {
                var key = "t" + trigger.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        };
        SceneManager.prototype.getConnectedGamepad = function () {
            return (this._input) ? BABYLON.SceneManager.gamepad : null;
        };
        SceneManager.prototype.getConnectedGamepadType = function () {
            return (this._input) ? BABYLON.SceneManager.gamepadType : BABYLON.GamepadType.None;
        };
        SceneManager.prototype.disposeConnectedGamepad = function () {
            if (this._input) {
                if (BABYLON.SceneManager.gamepads != null) {
                    BABYLON.SceneManager.gamepads.dispose();
                    BABYLON.SceneManager.gamepads = null;
                }
                BABYLON.SceneManager.gamepad = null;
                BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.None;
                BABYLON.SceneManager.gamepadConnected = null;
            }
        };
        // ********************************** //
        // *  Scene Joystick State Support  * //
        // ********************************** //
        SceneManager.prototype.getLeftVirtualJoystick = function () {
            return (this._input) ? BABYLON.SceneManager.leftJoystick : null;
        };
        SceneManager.prototype.getRightVirtualJoystick = function () {
            return (this._input) ? BABYLON.SceneManager.rightJoystick : null;
        };
        SceneManager.prototype.disposeVirtualJoysticks = function () {
            if (this._input) {
                if (BABYLON.SceneManager.leftJoystick != null) {
                    BABYLON.SceneManager.leftJoystick.releaseCanvas();
                    BABYLON.SceneManager.leftJoystick = null;
                }
                if (BABYLON.SceneManager.rightJoystick != null) {
                    BABYLON.SceneManager.rightJoystick.releaseCanvas();
                    BABYLON.SceneManager.rightJoystick = null;
                }
            }
        };
        // ************************************ //
        // *   Update Camera Helper Support   * //
        // ************************************ //
        SceneManager.prototype.updateCameraPosition = function (camera, horizontal, vertical, speed) {
            if (camera != null) {
                var local = camera._computeLocalCameraSpeed() * speed;
                var cameraTransform = BABYLON.Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, 0);
                var deltaTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(horizontal * local, 0, -vertical * local), cameraTransform);
                camera.cameraDirection = camera.cameraDirection.add(deltaTransform);
            }
        };
        SceneManager.prototype.updateCameraRotation = function (camera, mousex, mousey, speed) {
            if (camera != null) {
                camera.cameraRotation = camera.cameraRotation.add(new BABYLON.Vector2(mousey * speed, mousex * speed));
            }
        };
        SceneManager.prototype.updateCameraUserInput = function (camera, movementSpeed, rotationSpeed) {
            if (camera != null) {
                var horizontal = this.getUserInput(BABYLON.UserInputAxis.Horizontal);
                var vertical = this.getUserInput(BABYLON.UserInputAxis.Vertical);
                var mousex = this.getUserInput(BABYLON.UserInputAxis.MouseX);
                var mousey = this.getUserInput(BABYLON.UserInputAxis.MouseY);
                this.updateCameraPosition(camera, horizontal, -vertical, movementSpeed);
                this.updateCameraRotation(camera, mousex, mousey, rotationSpeed);
            }
        };
        // *********************************** //
        // *  Scene Navigation Mesh Support  * //
        // *********************************** //
        SceneManager.prototype.hasNavigationMesh = function () {
            return (this._navmesh != null);
        };
        SceneManager.prototype.setNavigationMesh = function (mesh) {
            this._navmesh = mesh;
        };
        SceneManager.prototype.getNavigationMesh = function () {
            return this._navmesh;
        };
        SceneManager.prototype.getNavigationTool = function () {
            // Babylon Navigation Mesh Tool
            // https://github.com/wanadev/babylon-navigation-mesh
            if (this._navigation == null) {
                this._navigation = new Navigation();
            }
            return this._navigation;
        };
        SceneManager.prototype.getNavigationZone = function () {
            return "scene";
        };
        SceneManager.prototype.getNavigationPath = function (agent, destination) {
            if (this._navigation == null || this._navmesh == null)
                return null;
            var zone = this.getNavigationZone();
            var group = this._navigation.getGroup(zone, agent.position);
            return this._navigation.findPath(agent.position, destination, zone, group);
        };
        SceneManager.prototype.setNavigationPath = function (agent, path, speed, loop, callback) {
            if (path && path.length > 1) {
                var length = 0;
                var direction = [{
                        frame: 0,
                        value: agent.position
                    }];
                for (var i = 0; i < path.length; i++) {
                    length += BABYLON.Vector3.Distance(direction[i].value, path[i]);
                    direction.push({
                        frame: length,
                        value: path[i]
                    });
                }
                var move = new BABYLON.Animation("Move", "position", 3, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                move.setKeys(direction);
                agent.animations.push(move);
                this._scene.beginAnimation(agent, 0, length, loop, speed, callback);
            }
        };
        SceneManager.prototype.getNavigationAgent = function (agent) {
            return new BABYLON.NavigationAgent(agent);
        };
        SceneManager.prototype.getNavigationAgents = function () {
            return this._scene.getMeshesByTags("[NAVAGENT]");
        };
        SceneManager.prototype.getNavigationAreaTable = function () {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.table != null) ? this._navmesh.metadata.properties.table : [];
        };
        SceneManager.prototype.getNavigationAreaIndexes = function () {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.areas != null) ? this._navmesh.metadata.properties.areas : [];
        };
        SceneManager.prototype.getNavigationAreaName = function (index) {
            var result = "";
            if (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.table != null) {
                var areaTable = this._navmesh.metadata.properties.table;
                if (areaTable != null) {
                    for (var ii = 0; ii < areaTable.length; ii++) {
                        if (areaTable[ii].index === index) {
                            result = areaTable[ii].area;
                            break;
                        }
                    }
                }
            }
            return result;
        };
        SceneManager.prototype.getNavigationAreaCost = function (index) {
            var result = -1;
            if (this._navmesh.metadata != null && this._navmesh.metadata.properties != null) {
                var areaTable = this._navmesh.metadata.properties.table;
                if (areaTable != null) {
                    for (var ii = 0; ii < areaTable.length; ii++) {
                        if (areaTable[ii].index === index) {
                            result = areaTable[ii].cost;
                            break;
                        }
                    }
                }
            }
            return result;
        };
        // ********************************** //
        // *  Private Input Helper Support  * //
        // ********************************** //
        SceneManager.inputKeyDownHandler = function (e) {
            var key = "k" + e.keyCode.toString();
            var pressed = false;
            if (BABYLON.SceneManager.keymap[key] != null) {
                pressed = BABYLON.SceneManager.keymap[key];
            }
            BABYLON.SceneManager.keymap[key] = true;
            switch (e.keyCode) {
                case 39: // Right
                case 68:
                    BABYLON.SceneManager.k_horizontal = 1;
                    break;
                case 37: // Left
                case 65:
                    BABYLON.SceneManager.k_horizontal = -1;
                    break;
                case 38: // Forward
                case 87:
                    BABYLON.SceneManager.k_vertical = 1;
                    break;
                case 40: // Back
                case 83:
                    BABYLON.SceneManager.k_vertical = -1;
                    break;
            }
            if (BABYLON.SceneManager.keyButtonDown != null && BABYLON.SceneManager.keyButtonDown.length > 0) {
                BABYLON.SceneManager.keyButtonDown.forEach(function (callback) {
                    callback(e.keyCode);
                });
            }
            if (!pressed) {
                if (BABYLON.SceneManager.keyButtonPress != null && BABYLON.SceneManager.keyButtonPress.length > 0) {
                    BABYLON.SceneManager.keyButtonPress.forEach(function (press) {
                        if (press.index === e.keyCode) {
                            press.action();
                        }
                    });
                }
            }
            if (BABYLON.SceneManager.preventDefault)
                e.preventDefault();
            return true;
        };
        SceneManager.inputKeyUpHandler = function (e) {
            var key = "k" + e.keyCode.toString();
            BABYLON.SceneManager.keymap[key] = false;
            switch (e.keyCode) {
                case 39: // Right
                case 37: // Left
                case 68: // D-Key
                case 65:
                    BABYLON.SceneManager.k_horizontal = 0;
                    break;
                case 38: // Forward
                case 40: // Back
                case 87: // W-Key
                case 83:
                    BABYLON.SceneManager.k_vertical = 0;
                    break;
            }
            if (BABYLON.SceneManager.keyButtonUp != null && BABYLON.SceneManager.keyButtonUp.length > 0) {
                BABYLON.SceneManager.keyButtonUp.forEach(function (callback) {
                    callback(e.keyCode);
                });
            }
            if (BABYLON.SceneManager.preventDefault)
                e.preventDefault();
            return true;
        };
        SceneManager.inputPointerDownHandler = function (e) {
            if (e.button === 0) {
                BABYLON.SceneManager.previousPosition = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
            var key = "p" + e.button.toString();
            var pressed = false;
            if (BABYLON.SceneManager.keymap[key] != null) {
                pressed = BABYLON.SceneManager.keymap[key];
            }
            BABYLON.SceneManager.keymap[key] = true;
            if (BABYLON.SceneManager.mouseButtonDown != null && BABYLON.SceneManager.mouseButtonDown.length > 0) {
                BABYLON.SceneManager.mouseButtonDown.forEach(function (callback) {
                    callback(e.button);
                });
            }
            if (!pressed) {
                if (BABYLON.SceneManager.mouseButtonPress != null && BABYLON.SceneManager.mouseButtonPress.length > 0) {
                    BABYLON.SceneManager.mouseButtonPress.forEach(function (press) {
                        if (press.index === e.button) {
                            press.action();
                        }
                    });
                }
            }
            if (BABYLON.SceneManager.preventDefault)
                e.preventDefault();
            return true;
        };
        SceneManager.inputPointerUpHandler = function (e) {
            if (e.button === 0) {
                BABYLON.SceneManager.previousPosition = null;
                BABYLON.SceneManager.k_mousex = 0;
                BABYLON.SceneManager.k_mousey = 0;
            }
            var key = "p" + e.button.toString();
            BABYLON.SceneManager.keymap[key] = false;
            if (BABYLON.SceneManager.mouseButtonUp != null && BABYLON.SceneManager.mouseButtonUp.length > 0) {
                BABYLON.SceneManager.mouseButtonUp.forEach(function (callback) {
                    callback(e.button);
                });
            }
            if (BABYLON.SceneManager.preventDefault)
                e.preventDefault();
            return true;
        };
        SceneManager.inputPointerMoveHandler = function (e) {
            if (e.button === 0 && BABYLON.SceneManager.previousPosition != null) {
                BABYLON.SceneManager.clientx = e.clientX;
                BABYLON.SceneManager.clienty = e.clientY;
                var offsetX = e.clientX - BABYLON.SceneManager.previousPosition.x;
                var offsetY = e.clientY - BABYLON.SceneManager.previousPosition.y;
                BABYLON.SceneManager.previousPosition = {
                    x: e.clientX,
                    y: e.clientY
                };
                var mousex = offsetX / BABYLON.UserInputOptions.PointerAngularSensibility;
                var mousey = offsetY / BABYLON.UserInputOptions.PointerAngularSensibility;
                if (mousex != 0) {
                    BABYLON.SceneManager.k_mousex = mousex;
                }
                if (mousey != 0) {
                    if (BABYLON.SceneManager.rightHanded) {
                        BABYLON.SceneManager.k_mousey = -mousey;
                    }
                    else {
                        BABYLON.SceneManager.k_mousey = mousey;
                    }
                }
            }
            if (BABYLON.SceneManager.preventDefault)
                e.preventDefault();
            return true;
        };
        SceneManager.inputButtonDownHandler = function (button) {
            if (BABYLON.SceneManager.gamepad != null) {
                var key = "b" + button.toString();
                var pressed = false;
                if (BABYLON.SceneManager.keymap[key] != null) {
                    pressed = BABYLON.SceneManager.keymap[key];
                }
                BABYLON.SceneManager.keymap[key] = true;
                if (BABYLON.SceneManager.gamepadButtonDown != null && BABYLON.SceneManager.gamepadButtonDown.length > 0) {
                    BABYLON.SceneManager.gamepadButtonDown.forEach(function (callback) {
                        callback(button);
                    });
                }
                if (!pressed) {
                    if (BABYLON.SceneManager.gamepadButtonPress != null && BABYLON.SceneManager.gamepadButtonPress.length > 0) {
                        BABYLON.SceneManager.gamepadButtonPress.forEach(function (press) {
                            if (press.index === button) {
                                press.action();
                            }
                        });
                    }
                }
            }
        };
        SceneManager.inputButtonUpHandler = function (button) {
            if (BABYLON.SceneManager.gamepad != null) {
                var key = "b" + button.toString();
                BABYLON.SceneManager.keymap[key] = false;
                if (BABYLON.SceneManager.gamepadButtonUp != null && BABYLON.SceneManager.gamepadButtonUp.length > 0) {
                    BABYLON.SceneManager.gamepadButtonUp.forEach(function (callback) {
                        callback(button);
                    });
                }
            }
        };
        SceneManager.inputXboxDPadDownHandler = function (dPadPressed) {
            if (BABYLON.SceneManager.gamepad != null) {
                var key = "d" + dPadPressed.toString();
                var pressed = false;
                if (BABYLON.SceneManager.keymap[key] != null) {
                    pressed = BABYLON.SceneManager.keymap[key];
                }
                BABYLON.SceneManager.keymap[key] = true;
                if (BABYLON.SceneManager.gamepadDpadDown != null && BABYLON.SceneManager.gamepadDpadDown.length > 0) {
                    BABYLON.SceneManager.gamepadDpadDown.forEach(function (callback) {
                        callback(dPadPressed);
                    });
                }
                if (!pressed) {
                    if (BABYLON.SceneManager.gamepadDpadPress != null && BABYLON.SceneManager.gamepadDpadPress.length > 0) {
                        BABYLON.SceneManager.gamepadDpadPress.forEach(function (press) {
                            if (press.index === dPadPressed) {
                                press.action();
                            }
                        });
                    }
                }
            }
        };
        SceneManager.inputXboxDPadUpHandler = function (dPadReleased) {
            if (BABYLON.SceneManager.gamepad != null) {
                var key = "d" + dPadReleased.toString();
                BABYLON.SceneManager.keymap[key] = false;
                if (BABYLON.SceneManager.gamepadDpadUp != null && BABYLON.SceneManager.gamepadDpadUp.length > 0) {
                    BABYLON.SceneManager.gamepadDpadUp.forEach(function (callback) {
                        callback(dPadReleased);
                    });
                }
            }
        };
        SceneManager.inputXboxLeftTriggerHandler = function (value) {
            if (BABYLON.SceneManager.gamepad != null) {
                BABYLON.SceneManager.keymap["t0"] = value;
                if (BABYLON.SceneManager.gamepadLeftTrigger != null && BABYLON.SceneManager.gamepadLeftTrigger.length > 0) {
                    BABYLON.SceneManager.gamepadLeftTrigger.forEach(function (callback) {
                        callback(value);
                    });
                }
            }
        };
        SceneManager.inputXboxRightTriggerHandler = function (value) {
            if (BABYLON.SceneManager.gamepad != null) {
                BABYLON.SceneManager.keymap["t1"] = value;
                if (BABYLON.SceneManager.gamepadRightTrigger != null && BABYLON.SceneManager.gamepadRightTrigger.length > 0) {
                    BABYLON.SceneManager.gamepadRightTrigger.forEach(function (callback) {
                        callback(value);
                    });
                }
            }
        };
        SceneManager.inputLeftStickHandler = function (values) {
            if (BABYLON.SceneManager.gamepad != null) {
                var LSValues = values;
                var normalizedLX = LSValues.x / BABYLON.UserInputOptions.GamepadMovementSensibility;
                var normalizedLY = LSValues.y / BABYLON.UserInputOptions.GamepadMovementSensibility;
                LSValues.x = Math.abs(normalizedLX) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLX : 0;
                LSValues.y = Math.abs(normalizedLY) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLY : 0;
                BABYLON.SceneManager.g_horizontal = (BABYLON.UserInputOptions.GamepadLStickXInverted) ? -LSValues.x : LSValues.x;
                BABYLON.SceneManager.g_vertical = (BABYLON.UserInputOptions.GamepadLStickYInverted) ? LSValues.y : -LSValues.y;
            }
        };
        SceneManager.inputRightStickHandler = function (values) {
            if (BABYLON.SceneManager.gamepad != null) {
                var RSValues = values;
                var normalizedRX = RSValues.x / BABYLON.UserInputOptions.GamepadAngularSensibility;
                var normalizedRY = RSValues.y / BABYLON.UserInputOptions.GamepadAngularSensibility;
                RSValues.x = Math.abs(normalizedRX) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRX : 0;
                RSValues.y = Math.abs(normalizedRY) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRY : 0;
                BABYLON.SceneManager.g_mousex = (BABYLON.UserInputOptions.GamepadRStickXInverted) ? -RSValues.x : RSValues.x;
                BABYLON.SceneManager.g_mousey = (BABYLON.UserInputOptions.GamepadRStickYInverted) ? -RSValues.y : RSValues.y;
            }
        };
        SceneManager.inputGamepadConnected = function (pad) {
            if (pad.index === 0) {
                BABYLON.SceneManager.gamepad = pad;
                console.log("[Scene Manager] - Gamepad Connected: " + BABYLON.SceneManager.gamepad.id);
                if (BABYLON.SceneManager.gamepad.id.search("Xbox 360") !== -1 || BABYLON.SceneManager.gamepad.id.search("Xbox One") !== -1 || BABYLON.SceneManager.gamepad.id.search("xinput") !== -1) {
                    BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.Xbox360;
                    var xbox360Pad = BABYLON.SceneManager.gamepad;
                    xbox360Pad.onbuttonup(BABYLON.SceneManager.inputButtonUpHandler);
                    xbox360Pad.onbuttondown(BABYLON.SceneManager.inputButtonDownHandler);
                    xbox360Pad.onleftstickchanged(BABYLON.SceneManager.inputLeftStickHandler);
                    xbox360Pad.onrightstickchanged(BABYLON.SceneManager.inputRightStickHandler);
                    xbox360Pad.ondpadup(BABYLON.SceneManager.inputXboxDPadUpHandler);
                    xbox360Pad.ondpaddown(BABYLON.SceneManager.inputXboxDPadDownHandler);
                    xbox360Pad.onlefttriggerchanged(BABYLON.SceneManager.inputXboxLeftTriggerHandler);
                    xbox360Pad.onrighttriggerchanged(BABYLON.SceneManager.inputXboxRightTriggerHandler);
                }
                else {
                    BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.Generic;
                    var genericPad = BABYLON.SceneManager.gamepad;
                    genericPad.onbuttonup(BABYLON.SceneManager.inputButtonUpHandler);
                    genericPad.onbuttondown(BABYLON.SceneManager.inputButtonDownHandler);
                    genericPad.onleftstickchanged(BABYLON.SceneManager.inputLeftStickHandler);
                    genericPad.onrightstickchanged(BABYLON.SceneManager.inputRightStickHandler);
                }
                if (BABYLON.SceneManager.gamepadConnected != null) {
                    BABYLON.SceneManager.gamepadConnected(BABYLON.SceneManager.gamepad, BABYLON.SceneManager.gamepadType);
                }
            }
        };
        // ************************************** //
        // *  Private User Input State Support  * //
        // ************************************** //
        SceneManager.updateUserInputState = function () {
            // Reset global user input state  buffers
            BABYLON.SceneManager.x_horizontal = 0;
            BABYLON.SceneManager.x_vertical = 0;
            BABYLON.SceneManager.x_mousex = 0;
            BABYLON.SceneManager.x_mousey = 0;
            // Update user input state by order of precedence
            if (BABYLON.SceneManager.k_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.k_horizontal;
            }
            else if (BABYLON.SceneManager.j_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.j_horizontal;
            }
            else if (BABYLON.SceneManager.g_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.g_horizontal;
            }
            if (BABYLON.SceneManager.k_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.k_vertical;
            }
            else if (BABYLON.SceneManager.j_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.j_vertical;
            }
            else if (BABYLON.SceneManager.g_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.g_vertical;
            }
            if (BABYLON.SceneManager.k_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.k_mousex;
            }
            else if (BABYLON.SceneManager.j_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.j_mousex;
            }
            else if (BABYLON.SceneManager.g_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.g_mousex;
            }
            if (BABYLON.SceneManager.k_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.k_mousey;
            }
            else if (BABYLON.SceneManager.j_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.j_mousey;
            }
            else if (BABYLON.SceneManager.g_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.g_mousey;
            }
            // Update global user input state buffers
            BABYLON.SceneManager.horizontal = BABYLON.SceneManager.x_horizontal;
            BABYLON.SceneManager.vertical = BABYLON.SceneManager.x_vertical;
            BABYLON.SceneManager.mousex = BABYLON.SceneManager.x_mousex;
            BABYLON.SceneManager.mousey = BABYLON.SceneManager.x_mousey;
        };
        // *********************************** //
        // *  Private Scene Parsing Support  * //
        // *********************************** //
        SceneManager.parseSceneMetadata = function (rootUrl, sceneFilename, scene) {
            var scenex = scene;
            if (scenex.manager == null) {
                var manager = new BABYLON.SceneManager(rootUrl, sceneFilename, scene);
                scenex.manager = manager;
                if (manager.controller != null) {
                    manager.controller.ready();
                }
            }
            else {
                if (console)
                    console.warn("Scene already has already been parsed.");
            }
        };
        SceneManager.parseMeshMetadata = function (meshes, scene) {
            var scenex = scene;
            if (scenex.manager != null) {
                var manager = scenex.manager;
                var ticklist = [];
                BABYLON.SceneManager.parseSceneMeshes(meshes, scene, ticklist);
                if (ticklist.length > 0) {
                    ticklist.sort(function (left, right) {
                        if (left.order < right.order)
                            return -1;
                        if (left.order > right.order)
                            return 1;
                        return 0;
                    });
                    ticklist.forEach(function (scriptComponent) {
                        scriptComponent.instance.register();
                    });
                }
            }
            else {
                if (console)
                    console.warn("No scene manager detected for current scene");
            }
        };
        SceneManager.parseSceneCameras = function (cameras, scene, ticklist) {
            if (cameras != null && cameras.length > 0) {
                cameras.forEach(function (camera) {
                    if (camera.metadata != null && camera.metadata.api) {
                        if (camera.metadata.disposal == null || camera.metadata.disposal === false) {
                            camera.onDispose = function () { BABYLON.SceneManager.destroySceneComponents(camera); };
                            camera.metadata.disposal = true;
                        }
                        var metadata = camera.metadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach(function (camerascript) {
                                if (camerascript.klass != null && camerascript.klass !== "" && camerascript.klass !== "BABYLON.ScriptComponent" && camerascript.klass !== "BABYLON.SceneController") {
                                    var CameraComponentClass = BABYLON.SceneManager.createComponentClass(camerascript.klass);
                                    if (CameraComponentClass != null) {
                                        camerascript.instance = new CameraComponentClass(camera, scene, camerascript.update, camerascript.properties);
                                        if (camerascript.instance != null) {
                                            ticklist.push(camerascript);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
        SceneManager.parseSceneLights = function (lights, scene, ticklist) {
            if (lights != null && lights.length > 0) {
                lights.forEach(function (light) {
                    if (light.metadata != null && light.metadata.api) {
                        if (light.metadata.disposal == null || light.metadata.disposal === false) {
                            light.onDispose = function () { BABYLON.SceneManager.destroySceneComponents(light); };
                            light.metadata.disposal = true;
                        }
                        var metadata = light.metadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach(function (lightscript) {
                                if (lightscript.klass != null && lightscript.klass !== "" && lightscript.klass !== "BABYLON.ScriptComponent" && lightscript.klass !== "BABYLON.SceneController") {
                                    var LightComponentClass = BABYLON.SceneManager.createComponentClass(lightscript.klass);
                                    if (LightComponentClass != null) {
                                        lightscript.instance = new LightComponentClass(light, scene, lightscript.update, lightscript.properties);
                                        if (lightscript.instance != null) {
                                            ticklist.push(lightscript);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
        SceneManager.parseSceneMeshes = function (meshes, scene, ticklist) {
            if (meshes != null && meshes.length > 0) {
                meshes.forEach(function (mesh) {
                    if (mesh.metadata != null && mesh.metadata.api) {
                        if (mesh.metadata.disposal == null || mesh.metadata.disposal === false) {
                            mesh.onDispose = function () { BABYLON.SceneManager.destroySceneComponents(mesh); };
                            mesh.metadata.disposal = true;
                        }
                        var metadata = mesh.metadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach(function (meshscript) {
                                if (meshscript.klass != null && meshscript.klass !== "" && meshscript.klass !== "BABYLON.ScriptComponent" && meshscript.klass !== "BABYLON.SceneController") {
                                    var MeshComponentClass = BABYLON.SceneManager.createComponentClass(meshscript.klass);
                                    if (MeshComponentClass != null) {
                                        meshscript.instance = new MeshComponentClass(mesh, scene, meshscript.update, meshscript.properties);
                                        if (meshscript.instance != null) {
                                            ticklist.push(meshscript);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
        SceneManager.destroySceneComponents = function (owner, destroyMetadata) {
            if (destroyMetadata === void 0) { destroyMetadata = true; }
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata = owner.metadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    metadata.components.forEach(function (ownerscript) {
                        if (ownerscript.instance != null) {
                            ownerscript.instance.dispose();
                            ownerscript.instance = null;
                        }
                    });
                    if (destroyMetadata) {
                        owner.metadata.components = null;
                    }
                }
                if (destroyMetadata) {
                    if (owner.metadata.properties != null) {
                        owner.metadata.properties = null;
                    }
                    owner.metadata = null;
                }
            }
        };
        // *********************************** //
        // * Private Ground Creation Support * //
        // *********************************** //
        SceneManager.createGroundTerrain = function (name, url, options, scene) {
            var width = options.width || 10.0;
            var height = options.height || 10.0;
            var subdivisions = options.subdivisions || 1 | 0;
            var minHeight = options.minHeight || 0.0;
            var maxHeight = options.maxHeight || 10.0;
            var updatable = options.updatable;
            var onReady = options.onReady;
            var ground = new BABYLON.GroundMesh(name, scene);
            ground._subdivisionsX = subdivisions;
            ground._subdivisionsY = subdivisions;
            ground._width = width;
            ground._height = height;
            ground._maxX = ground._width / 2.0;
            ground._maxZ = ground._height / 2.0;
            ground._minX = -ground._maxX;
            ground._minZ = -ground._maxZ;
            ground._setReady(false);
            var onload = function (img) {
                // Getting height map data
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var bufferWidth = img.width;
                var bufferHeight = img.height;
                canvas.width = bufferWidth;
                canvas.height = bufferHeight;
                context.drawImage(img, 0, 0);
                // Create VertexData from map data
                // Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
                var buffer = context.getImageData(0, 0, bufferWidth, bufferHeight).data;
                var vertexData = BABYLON.SceneManager.parseTerrainHeightmap({
                    width: width, height: height,
                    subdivisions: subdivisions,
                    minHeight: minHeight, maxHeight: maxHeight,
                    buffer: buffer, bufferWidth: bufferWidth, bufferHeight: bufferHeight
                });
                vertexData.applyToMesh(ground, updatable);
                ground._setReady(true);
                //execute ready callback, if set
                if (onReady) {
                    onReady(ground);
                }
            };
            BABYLON.Tools.LoadImage(url, onload, function () { }, scene.database);
            return ground;
        };
        SceneManager.parseTerrainHeightmap = function (options) {
            var indices = [];
            var positions = [];
            var normals = [];
            var uvs = [];
            var row, col;
            // Heightmap
            var floatView = new Float32Array(options.buffer.buffer);
            // Vertices
            for (row = 0; row <= options.subdivisions; row++) {
                for (col = 0; col <= options.subdivisions; col++) {
                    var position = new BABYLON.Vector3((col * options.width) / options.subdivisions - (options.width / 2.0), 0, ((options.subdivisions - row) * options.height) / options.subdivisions - (options.height / 2.0));
                    // Compute height
                    var heightMapX = (((position.x + options.width / 2) / options.width) * (options.bufferWidth - 1)) | 0;
                    var heightMapY = ((1.0 - (position.z + options.height / 2) / options.height) * (options.bufferHeight - 1)) | 0;
                    // Unpack height
                    var pos = (heightMapX + heightMapY * options.bufferWidth);
                    var gradient = floatView[pos];
                    position.y = options.minHeight + (options.maxHeight - options.minHeight) * gradient;
                    // Add  vertex
                    positions.push(position.x, position.y, position.z);
                    normals.push(0, 0, 0);
                    uvs.push(col / options.subdivisions, 1.0 - row / options.subdivisions);
                }
            }
            // Indices
            for (row = 0; row < options.subdivisions; row++) {
                for (col = 0; col < options.subdivisions; col++) {
                    indices.push(col + 1 + (row + 1) * (options.subdivisions + 1));
                    indices.push(col + 1 + row * (options.subdivisions + 1));
                    indices.push(col + row * (options.subdivisions + 1));
                    indices.push(col + (row + 1) * (options.subdivisions + 1));
                    indices.push(col + 1 + (row + 1) * (options.subdivisions + 1));
                    indices.push(col + row * (options.subdivisions + 1));
                }
            }
            // Normals
            BABYLON.VertexData.ComputeNormals(positions, indices, normals);
            // Result
            var vertexData = new BABYLON.VertexData();
            vertexData.indices = indices;
            vertexData.positions = positions;
            vertexData.normals = normals;
            vertexData.uvs = uvs;
            return vertexData;
        };
        // ********************************** //
        // * Private Class Creation Support * //
        // ********************************** //
        SceneManager.createComponentClass = function (klass) {
            return BABYLON.SceneManager.createObjectFromString(klass, "function");
        };
        SceneManager.createObjectFromString = function (str, type) {
            type = type || "object"; // can pass "function"
            var arr = str.split(".");
            var fn = (window || this);
            for (var i = 0, len = arr.length; i < len; i++) {
                try {
                    fn = fn[arr[i]];
                }
                catch (ex) {
                    break;
                }
            }
            if (typeof fn !== type) {
                fn = null;
                if (console)
                    console.warn(type + " not found: " + str);
            }
            return fn;
        };
        SceneManager.keymap = {};
        SceneManager.clientx = 0;
        SceneManager.clienty = 0;
        SceneManager.mousex = 0;
        SceneManager.mousey = 0;
        SceneManager.vertical = 0;
        SceneManager.horizontal = 0;
        SceneManager.x_mousex = 0;
        SceneManager.x_mousey = 0;
        SceneManager.x_vertical = 0;
        SceneManager.x_horizontal = 0;
        SceneManager.k_mousex = 0;
        SceneManager.k_mousey = 0;
        SceneManager.k_vertical = 0;
        SceneManager.k_horizontal = 0;
        SceneManager.j_mousex = 0;
        SceneManager.j_mousey = 0;
        SceneManager.j_vertical = 0;
        SceneManager.j_horizontal = 0;
        SceneManager.g_mousex = 0;
        SceneManager.g_mousey = 0;
        SceneManager.g_vertical = 0;
        SceneManager.g_horizontal = 0;
        SceneManager.engine = null;
        SceneManager.gamepad = null;
        SceneManager.gamepads = null;
        SceneManager.gamepadType = BABYLON.GamepadType.None;
        SceneManager.gamepadConnected = null;
        SceneManager.gamepadButtonPress = [];
        SceneManager.gamepadButtonDown = [];
        SceneManager.gamepadButtonUp = [];
        SceneManager.gamepadDpadPress = [];
        SceneManager.gamepadDpadDown = [];
        SceneManager.gamepadDpadUp = [];
        SceneManager.gamepadLeftTrigger = [];
        SceneManager.gamepadRightTrigger = [];
        SceneManager.mouseButtonPress = [];
        SceneManager.mouseButtonDown = [];
        SceneManager.mouseButtonUp = [];
        SceneManager.keyButtonPress = [];
        SceneManager.keyButtonDown = [];
        SceneManager.keyButtonUp = [];
        SceneManager.leftJoystick = null;
        SceneManager.rightJoystick = null;
        SceneManager.previousPosition = null;
        SceneManager.preventDefault = false;
        SceneManager.rightHanded = true;
        SceneManager.loader = null;
        return SceneManager;
    }());
    BABYLON.SceneManager = SceneManager;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /* Babylon Scene Navigation Agent AI */
    var NavigationAgent = (function () {
        function NavigationAgent(owner) {
            if (owner == null)
                throw new Error("Null owner agent mesh specified.");
            this._mesh = owner;
            this._info = (this._mesh.metadata != null && this._mesh.metadata.navAgent != null) ? this._mesh.metadata.navAgent : null;
        }
        Object.defineProperty(NavigationAgent.prototype, "mesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationAgent.prototype, "info", {
            get: function () {
                return this._info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationAgent.prototype, "hasAgentInfo", {
            get: function () {
                return (this.info != null);
            },
            enumerable: true,
            configurable: true
        });
        NavigationAgent.prototype.setDestination = function (destination) {
            if (this.hasAgentInfo) {
            }
            else {
                if (console)
                    console.warn("Null navigation agent metadata. Set agent destination ignored.");
            }
        };
        return NavigationAgent;
    }());
    BABYLON.NavigationAgent = NavigationAgent;
})(BABYLON || (BABYLON = {}));
