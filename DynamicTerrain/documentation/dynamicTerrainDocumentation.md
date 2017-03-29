# Dynamic Terrain
## Installation
Just download the javascript file (`dynamicTerrain.js` or, recommended, the minified version `dynamicTerrain.min.js`) from the BabylonJS [extension repository](https://github.com/BabylonJS/Extensions) folder `DynamicTerrain/dist` :   https://github.com/BabylonJS/Extensions/tree/master/DynamicTerrain/dist    

Then in your code, declare this script in a html tag **after** the script tag declaring Babylon.js :
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
The first thing you need to create a dynamic terrain is a data map.  
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
