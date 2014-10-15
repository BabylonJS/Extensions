# Managing entities #

Within the Leaderboard SDK, you will have access to severals entities:   
1. Games   
2. Characters   
3. Achievements   
4. Rewards   
5. CharacterScores   
6. CharacterRewards   
7. Image   

In this tutorial, we will focus on the Character table, but everything we'll see here, work with every table (except Games / Image)

## Leaderboard Client Api ##

The client API works for a gameId.  
The client constructor should look like this (assuming our gameId is "1")

	var client= new BABYLON.LeaderBoard.Client(
		"https://lightspeedbackend.azure-mobile.net/",
		"WnMUrftvAIDmV******",
		1);


## Adding / Updating Character ##

Within the leaderboard client SDK, you have only one method for adding / updating a character.  
The API method **addOrUpdateCharacter** take a JSON object in input, representing a character.

As you will see, specifying all the fields is not mandatory.

*In this sample, we don't specify the Character ID, so we will create a new character*


	client.addOrUpdateCharacter({
		name:"John",
		email:"john.snow@foo.net",
		firstName:"John",
		lastName:"Snow",
		achievementPoints:"0",
		kills:"0",
		lives:"3",
		rank:"1"
	}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});

Here is the response :

	[
		{
			"id": 2,
			"gameId": 1,
			"name": "John",
			"email": "john.snow@foo.net",
			"firstName": "John",
			"lastName": "Snow",
			"createdDate": "2014-10-15T16:10:30.193Z",
			"updatedDate": "2014-10-15T16:10:30.193Z",
			"facebookId": null,
			"twitterId": null,
			"googleId": null,
			"liveId": null,
			"imageUrl": null,
			"achievementPoints": 0,
			"kills": 0,
			"lives": 3,
			"rank": 1,
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

Updating the character is straightforward, just specify the **id** field, like this :

	client.addOrUpdateCharacter({
		id:"2",experience:"1000"
	}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});

And the response :

	[
		{
			"id": 2,
			"gameId": 1,
			"name": "John",
			"email": "john.snow@foo.net",
			"firstName": "John",
			"lastName": "Snow",
			"createdDate": "2014-10-15T16:10:30.193Z",
			"updatedDate": "2014-10-15T16:13:00.670Z",
			"facebookId": null,
			"twitterId": null,
			"googleId": null,
			"liveId": null,
			"imageUrl": null,
			"achievementPoints": 0,
			"kills": 0,
			"lives": 3,
			"rank": 1,
			"timePlayed": null,
			"inventory": null,
			"lastLevel": null,
			"currentLevel": null,
			"currentTime": null,
			"currentBonus": null,
			"currentKills": null,
			"currentGolds": null,
			"currentLives": null,
			"experience": 1000,
			"latitude": null,
			"longitude": null
		}
	]

As you can see, we have always all the fields from the Character table in the JSON response.  
Assuming we don't want every fields, we can specify the fields we need, with the special property called **fields** :

	client.addOrUpdateCharacter({
		id:"2",
		experience:"1000",
		fields:"id,name,experience,email"
	}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});

The response is :

	[
		{
			"id": 2,
			"name": "John",
			"experience": 1000,
			"email": "john.snow@foo.net"
		}
	]

The **field** property works with every method, such as **get\***, **addOrUpdate\*** etc ..

## Getting characters ##

You can get a single character identified by its **name** and **gameId**, or all the characters :  
1. **getCharacter()** : get a single character   
2. **getCharacters()** : get a list of characters   



	client.getCharacter("John"
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	});


The result:

	[
		{
			"id": 2,
			"gameId": 1,
			"name": "John",
			"email": "john.snow@foo.net",
			"firstName": "John",
			"lastName": "Snow",
			"createdDate": "2014-10-15T16:10:30.193Z",
			"updatedDate": "2014-10-15T16:22:31.120Z",
			"facebookId": null,
			"twitterId": null,
			"googleId": null,
			"liveId": null,
			"imageUrl": null,
			"achievementPoints": 0,
			"kills": 0,
			"lives": 3,
			"rank": 1,
			"timePlayed": null,
			"inventory": null,
			"lastLevel": null,
			"currentLevel": null,
			"currentTime": null,
			"currentBonus": null,
			"currentKills": null,
			"currentGolds": null,
			"currentLives": null,
			"experience": 1000,
			"latitude": null,
			"longitude": null
		}
	]

As you know now, if you don't want every fields, you can add the **fields** property to reduce the properties from the response:

	client.getCharacter("John",{
		fields:"name,id"
	}
	,function (r){
		console.log(r);
	}
	,function (error){
		console.error(error);
	});

The Result:

	[
		{
			"name": "John",
			"id": 2,
			"email": "john.snow@foo.net"
		}
	]

