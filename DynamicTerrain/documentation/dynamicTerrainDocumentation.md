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
            var z = (l - mapSubZ * 0.5) * 2.0;          // distance inter-points = 2 on the height
            var y = noise.simplex2(x, z);               // altitude
                   
            mapData[3 * (l * mapSubX + w)] = x;
            mapData[3 * (l * mapSubX + w) + 1] = y;
            mapData[3 * (l * mapSubX + w) + 2] = z;           
        }
    }
```

PG example : https://www.babylonjs-playground.com/#FJNR5#162  
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
PG example : https://www.babylonjs-playground.com/#FJNR5#258    
The dynamic terrain is the green mesh flying on the data map.  
We can notice that the green terrain is linked to the scene active camera on its center and moves with it when we zoom in or out.    
Actually, the terrain adjusts itself automatically to the exact next points of the map as the camera moves over it.   
More visible with wireframes : https://www.babylonjs-playground.com/#FJNR5#164  
The terrain is defined by its number of subdivisions what is the same on both its axes X and Z.  
It's better to choose a multiple of 2 as the number of terrain subdivisions.  
Once created, this number never changes, neither the terrain number of vertices, but only its shape.  
This means the computation charge to update the terrain is always constant and depends only on this subdivision value.  

The terrain is a logical object providing several features. It embeds a BJS mesh accessible with the property `.mesh` :
```javascript
var terrainMesh : terrain.mesh;
terrain.Mesh.diffuseTexture = myTerrainTexture;
```

Although a data map must be passed at construction time, this map can be changed thereafter as well as the properties `.mapSubX` and `mapSubZ`.  
```javascript
terrain.mapData = map2;
terrain.mapSubX = mapSubX2;
terrain.mapSubZ = mapSubZ2;
```
This is useful if we have to download dynamically new chuncks of data as the camera moves in the World.  
Example : 
```javascript
// change the terrain map on the fly
if (camera.position.z > someLimit) {
    terrain.mapData = map2;
}
```
If the map data aren't updated or if a new data array isn't passed to the terrain when it reaches the map edges, then the terrain goes on moving as if the current map where repeated on the current axis.   
This means that from the terrain perspective and unless we give it a speficic behavior regarding the map bounds, the data map is infinitely repeated or tiled in every direction of the ground.  
In short, by default, the terrain sees the map as infinite.  

## The Dynamic Terrain in detail
### LOD
### Initial LOD
LOD is an acronym for Level Of Detail.  
It's a feature allowing to reduce the rendering precision of some mesh when it's far away from the camera in order to lower the necessary computation : the less vertices, the less CPU/GPU needed.  

The dynamic terrain provides also a LOD feature but in a different way : the terrain number of vertices always keeps constant but only the part of data map covered by the terrain changes.  
By default, one terrain quad fits one map quad.  
This factor can be modified with the property `.initialLOD` (equal to 1, by default) at any time.  

Examples :   
The default initial LOD is 1, so 1 terrain quad is 1 map quad : https://www.babylonjs-playground.com/#FJNR5#166   
The initial LOD is set to 10, so 1 terrain quad is now 10x10 map quads (10 on each axis) : http://www.babylonjs-playground.com/#FJNR5#165  
In consequence, the terrain mesh is far bigger, far less detailed regarding to the map data, but keeps the same amount of vertices (100 x 100).  
Setting an initial LOD to 10 is probably not a pertinent value, it's done only in the purpose of the explanation.  
In brief, the initial LOD value is the number of map quads on each axis, X and Z, per terrain quad.  

### Camera LOD  
Back to the terrain with the default initial LOD value.  
We can notice that when the camera is at some high altitude the green terrain seems far away, quite little in the screen area, as this is the common behavior : distant things appear tinier.  
https://www.babylonjs-playground.com/#FJNR5#167   

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
Example : https://www.babylonjs-playground.com/#FJNR5#168    
In this example, the LOD value is incremented by 1 each time the altitude is +16 higher.  
If we get the camera higher by zooming out when looking at the ground, we can see that the terrain size increases since there are less details.  

This function is passed the object camera linked to the terrain and must return a positive integer or zero. By default, zero is returned.  

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
It's readable with the property `.LODValue`.   
```javascript
var lod = terrain.LODValue;
```
It's a positive integer (>= 1).  
Let's simply remember that the bigger the LOD value, the lower the terrain details.  


### Perimetric LOD
The perimetric LOD is the LOD in the distance around the terrain perimeter.  
When our camera is close enough to the ground and looking at distant things in the landscape, we expect that these things don't require too many vertices to be rendered, because they are far from us and don't need to be as detailed as near objects.  

Let's get of the map rendering and let's create a smaller terrain of 20 subdivisions only : https://www.babylonjs-playground.com/#FJNR5#169   
The camera is located high in altitude in order to understand better how to set the perimetric LOD.  

The property to change the perimetric LOD is `.LODLimits`.  It's an array of integers (or an empty array, by default).  
Let's set a first limit to 4 :  
```javascript
terrain.LODLimits = [4]; 
```
https://www.babylonjs-playground.com/#FJNR5#170   

How is now the terrain after a forced update (note : the terrain automatically update with the camera movement on X or Z, so we force it here in case the camera won't move at all) ?  

We can notice that the center of the center has kept the original size of subdivisions, but all the quads located in the first 4 subdivisions from the terrain edges are now bigger.  
Actually their LOD factor is increased by 1 either on the X axis, either on the Z axis, either on both axes, depending on their location on the global terrain grid.  
When it's increased by 1 on both their axes (in the grid corners), their LOD value is 2. This means one of this terrain quad fits exactly 2 x 2 map quads, since the central terrain quads keep fitting each 1 map quad only.  

When we move the camera closer to the ground and orientate it to look at some distant hills, we can see that the distant quads are bigger, so depict a larger area of the map (so less detailed) than the close ones.  

Let's add now another limit : 
```javascript
terrain.LODLimits = [2, 4]; 
```
https://www.babylonjs-playground.com/#FJNR5#171  

Same principle but with an extra step : 
The quads in the first 4 subdivisions have all their LOD increased by 1.  
The quads in the first 2 subdivisions have their LOD increased again by 1 from their current value, so increased by 2 relatively to the central ones.  
We can set as many limits as we want : 
```javascript
terrain.LODLimits = [1, 2, 4]; 
```
https://www.babylonjs-playground.com/#FJNR5#172  

We can even repeat a limit as many times we want. In this case, the LOD is incremented as many times as this limit is repeated : 
```javascript
terrain.LODLimits = [1, 1, 1, 1, 2, 4]; 
```
https://www.babylonjs-playground.com/#FJNR5#174   

Notes : 

* We can change the value of the property `.LODLimits` at any time, it's taken in account on the next terrain update. So it's not a fixed value. We could imagine to have different LOD behavior depending on the camera position, speed or on the landscape itself.
* The array is always stored internally being sorted in the descending order (ex `[4, 2]`). So let's remember this when we have to read this property value.  
* Some of the terrain quads aren't squared, but rectangular. Actually each terrain vertex is given current `lodX` and `lodZ` values that we can read from a custom user function if needed (to be seen further).  

A simple way to remember how this works :  
```javascript
terrain.LODLimits = [4, 2, 1, 1];   
// increment the LOD factor under the 4-th, 
// then once again under the second, 
// then twice again under the first rows and columns
```
Example with a bigger terrain : let's rotate slowly the camera or let's zoom in/out to see the perimetric LOD in action  
https://www.babylonjs-playground.com/#FJNR5#175  

Of course, the perimetric LOD and the camera LOD correction can work together :  https://www.babylonjs-playground.com/#FJNR5#176  

#### Perimetric LOD restriction

By default, when defined, the perimetric LOD is applied to the four sides of the terrain.  
For some reasons, usually related to the camera position in the terrain, we can choose to apply it only on some sides.  
For this, we must use the following boolean properties (default `true`) : `.LODPositiveX`, `.LODNegativeX`, `.LODPositiveZ` and `.LODNegativeZ`.  
```javascript
terrain.LODPositiveX = false; // stops the perimetric LOD computation on the terrain right edge
terrain.LODNegativeX = false; // stops the perimetric LOD computation on the terrain left edge
```
Please read how to use them with the camera in the section "Camera position" below.     


### LOD Summary

* the initial LOD is the factor of the central terrain quad to apply to the map quad (default 1),
* the cameraLODcorrection is the quantity to add to this initial LOD to adjust to the camera position or distance (default 0),
* the LOD limits are the limits in the perimetric terrain subdivisions from where to increase the initial LOD (default `[]`), the camera LOD correction applies the same way on all the quads, so even on the already increased perimetric quads.  
* these three properties can be set at any time ! It's called _dynamic_ terrain, isn't it ?
* the global LOD value is the current LOD factor value of the central quads.  

## Camera position  

Actually we can set the camera at any wanted position. The terrain is hooked to the camera and will follow it as the camera moves.  
By default, the camera is linked to the terrain center what can be useful when the camera spins around, so the terrain keeps visible in any direction. This is also useful in the case where the camera gets some altitude and looks at the terrain below.  

However sometimes we could want  to hook the camera to a different location in the terrain :  
let's imagine that our camera will, for instance, move mainly along the Z World axis always looking straight ahead.  
In this case, the quads _behind_ the terrain center would be computed but never visible. Just a waste of CPU.  
So setting the camera near the terrain lower edge would allow to see all the computed quads and even then to expand the visible area far away.  
This is possible by using the property `.shiftFromCamera` that is a Vector2-like object, set by default to `{x:0, z:0}`.  
Note : it's not a real Vector2 because its member are `x` and `z` (not `y`).  
This can be set and changed at any time.  
The shift values are expressed relatively to the camera position in the Word space.  
```javascript
terrain.shiftFromCamera.z = 100.0;  // shifts the terrain +100 in front of the camera
terrain.shiftFromCamera.x = -5.0;   // shifts the terrain ++5 left to the camera
```
Example : https://www.babylonjs-playground.com/#FJNR5#254  
Here's the terrain is shifted for halfTerrainSizeZ in front of the camera position.  

If some perimetric LOD was defined, we probably don't want to see bigger quads in the first plan. We can then also restrict the computation the LOD only for terrain upper (positiveZ) edges only, not for the right and left sides, neither for the (lower) closest side from the camera.  
The boolean properties `.LODPositiveX`, `.LODNegativeX`, `.LODPositiveZ` and `.LODNegativeZ` will allow/prevent to compute the perimetric LOD on right/left and upper/lower edges.  
They can be set at any time (default `true`).  
```javascript
terrain.LODPositiveX = false; // stops the perimetric LOD computation on the terrain right edge
terrain.LODNegativeX = false; // stops the perimetric LOD computation on the terrain left edge
terrain.LODNegativeZ = false; // stops the perimetric LOD computation on the terrain upper edge
// now the perimetric is computed only for the upper edge, so only far away straight ahead
```
Example : the terrain is shifted in front of the camera and the perimetric is disabled on all the terrain sides except the upper one (positiveZ) https://www.babylonjs-playground.com/#FJNR5#255    

Why are they called positive- or negative-something ?   
The terrain moves in the World space only along the X and Z World axis.  
These LOD properties defines if the LOD must be applied from the terrain center perspective :all what's on the right or in front of the center in the World space is said "positive", all what's on the left or behind the terrain center in the World space is said "negative".  

## Terrain update
### According to the camera movement
The terrain is updated each time the camera crosses a terrain quad either on the X axis, either on the Z axis.  
However, we can set a higher tolerance on each axis to update the camera only after more terrain quads crossed over with the properties `.subToleranceX` and `.subToleranceZ`.   
```javascript
terrain.subToleranceX = 10; // the terrain will be updated only after 10 quads crossed over by the camera on X
terrain.subToleranceZ = 5;  // the terrain will be updated only after 5 quads crossed over by the camera on Z
```
https://www.babylonjs-playground.com/#FJNR5#177   
In this example, the terrain is updated each time the camera flies over 10 quads on the X axis or 5 quads on the Z axis.  
As a consequence, the terrain is moved by bunches of 10 or 5 quads each time it's updated.  

The computation charge is constant on each terrain update and depends only on the terrain vertex number.  
The tolerance can make the computation occur less often.  
This may be useful when the camera moves rarely or by little amount in the terrain area (a character walking on the ground, for instance) or simply if we need more CPU to do other things than updating the terrain.  

The default values of both these properties are 1 (minimal authorized value).   
They can be changed at any time according to our needs.   


### User custom function
The Dynamic Terrain provides the ability to update each of its vertex while the whole terrain update.  
Let's enable it (disabled by default). It can be enabled/disabled at any time.   
```javascrit
terrain.useCustomVertexFunction = true;
```
This will be called on next terrain updates, not necesseraly each frame.   
```javascript
    // passed parameters :
    // - the current vertex
    // - the i-th and j-th indexes (column, row)
    terrain.updateVertex = function(vertex, i, j) {
        // reset the vertex color in case it was formerly modified
        vertex.color.g = 1.0;
        vertex.color.r = 1.0;
        vertex.color.b = 1.0;
        // change it above a given altitude
        if (vertex.position.y > 2.0) {
            vertex.color.b = vertex.position.y / 30.0;
            vertex.color.r = vertex.color.b;
        }
    };
