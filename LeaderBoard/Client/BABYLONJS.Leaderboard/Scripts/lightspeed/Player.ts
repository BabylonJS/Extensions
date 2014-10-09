module LightSpeed {

    export class Player extends BABYLON.LeaderBoard.Character {

        shipLevel: number;
        levelMax: number;
        levelPoints: number;
        highScore: number;


        constructor() {
            super();
        }
    }

    export class PlayerShip {
        shipLevel: number = 0;
        currentLevelStats: any = levelingDefs[this.shipLevel];

        lightSpeedGauge: number = 0;
        levelPoints: number = 0;
        gamePoints: number = 0;
        canMove: boolean = true;
        lightSpeedGaugeCapacity: number = 100;
        health: number = this.currentLevelStats.health;
        maxHealth: number = this.currentLevelStats.health;
        speed: number = this.currentLevelStats.speed;
        bulletSpeed: number = 2;
        bulletDamage: number = this.currentLevelStats.damage;
        bulletsshot: number = 0;
        currentDirection: string = "left";
        bullets = [];
        movex: any;
        movez: any;
        movey: any;
        explosionSystem: BABYLON.ParticleSystem;
        jetSystem: BABYLON.ParticleSystem;
        laser: LightSpeed.Laser;

        boundingBox: any;
        cameraFollower: any;

        // event
        public lightSpeedGaugeChanged: (val: string) => void;
        public pointsChanged: (levelPoints: number, gamePoints:number) => void;
        public healthGaugeChanged: (val: string) => void;
        public shipLevelChanged: (lvl: number, speed: number, health: number, bulletDamage: number) => void;
        public resetOccured: () => void;
        public lightSpeedReadyOccured: () => void;
        public explodeOccured: () => void;
        public jumpToLightSpeedEnd: () => void;

        constructor(public scene: BABYLON.Scene, public camera: BABYLON.ArcRotateCamera, public graphic: BABYLON.AbstractMesh, public particleTexture: BABYLON.Texture) {

            this.boundingBox = BABYLON.Mesh.CreateBox("Player", 13.0, scene);
            this.cameraFollower = BABYLON.Mesh.CreateBox("cameraFollower", 1.0, scene);
            var material = new BABYLON.StandardMaterial("texture1", scene);
            material.wireframe = true;
            this.boundingBox.material = material;
            this.boundingBox.isVisible = false;
            this.cameraFollower.isVisible = false;

            this.laser = new LightSpeed.Laser();

            this.jetSystem = new BABYLON.ParticleSystem("jetstream", 25, scene);
            this.jetSystem.particleTexture = this.particleTexture;
            this.jetSystem.emitter = this.graphic;
            this.jetSystem.minEmitBox = new BABYLON.Vector3(-100, 100, 700);
            this.jetSystem.maxEmitBox = new BABYLON.Vector3(100, 100, 800);
            this.jetSystem.color1 = new BABYLON.Color4(0.4, 0.8, 1.0, 1.0);
            this.jetSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            this.jetSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
            this.jetSystem.minSize = 10.0;
            this.jetSystem.maxSize = 15.5;
            this.jetSystem.minLifeTime = 0.01;
            this.jetSystem.maxLifeTime = .20;
            this.jetSystem.emitRate = 150;
            this.jetSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            this.jetSystem.direction1 = new BABYLON.Vector3(-6, 8, 3);
            this.jetSystem.direction2 = new BABYLON.Vector3(6, 8, -3);
            this.jetSystem.targetStopDuration = 0;
            this.jetSystem.minEmitPower = 1;
            this.jetSystem.maxEmitPower = 3;
            this.jetSystem.updateSpeed = 0.005;
            this.jetSystem.disposeOnStop = false;
            this.jetSystem.start();

        }



        public lightSpeedGaugeChange(val: string) {

            if (this.lightSpeedGaugeChanged != null)
                this.lightSpeedGaugeChanged(val);
        }

        public healthGaugeChange(percent: string) {
            if (this.healthGaugeChanged != null)
                this.healthGaugeChanged(percent);
        }

        public shipLevelChange(lvl: number, speed: number, health: number, bulletDamage: number) {

            if (this.shipLevelChanged != null)
                this.shipLevelChanged(lvl, speed, health, bulletDamage);
        }

        public levelUp() {
            GameSound.play("levelup");
            this.shipLevel += 1;

            this.currentLevelStats = levelingDefs[this.shipLevel];

            this.speed = this.currentLevelStats.speed;
            this.health = this.currentLevelStats.health;
            this.maxHealth = this.currentLevelStats.health;
            this.bulletDamage = this.currentLevelStats.damage;

            this.shipLevelChange(this.shipLevel, this.speed, this.health, this.bulletDamage);

            this.healthGaugeChange(((this.health / this.maxHealth) * 100) + "%");
        }


        public reset() {
            this.lightSpeedGauge = 0;
            this.lightSpeedGaugeChange("0px");
            this.healthGaugeChange(((this.health / this.maxHealth) * 100) + "%");

            this.health = this.maxHealth;
            this.levelPoints = 0;

            if (this.resetOccured != null) {
                this.resetOccured();
            }


            this.boundingBox.position = new BABYLON.Vector3(0, 0, 0);
            this.graphic.position = new BABYLON.Vector3(0, 0, 0);
            this.graphic.rotation.x = 0;
            this.graphic.rotation.y = 0;
            this.currentDirection = "left";
            this.movex = 0, this.movez = 0, this.movey = 0;
            this.canMove = true;
            this.graphic.setEnabled(true);
        }

        public explode() {
            this.canMove = false;
            if (this.graphic.isEnabled() == true) {
                GameSound.play("playerexplode");
                var totalB = this.bullets.length;
                while (totalB--) {
                    this.bullets[totalB].graphic.dispose();
                }
                this.bullets = [];
                this.graphic.isVisible = false;
                this.graphic.setEnabled(false);

                this.explosionSystem = new BABYLON.ParticleSystem("particlesexplode", 2000, this.scene);
                this.explosionSystem.particleTexture = this.particleTexture;
                this.explosionSystem.emitter = this.boundingBox;
                this.explosionSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
                this.explosionSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
                this.explosionSystem.color1 = new BABYLON.Color4(0.4, 0.8, 1.0, 1.0);
                this.explosionSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
                this.explosionSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
                this.explosionSystem.minSize = 6.0;
                this.explosionSystem.maxSize = 7.5;
                this.explosionSystem.minLifeTime = 0.15;
                this.explosionSystem.maxLifeTime = 1.15;
                this.explosionSystem.emitRate = 50000;
                this.explosionSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                this.explosionSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
                this.explosionSystem.direction1 = new BABYLON.Vector3(-8, 8, 8);
                this.explosionSystem.direction2 = new BABYLON.Vector3(8, 8, -8);
                this.explosionSystem.minAngularSpeed = 0;
                this.explosionSystem.maxAngularSpeed = Math.PI;
                this.explosionSystem.targetStopDuration = .1;
                this.explosionSystem.minEmitPower = 1;
                this.explosionSystem.maxEmitPower = 100;
                this.explosionSystem.updateSpeed = 0.005;
                this.explosionSystem.disposeOnStop = false;
                this.explosionSystem.start();

                if (this.explodeOccured != null) {
                    this.explodeOccured();
                }

                ////show you died and request reset/start over
            }

        }

        public getDamage(intDamage: number) {

            if (this.canMove == true) {
                GameSound.play("playerhit");
                this.health -= intDamage;
                this.healthGaugeChange(((this.health / this.maxHealth) * 100) + "%");
            }

            if (this.health <= 0) {
                this.healthGaugeChange("0%");
                this.explode();
            }

        }

        public jumpToLightSpeed() {

            if (this.lightSpeedGauge >= this.lightSpeedGaugeCapacity && this.health > 0 && this.canMove == true) {

                //GameSound.play("LSgo");

                this.canMove = false;

                var totalB = this.bullets.length;
                while (totalB--) {
                    this.bullets[totalB].graphic.dispose();
                }

                this.bullets = [];
                this.movex = 0;
                this.movez = 0;

                this.graphic.position.y += -100;
                this.boundingBox.position.y += -100

                this.camera.target = this.boundingBox.position;

                var cameraMovein = new BABYLON.Animation("cameraMove", "radius",
                    80,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                var cameraKeys = [];

                cameraKeys.push({ frame: 0, value: this.camera.radius });
                cameraKeys.push({ frame: 50, value: 50 });
                cameraKeys.push({ frame: 100, value: 25 });

                cameraMovein.setKeys(cameraKeys);

                this.camera.animations.push(cameraMovein);

                

                //GameSound.play("LSstart");

                this.graphic.rotation.x = Math.PI + (Math.PI / 2);
                this.graphic.rotation.y = (Math.PI / 2);

                this.scene.beginAnimation(this.camera, 0, 100, false, 1,
                    () => {
                        var shiplightspeedMove = new BABYLON.Animation("shiplightspeedMove",
                            "position.y", 40, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                        var shipkeys = [];

                        shipkeys.push({frame: 0, value: this.graphic.position.y});
                        shipkeys.push({frame: 25,value: this.graphic.position.y - 1000});
                        shipkeys.push({ frame: 100, value: this.graphic.position.y - 13000 });

                        shiplightspeedMove.setKeys(shipkeys);

                        this.graphic.animations.push(shiplightspeedMove);

                        this.scene.beginAnimation(this.graphic, 0, 100, false, 1, () => {
                            gameLevel += 1;

                            // Say to global that we can reset the scene
                            if (this.jumpToLightSpeedEnd != null) {
                                this.jumpToLightSpeedEnd();
                            }
                        });

                    });
            }
        }

        public addResources(resAmount: number) {
            var amount = resAmount;
            this.levelPoints += resAmount;
            this.gamePoints += resAmount

            if (this.pointsChanged != null)
                this.pointsChanged(this.levelPoints, this.gamePoints);

            if (this.lightSpeedGauge < this.lightSpeedGaugeCapacity) {

                // just check if amount > the rest of the bar
                amount = (this.lightSpeedGauge + amount > this.lightSpeedGaugeCapacity)
                ? (this.lightSpeedGaugeCapacity - this.lightSpeedGauge)
                : amount;

                this.lightSpeedGauge += amount;

                // Change light speed gauge in percent
                var newL = (this.lightSpeedGauge / this.lightSpeedGaugeCapacity) * 100;
                this.lightSpeedGaugeChange(newL.toString() + "%");

                if (this.lightSpeedGauge >= this.lightSpeedGaugeCapacity) {
                    if (this.lightSpeedReadyOccured != null) {
                        this.lightSpeedReadyOccured();
                    }
                }
            }

        }

        public update(up: boolean, down: boolean, left: boolean, right: boolean, adjmovement: number, height: number, width: number, playingBoardSize: number) {


            if (this.canMove == false) { return; }

            if (this.health <= 0) {
                this.explode();
                return;
            }

            var nextlvlneed = levelingDefs[this.shipLevel + 1].need;

            if (this.levelPoints >= nextlvlneed) {
                this.levelUp();
            }
            ////////////player movement
            if (up && right) {
                this.graphic.rotation.y = Math.PI * .75; //up-and-right
                this.currentDirection = "upright";
            }
            else if (up && left) {
                this.graphic.rotation.y = Math.PI / 4; //up-and-left
                this.currentDirection = "upleft";
            }
            else if (down && right) {
                this.graphic.rotation.y = Math.PI * 1.25; //down-and-right
                this.currentDirection = "downright";
            }
            else if (down && left) {
                this.graphic.rotation.y = Math.PI * 1.75; //down and left
                this.currentDirection = "downleft";
            }
            else if (up) {
                this.graphic.rotation.y = Math.PI / 2;
                this.currentDirection = "up";
            }
            else if (down) {
                this.graphic.rotation.y = Math.PI * 1.5;
                this.currentDirection = "down";
            }
            else if (left) {
                this.graphic.rotation.y = 0;
                this.currentDirection = "left";
            }
            else if (right) {
                this.graphic.rotation.y = Math.PI;
                this.currentDirection = "right";
            }
            this.movez = Math.cos(Math.PI + this.graphic.rotation.y) * (this.speed * adjmovement);//this.speed*adjmovement; // need stat on player object
            this.movex = Math.sin(Math.PI + this.graphic.rotation.y) * (this.speed * adjmovement);//0;
            /////////////////////////

            //////////Bound player inside sky box need width height of window for bounding
            if ((this.graphic.position.x + this.movex > height || this.graphic.position.x + this.movex < -height) || (this.graphic.position.z + this.movez > width || this.graphic.position.z + this.movez < -width)) {
                this.movez = 0;
                this.movex = 0;
            }
            if (this.graphic.position.x + this.movex < playingBoardSize && this.graphic.position.x + this.movex > -playingBoardSize) { ///500
                this.cameraFollower.position.x = this.graphic.position.x + this.movex;
            }
            if (this.graphic.position.z + this.movez < playingBoardSize && this.graphic.position.z + this.movez > -playingBoardSize) { //500
                this.cameraFollower.position.z = this.graphic.position.z + this.movez;
            }
            this.graphic.position.z += this.movez;
            this.graphic.position.x += this.movex;
            this.boundingBox.position.x = this.graphic.position.x;
            this.boundingBox.position.z = this.graphic.position.z;

            //////////////////////

            /////////////////////////////////
            this.laser.behavior(time, this, bulletobj2);

            //////player bullet movement///////
            var totalB = this.bullets.length;
            while (totalB--) {

                this.bullets[totalB].graphic.position.x += Math.sin(Math.PI + this.bullets[totalB].direction) * ((this.speed * adjmovement) + (this.bulletSpeed * adjmovement));
                this.bullets[totalB].graphic.position.z += Math.cos(Math.PI + this.bullets[totalB].direction) * ((this.speed * adjmovement) + (this.bulletSpeed * adjmovement));

                /////////bullet disposal///////////
                if (this.bullets[totalB].graphic.position.z > width + 50 || this.bullets[totalB].graphic.position.z < -width - 50 || this.bullets[totalB].graphic.position.x > height + 50 || this.bullets[totalB].graphic.position.x < -height - 50) {
                    this.bullets[totalB].graphic.dispose();
                    this.bullets.splice(totalB, 1);
                }
            }
        }

    }
}
