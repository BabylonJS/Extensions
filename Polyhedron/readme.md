You will find here the file [_polyhedra.js_](https://raw.githubusercontent.com/BabylonJS/Extensions/master/Polyhedron/polyhedra.js) for BabylonJS.  

This file contains the data from the website "Virtual Polyhedra: The Encyclopedia of Polyhedra" by [George W. Hart](http://www.georgehart.com/) : http://www.georgehart.com/virtual-polyhedra/vp.html  
George Hart Wikipedia article : https://en.wikipedia.org/wiki/George_W._Hart  
These data were stored by George Hart in WRL files, so please read the terms of use : http://www.georgehart.com/virtual-polyhedra/copyright.html

These data were then converted to JSON by [Lee Stemkoski](http://home.adelphi.edu/~stemkoski/) for this ThreeJS demo : http://stemkoski.github.io/Three.js/Polyhedra.html  
Stemkoski's original data file is here : http://stemkoski.github.io/Three.js/js/polyhedra.js  
<br/>
<br/>
These data are actually a list of 126 javascript objects that you can directly use with the BJS method _CreatePolyhedron()_  

###How to do ?
Just copy/paste the wanted polyhedron from the list in a variable of your code.  
Then pass this variable to the _CreatePolyhedron()_ method.  



```javascript
var squareAntiPrism = { "name":"Square Antiprism", "category":["Antiprism"],
"vertex":[[0,0,1.25928],[1.215563,0,0.3289288],[0.2517512,1.189207,0.3289288],[-1.111284,0.4925857,0.3289288],[-0.71206,-0.9851714,0.3289288],[0.5035025,-0.9851714,-0.6014224],[0.6077813,0.4925857,-0.9867865],[-0.7552537,-0.2040357,-0.9867865]],
"face":[[0,1,2],[0,2,3],[0,3,4],[1,5,6],[1,6,2],[3,7,4],[4,7,5],[5,7,6],[0,4,5,1],[2,6,7,3]]};

var mesh = BABYLON.Mesh.CreatePolyhedron("sap", {custom: squareAntiPrism}, scene);
```

Display of all the polyhedron types from this file : http://www.babylonjs-playground.com/frame.html#21QRSK#1  
