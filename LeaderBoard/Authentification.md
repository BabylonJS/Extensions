# Authentification #


## Azure Mobile Services configuration ##

First of all, you need to configure your Azure Mobile Services backend to be able to use the Leaderboard client SDK for authentification.

[Register your app for authentication and configure Mobile Services](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/)

Here is my Facebook application setup process :

**Creating an application :**

![](http://www.dotmim.com/sitefiles/leaderboard/createfacebookapp.JPG)

**Configuring the basic settings, and copy the App Id and App Secret :**

![](http://www.dotmim.com/sitefiles/leaderboard/facebooksettingsbasics.JPG)

**Configuring the advanced settings :**

![](http://www.dotmim.com/sitefiles/leaderboard/facebooksettingsadvanced.JPG)

**Activating the facebook application :**

![](http://www.dotmim.com/sitefiles/leaderboard/facebookstatus.JPG)

**Configuring Azure Mobile Services backend :**

![](http://www.dotmim.com/sitefiles/leaderboard/zumoidentityfacebook.JPG)

Here are the documentations for configuring :   

1. **Twitter**	: [http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-twitter-authentication/](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-twitter-authentication/)   
2. **Facebook**	: [http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-facebook-authentication/](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-facebook-authentication/)   
3. **Google** : [http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-google-authentication/](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-google-authentication/)   
4. **MicrosoftAccount** : [http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-microsoft-authentication/](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-register-microsoft-authentication/)   


## Using the Leaderboard Authentification SDK ##

When you use the Leaderboard authentification API, you will :

1. Be authentified
2. Have your character item modified with your authentification token.

Here is the code, pretty straightforward to authenticate a user:

	client.loginWithFacebook(function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});


You will have a popup from Facebook to allow your application to get basics informations about your user :

![](http://www.dotmim.com/sitefiles/leaderboard/popupfacebook.JPG)

Once you have accepted, you will receive this response from the Leaderboard backend :

	[
		{
			"id": 13,
			"gameId": 1,
			"name": "Sébastien Pertus",
			"email": null,
			"firstName": "Sébastien",
			"lastName": "Pertus",
			"createdDate": "2014-10-16T09:52:05.380Z",
			"updatedDate": "2014-10-16T09:52:05.380Z",
			"facebookId": "102030044.....",
			"twitterId": null,
			"googleId": null,
			"liveId": null,
			"imageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/10583999_10202552360029714_426268629706075019_n.jpg?oh=2acd7ede0e4eb0b83beb6fb0556d7d20&oe=54B489D1&__gda__=1420686638_d6fb8600be679dd1fd44a5c0263081e0",
			"achievementPoints": null,
			"kills": null,
			"lives": null,
			"rank": null,
			"timePlayed": null,
			"inventory": null,
			"lastLevel": null,
			"currentLevel": null,
			"currentTime": null,
			"currentBonus": null,
			"currentKills": null,
			"currentGolds": null,
			"currentLives": null,
			"experience": null,
			"latitude": null,
			"longitude": null
		}
	]

As you can see, you are connected and your character inherits from your facebook basics informations

			"imageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/10583999_10202552360029714_426268629706075019_n.jpg?oh=2acd7ede0e4eb0b83beb6fb0556d7d20&oe=54B489D1&__gda__=1420686638_d6fb8600be679dd1fd44a5c0263081e0"
			"name": "Sébastien Pertus",
			"firstName": "Sébastien",
			"lastName": "Pertus",
			"facebookId": "102030044......",

From now, you can also get some basics informations within the Lederboard SDK :

**getLoginProvider()** will show you how you're connected (Facebook, Microsoft, Google, Twitter) :

	console.log(client.getLoginProvider());

The result:

	{
		"source": "facebook",
		"id": "10203004436611346"
	}

**getFacebookProfile()** will retrieve your basics informations from Facebook API :

	client.getFacebookProfile(function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

The result :
	
	[
		{
			"source": "facebook",
			"id": "102030044.......",
			"name": "Sébastien Pertus",
			"firstName": "Sébastien",
			"lastName": "Pertus",
			"smallImageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/10583999_10202552360029714_426268629706075019_n.jpg?oh=2acd7ede0e4eb0b83beb6fb0556d7d20&oe=54B489D1&__gda__=1420686638_d6fb8600be679dd1fd44a5c0263081e0",
			"gameId": 1
		}
	]


**getCurrentUser()** will retrieve your Mobile Services authentifcation token :


	console.log(client.getCurrentUser());

The result :

	{
		"userId": "Facebook:10203004436611346",
		"mobileServiceAuthenticationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAifQ.eyJleHAiOjE0MTYwNDUxMjIsImlzcyI6InVybjp9HcVcyaXdQMVYxVmpIV3pRbW4zWHZzakFDcmcvSklzdk55aWFoSDFhb2VKd1k5T1REUWF5MnBpYjdPdEdWNVJiTDV5N3VZa0lCV2o3WXBmMG14SFdPN3dTQm5FUUVvSW53In0.1FGx-stxHxSRDLr-ngdYU8ooeYXwiikqil42C43wZH4"
	}


**logout()** will logout your current session :

	console.log(client.logout());

