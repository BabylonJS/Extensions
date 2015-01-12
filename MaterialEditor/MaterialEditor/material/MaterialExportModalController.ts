module RW.TextureEditor {

    export interface MaterialModalScope extends ng.IScope {
        materialName: string;
        materialVariableName: string;
        sceneVariableName: string;
        materialExport: string;
        close: () => void;
        updateExport: () => void;
    }

    export class MaterialExportModlController {

        public static $inject = [
            '$scope',
            '$modalInstance',
            'materialDefinitions'
        ];

        constructor(private $scope: MaterialModalScope, private $modalInstance: any, private materialDefinitions: Array<MaterialDefinition>) {
            $scope.materialName = "my awsome material";
            $scope.materialVariableName = "myAwsomeMaterial";
            $scope.sceneVariableName = "myWonderfulScene";            

            $scope.close = () => {
                $modalInstance.close();
            }

            $scope.updateExport = () => {
                var strings: Array<string> = [];
                strings.push("//Material generated using raananw's babylon material editor, https://github.com/raananw/BabylonJS-Material-Editor ");
                strings.push("");
                var className = this.materialDefinitions.length > 1 ? "MultiMaterial" : "StandardMaterial";
                strings.push("var " + this.$scope.materialVariableName + " = new BABYLON." + className +"('" + this.$scope.materialName + "', " + this.$scope.sceneVariableName + ")");
                
                var exports: Array<string> = []

                exports.push(strings.join(";\n"));

                if (this.materialDefinitions.length == 1) {
                    
                    if (this.materialDefinitions[0].material instanceof BABYLON.StandardMaterial) {
                        var casted = <BABYLON.StandardMaterial> this.materialDefinitions[0].material;
                        ["alpha", "backFaceCulling", "specularPower", "useSpecularOverAlpha", "useAlphaFromDiffuseTexture"].forEach((param) => {
                            exports.push(this.$scope.materialVariableName + "." + param + " = " + casted[param]);
                        });
                    }
                    this.materialDefinitions[0].getMaterialSectionsArray().forEach((definition) => {
                        exports.push(this.materialDefinitions[0].materialSections[definition].exportToJavascript(this.$scope.sceneVariableName, this.$scope.materialName, this.$scope.materialVariableName));
                    });
                } else {
                    for (var i = 0; i < this.materialDefinitions.length; ++i) {
                        var matVarName = this.$scope.materialVariableName + "_" + i;
                        exports.push("var " + matVarName + " = new BABYLON.StandardMaterial('" + this.$scope.materialName + " " + i + "', " + this.$scope.sceneVariableName + ")");
                        if (this.materialDefinitions[i].material instanceof BABYLON.StandardMaterial) {
                            var casted = <BABYLON.StandardMaterial> this.materialDefinitions[0].material;
                            ["alpha", "backFaceCulling", "specularPower", "useSpecularOverAlpha", "useAlphaFromDiffuseTexture"].forEach((param) => {
                                exports.push(matVarName + "." + param + " = " + casted[param]);
                            });
                        }
                        this.materialDefinitions[0].getMaterialSectionsArray().forEach((definition) => {
                            exports.push(this.materialDefinitions[i].materialSections[definition].exportToJavascript(this.$scope.sceneVariableName, this.$scope.materialName + " " + i, matVarName));
                        });
                        exports.push(this.$scope.materialVariableName + ".subMaterials[" + i + "] = " + matVarName);
                    }
                }

                //TODO there must be a better way of formatting the text :) maybe a js beautifier?
                this.$scope.materialExport = exports.join(";\n").replace(/\n;\n/g, "\n\n").replace(/\n;\n/g, "\n\n").replace(/\n\n\n/g, "\n\n");

            }

            $scope.updateExport();
        }
    }
} 