module RW.TextureEditor {

    export class MaterialDefinition {
        public material: BABYLON.Material;
        public materialSections: { [section: string]: MaterialDefinitionSection };
        public sectionNames: Array<string>;

        
        constructor(material: BABYLON.Material, onSuccess?: () => void) {
            this.sectionNames = ["diffuse", "emissive", "ambient", "opacity", "specular", "reflection", "bump"]
            this.initFromMaterial(material, onSuccess);
        }

        public initFromMaterial(material: BABYLON.Material, onSuccess?: () => void) {
            this.material = material;
            this.materialSections = {};
            this.materialSections["diffuse"] = new MaterialDefinitionSection("diffuse", true, true, true, material, onSuccess);
            this.materialSections["emissive"] = new MaterialDefinitionSection("emissive", true, true, true, material, onSuccess);
            this.materialSections["ambient"] = new MaterialDefinitionSection("ambient", true, true, false, material, onSuccess);
            this.materialSections["opacity"] = new MaterialDefinitionSection("opacity", false, true, true, material, onSuccess);
            this.materialSections["specular"] = new MaterialDefinitionSection("specular", true, true, false, material, onSuccess);
            this.materialSections["reflection"] = new MaterialDefinitionSection("reflection", false, true, true, material, onSuccess);
            this.materialSections["bump"] = new MaterialDefinitionSection("bump", false, true, false, material, onSuccess);
        }

        public getMaterialSectionsArray(): string[] {
            return this.sectionNames;
        }

        public getMaterialSections(): { [section: string]: MaterialDefinitionSection } {
            return this.materialSections;
        }

        public exportAsBabylonScene(materialId: string) {
            var materialObject = {
                id: materialId,
                name: materialId,

            };
            if (this.material instanceof BABYLON.StandardMaterial) {
                var casted = <BABYLON.StandardMaterial> this.material;
                materialObject['alpha'] = casted.alpha,
                materialObject['backFaceCulling'] = casted.backFaceCulling,
                materialObject['specularPower'] = casted.specularPower,
                materialObject['useSpecularOverAlpha'] = casted.useSpecularOverAlpha,
                materialObject['useAlphaFromDiffuseTexture'] = casted.useAlphaFromDiffuseTexture
            }
            this.getMaterialSectionsArray().forEach((definition) => {
                this.materialSections[definition].exportAsBabylonScene(materialObject);
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
            }

            return babylonScene;
        }
    }

    export class MaterialService {
        public static $inject = [
            '$rootScope',
            'canvasService'
        ]  

        //prepared for multi materials
        private materialDefinisions: { [section: string]: Array<MaterialDefinition> }
        
        constructor(private $rootScope: TextureEditorRootScope, private canvasService: CanvasService) {
            this.materialDefinisions = {}
        }

        public initMaterialSections(object: BABYLON.AbstractMesh, forceNew: boolean, onSuccess?: () => void, multiMaterialPosition?: number): MaterialDefinition {

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
        }

        public getMaterialDefinisionsArray(objectId: string) {
            return this.materialDefinisions[objectId];
        }

        private createNewMaterialDefinition(object: BABYLON.AbstractMesh, onSuccess: () => void, multiMaterialPosition?: number): MaterialDefinition {
            var material: BABYLON.Material;
            if (angular.isDefined(multiMaterialPosition)) {
                material = (<BABYLON.MultiMaterial> object.material).subMaterials[multiMaterialPosition];
            } else {
                material = object.material;
            }

            return new MaterialDefinition(material, onSuccess);
        }

        public exportAsBabylonScene(materialId: string, materialDefinition: MaterialDefinition) {
            return materialDefinition.exportAsBabylonScene(materialId);
        }
    }
} 