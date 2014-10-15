# Leaderboard Client SDK #

## Project architecture ##

Installing the leaderboard client SDK is pretty straightforward.
The client SDK is composed with a single javascript file, called **leaderboard.js**

You will find it in the github repository, in the **/Client** directory.

> If you are a Typscript developer, you will find the Typescript version of the leaderboard called **leaderboard.ts**

As I mentioned in the summary of Leaderboard sdk, there is one dependency on the leaderboard client SDK : The Azure Mobile Services Javascript SDK. 
You can find the github repository here : [https://github.com/Azure/azure-mobile-services](https://github.com/Azure/azure-mobile-services)

Here is the CDN javascript source links (normal and minified version) :  

- [http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.js](http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.js)
- [http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.min.js](http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.min.js)

Here is my project starter, after installing both sdk, and a simple javascript file (examples.js) that i will use to make some tests :

![](http://www.dotmim.com/sitefiles/leaderboard/leaderboardstarterproject.JPG)

And here is my index.html file source code :

    <!DOCTYPE html>
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	    <title></title>
    	<script src='http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.js'></script>
	    <script src="js/leaderboard.js" type="text/javascript"></script>
	    <script src="js/examples.js" type="text/javascript"></script>
	</head>
	<body>
	
	</body>
	</html>

## Mobile Services keys ##

From Azure Mobile Services, you need the autnentication keys:


- **The application key** : Required for the setup and client API.
- **The master key** : Required for the setup API. Setup API allows you to create games, characters etc ... so it require administrator rights, which are available through the master key.

![](http://www.dotmim.com/sitefiles/leaderboard/keys.JPG)

# Using the client SDK #

First of all, if you want to play with the SDK, without having to creat a local website or an azure mobile services account, you can play with the Leaderboard Playground available here :  
**TODO**  
You won't be able to do some scenarios (like deleting games or sending emails) but you will have a good point of view of the capabilities of the client SDK.

## Creating a game ##


Here is the code for creating a game :

    var applicationUrl = 'https://lightspeedbackend.azure-mobile.net/';
	var applicationKey = 'WnMUrftvAIDmVqezH***************';
	var masterKey = 'DBnAvXPApyeHGryooSf****************';
	
	// Creating an administrator setup instance
	var setup = new BABYLON.LeaderBoard.Setup(applicationUrl, applicationKey, masterKey);
	
	// creating a game
	setup.createGame({
	        name: "LightSpeed"
	    },{
	        name: "Mimetis",
	        email: "sebastien.pertus@gmail.com"
	    },function (r) {
	        console.log(r);
	    },function (error) {
	        console.error(error);
	});

The game table is composed of many fields you can use.
You can create a game by filling multiple fields. The name is the only mandatory field.
So our code may looks like this :

	// creating a game
	setup.createGame({
	    name: "LightSpeed",
	    shortdescription: "Light speed game",
	    longdescription: "Light speed is a great game illustrating the leaderboard sdk ",
	    levelsCount: "12",
	    platform: "Mobile",
	    gameUrl: "http://foo.com/download",
	    websiteUrl: "http://foo.com",
	    playersCount: "12",
	    status: "1",
	    iconFile: "http://foo.com/icon.jpg"
	}, {
	    name: "Mimetis",
	    email: "sebastien.pertus@gmail.com"
	}, function (r) {
	    console.log(r);
	}, function (error) {
	    console.error(error);
	});

Here is a screenshot from the console (F12 tools in IE. you can use Chrome as well :) ) :

![](http://www.dotmim.com/sitefiles/leaderboard/consolecreategame.JPG)

This response is a **JSON array** composed with the game and you first character :

	[
		{
			"name": "LightSpeed",
			"shortdescription": "Light speed game",
			"longdescription": "Light speed is a great game illustrating the leaderboard sdk ",
			"levelsCount": 12,
			"platform": "Mobile",
			"gameUrl": "http://foo.com/download",
			"websiteUrl": "http://foo.com",
			"playersCount": 12,
			"status": true,
			"iconFile": "http://foo.com/icon.jpg",
			"id": 1
		},
		{
			"name": "Mimetis",
			"email": "sebastien.pertus@gmail.com",
			"gameId": 1,
			"id": 1
		}
	]


> Every response from the Leadeboard backend is a JSON Array, even if the response is a single object.

Now that you game is created, you must pick the game ID. (in this sample the gameID is : **1**)
This game id will be required for all the **client** requests and some **setup** requests.

## Getting game informations ##

You can get informations from your game with the client or setup API :

	setup.getGame("1",function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

Result :

	[
		{
			"id": 1,
			"name": "LightSpeed",
			"shortDescription": "Light speed game",
			"longDescription": "Light speed is a great game illustrating the leaderboard sdk ",
			"blobAccountName": null,
			"blobAccountKey": null,
			"blobContainerName": null,
			"sendgridSmtpServer": null,
			"sendgridPassword": null,
			"sendgridUsername": null,
			"createdDate": "2014-10-13T13:34:15.460Z",
			"updatedDate": "2014-10-15T14:09:41.310Z",
			"levelsCount": 12,
			"platform": "Mobile",
			"gameUrl": "http://foo.com/download",
			"websiteUrl": "http://foo.com",
			"playersCount": 12,
			"status": true,
			"iconFile": "http://foo.com/icon.jpg"
		}
	]

Updating game is pretty straightforward, using the **updateGame** method :

	setup.updateGame({
	        "id":1,
	        "name": "LightSpeed",
	        "shortDescription": "Light speed game",
	        "longDescription": "Light speed is a great game illustrating the leaderboard sdk ",
	        "levelsCount": 10,
	        "platform": "Mobile",
	        "gameUrl": "http://foo.com/download",
	        "websiteUrl": "http://foo.com",
	        "playersCount": 12,
	        "status": true,
	        "iconFile": "http://foo.com/icon.jpg"}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});

## Adding custom fields ##

There are lot fields already available in the game (and all the tables such as Characters, Rewards, Achievements etc ...) from within you can personalize your backend.
Even with those fields, you may want others fields.   
We called them **custom fields**

Adding a custom field is pretty straightforward with the Leaderboard client SDK.
Just add them in your game JSON struct when you update your game.

For example, assuming we need an additionnal field four our game : **scoresCount**  
Here is the updateGame method :

	setup.updateGame({
	        "id":1,
	        "name": "LightSpeed",
			"scoresCount" : 0
			}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});

And the response for the Leaderboard :

	[
		{
			"id": 1,
			"name": "LightSpeed",
			"shortDescription": "Light speed game",
			"longDescription": "Light speed is a great game illustrating the leaderboard sdk ",
			"blobAccountName": null,
			"blobAccountKey": null,
			"blobContainerName": null,
			"sendgridSmtpServer": null,
			"sendgridPassword": null,
			"sendgridUsername": null,
			"createdDate": "2014-10-13T13:34:15.460Z",
			"updatedDate": "2014-10-15T15:03:42.550Z",
			"levelsCount": 10,
			"platform": "Mobile",
			"gameUrl": "http://foo.com/download",
			"websiteUrl": "http://foo.com",
			"playersCount": 12,
			"status": true,
			"iconFile": "http://foo.com/icon.jpg",
			"scoresCount": 0
		}
	]

**Note :** This additional fields is located in a custom column in the database backend called "**f**"


## Enabling the Azure Storage option ##

If you have big pictures or any kind of files you want to upload in your backend, you can use the blob storage from you azure account.

If you want more informations about this Azure feature, here is the documentation about it :

[http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/](http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/)   

For this sample, I will create a new storage account called **lightspeedbackendstorage** :

![](http://www.dotmim.com/sitefiles/leaderboard/createazurestorage.JPG)

Once created you just need to retrieve the storage account name and an access key :

![](http://www.dotmim.com/sitefiles/leaderboard/manageazurestoragekeys.JPG)

And then call the **setBlobAccount** method :  

    setup.setBlobAccount("1",
		"lightspeedbackendstorage",
		"23kNrlErlAl90VccCGenvnSsyBTZ1o**********",
		"assets",
	function (r){console.log(r);},
	function (error){console.error(error);});

And here is the response :

	[
		{
			"id": 1,
			"blobAccountName": "lightspeedbackendstorage",
			"blobAccountKey": "23kNrlErlAl90VccCGenvnSsyBTZ*****==",
			"blobContainerName": "assets"
		}
	]

You may have some problems with the CORS functionnality with your azure storage account.

Call the getCors() and setCors() methods
	
	setup.getCors("1",function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

The result :

	[
		{
			"Logging": {
				"Version": "1.0",
				"Read": "false",
				"Write": "false",
				"Delete": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"HourMetrics": {
				"Version": "1.0",
				"Enabled": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"MinuteMetrics": {
				"Version": "1.0",
				"Enabled": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"Cors": {}
		}
	]

As you can see, there is no Cors metadatas configured.   
We can do it within the **setCors()** method :

	setup.setCors("1",function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

And here is the result :

	[
		{
			"Logging": {
				"Version": "1.0",
				"Read": "false",
				"Write": "false",
				"Delete": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"HourMetrics": {
				"Version": "1.0",
				"Enabled": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"MinuteMetrics": {
				"Version": "1.0",
				"Enabled": "false",
				"RetentionPolicy": {
					"Enabled": "false"
				}
			},
			"Cors": {
				"CorsRule": [
					{
						"AllowedMethods": [
							"POST",
							"PUT"
						],
						"AllowedOrigins": [
							"*"
						],
						"AllowedHeaders": [
							"*"
						],
						"ExposedHeaders": [
							"*"
						],
						"MaxAgeInSeconds": 3600
					}
				]
			}
		}
	]

## Enabling Mailing support within SendGrid API ##

With Azure Mobiles Services, you can send emails within SendGrid.   
More informations here : [http://azure.microsoft.com/en-us/documentation/articles/store-sendgrid-mobile-services-send-email-scripts/](http://azure.microsoft.com/en-us/documentation/articles/store-sendgrid-mobile-services-send-email-scripts/) 

Once you have your credentials, you can configure SendGrid for the Leaderboard backend as well :

	setup.setSendgridAccount("1",
			"sendgrid.net",
			"azure_905b65****@azure.com",
			"c5fFb7NG****",
	function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

And the result :

	[
		{
			"id": 1,
			"sendgridSmtpServer": "sendgrid.net",
			"sendgridUsername": "azure_905b65*******b@azure.com",
			"sendgridPassword": "c5fFb7NG*****"
		}
	]

