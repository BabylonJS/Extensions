# Quick Tree Generator

The function QuickTreeGenerator uses a sphere with randomized vertices to generate a tree. 

It is based on Julian Temechon's tutoril on the VertexData object http://www.pixelcodr.com/tutos/trees/trees.html

## How to use it.

Before using check your version of BABYLONJS versions 2.2 and earlier require line 8 to be active, comment line 9 instead
BABYLON 2.3 or later leaves as is.

After importing into your BJS project simply add

```
var tree = QuickTreeGenerator(sizeBranch, sizeTrunk, radius, trunkMaterial, leafMaterial, scene);
```

## Parameters

sizeBranch - sphere radius used for branches and leaves 15 to 20.

sizeTrunk - height of trunk 10 to 15.

radius - radius of trunk 1 to 5.

trunkMaterial - material used for trunk.

leafMaterial - material for canopies.
 
scene - BABYLON scene. 

