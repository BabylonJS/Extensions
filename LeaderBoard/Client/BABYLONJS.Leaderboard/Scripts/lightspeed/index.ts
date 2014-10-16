
var playingBoardSize = 500;
var height = playingBoardSize + 200;
var width = playingBoardSize + (200 * (window.innerWidth / window.innerHeight));// additional for camera extend - fullsize of board

var canvas = <HTMLCanvasElement>document.getElementById("viewport");

var ResourcesText = <HTMLElement>document.getElementById('Resources');
var HealthGauge = <HTMLElement>document.getElementById('healthGauge');
var levelScreen = <HTMLElement>document.getElementById('nextLevelScreen');

var StatusText = <HTMLElement>document.getElementById('dir');


var pausedMessage = <HTMLElement>document.getElementById('pauseScreen');

// Jquery style
var btnFacebook = $("#btnFacebook");
var btnGoogle = $("#btnGoogle");
var btnMicrosoft = $("#btnMicrosoft");

var modal = $("#login-modal");
var divLoged = $("#loged");
var divLogin = $("#login");
var btnStart = $("#btnStartNewGame");
var btnLogout = $("#btnLogout");
var container = $("#container");
var gameViewport = $("#gameViewport");

// not migrated
declare var GameSound: any;


// Babylon engine / scene
var engine: BABYLON.Engine;
var scene: BABYLON.Scene;
var camera: BABYLON.ArcRotateCamera;
var playerGraphic: BABYLON.AbstractMesh;
var particleTexture: BABYLON.Texture;
var radar: BABYLON.Mesh;
var enemywing: BABYLON.Mesh;
var enemywing2: BABYLON.Mesh;
var wingconnector: BABYLON.Mesh;
var wingconnector2: BABYLON.Mesh;
var enemyship: BABYLON.Mesh;
var bulletobj: BABYLON.Mesh;
var bulletobj2: BABYLON.Mesh;
var bulletobj3: BABYLON.Mesh;
var bulletpart: BABYLON.ParticleSystem;
var bulletpart2: BABYLON.ParticleSystem;
var rock: BABYLON.AbstractMesh;
var rock2: BABYLON.AbstractMesh;
var mine: BABYLON.AbstractMesh;

// player shipt
var playerShip: LightSpeed.PlayerShip;

// Pausing game state
var pause = false;

// keys
var up, down, left, right = false;

// is loaded
var loaded = false;

// Ennemies
var enemies: Array<LightSpeed.BaseEnemy> = new Array<LightSpeed.BaseEnemy>();

// time
var time = 0;

// current game level;
var gameLevel: number;
var adjmovement: number;
var nextlvlneed: number;

// babylon leaderboard
var applicationUrl = "https://babylonjs.azure-mobile.net/";
var applicationKey = "dHfEVuqRtCczLCvSdtmAdfVlrWpgfU55";
var gameId = 1;
var leaderBoard = new BABYLON.LeaderBoard.Client(applicationUrl, applicationKey, gameId);
var player: LightSpeed.Player;



var disconnect = (callback?: any) => {

    gameViewport.css('z-index', '-1');

    
    container.show();  

    leaderBoard.logout();

    if (!divLoged.hasClass('hidden'))
        divLoged.addClass('hidden');

    if (divLogin.hasClass('hidden'))
        divLogin.removeClass('hidden');

    if (callback != undefined)
        callback();
}