```
Let's slowly rotate the camera or zoom in/out : https://www.babylonjs-playground.com/#FJNR5#178   

The accessible vertex properties are : 

* position : Vector3, local position in the terrain mesh system (updatable)
* color : Vector4   (updatable), default (1.0, 1.0, 1.0, 1.0)
* uvs : Vector2     (updatable)
* worldPosition :  Vector3, global position in the World
* lodX : integer, the current LOD on X axis for this vertex
* lodZ : integer, the current LOD on Z axis for this vertex
* mapIndex : integer, the current index in the map array

Another colored example according to the position on the map : https://www.babylonjs-playground.com/#FJNR5#179   
Of course, it works also with alpha : https://www.babylonjs-playground.com/#FJNR5#181   

This feature is disabled by default because it may have an impact on the CPU.  
Indeed, when a terrain is 100x100 quads, it has 10K vertices and this custom function is then called 10K times.   
So let's remember to make it as fast as possible and to not allocate any object within it, else the garbage collector will have to work, consuming our precious FPS.  
Let's also remember that this custom user function is called only on terrain updates, not necesseraly each frame. There's a way to force the terrain update on every frame that we'll see further.  


### After or Before Terrain Update
The Dynamic Terrain is updated automatically according to the camera position and all the LOD or tolerance parameters we've set so far.  
Sometimes it's necessery to do something just before or just after the terrain update although we can't predict in the main logic when this update is triggered.  
Therefore, the Dynamic Terrain provides two functions that we can over-write and that are called just before and just after the terrain update : `beforeUpdate()` and `afterUpdate()`

```javascript
    // compute the squared maximum distance in the terrain
    var maxD2 = 0.0;
    terrain.beforeUpdate = function() {
        maxD2 = terrain.terrainHalfSizeX * terrain.terrainHalfSizeZ;
    };

    terrain.afterUpdate = function() {
        maxD2 = 0.0;
    };
