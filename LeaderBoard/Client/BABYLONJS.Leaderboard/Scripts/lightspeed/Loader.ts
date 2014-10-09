module LightSpeed {

    export class LoaderResult {
        engine: BABYLON.Engine;
        scene: BABYLON.Scene;
        camera: BABYLON.ArcRotateCamera;
        playerGraphic: BABYLON.AbstractMesh;
        particleTexture: BABYLON.Texture;
        radar: BABYLON.Mesh;
        enemywing: BABYLON.Mesh;
        enemywing2: BABYLON.Mesh;
        wingconnector: BABYLON.Mesh;
        wingconnector2: BABYLON.Mesh;
        enemyship: BABYLON.Mesh;
        bulletobj: BABYLON.Mesh;
        bulletobj2: BABYLON.Mesh;
        bulletobj3: BABYLON.Mesh;
        bulletpart: BABYLON.ParticleSystem;
        bulletpart2: BABYLON.ParticleSystem;
        rock: BABYLON.AbstractMesh;
        rock2: BABYLON.AbstractMesh;
        mine: BABYLON.AbstractMesh;
    }

    export class Loader {

        public isLoaded: boolean = true;

        public load(canvas: HTMLCanvasElement, loaded: (LoaderResult) => void, notSupported: () => void) {

            if (!BABYLON.Engine.isSupported()) {
                notSupported();
                return;
            }
            var e = new LightSpeed.LoaderResult();

            this.isLoaded = false;

            e.engine = new BABYLON.Engine(canvas, false)
            e.scene = new BABYLON.Scene(e.engine);
            e.scene.clearColor = new BABYLON.Color3(0, 0, 0);


            e.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 500, new BABYLON.Vector3(0, 0, 0), e.scene);
            e.camera.maxZ = 20000;

            time = 0;

            var backgroundLoad = document.createElement("img");
            backgroundLoad.src = "images/starb.png";

            var light0 = new BABYLON.HemisphericLight("Omni", new BABYLON.Vector3(0, 0, -10), e.scene);
            // e.scene.activeCamera.attachControl(canvas);
            BABYLON.SceneLoader.ImportMesh("", "", "Spaceship.babylon", e.scene, (newMeshes, particleSystems) => {
                newMeshes[0].scaling.x = .015;
                newMeshes[0].scaling.y = .015;
                newMeshes[0].scaling.z = .015;

                // space ship mesh
                e.playerGraphic = newMeshes[0];

                var backmaterial = new BABYLON.StandardMaterial("texture1", e.scene);
                backmaterial.diffuseTexture = new BABYLON.Texture(backgroundLoad.src, e.scene);

                // texture of flare
                e.particleTexture = new BABYLON.Texture("images/Flare.png", e.scene);

                //radar
                e.radar = BABYLON.Mesh.CreateCylinder("12", .1, 300, 300, 55, 1, e.scene);
                e.radar.position.x = 15000;
                e.radar.position.z = 15000;
                e.radar.rotation.x = Math.PI / 2;
                e.radar.rotation.z = Math.PI * 1.5;
                
                var radarmaterial = new BABYLON.StandardMaterial("shieldMaterial", e.scene);
                radarmaterial.opacityTexture = new BABYLON.Texture("images/radarcircle.png", e.scene);
                radarmaterial.opacityTexture.hasAlpha = true;
                radarmaterial.alpha = 0.1;
                e.radar.material = radarmaterial;
              
                var enemyShipmaterial = new BABYLON.StandardMaterial("enemymaterial", e.scene);
                enemyShipmaterial.diffuseTexture = new BABYLON.Texture("images/Micro.png", e.scene);
                enemyShipmaterial.bumpTexture = new BABYLON.Texture("images/grate0_normal.png", e.scene);


                e.enemywing = BABYLON.Mesh.CreateCylinder("12", 3, 60, 60, 5, 1, e.scene);
                e.wingconnector = BABYLON.Mesh.CreateCylinder("12", 15, 5, 10, 10, 1, e.scene);
                e.wingconnector2 = e.wingconnector.clone("connector2", null);
                e.wingconnector2.rotation.x = Math.PI;
                e.enemywing.rotation.x = Math.PI / 2;
                e.enemywing2 = e.enemywing.clone("wing2", null);
                e.enemywing.material = enemyShipmaterial;
                e.enemywing2.material = enemyShipmaterial;
                e.enemyship = BABYLON.Mesh.CreateSphere("12", 10, 30, e.scene);
                e.enemywing.parent = e.enemyship;
                e.enemywing2.parent = e.enemyship;
                e.wingconnector.parent = e.enemywing;
                e.wingconnector2.parent = e.enemywing2;
                e.enemywing.position.z = 25;
                e.enemywing2.position.z = -25;
                e.wingconnector.position.y = -7;
                e.wingconnector2.position.y = 7;
                e.enemyship.material = enemyShipmaterial;
                e.enemyship.position.x = 2000;
                e.enemyship.position.z = 2000;


                //	enemywing.rotation.z = Math.PI *.5;
                //	enemywing.rotation.y = Math.PI;

                e.bulletobj = BABYLON.Mesh.CreateSphere("bulletmain", 1, 1, e.scene);
                e.bulletobj.position.y = -500;
                e.bulletobj.isVisible = false;

                e.bulletobj2 = BABYLON.Mesh.CreateSphere("bulletmain2", 4, 3, e.scene);
                e.bulletobj2.position.x = 15000;
                e.bulletobj2.position.z = 15000;

                e.bulletpart = new BABYLON.ParticleSystem("bulletPart", 10, e.scene);
                e.bulletpart.particleTexture = new BABYLON.Texture("images/laser.png", e.scene);
                e.bulletpart.emitter = e.bulletobj2;
                e.bulletpart.minEmitBox = new BABYLON.Vector3(0, 1, 0); // Starting all From
                e.bulletpart.maxEmitBox = new BABYLON.Vector3(0, 1, 0); // To...
                e.bulletpart.direction1 = new BABYLON.Vector3(-2, -1, -2);
                e.bulletpart.direction2 = new BABYLON.Vector3(2, 1, 2);
                e.bulletpart.minLifeTime = .01;
                e.bulletpart.maxLifeTime = .1;
                e.bulletpart.maxSize = 5.5;
                e.bulletpart.emitRate = 100;
                e.bulletpart.minEmitPower = 10;
                e.bulletpart.maxEmitPower = 30;
                e.bulletpart.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                e.bulletpart.targetStopDuration = 0;
                e.bulletpart.disposeOnStop = true;

                e.bulletobj3 = BABYLON.Mesh.CreateSphere("bulletmain2", 4, 3, e.scene);
                e.bulletobj3.position.x = 15000;
                e.bulletobj3.position.z = 15000;

                e.bulletpart2 = new BABYLON.ParticleSystem("bulletPart", 10, e.scene);
                e.bulletpart2.particleTexture = new BABYLON.Texture("images/laserred.png", e.scene);
                e.bulletpart2.emitter = e.bulletobj3;
                e.bulletpart2.minEmitBox = new BABYLON.Vector3(0, 1, 0); // Starting all From
                e.bulletpart2.maxEmitBox = new BABYLON.Vector3(0, 1, 0); // To...
                e.bulletpart2.direction1 = new BABYLON.Vector3(-2, -1, -2);
                e.bulletpart2.direction2 = new BABYLON.Vector3(2, 1, 2);
                e.bulletpart2.minLifeTime = .01;
                e.bulletpart2.maxLifeTime = .1;
                e.bulletpart2.maxSize = 5.5;
                e.bulletpart2.emitRate = 100;
                e.bulletpart2.minEmitPower = 10;
                e.bulletpart2.maxEmitPower = 30;
                e.bulletpart2.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                e.bulletpart2.targetStopDuration = 0;
                e.bulletpart2.disposeOnStop = true;

                var rockmaterial = new BABYLON.StandardMaterial("rockmaterial", e.scene);
                rockmaterial.diffuseTexture = new BABYLON.Texture("images/marble.jpg", e.scene);
                rockmaterial.bumpTexture = new BABYLON.Texture("images/Rocknormal.jpg", e.scene);
                rockmaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                rockmaterial.diffuseTexture.wrapU = .5;
                rockmaterial.diffuseTexture.wrapV = .5;

                var minematerial = new BABYLON.StandardMaterial("rockmaterial", e.scene);
                minematerial.diffuseTexture = new BABYLON.Texture("images/bunker_galvanized.jpg", e.scene);
                minematerial.bumpTexture = new BABYLON.Texture("images/concrete01_norm.jpg", e.scene);
                //minematerial.specularColor = new BABYLON.Color3(0, 0, 0);		
                minematerial.diffuseTexture.wrapU = .5;
                minematerial.diffuseTexture.wrapV = .5;

                var backgroundSystem = BABYLON.Mesh.CreatePlane("background", 3000, e.scene);
                backgroundSystem.material = backmaterial;//new BABYLON.StandardMaterial("backgroundmat", e.scene);
                backgroundSystem.rotation.y = Math.PI;
                backgroundSystem.rotation.x = Math.PI / 2;
                backgroundSystem.rotation.z = Math.PI * 1.5;
                backgroundSystem.position.y = -700;
                //player = new Player();
                //camera.target = player.BoundingBox.position;
                BABYLON.SceneLoader.ImportMesh("", "", "assets/a6.babylon", e.scene, (newMeshes, particleSystems) => {
                    e.rock = newMeshes[0];
                    e.rock.position.x = 850;
                    e.rock.position.z = 850;
                    e.rock.material = rockmaterial;
                    BABYLON.SceneLoader.ImportMesh("", "", "assets/a5.babylon", e.scene, (newMeshes, particleSystems)  =>{
                        e.rock2 = newMeshes[0];
                        e.rock2.position.x = 850;
                        e.rock2.position.z = 850;
                        e.rock2.material = rockmaterial;

                        BABYLON.SceneLoader.ImportMesh("", "", "assets/mine1-2.babylon", e.scene, (newMeshes, particleSystems) => {
                            e.mine = newMeshes[0];
                            e.mine.position.x = 850;
                            e.mine.position.z = 850;
                            e.mine.rotation.y = Math.PI;
                            e.mine.rotation.x = Math.PI / 2;
                            e.mine.rotation.z = Math.PI * 1.5;
                            e.mine.material = minematerial;

                            this.isLoaded = true;

                            loaded(e);

                        });
                    });
                });
            });

        }
    }
} 