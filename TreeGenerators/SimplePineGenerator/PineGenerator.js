//canopies number of leaf sections, height of tree, materials
var simplePineGenerator = function(canopies, height, trunkMaterial, leafMaterial, scene) {
    var curvePoints = function(l, t) {
    var path = [];
    var step = l / t;
    for (var i = 0; i < l; i += step ) {
		path.push(new BABYLON.Vector3(0, i, 0));
	   	path.push(new BABYLON.Vector3(0, i, 0 ));
     }
    return path;
  	};
	
	var nbL = canopies + 1;
  	var nbS = height;
  	var curve = curvePoints(nbS, nbL);
	var radiusFunction = function (i, distance) {
  		var fact = 1;
		if (i % 2 == 0) { fact = .5; }
   		var radius =  (nbL * 2 - i - 1) * fact;	
   		return radius;
	};  
  
	var leaves = BABYLON.Mesh.CreateTube("tube", curve, 0, 10, radiusFunction, 1, scene);
	var trunk = BABYLON.Mesh.CreateCylinder("trunk", nbS/nbL, nbL*1.5 - nbL/2 - 1, nbL*1.5 - nbL/2 - 1, 12, 1, scene);
  
	leaves.material = leafMaterial;
	trunk.material = trunkMaterial; 
	var tree = new BABYLON.Mesh.CreateBox('',1,scene);
	tree.isVisible = false;
	leaves.parent = tree;
	trunk.parent = tree; 
    return tree; 
}