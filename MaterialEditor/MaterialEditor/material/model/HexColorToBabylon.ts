module RW.TextureEditor {

    export class HexToBabylon {
        public babylonColor: BABYLON.Color3;
        private _hex: string;
        constructor(public propertyName: string, private _variable: any, addedString:string = "Color") {
            this.propertyName += addedString;
            this._setBabylonColor(_variable[this.propertyName]);
        }

        //angular getter/setter
        public hex(hex?: string) {
            if (hex) {
                this._hex = hex;
                this.babylonColor = this.convertStringToBabylonArray(this._hex);
                if (this.babylonColor) {
                    this._variable[this.propertyName] = this.babylonColor;
                }
            } else {
                return this._hex;
            }
        }

        private _setBabylonColor(color: BABYLON.Color3) {
            this.babylonColor = color;
            var hex = "#";
            ['r', 'g', 'b'].forEach((channel) => {
                var c = ~~(color[channel] * 255);
                hex = hex + ((c < 16) ? "0" + c.toString(16) : "" + c.toString(16));
            });

            this._hex = hex;
        }

        private convertStringToBabylonArray(hex: string): BABYLON.Color3 {
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
        }
    }
} 