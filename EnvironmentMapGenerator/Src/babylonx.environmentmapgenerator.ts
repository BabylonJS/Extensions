/// <reference path="../Libs/babylon.d.ts"/>

module BABYLONX {
    
    /**
     * EnvironmentMapGenerator is the helper class used in the little tool.
     * 
     * It basically takes care of attaching events and managing what happens in the application.
     * This could have entirely done in js but TS is Fun :-)
     */
    export class EnvironmentMapGenerator {
        
        private _canvas: HTMLCanvasElement;        
        private _sizeField: HTMLInputElement;        
        private _outputPanel: HTMLDivElement;
        
        private _bjs: BABYLON.Engine;        
        private _scene: BABYLON.Scene;
        private _hdrSkyboxMaterial: BABYLON.PBRMaterial;        
        private _sphereMaterials: BABYLON.PBRMaterial[];
        
        /**
         * Main constructor of the tool.
         * @param canvas The Canvas to host the texture display.
         * @param sizeField The parameter field storing the target size of the texture.
         * @param outputPanel The panel displaying the result of the conversion.
         */     
        constructor(canvas: HTMLCanvasElement, sizeField: HTMLInputElement, outputPanel: HTMLDivElement) {
            this._canvas = canvas;
            this._sizeField = sizeField;
            this._outputPanel = outputPanel;
            this._sphereMaterials = [];
        }
        
        /**
         * Runs the application.
         */
        private run() : void {
            this._outputPanel.style.display = "none";
            this._bjs = new BABYLON.Engine(this._canvas);
            
            this.prepareScene();
            
            // File Input listener.
            new BABYLONX.FilesInput(this._canvas, (fileNames: string[]) => {
                this.convert(fileNames[0]);
            });
        }
        
        /**
         * Prepares a BJS scene to demo the result of the convertion.
         */
        private prepareScene() : void {
            this._scene = new BABYLON.Scene(this._bjs);
            
            //Create an Arc Rotate Camera - aimed negative z this time
            var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 1.0, 110, BABYLON.Vector3.Zero(), this._scene);
            camera.attachControl(this._canvas, true);

            //Create a light
            var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(60, 60, 80), this._scene);

            // Environment Texture
            var hdrTexture = new BABYLON.HDRCubeTexture("TextureSample/environment.babylon.hdr", this._scene);
            
            // Skybox
            var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, this._scene);
            this._hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", this._scene);
            this._hdrSkyboxMaterial.backFaceCulling = false;
            this._hdrSkyboxMaterial.reflectionTexture = hdrTexture;
            this._hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            this._hdrSkyboxMaterial.microSurface = 1.0;
            this._hdrSkyboxMaterial.disableLighting = true;
            hdrSkybox.material = this._hdrSkyboxMaterial;
            hdrSkybox.infiniteDistance = true;
            
            // Mesh Creation function
            var createMesh = (x, z, reflectivity, glossiness) => {
                // Creation of a sphere
                var sphere = BABYLON.Mesh.CreateSphere("Sphere_x_" + x +"_z_" + z, 10.0, 9.0, this._scene);
                sphere.position.z = z;
                sphere.position.x = x;
                
                // Creation of a material
                var materialSphere = new BABYLON.PBRMaterial("Material_x_" + x +"_z_" + z, this._scene);
                materialSphere.reflectionTexture = hdrTexture;
                materialSphere.albedoColor = new BABYLON.Color3(0.2, 0.9, 1.0);
                materialSphere.reflectivityColor = new BABYLON.Color3(reflectivity, reflectivity, reflectivity);
                materialSphere.microSurface = glossiness;
                materialSphere.usePhysicalLightFalloff  = false;

                // Attach the material to the sphere
                sphere.material = materialSphere;
                this._sphereMaterials.push(materialSphere);

                // Change rendering group to not conflict with the skybox
                sphere.renderingGroupId = 1;
            };

            // Dynamically create a 6*6 ranges of sphere demoing most of the 
            // reflectivity glossiness combinaisons.	
            var x = 38;
            for (var i = 0; i < 6; i++) {
                var reflectivity = i / 5;
                var z = -55; 
                for (var j = 0; j < 6; j++) {
                    var glossiness = j / 5;
                    createMesh(x, z, reflectivity, glossiness);			
                    z = z + 15;
                }	
                x = x - 15;
            }
            
            // Renders the scene.
            this._bjs.runRenderLoop(() => {
                this._scene.render();
            });
        }
        
        /**
         * Converts the dropped texture and apply it to the scene.
         * @param fileName The name of the file dropped to convert.
         */
        private convert(fileName: string) : void {
            if (fileName && fileName.toLowerCase().indexOf('.hdr') <= 0) {
                return;
            }
            
            this._outputPanel.style.display = 'block';
            
            setTimeout(() => { this.convertContent(fileName); }, 100);
        }
        
        /**
         * Converts the dropped texture and apply it to the scene. Only the content in this method.
         * @param fileName The name of the file dropped to convert.
         */
        private convertContent(fileName: string) : void {
            
            // Create the source file path.
            var hdrPath = "file:" + fileName;
            var sizeInString = this._sizeField.value;
            var size = +sizeInString;
            
            var textureCallback = (buffer: any) => {
                var data = new Blob([buffer], { type: 'application/octet-stream' });

                // Returns a URL you can use as a href.
                var url = window.URL.createObjectURL(data);
                
                // Change the internal skybox.
                var newTexture = new BABYLON.HDRCubeTexture(url, this._scene);
                
                // Switch textures.
                var oldTexture = this._hdrSkyboxMaterial.reflectionTexture;
                this._hdrSkyboxMaterial.reflectionTexture = newTexture;
                this._hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                this._sphereMaterials.forEach((material) => {
                    material.reflectionTexture = newTexture;
                });   
                oldTexture.dispose();
                
                // Simulates a link to it and click to dowload.
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style.display = "none";
                a.href = url;
                var newName = fileName.replace(".hdr", ".babylon.hdr");
                (<any>a).download = newName;
                a.click();
                
                // Unhide the please wait message.
                this._outputPanel.style.display = 'none';
            };
            
            BABYLON.HDRCubeTexture.generateBabylonHDR(hdrPath, size, textureCallback, function() {
                alert("An error occured during load.");
            });
        }
    }
}