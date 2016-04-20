 
## Shader Builder Requirement
1.BabylonJs all version (2+).x 
2.shaderBuilder.js
3.Know About how work Shader
4.Mathematicals
  4.1.Basic
  4.2.Vector 2D,3D and Matrix System learn now
  4.3.Mathematicals functions, special Trigonometric functions
5.WebGl reference

Anything in here is a solution for make easy way to solve a problem. So when we look shader parts (fragment and vertex) we see Low-level programming language and that is hard to programming in this language with other high-level language (javascript in this case).

why : shader is Low-level programming language.
what: define some structure and function to make easy and understandable.
who : all babylonjs users.
when : anytime we need a matrial or postprocess we can use that.
where : in Browsers can be support WebGl.

# ShaderBuilder



## Description

## Constructor

## Statics

## Members
|        | Name | Type   | Value          | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | ShaderBuilder.Setting | | | |;
| | ShaderBuilder.Extentions | Bool | true | |;
| | ShaderBuilder.Attributes | Bool | true | |;
| | ShaderBuilder.Fragment | Bool | true | |;
| | ShaderBuilder.Helpers | Bool | true | |;
| | ShaderBuilder.Uniforms | Str | | |;
| | ShaderBuilder.Varings | Str | | |;
| | ShaderBuilder.Vertex | Str | | |;
| | ShaderBuilder.CustomIndexer | | | |;


## Methods

## InitializeEngine() → 
## PrepareBeforeMaterialBuild(scene) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | scene | scene | BabylonJS scene |;


## PrepareMaterial(material, scene) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the material to prepare |;
| | scene | scene | BabylonJS scene |;

## Build() → 

## BuildMaterial(scene) →
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | scene | scene | BabylonJS scene |;


 
## Event(index, material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | index | num? | |;
| | material | material | the event material |;

## EventVertex(index, material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | index | num? | |;
| | material | material | the event material |;

## Transparency() → 

## Wired() → 

## VertexShader(material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the affected material |;


## Solid(color) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | color | Color4? | the solid color |;



## GetMapIndex(key) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | key | num | index into the map |;


## GetCubeMapIndex(key) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | key | num | index into the map |;


## Map(option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | option | | |;

## Multi(mats, combine) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | mats | array? | |;
| | combine | | |;

## Back(material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the affected material |;

## Inline(material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the affected material |;

## Front(material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the affected material |;

## Range(material1, material2, option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material1 | material | start range material |;
| | material2 | material | end range material |;
| | option | option | |;

## Reference(index, material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | index | num? | |;
| | material | material | the reference-target material |;

## ReplaceColor(index, color, material, option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | index | num? | |;
| | color | Color4? | the solid color |;
| | material | material | the reference-target material |;
| | option | option | |;

## ReflectCube(option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | option | option | |;

## NormalMap(value, material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | value | | |;
| | material | material | the normalMap material |;

## SpecularMap(material) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | material | material | the specularMap material |;

## Instance() → 

## Reflect(option, opacity) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | option | | |;
| | opacity | num? | |;

## Light(option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | option | option | |;

## Effect(option) → 
|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | option | option | |;

 

## ShaderMaterialHelperStatics

this is all terms used in your final shader 
** all terms use deeper side of code and you dont need change or understand all for use shader Builder  

