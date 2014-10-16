# LightSpeed sample  #


The LightSpeed sample comes from an original sample, created by [@Xanmia](http://twitter.com/xanmia).  
The original version is available here : [http://xanmia.github.io/Light-Speed-Ready/game.html](http://xanmia.github.io/Light-Speed-Ready/game.html)

## The LightSpeed project ##

First of all, the LightSpeed project you will find in the source code provided with the Leaderboard SDK is a totally reworked project:

- Rewrited within typescript
- Reworked to allow a player to login, logout and retrieve its informations within the Leaderboard SDK

## Initialization ##

All the leaderboard javascript code is located in the **/Scripts/lightspeed/index.js** file.

Here is my leaderboard setup

	var applicationUrl = "https://babylonjs.azure-mobile.net/";
	var applicationKey = "dHfEVuqRtCczLC......";
	var gameId = 1;
	var leaderBoard = new BABYLON.LeaderBoard.Client(applicationUrl, applicationKey, gameId);
	var player;


## Login Process ##

![](http://www.dotmim.com/sitefiles/leaderboard/lslogin.JPG)

During the login process, I need to log my player and set some custom fields. 

**But before login, we can check if my user is already logged :**  
 
The **getCurrentUser()** will retrieve the user information saved locally.   
If the user is not null, the **getLoginProvider()** will retrieve which provider was used for login.   
Then the **getCharacterFromProfile()** will retrieve the full profile form the Leaderboard backend

	
	// Get the current user
	var u = leaderBoard.getCurrentUser();
	
	// if already logged
	if (u != null && u.userId != null) {
	    divLoged.removeClass('hidden');
	
	    var profile = leaderBoard.getLoginProvider();
	
	    leaderBoard.getCharacterFromProfile(profile.source, function (chars) {
	        if (chars && chars.length > 0) {
	            player = chars[0];
	
	            initStartScreen();
	
	            divLoged.show();
	            modal.modal('hide');
	        }
	    }, function (error) {
	        console.error(error);
	    });
	} else {
	    divLogin.removeClass('hidden');
	}



If my user is not logged (or if he logout), I can log him with three different providers :

	// Login action
	btnFacebook.click(function () {
	    login('facebook', function () {
	        initStartScreen();
	    });
	});
	btnGoogle.click(function () {
	    login('google', function () {
	        initStartScreen();
	    });
	});
	btnMicrosoft.click(function () {
	    login('microsoftaccount', function () {
	        initStartScreen();
	    });
	});

And here is the code from my login method (where I log, set custome fields and save my character) :


	var login = function (provider, callback) {
	    leaderBoard.loginWithProfile(provider, function (chars) {
	        if (chars && chars.length > 0) {
	            player = chars[0];
	
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
	
	            leaderBoard.addOrUpdateCharacter(player, function (c) {
	                player = c[0];
	                callback();
	            }, function (error) {
	                console.error(error);
	            });
	        }
	    }, function (error) {
	        console.error(error);
	    });
	};

Once logged, i can set the HTML elements :

	var initStartScreen = function () {
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
	    modal.modal('hide');
	};


![](http://www.dotmim.com/sitefiles/leaderboard/lslogged.JPG)


## Updating informations during the session ##

During the game session, my player will gains some points.   
I just update its character profile, without saving : 

	 playerShip.pointsChanged = function (levelPoints, gamePoints) {
	        $('#levelPoints').html('Points to next level : ' + 
					playerShip.levelPoints.toString() + " / " + nextlvlneed.toString());
	        $('#gamePoints').html('Score : ' + playerShip.gamePoints.toString());
	
	        player.levelPoints = levelPoints;
	        player.highScore = Math.max(player.highScore, gamePoints);
	    };

The saving processus occured when the player change level or die :

	
	  // ship explode
	    // LeaderBoard decrement lives
	    playerShip.explodeOccured = function () {
	        player.currentLives -= 1;
	
	        if (player.kills > player.experience)
	            player.experience = player.kills;
	
	        leaderBoard.addOrUpdateCharacter(player);
	
	        $('#deadScreen').show();
	    };
	
	    // ship jumpt to next level;
	    playerShip.jumpToLightSpeedEnd = function () {
	        player.lastLevel = gameLevel;
	        gameLevel += 1;
	        player.levelMax = Math.max(gameLevel, player.levelMax);
	
	        leaderBoard.addOrUpdateCharacter(player);
	
	        sceneReset();
	    }

![](http://www.dotmim.com/sitefiles/leaderboard/lsplay.JPG)