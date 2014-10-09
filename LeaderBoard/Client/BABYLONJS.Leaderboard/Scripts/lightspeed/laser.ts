module LightSpeed {
    export class Laser {

        //dual shot
        public cost: number = 100;
        public cooldown:number=0;
        public refreshtime: number = .30;
        public lastupdate: number = 0;

        public behavior(time:number, player:LightSpeed.PlayerShip, bullet:BABYLON.Mesh) {
            if ((time - this.lastupdate) > this.refreshtime) {
                var newbullet2 = bullet.clone("bullet", null);

                if (player.currentDirection != "left"
                    && player.currentDirection != "right"
                    && player.currentDirection != "up"
                    && player.currentDirection != "down") {

                    newbullet2.position.x = player.graphic.position.x;
                    newbullet2.position.z = player.graphic.position.z - 5;
                }
                else {
                    newbullet2.position.x = player.graphic.position.x - 5;
                    newbullet2.position.z = player.graphic.position.z - 5;
                }
                GameSound.play("shoot");
                player.bullets.push({ 'graphic': newbullet2, 'direction': player.graphic.rotation.y, 'damage': player.bulletDamage, 'particle': null });
                var newbullet3 = bullet.clone("bullet", null);

                if (player.currentDirection != 'left'
                    && player.currentDirection != 'right'
                    && player.currentDirection != 'up'
                    && player.currentDirection != 'down') {
                    newbullet3.position.x = player.graphic.position.x;
                    newbullet3.position.z = player.graphic.position.z + 5;
                }
                else {
                    newbullet3.position.x = player.graphic.position.x + 5;
                    newbullet3.position.z = player.graphic.position.z + 5;
                }
                GameSound.play("shoot");
                player.bullets.push({ 'graphic': newbullet3, 'direction': player.graphic.rotation.y, 'damage': player.bulletDamage, 'particle': null });
                this.lastupdate = time;
            }
        }
    }


} 