// Login player. Get Character profile form Leaderboard
var login = (provider: string, callback: any) => {
    leaderBoard.loginWithProfile(provider, (chars) => {

        if (chars && chars.length > 0) {

            player = <LightSpeed.Player>chars[0];

            if (player.shipLevel == undefined || player.shipLevel <= 0)
                player.shipLevel = 0;

            if (player.highScore == null || player.highScore <= 0)
                player.highScore = 0;

            if (player.levelPoints == null || player.levelPoints <= 0)
                player.levelPoints = 0;

            if (player.lastLevel == null || player.lastLevel <= 0)
                player.lastLevel = 1;

            if (player.timePlayed == null || player.timePlayed <= 0)
                player.timePlayed = 0;

            if (player.currentLives == null || player.currentLives <= 0)
                player.currentLives = 3;

            if (player.levelMax == null || player.levelMax <= 0)
                player.levelMax = 0;

            leaderBoard.addOrUpdateCharacter(player,
                (c) => {
                    player = c[0];
                    callback();
                },
                (error) => {
                    console.error(error);
                });
        }
    },
        (error) => {
            console.error(error);
        });

}

var initStartScreen = () => {

    if (divLoged.hasClass('hidden'))
        divLoged.removeClass('hidden');

    if (!divLogin.hasClass('hidden'))
        divLogin.addClass('hidden');


    var img = $("#sImgChar");

    if (player && player.imageUrl != null) {
        img.attr('src', player.imageUrl);
        img.show();
    }

    $('#sLastPlayedTime').html('Last Played : ' + player.updatedDate.toDateString());
    $('#sLastSessionLevel').html('Last Session level : ' + player.lastLevel);
    $('#sCharacterHighScore').html('High Score : ' + player.highScore);

    divLoged.show();
    modal.modal('hide')

}

// Login action
btnFacebook.click(() => {
    login('facebook', () => {
        initStartScreen();
    });
});
btnGoogle.click(() => {
    login('google', () => {
        initStartScreen();
    });
});
btnMicrosoft.click(() => {
    login('microsoftaccount', () => {
        initStartScreen();
    });
});


// Starting a new game
btnStart.click(() => {
    gameViewport.css('z-index', '1');
    container.hide();

    var img = $("#imgChar");

    if (player && player.imageUrl != null) {
        img.attr('src', player.imageUrl);
        img.show();
    }
    startGame();
});

btnLogout.click(() => {
    disconnect();
});

gameViewport.css('z-index', '-1');

// Get the current user
var u = leaderBoard.getCurrentUser();

// if already logged
if (u != null && u.userId != null) {

    divLoged.removeClass('hidden');

    var profile = leaderBoard.getLoginProvider();

    leaderBoard.getCharacterFromProfile(profile.source,
        (chars) => {
            if (chars && chars.length > 0) {
                player = <LightSpeed.Player>chars[0];

                initStartScreen();

                divLoged.show();
                modal.modal('hide')
            }
        },
        (error) => {
            console.error(error);
        });
} else {
    divLogin.removeClass('hidden');

}


var loader = new LightSpeed.Loader();

