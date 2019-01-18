# Azure Media Player 360 Video Plugin

## Introduction 
The [Azure media player](http://amp.azure.net/libs/amp/latest/docs/index.html) 360 Video is a plugin for AMP (aka [Azure media player](http://amp.azure.net/libs/amp/latest/docs/index.html)) using Babylon.js in order to facilitate the integration of 360 videos in your Web App.

The plugin natively supports VR headsets (Windows Mixed Reality, etc.).

[Online Demo of the plugin](http://www.babylonjs.com/Demos/Amp360Video/)

## How to Run Locally
First, clone the Babylon.js extensions repository:
```
git clone https://github.com/BabylonJS/Extensions.git
```

Once the repository has been cloned, open a command prompt in the Amp360Video folder.

Then, type the following commands:
```
npm install
npm start
```

The hosting web page will automatically open (using webpack-dev-server).

## How it works
The 360 video is a [videojs](https://docs.videojs.com/tutorial-plugins.html) plugin compatible with AMP version 2.1.7.

The plugin depends on Babylon.js in order to enable 3D functionalities in AMP.

For more information about AMP, you can access their [documentation](http://amp.azure.net/libs/amp/latest/docs/index.html).

## How use in your web site
After deploying the bundled javascript file [`dist/amp-360video.js`](https://github.com/BabylonJS/Extensions/blob/master/Amp360Video/dist/amp-360video.js) from the dist directory to your WebSite you can follow the steps below.

> Note: if you were using the plugin before, you might have needed to reference Babylon.js in your site. We have now released a bundle ensuring the smallest delivery possible.

### External Resources
Include the following resources in you html:
```
<!-- Link to pep.js to ensure pointer events work consistently in all browsers -->
<script src="https://code.jquery.com/pep/0.4.1/pep.js"></script>

<!-- Link to the AMP resources -->
<link href="https://amp.azure.net/libs/amp/2.1.7/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
<script src="https://amp.azure.net/libs/amp/2.1.7/azuremediaplayer.min.js"></script>
```

### Plugin Setup
You can either embed the plugin in your HTML or initialize it by code like specified in the [AMP documentation](http://amp.azure.net/libs/amp/latest/docs/index.html#plugins).

#### Html Initialization
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

One example can be found in the index.html file located in the [repo](https://github.com/BabylonJS/Extensions/blob/master/Amp360Video/index.html).

#### Code Initialization
The following code will initialize the plugin in your amp player:
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

One example can be found in the indexCode.html file located in the [repo](https://github.com/BabylonJS/Extensions/blob/master/Amp360Video/indexCode.html).

### Enable/Disable the VR Button
By default, the plugin is delivered with a VR mode available through a button shaped like a head-mounted display.

In order to disable the button, you can specify in your options:

#### By HTML configuration
In the data-setup plugin section:
```
"plugins": { "threeSixty": { "enableVR": false } }
```

#### By code configuration
This works exactly the same as the previous point. In the options of your plugin:
```
plugins: { 
    "threeSixty": {
        enableVR: false
    }
}
```

### Update the camera FOV
By default the plugin is delivered with a camera of a 1.18 radians field of view.

In order to change it if needed, you can specify a different value in your options:

#### By HTML configuration
In the data-setup plugin section:
```
"plugins": { "threeSixty": { "fov": 1 } }
```

#### By code configuration
This works exactly the same as the previous point. In the options of your plugin:
```
plugins: { 
    "threeSixty": {
        fov: 1
    }
}
```

### Update the default camera orientation
In case the camera is not looking at what you expect when the video starts, you can use both options defaultCameraOrientationX and defaultCameraOrientationY to adapt the starting point of the camera to your use case. Those properties are angles respectively around the x and y axis defined in radians.

In order to change them, you can specify a different value in your options:

#### By HTML configuration
In the data-setup plugin section:
```
"plugins": { "threeSixty": { "defaultCameraOrientationX": 1 } }
```

#### By code configuration
This works exactly the same as the previous point. In the options of your plugin:
```
plugins: { 
    "threeSixty": {
        defaultCameraOrientationY: 1
    }
}
```

### Enable WebGL2
The default setup disables Webgl2 to enhance the compatibility with all platforms. Would you wish to enable it in your app for better performances, you can rely on the setup below:

#### By HTML configuration
In the data-setup plugin section:
```
"plugins": { "threeSixty": { "disableWebGL2Support": false } }
```

#### By code configuration
This works exactly the same as the previous point. In the options of your plugin:
```
plugins: { 
    "threeSixty": {
        disableWebGL2Support: false
    }
}
```
