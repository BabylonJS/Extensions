# SPS Tree Generator

The function createTree uses the solid particle system to generate a tree. 
A base tree is created consisting of a trunk which forks into branches, which then themselves may fork or not.
This base tree is used in two different ways.  
   
    1. as the trunk and parent branches for the whole tree.  
  
    2. with leaves added as a mini-tree that is added a number of times to the base trunk and parent branches to form the whole tree.  

## How to use it.

After importing into your BJS project simply add

```
var tree = createTree(trunkHeight, trunkTaper, trunkSlices, trunkMaterial, boughs, forks, forkAngle, forkRatio, branches, branchAngle, bowFreq, bowHeight, leavesOnBranch, leafWHRatio, leafMaterial, scene);
```

## Parameters

trunkHeight - height of trunk of tree.  
trunkTaper -  fraction of starting radius for the end radius of a branch between 0 and 1.   
trunkSlices - the number of points on the paths used for the ribbon mesh that forms the branch 
trunk material - the material used on all branches.  
boughs - the number of times the tree will split into forked branches, 1 trunk splits into branches, 2 these branches also spilt into branches.  
forks -  the number of branches a branch can split into, 5 or more really slows the generation.  
forkAngle - the angle a forked branch makes with its parent branch measured from the direction of the branch.  
forkRatio - the ratio of the length of a branch to its parent's length, between 0 and 1.  
branches - the number of mini-trees that are randomally added to the tree.  
branchAngle - the angle the mini-tree makes with its parent branch from the direction of the branch.  
bowFreq - the number of bows (bends) in a branch. A trunk is set to have only one bow.  
bowHeight - the height of a bow from the line of direction of the branch.  
leavesOnBranch - the number of leaves to be added to one side of a branch.  
leafWHRatio - width to height ratio for a leaf between 0 and 1, closer to 0 longer leaf, closer to 1 more circular.  
leafMaterial - material used for all leaves.  
scene - BABYLON scene.  

