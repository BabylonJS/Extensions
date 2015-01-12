module RW.TextureEditor {

    export interface MaterialScope extends ng.IScope {
        //material: BABYLON.StandardMaterial;
        materialDefinition: MaterialDefinition;
        //sectionNames: string[];
        //materialSections: { [section: string]: MaterialDefinitionSection };
        updateTexture(type): void;
        mirrorEnabled: boolean;
    }
     
    /*
    TODO
        * Fix the alpha problem
        * Multi Material Javascript export.
    */
       
    export class MaterialController {

        public static $inject = [
            '$scope',
            '$modal',
            '$http',
            '$timeout',
            'canvasService',
            'materialService'
        ];

        public multiMaterialPosition: number;
        public numberOfMaterials: number;
        public isMultiMaterial: boolean;

        public materialId: string;
        public alerts = [];
        public progress;

        private _object: BABYLON.AbstractMesh;

        public static ServerUrl: string = "";
                
        constructor(
            private $scope: MaterialScope,
            private $modal: any /* modal from angular bootstrap ui */, 
            private $http: ng.IHttpService,
            private $timeout: ng.ITimeoutService,
            private canvasService: CanvasService,
            private materialService:MaterialService
            ) {
            this.isMultiMaterial = false;
            this.multiMaterialPosition = 0;
            this.numberOfMaterials = 0;
            this.progress = {
                enabled: false,
                value: 0,
                text:""
            }
            $scope.updateTexture = (type) => {
                $scope.$apply(() => {
                    $scope.materialDefinition.materialSections[type].texture.canvasUpdated();
                });
            }

            $scope.$on("objectChanged", this.afterObjectChanged);
        }

        public afterObjectChanged = (event: ng.IAngularEvent, object: BABYLON.AbstractMesh) => {
            //if object has no submeshes, do nothing. It is a null parent object. Who needs it?...
            if (object.subMeshes == null) return;

            //If an object has more than one subMesh, it means I have already created a multi material object for it.
            this._object = object;
            this.isMultiMaterial = object.subMeshes.length > 1;
            var force = false;
            if (this.isMultiMaterial) {
                this.numberOfMaterials = (<BABYLON.MultiMaterial> object.material).subMaterials.length;
                this.multiMaterialPosition = 0;
                force = true;
            } else {
                this.numberOfMaterials = 0;
                this.multiMaterialPosition = -1;
            }
            //force should be false, it is however true while a multi-material object needs to be always initialized.
            this.initMaterial(force, () => { this.$timeout(() => { this.$scope.$apply(); }) }, this.multiMaterialPosition);
        }

        public initMaterial(forceNew: boolean, onSuccess: () => void, position?:number) {
            //making sure it is undefined if it is not multi material.
            if (this.isMultiMaterial) {
                this.$scope.materialDefinition = this.materialService.initMaterialSections(this._object, forceNew, onSuccess, position);
            } else {
                this.$scope.materialDefinition = this.materialService.initMaterialSections(this._object, forceNew, onSuccess);
            }
        }

        public setPlaneForMirror() {
            console.log("setPlane");
            var pointsArray: Array<BABYLON.Vector3> = [];
            //TODO maybe find a different way of computing the plane? trying to avoid getting the object in the constructor.
            var meshWorldMatrix = this._object.computeWorldMatrix();
            var verticesPosition = this._object.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            //handle submeshes
            var offset = 0;
            if (this.isMultiMaterial) {
                offset = this._object.subMeshes[this.multiMaterialPosition].indexStart
            } 
            for (var i = 0; i < 3; i++) {
                var v = this._object.getIndices()[offset + i];
                pointsArray.push(BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(verticesPosition, v*3), meshWorldMatrix));
            }
            var plane = BABYLON.Plane.FromPoints(pointsArray[0], pointsArray[1], pointsArray[2]);
            this.$scope.materialDefinition.materialSections["reflection"].texture.setMirrorPlane(plane);
        }

        public exportMaterial() {
            var modalInstance = this.$modal.open({
                templateUrl: 'materialExport.html',
                controller: 'MaterialExportModalController',
                size: "lg",
                resolve: {
                    materialDefinitions: () => {
                        return this.materialService.getMaterialDefinisionsArray(this._object.id);
                    }
                }
            });
        }

        public updateProgress(enabled: boolean, text?: string, value?: number) {
            this.progress.enabled = enabled;
            this.progress.text = text;
            this.progress.value = value;
        }

        public saveMaterial() {
            //todo get ID from server
            this.updateProgress(true, "Saving...", 20);
            this.$http.get(MaterialController.ServerUrl + "/getNextId").success((idObject) => {
                var id = idObject['id'];
                var material = this.materialService.exportAsBabylonScene(id, this.$scope.materialDefinition);
                //upload material object
                this.updateProgress(true, "Received ID...", 40);
                this.$http.post(MaterialController.ServerUrl + "/materials", material).success((worked) => {
                    if (!worked['success']) {
                        this.alerts.push({ type: 'danger', msg: 'Error uploading to server.' });
                        this.updateProgress(false);
                        return;
                    }
                    //how many textures should be uploaded?
                    var textureSections = [];
                    this.$scope.materialDefinition.sectionNames.forEach((sectionName) => {
                        if (this.$scope.materialDefinition.materialSections[sectionName].hasTexture && this.$scope.materialDefinition.materialSections[sectionName].texture.enabled()) {
                            var textureDefinition = this.$scope.materialDefinition.materialSections[sectionName].texture;
                            if (textureDefinition.babylonTextureType == BabylonTextureType.NORMAL) {
                                textureSections.push(sectionName);
                            }
                        }
                    });
                    if (textureSections.length == 0) {
                        this.updateProgress(false);
                        this.alerts.push({ type: 'success', msg: "Material stored. " });
                        this.$timeout(() => {
                            this.alerts.pop();
                        }, 5000);
                        //update the UI
                        this.materialId = id;
                    } else {
                        var texturesUploaded = 0;
                        this.updateProgress(true, "Uploading textures...", 50);
                        textureSections.forEach((sectionName) => {
                            if (this.$scope.materialDefinition.materialSections[sectionName].hasTexture && this.$scope.materialDefinition.materialSections[sectionName].texture.enabled()) {
                                var textureDefinition = this.$scope.materialDefinition.materialSections[sectionName].texture;
                                if (textureDefinition.babylonTextureType == BabylonTextureType.NORMAL) {
                                    textureDefinition.getCanvasImageUrls((urls) => {
                                        //if (urls.length == 1) {
                                            //textures will be uploaded async. The user should be notified about it!
                                            var obj = {};
                                            obj[id + '_' + textureDefinition.name + textureDefinition.getExtension()] = urls[0];
                                            this.$http.post(MaterialController.ServerUrl + "/textures", obj).success((worked) => {
                                                if (!worked['success']) {
                                                    this.alerts.push({ type: 'danger', msg: "error uploading the texture " + textureDefinition.name });
                                                    this.updateProgress(false);
                                                }

                                                texturesUploaded++;
                                                this.updateProgress(true, "Uploading textures...", 50 + (texturesUploaded * 10));
                                                if (texturesUploaded == textureSections.length) {
                                                    this.updateProgress(false);
                                                    this.alerts.push({ type: 'success', msg: "Material stored." });
                                                    this.$timeout(() => {
                                                        this.alerts.pop();
                                                    }, 5000);
                                                    this.materialId = id;
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
        }

        public loadMaterial() {
            if (!this.materialId) {
                this.alerts.push({ type: 'warning', msg: "Please enter an ID" });
                return;
            }
            this.updateProgress(true, "Loading material...", 30);
            //babylon doesn't check for 404 for some reason, doing it on my own. File will be loaded twice! TODO fix it in BABYLON!
            this.$http.get(MaterialController.ServerUrl + "/materials/" + this.materialId + ".babylon").error(() => {
                this.alerts.push({ type: 'danger', msg: "Material could not be loaded. Check the ID." });
                this.updateProgress(false);
            }).success(() => {
                this.canvasService.appendMaterial(this.materialId, () => {
                    var material: BABYLON.Material = this.canvasService.getMaterial(this.materialId);
                    var success = () => {
                        if (this.alerts.length < 1)
                            this.alerts.push({ type: 'success', msg: "Material loaded." });
                        this.$timeout(() => {
                            this.alerts.pop();
                        }, 5000);
                        this.updateProgress(false);
                        this.$scope.$apply();
                    }
                this.$timeout(() => {
                        if (this.isMultiMaterial) {
                            (<BABYLON.MultiMaterial> this._object.material).subMaterials[this.multiMaterialPosition] = material;
                            this.initMaterial(true, success, this.multiMaterialPosition);
                        } else {
                            this._object.material = material;
                            this.initMaterial(true, success);
                        }
                    });

                }, (progress) => {
                        this.updateProgress(true, "Loading material...", 60);
                    }, (error) => {
                        console.log(error);
                        this.alerts.push({ type: 'danger', msg: "Material could not be loaded. Check the ID." });
                        this.updateProgress(false);
                    });
            });
            
        }

        public closeAlert(index) {
            this.alerts.splice(index, 1);
        }

        //for ng-repeat
        public getMaterialIndices = () => {
            return new Array(this.numberOfMaterials);
        }
    }
}