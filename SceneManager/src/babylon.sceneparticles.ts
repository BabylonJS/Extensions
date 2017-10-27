module BABYLON {
    /* Universal Particle System Controller */
    export class UniversalParticleSystem extends BABYLON.MeshComponent {
        private _time:number = 0.0;
        private _auto:boolean = false;
        private _shader:string = null;
        private _effect:BABYLON.Effect = null;
        private _shuriken:BABYLON.ShurikenParticleSystem = null;
        public updateTime:boolean = false;
        public maximumTime:number = 0.0;
        public get shuriken():BABYLON.ShurikenParticleSystem {
            return this._shuriken;
        }
        public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            super(owner, scene, tick, propertyBag);
            this._time = 0.0;
            this._auto = false;
            this._effect = null;
            this._shuriken = null;
            this._shader = null;
            this.updateTime = false;
            this.maximumTime = 0.0;
            this.initializeParticleSystem();
        }
        
        /* Universal Particle System Life Cycle */
        
        protected start() :void {
            if (this.updateTime === true) {
                this.setEffectTime(0.0);
            }
            if (this._auto === true && this._shuriken != null) {
                this._shuriken.start();
            }
        }

        protected update() :void {
            if (this.updateTime === true) {
                this.setEffectTime(this._time + this.manager.deltaTime);
            }
        }
        
        protected destroy() :void {
            if (this._effect != null) {
                this._effect.onBind = null;
                this._effect = null;
            }
            if (this._shuriken != null) {
                var any_shuriken:any = this._shuriken;
                if (any_shuriken._customEffect) {
                    any_shuriken._customEffect = null;
                }
                any_shuriken = null;
                this._shuriken.dispose();
                this._shuriken = null;
            }
            if (this._shader != null && this._shader !== "") {
                var effectFragment:string = this._shader + "FragmentShader";
                if (BABYLON.Effect.ShadersStore[effectFragment]) {
                    delete BABYLON.Effect.ShadersStore[effectFragment];
                }
            }
        }
        
        /* Universal Particle System Custom Properties */

        private _uniforms:string[] = [];
        private _samplers:string[] = [];
        private _textures: { [name: string]: BABYLON.Texture } = {};
        private _textureArrays: { [name: string]: BABYLON.Texture[] } = {};
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

        public get textures():{ [name: string]: BABYLON.Texture } {
            return this._textures;
        }
        public get textureArray():{ [name: string]: BABYLON.Texture[] } {
            return this._textureArrays;
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

        /* Shader Material Property Accessor Functions */

        public setTexture(name: string, texture: BABYLON.Texture): BABYLON.UniversalParticleSystem {
            this._textures[name] = texture;
            return this;
        }

        public setTextureArray(name: string, textures: BABYLON.Texture[]): BABYLON.UniversalParticleSystem {
            if (this._samplers.indexOf(name) === -1) {
                this._samplers.push(name);
            }
            this._textureArrays[name] = textures;
            return this;
        }

        public setFloat(name: string, value: number): BABYLON.UniversalParticleSystem {
            this._floats[name] = value;
            return this;
        }

        public setFloats(name: string, value: number[]): BABYLON.UniversalParticleSystem {
            this._floatsArrays[name] = value;
            return this;
        }

        public setColor3(name: string, value: BABYLON.Color3): BABYLON.UniversalParticleSystem {
            this._colors3[name] = value;
            return this;
        }

        public setColor4(name: string, value: BABYLON.Color4): BABYLON.UniversalParticleSystem {
            this._colors4[name] = value;
            return this;
        }

        public setVector2(name: string, value: BABYLON.Vector2): BABYLON.UniversalParticleSystem {
            this._vectors2[name] = value;
            return this;
        }

        public setVector3(name: string, value: BABYLON.Vector3): BABYLON.UniversalParticleSystem {
            this._vectors3[name] = value;
            return this;
        }

        public setVector4(name: string, value: BABYLON.Vector4): BABYLON.UniversalParticleSystem {
            this._vectors4[name] = value;
            return this;
        }

        public setMatrix(name: string, value: BABYLON.Matrix): BABYLON.UniversalParticleSystem {
            this._matrices[name] = value;
            return this;
        }

        public setMatrix3x3(name: string, value: Float32Array): BABYLON.UniversalParticleSystem {
            this._matrices3x3[name] = value;
            return this;
        }

        public setMatrix2x2(name: string, value: Float32Array): BABYLON.UniversalParticleSystem {
            this._matrices2x2[name] = value;
            return this;
        }

        public setArray3(name: string, value: number[]): BABYLON.UniversalParticleSystem {
            this._vectors3Arrays[name] = value;
            return this;
        }

        /* Bind Universal Particle System Effect Time Properties */

        private getEffectTime():number {
            return this._time;
        }

        private setEffectTime(time:number):void {
            this._time = time;
            if (this.maximumTime > 0.0 && this._time >= this.maximumTime) {
                this._time = 0.0;
            }
            this.setFloat("time", this._time);
        }
        
        /* Bind Universal Particle System Effect Binding Properties */

        private bindParticleSystemEffect(me:BABYLON.UniversalParticleSystem, effect:BABYLON.Effect):void {
            // Custom shader properties
            var name: string;
            if (me.scene.texturesEnabled) {
                for (name in me._textures) {
                    var texture:BABYLON.Texture = me._textures[name];
                    if (texture) {
                        effect.setTexture(name, texture);
                        effect.setFloat2(name + "Infos", texture.coordinatesIndex, texture.level);
                        effect.setFloat2(name + "Scale", texture.uScale, texture.vScale);
                        effect.setMatrix(name + "Matrix", texture.getTextureMatrix());
                    }
                }
            }
            // Arrays
            if (me.scene.texturesEnabled) {
                for (name in me._textureArrays) {
                    effect.setTextureArray(name, me._textureArrays[name]);
                }
            }
            // Float    
            for (name in me._floats) {
                effect.setFloat(name, me._floats[name]);
            }
            // Float s   
            for (name in me._floatsArrays) {
                effect.setArray(name, me._floatsArrays[name]);
            }
            // Color3        
            for (name in me._colors3) {
                effect.setColor3(name, me._colors3[name]);
            }
            // Color4      
            for (name in me._colors4) {
                var color = me._colors4[name];
                effect.setFloat4(name, color.r, color.g, color.b, color.a);
            }
            // Vector2        
            for (name in me._vectors2) {
                effect.setVector2(name, me._vectors2[name]);
            }
            // Vector3        
            for (name in me._vectors3) {
                effect.setVector3(name, me._vectors3[name]);
            }
            // Vector4        
            for (name in me._vectors4) {
                effect.setVector4(name, me._vectors4[name]);
            }
            // Matrix      
            for (name in me._matrices) {
                effect.setMatrix(name, me._matrices[name]);
            }
            // Matrix 3x3
            for (name in me._matrices3x3) {
                effect.setMatrix3x3(name, me._matrices3x3[name]);
            }
            // Matrix 2x2
            for (name in me._matrices2x2) {
                effect.setMatrix2x2(name, me._matrices2x2[name]);
            }
            // Vector3Array   
            for (name in me._vectors3Arrays) {
                effect.setArray3(name, me._vectors3Arrays[name]);
            }
        }
        
        /* Initialize Universial Particle System Properties */

        private initializeParticleSystem():void  {
            this._auto = this.getProperty("autoStart", false);
            // Setup particle system properties
            var pcap:number = this.getProperty("capacity", 100);
            var pname:string = this.getProperty("particleName", null);
            var speed:number = this.getProperty("startSpeed", 0.01);
            var emission:number = this.getProperty("emitType", 0.0);
            var duration:number = this.getProperty("duration", 10.0);
            if (pname == null || pname === "") pname = "PX_Unknown_" + BABYLON.Tools.RandomId(); 
            var bursts:BABYLON.IShurikenBusrt[] = this.getProperty<BABYLON.IShurikenBusrt[]>("emitBurst", null);
            var modules:BABYLON.ShurikenUpdateModules = this.getProperty<BABYLON.ShurikenUpdateModules>("ShurikenUpdateModules", null);

            // Setup particle system update modules
            if (modules != null) {
                 this.updateTime = modules.updateEffectTime;
                 this.maximumTime = modules.maximumEffectTime;
            }
            
            // Setup particle system shader effect
            var shader:string = this.getProperty("customShaderEffect", null);
            if (shader != null && shader !== "") {
                var me:any = this;
                var defines:string[] = this.getProperty("customShaderDefines", null);
                var uniforms:string[] = this.getProperty("customShaderUniforms", null);
                var samplers:string[] = this.getProperty("customShaderSamplers", null);
                var joiners: string = (defines != null && defines.length > 0) ? defines.join("\n") : null;
                ///////////////////////////////////////////////////////////////////////////////////////////////
                // Multiple Particle System Effect Instances Workaround 
                ///////////////////////////////////////////////////////////////////////////////////////////////
                // Create shader fragment instances for each particle system
                // Formart unique random based per particle system instance
                ///////////////////////////////////////////////////////////////////////////////////////////////
                this._shader = "PX_" + this.mesh.name + "_" + pname.replace("PX_", "") + "_" + BABYLON.Tools.RandomId().replace(".", "") + "_Effect";
                var sourceFragment:string = shader + "FragmentShader";
                var effectFragment:string = this._shader + "FragmentShader";
                BABYLON.Effect.ShadersStore[effectFragment] = BABYLON.Effect.ShadersStore[sourceFragment];
                this._effect = this.engine.createEffectForParticles(this._shader, uniforms, samplers, joiners);
                this._effect.onBind = (eff:BABYLON.Effect)=>{ me.bindParticleSystemEffect(me, eff); };
            }
            
            // Create shuriken particle system properties
            this._shuriken = new BABYLON.ShurikenParticleSystem(pname, pcap, this.scene, duration, emission, speed, bursts, modules, this._effect);
            this._shuriken.emitter = this.mesh;
            this._shuriken.blendMode = this.getProperty("blendMode", 0.0);
            this._shuriken.emitRate = this.getProperty("emitRate", 100.0);
            this._shuriken.loopPlay = this.getProperty("loopPlay", false);
            this._shuriken.delayTime = this.getProperty("delayTime", 0.0);
            
            // Parse particle system classes
            var mm_lifetime:any = this.getProperty("lifeTime");
            var mm_lifetime_vector:BABYLON.Vector2 = BABYLON.Utilities.ParseVector2(mm_lifetime, new BABYLON.Vector2(1.0, 1.0));
            this._shuriken.minLifeTime = mm_lifetime_vector.x;
            this._shuriken.maxLifeTime = mm_lifetime_vector.y;
            var mm_power:any = this.getProperty("emitPower");
            var mm_power_vector:BABYLON.Vector2 = BABYLON.Utilities.ParseVector2(mm_power, new BABYLON.Vector2(1.0, 1.0));
            this._shuriken.minEmitPower = mm_power_vector.x;
            this._shuriken.maxEmitPower = mm_power_vector.y;
            var mm_rotate:any = this.getProperty("angularSpeed");
            var mm_rotate_vector:BABYLON.Vector2 = BABYLON.Utilities.ParseVector2(mm_rotate, new BABYLON.Vector2(0.0, 0.0));
            this._shuriken.minAngularSpeed = mm_rotate_vector.x;
            this._shuriken.maxAngularSpeed = mm_rotate_vector.y;
            var mm_size:any = this.getProperty("particleSize");
            var mm_size_vector:BABYLON.Vector2 = BABYLON.Utilities.ParseVector2(mm_size, new BABYLON.Vector2(1.0, 1.0));
            this._shuriken.minSize = mm_size_vector.x;
            this._shuriken.maxSize = mm_size_vector.y;
            var color1:any = this.getProperty("color1");
            this._shuriken.color1 = BABYLON.Utilities.ParseColor4(color1, new BABYLON.Color4(1.0, 1.0 ,1.0, 1.0));
            var color2:any = this.getProperty("color2");
            this._shuriken.color2 = BABYLON.Utilities.ParseColor4(color2, new BABYLON.Color4(1.0, 1.0, 1.0, 1.0));
            var colorDead:any = this.getProperty("colorDead");
            this._shuriken.colorDead = BABYLON.Utilities.ParseColor4(colorDead, new BABYLON.Color4(0.0, 0.0, 0.0, 1.0));
            var textureMask:any = this.getProperty("textureMask");
            this._shuriken.textureMask = BABYLON.Utilities.ParseColor4(textureMask, new BABYLON.Color4(1.0, 1.0, 1.0, 1.0));
            var direction1:any = this.getProperty("direction1");
            this._shuriken.direction1 = BABYLON.Utilities.ParseVector3(direction1, new BABYLON.Vector3(0.0, 1.0, 0.0));
            var direction2:any = this.getProperty("direction2");
            this._shuriken.direction2 = BABYLON.Utilities.ParseVector3(direction2, new BABYLON.Vector3(0.0, 1.0, 0.0));
            var minEmitBox:any = this.getProperty("minEmitBox");
            this._shuriken.minEmitBox = BABYLON.Utilities.ParseVector3(minEmitBox, new BABYLON.Vector3(0.0, 0.0, 0.0));
            var maxEmitBox:any = this.getProperty("maxEmitBox");
            this._shuriken.maxEmitBox = BABYLON.Utilities.ParseVector3(maxEmitBox, new BABYLON.Vector3(0.0, 0.0, 0.0));
            
            // Parse particle system gravity
            var gravity:any = this.getProperty("gravityVector");
            var gravityMode:number = this.getProperty("gravityMode", 0);
            var gravityMultiplier:number = this.getProperty("gravityMultiplier", 1.0);
            if (gravityMode === 1) this._shuriken.gravity = this.scene.gravity.multiplyByFloats(gravityMultiplier, gravityMultiplier, gravityMultiplier);
            else this._shuriken.gravity = BABYLON.Utilities.ParseVector3(gravity, new BABYLON.Vector3(0.0, 0.0, 0.0));
            
            // Parse particle system textures
            var texture:any = this.getProperty("textureImage", null);
            if (texture != null && texture.name && texture.name !== "") {
                var tname:string = texture.name;
                var root:string = this.manager.getScenePath();
                this._shuriken.particleTexture = new BABYLON.Texture(root + tname, this.scene);
            }
        }
    }
}