```
This may be useful to compute some variable values once for all before they are used then by the user custom function `updateVertex()` instead of computing them inside it.  


### Force Update On Every Frame
Unless specific need, we shouldn't do this.  
```javascript
terrain.refreshEveryFrame = true; // false, by default
```
This can be changed at any time at will.  


## Useful Functions
If we need to know if a set of 2D map coordinates _(x, z)_ is currently inside the terrain, we can use the method `contains(x, z)` that returns a boolean. 
```javascript
if (terrain.contains(x, z)) {
    // do stuff
}
```

If we need to know what is the altitude on the map of any point located at the coordinatets _(x, z)_ in the World, even if this point is not one of the point defining the map (not one of the points in the map array), we can use the method `getHeightFromMap(x ,z)`.  
```javascript
var y = terrain.getHeightFromMap(x, z); // returns y at (x, z) in the World
```

This method can also return the value of the terrain normal vector at the coordinates _(x, z)_. This value is set to a Vector3 passed as a reference : `getHeightFromMap(x, z, ref)`.  
```javacript
var normal = BABYLON.Vector.Zero();
y = terrain.getHeightFromMap(x, z, normal); // update also normal with the terrain normal at (x, z)
```
Note : When the terrain is inverted, the returned height is negative.  

## Other Properties

```javascript
var mesh = terrain.mesh;                // the terrain underlying BJS mesh

terrain.isAlwaysVisible = true;         // default false : if the terrain is always visible in the camera field of view, this will speed up the terrain mesh selection process, so the global scene speed.  

var quadSizeX = terrain.averageSubSizeX; // terrain real quad X size
var quadSizeZ = terrain.averageSubSizeZ; // terrain real quad Z size

var terrainSizeX = terrain.terrainSizeX; // terrain current X size
var terrainSizeZ = terrain.terrainSizeZ; // terrain current X size

var terrainHalfSizeX = terrain.terrainHalfSizeX; // terrain current X half size
var terrainHalfSizeZ = terrain.terrainHalfSizeZ; // terrain current Z half size

var terrainCenter = terrain.centerLocal;        // Vector3 position of the terrain center in its local space
var terrainWorldCenter = terrain.centerWorld;   // Vector3 position of the terrain center in the World space

var mapPointsX = terrain.mapSubX;   // the passed map number of points on width at terrain construction time
var mapPointsZ = terrain.mapSubZ;   // the passed map number of points on height at terrain construction time

var camera = terrain.camera;        // the camera the terrain is linked to. By default, the scene active camera
```

## Advanced Terrain
### Inverted terrain
We can invert the terrain by setting the property `invertSide` to `true` at construction time.  
```javascript
    const terrainOptions = {
        terrainSub: terrainSub, 
        mapData: mapData, mapSubX: mapSubX, mapSubZ: mapSubZ, 
        mapColors: mapColors, 
        invertSide: true
    };
    const terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
