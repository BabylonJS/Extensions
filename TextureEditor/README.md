# TextureEditor

Texture Editor is a Tool where you can design materials for your BABYLON meshes. TextureEditor allows you to combine and mix several inputs to generate texture-images used by the BABYLON-extension "CompoundShader". 

## Key featuers:

* Alternative input sources: PatternGenerator, NoiseGenerator and plain image
* No need for normal maps, they will be generated on the fly by the shader
* pattern generator on the javascript side, once generated => turbo speed on the shader side
* noise generator on the javascript side (Perlin,Fractal,Turbulence), once generated => turbo speed on the shader side
* Preset concept, all shader/pattern/noise-parameters can be reduced to a handful numerical settings (JSON-Format)
* Full procedural, images can be mixed optionally

TextureEditor is in alpha/beta-stage, which means that most of the planned features are implemented, but not fully tested.
### Known issues
TextureEditor works well on Chrome and Edge, but has some problemes on firefox.

## Start
You can start the application HERE: https://rawgit.com/BabylonJS/Extensions/master/TextureEditor/textureEditor01Alpha.html
