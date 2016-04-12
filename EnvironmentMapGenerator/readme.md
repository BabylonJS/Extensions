# Environment Map Generator

Using the [PBR](http://doc.babylonjs.com/extensions/Physically_Based_Rendering_Master) material, it is often an issue to get a good reflection/refraction texture.

As the advice is to rely on HDRCubeTexture with their seamless cube map generation, the loading time can quickly become an issue.

In order to help decreasing this processing time, the environment map generator has been added to the extensions.

## What is it ?

This tool preprocesses your hdr texture(s) and pack them in an efficient binary format that is fully compativle with Babylon.js.

## How to use ?

After cloning the babylon extension repository, open a command prompt in the Environment Map Generator folder.

First install the required dependencies:

```
npm install
```

Then run the tool with the following command:

```
gulp webserver
```

Once the window is open, simply drag and drop your .hdr files (lots of examples are available on [HDRLib](http://hdrlib.com)).

You now have to wait for a while (the bigger the size the longer the wait) and you preprocessed file will be downloaded.

In your BJS project simply use the HDRCubeTexture with no parameter (they are contained in the file)

```javascript
var hdrSeamLessTexture = new BABYLON.HDRCubeTexture("textures/country.babylon.hdr", scene);
```

The chosen size needs to be a power of two and the best balanced results have been seen with a size of 256.
