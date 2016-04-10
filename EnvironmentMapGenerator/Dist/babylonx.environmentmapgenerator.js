/// <reference path="../Libs/babylon.d.ts"/>
var BABYLONX;
(function (BABYLONX) {
    /**
     * EnvironmentMapGenerator is the helper class used in the little tool.
     *
     * It basically takes care of attaching events and managing what happens in the application.
     * This could have entirely done in js but TS is Fun :-)
     */
    var EnvironmentMapGenerator = (function () {
        /**
         * Main constructor of the tool.
         * @param canvas The Canvas to host the texture display.
         * @param sizeField The parameter field storing the target size of the texture.
         * @param outputPanel The panel displaying the result of the conversion.
         */
        function EnvironmentMapGenerator(canvas, sizeField, outputPanel) {
            this._canvas = canvas;
            this._sizeField = sizeField;
            this._outputPanel = outputPanel;
            this._sphereMaterials = [];
        }
        /**
         * Runs the application.
         */
        EnvironmentMapGenerator.prototype.run = function () {
            var _this = this;
            this._outputPanel.style.display = "none";
            this._bjs = new BABYLON.Engine(this._canvas);
            this.prepareScene();
            // File Input listener.
            new BABYLONX.FilesInput(this._canvas, function (fileNames) {
                _this.convert(fileNames[0]);
            });
        };
        /**
         * Prepares a BJS scene to demo the result of the convertion.
         */
        EnvironmentMapGenerator.prototype.prepareScene = function () {
            var _this = this;
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
            var createMesh = function (x, z, reflectivity, glossiness) {
                // Creation of a sphere
                var sphere = BABYLON.Mesh.CreateSphere("Sphere_x_" + x + "_z_" + z, 10.0, 9.0, _this._scene);
                sphere.position.z = z;
                sphere.position.x = x;
                // Creation of a material
                var materialSphere = new BABYLON.PBRMaterial("Material_x_" + x + "_z_" + z, _this._scene);
                materialSphere.reflectionTexture = hdrTexture;
                materialSphere.albedoColor = new BABYLON.Color3(0.2, 0.9, 1.0);
                materialSphere.reflectivityColor = new BABYLON.Color3(reflectivity, reflectivity, reflectivity);
                materialSphere.microSurface = glossiness;
                materialSphere.usePhysicalLightFalloff = false;
                // Attach the material to the sphere
                sphere.material = materialSphere;
                _this._sphereMaterials.push(materialSphere);
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
            this._bjs.runRenderLoop(function () {
                _this._scene.render();
            });
        };
        /**
         * Converts the dropped texture and apply it to the scene.
         * @param fileName The name of the file dropped to convert.
         */
        EnvironmentMapGenerator.prototype.convert = function (fileName) {
            var _this = this;
            if (fileName && fileName.toLowerCase().indexOf('.hdr') <= 0) {
                return;
            }
            this._outputPanel.style.display = 'block';
            setTimeout(function () { _this.convertContent(fileName); }, 100);
        };
        /**
         * Converts the dropped texture and apply it to the scene. Only the content in this method.
         * @param fileName The name of the file dropped to convert.
         */
        EnvironmentMapGenerator.prototype.convertContent = function (fileName) {
            var _this = this;
            // Create the source file path.
            var hdrPath = "file:" + fileName;
            var sizeInString = this._sizeField.value;
            var size = +sizeInString;
            var textureCallback = function (buffer) {
                var data = new Blob([buffer], { type: 'application/octet-stream' });
                // Returns a URL you can use as a href.
                var url = window.URL.createObjectURL(data);
                // Change the internal skybox.
                var newTexture = new BABYLON.HDRCubeTexture(url, _this._scene);
                // Switch textures.
                var oldTexture = _this._hdrSkyboxMaterial.reflectionTexture;
                _this._hdrSkyboxMaterial.reflectionTexture = newTexture;
                _this._hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                _this._sphereMaterials.forEach(function (material) {
                    material.reflectionTexture = newTexture;
                });
                oldTexture.dispose();
                // Simulates a link to it and click to dowload.
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style.display = "none";
                a.href = url;
                var newName = fileName.replace(".hdr", ".babylon.hdr");
                a.download = newName;
                a.click();
                // Unhide the please wait message.
                _this._outputPanel.style.display = 'none';
            };
            BABYLON.HDRCubeTexture.generateBabylonHDR(hdrPath, size, textureCallback, function () {
                alert("An error occured during load.");
            });
        };
        return EnvironmentMapGenerator;
    })();
    BABYLONX.EnvironmentMapGenerator = EnvironmentMapGenerator;
})(BABYLONX || (BABYLONX = {}));

/// <reference path="../Libs/babylon.d.ts"/>
var BABYLONX;
(function (BABYLONX) {
    /**
     * The class responsible to watch input files through drag and drop.
     */
    var FilesInput = (function () {
        /**
         * Constructor.
         * @param elementToMonitor The html element to monitor for drop.
         * @param loadCallback The callback launched when a file has been loaded.
         */
        function FilesInput(elementToMonitor, loadCallback) {
            var _this = this;
            this._loadCallback = null;
            if (elementToMonitor) {
                this._elementToMonitor = elementToMonitor;
                this._elementToMonitor.addEventListener("dragenter", function (e) { _this._drag(e); }, false);
                this._elementToMonitor.addEventListener("dragover", function (e) { _this._drag(e); }, false);
                this._elementToMonitor.addEventListener("drop", function (e) { _this._drop(e); }, false);
            }
            this._loadCallback = loadCallback;
        }
        /**
         * Function triggered on drag on the watched element.
         * @param e the drag event.
         */
        FilesInput.prototype._drag = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        /**
         * Function triggered on drop on the watched element.
         * @param eventDrop the drop event.
         */
        FilesInput.prototype._drop = function (eventDrop) {
            eventDrop.stopPropagation();
            eventDrop.preventDefault();
            this._loadFiles(eventDrop);
        };
        /**
         * Load the list of dropped files in the cache.
         * @param event the drop event.
         */
        FilesInput.prototype._loadFiles = function (event) {
            // Handling data transfer via drag'n'drop
            if (event && event.dataTransfer && event.dataTransfer.files) {
                this._filesToLoad = event.dataTransfer.files;
            }
            // Handling files from input files
            if (event && event.target && event.target.files) {
                this._filesToLoad = event.target.files;
            }
            // Add the file to the know babylon file list.
            var fileNames = [];
            if (this._filesToLoad && this._filesToLoad.length > 0) {
                for (var i = 0; i < this._filesToLoad.length; i++) {
                    BABYLON.FilesInput.FilesToLoad[this._filesToLoad[i].name] = this._filesToLoad[i];
                    fileNames.push(this._filesToLoad[i].name);
                }
            }
            // Trigger callback if required.
            if (this._loadCallback) {
                this._loadCallback(fileNames);
            }
        };
        return FilesInput;
    })();
    BABYLONX.FilesInput = FilesInput;
})(BABYLONX || (BABYLONX = {}));
