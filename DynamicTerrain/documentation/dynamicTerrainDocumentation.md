# Dynamic Terrain
## Installation
Let's just download the javascript file (`dynamicTerrain.js` or, recommended, the minified version `dynamicTerrain.min.js`) from the BabylonJS [extension repository](https://github.com/BabylonJS/Extensions) folder `DynamicTerrain/dist` :   https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/dist    

Then in our code, let's declare this script in a html tag **after** the script tag declaring Babylon.js :
```html
<script src="babylon.js"></script>
<script src="dynamicTerrain.min.js"></script>
```
## What is the dynamic terrain ?
The dynamic terrain is basically a standard BJS mesh, actually a ribbon.  
It's linked to a camera and moves with it along the World X and Z axes.  
It's passed a set of geographic data what are each simply 3D coordinates _(x, y, z)_ in the World. This set of data is called the map.  
According to the current camera position in the World, the dynamic terrain morphs to depict the map at this location.   

## Getting started

### The data map
The first thing we need to create a dynamic terrain is a data map.  
The data map is a simple flat array of successive 3D coordinates _(x, y, z)_ in the World.  
It's defined by the number of points on the map width, called`mapSubX` by the dynamic terrain, and the number of points on the map height, called `mapSubZ`.   

The dynamic terrain imposes some constraints to the map :  

* the distances between two successive points on the map width must be quite constant
* the distances between two successive points on the map height must be quite constant
* the points must be sorted in ascending order regarding to their coordinates, first on the width, then on the height.  

What does this mean ?  

If we call `P[i, j]` the point P at the row `j` on the map height and at the column `i` on the map width, this means that :  
- for any row `j` in the map, `P[0, j].x` is lower than `P[1, j].x`, what is lower than `P[2, j].x`, etc
- for any column `i` in the map, `P[i, 0].z` is lower than `P[i, 1].z`, what is lower than `P[i, 2].z`, etc
- the distance between each column is quite constant
- the distance between each row is quite constant, not necesseraly the same than the distance between each column.  

Example :  
Here, we populate a big `Float32Array` with successive 3D float coordinates.  
We use a _simplex_ function from a third party library to set each point altitude.  
This array is the data map. It's defined by 1000 points on its width and 800 points on its height.   
The distance between the points is constant on the width and is different from the constant distance between the points on the height.   
```javascript
    var mapSubX = 1000;             // map number of points on the width
    var mapSubZ = 800;              // map number of points on the height
    var seed = 0.3;                 // set the noise seed
    noise.seed(seed);               // generate the simplex noise, don't care about this
    var mapData = new Float32Array(mapSubX * mapSubZ * 3);  // x3 because 3 values per point : x, y, z
    for (var l = 0; l < mapSubZ; l++) {                 // loop on height points
        for (var w = 0; w < mapSubX; w++) {             // loop on width points
            var x = (w - mapSubX * 0.5) * 5.0;          // distance inter-points = 5 on the width
            var z = (l - mapSubZ * 0.5) * 2.0;          // distance inter-points = 2 on the width
            var y = noise.simplex2(x, z);               // altitude
                   
            mapData[3 * (l * mapSubX + w)] = x;
            mapData[3 * (l * mapSubX + w) + 1] = y;
            mapData[3 * (l * mapSubX + w) + 2] = z;           
        }
    }
```

