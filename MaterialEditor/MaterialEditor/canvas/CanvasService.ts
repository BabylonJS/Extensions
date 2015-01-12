module RW.TextureEditor {

    export class CanvasService {
        public static $inject = [
            '$rootScope'
        ]

        private _canvasElement: HTMLCanvasElement;
        private _engine: BABYLON.Engine;
        private _scene: BABYLON.Scene;
        private _textureObject: BABYLON.AbstractMesh;
        private _light: BABYLON.Light;
        private _camera: BABYLON.ArcRotateCamera;
        
        constructor(private $rootScope: TextureEditorRootScope) {
            this._canvasElement = <HTMLCanvasElement> document.getElementById("renderCanvas");
            this._engine = new BABYLON.Engine(this._canvasElement);
            this._scene = new BABYLON.Scene(this._engine);

            this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 10, 0.8, 30, new BABYLON.Vector3(0, 0, 0), this._scene);
            this._camera.wheelPrecision = 20;

            this._camera.attachControl(this._canvasElement, false);


            this._engine.runRenderLoop(() => {
                this._scene.render();
            });

            window.addEventListener("resize", () => {
                this._engine.resize();
            });

            this._scene.registerBeforeRender(() => {
                
            });

        }
        
        public getLight(): BABYLON.Light {
            return this._light;
        }
        
        public updateTexture(property: string, texture: BABYLON.Texture) {
            this._textureObject.material[property] = texture;
        }

        public loadScene(sceneBlob: string, binaries: Array<any>) {
            while (this._scene.meshes.pop()) { }
            BABYLON.Tools.LoadFile(sceneBlob, (data:string) => {
                binaries.forEach((binary) => {
                    var re = new RegExp(binary.originalName, "g");
                    data = data.replace(re, binary.newUrl);
                });
                BABYLON.SceneLoader.ImportMesh("", "", "data:" + data, this._scene, (meshes: BABYLON.AbstractMesh[]) => {
                    meshes.forEach((mesh) => {
                        if(!mesh.material)
                            mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", this._scene);
                        mesh.actionManager = new BABYLON.ActionManager(this._scene);
                        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "renderOutline", false));
                        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "renderOutline", true));
                        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, (evt: BABYLON.ActionEvent) => {
                            this.selectObject(mesh, true);
                        }));
                    });
                    this.$rootScope.$broadcast("sceneReset");
                });
            });
            
        }

        public resetScene() {
            for (var i = this._scene.meshes.length - 1; i > -1; i--) {
                this._scene.meshes[i].dispose();
            }
            this.createDefaultScene();
            this.$rootScope.$broadcast("sceneReset");
        }

        private createDefaultScene() {
            //taken shamelessly from babylon's playground! 
            var scene = this._scene;

            var box = BABYLON.Mesh.CreateBox("Box", 6.0, scene);
            var sphere = BABYLON.Mesh.CreateSphere("Sphere", 10.0, 10.0, scene);
            var plan = BABYLON.Mesh.CreatePlane("Plane", 10.0, scene);
            var cylinder = BABYLON.Mesh.CreateCylinder("Cylinder", 3, 3, 3, 6, 1, scene);
            var torus = BABYLON.Mesh.CreateTorus("Torus", 5, 1, 10, scene);
            var knot = BABYLON.Mesh.CreateTorusKnot("Knot", 2, 0.5, 128, 64, 2, 3, scene);
                        
            box.position = new BABYLON.Vector3(-10, 0, 0);   
            sphere.position = new BABYLON.Vector3(0, 10, 0); 
            plan.position.z = 10;                            
            cylinder.position.z = -10;
            torus.position.x = 10;
            knot.position.y = -10;

            //add actions to each object (hover, select)
            scene.meshes.forEach((mesh) => {
                mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", this._scene);
                mesh.actionManager = new BABYLON.ActionManager(this._scene);
                mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "renderOutline", false));
                mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "renderOutline", true));
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, (evt: BABYLON.ActionEvent) => {
                    this.selectObject(mesh, true);
                }));
            });
        }

        public initLight(lightType: LightType = LightType.HEMISPHERIC) {
            this._scene.lights.forEach((light) => {
                light.dispose();
            });

            switch (lightType) {
                case LightType.HEMISPHERIC:
                    this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
                    (<BABYLON.HemisphericLight>this._light).groundColor = new BABYLON.Color3(0, 0, 0);
                    break;
                case LightType.POINT:
                    this._light = new BABYLON.PointLight("light", this._camera.position, this._scene);
                    break;
                case LightType.SPOT:
                    //todo calculate direction!
                    this._light = new BABYLON.SpotLight("light", this._camera.position, new BABYLON.Vector3(0, -1, 0), 0.8, 2, this._scene);
                    break;
            }

            this._light.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
            this._light.specular = new BABYLON.Color3(1, 1, 1);

            this.$rootScope.$broadcast("lightChanged", this._light);
        }

        public selectObjectInPosition(position: number) {
            return this.selectObject(this._scene.meshes[position]);
        }

        public getObjectInPosition(position: number) : BABYLON.AbstractMesh {
            return this._scene.meshes[position];
        }
         
        public selectObject(mesh: BABYLON.AbstractMesh, fromClick:boolean = false) {
            if (mesh.subMeshes == null) {
                return false;
            }
            this._textureObject = mesh;

            //Update the material to multimaterial, if needed. and Vice versa!
            if (mesh.subMeshes.length > 1 && mesh.material instanceof BABYLON.StandardMaterial) {
                var mat = mesh.material;
                var multimat = new BABYLON.MultiMaterial(mesh.name + "MultiMat", this._scene);
                multimat.subMaterials.push(mat);
                for (var i = 1; i < mesh.subMeshes.length; i++) {
                    multimat.subMaterials.push(new BABYLON.StandardMaterial(mesh.name + "MatInMulti" + i, this._scene));
                }
                this._textureObject.material = multimat;
            } else if (mesh.subMeshes.length == 1 && mesh.material instanceof BABYLON.MultiMaterial) {
                mesh.material = new BABYLON.StandardMaterial(mesh.name + "Mat", this._scene);
            } else if (mesh.material instanceof BABYLON.MultiMaterial && mesh.material['subMaterials'].length < mesh.subMeshes.length) {
                for (var i = <number> mesh.material['subMaterials'].length; i < mesh.subMeshes.length; i++) {
                    mesh.material['subMaterials'].push(new BABYLON.StandardMaterial(mesh.name + "MatInMulti" + i, this._scene));
                }
            }

            this.$rootScope.$broadcast("objectChanged", this._textureObject, fromClick);
            this.directCameraTo(this._textureObject);
            return true;
        }

        public directCameraTo(object: BABYLON.AbstractMesh) {
            this._camera.target = object.position;
        }

        public getObjects() {
            return this._scene.meshes;
        }

        public sceneLoadingUI(loading: boolean = true) {
            if(loading)
                this._scene.getEngine().displayLoadingUI();
            else
                this._scene.getEngine().hideLoadingUI();
        }

        public appendMaterial(materialId: string, successCallback, progressCallback, errorCallback) {
            BABYLON.SceneLoader.Append(MaterialController.ServerUrl+"/materials/", materialId+".babylon", this._scene, successCallback, progressCallback, errorCallback);
        }

        public getMaterial(materialId: string) {
            return this._scene.getMaterialByID(materialId);
        }

        public singleOut(enable: boolean, objectPosition:number) {
            if (enable) {
                for (var i = 0; i < this._scene.meshes.length; i++) {
                    var mesh = this._scene.meshes[i];
                    
                    mesh['lastVisibleState'] = mesh.isVisible;
                    if (i == objectPosition) {
                        mesh.isVisible = true;
                    }
                    else
                        mesh.isVisible = false;
                }
            } else {
                for (var i = 0; i < this._scene.meshes.length; i++) {
                    //if (i == objectPosition) continue;
                    var mesh = this._scene.meshes[i];
                    mesh.isVisible = (!!mesh['lastVisibleState']);
                }
            }
        }
    }
} 