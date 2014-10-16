# Managing images and files #

Within the Leaderboard SDK, you can upload images and files   
Two methods allows you to work with images:   

1. Thumbnails images < 500ko : Direct upload in the Images tables   
2. Images > 500ko or any file : Upload within an azure storage account
 

## Thumbnails images ##

It's very important to understand how and why you should use this feature.   
Uploading images directly in a database is not a good pratice, unless the images are thumbnail and reduced-size.

The advantage of this method is that you don't need an azure storage account for working with thumbnails.

As always to be able to use the SDK, just initialize the **client** API :

	var client= new BABYLON.LeaderBoard.Client(
		"https://lightspeedbackend.azure-mobile.net/",
		"WnMUrftvAIDmV******",
		1);

Once initialized, just call the **uploadImage** method :


	var imgFile=document.getElementById('sfile');
	if(imgFile.files!==null && imgFile.files.length>=0){
		client.uploadImage(imgFile.files[0],function (r){
			console.log(r);
		}
		,function (error){
			console.error(error);
		});
	}

The Result
	
	[
		{
			"code": 200,
			"result": "/api/image/1/get/Edith.jpg"
		}
	]

So the full URI should look like this : *https://lightspeedbackend.azure-mobile.net/api/image/1/get/Edith.jpg*

![](https://lightspeedbackend.azure-mobile.net/api/image/1/get/Edith.jpg)

IF you try to upload an image which size is over 500 ko, you will get an error like this:

![](http://www.dotmim.com/sitefiles/leaderboard/erroruploadimage.JPG)

## Images and Files within Azure blob storage ##

First of all, you should read the [readme.md](https://github.com/BabylonJS/Extensions/tree/master/LeaderBoard) file, where you will find all you need to initiate your blob account and configure it in the Leaderboard backend.

Then uploading a file is pretty straightforward. Just call the **UploadBlob** method :

	var blobFile=document.getElementById('sfile');
	if(blobFile.files!==null && blobFile.files.length>=0){
		client.uploadBlob(blobFile.files[0],function (r){
			console.log(r);
		}
		,function (error){
			console.error(error);
		});
	}


And here is the result :

	[
		"https://lightspeedbackendstorage.blob.core.windows.net/assets/Temoins.png"
	]

![](https://lightspeedbackendstorage.blob.core.windows.net/assets/Temoins.png)




