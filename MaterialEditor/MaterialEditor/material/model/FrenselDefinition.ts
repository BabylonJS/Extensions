module RW.TextureEditor {
    export class FresnelDefinition {
        public leftColor: HexToBabylon;
        public rightColor: HexToBabylon;

        public propertyInMaterial;

        public fresnelVariable: BABYLON.FresnelParameters;

        constructor(private name: string, _material: BABYLON.Material) {
            this.propertyInMaterial = name + 'FresnelParameters';
            if (_material[this.propertyInMaterial]) {
                this.fresnelVariable = _material[this.propertyInMaterial];
            } else {
                this.fresnelVariable = new BABYLON.FresnelParameters();
                this.fresnelVariable.isEnabled = false;
                _material[this.propertyInMaterial] = this.fresnelVariable;
            }
            this.leftColor = new HexToBabylon("left", _material[this.propertyInMaterial]),
            this.rightColor = new HexToBabylon("right", _material[this.propertyInMaterial])

        }

        public exportAsJavascript(materialVarName: string) : string {
            var strings: Array<string> = [];
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
        }

        public exportAsBabylonScene() {
            return {
                bias: this.fresnelVariable.bias,
                power: this.fresnelVariable.power,
                isEnabled: this.fresnelVariable.isEnabled,
                leftColor: this.fresnelVariable.leftColor.asArray(),
                rightColor: this.fresnelVariable.rightColor.asArray()
            }
        }
    }
} 