```
The terrain is then build inverted upside down and can used as a ceiling for example.  

### Color map
A color map can be passed to the terrain at construction time.  
This color map is a flat array of successive floats between 0 and 1 of each map point _(r, g, b)_ values.  
This array must have the same size than the data array.   
Let's get back the very first example of the data array generation and let's populate a color array `mapColors`
```javascript
    var mapSubX = 1000;             // map number of points on the width
    var mapSubZ = 800;              // map number of points on the height
    var seed = 0.3;                 // set the noise seed
    noise.seed(seed);               // generate the simplex noise, don't care about this
    var mapData = new Float32Array(mapSubX * mapSubZ * 3);  // x3 because 3 values per point : x, y, z
    var mapColors = new Float32Array(mapSubX * mapSubZ * 3); // x3 because 3 values per point : r, g, b
    for (var l = 0; l < mapSubZ; l++) {                 // loop on height points
        for (var w = 0; w < mapSubX; w++) {             // loop on width points
            var x = (w - mapSubX * 0.5) * 5.0;          // distance inter-points = 5 on the width
            var z = (l - mapSubZ * 0.5) * 2.0;          // distance inter-points = 2 on the width
            var y = noise.simplex2(x, z);               // altitude
                   
            mapData[3 * (l * mapSubX + w)] = x;
            mapData[3 * (l * mapSubX + w) + 1] = y;
            mapData[3 * (l * mapSubX + w) + 2] = z;    

            // colors of the map
            mapColors[3 * (l * mapSubX + w)] = (0.5 + Math.random() * 0.2);     // red
            mapColors[3 * (l * mapSubX + w) + 1] = (0.5 + Math.random() * 0.4); // green
            mapColors[3 * (l * mapSubX + w) + 2] = (0.5);                       // blue
        }
    }
```
And let's pass this color array to the terrain at construction time with the optional parameter property `.mapColors` :
```javascript
var terrainSub = 100;               // 100 terrain subdivisions
var params = {
    mapData: mapData,               // data map declaration : what data to use ?
    mapSubX: mapSubX,               // how are these data stored by rows and columns
    mapSubZ: mapSubZ,
    mapColors: mapColors,           // the array of map colors
    terrainSub: terrainSub          // how many terrain subdivisions wanted
}
var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```
https://www.babylonjs-playground.com/#FJNR5#182
Obviously this still works with the user custom function called with `updateVertex()` : https://www.babylonjs-playground.com/#FJNR5#183  

### UV map
If we assign a material and a texture to the terrain mesh, it's by default set to the current terrain size and shifted according to the camera movements.  
https://www.babylonjs-playground.com/#FJNR5#184  
Before going further, let's note that the texturing works with both the color map and the user custom function : https://www.babylonjs-playground.com/#FJNR5#185  

Like for the colors, we could have a set of UVs relative to the map as a flat array of successive floats between 0 and 1 being the u and v values for each map point.  
This array must be sized _mapSubX x mapSubZ x 2_ (because two floats per map point : u and v) and must be passed to the terrain at construction time with the optional parameter property `.mapUVs`
```javascript
var terrainSub = 100;               // 100 terrain subdivisions
var params = {
    mapData: mapData,               // data map declaration : what data to use ?
    mapSubX: mapSubX,               // how are these data stored by rows and columns
    mapSubZ: mapSubZ,
    mapUVs: mapUVs,                 // the array of map UVs
    terrainSub: terrainSub          // how many terrain subdivisions wanted
}
var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```
Example :  
Here we populate a data map with no altitude (y = 0) and, in the same time, a UV map as a flat array by simply setting the u and v values in the 2D texture relatively to the _(x, z)_ coordinates of each map point.  
```javascript
    var mapData = new Float32Array(mapSubX * mapSubZ * 3); // x3 float values per point : x, y and z
    var mapUVs = new Float32Array(mapSubX * mapSubZ * 2); // x2 because 2 values per point : u, v
    for (var l = 0; l < mapSubZ; l++) {
        for (var w = 0; w < mapSubX; w++) {
            var x = (w - mapSubX * 0.5) * 2.0;
            var z = (l - mapSubZ * 0.5) * 2.0;
                   
            mapData[3 *(l * mapSubX + w)] = x;
            mapData[3 * (l * mapSubX + w) + 1] = 0.0;
            mapData[3 * (l * mapSubX + w) + 2] = z;

            mapUVs[2 * (l * mapSubX + w)] = w / mapSubX;        // u
            mapUVs[2 * (l * mapSubX + w) + 1] = l / mapSubZ;    // v

        }
    }
```
Then we pass the populated array `mapUVs` to the Dynamic Terrain constructor with the optional parameter property `mapUVs` : 
```javascript
        var params = {
            mapData: mapData,               // data map declaration : what data to use ?
            mapSubX: mapSubX,               // how are these data stored by rows and columns
            mapSubZ: mapSubZ,
            mapUVs: mapUVs,                 // array of the map UVs
            terrainSub: terrainSub          // how many terrain subdivisions wanted
        }
        var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```
https://www.babylonjs-playground.com/#FJNR5#186   
A FreeCamera was set instead of an ArcRotate one to move easily on the map. The map texture is also changed to the file _earth.jpg_.  
As we can notice now, the texture is no longer bound to the terrain itself but to the map : the image is stretched in this example along the whole map.  

In this former example, we stretched the image along the whole map.  
For this very specific need, we can also the method `.createUVMap()` that does the same (computation and assignement to the terrain) in a single call.   
```javascript
        var params = {
            mapData: mapData,               // data map declaration : what data to use ?
            mapSubX: mapSubX,               // how are these data stored by rows and columns
            mapSubZ: mapSubZ,
            terrainSub: terrainSub          // how many terrain subdivisions wanted
            // no more for mapUVs, it will be done by createUVMap()
        }
        var terrain = new BABYLON.DynamicTerrain("t", params, scene);
        terrain.createUVMap();  
        // computes and sets an UV map stretching the texture on the whole image
