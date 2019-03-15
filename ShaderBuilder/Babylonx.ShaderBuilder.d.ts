declare module BABYLONX {

    export interface IColor {
        r?: any;
        g?: any;
        b?: any;
        a?: any;
    }

    export interface IVector3 {
        x: any;
        y: any;
        z: any;
    }

    export interface ILight {
        direction?: string;
        rotation?: IVector3;
        color?: IColor;
        darkColorMode?: boolean;

        specular?: any,
        specularPower?: number,
        specularLevel?: number,

        phonge?: any,
        phongePower?: number,
        phongeLevel?: number,

        normal?: string,

        reducer?: string,

        supplement?: boolean,

        parallel?: boolean
    }

    export interface ITexture {
        key?: string,
        inVertex?: boolean,
        inFragment?: boolean,
        indexedDB?: number
    }

    export interface IEffect {
        px?: any,
        py?: any,
        pz?: any,
        pr?: any,
    }

    export interface IMap {
        path: string,
        x?: any,
        y?: any,
        scaleX?: any,
        scaleY?: any,
        rotation?: IVector3;
        useInVertex?: boolean;
        uv?: string,
        normal?: string,
        normalLevel?: string,
        bias?: string,
        alpha?: boolean,
        rowIndex?: number,
        columnIndex?: number,
        indexCount?: number,
        tiled?: boolean,
        animation?: boolean,
        animationSpeed?: number,
        animationFrameEnd?: number,
        animationFrameStart?: number,
        index?: any,
    }

    export interface IReflectMap {
        path: string,
        x?: any,
        y?: any,
        scaleX?: any,
        scaleY?: any,
        equirectangular?: boolean,
        rotation?: IVector3;
        useInVertex?: boolean;
        uv?: string,
        normal?: string,
        normalLevel?: string,
        bias?: string,
        alpha?: boolean,
        revers?: boolean,
        reflectMap?: string,
        refract?: boolean,
        refractMap?: string,
    }

    export interface IReplaceColor {
        colorIndex?: number,
        colorStep?: number,
        indexToEnd?: boolean,
        rangeStep?: any,
        rangePower?: any
    }

    export interface IRange {
        start?: any;
        end?: any;
        direction?: any;
    }

    export interface IPostProcess {
        samplingMode?: number
        engine?: any,
        reusable?: boolean
        defines?: string,
        onApply?: any
    }

    export interface INutBone {
        bet: any,
        center: string,
        rotation: IVector3
    }
    export interface INut {
        bones: INutBone[],
        frame?: string,
        array: any[]
    }

    export class ShaderMaterialHelperStatics {
        static Dark: boolean;
        static Light: boolean;

        static PrecisionHighMode: string;
        static PrecisionMediumMode: string;

        static face_back: string;
        static face_front: string;

        static AttrPosition : string;
        static AttrNormal: string;
        static AttrUv: string;
        static AttrUv2: string;

        static AttrTypeForPosition: string;
        static AttrTypeForNormal: string;
        static AttrTypeForUv: string;
        static AttrTypeForUv2: string;

        static uniformView: string;
        static uniformWorld: string;
        static uniformWorldView: string;
        static uniformViewProjection: string;
        static uniformWorldViewProjection: string;

        static uniformStandardType: string;
        static uniformFlags: string;

        static Mouse: string;
        static Screen: string;
        static Camera: string;
        static Look: string;

        static Time: string;
        static GlobalTime: string;
        static Position: string;
        static WorldPosition: string;

        static Normal: string;
        static WorldNormal: string;
        static Uv: string;
        static Uv2: string;
        static Center: string;

        static ReflectMatrix: string;

        static Texture2D: string;
        static TextureCube: string;

        static IdentityHelper: number;

        constructor();
    }

    export class Normals {
        static Default: string;
        static Inverse: string;
        static Pointed: string;
        static Flat: string;
        static Map: string;
    }

    export class Speculars {
        static Map: string;
    }

    export interface IShaderStruct {
        Pixel: string,
        Vertex: string
    }

    export interface IShaderHelper {
        uniforms: string[],
        attributes: string[]
    }

    export class ShaderMaterialHelper {
        ShaderMaterial(name: string, scene: BABYLON.Scene, shader: IShaderStruct, helpers: IShaderHelper): BABYLON.ShaderMaterial;
        MakeShaderMaterialForEngine(name: string, scene: BABYLON.Scene, shader: IShaderStruct, helpers: IShaderHelper): BABYLON.ShaderMaterial;
        DefineTexture(txt: ITexture, scene: BABYLON.Scene): BABYLON.Texture;
        DefineCubeTexture(txt: ITexture, scene: BABYLON.Scene): BABYLON.CubeTexture;
        SetUniforms(meshes: any, cameraPos: any, cameraTarget: any, mouse: any, screen: any, time: any): void;
        PostProcessTextures(pps: any, name: string, txt: any): void;
        DefineRenderTarget(name: string, scale: number, scene: BABYLON.Scene): any;
        ShaderPostProcess(name: string, samplers: any, camera: any, scale: number, shader: IShaderStruct, helpers: IShaderHelper, option: IPostProcess): BABYLON.PostProcess;
    }

    export class Shader {
        static _null: string;
        static Indexer: number;
        static ShaderIdentity: number;
        static Me: ShaderBuilder;
        static Replace(s: string, t: string, d: string): string;
        static Def(a: any, d: any): any;
        static Join(s: string[]): string;

        static Print(n: any): string;
        static Custom(): string;
        static Index(): string;
        static DefCustom(t: string, c: string): void;
        static toRGB(a: any, b: any): { r: number, g: number, b: number };

        static torgb(a: any, b: any): { r: number, g: number, b: number };

        static toID(a: any, b: any): number;
    }

    export function Helper(): ShaderBuilder;
    export namespace Helper {
        Depth(far: any): string;

        Red: number;
        Yellow: number;
        White: number;
        Cyan: number;
        Blue: number;
        Pink: number;
        Black: number;
        Green: number;
    }

    export class ShaderSetting {
        Texture2Ds: any[];
        TextureCubes: any[];
        CameraShot: boolean;
        PrecisionMode: string;

        Transparency: boolean;
        DisableAlphaTesting: boolean;
        Back: boolean;
        Front: boolean;
        Wire: boolean;
        Uv: boolean;
        Uv2: boolean;
        Center: boolean;
        Flags: boolean;
        
        FragmentView: boolean;
        FragmentWorld: boolean;
        FragmentWorldView: boolean;
        FragmentViewProjection: boolean;

        SpecularMap: string;
        NormalMap: string;
        Normal: string;
        NormalOpacity: string;

        WorldPosition: boolean;
        Vertex: boolean;

        VertexView: boolean;
        VertexWorld: boolean;
        VertexWorldView: boolean;
        VertexViewProjection: boolean;

        Mouse: boolean;
        Screen: boolean;
        Camera: boolean;
        Look: boolean;
        Time: boolean;
        GlobalTime: boolean;
        ReflectMatrix: boolean;

        Helpers: Boolean;

        constructor();
    }

    export class ShaderBuilder {
        Setting: ShaderSetting;
        Extentions: string[];
        Attributes: string[];
        Fragment: string[];
        Helpers: string[];
        Uniforms: string[];
        Varings: string[];
        Vertex: string[];
        CustomIndexer: number;

        Parent?: ShaderBuilder;

        FragmentBeforeMain!: string;
        VertexBeforeMain?: string;
        FragmentUniforms?: string;
        VertexUniforms?: string;
        References?: string;
        Body!: string;
        VertexBody?: string;
        AfterVertex?: string;
        RenderTargetForColorId?: string;
        PPSSamplers?: string[];
        RenderTargetForDepth?: string;

        PostEffect1Effects?: string[];
        PostEffect2Effects?: string[];

        constructor();

        static InitializeEngine();
        static InitializePostEffects(scene: any, scale: number): void;

        PrepareBeforeMaterialBuild(): void;

        PrepareBeforePostProcessBuild(): void;

        PrepareMaterial(material: BABYLON.Material, scene: any): BABYLON.Material;

        Build(): string;

        BuildVertex(): string;

        SetUniform(name: string, type: string): ShaderBuilder;

        BuildMaterial(scene: BABYLON.Scene): BABYLON.Material;

        BuildPostProcess(camera: any, scene: any, scale: number, option: IPostProcess): BABYLON.PostProcess;

        Event(index: number, mat: string): ShaderBuilder;

        EventVertex(index: number, mat: string): ShaderBuilder;

        Transparency(): ShaderBuilder;
        
        DisableAlphaTesting(): ShaderBuilder;
         
        PostEffect1(id: number, effect: string): ShaderBuilder;

        PostEffect2(id: number, effect: string): ShaderBuilder;

        ImportSamplers(txts: string[]): ShaderBuilder;

        Wired(): ShaderBuilder;

        VertexShader(mat: BABYLON.Material): ShaderBuilder;

        Solid(color: IColor): ShaderBuilder;

        GetMapIndex(key: string): any;

        GetCubeMapIndex(key: string): any;

        Func(fun: any): any;

        Nut(value: string, option: INut): ShaderBuilder;

        Map(option: IMap): ShaderBuilder;

        Multi(mats: any[], combine: boolean): ShaderBuilder;

        Back(mat: string): ShaderBuilder;

        InLine(mat: string): ShaderBuilder;

        Front(mat: string): ShaderBuilder;

        Range(mat1: string, mat2: string, option: IRange): ShaderBuilder;

        Reference(index: number, mat?: any): ShaderBuilder;

        ReplaceColor(index: number, color: number, mat: string, option: IReplaceColor): ShaderBuilder;

        Blue(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Cyan(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Red(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Yellow(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Green(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Pink(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        White(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;
        Black(index: number, mat: string, option?: IReplaceColor): ShaderBuilder;

        ReflectCube(option: IReflectMap): ShaderBuilder;

        NormalMap(val: string, mat: string): ShaderBuilder;

        SpecularMap(mat: string): ShaderBuilder;

        Instance(): ShaderBuilder;

        Reflect(option: IReflectMap, opacity: number): ShaderBuilder;

        Light(option: ILight): ShaderBuilder;

        Effect(option: IEffect): ShaderBuilder;

        IdColor(id: number, w: number): ShaderBuilder;

        Discard(): ShaderBuilder;
    }
}