Getting characters within **getCharacters** method will retrieve a list of characters.   
I use the **fields** property to reduce the response :

	client.getCharacters({fields:"name,id"}
	,function (r){
	console.log(r);
	}
	,function (error){
	console.error(error);
	}); 

The result :

	[
		{"name": "Achum","id": 3},
		{"name": "Awary","id": 7},
		{"name": "Eldori","id": 10}, 
		{"name": "Elionc","id": 12},
		{"name": "Imi","id": 5},
		{"name": "Jexyna","id": 4},
		{"name": "John","id": 2},
		{"name": "Mimetis","id": 1},
		{"name": "Rothest","id": 11},
		{"name": "Sasyto","id": 9},
		{"name": "Sayem","id": 8},
		{"name": "Urnnhon","id": 6}
	]

## Sorting and Fitering results ##

When you call an API where you retrieve an array (like getCharacters) you can specify a **filter** object and an **ordering** object.   
Here is a sample where we get only **characters** where the **rank** property is equal to 1, the **order** is the name, and the **ordering** is ascending :

	client.getCharacters({
		order:{
			orderBy:"name",
			order:"asc"},
		where:{ 
			rank:1 },
		fields:"name,id"},

		function (r){console.log(r);},
		function (error){console.error(error);}
	);

The Result :

	[
		{
			"name": "Elionc",
			"id": 12
		},
		{
			"name": "John",
			"id": 2
		}
	]

You can filter with **page** and **count** parameters :

	client.getCharacters({
		order:{
			orderBy:"rank",
			order:"asc",
			page:1,
			count:5},
		fields:"rank,name,id"},
		function (r){console.log(r);},
		function (error){console.error(error);}
	)

The Result :

	[
		{
			"rank": null,
			"name": "Mimetis",
			"id": 1
		},
		{
			"rank": 1,
			"name": "John",
			"id": 2
		},
		{
			"rank": 1,
			"name": "Elionc",
			"id": 12
		},
		{
			"rank": 2,
			"name": "Rothest",
			"id": 11
		},
		{
			"rank": 3,
			"name": "Eldori",
			"id": 10
		}
	]


## Custom fields ##

There are lot fields already available in the **character** table from within you can personalize your backend.
Even with those fields, you may want others fields.   
We called them **custom fields**

Adding a custom field is pretty straightforward with the Leaderboard client SDK.
Just add them in your character JSON struct when you update or create your character.

For example, assuming we need  additionnals fields four a character: 


1. **shipLevel** : Number : the level of my space ship
2. **highScore** : Number : the character highest score
3. **levelMax** : Number : the character max level
4. **remarks** : String : the characters remarks

Here is the addOrUpdateCharacter method :

	client.addOrUpdateCharacter({
		    id:"2",
		    name:"John",
		    shipLevel:10,
		    highScore:1500,
		    levelMax:3,
		    remarks:"This is an awesome game, but it's a little bit too hard for me :)"},
		function (r){console.log(r);},
		function (error){console.error(error);}
	);

The response :

	[
		{
			"id": 2,
			"gameId": 1,
			"name": "John",
			"email": "john.snow@foo.net",
			"firstName": "John",
			"lastName": "Snow",
			"createdDate": "2014-10-15T16:10:30.193Z",
			"updatedDate": "2014-10-15T17:11:53.923Z",
			"facebookId": null,
			"twitterId": null,
			"googleId": null,
			"liveId": null,
			"imageUrl": null,
			"achievementPoints": 0,
			"kills": 0,
			"lives": 3,
			"rank": 1,
			"timePlayed": null,
			"inventory": null,
			"lastLevel": null,
			"currentLevel": null,
			"currentTime": null,
			"currentBonus": null,
			"currentKills": null,
			"currentGolds": null,
			"currentLives": null,
			"experience": 1000,
			"latitude": null,
			"longitude": null,
			"shipLevel": 10,
			"highScore": 1500,
			"levelMax": 3,
			"remarks": "This is an awesome game, but it's a little bit too hard for me :)"
		}
	]

If we get all the characters, only **John** have those additionnals fields :

	client.getCharacters(
		{fields:"name,id,shipLevel,highScore,levelMax,remarks"},
		function (r){console.log(r);},
		function (error){console.error(error);}
	);


The response :

	[
		{
			"name": "Mimetis",
			"id": 1
		},
		{
			"name": "John",
			"id": 2,
			"shipLevel": 10,
			"highScore": 1500,
			"levelMax": 3,
			"remarks": "This is an awesome game, but it's a little bit too hard for me :)"
		},
		{
			"name": "Achum",
			"id": 3
		},
		...
		...
	]

## Deleting a character ##

To delete a character you need its name AND its id:

	client.deleteCharacter(
		{id:"2",name:"John"},
		function (r){console.log(r);},
		function (error){
		console.error(error);
	});

The result:

	[
		{
			"result": "row deleted"
		}
	]