```
Example with no more manual UV computation : https://www.babylonjs-playground.com/#FJNR5#187  

### Normal map
By default, when we assign a data map to the terrain at construction time, it pre-computes all the normals of the map once.  
Computing all the map normals is a heavy process, but it's done only once.  
This permits to skip the terrain mesh normal recomputation each time this one is morphed, it is to say on each update. Thus, the terrain normal recomputation is disabled by default.   
This computation charge would be directly related to the terrain number of vertices (10K for a 100x100 terrain).  
```javascript 
var terrainSub = 100;               // 100 terrain subdivisions
var params = {
    mapData: mapData,               // data map declaration : what data to use ?
    mapSubX: mapSubX,               // how are these data stored by rows and columns
    mapSubZ: mapSubZ,
    terrainSub: terrainSub          // how many terrain subdivisions wanted
    // nothing more to do : the map normals are computed at creation time !
}
var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```
If for some reason (example : dynamic morphing if the terrain, this will be explained in the part "Without data map"), we need to force the normal computation each update :  
```javascript
terrain.computeNormals = true;   // default false, to skip the normal computation
```
As the normals of map are pre-computed automatically for us, we don't need to care about them.  
These normals are stored internally in a flat array of floats, just like the map coordinates.  

There is still a way to use a custom normal array if needed.   
This flat array of successive floats as normal vector coordinates _(x, y, z)_ for each map point can then be passed to the terrain. It simply must be exactly the same size than the map data array.  
This array is passed with the optional parameter property `.mapNormals`.  
```javascript
var normalArray = [n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, ...];
var terrainSub = 100;               // 100 terrain subdivisions
var params = {
    mapData: mapData,               // data map declaration : what data to use ?
    mapSubX: mapSubX,               // how are these data stored by rows and columns
    mapSubZ: mapSubZ,
    mapNormals: normalArray,        // the array of map normals
    terrainSub: terrainSub          // how many terrain subdivisions wanted
}
var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```

Example :  
This terrain is 300x300 so 90K vertices what is really a huge mesh to compute every update.  
With a normal map, so with automatic pre-computed normals : https://www.babylonjs-playground.com/#FJNR5#188   
Without (`computeNormals = true`), so normal computation each update : https://www.babylonjs-playground.com/#FJNR5#189    
Let's simply check the FPS difference when rotating the camera to feel the gain.  

If we have several data sets that we intend to use as data maps, we can precompute all these data set normals with the static method `ComputeNormalsFromMapToRef(map, subX, subY, array)`.  
```javascript
var map1 = someFloat32Array;
var map2 = someOtherFloat32Array;
var map3 = someOtherFloat32Array;
var normal1 = new Float32Array(map1.length);
var normal2 = new Float32Array(map2.length);
var normal3 = new Float32Array(map3.length);
// let's precompute the normals of all the maps
BABYLON.DynamicTerrain.ComputeNormalsFromMapToRef(map1, subX1, subY1, normal1);
BABYLON.DynamicTerrain.ComputeNormalsFromMapToRef(map2, subX2, subY2, normal2);
BABYLON.DynamicTerrain.ComputeNormalsFromMapToRef(map3, subX3, subY3, normal3);
```

### Map creation from a height map  
A height map is an image file, usually with grey colors only (from black to white), where each pixel color holds the point altitude : the brighter, the higher.  
Example file : http://www.babylonjs.com/assets/heightMap.png  

Like the BJS `MeshBuilder` class provides a method to create a mesh from a height map, the Dynamic Terrain provides a static method to generate a data map from a height map.  

Here's the way to use it :  
```javascript
// Declare a callback function that will be executed once the heightmap file is downloaded
// This function is passed the generated data and the number of points on the map height and width
var terrain;
var createTerrain = function(mapData, mapSubX, mapSubZ) {
    var options = {
        terrainSub: 100,  // 100 x 100 quads
        mapData: mapData, // the generated data received
        mapSubX: mapSubX, mapSubZ: mapSubZ // the map number of points per dimension
    };
    terrain = new BABYLON.DynamicTerrain("dt", options, scene);
    terrain.createUVMap();      // compute also the UVs
    terrain.mesh.material = someMaterial; 
    // etc about the terrain ...
    // terrain.updateCameraLOD = function(camera) { ... }
};

// Create the map from the height map and call the callback function when done
var hmURL = "http://www.babylonjs.com/assets/heightMap.png";  // heightmap file URL
var hmOptions = {
        width: 5000, height: 4000,          // map size in the World 
        subX: 1000, subZ: 800,              // number of points on map width and height
        onReady: createTerrain              // callback function declaration
};
var mapData = new Float32Array(1000 * 800 * 3); // the array that will store the generated data
BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(hmURL, hmOptions, mapData, scene);
```

* `hmURL` is a string, it's the URL or the DataURL string of the height map image,
* `width` and `height` are optional floats (default 300), the dimensions the map in the World,  
* `subX` and `subZ` are optional integers (default 100), the number of points on each map dimension,
* `minHeight` and `maxHeight` are the optional minimal and maximal heights (floats, default 0 and 10),  
* `offsetX` and `offsetZ` are optional floats (default 0) to shift the map, that is centered around the World origin by default, along the X or Z World axes,  
* `onReady` is an optional callback function to be called when the data are generated. It's passed the data array and the number of points per map dimension,  
* `mapData` is a float array, sized subX x subZ x 3,  
* `scene` is the scene that will store the downloaded image in its internal database.  

Let's note that, if we need to create the terrain in the callback function, it's not needed to use this kind of function to precompute in advance some data set from different images for further use :  
```javascript
var url1 = someURL;
var url2 = someOtherURL;
var url3 = someOtherURL;
// all my maps will have the same subdivisions and dimensions
// no callback function here
var options = {width: 5000, height: 4000, subX: 1000, subZ: 800};
var set1 = new Float32Array(subX * subZ * 3);
var set2 = new Float32Array(subX * subZ * 3);
var set3 = new Float32Array(subX * subZ * 3);
BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(url1, options, set1, scene);
BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(url2, options, set2, scene);
BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(url3, options, set3, scene);
``` 
Example : https://www.babylonjs-playground.com/#FJNR5#190    
In this example we use both the world image to texture the whole map with `createUVMap()` and the world height map to define the altitudes.  


### Map change on the fly
The terrain can be assigned another map at any time.  
Example : 
```javascript
// change the terrain map on the fly
if (camera.position.z > someLimit) {
    terrain.mapData = map2;
}
```
This can be useful if new data are dynamically downloaded as the camera moves in the World.  
Not only the map data can be changed, but also the color, uv or normal data.  
```javascript
// change the terrain map on the fly
if (camera.position.z > someLimit) {
    terrain.mapData = map2;
    terrain.mapColors = colors2;
    terrain.mapUVs = uvs2;
    terrain.mapNormals = normals2;
}
```
Let's note that when we assign a new data map to a terrain, the normal map of this map is not automatically recomputed.  
Thus we have two options :  
* either we request for this automatic normal recomputation that can take some time with the property `terrain.precomputeNormalsFromMap = true`. In this case, every new data map assignement to the terrain will trigger the map normal computation on the fly, 
```javascript
terrain.precomputeNormalsFromMap = true;  // default = false
terrain.mapData = map2;                   // the normal map is automatically computed on the hood
```
* either, as explained in the former section, we precompute by ourselves the new data map normals before and we assign to the terrain both the data map and the normal map at once.  
```javascript
var map2 = someOtherFloat32Array;
var normal2 = new Float32Array(map2.length);
BABYLON.DynamicTerrain.ComputeNormalsFromMapToRef(map2, subX2, subY2, normal2);

