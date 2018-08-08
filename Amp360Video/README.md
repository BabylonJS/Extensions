# Introduction 
The [Azure media player](http://amp.azure.net/libs/amp/latest/docs/index.html) 360 Video is a plugin for AMP aka [Azure media player](http://amp.azure.net/libs/amp/latest/docs/index.html) using BabylonJS in order to facilitate the integration of 360 videos in your Web App.

The plugin supports natively VR headsets (Windows MR...).

[Online Demo of the plugin](http://www.babylonjs.com/Demos/Amp360Video/)

# How to Run Locally
Once the repository has been cloned, open the a command prompt in this folder.

Type the following commands:
```npm install```
```npm start```

You can now access your [local test](http://localhost:1337/)

# How it works
The plugin located in the ```amp-360video``` folder contains a [videojs](https://docs.videojs.com/tutorial-plugins.html) plugin compatible with AMP version 2.1.7.

The plugin depends on BabylonJS in order to enable 3D functionalities in AMP.

For more information about AMP, you can access their [documentation](http://amp.azure.net/libs/amp/latest/docs/index.html).

# How use in your web site
After deploying both the js and css from the ```amp-360video``` folder to your WebSite you can follow the following steps:

## External Resources
Include the following resources in you html:
```
<!-- Link to the last version of BabylonJS -->
<script src="https://preview.babylonjs.com/babylon.js"></script>
<!-- Link to pep.js to ensure pointer events work consistently in all browsers -->
<script src="https://code.jquery.com/pep/0.4.1/pep.js"></script>

<!-- Link to the AMP resources -->
<link href="//amp.azure.net/libs/amp/2.1.7/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
<script src="//amp.azure.net/libs/amp/2.1.7/azuremediaplayer.min.js"></script>
```

## Plugin Resources
You can either embed the plugin in your HTML or initialize it by code like specified in the [AMP documentation](http://amp.azure.net/libs/amp/latest/docs/index.html#plugins).

### Html Initialization
Add the **threeSixty plugin** to your video data-setup:
```
<video playsinline crossorigin="anonymous" class="azuremediaplayer amp-default-skin amp-big-play-centered" autoplay controls width="100%" height="100%" data-setup='{ "techOrder": ["azureHtml5JS", "html5"], "plugins": { "threeSixty": { } } }'>
    <source src="//willzhanmswest.streaming.mediaservices.windows.net/1f2dd2dd-ee99-40be-aae9-d0c2209982eb/DroneFlightOverLasVegasStripH3Pro7.ism/Manifest" type="application/vnd.ms-sstr+xml" />
    <p class="amp-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
    </p>
</video>
```

The only difference with your default AMP initialization is the presence of the 360 plugin:
```
"plugins": { "threeSixty": { } }'
```

One example can be found in the index.html file located in this folder.

### Code Initialization
The following code will initializes the plugin in your amp player:
```
var myPlayer = amp('videoPlayer', {
        "nativeControlsForTouch": false,
        autoplay: false,
        controls: true,
        width: "640",
        height: "480",
        poster: "",
        techOrder: ["azureHtml5JS", "html5"], 
        plugins: { 
            "threeSixty": {
                enableVR: true
            }
        }
    }, function() {
        console.log('Good to go!');
        // add an event listener
        this.addEventListener('ended', function() {
            console.log('Finished!');
        });
    });

myPlayer.src([{
    src: "//willzhanmswest.streaming.mediaservices.windows.net/1f2dd2dd-ee99-40be-aae9-d0c2209982eb/DroneFlightOverLasVegasStripH3Pro7.ism/Manifest",
    type: "application/vnd.ms-sstr+xml"
}]);
```

One example can be found in the indexCode.html file located in this folder.

## Enable/Disable the VR Button
By default the plugin is delivered with a VR mode avaible through a button shaped like a HMD.

In order to disable the button, you can specify in your options:

### By HTML configuration
In the data-setup plugin section:
```
"plugins": { "threeSixty": { "enableVR": false } }
```

### By code configuration
This works exactly the same as the previous point. In the options of your plugin:
```
plugins: { 
    "threeSixty": {
        enableVR: false
    }
}
```

## That is all
Your are good to go.