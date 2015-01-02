
module RW.TextureEditor {
    export class TextureDefinition {

        private _isEnabled: boolean;
        public init: boolean;
        public numberOfImages: number;
        public babylonTextureType: BabylonTextureType;
        public propertyInMaterial: string;
        public canvasId: string;

        private _isMirror: boolean;

        private _mirrorPlane: BABYLON.Plane;

        public textureVariable: BABYLON.BaseTexture;

        constructor(public name: string, private _material: BABYLON.Material, onSuccess?: () => void) {
            this.propertyInMaterial = this.name.toLowerCase() + "Texture";
            this.canvasId = this.name + "Canvas";
            this.numberOfImages = 1;
            this._mirrorPlane = new BABYLON.Plane(0, 0, 0, 0);
            if (this._material[this.propertyInMaterial]) {
                if (this._material[this.propertyInMaterial] instanceof BABYLON.MirrorTexture) {
                    this.babylonTextureType = BabylonTextureType.MIRROR;
                } else if (this._material[this.propertyInMaterial] instanceof BABYLON.VideoTexture) {
                    this.babylonTextureType = BabylonTextureType.MIRROR;
                } else if (this._material[this.propertyInMaterial] instanceof BABYLON.CubeTexture) {
                    this.babylonTextureType = BabylonTextureType.CUBE;
                } else {
                    this.babylonTextureType = BabylonTextureType.NORMAL;
                }
                this.initFromMaterial(onSuccess);
            } else {
                this.babylonTextureType = BabylonTextureType.NORMAL;
                this.enabled(false);
                this.init = false;
                //clean canvas
                var canvasElement = <HTMLCanvasElement> document.getElementById(this.canvasId + "-0");
                if (canvasElement) {
                    var context = canvasElement.getContext("2d");
                    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
                }
                if (onSuccess) {
                    onSuccess();
                }
            }
        }

        private initTexture() {
            if (this.textureVariable) {
                this.textureVariable.dispose();
            }
            
            if (this.numberOfImages == 1) {
                var canvasElement = <HTMLCanvasElement> document.getElementById(this.canvasId + "-0");
                var base64 = canvasElement.toDataURL();
                this.textureVariable = new BABYLON.Texture(base64, this._material.getScene(), false, undefined, undefined, undefined, undefined, base64, false);
                if (this.name != "reflection") {
                    this.coordinatesMode(CoordinatesMode.EXPLICIT);
                } else {
                    this.coordinatesMode(CoordinatesMode.PLANAR);
                }
                this.babylonTextureType = BabylonTextureType.NORMAL;
                this.init = true;
            } else {
                var urls = [];
                for (var i = 0; i < 6; i++) {
                    var canvasElement = <HTMLCanvasElement> document.getElementById(this.canvasId + "-"+i);
                    urls.push(canvasElement.toDataURL());
                }
                this.textureVariable = new BABYLON.ExtendedCubeTexture(urls, this._material.getScene(), false);
                this.babylonTextureType = BabylonTextureType.CUBE;
                this.init = true;
            }
        }

        private initFromMaterial(onSuccess?: () => void) {
            this.textureVariable = this._material[this.propertyInMaterial];
            this.updateCanvas(() => {
                this.canvasUpdated();
                this.enabled(true);
                if (onSuccess) {
                    onSuccess();
                }
            });
        }

