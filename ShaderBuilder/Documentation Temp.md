 
       
        static InitializeEngine()  
        static InitializePostEffects(scene: any, scale: number) 

        FragmentBeforeMain: string;
        VertexBeforeMain: string;
        Varings: string[];
        Attributes: string[];
        Uniforms: string[];
        FragmentUniforms: string;
        VertexUniforms: string;
        Extentions: string[];
        References: string;
        Helpers: string[];
        Body: string;
        VertexBody: string;
        AfterVertex: string;
        RenderTargetForColorId: string;
        PPSSamplers: string[];
        RenderTargetForDepth: string;

        PostEffect1Effects: string[];
        PostEffect2Effects: string[];


        PrepareBeforeMaterialBuild() 

        PrepareBeforePostProcessBuild()  

        PrepareMaterial(material: any, scene: any) 

        Build() 

        BuildVertex() 

        SetUniform(name: string, type: string) 

<h1>   BuildMaterial(scene) http://www.babylonjs-playground.com/#1TYWYB#5 </h1>

        BuildPostProcess(camera: any, scene: any, scale: number, option: IPostProcess) 

        Event(index: number, mat: string) 

        EventVertex(index: number, mat: string) 

        Transparency() 

        PostEffect1(id: number, effect: string) 

        PostEffect2(id: number, effect: string) 

        ImportSamplers(txts: string[]) 

        Wired() 

        VertexShader(mat) 

        Solid(color: IColor) 

        GetMapIndex(key: string): any 

        GetCubeMapIndex(key: string): any 

        Func(fun: any) 

        Nut(value: string, option: INut) 

        Map(option: IMap) 

        Multi(mats: any[], combine: boolean) 

        Back(mat: string) 

        InLine(mat: string) 

        Front(mat: string) 

        Range(mat1: string, mat2: string, option: IRange) 

        Reference(index: number, mat: any) 

        ReplaceColor(index: number, color: number, mat: string, option: IReplaceColor) 

        Blue(index: number, mat: string, option: IReplaceColor) 
        Cyan(index: number, mat: string, option: IReplaceColor) 
        Red(index: number, mat: string, option: IReplaceColor) 
        Yellow(index: number, mat: string, option: IReplaceColor)  
        Green(index: number, mat: string, option: IReplaceColor) 
        Pink(index: number, mat: string, option: IReplaceColor) 
        White(index: number, mat: string, option: IReplaceColor) 
        Black(index: number, mat: string, option: IReplaceColor) 

        ReflectCube(option: IReflectMap) 

        NormalMap(val: string, mat: string) 

        SpecularMap(mat: string) 

        Instance() 

        Reflect(option: IReflectMap, opacity: number) 

        Light(option: ILight) 

        Effect(option: IEffect) 

        IdColor(id: number, w: number) 

        Discard() 
        
<h1>  constructor() : demo : http://www.babylonjs-playground.com/#1TYWYB#5 </h1>
         



## ShaderMaterialHelperStatics


|         |    Name                                        | Type                     | Value | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | ShaderMaterialHelperStatics.Dark                       | Bool                     |  false | |;
| | ShaderMaterialHelperStatics.Light                      | Bool                     |  true | |;
| | ShaderMaterialHelperStatics.PrecisionHighMode          |  |  'highp'              | |;
| | ShaderMaterialHelperStatics.PrecisionMediumMode        |  | 'mediump'             | |;
| | ShaderMaterialHelperStatics.face_back                  |  | "!gl_FrontFacing"     | |;
| | ShaderMaterialHelperStatics.face_front                 |  | "gl_FrontFacing"      | |;
| | ShaderMaterialHelperStatics.AttrPosition               |  | 'position'            | |;
| | ShaderMaterialHelperStatics.AttrNormal                 |  | 'normal'              | |;
| | ShaderMaterialHelperStatics.AttrUv                     |  | 'uv'                  | |;
| | ShaderMaterialHelperStatics.AttrUv2                    |  | 'uv2'                 | |;
| | ShaderMaterialHelperStatics.AttrTypeForPosition        |  | 'vec3'                | |;
| | ShaderMaterialHelperStatics.AttrTypeForNormal          |  | 'vec3'                | |;
| | ShaderMaterialHelperStatics.AttrTypeForUv              |  | 'vec2'                | |;
| | ShaderMaterialHelperStatics.AttrTypeForUv2             |  | 'vec2'                | |;
| | ShaderMaterialHelperStatics.uniformView                |  | "view"                | |;
| | ShaderMaterialHelperStatics.uniformWorld               |  | "world"               | |;
| | ShaderMaterialHelperStatics.uniformWorldView           |  | "worldView"           | |;
| | ShaderMaterialHelperStatics.uniformViewProjection      |  | "viewProjection"      | |;
| | ShaderMaterialHelperStatics.uniformWorldViewProjection |  | "worldViewProjection" | |;
| | ShaderMaterialHelperStatics.uniformStandardType        |  | "mat4"                | |;
| | ShaderMaterialHelperStatics.uniformFlags               |  | "flags"               | |;
| | ShaderMaterialHelperStatics.Mouse                      |  | "mouse"               | |;
| | ShaderMaterialHelperStatics.Screen                     |  | "screen"              | |;
| | ShaderMaterialHelperStatics.Camera                     |  | "camera"              | |;
| | ShaderMaterialHelperStatics.Look                       |  | "look"                | |;
| | ShaderMaterialHelperStatics.Time                       |  | "time"                | |;
| | ShaderMaterialHelperStatics.GlobalTime                 |  | "gtime"               | |;
| | ShaderMaterialHelperStatics.Position                   |  | "pos"                 | |;
| | ShaderMaterialHelperStatics.WorldPosition              |  | "wpos"                | |;
| | ShaderMaterialHelperStatics.Normal                     |  | "nrm"                 | |;
| | ShaderMaterialHelperStatics.WorldNormal                |  | "wnrm"                | |;
| | ShaderMaterialHelperStatics.Uv                         |  | "vuv"                 | |;
| | ShaderMaterialHelperStatics.Uv2                        |  | "vuv2"                | |;
| | ShaderMaterialHelperStatics.Center                     |  | 'center'              | |;
| | ShaderMaterialHelperStatics.ReflectMatrix              |  | "refMat"              | |;
| | ShaderMaterialHelperStatics.Texture2D                  |  | "txtRef_"             | |;
| | ShaderMaterialHelperStatics.TextureCube                |  | "cubeRef_"            | |;





## Normals


|         |    Name                                        | Type                     | Value | Description |
| :---:  | :--- |  :---: |     :---:      | :--- |
| | Normals.Default | | | |;
| | Normals.Inverse | | | |;
| | Normals.Pointed | | | |;
| | Normals.Flat    | | | |;
| | Normals.Map     | | | |;


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