loader.load(canvas, (r) => {

    // Get results
    scene = r.scene;
    engine = r.engine;
    camera = r.camera;
    playerGraphic = r.playerGraphic;
    particleTexture = r.particleTexture;
    radar = r.radar;
    enemyship = r.enemyship;
    bulletobj = r.bulletobj;
    bulletobj2 = r.bulletobj2;
    bulletobj3 = r.bulletobj3;
    rock = r.rock;
    rock2 = r.rock2;
    mine = r.mine;

    playerShip = new LightSpeed.PlayerShip(scene, camera, playerGraphic, particleTexture);

    playerShip.resetOccured = () => {
        $('#lightSpeedReminder').hide();
    }

    // ship speed gauge change
    playerShip.lightSpeedGaugeChanged = (val) => {
        var v = $('#lightSpeedGauge').width();
        $('#lightSpeedGauge').width(val);
    }

    // ship health change
    playerShip.healthGaugeChanged = (val) => {
        var v = $('#healthGauge').width();
        $('#healthGauge').width(val);
    }

    // ship light speed ready
    playerShip.lightSpeedReadyOccured = () => {
        GameSound.play("lightspeedready");

        $('#lightSpeedReady').show();
        $('#lightSpeedReady').css('opacity', '1');

        $('#lightSpeedReminder').show();
        $('#lightSpeedReminder').css('opacity', '1');
    }

    // ship explode
    // LeaderBoard decrement lives
    playerShip.explodeOccured = () => {

        player.currentLives -= 1;

        if (player.kills > player.experience)
            player.experience = player.kills;

        leaderBoard.addOrUpdateCharacter(player);

        $('#deadScreen').show();
    }

    // ship jumpt to next level;
    playerShip.jumpToLightSpeedEnd = () => {

        player.lastLevel = gameLevel;
        gameLevel += 1;
        player.levelMax = Math.max(gameLevel, player.levelMax);

        leaderBoard.addOrUpdateCharacter(player);

        sceneReset();
    }

    playerShip.pointsChanged = (levelPoints, gamePoints) => {

        $('#levelPoints').html('Points to next level : ' + playerShip.levelPoints.toString() + " / " + nextlvlneed.toString());
        $('#gamePoints').html('Score : ' + playerShip.gamePoints.toString());

        player.levelPoints = levelPoints;
        player.highScore = Math.max(player.highScore, gamePoints);
    }

    // player ship level change
    playerShip.shipLevelChanged = (lvl, speed, health, bulletDamage) => {

        player.shipLevel = lvl;

        // get next level need points
        nextlvlneed = levelingDefs[playerShip.shipLevel + 1].need;

        $('#shipLevel').html("Current Ship Level:" + lvl);

        $('#levelUp').show();
        $('#levelUp').css('opacity', '1');

    }

    var beforeRender = function () {
        time = time + (1 / BABYLON.Tools.GetFps());
        // StatusText.innerHTML = scene.getActiveParticles();// BABYLON.Tools.GetFps().toFixed() + " FPS";
        adjmovement = scene.getAnimationRatio();

        if (loader.isLoaded == true && pause == false) {

            // update playerShip
            playerShip.update(up, down, left, right, adjmovement, height, width, playingBoardSize);


            // making level up message desappear if actually shown
            var op = +$('#levelUp').css('opacity');
            if (op > 0)
                $('#levelUp').css('opacity', (op - 0.01).toString());

            op = +$('#lightSpeedReady').css('opacity');
            if (op > 0)
                $('#lightSpeedReady').css('opacity', (op - 0.01).toString());


            /////////check for collisions/////////////////////
            var index = enemies.length;

            while (index--) {

                var enemy = enemies[index];

                // an ennemy is dead and we must dispose it (or respawn it
                if (!enemy.canRespawn && enemy.health <= 0) {
                    delete enemies[index];
                    enemies.splice(index, 1);
                    enemy.dispose();
                    continue;
                }
                if (enemy.canRespawn && enemy.health <= 0) {
                    enemy.respawn();
                    continue;
                }

                // Enemy is alive
                enemy.update();

                if (playerShip.canMove == true) {

                    var bulletCount = playerShip.bullets.length;

                    while (bulletCount--) {
                        // check enemy visibility and bullet visibility
                        if (enemy.enemyMesh.isVisible == true && playerShip.bullets[bulletCount].graphic.isVisible == true) {
                            // check intersection
                            if (enemy.enemyMesh.intersectsMesh(playerShip.bullets[bulletCount].graphic, true)) {
                                // get damage on enemy
                                enemy.getDamage(playerShip.bullets[bulletCount].damage);
                                // bullet desapear
                                playerShip.bullets[bulletCount].graphic.isVisible = false;
                                playerShip.bullets[bulletCount].graphic.dispose();
                                // clean bullet from bullets collection
                                playerShip.bullets.splice(bulletCount, 1);
                            }
                        }
                    }
                    // check collision beetween player and enemy
                    if (playerShip.boundingBox.intersectsMesh(enemy.enemyMesh, true) == true) {
                        if (enemy.enemyMesh.isVisible == true) {

                            // player get damages from enemy max health
                            playerShip.getDamage(enemy.maxHealth / 2);

                            // enemy get damages from player max health
                            enemy.getDamage(playerShip.maxHealth / 2);
                        }
                    }
                }
            }
        }
    }

    scene.registerBeforeRender(() => beforeRender());

    engine.runRenderLoop(() => {
        //StatusText.innerHTML = scene.getActiveParticles();// BABYLON.Tools.GetFps().toFixed() + " FPS";
        scene.render();
    });
}, () => {
        //startDisplay.innerHTML = "<div class='alert'>Sorry, your browser exudes awesomeness.<br> Just not awesome enough to play this game.<br>  Why don't you try IE 11, Firefox or Google Chrome instead.</div>";
        //startDisplay.style.display = "block";
        //loadingMessage.style.display = "none";

    });

