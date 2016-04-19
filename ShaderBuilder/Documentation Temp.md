 
       
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

        BuildMaterial(scene) http://www.babylonjs-playground.com/#1TYWYB#5

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
        
        constructor() : demo : http://www.babylonjs-playground.com/#1TYWYB#5
         