|         |    Name                                        | Type                     | Value | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | ShaderMaterialHelperStatics.Dark                       | Bool                     |  false | |;
| | ShaderMaterialHelperStatics.Light                      | Bool                     |  true | |;
| | ShaderMaterialHelperStatics.PrecisionHighMode          |  |  'highp'              | |;
| | ShaderMaterialHelperStatics.PrecisionMediumMode        |  | 'mediump'             | |;
| | ShaderMaterialHelperStatics.face_back                  |  | "!gl_FrontFacing"     | back face condition |;
| | ShaderMaterialHelperStatics.face_front                 |  | "gl_FrontFacing"      | fron face condition |;
| | ShaderMaterialHelperStatics.AttrPosition               |  | 'position'            | vertex data per vertex in vertexShader and per pixel in fragmentshader|;
| | ShaderMaterialHelperStatics.AttrNormal                 |  | 'normal'              | normal data per vertex in vertexshader and per pixel in fragmentshader|;
| | ShaderMaterialHelperStatics.AttrUv                     |  | 'uv'                  | uv in vertex shader (recommand use 'vuv' in source always )|;
| | ShaderMaterialHelperStatics.AttrUv2                    |  | 'uv2'                 | |;
| | ShaderMaterialHelperStatics.AttrTypeForPosition        |  | 'vec3'                | type of position |;
| | ShaderMaterialHelperStatics.AttrTypeForNormal          |  | 'vec3'                | type of Normal |;
| | ShaderMaterialHelperStatics.AttrTypeForUv              |  | 'vec2'                | type of Uv|;
| | ShaderMaterialHelperStatics.AttrTypeForUv2             |  | 'vec2'                | |;
| | ShaderMaterialHelperStatics.uniformView                |  | "view"                | |;
| | ShaderMaterialHelperStatics.uniformWorld               |  | "world"               | |;
| | ShaderMaterialHelperStatics.uniformWorldView           |  | "worldView"           | |;
| | ShaderMaterialHelperStatics.uniformViewProjection      |  | "viewProjection"      | |;
| | ShaderMaterialHelperStatics.uniformWorldViewProjection |  | "worldViewProjection" | |;
| | ShaderMaterialHelperStatics.uniformStandardType        |  | "mat4"                | |;
| | ShaderMaterialHelperStatics.uniformFlags               |  | "flags"               | use in only flagSystem : mesh.Material.flagUp or flagDon |;
| | ShaderMaterialHelperStatics.Mouse                      |  | "mouse"               | |;
| | ShaderMaterialHelperStatics.Screen                     |  | "screen"              | |;
| | ShaderMaterialHelperStatics.Camera                     |  | "camera"              | camera position |;
| | ShaderMaterialHelperStatics.Look                       |  | "look"                | camera target |;
| | ShaderMaterialHelperStatics.Time                       |  | "time"                | use with global float variable time |;
| | ShaderMaterialHelperStatics.GlobalTime                 |  | "gtime"               | globaltime |;
| | ShaderMaterialHelperStatics.Position                   |  | "pos"                 | |;
| | ShaderMaterialHelperStatics.WorldPosition              |  | "wpos"                | |;
| | ShaderMaterialHelperStatics.Normal                     |  | "nrm"                 | |;
| | ShaderMaterialHelperStatics.WorldNormal                |  | "wnrm"                | |;
| | ShaderMaterialHelperStatics.Uv                         |  | "vuv"                 | |;
| | ShaderMaterialHelperStatics.Uv2                        |  | "vuv2"                | |;
| | ShaderMaterialHelperStatics.Center                     |  | 'center'              | center of mesh |;
| | ShaderMaterialHelperStatics.ReflectMatrix              |  | "refMat"              | use in cube reflection  |;
| | ShaderMaterialHelperStatics.Texture2D                  |  | "txtRef_"             | perfix of 2D Samplers |;
| | ShaderMaterialHelperStatics.TextureCube                |  | "cubeRef_"            | perfix of Cube samplers |;





## Normals

enumration of shader string all type is vec3  'normalize(vec3(x,y,z))'
* do not use ';' in last part of this

|         |    Name                                        | Type                     | Value | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | Normals.Default | shader string : vec3  | nrm | mesh current normal |;
| | Normals.Inverse | shader string : vec3  | -1.*nrm | used for back face |;
| | Normals.Pointed | shader string : vec3  | calculated with pos | soft similated normal(not Exactly normal) |;
| | Normals.Flat    | shader string : vec3  | calculated with dfdx .. | flated normal |;
| | Normals.Map     | shader string : vec3  | used map | custom normal |;


## Speculars

|        | Name | Type   | Value          | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | Speculars.Map | | | |;


# ShaderMaterialHelper

## Description
## Constructor
## Members
## Methods
## ShaderMaterial(name, scene, shader, helpers) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | name | str | Name of material |;
| | scene | BabylonJS scene| The scene for this material |;
| | shader | shader| |;
| | helpers    | array | |;

## MakeShaderMaterialForEngine(name, scene, shader, helpers) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | name | str | Name of material |;
| | scene | BabylonJS scene| The scene for this material |;
| | shader | shader| |;
| | helpers    | array | |;


## DefineTexture(name, scene, shader, helpers) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | text | str | text |;
| | scene | BabylonJS scene| The scene for this material |;

## DefineCubeTexture(name, scene, shader, helpers) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | text | str | text |;
| | scene | BabylonJS scene| The scene for this material |;

## SetUniforms(name, scene, shader, helpers) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | meshes | array | Affected meshes |;
| | cameraPos | vector3? | Camera position |;
| | cameraTarget | mesh or Vector3 | Camera target |;
| | mouse    | | |;
| | screen | | |;
| | time    | | |;



# Shader

## Description
## Constructor
## Members
## Methods
## Replace(string, text, datatype) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | string | str | target string |;
| | text | str | |;
| | datatype | str | |;

## Def(attribute, value) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | attribute | str | shader attribute |;
| | value | any | value |;


## Join(string) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | string | str | string for shader inclusion |;

## Print(n) → 

|         |    Name                                        | Type                     | Description |
| :---:  | :--- |  :---: |     :---      |
| | n | str | |;


## Custom() → 

## Index() → 

## DefCustom() → 

## Index() → 

# Helper

## Description
## Constructor
## Statics
    Helper.Red = 0;
    Helper.Yellow = 1;
    Helper.White = 2;
    Helper.Cyan = 4;
    Helper.Blue = 5;
    Helper.Pink = 6;
    Helper.Black = 7;
    Helper.Green = 8;
## Members
## Methods

# ShaderSetting

|        | Name | Type   | Value          | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | ShaderSetting.PrecisionMode | | | |;
| | ShaderSetting.Uv | Bool | true | |;
| | ShaderSetting.Time | Bool | true | |;
| | ShaderSetting.Camera | Bool | true | |;
| | ShaderSetting.Helpers | Bool | true | |;
| | ShaderSetting.NormalMap | Str | | |;
| | ShaderSetting.SpecularMap | Str | | |;
| | ShaderSetting.NormalOpacity | Str | | |;
| | ShaderSetting.Normal | | | |;















Todo:  options.


