# CompoundShader

A Typescript based project for shading Babylon meshes "on the fly"



## Description: 
CompoundShader takes two textures and calculates the normal map and light shadings of the first texture (generator-texture) and mixes the second texture (mixing-texture) to the output. CompoundShader can be (optionally) parametrisized on construction  and inbetween the BABYLON render loop (also optionally). Both textures can be either BABYLON.Textures or BABYLON.DynamicTextures. 

### Dependencies: BABYLON-EXTENSION "ShaderBuilder"

## Usage: 
```javascript
  box.material =new BABYLONX.CompoundShader(scene, generator-texture, mixing-texture, {params}||{}).material;
 
  
  scene.registerBeforeRender(function () {
    //ShaderBuilder updateUniforms goes here
    ....
    
    //optional for CompoundShader: tweak parameters
    box.material.shader.updateParams({balance:1+Math.sin(0.01*frame++)});
  }
  
```

## Parameters:

Name | Description | Default-Value
------------ | -------------|----------------
stepx | shifting value for normal map calculation|0.005
stepy |shifting value for normal map calculation|0.005
balance|mixing ratio between generator-texture and mixing-texture|0.9
strength|strength of the effect|0.5
level|trigger level for the effect|7
invR|invert red part of generator-texture|false
invG|invert green part of generator-texture|false
invH|invert generated height|false
time|not used at this time of writing|1


## Demo application:
https://rawgit.com/androdlang/clonerjs/master/texEdit01.html

## Plaground
coming soon..
