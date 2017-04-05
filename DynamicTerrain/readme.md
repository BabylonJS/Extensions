# Dynamic Terrain
## What's the DynamicTerrain
The DynamicTerrain is an extension for [BabylonJS](http://babylonjs.com).  
This object provides a way to display a terrain dynamically morphed from a map of 3D data.  

![dynamicTerrain](http://jerome.bousquie.fr/BJS/test/dynamicTerrain.png)  
## Installation
Just download the javascript file (`dynamicTerrain.js` or, recommended, the minified version `dynamicTerrain.min.js`) from the BabylonJS [extension repository](https://github.com/BabylonJS/Extensions) folder `DynamicTerrain/dist` :   https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/dist    

Then in your code, declare this script in a html tag **after** the script tag declaring Babylon.js :
```html
<script src="babylon.js"></script>
<script src="dynamicTerrain.min.js"></script>
```
## How to use it ?
The dynamic terrain is a mesh that morphs on a logical data map.  
This map is a simple flat array of successive 3D coordinates (x, y, z) as floats.  
It can be as huge as you need, as long as you've enough memory. This won't be rendered anyway.  
The map must be passed to the dynamic terrain constructor as well as the number of subdivisions on the map width and height.  

```javascript
var mapCoords = [some_big_flat_array_of_coordinates];
var mapWidthPointNb = 2000;     // 2000 points in the map width
var mapHeightPointNb = 1000;    // 1000 points in the map height
var terrainSub = 100;           // the terrain wil be 100x100 vertices only
var mapParams = {
    mapData: mapCoords,
    mapSubX: mapWidthPointNb,
    mapSubZ: mapHeightPointNb,
    terrainSub: terrainSub
};

var terrain = new BABYLON.DynamicTerrain("terrain", mapParams, scene);
var terrainMesh = terrain.mesh;
terrainMesh.diffuseTexture = myNiceTexture;
```

The whole documentation is accessible here : https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/documentation/dynamicTerrainDocumentation.md   

Some documented examples are here :   
https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/documentation/dynamicTerrainExamples.md   