// then, later in the code ...
terrain.mapData = map2;
terrain.mapNormals = normals2;
```

### Without Data Map  
The Dynamic Terrain is a right tool to render a part of a map of 3D data.  
We usually don't need to modify the map data because they are just what we want to render on the screen.  
However the Dynamic Terrain is ... _dynamic_.  
This means that it can be used for other purposes than just render a 3D map.  
For instance, it can be generated without any data map :
```javascript
    var terrainSub = 140;        // terrain subdivisions
    var terrainOptions = { terrainSub: terrainSub };
    var terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
```
Actually, we could even not pass the `terrainSub` and the terrain would still be generated with a size of 60x60.  

A Dynamic Terrain generated without any data map looks like a simple planar ribbon initially : https://www.babylonjs-playground.com/#FJNR5#191   

Of course we can always add to it some LOD behavior (perimetric or camera LOD) like to any standard terrain created with a data map.  
But it may be interesting to use in this case the user custom function and to modify the terrain vertex positions, something we wouldn't probably want to do with a data map generated terrain.  

```javascript
    terrain.useCustomVertexFunction = true;

    terrain.updateVertex = function(vertex, i, j) {
        vertex.position.y = 2.0 * Math.sin(i / 5.0)  *  Math.cos(j / 5.0);
    };     
```

https://www.babylonjs-playground.com/#FJNR5#192   

Let's remember that, when enabled, the method `updateVertex` is called only on each terrain update (so when the camera moves), not necesseraly every frame.  

If we need to give the terrain an extra animation, we can set its property `.refreshEveryFrame` to true and add, for instance, a movement depending on the time :
```javascript
    var t = 0.0;
    terrain.useCustomVertexFunction = true;
    terrain.refreshEveryFrame = true;
    terrain.computeNormals = true;

    // user custom function : now the altitude depends on t too.
    terrain.updateVertex = function(vertex, i, j) {
        vertex.position.y = 2.0 * Math.sin((vertex.position.x + t) / 5.0)  *  Math.cos((vertex.position.z + t) / 5.0);
    };
    // scene animation
    scene.registerBeforeRender(function() {
        t += 0.01;
    });
```

https://www.babylonjs-playground.com/#FJNR5#193    

The CPU load required by the method `updateVertex()` is depending of course on what it does, but also on the terrain number of vertices.  
Let's note that, as we computationally change each terrain vertex altitude, the normal computation must be forced (`terrain.computeNormals = true`) to get a right light reflection with plain triangles: https://www.babylonjs-playground.com/#FJNR5#194   

**Important note :**   
We used here the parameters `i`, `j` and the vertex `position` property.  

* `i` is the vertex index on the terrain X axis, it's an integer valued between 0 and `terrainSub`, both included.
* `j` is the vertex index on the terrain Z axis, it's an integer valued between 0 and `terrainSub`, both included.
* the vertex coordinates `x` and `z` are always positive, this means the terrain is NOT centered in its local space but starts from the system origin at i = 0 and j = 0 : the first terrain vertex is at (0, 0) in the plane (xOz), the other vertices have then positive x and z coordinate values only.  

## More Advanced Terrain
Having a map depicting the relief is sometimes not enough.  
We may want to render repetitive objects referenced in the map into the landscape like buildings, trees, etc.  
The Dynamic Terrain can manage these objects when used with a dedicated Solid Particle System (SPS) or with an instance manager.  
The objects are defined in a specific map, besides the ground map, called the Solid Particle Map (or SPMap) or the Instance Map depending on the  chosen way.  

### The Object Recycler
How does it work ?  
As we know now, the terrain renders only the current visible part of the map what can be much bigger and what can have millions coordinates.  
The dedicated SPS works the same way : it renders the only visible objects from the SPMap in the current terrain by recycling automatically a set pool of solid particles.  

Both the SPMap and the SPS are then passed to the terrain constructor as parameters.  

The Instance manager works exactly the same. The lone difference is that instances are used instead of solid particles.  
In this case, the Instance Map and the source meshes of the instances are to be passed to the terrain constructor as parameters.  

We can choose to use the SPS or the instance manager, or both together.  

Let's start with the SPS and the SPMap.  

### The SPMap

The SPMap is simply an array of arrays.  
Each object type in the map (example: house, tree) is given an array.  
```javascript
var SPMap = [];
SPMap[0] = [dataHouse1, dataHouse2, ..., dataHouseN];
SPMap[1] = [dataTree1, dataTree2, ..., dataTreeN];
...
SPMap[t] = [dataObject1, dataObject2, ..., dataObjectN];
```
There can be as many object types as we need, but it's required there is at least one `SPMap[0]`.  
There can be as many objects in each type array as we need too and their number can be different from a type to another. When a type is declared, then there must be at least one object in this type.  
So when passing a SPMap, there's at least one type and one object in this type.  

The data defining each object is a set of nine successive floats : the object position (x, y, z), the object rotation (x, y, z) and the object scaling (x, y, z).  
This means that the type array contains simply a long series of successive floats :  
```javascript
SPMap[0] = [
    house1Posx, house1Posy, house1Posz, house1Rotx, house1Roty, house1Rotz, house1Sclx, house1Scly, house1Sclz,
    house2Posx, house2Posy, house2Posz, house2Rotx, house2Roty, house2Rotz, house2Sclx, house2Scly, house2Sclz,
    ...
]
```
Then the same thing for every other object type.  
So at least a SPMap is an array containing an array of 9 floats.  

The single rule to fullfill is to set every object within the map range (this implies that a data map is required for the SPMap to work).  
Assuming that _(Xmin, Zmin)_ and _(Xmax, Zmax)_ are respectively the minimum and maximum x and z coordinates of the map, then every object must be set at its (x, z) coordinates this way :  
                      `Xmin <= x <= Xmax and Zmin <= z <= Zmax`   

Note : the object coordinates can be different from the map vertex coordinates : the objects don't need to be on map vertex locations. They even don't need to be on the ground, they can be in the air (clouds) or inside or through the ground surface (tunnels).  

### The SPS

The SPS passed to the Dynamic Terrain will animate and recycle its solid particles on the terrain according to the SPMap data.  
The SPS doesn't need to hold as many particles as the object number in the map. There can be dozens thousands objects in the SPMap and only hundreds or few thousands particles in the SPS because it re-uses the invisible objects in order to render only the visible ones.  
The needed particle number then only depends on the object number in the SPMap and on their density on the terrain.  
If the SPS has not enough particles to render some objects, it won't crash, but won't just render them (note : objects are rendered from the minimum to the maximum _x,z_ coordinates, or from the western South to the eastern North, not from the distance to the camera for performance reasons).  

When building the SPS, each particle type (_shapeId_) will match an object type.  
Let's imagine that we want to depict houses from the map by boxes and trees by cones.  
We could obviously choose any 3D (or 2D) shape to assign to every object type from the map. This a voluntary loose coupling design : the map knows only about object locations in the landscape and nothing about how they will be rendered in the terrain, the SPS knows only about the way to render particles and nothing about how many objects and where they are in the map until the terrain tells it.  
So from the same map, we can easily provide different ways to render the objects and we can adjust to the logic needs or the performance constraints.  

Back to our boxes and cones :  

```javascript
var modelBox = BABYLON.MeshBuilder.CreateBox("mb", {}, scene);
var modelCone = BABYLON.MeshBuilder.CreateCylinder("mc", {diameterTop: 0}, scene);
var sps = new BABYLON.SolidParticleSystem("sps", scene);

