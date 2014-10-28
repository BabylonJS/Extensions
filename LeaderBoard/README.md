BABYLONJS Leaderboard extension
==============================

The Babylon.js Leaderboard extension is composed of a server side extension and a javascript client SDK, that allow you to create a full backend for your game.

**New** : You can now test the leaderboard online : [http://babylonjs.com/leaderboard/](http://babylonjs.com/leaderboard/)

## Summary: ##

1. [Readme.md](https://github.com/BabylonJS/Extensions/tree/master/LeaderBoard) : Presentation and Server installation
2. [CreateGame.md](CreateGame.md) : How to create a game within the Leaderboard client SDK
3. [ManagingEntities.md](ManagingEntities.md) : How to manage entities.
4. [ManagingImagesAndFiles.md](ManagingImagesAndFiles.md) : How to manage images and files.
5. [Authentification.md](Authentification.md) : How to authenticate your players with social networks, like Google, Facebook, Twitter and MicrosoftAccount.
6. [UsingLeaderboadInAGame.md](UsingLeaderboadInAGame.md) : LightSpeed sample game using the Leaderboard SDK.

## Presentation  ##
  
This extension is standalone and have no dependencies.  
It works within [Windows Azure Mobiles Services](http://azure.microsoft.com/en-us/services/mobile-services/ "Windows Azure Mobile Services").   

You will have access to APIs which can :   
1. Add **Games**  
2. Add **Characters**  
3. Add **Score**, **Achievements**, **Rewards**  
4. Connecting with social authentication like **Google**, **Facebook**, **Twiter** and **Microsoft**  
5. **Send emails** to all your players  
6. **Upload images** and blob files  
7. Add **custom fields**  
8. **Send notifications** to mobiles like **Windows Phone**, **IOS** or **Android**  

And more to come ...

![](http://www.dotmim.com/sitefiles/leaderboard/ligthspeed.jpg)


Setup
==========

First of all, you need an Azure account to be able to create an Azure Mobile Services backend.
You can get a [free trial](http://azure.microsoft.com/en-us/pricing/free-trial/) Azure account.

For more informations about Azure Mobile Services, just check the [documentation on Azure website](http://azure.microsoft.com/en-us/documentation/services/mobile-services/).    

Here are the differents steps to be able to install your full backend for your game:   

Get the Leaderboard sources
------------------------

First of all, you have to get the Leaderboard SDK.
Just download or clone the git repository locally.  

![](http://www.dotmim.com/sitefiles/leaderboard/githubleaderboard.png)

For Git users, you can get the sources within this Git command : 
 
    git clone https://github.com/BabylonJS/Extensions.git

Here is a screenshot of my directory after cloning the repository locally :
![](http://www.dotmim.com/sitefiles/leaderboard/extensions_repository_downloaded_root.jpg)

And inside the **/Leaderboard** directory, you will find these two directories:

![](http://www.dotmim.com/sitefiles/leaderboard/extensions_repository_downloaded.jpg)

The source code is divided into 2 directories:  
   
1. **/Client** : This directory is a website containing three things :    
    * The client sdk (babylonclient.js file)
    * A simple web page to test your backend 
    * A simple game working with an existing leaderboard backend (LightSpeed game)   
2. **/Zumo** : This directory contains all the files required to be able to create the Azure Mobiles Services backend.


## Creating the Azure Mobile Services backend ##


This is a pretty straightforward part of the setup.  
Just create an empty Mobiles Services backend in Azure : 

![Create an azure mobile services backend](http://www.dotmim.com/sitefiles/leaderboard/CreatingZumo1.JPG)

![Create an azure mobile services backend](http://www.dotmim.com/sitefiles/leaderboard/CreatingZumo2.JPG)

For this tutorial, my backend will be called **lightspeedbackend**.   

Once you have created the backend, just notice the keys:  
1. **The application key** : Required for all your customers, to be able to acces to your backend  
2. **The master key** : Required for you, as the administrator to be able to create games, characters, achievements etc ...

## Uploading your Leaderboard backend to Mobile Services ##

First of all, you need to activate the git source control in your mobile services project.

Here is the tutorial : [Mobile Services Git Integration](http://azure.microsoft.com/fr-fr/documentation/articles/mobile-services-store-scripts-source-control/)

Once your mobile services is configured for git, just remember you git url (in the configuration tab) : 

![](http://www.dotmim.com/sitefiles/leaderboard/zumoconfiggit.jpg)


In this tutorial, let's assume the url is something like :

    https://ligthspeedbackend.scm.azure-mobile.net/ligthspeedbackend.git

Then, you have to clone your Azure Mobile Services locally. 
To be able to use git locally, you must install git on your local machine : [http://git-scm.com/](http://git-scm.com/)
 
![](http://www.dotmim.com/sitefiles/leaderboard/git.jpg)

Once git installed, you have access to a command line tool, called **git bash** :

![](http://www.dotmim.com/sitefiles/leaderboard/gitbash.jpg)

We will clone the repository in a tmp folder (let's say **/c/tmp**) , like this :

	cd /c/tmp	
	git clone https://ligthspeedbackend.scm.azure-mobile.net/ligthspeedbackend.git


![](http://www.dotmim.com/sitefiles/leaderboard/gitclonelocally.jpg)

From now, we have two directories :  
1. The **First one** contains **Leaderboard sources** from Babylonjs extensions.  
2. The **Second one** contains **your git repository** from you Azure Mobile Services.

We will Copy/Paste the **/Zumo** directory files into the **C:/tmp/lightspeedbackend** directory :


![](http://www.dotmim.com/sitefiles/leaderboard/copypaste.jpg)

In a nutshell, we have just add some files to the Azure Mobile Services local repository.

Now we have to **add** then **commit** this files in our local repository, after moving to the **/tmp/lightspeedbackend** directory : 

	cd /c/tmp/ligthspeedbackend	
	git add --all
	git commit -m 'Commit backend'

You will have a lot of lines about some replacements of *< LF >* with *< CRLF >*, not a big deal.

Optionaly, just to check, we can make a **git status** command :

	git status

![](http://www.dotmim.com/sitefiles/leaderboard/gitstatusaftercommit.jpg)

We have one commit to push, so just push it to the **remote origin master branch** :

	git push origin master

You will have a lot of lines about what is pushed, here is a truncated version :
 
![](http://www.dotmim.com/sitefiles/leaderboard/gitpushtozumo.jpg)


## Check your Azure Mobile Services Installation ##

If everything is ok, you must have some APIs in your Azure Mobile Services, like this :

![](http://www.dotmim.com/sitefiles/leaderboard/zumoverif.jpg)

# Using the Leaderboard backend #

Now that your backend is ready, we can test it, and we can use it in our own games !

# Testing the SDK #

In the **/Client** directory, you will find a website to test your backend.

Open the website within any IDE (like SublimeText or Visual Studio) and open the **default.htm** page, then:

1. Fill the **Application url**
2. Fill the **Application key**
3. Choose the **setup** API
4. Choose the **createGame** method
5. Fill the **master key**
6. Fill, at least :
	1. The **game name**.
	2. Your **first character name**
	3. Your **email**
7. Apply with the **Script** button

Here is a screenshot of my version :

![](http://www.dotmim.com/sitefiles/leaderboard/wsdk1.jpg)

And the script generated :

![](http://www.dotmim.com/sitefiles/leaderboard/wsdk2.jpg)

Here is the script :

    var setup = new BABYLON.LeaderBoard.Setup("https://lightspeedbackend.azure-mobile.net/",
                "WnMUrftvAIDmVqezHWCiWUJFvvvtfG79", "DBnAvXPApyeHGryooSfiZrpcEgyVKa37");

	setup.createGame(
       { name: "LightSpeed" },
       { name: "Mimetis", email: "sebastien.pertus@gmail.com" },
       function (r) { console.log(r); },
       function (error) { console.error(error); }
	);

And here is the response from your newly created backend !

![](http://www.dotmim.com/sitefiles/leaderboard/wsdk3.jpg)

Here we go, you can now create characters, create achievements or rewards etc ...

In the next tutorials, we will go deeper in the APIS of this Leaderboard SDK !

Sebastien




