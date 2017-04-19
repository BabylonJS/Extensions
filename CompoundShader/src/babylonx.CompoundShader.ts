

///<reference path="../lib/babylon.d.ts" />
///<reference path="../lib/babylon.marbleProceduralTexture.d.ts" />
module BABYLONX {
    
    export class CompoundShader {
        private _scene;
        private _shader;
        private _params;
        private _texGen;
        private _texMix;
        constructor(scene,texGen,texMix,{stepx=0.005,stepy=0.005,invR=false,invG=false,balance=0.9,invH=false,filter=true,level=7,strength=0.5,time=1} = {}) {
            this._scene = scene;
            this._texGen = texGen;
            this._texMix = texMix;
            var pars = {
                stepx: stepx, stepy: stepy, iR: invR ? 1 : -1, iG: invG ? -1 : 1, balance: balance, iH: invH ? -1 : 1, fSobel: filter ? 1 : 0, strength: strength, level: level, time: time
            };
            this._params = pars;
            this.init();
            
        }
        init() {
            var opacity1 = 1.0;
            var opacity2 = 1.0;
            var shader = new BABYLONX.ShaderBuilder()
                .SetUniform('dyTxt', 'sampler2D')
                .SetUniform('mxTxt', 'sampler2D')
                .SetUniform('stepx', 'float')
                .SetUniform('stepy', 'float')
                .SetUniform('invR', 'float')
                .SetUniform('invG', 'float')
                .SetUniform('balance', 'float')
                .SetUniform('invH', 'float')
                .SetUniform('fSobel', 'float')
                .SetUniform('level', 'float')
                .SetUniform('strength', 'float')
                .Multi([{
                    result: BABYLONX.Helper().Map({ index: 'mxTxt' })
                        .InLine`result=vec4((1.0-balance) *result.xyz, 1.0);`
                        .Build(), opacity: opacity1
                },
                    {
                        result: BABYLONX.Helper()
                            .Map({ index: 'dyTxt' })
                            //.Map({ path: path, alpha: true }, 1.)
                            //.Transparency()
                            .InLine(`
                        float    invertR=invR;
                        float    invertG=invG;

                        float    invertH=invH;
                        //float pulse=*sin(time) *sin(time);
                        //float level=7.;
                        //float strength=1.5;
                        //float dz= filterdz;//500.;
                        float dz=1.0/strength*(1.+pow(2.0, level));



                        //int type=1.-fSobel;
                        float type=fSobel;




                        vec2 step=vec2(stepx,stepy);//  vec2(0.01, 0.01);
                        vec2 vUv=vec2(vuv);
                        vec2 tlv = vec2(vUv.x - step.x, vUv.y + step.y );
                        vec2 lv  = vec2(vUv.x - step.x, vUv.y 		   );
                        vec2 blv = vec2(vUv.x - step.x, vUv.y - step.y);
                        vec2 tv  = vec2(vUv.x 		  , vUv.y + step.y );
                        vec2 bv  = vec2(vUv.x 		  , vUv.y - step.y);
                        vec2 trv = vec2(vUv.x + step.x, vUv.y + step.y );
                        vec2 rv  = vec2(vUv.x + step.x, vUv.y 		   );
                        vec2 brv = vec2(vUv.x +step.x, vUv.y -step.y);


                        tlv = vec2(tlv.x >= 0.0 ? tlv.x : (1.0 + tlv.x), 	tlv.y >= 0.0	? tlv.y : (1.0  + tlv.y));
                        tlv = vec2(tlv.x < 1.0  ? tlv.x : (tlv.x - 1.0 ), 	tlv.y < 1.0   	? tlv.y : (tlv.y - 1.0 ));
                        lv  = vec2( lv.x >= 0.0 ?  lv.x : (1.0 + lv.x),  	lv.y  >= 0.0 	?  lv.y : (1.0  +  lv.y));
                        lv  = vec2( lv.x < 1.0  ?  lv.x : ( lv.x - 1.0 ),   lv.y  < 1.0  	?  lv.y : ( lv.y - 1.0 ));
                        blv = vec2(blv.x >= 0.0 ? blv.x : (1.0 + blv.x), 	blv.y >= 0.0 	? blv.y : (1.0  + blv.y));
                        blv = vec2(blv.x < 1.0  ? blv.x : (blv.x - 1.0 ), 	blv.y < 1.0 	? blv.y : (blv.y - 1.0 ));
                        tv  = vec2( tv.x >= 0.0 ?  tv.x : (1.0 + tv.x),  	tv.y  >= 0.0 	?  tv.y : (1.0  +  tv.y));
                        tv  = vec2( tv.x < 1.0  ?  tv.x : ( tv.x - 1.0 ),   tv.y  < 1.0 	?  tv.y : ( tv.y - 1.0 ));
                        bv  = vec2( bv.x >= 0.0 ?  bv.x : (1.0 + bv.x),  	bv.y  >= 0.0 	?  bv.y : (1.0  +  bv.y));
                        bv  = vec2( bv.x < 1.0  ?  bv.x : ( bv.x - 1.0 ),   bv.y  < 1.0 	?  bv.y : ( bv.y - 1.0 ));
                        trv = vec2(trv.x >= 0.0 ? trv.x : (1.0 + trv.x), 	trv.y >= 0.0 	? trv.y : (1.0  + trv.y));
                        trv = vec2(trv.x < 1.0  ? trv.x : (trv.x - 1.0 ), 	trv.y < 1.0   	? trv.y : (trv.y - 1.0 ));
                        rv  = vec2( rv.x >= 0.0 ?  rv.x : (1.0 + rv.x),  	rv.y  >= 0.0 	?  rv.y : (1.0  +  rv.y));
                        rv  = vec2( rv.x < 1.0  ?  rv.x : ( rv.x - 1.0 ),   rv.y  < 1.0   	?  rv.y : ( rv.y - 1.0 ));
                        brv = vec2(brv.x >= 0.0 ? brv.x : (1.0 + brv.x), 	brv.y >= 0.0 	? brv.y : (1.0  + brv.y));
                        brv = vec2(brv.x < 1.0  ? brv.x : (brv.x - 1.0 ), 	brv.y < 1.0   	? brv.y : (brv.y - 1.0 ));


                        float tl = abs(texture2D(dyTxt, tlv).r);
                        float l  = abs(texture2D(dyTxt, lv).r);
                        float bl = abs(texture2D(dyTxt, blv).r);
                        float t  = abs(texture2D(dyTxt, tv).r);
                        float b  = abs(texture2D(dyTxt, bv).r);
                        float tr = abs(texture2D(dyTxt, trv).r);
                        float r  = abs(texture2D(dyTxt, rv).r);
                        float br = abs(texture2D(dyTxt, brv).r);
                        float dx = 0.0, dy = 0.0;
                        //if(type == 0){	// Sobel
                        if(type > 0.5) {	// Sobel
	                        dx = tl +l*2.0 +bl -tr -r*2.0 -br;
	                        dy = tl + t*2.0 + tr - bl - b*2.0 - br;
                        }
                        else{				// Scharr
	                        dx = tl*3.0 + l*10.0 + bl*3.0 - tr*3.0 - r*10.0 - br*3.0;
	                        dy = tl*3.0 + t*10.0 + tr*3.0 - bl*3.0 - b*10.0 - br*3.0;
                        }
                        vec4 normal = vec4(normalize(vec3(dx * invertR * invertH * 255.0, dy * invertG * invertH * 255.0, dz)), texture2D(dyTxt, vUv).a);
                                vec4 res=vec4(normal.xyz * 0.5 +0.5, 1.0);
                                vec3 nrm1 = vec3(normalize(nrm-(normalize(res.xyz) *2.0-1.) *0.5));
                        //result = vec4(normal.xy * 0.5 +0.5, normal.zw);
                        //*
                        vec4 specular = vec4(normal.xy * 0.5 +0.5, normal.zw);


                        vec4 textureColor =texture2D(dyTxt, vuv);
                        textureColor.a = 1.;


                        result= clamp(2.*textureColor*specular*balance, 0.0, 1.);
                        //result= vec4(vec3(vuv.x,vuv.y,0.),1.);
                        //result.w=0.7;
                        //*/
                            `)
                            .Light({ phonge: .025195, specular: 15.5, normal: 'nrm1', direction: 'camera' })
                            //.Light({ darkColorMode:true,specularPower: .01, phonge: 1., color: { r: 0.8, g: 0.8, b: 0.8, a: 1. }, specular: 1.0, normal: BABYLONX.Normals.Flat, direction: 'camera' })
                            .Build(), opacity: opacity2
                    }], false).BuildMaterial(this._scene);
            shader.setTexture('dyTxt', this._texGen);
            shader.setTexture('mxTxt', this._texMix);
            shader.setFloat('stepx', this._params.stepx);
            shader.setFloat('stepy', this._params.stepy);
            shader.setFloat('invR', this._params.iR);
            shader.setFloat('invG', this._params.iG);
            shader.setFloat('balance', this._params.balance);
            shader.setFloat('invH', this._params.iH);
            shader.setFloat('fSobel', this._params.fSobel);
            shader.setFloat('level', this._params.level);
            shader.setFloat('strength', this._params.strength);
            shader.setFloat('time', this._params.time);
            this._shader = shader;
            var me = this;
            Object.defineProperty(this._shader, 'shader', {
                get: function ()  {
                    return me;
                }
            });
            return this;
            
        }
        updateParams(params) {
           
            if (params.stepx != null) this._params.stepx = params.stepx;
            if (params.stepy != null) this._params.stepy = params.stepy;
            if (params.balance != null) this._params.balance = params.balance;
            if (params.strength != null) this._params.strength = params.strength;
            if (params.level != null) this._params.level = params.level;
            if (params.time != null) this._params.time = params.time;
            if (params.invR != null) this._params.iR = params.invR ? 1 : -1;
            if (params.invG != null) this._params.iG = params.invG ? 1 : -1;
            if (params.invH != null) this._params.iH = params.invH ? 1 : -1;
            if (params.filter != null) this._params.fSobel = params.filter ? 1 : 0;


            //this._shader.setTexture('dyTxt', params.texGen);
            //this._shader.setTexture('mxTxt', params.texMix);
            this._shader.setFloat('stepx', this._params.stepx);
            this._shader.setFloat('stepy', this._params.stepy);
            this._shader.setFloat('invR', this._params.iR);
            this._shader.setFloat('invG', this._params.iG);
            this._shader.setFloat('balance', this._params.balance);
            this._shader.setFloat('invH', this._params.iH);
            this._shader.setFloat('fSobel', this._params.fSobel);
            this._shader.setFloat('level', this._params.level);
            this._shader.setFloat('strength', this._params.strength);
            this._shader.setFloat('time', this._params.time);
            return this;
        }
        updateGenTex(texGen) {
            this._texGen = texGen;
            this._shader.setTexture('dyTxt', this._texGen);
            return this;
        }
        updateMixTex(texMix) {
            this._texMix = texMix;
            this._shader.setTexture('mxTxt', this._texMix);
            return this;
        }
        get material() {
            return this._shader;
        }
        get scene() {
            return this.scene;
        }
    }
} 