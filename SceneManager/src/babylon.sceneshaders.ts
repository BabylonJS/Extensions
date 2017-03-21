module BABYLON {
    export class ShaderController {
        private _shader:BABYLON.UniversalShaderMaterial;
        private _manager: BABYLON.SceneManager = null;
        constructor(owner:BABYLON.UniversalShaderMaterial, host:BABYLON.Scene) {
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (host == null) throw new Error("Null host scene obejct specified.");
            this._shader = owner;
            this._manager = null;
        }
        public start(): void { }
        public update(): void { }
        public define(defines:string[], mesh?: BABYLON.AbstractMesh, useInstances?: boolean): void { }
        public after(): void { }
        public destroy(): void { }
        public dispose():void {
            this._shader = null;
            this._manager = null;
            this.destroy();
        }
        public get shader():BABYLON.UniversalShaderMaterial {
            return this._shader;
        }
        public get scene():BABYLON.Scene {
            return this._shader.getScene();
        }
        public get engine(): BABYLON.Engine { 
            return this._shader.getScene().getEngine();
        }
        public get manager(): BABYLON.SceneManager {
            if (this._manager == null) {
                this._manager = BABYLON.SceneManager.GetInstance(this._shader.getScene());
            }
            return this._manager;
        }
    }
    class UniversalShaderMaterialDefines extends BABYLON.MaterialDefines {
        public ALBEDO = false;
        public AMBIENT = false;
        public OPACITY = false;
        public OPACITYRGB = false;
        public REFLECTION = false;
        public EMISSIVE = false;
        public REFLECTIVITY = false;
        public BUMP = false;
        public PARALLAX = false;
        public PARALLAXOCCLUSION = false;
        public SPECULAROVERALPHA = false;
        public CLIPPLANE = false;
        public ALPHATEST = false;
        public ALPHAFROMALBEDO = false;
        public POINTSIZE = false;
        public FOG = false;
        public SPECULARTERM = false;
        public OPACITYFRESNEL = false;
        public EMISSIVEFRESNEL = false;
        public FRESNEL = false;
        public NORMAL = false;
        public UV1 = false;
        public UV2 = false;
        public VERTEXCOLOR = false;
        public VERTEXALPHA = false;
        public NUM_BONE_INFLUENCERS = 0;
        public BonesPerMesh = 0;
        public INSTANCES = false;
        public MICROSURFACEFROMREFLECTIVITYMAP = false;
        public MICROSURFACEAUTOMATIC = false;
        public EMISSIVEASILLUMINATION = false;
        public LINKEMISSIVEWITHALBEDO = false;
        public LIGHTMAP = false;
        public USELIGHTMAPASSHADOWMAP = false;
        public REFLECTIONMAP_3D = false;
        public REFLECTIONMAP_SPHERICAL = false;
        public REFLECTIONMAP_PLANAR = false;
        public REFLECTIONMAP_CUBIC = false;
        public REFLECTIONMAP_PROJECTION = false;
        public REFLECTIONMAP_SKYBOX = false;
        public REFLECTIONMAP_EXPLICIT = false;
        public REFLECTIONMAP_EQUIRECTANGULAR = false;
        public INVERTCUBICMAP = false;
        public LOGARITHMICDEPTH = false;
        public CAMERATONEMAP = false;
        public CAMERACONTRAST = false;
        public CAMERACOLORGRADING = false;
        public CAMERACOLORCURVES = false;
        public OVERLOADEDVALUES = false;
        public OVERLOADEDSHADOWVALUES = false;
        public USESPHERICALFROMREFLECTIONMAP = false;
        public REFRACTION = false;
        public REFRACTIONMAP_3D = false;
        public LINKREFRACTIONTOTRANSPARENCY = false;
        public REFRACTIONMAPINLINEARSPACE = false;
        public LODBASEDMICROSFURACE = false;
        public USEPHYSICALLIGHTFALLOFF = false;
        public RADIANCEOVERALPHA = false;
        public USEPMREMREFLECTION = false;
        public USEPMREMREFRACTION = false;
        public OPENGLNORMALMAP = false;
        public INVERTNORMALMAPX = false;
        public INVERTNORMALMAPY = false;
        public SHADOWFULLFLOAT = false;

        public METALLICWORKFLOW = false;
        public METALLICROUGHNESSMAP = false;
        public METALLICROUGHNESSGSTOREINALPHA = false;
        public METALLICROUGHNESSGSTOREINGREEN = false;

        public MAX_TEXTURE_IMAGE_UNITS = 0;
        public MAX_VERTEX_UNIFORM_VECTORS = 0;
        public MAX_FRAGMENT_UNIFORM_VECTORS = 0;

        constructor() {
            super();
            this.rebuild();
        }
    }

    /**
     * The Physically based material of BJS.
     * 
     * This offers the main features of a standard PBR material.
     * For more information, please refer to the documentation : 
     * http://doc.babylonjs.com/extensions/Physically_Based_Rendering
     */
    export class UniversalShaderMaterial extends BABYLON.Material {

        /**
         * Intensity of the direct lights e.g. the four lights available in your scene.
         * This impacts both the direct diffuse and specular highlights.
         */
        @serialize()
        public directIntensity: number = 1.0;
        
        /**
         * Intensity of the emissive part of the material.
         * This helps controlling the emissive effect without modifying the emissive color.
         */
        @serialize()
        public emissiveIntensity: number = 1.0;
        
        /**
         * Intensity of the environment e.g. how much the environment will light the object
         * either through harmonics for rough material or through the refelction for shiny ones.
         */
        @serialize()
        public environmentIntensity: number = 1.0;
        
        /**
         * This is a special control allowing the reduction of the specular highlights coming from the 
         * four lights of the scene. Those highlights may not be needed in full environment lighting.
         */
        @serialize()
        public specularIntensity: number = 1.0;

        private _lightingInfos: BABYLON.Vector4 = new BABYLON.Vector4(this.directIntensity, this.emissiveIntensity, this.environmentIntensity, this.specularIntensity);
        
        /**
         * Debug Control allowing disabling the bump map on this material.
         */
        @serialize()
        public disableBumpMap: boolean = false;

        /**
         * Debug Control helping enforcing or dropping the darkness of shadows.
         * 1.0 means the shadows have their normal darkness, 0.0 means the shadows are not visible.
         */
        @serialize()
        public overloadedShadowIntensity: number = 1.0;
        
        /**
         * Debug Control helping dropping the shading effect coming from the diffuse lighting.
         * 1.0 means the shade have their normal impact, 0.0 means no shading at all.
         */
        @serialize()
        public overloadedShadeIntensity: number = 1.0;

        private _overloadedShadowInfos: BABYLON.Vector4 = new BABYLON.Vector4(this.overloadedShadowIntensity, this.overloadedShadeIntensity, 0.0, 0.0);

        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        @serialize()
        public cameraExposure: number = 1.0;
        
        /**
         * The camera contrast used on this material.
         * This property is here and not in the camera to allow controlling contrast without full screen post process.
         */
        @serialize()
        public cameraContrast: number = 1.0;
        
        /**
         * Color Grading 2D Lookup Texture.
         * This allows special effects like sepia, black and white to sixties rendering style. 
         */
        @serializeAsTexture()
        public cameraColorGradingTexture: BABYLON.BaseTexture = null;
        
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT). 
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image; 
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        @serializeAsColorCurves()
        public cameraColorCurves: BABYLON.ColorCurves = null;
         
        private _cameraInfos: BABYLON.Vector4 = new BABYLON.Vector4(1.0, 1.0, 0.0, 0.0);

        private _microsurfaceTextureLods: BABYLON.Vector2 = new BABYLON.Vector2(0.0, 0.0);

        /**
         * Debug Control allowing to overload the ambient color.
         * This as to be use with the overloadedAmbientIntensity parameter.
         */
        @serializeAsColor3()
        public overloadedAmbient: BABYLON.Color3 = BABYLON.Color3.White();

        /**
         * Debug Control indicating how much the overloaded ambient color is used against the default one.
         */
        @serialize()
        public overloadedAmbientIntensity: number = 0.0;
        
        /**
         * Debug Control allowing to overload the albedo color.
         * This as to be use with the overloadedAlbedoIntensity parameter.
         */
        @serializeAsColor3()
        public overloadedAlbedo: BABYLON.Color3 = BABYLON.Color3.White();
        
        /**
         * Debug Control indicating how much the overloaded albedo color is used against the default one.
         */
        @serialize()
        public overloadedAlbedoIntensity: number = 0.0;
        
        /**
         * Debug Control allowing to overload the reflectivity color.
         * This as to be use with the overloadedReflectivityIntensity parameter.
         */
        @serializeAsColor3()
        public overloadedReflectivity: BABYLON.Color3 = new BABYLON.Color3(0.3, 0.3, 0.3);
        
        /**
         * Debug Control indicating how much the overloaded reflectivity color is used against the default one.
         */
        @serialize()
        public overloadedReflectivityIntensity: number = 0.0;
        
        /**
         * Debug Control allowing to overload the emissive color.
         * This as to be use with the overloadedEmissiveIntensity parameter.
         */
        @serializeAsColor3()
        public overloadedEmissive: BABYLON.Color3 = BABYLON.Color3.White();
        
        /**
         * Debug Control indicating how much the overloaded emissive color is used against the default one.
         */
        @serialize()
        public overloadedEmissiveIntensity: number = 0.0;

        private _overloadedIntensity: BABYLON.Vector4 = new BABYLON.Vector4(this.overloadedAmbientIntensity, this.overloadedAlbedoIntensity, this.overloadedReflectivityIntensity, this.overloadedEmissiveIntensity);
        
        /**
         * Debug Control allowing to overload the reflection color.
         * This as to be use with the overloadedReflectionIntensity parameter.
         */
        @serializeAsColor3()
        public overloadedReflection: BABYLON.Color3 = BABYLON.Color3.White();
        
        /**
         * Debug Control indicating how much the overloaded reflection color is used against the default one.
         */
        @serialize()
        public overloadedReflectionIntensity: number = 0.0;

        /**
         * Debug Control allowing to overload the microsurface.
         * This as to be use with the overloadedMicroSurfaceIntensity parameter.
         */
        @serialize()
        public overloadedMicroSurface: number = 0.0;
        
        /**
         * Debug Control indicating how much the overloaded microsurface is used against the default one.
         */
        @serialize()
        public overloadedMicroSurfaceIntensity: number = 0.0;

        private _overloadedMicroSurface: BABYLON.Vector3 = new BABYLON.Vector3(this.overloadedMicroSurface, this.overloadedMicroSurfaceIntensity, this.overloadedReflectionIntensity);

        /**
         * AKA Diffuse Texture in standard nomenclature.
         */
        @serializeAsTexture()
        public albedoTexture: BABYLON.BaseTexture;
        
        /**
         * AKA Occlusion Texture in other nomenclature.
         */
        @serializeAsTexture()
        public ambientTexture: BABYLON.BaseTexture;

        /**
         * AKA Occlusion Texture Intensity in other nomenclature.
         */
        @serialize()
        public ambientTextureStrength: number = 1.0;

        @serializeAsTexture()
        public opacityTexture: BABYLON.BaseTexture;

        @serializeAsTexture()
        public reflectionTexture: BABYLON.BaseTexture;

        @serializeAsTexture()
        public emissiveTexture: BABYLON.BaseTexture;
        
        /**
         * AKA Specular texture in other nomenclature.
         */
        @serializeAsTexture()
        public reflectivityTexture: BABYLON.BaseTexture;

        /**
         * Used to switch from specular/glossiness to metallic/roughness workflow.
         */
        @serializeAsTexture()
        public metallicTexture: BABYLON.BaseTexture;

        /**
         * Specifies the metallic scalar of the metallic/roughness workflow.
         * Can also be used to scale the metalness values of the metallic texture.
         */
        @serialize()
        public metallic: number;

        /**
         * Specifies the roughness scalar of the metallic/roughness workflow.
         * Can also be used to scale the roughness values of the metallic texture.
         */
        @serialize()
        public roughness: number;

        @serializeAsTexture()
        public bumpTexture: BABYLON.BaseTexture;

        @serializeAsTexture()
        public lightmapTexture: BABYLON.BaseTexture;

        @serializeAsTexture()
        public refractionTexture: BABYLON.BaseTexture;

        @serializeAsColor3("ambient")
        public ambientColor = new BABYLON.Color3(0, 0, 0);
        
        /**
         * AKA Diffuse Color in other nomenclature.
         */
        @serializeAsColor3("albedo")
        public albedoColor = new BABYLON.Color3(1, 1, 1);
        
        /**
         * AKA Specular Color in other nomenclature.
         */
        @serializeAsColor3("reflectivity")
        public reflectivityColor = new BABYLON.Color3(1, 1, 1);

        @serializeAsColor3("reflection")
        public reflectionColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        @serializeAsColor3("emissive")
        public emissiveColor = new BABYLON.Color3(0, 0, 0);
        
        /**
         * AKA Glossiness in other nomenclature.
         */
        @serialize()
        public microSurface = 0.9;

        /**
         * source material index of refraction (IOR)' / 'destination material IOR.
         */
        @serialize()
        public indexOfRefraction = 0.66;
        
        /**
         * Controls if refraction needs to be inverted on Y. This could be usefull for procedural texture.
         */
        @serialize()
        public invertRefractionY = false;

        @serializeAsFresnelParameters()
        public opacityFresnelParameters: BABYLON.FresnelParameters;

        @serializeAsFresnelParameters()
        public emissiveFresnelParameters: BABYLON.FresnelParameters;

        /**
         * This parameters will make the material used its opacity to control how much it is refracting aginst not.
         * Materials half opaque for instance using refraction could benefit from this control.
         */
        @serialize()
        public linkRefractionWithTransparency = false;
        
        /**
         * The emissive and albedo are linked to never be more than one (Energy conservation).
         */
        @serialize()
        public linkEmissiveWithAlbedo = false;

        @serialize()
        public useLightmapAsShadowmap = false;
        
        /**
         * In this mode, the emissive informtaion will always be added to the lighting once.
         * A light for instance can be thought as emissive.
         */
        @serialize()
        public useEmissiveAsIllumination = false;
        
        /**
         * Secifies that the alpha is coming form the albedo channel alpha channel.
         */
        @serialize()
        public useAlphaFromAlbedoTexture = false;
        
        /**
         * Specifies that the material will keeps the specular highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
         */
        @serialize()
        public useSpecularOverAlpha = true;
        
        /**
         * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
         */
        @serialize()
        public useMicroSurfaceFromReflectivityMapAlpha = false;

        /**
         * Specifies if the metallic texture contains the roughness information in its alpha channel.
         */
        @serialize()
        public useRoughnessFromMetallicTextureAlpha = true;

        /**
         * Specifies if the metallic texture contains the roughness information in its green channel.
         */
        @serialize()
        public useRoughnessFromMetallicTextureGreen = false;
        
        /**
         * In case the reflectivity map does not contain the microsurface information in its alpha channel,
         * The material will try to infer what glossiness each pixel should be.
         */
        @serialize()
        public useAutoMicroSurfaceFromReflectivityMap = false;
        
        /**
         * Allows to work with scalar in linear mode. This is definitely a matter of preferences and tools used during
         * the creation of the material.
         */
        @serialize()
        public useScalarInLinearSpace = false;
        
        /**
         * BJS is using an harcoded light falloff based on a manually sets up range.
         * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
         * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
         */
        @serialize()
        public usePhysicalLightFalloff = true;
        
        /**
         * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
         */
        @serialize()
        public useRadianceOverAlpha = true;
        
        /**
         * Allows using the bump map in parallax mode.
         */
        @serialize()
        public useParallax = false;

        /**
         * Allows using the bump map in parallax occlusion mode.
         */
        @serialize()
        public useParallaxOcclusion = false;

        /**
         * Controls the scale bias of the parallax mode.
         */
        @serialize()
        public parallaxScaleBias = 0.05;
        
        /**
         * If sets to true, disables all the lights affecting the material.
         */
        @serialize()
        public disableLighting = false;

        /**
         * Number of Simultaneous lights allowed on the material.
         */
        @serialize()
        public maxSimultaneousLights = 4;  

        /**
         * If sets to true, x component of normal map value will invert (x = 1.0 - x).
         */
        @serialize()
        public invertNormalMapX = false;

        /**
         * If sets to true, y component of normal map value will invert (y = 1.0 - y).
         */
        @serialize()
        public invertNormalMapY = false;

        private _renderTargets = new BABYLON.SmartArray<BABYLON.RenderTargetTexture>(16);
        private _worldViewProjectionMatrix = BABYLON.Matrix.Zero();
        private _globalAmbientColor = new BABYLON.Color3(0, 0, 0);
        private _tempColor = new BABYLON.Color3();
        private _renderId: number;

        private _defines = new UniversalShaderMaterialDefines();
        private _cachedDefines = new UniversalShaderMaterialDefines();

        private _useLogarithmicDepth: boolean;


        // Custom shader properties
        private _shaderPath: any;
        private _options: any;
        private _textures: { [name: string]: BABYLON.Texture } = {};
        private _floats: { [name: string]: number } = {};
        private _floatsArrays: { [name: string]: number[] } = {};
        private _colors3: { [name: string]: BABYLON.Color3 } = {};
        private _colors4: { [name: string]: BABYLON.Color4 } = {};
        private _vectors2: { [name: string]: BABYLON.Vector2 } = {};
        private _vectors3: { [name: string]: BABYLON.Vector3 } = {};
        private _vectors4: { [name: string]: BABYLON.Vector4 } = {};
        private _matrices: { [name: string]: BABYLON.Matrix } = {};
        private _matrices3x3: { [name: string]: Float32Array } = {};
        private _matrices2x2: { [name: string]: Float32Array } = {};
        private _vectors3Arrays: { [name: string]: number[] } = {};
        private _cachedWorldViewMatrix = new BABYLON.Matrix();
        private _controller: string = null;
        private _started: boolean = false;
        private _instance: BABYLON.ShaderController = null;

        private _register: () => void = null;
        private _before: () => void = null;
        private _after: () => void = null;
        private _dispose: () => void = null;

        public get options():any {
            return this._options;
        }
        public get controller():string {
            return this._controller;
        }
        public get textures():{ [name: string]: BABYLON.Texture } {
            return this._textures;
        }
        public get floats():{ [name: string]: number } {
            return this._floats;
        }
        public get floatsArrays():{ [name: string]: number[] } {
            return this._floatsArrays;
        }
        public get colors3():{ [name: string]: BABYLON.Color3 } {
            return this._colors3;
        }
        public get colors4():{ [name: string]: BABYLON.Color4 } {
            return this._colors4;
        }
        public get vectors2():{ [name: string]: BABYLON.Vector2 } {
            return this._vectors2;
        }
        public get vectors3():{ [name: string]: BABYLON.Vector3 } {
            return this._vectors3;
        }
        public get vectors4():{ [name: string]: BABYLON.Vector4 } {
            return this._vectors4;
        }
        public get matrices():{ [name: string]: BABYLON.Matrix } {
            return this._matrices;
        }
        public get matrices3x3():{ [name: string]: Float32Array } {
            return this._matrices3x3;
        }
        public get matrices2x2():{ [name: string]: Float32Array } {
            return this._matrices2x2;
        }
        public get vectors3Arrays():{ [name: string]: number[] } {
            return this._vectors3Arrays;
        }
        public get cachedWorldViewMatrix():BABYLON.Matrix {
            return this._cachedWorldViewMatrix;
        }
        public get shaderPath():any {
            return this._shaderPath;
        }
        public get renderId():number {
            return this._renderId;
        }

        // Max shader information
        private _maxTexturesImageUnits:number = 0;
        public get maxTexturesImageUnits(): number {
            return this._maxTexturesImageUnits;
        }

        private _maxVertexUniformVectors:number = 0;
        public get maxVertexUniformVectors(): number {
            return this._maxVertexUniformVectors;
        }

        private _maxFragmentUniformVectors:number = 0;
        public get maxFragmentUniformVectors(): number {
            return this._maxFragmentUniformVectors;
        }

        /**
         * Instantiates a new UniversalShaderMaterial instance.
         * 
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        constructor(name: string, scene: BABYLON.Scene, shaderPath: any, options: any, controller:string = null) {
            super(name, scene);
            this._started = false;
            this._instance = null;
            this._controller = controller;
            this._shaderPath = shaderPath;
            this._cachedDefines.BonesPerMesh = -1;

            // Default engine capabilities
            var caps:BABYLON.EngineCapabilities = scene.getEngine().getCaps();
            this._maxTexturesImageUnits = caps.maxTexturesImageUnits;
            this._maxVertexUniformVectors = caps.maxVertexUniformVectors;
            this._maxFragmentUniformVectors = caps.maxFragmentUniformVectors;

            // Default shader uniforms
            var uniforms = ["world", "view", "projection", "viewProjection", 
                    "vEyePosition", "vLightsType", "vAmbientColor", "vAlbedoColor", "vReflectivityColor", "vEmissiveColor", "vReflectionColor",
                    "vFogInfos", "vFogColor", "pointSize",
                    "vAlbedoScale", "vBumpScale",
                    "vAlbedoInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vEmissiveInfos", "vReflectivityInfos", "vBumpInfos", "vLightmapInfos", "vRefractionInfos",
                    "mBones",
                    "vClipPlane", "albedoMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "reflectivityMatrix", "bumpMatrix", "lightmapMatrix", "refractionMatrix",
                    "depthValues",
                    "opacityParts", "emissiveLeftColor", "emissiveRightColor",
                    "vLightingIntensity", "vOverloadedShadowIntensity", "vOverloadedIntensity", "vOverloadedAlbedo", "vOverloadedReflection", "vOverloadedReflectivity", "vOverloadedEmissive", "vOverloadedMicroSurface",
                    "logarithmicDepthConstant",
                    "vSphericalX", "vSphericalY", "vSphericalZ",
                    "vSphericalXX", "vSphericalYY", "vSphericalZZ",
                    "vSphericalXY", "vSphericalYZ", "vSphericalZX",
                    "vMicrosurfaceTextureLods",
                    "vCameraInfos"
            ];

            // Default shader samplers
            var samplers = ["albedoSampler", "ambientSampler", "opacitySampler", "reflectionCubeSampler", "reflection2DSampler", "emissiveSampler", "reflectivitySampler", "bumpSampler", "lightmapSampler", "refractionCubeSampler", "refraction2DSampler"];

            // Default shader options
            var index = 0;
            options.needAlphaBlending = options.needAlphaBlending || false;
            options.needAlphaTesting = options.needAlphaTesting || false;
            options.attributes = options.attributes || ["position", "normal", "uv"];
            options.uniforms = options.uniforms || ["worldViewProjection"];
            options.samplers = options.samplers || [];
            options.defines = options.defines || [];
            this._options = options;
            if (uniforms.length > 0) {
                for (index = 0; index < uniforms.length; index++) {
                    this._checkUniform(uniforms[index]);
                }
            }
            if (samplers.length > 0) {
                for (index = 0; index < samplers.length; index++) {
                    this._checkSampler(samplers[index]);
                }
            }

            // Render target textures
            this.getRenderTargetTextures = (): BABYLON.SmartArray<BABYLON.RenderTargetTexture> => {
                this._renderTargets.reset();

                if (this.reflectionTexture && this.reflectionTexture.isRenderTarget) {
                    this._renderTargets.push(this.reflectionTexture);
                }

                if (this.refractionTexture && this.refractionTexture.isRenderTarget) {
                    this._renderTargets.push(this.refractionTexture);
                }

                return this._renderTargets;
            }

            // Shader controller component
            if (this._controller && this._controller !== "" && this._controller !== "BABYLON.UniversalShaderMaterial" && this._controller !== "BABYLON.ShaderController" && this._controller !== "BABYLON.ParticleSystem") {
                var ShaderControllerClass = BABYLON.Tools.Instantiate(this._controller);
                if (ShaderControllerClass != null) {
                    this._instance = new ShaderControllerClass(this, scene);
                } else {
                    BABYLON.Tools.Warn("Failed to load shader controller class: " + this.controller);
                }
            }
        
            // Shader material component life cycle
            var me: BABYLON.UniversalShaderMaterial = this;
            me._register = function () { me.registerInstance(me); };
            me._before = function () { me.updateInstance(me); };
            me._after = function () { me.afterInstance(me); };
            me._dispose = function () { me.disposeInstance(me); };
            me._register();
        }

        public getClassName(): string {
            return "UniversalShaderMaterial";
        }

        @serialize()
        public get useLogarithmicDepth(): boolean {
            return this._useLogarithmicDepth;
        }

        public set useLogarithmicDepth(value: boolean) {
            this._useLogarithmicDepth = value && this.getScene().getEngine().getCaps().fragmentDepthSupported;
        }

        public needAlphaBlending(): boolean {
            if (this._options.needAlphaBlending) {
                return true;
            }
            if (this.linkRefractionWithTransparency) {
                return false;
            }
            return (this.alpha < 1.0) || (this.opacityTexture != null) || this._shouldUseAlphaFromAlbedoTexture() || this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled;
        }

        public needAlphaTesting(): boolean {
            if (this._options.needAlphaTesting) {
                return true;
            }
            if (this.linkRefractionWithTransparency) {
                return false;
            }
            return this.albedoTexture != null && this.albedoTexture.hasAlpha;
        }

        private _shouldUseAlphaFromAlbedoTexture(): boolean {
            return this.albedoTexture != null && this.albedoTexture.hasAlpha && this.useAlphaFromAlbedoTexture;
        }

        public getAlphaTestTexture(): BABYLON.BaseTexture {
            return this.albedoTexture;
        }

        private _checkAttribute(attribName): void {
            if (this._options.attributes.indexOf(attribName) === -1) {
                this._options.attributes.push(attribName);
            }
        }

        private _checkUniform(uniformName): void {
            if (this._options.uniforms.indexOf(uniformName) === -1) {
                this._options.uniforms.push(uniformName);
            }
        }

        private _checkSampler(samplerName): void {
            if (this._options.samplers.indexOf(samplerName) === -1) {
                this._options.samplers.push(samplerName);
            }
        }

        public setTexture(name: string, texture: BABYLON.Texture): BABYLON.UniversalShaderMaterial {
            this._checkSampler(name);
            this._textures[name] = texture;
            return this;
        }

        public setFloat(name: string, value: number): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._floats[name] = value;
            return this;
        }

        public setFloats(name: string, value: number[]): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._floatsArrays[name] = value;
            return this;
        }

        public setColor3(name: string, value: BABYLON.Color3): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._colors3[name] = value;
            return this;
        }

        public setColor4(name: string, value: BABYLON.Color4): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._colors4[name] = value;
            return this;
        }

        public setVector2(name: string, value: BABYLON.Vector2): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._vectors2[name] = value;
            return this;
        }

        public setVector3(name: string, value: BABYLON.Vector3): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._vectors3[name] = value;
            return this;
        }

        public setVector4(name: string, value: BABYLON.Vector4): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._vectors4[name] = value;
            return this;
        }

        public setMatrix(name: string, value: BABYLON.Matrix): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._matrices[name] = value;
            return this;
        }

        public setMatrix3x3(name: string, value: Float32Array): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._matrices3x3[name] = value;
            return this;
        }

        public setMatrix2x2(name: string, value: Float32Array): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._matrices2x2[name] = value;
            return this;
        }

        public setArray3(name: string, value: number[]): BABYLON.UniversalShaderMaterial {
            this._checkUniform(name);
            this._vectors3Arrays[name] = value;
            return this;
        }

        private _checkCache(scene: BABYLON.Scene, mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean {
            if (!mesh) {
                return true;
            }

            if (this._defines.INSTANCES !== useInstances) {
                return false;
            }

            if (mesh._materialDefines && mesh._materialDefines.isEqual(this._defines)) {
                return true;
            }

            return false;
        }

        private convertColorToLinearSpaceToRef(color: BABYLON.Color3, ref: BABYLON.Color3): void {
            UniversalShaderMaterial.convertColorToLinearSpaceToRef(color, ref, this.useScalarInLinearSpace);
        }

        private static convertColorToLinearSpaceToRef(color: BABYLON.Color3, ref: BABYLON.Color3, useScalarInLinear: boolean): void {
            if (!useScalarInLinear) {
                color.toLinearSpaceToRef(ref);
            } else {
                ref.r = color.r;
                ref.g = color.g;
                ref.b = color.b;
            }
        }

        private static _scaledAlbedo = new BABYLON.Color3();
        private static _scaledReflectivity = new BABYLON.Color3();
        private static _scaledEmissive = new BABYLON.Color3();
        private static _scaledReflection = new BABYLON.Color3();

        public static BindLights(scene: BABYLON.Scene, mesh: BABYLON.AbstractMesh, effect: BABYLON.Effect, defines: BABYLON.MaterialDefines, useScalarInLinearSpace: boolean, maxSimultaneousLights: number, usePhysicalLightFalloff: boolean) {
            var lightIndex = 0;
            var depthValuesAlreadySet = false;
            for (var index = 0; index < scene.lights.length; index++) {
                var light = scene.lights[index];

                if (!light.isEnabled()) {
                    continue;
                }

                if (!light.canAffectMesh(mesh)) {
                    continue;
                }

                MaterialHelper.BindLightProperties(light, effect, lightIndex);

                // GAMMA CORRECTION.
                this.convertColorToLinearSpaceToRef(light.diffuse, UniversalShaderMaterial._scaledAlbedo, useScalarInLinearSpace);

                UniversalShaderMaterial._scaledAlbedo.scaleToRef(light.intensity, UniversalShaderMaterial._scaledAlbedo);
                effect.setColor4("vLightDiffuse" + lightIndex, UniversalShaderMaterial._scaledAlbedo, usePhysicalLightFalloff ? light.radius : light.range);

                if (defines["SPECULARTERM"]) {
                    this.convertColorToLinearSpaceToRef(light.specular, UniversalShaderMaterial._scaledReflectivity, useScalarInLinearSpace);

                    UniversalShaderMaterial._scaledReflectivity.scaleToRef(light.intensity, UniversalShaderMaterial._scaledReflectivity);
                    effect.setColor3("vLightSpecular" + lightIndex, UniversalShaderMaterial._scaledReflectivity);
                }

                // Shadows
                if (scene.shadowsEnabled) {
                    depthValuesAlreadySet = MaterialHelper.BindLightShadow(light, scene, mesh, lightIndex, effect, depthValuesAlreadySet);
                }

                lightIndex++;

                if (lightIndex === maxSimultaneousLights)
                    break;
            }
        }

        public isReady(mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean {
            if (this.isFrozen) {
                if (this._wasPreviouslyReady) {
                    return true;
                }
            }

            var scene = this.getScene();
            var engine = scene.getEngine();
            var needNormals = false;
            var needUVs = false;

            this._defines.reset();

            // Max shader information
            this._defines.MAX_TEXTURE_IMAGE_UNITS = this._maxTexturesImageUnits;
            this._defines.MAX_VERTEX_UNIFORM_VECTORS = this._maxVertexUniformVectors;
            this._defines.MAX_FRAGMENT_UNIFORM_VECTORS = this._maxFragmentUniformVectors;

            // Custom shader properties
            var index = 0;
            var locals:string[] = [];
            for (index = 0; index < this._options.defines.length; index++) {
                locals.push(this._options.defines[index]);
            }

            // Controller instance defines
            if (this._instance) {
                this._instance.define(locals, mesh, useInstances);
            }

            if (scene.lightsEnabled && !this.disableLighting) {
                needNormals = MaterialHelper.PrepareDefinesForLights(scene, mesh, this._defines, this.maxSimultaneousLights) || needNormals;
            }

            if (!this.checkReadyOnEveryCall) {
                if (this._renderId === scene.getRenderId()) {
                    if (this._checkCache(scene, mesh, useInstances)) {
                        return true;
                    }
                }
            }

            if (scene.texturesEnabled) {
                var name: string;
                var ready:boolean = true;
                for (name in this._textures) {
                    var texture:BABYLON.BaseTexture = this._textures[name];
                    if (texture && texture.isReady()) {
                        needUVs = true;
                        locals.push("#define " + name + "Def");
                        this._checkUniform(name + "Infos");
                        this._checkUniform(name + "Scale");
                        this._checkUniform(name + "Matrix");
                        if (name.indexOf("bumpSampler") >= 0) {
                            this._defines.BUMP = true;
                        }
                    } else {
                        ready = false;
                    }
                }
                if (!ready) return false;
                
                if (scene.getEngine().getCaps().textureLOD) {
                    this._defines.LODBASEDMICROSFURACE = true;
                }

                if (this.albedoTexture && StandardMaterial.DiffuseTextureEnabled) {
                    if (!this.albedoTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.ALBEDO = true;
                        locals.push("#define albedoSamplerDef");
                    }
                }

                if (this.ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                    if (!this.ambientTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.AMBIENT = true;
                    }
                }

                if (this.opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                    if (!this.opacityTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.OPACITY = true;

                        if (this.opacityTexture.getAlphaFromRGB) {
                            this._defines.OPACITYRGB = true;
                        }
                    }
                }

                if (this.reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                    if (!this.reflectionTexture.isReady()) {
                        return false;
                    } else {
                        needNormals = true;
                        this._defines.REFLECTION = true;

                        if (this.reflectionTexture.coordinatesMode === Texture.INVCUBIC_MODE) {
                            this._defines.INVERTCUBICMAP = true;
                        }

                        this._defines.REFLECTIONMAP_3D = this.reflectionTexture.isCube;

                        switch (this.reflectionTexture.coordinatesMode) {
                            case Texture.CUBIC_MODE:
                            case Texture.INVCUBIC_MODE:
                                this._defines.REFLECTIONMAP_CUBIC = true;
                                break;
                            case Texture.EXPLICIT_MODE:
                                this._defines.REFLECTIONMAP_EXPLICIT = true;
                                break;
                            case Texture.PLANAR_MODE:
                                this._defines.REFLECTIONMAP_PLANAR = true;
                                break;
                            case Texture.PROJECTION_MODE:
                                this._defines.REFLECTIONMAP_PROJECTION = true;
                                break;
                            case Texture.SKYBOX_MODE:
                                this._defines.REFLECTIONMAP_SKYBOX = true;
                                break;
                            case Texture.SPHERICAL_MODE:
                                this._defines.REFLECTIONMAP_SPHERICAL = true;
                                break;
                            case Texture.EQUIRECTANGULAR_MODE:
                                this._defines.REFLECTIONMAP_EQUIRECTANGULAR = true;
                                break;
                        }

                        if (this.reflectionTexture instanceof BABYLON.HDRCubeTexture && (<BABYLON.HDRCubeTexture>this.reflectionTexture)) {
                            this._defines.USESPHERICALFROMREFLECTIONMAP = true;
                            needNormals = true;

                            if ((<BABYLON.HDRCubeTexture>this.reflectionTexture).isPMREM) {
                                this._defines.USEPMREMREFLECTION = true;
                            }
                        }
                    }
                }

                if (this.lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                    if (!this.lightmapTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.LIGHTMAP = true;
                        this._defines.USELIGHTMAPASSHADOWMAP = this.useLightmapAsShadowmap;
                    }
                }

                if (this.emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                    if (!this.emissiveTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.EMISSIVE = true;
                    }
                }

                if (StandardMaterial.SpecularTextureEnabled) {
                    if (this.metallicTexture) {
                        if (!this.metallicTexture.isReady()) {
                            return false;
                        } else {
                            needUVs = true;
                            this._defines.METALLICWORKFLOW = true;
                            this._defines.METALLICROUGHNESSMAP = true;
                            this._defines.METALLICROUGHNESSGSTOREINALPHA = this.useRoughnessFromMetallicTextureAlpha;
                            this._defines.METALLICROUGHNESSGSTOREINGREEN = !this.useRoughnessFromMetallicTextureAlpha && this.useRoughnessFromMetallicTextureGreen;
                        }
                    }
                    else if (this.reflectivityTexture) {
                        if (!this.reflectivityTexture.isReady()) {
                            return false;
                        } else {
                            needUVs = true;
                            this._defines.REFLECTIVITY = true;
                            this._defines.MICROSURFACEFROMREFLECTIVITYMAP = this.useMicroSurfaceFromReflectivityMapAlpha;
                            this._defines.MICROSURFACEAUTOMATIC = this.useAutoMicroSurfaceFromReflectivityMap;
                        }
                    }
                }

                if (scene.getEngine().getCaps().standardDerivatives && this.bumpTexture && StandardMaterial.BumpTextureEnabled && !this.disableBumpMap) {
                    if (!this.bumpTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.BUMP = true;
                        locals.push("#define bumpSamplerDef");

                        if (this.useParallax && this.albedoTexture && StandardMaterial.DiffuseTextureEnabled) {
                            this._defines.PARALLAX = true;
                            if (this.useParallaxOcclusion) {
                                this._defines.PARALLAXOCCLUSION = true;
                            }
                        }

                        if (this.invertNormalMapX) {
                            this._defines.INVERTNORMALMAPX = true;
                        }

                        if (this.invertNormalMapY) {
                            this._defines.INVERTNORMALMAPY = true;
                        }

                        if (scene._mirroredCameraPosition) {
                            this._defines.INVERTNORMALMAPX = !this._defines.INVERTNORMALMAPX;
                            this._defines.INVERTNORMALMAPY = !this._defines.INVERTNORMALMAPY;
                        }
                    }
                }

                if (this.refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                    if (!this.refractionTexture.isReady()) {
                        return false;
                    } else {
                        needUVs = true;
                        this._defines.REFRACTION = true;
                        this._defines.REFRACTIONMAP_3D = this.refractionTexture.isCube;

                        if (this.linkRefractionWithTransparency) {
                            this._defines.LINKREFRACTIONTOTRANSPARENCY = true;
                        }
                        if (this.refractionTexture instanceof HDRCubeTexture) {
                            this._defines.REFRACTIONMAPINLINEARSPACE = true;

                            if ((<BABYLON.HDRCubeTexture>this.refractionTexture).isPMREM) {
                                this._defines.USEPMREMREFRACTION = true;
                            }
                        }
                    }
                }
            
                if (this.cameraColorGradingTexture && StandardMaterial.ColorGradingTextureEnabled) {
                    if (!this.cameraColorGradingTexture.isReady()) {
                        return false;
                    } else {
                        this._defines.CAMERACOLORGRADING = true;
                    }
                }
            }

            // Effect
            if (scene.clipPlane) {
                this._defines.CLIPPLANE = true;
            }

            if (engine.getAlphaTesting()) {
                this._defines.ALPHATEST = true;
            }

            if (this._shouldUseAlphaFromAlbedoTexture()) {
                this._defines.ALPHAFROMALBEDO = true;
            }

            if (this.useEmissiveAsIllumination) {
                this._defines.EMISSIVEASILLUMINATION = true;
            }

            if (this.linkEmissiveWithAlbedo) {
                this._defines.LINKEMISSIVEWITHALBEDO = true;
            }

            if (this.useLogarithmicDepth) {
                this._defines.LOGARITHMICDEPTH = true;
            }

            if (this.cameraContrast != 1) {
                this._defines.CAMERACONTRAST = true;
            }

            if (this.cameraExposure != 1) {
                this._defines.CAMERATONEMAP = true;
            }
            
            if (this.cameraColorCurves) {
                this._defines.CAMERACOLORCURVES = true;
            }

            if (this.overloadedShadeIntensity != 1 ||
                this.overloadedShadowIntensity != 1) {
                this._defines.OVERLOADEDSHADOWVALUES = true;
            }

            if (this.overloadedMicroSurfaceIntensity > 0 ||
                this.overloadedEmissiveIntensity > 0 ||
                this.overloadedReflectivityIntensity > 0 ||
                this.overloadedAlbedoIntensity > 0 ||
                this.overloadedAmbientIntensity > 0 ||
                this.overloadedReflectionIntensity > 0) {
                this._defines.OVERLOADEDVALUES = true;
            }

            // Point size
            if (this.pointsCloud || scene.forcePointsCloud) {
                this._defines.POINTSIZE = true;
            }

            // Fog
            if (scene.fogEnabled && mesh && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE && this.fogEnabled) {
                this._defines.FOG = true;
            }

            if (StandardMaterial.FresnelEnabled) {
                // Fresnel
                if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled ||
                    this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {

                    if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
                        this._defines.OPACITYFRESNEL = true;
                    }

                    if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
                        this._defines.EMISSIVEFRESNEL = true;
                    }

                    needNormals = true;
                    this._defines.FRESNEL = true;
                }
            }

            if (this._defines.SPECULARTERM && this.useSpecularOverAlpha) {
                this._defines.SPECULAROVERALPHA = true;
            }

            if (this.usePhysicalLightFalloff) {
                this._defines.USEPHYSICALLIGHTFALLOFF = true;
            }

            if (this.useRadianceOverAlpha) {
                this._defines.RADIANCEOVERALPHA = true;
            }

            if ((this.metallic !== undefined && this.metallic != null) || (this.roughness !== undefined && this.roughness != null)) {
                this._defines.METALLICWORKFLOW = true;
            }

            // Attribs
            if (mesh) {
                if (needNormals && mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
                    this._defines.NORMAL = true;
                }
                if (needUVs) {
                    if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                        this._defines.UV1 = true;
                    }
                    if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
                        this._defines.UV2 = true;
                    }
                }
                if (mesh.useVertexColors && mesh.isVerticesDataPresent(VertexBuffer.ColorKind)) {
                    this._defines.VERTEXCOLOR = true;

                    if (mesh.hasVertexAlpha) {
                        this._defines.VERTEXALPHA = true;
                    }
                }
                if (mesh.useBones && mesh.computeBonesUsingShaders) {
                    this._defines.NUM_BONE_INFLUENCERS = mesh.numBoneInfluencers;
                    this._defines.BonesPerMesh = (mesh.skeleton.bones.length + 1);
                }

                // Instances
                if (useInstances) {
                    this._defines.INSTANCES = true;
                }
            }

            // Get correct effect
            if (!this._defines.isEqual(this._cachedDefines)) {
                this._defines.cloneTo(this._cachedDefines);

                scene.resetCachedMaterial();

                // Fallbacks
                var fallbacks = new BABYLON.EffectFallbacks();
                if (this._defines.REFLECTION) {
                    fallbacks.addFallback(0, "REFLECTION");
                }

                if (this._defines.REFRACTION) {
                    fallbacks.addFallback(0, "REFRACTION");
                }

                if (this._defines.REFLECTIVITY) {
                    fallbacks.addFallback(0, "REFLECTIVITY");
                }

                if (this._defines.BUMP) {
                    fallbacks.addFallback(0, "BUMP");
                }

                if (this._defines.PARALLAX) {
                    fallbacks.addFallback(1, "PARALLAX");
                }

                if (this._defines.PARALLAXOCCLUSION) {
                    fallbacks.addFallback(0, "PARALLAXOCCLUSION");
                }

                if (this._defines.SPECULAROVERALPHA) {
                    fallbacks.addFallback(0, "SPECULAROVERALPHA");
                }

                if (this._defines.FOG) {
                    fallbacks.addFallback(1, "FOG");
                }

                if (this._defines.POINTSIZE) {
                    fallbacks.addFallback(0, "POINTSIZE");
                }

                if (this._defines.LOGARITHMICDEPTH) {
                    fallbacks.addFallback(0, "LOGARITHMICDEPTH");
                }

                MaterialHelper.HandleFallbacksForShadows(this._defines, fallbacks, this.maxSimultaneousLights);

                if (this._defines.SPECULARTERM) {
                    fallbacks.addFallback(0, "SPECULARTERM");
                }

                if (this._defines.OPACITYFRESNEL) {
                    fallbacks.addFallback(1, "OPACITYFRESNEL");
                }

                if (this._defines.EMISSIVEFRESNEL) {
                    fallbacks.addFallback(2, "EMISSIVEFRESNEL");
                }

                if (this._defines.FRESNEL) {
                    fallbacks.addFallback(3, "FRESNEL");
                }

                if (this._defines.NUM_BONE_INFLUENCERS > 0) {
                    fallbacks.addCPUSkinningFallback(0, mesh);
                }

                //Attributes
                this._checkAttribute(VertexBuffer.PositionKind);
                if (this._defines.NORMAL) {
                    this._checkAttribute(VertexBuffer.NormalKind);
                }
                if (this._defines.UV1) {
                    this._checkAttribute(VertexBuffer.UVKind);
                }
                if (this._defines.UV2) {
                    this._checkAttribute(VertexBuffer.UV2Kind);
                }
                if (this._defines.VERTEXCOLOR) {
                    this._checkAttribute(VertexBuffer.ColorKind);
                }
                MaterialHelper.PrepareAttributesForBones(this._options.attributes, mesh, this._defines, fallbacks);
                MaterialHelper.PrepareAttributesForInstances(this._options.attributes, this._defines);
                
                // Prepare uniforms and samplers
                ColorCurves.PrepareUniforms(this._options.uniforms); 
                ColorGradingTexture.PrepareUniformsAndSamplers(this._options.uniforms, this._options.samplers); 
                MaterialHelper.PrepareUniformsAndSamplersList(this._options.uniforms, this._options.samplers, this._defines, this.maxSimultaneousLights); 
                var join = this._defines.toString();
                if (locals.length > 0) {
                    join += locals.join("\n");
                }
                
                // Create universal shader effect
                this._effect = scene.getEngine().createEffect(this._shaderPath, this._options.attributes, this._options.uniforms, this._options.samplers, join, fallbacks, this.onCompiled, this.onError, {maxSimultaneousLights: this.maxSimultaneousLights});
            }
            if (!this._effect.isReady()) {
                return false;
            }

            this._renderId = scene.getRenderId();
            this._wasPreviouslyReady = true;

            if (mesh) {
                if (!mesh._materialDefines) {
                    mesh._materialDefines = new UniversalShaderMaterialDefines();
                }

                this._defines.cloneTo(mesh._materialDefines);
            }

            return true;
        }


        public unbind(): void {
            if (this.reflectionTexture && this.reflectionTexture.isRenderTarget) {
                this._effect.setTexture("reflection2DSampler", null);
            }

            if (this.refractionTexture && this.refractionTexture.isRenderTarget) {
                this._effect.setTexture("refraction2DSampler", null);
            }

            super.unbind();
        }

        public bindOnlyWorldMatrix(world: BABYLON.Matrix): void {
            var scene = this.getScene();
            this._effect.setMatrix("world", world);
            if (this._options.uniforms.indexOf("worldView") !== -1) {
                world.multiplyToRef(scene.getViewMatrix(), this._cachedWorldViewMatrix);
                this._effect.setMatrix("worldView", this._cachedWorldViewMatrix);
            }
            if (this._options.uniforms.indexOf("worldViewProjection") !== -1) {
                this._effect.setMatrix("worldViewProjection", world.multiply(scene.getTransformMatrix()));
            }
        }

        private _myScene: BABYLON.Scene = null;
        private _myShadowGenerator: BABYLON.ShadowGenerator = null;

        public bind(world: BABYLON.Matrix, mesh?: BABYLON.Mesh): void {
            this._myScene = this.getScene();

            // Matrices        
            this.bindOnlyWorldMatrix(world);

            // Bones
            MaterialHelper.BindBonesParameters(mesh, this._effect);

            if (this._myScene.getCachedMaterial() !== (<BABYLON.Material>this)) {
                this._effect.setMatrix("view", this._myScene.getViewMatrix());
                this._effect.setMatrix("projection", this._myScene.getProjectionMatrix());
                this._effect.setMatrix("viewProjection", this._myScene.getTransformMatrix());

                if (StandardMaterial.FresnelEnabled) {
                    if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
                        this._effect.setColor4("opacityParts", new BABYLON.Color3(this.opacityFresnelParameters.leftColor.toLuminance(), this.opacityFresnelParameters.rightColor.toLuminance(), this.opacityFresnelParameters.bias), this.opacityFresnelParameters.power);
                    }

                    if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
                        this._effect.setColor4("emissiveLeftColor", this.emissiveFresnelParameters.leftColor, this.emissiveFresnelParameters.power);
                        this._effect.setColor4("emissiveRightColor", this.emissiveFresnelParameters.rightColor, this.emissiveFresnelParameters.bias);
                    }
                }

                // Textures        
                if (this._myScene.texturesEnabled) {
                    if (this.albedoTexture && StandardMaterial.DiffuseTextureEnabled) {
                        this._effect.setTexture("albedoSampler", this.albedoTexture);

                        this._effect.setFloat2("vAlbedoInfos", this.albedoTexture.coordinatesIndex, this.albedoTexture.level);
                        this._effect.setFloat2("vAlbedoScale", (<BABYLON.Texture>this.albedoTexture).uScale, (<BABYLON.Texture>this.albedoTexture).vScale);
                        this._effect.setMatrix("albedoMatrix", this.albedoTexture.getTextureMatrix());
                    }

                    if (this.ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                        this._effect.setTexture("ambientSampler", this.ambientTexture);

                        this._effect.setFloat3("vAmbientInfos", this.ambientTexture.coordinatesIndex, this.ambientTexture.level, this.ambientTextureStrength);
                        this._effect.setMatrix("ambientMatrix", this.ambientTexture.getTextureMatrix());
                    }

                    if (this.opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                        this._effect.setTexture("opacitySampler", this.opacityTexture);

                        this._effect.setFloat2("vOpacityInfos", this.opacityTexture.coordinatesIndex, this.opacityTexture.level);
                        this._effect.setMatrix("opacityMatrix", this.opacityTexture.getTextureMatrix());
                    }

                    if (this.reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                        this._microsurfaceTextureLods.x = Math.round(Math.log(this.reflectionTexture.getSize().width) * Math.LOG2E);

                        if (this.reflectionTexture.isCube) {
                            this._effect.setTexture("reflectionCubeSampler", this.reflectionTexture);
                        } else {
                            this._effect.setTexture("reflection2DSampler", this.reflectionTexture);
                        }

                        this._effect.setMatrix("reflectionMatrix", this.reflectionTexture.getReflectionTextureMatrix());
                        this._effect.setFloat2("vReflectionInfos", this.reflectionTexture.level, 0);

                        if (this._defines.USESPHERICALFROMREFLECTIONMAP) {
                            this._effect.setFloat3("vSphericalX", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.x.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.x.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.x.z);
                            this._effect.setFloat3("vSphericalY", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.y.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.y.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.y.z);
                            this._effect.setFloat3("vSphericalZ", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.z.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.z.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.z.z);
                            this._effect.setFloat3("vSphericalXX", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xx.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xx.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xx.z);
                            this._effect.setFloat3("vSphericalYY", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yy.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yy.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yy.z);
                            this._effect.setFloat3("vSphericalZZ", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zz.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zz.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zz.z);
                            this._effect.setFloat3("vSphericalXY", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xy.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xy.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.xy.z);
                            this._effect.setFloat3("vSphericalYZ", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yz.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yz.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.yz.z);
                            this._effect.setFloat3("vSphericalZX", (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zx.x,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zx.y,
                                (<BABYLON.HDRCubeTexture>this.reflectionTexture).sphericalPolynomial.zx.z);
                        }
                    }

                    if (this.emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                        this._effect.setTexture("emissiveSampler", this.emissiveTexture);

                        this._effect.setFloat2("vEmissiveInfos", this.emissiveTexture.coordinatesIndex, this.emissiveTexture.level);
                        this._effect.setMatrix("emissiveMatrix", this.emissiveTexture.getTextureMatrix());
                    }

                    if (this.lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                        this._effect.setTexture("lightmapSampler", this.lightmapTexture);

                        this._effect.setFloat2("vLightmapInfos", this.lightmapTexture.coordinatesIndex, this.lightmapTexture.level);
                        this._effect.setMatrix("lightmapMatrix", this.lightmapTexture.getTextureMatrix());
                    }

                    if (StandardMaterial.SpecularTextureEnabled) {
                        if (this.metallicTexture) {
                            this._effect.setTexture("reflectivitySampler", this.metallicTexture);

                            this._effect.setFloat2("vReflectivityInfos", this.metallicTexture.coordinatesIndex, this.metallicTexture.level);
                            this._effect.setMatrix("reflectivityMatrix", this.metallicTexture.getTextureMatrix());
                        }
                        else if (this.reflectivityTexture) {
                            this._effect.setTexture("reflectivitySampler", this.reflectivityTexture);

                            this._effect.setFloat2("vReflectivityInfos", this.reflectivityTexture.coordinatesIndex, this.reflectivityTexture.level);
                            this._effect.setMatrix("reflectivityMatrix", this.reflectivityTexture.getTextureMatrix());
                        }
                    }

                    if (this.bumpTexture && this._myScene.getEngine().getCaps().standardDerivatives && StandardMaterial.BumpTextureEnabled && !this.disableBumpMap) {
                        this._effect.setTexture("bumpSampler", this.bumpTexture);

                        this._effect.setFloat3("vBumpInfos", this.bumpTexture.coordinatesIndex, 1.0 / this.bumpTexture.level, this.parallaxScaleBias);
                        this._effect.setFloat2("vBumpScale", (<BABYLON.Texture>this.bumpTexture).uScale, (<BABYLON.Texture>this.bumpTexture).vScale);
                        this._effect.setMatrix("bumpMatrix", this.bumpTexture.getTextureMatrix());
                    }

                    if (this.refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                        this._microsurfaceTextureLods.y = Math.round(Math.log(this.refractionTexture.getSize().width) * Math.LOG2E);

                        var depth = 1.0;
                        if (this.refractionTexture.isCube) {
                            this._effect.setTexture("refractionCubeSampler", this.refractionTexture);
                        } else {
                            this._effect.setTexture("refraction2DSampler", this.refractionTexture);
                            this._effect.setMatrix("refractionMatrix", this.refractionTexture.getReflectionTextureMatrix());

                            if ((<any>this.refractionTexture).depth) {
                                depth = (<any>this.refractionTexture).depth;
                            }
                        }
                        this._effect.setFloat4("vRefractionInfos", this.refractionTexture.level, this.indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
                    }

                    if ((this.reflectionTexture || this.refractionTexture)) {
                        this._effect.setFloat2("vMicrosurfaceTextureLods", this._microsurfaceTextureLods.x, this._microsurfaceTextureLods.y);
                    }
                    
                    if (this.cameraColorGradingTexture && StandardMaterial.ColorGradingTextureEnabled) {
                        ColorGradingTexture.Bind(this.cameraColorGradingTexture, this._effect);
                    }
                }

                // Clip plane
                MaterialHelper.BindClipPlane(this._effect, this._myScene);

                // Point size
                if (this.pointsCloud) {
                    this._effect.setFloat("pointSize", this.pointSize);
                }

                // Colors
                this._myScene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);

                if (this._defines.METALLICWORKFLOW) {
                    UniversalShaderMaterial._scaledReflectivity.r = this.metallic === undefined ? 1 : this.metallic;
                    UniversalShaderMaterial._scaledReflectivity.g = this.roughness === undefined ? 1 : this.roughness;
                    this._effect.setColor4("vReflectivityColor", UniversalShaderMaterial._scaledReflectivity, 0);
                }
                else {
                    // GAMMA CORRECTION.
                    this.convertColorToLinearSpaceToRef(this.reflectivityColor, UniversalShaderMaterial._scaledReflectivity);
                    this._effect.setColor4("vReflectivityColor", UniversalShaderMaterial._scaledReflectivity, this.microSurface);
                }

                this._effect.setVector3("vEyePosition", this._myScene._mirroredCameraPosition ? this._myScene._mirroredCameraPosition : this._myScene.activeCamera.position);
                this._effect.setColor3("vAmbientColor", this._globalAmbientColor);

                // GAMMA CORRECTION.
                this.convertColorToLinearSpaceToRef(this.emissiveColor, UniversalShaderMaterial._scaledEmissive);
                this._effect.setColor3("vEmissiveColor", UniversalShaderMaterial._scaledEmissive);

                // GAMMA CORRECTION.
                this.convertColorToLinearSpaceToRef(this.reflectionColor, UniversalShaderMaterial._scaledReflection);
                this._effect.setColor3("vReflectionColor", UniversalShaderMaterial._scaledReflection);

                // Custom shader properties
                var name: string;
                if (this._myScene.texturesEnabled) {
                    for (name in this._textures) {
                        var texture:BABYLON.Texture = this._textures[name];
                        if (texture) {
                            this._effect.setTexture(name, texture);
                            this._effect.setFloat2(name + "Infos", texture.coordinatesIndex, texture.level);
                            this._effect.setFloat2(name + "Scale", texture.uScale, texture.vScale);
                            this._effect.setMatrix(name + "Matrix", texture.getTextureMatrix());
                        }
                    }
                }

                // Float    
                for (name in this._floats) {
                    this._effect.setFloat(name, this._floats[name]);
                }

                // Float s   
                for (name in this._floatsArrays) {
                    this._effect.setArray(name, this._floatsArrays[name]);
                }

                // Color3        
                for (name in this._colors3) {
                    this._effect.setColor3(name, this._colors3[name]);
                }

                // Color4      
                for (name in this._colors4) {
                    var color = this._colors4[name];
                    this._effect.setFloat4(name, color.r, color.g, color.b, color.a);
                }

                // Vector2        
                for (name in this._vectors2) {
                    this._effect.setVector2(name, this._vectors2[name]);
                }

                // Vector3        
                for (name in this._vectors3) {
                    this._effect.setVector3(name, this._vectors3[name]);
                }

                // Vector4        
                for (name in this._vectors4) {
                    this._effect.setVector4(name, this._vectors4[name]);
                }

                // Matrix      
                for (name in this._matrices) {
                    this._effect.setMatrix(name, this._matrices[name]);
                }

                // Matrix 3x3
                for (name in this._matrices3x3) {
                    this._effect.setMatrix3x3(name, this._matrices3x3[name]);
                }

                // Matrix 2x2
                for (name in this._matrices2x2) {
                    this._effect.setMatrix2x2(name, this._matrices2x2[name]);
                }
                
                // Vector3Array   
                for (name in this._vectors3Arrays) {
                    this._effect.setArray3(name, this._vectors3Arrays[name]);
                }
            }

            if (this._myScene.getCachedMaterial() !== this || !this.isFrozen) {
                // GAMMA CORRECTION.
                this.convertColorToLinearSpaceToRef(this.albedoColor, UniversalShaderMaterial._scaledAlbedo);
                this._effect.setColor4("vAlbedoColor", UniversalShaderMaterial._scaledAlbedo, this.alpha * mesh.visibility);

                // Lights
                if (this._myScene.lightsEnabled && !this.disableLighting) {
                    UniversalShaderMaterial.BindLights(this._myScene, mesh, this._effect, this._defines, this.useScalarInLinearSpace, this.maxSimultaneousLights, this.usePhysicalLightFalloff);
                }

                // Fog
                MaterialHelper.BindFogParameters(this._myScene, mesh, this._effect);

                this._lightingInfos.x = this.directIntensity;
                this._lightingInfos.y = this.emissiveIntensity;
                this._lightingInfos.z = this.environmentIntensity;
                this._lightingInfos.w = this.specularIntensity;

                this._effect.setVector4("vLightingIntensity", this._lightingInfos);

                this._overloadedShadowInfos.x = this.overloadedShadowIntensity;
                this._overloadedShadowInfos.y = this.overloadedShadeIntensity;
                this._effect.setVector4("vOverloadedShadowIntensity", this._overloadedShadowInfos);

                this._cameraInfos.x = this.cameraExposure;
                this._cameraInfos.y = this.cameraContrast;
                this._effect.setVector4("vCameraInfos", this._cameraInfos);
                
                if (this.cameraColorCurves) {
                    ColorCurves.Bind(this.cameraColorCurves, this._effect);
                }

                this._overloadedIntensity.x = this.overloadedAmbientIntensity;
                this._overloadedIntensity.y = this.overloadedAlbedoIntensity;
                this._overloadedIntensity.z = this.overloadedReflectivityIntensity;
                this._overloadedIntensity.w = this.overloadedEmissiveIntensity;
                this._effect.setVector4("vOverloadedIntensity", this._overloadedIntensity);

                this._effect.setColor3("vOverloadedAmbient", this.overloadedAmbient);
                this.convertColorToLinearSpaceToRef(this.overloadedAlbedo, this._tempColor);
                this._effect.setColor3("vOverloadedAlbedo", this._tempColor);
                this.convertColorToLinearSpaceToRef(this.overloadedReflectivity, this._tempColor);
                this._effect.setColor3("vOverloadedReflectivity", this._tempColor);
                this.convertColorToLinearSpaceToRef(this.overloadedEmissive, this._tempColor);
                this._effect.setColor3("vOverloadedEmissive", this._tempColor);
                this.convertColorToLinearSpaceToRef(this.overloadedReflection, this._tempColor);
                this._effect.setColor3("vOverloadedReflection", this._tempColor);

                this._overloadedMicroSurface.x = this.overloadedMicroSurface;
                this._overloadedMicroSurface.y = this.overloadedMicroSurfaceIntensity;
                this._overloadedMicroSurface.z = this.overloadedReflectionIntensity;
                this._effect.setVector3("vOverloadedMicroSurface", this._overloadedMicroSurface);

                // Log. depth
                MaterialHelper.BindLogDepth(this._defines, this._effect, this._myScene);
            }
            super.bind(world, mesh);

            this._myScene = null;
        }

        public getAnimatables(): BABYLON.IAnimatable[] {
            var results = [];

            if (this.albedoTexture && this.albedoTexture.animations && this.albedoTexture.animations.length > 0) {
                results.push(this.albedoTexture);
            }

            if (this.ambientTexture && this.ambientTexture.animations && this.ambientTexture.animations.length > 0) {
                results.push(this.ambientTexture);
            }

            if (this.opacityTexture && this.opacityTexture.animations && this.opacityTexture.animations.length > 0) {
                results.push(this.opacityTexture);
            }

            if (this.reflectionTexture && this.reflectionTexture.animations && this.reflectionTexture.animations.length > 0) {
                results.push(this.reflectionTexture);
            }

            if (this.emissiveTexture && this.emissiveTexture.animations && this.emissiveTexture.animations.length > 0) {
                results.push(this.emissiveTexture);
            }

            if (this.metallicTexture && this.metallicTexture.animations && this.metallicTexture.animations.length > 0) {
                results.push(this.metallicTexture);
            }
            else if (this.reflectivityTexture && this.reflectivityTexture.animations && this.reflectivityTexture.animations.length > 0) {
                results.push(this.reflectivityTexture);
            }

            if (this.bumpTexture && this.bumpTexture.animations && this.bumpTexture.animations.length > 0) {
                results.push(this.bumpTexture);
            }

            if (this.lightmapTexture && this.lightmapTexture.animations && this.lightmapTexture.animations.length > 0) {
                results.push(this.lightmapTexture);
            }

            if (this.refractionTexture && this.refractionTexture.animations && this.refractionTexture.animations.length > 0) {
                results.push(this.refractionTexture);
            }
            
            if (this.cameraColorGradingTexture && this.cameraColorGradingTexture.animations && this.cameraColorGradingTexture.animations.length > 0) {
                results.push(this.cameraColorGradingTexture);
            }

            // Custom shader properties
            var name: string;
            for (name in this._textures) {
                var texture:BABYLON.Texture = this._textures[name];
                if (texture) {
                    results.push(texture);
                }
            }

            return results;
        }

        public dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void {
            if (forceDisposeTextures) {
                if (this.albedoTexture) {
                    this.albedoTexture.dispose();
                    this.albedoTexture = null;
                }

                if (this.ambientTexture) {
                    this.ambientTexture.dispose();
                    this.ambientTexture = null;
                }

                if (this.opacityTexture) {
                    this.opacityTexture.dispose();
                    this.opacityTexture = null;
                }

                if (this.reflectionTexture) {
                    this.reflectionTexture.dispose();
                    this.reflectionTexture = null;
                }

                if (this.emissiveTexture) {
                    this.emissiveTexture.dispose();
                    this.emissiveTexture = null;
                }

                if (this.metallicTexture) {
                    this.metallicTexture.dispose();
                    this.metallicTexture = null;
                }

                if (this.reflectivityTexture) {
                    this.reflectivityTexture.dispose();
                    this.reflectivityTexture = null;
                }

                if (this.bumpTexture) {
                    this.bumpTexture.dispose();
                    this.bumpTexture = null;
                }

                if (this.lightmapTexture) {
                    this.lightmapTexture.dispose();
                    this.lightmapTexture = null;
                }

                if (this.refractionTexture) {
                    this.refractionTexture.dispose();
                    this.refractionTexture = null;
                }
                
                if (this.cameraColorGradingTexture) {
                    this.cameraColorGradingTexture.dispose();
                    this.cameraColorGradingTexture = null;
                }

                // Custom shader properties
                var name: string;
                for (name in this._textures) {
                    var texture:BABYLON.Texture = this._textures[name];
                    if (texture) {
                        texture.dispose();
                    }
                    this._textures[name] = null;
                }
            }
            this._textures = {};
            if (this._dispose) {
                this._dispose();
            }

            super.dispose(forceDisposeEffect, forceDisposeTextures);
        }

        public clone(name: string): BABYLON.UniversalShaderMaterial {
            return SerializationHelper.Clone(() => new BABYLON.UniversalShaderMaterial(name, this.getScene(), this._shaderPath, this._options, this._controller), this);
        }

        public serialize(): any {
            var serializationObject = SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.UniversalShaderMaterial";
            serializationObject.options = this._options;
            serializationObject.controller = this._controller;
            serializationObject.shaderPath = this._shaderPath;

            // Custom shader properties
            var name: string;
            serializationObject.textures = {};
            for (name in this._textures) {
                var texture:BABYLON.Texture = this._textures[name];
                if (texture) {
                    serializationObject.textures[name] = texture.serialize();
                }
            }

            // Float    
            serializationObject.floats = {};
            for (name in this._floats) {
                serializationObject.floats[name] = this._floats[name];
            }

            // Float s   
            serializationObject.floatArrays = {};
            for (name in this._floatsArrays) {
                serializationObject.floatArrays[name] = this._floatsArrays[name];
            }

            // Color3    
            serializationObject.colors3 = {};
            for (name in this._colors3) {
                serializationObject.colors3[name] = this._colors3[name].asArray();
            }

            // Color4  
            serializationObject.colors4 = {};
            for (name in this._colors4) {
                serializationObject.colors4[name] = this._colors4[name].asArray();
            }

            // Vector2  
            serializationObject.vectors2 = {};
            for (name in this._vectors2) {
                serializationObject.vectors2[name] = this._vectors2[name].asArray();
            }

            // Vector3        
            serializationObject.vectors3 = {};
            for (name in this._vectors3) {
                serializationObject.vectors3[name] = this._vectors3[name].asArray();
            }

            // Vector4        
            serializationObject.vectors4 = {};
            for (name in this._vectors4) {
                serializationObject.vectors4[name] = this._vectors4[name].asArray();
            }

            // Matrix      
            serializationObject.matrices = {};
            for (name in this._matrices) {
                serializationObject.matrices[name] = this._matrices[name].asArray();
            }

            // Matrix 3x3
            serializationObject.matrices3x3 = {};
            for (name in this._matrices3x3) {
                serializationObject.matrices3x3[name] = this._matrices3x3[name];
            }

            // Matrix 2x2
            serializationObject.matrices2x2 = {};
            for (name in this._matrices2x2) {
                serializationObject.matrices2x2[name] = this._matrices2x2[name];
            }

            // Vector3Array
            serializationObject.vectors3Arrays = {};
            for (name in this._vectors3Arrays) {
                serializationObject.vectors3Arrays[name] = this._vectors3Arrays[name];
            }

            return serializationObject;
        }

        // Statics
        public static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.UniversalShaderMaterial {
            var material = SerializationHelper.Parse(() => new BABYLON.UniversalShaderMaterial(source.name, scene, source.shaderPath, source.options, source.controller), source, scene, rootUrl);

            // Custom shader properties
            var name: string;
            for (name in source.textures) {
                var texture:BABYLON.Texture = source.textures[name];
                if (texture) {
                    material.setTexture(name, <BABYLON.Texture>Texture.Parse(texture, scene, rootUrl));
                }
            }

            // Float    
            for (name in source.floats) {
                material.setFloat(name, source.floats[name]);
            }

            // Float s   
            for (name in source.floatsArrays) {
                material.setFloats(name, source.floatsArrays[name]);
            }

            // Color3        
            for (name in source.colors3) {
                material.setColor3(name, BABYLON.Color3.FromArray(source.colors3[name]));
            }

            // Color4      
            for (name in source.colors4) {
                material.setColor4(name, BABYLON.Color4.FromArray(source.colors4[name]));
            }

            // Vector2        
            for (name in source.vectors2) {
                material.setVector2(name, BABYLON.Vector2.FromArray(source.vectors2[name]));
            }

            // Vector3        
            for (name in source.vectors3) {
                material.setVector3(name, BABYLON.Vector3.FromArray(source.vectors3[name]));
            }

            // Vector4        
            for (name in source.vectors4) {
                material.setVector4(name, BABYLON.Vector4.FromArray(source.vectors4[name]));
            }

            // Matrix      
            for (name in source.matrices) {
                material.setMatrix(name, BABYLON.Matrix.FromArray(source.matrices[name]));
            }

            // Matrix 3x3
            for (name in source.matrices3x3) {
                material.setMatrix3x3(name, source.matrices3x3[name]);
            }

            // Matrix 2x2
            for (name in source.matrices2x2) {
                material.setMatrix2x2(name, source.matrices2x2[name]);
            }

            // Vector3Array
            for (name in source.vectors3Arrays) {
                material.setArray3(name, source.vectors3Arrays[name]);
            }

            return material;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////  Component Life - Cycle  ////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private registerInstance(me: BABYLON.UniversalShaderMaterial): void {
            me.getScene().registerBeforeRender(me._before);
            me.getScene().registerAfterRender(me._after);
        }

        private updateInstance(me: BABYLON.UniversalShaderMaterial): void {
            if (!me._started) {
                /* First frame starts component */
                if (me._instance) {
                    me._instance.start();
                }
                me._started = true;
            } else {
                /* All other frames tick component */
                if (me._instance) {
                    me._instance.update();
                }
            }
        }
        
        private afterInstance(me: BABYLON.UniversalShaderMaterial): void {
            if (me._started) {
                if (me._instance) {
                    me._instance.after();
                }
            }
        }
        
        private disposeInstance(me: BABYLON.UniversalShaderMaterial) {
            me.getScene().unregisterBeforeRender(me._before);
            me.getScene().unregisterAfterRender(me._after);
            if (me._instance) {
                me._instance.dispose();
            }
            me._started = false;
            me._register = null;
            me._before = null;
            me._after = null;
            me._dispose = null;
        }
    }
}