// The declaration order matters from here
// first shape = first object type
// second shape = second object type, etc
sps.addShape(modelBox, 200);    // 200 houses maximum visible in the terrain
sps.addShape(modelCone, 300);   // 300 trees maximum visible in the terrain
sps.buildMesh();
modelBox.dispose();
modelCone.dispose();
```
And that's all.  

If we created more object types than the particle types, they will simply be ignored.  
If we create less particle types than the declared object types in the map, they will also be ignored.  

### The Dynamic Terrain with the SPMap
Now we have built a SPS and a SPMap, we can just pass them to the DynamicTerrain constructor besides the usual data map.  
We use the parameter `SPmapData` and `sps` :
```javascript
        var terrainSub = 100;               // 100 terrain subdivisions
        var params = {
            mapData: mapData,               // data map declaration : what data to use ?
            mapSubX: mapSubX,               // how are these data stored by rows and columns
            mapSubZ: mapSubZ,
            terrainSub: terrainSub,         // how many terrain subdivisions wanted
            SPmapData: SPMap,               // the object data in the map
            sps: sps                        // the SPS used to render the objects
        }
        var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```

Now, each time that the terrain is updated and that it covers a part of map containing objects, the SPS is updated and the objects are rendered by solid particles.  
***Important note :*** 
The SPMap feature seems to not work correctly with the LOD in some cases.   

Example : 3000 particles only SPS used to render dozens thousands objects from the map. A free camera is used.   
https://www.babylonjs-playground.com/#FJNR5#264  


### Object Colors and Textures

So far, we've declared object settings (positions, rotations, scalings) in the map.  
We can also pass the terrain two other optional maps about objects : the object colors and the object UVs.  

Exactly the same way we used for the SPMap, the object colors and UVs are stored in arrays of arrays : one array per object type.  
Each array for a given type then holds series of successive floats related to the colors (r, g, b, a) of each object of this type, or series of successive floats related to the UVs (x, y, z, w) of each object this type.  
The UVs are simply the bottom left and up right coordinates of the quad to be cropped within the texture as it's used in the SPS for the per particle texture feature.   

The UVs will then be applied to the **SPS material**, not to the terrain one.  

```javascript
// Object Colors
var SPColors = [];
SPColors[0] = [colorHouse1, colorHouse2, ..., colorHouseN];
SPColors[1] = [colorTree1, colorTree2, ..., colorTreeN];
...
SPColors[t] = [colorObject1, colorObject2, ..., colorObjectN];

// Object UVs
var SPUVs = [];
SPUVs[0] = [UVHouse1, UVHouse2, ..., UVHouseN];
SPUVs[1] = [UVTree1, UVTree2, ..., UVTreeN];
...
SPUVs[t] = [UVObject1, UVObject2, ..., UVObjectN];
```
The data defining each object color or UV is a set of four successive floats : the object color (r, g, b, a) or the object UVs (x, y, z, w).   
This means that the type array contains simply a long series of successive floats :  
```javascript
// Color example, first object type
SPColor[0] = [
    house1Col_r, house1Col_g, house1Col_b, house1Col_a,
    house2Col_r, house2Col_g, house2Col_b, house2Col_a,
    ...
]
// UV example, first object type
SPUV[0] = [
    house1UV_x, house1UV_y, house1UV_z, house1UV_w,
    house2UV_x, house2UV_y, house2UV_z, house2UV_w,
    ...
]
```
We then pass the object colors and UVs to the DynamicTerrain constructor besides the object map and the sps.  
We use the parameter `SPcolorData` and `SPuvData`.  

```javascript
    var terrainSub = 100;        // terrain subdivisions
    var terrainOptions = {
        terrainSub: terrainSub, 
        mapData: mapData, mapSubX: mapSubX, mapSubZ: mapSubZ, 
        mapColors: mapColors, 
        SPmapData: SPmapData,         // object map
        sps: sps,                     // SPS to render the objects on the terrain
        SPcolorData: SPcolorData,     // object colors
        SPuvData: SPuvData            // object UVs to apply to the SPS material
    };
    var terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
    terrain.mesh.material = terrainMaterial;    // terrain material
    
    sps.mesh.material = objectMaterial;         // object material !