var sceneReset = function () {

    if (enemies && enemies.length > 0) {
        var xEnemy = enemies.length;
        while (xEnemy--) {
            enemies[xEnemy].dispose();
        }
    }

    enemies = LightSpeed.BaseEnemy.SpawnEnemies(gameLevel);
    camera.radius = 500;
    camera.target = playerShip.cameraFollower.position;

    // get next level need points
    nextlvlneed = levelingDefs[playerShip.shipLevel + 1].need;

    // hiding dead screen
    $('#deadScreen').hide();

    // hiding speed ready message. set opacity to be able to desaspear with opacity animation
    $('#lightSpeedReady').hide();
    $('#lightSpeedReady').css('opacity', '1');

    // set light speed gauge to 0;
    $('#lightSpeedGauge').width(0);

    // hiding reminder of light speed in speed gauge
    $('#lightSpeedReminder').hide();

    // hiding level up message and set opacity to be able to make it desapear
    $('#levelUp').css('opacity', '1');
    $('#levelUp').hide();

    // set informations
    $('#gameLevel').html("Current Game Level :" + gameLevel.toString());
    $('#shipLevel').html("Current Ship Level :" + player.shipLevel.toString());
    $('#characterHighScore').html('High Score ' + player.highScore.toString());
    $('#levelPoints').html('Points to next level : ' + playerShip.levelPoints.toString() + " / " + nextlvlneed.toString());
    $('#gamePoints').html('Score : ' + player.levelPoints.toString() + " / " + nextlvlneed.toString());


    playerShip.reset();
};

var startGame = function () {

    gameLevel = 1;
    playerShip.gamePoints = 0;

    sceneReset();
    loaded = true;
};

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function handleKeyUp(event) {
    if (loaded) {
        if (event.keyCode == 68 || event.keyCode == 39) {
            right = false;
        }
        if (event.keyCode == 65 || event.keyCode == 37) {
            left = false;
        }
        if (event.keyCode == 87 || event.keyCode == 38) {
            up = false;
        }
        if (event.keyCode == 83 || event.keyCode == 40) {
            down = false;
        }
    }
}

function handleKeyDown(event) {
    if (loaded) {
        if (event.keyCode == 68 || event.keyCode == 39) {
            if (loaded == true) {
                right = true;
            }
        }
        if (event.keyCode == 65 || event.keyCode == 37) {
            if (loaded == true) {
                left = true;
            }
        }
        if (event.keyCode == 87 || event.keyCode == 38) {
            if (loaded == true) {
                up = true;
            }
        }
        if (event.keyCode == 83 || event.keyCode == 40) {
            if (loaded == true) {
                down = true;
            }
        }

        if (event.keyCode == 82) {
            playerShip.jumpToLightSpeed();
        }

        if (event.keyCode == 80) {
            PauseGame(!pause)
        }

    }
}

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

window.onblur = function () {
    //if (loaded) {
    //    PauseGame(true)
    //}

};

function PauseGame(status) {
    if (playerShip.canMove == true) {
        pause = status;
        if (pause) { pausedMessage.style.display = "block"; }
        else if (!pause) { pausedMessage.style.display = "none"; }
    }
}
