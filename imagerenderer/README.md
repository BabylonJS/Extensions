This project goal is to automatically generate pictures from 3D models using Babylon.js.

You can adjust rotation, number of pictures, size of the pictures from the code. This code has been tested on thousands of Babylon models. Depending on your browser, platform and GPU, we do recommend to run batch with few hundreds of models.  

# Prerequisites
Make sure you have npm and node installed. note that this tool do not need an internet connection to work and can be rendered full disconnected. If you want to benefit from latest version of Babylon, please replace the scripts from the ```public/babylonjs" folder. 

# Run locally

```
npm install
node index
```
Access http://localhost:8080/auto.html and the image will start being generated automatically.

# Babylon model directory & output path
All Babylon objects must be stored in the */public/parts* directoty. Imagines will automatically be rendered into the */public/uploads* directory. Make sure the uploads directory is created before running the engine.

![/docs/parts.png](Parts)

![/docs/uploads.png](Uploads)

# Settings
## Naming convention
By default the name of the outpout pictures is the name of the main .babylon file with _XXX where XXX is the picture number.

```js
var uploadFileName = this.filename.substring(0, this.filename.indexOf('.')) + "_" + this.itr + ".png";
```

## Adjusting number of pictures
You can adjust the number of generated pictures thru ```this.maxIterations = 36;```, in this case it will generate 36 pictures.

## Adjusting Alpha and Beta rotations
The camera used is an hemispheric camera and you can adjust both the alpha and the beta parameters to turn around the object. Change ```this.iterationsPerAlpha = 6;``` and ```this.iterationsPerBeta = 6;``` to adjust the number of increment you want.

## Adjusting picture size
This can be done by changing the setting 640 by the desized size in pixel from this line ```BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.engine, this.scene.activeCamera, 640, function(base64Image)```

## Adjusting lights
The engine uses 2 omnidirectional lights by default. Depending on your objects, you will for sure have to adjust the lights.

```js
const top = new BABYLON.HemisphericLight("Omni0", new BABYLON.Vector3(-0.1, -0.25, -1), scene);
top.intensity = 0.65;

const bottom = new BABYLON.HemisphericLight("Omni1", new BABYLON.Vector3(-0.1, -0.25, 1), scene);
bottom.intensity = 0.65;

this.lights = [
    top,
    bottom
];
```

## Adjusting camera position
By default the camera is position in a way it shoudl turn around the object. That said, like for the other settings you can adjust it as well. 
The positionning is done by capturing the max vector of all the meshes and positioning the radius of the camera far enough. Adjust this setting to get closer or wider from the object ```camera.radius = max * 8;```

# Known issue
- This tool is very simple and striaght forward. Some changes need to be done in the code to adjust image size or lights. 
- The image _0 is always empty.
- If a non supported file is loaded, the capture will fail and stop