```
PG Color example : https://www.babylonjs-playground.com/#FJNR5#267  
The objects get more green or more red according to the map areas (north, south, east, west) and more blue when in altitude.  

PG UV example : https://www.babylonjs-playground.com/#FJNR5#268  
Each object is given a part of the image file.  


**Note :**
The object map (SPMap) requires a terrain data map to work.  
The object color map or the object UV map both require an object map (SPMap) to work.  
Both are optional.  
Each one (color or UV) can work independently from the other.  

### The Instance Map
Now, let's understand how it works with Instances.  

Actually it's exactly the same principle than the one with the solid particles : we create an array of arrays, one by object type, to depict all the objects positions, rotations and scalings.  

Each object type in the map (example: house, tree) is given an array.  
```javascript
var instanceMapData = [];
instanceMapData[0] = [dataHouse1, dataHouse2, ..., dataHouseN];
instanceMapData[1] = [dataTree1, dataTree2, ..., dataTreeN];
...
instanceMapData[t] = [dataObject1, dataObject2, ..., dataObjectN];
```
There can be as many object types as we need, but it's required there is at least one `instanceMapData[0]`.  
There can be as many objects in each type array as we need too and their number can be different from a type to another. When a type is declared, then there must be at least one object in this type.  
So when passing a Instance Map, there's at least one type and one object in this type.  

The data defining each object is a set of nine successive floats : the object position (x, y, z), the object rotation (x, y, z) and the object scaling (x, y, z).  
This means that the type array contains simply a long series of successive floats :  
```javascript
instanceMapData[0] = [
    house1Posx, house1Posy, house1Posz, house1Rotx, house1Roty, house1Rotz, house1Sclx, house1Scly, house1Sclz,
    house2Posx, house2Posy, house2Posz, house2Rotx, house2Roty, house2Rotz, house2Sclx, house2Scly, house2Sclz,
    ...
]
```
Then the same thing for every other object type.  
So at least a Instance Map is an array containing an array of 9 floats.  

The single rule to fullfill is to set every object within the map range (this implies that a data map is required for the SPMap to work).  
Assuming that _(Xmin, Zmin)_ and _(Xmax, Zmax)_ are respectively the minimum and maximum x and z coordinates of the map, then every object must be set at its (x, z) coordinates this way :  
                      `Xmin <= x <= Xmax and Zmin <= z <= Zmax`   

Note : the object coordinates can be different from the map vertex coordinates : the objects don't need to be on map vertex locations. They even don't need to be on the ground, they can be in the air (clouds) or inside or through the ground surface (tunnels).  

### The Instances
We need to create as many different meshes as object types.  
We also create a pool of instances for each mesh.
We then store these meshes in an array that we call `sourceMeshes`.  
The order of the meshes in this array is the same than the object type order in the Instance Map.  
It is required that the number of meshes and the number of types in the map are equal.  
```javascript
// assuming mesh1, mesh2 and mesh3 are created
// create the wanted pools of instances of each one, say 1000 per type here
for (var i = 0; i < 1000; i++) {
    mesh1.createInstance("mesh1" + i);
    mesh2.createInstance("mesh2" + i);
    mesh3.createInstance("mesh3" + i);
}
var sourceMeshes = [mesh1, mesh2, mesh3]; 
// mesh1 will be the object type 0, mesh2 the object type1 and mesh3 the object type2
// don't dispose them !
```

### The Dynamic Terrain with the Instance Map
Now we have built the instances and an Instance Map, we can just pass them to the DynamicTerrain constructor besides the usual data map.  
We use the parameter `instanceMapData` and `sourceMeshes` :
```javascript
        var terrainSub = 100;        // terrain subdivisions
        var terrainOptions = {
            terrainSub: terrainSub, 
            mapData: mapData, mapSubX: mapSubX, mapSubZ: mapSubZ, 
            instanceMapData: instanceMapData,
            sourceMeshes: sourceMeshes
        };
        var terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
```
Now the terrain will recycle the instances from each pool and use them to render the objects from the map.
Example : 3000 instances from 3 different types used to render dozens thousands objects from the map. A free camera is used.  
https://www.babylonjs-playground.com/#FJNR5#364  

### Instance Colors
Like with solid particles, we may want to set a different color per object.  
Exactly the same way we used for the Instance Map, the object colors are stored in an array of arrays : one array per object type.   
Each array for a given type then holds series of successive floats related to the colors (r, g, b, a) of each object of this type.   
```javascript
// Object Colors
var instanceColorData = [];
instanceColorData[0] = [colorHouse1, colorHouse2, ..., colorHouseN];
instanceColorData[1] = [colorTree1, colorTree2, ..., colorTreeN];
...
instanceColorData[t] = [colorObject1, colorObject2, ..., colorObjectN];
```
The data defining each object color is a set of four successive floats : the object color (r, g, b, a).   
This means that the type array contains simply a long series of successive floats :  
```javascript
// Color example, first object type
instanceColorData[0] = [
    house1Col_r, house1Col_g, house1Col_b, house1Col_a,
    house2Col_r, house2Col_g, house2Col_b, house2Col_a,
    ...
]
```
We then pass the object colors to the DynamicTerrain constructor besides the Instance Map and the Source Meshes.  
We use the parameter `instanceColorData`. 
```javascript
        var terrainSub = 100;        // terrain subdivisions
        var terrainOptions = {
            terrainSub: terrainSub, 
            mapData: mapData, mapSubX: mapSubX, mapSubZ: mapSubZ, 
            mapColors: mapColors, 
            instanceMapData: instanceMapData,
            instanceColorData: instanceColorData,
            sourceMeshes: sourceMeshes
        };
        var terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
```
Example : https://www.babylonjs-playground.com/#FJNR5#370  
### Choosing the SPS or the Instances ?
Why use the instances more than the SPS ? or the contrary ?

The SPS performance depends on the global number of vertices, not on the number of particles.
Unless we use MultiMaterials, the SPS will render particles from different geometries, colors and textures in a single draw call.
So if the objects need many different geometries, colors, textures and don’t have such a big number of vertices, the SPS may be the right choice.

The performance of instances depends more on the global instance number. There’ll be one draw call per instance type and each type will share the same geometry (position, rotation, scaling can vary though) and the same texture. They aren’t really sped down by the number of vertices.
So if the objects are high poly, numerous but with the same geometries and textures, instances should be preferred.

As both have quite the same declarations in the terrain constructor (only parameter names differ), it’s pertinent to test in the actual case to check what fits best with our needs.


## Examples 
Some documented examples are here :   
https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/documentation/dynamicTerrainExamples.md   
