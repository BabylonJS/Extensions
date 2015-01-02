module RW.TextureEditor {
    export class MaterialDefinitionSection {
        public materialId:string;
        public color: HexToBabylon;
        public fresnel: FresnelDefinition;
        public texture: TextureDefinition;
        constructor(public name: string, public hasColor, public hasTexture, public hasFresnel, public material: BABYLON.Material, onSuccess?: () => void) {
            /*var material: BABYLON.Material;
            if (angular.isDefined(multiMaterialPosition)) {
                material = (<BABYLON.MultiMaterial> _object.material).subMaterials[multiMaterialPosition];
            } else {
                material = _object.material;
            }*/
            if (hasColor) {
                this.color = new HexToBabylon(name, material);
            }
            if (hasTexture) {
                this.texture = new TextureDefinition(name, material, onSuccess);
            }
            if (hasFresnel) {
                this.fresnel = new FresnelDefinition(name, material);
            }
        }

        public exportToJavascript(sceneVarName:string, materialName:string, materialVarName:string) : string {
            var strings: Array<string> = [];

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
        }

        public exportAsBabylonScene(materialObject:any) {
            var id = materialObject.id;
            if(this.hasColor) {
                materialObject[this.name] = this.color.babylonColor.asArray();
            }
            if (this.hasTexture) {
                if(this.texture.enabled()) {
                    materialObject[this.texture.propertyInMaterial] = this.texture.exportAsBabylonScene(id);
                } else {
                    materialObject[this.texture.propertyInMaterial] = null;
                }
            }
            if (this.hasFresnel && this.fresnel.fresnelVariable.isEnabled) {
                materialObject[this.fresnel.propertyInMaterial] = this.fresnel.exportAsBabylonScene();
            }
        }
    }
} 