PG example : http://www.babylonjs-playground.com/#FJNR5#1  
In this example, the data map is generated in a Float32Array. The very useful library [perlin.js](https://github.com/josephg/noisejs) is used to compute the altitude of each point with a _simplex2_ noise function.  
In order to better understand how this map is generated, we use it as a ribbon mesh geometry here. The ribbon is displayed in wireframe mode. In this example, the ribbon is thus a really big mesh (1000 x 800 = 800K vertices !). So you shouldn't try to render so big meshes in your scene if you want to keep a decent framerate. Moreover, remember that the logical map could also be bigger than 800K points.  

### The Dynamic Terrain
Once we've got the data map, we can create the dynamic terrain.  
```javascript
        var terrainSub = 100;               // 100 terrain subdivisions
        var params = {
            mapData: mapData,               // data map declaration : what data to use ?
            mapSubX: mapSubX,               // how are these data stored by rows and columns
            mapSubZ: mapSubZ,
            terrainSub: terrainSub          // how many terrain subdivisions wanted
        }
        var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```
PG example : http://www.babylonjs-playground.com/#FJNR5#3  
The dynamic terrain is the green mesh flying on the data map.  
We can notice that the green terrain is linked to the scene active camera on its center and moves with it when we zoom in or out.    
Actually, the terrain adjusts itself automatically to the exact next points of the map as the camera moves over it.   
More visible with wireframes : http://www.babylonjs-playground.com/#FJNR5#4  

## The Dynamic Terrain in detail
### LOD
### Initial LOD
LOD is an acronym for Level Of Detail.  
It's a feature allowing to reduce the rendering precision of some mesh when it's far away from the camera in order to lower the necessary computation : the less vertices, the less CPU/GPU needed.  

The dynamic terrain provides also a LOD feature but in a different way : the terrain number of vertices always keep constant but only the part of data map covered by the terrain changes.  
By default, one terrain quad fits one map quad.  
This factor can be modified with the property `.initialLOD` (equal to 1, by default).  

Examples :   
The default initial LOD is 1, so 1 terrain quad is 1 map quad : http://www.babylonjs-playground.com/#FJNR5#4   
The initial LOD is set to 10, so 1 terrain quad is now 10x10 map quads (10 on each axis) : http://www.babylonjs-playground.com/#FJNR5#6  
In consequence, the terrain mesh is far bigger, far less detailed regarding to the map data, but keeps the same amount of vertices (100 x 100).  
Setting an initial LOD to 10 is probably not a pertinent value, it's done only in the purpose of the explanation.  
In brief, the initial LOD value is the number of map quads on each axis, X and Z, per terrain quad.  

### Camera LOD  
Back to the terrain with the default initial LOD value.  
We can notice that when the camera is at some high altitude the green terrain seems far away, quite little in the screen area, as this is the common behavior : distant things appear tinier.  
http://www.babylonjs-playground.com/#FJNR5#7   

However we don't expect that, when getting in higher altitude, the ground would get tinier : it becomes less detailed to our eyes and we can see a larger area of the ground in the same time.  

The dynamic terrain provides a way to do this by increasing the LOD factor with the camera altitude (or any other behavior we may want like changing the LOD with the camera speed instead).  

We just have to overwrite the method `updateCameraLOD(camera)` and make it return an integer that will be added to the current LOD value.  
```javascript
    // Terrain camera LOD : custom function
    terrain.updateCameraLOD = function(terrainCamera) {
        // LOD value increases with camera altitude
        var camLOD = Math.abs((terrainCamera.globalPosition.y / 16.0)|0);
        return camLOD;
    };
```
Example : http://www.babylonjs-playground.com/#FJNR5#8    
In this example, the LOD value is incremented by 1 each time the altitude is +16 higher.  
If we get the camera higher by zooming out when looking at the ground, we can see that the terrain size increases since there are less details.  

This function is passed the object camera linked to the terrain and must return a positive integer or zero. By default, zero is return.  

This function is called on each terrain update.  
Nevertheless, we can set this value at any time with the property `.cameraLODCorrection`.  
Example : 
```javascript
terrain.cameraLODCorrection = 3;    // adds +3 to the initial LOD
```
In this example, the camera LOD correction value of 3, forces the global LOD factor to be 4 : 3 (camera) + 1 (initial value). This means each terrain quad is now 16 (4 x 4) map quads.  
In general, we don't need to set this value manually. It's better to update it automatically with the method `updateCameraLod(camera)`, so the property is rather read than set.  

This feature is useful only when the expected camera movements can get the terrain very distant, so too tiny, in the field of view.  
It's not really necessary to use it if the terrain keeps quite the same size in the fied of view.  
Example : a character walking on the terrain ground.  

### Global LOD
The global LOD factor is the current sum of the initial value and the current camera LOD correction value.  
As said before, it's the current factor of the number of map quad per axis in each terrain quad.  
It's accessible with the property `.LODValue`.   
```javascript
var lod = terrain.LODValue;
```
It's a positive integer (>= 1).  
Let's simply remember that the bigger the LOD value, the lower the terrain details.  


_the following to be detailed soon ..._
### Perimetric LOD
LOD in the distance around the terrain perimeter.  
```javascript
terrain.LODLimits = [4, 2, 1, 1];   
// increment the LOD factor under the 4-th, 
// then once again under the second, 
// then twice again under the first rows and columns
```

## Terrain update
### According to the camera movement
The terrain is updated each time the camera crosses a terrain quad either on the X axis, either on the Z axis.  
However, we can set a higher tolerance on each axis to update the camera only after more terrain quads crossed over.   
```javascript
terrain.subToleranceX = 2; // the terrain will be updated only after 2 quads crossed over by the camera on X
terrain.subToleranceZ = 6; // the terrain will be updated only after 6 quads crossed over by the camera on Z
```
The computation charge is constant each terrain update and depends only on the terrain vertex number.  
The tolerance can make the computation often less often.  This may be useful when the camera moves rarely or by little amount in the terrain area (a character walking on the ground, for instance).  

### User custom function
Let's enable it (disabled by default) at any time.  
```javascrit
terrain.useCustomVertexFunction = true;
```
This will be called on next terrain updates 
```javascript
    // passed parameters :
    // - the current vertex
    // - the i-th and j-th indexes (column, row)
    terrain.updateVertex = function(vertex, i, j) {
        fade = grad * BABYLON.Vector3.DistanceSquared(vertex.position, terrain.centerLocal) / maxD2;
        BABYLON.Color4.LerpToRef(vertex.color, skyColor, fade, vertex.color);

        if (vertex.position.y > 3.0) {
            vertex.color.b = vertex.position.y / 30.0;
            vertex.color.r = vertex.color.b;
        }
    };
```
The vertex properties are :
* position : Vector3, local position in the terrain mesh system
* worldPosition :  Vector3, global position in the World
* color : Vector4
* uvs : Vector2
* lodX : integer, the current LOD on X axis for this vertex
* lodZ : integer, the current LOD on Z axis for this vertex
* mapIndec : integer, the current index in the map array

### After or Before Terrain Update
```javascript
    var maxD2 = 0.0;
    terrain.beforeUpdate = function() {
        maxD2 = terrain.terrainHalfSizeX * terrain.terrainHalfSizeZ;
    };

    terrain.afterUpdate = function() {
        maxD2 = 0.0;
    };
```
### Force Update On Every Frame
Unless specific need, we shouldn't do this.  
```javascript
terrain.refreshEveryFrame = true; // false, by default
```

## Useful Functions
```javascript
if (terrain.contains(x, z)) {
    // do stuff
}

var y = terrain.getHeightFromMap(x, z); // returns y at (x, z) in the World


var normal = BABYLON.Vector.Zero();
y = terrain.getHeightFromMap(x, z, normal); // update also normal with the terrain normal at (x, z)
```

## Other Properties