        public coordinatesMode(mode: CoordinatesMode) {
            if (angular.isDefined(mode)) {
                
                var shouldInit: boolean = mode != CoordinatesMode.CUBIC && this.numberOfImages == 6;
                this.textureVariable.coordinatesMode = mode;
                if (mode === CoordinatesMode.CUBIC) {
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
        }

        public setMirrorPlane(plane: BABYLON.Plane) {
            //if (this.babylonTextureType == BabylonTextureType.MIRROR) {
            this._mirrorPlane.normal = plane.normal;
            this._mirrorPlane.d = plane.d;
            //}
        }

        public mirrorEnabled(enabled: boolean) {
            if (angular.isDefined(enabled)) {
                if (enabled) {
                    if (this.name != "reflection") {
                        throw new Error("wrong texture for mirror! Should be reflection!");
                    }
                    this.babylonTextureType = BabylonTextureType.MIRROR;
                    //create the mirror
                    this.textureVariable = new BABYLON.MirrorTexture("mirrorTex", 512, this._material.getScene());
                    this.textureVariable['renderList'] = this._material.getScene().meshes;
                    this.textureVariable['mirrorPlane'] = this._mirrorPlane;
                    this.init = true;
                    //if (!this._isEnabled) {
                        this.enabled(true);
                    //}
                } else {
                    this.babylonTextureType = BabylonTextureType.NORMAL;
                    this._material[this.propertyInMaterial] = null;
                    this.init = false;
                    this.initTexture();
                }
            } else {
                return this._isEnabled && this.babylonTextureType == BabylonTextureType.MIRROR;
            }
        }

        public enabled(enabled?: boolean) {
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
        }

        public canvasUpdated() {
            this.initTexture();
            if (this._isEnabled) {
                this._material[this.propertyInMaterial] = this.textureVariable;
            }
        }

        public getCanvasImageUrls(onUpdateSuccess : (urls:string[]) => void) {
            var urls = [];
            if (!(this.textureVariable instanceof BABYLON.MirrorTexture || this.textureVariable instanceof BABYLON.CubeTexture)) {
                this.updateCanvas(() => {
                    for (var i = 0; i < this.numberOfImages; i++) {
                        var canvas = <HTMLCanvasElement> document.getElementById(this.canvasId + "-" + i);
                        if (this.getExtension() == ".png")
                            urls.push(canvas.toDataURL("image/png", 0.8));
                        else
                            urls.push(canvas.toDataURL("image/jpeg", 0.8));
                    }
                    if (urls.length == this.numberOfImages) {
                        onUpdateSuccess(urls);
                    }
                });
            }
        }

        public updateCanvas(onSuccess?: () => void) {
            if (this.textureVariable instanceof BABYLON.Texture) {
                var texture = <BABYLON.Texture> this.textureVariable;
                var canvas = <HTMLCanvasElement> document.getElementById(this.canvasId + "-0");
                this.updateCanvasFromUrl(canvas, texture.url, onSuccess);
            } else if (this.textureVariable instanceof BABYLON.ExtendedCubeTexture) {
                var cubeTexture = <BABYLON.ExtendedCubeTexture> this.textureVariable;
                
                for (var i = 0; i < this.numberOfImages; i++) {
                    var canvas = <HTMLCanvasElement> document.getElementById(this.canvasId + "-" + i);
                    this.updateCanvasFromUrl(canvas, cubeTexture.urls[i], onSuccess);
                }
            }
        }

        public updateCanvasFromUrl(canvas: HTMLCanvasElement, url: string, onSuccess?: () => void) {
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
        }

        //TODO implement video support etc'. At the moment only dynamic is supported.

        /*public setBabylonTextureType(type: BabylonTextureType) {
            this.babylonTextureType = type;
            if (type === BabylonTextureType.CUBE) {
                this.coordinatesMode(CoordinatesMode.CUBIC);
            }
        }*/

        public exportAsJavascript(sceneVarName:string, materialVarName:string) : string {
            var strings: Array<string> = [];
            var varName = materialVarName + "_" + this.name + "Texture";

            //init the variable
            if (this.babylonTextureType == BabylonTextureType.MIRROR) {
                strings.push("var " + varName + " = new BABYLON.MirrorTexture('MirrorTexture', 512," + sceneVarName + " )");
                var plane: BABYLON.Plane = this.textureVariable['mirrorPlane'];
                var array = plane.asArray();
                strings.push(varName + ".mirrorPlane = new BABYLON.Plane(" + array[0] + "," + array[1] + "," + array[2] + "," + array[3] + ")");
                strings.push("// Change the render list to fit your needs. The scene's meshes is being used per default");
                strings.push(varName + ".renderList = " + sceneVarName + ".meshes");
            } else if (this.babylonTextureType == BabylonTextureType.CUBE) {
                strings.push("//TODO change the root URL for your cube reflection texture!");
                strings.push("var " + varName + " = new BABYLON.CubeTexture(rootUrl, " + sceneVarName + " )");
            } else {
                strings.push("//TODO change the filename to fit your needs!");
                strings.push("var " + varName + " = new BABYLON.Texture('textures/"+ materialVarName+ "_" + this.name + this.getExtension() +"', " + sceneVarName + ")");
            }
            //uvw stuff
            ["uScale", "vScale", "coordinatesMode", "uOffset", "vOffset", "uAng", "vAng", "level", "coordinatesIndex", "hasAlpha", "getAlphaFromRGB"].forEach((param) => {
                strings.push(varName + "." + param + " = " + this.textureVariable[param]);
            });
            strings.push("");
            strings.push(materialVarName + "."+this.propertyInMaterial+ " = " + varName);
            return strings.join(";\n");
        }

        public exportAsBabylonScene(materialId: string) {
            var textureObject = {
                name: "textures/" + materialId + "_" + this.name + this.getExtension()
            };
            ["uScale", "vScale", "coordinatesMode", "uOffset", "vOffset", "uAng", "vAng", "level", "coordinatesIndex", "hasAlpha", "getAlphaFromRGB"].forEach((param) => {
                textureObject[param] = this.textureVariable[param];
            });
            
            return textureObject;
        }

        public getExtension() {
            return this.textureVariable.hasAlpha ? ".png" : ".jpg";
        }

        //for ng-repeat
        public getCanvasNumber = () => {
            return new Array(this.numberOfImages);
        }
    }
} 