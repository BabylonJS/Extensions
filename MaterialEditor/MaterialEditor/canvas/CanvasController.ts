
module RW.TextureEditor {

    export interface CanvasScope extends ng.IScope {
        lightConfigure: boolean;
        light: BABYLON.Light;
        lightSpecularColor: HexToBabylon;
        lightDiffuseColor: HexToBabylon;
    }

        export class CanvasController {

            public static $inject = [
                '$scope',
                '$timeout',
                '$modal',
                'canvasService'
            ];

            public objectTypes;
            public selectedObjectPosition;

            public lightTypes;
            public selectedLightType;

            public singleOutMesh: boolean;

            constructor(
                private $scope: CanvasScope,
                private $timeout: ng.ITimeoutService,
                private $modal,
                private canvasService:CanvasService
                ) {

                this.singleOutMesh = false;

                this.lightTypes = [
                    { name: 'Hemispheric', type: LightType.HEMISPHERIC },
                    { name: 'Point (in camera position)', type: LightType.POINT }
                ]

                this.selectedLightType = this.lightTypes[0];

                $scope.$on("sceneReset", () => {
                    $timeout(() => {
                        var meshes = canvasService.getObjects();
                        this.objectTypes = [];
                        for (var pos = 0; pos < meshes.length; pos++) {
                            this.objectTypes.push({ name: meshes[pos].name, value: pos });
                        };
                        var pos = 0;
                        this.selectedObjectPosition = this.objectTypes[pos];
                        this.objectSelected();
                        this.canvasService.sceneLoadingUI(false);
                    });
                });

                $scope.$on("objectChanged", (event, object: BABYLON.AbstractMesh, fromClick: boolean = false) => {
                    if (fromClick) {
                        $timeout(() => {
                            $scope.$apply(() => {
                                this.selectedObjectPosition = this.objectTypes.filter((map) => { return map.name === object.name })[0];
                            });
                        });
                    }
                });

                $scope.$on("lightChanged", (event, light: BABYLON.Light) => {
                    this.resetLightParameters(light);
                });

                $scope.lightConfigure = true;
                this.canvasService.resetScene();
                this.canvasService.initLight();
            }

            public resetLightParameters = (light: BABYLON.Light) => {
                this.$scope.light = light;
                this.$scope.lightSpecularColor = new HexToBabylon('specular', light, "");
                this.$scope.lightDiffuseColor = new HexToBabylon('diffuse', light, "");
            }

            public lightTypeChanged() {
                this.canvasService.initLight(this.selectedLightType.type);
            }

            public objectSelected = () => {
                //instead of disabled in select options which is not implemented
                while (!this.canvasService.selectObjectInPosition(this.selectedObjectPosition.value)) {
                    this.selectedObjectPosition = this.objectTypes[this.selectedObjectPosition.value + 1];
                };
                if(this.singleOutMesh)
                    this.singleOutChanged();
            }

            public fileAdded() {
                //taken from zipJS - http://gildas-lormeau.github.io/zip.js/demos/demo2.html
                //TODO angularize it!
                var fileInput = <HTMLInputElement> document.getElementById("scene-input");

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

                var sceneUrl: string;
                var binaries: Array<any> = [];
                var numberOfBinaries = 0;

                function endsWith(str, suffix) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                }

                model.getEntries(fileInput.files[0], (entries) => {
                    entries.forEach((entry) => {
                        if (endsWith(entry.filename, ".jpg") || endsWith(entry.filename, ".png")) {
                            numberOfBinaries++;
                        }
                    });

                    entries.forEach( (entry) => {
                        model.getEntryFile(entry, "Blob", (originalEntry, url) => {
                            if (endsWith(originalEntry.filename, ".babylon")) {
                                sceneUrl = url;
                            } else if (endsWith(originalEntry.filename, ".jpg") || endsWith(entry.filename, ".png")) {
                                binaries.push({ originalName: originalEntry.filename, newUrl: url });
                            }
                            if (binaries.length === numberOfBinaries && sceneUrl) {
                                this.canvasService.loadScene(sceneUrl, binaries);
                            }
                        }, function (progress) { })
                    });
                });
            }

            public resetScene() {
                this.canvasService.resetScene();
            }

            public objectSubMeshes() {
                var modalInstance = this.$modal.open({
                    templateUrl: 'objectSubMeshes.html',
                    controller: 'ObjectSubMeshesController',
                    size: "lg",
                    resolve: {
                        object: () => {
                            return this.canvasService.getObjectInPosition(this.selectedObjectPosition.value);
                        }
                    }
                });

                modalInstance.result.then(() => {
                    //update the object
                    this.objectSelected();
                }, function () {
                });
            }   

            public singleOutChanged() {
                this.canvasService.singleOut(this.singleOutMesh, this.selectedObjectPosition.value);
            } 

        }
    }