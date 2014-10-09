var LightSpeed;
(function (LightSpeed) {
    var Laser = (function () {
        function Laser() {
            //dual shot
            this.cost = 100;
            this.cooldown = 0;
            this.refreshtime = .30;
            this.lastupdate = 0;
        }
        Laser.prototype.behavior = function (time, player, bullet) {
            if ((time - this.lastupdate) > this.refreshtime) {
                var newbullet2 = bullet.clone("bullet", null);

                if (player.currentDirection != "left" && player.currentDirection != "right" && player.currentDirection != "up" && player.currentDirection != "down") {
                    newbullet2.position.x = player.graphic.position.x;
                    newbullet2.position.z = player.graphic.position.z - 5;
                } else {
                    newbullet2.position.x = player.graphic.position.x - 5;
                    newbullet2.position.z = player.graphic.position.z - 5;
                }
                GameSound.play("shoot");
                player.bullets.push({ 'graphic': newbullet2, 'direction': player.graphic.rotation.y, 'damage': player.bulletDamage, 'particle': null });
                var newbullet3 = bullet.clone("bullet", null);

                if (player.currentDirection != 'left' && player.currentDirection != 'right' && player.currentDirection != 'up' && player.currentDirection != 'down') {
                    newbullet3.position.x = player.graphic.position.x;
                    newbullet3.position.z = player.graphic.position.z + 5;
                } else {
                    newbullet3.position.x = player.graphic.position.x + 5;
                    newbullet3.position.z = player.graphic.position.z + 5;
                }
                GameSound.play("shoot");
                player.bullets.push({ 'graphic': newbullet3, 'direction': player.graphic.rotation.y, 'damage': player.bulletDamage, 'particle': null });
                this.lastupdate = time;
            }
        };
        return Laser;
    })();
    LightSpeed.Laser = Laser;
})(LightSpeed || (LightSpeed = {}));
//# sourceMappingURL=laser.js.map
