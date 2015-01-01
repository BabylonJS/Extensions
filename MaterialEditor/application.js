var RW;
(function (RW) {
    (function (TextureEditor) {
        'use strict';

        var AngularStarter = (function () {
            function AngularStarter(name) {
                this.name = name;
            }
            AngularStarter.prototype.start = function () {
                var _this = this;
                $(document).ready(function () {
                    //zip configuration
                    window['zip'].workerScriptsPath = "/vendor/zip/";

                    _this.app = angular.module(name, [
                        'ui.bootstrap',
                        'colorpicker.module',
                        'ui.slider'
                    ]).controller("CanvasController", TextureEditor.CanvasController).controller("ObjectSubMeshesController", TextureEditor.ObjectSubMeshesController).controller("MaterialController", TextureEditor.MaterialController).controller("MaterialExportModalController", TextureEditor.MaterialExportModlController).controller("TextureController", TextureEditor.TextureController).service("materialService", TextureEditor.MaterialService).service("canvasService", TextureEditor.CanvasService).directive("textureImage", TextureEditor.textureImage).directive("disableEnableButton", TextureEditor.disableEnableButton);

                    angular.bootstrap(document, [_this.app.name]);
                });
            };
            return AngularStarter;
        })();
        TextureEditor.AngularStarter = AngularStarter;

        new AngularStarter('materialEditor').start();
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BABYLON;
(function (BABYLON) {
    var ExtendedCubeTexture = (function (_super) {
        __extends(ExtendedCubeTexture, _super);
        function ExtendedCubeTexture(urls, scene, _noMipmap) {
            _super.call(this, scene);
            this.urls = urls;
            this._noMipmap = _noMipmap;
            this.coordinatesMode = BABYLON.Texture.CUBIC_MODE;

            this.name = "ExtendedCubeTexture";
            this.hasAlpha = false;

            if (!this._texture) {
                if (!scene.useDelayedTextureLoading) {
                    this._texture = this.createCubeTexture(urls, this._noMipmap, scene, urls);
                } else {
                    this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
                }
            }

            this.isCube = true;

            this._textureMatrix = BABYLON.Matrix.Identity();
        }
        ExtendedCubeTexture.prototype.clone = function () {
            var _this = this;
            var urls = [];
            this.urls.forEach(function (url) {
                _this.urls.push(url);
            });
            var newTexture = new BABYLON.ExtendedCubeTexture(urls, this.getScene(), this._noMipmap);

            // Base texture
            newTexture.level = this.level;
            newTexture.wrapU = this.wrapU;
            newTexture.wrapV = this.wrapV;
            newTexture.coordinatesIndex = this.coordinatesIndex;
            newTexture.coordinatesMode = this.coordinatesMode;

            return newTexture;
        };

        // Methods
        ExtendedCubeTexture.prototype.delayLoad = function () {
            if (this.delayLoadState != BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }

            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;

            if (!this._texture) {
                this._texture = this.createCubeTexture(this.urls, this._noMipmap, this.getScene(), this.urls);
            }
        };

        ExtendedCubeTexture.prototype.getReflectionTextureMatrix = function () {
            return this._textureMatrix;
        };

        //The parameters are here just in case I will ever move this function to the engine. The are private members of this class.
        //buffers is also redundant. buffers == urls ...
        ExtendedCubeTexture.prototype.createCubeTexture = function (urls, noMipmap, scene, buffers) {
            if (urls.length != 6) {
                throw new Error("Not enough images to create a cube. Aborting.");
            }

            //avoiding errors in typescript trying to access a private member
            var engine = scene.getEngine();
            var gl = engine['_gl'];

            //To enable DDS Support this needs to be uncommented. rootUrl should also be added...
            //var extension = rootUrl.substr(rootUrl.length - 4, 4).toLowerCase();
            //var isDDS = engine.getCaps().s3tc && (extension === ".dds");
            //if (isDDS) {
            //    return engine.createCubeTexture(rootUrl, scene, extensions);
            //}
            var texture = gl.createTexture();
            texture.isCube = true;

            //texture.url = rootUrl;
            //Is this needed?
            texture.url = urls[0];
            texture.references = 1;
            engine['_loadedTexturesCache'].push(texture);

            var imagesArray = [];

            var onError = function () {
                console.log("error loadig image");
            };

            var onImageLoadSuccess = function (image) {
                imagesArray.push(image);
                if (imagesArray.length == 6) {
                    onImagesLoadSuccess(imagesArray);
                }
            };

            var onImagesLoadSuccess = function (images) {
                var width = BABYLON.Tools.GetExponantOfTwo(images[0].width, engine.getCaps().maxCubemapTextureSize);
                var height = width;

                var canvas = engine['_workingCanvas'];
                var context = engine['_workingContext'];

                canvas.width = width;
                canvas.height = height;

                var faces = [
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];

                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

                for (var index = 0; index < faces.length; index++) {
                    context.drawImage(images[index], 0, 0, images[index].width, images[index].height, 0, 0, width, height);
                    gl.texImage2D(faces[index], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                }

                if (!noMipmap) {
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                }

                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, noMipmap ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

                engine._activeTexturesCache = [];

                texture._width = width;
                texture._height = height;
                texture.isReady = true;
            };

            for (var i = 0; i < 6; i++) {
                var url = urls[i];

                //taken from babylon engine createTexture
                var extension;
                var fromData = false;
                if (url.substr(0, 5) === "data:") {
                    fromData = true;
                }

                /*if (!fromData)
                extension = url.substr(url.length - 4, 4).toLowerCase();
                else {
                var oldUrl = url;
                fromData = oldUrl.split(':');
                url = oldUrl;
                extension = fromData[1].substr(fromData[1].length - 4, 4).toLowerCase();
                }
                
                var isDDS = engine.getCaps().s3tc && (extension === ".dds");
                var isTGA = (extension === ".tga");
                //not supporting dds or tga single images at the moment. Not really planned as well... DDS is supported using the engine's function.
                if (isDDS || isTGA) {
                throw new Error("Extensions not yet supported");
                }*/
                if (!fromData)
                    BABYLON.Tools.LoadImage(url, onImageLoadSuccess, onError, scene.database);
                else
                    BABYLON.Tools.LoadImage(buffers[i], onImageLoadSuccess, onError, scene.database);
            }

            return texture;
        };
        return ExtendedCubeTexture;
    })(BABYLON.BaseTexture);
    BABYLON.ExtendedCubeTexture = ExtendedCubeTexture;
})(BABYLON || (BABYLON = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var CanvasController = (function () {
            function CanvasController($scope, $timeout, $modal, canvasService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$modal = $modal;
                this.canvasService = canvasService;
                this.resetLightParameters = function (light) {
                    _this.$scope.light = light;
                    _this.$scope.lightSpecularColor = new TextureEditor.HexToBabylon('specular', light, "");
                    _this.$scope.lightDiffuseColor = new TextureEditor.HexToBabylon('diffuse', light, "");
                };
                this.objectSelected = function () {
                    while (!_this.canvasService.selectObjectInPosition(_this.selectedObjectPosition.value)) {
                        _this.selectedObjectPosition = _this.objectTypes[_this.selectedObjectPosition.value + 1];
                    }
                    ;
                    if (_this.singleOutMesh)
                        _this.singleOutChanged();
                };
                this.singleOutMesh = false;

                this.lightTypes = [
                    { name: 'Hemispheric', type: 0 /* HEMISPHERIC */ },
                    { name: 'Point (in camera position)', type: 2 /* POINT */ }
                ];

                this.selectedLightType = this.lightTypes[0];

                $scope.$on("sceneReset", function () {
                    $timeout(function () {
                        var meshes = canvasService.getObjects();
                        _this.objectTypes = [];
                        for (var pos = 0; pos < meshes.length; pos++) {
                            _this.objectTypes.push({ name: meshes[pos].name, value: pos });
                        }
                        ;
                        var pos = 0;
                        _this.selectedObjectPosition = _this.objectTypes[pos];
                        _this.objectSelected();
                        _this.canvasService.sceneLoadingUI(false);
                    });
                });

                $scope.$on("objectChanged", function (event, object, fromClick) {
                    if (typeof fromClick === "undefined") { fromClick = false; }
                    if (fromClick) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                _this.selectedObjectPosition = _this.objectTypes.filter(function (map) {
                                    return map.name === object.name;
                                })[0];
                            });
                        });
                    }
                });

                $scope.$on("lightChanged", function (event, light) {
                    _this.resetLightParameters(light);
                });

                $scope.lightConfigure = true;
                this.canvasService.resetScene();
                this.canvasService.initLight();
            }
            CanvasController.prototype.lightTypeChanged = function () {
                this.canvasService.initLight(this.selectedLightType.type);
            };

            CanvasController.prototype.fileAdded = function () {
                var _this = this;
                //taken from zipJS - http://gildas-lormeau.github.io/zip.js/demos/demo2.html
                //TODO angularize it!
                var fileInput = document.getElementById("scene-input");

                this.canvasService.sceneLoadingUI(true);

                var model = (function () {
                    var URL = window.webkitURL || window['mozURL'] || window.URL;

                    return {
                        getEntries: function (file, onend) {
                            window['zip'].createReader(new window['zip'].BlobReader(file), function (zipReader) {
                                zipReader.getEntries(onend);
                            }, onerror);
                        },
                        getEntryFile: function (entry, creationMethod, onend, onprogress) {
                            var writer, zipFileEntry;

                            function getData() {
                                entry.getData(writer, function (blob) {
                                    var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                                    onend(entry, blobURL);
                                }, onprogress);
                            }

                            if (creationMethod == "Blob") {
                                writer = new window['zip'].BlobWriter();
                                getData();
                            }
                        }
                    };
                })();

                var sceneUrl;
                var binaries = [];
                var numberOfBinaries = 0;

                function endsWith(str, suffix) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                }

                model.getEntries(fileInput.files[0], function (entries) {
                    entries.forEach(function (entry) {
                        if (endsWith(entry.filename, ".jpg") || endsWith(entry.filename, ".png")) {
                            numberOfBinaries++;
                        }
                    });

                    entries.forEach(function (entry) {
                        model.getEntryFile(entry, "Blob", function (originalEntry, url) {
                            if (endsWith(originalEntry.filename, ".babylon")) {
                                sceneUrl = url;
                            } else if (endsWith(originalEntry.filename, ".jpg") || endsWith(entry.filename, ".png")) {
                                binaries.push({ originalName: originalEntry.filename, newUrl: url });
                            }
                            if (binaries.length === numberOfBinaries && sceneUrl) {
                                _this.canvasService.loadScene(sceneUrl, binaries);
                            }
                        }, function (progress) {
                        });
                    });
                });
            };

            CanvasController.prototype.resetScene = function () {
                this.canvasService.resetScene();
            };

            CanvasController.prototype.objectSubMeshes = function () {
                var _this = this;
                var modalInstance = this.$modal.open({
                    templateUrl: 'objectSubMeshes.html',
                    controller: 'ObjectSubMeshesController',
                    size: "lg",
                    resolve: {
                        object: function () {
                            return _this.canvasService.getObjectInPosition(_this.selectedObjectPosition.value);
                        }
                    }
                });

                modalInstance.result.then(function () {
                    //update the object
                    _this.objectSelected();
                }, function () {
                });
            };

            CanvasController.prototype.singleOutChanged = function () {
                this.canvasService.singleOut(this.singleOutMesh, this.selectedObjectPosition.value);
            };
            CanvasController.$inject = [
                '$scope',
                '$timeout',
                '$modal',
                'canvasService'
            ];
            return CanvasController;
        })();
        TextureEditor.CanvasController = CanvasController;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        (function (ObjectType) {
            ObjectType[ObjectType["SPHERE"] = 0] = "SPHERE";
            ObjectType[ObjectType["BOX"] = 1] = "BOX";
            ObjectType[ObjectType["PLANE"] = 2] = "PLANE";
            ObjectType[ObjectType["CYLINDER"] = 3] = "CYLINDER";
            ObjectType[ObjectType["KNOT"] = 4] = "KNOT";
            ObjectType[ObjectType["TORUS"] = 5] = "TORUS";
        })(TextureEditor.ObjectType || (TextureEditor.ObjectType = {}));
        var ObjectType = TextureEditor.ObjectType;

        (function (LightType) {
            LightType[LightType["HEMISPHERIC"] = 0] = "HEMISPHERIC";
            LightType[LightType["SPOT"] = 1] = "SPOT";
            LightType[LightType["POINT"] = 2] = "POINT";
        })(TextureEditor.LightType || (TextureEditor.LightType = {}));
        var LightType = TextureEditor.LightType;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var CanvasService = (function () {
            function CanvasService($rootScope) {
                var _this = this;
                this.$rootScope = $rootScope;
                this._canvasElement = document.getElementById("renderCanvas");
                this._engine = new BABYLON.Engine(this._canvasElement);
                this._scene = new BABYLON.Scene(this._engine);

                this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 10, 0.8, 30, new BABYLON.Vector3(0, 0, 0), this._scene);
                this._camera.wheelPrecision = 20;

                this._camera.attachControl(this._canvasElement, false);

                this._engine.runRenderLoop(function () {
                    _this._scene.render();
                });

                window.addEventListener("resize", function () {
                    _this._engine.resize();
                });

                this._scene.registerBeforeRender(function () {
                });
            }
            CanvasService.prototype.getLight = function () {
                return this._light;
            };

            CanvasService.prototype.updateTexture = function (property, texture) {
                this._textureObject.material[property] = texture;
            };

            CanvasService.prototype.loadScene = function (sceneBlob, binaries) {
                var _this = this;
                while (this._scene.meshes.pop()) {
                }
                BABYLON.Tools.LoadFile(sceneBlob, function (data) {
                    binaries.forEach(function (binary) {
                        var re = new RegExp(binary.originalName, "g");
                        data = data.replace(re, binary.newUrl);
                    });
                    BABYLON.SceneLoader.ImportMesh("", "", "data:" + data, _this._scene, function (meshes) {
                        meshes.forEach(function (mesh) {
                            if (!mesh.material)
                                mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", _this._scene);
                            mesh.actionManager = new BABYLON.ActionManager(_this._scene);
                            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "renderOutline", false));
                            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "renderOutline", true));
                            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, function (evt) {
                                _this.selectObject(mesh, true);
                            }));
                        });
                        _this.$rootScope.$broadcast("sceneReset");
                    });
                });
            };

            CanvasService.prototype.resetScene = function () {
                for (var i = this._scene.meshes.length - 1; i > -1; i--) {
                    this._scene.meshes[i].dispose();
                }
                this.createDefaultScene();
                this.$rootScope.$broadcast("sceneReset");
            };

            CanvasService.prototype.createDefaultScene = function () {
                var _this = this;
                //taken shamelessly from babylon's playground!
                var scene = this._scene;

                var box = BABYLON.Mesh.CreateBox("Box", 6.0, scene);
                var sphere = BABYLON.Mesh.CreateSphere("Sphere", 10.0, 10.0, scene);
                var plan = BABYLON.Mesh.CreatePlane("Plane", 10.0, scene);
                var cylinder = BABYLON.Mesh.CreateCylinder("Cylinder", 3, 3, 3, 6, 1, scene);
                var torus = BABYLON.Mesh.CreateTorus("Torus", 5, 1, 10, scene);
                var knot = BABYLON.Mesh.CreateTorusKnot("Knot", 2, 0.5, 128, 64, 2, 3, scene);

                box.position = new BABYLON.Vector3(-10, 0, 0);
                sphere.position = new BABYLON.Vector3(0, 10, 0);
                plan.position.z = 10;
                cylinder.position.z = -10;
                torus.position.x = 10;
                knot.position.y = -10;

                //add actions to each object (hover, select)
                scene.meshes.forEach(function (mesh) {
                    mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", _this._scene);
                    mesh.actionManager = new BABYLON.ActionManager(_this._scene);
                    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "renderOutline", false));
                    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "renderOutline", true));
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, function (evt) {
                        _this.selectObject(mesh, true);
                    }));
                });
            };

            CanvasService.prototype.initLight = function (lightType) {
                if (typeof lightType === "undefined") { lightType = 0 /* HEMISPHERIC */; }
                this._scene.lights.forEach(function (light) {
                    light.dispose();
                });

                switch (lightType) {
                    case 0 /* HEMISPHERIC */:
                        this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
                        this._light.groundColor = new BABYLON.Color3(0, 0, 0);
                        break;
                    case 2 /* POINT */:
                        this._light = new BABYLON.PointLight("light", this._camera.position, this._scene);
                        break;
                    case 1 /* SPOT */:
                        //todo calculate direction!
                        this._light = new BABYLON.SpotLight("light", this._camera.position, new BABYLON.Vector3(0, -1, 0), 0.8, 2, this._scene);
                        break;
                }

                this._light.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
                this._light.specular = new BABYLON.Color3(1, 1, 1);

                this.$rootScope.$broadcast("lightChanged", this._light);
            };

            CanvasService.prototype.selectObjectInPosition = function (position) {
                return this.selectObject(this._scene.meshes[position]);
            };

            CanvasService.prototype.getObjectInPosition = function (position) {
                return this._scene.meshes[position];
            };

            CanvasService.prototype.selectObject = function (mesh, fromClick) {
                if (typeof fromClick === "undefined") { fromClick = false; }
                if (mesh.subMeshes == null) {
                    return false;
                }
                this._textureObject = mesh;

                //Update the material to multimaterial, if needed. and Vice versa!
                if (mesh.subMeshes.length > 1 && mesh.material instanceof BABYLON.StandardMaterial) {
                    var mat = mesh.material;
                    var multimat = new BABYLON.MultiMaterial(mesh.name + "MultiMat", this._scene);
                    multimat.subMaterials.push(mat);
                    for (var i = 1; i < mesh.subMeshes.length; i++) {
                        multimat.subMaterials.push(new BABYLON.StandardMaterial(mesh.name + "MatInMulti" + i, this._scene));
                    }
                    this._textureObject.material = multimat;
                } else if (mesh.subMeshes.length == 1 && mesh.material instanceof BABYLON.MultiMaterial) {
                    mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", this._scene);
                } else if (mesh.material instanceof BABYLON.MultiMaterial && mesh.material['subMaterials'].length < mesh.subMeshes.length) {
                    for (var i = mesh.material['subMaterials'].length; i < mesh.subMeshes.length; i++) {
                        mesh.material['subMaterials'].push(new BABYLON.StandardMaterial(mesh.name + "MatInMulti" + i, this._scene));
                    }
                }

                this.$rootScope.$broadcast("objectChanged", this._textureObject, fromClick);
                this.directCameraTo(this._textureObject);
                return true;
            };

            CanvasService.prototype.directCameraTo = function (object) {
                this._camera.target = object.position;
            };

            CanvasService.prototype.getObjects = function () {
                return this._scene.meshes;
            };

            CanvasService.prototype.sceneLoadingUI = function (loading) {
                if (typeof loading === "undefined") { loading = true; }
                if (loading)
                    this._scene.getEngine().displayLoadingUI();
                else
                    this._scene.getEngine().hideLoadingUI();
            };

            CanvasService.prototype.appendMaterial = function (materialId, successCallback, progressCallback, errorCallback) {
                BABYLON.SceneLoader.Append(TextureEditor.MaterialController.ServerUrl + "/materials/", materialId + ".babylon", this._scene, successCallback, progressCallback, errorCallback);
            };

            CanvasService.prototype.getMaterial = function (materialId) {
                return this._scene.getMaterialByID(materialId);
            };

            CanvasService.prototype.singleOut = function (enable, objectPosition) {
                if (enable) {
                    for (var i = 0; i < this._scene.meshes.length; i++) {
                        var mesh = this._scene.meshes[i];

                        mesh['lastVisibleState'] = mesh.isVisible;
                        if (i == objectPosition) {
                            mesh.isVisible = true;
                        } else
                            mesh.isVisible = false;
                    }
                } else {
                    for (var i = 0; i < this._scene.meshes.length; i++) {
                        //if (i == objectPosition) continue;
                        var mesh = this._scene.meshes[i];
                        mesh.isVisible = (!!mesh['lastVisibleState']);
                    }
                }
            };
            CanvasService.$inject = [
                '$rootScope'
            ];
            return CanvasService;
        })();
        TextureEditor.CanvasService = CanvasService;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var ObjectSubMeshesController = (function () {
            function ObjectSubMeshesController($scope, $modalInstance, object) {
                var _this = this;
                this.$scope = $scope;
                this.$modalInstance = $modalInstance;
                this.object = object;
                $scope.object = object;
                $scope.totalNumberOfIndices = object.getTotalIndices();

                $scope.close = function () {
                    $scope.updateObject(true);
                    $modalInstance.close();
                };

                $scope.updateObject = function (closeObject) {
                    if (typeof closeObject === "undefined") { closeObject = false; }
                    var usedVertics = 0;
                    var idx = 0;
                    object.subMeshes.forEach(function (subMesh) {
                        //rounding to threes.
                        var substract = subMesh.indexCount % 3;
                        subMesh.indexCount -= subMesh.indexCount % 3;

                        //validation of using too many vertices
                        if (usedVertics + subMesh.indexCount > $scope.totalNumberOfIndices) {
                            subMesh.indexCount = $scope.totalNumberOfIndices - usedVertics;
                        }

                        //substract = subMesh.indexStart % 3;
                        //subMesh.indexStart -= substract;
                        subMesh.indexStart = usedVertics;

                        //validation - too many indices from startIndex
                        if (subMesh.indexStart + subMesh.indexCount > $scope.totalNumberOfIndices) {
                            subMesh.indexCount = $scope.totalNumberOfIndices - subMesh.indexStart;
                        }

                        //making sure material index is correct.
                        subMesh.materialIndex = idx;

                        usedVertics += subMesh.indexCount;
                        idx++;

                        //make sure all indices are used.
                        if (closeObject && idx == object.subMeshes.length && usedVertics < $scope.totalNumberOfIndices) {
                            subMesh.indexCount += $scope.totalNumberOfIndices - usedVertics;
                        }
                    });
                    $scope.indicesLeft = $scope.totalNumberOfIndices - usedVertics;
                };

                $scope.addSubMesh = function () {
                    var count = _this.$scope.indicesLeft < 0 ? 0 : _this.$scope.indicesLeft;
                    new BABYLON.SubMesh(object.subMeshes.length, 0, object.getTotalVertices(), _this.$scope.totalNumberOfIndices - _this.$scope.indicesLeft, count, object);
                    $scope.updateObject(false);
                };

                $scope.removeSubMesh = function (index) {
                    object.subMeshes.splice(index, 1);
                    $scope.updateObject(false);
                };
                $scope.updateObject(false);
            }
            ObjectSubMeshesController.$inject = [
                '$scope',
                '$modalInstance',
                'object'
            ];
            return ObjectSubMeshesController;
        })();
        TextureEditor.ObjectSubMeshesController = ObjectSubMeshesController;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        TextureEditor.disableEnableButton = [function () {
                return {
                    require: 'ngModel',
                    priority: 1,
                    link: function (scope, element, attrs, ngModel) {
                        var render = ngModel.$render;
                        var addedText = attrs['extraText'] ? " " + attrs['extraText'] + " " : "";
                        function resetButton() {
                            if (ngModel.$modelValue === true || ngModel.$modelValue === 1) {
                                element.html(addedText + "Enabled");
                                element.addClass('btn-success');
                                element.removeClass('btn-danger');
                            } else {
                                element.html(addedText + "Disabled");
                                element.addClass('btn-danger');
                                element.removeClass('btn-success');
                            }
                            render();
                        }

                        element.bind('mouseenter', function () {
                            if (ngModel.$modelValue === true || ngModel.$modelValue === 1) {
                                element.html("Disable" + addedText);
                                element.addClass('btn-danger');
                                element.removeClass('btn-success');
                            } else {
                                element.html("Enable" + addedText);
                                element.addClass('btn-success');
                                element.removeClass('btn-danger');
                            }
                        });
                        element.bind('mouseleave', resetButton);

                        ngModel.$render = resetButton;

                        resetButton();
                    }
                };
            }];
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        /*
        TODO
        * Fix the alpha problem
        * Multi Material Javascript export.
        */
        var MaterialController = (function () {
            function MaterialController($scope, $modal /* modal from angular bootstrap ui */ , $http, $timeout, canvasService, materialService) {
                var _this = this;
                this.$scope = $scope;
                this.$modal = $modal;
                this.$http = $http;
                this.$timeout = $timeout;
                this.canvasService = canvasService;
                this.materialService = materialService;
                this.alerts = [];
                this.afterObjectChanged = function (event, object) {
                    //if object has no submeshes, do nothing. It is a null parent object. Who needs it?...
                    if (object.subMeshes == null)
                        return;

                    //If an object has more than one subMesh, it means I have already created a multi material object for it.
                    _this._object = object;
                    _this.isMultiMaterial = object.subMeshes.length > 1;
                    var force = false;
                    if (_this.isMultiMaterial) {
                        _this.numberOfMaterials = object.material.subMaterials.length;
                        _this.multiMaterialPosition = 0;
                        force = true;
                    } else {
                        _this.numberOfMaterials = 0;
                        _this.multiMaterialPosition = -1;
                    }

                    //force should be false, it is however true while a multi-material object needs to be always initialized.
                    _this.initMaterial(force, function () {
                        _this.$timeout(function () {
                            _this.$scope.$apply();
                        });
                    }, _this.multiMaterialPosition);
                };
                //for ng-repeat
                this.getMaterialIndices = function () {
                    return new Array(_this.numberOfMaterials);
                };
                this.isMultiMaterial = false;
                this.multiMaterialPosition = 0;
                this.numberOfMaterials = 0;
                this.progress = {
                    enabled: false,
                    value: 0,
                    text: ""
                };
                $scope.updateTexture = function (type) {
                    $scope.$apply(function () {
                        $scope.materialDefinition.materialSections[type].texture.canvasUpdated();
                    });
                };

                $scope.$on("objectChanged", this.afterObjectChanged);
            }
            MaterialController.prototype.initMaterial = function (forceNew, onSuccess, position) {
                //making sure it is undefined if it is not multi material.
                if (this.isMultiMaterial) {
                    this.$scope.materialDefinition = this.materialService.initMaterialSections(this._object, forceNew, onSuccess, position);
                } else {
                    this.$scope.materialDefinition = this.materialService.initMaterialSections(this._object, forceNew, onSuccess);
                }
            };

            MaterialController.prototype.exportMaterial = function () {
                var _this = this;
                var modalInstance = this.$modal.open({
                    templateUrl: 'materialExport.html',
                    controller: 'MaterialExportModalController',
                    size: "lg",
                    resolve: {
                        materialDefinitions: function () {
                            return _this.materialService.getMaterialDefinisionsArray(_this._object.id);
                        }
                    }
                });
            };

            MaterialController.prototype.updateProgress = function (enabled, text, value) {
                this.progress.enabled = enabled;
                this.progress.text = text;
                this.progress.value = value;
            };

            MaterialController.prototype.saveMaterial = function () {
                var _this = this;
                //todo get ID from server
                this.updateProgress(true, "Saving...", 20);
                this.$http.get(MaterialController.ServerUrl + "/getNextId").success(function (idObject) {
                    var id = idObject['id'];
                    var material = _this.materialService.exportAsBabylonScene(id, _this.$scope.materialDefinition);

                    //upload material object
                    _this.updateProgress(true, "Received ID...", 40);
                    _this.$http.post(MaterialController.ServerUrl + "/materials", material).success(function (worked) {
                        if (!worked['success']) {
                            _this.alerts.push({ type: 'danger', msg: 'Error uploading to server.' });
                            _this.updateProgress(false);
                            return;
                        }

                        //how many textures should be uploaded?
                        var textureSections = [];
                        _this.$scope.materialDefinition.sectionNames.forEach(function (sectionName) {
                            if (_this.$scope.materialDefinition.materialSections[sectionName].hasTexture && _this.$scope.materialDefinition.materialSections[sectionName].texture.enabled()) {
                                var textureDefinition = _this.$scope.materialDefinition.materialSections[sectionName].texture;
                                if (textureDefinition.babylonTextureType == 1 /* NORMAL */) {
                                    textureSections.push(sectionName);
                                }
                            }
                        });
                        if (textureSections.length == 0) {
                            _this.updateProgress(false);
                            _this.alerts.push({ type: 'success', msg: "Material stored. " });
                            _this.$timeout(function () {
                                _this.alerts.pop();
                            }, 5000);

                            //update the UI
                            _this.materialId = id;
                        } else {
                            var texturesUploaded = 0;
                            _this.updateProgress(true, "Uploading textures...", 50);
                            textureSections.forEach(function (sectionName) {
                                if (_this.$scope.materialDefinition.materialSections[sectionName].hasTexture && _this.$scope.materialDefinition.materialSections[sectionName].texture.enabled()) {
                                    var textureDefinition = _this.$scope.materialDefinition.materialSections[sectionName].texture;
                                    if (textureDefinition.babylonTextureType == 1 /* NORMAL */) {
                                        textureDefinition.getCanvasImageUrls(function (urls) {
                                            //if (urls.length == 1) {
                                            //textures will be uploaded async. The user should be notified about it!
                                            var obj = {};
                                            obj[id + '_' + textureDefinition.name + textureDefinition.getExtension()] = urls[0];
                                            _this.$http.post(MaterialController.ServerUrl + "/textures", obj).success(function (worked) {
                                                if (!worked['success']) {
                                                    _this.alerts.push({ type: 'danger', msg: "error uploading the texture " + textureDefinition.name });
                                                    _this.updateProgress(false);
                                                }

                                                texturesUploaded++;
                                                _this.updateProgress(true, "Uploading textures...", 50 + (texturesUploaded * 10));
                                                if (texturesUploaded == textureSections.length) {
                                                    _this.updateProgress(false);
                                                    _this.alerts.push({ type: 'success', msg: "Material stored." });
                                                    _this.$timeout(function () {
                                                        _this.alerts.pop();
                                                    }, 5000);
                                                    _this.materialId = id;
                                                }
                                            });
                                            //}
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            };

            MaterialController.prototype.loadMaterial = function () {
                var _this = this;
                if (!this.materialId) {
                    this.alerts.push({ type: 'warning', msg: "Please enter an ID" });
                    return;
                }
                this.updateProgress(true, "Loading material...", 30);

                //babylon doesn't check for 404 for some reason, doing it on my own. File will be loaded twice! TODO fix it in BABYLON!
                this.$http.get(MaterialController.ServerUrl + "/materials/" + this.materialId + ".babylon").error(function () {
                    _this.alerts.push({ type: 'danger', msg: "Material could not be loaded. Check the ID." });
                    _this.updateProgress(false);
                }).success(function () {
                    _this.canvasService.appendMaterial(_this.materialId, function () {
                        var material = _this.canvasService.getMaterial(_this.materialId);
                        var success = function () {
                            if (_this.alerts.length < 1)
                                _this.alerts.push({ type: 'success', msg: "Material loaded." });
                            _this.$timeout(function () {
                                _this.alerts.pop();
                            }, 5000);
                            _this.updateProgress(false);
                            _this.$scope.$apply();
                        };
                        _this.$timeout(function () {
                            if (_this.isMultiMaterial) {
                                _this._object.material.subMaterials[_this.multiMaterialPosition] = material;
                                _this.initMaterial(true, success, _this.multiMaterialPosition);
                            } else {
                                _this._object.material = material;
                                _this.initMaterial(true, success);
                            }
                        });
                    }, function (progress) {
                        _this.updateProgress(true, "Loading material...", 60);
                    }, function (error) {
                        console.log(error);
                        _this.alerts.push({ type: 'danger', msg: "Material could not be loaded. Check the ID." });
                        _this.updateProgress(false);
                    });
                });
            };

            MaterialController.prototype.closeAlert = function (index) {
                this.alerts.splice(index, 1);
            };
            MaterialController.$inject = [
                '$scope',
                '$modal',
                '$http',
                '$timeout',
                'canvasService',
                'materialService'
            ];

            MaterialController.ServerUrl = "";
            return MaterialController;
        })();
        TextureEditor.MaterialController = MaterialController;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var MaterialExportModlController = (function () {
            function MaterialExportModlController($scope, $modalInstance, materialDefinitions) {
                var _this = this;
                this.$scope = $scope;
                this.$modalInstance = $modalInstance;
                this.materialDefinitions = materialDefinitions;
                $scope.materialName = "my awsome material";
                $scope.materialVariableName = "myAwsomeMaterial";
                $scope.sceneVariableName = "myWonderfulScene";

                $scope.close = function () {
                    $modalInstance.close();
                };

                $scope.updateExport = function () {
                    var strings = [];
                    strings.push("//Material generated using raananw's babylon material editor, https://github.com/raananw/BabylonJS-Material-Editor ");
                    strings.push("");
                    var className = _this.materialDefinitions.length > 1 ? "MultiMaterial" : "StandardMaterial";
                    strings.push("var " + _this.$scope.materialVariableName + " = new BABYLON." + className + "('" + _this.$scope.materialName + "', " + _this.$scope.sceneVariableName + ")");

                    var exports = [];

                    exports.push(strings.join(";\n"));

                    if (_this.materialDefinitions.length == 1) {
                        if (_this.materialDefinitions[0].material instanceof BABYLON.StandardMaterial) {
                            var casted = _this.materialDefinitions[0].material;
                            ["alpha", "backFaceCulling", "specularPower", "useSpecularOverAlpha", "useAlphaFromDiffuseTexture"].forEach(function (param) {
                                exports.push(_this.$scope.materialVariableName + "." + param + " = " + casted[param]);
                            });
                        }
                        _this.materialDefinitions[0].getMaterialSectionsArray().forEach(function (definition) {
                            exports.push(_this.materialDefinitions[0].materialSections[definition].exportToJavascript(_this.$scope.sceneVariableName, _this.$scope.materialName, _this.$scope.materialVariableName));
                        });
                    } else {
                        for (var i = 0; i < _this.materialDefinitions.length; ++i) {
                            var matVarName = _this.$scope.materialVariableName + "_" + i;
                            exports.push("var " + matVarName + " = new BABYLON.StandardMaterial('" + _this.$scope.materialName + " " + i + "', " + _this.$scope.sceneVariableName + ")");
                            if (_this.materialDefinitions[i].material instanceof BABYLON.StandardMaterial) {
                                var casted = _this.materialDefinitions[0].material;
                                ["alpha", "backFaceCulling", "specularPower", "useSpecularOverAlpha", "useAlphaFromDiffuseTexture"].forEach(function (param) {
                                    exports.push(matVarName + "." + param + " = " + casted[param]);
                                });
                            }
                            _this.materialDefinitions[0].getMaterialSectionsArray().forEach(function (definition) {
                                exports.push(_this.materialDefinitions[i].materialSections[definition].exportToJavascript(_this.$scope.sceneVariableName, _this.$scope.materialName + " " + i, matVarName));
                            });
                            exports.push(_this.$scope.materialVariableName + ".subMaterials[" + i + "] = " + matVarName);
                        }
                    }

                    //TODO there must be a better way of formatting the text :) maybe a js beautifier?
                    _this.$scope.materialExport = exports.join(";\n").replace(/\n;\n/g, "\n\n").replace(/\n;\n/g, "\n\n").replace(/\n\n\n/g, "\n\n");
                };

                $scope.updateExport();
            }
            MaterialExportModlController.$inject = [
                '$scope',
                '$modalInstance',
                'materialDefinitions'
            ];
            return MaterialExportModlController;
        })();
        TextureEditor.MaterialExportModlController = MaterialExportModlController;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var MaterialDefinition = (function () {
            function MaterialDefinition(object, material, onSuccess) {
                this.sectionNames = ["diffuse", "emissive", "ambient", "opacity", "specular", "reflection", "bump"];
                this.initFromObject(object, material, onSuccess);
            }
            MaterialDefinition.prototype.initFromObject = function (object, material, onSuccess) {
                this.material = material;
                this.materialSections = {};
                this.materialSections["diffuse"] = new TextureEditor.MaterialDefinitionSection("diffuse", object, true, true, true, material, onSuccess);
                this.materialSections["emissive"] = new TextureEditor.MaterialDefinitionSection("emissive", object, true, true, true, material, onSuccess);
                this.materialSections["ambient"] = new TextureEditor.MaterialDefinitionSection("ambient", object, true, true, false, material, onSuccess);
                this.materialSections["opacity"] = new TextureEditor.MaterialDefinitionSection("opacity", object, false, true, true, material, onSuccess);
                this.materialSections["specular"] = new TextureEditor.MaterialDefinitionSection("specular", object, true, true, false, material, onSuccess);
                this.materialSections["reflection"] = new TextureEditor.MaterialDefinitionSection("reflection", object, false, true, true, material, onSuccess);
                this.materialSections["bump"] = new TextureEditor.MaterialDefinitionSection("bump", object, false, true, false, material, onSuccess);
            };

            MaterialDefinition.prototype.getMaterialSectionsArray = function () {
                return this.sectionNames;
            };

            MaterialDefinition.prototype.getMaterialSections = function () {
                return this.materialSections;
            };

            MaterialDefinition.prototype.exportAsBabylonScene = function (materialId) {
                var _this = this;
                var materialObject = {
                    id: materialId,
                    name: materialId
                };
                if (this.material instanceof BABYLON.StandardMaterial) {
                    var casted = this.material;
                    materialObject['alpha'] = casted.alpha, materialObject['backFaceCulling'] = casted.backFaceCulling, materialObject['specularPower'] = casted.specularPower, materialObject['useSpecularOverAlpha'] = casted.useSpecularOverAlpha, materialObject['useAlphaFromDiffuseTexture'] = casted.useAlphaFromDiffuseTexture;
                }
                this.getMaterialSectionsArray().forEach(function (definition) {
                    _this.materialSections[definition].exportAsBabylonScene(materialObject);
                });

                //now make it babylon compatible
                var babylonScene = {
                    "ambientColor": [0, 0, 0],
                    "autoClear": true,
                    "clearColor": [0.2, 0.2, 0.3],
                    "gravity": [0, 0, -0.9],
                    "materials": [materialObject],
                    "lights": [],
                    "meshes": [],
                    "cameras": []
                };

                return babylonScene;
            };
            return MaterialDefinition;
        })();
        TextureEditor.MaterialDefinition = MaterialDefinition;

        var MaterialService = (function () {
            function MaterialService($rootScope, canvasService) {
                this.$rootScope = $rootScope;
                this.canvasService = canvasService;
                this.materialDefinisions = {};
            }
            MaterialService.prototype.initMaterialSections = function (object, forceNew, onSuccess, multiMaterialPosition) {
                if (!this.materialDefinisions[object.id]) {
                    this.materialDefinisions[object.id] = [];
                }

                if (angular.isDefined(multiMaterialPosition)) {
                    if (!this.materialDefinisions[object.id][multiMaterialPosition] || forceNew) {
                        this.materialDefinisions[object.id][multiMaterialPosition] = this.createNewMaterialDefinition(object, onSuccess, multiMaterialPosition);
                    }
                    return this.materialDefinisions[object.id][multiMaterialPosition];
                } else {
                    if (!this.materialDefinisions[object.id][0] || forceNew) {
                        this.materialDefinisions[object.id][0] = this.createNewMaterialDefinition(object, onSuccess);
                    }
                    return this.materialDefinisions[object.id][0];
                }
            };

            MaterialService.prototype.getMaterialDefinisionsArray = function (objectId) {
                return this.materialDefinisions[objectId];
            };

            MaterialService.prototype.createNewMaterialDefinition = function (object, onSuccess, multiMaterialPosition) {
                var material;
                if (angular.isDefined(multiMaterialPosition)) {
                    material = object.material.subMaterials[multiMaterialPosition];
                } else {
                    material = object.material;
                }

                return new MaterialDefinition(object, material, onSuccess);
            };

            MaterialService.prototype.exportAsBabylonScene = function (materialId, materialDefinition) {
                return materialDefinition.exportAsBabylonScene(materialId);
            };
            MaterialService.$inject = [
                '$rootScope',
                'canvasService'
            ];
            return MaterialService;
        })();
        TextureEditor.MaterialService = MaterialService;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var FresnelDefinition = (function () {
            function FresnelDefinition(name, _material) {
                this.name = name;
                this.propertyInMaterial = name + 'FresnelParameters';
                if (_material[this.propertyInMaterial]) {
                    this.fresnelVariable = _material[this.propertyInMaterial];
                } else {
                    this.fresnelVariable = new BABYLON.FresnelParameters();
                    this.fresnelVariable.isEnabled = false;
                    _material[this.propertyInMaterial] = this.fresnelVariable;
                }
                this.leftColor = new TextureEditor.HexToBabylon("left", _material[this.propertyInMaterial]), this.rightColor = new TextureEditor.HexToBabylon("right", _material[this.propertyInMaterial]);
            }
            FresnelDefinition.prototype.exportAsJavascript = function (materialVarName) {
                var strings = [];
                var varName = materialVarName + "_" + this.name + "Fresnel";
                strings.push("var " + varName + " = new BABYLON.FresnelParameters()");
                strings.push(varName + ".isEnabled = true");
                strings.push(varName + ".bias = " + this.fresnelVariable.bias);
                strings.push(varName + ".power = " + this.fresnelVariable.power);
                var colorArray = this.fresnelVariable.leftColor.asArray();
                strings.push(varName + "." + "leftColor" + " = new BABYLON.Color3(" + colorArray[0] + ", " + colorArray[1] + ", " + colorArray[2] + ")");
                colorArray = this.fresnelVariable.rightColor.asArray();
                strings.push(varName + "." + "rightColor" + " = new BABYLON.Color3(" + colorArray[0] + ", " + colorArray[1] + ", " + colorArray[2] + ")");
                strings.push(materialVarName + "." + this.propertyInMaterial + " = " + varName);

                return strings.join(";\n");
            };

            FresnelDefinition.prototype.exportAsBabylonScene = function () {
                return {
                    bias: this.fresnelVariable.bias,
                    power: this.fresnelVariable.power,
                    isEnabled: this.fresnelVariable.isEnabled,
                    leftColor: this.fresnelVariable.leftColor.asArray(),
                    rightColor: this.fresnelVariable.rightColor.asArray()
                };
            };
            return FresnelDefinition;
        })();
        TextureEditor.FresnelDefinition = FresnelDefinition;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var HexToBabylon = (function () {
            function HexToBabylon(propertyName, _variable, addedString) {
                if (typeof addedString === "undefined") { addedString = "Color"; }
                this.propertyName = propertyName;
                this._variable = _variable;
                this.propertyName += addedString;
                this._setBabylonColor(_variable[this.propertyName]);
            }
            //angular getter/setter
            HexToBabylon.prototype.hex = function (hex) {
                if (hex) {
                    this._hex = hex;
                    this.babylonColor = this.convertStringToBabylonArray(this._hex);
                    if (this.babylonColor) {
                        this._variable[this.propertyName] = this.babylonColor;
                    }
                } else {
                    return this._hex;
                }
            };

            HexToBabylon.prototype._setBabylonColor = function (color) {
                this.babylonColor = color;
                var hex = "#";
                ['r', 'g', 'b'].forEach(function (channel) {
                    var c = ~~(color[channel] * 255);
                    hex = hex + ((c < 16) ? "0" + c.toString(16) : "" + c.toString(16));
                });

                this._hex = hex;
            };

            HexToBabylon.prototype.convertStringToBabylonArray = function (hex) {
                //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? BABYLON.Color3.FromArray([
                    parseInt(result[1], 16) / 255,
                    parseInt(result[2], 16) / 255,
                    parseInt(result[3], 16) / 255
                ]) : null;
            };
            return HexToBabylon;
        })();
        TextureEditor.HexToBabylon = HexToBabylon;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var MaterialDefinitionSection = (function () {
            function MaterialDefinitionSection(name, _object, hasColor, hasTexture, hasFresnel, material, onSuccess) {
                this.name = name;
                this._object = _object;
                this.hasColor = hasColor;
                this.hasTexture = hasTexture;
                this.hasFresnel = hasFresnel;
                this.material = material;
                /*var material: BABYLON.Material;
                if (angular.isDefined(multiMaterialPosition)) {
                material = (<BABYLON.MultiMaterial> _object.material).subMaterials[multiMaterialPosition];
                } else {
                material = _object.material;
                }*/
                if (hasColor) {
                    this.color = new TextureEditor.HexToBabylon(name, material);
                }
                if (hasTexture) {
                    this.texture = new TextureEditor.TextureDefinition(name, material, _object, onSuccess);
                }
                if (hasFresnel) {
                    this.fresnel = new TextureEditor.FresnelDefinition(name, material);
                }
            }
            MaterialDefinitionSection.prototype.exportToJavascript = function (sceneVarName, materialName, materialVarName) {
                var strings = [];

                if (this.hasColor) {
                    var colorArray = this.color.babylonColor.asArray();
                    strings.push(materialVarName + "." + this.color.propertyName + " = new BABYLON.Color3(" + colorArray[0].toFixed(2) + ", " + colorArray[1].toFixed(2) + ", " + colorArray[2].toFixed(2) + ")");
                }
                if (this.hasFresnel && this.fresnel.fresnelVariable.isEnabled) {
                    strings.push("//Fresnel Parameters ");
                    strings.push(this.fresnel.exportAsJavascript(materialVarName));
                }
                if (this.hasTexture && this.texture.enabled()) {
                    strings.push("//Texture Parameters ");
                    strings.push(this.texture.exportAsJavascript(sceneVarName, materialVarName));
                }

                if (strings.length > 0) {
                    strings.unshift("");
                    strings.unshift("// " + this.name + " definitions");
                    strings.unshift("");
                }

                return strings.join(";\n");
            };

            MaterialDefinitionSection.prototype.exportAsBabylonScene = function (materialObject) {
                var id = materialObject.id;
                if (this.hasColor) {
                    materialObject[this.name] = this.color.babylonColor.asArray();
                }
                if (this.hasTexture) {
                    if (this.texture.enabled()) {
                        materialObject[this.texture.propertyInMaterial] = this.texture.exportAsBabylonScene(id);
                    } else {
                        materialObject[this.texture.propertyInMaterial] = null;
                    }
                }
                if (this.hasFresnel && this.fresnel.fresnelVariable.isEnabled) {
                    materialObject[this.fresnel.propertyInMaterial] = this.fresnel.exportAsBabylonScene();
                }
            };
            return MaterialDefinitionSection;
        })();
        TextureEditor.MaterialDefinitionSection = MaterialDefinitionSection;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        TextureEditor.textureImage = [
            "$parse", function ($parse) {
                return {
                    restrict: 'E',
                    templateUrl: function (elem, attr) {
                        //return 'image-dnd-' + attr.amount + '.html';
                        //console.log(elem, attr);
                        return 'template/image-drag-drop.html';
                    },
                    scope: {
                        tex: '=',
                        updateTexture: '&onUpdateTexture'
                    },
                    transclude: true,
                    link: function (scope, element, attr) {
                        var texture = scope.tex;

                        function render(src, canvas, onSuccess) {
                            var image = new Image();
                            image.onload = function () {
                                var ctx = canvas.getContext("2d");

                                //todo use canvas.style.height and width to keep aspect ratio
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                var width = BABYLON.Tools.GetExponantOfTwo(image.width, 1024);
                                var height = BABYLON.Tools.GetExponantOfTwo(image.height, 1024);
                                var max = Math.max(width, height);
                                if (width > height) {
                                    image.width *= height / image.height;
                                    image.height = height;
                                } else {
                                    image.height *= width / image.width;
                                    image.width = width;
                                }

                                canvas.width = max;
                                canvas.height = max;
                                ctx.drawImage(image, 0, 0, max, max);
                                if (onSuccess) {
                                    onSuccess();
                                }
                            };
                            image.src = src;
                        }

                        function loadImage(src, canvas) {
                            //	Prevent any non-image file type from being read.
                            if (!src.type.match(/image.*/)) {
                                console.log("The dropped file is not an image: ", src.type);
                                return;
                            }

                            //	Create our FileReader and run the results through the render function.
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                texture.updateCanvasFromUrl(canvas, e.target.result, function () {
                                    if (scope.updateTexture) {
                                        scope.updateTexture({ $name: texture.name });
                                    }
                                });
                            };
                            reader.readAsDataURL(src);
                        }

                        //preparing for 6 images.
                        //for (var i = 0; i < 6; i++) {
                        //var pos = i;
                        element.on("dragover", ".texture-canvas-drop", function (e) {
                            e.preventDefault();
                        });
                        element.on("dragleave", ".texture-canvas-drop", function (e) {
                            e.preventDefault();
                        });
                        element.on("drop", ".texture-canvas-drop", function (e) {
                            e.preventDefault();
                            loadImage(e.originalEvent.dataTransfer.files[0], $(this).find("canvas")[0]);
                        });
                        //}
                    }
                };
            }];
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var TextureController = (function () {
            function TextureController($scope, canvasService, materialService) {
                this.$scope = $scope;
                this.canvasService = canvasService;
                this.materialService = materialService;
            }
            TextureController.$inject = [
                '$scope',
                'canvasService',
                'materialService'
            ];
            return TextureController;
        })();
        TextureEditor.TextureController = TextureController;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        var TextureDefinition = (function () {
            function TextureDefinition(name, _material, _connectedMesh, onSuccess) {
                var _this = this;
                this.name = name;
                this._material = _material;
                this._connectedMesh = _connectedMesh;
                //for ng-repeat
                this.getCanvasNumber = function () {
                    return new Array(_this.numberOfImages);
                };
                this.propertyInMaterial = this.name.toLowerCase() + "Texture";
                this.canvasId = this.name + "Canvas";
                this.numberOfImages = 1;
                if (this._material[this.propertyInMaterial]) {
                    if (this._material[this.propertyInMaterial] instanceof BABYLON.MirrorTexture) {
                        this.babylonTextureType = 4 /* MIRROR */;
                    } else if (this._material[this.propertyInMaterial] instanceof BABYLON.VideoTexture) {
                        this.babylonTextureType = 4 /* MIRROR */;
                    } else if (this._material[this.propertyInMaterial] instanceof BABYLON.CubeTexture) {
                        this.babylonTextureType = 3 /* CUBE */;
                    } else {
                        this.babylonTextureType = 1 /* NORMAL */;
                    }
                    this.initFromMaterial(onSuccess);
                } else {
                    this.babylonTextureType = 1 /* NORMAL */;
                    this.enabled(false);
                    this.init = false;

                    //clean canvas
                    var canvasElement = document.getElementById(this.canvasId + "-0");
                    if (canvasElement) {
                        var context = canvasElement.getContext("2d");
                        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            }
            TextureDefinition.prototype.initTexture = function () {
                if (this.textureVariable) {
                    this.textureVariable.dispose();
                }

                if (this.numberOfImages == 1) {
                    var canvasElement = document.getElementById(this.canvasId + "-0");
                    var base64 = canvasElement.toDataURL();
                    this.textureVariable = new BABYLON.Texture(base64, this._material.getScene(), false, undefined, undefined, undefined, undefined, base64, false);
                    if (this.name != "reflection") {
                        this.coordinatesMode(0 /* EXPLICIT */);
                    } else {
                        this.coordinatesMode(2 /* PLANAR */);
                    }
                    this.babylonTextureType = 1 /* NORMAL */;
                    this.init = true;
                } else {
                    var urls = [];
                    for (var i = 0; i < 6; i++) {
                        var canvasElement = document.getElementById(this.canvasId + "-" + i);
                        urls.push(canvasElement.toDataURL());
                    }
                    this.textureVariable = new BABYLON.ExtendedCubeTexture(urls, this._material.getScene(), false);
                    this.babylonTextureType = 3 /* CUBE */;
                    this.init = true;
                }
            };

            TextureDefinition.prototype.initFromMaterial = function (onSuccess) {
                var _this = this;
                this.textureVariable = this._material[this.propertyInMaterial];
                this.updateCanvas(function () {
                    _this.canvasUpdated();
                    _this.enabled(true);
                    if (onSuccess) {
                        onSuccess();
                    }
                });
            };

            TextureDefinition.prototype.coordinatesMode = function (mode) {
                if (angular.isDefined(mode)) {
                    var shouldInit = mode != 3 /* CUBIC */ && this.numberOfImages == 6;
                    this.textureVariable.coordinatesMode = mode;
                    if (mode === 3 /* CUBIC */) {
                        this.numberOfImages = 6;
                    } else {
                        this.numberOfImages = 1;
                    }
                    if (shouldInit) {
                        //this.initTexture();
                    }
                } else {
                    return this.textureVariable ? this.textureVariable.coordinatesMode : 0;
                }
            };

            TextureDefinition.prototype.mirrorEnabled = function (enabled) {
                if (angular.isDefined(enabled)) {
                    if (enabled) {
                        if (this.name != "reflection") {
                            throw new Error("wrong texture for mirror! Should be reflection!");
                        }
                        this.babylonTextureType = 4 /* MIRROR */;

                        //create the mirror
                        this.textureVariable = new BABYLON.MirrorTexture("mirrorTex", 512, this._material.getScene());
                        this.textureVariable['renderList'] = this._material.getScene().meshes;

                        //calculate plane
                        var pointsArray = [];

                        //TODO maybe find a different way of computing the plane? trying to avoid getting the object in the constructor.
                        var meshWorldMatrix = this._connectedMesh.computeWorldMatrix();
                        var verticesPos = this._connectedMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
                        for (var i = 0; i < 3; i++) {
                            pointsArray.push(BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(verticesPos, i * 3), meshWorldMatrix));
                        }
                        this.textureVariable['mirrorPlane'] = BABYLON.Plane.FromPoints(pointsArray[0], pointsArray[1], pointsArray[2]);
                        this.init = true;

                        //if (!this._isEnabled) {
                        this.enabled(true);
                        //}
                    } else {
                        this.babylonTextureType = 1 /* NORMAL */;
                        this._material[this.propertyInMaterial] = null;
                        this.init = false;
                        this.initTexture();
                    }
                } else {
                    return this._isEnabled && this.babylonTextureType == 4 /* MIRROR */;
                }
            };

            TextureDefinition.prototype.enabled = function (enabled) {
                if (angular.isDefined(enabled)) {
                    if (enabled) {
                        if (!this.init) {
                            this.initTexture();
                        }
                        if (this.textureVariable)
                            this._material[this.propertyInMaterial] = this.textureVariable;
                        this._isEnabled = true;

                        //update the canvas from the texture, is possible
                        this.updateCanvas();
                    } else {
                        this._material[this.propertyInMaterial] = null;
                        this._isEnabled = false;
                    }
                } else {
                    return this._isEnabled;
                }
            };

            TextureDefinition.prototype.canvasUpdated = function () {
                this.initTexture();
                if (this._isEnabled) {
                    this._material[this.propertyInMaterial] = this.textureVariable;
                }
            };

            TextureDefinition.prototype.getCanvasImageUrls = function (onUpdateSuccess) {
                var _this = this;
                var urls = [];
                if (!(this.textureVariable instanceof BABYLON.MirrorTexture || this.textureVariable instanceof BABYLON.CubeTexture)) {
                    this.updateCanvas(function () {
                        for (var i = 0; i < _this.numberOfImages; i++) {
                            var canvas = document.getElementById(_this.canvasId + "-" + i);
                            if (_this.getExtension() == ".png")
                                urls.push(canvas.toDataURL("image/png", 0.8));
                            else
                                urls.push(canvas.toDataURL("image/jpeg", 0.8));
                        }
                        if (urls.length == _this.numberOfImages) {
                            onUpdateSuccess(urls);
                        }
                    });
                }
            };

            TextureDefinition.prototype.updateCanvas = function (onSuccess) {
                if (this.textureVariable instanceof BABYLON.Texture) {
                    var texture = this.textureVariable;
                    var canvas = document.getElementById(this.canvasId + "-0");
                    this.updateCanvasFromUrl(canvas, texture.url, onSuccess);
                } else if (this.textureVariable instanceof BABYLON.ExtendedCubeTexture) {
                    var cubeTexture = this.textureVariable;

                    for (var i = 0; i < this.numberOfImages; i++) {
                        var canvas = document.getElementById(this.canvasId + "-" + i);
                        this.updateCanvasFromUrl(canvas, cubeTexture.urls[i], onSuccess);
                    }
                }
            };

            TextureDefinition.prototype.updateCanvasFromUrl = function (canvas, url, onSuccess) {
                if (!url) {
                    return;
                }
                var image = new Image();
                image.onload = function () {
                    var ctx = canvas.getContext("2d");

                    //todo use canvas.style.height and width to keep aspect ratio
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var width = BABYLON.Tools.GetExponantOfTwo(image.width, 1024);
                    var height = BABYLON.Tools.GetExponantOfTwo(image.height, 1024);
                    var max = Math.max(width, height);
                    if (width > height) {
                        image.width *= height / image.height;
                        image.height = height;
                    } else {
                        image.height *= width / image.width;
                        image.width = width;
                    }

                    canvas.width = max;
                    canvas.height = max;
                    ctx.drawImage(image, 0, 0, max, max);
                    if (onSuccess) {
                        onSuccess();
                    }
                };
                image.src = url;
            };

            //TODO implement video support etc'. At the moment only dynamic is supported.
            /*public setBabylonTextureType(type: BabylonTextureType) {
            this.babylonTextureType = type;
            if (type === BabylonTextureType.CUBE) {
            this.coordinatesMode(CoordinatesMode.CUBIC);
            }
            }*/
            TextureDefinition.prototype.exportAsJavascript = function (sceneVarName, materialVarName) {
                var _this = this;
                var strings = [];
                var varName = materialVarName + "_" + this.name + "Texture";

                //init the variable
                if (this.babylonTextureType == 4 /* MIRROR */) {
                    strings.push("var " + varName + " = new BABYLON.MirrorTexture('MirrorTexture', 512," + sceneVarName + " )");
                    var plane = this.textureVariable['mirrorPlane'];
                    var array = plane.asArray();
                    strings.push(varName + ".mirrorPlane = new BABYLON.Plane(" + array[0] + "," + array[1] + "," + array[2] + "," + array[3] + ")");
                    strings.push("// Change the render list to fit your needs. The scene's meshes is being used per default");
                    strings.push(varName + ".renderList = " + sceneVarName + ".meshes");
                } else if (this.babylonTextureType == 3 /* CUBE */) {
                    strings.push("//TODO change the root URL for your cube reflection texture!");
                    strings.push("var " + varName + " = new BABYLON.CubeTexture(rootUrl, " + sceneVarName + " )");
                } else {
                    strings.push("//TODO change the filename to fit your needs!");
                    strings.push("var " + varName + " = new BABYLON.Texture('textures/" + materialVarName + "_" + this.name + this.getExtension() + "', " + sceneVarName + ")");
                }

                //uvw stuff
                ["uScale", "vScale", "coordinatesMode", "uOffset", "vOffset", "uAng", "vAng", "level", "coordinatesIndex", "hasAlpha", "getAlphaFromRGB"].forEach(function (param) {
                    strings.push(varName + "." + param + " = " + _this.textureVariable[param]);
                });
                strings.push("");
                strings.push(materialVarName + "." + this.propertyInMaterial + " = " + varName);
                return strings.join(";\n");
            };

            TextureDefinition.prototype.exportAsBabylonScene = function (materialId) {
                var _this = this;
                var textureObject = {
                    name: "textures/" + materialId + "_" + this.name + this.getExtension()
                };
                ["uScale", "vScale", "coordinatesMode", "uOffset", "vOffset", "uAng", "vAng", "level", "coordinatesIndex", "hasAlpha", "getAlphaFromRGB"].forEach(function (param) {
                    textureObject[param] = _this.textureVariable[param];
                });

                return textureObject;
            };

            TextureDefinition.prototype.getExtension = function () {
                return this.textureVariable.hasAlpha ? ".png" : ".jpg";
            };
            return TextureDefinition;
        })();
        TextureEditor.TextureDefinition = TextureDefinition;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
var RW;
(function (RW) {
    (function (TextureEditor) {
        (function (BabylonTextureType) {
            BabylonTextureType[BabylonTextureType["DYNAMIC"] = 0] = "DYNAMIC";
            BabylonTextureType[BabylonTextureType["NORMAL"] = 1] = "NORMAL";
            BabylonTextureType[BabylonTextureType["VIDEO"] = 2] = "VIDEO";
            BabylonTextureType[BabylonTextureType["CUBE"] = 3] = "CUBE";
            BabylonTextureType[BabylonTextureType["MIRROR"] = 4] = "MIRROR";
        })(TextureEditor.BabylonTextureType || (TextureEditor.BabylonTextureType = {}));
        var BabylonTextureType = TextureEditor.BabylonTextureType;

        (function (CoordinatesMode) {
            //(0 = explicit, 1 spherical, 2 = planar, 3 = cubic, 4 = projection, 5 = skybox)
            CoordinatesMode[CoordinatesMode["EXPLICIT"] = 0] = "EXPLICIT";
            CoordinatesMode[CoordinatesMode["SPHERICAL"] = 1] = "SPHERICAL";
            CoordinatesMode[CoordinatesMode["PLANAR"] = 2] = "PLANAR";
            CoordinatesMode[CoordinatesMode["CUBIC"] = 3] = "CUBIC";
            CoordinatesMode[CoordinatesMode["PROJECTION"] = 4] = "PROJECTION";
        })(TextureEditor.CoordinatesMode || (TextureEditor.CoordinatesMode = {}));
        var CoordinatesMode = TextureEditor.CoordinatesMode;
    })(RW.TextureEditor || (RW.TextureEditor = {}));
    var TextureEditor = RW.TextureEditor;
})(RW || (RW = {}));
//# sourceMappingURL=application.js.map
