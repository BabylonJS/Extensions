module LightSpeed {

    export class BaseEnemy {

        public value: number;
        public health: number;
        public maxHealth: number;
        public baseHealth: number;
        public healthIncrease: number;
        public enemyPointsMesh: BABYLON.Mesh;
        public damageAmount: number;
        public speed: number;
        public canRespawn: boolean;
        public size: number;
        public refreshtime: number;
        public lastupdate: number;
        public enemyMesh: BABYLON.AbstractMesh;
        public enemyPointsTexture: BABYLON.DynamicTexture;
        public enemyBullet: Array<any>;
        public enemyexplosion: BABYLON.ParticleSystem;
        public radar: BABYLON.Mesh;
        public toX: number;
        public toY: number;
        public toZ: number;
        public rotation: number;


        public setup() {
            return null;
        }
        public behavior() {
            return null;
        }
        public init() {
            return null;
        }


        constructor(public name: string, public level: number) {

            // after recopy all propreties call init();
            if (this.init != null)
                this.init();

            if (!this.enemyBullet)
                this.enemyBullet = [];

            this.value += level;
            this.health = this.baseHealth + (this.level * this.healthIncrease);
            this.maxHealth = this.baseHealth + (this.level * this.healthIncrease);

            this.enemyPointsMesh = BABYLON.Mesh.CreatePlane("enemyPoints", 20, scene);
            this.enemyPointsMesh.rotation.y = Math.PI;
            this.enemyPointsMesh.rotation.x = Math.PI / 2;
            this.enemyPointsMesh.rotation.z = Math.PI * 1.5;
            this.enemyPointsMesh.position.x = 10000;
            this.enemyPointsMesh.position.z = 10000;

            var enemyPointsMaterial = new BABYLON.StandardMaterial("background", scene);
            this.enemyPointsTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            enemyPointsMaterial.diffuseTexture = this.enemyPointsTexture;

            this.enemyPointsMesh.material = enemyPointsMaterial;
            this.enemyPointsTexture.drawText("+" + this.value, null, 350, "bold 285px Arial", "white", "#555555");

            this.enemyexplosion = new BABYLON.ParticleSystem("enemyexplosion", 250, scene);

            this.enemyexplosion.particleTexture = new BABYLON.Texture("images/Flare.png", scene);
            this.enemyexplosion.emitter = this.enemyPointsMesh; // the starting object, the emitter
            this.enemyexplosion.minEmitBox = new BABYLON.Vector3(-1, 0, -1); // Starting all From
            this.enemyexplosion.maxEmitBox = new BABYLON.Vector3(1, 0, 1); // To...
            this.enemyexplosion.color1 = new BABYLON.Color4(0.7, 0.7, .3, 1.0);
            this.enemyexplosion.color2 = new BABYLON.Color4(0.5, 0.5, .3, 1.0);
            this.enemyexplosion.colorDead = new BABYLON.Color4(0.5, 0.5, 0.3, 1.0);
            this.enemyexplosion.minSize = 2.0;
            this.enemyexplosion.maxSize = 5.5;
            this.enemyexplosion.minLifeTime = .15;
            this.enemyexplosion.maxLifeTime = .250;
            this.enemyexplosion.emitRate = 1000;
            this.enemyexplosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            this.enemyexplosion.direction1 = new BABYLON.Vector3(-8, -8, 0);
            this.enemyexplosion.direction2 = new BABYLON.Vector3(8, 8, 0);
            this.enemyexplosion.minAngularSpeed = 0;
            this.enemyexplosion.maxAngularSpeed = Math.PI;
            this.enemyexplosion.targetStopDuration = .1;
            this.enemyexplosion.minEmitPower = 60;
            this.enemyexplosion.maxEmitPower = 75;
            this.enemyexplosion.updateSpeed = 0.005;
            this.enemyexplosion.disposeOnStop = false;

            // Setup will place the enemy at the correct position;
            if (this.setup != null)
                this.setup();

        }


        public update() {

            this.behavior();

            if (this.health <= 0) {
                this.explode();
            }
        }


        public respawn(lvl?: number) {
            if (lvl == null)
                this.level += 1;
            else
                this.level = lvl;

            this.maxHealth = (this.baseHealth + (this.level * this.healthIncrease));
            this.health = (this.baseHealth + (this.level * this.healthIncrease));
            this.damageAmount = this.damageAmount + this.level;
            this.enemyMesh.setEnabled(true);
            this.enemyMesh.isVisible = true;
            this.setup();
        }

        public getDamage(dmg: number) {

            GameSound.play("hit");
            this.health -= dmg;

            if (this.health <= 0) {
                this.explode();
            }

        }

        public explode() {

            GameSound.play("explode");
            var spriteManager = new BABYLON.SpriteManager("playerManagr", "images/ExplosionAnimationClear2.png", 1, 150, scene);

            var fire = new BABYLON.Sprite("player", spriteManager);
            fire.disposeWhenFinishedAnimating = true;
            fire.size = 75;
            fire.position.z = this.enemyMesh.position.z;
            fire.position.x = this.enemyMesh.position.x;
            fire.position.y = 1;
            fire.playAnimation(0, 10, false, 70);

            playerShip.addResources(this.value);

            this.enemyMesh.animations = [];
            this.enemyMesh.setEnabled(false);
            this.enemyMesh.isVisible = false;
            this.enemyPointsMesh.position.x = this.enemyMesh.position.x;
            this.enemyPointsMesh.position.z = this.enemyMesh.position.z;

            this.enemyexplosion.start();

            var animationBox3 = new BABYLON.Animation("xpmessage1", "material.alpha", 40,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keys = [];

            keys.push({ frame: 0, value: 1.0 });
            keys.push({ frame: 50, value: .5 });
            keys.push({ frame: 100, value: .0 });

            animationBox3.setKeys(keys);
            this.enemyPointsMesh.animations.push(animationBox3);

            var animationBox4 = new BABYLON.Animation("xpmessage2", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

            var keys = [];
            keys.push({ frame: 0, value: .0 });
            keys.push({ frame: 50, value: -100 });
            keys.push({ frame: 100, value: -200 });


            animationBox4.setKeys(keys);
            this.enemyPointsMesh.animations.push(animationBox4);

            scene.beginAnimation(this.enemyPointsMesh, 0, 100, false);


        }

        public dispose() {

            this.enemyMesh.animations = [];
            this.enemyPointsTexture.dispose();
            this.enemyexplosion.dispose();
            this.enemyPointsMesh.animations = [];
            this.enemyPointsMesh.material.dispose();
            this.enemyPointsMesh.dispose();

            var totalB = this.enemyBullet.length;
            while (totalB--) {
                this.enemyBullet[totalB].graphic.dispose();
                this.enemyBullet.splice(totalB, 1);
            }


            this.enemyMesh.dispose();
        }

        public static SpawnOutside() {
            var rando = Math.round(Math.random() * 1);
            var x = ((Math.random() * 1500) - 750);
            var z = ((Math.random() * 1500) - 750);
            if (rando == 1) {
                if (x > 0) {
                    x = height + 100;
                }
                else {
                    x = -height - 100;
                }
            }
            else {
                if (z > 0) {
                    z = width + 100;
                }
                else {
                    z = -width - 100;
                }
            }
            return { 'x': x, 'z': z };
        }

        public static SpawnInsideEdge() {
            var rando = Math.round(Math.random() * 1);
            var x = ((Math.random() * 1500) - 750);
            var z = ((Math.random() * 1500) - 750);
            if (rando == 1) {
                if (x > 0) {
                    x = height - 100;
                }
                else {
                    x = -height + 100;
                }
            }
            else {
                if (z > 0) {
                    z = width - 100;
                }
                else {
                    z = -width + 100;
                }
            }
            return { 'x': x, 'z': z };
        }

        public static SpawnInside() {
            var x = ((Math.random() * 1500) - 750);
            var z = ((Math.random() * 1500) - 750);
            return { 'x': x, 'z': z };
        }


        public static SpawnEnemies(level: number) {

            // get levels
            var levels = LightSpeed.BaseEnemy.GetLevels();

            // get current level details
            var lvlDetails = levels.filter((value) => { return value.level == level; });

            // just check if exists
            while (lvlDetails.length == 0) {
                level--;
                lvlDetails = levels.filter((value) => { return value.level == level; });
            }

            var enemies = new Array<LightSpeed.BaseEnemy>();

            // get all types in levels
            var typeAmount = lvlDetails[0].types.length;
            while (typeAmount--) {

                // enemies count
                var totalItems = lvlDetails[0].types[typeAmount].total;
                // enemy type
                var typeItem = lvlDetails[0].types[typeAmount].enemyType;

                while (totalItems--) {
                    switch (typeItem) {
                        case 0: enemies.push(new RockEnemy('rock_' + totalItems.toString(), level)); break;
                        case 1: enemies.push(new MineEnemy('mine_' + totalItems.toString(), level)); break;
                        case 2: enemies.push(new Rock2Enemy('rock2_' + totalItems.toString(), level)); break;
                        case 3: enemies.push(new SpaceShipEnemy('spaceShip_' + totalItems.toString(), level)); break;
                        case 4: enemies.push(new StaticMineEnemy('staticMine_' + totalItems.toString(), level)); break;
                    }
                }
            }

            return enemies;
        }

        public static GetLevels() {

            var levels = [
                {
                    level: 0,
                    types: [
                        { enemyType: 0, total: 10 },
                        { enemyType: 1, total: 10 },
                        { enemyType: 2, total: 10 },
                        { enemyType: 3, total: 1 },
                        { enemyType: 4, total: 5 }
                    ]
                },
                {
                    level: 2,
                    types: [
                        { enemyType: 0, total: 15 },
                        { enemyType: 1, total: 15 },
                        { enemyType: 2, total: 15 },
                        { enemyType: 3, total: 2 },
                        { enemyType: 4, total: 10 }
                    ]
                },
                {
                    level: 4,
                    types: [
                        { enemyType: 0, total: 100 },
                        { enemyType: 4, total: 20 },
                        { enemyType: 2, total: 100 },
                        { enemyType: 3, total: 20 }
                    ]
                },
                {
                    level: 10,
                    types: [
                        { enemyType: 0, total: 150 },
                        { enemyType: 4, total: 40 },
                        { enemyType: 2, total: 150 },
                        { enemyType: 3, total: 40 }
                    ]
                },
                {
                    level: 50,
                    types: [
                        { enemyType: 0, total: 250 },
                        { enemyType: 4, total: 60 },
                        { enemyType: 2, total: 250 },
                        { enemyType: 3, total: 60 }
                    ]
                }
            ];
            return levels;

        }


    }

    export class RockEnemy extends BaseEnemy {


        constructor(name: string, lvl: number) {
            this.baseHealth = 25;
            this.healthIncrease = 20;
            this.speed = 1.5;
            this.canRespawn = true;
            this.value = 5;
            this.size = 10;
            this.refreshtime = .30;
            this.lastupdate = 0;

            // call base constructor
            super(name, lvl);
        }


        public init() {

            this.enemyBullet = [];
            this.enemyMesh = rock.clone("rock", null);
            var m = Math.random();
            var z = this.size;

            var actsize = m * z + 20; ///min size is 15

            this.enemyMesh.scaling.x = actsize;
            this.enemyMesh.scaling.y = actsize;
            this.enemyMesh.scaling.z = actsize;

            this.speed = (Math.random() * this.speed) + .1;
        }

        public setup() {
            var loc = LightSpeed.BaseEnemy.SpawnOutside();
            this.enemyMesh.position.x = loc.x;
            this.enemyMesh.position.z = loc.z;

            loc = LightSpeed.BaseEnemy.SpawnOutside();
            this.toX = loc.x;
            this.toZ = loc.z;
            this.rotation = Math.random() * .02;

        }

        public behavior() {

            var dx = this.toX - this.enemyMesh.position.x;
            var dy = this.toZ - this.enemyMesh.position.z;
            if (dx < 5 && dy < 5) {
                this.setup();
            }
            var direction = Math.atan2(dy, dx);

            this.enemyMesh.rotation.z += this.rotation * adjmovement;
            this.enemyMesh.rotation.x += this.rotation * adjmovement;
            this.enemyMesh.rotation.y += this.rotation * adjmovement;
            this.enemyMesh.position.x += Math.cos(direction) * (this.speed * adjmovement);
            this.enemyMesh.position.z += Math.sin(direction) * (this.speed * adjmovement);
        }

    }

    export class MineEnemy extends BaseEnemy {

        constructor(name: string, lvl: number) {
            this.baseHealth = 25;
            this.healthIncrease = 20;
            this.speed = .75;
            this.canRespawn = true;
            this.value = 5;
            this.size = 1;
            this.refreshtime = .30;
            this.lastupdate = 0;

            // call base constructor
            super(name, lvl);
        }

        public init() {
            this.enemyMesh = mine.clone("test", null);
            var actsize = (Math.random() * this.size) + 15; ///min size is 15
            this.enemyMesh.scaling.x = actsize;
            this.enemyMesh.scaling.y = actsize;
            this.enemyMesh.scaling.z = actsize;
            this.speed = (Math.random() * this.speed) + .1;

        }
        public setup() {
            var loc = LightSpeed.BaseEnemy.SpawnInside();
            this.enemyMesh.position.x = loc.x;
            this.enemyMesh.position.z = loc.z;

            loc = LightSpeed.BaseEnemy.SpawnOutside();
            this.toX = loc.x;
            this.toZ = loc.z;
            this.rotation = Math.random() * .02;
        }
        public behavior() {

            // ship has explode or go to next level;
            if (!playerShip.canMove)
                return;

            var dx = playerShip.graphic.position.x - this.enemyMesh.position.x;
            var dy = playerShip.graphic.position.z - this.enemyMesh.position.z;

            //enemy ON ship
            if (dx <= 0.5 && dx >= -0.5 && dy <= 0.5 && dy >= -0.5) {
                return;
            }

            var direction = Math.atan2(dy, dx);
            this.enemyMesh.rotation.z += this.rotation * adjmovement;
            this.enemyMesh.rotation.x += this.rotation * adjmovement;
            //this.enemyMesh.rotation.y += this.rotation*adjmovement;
            this.enemyMesh.position.x += Math.cos(direction) * (this.speed * adjmovement);
            this.enemyMesh.position.z += Math.sin(direction) * (this.speed * adjmovement);
        }
    }

    export class Rock2Enemy extends BaseEnemy {
        // own rotation
        public rotationX: number;
        public rotationY: number;
        public rotationZ: number;

        public direction: number;

        constructor(name: string, lvl: number) {
            this.baseHealth = 50;
            this.healthIncrease = 30;
            this.speed = 2;
            this.canRespawn = true;
            this.value = 5;
            this.size = 15;
            this.refreshtime = .30;
            this.lastupdate = 0;

            // call base constructor
            super(name, lvl);
        }



        public init() {
            this.enemyMesh = rock2.clone("test", null);
            var actsize = (Math.random() * this.size) + 20; ///min size is 15
            this.enemyMesh.scaling.x = actsize;
            this.enemyMesh.scaling.y = actsize;
            this.enemyMesh.scaling.z = actsize;
            this.speed = (Math.random() * this.speed) + .1;
        }
        public setup() {

            var loc = LightSpeed.BaseEnemy.SpawnOutside();
            this.enemyMesh.position.x = loc.x;
            this.enemyMesh.position.z = loc.z;

            loc = LightSpeed.BaseEnemy.SpawnOutside();
            this.toX = loc.x;
            this.toZ = loc.z;
            this.rotationX = Math.random() * .02;
            this.rotationY = Math.random() * .02;
            this.rotationZ = Math.random() * .02;

            var dx = this.toX - this.enemyMesh.position.x;
            var dy = this.toZ - this.enemyMesh.position.z;

            this.direction = Math.atan2(dy, dx);
        }
        public behavior() {
            var dx = this.toX - this.enemyMesh.position.x;
            var dy = this.toZ - this.enemyMesh.position.z;

            if (dx < 5 && dy < 5) {
                this.setup();
            }

            this.enemyMesh.rotation.z += this.rotationZ * adjmovement;
            this.enemyMesh.rotation.x += this.rotationX * adjmovement;
            this.enemyMesh.rotation.y += this.rotationY * adjmovement;

            this.enemyMesh.position.x += Math.cos(this.direction) * (this.speed * adjmovement);
            this.enemyMesh.position.z += Math.sin(this.direction) * (this.speed * adjmovement);
        }
    }

    export class SpaceShipEnemy extends BaseEnemy {

        // this ship can cand do damages

        public damage: number;
        public direction: number;

        constructor(name: string, lvl: number) {
            this.baseHealth = 400;
            this.healthIncrease = 30;
            this.speed = .7;
            this.canRespawn = false;
            this.value = 15;
            this.size = 15;
            this.refreshtime = 1.0;
            this.lastupdate = 0;
            this.damage = 5;
            this.enemyBullet = null;
            this.enemyMesh = null;
            this.radar = null;

            // call base constructor
            super(name, lvl);
        }


        public init() {

            this.enemyBullet = [];
            this.enemyMesh = enemyship.clone("swship", null);

            // making a radar
            this.radar = radar.clone("radar", null);
            this.radar.parent = this.enemyMesh;
            this.radar.rotation.x += Math.PI / 2;
            this.radar.rotation.z += Math.PI * .5;

            this.speed = (Math.random() * this.speed) + .1;
        }
        public setup() {
            var loc = LightSpeed.BaseEnemy.SpawnInsideEdge();
            this.enemyMesh.position.x = loc.x;
            this.enemyMesh.position.z = loc.z;

            this.radar.position.x = 0;
            this.radar.position.z = 0

            loc = LightSpeed.BaseEnemy.SpawnInsideEdge();
            this.toX = loc.x;
            this.toZ = loc.z;
            var dx = this.toX - this.enemyMesh.position.x;
            var dy = this.toZ - this.enemyMesh.position.z;
            this.direction = Math.atan2(dy, dx);
        }
        public behavior() {


            // ship has explode or go to next level;
            if (!playerShip.canMove)
                return;

            var dx = playerShip.graphic.position.x - this.enemyMesh.position.x;
            var dy = playerShip.graphic.position.z - this.enemyMesh.position.z;

            //enemy ON ship
            if (dx <= 0.5 && dx >= -0.5 && dy <= 0.5 && dy >= -0.5) {
                return;
            }


            // if radar intersect the player ship, the sw ship will follow him
            if (this.radar.intersectsMesh(playerShip.boundingBox, true)) {
                var dx = playerShip.graphic.position.x - this.enemyMesh.position.x;
                var dy = playerShip.graphic.position.z - this.enemyMesh.position.z;

                this.direction = Math.atan2(dy, dx);

                // stack a bullet !
                if ((time - this.lastupdate) > this.refreshtime) {

                    var newbullet2 = bulletobj3.clone("bullet", null);
                    newbullet2.position.x = this.enemyMesh.position.x;
                    newbullet2.position.z = this.enemyMesh.position.z;
                    this.enemyBullet.push({ 'graphic': newbullet2, 'direction': this.direction });

                    this.lastupdate = time;
                }

            }

            // respawning ?
            if ((this.enemyMesh.position.x > height || this.enemyMesh.position.x < -height) || (this.enemyMesh.position.z > width || this.enemyMesh.position.z < -width)) {
                var loc = LightSpeed.BaseEnemy.SpawnInsideEdge();
                var dx = loc.x - this.enemyMesh.position.x;
                var dy = loc.z - this.enemyMesh.position.z;
                this.direction = Math.atan2(dy, dx);
            }


            // show bullets
            var index = this.enemyBullet.length;
            while (index--) {

                var bullet = this.enemyBullet[index];

                bullet.graphic.position.x += Math.cos(bullet.direction) * ((this.speed * adjmovement) + (2 * adjmovement));
                bullet.graphic.position.z += Math.sin(bullet.direction) * ((this.speed * adjmovement) + (2 * adjmovement));

                // bullet intersect player ship, do damages !
                if (bullet.graphic.intersectsMesh(playerShip.boundingBox, true)) {
                    playerShip.getDamage(this.damage);
                    bullet.graphic.dispose();
                    this.enemyBullet.splice(index, 1);
                }
                // outside screen
                else if (bullet.graphic.position.z > width + 50 || bullet.graphic.position.z < -width - 50 || bullet.graphic.position.x > height + 50 || bullet.graphic.position.x < -height - 50) {
                    bullet.graphic.dispose();
                    this.enemyBullet.splice(index, 1);
                }
            }

            this.enemyMesh.position.x += Math.cos(this.direction) * (this.speed * adjmovement);
            this.enemyMesh.position.z += Math.sin(this.direction) * (this.speed * adjmovement);
            this.enemyMesh.rotation.y = Math.PI - this.direction;
        }
    }

    export class StaticMineEnemy extends BaseEnemy {
        constructor(name: string, lvl: number) {
            this.baseHealth = 100;
            this.healthIncrease = 20;
            this.speed = .75;
            this.canRespawn = false;
            this.value = 5;
            this.size = 1;
            this.refreshtime = 1.0;
            this.lastupdate = 0;

            // call base constructor
            super(name, lvl);
        }

        public init() {
            this.enemyMesh = mine.clone("test", null);
            var actsize = (Math.random() * this.size) + 15; ///min size is 15
            this.enemyMesh.scaling.x = actsize;
            this.enemyMesh.scaling.y = actsize;
            this.enemyMesh.scaling.z = actsize;

            this.radar = radar.clone("radar", null);
            this.radar.parent = this.enemyMesh;
            this.radar.position.x = 0;//this.enemyMesh.position.x;
            this.radar.position.z = 0;//this.enemyMesh.position.z;
            this.radar.scaling.x = .0010;
            this.radar.scaling.y = .0010;
            this.radar.scaling.z = .0010;
            this.radar.rotation.z += Math.PI * .5; // *1.5;

        }
        public setup() {
            var loc = LightSpeed.BaseEnemy.SpawnInside();
            this.enemyMesh.position.x = loc.x;
            this.enemyMesh.position.z = loc.z;
        }
        public behavior() {

            if (this.radar.intersectsMesh(playerShip.boundingBox, true)) {

                if ((time - this.lastupdate) > this.refreshtime) {
                    //this.explode();
                    playerShip.getDamage(this.maxHealth / 4);
                    this.lastupdate = time;
                }
            }
            else {
                this.lastupdate = time;
                this.radar.scaling.x += .00015;
                this.radar.scaling.y += .00015;
                this.radar.scaling.z += .00015;
                if (this.radar.scaling.x >= .03) {
                    this.radar.scaling.x = .001;
                    this.radar.scaling.y = .001;
                    this.radar.scaling.z = .001;
                }
            }

        }
    }
} 