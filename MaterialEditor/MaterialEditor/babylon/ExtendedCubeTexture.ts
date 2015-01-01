module BABYLON {
    export class ExtendedCubeTexture extends BaseTexture {

        public coordinatesMode = BABYLON.Texture.CUBIC_MODE;

        private _textureMatrix: Matrix;

        constructor(public urls: Array<string>, scene: Scene, private _noMipmap: boolean) {
            super(scene);

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

        public clone(): ExtendedCubeTexture {
            var urls = [];
            this.urls.forEach((url) => {
                this.urls.push(url);
            });
            var newTexture = new BABYLON.ExtendedCubeTexture(urls, this.getScene(), this._noMipmap);

            // Base texture
            newTexture.level = this.level;
            newTexture.wrapU = this.wrapU;
            newTexture.wrapV = this.wrapV;
            newTexture.coordinatesIndex = this.coordinatesIndex;
            newTexture.coordinatesMode = this.coordinatesMode;

            return newTexture;
        }

        // Methods
        public delayLoad(): void {
            if (this.delayLoadState != BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }

            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
            
            if (!this._texture) {
                this._texture = this.createCubeTexture(this.urls, this._noMipmap, this.getScene(), this.urls);
            }
        }

        public getReflectionTextureMatrix(): Matrix {
            return this._textureMatrix;
        }

        //The parameters are here just in case I will ever move this function to the engine. The are private members of this class.
        //buffers is also redundant. buffers == urls ...
        public createCubeTexture(urls: Array<string>, noMipmap: boolean, scene: Scene, buffers?: Array<any>): WebGLTexture {
            if (urls.length != 6) {
                throw new Error("Not enough images to create a cube. Aborting.");
            }

            //avoiding errors in typescript trying to access a private member
            var engine = scene.getEngine();
            var gl: WebGLRenderingContext = engine['_gl'];

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

            var imagesArray: Array<HTMLImageElement> = [];

            var onError = () => {
                console.log("error loadig image");
            }

            var onImageLoadSuccess = (image: HTMLImageElement) => {
                imagesArray.push(image);
                if (imagesArray.length == 6) {
                    onImagesLoadSuccess(imagesArray);
                }
            }

            var onImagesLoadSuccess = (images: Array<HTMLImageElement>) => {
                var width = Tools.GetExponantOfTwo(images[0].width, engine.getCaps().maxCubemapTextureSize);
                var height = width;

                var canvas: HTMLCanvasElement = engine['_workingCanvas'];
                var context: CanvasRenderingContext2D = engine['_workingContext'];
                
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
            }

            //assuming 6 images. Already validated.
            for (var i = 0; i < 6; i++) {
                var url = urls[i];
                //taken from babylon engine createTexture
                var extension: string;
                var fromData: any = false;
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
        }

    }
} 