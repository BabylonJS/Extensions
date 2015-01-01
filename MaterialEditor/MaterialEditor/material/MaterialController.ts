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
        public errorMessage: string;

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

        public saveMaterial() {
            //todo get ID from server
            this.$http.get(MaterialController.ServerUrl + "/getNextId").success((idObject) => {
                var id = idObject['id'];
                var material = this.materialService.exportAsBabylonScene(id, this.$scope.materialDefinition);
                //upload material object
                this.$http.post(MaterialController.ServerUrl + "/materials", material).success((worked) => {
                    if (!worked['success']) {
                        this.errorMessage = "error uploading the material";
                    }
                    //upload binaries
                    this.$scope.materialDefinition.sectionNames.forEach((sectionName) => {
                        if (this.$scope.materialDefinition.materialSections[sectionName].hasTexture && this.$scope.materialDefinition.materialSections[sectionName].texture.enabled()) {
                            var textureDefinition = this.$scope.materialDefinition.materialSections[sectionName].texture;
                            textureDefinition.getCanvasImageUrls((urls) => {
                                if (urls.length == 1) {
                                    //textures will be uploaded async. The user should be notified about it!
                                    var obj = {}
                                    obj[id + '_' + textureDefinition.name + textureDefinition.getExtension()] = urls[0];
                                    this.$http.post(MaterialController.ServerUrl + "/textures", obj).success((worked) => {
                                        if (!worked['success']) {
                                            this.errorMessage = "error uploading the textures";
                                        }
                                    });
                                }
                            });
                        }
                    });
                    //update the UI
                    this.materialId = id;
                });
                
                
            });
            
        }

        public loadMaterial() {
            if (!this.materialId) {
                this.errorMessage = "please enter material id!";
                return;
            }
            this.errorMessage = null;
            this.canvasService.appendMaterial(this.materialId, () => {
                var material: BABYLON.Material = this.canvasService.getMaterial(this.materialId);
                //250 ms delay of material loading and scope apply so that the image can be loaded.
                //This can be avoided wit using callbacks all the way from the texture object (which will require quite a lot of changes).
                //I assume 250ms is enough to load a local image to the canvas.
                this.$timeout(() => {
                    //this.$scope.$apply(() => {
                    if (this.isMultiMaterial) {
                        (<BABYLON.MultiMaterial> this._object.material).subMaterials[this.multiMaterialPosition] = material;
                        this.initMaterial(true, () => { this.$scope.$apply() }, this.multiMaterialPosition);
                    } else {
                        this._object.material = material;
                        this.initMaterial(true, () => { this.$scope.$apply() });
                    }
                    //});   
                    //this.$scope.$apply(() => {
                    //    this.$scope.materialDefinition.sectionNames.forEach((section) => {
                    //        if (this.$scope.materialDefinition.materialSections[section].texture)
                    //            console.log(this.$scope.materialDefinition.materialSections[section].texture.enabled());
                    //    });
                    //});   
                });
                          
            }, () => {
                this.errorMessage = "error loading material, make sure the ID is correct";
            });
        }

        //for ng-repeat
        public getMaterialIndices = () => {
            return new Array(this.numberOfMaterials);
        }
    }
}