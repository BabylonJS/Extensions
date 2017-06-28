var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __extends = (this && this.__extends) || function (d, b) {
for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
function __() { this.constructor = d; }
__.prototype = b.prototype;
d.prototype = new __();
};
var BABYLONX;
(function (BABYLONX) {
    var ShaderMaterialHelperStatics = (function () {
        function ShaderMaterialHelperStatics() {
        }
        return ShaderMaterialHelperStatics;
    }());
    ShaderMaterialHelperStatics.Dark = false;
    ShaderMaterialHelperStatics.Light = true;
    ShaderMaterialHelperStatics.PrecisionHighMode = 'highp';
    ShaderMaterialHelperStatics.PrecisionMediumMode = 'mediump';
    ShaderMaterialHelperStatics.face_back = "!gl_FrontFacing";
    ShaderMaterialHelperStatics.face_front = "gl_FrontFacing";
    ShaderMaterialHelperStatics.AttrPosition = 'position';
    ShaderMaterialHelperStatics.AttrNormal = 'normal';
    ShaderMaterialHelperStatics.AttrUv = 'uv';
    ShaderMaterialHelperStatics.AttrUv2 = 'uv2';
    ShaderMaterialHelperStatics.AttrTypeForPosition = 'vec3';
    ShaderMaterialHelperStatics.AttrTypeForNormal = 'vec3';
    ShaderMaterialHelperStatics.AttrTypeForUv = 'vec2';
    ShaderMaterialHelperStatics.AttrTypeForUv2 = 'vec2';
    ShaderMaterialHelperStatics.uniformView = "view";
    ShaderMaterialHelperStatics.uniformWorld = "world";
    ShaderMaterialHelperStatics.uniformWorldView = "worldView";
    ShaderMaterialHelperStatics.uniformViewProjection = "viewProjection";
    ShaderMaterialHelperStatics.uniformWorldViewProjection = "worldViewProjection";
    ShaderMaterialHelperStatics.uniformStandardType = "mat4";
    ShaderMaterialHelperStatics.uniformFlags = "flags";
    ShaderMaterialHelperStatics.Mouse = "mouse";
    ShaderMaterialHelperStatics.Screen = "screen";
    ShaderMaterialHelperStatics.Camera = "camera";
    ShaderMaterialHelperStatics.Look = "look";
    ShaderMaterialHelperStatics.Time = "time";
    ShaderMaterialHelperStatics.GlobalTime = "gtime";
    ShaderMaterialHelperStatics.Position = "pos";
    ShaderMaterialHelperStatics.WorldPosition = "wpos";
    ShaderMaterialHelperStatics.Normal = "nrm";
    ShaderMaterialHelperStatics.WorldNormal = "wnrm";
    ShaderMaterialHelperStatics.Uv = "vuv";
    ShaderMaterialHelperStatics.Uv2 = "vuv2";
    ShaderMaterialHelperStatics.Center = 'center';
    ShaderMaterialHelperStatics.ReflectMatrix = "refMat";
    ShaderMaterialHelperStatics.Texture2D = "txtRef_";
    ShaderMaterialHelperStatics.TextureCube = "cubeRef_";
    BABYLONX.ShaderMaterialHelperStatics = ShaderMaterialHelperStatics;
    var Normals = (function () {
        function Normals() {
        }
        return Normals;
    }());
    Normals.Default = ShaderMaterialHelperStatics.Normal;
    Normals.Inverse = '-1.*' + ShaderMaterialHelperStatics.Normal;
    Normals.Pointed = 'normalize(' + ShaderMaterialHelperStatics.Position + '-' + ShaderMaterialHelperStatics.Center + ')';
    Normals.Flat = 'normalize(cross(dFdx(' + ShaderMaterialHelperStatics.Position + ' * -1.), dFdy(' + ShaderMaterialHelperStatics.Position + ')))';
    Normals.Map = 'normalMap()';
    BABYLONX.Normals = Normals;
    var Speculars = (function () {
        function Speculars() {
        }
        return Speculars;
    }());
    Speculars.Map = 'specularMap()';
    BABYLONX.Speculars = Speculars;
    var ShaderMaterialHelper = (function () {
        function ShaderMaterialHelper() {
        }
        ShaderMaterialHelper.prototype.ShaderMaterial = function (name, scene, shader, helpers) {
            return this.MakeShaderMaterialForEngine(name, scene, shader, helpers);
        };
        ShaderMaterialHelper.prototype.MakeShaderMaterialForEngine = function (name, scene, shader, helpers) { return {}; };
        ShaderMaterialHelper.prototype.DefineTexture = function (txt, scene) {
            return null;
        };
        ShaderMaterialHelper.prototype.DefineCubeTexture = function (txt, scene) {
            return null;
        };
        ShaderMaterialHelper.prototype.SetUniforms = function (meshes, cameraPos, cameraTarget, mouse, screen, time) {
        };
        ShaderMaterialHelper.prototype.PostProcessTextures = function (pps, name, txt) { };
        ShaderMaterialHelper.prototype.DefineRenderTarget = function (name, scale, scene) {
            return {};
        };
        ShaderMaterialHelper.prototype.ShaderPostProcess = function (name, samplers, camera, scale, shader, helpers, option) {
            return {};
        };
        return ShaderMaterialHelper;
    }());
    BABYLONX.ShaderMaterialHelper = ShaderMaterialHelper;
    var Shader = (function () {
        function Shader() {
        }
        Shader.Replace = function (s, t, d) {
            var ignore = null;
            return s.replace(new RegExp(t.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (d) == "string") ? d.replace(/\$/g, "$$$$") : d);
        };
        Shader.Def = function (a, d) {
            if (a != undefined && a != null)
                return (d != undefined && d != null ? a : true);
            else if (d != Shader._null)
                return (d != undefined && d != null ? d : false);
            return null;
        };
        Shader.Join = function (s) {
            return s.join("\n\
                       ");
        };
        Shader.Print = function (n) {
            if (n == undefined)
                return "0.";
            var sn = Shader.Replace(n.toString(), '-', '0');
            var reg = new RegExp('^\\d+$');
            if (reg.test(sn) && n.toString().indexOf('.') == -1)
                return n + ".";
            return n.toString();
        };
        Shader.Custom = function () {
            return "custom_" + this.Print(++this.Me.CustomIndexer) + "_";
        };
        Shader.Index = function () {
            return "_" + Shader.Indexer + "_";
        };
        Shader.DefCustom = function (t, c) {
            this.Me.Body += t + " custom_" + this.Print(++this.Me.CustomIndexer) + "_ = " + c + ";";
        };
        Shader.toRGB = function (a, b) {
            b = Shader.Def(b, 255);
            var x = a - Math.floor(a / b) * b;
            a = Math.floor(a / b);
            var y = a - Math.floor(a / b) * b;
            a = Math.floor(a / b);
            var z = a - Math.floor(a / b) * b;
            if (x > 126)
                x++;
            if (y > 126)
                y++;
            if (z > 126)
                z++;
            return { r: x, g: y, b: z };
        };
        Shader.torgb = function (a, b) {
            b = Shader.Def(b, 255);
            var i = Shader.toRGB(a, b);
            return { r: i.r / 256, g: i.g / 256, b: i.b / 256 };
        };
        Shader.toID = function (a, b) {
            b = Shader.Def(b, 255);
            var c = 255 / b;
            var x = Math.floor(a.r / c);
            var y = Math.floor(a.g / c);
            var z = Math.floor(a.b / c);
            return z * b * b + y * b + x;
        };
        return Shader;
    }());
    Shader._null = 'set null anyway';
    BABYLONX.Shader = Shader;
    var Helper = (function () {
        function Helper() {
            var setting = Shader.Me.Setting;
            var instance = new ShaderBuilder();
            instance.Parent = Shader.Me;
            instance.Setting = setting;
            return instance;
        }
        Helper.Depth = function (far) {
            return 'max(0.,min(1.,(' + Shader.Print(far) + '-abs(length(camera-pos)))/' + Shader.Print(far) + ' ))';
        };
        return Helper;
    }());
    Helper.Red = 0;
    Helper.Yellow = 1;
    Helper.White = 2;
    Helper.Cyan = 4;
    Helper.Blue = 5;
    Helper.Pink = 6;
    Helper.Black = 7;
    Helper.Green = 8;
    BABYLONX.Helper = Helper;
    var ShaderSetting = (function () {
        function ShaderSetting() {
            this.PrecisionMode = ShaderMaterialHelperStatics.PrecisionHighMode;
        }
        return ShaderSetting;
    }());
    BABYLONX.ShaderSetting = ShaderSetting;
    var ShaderBuilder = (function () {
        function ShaderBuilder() {
            this.Setting = new ShaderSetting();
            this.Extentions = [];
            this.Attributes = [];
            this.Fragment = [];
            this.Helpers = [];
            this.Uniforms = [];
            this.Varings = [];
            this.Vertex = [];
            this.Setting.Uv = true;
            this.Setting.Time = true;
            this.Setting.Camera = true;
            this.Setting.Helpers = true;
            this.Setting.NormalMap = "result = vec4(0.5);";
            this.Setting.SpecularMap = "float_result = 1.0;";
            this.Setting.NormalOpacity = "0.5";
            this.Setting.Normal = ShaderMaterialHelperStatics.Normal;
            if (Shader.Indexer == null)
                Shader.Indexer = 1;
            this.CustomIndexer = 1;
            Shader.Me = this;
        }
        ShaderBuilder.InitializeEngine = function () {
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.MakeShaderMaterialForEngine=function(name,scene,shader,helpers){BABYLON.Effect.ShadersStore[name+#[QT]VertexShader#[QT]]=shader.Vertex;BABYLON.Effect.ShadersStore[name+#[QT]PixelShader#[QT]]=shader.Pixel;return new BABYLON.ShaderMaterial(name,scene,{vertex:name,fragment:name},helpers);}", "#[QT]", '"'), '#[T]', "'"));
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.DefineTexture = function (option, sc) { var tx = new BABYLON.Texture(option, sc); return tx; } ", "#[QT]", '"'), '#[T]', "'"));
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.DefineCubeTexture = function (option, sc) { var tx = new BABYLON.CubeTexture(option, sc); tx.coordinatesMode = BABYLON.Texture.PLANAR_MODE; return tx; }  ", "#[QT]", '"'), '#[T]', "'"));
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.SetUniforms = function (meshes, cameraPos, cameraTarget, mouse, screen, time) { for (var ms in meshes) { ms = meshes[ms]; if (ms.material && (ms.material.ShaderSetting != null || ms.material.ShaderSetting != undefined)) { if (ms.material.ShaderSetting.Camera)                ms.material.setVector3(BABYLONX.ShaderMaterialHelperStatics.Camera, cameraPos); if (ms.material.ShaderSetting.Center)                ms.material.setVector3(BABYLONX.ShaderMaterialHelperStatics.Center, { x: 0., y: 0., z: 0. }); if (ms.material.ShaderSetting.Mouse)                ms.material.setVector2(BABYLONX.ShaderMaterialHelperStatics.Mouse, mouse); if (ms.material.ShaderSetting.Screen)                ms.material.setVector2(BABYLONX.ShaderMaterialHelperStatics.Screen, screen); if (ms.material.ShaderSetting.GlobalTime)                ms.material.setVector4(BABYLONX.ShaderMaterialHelperStatics.GlobalTime, { x: 0., y: 0., z: 0., w: 0. }); if (ms.material.ShaderSetting.Look)                ms.material.setVector3(BABYLONX.ShaderMaterialHelperStatics.Look, cameraTarget); if (ms.material.ShaderSetting.Time)                ms.material.setFloat(BABYLONX.ShaderMaterialHelperStatics.Time, time);        }        }    }", "#[QT]", '"'), '#[T]', "'"));
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.ShaderPostProcess = function (name, samplers, camera, scale, shader, helpers, option) {if (!option) option = {};if (!option.samplingMode) option.samplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE;BABYLON.Effect.ShadersStore[name + #[QT]PixelShader#[QT]] = shader.Pixel;var pps = new BABYLON.PostProcess(name, name, helpers.uniforms, samplers, scale, camera, option.samplingMode);pps.onApply = function (effect) {effect.setFloat(#[T]time#[T], time);effect.setVector2(#[QT]screen#[QT], { x: pps.width, y: pps.height });effect.setVector3(#[QT]camera#[QT], camera.position);if (option && option.onApply)option.onApply(effect);};return pps;} ", "#[QT]", '"'), '#[T]', "'"));
            eval(Shader.Replace(Shader.Replace("BABYLONX.ShaderMaterialHelper.prototype.PostProcessTextures = function (pps, name, txt) {pps._effect.setTexture(name, txt);}", "#[QT]", '"'), '#[T]', "'"));
        };
        ShaderBuilder.InitializePostEffects = function (scene, scale) {
            ShaderBuilder.ColorIdRenderTarget = new ShaderMaterialHelper().DefineRenderTarget("ColorId", scale, scene);
        };
        ShaderBuilder.prototype.PrepareBeforeMaterialBuild = function () {
            this.Setting = Shader.Me.Setting;
            this.Attributes.push(ShaderMaterialHelperStatics.AttrPosition);
            this.Attributes.push(ShaderMaterialHelperStatics.AttrNormal);
            if (this.Setting.Uv) {
                this.Attributes.push(ShaderMaterialHelperStatics.AttrUv);
            }
            if (this.Setting.Uv2) {
                this.Attributes.push(ShaderMaterialHelperStatics.AttrUv2);
            }
            this.Uniforms.push(ShaderMaterialHelperStatics.uniformView, ShaderMaterialHelperStatics.uniformWorld, ShaderMaterialHelperStatics.uniformWorldView, ShaderMaterialHelperStatics.uniformViewProjection, ShaderMaterialHelperStatics.uniformWorldViewProjection);
            // start Build Vertex Frame 
            this.Vertex.push("precision " + this.Setting.PrecisionMode + " float;");
            this.Vertex.push("attribute " + ShaderMaterialHelperStatics.AttrTypeForPosition + " " + ShaderMaterialHelperStatics.AttrPosition + ";");
            this.Vertex.push("attribute " + ShaderMaterialHelperStatics.AttrTypeForNormal + " " + ShaderMaterialHelperStatics.AttrNormal + ";");
            if (this.Setting.Uv) {
                this.Vertex.push("attribute " + ShaderMaterialHelperStatics.AttrTypeForUv + " " + ShaderMaterialHelperStatics.AttrUv + ";");
                this.Vertex.push("varying vec2 " + ShaderMaterialHelperStatics.Uv + ";");
            }
            if (this.Setting.Uv2) {
                this.Vertex.push("attribute " + ShaderMaterialHelperStatics.AttrTypeForUv2 + " " + ShaderMaterialHelperStatics.AttrUv2 + ";");
                this.Vertex.push("varying vec2 " + ShaderMaterialHelperStatics.Uv2 + ";");
            }
            this.Vertex.push("varying vec3 " + ShaderMaterialHelperStatics.Position + ";");
            this.Vertex.push("varying vec3 " + ShaderMaterialHelperStatics.Normal + ";");
            this.Vertex.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformWorldViewProjection + ";");
            if (this.Setting.VertexView) {
                this.Vertex.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformView + ";");
            }
            if (this.Setting.VertexWorld) {
                this.Vertex.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformWorld + ";");
            }
            if (this.Setting.VertexViewProjection) {
                this.Vertex.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformViewProjection + ";");
            }
            if (this.Setting.Flags) {
                this.Uniforms.push(ShaderMaterialHelperStatics.uniformFlags);
                this.Vertex.push("uniform  float " + ShaderMaterialHelperStatics.uniformFlags + ";");
            }
            if (this.Setting.VertexWorldView) {
                this.Vertex.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformWorldView + ";");
            }
            if (this.VertexUniforms) {
                this.Vertex.push(this.VertexUniforms);
            }
            /*#extension GL_OES_standard_derivatives : enable*/
            this.Fragment.push("precision " + this.Setting.PrecisionMode + " float;\n\
#extension GL_OES_standard_derivatives : enable\n\
\n\
\n\
 ");
            if (this.Setting.Uv) {
                this.Fragment.push("varying vec2 " + ShaderMaterialHelperStatics.Uv + ";");
            }
            if (this.Setting.Uv2) {
                this.Fragment.push("varying vec2 " + ShaderMaterialHelperStatics.Uv2 + ";");
            }
            if (this.Setting.FragmentView) {
                this.Fragment.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformView + ";");
            }
            if (this.Setting.FragmentWorld) {
                this.Fragment.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformWorld + ";");
            }
            if (this.Setting.FragmentViewProjection) {
                this.Fragment.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformViewProjection + ";");
            }
            if (this.Setting.FragmentWorldView) {
                this.Fragment.push("uniform   " + ShaderMaterialHelperStatics.uniformStandardType + ' ' + ShaderMaterialHelperStatics.uniformWorldView + ";");
            }
            if (this.Setting.Flags) {
                this.Fragment.push("uniform  float " + ShaderMaterialHelperStatics.uniformFlags + ";");
            }
            if (this.FragmentUniforms) {
                this.Fragment.push(this.FragmentUniforms);
            }
            this.Fragment.push("varying vec3 " + ShaderMaterialHelperStatics.Position + ";");
            this.Fragment.push("varying vec3 " + ShaderMaterialHelperStatics.Normal + ";");
            if (this.Setting.WorldPosition) {
                this.Vertex.push("varying vec3 " + ShaderMaterialHelperStatics.WorldPosition + ";");
                this.Vertex.push("varying vec3 " + ShaderMaterialHelperStatics.WorldNormal + ";");
                this.Fragment.push("varying vec3 " + ShaderMaterialHelperStatics.WorldPosition + ";");
                this.Fragment.push("varying vec3 " + ShaderMaterialHelperStatics.WorldNormal + ";");
            }
            if (this.Setting.Texture2Ds != null) {
                for (var s in this.Setting.Texture2Ds) {
                    if (this.Setting.Texture2Ds[s].inVertex) {
                        this.Vertex.push("uniform  sampler2D " + ShaderMaterialHelperStatics.Texture2D + s + ";");
                    }
                    if (this.Setting.Texture2Ds[s].inFragment) {
                        this.Fragment.push("uniform  sampler2D  " + ShaderMaterialHelperStatics.Texture2D + s + ";");
                    }
                }
            }
            if (this.Setting.CameraShot) {
                this.Fragment.push("uniform  sampler2D  textureSampler;");
            }
            if (this.Setting.TextureCubes != null) {
                for (var s in this.Setting.TextureCubes) {
                    if (this.Setting.TextureCubes[s].inVertex) {
                        this.Vertex.push("uniform  samplerCube  " + ShaderMaterialHelperStatics.TextureCube + s + ";");
                    }
                    if (this.Setting.TextureCubes[s].inFragment) {
                        this.Fragment.push("uniform  samplerCube   " + ShaderMaterialHelperStatics.TextureCube + s + ";");
                    }
                }
            }
            if (this.Setting.Center) {
                this.Vertex.push("uniform  vec3 " + ShaderMaterialHelperStatics.Center + ";");
                this.Fragment.push("uniform  vec3 " + ShaderMaterialHelperStatics.Center + ";");
            }
            if (this.Setting.Mouse) {
                this.Vertex.push("uniform  vec2 " + ShaderMaterialHelperStatics.Mouse + ";");
                this.Fragment.push("uniform  vec2 " + ShaderMaterialHelperStatics.Mouse + ";");
            }
            if (this.Setting.Screen) {
                this.Vertex.push("uniform  vec2 " + ShaderMaterialHelperStatics.Screen + ";");
                this.Fragment.push("uniform  vec2 " + ShaderMaterialHelperStatics.Screen + ";");
            }
            if (this.Setting.Camera) {
                this.Vertex.push("uniform  vec3 " + ShaderMaterialHelperStatics.Camera + ";");
                this.Fragment.push("uniform  vec3 " + ShaderMaterialHelperStatics.Camera + ";");
            }
            if (this.Setting.Look) {
                this.Vertex.push("uniform  vec3 " + ShaderMaterialHelperStatics.Look + ";");
                this.Fragment.push("uniform  vec3 " + ShaderMaterialHelperStatics.Look + ";");
            }
            if (this.Setting.Time) {
                this.Vertex.push("uniform  float " + ShaderMaterialHelperStatics.Time + ";");
                this.Fragment.push("uniform  float " + ShaderMaterialHelperStatics.Time + ";");
            }
            if (this.Setting.GlobalTime) {
                this.Vertex.push("uniform  vec4 " + ShaderMaterialHelperStatics.GlobalTime + ";");
                this.Fragment.push("uniform  vec4 " + ShaderMaterialHelperStatics.GlobalTime + ";");
            }
            if (this.Setting.ReflectMatrix) {
                this.Vertex.push("uniform  mat4 " + ShaderMaterialHelperStatics.ReflectMatrix + ";");
                this.Fragment.push("uniform  mat4 " + ShaderMaterialHelperStatics.ReflectMatrix + ";");
            }
            if (this.Setting.Helpers) {
                var sresult = Shader.Join([
                    "vec3 random3(vec3 c) {   float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));   vec3 r;   r.z = fract(512.0*j); j *= .125;  r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);  return r-0.5;  } ",
                    "float rand(vec2 co){   return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); } ",
                    "const float F3 =  0.3333333;const float G3 =  0.1666667;",
                    "float simplex3d(vec3 p) {   vec3 s = floor(p + dot(p, vec3(F3)));   vec3 x = p - s + dot(s, vec3(G3));  vec3 e = step(vec3(0.0), x - x.yzx);  vec3 i1 = e*(1.0 - e.zxy);  vec3 i2 = 1.0 - e.zxy*(1.0 - e);   vec3 x1 = x - i1 + G3;   vec3 x2 = x - i2 + 2.0*G3;   vec3 x3 = x - 1.0 + 3.0*G3;   vec4 w, d;    w.x = dot(x, x);   w.y = dot(x1, x1);  w.z = dot(x2, x2);  w.w = dot(x3, x3);   w = max(0.6 - w, 0.0);   d.x = dot(random3(s), x);   d.y = dot(random3(s + i1), x1);   d.z = dot(random3(s + i2), x2);  d.w = dot(random3(s + 1.0), x3);  w *= w;   w *= w;  d *= w;   return dot(d, vec4(52.0));     }  ",
                    "float noise(vec3 m) {  return   0.5333333*simplex3d(m)   +0.2666667*simplex3d(2.0*m) +0.1333333*simplex3d(4.0*m) +0.0666667*simplex3d(8.0*m);   } ",
                    "float dim(vec3 p1 , vec3 p2){   return sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z)); }",
                    "vec2  rotate_xy(vec2 pr1,vec2  pr2,float alpha) {vec2 pp2 = vec2( pr2.x - pr1.x,   pr2.y - pr1.y );return  vec2( pr1.x + pp2.x * cos(alpha*3.14159265/180.) - pp2.y * sin(alpha*3.14159265/180.),pr1.y + pp2.x * sin(alpha*3.14159265/180.) + pp2.y * cos(alpha*3.14159265/180.));} \n vec3  r_y(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.x;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.z ), a);n.x = p.x;n.z = p.y;return n; } \n vec3  r_x(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.y;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.y,  n.z ), a);n.y = p.x;n.z = p.y;return n; } \n vec3  r_z(vec3 n, float a,vec3 c) {  vec3 c1 = vec3( c.x,  c.y,   c.z );vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.y ), a);n.x = p.x;n.y = p.y;return n; }",
                ]);
                this.Vertex.push(sresult);
                this.Fragment.push(sresult);
            }
            this.Vertex.push("void main(void) { \n\
    " + ShaderMaterialHelperStatics.Position + " = " + ShaderMaterialHelperStatics.AttrPosition + "; \n\
    " + ShaderMaterialHelperStatics.Normal + " = " + ShaderMaterialHelperStatics.AttrNormal + "; \n\
    vec4 result = vec4(" + ShaderMaterialHelperStatics.Position + ",1.);  \n\
      vuv = uv;\n\
     #[Source]\n\
    gl_Position = worldViewProjection * result;\n\
    #[AfterFinishVertex] \n\
 }");
            // start Build Fragment Frame 
            if (this.Setting.NormalMap != null) {
                this.Fragment.push("vec3 normalMap() { vec4 result = vec4(0.); " + this.Setting.NormalMap + "; \n\
                  result = vec4( normalize( " + this.Setting.Normal + " -(normalize(result.xyz)*2.0-vec3(1.))*(max(-0.5,min(0.5," + Shader.Print(this.Setting.NormalOpacity) + ")) )),1.0); return result.xyz;}");
            }
            if (this.Setting.SpecularMap != null) {
                this.Fragment.push("float specularMap() { vec4 result = vec4(0.);float float_result = 0.; " + this.Setting.SpecularMap + "; return float_result ;}");
            }
            this.Fragment.push(this.FragmentBeforeMain);
            this.Fragment.push(" \n\
void main(void) { \n\
     int discardState = 0;\n\
     vec4 result = vec4(0.);\n\
     #[Source] \n\
     if(discardState == 0)gl_FragColor = result; \n\
}");
        };
        ShaderBuilder.prototype.PrepareBeforePostProcessBuild = function () {
            this.Setting = Shader.Me.Setting;
            this.Attributes.push(ShaderMaterialHelperStatics.AttrPosition);
            // start Build Vertex Frame 
            /*#extension GL_OES_standard_derivatives : enable*/
            this.Fragment.push("precision " + this.Setting.PrecisionMode + " float;\n\
\n\
 ");
            if (this.Setting.Uv) {
                this.Fragment.push("varying vec2 vUV;");
            }
            if (this.Setting.Flags) {
                this.Fragment.push("uniform  float " + ShaderMaterialHelperStatics.uniformFlags + ";");
            }
            if (this.Setting.Texture2Ds != null) {
                for (var s in this.Setting.Texture2Ds) {
                    if (this.Setting.Texture2Ds[s].inFragment) {
                        this.Fragment.push("uniform  sampler2D  " + ShaderMaterialHelperStatics.Texture2D + s + ";");
                    }
                }
            }
            if (this.PPSSamplers != null) {
                for (var s in this.PPSSamplers) {
                    if (this.PPSSamplers[s]) {
                        this.Fragment.push("uniform  sampler2D  " + this.PPSSamplers[s] + ";");
                    }
                }
            }
            if (this.Setting.CameraShot) {
                this.Fragment.push("uniform  sampler2D  textureSampler;");
            }
            if (this.Setting.Mouse) {
                this.Fragment.push("uniform  vec2 " + ShaderMaterialHelperStatics.Mouse + ";");
            }
            if (this.Setting.Screen) {
                this.Fragment.push("uniform  vec2 " + ShaderMaterialHelperStatics.Screen + ";");
            }
            if (this.Setting.Camera) {
                this.Fragment.push("uniform  vec3 " + ShaderMaterialHelperStatics.Camera + ";");
            }
            if (this.Setting.Look) {
                this.Fragment.push("uniform  vec3 " + ShaderMaterialHelperStatics.Look + ";");
            }
            if (this.Setting.Time) {
                this.Fragment.push("uniform  float " + ShaderMaterialHelperStatics.Time + ";");
            }
            if (this.Setting.GlobalTime) {
                this.Fragment.push("uniform  vec4 " + ShaderMaterialHelperStatics.GlobalTime + ";");
            }
            if (this.Setting.Helpers) {
                var sresult = Shader.Join([
                    "vec3 random3(vec3 c) {   float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));   vec3 r;   r.z = fract(512.0*j); j *= .125;  r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);  return r-0.5;  } ",
                    "float rand(vec2 co){   return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); } ",
                    "const float F3 =  0.3333333;const float G3 =  0.1666667;",
                    "float simplex3d(vec3 p) {   vec3 s = floor(p + dot(p, vec3(F3)));   vec3 x = p - s + dot(s, vec3(G3));  vec3 e = step(vec3(0.0), x - x.yzx);  vec3 i1 = e*(1.0 - e.zxy);  vec3 i2 = 1.0 - e.zxy*(1.0 - e);   vec3 x1 = x - i1 + G3;   vec3 x2 = x - i2 + 2.0*G3;   vec3 x3 = x - 1.0 + 3.0*G3;   vec4 w, d;    w.x = dot(x, x);   w.y = dot(x1, x1);  w.z = dot(x2, x2);  w.w = dot(x3, x3);   w = max(0.6 - w, 0.0);   d.x = dot(random3(s), x);   d.y = dot(random3(s + i1), x1);   d.z = dot(random3(s + i2), x2);  d.w = dot(random3(s + 1.0), x3);  w *= w;   w *= w;  d *= w;   return dot(d, vec4(52.0));     }  ",
                    "float noise(vec3 m) {  return   0.5333333*simplex3d(m)   +0.2666667*simplex3d(2.0*m) +0.1333333*simplex3d(4.0*m) +0.0666667*simplex3d(8.0*m);   } ",
                    "vec2  rotate_xy(vec2 pr1,vec2  pr2,float alpha) {vec2 pp2 = vec2( pr2.x - pr1.x,   pr2.y - pr1.y );return  vec2( pr1.x + pp2.x * cos(alpha*3.14159265/180.) - pp2.y * sin(alpha*3.14159265/180.),pr1.y + pp2.x * sin(alpha*3.14159265/180.) + pp2.y * cos(alpha*3.14159265/180.));} \n vec3  r_y(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.x;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.z ), a);n.x = p.x;n.z = p.y;return n; } \n vec3  r_x(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.y;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.y,  n.z ), a);n.y = p.x;n.z = p.y;return n; } \n vec3  r_z(vec3 n, float a,vec3 c) {  vec3 c1 = vec3( c.x,  c.y,   c.z );vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.y ), a);n.x = p.x;n.y = p.y;return n; }",
                    "float getIdColor(vec4 a){    float b = 255.;float c = 255. / b;float x = floor(a.x*256. / c);float y = floor(a.y *256./ c);float z = floor(a.z*256. / c);return z * b * b + y * b + x;}"
                ]);
                this.Fragment.push(sresult);
            }
            if (this.Setting.NormalMap != null) {
                this.Fragment.push("vec3 normalMap() { vec4 result = vec4(0.);   return result.xyz;}");
            }
            // start Build Fragment Frame  
            this.Fragment.push(this.FragmentBeforeMain);
            this.Fragment.push(" \n\
void main(void) { \n\
     int discardState = 0;\n\
     vec2 vuv = vUV;\n\
     vec3 center = vec3(0.);\n\
     vec4 result = vec4(0.);\n\
     #[Source] \n\
     if(discardState == 0)gl_FragColor = result; \n\
}");
        };
        ShaderBuilder.prototype.PrepareMaterial = function (material, scene) {
            material.ShaderSetting =
                this.Setting;
            if (!this.Setting.Transparency) {
                material.needAlphaBlending = function () { return false; };
            }
            else {
                material.needAlphaBlending = function () { return true; };
            }
            if (!this.Setting.Back)
                this.Setting.Back = false;
            if (this.Setting.DisableAlphaTesting) {
                material.needAlphaTesting = function () { return false; };
            }
            else {
                material.needAlphaTesting = function () { return true; };
            }
            material.setVector3("camera", { x: 18., y: 18., z: 18. });
            material.backFaceCulling = !this.Setting.Back;
            material.wireframe = this.Setting.Wire;
            material.setFlags = function (flags) {
                if (this.ShaderSetting.Flags) {
                    var s = 0.;
                    for (var i = 0; i < 20; i++) {
                        if (flags.length > i && flags[i] == '1')
                            s += Math.pow(2., i);
                    }
                    this.flagNumber = s;
                    this.setFloat(ShaderMaterialHelperStatics.uniformFlags, s);
                }
            };
            material.flagNumber = 0.;
            material.flagUp = function (flag) {
                if (this.ShaderSetting.Flags) {
                    if (Math.floor((this.flagNumber / Math.pow(2., flag) % 2.)) != 1.)
                        this.flagNumber += Math.pow(2., flag);
                    this.setFloat(ShaderMaterialHelperStatics.uniformFlags, this.flagNumber);
                }
            };
            material.flagDown = function (flag) {
                if (this.ShaderSetting.Flags) {
                    if (Math.floor((this.flagNumber / Math.pow(2., flag) % 2.)) == 1.)
                        this.flagNumber -= Math.pow(2., flag);
                    this.setFloat(ShaderMaterialHelperStatics.uniformFlags, this.flagNumber);
                }
            };
            material.onCompiled = function () {
            };
            if (this.Setting.Texture2Ds != null) {
                for (var s in this.Setting.Texture2Ds) {
                    // setTexture2D
                    var texture = new ShaderMaterialHelper().DefineTexture(this.Setting.Texture2Ds[s].key, scene);
                    material.setTexture(ShaderMaterialHelperStatics.Texture2D + s, texture);
                }
            }
            if (this.Setting.TextureCubes != null) {
                for (var s in this.Setting.TextureCubes) {
                    // setTexture2D
                    var texture = new ShaderMaterialHelper().DefineCubeTexture(this.Setting.TextureCubes[s].key, scene);
                    material.setTexture(ShaderMaterialHelperStatics.TextureCube + s, texture);
                    material.setMatrix(ShaderMaterialHelperStatics.ReflectMatrix, texture.getReflectionTextureMatrix());
                }
            }
            Shader.Me = null;
            return material;
        };
        ShaderBuilder.prototype.Build = function () {
            Shader.Me.Parent.Setting = Shader.Me.Setting;
            Shader.Me = Shader.Me.Parent;
            return this.Body;
        };
        ShaderBuilder.prototype.BuildVertex = function () {
            Shader.Me.Parent.Setting = Shader.Me.Setting;
            Shader.Me = Shader.Me.Parent;
            return this.VertexBody;
        };
        ShaderBuilder.prototype.SetUniform = function (name, type) {
            if (!Shader.Me.VertexUniforms)
                Shader.Me.VertexUniforms = "";
            if (!Shader.Me.FragmentUniforms)
                Shader.Me.FragmentUniforms = "";
            this.VertexUniforms += 'uniform ' + type + ' ' + name + ';\n\
            ';
            this.FragmentUniforms += 'uniform ' + type + ' ' + name + ';\n\
            ';
            return this;
        };
        ShaderBuilder.prototype.toScript = function (moduleName, className, doTypescript) {
            if (doTypescript === void 0) { doTypescript = true; }
            this.PrepareBeforeMaterialBuild();
            // things independent of typescript or javascript output needed in call to super
            var vShader = "BABYLON.Effect.ShadersStore[" + className + "VertexShader]=" + Shader.Join(this.Vertex).replace("#[Source]", Shader.Def(this.VertexBody, "")).replace("#[AfterFinishVertex]", Shader.Def(this.AfterVertex, "")) + ";\n\n";
            var fShader = "BABYLON.Effect.ShadersStore[" + className + "PixelShader ]=" + Shader.Join(this.Fragment).replace("#[Source]", this.Body) + ";\n\n";
            var shaderPath = "{vertex: " + className + ", Pixel: " + className + "}";
            var options = "{";
            options += "uniforms: [" + this.Uniforms + "], ";
            options += "attributes: [" + this.Attributes + "], ";
            options += "needAlphaBlending: " + this.Setting.Transparency + ", ";
            options += "needAlphaTesting: " + !this.Setting.DisableAlphaTesting + "}";
            var ret;
            if (doTypescript) {
                ret = "module " + moduleName + " {\n" +
                    vShader + ";\n" +
                    fShader + ";\n" +
                    "\texport class " + className + " extends BABYLON.ShaderMaterial {\n" +
                    "\t\tconstructor(name: string, scene: Scene) {\n" +
                    "\t\t\tsuper(name, scene, " + shaderPath + ", " + options + ");\n";
            }
            else {
                ret = "\n" +
                    vShader + ";\n" +
                    fShader + ";\n" +
                    "var " + moduleName + ";\n" +
                    "(function (shape_key) {\n" +
                    "\tvar " + className + " = (function (_super) {\n" +
                    "\t\t__extends(" + className + ", _super);\n" +
                    "\t\tfunction " + className + "(name, scene) {\n" +
                    "\t\t\t_super.call(this, name, scene, " + shaderPath + ", " + options + ");\n";
            }
            // this is the equivalent of PrepareMaterial
            var indent = "\t\t\t\t";
            ret += indent + "this..setVector3('camera', { x: 18., y: 18., z: 18. });\n";
            ret += indent + "this.backFaceCulling = " + !this.Setting.Back + ";\n";
            ret += indent + "this.wireframe = " + this.Setting.Wire + ";\n";
            if (this.Setting.Texture2Ds || this.Setting.TextureCubes)
                ret += indent + "var texture;\n";
            if (this.Setting.Texture2Ds) {
                for (var s in this.Setting.Texture2Ds) {
                    ret += indent + "texture = new BABYLON.Texture(" + this.Setting.Texture2Ds[s].key + ", scene)\n;";
                    ret += indent + "this.setTexture(" + ShaderMaterialHelperStatics.Texture2D + s + ", texture)\n;";
                }
            }
            if (this.Setting.TextureCubes) {
                for (var s in this.Setting.TextureCubes) {
                    ret += indent + "texture = new BABYLON.Texture(" + this.Setting.TextureCubes[s].key + ", scene)\n;";
                    ret += indent + "this.setTexture(" + ShaderMaterialHelperStatics.TextureCube + s + ", texture)\n;";
                    ret += indent + "this.setMatrix(" + ShaderMaterialHelperStatics.ReflectMatrix + ", texture.getReflectionTextureMatrix());\n";
                }
            }
            // constructor closing differences between typescript & javascript
            if (!doTypescript) {
                ret += "\t\treturn this;\n";
            }
            ret += "\t\t" + (doTypescript ? "public setFlags(flags : string) : void" : className + ".prototype.setFlags = function(flags)") + " {\n";
            ret += indent + "var s = 0.;\n";
            ret += indent + "for (var i = 0; i < 20; i++) {\n";
            ret += indent + "   if (flags.length > i && flags[i] == '1')\n";
            ret += indent + "    s += Math.pow(2., i);\n";
            ret += indent + "}\n";
            ret += indent + "this.flagNumber = s;\n";
            ret += indent + "this.setFloat(" + ShaderMaterialHelperStatics.uniformFlags + ", s);\n";
            ret += "\t\t" + (doTypescript ? "}\n" : "}\n;");
            ret += "\t\t" + (doTypescript ? "public flagUp(flag : number) : void" : className + ".prototype.flagUp = function(flag)") + " {\n";
            ret += indent + "if (Math.floor((this.flagNumber / Math.pow(2., flag) % 2.)) != 1.)\n";
            ret += indent + "    this.flagNumber += Math.pow(2., flag);\n";
            ret += indent + "this.setFloat(ShaderMaterialHelperStatics.uniformFlags, this.flagNumber);\n";
            ret += "\t\t" + (doTypescript ? "}\n" : "}\n;");
            ret += "\t\t" + (doTypescript ? "public flagDown(flag : number) : void" : className + ".prototype.flagDown = function(flag)") + " {\n";
            ret += indent + "if (Math.floor((this.flagNumber / Math.pow(2., flag) % 2.)) == 1.)\n";
            ret += indent + "    this.flagNumber -= Math.pow(2., flag);\n";
            ret += indent + "this.setFloat(ShaderMaterialHelperStatics.uniformFlags, this.flagNumber);\n";
            ret += "\t\t" + (doTypescript ? "}\n" : "}\n;");
            // adjust for closing differences between typescript & javascript
            if (doTypescript) {
                ret += "\t}\n" +
                    "}";
            }
            else {
                "\t\treturn " + className + ";\n" +
                    "\t})(BABYLON.ShaderMaterial);\n" +
                    "\t" + moduleName + "." + className + " = " + className + ";\n";
                ret += "})(" + moduleName + " || (" + moduleName + " = {}));";
            }
            return ret;
        };
        ShaderBuilder.prototype.BuildMaterial = function (scene) {
            this.PrepareBeforeMaterialBuild();
            if (Shader.ShaderIdentity == null)
                Shader.ShaderIdentity = 0;
            Shader.ShaderIdentity++;
            var shaderMaterial = new ShaderMaterialHelper().ShaderMaterial("ShaderBuilder_" + Shader.ShaderIdentity, scene, {
                Pixel: Shader.Join(this.Fragment)
                    .replace("#[Source]", this.Body),
                Vertex: Shader.Join(this.Vertex)
                    .replace("#[Source]", Shader.Def(this.VertexBody, ""))
                    .replace("#[AfterFinishVertex]", Shader.Def(this.AfterVertex, ""))
            }, {
                uniforms: this.Uniforms,
                attributes: this.Attributes
            });
            Shader.Indexer = 1;
            return this.PrepareMaterial(shaderMaterial, scene);
        };
        ShaderBuilder.prototype.BuildPostProcess = function (camera, scene, scale, option) {
            this.Setting.Screen = true;
            this.Setting.Mouse = true;
            this.Setting.Time = true;
            this.Setting.CameraShot = true;
            this.PrepareBeforePostProcessBuild();
            if (Shader.ShaderIdentity == null)
                Shader.ShaderIdentity = 0;
            Shader.ShaderIdentity++;
            var samplers = [];
            for (var s in this.Setting.Texture2Ds) {
                samplers.push(ShaderMaterialHelperStatics.Texture2D + s);
            }
            if (this.PPSSamplers != null) {
                for (var s in this.PPSSamplers) {
                    if (this.PPSSamplers[s]) {
                        samplers.push(this.PPSSamplers[s]);
                    }
                }
            }
            var shaderPps = new ShaderMaterialHelper().ShaderPostProcess("ShaderBuilder_" + Shader.ShaderIdentity, samplers, camera, scale, {
                Pixel: Shader.Join(this.Fragment)
                    .replace("#[Source]", this.Body),
                Vertex: Shader.Join(this.Vertex)
                    .replace("#[Source]", Shader.Def(this.VertexBody, ""))
                    .replace("#[AfterFinishVertex]", Shader.Def(this.AfterVertex, ""))
            }, {
                uniforms: this.Uniforms,
                attributes: this.Attributes
            }, option);
            if (this.Setting.Texture2Ds != null) {
                for (var s in this.Setting.Texture2Ds) {
                    // setTexture2D
                    var texture = new ShaderMaterialHelper().DefineTexture(this.Setting.Texture2Ds[s].key, scene);
                    new ShaderMaterialHelper().PostProcessTextures(shaderPps, ShaderMaterialHelperStatics.Texture2D + s, texture);
                }
            }
            return shaderPps;
        };
        ShaderBuilder.prototype.Event = function (index, mat) {
            Shader.Me.Setting.Flags = true;
            Shader.Indexer++;
            this.Body = Shader.Def(this.Body, "");
            this.Body += "  if ( floor(mod( " + ShaderMaterialHelperStatics.uniformFlags + "/pow(2.," + Shader.Print(index) + "),2.)) == 1.) { " + mat + " } ";
            return this;
        };
        ShaderBuilder.prototype.EventVertex = function (index, mat) {
            Shader.Me.Setting.Flags = true;
            Shader.Me.Setting.Vertex = true;
            Shader.Indexer++;
            this.VertexBody = Shader.Def(this.VertexBody, "");
            this.VertexBody += " if( floor(mod( " + ShaderMaterialHelperStatics.uniformFlags + "/pow(2.," + Shader.Print(index) + "),2.)) == 1. ){ " + mat + "}";
            return this;
        };
        ShaderBuilder.prototype.Transparency = function () {
            Shader.Me.Setting.Transparency = true;
            return this;
        };
        ShaderBuilder.prototype.DisableAlphaTesting = function () {
            Shader.Me.Setting.DisableAlphaTesting = true;
            return this;
        };
        ShaderBuilder.prototype.PostEffect1 = function (id, effect) {
            if (Shader.Me.PostEffect1Effects == null)
                Shader.Me.PostEffect1Effects = [];
            Shader.Me.PostEffect1[id] = effect;
            return this;
        };
        ShaderBuilder.prototype.PostEffect2 = function (id, effect) {
            if (Shader.Me.PostEffect2Effects == null)
                Shader.Me.PostEffect2Effects = [];
            Shader.Me.PostEffect2[id] = effect;
            return this;
        };
        ShaderBuilder.prototype.ImportSamplers = function (txts) {
            if (Shader.Me.PPSSamplers == null)
                Shader.Me.PPSSamplers = [];
            for (var s in txts) {
                Shader.Me.PPSSamplers.push(txts[s]);
            }
            return this;
        };
        ShaderBuilder.prototype.Wired = function () {
            Shader.Me.Setting.Wire = true;
            return this;
        };
        ShaderBuilder.prototype.VertexShader = function (mat) {
            this.VertexBody = Shader.Def(this.VertexBody, "");
            this.VertexBody += mat;
            return this;
        };
        ShaderBuilder.prototype.Solid = function (color) {
            color = Shader.Def(color, { r: 0., g: 0., b: 0., a: 1. });
            color.a = Shader.Def(color.a, 1.);
            color.r = Shader.Def(color.r, 0.);
            color.g = Shader.Def(color.g, 0.);
            color.b = Shader.Def(color.b, 0.);
            this.Body = Shader.Def(this.Body, "");
            this.Body += " result = vec4(" + Shader.Print(color.r) + "," + Shader.Print(color.g) + "," + Shader.Print(color.b) + "," + Shader.Print(color.a) + ");";
            return this;
        };
        ShaderBuilder.prototype.GetMapIndex = function (key) {
            if (Shader.Me.Setting.Texture2Ds != null) {
                for (var it in Shader.Me.Setting.Texture2Ds) {
                    if (this.Setting.Texture2Ds[it].key == key) {
                        return it;
                    }
                }
            }
            else
                Shader.Me.Setting.Texture2Ds = [];
            return -1;
        };
        ShaderBuilder.prototype.GetCubeMapIndex = function (key) {
            if (Shader.Me.Setting.TextureCubes != null) {
                for (var it in Shader.Me.Setting.TextureCubes) {
                    if (this.Setting.TextureCubes[it].key == key) {
                        return it;
                    }
                }
            }
            else
                Shader.Me.Setting.TextureCubes = [];
            return -1;
        };
        ShaderBuilder.prototype.Func = function (fun) {
            return fun(Shader.Me);
        };
        ShaderBuilder.prototype.Nut = function (value, option) {
            Shader.Indexer++;
            option = Shader.Def(option, {});
            option.frame = Shader.Def(option.frame, 'sin(time*0.4)');
            var sresult = Shader.Join([
                "float nut#[Ind]= " + Shader.Print(value) + ";",
                "float nut_ts#[Ind] = " + Shader.Print(option.frame) + ";",
                this.Func(function (me) {
                    var f = [];
                    for (var i = 0; i < option.bones.length; i++) {
                        f.push('vec3 nut_p#[Ind]_' + i + ' = ' + option.bones[i].center + ';');
                    }
                    return Shader.Join(f);
                }),
                this.Func(function (me) {
                    var f = [];
                    for (var i = 0; i < option.bones.length; i++) {
                        f.push('if(nut#[Ind] ' + option.bones[i].bet + '){ ');
                        for (var j = 0; j < option.array.length; j++) {
                            if (option.bones[i].rotation.x != null && option.bones[i].rotation.x != undefined) {
                                f.push(option.array[j] + ' = r_x(' + option.array[j] +
                                    ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.x)
                                    + ',nut_p#[Ind]_' + i + ');');
                                for (var v = i + 1; v < option.bones.length; v++) {
                                    f.push('nut_p#[Ind]_' + v + ' = r_x(nut_p#[Ind]_' + v +
                                        ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.x)
                                        + ',nut_p#[Ind]_' + i + ');');
                                }
                            }
                            if (option.bones[i].rotation.y != null && option.bones[i].rotation.y != undefined) {
                                f.push(option.array[j] + ' = r_y(' + option.array[j] + ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.y)
                                    + ',nut_p#[Ind]_' + i + ');');
                                for (var v = i + 1; v < option.bones.length; v++) {
                                    f.push('nut_p#[Ind]_' + v + ' = r_y(nut_p#[Ind]_' + v + ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.y)
                                        + ',nut_p#[Ind]_' + i + ');');
                                }
                            }
                            if (option.bones[i].rotation.z != null && option.bones[i].rotation.z != undefined) {
                                f.push(option.array[j] + ' = r_z(' + option.array[j] + ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.z)
                                    + ',nut_p#[Ind]_' + i + ');');
                                for (var v = i + 1; v < option.bones.length; v++) {
                                    f.push('nut_p#[Ind]_' + v + ' = r_z(nut_p#[Ind]_' + v + ',nut_ts#[Ind]*' + Shader.Print(option.bones[i].rotation.z)
                                        + ',nut_p#[Ind]_' + i + ');');
                                }
                            }
                        }
                        f.push('}');
                    }
                    return Shader.Join(f);
                })
            ]);
            this.VertexBody = Shader.Def(this.VertexBody, "");
            sresult = Shader.Replace(sresult, '#[Ind]', Shader.Indexer.toString()) + " result = vec4(pos,1.);";
            this.VertexBody += sresult;
            return this;
        };
        ShaderBuilder.prototype.Map = function (option) {
            Shader.Indexer++;
            option = Shader.Def(option, { path: '/images/color.png' });
            var s = 0.;
            var refInd = '';
            if (option.index == null || option.index == undefined) {
                s = Shader.Me.GetMapIndex(option.path);
                if (s == -1) {
                    Shader.Me.Setting.Texture2Ds.push({ key: option.path, inVertex: option.useInVertex, inFragment: true });
                }
                else {
                    Shader.Me.Setting.Texture2Ds[s].inVertex = option.useInVertex;
                }
                s = Shader.Me.GetMapIndex(option.path);
                refInd = ShaderMaterialHelperStatics.Texture2D + s;
            }
            else if (option.index == "current") {
                refInd = "textureSampler"; // used Only for postProcess
            }
            else {
                var sn = Shader.Replace(option.index.toString(), '-', '0');
                var reg = new RegExp('^\\d+$');
                if (reg.test(sn) && option.index.toString().indexOf('.') == -1)
                    refInd = ShaderMaterialHelperStatics.Texture2D + option.index;
                else {
                    refInd = option.index;
                }
            }
            Shader.Me.Setting.Center = true;
            Shader.Me.Setting.Helpers = true;
            Shader.Me.Setting.Uv = true;
            option.normal = Shader.Def(option.normal, Normals.Map);
            option.alpha = Shader.Def(option.alpha, false);
            option.bias = Shader.Def(option.bias, "0.");
            option.normalLevel = Shader.Def(option.normalLevel, 1.0);
            option.path = Shader.Def(option.path, "qa.jpg");
            option.rotation = Shader.Def(option.rotation, { x: 0, y: 0, z: 0 });
            option.scaleX = Shader.Def(option.scaleX, 1.);
            option.scaleY = Shader.Def(option.scaleY, 1.);
            option.useInVertex = Shader.Def(option.useInVertex, false);
            option.x = Shader.Def(option.x, 0.0);
            option.y = Shader.Def(option.y, 0.0);
            option.uv = Shader.Def(option.uv, ShaderMaterialHelperStatics.Uv);
            option.animation = Shader.Def(option.animation, false);
            option.tiled = Shader.Def(option.tiled, false);
            option.columnIndex = Shader.Def(option.columnIndex, 1);
            option.rowIndex = Shader.Def(option.rowIndex, 1);
            option.animationSpeed = Shader.Def(option.animationSpeed, 2000);
            option.animationFrameEnd = Shader.Def(option.animationFrameEnd, 100) + option.indexCount;
            option.animationFrameStart = Shader.Def(option.animationFrameStart, 0) + option.indexCount;
            option.indexCount = Shader.Def(option.indexCount, 1);
            var frameLength = Math.min(option.animationFrameEnd - option.animationFrameStart, option.indexCount * option.indexCount);
            var uv = Shader.Def(option.uv, ShaderMaterialHelperStatics.Uv);
            if (option.uv == "planar") {
                uv = ShaderMaterialHelperStatics.Position;
            }
            else {
                uv = 'vec3(' + option.uv + '.x,' + option.uv + '.y,0.)';
            }
            option.scaleX /= option.indexCount;
            option.scaleY /= option.indexCount;
            var rotate = ["vec3 centeri#[Ind] = " + ShaderMaterialHelperStatics.Center + ";",
                "vec3 ppo#[Ind] = r_z( " + uv + "," + Shader.Print(option.rotation.x) + ",centeri#[Ind]);  ",
                " ppo#[Ind] = r_y( ppo#[Ind]," + Shader.Print(option.rotation.y) + ",centeri#[Ind]);  ",
                " ppo#[Ind] = r_x( ppo#[Ind]," + Shader.Print(option.rotation.x) + ",centeri#[Ind]); ",
                "vec3 nrm#[Ind] = r_z( " + option.normal + "," + Shader.Print(option.rotation.x) + ",centeri#[Ind]);  ",
                " nrm#[Ind] = r_y( nrm#[Ind]," + Shader.Print(option.rotation.y) + ",centeri#[Ind]);  ",
                " nrm#[Ind] = r_x( nrm#[Ind]," + Shader.Print(option.rotation.z) + ",centeri#[Ind]);  "].join("\n\
");
            var sresult = Shader.Join([rotate,
                " vec4 color#[Ind] = texture2D(" +
                    refInd + " ,ppo#[Ind].xy*vec2(" +
                    Shader.Print(option.scaleX) + "," + Shader.Print(option.scaleY) + ")+vec2(" +
                    Shader.Print(option.x) + "," + Shader.Print(option.y) + ")" + (option.bias == null || Shader.Print(option.bias) == '0.' ? "" : "," + Shader.Print(option.bias)) + ");",
                " if(nrm#[Ind].z < " + Shader.Print(option.normalLevel) + "){ ",
                (option.alpha ? " result =  color#[Ind];" : "result = vec4(color#[Ind].rgb , 1.); "),
                "}"]);
            if (option.indexCount > 1 || option.tiled) {
                option.columnIndex = option.indexCount - option.columnIndex + 1.0;
                sresult = [
                    " vec3 uvt#[Ind] = vec3(" + uv + ".x*" + Shader.Print(option.scaleX) + "+" + Shader.Print(option.x) + "," + uv + ".y*" + Shader.Print(option.scaleY) + "+" + Shader.Print(option.y) + ",0.0);     ",
                    "             ",
                    " float xst#[Ind] = 1./(" + Shader.Print(option.indexCount) + "*2.);                                                    ",
                    " float yst#[Ind] =1./(" + Shader.Print(option.indexCount) + "*2.);                                                     ",
                    " float xs#[Ind] = 1./" + Shader.Print(option.indexCount) + ";                                                     ",
                    " float ys#[Ind] = 1./" + Shader.Print(option.indexCount) + ";                                                     ",
                    " float yid#[Ind] = " + Shader.Print(option.columnIndex - 1.0) + " ;                                                      ",
                    " float xid#[Ind] =  " + Shader.Print(option.rowIndex - 1.0) + ";                                                      ",
                    option.animation ? " float ind_a#[Ind] = floor(mod(time*0.001*" + Shader.Print(option.animationSpeed) + ",   " + Shader.Print(frameLength) + " )+" + Shader.Print(option.animationFrameStart) + ");" +
                        " yid#[Ind] = " + Shader.Print(option.indexCount) + "- floor(ind_a#[Ind] /  " + Shader.Print(option.indexCount) + ");" +
                        " xid#[Ind] =  floor(mod(ind_a#[Ind] ,  " + Shader.Print(option.indexCount) + ")); "
                        : "",
                    " float xi#[Ind] = mod(uvt#[Ind].x ,xs#[Ind])+xs#[Ind]*xid#[Ind]  ;                                   ",
                    " float yi#[Ind] = mod(uvt#[Ind].y ,ys#[Ind])+ys#[Ind]*yid#[Ind]  ;                                   ",
                    "                                                                       ",
                    " float xi2#[Ind] = mod(uvt#[Ind].x -xs#[Ind]*0.5 ,xs#[Ind])+xs#[Ind]*xid#[Ind]      ;                     ",
                    " float yi2#[Ind] = mod(uvt#[Ind].y -ys#[Ind]*0.5,ys#[Ind])+ys#[Ind]*yid#[Ind]   ;                         ",
                    "                                                                       ",
                    "                                                                       ",
                    " vec4 f#[Ind] = texture2D(" + refInd + ",vec2(xi#[Ind],yi#[Ind])) ;                             ",
                    " result =   f#[Ind] ;                                               ",
                    (option.tiled ? [" vec4 f2#[Ind] = texture2D(" + refInd + ",vec2(xi2#[Ind]+xid#[Ind] ,yi#[Ind])) ;                      ",
                        " vec4 f3#[Ind] = texture2D(" + refInd + ",vec2(xi#[Ind],yi2#[Ind]+yid#[Ind])) ;                       ",
                        " vec4 f4#[Ind] = texture2D(" + refInd + ",vec2(xi2#[Ind]+xid#[Ind],yi2#[Ind]+yid#[Ind])) ;                  ",
                        "                                                                       ",
                        "                                                                       ",
                        " float ir#[Ind]  = 0.,ir2#[Ind] = 0.;                                              ",
                        "                                                                       ",
                        "     if( yi2#[Ind]  >= yid#[Ind] *ys#[Ind] ){                                            ",
                        "         ir2#[Ind]  = min(2.,max(0.,( yi2#[Ind]-yid#[Ind] *ys#[Ind])*2.0/ys#[Ind] ))   ;             ",
                        "         if(ir2#[Ind] > 1.0) ir2#[Ind] =1.0-(ir2#[Ind]-1.0);                             ",
                        "         ir2#[Ind] = min(1.0,max(0.0,pow(ir2#[Ind]," + Shader.Print(15.) + " )*" + Shader.Print(3.) + ")); ",
                        "         result =  result *(1.0-ir2#[Ind]) +f3#[Ind]*ir2#[Ind]  ;           ",
                        "     }                                                                 ",
                        " if( xi2#[Ind]  >= xid#[Ind] *xs#[Ind]   ){                                               ",
                        "         ir2#[Ind]  = min(2.,max(0.,( xi2#[Ind]-xid#[Ind] *xs#[Ind])*2.0/xs#[Ind] ))   ;             ",
                        "         if(ir2#[Ind] > 1.0) ir2#[Ind] =1.0-(ir2#[Ind]-1.0);                             ",
                        "         ir2#[Ind] = min(1.0,max(0.0,pow(ir2#[Ind]," + Shader.Print(15.) + " )*" + Shader.Print(3.) + ")); ",
                        "         result = result *(1.0-ir2#[Ind]) +f2#[Ind]*ir2#[Ind]  ;           ",
                        "     }  ",
                        " if( xi2#[Ind]  >= xid#[Ind] *xs#[Ind]  && xi2#[Ind]  >= xid#[Ind] *xs#[Ind]  ){                                               ",
                        "         ir2#[Ind]  = min(2.,max(0.,( xi2#[Ind]-xid#[Ind] *xs#[Ind])*2.0/xs#[Ind] ))   ;             ",
                        "  float       ir3#[Ind]  = min(2.,max(0.,( yi2#[Ind]-yid#[Ind] *ys#[Ind])*2.0/ys#[Ind] ))   ;             ",
                        "         if(ir2#[Ind] > 1.0) ir2#[Ind] =1.0-(ir2#[Ind]-1.0);                             ",
                        "         if(ir3#[Ind] > 1.0) ir3#[Ind] =1.0-(ir3#[Ind]-1.0);                             ",
                        "         ir2#[Ind] = min(1.0,max(0.0,pow(ir2#[Ind]," + Shader.Print(15.) + " )*" + Shader.Print(3.) + ")); ",
                        "         ir3#[Ind] = min(1.0,max(0.0,pow(ir3#[Ind]," + Shader.Print(15.) + " )*" + Shader.Print(3.) + ")); ",
                        "         ir2#[Ind] = min(1.0,max(0.0, ir2#[Ind]* ir3#[Ind] )); ",
                        " if(nrm#[Ind].z < " + Shader.Print(option.normalLevel) + "){ ",
                        (option.alpha ? "    result =  result *(1.0-ir2#[Ind]) +f4#[Ind]* ir2#[Ind]   ;" : "    result = vec4(result.xyz*(1.0-ir2#[Ind]) +f4#[Ind].xyz* ir2#[Ind]   ,1.0); "),
                        "}",
                        "     }  "
                    ].join("\n") : "")
                ].join("\n");
            }
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.Multi = function (mats, combine) {
            combine = Shader.Def(combine, true);
            Shader.Indexer++;
            var pre = "", ps = ["", "", "", ""], psh = "0.0";
            for (var i = 0; i < mats.length; i++) {
                if (mats[i].result == undefined || mats[i].result == null)
                    mats[i] = { result: mats[i], opacity: 1.0 };
                pre += " vec4 result#[Ind]" + i + ";result#[Ind]" + i + " = vec4(0.,0.,0.,0.); float rp#[Ind]" + i + " = " + Shader.Print(mats[i].opacity) + "; \n\
";
                pre += mats[i].result + "\n\
                ";
                pre += " result#[Ind]" + i + " = result; \n\
";
                ps[0] += (i == 0 ? "" : " + ") + "result#[Ind]" + i + ".x*rp#[Ind]" + i;
                ps[1] += (i == 0 ? "" : " + ") + "result#[Ind]" + i + ".y*rp#[Ind]" + i;
                ps[2] += (i == 0 ? "" : " + ") + "result#[Ind]" + i + ".z*rp#[Ind]" + i;
                ps[3] += (i == 0 ? "" : " + ") + "result#[Ind]" + i + ".w*rp#[Ind]" + i;
                psh += "+" + Shader.Print(mats[i].opacity);
            }
            if (combine) {
                ps[0] = "(" + ps[0] + ")/(" + Shader.Print(psh) + ")";
                ps[1] = "(" + ps[1] + ")/(" + Shader.Print(psh) + ")";
                ps[2] = "(" + ps[2] + ")/(" + Shader.Print(psh) + ")";
                ps[3] = "(" + ps[3] + ")/(" + Shader.Print(psh) + ")";
            }
            pre += "result = vec4(" + ps[0] + "," + ps[1] + "," + ps[2] + "," + ps[3] + ");";
            this.Body = Shader.Def(this.Body, "");
            this.Body += Shader.Replace(pre, "#[Ind]", "_" + Shader.Indexer + "_");
            return this;
        };
        ShaderBuilder.prototype.Back = function (mat) {
            Shader.Me.Setting.Back = true;
            mat = Shader.Def(mat, '');
            this.Body = Shader.Def(this.Body, "");
            this.Body += 'if(' + ShaderMaterialHelperStatics.face_back + '){' + mat + ';}';
            return this;
        };
        ShaderBuilder.prototype.InLine = function (mat) {
            mat = Shader.Def(mat, '');
            this.Body = Shader.Def(this.Body, "");
            this.Body += mat;
            return this;
        };
        ShaderBuilder.prototype.Front = function (mat) {
            mat = Shader.Def(mat, '');
            this.Body = Shader.Def(this.Body, "");
            this.Body += 'if(' + ShaderMaterialHelperStatics.face_front + '){' + mat + ';}';
            return this;
        };
        ShaderBuilder.prototype.Range = function (mat1, mat2, option) {
            Shader.Indexer++;
            var k = Shader.Indexer;
            option.start = Shader.Def(option.start, 0.);
            option.end = Shader.Def(option.end, 1.);
            option.direction = Shader.Def(option.direction, ShaderMaterialHelperStatics.Position + '.y');
            var sresult = [
                "float s_r_dim#[Ind] = " + option.direction + ";",
                "if(s_r_dim#[Ind] > " + Shader.Print(option.end) + "){",
                mat2,
                "}",
                "else { ",
                mat1,
                "   vec4 mat1#[Ind]; mat1#[Ind]  = result;",
                "   if(s_r_dim#[Ind] > " + Shader.Print(option.start) + "){ ",
                mat2,
                "       vec4 mati2#[Ind];mati2#[Ind] = result;",
                "       float s_r_cp#[Ind]  = (s_r_dim#[Ind] - (" + Shader.Print(option.start) + "))/(" + Shader.Print(option.end) + "-(" + Shader.Print(option.start) + "));",
                "       float s_r_c#[Ind]  = 1.0 - s_r_cp#[Ind];",
                "       result = vec4(mat1#[Ind].x*s_r_c#[Ind]+mati2#[Ind].x*s_r_cp#[Ind],mat1#[Ind].y*s_r_c#[Ind]+mati2#[Ind].y*s_r_cp#[Ind],mat1#[Ind].z*s_r_c#[Ind]+mati2#[Ind].z*s_r_cp#[Ind],mat1#[Ind].w*s_r_c#[Ind]+mati2#[Ind].w*s_r_cp#[Ind]);",
                "   }",
                "   else { result = mat1#[Ind]; }",
                "}"
            ].join('\n\
');
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.Reference = function (index, mat) {
            if (Shader.Me.References == null)
                Shader.Me.References = "";
            var sresult = "vec4 resHelp#[Ind] = result;";
            if (Shader.Me.References.indexOf("," + index + ",") == -1) {
                Shader.Me.References += "," + index + ",";
                sresult += " vec4 result_" + index + " = vec4(0.);\n\
                ";
            }
            if (mat == null) {
                sresult += "  result_" + index + " = result;";
            }
            else {
                sresult += mat + "\n\
                 result_" + index + " = result;";
            }
            sresult += "result = resHelp#[Ind] ;";
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.ReplaceColor = function (index, color, mat, option) {
            Shader.Indexer++;
            option = Shader.Def(option, {});
            var d = Shader.Def(option.rangeStep, -0.280);
            var d2 = Shader.Def(option.rangePower, 0.0);
            var d3 = Shader.Def(option.colorIndex, 0.0);
            var d4 = Shader.Def(option.colorStep, 1.0);
            var ilg = Shader.Def(option.indexToEnd, false);
            var lg = " > 0.5 + " + Shader.Print(d) + " ";
            var lw = " < 0.5 - " + Shader.Print(d) + " ";
            var rr = "((result_" + index + ".x*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")>1.0 ? 0. : max(0.,(result_" + index + ".x*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
            var rg = "((result_" + index + ".y*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")>1.0 ? 0. : max(0.,(result_" + index + ".y*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
            var rb = "((result_" + index + ".z*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")>1.0 ? 0. : max(0.,(result_" + index + ".z*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
            if (ilg) {
                rr = "min(1.0, max(0.,(result_" + index + ".x*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
                rg = "min(1.0, max(0.,(result_" + index + ".y*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
                rb = "min(1.0, max(0.,(result_" + index + ".z*" + Shader.Print(d4) + "-" + Shader.Print(d3) + ")))";
            }
            var a = " && ";
            var p = " + ";
            var r = "";
            var cond = "";
            switch (color) {
                case Helper.White:
                    cond = rr + lg + a + rg + lg + a + rb + lg;
                    r = "(" + rr + p + rg + p + rb + ")/3.0";
                    break;
                case Helper.Cyan:
                    cond = rr + lw + a + rg + lg + a + rb + lg;
                    r = "(" + rg + p + rb + ")/2.0 - (" + rr + ")/1.0";
                    break;
                case Helper.Pink:
                    cond = rr + lg + a + rg + lw + a + rb + lg;
                    r = "(" + rr + p + rb + ")/2.0 - (" + rg + ")/1.0";
                    break;
                case Helper.Yellow:
                    cond = rr + lg + a + rg + lg + a + rb + lw;
                    r = "(" + rr + p + rg + ")/2.0 - (" + rb + ")/1.0";
                    break;
                case Helper.Blue:
                    cond = rr + lw + a + rg + lw + a + rb + lg;
                    r = "(" + rb + ")/1.0 - (" + rr + p + rg + ")/2.0";
                    break;
                case Helper.Red:
                    cond = rr + lg + a + rg + lw + a + rb + lw;
                    r = "(" + rr + ")/1.0 - (" + rg + p + rb + ")/2.0";
                    break;
                case Helper.Green:
                    cond = rr + lw + a + rg + lg + a + rb + lw;
                    r = "(" + rg + ")/1.0 - (" + rr + p + rb + ")/2.0";
                    break;
                case Helper.Black:
                    cond = rr + lw + a + rg + lw + a + rb + lw;
                    r = "1.0-(" + rr + p + rg + p + rb + ")/3.0";
                    break;
            }
            var sresult = " if( " + cond + " ) { vec4 oldrs#[Ind] = vec4(result);float al#[Ind] = max(0.0,min(1.0," + r + "+(" + Shader.Print(d2) + "))); float  l#[Ind] =  1.0-al#[Ind];  " + mat + " result = result*al#[Ind] +  oldrs#[Ind] * l#[Ind];    }";
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.Blue = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Blue, mat, option);
        };
        ShaderBuilder.prototype.Cyan = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Cyan, mat, option);
        };
        ShaderBuilder.prototype.Red = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Red, mat, option);
        };
        ShaderBuilder.prototype.Yellow = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Yellow, mat, option);
        };
        ShaderBuilder.prototype.Green = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Green, mat, option);
        };
        ShaderBuilder.prototype.Pink = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Pink, mat, option);
        };
        ShaderBuilder.prototype.White = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.White, mat, option);
        };
        ShaderBuilder.prototype.Black = function (index, mat, option) {
            return this.ReplaceColor(index, Helper.Black, mat, option);
        };
        ShaderBuilder.prototype.ReflectCube = function (option) {
            Shader.Indexer++;
            option = Shader.Def(option, { path: '/images/cube/a' });
            var s = Shader.Me.GetCubeMapIndex(option.path);
            if (s == -1) {
                Shader.Me.Setting.TextureCubes.push({ key: option.path, inVertex: option.useInVertex, inFragment: true });
            }
            else {
                Shader.Me.Setting.TextureCubes[s].inVertex = true;
            }
            s = Shader.Me.GetCubeMapIndex(option.path);
            option.normal = Shader.Def(option.normal, Normals.Map);
            option.alpha = Shader.Def(option.alpha, false);
            option.bias = Shader.Def(option.bias, "0.");
            option.normalLevel = Shader.Def(option.normalLevel, 1.0);
            option.rotation = Shader.Def(option.rotation, { x: 0, y: 0, z: 0 });
            option.scaleX = Shader.Def(option.scaleX, 1.);
            option.scaleY = Shader.Def(option.scaleY, 1.);
            option.useInVertex = Shader.Def(option.useInVertex, false);
            option.x = Shader.Def(option.x, 0.0);
            option.y = Shader.Def(option.y, 0.0);
            option.uv = Shader.Def(option.uv, ShaderMaterialHelperStatics.Uv);
            option.reflectMap = Shader.Def(option.reflectMap, "1.");
            Shader.Me.Setting.Center = true;
            Shader.Me.Setting.Camera = true;
            Shader.Me.Setting.ReflectMatrix = true;
            var sresult = "";
            if (option.equirectangular) {
                option.path = Shader.Def(option.path, '/images/cube/roofl1.jpg');
                var s = Shader.Me.GetMapIndex(option.path);
                if (s == -1) {
                    Shader.Me.Setting.Texture2Ds.push({ key: option.path, inVertex: option.useInVertex, inFragment: true });
                }
                else {
                    Shader.Me.Setting.Texture2Ds[s].inVertex = true;
                }
                s = Shader.Me.GetMapIndex(option.path);
                Shader.Me.Setting.VertexWorld = true;
                Shader.Me.Setting.FragmentWorld = true;
                sresult = ' vec3 nWorld#[Ind] = normalize( mat3( world[0].xyz, world[1].xyz, world[2].xyz ) *  ' + option.normal + '); ' +
                    ' vec3 vReflect#[Ind] = normalize( reflect( normalize(  ' + ShaderMaterialHelperStatics.Camera + '- vec3(world * vec4(' + ShaderMaterialHelperStatics.Position + ', 1.0))),  nWorld#[Ind] ) ); ' +
                    'float yaw#[Ind] = .5 - atan( vReflect#[Ind].z, -1.* vReflect#[Ind].x ) / ( 2.0 * 3.14159265358979323846264);  ' +
                    ' float pitch#[Ind] = .5 - atan( vReflect#[Ind].y, length( vReflect#[Ind].xz ) ) / ( 3.14159265358979323846264);  ' +
                    ' vec3 color#[Ind] = texture2D( ' + ShaderMaterialHelperStatics.Texture2D + s + ', vec2( yaw#[Ind], pitch#[Ind])' + (option.bias == null || Shader.Print(option.bias) == '0.' ? "" : "," + Shader.Print(option.bias)) + ' ).rgb; result = vec4(color#[Ind] ,1.);';
            }
            else {
                option.path = Shader.Def(option.path, "/images/cube/a");
                sresult = [
                    "vec3 viewDir#[Ind] =  " + ShaderMaterialHelperStatics.Position + " - " + ShaderMaterialHelperStatics.Camera + " ;",
                    "  viewDir#[Ind] =r_x(viewDir#[Ind] ," + Shader.Print(option.rotation.x) + ",  " + ShaderMaterialHelperStatics.Center + ");",
                    "  viewDir#[Ind] =r_y(viewDir#[Ind] ," + Shader.Print(option.rotation.y) + "," + ShaderMaterialHelperStatics.Center + ");",
                    "  viewDir#[Ind] =r_z(viewDir#[Ind] ," + Shader.Print(option.rotation.z) + "," + ShaderMaterialHelperStatics.Center + ");",
                    "vec3 coords#[Ind] = " + (option.refract ? "refract" : "reflect") + "(viewDir#[Ind]" + (option.revers ? "*vec3(1.0)" : "*vec3(-1.0)") + ", " + option.normal + " " + (option.refract ? ",(" + Shader.Print(option.refractMap) + ")" : "") + " )+" + ShaderMaterialHelperStatics.Position + "; ",
                    "vec3 vReflectionUVW#[Ind] = vec3( " + ShaderMaterialHelperStatics.ReflectMatrix + " *  vec4(coords#[Ind], 0)); ",
                    "vec3 rc#[Ind]= textureCube(" +
                        ShaderMaterialHelperStatics.TextureCube + s + ", vReflectionUVW#[Ind] " + (option.bias == null || Shader.Print(option.bias) == '0.' ? "" : "," + Shader.Print(option.bias)) + ").rgb;",
                    "result =result  + vec4(rc#[Ind].x ,rc#[Ind].y,rc#[Ind].z, " + (!option.alpha ? "1." : "(rc#[Ind].x+rc#[Ind].y+rc#[Ind].z)/3.0 ") + ")*(min(1.,max(0.," + Shader.Print(option.reflectMap) + ")));  "
                ].join('\n\
            ');
            }
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.NormalMap = function (val, mat) {
            Shader.Me.Setting.NormalOpacity = val;
            Shader.Me.Setting.NormalMap = mat;
            return this;
        };
        ShaderBuilder.prototype.SpecularMap = function (mat) {
            Shader.Me.Setting.SpecularMap = mat;
            return this;
        };
        ShaderBuilder.prototype.Instance = function () {
            var setting = Shader.Me.Setting;
            var instance = new ShaderBuilder();
            instance.Parent = Shader.Me;
            instance.Setting = setting;
            return instance;
        };
        ShaderBuilder.prototype.Reflect = function (option, opacity) {
            opacity = Shader.Def(opacity, 1.);
            return this.Multi(["result = result;", { result: this.Instance().ReflectCube(option).Build(), opacity: opacity }], true);
        };
        ShaderBuilder.prototype.Light = function (option) {
            option = Shader.Def(option, {});
            option.color = Shader.Def(option.color, { r: 1., g: 1., b: 1., a: 1. });
            option.darkColorMode = Shader.Def(option.darkColorMode, false);
            option.direction = Shader.Def(option.direction, "vec3(sin(time*0.02)*28.,sin(time*0.02)*8.+10.,cos(time*0.02)*28.)");
            option.normal = Shader.Def(option.normal, Normals.Map);
            option.rotation = Shader.Def(option.rotation, { x: 0., y: 0., z: 0. });
            option.specular = Shader.Def(option.specular, Speculars.Map);
            option.specularLevel = Shader.Def(option.specularLevel, 1.);
            option.specularPower = Shader.Def(option.specularPower, 1.);
            option.phonge = Shader.Def(option.phonge, 0.);
            option.phongePower = Shader.Def(option.phongePower, 1.);
            option.phongeLevel = Shader.Def(option.phongeLevel, 1.);
            option.supplement = Shader.Def(option.supplement, false);
            option.reducer = Shader.Def(option.reducer, '1.');
            var c_c = option.color;
            if (option.darkColorMode) {
                c_c.a = 1.0 - c_c.a;
                c_c.r = 1.0 - c_c.r;
                c_c.g = 1.0 - c_c.g;
                c_c.b = 1.0 - c_c.b;
                c_c.a = c_c.a - 1.0;
            }
            Shader.Indexer++;
            Shader.Me.Setting.Camera = true;
            Shader.Me.Setting.FragmentWorld = true;
            Shader.Me.Setting.VertexWorld = true;
            Shader.Me.Setting.Helpers = true;
            Shader.Me.Setting.Center = true;
            var sresult = Shader.Join([
                "  vec3 dir#[Ind] = normalize(  vec3(world * vec4(" + ShaderMaterialHelperStatics.Position + ",1.)) - " + ShaderMaterialHelperStatics.Camera + ");",
                "  dir#[Ind] =r_x(dir#[Ind] ," + Shader.Print(option.rotation.x) + ",vec3(" + ShaderMaterialHelperStatics.Center + "));",
                "  dir#[Ind] =r_y(dir#[Ind] ," + Shader.Print(option.rotation.y) + ",vec3(" + ShaderMaterialHelperStatics.Center + "));",
                "  dir#[Ind] =r_z(dir#[Ind] ," + Shader.Print(option.rotation.z) + ",vec3(" + ShaderMaterialHelperStatics.Center + "));",
                "  vec4 p1#[Ind] = vec4(" + option.direction + ",.0);                                ",
                "  vec4 c1#[Ind] = vec4(" + Shader.Print(c_c.r) + "," + Shader.Print(c_c.g) + "," + Shader.Print(c_c.b) + ",0.0); ",
                "  vec3 vnrm#[Ind] = normalize(vec3(world * vec4(" + option.normal + ", 0.0)));          ",
                "  vec3 l#[Ind]= normalize(p1#[Ind].xyz " +
                    (!option.parallel ? "- vec3(world * vec4(" + ShaderMaterialHelperStatics.Position + ",1.))  " : "")
                    + ");   ",
                "  vec3 vw#[Ind]= normalize(camera -  vec3(world * vec4(" + ShaderMaterialHelperStatics.Position + ",1.)));  ",
                "  vec3 aw#[Ind]= normalize(vw#[Ind]+ l#[Ind]);  ",
                "  float sc#[Ind]= max(0.,min(1., dot(vnrm#[Ind], aw#[Ind])));   ",
                "  sc#[Ind]= pow(sc#[Ind]*min(1.,max(0.," + Shader.Print(option.specular) + ")), (" + Shader.Print(option.specularPower * 1000.) + "))/" + Shader.Print(option.specularLevel) + " ;  ",
                " float  ph#[Ind]= pow(" + Shader.Print(option.phonge) + "*2., (" + Shader.Print(option.phongePower) + "*0.3333))/(" + Shader.Print(option.phongeLevel) + "*3.) ;  ",
                "  float ndl#[Ind] = max(0., dot(vnrm#[Ind], l#[Ind]));                            ",
                "  float ls#[Ind] = " + (option.supplement ? "1.0 -" : "") + "max(0.,min(1.,ndl#[Ind]*ph#[Ind]*(" + Shader.Print(option.reducer) + "))) ;         ",
                "  result  += vec4( c1#[Ind].xyz*( ls#[Ind])*" + Shader.Print(c_c.a) + " ,  ls#[Ind]); ",
                "  float ls2#[Ind] = " + (option.supplement ? "0.*" : "1.*") + "max(0.,min(1., sc#[Ind]*(" + Shader.Print(option.reducer) + "))) ;         ",
                "  result  += vec4( c1#[Ind].xyz*( ls2#[Ind])*" + Shader.Print(c_c.a) + " ,  ls2#[Ind]); ",
            ]);
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.Effect = function (option) {
            var op = Shader.Def(option, {});
            Shader.Indexer++;
            var sresult = [
                'vec4 res#[Ind] = vec4(0.);',
                'res#[Ind].x = ' + (op.px ? Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.px, 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ';' : ' result.x;'),
                'res#[Ind].y = ' + (op.py ? Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.py, 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ';' : ' result.y;'),
                'res#[Ind].z = ' + (op.pz ? Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pz, 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ';' : ' result.z;'),
                'res#[Ind].w = ' + (op.pw ? Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pw, 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ';' : ' result.w;'),
                'res#[Ind]  = ' + (op.pr ? ' vec4(' + Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pr, 'pr', 'res#[Ind].x'), 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ','
                    + Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pr, 'pr', 'res#[Ind].y'), 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w') + ',' +
                    Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pr, 'pr', 'res#[Ind].z'), 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w')
                    + ',' +
                    Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(Shader.Replace(op.pr, 'pr', 'res#[Ind].w'), 'px', 'result.x'), 'py', 'result.y'), 'pz', 'result.z'), 'pw', 'result.w')
                    + ');' : ' res#[Ind]*1.0;'),
                'result = res#[Ind] ;'
            ].join('\n\
');
            sresult = Shader.Replace(sresult, '#[Ind]', "_" + Shader.Indexer + "_");
            this.Body = Shader.Def(this.Body, "");
            this.Body += sresult;
            return this;
        };
        ShaderBuilder.prototype.IdColor = function (id, w) {
            var kg = { r: 0.0, g: 0.0, b: .0 };
            kg = Shader.torgb(id.valueOf() * 1.0, 255);
            this.Body = Shader.Def(this.Body, "");
            this.Body += 'result = vec4(' + Shader.Print(kg.r) + ',' + Shader.Print(kg.g) + ',' + Shader.Print(Math.max(kg.b, 0.0)) + ',' + Shader.Print(w) + ');';
            return this;
        };
        ShaderBuilder.prototype.Discard = function () {
            this.Body = Shader.Def(this.Body, "");
            this.Body += 'discard;';
            return this;
        };
        return ShaderBuilder;
    }());
    BABYLONX.ShaderBuilder = ShaderBuilder;
})(BABYLONX || (BABYLONX = {}));

var QI;
(function (QI) {
    /**
     * Represents Matrices in their component parts
     */
    var MatrixComp = (function () {
        /**
         * The separate components of BABYLON.Matrix
         * @param {BABYLON.Quaternion} rotation
         * @param {BABYLON.Vector3} translation
         * @param {BABYLON.Vector3} scale- optional, set to a static (1, 1, 1) when missing or equates to (1, 1, 1)
         */
        function MatrixComp(rotation, translation, scale) {
            this.rotation = rotation;
            this.translation = translation;
            // verify a scale is truly needed, when passed
            this.scale = (scale && MatrixComp.needScale(scale)) ? scale : MatrixComp.One;
        }
        /**
         * Difference of a QI.Pose to the Library's Basis (Rest) pose.  Called for each library Pose, EXCEPT Basis (would be zero anyway)
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        MatrixComp.prototype.setBasisDiffs = function (libraryBasis) {
            this.rotationBasisDiff = this.rotation.subtract(libraryBasis.rotation);
            this.translationBasisDiff = this.translation.subtract(libraryBasis.translation);
            this.scaleBasisDiff = this.scale.subtract(libraryBasis.scale);
        };
        /**
         * The relationship between this (the Basis (Rest) of a bone) to that of the pose library's version of that bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        MatrixComp.prototype.setBasisRatios = function (libraryBasis) {
            // there is no divide for Quaternion, but multiplying by Inverse is equivalent
            this.rotationBasisRatio = this.rotation.multiply(BABYLON.Quaternion.Inverse(libraryBasis.rotation));
            this.translationBasisRatio = BABYLON.Vector3.Zero();
            if (libraryBasis.translation.x !== 0)
                this.translationBasisRatio.x = this.translation.x / libraryBasis.translation.x;
            if (libraryBasis.translation.y !== 0)
                this.translationBasisRatio.y = this.translation.y / libraryBasis.translation.y;
            if (libraryBasis.translation.z !== 0)
                this.translationBasisRatio.z = this.translation.z / libraryBasis.translation.z;
            if (this.scale.equals(MatrixComp.One) && libraryBasis.scale.equals(MatrixComp.One)) {
                this.scaleBasisRatio = MatrixComp.One;
            }
            else {
                this.scaleBasisRatio = BABYLON.Vector3.Zero();
                if (libraryBasis.scale.x !== 0)
                    this.scaleBasisRatio.x = this.scale.x / libraryBasis.scale.x;
                if (libraryBasis.scale.y !== 0)
                    this.scaleBasisRatio.y = this.scale.y / libraryBasis.scale.y;
                if (libraryBasis.scale.z !== 0)
                    this.scaleBasisRatio.z = this.scale.z / libraryBasis.scale.z;
            }
        };
        /**
         * A relative target (rotation / translation / scale) is made by:
         * (Difference of each to their Basis (Rest)) * (Ratios of the Basic of the bone to library) + Basis of the bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryTarget - The value of this bone for a pose in the library.
         */
        MatrixComp.prototype.getRelativePose = function (libraryPose) {
            // when there are diffs to Basis, build realative target
            if (libraryPose.rotationBasisDiff) {
                var relRot = libraryPose.rotationBasisDiff.multiply(this.rotationBasisRatio).add(this.rotation);
                var relTrans = libraryPose.translationBasisDiff.multiply(this.translationBasisRatio).addInPlace(this.translation);
                var retScale = libraryPose.scaleBasisDiff.multiply(this.scaleBasisRatio).addInPlace(this.scale);
                return new MatrixComp(relRot, relTrans, retScale);
            }
            else {
                return this;
            }
        };
        /**
         * Recompose the components back into a matrix
         */
        MatrixComp.prototype.toMatrix = function () {
            return BABYLON.Matrix.Compose(this.scale ? this.scale : MatrixComp.One, this.rotation, this.translation);
        };
        /**
         * Equals test.
         */
        MatrixComp.prototype.equals = function (rotation, translation, scale) {
            if (!this.rotation.equals(rotation))
                return false;
            if (!this.translation.equals(translation))
                return false;
            if (!this.scale.equals(scale))
                return false;
            return true;
        };
        /**
         *
         */
        MatrixComp.fromMatrix = function (matrix) {
            var scale = new BABYLON.Vector3(0, 0, 0);
            var rotation = new BABYLON.Quaternion();
            var translation = new BABYLON.Vector3(0, 0, 0);
            matrix.decompose(scale, rotation, translation);
            return new MatrixComp(rotation, translation, scale);
        };
        MatrixComp.needScale = function (scale) {
            return Math.abs(1 - scale.x) > 0.0001 ||
                Math.abs(1 - scale.y) > 0.0001 ||
                Math.abs(1 - scale.z) > 0.0001;
        };
        return MatrixComp;
    }());
    MatrixComp.One = new BABYLON.Vector3(1, 1, 1);
    QI.MatrixComp = MatrixComp;
})(QI || (QI = {}));

/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Pose.ts"/>
var QI;
(function (QI) {
    /**
     * Instances of this class are computer generated code from Tower of Babel.  A library contains all the
     * poses designed for a skeleton.
     */
    var SkeletonPoseLibrary = (function () {
        /**
         * Non exported constructor, called by SkeletonPoseLibrary.createLibrary().
         */
        function SkeletonPoseLibrary(name, dimensionsAtRest, nameOfRoot, boneLengths) {
            this.name = name;
            this.dimensionsAtRest = dimensionsAtRest;
            this.nameOfRoot = nameOfRoot;
            this.boneLengths = boneLengths;
            this.poses = {};
            Object.freeze(this.boneLengths); // should never change
            this.nBones = Object.keys(this.boneLengths).length;
            Object.freeze(this.nBones); // should never change
            SkeletonPoseLibrary._libraries[this.name] = this;
        }
        SkeletonPoseLibrary.getLibraryByName = function (name) {
            return SkeletonPoseLibrary._libraries[name];
        };
        /**
         * Called in generated code.  If more than one library is exported with the same name, then
         * an attempt will be made to append the poses to the first reference encountered.
         */
        SkeletonPoseLibrary.createLibrary = function (name, dimensionsAtRest, nameOfRoot, boneLengths) {
            var alreadyCreated = SkeletonPoseLibrary._libraries[name];
            if (alreadyCreated) {
                // validate # of bones & lengths match
                if (Object.keys(boneLengths).length !== alreadyCreated.nBones) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  library(" + name + ") already created; # of has Bones mis-match; " + Object.keys(boneLengths).length + ", but " + alreadyCreated.nBones + " already");
                    return null;
                }
                // with # of bones the same, can just iterate thru lengths to check for match
                for (var boneName in boneLengths) {
                    if (!alreadyCreated.boneLengths[boneName]) {
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") not found in library already created");
                        return null;
                    }
                    if (alreadyCreated.boneLengths[boneName] !== boneLengths[boneName]) {
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") length mis-match in library already created");
                        return null;
                    }
                }
                return alreadyCreated;
            }
            else
                return new SkeletonPoseLibrary(name, dimensionsAtRest, nameOfRoot, boneLengths);
        };
        /**
         * Add the pose supplied by the argument.  Called by the Pose's constructor, which
         * is passed the library as a constructor arg in the generated code.
         */
        SkeletonPoseLibrary.prototype._addPose = function (pose) {
            // ensure not already added
            if (this.poses[pose.name]) {
                BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has already been added in library(" + this.name + ")");
                return;
            }
            // verify bones match; pose does not have to have all bones though
            for (var boneName in pose.targets) {
                if (!this.boneLengths[boneName]) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has Bone(" + boneName + ") not found in library(" + this.name + ")");
                    return;
                }
            }
            this.poses[pose.name] = pose;
            if (pose.isSubPose)
                BABYLON.Tools.Log("QI.SkeletonPoseLibrary:  added sub-pose (" + this.name + "." + pose.name + "), using " + Object.keys(pose.targets).length + " bones");
            else
                BABYLON.Tools.Log("QI.SkeletonPoseLibrary:  added pose (" + this.name + "." + pose.name + ")");
        };
        /**
         * @returns {string[]} the names of all poses, subposes with the '.sp' removed; primarily for UI
         */
        SkeletonPoseLibrary.prototype.getPoses = function (subPoses) {
            var ret = new Array();
            for (var poseName in this.poses) {
                if (this.poses[poseName].isSubPose && subPoses) {
                    ret.push(poseName.replace(".sp", ""));
                }
                else if (!this.poses[poseName].isSubPose && !subPoses) {
                    ret.push(poseName);
                }
            }
            return ret;
        };
        return SkeletonPoseLibrary;
    }());
    SkeletonPoseLibrary._libraries = {};
    QI.SkeletonPoseLibrary = SkeletonPoseLibrary;
})(QI || (QI = {}));

/// <reference path="./PovProcessor.ts"/>
var QI;
(function (QI) {
    /**
     * This class is used to provide a way to render at a precise frame rate, as opposed to realtime,
     * as well as system level play - pause.
     */
    var TimelineControl = (function () {
        function TimelineControl() {
        }
        /** called by PovProcessor constructor */
        TimelineControl.initialize = function (scene) {
            if (!TimelineControl._afterRenderAssigned) {
                scene.registerAfterRender(TimelineControl._manualAdvanceAfterRender);
                // built-in hooks for CocoonJS
                if (navigator.isCocoonJS) {
                    Cocoon.App.on("activated", TimelineControl.resumeSystem);
                    Cocoon.App.on("suspending", TimelineControl.pauseSystem);
                }
                TimelineControl._scene = scene;
                TimelineControl._afterRenderAssigned = true;
                BABYLON.Tools.Log("Queued Interpolation Timeline Control system initialized, version: " + QI.PovProcessor.Version);
            }
        };
        TimelineControl.change = function (isRealTime, rateIfManual) {
            if (rateIfManual === void 0) { rateIfManual = 24; }
            TimelineControl._isRealtime = isRealTime;
            TimelineControl._manualFrameRate = rateIfManual;
        };
        TimelineControl._manualAdvanceAfterRender = function () {
            // realtime elapsed & set up for "next" elapsed
            var elapsed = BABYLON.Tools.Now - TimelineControl._lastFrame;
            TimelineControl._lastFrame = BABYLON.Tools.Now;
            if (!TimelineControl._systemPaused || TimelineControl._resumeQueued) {
                TimelineControl._frameID++;
                // assign a new Now based on whether realtime or not
                if (TimelineControl._isRealtime) {
                    TimelineControl._now += elapsed * TimelineControl._speed;
                }
                else
                    TimelineControl._now += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance
                // process a resume with a good 'Now'
                // The system might not officially have been paused, rather browser tab switched & now switched back
                if (TimelineControl._resumeQueued || BABYLON.Tools.Now - TimelineControl._lastRun > TimelineControl.CHANGED_TABS_THRESHOLD) {
                    TimelineControl._systemPaused = TimelineControl._resumeQueued = false;
                    TimelineControl._systemResumeTime = TimelineControl._now;
                }
                else if (!TimelineControl._isRealtime && TimelineControl.MP4Worker) {
                    var engine = TimelineControl._scene.getEngine();
                    var screen = engine.readPixels(0, 0, engine.getRenderWidth(), engine.getRenderHeight());
                }
            }
            // always assign the privileged time, which is not subject to stopping
            if (TimelineControl._isRealtime) {
                TimelineControl._privelegedNow += elapsed * TimelineControl._speed;
            }
            else
                TimelineControl._privelegedNow += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance
            // record last time after render processed regardless of paused or not; used to detect tab change
            TimelineControl._lastRun = BABYLON.Tools.Now;
        };
        TimelineControl.sizeFor720 = function () { TimelineControl._sizeForRecording(1280, 720); };
        TimelineControl.sizeFor1080 = function () { TimelineControl._sizeForRecording(1920, 1080); };
        TimelineControl._sizeForRecording = function (width, height) {
            TimelineControl._scene.getEngine().setSize(width, height);
        };
        Object.defineProperty(TimelineControl, "manualFrameRate", {
            // =========================================== Gets ==========================================
            get: function () { return TimelineControl._manualFrameRate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "isRealtime", {
            get: function () { return TimelineControl._isRealtime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "Now", {
            get: function () { return TimelineControl._now; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "PrivilegedNow", {
            get: function () { return TimelineControl._privelegedNow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "FrameID", {
            get: function () { return TimelineControl._frameID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "Speed", {
            get: function () { return TimelineControl._speed; },
            set: function (newSpeed) {
                if (!TimelineControl._isRealtime) {
                    BABYLON.Tools.Error("TimelineControl: changing speed only supported for realtime mode");
                    return;
                }
                TimelineControl._speed = newSpeed;
                // reset the speed of all sound tracks
                var tracks = TimelineControl._scene.mainSoundTrack.soundCollection;
                for (var i = 0, len = tracks.length; i < len; i++) {
                    tracks[i].setPlaybackRate(newSpeed);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "scene", {
            get: function () { return TimelineControl._scene; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "isSystemPaused", {
            /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
            get: function () { return TimelineControl._systemPaused; },
            enumerable: true,
            configurable: true
        });
        TimelineControl.pauseSystem = function (needPrivilegedSound) {
            TimelineControl._systemPaused = true;
            // disable the audio system
            TimelineControl._scene.audioEnabled = needPrivilegedSound;
        };
        TimelineControl.resumeSystem = function () {
            // since Now is computed in an after renderer, resumes are queued. Processing a call to resumeSystem directly would have a stale 'Now'.
            TimelineControl._resumeQueued = true;
            // resume the audio system
            TimelineControl._scene.audioEnabled = true;
        };
        Object.defineProperty(TimelineControl, "SystemResumeTime", {
            get: function () { return TimelineControl._systemResumeTime; },
            enumerable: true,
            configurable: true
        });
        return TimelineControl;
    }());
    TimelineControl._isRealtime = true;
    TimelineControl._now = BABYLON.Tools.Now;
    TimelineControl._privelegedNow = BABYLON.Tools.Now;
    TimelineControl._lastRun = BABYLON.Tools.Now;
    TimelineControl._lastFrame = BABYLON.Tools.Now;
    TimelineControl._frameID = 0; // useful for new in frame detection
    TimelineControl._resumeQueued = false;
    TimelineControl._speed = 1.0; // applies only to realtime
    TimelineControl.CHANGED_TABS_THRESHOLD = 500; // milli sec
    // =================================== SYSTEM play - pause ===================================
    // pause & resume statics
    TimelineControl._systemResumeTime = 0;
    TimelineControl._systemPaused = false;
    QI.TimelineControl = TimelineControl;
})(QI || (QI = {}));


var QI;
(function (QI) {
    /**
     * See , https://msdn.microsoft.com/en-us/library/ee308751.aspx, for types.
     * This is largely based on BJS Easing.  A few do not make sense, or are not possible.
     * The static MotionEvent.LINEAR is the default for all cases where a Pace is an argument.
     */
    var Pace = (function () {
        function Pace(_mode) {
            if (_mode === void 0) { _mode = Pace.MODE_IN; }
            this._mode = _mode;
        }
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        Pace.prototype.getCompletionMilestone = function (currentDurationRatio) {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0)
                return 0;
            else if (currentDurationRatio >= 1)
                return 1;
            switch (this._mode) {
                case Pace.MODE_IN:
                    return this._compute(currentDurationRatio);
                case Pace.MODE_OUT:
                    return (1 - this._compute(1 - currentDurationRatio));
            }
            if (currentDurationRatio >= 0.5) {
                return (((1 - this._compute((1 - currentDurationRatio) * 2)) * 0.5) + 0.5);
            }
            return (this._compute(currentDurationRatio * 2) * 0.5);
        };
        /**
         * Perform the method without regard for the mode.  MUST be overridden
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        Pace.prototype._compute = function (currentDurationRatio) {
            return 0;
        };
        return Pace;
    }());
    // modes
    Pace.MODE_IN = 0;
    Pace.MODE_OUT = 1;
    Pace.MODE_INOUT = 2;
    QI.Pace = Pace;
    //================================================================================================
    var CirclePace = (function (_super) {
        __extends(CirclePace, _super);
        function CirclePace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        CirclePace.prototype._compute = function (currentDurationRatio) {
            currentDurationRatio = Math.max(0, Math.min(1, currentDurationRatio));
            return (1.0 - Math.sqrt(1.0 - (currentDurationRatio * currentDurationRatio)));
        };
        return CirclePace;
    }(Pace));
    QI.CirclePace = CirclePace;
    //================================================================================================
    var CubicPace = (function (_super) {
        __extends(CubicPace, _super);
        function CubicPace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        CubicPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return CubicPace;
    }(Pace));
    QI.CubicPace = CubicPace;
    //================================================================================================
    var ElasticPace = (function (_super) {
        __extends(ElasticPace, _super);
        function ElasticPace(oscillations, springiness, mode) {
            if (oscillations === void 0) { oscillations = 3; }
            if (springiness === void 0) { springiness = 3; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            var _this = _super.call(this, mode) || this;
            _this.oscillations = oscillations;
            _this.springiness = springiness;
            return _this;
        }
        /** @override */
        ElasticPace.prototype._compute = function (currentDurationRatio) {
            var num2;
            var num3 = Math.max(0.0, this.oscillations);
            var num = Math.max(0.0, this.springiness);
            if (num == 0) {
                num2 = currentDurationRatio;
            }
            else {
                num2 = (Math.exp(num * currentDurationRatio) - 1.0) / (Math.exp(num) - 1.0);
            }
            return (num2 * Math.sin(((6.2831853071795862 * num3) + 1.5707963267948966) * currentDurationRatio));
        };
        return ElasticPace;
    }(Pace));
    QI.ElasticPace = ElasticPace;
    //================================================================================================
    var ExponentialPace = (function (_super) {
        __extends(ExponentialPace, _super);
        function ExponentialPace(exponent, mode) {
            if (exponent === void 0) { exponent = 2; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            var _this = _super.call(this, mode) || this;
            _this.exponent = exponent;
            return _this;
        }
        /** @override */
        ExponentialPace.prototype._compute = function (currentDurationRatio) {
            if (this.exponent <= 0) {
                return currentDurationRatio;
            }
            return ((Math.exp(this.exponent * currentDurationRatio) - 1.0) / (Math.exp(this.exponent) - 1.0));
        };
        return ExponentialPace;
    }(Pace));
    QI.ExponentialPace = ExponentialPace;
    //================================================================================================
    var PowerPace = (function (_super) {
        __extends(PowerPace, _super);
        function PowerPace(power, mode) {
            if (power === void 0) { power = 2; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            var _this = _super.call(this, mode) || this;
            _this.power = power;
            return _this;
        }
        /** @override */
        PowerPace.prototype._compute = function (currentDurationRatio) {
            var y = Math.max(0.0, this.power);
            return Math.pow(currentDurationRatio, y);
        };
        return PowerPace;
    }(Pace));
    QI.PowerPace = PowerPace;
    //================================================================================================
    var QuadraticPace = (function (_super) {
        __extends(QuadraticPace, _super);
        function QuadraticPace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        QuadraticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio);
        };
        return QuadraticPace;
    }(Pace));
    QI.QuadraticPace = QuadraticPace;
    //================================================================================================
    var QuarticPace = (function (_super) {
        __extends(QuarticPace, _super);
        function QuarticPace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        QuarticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return QuarticPace;
    }(Pace));
    QI.QuarticPace = QuarticPace;
    //================================================================================================
    var QuinticPace = (function (_super) {
        __extends(QuinticPace, _super);
        function QuinticPace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        QuinticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return QuinticPace;
    }(Pace));
    QI.QuinticPace = QuinticPace;
    //================================================================================================
    var SinePace = (function (_super) {
        __extends(SinePace, _super);
        function SinePace() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** @override */
        SinePace.prototype._compute = function (currentDurationRatio) {
            return (1.0 - Math.sin(1.5707963267948966 * (1.0 - currentDurationRatio)));
        };
        return SinePace;
    }(Pace));
    QI.SinePace = SinePace;
    //================================================================================================
    var BezierCurvePace = (function (_super) {
        __extends(BezierCurvePace, _super);
        function BezierCurvePace(x1, y1, x2, y2, mode) {
            if (x1 === void 0) { x1 = 0; }
            if (y1 === void 0) { y1 = 0; }
            if (x2 === void 0) { x2 = 1; }
            if (y2 === void 0) { y2 = 1; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            var _this = _super.call(this, mode) || this;
            _this.x1 = x1;
            _this.y1 = y1;
            _this.x2 = x2;
            _this.y2 = y2;
            return _this;
        }
        /** @override */
        BezierCurvePace.prototype._compute = function (currentDurationRatio) {
            return BABYLON.BezierCurve.interpolate(currentDurationRatio, this.x1, this.y1, this.x2, this.y2);
        };
        return BezierCurvePace;
    }(Pace));
    QI.BezierCurvePace = BezierCurvePace;
    //================================================================================================
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    var SteppedPace = (function (_super) {
        __extends(SteppedPace, _super);
        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        function SteppedPace(completionRatios, durationRatios) {
            var _this = _super.call(this, Pace.MODE_IN) || this;
            _this.completionRatios = completionRatios;
            _this.durationRatios = durationRatios;
            // argument validations for JavaScript
            if (!(_this.completionRatios instanceof Array) || !(_this.durationRatios instanceof Array))
                BABYLON.Tools.Error("QI.SteppedPace: ratios not arrays");
            if (_this.completionRatios.length !== _this.durationRatios.length)
                BABYLON.Tools.Error("QI.SteppedPace: ratio arrays not of equal length");
            _this.steps = _this.completionRatios.length;
            if (_this.steps === 0)
                BABYLON.Tools.Error("QI.SteppedPace: ratio arrays cannot be empty");
            var cRatio, dRatio, prevD = -1;
            for (var i = 0; i < _this.steps; i++) {
                cRatio = _this.completionRatios[i];
                dRatio = _this.durationRatios[i];
                if (cRatio <= 0 || dRatio <= 0)
                    BABYLON.Tools.Error("QI.SteppedPace: ratios must be > 0");
                if (cRatio > 1 || dRatio > 1)
                    BABYLON.Tools.Error("QI.SteppedPace: ratios must be <= 1");
                if (prevD >= dRatio)
                    BABYLON.Tools.Error("QI.SteppedPace: durationRatios must be in increasing order");
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1)
                BABYLON.Tools.Error("QI.SteppedPace: final ratios must be 1");
            _this.incremetalCompletionBetweenSteps = [_this.completionRatios[0]]; // elements can be negative for 'hicups'
            _this.incremetalDurationBetweenSteps = [_this.durationRatios[0]];
            for (var i = 1; i < _this.steps; i++) {
                _this.incremetalCompletionBetweenSteps.push(_this.completionRatios[i] - _this.completionRatios[i - 1]);
                _this.incremetalDurationBetweenSteps.push(_this.durationRatios[i] - _this.durationRatios[i - 1]);
            }
            Object.freeze(_this); // make immutable
            return _this;
        }
        /** @override
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        SteppedPace.prototype.getCompletionMilestone = function (currentDurationRatio) {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0)
                return 0;
            else if (currentDurationRatio >= 1)
                return 1;
            var upperIdx = 0; // ends up being an index into durationRatios, 1 greater than highest obtained
            for (; upperIdx < this.steps; upperIdx++) {
                if (currentDurationRatio < this.durationRatios[upperIdx])
                    break;
            }
            var baseCompletion = (upperIdx > 0) ? this.completionRatios[upperIdx - 1] : 0;
            var baseDuration = (upperIdx > 0) ? this.durationRatios[upperIdx - 1] : 0;
            var interStepRatio = (currentDurationRatio - baseDuration) / this.incremetalDurationBetweenSteps[upperIdx];
            return baseCompletion + (interStepRatio * this.incremetalCompletionBetweenSteps[upperIdx]);
        };
        return SteppedPace;
    }(Pace));
    QI.SteppedPace = SteppedPace;
})(QI || (QI = {}));







/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store MotionEvent info & evaluate how complete it should be.
     */
    var MotionEvent = (function () {
        /**
         * Take in all the motion event info.  Movement & rotation are both optional, but both being null is usually for sub-classing.
         *
         * @param {number} _milliDuration - The number of milli seconds the event is to be completed in.
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null.
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed (optional).
         *                  flipBack-twirlClockwise-tiltRight

         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event (default false)
         *
         *      privilegedEvent - NonMotionEvents Only, when not running from a Queue:
         *                        Support for SceneTransitions, which can then system pause while running (default false)
         */
        function MotionEvent(_milliDuration, movePOV, rotatePOV, options) {
            if (rotatePOV === void 0) { rotatePOV = null; }
            this._milliDuration = _milliDuration;
            this.movePOV = movePOV;
            this.rotatePOV = rotatePOV;
            // time and state management members
            this._startTime = -1;
            this._currentDurationRatio = MotionEvent._BLOCKED;
            // misc
            this._groupName = QI.PovProcessor.POV_GROUP_NAME; // For a multi group event series.  Overridden by PoseProcessor & ShapeKeyGroup.
            this.muteSound = false; // no actual sound when in the process of recording
            // argument validations
            if (this._milliDuration <= 0) {
                BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
                return;
            }
            // Adapt options
            this.options = options || {
                millisBefore: 0,
                absoluteMovement: false,
                absoluteRotation: false,
                pace: MotionEvent.LINEAR,
                noStepWiseMovement: false,
                mirrorAxes: null,
                subposes: null,
                revertSubposes: false,
                privilegedEvent: false
            };
            this.options.millisBefore = this.options.millisBefore || 0;
            this.options.absoluteMovement = this.options.absoluteMovement || false;
            this.options.absoluteRotation = this.options.absoluteRotation || false;
            this.options.pace = this.options.pace || MotionEvent.LINEAR;
            this.options.noStepWiseMovement = this.options.noStepWiseMovement || false;
            // subclass specific
            this.options.mirrorAxes = this.options.mirrorAxes || null;
            this.options.subposes = this.options.subposes || null;
            this.options.revertSubposes = this.options.revertSubposes || false;
            // ensure values actually used for timings are initialized
            this.setProratedWallClocks(1, false);
        }
        MotionEvent.prototype.toString = function () {
            return "group: " + this._groupName +
                ", type: " + this.getClassName() +
                ", duration: " + this._milliDuration +
                ", move: " + (this.movePOV ? this.movePOV.toString() : "None") +
                ", rotate: " + (this.rotatePOV ? this.rotatePOV.toString() : "None" +
                ", sound: " + (this.options.sound ? this.options.sound.name : "None") +
                ", mustComplete event: " + (this.options.requireCompletionOf ? "Yes" : "No") +
                ", wait: " + this.options.millisBefore +
                ", non-linear pace: " + (this.options.pace !== MotionEvent.LINEAR) +
                ", absoluteMovement: " + this.options.absoluteMovement +
                ", absoluteRotation: " + this.options.absoluteRotation +
                ", noStepWiseMovement: " + this.options.noStepWiseMovement);
        };
        MotionEvent.prototype.getClassName = function () { return "PoseEvent"; };
        // =================================== run time processing ===================================
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        MotionEvent.prototype.activate = function (lateStartMilli) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            this._startTime = this._now;
            if (lateStartMilli > 0) {
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner || this.options.requireCompletionOf || (this.options.sound && !this.muteSound)) ? MotionEvent._BLOCKED :
                ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        };
        /** called to determine how much of the Event should be performed right now */
        MotionEvent.prototype.getCompletionMilestone = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE) {
                return MotionEvent._COMPLETE;
            }
            // BLOCK only occurs when there is a sync partner, prior event from different queue, or sound
            if (this._currentDurationRatio === MotionEvent._BLOCKED) {
                // check sound and prior event first
                if (this.isSoundReady() && this.isPriorComplete()) {
                    this._startTime = this._now; // reset the start clocks
                    this._currentDurationRatio = MotionEvent._SYNC_BLOCKED;
                }
                else
                    return MotionEvent._BLOCKED;
            }
            // SYNC_BLOCKED occurs after a BLOCK has been satisfied
            if (this._currentDurationRatio === MotionEvent._SYNC_BLOCKED) {
                // change both to WAITING & start clock, once both are SYNC_BLOCKED
                if (this._syncPartner) {
                    if (this._syncPartner.isSyncBlocked()) {
                        this._startTime = this._now; // reset the start clocks
                        this._syncPartner._syncReady(this._startTime);
                    }
                    else
                        return MotionEvent._SYNC_BLOCKED;
                }
                this._currentDurationRatio = MotionEvent._WAITING;
            }
            // go time, or at least time waiting from millis before
            this._millisSoFar = this._now - this._startTime;
            if (this._currentDurationRatio === MotionEvent._WAITING) {
                var overandAbove = this._millisSoFar - this._proratedMillisBefore;
                if (overandAbove >= 0) {
                    this._startTime = this._now - overandAbove; // prorate start for time served
                    this._millisSoFar = overandAbove;
                    if (this.options.sound && !this.muteSound) {
                        this.options.sound.setPlaybackRate(QI.TimelineControl.Speed);
                        this.options.sound.play();
                    }
                }
                else
                    return MotionEvent._WAITING;
            }
            this._currentDurationRatio = this._millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;
            return this.pace.getCompletionMilestone(this._currentDurationRatio);
        };
        // ================================== blocking eval methods ===================================
        /** Test to see if sound is ready.  Tolerant to sound not part of event */
        MotionEvent.prototype.isSoundReady = function () {
            return !this.options.sound || this.muteSound || this.options.sound["_isReadyToPlay"];
        };
        /** Test to see if prior event is complete.  Tolerant to prior event not part of event */
        MotionEvent.prototype.isPriorComplete = function () {
            return !this.options.requireCompletionOf || this.options.requireCompletionOf.isComplete();
        };
        // =================================== pause resume methods ===================================
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        MotionEvent.prototype.resumePlay = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE ||
                this._currentDurationRatio === MotionEvent._BLOCKED)
                return;
            var before = this._startTime;
            // back into a start time which reflects the millisSoFar
            this._startTime = this._now - this._millisSoFar;
            if (this.options.sound && !this.muteSound && this.options.sound.isPaused)
                this.options.sound.play();
        };
        MotionEvent.prototype.pause = function () {
            if (this.options.sound && !this.options.privilegedEvent)
                this.options.sound.pause();
        };
        // =================================== sync partner methods ===================================
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         * There is no need to call this on both partners, since this call sets both to each other.
         */
        MotionEvent.prototype.setSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
            syncPartner._syncPartner = this;
        };
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        MotionEvent.prototype._syncReady = function (startTime) {
            this._startTime = startTime;
            this._currentDurationRatio = MotionEvent._WAITING;
        };
        // ==================================== Getters & setters ====================================
        MotionEvent.prototype.isBlocked = function () { return this._currentDurationRatio <= MotionEvent._BLOCKED; };
        MotionEvent.prototype.isSyncBlocked = function () { return this._currentDurationRatio === MotionEvent._SYNC_BLOCKED; };
        MotionEvent.prototype.isWaiting = function () { return this._currentDurationRatio === MotionEvent._WAITING; };
        MotionEvent.prototype.isComplete = function () { return this._currentDurationRatio === MotionEvent._COMPLETE; };
        MotionEvent.prototype.isExecuting = function () { return this._currentDurationRatio > MotionEvent._READY && this._currentDurationRatio < MotionEvent._COMPLETE; };
        Object.defineProperty(MotionEvent.prototype, "milliDuration", {
            get: function () { return this._milliDuration; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "millisBefore", {
            get: function () { return this.options.millisBefore; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "pace", {
            get: function () { return this.options.pace; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "syncPartner", {
            get: function () { return this._syncPartner; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "_now", {
            get: function () { return this.options.privilegedEvent ? QI.TimelineControl.PrivilegedNow : QI.TimelineControl.Now; },
            enumerable: true,
            configurable: true
        });
        /**
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
         */
        MotionEvent.prototype.setProratedWallClocks = function (factor, isRepeat) {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = (this.millisBefore > 0 || !isRepeat) ? Math.abs(this.millisBefore) * factor : 0;
        };
        Object.defineProperty(MotionEvent, "BLOCKED", {
            get: function () { return MotionEvent._BLOCKED; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "SYNC_BLOCKED", {
            get: function () { return MotionEvent._SYNC_BLOCKED; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "WAITING", {
            get: function () { return MotionEvent._WAITING; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "READY", {
            get: function () { return MotionEvent._READY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "COMPLETE", {
            get: function () { return MotionEvent._COMPLETE; },
            enumerable: true,
            configurable: true
        });
        return MotionEvent;
    }());
    // Constants
    MotionEvent.LINEAR = new QI.SteppedPace([1.0], [1.0]);
    // ========================================== Enums  =========================================
    MotionEvent._BLOCKED = -30;
    MotionEvent._SYNC_BLOCKED = -20;
    MotionEvent._WAITING = -10;
    MotionEvent._READY = 0;
    MotionEvent._COMPLETE = 1;
    QI.MotionEvent = MotionEvent;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of MotionEvent, for the convenience of queuing delays, starting sounds capable
     */
    var Stall = (function (_super) {
        __extends(Stall, _super);
        /**
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in.
         * @param {string} groupName - The processor / queue to have the stall.  Useful for EventSeries involving multiple groups.
         * @param {BABYLON.Sound} sound - Sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        function Stall(milliDuration, groupName, sound) {
            if (groupName === void 0) { groupName = QI.PovProcessor.POV_GROUP_NAME; }
            var _this = _super.call(this, milliDuration, null, null, { sound: sound }) || this;
            _this._groupName = groupName;
            return _this;
        }
        Stall.prototype.getClassName = function () { return "Stall"; };
        return Stall;
    }(MotionEvent));
    QI.Stall = Stall;
})(QI || (QI = {}));







/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
var QI;
(function (QI) {
    /**
     * Abstract sub-class of MotionEvent, sub-classed by PropertyEvent & RecurringCallbackEvent
     */
    var NonMotionEvent = (function (_super) {
        __extends(NonMotionEvent, _super);
        function NonMotionEvent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._paused = false;
            return _this;
        }
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        NonMotionEvent.prototype.initialize = function (lateStartMilli, scene) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            this.activate(lateStartMilli);
            if (scene) {
                QI.TimelineControl.initialize(scene); // only does something the first call
                if (this.options.privilegedEvent)
                    QI.TimelineControl.pauseSystem(typeof (this.options.sound) !== "undefined"); // do not disable sound when part of transition
                var ref = this;
                this._registeredFN = function () { ref._beforeRender(); };
                scene.registerBeforeRender(this._registeredFN);
                // store scene, so can unregister
                this._scene = scene;
            }
        };
        NonMotionEvent.prototype.getClassName = function () { return "NonMotionEvent"; };
        NonMotionEvent.prototype._beforeRender = function () {
            if (!this.options.privilegedEvent) {
                if (QI.TimelineControl.isSystemPaused) {
                    if (!this._paused) {
                        this.pause();
                        this._paused = true;
                    }
                    return;
                }
                else if (this._paused) {
                    this._paused = false;
                    this.resumePlay();
                }
            }
            var ratioComplete = this.getCompletionMilestone();
            if (ratioComplete < 0)
                return; // MotionEvent.BLOCKED, Motion.SYNC_BLOCKED or MotionEvent.WAITING
            this._incrementallyUpdate(ratioComplete);
            if (this.isComplete()) {
                this.clear();
            }
        };
        /**
         * Stop / cleanup resources. Only does anything when not being added to a queue.
         */
        NonMotionEvent.prototype.clear = function () {
            if (this._scene) {
                this._paused = false;
                this._scene.unregisterBeforeRender(this._registeredFN);
                this._scene = null;
                if (this.options.privilegedEvent)
                    QI.TimelineControl.resumeSystem();
            }
            if (this._alsoCleanFunc)
                this._alsoCleanFunc();
        };
        /**
         * assign things to also be done when complete.  Used by instancers which are not sub-classing.
         * Unlike other stuff in clear(), this always runs.
         * @param {() => void} func - run in clear method as well.
         */
        NonMotionEvent.prototype.alsoClean = function (func) {
            this._alsoCleanFunc = func;
        };
        // method to be overridden
        NonMotionEvent.prototype._incrementallyUpdate = function (ratioComplete) { };
        return NonMotionEvent;
    }(QI.MotionEvent));
    QI.NonMotionEvent = NonMotionEvent;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of NonMotionEvent, for changing the property of an object
     */
    var PropertyEvent = (function (_super) {
        __extends(PropertyEvent, _super);
        /**
         * @param {Object} object - The object instance on which to make a property change
         * @param {string} _property - The name of the property to change
         * @param {any} - The final value that the property should take
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      privilegedEvent - NonMotionEvents Only, when not running from a Queue:
         *                        Support for SceneTransitions, which can then system pause while running.
         */
        function PropertyEvent(_object, _property, _targetValue, milliDuration, options) {
            var _this = _super.call(this, milliDuration, null, null, options) || this;
            _this._object = _object;
            _this._property = _property;
            _this._targetValue = _targetValue;
            if (typeof _this._targetValue === "number") {
                _this._datatype = PropertyEvent._NUMBER_TYPE;
            }
            else if (_this._targetValue instanceof BABYLON.Vector3) {
                _this._datatype = PropertyEvent._VEC3_TYPE;
            }
            else
                throw "Datatype not supported";
            return _this;
        }
        PropertyEvent.prototype.getClassName = function () { return "PropertyEvent"; };
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        PropertyEvent.prototype.initialize = function (lateStartMilli, scene) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            switch (this._datatype) {
                case PropertyEvent._NUMBER_TYPE:
                    this._initialValue = this._object[this._property];
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._initialValue = this._object[this._property].clone();
                    break;
            }
            this._initialValue = this._object[this._property];
            _super.prototype.initialize.call(this, lateStartMilli, scene);
        };
        PropertyEvent.prototype._incrementallyUpdate = function (ratioComplete) {
            switch (this._datatype) {
                case PropertyEvent._NUMBER_TYPE:
                    this._object[this._property] = this._initialValue + ((this._targetValue - this._initialValue) * ratioComplete);
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._object[this._property] = BABYLON.Vector3.Lerp(this._initialValue, this._targetValue, ratioComplete);
                    break;
            }
        };
        return PropertyEvent;
    }(NonMotionEvent));
    PropertyEvent._NUMBER_TYPE = 1;
    PropertyEvent._VEC3_TYPE = 2;
    QI.PropertyEvent = PropertyEvent;
    //================================================================================================
    //================================================================================================
    /**
     * Sub-class of NonMotionEvent, for calling a recurring callback
     */
    var RecurringCallbackEvent = (function (_super) {
        __extends(RecurringCallbackEvent, _super);
        /**
         * @param {(ratioComplete : number) => void} callback - The function to call
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      privilegedEvent - NonMotionEvents Only:
         *                        Support for SceneTransitions, which can then system pause while running.
         */
        function RecurringCallbackEvent(_callback, milliDuration, options) {
            var _this = _super.call(this, milliDuration, null, null, options) || this;
            _this._callback = _callback;
            return _this;
        }
        RecurringCallbackEvent.prototype.getClassName = function () { return "RecurringCallbackEvent"; };
        RecurringCallbackEvent.prototype._incrementallyUpdate = function (ratioComplete) {
            this._callback(ratioComplete);
        };
        return RecurringCallbackEvent;
    }(NonMotionEvent));
    QI.RecurringCallbackEvent = RecurringCallbackEvent;
})(QI || (QI = {}));







/// <reference path="./MotionEvent.ts"/>
var QI;
(function (QI) {
    /** Provide an action for an EventSeries, for integration into action manager */
    var SeriesAction = (function (_super) {
        __extends(SeriesAction, _super);
        /**
         * @param {any} triggerOptions - passed to super, same as any other Action
         * @param {SeriesTargetable} _target - The object containing the event queue.  Using an interface for MORPH sub-classing.
         * @param {EventSeries} _eSeries - The event series that the action is to submit to the queue.
         * @param {boolean} _clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} _stopCurrentSeries - When true, stop the current MotionSeries too.
         * @param {boolean} condition - passed to super, same as any other Action
         */
        function SeriesAction(triggerOptions, _target, _eSeries, _clearQueue, _stopCurrentSeries, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this._target = _target;
            _this._eSeries = _eSeries;
            _this._clearQueue = _clearQueue;
            _this._stopCurrentSeries = _stopCurrentSeries;
            return _this;
        }
        SeriesAction.prototype.execute = function (evt) {
            this._target.queueEventSeries(this._eSeries, this._clearQueue, this._stopCurrentSeries);
        };
        return SeriesAction;
    }(BABYLON.Action));
    QI.SeriesAction = SeriesAction;
    /** Internal helper class used by EventSeries to support a multi-group EventSeries */
    var ParticipatingGroup = (function () {
        function ParticipatingGroup(groupName) {
            this.groupName = groupName;
            this._indexInRun = -99; // ensure isReady() initially returns false
            this._highestIndexInRun = -1;
        }
        ParticipatingGroup.prototype.isReady = function () { return this._indexInRun === -1; };
        ParticipatingGroup.prototype.runComplete = function () { return this._indexInRun > this._highestIndexInRun; };
        ParticipatingGroup.prototype.activate = function () {
            this._indexInRun = -1;
        };
        return ParticipatingGroup;
    }());
    /**
     *  The object processed by each of the Processors.
     */
    var EventSeries = (function () {
        /**
         * Validate each of the events passed.
         * @param {Array} _events - Elements must either be a MotionEvent, Action, or function. (public for PoseProcessor)
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         * @param {string} _groupForFuncActions - should there be any functions or actions use this group to process them.  The
         *                 default group is the built-in one of BeforeRenderer.  This might always work, if you
         *                 wish the function to run after a deformation.  This never needs to be specified unless it is a QI.Mesh.
         * @param {string} _debug - Write progress messages to console when true (Default false)
         */
        function EventSeries(_events, _nRepeats, _initialWallclockProrating, _groupForFuncActions, _debug) {
            if (_nRepeats === void 0) { _nRepeats = 1; }
            if (_initialWallclockProrating === void 0) { _initialWallclockProrating = 1.0; }
            if (_groupForFuncActions === void 0) { _groupForFuncActions = QI.PovProcessor.POV_GROUP_NAME; }
            if (_debug === void 0) { _debug = false; }
            this._events = _events;
            this._nRepeats = _nRepeats;
            this._initialWallclockProrating = _initialWallclockProrating;
            this._groupForFuncActions = _groupForFuncActions;
            this._debug = _debug;
            this._partnerReady = true;
            // group elements
            this._groups = new Array();
            this._nGroups = 0;
            this._nEvents = this._events.length;
            this._prorating = this._initialWallclockProrating !== 1;
            if (this._nRepeats === 1 && this._prorating)
                BABYLON.Tools.Warn("EventSeries: clock prorating ignored when # of repeats is 1");
            // go through each event in series, building up the unique set shape key groups or skeleton participating, this._groups
            var passed;
            for (var i = 0; i < this._nEvents; i++) {
                // validate the elements in series
                passed = false;
                if (this._events[i] instanceof QI.MotionEvent)
                    passed = true;
                else if (this._events[i] instanceof BABYLON.Action)
                    passed = true;
                else if (typeof this._events[i] === "function")
                    passed = true;
                if (!passed) {
                    BABYLON.Tools.Error("EventSeries:  events must either be a MotionEvent, Action, or function.  Problem idx: " + i);
                    return;
                }
                var groupName = (this._events[i] instanceof QI.MotionEvent) ? this._events[i]._groupName : this._groupForFuncActions;
                this._addGroupAsRequired(groupName, i);
                if (this._events[i] instanceof BABYLON.Action)
                    this._events[i]._prepare();
            }
        }
        EventSeries.prototype.toString = function () {
            var ret = "number of events: " + this._nEvents + ", repeats: " + this._nRepeats + ", # groups: " + this._nGroups;
            for (var i = 0; i < this._nEvents; i++) {
                ret += "\n" + i + "- " + this._events[i].toString();
            }
            return ret;
        };
        // =========================== constructor / queuing helper methods ===========================
        /**
         * Used by constructor for each event.  The first time a particular group (skeleton / shape key group)
         * is encountered, a ParticipatingGroup object is instanced, and added to groups property.
         */
        EventSeries.prototype._addGroupAsRequired = function (groupName, eventIdx) {
            var pGroup = null;
            for (var g = 0, len = this._groups.length; g < len; g++) {
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                    break;
                }
            }
            if (pGroup === null) {
                pGroup = new ParticipatingGroup(groupName);
                this._groups.push(pGroup);
                this._nGroups++;
            }
            pGroup._highestIndexInRun = eventIdx;
        };
        /**
         * @returns {boolean} True, when more than one processor / queue is involved.
         */
        EventSeries.prototype.hasMultipleParticipants = function () {
            return this._nGroups > 1;
        };
        /**
         * called by QI.Mesh, to figure out which group this should be queued on.
         * @param {string} groupName - This is the group name to see if it has things to do in event series.
         */
        EventSeries.prototype.isGroupParticipating = function (groupName) {
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    return true;
            }
            return false;
        };
        // =============================== activation / partner methods ===============================
        /**
         * @param {EventSeries} syncPartner - EventSeries which should start at the same time as this one.
         */
        EventSeries.prototype.setSeriesSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
            this._partnerReady = false;
            syncPartner._syncPartner = this;
        };
        /**
         *  Called by the each of the syncPartners to detect that both are waiting for each other.
         */
        EventSeries.prototype._setPartnerReady = function () {
            this._syncPartner._partnerReady = true;
        };
        /**
         * Signals ready to start processing. Re-initializes incase of reuse. Also evaluates if everybodyReady, when using groups
         * @param {string} groupName - This is the group name saying it is ready.
         */
        EventSeries.prototype.activate = function (groupName) {
            this._indexInRun = -1;
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
            this._appyProrating();
            // evaluate if everybodyReady
            this._everybodyReady = true;
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    this._groups[g].activate();
                else
                    this._everybodyReady = this._everybodyReady && this._groups[g].isReady();
            }
            // if everybody ready, tell that to partner
            if (this._everybodyReady && this._syncPartner)
                this._setPartnerReady();
            if (this._debug)
                BABYLON.Tools.Log("EventSeries: series activated by " + groupName + ", _everybodyReady: " + this._everybodyReady + ", _partnerReady: " + this._partnerReady);
        };
        // ===================================== processor methods ====================================
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        EventSeries.prototype.hasMoreEvents = function () {
            return this._repeatCounter < this._nRepeats;
        };
        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         *
         */
        EventSeries.prototype.nextEvent = function (groupName) {
            // return nothing till all groups signal they are ready to start
            if (!this._everybodyReady || !this._partnerReady) {
                if (this._debug)
                    BABYLON.Tools.Log("EventSeries: nextEvent, not everybody or partner ready");
                return null;
            }
            if (this.hasMultipleParticipants()) {
                return this._nextGroupEvent(groupName);
            }
            // less complicated method when there are not coordinated events with multiple groups
            if (++this._indexInRun === this._nEvents) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    this._indexInRun = 0;
                    if (this._prorating) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    this._appyProrating();
                }
                else {
                    return null;
                }
            }
            if (this._debug)
                BABYLON.Tools.Log("EventSeries: nextEvent " + this._indexInRun + " in series returned");
            return this._events[this._indexInRun];
        };
        /**
         * apply prorating to each event, even if not prorating, so event knows it is a repeat or not
         */
        EventSeries.prototype._appyProrating = function () {
            // appy to each event each event
            for (var i = 0; i < this._nEvents; i++) {
                if (this._events[i] instanceof QI.MotionEvent) {
                    this._events[i].setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                }
            }
        };
        /**
         * more complicated method used when there are multiple groups.
         * @param {string} groupName - Name of the group calling for its next event
         *
         */
        EventSeries.prototype._nextGroupEvent = function (groupName) {
            var pGroup;
            var allGroupsRunComplete = true;
            // look up the appropriate ParticipatingGroup for below & set allGroupsRunComplete
            for (var g = 0; g < this._nGroups; g++) {
                allGroupsRunComplete = allGroupsRunComplete && this._groups[g].runComplete();
                // no break statement inside block, so allGroupsRunComplete is valid
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                }
            }
            if (allGroupsRunComplete) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    for (var g = 0; g < this._nGroups; g++) {
                        this._groups[g].activate();
                    }
                    if (this._initialWallclockProrating !== 1) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    if (this._debug)
                        BABYLON.Tools.Log("EventSeries: set for repeat # " + this._repeatCounter);
                }
                else {
                    if (this._debug)
                        console.log("EventSeries: Series complete");
                    this._everybodyReady = false; // ensure that nothing happens until all groups call activate() again
                    if (this._syncPartner)
                        this._partnerReady = false;
                }
            }
            if (!pGroup.runComplete()) {
                // test if should declare complete
                if (pGroup._indexInRun === pGroup._highestIndexInRun) {
                    pGroup._indexInRun++;
                    if (this._debug)
                        BABYLON.Tools.Log("EventSeries: group " + pGroup.groupName + " has completed series.");
                    return null;
                }
                for (var i = pGroup._indexInRun + 1; i < this._nEvents; i++) {
                    var groupName = (this._events[i] instanceof QI.MotionEvent) ? this._events[i]._groupName : this._groupForFuncActions;
                    if (pGroup.groupName === groupName) {
                        pGroup._indexInRun = i;
                        if (this._events[i] instanceof QI.MotionEvent) {
                            this._events[i].setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                        }
                        if (this._debug)
                            BABYLON.Tools.Log("EventSeries: " + i + " in series returned: " + name + ", allGroupsRunComplete " + allGroupsRunComplete + ", everybodyReady " + this._everybodyReady);
                        return this._events[i];
                    }
                }
            }
            else
                return null;
        };
        return EventSeries;
    }());
    QI.EventSeries = EventSeries;
})(QI || (QI = {}));

/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
/// <reference path="./NonMotionEvents.ts"/>
/// <reference path="./EventSeries.ts"/>
var QI;
(function (QI) {
    var PovProcessor = (function () {
        /**
         * @param {BABYLON.Node} _node - Node (mesh, camera, or spot / directional light) to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing), ignore when not mesh
         */
        function PovProcessor(_node, skipRegistration) {
            if (skipRegistration === void 0) { skipRegistration = false; }
            this._node = _node;
            this.skipRegistration = skipRegistration;
            // event series queue & reference vars for current series & step within
            this._queue = new Array();
            this._currentSeries = null;
            this._currentStepInSeries = null;
            this._endOfLastFrameTs = -1;
            this._doingRotation = false;
            this._rotationMatrix = new BABYLON.Matrix();
            // position control members
            this._doingMovePOV = false;
            // do freezeWorldMatrix (only want to do this when actual rotation / motion, not just morphing / skelatal interpolation)
            // reason being that freezeWorldMatrix wrappers a call to computeWorldMatrix, so un-neccessary refreezing defeats purpose
            this._u = false;
            this._name = PovProcessor.POV_GROUP_NAME; // for multi group event series as in MORPH; public for QI.Mesh
            // ================================== INSTANCE play - pause ==================================
            this._lastResumeTime = 0; // for passive detection of game pause
            this._instancePaused = false;
            var scene = this._node.getScene();
            QI.TimelineControl.initialize(scene); // only does something the first call
            this._isproperty = this._node === null;
            this._isMesh = (!this._isproperty) && this._node instanceof BABYLON.Mesh;
            this._isLight = (!this._isproperty) && this._node instanceof BABYLON.Light;
            this._isCamera = (!this._isproperty) && this._node instanceof BABYLON.Camera;
            // validate this node is usable
            if (this._isCamera) {
                if (!(this._node instanceof BABYLON.TargetCamera))
                    throw new Error("PovProcessor: Only TargetCamera subclasses can use Queued Interpolation");
                if (this._node.lockedTarget)
                    throw new Error("PovProcessor: Camera with a lockedTarget cannot use Queued Interpolation");
                this._rotationProperty = "rotation";
            }
            else if (this._isLight) {
                if (!this._node["position"] || !this._node["direction"])
                    throw new Error("PovProcessor: Only SpotLight & DirectionalLight can use Queued Interpolation");
                this._rotationProperty = "direction";
            }
            else if (this._isMesh) {
                this._rotationProperty = "rotation";
            }
            // tricky registering a prototype as a callback in constructor; cannot say 'this._incrementallyMove()' & must be wrappered
            var ref = this;
            // using scene level before render, so always runs & only once per frame;  non-mesh nodes, have no choice anyway
            if (!skipRegistration) {
                this._registeredFN = function () { ref._incrementallyMove(); };
                scene.registerBeforeRender(this._registeredFN);
            }
        }
        /**
         * Not automatically called.  A QI.Mesh uses its own, so not problem there.
         */
        PovProcessor.prototype.dispose = function () {
            this._node.getScene().unregisterBeforeRender(this._registeredFN);
        };
        // =================================== inside before render ==================================
        /**
         * beforeRender() registered to scene for this._node.  Public for sub-classing in QI.ShapekeyGroup.
         */
        PovProcessor.prototype._incrementallyMove = function () {
            // test for active instance pausing, either instance of entire system
            if (this._instancePaused || QI.TimelineControl.isSystemPaused) {
                if (this._currentStepInSeries)
                    this._currentStepInSeries.pause();
                return;
            }
            // system resume test
            if (this._lastResumeTime < QI.TimelineControl.SystemResumeTime) {
                this._lastResumeTime = QI.TimelineControl.SystemResumeTime;
                this.resumeInstancePlay(); // does nothing when this._currentStepInSeries === null
            }
            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents()) {
                if (!this._nextEventSeries())
                    return;
            }
            // ok, have an active event series, now get the next motion event in series if required
            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete()) {
                var next = this._currentSeries.nextEvent(this._name);
                // being blocked, not ready for us, only occurs in a multi-group series in MORPH
                if (next === null)
                    return;
                if (next instanceof BABYLON.Action && this._isMesh) {
                    next.execute(BABYLON.ActionEvent.CreateNew(this._node));
                }
                else if (typeof (next) === "function") {
                    next.call();
                }
                else {
                    this._nextEvent(next); // must be a new MotionEvent. _currentStepInSeries assigned if valid
                }
            }
            // ok, have a motion event to process
            try {
                this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
                if (this._ratioComplete < 0)
                    return; // MotionEvent.BLOCKED, Motion.SYNC_BLOCKED or MotionEvent.WAITING
                // not used in here, but in ShapeKeyGroup
                this._runOfStep++;
                // processing of a NonMotionEvent
                if (this._currentStepInSeries instanceof QI.NonMotionEvent) {
                    this._currentStepInSeries._incrementallyUpdate(this._ratioComplete);
                    return;
                }
                if (this._doingRotation) {
                    PovProcessor.LerpToRef(this._rotationStart, this._rotationEnd, this._ratioComplete, this._node[this._rotationProperty]);
                }
                if (this._doingMovePOV) {
                    if (this._doingRotation && !this._currentStepInSeries.options.noStepWiseMovement && !this._currentStepInSeries.options.absoluteMovement) {
                        // some of these amounts, could be negative, if has a Pace with a hiccup
                        var amtRight = (this._fullAmtRight * this._ratioComplete) - this._amtRightSoFar;
                        var amtUp = (this._fullAmtUp * this._ratioComplete) - this._amtUpSoFar;
                        var amtForward = (this._fullAmtForward * this._ratioComplete) - this._amtForwardSoFar;
                        this.movePOV(amtRight, amtUp, amtForward);
                        this._amtRightSoFar += amtRight;
                        this._amtUpSoFar += amtUp;
                        this._amtForwardSoFar += amtForward;
                    }
                    else {
                        PovProcessor.LerpToRef(this._positionStartVec, this._positionEndVec, this._ratioComplete, this._node["position"]);
                    }
                    if (this._activeLockedCamera !== null)
                        this._activeLockedCamera._getViewMatrix();
                }
            }
            finally {
                this._endOfLastFrameTs = QI.TimelineControl.Now;
            }
        };
        // ============================ Event Series Queueing & retrieval ============================
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        PovProcessor.prototype.queueEventSeries = function (eSeries, clearQueue, stopCurrentSeries) {
            if (clearQueue)
                this.clearQueue(stopCurrentSeries);
            this._queue.push(eSeries);
        };
        /**
         * Place this series next to be run.
         */
        PovProcessor.prototype.insertSeriesInFront = function (eSeries) {
            this._queue.splice(0, 0, eSeries);
        };
        /**
         * @param {number} _nRepeats - Number of times to run through series elements.
         */
        PovProcessor.prototype.queueSingleEvent = function (event, nRepeats) {
            if (nRepeats === void 0) { nRepeats = 1; }
            this.queueEventSeries(new QI.EventSeries([event], nRepeats));
        };
        /**
         * Clear out any events
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        PovProcessor.prototype.clearQueue = function (stopCurrentSeries) {
            this._queue = new Array();
            if (stopCurrentSeries)
                this._currentSeries = null;
        };
        /**
         * Stop current activities.
         * @param {boolean} step - When true, stop the current MotionEvent.
         * @param {boolean} series - When true, stop the current MotionSeries.  Note this will also stop
         * the current step.
         */
        PovProcessor.prototype.stopCurrent = function (step, series) {
            if (step)
                this._currentStepInSeries = null;
            if (series)
                this._currentSeries = null;
        };
        PovProcessor.prototype._nextEventSeries = function () {
            // finish all events no matter what, but do not start a new one unless node is enabled, and rendered at least once
            var ret = this._queue.length > 0 && this._node.isEnabled() && this._node._currentRenderId !== -1;
            if (ret) {
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name);
            }
            else
                this._currentSeries = null;
            // clean out current step in any case, aids unnecessary resumePlay of a completed step
            this._currentStepInSeries = null;
            return ret;
        };
        /** returns true when either something is running (could be blocked or waiting) or something queued */
        PovProcessor.prototype.isActive = function () {
            return this._currentSeries !== null || this._queue.length > 0;
        };
        /**
         * primarily for diagnostic purposes
         */
        PovProcessor.prototype.getQueueState = function () {
            var ret = this._name + " queue state:  number series queued: " + this._queue.length;
            if (this._node instanceof QI.Mesh) {
                ret += ", paused : " + this._node.isPaused();
                ret += ", mesh visible : " + this._node.isVisible;
            }
            for (var i = 0, len = this._queue.length; i < len; i++) {
                ret += "\n\tSeries " + i + "- " + this._queue[i].toString();
            }
            if (this._currentSeries) {
                ret += "\n\n\t Current processing: \n" + this._currentSeries.toString();
            }
            return ret;
        };
        // ======================================== event prep =======================================
        /**
         * Public for sub-classing in PoseProcessor & ShapeKeyGroup.
         * @param {MotionEvent} event - The event processed and assigned the current step
         * @param {BABYLON.Vector3} movementScaling - Passed by PoseProcessor sub-class, multiplier to account for
         * the skeleton being different from the one used to build the skeleton library; optional
         */
        PovProcessor.prototype._nextEvent = function (event, movementScaling) {
            if (movementScaling === void 0) { movementScaling = null; }
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = QI.TimelineControl.isRealtime ? QI.TimelineControl.Now - this._endOfLastFrameTs : 0;
            event.activate((lateStart - this._endOfLastFrameTs < PovProcessor.MAX_MILLIS_FOR_EVENT_LATE_START && !this._currentSeries.hasMultipleParticipants()) ? lateStart : 0);
            this._currentStepInSeries = event;
            // initialize a NonMotionEvent event, so any queue can process them
            if (event instanceof QI.NonMotionEvent) {
                event.initialize(lateStart);
            }
            // prepare for rotation, if event calls for
            this._doingRotation = event.rotatePOV !== null;
            if (this._doingRotation) {
                this._rotationStart = this._node[this._rotationProperty].clone();
                this._rotationEnd = event.options.absoluteRotation ? event.rotatePOV : this._rotationStart.add(this.calcRotatePOV(event.rotatePOV.x, event.rotatePOV.y, event.rotatePOV.z));
            }
            // prepare for POV move, if event calls for
            this._doingMovePOV = event.movePOV !== null;
            if (this._doingMovePOV) {
                var movePOV = event.movePOV;
                if (movementScaling)
                    movePOV = movePOV.multiply(movementScaling);
                this._positionStartVec = this._node["position"].clone();
                this._fullAmtRight = movePOV.x;
                this._amtRightSoFar = 0;
                this._fullAmtUp = movePOV.y;
                this._amtUpSoFar = 0;
                this._fullAmtForward = movePOV.z;
                this._amtForwardSoFar = 0;
                // less resources to calcMovePOV() once then Lerp(), but calcMovePOV() uses rotation, so can only go fast when not rotating too
                if (!this._doingRotation || event.options.noStepWiseMovement || event.options.absoluteMovement) {
                    this._positionEndVec = event.options.absoluteMovement ? event.movePOV : this._positionStartVec.add(this.calcMovePOV(this._fullAmtRight, this._fullAmtUp, this._fullAmtForward));
                }
            }
            // determine if camera needs to be woke up for tracking
            this._activeLockedCamera = null; // assigned for failure
            if ((this._doingRotation || this._doingMovePOV) && this._isMesh) {
                var activeCamera = this._node.getScene().activeCamera;
                // TargetCamera uses lockedTarget & ArcRotateCamera uses target, so must test both
                var target = activeCamera.lockedTarget || activeCamera.target;
                if (target && target === this._node)
                    this._activeLockedCamera = activeCamera;
            }
            // will not be changed until any wait or block is done
            this._runOfStep = 0;
        };
        // ================================== Point of View Movement =================================
        /**
         * Perform relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the node's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        PovProcessor.prototype.movePOV = function (amountRight, amountUp, amountForward) {
            this._node["position"].addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
        };
        /**
         * Calculate relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the nodes's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        PovProcessor.prototype.calcMovePOV = function (amountRight, amountUp, amountForward) {
            var rot = this._node[this._rotationProperty];
            BABYLON.Matrix.RotationYawPitchRollToRef(rot.y, rot.x, rot.z, this._rotationMatrix);
            var translationDelta = BABYLON.Vector3.Zero();
            var defForwardMult = this._isMesh ? (this._node.definedFacingForward ? -1 : 1) : 1;
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, this._rotationMatrix, translationDelta);
            return translationDelta;
        };
        // ================================== Point of View Rotation =================================
        /**
         * Perform relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        PovProcessor.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var amt = this.calcRotatePOV(flipBack, twirlClockwise, tiltRight);
            this._node[this._rotationProperty].addInPlace(amt);
        };
        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        PovProcessor.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var defForwardMult = this._isMesh ? (this._node.definedFacingForward ? 1 : -1) : 1;
            return new BABYLON.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        };
        PovProcessor.prototype.isInstancePaused = function () { return this._instancePaused; };
        PovProcessor.prototype.pauseInstance = function () { this._instancePaused = true; };
        PovProcessor.prototype.resumeInstancePlay = function () {
            this._lastResumeTime = QI.TimelineControl.Now;
            this._instancePaused = false;
            // cause Event in progress to calibrate for smooth resume
            if (this._currentStepInSeries !== null)
                this._currentStepInSeries.resumePlay();
        };
        Object.defineProperty(PovProcessor, "Version", {
            // ========================================= Statics =========================================
            get: function () {
                return "1.1.0 Beta";
            },
            enumerable: true,
            configurable: true
        });
        PovProcessor.LerpToRef = function (start, end, amount, result) {
            result.x = start.x + ((end.x - start.x) * amount);
            result.y = start.y + ((end.y - start.y) * amount);
            result.z = start.z + ((end.z - start.z) * amount);
        };
        PovProcessor.SlerpToRef = function (left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
            return result;
        };
        PovProcessor.formatQuat = function (d) {
            return "{X: " + d.x.toFixed(4) + " Y:" + d.y.toFixed(4) + " Z:" + d.z.toFixed(4) + " W:" + d.w.toFixed(4) + "}";
        };
        return PovProcessor;
    }());
    PovProcessor.POV_GROUP_NAME = "POV_PROCESSOR";
    PovProcessor.MAX_MILLIS_FOR_EVENT_LATE_START = 50;
    QI.PovProcessor = PovProcessor;
})(QI || (QI = {}));

/// <reference path="./MatrixComp.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>






/// <reference path="../../queue/PovProcessor.ts"/>
var QI;
(function (QI) {
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * Argument signature same as that of parent, BABYLON.Bone, except restPose IS NOT optional here.
         */
        function Bone(name, skeleton, parentBone, matrix, restPose) {
            var _this = _super.call(this, name, skeleton, parentBone, matrix, restPose) || this;
            // permanent variable (temporary) values to reduce # of start & end computations, & eliminate garbage generation
            _this._startScale = new BABYLON.Vector3(0, 0, 0);
            _this._startRotation = new BABYLON.Quaternion();
            _this._startTranslation = new BABYLON.Vector3(0, 0, 0);
            _this._resultScale = new BABYLON.Vector3(0, 0, 0);
            _this._resultRotation = new BABYLON.Quaternion();
            _this._resultTranslation = new BABYLON.Vector3(0, 0, 0);
            _this._rotationMatrix = new BABYLON.Matrix();
            _this._restComp = QI.MatrixComp.fromMatrix(restPose);
            return _this;
        }
        /** called by Skeleton.assignPoseLibrary() to compare Basis (Rest) to that of the library, to keep it out of assignPose() */
        Bone.prototype.assignPoseLibrary = function (library) {
            this._restComp.setBasisRatios(library.poses["basis"].targets[this.name]);
        };
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        /** called by Pose.assignPose(), when bone is potentially changed by the pose (could already be at this setting)
         */
        Bone.prototype._assignPose = function (targetValue, immediately) {
            this._rel_target = this._restComp.getRelativePose(targetValue);
            // decompose the current state (local)
            this.getLocalMatrix().decompose(this._startScale, this._startRotation, this._startTranslation);
            this._alreadyAtTarget = this._rel_target.equals(this._startRotation, this._startTranslation, this._startScale) && !this.getParent();
            if (!this._alreadyAtTarget) {
                if (immediately) {
                    this._incrementallyDeform(1.0);
                }
            }
        };
        /**
         * Called by Pose._assignPose(), when bone is not even changed by the pose
         */
        Bone.prototype._setAlreadyAtTarget = function () { this._alreadyAtTarget = true; };
        /**
         * Called by this._assignPose() when immediate & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        Bone.prototype._incrementallyDeform = function (ratioComplete) {
            if (this._alreadyAtTarget)
                return;
            QI.PovProcessor.LerpToRef(this._startScale, this._rel_target.scale, ratioComplete, this._resultScale);
            QI.PovProcessor.SlerpToRef(this._startRotation, this._rel_target.rotation, ratioComplete, this._resultRotation);
            QI.PovProcessor.LerpToRef(this._startTranslation, this._rel_target.translation, ratioComplete, this._resultTranslation);
            // compose result back into local
            var local = this.getLocalMatrix();
            local.m[0] = this._resultScale.x;
            local.m[1] = 0;
            local.m[2] = 0;
            local.m[3] = 0;
            local.m[4] = 0;
            local.m[5] = this._resultScale.y;
            local.m[6] = 0;
            local.m[7] = 0;
            local.m[8] = 0;
            local.m[9] = 0;
            local.m[10] = this._resultScale.z;
            local.m[11] = 0;
            local.m[12] = 0;
            local.m[13] = 0;
            local.m[14] = 0;
            local.m[15] = 1;
            BABYLON.Matrix.IdentityToRef(this._rotationMatrix);
            this._resultRotation.toRotationMatrix(this._rotationMatrix);
            local.multiplyToRef(this._rotationMatrix, local);
            local.setTranslation(this._resultTranslation);
            this.markAsDirty();
        };
        return Bone;
    }(BABYLON.Bone));
    QI.Bone = Bone;
})(QI || (QI = {}));

/// <reference path="./Bone.ts"/>
/// <reference path="./Pose.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>






var QI;
(function (QI) {
    var Skeleton = (function (_super) {
        __extends(Skeleton, _super);
        function Skeleton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._subPoses = new Array();
            return _this;
        }
        // no constructor required, using super's
        /** called by the PoseProcessor constructor; all bones should have been added by now */
        Skeleton.prototype.validateSkeleton = function () {
            var nBones = this.bones.length;
            var nRootBones = 0;
            for (var i = 0; i < nBones; i++) {
                var bone = this.bones[i];
                if (!bone.getParent())
                    nRootBones++;
                // verify only one root & all bones instance of QI.Bone
                if (!(bone instanceof QI.Bone)) {
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", Bone(" + bone.name + ") is not a QI.Bone");
                    return false;
                }
            }
            if (nRootBones !== 1) {
                BABYLON.Tools.Error("QI.Skeleton:  " + this.name + " has more than 1 bone without a parent");
                return false;
            }
            return true;
        };
        // =================================== Library assignment ====================================
        /** Only one library can be assigned to a library at a time.
         *  Validation of compatiblity, and pre-processing for scaling differences performed.
         *  No effect, if already assigned to that library.
         *  @param {string} libraryName - name of the library to assign; no effect if already assigned
         */
        Skeleton.prototype.assignPoseLibrary = function (libraryName) {
            if (this._poseLibrary && this._poseLibrary.name === libraryName)
                return;
            var library = QI.SkeletonPoseLibrary.getLibraryByName(libraryName);
            if (!library) {
                BABYLON.Tools.Error("QI.Skeleton:  library(" + libraryName + ") not found");
            }
            else if (this._validateLibraryForSkeleton(library)) {
                this._poseLibrary = library;
                this.clearAllSubPoses();
                // scaling pre-processing
                this._skelDimensionsRatio = this.dimensionsAtRest.divide(this._poseLibrary.dimensionsAtRest);
                // test if dimensions all the same, if so better performance setting to null
                if (this._skelDimensionsRatio.x === 1 && this._skelDimensionsRatio.y === 1 && this._skelDimensionsRatio.z === 1) {
                    this._skelDimensionsRatio = null;
                }
                for (var i = 0, len = this.bones.length; i < len; i++) {
                    this.bones[i].assignPoseLibrary(this._poseLibrary);
                }
            }
        };
        /** Method which does the validation that this library is compatible
         *  @param {SkeletonPoseLibrary} library - The candidate library
         *  @returns {boolean} - True when valid
         */
        Skeleton.prototype._validateLibraryForSkeleton = function (library) {
            var nBones = this.bones.length;
            if (Object.keys(library.boneLengths).length !== nBones) {
                BABYLON.Tools.Error("QI.Skeleton:  library(" + library.name + ") has incorrect # of bones; " + nBones + " in skeleton " + library.nBones + " in library");
                return false;
            }
            // verify bone matches one in library
            for (var i = 0; i < nBones; i++) {
                var bone = this.bones[i];
                if (!library.boneLengths[bone.name]) {
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", has Bone(" + bone.name + ") not found in library");
                    return false;
                }
            }
            return true;
        };
        // ====================================== pose methods =====================================
        /**
         * Should not be call here, but through the mesh so that the processor can note the change.
         * @param {string} poseName - The name in the library of the pose.
         */
        Skeleton.prototype._assignPoseImmediately = function (poseName) {
            var pose = this._poseLibrary.poses[poseName];
            if (pose) {
                pose._assignPose(this, true);
            }
            else {
                BABYLON.Tools.Error("QI.Skeleton:  pose(" + poseName + ") not found");
            }
        };
        /**
         * Derive the current state of the skeleton as a new Pose in the library.
         * @param {string} name - What the new Pose is to be called.
         * @returns {Pose} The new Pose Object
         */
        Skeleton.prototype.currentStateAsPose = function (name) {
            var basis = this._poseLibrary.poses["basis"];
            var targets = {};
            for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                targets[this.bones[i].name] = this.bones[i].getLocalMatrix().clone();
            }
            return new QI.Pose(name, this._poseLibrary, targets);
        };
        // ==================================== sub-pose methods ===================================
        /**
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        Skeleton.prototype.addSubPose = function (poseName) {
            // check sub-pose has not already been added
            for (var i = 0, len = this._subPoses.length; i < len; i++) {
                if (this._subPoses[i].name === poseName)
                    return;
            }
            var subPose = this._poseLibrary ? this._poseLibrary.poses[poseName] : null;
            if (!subPose)
                BABYLON.Tools.Error("QI.Skeleton:  sub-pose(" + poseName + ") not found");
            else if (!subPose.isSubPose)
                BABYLON.Tools.Error("QI.Skeleton:  pose(" + subPose.name + ") is not a sub-pose");
            else
                this._subPoses.push(subPose);
        };
        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        Skeleton.prototype.removeSubPose = function (poseName) {
            for (var i = 0; i < this._subPoses.length; i++) {
                if (this._subPoses[i].name === poseName) {
                    this._subPoses.splice(i, 1);
                    return;
                }
            }
        };
        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        Skeleton.prototype.clearAllSubPoses = function () {
            this._subPoses = new Array();
        };
        return Skeleton;
    }(BABYLON.Skeleton));
    QI.Skeleton = Skeleton;
})(QI || (QI = {}));

/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
var QI;
(function (QI) {
    var Pose = (function () {
        /**
         * @immutable, to be reused across skeletons
         * This is instanced by computer generated code.
         * @param {string} name- The name of the pose given in the Blender skeleton library.  A sub-pose is
         *                 detected by having a '.sp' as part of the name, typically a suffix.
         *
         * @param {SkeletonPoseLibrary} library- The instance of the QI.SkeletonPoseLibrary to add itself to
         * @param {[boneName: string] : BABYLON.Matrix} targets - A dictionary of matrices of the bones that
         *                                              particpate in this pose.
         */
        function Pose(name, library, targets) {
            this.name = name;
            this.library = library;
            this.targets = {};
            for (var boneName in targets) {
                this.targets[boneName] = QI.MatrixComp.fromMatrix(targets[boneName]);
            }
            // library would like to know is this is a sub-pose, so determine before adding
            this.isSubPose = name.indexOf(".sp") != -1;
            this.library._addPose(this);
            if (this.isSubPose && Object.keys(this.targets).length === library.nBones) {
                BABYLON.Tools.Error("QI.Pose:  sub-pose(" + this.name + "), must have fewer bones than found in library(" + library.name + ")");
                return;
            }
            if (name !== "basis") {
                var basis = this.library.poses["basis"].targets;
                for (var boneName in basis) {
                    // add back any targets from basis pose in library, which are missing; except root bone or sub-poses
                    if (boneName === this.library.nameOfRoot)
                        continue;
                    if (!this.targets[boneName]) {
                        if (!this.isSubPose) {
                            this.targets[boneName] = basis[boneName];
                        }
                    }
                    else {
                        // get the ratio of the Basis (Rest) pose
                        this.targets[boneName].setBasisDiffs(basis[boneName]);
                        if (name === "sitting2") {
                            console.log(boneName + ": " + this.targets[boneName].rotationBasisDiff.toString());
                        }
                    }
                }
            }
            // freeze everything to make immutable
            for (var boneName in this.targets) {
                var target = this.targets[boneName];
                // Object.freeze(target.m); you cannot freeze Typed Arrays
                Object.freeze(target);
            }
            Object.freeze(this);
        }
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        Pose.prototype._assignPose = function (skeleton, immediately) {
            // merge the bone targets of any skeleton sub-poses, if they exist
            var targets = (skeleton._subPoses.length > 0) ? this._mergeSubPoses(skeleton._subPoses) : this.targets;
            for (var i = 0, len = skeleton.bones.length; i < len; i++) {
                var bone = skeleton.bones[i];
                var target = targets[bone.name];
                if (target) {
                    bone._assignPose(target, immediately);
                }
                else
                    bone._setAlreadyAtTarget();
            }
        };
        Pose.prototype._mergeSubPoses = function (subPoses) {
            var targets = {};
            for (var boneName in this.targets) {
                targets[boneName] = this.targets[boneName];
            }
            // subPoses applied second, which will over write bone targets from this pose
            for (var i = 0, len = subPoses.length; i < len; i++) {
                for (var boneName in subPoses[i].targets) {
                    targets[boneName] = subPoses[i].targets[boneName];
                }
            }
            return targets;
        };
        return Pose;
    }());
    QI.Pose = Pose;
})(QI || (QI = {}));

/// <reference path="./Pose.ts"/>






/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    var PoseEvent = (function (_super) {
        __extends(PoseEvent, _super);
        /**
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {string[]} subposes - sub-poses which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any sub-poses should actually be subtracted during event(default false)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         */
        function PoseEvent(poseName, milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            var _this = _super.call(this, milliDuration, movePOV, rotatePOV, options) || this;
            _this.poseName = poseName;
            _this._groupName = QI.PoseProcessor.INTERPOLATOR_GROUP_NAME;
            return _this;
        }
        // ==================================== Getters & setters ====================================
        PoseEvent.prototype.toString = function () {
            var ret = "Pose- " + this.poseName + ", ";
            if (this.options.subposes && this.options.subposes.length > 0) {
                ret += "Subposes- [";
                for (var i = 0, len = this.options.subposes.length; i < len; i++) {
                    ret += " " + this.options.subposes[i];
                }
                ret += "], revertSubposes- " + this.options.revertSubposes + ", ";
            }
            return ret + _super.prototype.toString.call(this);
        };
        PoseEvent.prototype.getClassName = function () { return "PoseEvent"; };
        return PoseEvent;
    }(QI.MotionEvent));
    QI.PoseEvent = PoseEvent;
})(QI || (QI = {}));

/// <reference path="./Pose.ts"/>
/// <reference path="./PoseEvent.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>






/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/EventSeries.ts"/>
var QI;
(function (QI) {
    var PoseProcessor = (function (_super) {
        __extends(PoseProcessor, _super);
        function PoseProcessor(_skeleton, parentMesh, skipRegistration) {
            var _this = _super.call(this, parentMesh, skipRegistration) || this;
            _this._skeleton = _skeleton;
            _this._lastPoseRun = "basis"; // only public for Pose
            _this._name = PoseProcessor.INTERPOLATOR_GROUP_NAME; // override dummy
            var nBones = _this._skeleton.bones.length;
            _this._skeleton.validateSkeleton();
            return _this;
        }
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * SkeletonInterpolator is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         */
        PoseProcessor.prototype.incrementallyDeform = function () {
            _super.prototype._incrementallyMove.call(this);
            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a SkeletalDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof QI.PoseEvent))
                return false;
            this._lastPoseRun = this._currentStepInSeries.poseName;
            if (this._ratioComplete < 0)
                return false; // MotionEvent.BLOCKED or MotionEvent.WAITING
            for (var i = 0, nBones = this._skeleton.bones.length; i < nBones; i++) {
                this._skeleton.bones[i]._incrementallyDeform(this._ratioComplete);
            }
            return true;
        };
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        PoseProcessor.prototype.getLastPoseNameQueuedOrRun = function () {
            // check the queue first for the last pose set to run
            var lastPose;
            for (var i = this._queue.length - 1; i >= 0; i--) {
                lastPose = this._getLastPoseEventInSeries(this._queue[i]);
                if (lastPose)
                    return lastPose;
            }
            // queue could be empty, return last of current series if exists
            if (this._currentSeries) {
                lastPose = this._getLastPoseEventInSeries(this._currentSeries);
                if (lastPose)
                    return lastPose;
            }
            // nothing running or queued; return last recorded
            return this._lastPoseRun;
        };
        PoseProcessor.prototype._getLastPoseEventInSeries = function (series) {
            var events = series._events;
            for (var i = events.length - 1; i >= 0; i--) {
                if (events[i] instanceof QI.PoseEvent)
                    return events[i].poseName;
            }
            return null;
        };
        // ======================================== event prep =======================================
        /** called by super._incrementallyMove()
         */
        PoseProcessor.prototype._nextEvent = function (event) {
            var movementScaling;
            // is possible to have a MotionEvent(with no deformation), not SkeletalDeformation sub-class
            if (event instanceof QI.PoseEvent) {
                var poseEvent = event;
                var pose = this._skeleton._poseLibrary.poses[poseEvent.poseName];
                if (pose) {
                    // sub-pose addition / substraction
                    if (poseEvent.options.subposes) {
                        for (var i = 0, len = poseEvent.options.subposes.length; i < len; i++) {
                            if (poseEvent.options.revertSubposes)
                                this._skeleton.removeSubPose(poseEvent.options.subposes[i]);
                            else
                                this._skeleton.addSubPose(poseEvent.options.subposes[i]);
                        }
                    }
                    pose._assignPose(this._skeleton);
                }
                else if (poseEvent.poseName !== null) {
                    BABYLON.Tools.Error("PoseProcessor:  pose(" + poseEvent.poseName + ") not found");
                    return;
                }
            }
            _super.prototype._nextEvent.call(this, event, this._skeleton._skelDimensionsRatio);
        };
        return PoseProcessor;
    }(QI.PovProcessor));
    PoseProcessor.INTERPOLATOR_GROUP_NAME = "SKELETON";
    QI.PoseProcessor = PoseProcessor;
})(QI || (QI = {}));







/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    var VertexDeformation = (function (_super) {
        __extends(VertexDeformation, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} _referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array<string>} _endStateNames - Names of state keys to deform to
         * @param {Array} _endStateRatios - ratios of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1's)
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         */
        function VertexDeformation(groupName, _referenceStateName, _endStateNames, _endStateRatios, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (_endStateRatios === void 0) { _endStateRatios = null; }
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            var _this = _super.call(this, milliDuration, movePOV, rotatePOV, options) || this;
            _this._referenceStateName = _referenceStateName;
            _this._endStateNames = _endStateNames;
            _this._endStateRatios = _endStateRatios;
            if (!(_this._endStateNames instanceof Array) || (_this._endStateRatios !== null && !(_this._endStateRatios instanceof Array))) {
                BABYLON.Tools.Error("VertexDeformation: end states / ratios not an array");
                return _this;
            }
            var nEndStates = _this._endStateNames.length;
            if (_this._endStateRatios !== null) {
                if (_this._endStateRatios.length !== nEndStates) {
                    BABYLON.Tools.Error("VertexDeformation: end states / ratios not same length");
                    return _this;
                }
            }
            // mixed case group & state names not supported
            _this._groupName = groupName.toUpperCase();
            _this._referenceStateName = _this._referenceStateName.toUpperCase();
            // skip remaining test when is BasisReturn
            if (_this instanceof BasisReturn)
                return _this;
            for (var i = 0; i < nEndStates; i++) {
                _this._endStateNames[i] = _this._endStateNames[i].toUpperCase();
                if (_this._referenceStateName === _this._endStateNames[i]) {
                    BABYLON.Tools.Error("VertexDeformation: reference state cannot be the same as the end state");
                    return _this;
                }
            }
            return _this;
        }
        // ==================================== Post constructor edits ====================================
        // ==================================== Getters & setters ====================================
        VertexDeformation.prototype.getReferenceStateName = function () { return this._referenceStateName; };
        VertexDeformation.prototype.getEndStateName = function (idx) { return this._endStateNames[idx]; };
        VertexDeformation.prototype.getEndStateNames = function () { return this._endStateNames; };
        VertexDeformation.prototype.getEndStateRatio = function (idx) { return this._endStateRatios[idx]; };
        VertexDeformation.prototype.getEndStateRatios = function () { return this._endStateRatios; };
        VertexDeformation.prototype.getClassName = function () { return "VertexDeformation"; };
        VertexDeformation.prototype.toString = function () {
            var ret = _super.prototype.toString.call(this);
            ret + ", reference state: " + this._referenceStateName;
            for (var i = 0, len = this._endStateNames.length; i < len; i++) {
                ret += ", [ " + this._endStateNames[i] + " @ " + this._endStateRatios[i] + "]";
            }
            return ret;
        };
        return VertexDeformation;
    }(QI.MotionEvent));
    QI.VertexDeformation = VertexDeformation;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of VertexDeformation, where the referenceStateName is Fixed to "BASIS" & only one end state involved
     */
    var Deformation = (function (_super) {
        __extends(Deformation, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1
         *
         * args from super
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         */
        function Deformation(groupName, endStateName, endStateRatio, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            return _super.call(this, groupName, "BASIS", [endStateName], [endStateRatio], milliDuration, movePOV, rotatePOV, options) || this;
        }
        Deformation.prototype.getClassName = function () { return "Deformation"; };
        return Deformation;
    }(VertexDeformation));
    QI.Deformation = Deformation;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to immediately attain a shape.  To be truly immediate you should call
     * deformImmediately() on the mesh.  This is a convenience method for performing it on a queue.
     *
     * If you specify a sound, then it will not perform event until sound is ready.  Same if millisBefore
     * is specified.
     */
    var MorphImmediate = (function (_super) {
        __extends(MorphImmediate, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         */
        function MorphImmediate(groupName, endStateName, endStateRatio, options) {
            if (endStateRatio === void 0) { endStateRatio = 1; }
            return _super.call(this, groupName, endStateName, endStateRatio, 0.01, null, null, options) || this;
        }
        MorphImmediate.prototype.getClassName = function () { return "MorphImmediate"; };
        return MorphImmediate;
    }(Deformation));
    QI.MorphImmediate = MorphImmediate;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to return to the basis state
     */
    var BasisReturn = (function (_super) {
        __extends(BasisReturn, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         */
        function BasisReturn(groupName, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            return _super.call(this, groupName, "BASIS", 1, milliDuration, movePOV, rotatePOV, options) || this;
        }
        BasisReturn.prototype.getClassName = function () { return "BasisReturn"; };
        return BasisReturn;
    }(Deformation));
    QI.BasisReturn = BasisReturn;
})(QI || (QI = {}));

/// <reference path="./VertexDeformation.ts"/>
/// <reference path="../../meshes/Mesh.ts"/>






/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>
var QI;
(function (QI) {
    //    declare var SIMD;
    //    declare var Float32x4Array;
    var ShapeKeyGroup = (function (_super) {
        __extends(ShapeKeyGroup, _super);
        /**
         * @param {Mesh} _mesh - reference of QI.Mesh this ShapeKeyGroup is a part of
         * @param {String} _name - Name of the Key Group, upper case only
         * @param {Uint32Array} _affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
         */
        function ShapeKeyGroup(_mesh, _name, _affectedPositionElements) {
            var _this = _super.call(this, _mesh, true) || this;
            _this._affectedPositionElements = _affectedPositionElements;
            // arrays for the storage of each state
            _this._states = new Array();
            _this._normals = new Array();
            _this._stateNames = new Array();
            // typed arrays are more expense to create, pre-allocate pairs for reuse
            _this._reusablePositionFinals = new Array();
            _this._reusableNormalFinals = new Array();
            _this._lastReusablePosUsed = 0;
            _this._lastReusableNormUsed = 0;
            // misc
            _this._mirrorAxis = -1; // when in use x = 1, y = 2, z = 3
            _this._name = _name; // override dummy
            if (!(_this._affectedPositionElements instanceof Uint32Array)) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid affectedPositionElements arg");
                return _this;
            }
            _this._nPosElements = _this._affectedPositionElements.length;
            // initialize 2 position reusables, the size needed
            _this._reusablePositionFinals.push(new Float32Array(_this._nPosElements));
            _this._reusablePositionFinals.push(new Float32Array(_this._nPosElements));
            // determine affectedVertices for updating cooresponding normals
            var affectedVert = new Array(); // final size unknown, so use a push-able array & convert to Uint16Array at end
            var vertIdx = -1;
            var nextVertIdx;
            // go through each position element
            for (var i = 0; i < _this._nPosElements; i++) {
                // the vertex index is 1/3 the position element index
                nextVertIdx = Math.floor(_this._affectedPositionElements[i] / 3);
                // since position element indexes in ascending order, check if vertex not already added by the x, or y elements
                if (vertIdx !== nextVertIdx) {
                    vertIdx = nextVertIdx;
                    affectedVert.push(vertIdx);
                }
            }
            _this._affectedVertices = new Uint16Array(affectedVert);
            _this._nVertices = _this._affectedVertices.length;
            // initialize 2 normal reusables, the full size needed
            _this._reusableNormalFinals.push(new Float32Array(_this._nVertices * 3));
            _this._reusableNormalFinals.push(new Float32Array(_this._nVertices * 3));
            // fish out the basis state from the mesh vertex data
            var basisState = new Float32Array(_this._nPosElements);
            var OriginalPositions = _mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (var i = 0; i < _this._nPosElements; i++) {
                basisState[i] = OriginalPositions[_this._affectedPositionElements[i]];
            }
            // push 'BASIS' to _states & _stateNames, then initialize _currFinalVals to 'BASIS' state
            _this._addShapeKey(ShapeKeyGroup.BASIS, false, basisState);
            _this._currFinalPositionVals = _this._states[0];
            _this._currFinalNormalVals = _this._normals[0];
            return _this;
        }
        // =============================== Shape-Key adding & deriving ===============================
        ShapeKeyGroup.prototype._getDerivedName = function (referenceIdx, endStateIdxs, endStateRatios, mirrorAxes) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            return referenceIdx + "-[" + endStateIdxs + "]@[" + endStateRatios + "]" + (mirrorAxes ? "-" + mirrorAxes : "");
        };
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        ShapeKeyGroup.prototype.addDerivedKeyFromDeformation = function (deformation) {
            this.addComboDerivedKey(deformation.getReferenceStateName(), deformation.getEndStateNames(), deformation.getEndStateRatios());
        };
        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxis - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         */
        ShapeKeyGroup.prototype.addDerivedKey = function (referenceStateName, endStateName, endStateRatio, mirrorAxis) {
            if (mirrorAxis === void 0) { mirrorAxis = null; }
            if (endStateRatio === 1) {
                BABYLON.Tools.Warn("ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless, ignored");
                return;
            }
            this.addComboDerivedKey(referenceStateName, [endStateName], [endStateRatio], mirrorAxis);
        };
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on, probably 'Basis'
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {String} newStateName - The name of the new state.  If not set, then it will be computed.
         */
        ShapeKeyGroup.prototype.addComboDerivedKey = function (referenceStateName, endStateNames, endStateRatios, mirrorAxes, newStateName) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            // test if key already exists, then leave
            if (newStateName && this.hasKey(newStateName))
                return;
            var referenceIdx = this._getIdxForState(referenceStateName);
            if (referenceIdx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            var endStateIdxs = new Array();
            var endStateIdx;
            for (var i = 0; i < endStateNames.length; i++) {
                endStateIdx = this._getIdxForState(endStateNames[i]);
                if (endStateIdx === -1) {
                    BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                    return;
                }
                endStateIdxs.push(endStateIdx);
            }
            var stateName = newStateName ? newStateName : this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, mirrorAxes);
            var stateKey = new Float32Array(this._nPosElements);
            this._buildPosEndPoint(stateKey, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes, this._node.debug);
            this._addShapeKey(stateName, false, stateKey);
        };
        /**
         * Called in construction code from TOB.  Unlikely to be called by application code.
         * @param {string} stateName - Name of the end state to be added.
         * @param {boolean} basisRelativeVals - when true, values are relative to basis, which is usually much more compact
         * @param {Float32Array} stateKey - Array of the positions for the _affectedPositionElements
         */
        ShapeKeyGroup.prototype._addShapeKey = function (stateName, basisRelativeVals, stateKey) {
            if (typeof stateName !== 'string' || stateName.length === 0) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid stateName arg");
                return;
            }
            if (this.hasKey(stateName)) {
                BABYLON.Tools.Warn("ShapeKeyGroup: stateName " + stateName + " is a duplicate, ignored");
                return;
            }
            this._states.push(stateKey);
            this._stateNames.push(stateName);
            if (basisRelativeVals) {
                var basis = this._states[0];
                for (var i = 0; i < this._nPosElements; i++) {
                    stateKey[i] += basis[i];
                }
            }
            var coorespondingNormals = new Float32Array(this._nVertices * 3);
            this._buildNormEndPoint(coorespondingNormals, stateKey);
            this._normals.push(coorespondingNormals);
            if (this._node.debug)
                BABYLON.Tools.Log("Shape key: " + stateName + " added to group: " + this._name + " on QI.Mesh: " + this._node.name);
        };
        /**
         * Remove the resources associated with a end state.
         * @param {string} endStateName - Name of the end state to be removed.
         */
        ShapeKeyGroup.prototype.deleteShapeKey = function (stateName) {
            var idx = this._getIdxForState(stateName);
            if (idx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            this._stateNames.splice(idx, 1);
            this._states.splice(idx, 1);
            this._normals.splice(idx, 1);
            if (this._node.debug)
                BABYLON.Tools.Log("Shape key: " + stateName + " deleted from group: " + this._name + " on QI.Mesh: " + this._node.name);
        };
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * ShapeKeyGroup is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        ShapeKeyGroup.prototype._incrementallyDeform = function (positions, normals) {
            _super.prototype._incrementallyMove.call(this);
            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a VertexDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof QI.VertexDeformation))
                return false;
            if (this._ratioComplete < 0)
                return false; // MotionEvent.BLOCKED or MotionEvent.WAITING
            // delay swapping currents to priors, in-case event gets cancelled after starting, but in an initial wait
            if (this._runOfStep === 1)
                this._firstRun();
            // update the positions
            this._updatePositions(positions);
            // update the normals
            this._updateNormals(normals);
            return true;
        };
        /**
         * Go to a single pre-defined state immediately.  Much like Skeleton._assignPoseImmediately, can be done while
         * mesh is not currently visible.  Should not be call here, but through the mesh.
         * @param {string} stateName - Names of the end state to take.
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        ShapeKeyGroup.prototype._deformImmediately = function (stateName, positions, normals) {
            var idx = this._getIdxForState(stateName);
            if (idx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + stateName.toUpperCase());
                return;
            }
            // interrupt any current deform, if any
            if (this._currentStepInSeries instanceof QI.VertexDeformation)
                this.stopCurrent(true);
            // assign the currFinal's so next deform knows where it is coming from
            this._currFinalPositionVals = this._states[idx];
            this._currFinalNormalVals = this._normals[idx];
            for (var i = 0; i < this._nPosElements; i++) {
                positions[this._affectedPositionElements[i]] = this._currFinalPositionVals[i];
            }
            var mIdx, kIdx;
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i]; // offset for this vertex in the entire mesh
                kIdx = 3 * i; // offset for this vertex in the shape key group
                normals[mIdx] = this._currFinalNormalVals[kIdx];
                normals[mIdx + 1] = this._currFinalNormalVals[kIdx + 1];
                normals[mIdx + 2] = this._currFinalNormalVals[kIdx + 2];
            }
        };
        /** Only public, so can be swapped out with SIMD version */
        ShapeKeyGroup.prototype._updatePositions = function (positions) {
            for (var i = 0; i < this._nPosElements; i++) {
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        };
        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4.splat(this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4.load(this._priorFinalPositionVals, i);
                var currFinalPositionVals  = SIMD.Float32x4.load(this._currFinalPositionVals, i);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMDToo(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4(this._priorFinalPositionVals[i], this._priorFinalPositionVals[i + 1], this._priorFinalPositionVals[i + 2], this._priorFinalPositionVals[i + 3]);
                var currFinalPositionVals  = SIMD.Float32x4(this._currFinalPositionVals [i], this._currFinalPositionVals [i + 1], this._currFinalPositionVals [i + 2], this._currFinalPositionVals [i + 3]);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD4(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            var nX4Pos = Math.floor(this._nPosElements / 4);

            for (var i = 0; i < nX4Pos; i++){
                var positionx4 = SIMD.Float32x4.add(this._priorFinalPositionSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalPositionSIMD[i], this._priorFinalPositionSIMD[i]), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i * 4], positionx4);
            }
            // do up to 3 leftovers
            var nLeftovers = this._nPosElements - nX4Pos * 4;
            for (var i = this._nPosElements - (nLeftovers + 1); i  < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        }
*/
        /** Only public, so can be swapped out with SIMD version */
        ShapeKeyGroup.prototype._updateNormals = function (normals) {
            var mIdx, kIdx;
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i]; // offset for this vertex in the entire mesh
                kIdx = 3 * i; // offset for this vertex in the shape key group
                normals[mIdx] = this._priorFinalNormalVals[kIdx] + ((this._currFinalNormalVals[kIdx] - this._priorFinalNormalVals[kIdx]) * this._ratioComplete);
                normals[mIdx + 1] = this._priorFinalNormalVals[kIdx + 1] + ((this._currFinalNormalVals[kIdx + 1] - this._priorFinalNormalVals[kIdx + 1]) * this._ratioComplete);
                normals[mIdx + 2] = this._priorFinalNormalVals[kIdx + 2] + ((this._currFinalNormalVals[kIdx + 2] - this._priorFinalNormalVals[kIdx + 2]) * this._ratioComplete);
            }
        };
        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD(normals :Float32Array) : void {
            var mIdx : number, kIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                var currFinalNormalVals  = SIMD.Float32x4.load3(this._currFinalNormalVals, kIdx);
                var priorFinalNormalVals = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                var normalx4             = SIMD.Float32x4.add(priorFinalNormalVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalNormalVals, priorFinalNormalVals), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }
        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD4(normals :Float32Array) : void {
            var mIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                var normalx4 = SIMD.Float32x4.add(this._priorFinalNormalSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalNormalSIMD[i], this._priorFinalNormalSIMD[i]), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }*/
        // ======================================== event prep =======================================
        /**
         * delay swapping currents to priors, in-case event gets cancelled after starting, but in an initial wait
         */
        ShapeKeyGroup.prototype._firstRun = function () {
            // is possible to have a MotionEvent(with no deformation), not VertexDeformation sub-class
            if (!(this._currentStepInSeries instanceof QI.VertexDeformation))
                return;
            this._priorFinalPositionVals = this._currFinalPositionVals;
            this._priorFinalNormalVals = this._currFinalNormalVals;
            var deformation = this._currentStepInSeries;
            var referenceIdx = this._getIdxForState(deformation.getReferenceStateName());
            if (referenceIdx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            var endStateNames = deformation.getEndStateNames();
            var endStateRatios = deformation.getEndStateRatios();
            this._stalling = endStateRatios === null;
            if (!this._stalling) {
                var endStateIdxs = new Array();
                var endStateIdx;
                var allZeros = true;
                for (var i = 0; i < endStateNames.length; i++) {
                    endStateIdx = this._getIdxForState(endStateNames[i]);
                    if (endStateIdx === -1) {
                        BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                        return;
                    }
                    endStateIdxs.push(endStateIdx);
                    allZeros = allZeros && endStateRatios[i] === 0;
                }
                // when a single end state key, & endStateRatio is 1 or 0, just assign _currFinalVals directly from _states
                if (allZeros || (endStateRatios.length === 1 && (endStateRatios[0] === 1 || endStateRatios[0] === 0))) {
                    var idx = (allZeros || endStateRatios[0] === 0) ? referenceIdx : endStateIdxs[0]; // really just the reference when 0
                    this._currFinalPositionVals = this._states[idx];
                    this._currFinalNormalVals = this._normals[idx];
                }
                else {
                    // check there was not a pre-built derived key to assign
                    var derivedIdx = this._getIdxForState(this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes));
                    if (derivedIdx !== -1) {
                        this._currFinalPositionVals = this._states[derivedIdx];
                        this._currFinalNormalVals = this._normals[derivedIdx];
                    }
                    else {
                        // need to build _currFinalVals, toggling the _lastReusablePosUsed
                        this._lastReusablePosUsed = (this._lastReusablePosUsed === 1) ? 0 : 1;
                        this._buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed], referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes, this._node.debug);
                        this._currFinalPositionVals = this._reusablePositionFinals[this._lastReusablePosUsed];
                        // need to build _currFinalNormalVals, toggling the _lastReusableNormUsed
                        this._lastReusableNormUsed = (this._lastReusableNormUsed === 1) ? 0 : 1;
                        this._buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed], this._currFinalPositionVals);
                        this._currFinalNormalVals = this._reusableNormalFinals[this._lastReusableNormUsed];
                    }
                }
            }
        };
        /*        private _prepForSIMD(){
                    var nX4Pos = Math.floor(this._nPosElements / 4);
                    var priorCopied = typeof (this._currFinalPositionSIMD) !== "undefined";
        
                    this._priorFinalPositionSIMD = priorCopied ? this._currFinalPositionSIMD : [];
                    this._currFinalPositionSIMD  = [];
        
                    for (var i = 0, x4 = 0; i < nX4Pos;  i++, x4 += 4){
                        if (!priorCopied){
                            this._priorFinalPositionSIMD[i] = SIMD.Float32x4(this._priorFinalPositionVals[x4], this._priorFinalPositionVals[x4 + 1], this._priorFinalPositionVals[x4 + 2], this._priorFinalPositionVals[x4 + 3]);
                        }
                            this._currFinalPositionSIMD [i] = SIMD.Float32x4(this._currFinalPositionVals [x4], this._currFinalPositionVals [x4 + 1], this._currFinalPositionVals [x4 + 2], this._currFinalPositionVals [x4 + 3]);
                    }
        
                    priorCopied = typeof (this._currFinalNormalSIMD) !== "undefined";
                    this._priorFinalNormalSIMD = priorCopied ? this._currFinalNormalSIMD : [];
                    this._currFinalNormalSIMD  = [];
        
                    var kIdx : number;
                    for (var i = 0; i < this._nVertices; i++){
                        kIdx = 3 * i;                        // offset for this vertex in the shape key group
        
                        if (!priorCopied){
                            this._priorFinalNormalSIMD[i] = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                        }
                            this._currFinalNormalSIMD [i] = SIMD.Float32x4.load3(this._currFinalNormalVals , kIdx);
                    }
                }*/
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
         * @param {number} referenceIdx - the index into _states[] to use as a reference
         * @param {Array<number>} endStateIdxs - the indexes into _states[] to use as a target
         * @param {Array<number>} endStateRatios - the ratios of the target state to achive, relative to the reference state
         * @param {string} mirrorAxes - axis [X,Y,Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {boolean} log - write console message of action, when true (Default false)
         *
         */
        ShapeKeyGroup.prototype._buildPosEndPoint = function (targetArray, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes, log) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            if (log === void 0) { log = false; }
            var refEndState = this._states[referenceIdx];
            var nEndStates = endStateIdxs.length;
            // compute each of the new final values of positions
            var deltaToRefState;
            var stepDelta;
            var j;
            var mirroring;
            if (mirrorAxes || ShapeKeyGroup._isMirroring(endStateRatios)) {
                mirroring = new Array(endStateRatios.length);
                if (mirrorAxes)
                    mirrorAxes = mirrorAxes.toUpperCase();
                for (j = 0; j < endStateRatios.length; j++) {
                    if (mirrorAxes) {
                        switch (mirrorAxes.charAt(j)) {
                            case "X":
                                mirroring[j] = 1;
                                break;
                            case "Y":
                                mirroring[j] = 2;
                                break;
                            case "Z":
                                mirroring[j] = 3;
                                break;
                        }
                    }
                    else
                        mirroring[j] = this._mirrorAxis;
                }
            }
            for (var i = 0; i < this._nPosElements; i++) {
                deltaToRefState = 0;
                for (j = 0; j < nEndStates; j++) {
                    stepDelta = (this._states[endStateIdxs[j]][i] - refEndState[i]) * endStateRatios[j];
                    // reverse sign on appropriate elements of referenceDelta when ratio neg & mirroring, except when Z since left handed
                    if (endStateRatios[j] < 0 && mirroring[j] !== (i + 1) % 3 && mirroring[j] !== 3) {
                        stepDelta *= -1;
                    }
                    deltaToRefState += stepDelta;
                }
                targetArray[i] = refEndState[i] + deltaToRefState;
            }
            if (log)
                BABYLON.Tools.Log(this._name + " end Point built for referenceIdx: " + referenceIdx + ",  endStateIdxs: " + endStateIdxs + ", endStateRatios: " + endStateRatios);
        };
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
         * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
         */
        ShapeKeyGroup.prototype._buildNormEndPoint = function (targetArray, endStatePos) {
            var mesh = this._node;
            mesh._futurePositions.set(mesh._originalPositions);
            // populate the changes that this state has
            for (var i = 0; i < this._nPosElements; i++) {
                mesh._futurePositions[this._affectedPositionElements[i]] = endStatePos[i];
            }
            BABYLON.VertexData.ComputeNormals(mesh._futurePositions, mesh.getIndices(), mesh._futureNormals);
            var mIdx, kIdx;
            // populate the changes that this state has
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i]; // offset for this vertex in the entire mesh
                kIdx = 3 * i; // offset for this vertex in the shape key group
                targetArray[kIdx] = mesh._futureNormals[mIdx];
                targetArray[kIdx + 1] = mesh._futureNormals[mIdx + 1];
                targetArray[kIdx + 2] = mesh._futureNormals[mIdx + 2];
            }
        };
        ShapeKeyGroup._isMirroring = function (endStateRatios) {
            for (var i = 0, len = endStateRatios.length; i < len; i++)
                if (endStateRatios[i] < 0)
                    return true;
            return false;
        };
        // ==================================== Getters & setters ====================================
        /**
         * Determine if a key already exists.
         * @param {string} stateName - name of key to check
         */
        ShapeKeyGroup.prototype.hasKey = function (stateName) {
            return this._getIdxForState(stateName) !== -1;
        };
        ShapeKeyGroup.prototype._getIdxForState = function (stateName) {
            stateName = stateName.toUpperCase();
            for (var i = 0, len = this._stateNames.length; i < len; i++) {
                if (this._stateNames[i] === stateName) {
                    return i;
                }
            }
            return -1;
        };
        ShapeKeyGroup.prototype.getName = function () { return this._name; };
        ShapeKeyGroup.prototype.getNPosElements = function () { return this._nPosElements; };
        ShapeKeyGroup.prototype.getNStates = function () { return this._stateNames.length; };
        ShapeKeyGroup.prototype.getStates = function () { return this._stateNames.slice(0); }; // do not allow actual access to names, copy
        ShapeKeyGroup.prototype.toString = function () { return 'ShapeKeyGroup: ' + this._name + ', n position elements: ' + this._nPosElements + ',\nStates: ' + this._stateNames; };
        ShapeKeyGroup.prototype.mirrorAxisOnX = function () { this._mirrorAxis = 1; };
        ShapeKeyGroup.prototype.mirrorAxisOnY = function () { this._mirrorAxis = 2; };
        ShapeKeyGroup.prototype.mirrorAxisOnZ = function () { this._mirrorAxis = 3; };
        // ========================================= statics =========================================
        /**
         * Only public for QI.MeshconsolidateShapeKeyGroups(), where this should be called from.
         */
        ShapeKeyGroup._buildConsolidatedGroup = function (mesh, newGroupName, thoseToMerge) {
            var nVerts = mesh._originalPositions.length;
            var nSources = thoseToMerge.length;
            // determine which vertices are used in the consolidated group
            var nPosElements = 0;
            var affectedBool = new Array(nVerts);
            for (var i = 0; i < nSources; i++) {
                var sourceGrp = thoseToMerge[i];
                for (var j = 0; j < sourceGrp._nPosElements; j++) {
                    var vert = sourceGrp._affectedPositionElements[j];
                    if (!affectedBool[vert]) {
                        affectedBool[vert] = true;
                        nPosElements++;
                    }
                }
            }
            // assemble affectedPositionElements & instance consolidated
            var affectedPositionElements = new Uint32Array(nPosElements);
            var idx = 0;
            for (var i = 0; i < nVerts; i++) {
                if (affectedBool[i])
                    affectedPositionElements[idx++] = i;
            }
            var ret = new ShapeKeyGroup(mesh, newGroupName, affectedPositionElements);
            mesh.addShapeKeyGroup(ret);
            // transfer each key from source group
            for (var i = 0; i < nSources; i++) {
                var sourceGrp = thoseToMerge[i];
                // need to determine where the source group maps into the larger group
                var map = new Array(sourceGrp._nPosElements);
                var srcIdx = 0;
                for (var destIdx = 0; destIdx < nPosElements; destIdx++) {
                    if (affectedPositionElements[destIdx] === sourceGrp._affectedPositionElements[srcIdx]) {
                        map[srcIdx++] = destIdx;
                    }
                }
                // key zero is basis
                for (var k = 1, nKeys = sourceGrp._states.length; k < nKeys; k++) {
                    var key = new Float32Array(nPosElements);
                    key.set(ret._states[0]); // initialize with basis, in a c++ loop
                    var origKey = sourceGrp._states[k];
                    for (var j = 0; j < sourceGrp._nPosElements; j++) {
                        key[map[j]] = origKey[j];
                    }
                    ret._addShapeKey(sourceGrp._name + "_" + sourceGrp._stateNames[k], false, key);
                }
            }
            return ret;
        };
        return ShapeKeyGroup;
    }(QI.PovProcessor));
    ShapeKeyGroup.BASIS = "BASIS";
    QI.ShapeKeyGroup = ShapeKeyGroup;
    /*    // SIMD
        var previousUpdatePositions = ShapeKeyGroup.prototype._updatePositions;
        var previousUpdateNormals = ShapeKeyGroup.prototype._updateNormals;
    
        export class SIMDHelper {
            private static _isEnabled = false;
    
            public static get IsEnabled(): boolean {
                return SIMDHelper._isEnabled;
            }
    
            public static DisableSIMD(): void {
                // Replace functions
                ShapeKeyGroup.prototype._updatePositions = <any> previousUpdatePositions;
                ShapeKeyGroup.prototype._updateNormals   = <any> previousUpdateNormals;
    
                SIMDHelper._isEnabled = false;
            }
    
            public static EnableSIMD(): void {
                if (window.SIMD === undefined) {
                    return;
                }
    
                // Replace functions
                ShapeKeyGroup.prototype._updatePositions = <any> ShapeKeyGroup.prototype._updatePositionsSIMDToo;
                ShapeKeyGroup.prototype._updateNormals   = <any> ShapeKeyGroup.prototype._updateNormalsSIMD;
    
                SIMDHelper._isEnabled = true;
                BABYLON.Tools.Log("QI SIMD mode enabled");
            }
        }
    
        if (window.SIMD !== undefined) {
            SIMDHelper.EnableSIMD();
        }else{
            BABYLON.Tools.Log("Environment not QI SIMD capable, sorry");
        }*/
})(QI || (QI = {}));

/// <reference path="../meshes/Mesh.ts"/>
var QI;
(function (QI) {
    var AbstractGrandEntrance = (function () {
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.
         * @param {BABYLON.Sound} soundEffect - An optional sound to play as a part of entrance.
         * @param {boolean} disposeSound - When true, dispose the sound effect on completion. (Default false)
         */
        function AbstractGrandEntrance(_mesh, durations, soundEffect, disposeSound) {
            this._mesh = _mesh;
            this.durations = durations;
            this.soundEffect = soundEffect;
            if (this.soundEffect && disposeSound) {
                var ref = this;
                this.soundEffect.onended = function () {
                    ref.soundEffect.dispose();
                };
            }
        }
        AbstractGrandEntrance.prototype.makeEntrance = function () {
            throw "Must be over-ridden by sub-classes";
        };
        return AbstractGrandEntrance;
    }());
    QI.AbstractGrandEntrance = AbstractGrandEntrance;
})(QI || (QI = {}));

/// <reference path="../deformation/shapeKeyBased/VertexDeformation.ts"/>
/// <reference path="../deformation/shapeKeyBased/ShapeKeyGroup.ts"/>






/// <reference path="../deformation/skeletonBased/Pose.ts"/>
/// <reference path="../deformation/skeletonBased/PoseProcessor.ts"/>
/// <reference path="../deformation/skeletonBased/Skeleton.ts"/>
/// <reference path="../entrances/AbstractGrandEntrance.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/EventSeries.ts"/>
/// <reference path="../queue/PovProcessor.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
var QI;
(function (QI) {
    /**
     * Mesh sub-class which has a before render which processes events for ShapeKeysGroups, Skeleton Poses, and POV.
     */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        /**
         * @constructor - Args same As BABYLON.Mesh, except that using a source for cloning requires there be no shape keys
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        function Mesh(name, scene, parent, source, doNotCloneChildren) {
            if (parent === void 0) { parent = null; }
            var _this = _super.call(this, name, scene, parent, source, doNotCloneChildren) || this;
            _this.debug = false;
            _this._shapeKeyGroups = new Array();
            // tracking system members
            _this._clockStart = -1;
            _this._renderCPU = 0;
            _this._totalDeformations = 0;
            _this._totalFrames = 0;
            // for Firefox
            _this._lastFrameID = -1;
            // ============================ Mesh-instance wide play - pause ==============================
            _this._instancePaused = true; // do not allow anything to run till visible; managed by grand entrance
            if (source && source._shapeKeyGroups.length > 0)
                throw "QI.Mesh: meshes with shapekeys cannot be cloned";
            _this._povProcessor = new QI.PovProcessor(_this, false); // do not actually register as a beforeRender, use this classes & register below
            // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
            var ref = _this;
            _this._registeredFN = function () { ref.beforeRender(); };
            // using scene level before render, so always runs & only once per frame, incase there are multiple cameras
            scene.registerBeforeRender(_this._registeredFN);
            return _this;
        }
        // ============================ beforeRender callback & tracking =============================
        Mesh.prototype.beforeRender = function () {
            if (this._positions32F === null || this._normals32F === null || QI.TimelineControl.isSystemPaused || this._instancePaused)
                return;
            var startTime = BABYLON.Tools.Now;
            // Firefox can call for a render occasionally when user is on a different tab; ignore
            if (this._lastFrameID === QI.TimelineControl.FrameID)
                return;
            this._lastFrameID = QI.TimelineControl.FrameID;
            this._shapeKeyChangesMade = false;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                // do NOT combine these 2 lines or only 1 group will run!
                var changed = this._shapeKeyGroups[g]._incrementallyDeform(this._positions32F, this._normals32F);
                this._shapeKeyChangesMade = this._shapeKeyChangesMade || changed;
            }
            this._skeletonChangesMade = false;
            if (this._poseProcessor) {
                this._skeletonChangesMade = this._poseProcessor.incrementallyDeform();
            }
            // perform any POV events on the mesh not assigned a shapekey group or the pose processor
            this._povProcessor._incrementallyMove();
            if (this._shapeKeyChangesMade || this._skeletonChangesMade) {
                if (this._shapeKeyChangesMade) {
                    if (this.computeBonesUsingShaders || !this._skeletonChangesMade) {
                        // resend positions & normals
                        _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.PositionKind, this._positions32F);
                        _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.NormalKind, this._normals32F);
                    }
                }
                if (this._clockStart < 0)
                    this._resetTracking(startTime); // delay tracking until the first change is made
                this._renderCPU += BABYLON.Tools.Now - startTime;
                this._totalDeformations++;
            }
            this._totalFrames++;
        };
        Mesh.prototype.resetTracking = function () {
            this._resetTracking(BABYLON.Tools.Now);
        };
        Mesh.prototype._resetTracking = function (startTime) {
            this._clockStart = startTime;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
        };
        Mesh.prototype.getTrackingReport = function (reset) {
            if (reset === void 0) { reset = false; }
            var totalWallClock = BABYLON.Tools.Now - this._clockStart;
            var report = "\nNum Deformations: " + this._totalDeformations +
                "\nRender CPU milli: " + this._renderCPU.toFixed(2) +
                "\nRender CPU milli / Deformations: " + (this._renderCPU / this._totalDeformations).toFixed(2) +
                "\nWallclock milli / Deformations: " + (totalWallClock / this._totalDeformations).toFixed(2) +
                "\nMemo, Deformations / Sec: " + (this._totalDeformations / (totalWallClock / 1000)).toFixed(2) +
                "\nMemo, Frames with no deformation: " + (this._totalFrames - this._totalDeformations) +
                "\nMemo, Total vertices: " + this.getTotalVertices() +
                "\nShape keys:";
            for (var i = 0; i < this._shapeKeyGroups.length; i++)
                report += "\n" + this._shapeKeyGroups[i].toString();
            if (reset)
                this.resetTracking();
            return report;
        };
        // ======================================== Overrides ========================================
        /** @override */
        Mesh.prototype.createInstance = function (name) {
            if (this._shapeKeyGroups.length > 0) {
                BABYLON.Tools.Error("QI.Mesh:  Shared vertex instances not possible with shape keys");
                return null;
            }
            else
                return _super.prototype.createInstance.call(this, name);
        };
        /** @override */
        Mesh.prototype.convertToFlatShadedMesh = function () {
            if (this._shapeKeyGroups.length > 0) {
                BABYLON.Tools.Error("QI.Mesh:  Flat shading must be done on export with shape keys");
                return null;
            }
            else
                return _super.prototype.convertToFlatShadedMesh.call(this);
        };
        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        Mesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
            _super.prototype.setVerticesData.call(this, kind, data, updatable || kind === BABYLON.VertexBuffer.PositionKind || kind === BABYLON.VertexBuffer.NormalKind, stride);
            if (kind === BABYLON.VertexBuffer.PositionKind) {
                this._positions32F = this.setPositionsForCPUSkinning(); // get positions from here, so can morph & CPU skin at the same time
                // need to make a by value copy of the orignal position data, to build futurePos in call to normalsforVerticesInPlace()
                this._originalPositions = new Float32Array(data.length);
                for (var i = 0, len = data.length; i < len; i++) {
                    this._originalPositions[i] = data[i];
                }
                this._futurePositions = new Float32Array(data.length);
                this._futureNormals = new Float32Array(data.length);
            }
            else if (kind === BABYLON.VertexBuffer.NormalKind) {
                this._normals32F = this.setNormalsForCPUSkinning(); // get normals from here, so can morph & CPU skin at the same time
            }
            else if (kind === BABYLON.VertexBuffer.MatricesWeightsKind) {
                // exporter assigns skeleton before setting any vertex data, so should be ok
                if (!this._poseProcessor)
                    this._poseProcessor = new QI.PoseProcessor(this.skeleton, this, true);
            }
            return this;
        };
        /** @override */
        Mesh.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            this.getScene().unregisterBeforeRender(this._registeredFN);
        };
        // =================================== EventSeries related ===================================
        /**
         * Primarily called by Blender generated code.
         * @param {QI.ShapeKeyGroup} shapeKeyGroup - prebuilt group to add
         */
        Mesh.prototype.addShapeKeyGroup = function (shapeKeyGroup) {
            this._shapeKeyGroups.push(shapeKeyGroup);
        };
        /**
         * create a new shapekey group from a list of others.  Useful to export smaller more focused groups
         * upon load.
         * @param {string} newGroupName - The name the consolidated group to create
         * @param {Array<string>} thoseToMerge - Names of the groups to merge
         * @param {boolean} keepOrig - Do not delete original groups when true. (default: false)
         * @returns {ShapeKeyGroup} The consolidate group
         */
        Mesh.prototype.consolidateShapeKeyGroups = function (newGroupName, thoseToMerge, keepOrig) {
            var nGroups = thoseToMerge.length;
            // gather all the groups
            var groups = new Array(nGroups);
            for (var i = 0; i < nGroups; i++) {
                groups[i] = this.getShapeKeyGroup(thoseToMerge[i]);
                if (!groups[i]) {
                    BABYLON.Tools.Error("QI.Mesh: no shape key group with name: " + thoseToMerge[i]);
                    return null;
                }
            }
            var ret = QI.ShapeKeyGroup._buildConsolidatedGroup(this, newGroupName, groups);
            // remove original groups
            if (!keepOrig) {
                for (var i = 0; i < nGroups; i++) {
                    this.removeShapeKeyGroup(thoseToMerge[i]);
                }
            }
            return ret;
        };
        /**
         * Cause the group to go out of scope.  All resources on heap, so GC should remove it.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        Mesh.prototype.removeShapeKeyGroup = function (groupName) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    this._shapeKeyGroups.splice(g, 1);
                    return;
                }
            }
            BABYLON.Tools.Warn("QI.Mesh: no shape key group with name: " + groupName);
        };
        /**
         * When there are overlaps of vertices of shapekey groups, the last one processed wins
         * if both are active in a given frame.  eg. Automaton's WINK & FACE groups.  Can be
         * run multiple times, but of course order your calls in the opposite order.
         * @param {string} groupName - Group to process last.
         */
        Mesh.prototype.setShapeKeyGroupLast = function (groupName) {
            var currIdx = -1;
            var len = this._shapeKeyGroups.length;
            for (var g = 0; g < len; g++) {
                if (this._shapeKeyGroups[g]._name === groupName) {
                    currIdx = g;
                    break;
                }
            }
            if (currIdx === -1) {
                BABYLON.Tools.Error("QI.Mesh: no shape key group with name: " + groupName);
                return;
            }
            // test for not being last already
            if (currIdx + 1 < len) {
                var chosen = this._shapeKeyGroups[currIdx];
                this._shapeKeyGroups.splice(currIdx, 1);
                this._shapeKeyGroups.splice(len, 0, chosen);
            }
        };
        /**
         * Clear out any events, on all the queues the Mesh has.
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        Mesh.prototype.clearAllQueues = function (stopCurrentSeries) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].clearQueue(stopCurrentSeries);
            }
            if (this._poseProcessor) {
                this._poseProcessor.clearQueue(stopCurrentSeries);
            }
            if (this._povProcessor) {
                this._povProcessor.clearQueue(stopCurrentSeries);
            }
        };
        /**
         * Go thru an array of Events prior to creating an event series.  Add a stall for any queue(s) that
         * does not have an event.  Useful for syncing the entire meshe's groups even though a queue may not
         * have an event.
         *
         * An example is when inserting a Grand Entrance.  The entrance may only use a shape key group.  The
         * coder may wish to add on / directly swing into action afterward using a pose.  If there was not a
         * stall added to the pose processor, pose event would begin before entrance was complete.
         *
         * @param {Array<any>} events - Events argument or EventSeries, prior to instancing.
         * @param {number} stallMillis - Amount of time to stall a queue.  Do not take into account any EventSeries
         * repeats, if any.
         * @param {string} groupForFuncActions - Should match the EventSeries constructor arg.  Defaults are the same.
         * @returns {Array<any>} - Same array as passed, with stalls added.
         */
        Mesh.prototype.appendStallForMissingQueues = function (events, stallMillis, groupForFuncActions) {
            if (groupForFuncActions === void 0) { groupForFuncActions = QI.PovProcessor.POV_GROUP_NAME; }
            // flags of things to check for
            var povFound = false;
            var skeletonFound = !this._poseProcessor; // say found when no pose processor
            var nSkGrps = this._shapeKeyGroups.length;
            var shapeGrpFound = new Array(nSkGrps);
            var funcActionsFound = false;
            // populate all the flags of things found
            for (var i = 0, len = events.length; i < len; i++) {
                if (events[i] instanceof QI.VertexDeformation) {
                    var grpName = events[i]._groupName;
                    for (var s = 0; s < nSkGrps; s++) {
                        if (this._shapeKeyGroups[s]._name === grpName) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                }
                else if (events[i] instanceof QI.PoseEvent) {
                    skeletonFound = true;
                }
                else if (!(events[i] instanceof QI.MotionEvent)) {
                    // functions / actions / & nonMotionEvents
                    funcActionsFound = true;
                }
                else
                    povFound = true;
            }
            // flag queue for functions / actions / nonMotionEvents, when present
            if (funcActionsFound) {
                if (groupForFuncActions === QI.PovProcessor.POV_GROUP_NAME) {
                    povFound = true;
                }
                else if (groupForFuncActions === QI.PoseProcessor.INTERPOLATOR_GROUP_NAME) {
                    skeletonFound = true;
                }
                else {
                    for (var s = 0; s < nSkGrps; s++) {
                        if (groupForFuncActions === this._shapeKeyGroups[s]._name) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                }
            }
            // add stalls for missing queues
            if (!povFound) {
                events.push(new QI.Stall(stallMillis, QI.PovProcessor.POV_GROUP_NAME));
            }
            if (!skeletonFound) {
                events.push(new QI.Stall(stallMillis, QI.PoseProcessor.INTERPOLATOR_GROUP_NAME));
            }
            for (var s = 0; s < nSkGrps; s++) {
                if (!shapeGrpFound[s]) {
                    events.push(new QI.Stall(stallMillis, this._shapeKeyGroups[s]._name));
                }
            }
            return events;
        };
        /**
         * wrapper a single MotionEvent into an EventSeries, defaulting on all EventSeries optional args
         * @param {MotionEvent or function} event - Event or function to wrapper.
         */
        Mesh.prototype.queueSingleEvent = function (event) {
            this.queueEventSeries(new QI.EventSeries([event]));
        };
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        Mesh.prototype.queueEventSeries = function (eSeries, clearQueue, stopCurrentSeries, insertSeriesInFront) {
            var groups;
            if (this.debug)
                groups = [];
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (eSeries.isGroupParticipating(this._shapeKeyGroups[g].getName())) {
                    if (insertSeriesInFront) {
                        this._shapeKeyGroups[g].insertSeriesInFront(eSeries);
                    }
                    else {
                        this._shapeKeyGroups[g].queueEventSeries(eSeries, clearQueue, stopCurrentSeries);
                    }
                    if (groups)
                        groups.push(this._shapeKeyGroups[g].getName());
                }
            }
            if (eSeries.isGroupParticipating(QI.PoseProcessor.INTERPOLATOR_GROUP_NAME)) {
                if (insertSeriesInFront) {
                    this._poseProcessor.insertSeriesInFront(eSeries);
                }
                else {
                    this._poseProcessor.queueEventSeries(eSeries);
                }
                if (groups)
                    groups.push(QI.PoseProcessor.INTERPOLATOR_GROUP_NAME);
            }
            if (eSeries.isGroupParticipating(QI.PovProcessor.POV_GROUP_NAME)) {
                if (insertSeriesInFront) {
                    this._povProcessor.insertSeriesInFront(eSeries);
                }
                else {
                    this._povProcessor.queueEventSeries(eSeries);
                }
                if (groups)
                    groups.push(QI.PovProcessor.POV_GROUP_NAME);
            }
            // diagnostic logging
            if (groups) {
                if (groups.length === 0)
                    BABYLON.Tools.Warn("QI.Mesh:  no shape keys groups or skeleton participating in event series");
                else {
                    var msg = "QI.Mesh:  series queued to " + groups.length + " group(s): [ ";
                    for (var i = 0; i < groups.length; i++) {
                        msg += groups[i] + " ";
                    }
                    BABYLON.Tools.Log(msg + "]");
                }
            }
        };
        // ==================================== Shapekey Wrappers ====================================
        /**
         * Query for determining if a given shapekey has been defined for the mesh.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        Mesh.prototype.hasShapeKeyGroup = function (groupName) {
            return this.getShapeKeyGroup(groupName) !== null;
        };
        /**
         * Return a ShapeKeyGroup Object defined for the mesh.  Primarily for internal use.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        Mesh.prototype.getShapeKeyGroup = function (groupName) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    return this._shapeKeyGroups[g];
                }
            }
            return null;
        };
        /**
         * Convenience method for queuing a single deform with a single endstate relative to basis state.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1
         *
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         * @returns {Deformation} This is the event which gets queued.
         */
        Mesh.prototype.queueDeform = function (groupName, endStateName, endStateRatio, milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            var event = new QI.Deformation(groupName, endStateName, endStateRatio, milliDuration, movePOV, rotatePOV, options);
            this.queueSingleEvent(event);
            return event;
        };
        /**
         * Go to a single pre-defined state immediately.  Much like assignPoseImmediately, can be done while
         * mesh is not currently visible.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         */
        Mesh.prototype.deformImmediately = function (groupName, stateName) {
            var group = this.getShapeKeyGroup(groupName);
            if (!group) {
                BABYLON.Tools.Error("QI.Mesh: invalid shape key group: " + groupName.toUpperCase());
                return;
            }
            group._deformImmediately(stateName, this._positions32F, this._normals32F);
            _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.PositionKind, this._positions32F);
            _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.NormalKind, this._normals32F);
        };
        // ==================================== Skeleton Wrappers ====================================
        /**
         * Assign the pose library to the mesh.  Only one library can be assigned at once, so any it
         * is a bad idea to perform this while pose events are queued.
         * @param {string} libraryName - The name given in Blender when library generated.
         */
        Mesh.prototype.assignPoseLibrary = function (libraryName) {
            if (this.skeleton) {
                this.skeleton.assignPoseLibrary(libraryName);
            }
        };
        /**
         * Go to a pose immediately.  This can done while the mesh is not currently visible.
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         */
        Mesh.prototype.assignPoseImmediately = function (poseName) {
            if (this.skeleton) {
                this.skeleton._assignPoseImmediately(poseName);
                this._poseProcessor._lastPoseRun = poseName;
            }
        };
        /**
         * Convenience method for queuing a single pose on the skeleton.
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {string[]} subposes - sub-poses which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any sub-poses should actually be subtracted during event(default false)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         *
         * @returns {PoseEvent} This is the event which gets queued.
         */
        Mesh.prototype.queuePose = function (poseName, milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            var event = new QI.PoseEvent(poseName, milliDuration, movePOV, rotatePOV, options);
            this.queueSingleEvent(event);
            return event;
        };
        /**
         * assign a sub-pose onto the current state of the skeleton.  Not truly immediate, since it is still queued,
         * unlike assignPoseImmediately().
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         *
         * @returns {PoseEvent} This is the event which gets queued.
         */
        Mesh.prototype.assignSubPoseImmediately = function (poseName) {
            return this.addSubPose(poseName, 0.01); // 0.01 milli is close enough to immediate
        };
        /**
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         * @param {number} standAloneMillis - optional, when present an event is generated to assignment to current pose.
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level (when standalone)
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         *
         * @returns {PoseEvent} This is the event which gets queued.  Null when no millis.
         */
        Mesh.prototype.addSubPose = function (poseName, standAloneMillis, options) {
            if (this.skeleton) {
                if (standAloneMillis) {
                    var skel = this.skeleton;
                    var pose = new QI.PoseEvent(this.getLastPoseNameQueuedOrRun(), standAloneMillis, null, null, options);
                    var events = [
                        function () { skel.addSubPose(poseName); },
                        pose
                    ];
                    this.queueEventSeries(new QI.EventSeries(events, 1, 1, QI.PoseProcessor.INTERPOLATOR_GROUP_NAME));
                    return pose;
                }
                else {
                    this.skeleton.addSubPose(poseName);
                    return null;
                }
            }
        };
        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        Mesh.prototype.removeSubPose = function (poseName) {
            if (this.skeleton) {
                this.skeleton.removeSubPose(poseName);
            }
        };
        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        Mesh.prototype.clearAllSubPoses = function () {
            if (this.skeleton) {
                this.skeleton.clearAllSubPoses();
            }
        };
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        Mesh.prototype.getLastPoseNameQueuedOrRun = function () {
            return this._poseProcessor ? this._poseProcessor.getLastPoseNameQueuedOrRun() : null;
        };
        // =================================== BJS side ShapeGroup ===================================
        /** Entry point called by TOB generated code, when everything is ready.
         *  To load in advance without showing export disabled.  Call this when ready.
         *  Can also be called after the first time, if makeVisible(false) was called.
         */
        Mesh.prototype.grandEntrance = function () {
            if (this.isEnabled() && !this.isVisible) {
                if (this.entranceMethod)
                    this.entranceMethod.makeEntrance();
                else
                    this.makeVisible(true);
            }
        };
        /**
         * make computed shape key group when missing.  Used mostly by GrandEntrances.
         * @returns {ShapeKeyGroup} used for Javascript made end states.
         */
        Mesh.prototype.makeComputedGroup = function () {
            var computedGroup = this.getShapeKeyGroup(Mesh.COMPUTED_GROUP_NAME);
            if (!computedGroup) {
                var nElements = this._originalPositions.length;
                var affectedPositionElements = new Uint32Array(nElements);
                for (var i = 0; i < nElements; i++) {
                    affectedPositionElements[i] = i;
                }
                computedGroup = new QI.ShapeKeyGroup(this, Mesh.COMPUTED_GROUP_NAME, affectedPositionElements);
                this.addShapeKeyGroup(computedGroup);
            }
            return computedGroup;
        };
        /**
         * make the whole hierarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        Mesh.prototype.makeVisible = function (visible) {
            this.isVisible = visible;
            if (visible)
                this.resumeInstancePlay();
            else
                this.pausePlay();
            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i] instanceof Mesh) {
                    children[i].makeVisible(visible);
                }
                else {
                    children[i].isVisible = visible;
                }
            }
        };
        /**
         * Used by some GrandEntrances to get the center of the entire mesh with children too.
         *
         */
        Mesh.prototype.getSizeCenterWtKids = function () {
            var boundingBox = this.getBoundingInfo().boundingBox;
            var minmin = boundingBox.minimumWorld.clone();
            var maxmax = boundingBox.maximumWorld.clone();
            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                boundingBox = children[i].getBoundingInfo().boundingBox;
                if (minmin.x > boundingBox.minimumWorld.x)
                    minmin.x = boundingBox.minimumWorld.x;
                if (minmin.y > boundingBox.minimumWorld.y)
                    minmin.y = boundingBox.minimumWorld.y;
                if (minmin.z > boundingBox.minimumWorld.z)
                    minmin.z = boundingBox.minimumWorld.z;
                if (maxmax.x < boundingBox.maximumWorld.x)
                    maxmax.x = boundingBox.maximumWorld.x;
                if (maxmax.y < boundingBox.maximumWorld.y)
                    maxmax.y = boundingBox.maximumWorld.y;
                if (maxmax.z < boundingBox.maximumWorld.z)
                    maxmax.z = boundingBox.maximumWorld.z;
            }
            return { size: maxmax.subtract(minmin), center: maxmax.addInPlace(minmin).scaleInPlace(0.5) };
        };
        /**
         * returns {boolean} True, when this specific instance is paused
         */
        Mesh.prototype.isPaused = function () { return this._instancePaused; };
        /**
         * Called to pause this specific instance from performing additional animation.
         * This is independent of a system pause.
         */
        Mesh.prototype.pausePlay = function () {
            this._instancePaused = true;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].pauseInstance();
            }
            if (this._poseProcessor) {
                this._poseProcessor.pauseInstance();
            }
            if (this._povProcessor) {
                this._povProcessor.pauseInstance();
            }
        };
        /**
         * Called to resume animating this specific instance.
         * A system in pause will still prevent animation from resuming.
         */
        Mesh.prototype.resumeInstancePlay = function () {
            this._instancePaused = false;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].resumeInstancePlay();
            }
            if (this._poseProcessor) {
                this._poseProcessor.resumeInstancePlay();
            }
            if (this._povProcessor) {
                this._povProcessor.resumeInstancePlay();
            }
        };
        return Mesh;
    }(BABYLON.Mesh));
    // for grand entrances
    Mesh.COMPUTED_GROUP_NAME = "COMPUTED-GROUP"; // having a '-' is strategic, since that is the separator for blender shapekeys (GROUP-KEYNAME)
    QI.Mesh = Mesh;
})(QI || (QI = {}));







/// <reference path="./Mesh.ts"/>
var QI;
(function (QI) {
    var Hair = (function (_super) {
        __extends(Hair, _super);
        /**
         * @constructor - Args same As BABYLON.Mesh, except that the arg for useVertexColor in LinesMesh is not passed an hard-coded to true
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        function Hair(name, scene, parent, source, doNotCloneChildren) {
            if (parent === void 0) { parent = null; }
            return _super.call(this, name, scene, parent, source, doNotCloneChildren, true) || this;
        }
        // ====================================== initializing =======================================
        /**
         * Called to generate the geometry using values which are more compact to pass & allow multiple things to be defined.
         * @param {number[]} strandNumVerts -The number of verts per each strand.
         * @param {number[]} rootRelativePositions - The x, y, z values of each point.  First is root is absolute, rest are delta to root.
         *                                           More compact than absolute for all, & useful in calculating hair length at each point.
         * @param {number} longestStrand - The longest distance between the first & last points in the strands, optional.
         * @param {number} stiffness - The matrix weight at the end of the longest strand, optional.
         * @param {number} boneIndex - The index of the bone in the skeleton to be used as a bone influencer, optional.
         */
        Hair.prototype.assemble = function (strandNumVerts, rootRelativePositions, longestStrand, stiffness, boneIndex) {
            var idx = 0; // index used for writing into indices
            var pdx = 0; // index used for writing into positions
            var cdx = 0; // index used for writing into vertex colors
            var mdx = 0; // index used for writing into matrix indices & weights
            var indices = []; // cannot use Uint32Array as it is not worth finding out how big it is going to be in advance
            var nPosElements = rootRelativePositions.length;
            var positions32 = new Float32Array(nPosElements);
            var colors32 = new Float32Array(nPosElements / 3 * 4);
            var matrixIndices;
            var matrixWeights;
            var deltaStiffness;
            if (boneIndex) {
                matrixIndices = new Float32Array(nPosElements / 3 * 4);
                matrixWeights = new Float32Array(nPosElements / 3 * 4);
                deltaStiffness = 1 - stiffness;
            }
            var rootX, rootY, rootZ;
            var deltaX, deltaY, deltaZ;
            var colorR, colorG, colorB, colorA;
            var colorOffset;
            for (var i = 0, nStrands = strandNumVerts.length; i < nStrands; i++) {
                rootX = positions32[pdx] = rootRelativePositions[pdx];
                rootY = positions32[pdx + 1] = rootRelativePositions[pdx + 1];
                rootZ = positions32[pdx + 2] = rootRelativePositions[pdx + 2];
                pdx += 3;
                colorOffset = Math.random() * (2 * Hair.COLOR_RANGE) - Hair.COLOR_RANGE; // between -.1 and .1
                colorR = colors32[cdx] = Math.min(1, Math.max(0, this.color.r + colorOffset));
                colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, this.color.g + colorOffset));
                colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, this.color.b + colorOffset));
                colorA = colors32[cdx + 3] = 1;
                cdx += 4;
                idx++;
                if (boneIndex) {
                    matrixIndices[mdx] = 0; //boneIndex;
                    matrixWeights[mdx] = 0; //1
                    mdx += 4;
                }
                for (var vert = 1; vert < strandNumVerts[i]; vert++) {
                    deltaX = rootRelativePositions[pdx];
                    positions32[pdx] = rootX + deltaX;
                    deltaY = rootRelativePositions[pdx + 1];
                    positions32[pdx + 1] = rootY + deltaY;
                    deltaZ = rootRelativePositions[pdx + 2];
                    positions32[pdx + 2] = rootZ + deltaZ;
                    pdx += 3;
                    colors32[cdx] = colorR;
                    colors32[cdx + 1] = colorG;
                    colors32[cdx + 2] = colorB;
                    colors32[cdx + 3] = colorA;
                    cdx += 4;
                    if (boneIndex) {
                        matrixIndices[mdx] = 0; //boneIndex;
                        matrixWeights[mdx] = 0; //1 - (deltaStiffness * (this._lengthSoFar(deltaX, deltaY, deltaZ) / longestStrand));
                        mdx += 4;
                    }
                    indices.push(idx - 1);
                    indices.push(idx);
                    idx++;
                }
            }
            this.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions32);
            this.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors32);
            this.setIndices(indices);
            if (boneIndex) {
                this.numBoneInfluencers = 1;
                this.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matrixIndices);
                this.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matrixWeights);
            }
        };
        Hair.prototype._lengthSoFar = function (deltaX, deltaY, deltaZ) {
            return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ));
        };
        return Hair;
    }(BABYLON.LinesMesh));
    Hair.COLOR_RANGE = 0.050;
    QI.Hair = Hair;
})(QI || (QI = {}));

var QI;
(function (QI) {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    var AudioRecorder = (function () {
        function AudioRecorder() {
            this.initialized = false; // set in prepMic; will remain false if WebAudio or navigator.getUserMedia not supported
            this.playbackReady = false;
            this.recording = false;
            // arrays of FloatArrays made during recording
            this._leftchannel = new Array();
            this._rightchannel = new Array();
            this._recorder = null;
            this._recordingLength = 0;
            this._volume = null;
            this._audioInput = null;
        }
        /**
         * static function to return a AudioRecorder instance, if supported.  Single instance class.
         * @param {() => void} doneCallback - callback to return when successfully complete (optional)
         */
        AudioRecorder.getInstance = function (doneCallback) {
            if (AudioRecorder._instance)
                return AudioRecorder._instance;
            AudioRecorder._instance = new AudioRecorder();
            AudioRecorder._instance._completionCallback = doneCallback ? doneCallback : null;
            if (!BABYLON.Engine.audioEngine.canUseWebAudio) {
                window.alert('QI.AudioRecorder: WebAudio not supported');
                return AudioRecorder._instance;
            }
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
                var getUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ?
                    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
                    function (constraints) {
                        return new Promise(function (resolve, reject) {
                            navigator.getUserMedia(constraints, resolve, reject);
                        });
                    };
                getUserMedia({ audio: true })
                    .then(function (streamReceived) { AudioRecorder.prepMic(streamReceived); })
                    .catch(function (reportError) { window.alert('QI.AudioRecorder: Error initializing audio capture:\n\t' + reportError + '\nNote: Firefox errors when mic not plugged in.'); });
            }
            else {
                window.alert('QI.AudioRecorder: Navigator.getUserMedia not supported.');
            }
            return AudioRecorder._instance;
        };
        /**
         * static because it is in a callback for navigator.getUserMedia()
         */
        AudioRecorder.prepMic = function (stream) {
            var instance = AudioRecorder._instance;
            var context = BABYLON.Engine.audioEngine.audioContext;
            // assign a gain node
            instance._volume = context.createGain(); //instance.audioEngine.masterGain;
            // creates an audio node from the microphone incoming stream
            instance._audioInput = context.createMediaStreamSource(stream);
            // connect the stream to the gain node
            instance._audioInput.connect(instance._volume);
            /* From the spec: This value controls how frequently the audioprocess event is
            dispatched and how many sample-frames need to be processed each call.
            Lower values for buffer size will result in a lower (better) latency.
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 4096;
            instance._recorder = context.createScriptProcessor(bufferSize, 2, 2);
            // cannot reference using 'this' inside of callback
            instance._recorder.onaudioprocess = function (e) {
                if (!instance.recording)
                    return;
                var evt = e;
                var left = evt.inputBuffer.getChannelData(0);
                var right = evt.inputBuffer.getChannelData(1);
                // we clone the samples
                instance._leftchannel.push(new Float32Array(left));
                instance._rightchannel.push(new Float32Array(right));
                instance._recordingLength += bufferSize;
                // determine if the duration required has yet occurred
                if (instance._requestedDuration !== Number.MAX_VALUE && BABYLON.Tools.Now - instance._requestedDuration >= instance._startTime)
                    instance.recordStop();
            };
            // we connect the recorder
            instance._volume.connect(instance._recorder);
            instance._recorder.connect(context.destination);
            instance.initialized = true;
            // let webpage enable controls accordingly
            if (instance._completionCallback) {
                instance._completionCallback();
                instance._completionCallback = null;
            }
        };
        // ==================================== Recording Methods ====================================
        /**
         * Begin recording from the microphone
         * @param {number} durationMS- Length to record in millis (default Number.MAX_VALUE).
         * @param {() => void} doneCallback - Function to call when recording has completed (optional).
         */
        AudioRecorder.prototype.recordStart = function (durationMS, doneCallback) {
            if (durationMS === void 0) { durationMS = Number.MAX_VALUE; }
            if (this.recording) {
                BABYLON.Tools.Warn('QI.AudioRecorder: already recording');
                return;
            }
            this.recording = true;
            this._requestedDuration = durationMS;
            this._startTime = BABYLON.Tools.Now;
            this._completionCallback = doneCallback ? doneCallback : null;
            this.clean();
        };
        /**
         * Stop mic recording.  Called the onaudioprocess() when time expires.  Called actively when a
         * duration was not specified with recordStart().
         */
        AudioRecorder.prototype.recordStop = function () {
            if (!this.recording) {
                BABYLON.Tools.Warn('QI.AudioRecorder: recordStop when not recording');
                return;
            }
            this.recording = false;
            // we flatten the left and right channels down
            this._leftBuffer = this._mergeBuffers(this._leftchannel);
            this._rightBuffer = this._mergeBuffers(this._rightchannel);
            this.playbackReady = true;
            this.clean(false);
            if (this._completionCallback)
                this._completionCallback();
        };
        /**
         * recording uses multiple buffers, each pushed onto an array.  This is called for each channel,
         * at the end of the recording, to combine them all into 1.
         * @param {Float32Array[]} channelBuffers- The recording buffers of either left or right channel.
         * @returns {Float32Array} combined data.
         */
        AudioRecorder.prototype._mergeBuffers = function (channelBuffers) {
            var result = new Float32Array(this._recordingLength);
            var offset = 0;
            var lng = channelBuffers.length;
            for (var i = 0; i < lng; i++) {
                var buffer = channelBuffers[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        };
        /**
         * Delete buffers
         * @param {boolean} fullReset- Make no-longer playback ready (default true).
         */
        AudioRecorder.prototype.clean = function (fullReset) {
            if (fullReset === void 0) { fullReset = true; }
            // reset all the during recording buffers at the end of a recording.
            this._leftchannel.length = this._rightchannel.length = 0;
            this._recordingLength = 0;
            if (fullReset) {
                // delete previous merged buffers, if they exist
                this._leftBuffer = this._rightBuffer = null;
                this.playbackReady = false;
            }
        };
        // ==================================== Playback Methods =====================================
        /**
         * play recorded sound from internal buffers
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.playback = function (downSampling, begin, end) {
            if (downSampling === void 0) { downSampling = 1; }
            if (begin === void 0) { begin = 0; }
            var newBuffer = this.getAudioBuffer(downSampling, begin, end);
            if (!newBuffer)
                return;
            var context = BABYLON.Engine.audioEngine.audioContext;
            var newSource = context.createBufferSource();
            newSource.buffer = newBuffer;
            newSource.connect(context.destination);
            newSource.start(0);
        };
        /**
         * play sound from an external buffer
         * @param {AudioBuffer} audio - The external bufer
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.playbackExternal = function (audio, downSampling, begin, end) {
            if (downSampling === void 0) { downSampling = 1; }
            if (begin === void 0) { begin = 0; }
            if (!end)
                end = audio.getChannelData(0).length;
            var stereo = audio.numberOfChannels > 1;
            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var length = leftBuffer.length;
            var sampleRate = audio.sampleRate / downSampling;
            var context = BABYLON.Engine.audioEngine.audioContext;
            audio = context.createBuffer(stereo ? 2 : 1, leftBuffer.length, sampleRate);
            audio.getChannelData(0).set(leftBuffer);
            if (stereo)
                audio.getChannelData(1).set(rightBuffer);
            var newSource = context.createBufferSource();
            newSource.buffer = audio;
            newSource.connect(context.destination);
            newSource.start(0);
        };
        /**
         * let it be known how many samples are in a recording
         * @returns{number}
         */
        AudioRecorder.prototype.getNSamples = function () {
            return this._leftBuffer ? this._leftBuffer.length : 0;
        };
        /**
         * Get the mic recorded data in the form of an AudioBuffer.  This can then be put into a
         * BABYLON.Sound via setAudioBuffer().  Also used internally, so can have .WAV / .TS methods work
         * from either an external sound or mic.
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {AudioBuffer}
         */
        AudioRecorder.prototype.getAudioBuffer = function (downSampling, begin, end) {
            if (downSampling === void 0) { downSampling = 1; }
            if (begin === void 0) { begin = 0; }
            if (!this.playbackReady) {
                BABYLON.Tools.Warn('QI.AudioRecorder: playback when not playbackReady');
                return null;
            }
            var leftBuffer;
            var rightBuffer;
            if (begin === 0 && !end) {
                leftBuffer = AudioRecorder._downSampling(this._leftBuffer, downSampling);
                rightBuffer = AudioRecorder._downSampling(this._rightBuffer, downSampling);
            }
            else {
                // adjust args
                if (!end)
                    end = this._leftBuffer.length;
                leftBuffer = AudioRecorder._downSampling(this._leftBuffer.slice(begin, end), downSampling);
                rightBuffer = AudioRecorder._downSampling(this._rightBuffer.slice(begin, end), downSampling);
            }
            var context = BABYLON.Engine.audioEngine.audioContext;
            var ret = context.createBuffer(2, leftBuffer.length, context.sampleRate / downSampling);
            ret.getChannelData(0).set(leftBuffer);
            ret.getChannelData(1).set(rightBuffer);
            return ret;
        };
        // ==================================== To Script Methods ====================================
        /** revoke the last temp url */
        AudioRecorder._cleanUrl = function () {
            if (AudioRecorder._objectUrl) {
                (window.webkitURL || window.URL).revokeObjectURL(AudioRecorder._objectUrl);
                AudioRecorder._objectUrl = null;
            }
        };
        /**
         * Save the last mircorphone recording as an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.micToScript = function (sndName, stereo, downSampling, typeScript, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (downSampling === void 0) { downSampling = 1; }
            if (typeScript === void 0) { typeScript = false; }
            if (begin === void 0) { begin = 0; }
            // not calling getAudioBuffer with args, since passed to & processed by saveToScript()
            AudioRecorder.saveToScript(sndName, this.getAudioBuffer(), stereo, downSampling, typeScript, begin, end);
        };
        /**
         * Save an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.saveToScript = function (sndName, audio, stereo, downSampling, typeScript, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (downSampling === void 0) { downSampling = 1; }
            if (typeScript === void 0) { typeScript = false; }
            if (begin === void 0) { begin = 0; }
            AudioRecorder._cleanUrl();
            if (sndName.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }
            else if (sndName.indexOf('.') !== -1) {
                window.alert('QI.AudioRecorder: Dot not allowed in a function name');
                return;
            }
            var filename = sndName + (typeScript ? '.ts' : '.js');
            var blob = new Blob([AudioRecorder._getScriptSource(sndName, audio, stereo, downSampling, typeScript, begin, end)], { type: 'text/plain;charset=utf-8' });
            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        };
        /**
         * Encode an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, and also the name of the function
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {boolean} typeScript - Style of function to build, Typescript when True, else Javascript
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {string} - in-line source code
         */
        AudioRecorder._getScriptSource = function (sndName, audio, stereo, downSampling, typeScript, begin, end) {
            // adjust args
            if (!end)
                end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;
            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var length = leftBuffer.length;
            var sampleRate = audio.sampleRate / downSampling;
            var ret = typeScript ? 'export function ' + sndName + '(scene: BABYLON.Scene) : BABYLON.Sound {\n' :
                'function ' + sndName + '(scene) {\n';
            ret += '    var context = BABYLON.Engine.audioEngine.audioContext;\n';
            ret += '    var audioBuffer = context.createBuffer(' + (stereo ? 2 : 1) + ', ' + length + ', ' + sampleRate + ');\n';
            ret += '    audioBuffer.getChannelData(0).set(QI.decode16Bit(\"' + AudioRecorder._floatTo16BitIntBase64(leftBuffer) + '\") );\n';
            if (stereo) {
                ret += '    audioBuffer.getChannelData(1).set(QI.decode16Bit(\"' + AudioRecorder._floatTo16BitIntBase64(rightBuffer) + '\") );\n';
            }
            ret += '    var snd = new BABYLON.Sound("' + sndName + '", null, scene);\n';
            ret += '    snd.setAudioBuffer(audioBuffer);\n';
            ret += '    return snd;\n';
            ret += '}\n';
            return ret;
        };
        /**
         * encode a float array with values (-1 to 1) as BASE 64 string, after converting to a short int (16 bit)
         */
        AudioRecorder._floatTo16BitIntBase64 = function (array) {
            var binary = '';
            for (var i = 0, len = array.length; i < len; i++) {
                binary += AudioRecorder._to16Bit(array[i]);
            }
            return window.btoa(binary);
        };
        AudioRecorder._to16Bit = function (val) {
            var asShort = (val * 0x7FFF) & 0xFFFF; // convert to: -32,768 - 32,767, then truncate
            var binary = String.fromCharCode((asShort & 0xFF00) >> 8); // append high order byte
            binary += String.fromCharCode(asShort & 0x00FF); // append low  order byte
            return binary;
        };
        /*        private static _to8Bit(val : number) : string {
                     var asByte = (val * 0x7F) & 0xFF;  // convert to: -128 - 127, then truncate
                     return String.fromCharCode(asByte);
                }
        */
        // ====================================== To Wav Methods =====================================
        /**
         * Save the last mircorphone recording as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.micToWAV = function (filename, stereo, downSampling, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (downSampling === void 0) { downSampling = 1; }
            if (begin === void 0) { begin = 0; }
            AudioRecorder.saveToWAV(filename, this.getAudioBuffer(), stereo, downSampling, begin, end);
        };
        /**
         * Save an audio buffer as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {AudioBuffer} audio - buffer to save
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.saveToWAV = function (filename, audio, stereo, downSampling, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (downSampling === void 0) { downSampling = 1; }
            if (begin === void 0) { begin = 0; }
            if (filename.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }
            else if (filename.toLowerCase().lastIndexOf('.wav') !== filename.length - 4 || filename.length < 5) {
                filename += '.wav';
            }
            var blob = new Blob([AudioRecorder._encodeWAV(audio, stereo, downSampling, begin, end)], { type: 'audio/wav' });
            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        };
        /**
         * Encode an audio buffer into a WAV formatted DataView
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {DataView} - WAV formatted
         */
        AudioRecorder._encodeWAV = function (audio, stereo, downSampling, begin, end) {
            // adjust args
            if (!end)
                end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;
            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var sampleRate = audio.sampleRate / downSampling;
            // interleave both channels together, if stereo
            var interleaved = stereo ? AudioRecorder._interleave(leftBuffer, rightBuffer) : leftBuffer;
            var dataSize = interleaved.length * 2; // 2 bytes per byte to also include volume with each
            var headerSize = 44;
            var nChannels = stereo ? 2 : 1;
            var blockAlign = nChannels * 2;
            var buffer = new ArrayBuffer(headerSize + dataSize);
            var view = new DataView(buffer);
            // - - - - - - RIFF chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, headerSize + dataSize, true);
            AudioRecorder._writeUTFBytes(view, 8, 'WAVE');
            // - - - - - - FMT inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true); // size of FMT inner-chunk
            // format WAVEFORMATEX, http://msdn.microsoft.com/en-us/library/windows/desktop/dd390970%28v=vs.85%29.aspx
            view.setUint16(20, 1, true); // WAVEFORMATEX
            view.setUint16(22, nChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * blockAlign, true); // nAvgBytesPerSec
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, 16, true); // bits per sample (same for mono / stereo, since stereo is 2 samples)
            // - - - - - - data inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 36, 'data');
            view.setUint32(40, dataSize, true);
            // write the PCM samples
            var lng = interleaved.length;
            var index = headerSize;
            var volume = 1;
            // write each byte of data + volume byte
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }
            return view;
        };
        /**
         * encode a text string into a dataview as 8 bit characters
         * @param {DataView} view- DataView to update
         * @param {number} offset- location in view to edit
         * @param {string} str- Values to insert
         */
        AudioRecorder._writeUTFBytes = function (view, offset, str) {
            var lng = str.length;
            for (var i = 0; i < lng; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        // ====================================== buffer Methods =====================================
        /**
         * Combine left and right channels, alternating values, returned in a new Array
         */
        AudioRecorder._interleave = function (left, right) {
            var length = left.length + right.length;
            var result = new Float32Array(length);
            var inputIndex = 0;
            for (var index = 0; index < length;) {
                result[index++] = left[inputIndex];
                result[index++] = right[inputIndex];
                inputIndex++;
            }
            return result;
        };
        AudioRecorder._downSampling = function (buf, factor) {
            if (factor === 1)
                return buf;
            var length = Math.floor(buf.length / factor);
            var result = new Float32Array(length);
            for (var i = 0, j = 0; i < length * factor; i += factor, j++) {
                result[j] = buf[i];
            }
            return result;
        };
        return AudioRecorder;
    }());
    QI.AudioRecorder = AudioRecorder;
})(QI || (QI = {}));

var QI;
(function (QI) {
    function decode16Bit(base64) {
        var bStr = window.atob(base64);
        var len = bStr.length;
        var ret = new Float32Array(len / 2);
        for (var i = 0, j = 0; i < len; i += 2, j++) {
            ret[j] = decode16(bStr, i);
        }
        return ret;
    }
    QI.decode16Bit = decode16Bit;
    // ======================================= str to num ========================================
    function decode16(bStr, offset) {
        var b1 = bStr.charCodeAt(offset);
        var b2 = bStr.charCodeAt(offset + 1);
        var isNeg = b1 >> 7 === 1;
        b1 = b1 & 0x7F;
        var asShort = 256 * b1 + b2;
        if (isNeg)
            asShort -= 0x8000;
        return asShort / 0x7FFF;
    }
    /*
        function decode8(bStr : string, offset : number) : number {
            var b = bStr.charCodeAt(offset);
            var isNeg = b >> 7 === 1;
            var asByte = b & 0x7F;
            if (isNeg) asByte *= -1;
            return asByte / 0x7F;
        }
    */
})(QI || (QI = {}));

/// <reference path="./AudioDecoder.ts"/>
var QI;
(function (QI) {
    function Whoosh(scene) {
        var context = BABYLON.Engine.audioEngine.audioContext;
        var audioBuffer = context.createBuffer(1, 3678, 12000);
        audioBuffer.getChannelData(0).set(QI.decode16Bit("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"));
        var snd = new BABYLON.Sound("whoosh", null, scene);
        snd.setAudioBuffer(audioBuffer);
        return snd;
    }
    QI.Whoosh = Whoosh;
})(QI || (QI = {}));

/// <reference path="./AudioDecoder.ts"/>
var QI;
(function (QI) {
    function Teleport(scene) {
        var context = BABYLON.Engine.audioEngine.audioContext;
        var audioBuffer = context.createBuffer(1, 9021, 12000);
        audioBuffer.getChannelData(0).set(QI.decode16Bit("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/4P/f/+F/4T/hP9//4b/hf+E/4D/hf+F/4T/gP+H/4r/hf+F/4T/hP+F/4X/hf+F/4X/hP+E/4X/hf+G/4b/hf+G/4b/hv+F/4b/hv+H/4f/hv+H/4f/h/+G/4f/h/+I/4j/h/+H/4j/iP+H/4f/iP+I/4n/if+I/4n/if+J/4j/if+J/4r/iv+J/4r/iv+K/4n/iv+K/4n/i/+K/4r/i/+L/4r/iv+L/4v/jP+M/4v/jP+M/4z/jP+M/4v/jP+M/43/jf+N/4z/jf+N/4z/jP+N/43/jv+O/43/jv+O/47/jv+O/43/jf+O/4//j/+P/4//j/+P/47/jv+P/4//kP+Q/4//kP+Q/5D/kP+Q/4//j/+Q/5H/kf+R/5H/kf+R/5D/kf+R/5H/kv+S/5D/jv/dAJkAiQCjALcAywDIANYA3gDmAOYA7QDyAPIA8QD0APcA9wD5APkA+AD4APYA9QD1APQA+QD8AP8A/wECAQMBAwEDAQIBAAEAAP0A+ADvAPAA6QDiANkA2gDNAL8AtACvAJcAXQAu/4r/bf9X/1n/Sv9E/z//P/89/z7/Qv9D/0z/WP9c/2T/a/9y/3L/ef9+/4T/g/+G/4b/hf+F/4D/ff98/3v/ef96/3r/fv+F/5f/kv/LAFsAgQB+AIgAiwCLAIsAiQCFAIQAgAB4AGsAbABeAFQATQBMAFsAbQB/AIAAmQCsALIAugDEAMoAygDOAM8AzgDPAMoAxAC2ALcAoQB+//D/nP9h/0f/Rf83/yv/Iv8i/x7/Hv8f/x7/JP8q/zD/MP88/0z/Vf9n/6AAswCUALoA0wDoAOUA8gD3APoA+gD6APYA8gDuAOAAyQDFAKYAY/9D/2X/Nv8g/w7/EP8B/vr++f74/vv/B/8M/xb/MP9//4YArADMAOsA6gD+AQUBCAEJAQYA/QEAAO4A1wDMAI0Aov9c/y//NP8S/wz+//73/vj++f8C/wz/NP8l/3kAsAC0AOYA6gD4AP8A/wD6APQA6ADHANcAo/+s/2v/L/80/x3/Ev8R/xX/Gf8q/0z/PP+MACkApwDPAMYA0wDVANUAyQDHAK0AagBz/37/Y/9P/1P/Uf9l/3f/f/+P/4//iv+A/4H/hv+K/6X/x/+9AB4ANQBNAIEAdgCiALUAugC5ALcAq/+J/6b/Uf9B/y3/Kf8o/y//T/90AKMAlgDRAOMA6ADgANkAwv+P/7r/RP8q/xT/EP8M/x//hv+4ANIA1gDtAOgA6wDD"));
        var snd = new BABYLON.Sound("teleport", null, scene);
        snd.setAudioBuffer(audioBuffer);
        return snd;
    }
    QI.Teleport = Teleport;
})(QI || (QI = {}));







/// <reference path="../Mesh.ts"/>
/// <reference path="../../deformation/shapeKeyBased/ShapeKeyGroup.ts"/>
/// <reference path="../../deformation/shapeKeyBased/VertexDeformation.ts"/>
var QI;
(function (QI) {
    /**
     * @immutable, reusable
     * data class to hold values to create VertexDeformations.  These are like recipes or the directions.  They need to be
     * applied to the each Automaton.
     */
    var Expression = (function () {
        /**
         * @param {string} name - Used to populate dropdowns, upper case recommended since this will end up being an endStateName in group FACE.
         * @param {boolean} winkable - Indicate that it makes sense for a wink to be done.  Should not have any EyeLid or EyeBrow states.
         * @param {boolean} blinkable - Indicate that blinking could be allow for this expression.
         * @param {boolean} randomizable - Indicate that this expression is usable for random mood.  Strong expressions (like Crying) are not good candidates.
         * @param {string[]} endStateNames - names of state to combine.
         * @param {number[]} endStateRatios - ratios of states to combine.
         * @param {string} mirrorAxes - When one of the endStateRatios is negative, this must be specified to indicate the axis to mirror on:
         *                 Use anything for endstates >= 0, but '-' is a good convention.
         */
        function Expression(name, winkable, blinkable, randomizable, endStateNames, endStateRatios, mirrorAxes, id) {
            this.name = name;
            this.winkable = winkable;
            this.blinkable = blinkable;
            this.randomizable = randomizable;
            this.endStateNames = endStateNames;
            this.endStateRatios = endStateRatios;
            this.mirrorAxes = mirrorAxes;
            this.id = id;
            this.mirrorReqd = false;
            if (this.endStateNames.length !== this.endStateRatios.length) {
                BABYLON.Tools.Error("Expression: " + this.name + " invalid when endStateNames not same length as endStateRatios");
                return;
            }
            if (this.mirrorAxes && this.mirrorAxes.length !== this.endStateRatios.length) {
                BABYLON.Tools.Error("Expression: " + this.name + " invalid when mirrorAxes not same length as endStateRatios");
                return;
            }
            for (var i = 0, len = this.endStateRatios.length; i < len; i++) {
                if (this.endStateRatios[i] < 0) {
                    this.mirrorReqd = true;
                    break;
                }
            }
            if (!this.mirrorAxes && this.mirrorReqd) {
                BABYLON.Tools.Error("Expression: " + this.name + " invalid when mirrorAxes missing when an endStateRatios is negative");
            }
            Object.freeze(this); // make immutable
        }
        Object.defineProperty(Expression.prototype, "isViseme", {
            get: function () { return this.id && this.id === Expression.VISEME_ID; },
            enumerable: true,
            configurable: true
        });
        /**
         * This is so expression developer can log changes to be communicated back for source code implementation.
         */
        Expression.prototype.toString = function () {
            var ret = "var exp = new QI.Expression(\"" + this.name + "\", " + this.winkable + ", " + this.blinkable + ", " + this.randomizable + ", ";
            var n = "[", s = "[";
            var nStates = this.endStateNames.length;
            for (var i = 0; i < nStates; i++) {
                n += "\"" + this.endStateNames[i] + "\"";
                s += this.endStateRatios[i];
                if (i + 1 < nStates) {
                    n += ", ";
                    s += ", ";
                }
                else {
                    n += "]";
                    s += "]";
                }
            }
            ret += n + ", " + s + ", ";
            ret += this.mirrorReqd ? "\"" + this.mirrorAxes + "\"" : "null";
            ret += this.id ? ", " + this.id : "";
            ret += ");\n";
            return ret + "model.addExpression(exp);";
        };
        return Expression;
    }());
    // stock expressions
    Expression.NONE = new Expression("NONE", true, true, false, [], [], null, 0);
    Expression.ANGRY = new Expression("ANGRY", false, true, true, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "SYMMETRY_LEFT_UP"], [1.85, 0.3, 1.85, -0.3, 1.4, 1, -0.2, 1, 0.1], "---Y--Y--", 1);
    Expression.CRYING = new Expression("CRYING", false, false, false, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP"], [-1, 1.4, -0.2, -0.2, 1.2, 1.2, 1.25, -0.65], "Y-YY---Y", 2);
    Expression.DISGUSTED = new Expression("DISGUSTED", false, true, true, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP"], [0.95, 0.05, 0.55, 1, 0.45, -0.1, 1.35, 1.3, -0.1, 0.2, -1], "-----Y--Y-Y", 3);
    Expression.HAPPY = new Expression("HAPPY", true, true, true, ["CHEEKS_HIGH", "CHEEKS_PUMP", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_LEFT_UP", "SYMMETRY_RIGHT_UP"], [0.8, 0.25, -0.8, -0.1, 0.15, 0.25, -0.45, 0.5, 0.7, -0.5, -0.25, 0.4, -0.1, 0.1, 0.2], "--YY--Y--YY-X--", 4);
    Expression.LAUGH = new Expression("LAUGH", true, true, true, ["CHEEKS_HIGH", "EYEBROWS_ANGRY", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.8, -1, -0.15, 0.55, 0.45, -0.25, 0.5, 0.85, -1], "-YY--Z--X", 5);
    Expression.PPHPHT = new Expression("PPHPHT", false, true, false, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYELIDS_SQUINT", "NOSE_FLARE", "TONGUE_STUCK_OUT", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.5, 1, 0.5, 1, 1.05, 0.5, 1], null, 6);
    Expression.SAD = new Expression("SAD", false, true, true, ["CHEEKS_HIGH", "CHEEKS_PUMP", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_UP", "MOUTH_PUCKER", "MOUTH_WIDE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-1.45, -0.35, 0.05, -1, -0.35, -0.4, 0.65, -0.3, 0.25, 0.2, -0.1], "YX-YYY-X--Y", 7);
    Expression.SCARED = new Expression("SCARED", false, false, true, ["CHEEKS_HIGH", "EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_LEFT", "WINK_RIGHT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-0.05, 1.25, 1.75, -0.65, -0.6, -0.25, 0.35, -0.6, -0.65, 0.05], "Y--YYY-YX-", 8);
    Expression.SKEPTICAL = new Expression("SKEPTICAL", false, false, true, ["EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_RIGHT", "NOSE_FLARE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-0.65, 0.95, -0.35, -0.25, -0.2, 0.15], "Y-YYX-", 9);
    Expression.STRUGGLING = new Expression("STRUGGLING", false, false, false, ["EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "WINK_RIGHT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE", "SYMMETRY_LEFT_UP", "SYMMETRY_RIGHT_UP"], [1, 0.6, 1, 0.25, 0.35, 1, 0.5, 0.35, -0.7, 0.6, 0.05, -0.4, 0.55], "--------Y--Y-", 10);
    Expression.VISEME_ID = -1;
    Expression.VISEME_DICT = {
        ".": new Expression(".", true, true, false, ["MOUTH_LIPS_LOWER_OUT"], [0.25], null, Expression.VISEME_ID),
        "AA": new Expression("AA", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.3, .65, .55, 0.10], null, Expression.VISEME_ID),
        "AO": new Expression("AO", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN", "MOUTH_WIDE"], [0.5, 0.35, -0.35], "--X", Expression.VISEME_ID),
        "AW-OW": new Expression("AW-OW", true, true, false, ["MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE"], [-0.05, 0.5, 0.35, 0.05, 1.5, -0.3], "Y-----", Expression.VISEME_ID),
        "AE-EH": new Expression("AE-EH", true, true, false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_WIDE"], [-0.25, 0.3, 0.8, -0.5, 0.45, 0.3], "Y--Y--", Expression.VISEME_ID),
        "AH-HH": new Expression("AH-HH", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN"], [0.3, 0.4], null, Expression.VISEME_ID),
        "AY-IH": new Expression("AY-IH", true, true, false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_WIDE"], [-0.25, 0.3, 0.8, -0.5, 0.35, 0.3], "Y--Y--", Expression.VISEME_ID),
        "B-M-P": new Expression("B-M-P", true, true, false, ["MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP"], [0.55, -0.45], "-Y", Expression.VISEME_ID),
        "CH-JH-SH-ZH": new Expression("CH-JH-SH-ZH", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.9, -0.45, -0.45, 1.1, 0.8], "-YY--", Expression.VISEME_ID),
        "DH-TH": new Expression("DH-TH", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE", "TONGUE_RAISED", "TONGUE_STUCK_OUT"], [0.6, -1, -0.05, 0.2, -0.05, 0.8, 0.05, 0.45], "-YY-X---", Expression.VISEME_ID),
        "ER-R-W": new Expression("ER-R-W", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [-0.3, 2, 0.25, 1], "Z---", Expression.VISEME_ID),
        "EY": new Expression("EY", true, true, false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_WIDE"], [-0.25, 0.3, 0.7, -0.5, 0.15, 0.3, 0.3], "Y--Y---", Expression.VISEME_ID),
        "F-V": new Expression("F-V", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE"], [.6, 0.2, -0.5, 1], "--Y-", Expression.VISEME_ID),
        "IY": new Expression("IY", true, true, false, ["NOSE_FLARE", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN"], [0.4, 0.05, 0.1, 0.4, 0.1], null, Expression.VISEME_ID),
        "L": new Expression("L", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE", "TONGUE_RAISED", "TONGUE_STUCK_OUT"], [0.35, -0.7, -0.2, 0.2, -0.05, 1, 0.2, 0.2], "-YY-X---", Expression.VISEME_ID),
        "OY-UH-UW": new Expression("OY-UH-UW", true, true, false, ["MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.65, 0.25, 1.55], null, Expression.VISEME_ID),
        "S": new Expression("S", true, true, false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.6, -1.05, -0.05, -0.05, 0.8], "-YYX-", Expression.VISEME_ID),
    };
    QI.Expression = Expression;
    var Automaton = (function (_super) {
        __extends(Automaton, _super);
        function Automaton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.doInvoluntaryBlinking = false;
            _this.expressions = new Array();
            _this._randomExpressions = new Array();
            _this._currentExpression = Expression.NONE;
            _this._currentExpDegree = 0;
            _this._idleMode = false;
            _this._randomMode = false;
            _this.doRandomEyes = false;
            return _this;
        }
        // no need for a constructor, just use super's & subclasses made by TOB
        // ====================================== initializing =======================================
        /**
         * The shapekeys will not be defined until the subclass constructor has run, so this put here.
         */
        Automaton.prototype.postConstruction = function () {
            // add the both closed to WINK before consolidation, so available for expressions
            this._winker = this.getShapeKeyGroup(Automaton._WINK);
            this._winker.addComboDerivedKey(QI.ShapeKeyGroup.BASIS, [Automaton._LEFT, Automaton._RIGHT], [1, 1], null, Automaton._BOTH_CLOSED);
            this._eyes = this.getShapeKeyGroup(Automaton._EYES);
            // composite the FACE group & nuke components; test allows things other than MakeHuman to send the FACE itself
            if (!this._face) {
                this._face = this.consolidateShapeKeyGroups(Automaton._FACE, ["CHEEKS", "EYEBROWS", "EYELIDS", "MOUTH", "NOSE", "SYMMETRY", "TONGUE", "WINK"], true); // keep groups, cause want WINK
                this.removeShapeKeyGroup("CHEEKS");
                this.removeShapeKeyGroup("EYEBROWS");
                this.removeShapeKeyGroup("EYELIDS");
                this.removeShapeKeyGroup("MOUTH");
                this.removeShapeKeyGroup("NOSE");
                this.removeShapeKeyGroup("SYMMETRY");
                this.removeShapeKeyGroup("TONGUE");
            }
            // expressions
            this.expressions.push(Expression.NONE);
            // make sure eyelids are always drawn last, must be after FACE built
            this.setShapeKeyGroupLast(Automaton._WINK);
        };
        /**
         * @param {String} name - The name of the new expression.
         * @param {boolean} winkable - Not all expressions is it appropriate to wink, indicate this one is with true.
         * @param {boolean} blinkable - It is not appropriate when an expression closes eyelids to allow blinking. Indicate no closing with true.
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.
         */
        Automaton.prototype.addExpression = function (exp) {
            this.expressions.push(exp);
            this._face.addComboDerivedKey(QI.ShapeKeyGroup.BASIS, exp.endStateNames, exp.endStateRatios, exp.mirrorAxes, exp.name);
            if (exp.randomizable) {
                this._randomExpressions.push(this.expressions.length - 1); // append index into expressions
            }
        };
        /**
         * Adds the expressions contained in this file.  These do take both time to construct and memory, so doing all might be wasteful.
         * @param {string} whichOnes - names of the ones to load, e.g. 'ANGRY LAUGH'.  When null, then all.
         */
        Automaton.prototype.addStockExpressions = function (whichOnes, visemesToo) {
            if (visemesToo === void 0) { visemesToo = true; }
            var all = !whichOnes;
            if (all || whichOnes.indexOf("ANGRY") !== -1)
                this.addExpression(Expression.ANGRY);
            if (all || whichOnes.indexOf("CRYING") !== -1)
                this.addExpression(Expression.CRYING);
            if (all || whichOnes.indexOf("DISGUSTED") !== -1)
                this.addExpression(Expression.DISGUSTED);
            if (all || whichOnes.indexOf("HAPPY") !== -1)
                this.addExpression(Expression.HAPPY);
            if (all || whichOnes.indexOf("LAUGH") !== -1)
                this.addExpression(Expression.LAUGH);
            if (all || whichOnes.indexOf("PPHPHT") !== -1)
                this.addExpression(Expression.PPHPHT);
            if (all || whichOnes.indexOf("SAD") !== -1)
                this.addExpression(Expression.SAD);
            if (all || whichOnes.indexOf("SCARED") !== -1)
                this.addExpression(Expression.SCARED);
            if (all || whichOnes.indexOf("SKEPTICAL") !== -1)
                this.addExpression(Expression.SKEPTICAL);
            if (all || whichOnes.indexOf("STRUGGLING") !== -1)
                this.addExpression(Expression.STRUGGLING);
            if (visemesToo) {
                for (var name in Expression.VISEME_DICT) {
                    this.addExpression(Expression.VISEME_DICT[name]);
                }
            }
        };
        /**
         * Release the shape key components after all the base expressions have been created.  Those for winking are always kept.
         */
        Automaton.prototype.removeExpressionComponents = function () {
            // those for CHEEKS
            this._face.deleteShapeKey("CHEEKS_HIGH");
            this._face.deleteShapeKey("CHEEKS_PUMP");
            this._face.deleteShapeKey("CHEEKS_SUCK");
            // those for EYEBROWS
            this._face.deleteShapeKey("EYEBROWS_ANGRY");
            this._face.deleteShapeKey("EYEBROWS_RAISED_LEFT");
            this._face.deleteShapeKey("EYEBROWS_RAISED_RIGHT");
            // those for EYELIDS (WINKS kept on the original group WINK)
            this._face.deleteShapeKey("EYELIDS_SQUINT");
            this._face.deleteShapeKey("WINK_BOTH_CLOSED");
            this._face.deleteShapeKey("WINK_LEFT");
            this._face.deleteShapeKey("WINK_RIGHT");
            // those for SYMMETRY
            this._face.deleteShapeKey("SYMMETRY_CHIN_LEFT");
            this._face.deleteShapeKey("SYMMETRY_LEFT_UP");
            this._face.deleteShapeKey("SYMMETRY_RIGHT_UP");
            // those for NOSE
            this._face.deleteShapeKey("NOSE_FLARE");
            // those for TONGUE
            this._face.deleteShapeKey("TONGUE_RAISED");
            this._face.deleteShapeKey("TONGUE_STUCK_OUT");
            // those for MOUTH
            this._face.deleteShapeKey("MOUTH_CORNERS_DOWN");
            this._face.deleteShapeKey("MOUTH_CORNERS_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_OUT");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_UPPER_UP");
            this._face.deleteShapeKey("MOUTH_OPEN");
            this._face.deleteShapeKey("MOUTH_PUCKER");
            this._face.deleteShapeKey("MOUTH_WIDE");
        };
        Automaton.prototype.getExpressionNames = function () {
            var len = this.expressions.length;
            var ret = new Array();
            for (var i = 0; i < len; i++) {
                if (!this.expressions[i].isViseme) {
                    ret.push(this.expressions[i].name);
                }
            }
            return ret;
        };
        Automaton.prototype.getVisemeNames = function () {
            var len = this.expressions.length;
            var ret = new Array();
            for (var i = 0; i < len; i++) {
                if (this.expressions[i].isViseme) {
                    ret.push(this.expressions[i].name);
                }
            }
            return ret;
        };
        // ============================ beforeRender callback & tracking =============================
        /** @override */
        Automaton.prototype.beforeRender = function () {
            _super.prototype.beforeRender.call(this);
            // do not auto submit anything until visible
            if (!this.isVisible)
                return;
            // can always do eye movement, since no conflicts with other shape keys or speech
            if (this.doRandomEyes && !this._eyes.isActive())
                this._eyeProcessing();
            // avoid queuing issues of eye lids, if a deformation in progress ( possibly a wink / blink too )
            if (this._shapeKeyChangesMade)
                return;
            // blink / wink queuing
            if (this.doInvoluntaryBlinking && !this._winker.isActive() && this._currentExpression.blinkable)
                this._winkProcessing();
            // idle mood processing, only when nothing running or in queue
            if (this._idleMode && !this._face.isActive())
                this._moodPostProcessing();
        };
        // ====================================== eye movement =======================================
        /**
         * This queues the next random move.
         */
        Automaton.prototype._eyeProcessing = function () {
            var duration = Math.random() * (500 - 200) + 200; // between 200 & 500 millis
            var delay = Math.random() * (10000 - 5000) + 5000; // between 5 & 10 secs
            var up = Math.random() * 2 - 1; // between -1 & 1
            var left = Math.random() * 2 - 1; // between -1 & 1
            this.queueEyeRotation(up, left, duration, delay, false);
        };
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {number} duration - The time the rotation is to take, in millis (Default 300).
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        Automaton.prototype.queueEyeRotation = function (up, left, duration, delay, clearQueue) {
            if (duration === void 0) { duration = 300; }
            if (delay === void 0) { delay = 0; }
            if (clearQueue === void 0) { clearQueue = true; }
            var stateNames = [];
            var ratios = [];
            if (up < 0) {
                stateNames.push("DOWN");
                ratios.push(Math.abs(up));
            }
            else {
                stateNames.push("UP");
                ratios.push(up);
            }
            if (left < 0) {
                stateNames.push("RIGHT");
                ratios.push(Math.abs(left));
            }
            else {
                stateNames.push("LEFT");
                ratios.push(left);
            }
            var deformation = new QI.VertexDeformation(Automaton._EYES, QI.ShapeKeyGroup.BASIS, stateNames, ratios, duration, null, null, { millisBefore: delay });
            var series = new QI.EventSeries([deformation]);
            if (clearQueue)
                this._eyes.clearQueue(true);
            this._eyes.queueEventSeries(series);
        };
        Automaton.prototype._winkProcessing = function () {
            var delay = Math.random() * (Automaton._MAX_INTERVAL - 2000) + 2000; // between 2000 & 8000 millis 
            this._queueLids(Automaton._BLINK, 10, delay, false);
        };
        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        Automaton.prototype.winkLeft = function (timeClosed) {
            if (timeClosed === void 0) { timeClosed = 50; }
            this._queueLids(Automaton._WINK_LEFT, timeClosed);
        };
        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        Automaton.prototype.winkRight = function (timeClosed) {
            if (timeClosed === void 0) { timeClosed = 50; }
            this._queueLids(Automaton._WINK_RIGHT, timeClosed);
        };
        /**
         * Indicate that a single blink should occur at the next available opportunity.
         */
        Automaton.prototype.blink = function () {
            this._queueLids(Automaton._BLINK, 20);
        };
        /**
         * @param {number} event   - either blink, wink left, or wink right
         * @param {number} timeClosed - Millis to stay closed, not including the close itself.
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        Automaton.prototype._queueLids = function (event, timeClosed, delay, clearQueue) {
            if (delay === void 0) { delay = 0; }
            if (clearQueue === void 0) { clearQueue = true; }
            var deformations;
            switch (event) {
                case Automaton._BLINK:
                    if (!this._currentExpression.blinkable)
                        return;
                    deformations = [new QI.Deformation(Automaton._WINK, Automaton._BOTH_CLOSED, 1, Automaton._DEFORM_SPEED, null, null, { millisBefore: delay }),
                        new QI.BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, { millisBefore: timeClosed }),
                    ];
                    break;
                case Automaton._WINK_LEFT:
                    if (!this._currentExpression.winkable)
                        return;
                    deformations = [new QI.Deformation(Automaton._WINK, Automaton._LEFT, 1, Automaton._DEFORM_SPEED, null, null, { millisBefore: delay }),
                        new QI.BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, { millisBefore: timeClosed }),
                    ];
                    break;
                case Automaton._WINK_RIGHT:
                    if (!this._currentExpression.winkable)
                        return;
                    deformations = [new QI.Deformation(Automaton._WINK, Automaton._RIGHT, 1, Automaton._DEFORM_SPEED, null, null, { millisBefore: delay }),
                        new QI.BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, { millisBefore: timeClosed }),
                    ];
                    break;
            }
            var series = new QI.EventSeries(deformations, 1, 1, Automaton._WINK);
            if (clearQueue)
                this._winker.clearQueue(true);
            this._winker.queueEventSeries(series);
        };
        // ====================================== Expressions ========================================
        /**
         * This queues the next change.  When called from beforeRender in idle mode,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In idle mode, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */
        Automaton.prototype._moodPostProcessing = function (skipChanging) {
            var duration = skipChanging ? 250 : 750;
            var delay = skipChanging ? 0 : Math.random() * 200;
            // section only run by idle mood changing
            if (!skipChanging) {
                var amtChange = Math.random() * .3 - .15; // between -.15 & .15
                if (this._currentExpDegree >= 0.7)
                    amtChange -= .02;
                else if (this._currentExpDegree <= 0.2)
                    amtChange += .02;
                this._currentExpDegree += amtChange;
                // this is always after exp degree set, cause if mood changed degree always set too
                if (this._randomMode)
                    this._pickAMood();
            }
            var deformation;
            if (this._currentExpression.endStateNames.length > 0)
                deformation = new QI.Deformation(Automaton._FACE, this._currentExpression.name, this._currentExpDegree, duration, null, null, { millisBefore: delay });
            else
                deformation = new QI.BasisReturn(Automaton._FACE, duration);
            var series = new QI.EventSeries([deformation]);
            // do not want to clear the potential stall from a grand entrance, which happens when textures already here, e.g. 2nd load
            var clear = this.isVisible && skipChanging;
            this._face.queueEventSeries(series, clear, clear);
        };
        Automaton.prototype._pickAMood = function () {
            if (this._numChangesOfCurrentMood++ < this._totChangesOfCurrentMood)
                return;
            var idx = Math.floor(Math.random() * this._randomExpressions.length);
            this._currentExpression = this.expressions[idx];
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood = Math.floor(Math.random() * (Automaton._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            this._currentExpDegree = .3; // always have low degree when first changing expression
        };
        // ============================== Public Expressions Methods =================================
        /**
         * To enable / disable idle mood changing mode.  Here the current oscillates by degree.
         * This will turn off random mode, if on, when switched off.
         * @param {boolean} on - The switch.
         */
        Automaton.prototype.setIdleMode = function (on) {
            this._idleMode = on;
            if (!on && this._randomMode)
                this.setRandomExpressionSwitching(false);
            // force picking of a new current mood, or not when not random
            this._numChangesOfCurrentMood = Automaton._MAX_CHANGES_FOR_MOOD;
        };
        /**
         * Allow automatic switching between expressions loaded which are indicated as 'randomizable'.
         * This will turn on idle mode, if off, when switched on.  Will not switch off idle mode, when switched
         * off, though.
         */
        Automaton.prototype.setRandomExpressionSwitching = function (on) {
            this._randomMode = on;
            if (on && !this._idleMode)
                this.setIdleMode(true);
        };
        /**
         * external call to manually change mood, or at least let the system know what you just queued
         * yourself (useful for speech, so idle mode might resume gracefully).
         * @param {string | Expression} expOrName - Name of the shape key representing the expression to change to or an expression.
         * When it is an Expression & not currently loaded, random & idle ARE turned off.  This is only for Expression development.
         *
         * Could also be the last one in the series you just queued yourself, if just documenting.
         * @param {number} degree - This is a value 0 - 1, indicating the degree to which max deformation
         * to expression should occur.
         * @param {boolean} justDocumenting - When true you have already submitted your own event series
         * that set the expression, but you want the system to know.
         */
        Automaton.prototype.setCurrentMood = function (expOrName, degree, justDocumenting) {
            var name = (expOrName instanceof Expression) ? expOrName.name : expOrName;
            // check if the expression has been loaded
            var idx = -1;
            for (var i = 0, len = this.expressions.length; i < len; i++) {
                if (this.expressions[i].name === name) {
                    idx = i;
                    break;
                }
            }
            // expression loaded
            if (idx !== -1) {
                this._currentExpDegree = degree;
                this._currentExpression = this.expressions[idx];
                if (!justDocumenting) {
                    this._numChangesOfCurrentMood = 0;
                    this._totChangesOfCurrentMood = Math.floor(Math.random() * (Automaton._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
                    this._moodPostProcessing(true);
                }
                return this._currentExpression;
            }
            else if (expOrName instanceof Expression) {
                this.setIdleMode(false);
                this.setRandomExpressionSwitching(false);
                var exp = expOrName;
                var options = exp.mirrorReqd ? { mirrorAxes: exp.mirrorAxes } : {};
                var deformation = new QI.VertexDeformation(Automaton._FACE, QI.ShapeKeyGroup.BASIS, exp.endStateNames, exp.endStateRatios, 250, null, null, options);
                var series = new QI.EventSeries([deformation]);
                // do not want to clear the potential stall from a grand entrance, which happens when textures already here, e.g. 2nd load
                this._face.queueEventSeries(series, this.isVisible, this.isVisible);
                return expOrName;
            }
            else {
                BABYLON.Tools.Error("QI.Automaton- " + this.name + " does not have expression: " + name);
                return null;
            }
        };
        return Automaton;
    }(QI.Mesh));
    // eye lids
    Automaton._WINK = "WINK"; // shape key group name
    // the list of possible blink events & morph targets
    Automaton._BLINK = 0;
    Automaton._BOTH_CLOSED = "BOTH_CLOSED";
    Automaton._WINK_LEFT = 1;
    Automaton._LEFT = "LEFT";
    Automaton._WINK_RIGHT = 2;
    Automaton._RIGHT = "RIGHT";
    // expressions
    Automaton._FACE = "FACE"; // shape key group name
    Automaton._MAX_CHANGES_FOR_MOOD = 10;
    // eyes
    Automaton._EYES = "EYES"; // shape key group name       
    // =================================== winking & blinking ====================================
    /**
     * Called by beforeRender(), unless no wink shape key group, or nothing to do.
     * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
     */
    Automaton._MAX_INTERVAL = 8000; // millis, 6000 is average according to wikipedia
    Automaton._DEFORM_SPEED = 50; // millis, 100 round trip
    QI.Automaton = Automaton;
})(QI || (QI = {}));

/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>






var QI;
(function (QI) {
    var GatherEntrance = (function (_super) {
        __extends(GatherEntrance, _super);
        function GatherEntrance() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // no need for a constructor, just use super's
        /** @override */
        GatherEntrance.prototype.makeEntrance = function () {
            var startingState = GatherEntrance.buildScatter(this._mesh);
            // queue a return to basis
            var ref = this;
            var events;
            events = [
                // morphImmediate to starting state prior making root mesh visible.  Start sound, if passed.
                new QI.MorphImmediate(QI.Mesh.COMPUTED_GROUP_NAME, startingState, 1, { sound: ref.soundEffect }),
                // make root mesh visible
                function () { ref._mesh.isVisible = true; },
                // return to a basis state
                new QI.BasisReturn(QI.Mesh.COMPUTED_GROUP_NAME, ref.durations[0]),
                // make any children visible
                function () {
                    ref._mesh.makeVisible(true);
                    ref._mesh.removeShapeKeyGroup(QI.Mesh.COMPUTED_GROUP_NAME);
                }
            ];
            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0], QI.Mesh.COMPUTED_GROUP_NAME);
            // run functions of series on the compute group so everything sequential
            var series = new QI.EventSeries(events, 1, 1.0, QI.Mesh.COMPUTED_GROUP_NAME);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        /**
         * Build a SCATTER end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        GatherEntrance.buildScatter = function (mesh) {
            var startingState = "SCATTER";
            var nElements = mesh._originalPositions.length;
            var computedGroup = mesh.makeComputedGroup();
            // determine the SCATTER key
            var center = mesh.getBoundingInfo().boundingBox.center;
            var scatter = new Float32Array(nElements);
            var amt;
            for (var i = 0; i < nElements; i += 3) {
                amt = (mesh._originalPositions[i] - center.x) * Math.random();
                scatter[i] = mesh._originalPositions[i] + amt;
                amt = (mesh._originalPositions[i + 1] - center.y) * Math.random();
                scatter[i + 1] = mesh._originalPositions[i + 1] + amt;
                amt = (mesh._originalPositions[i + 2] - center.z) * Math.random();
                scatter[i + 2] = mesh._originalPositions[i + 2] + amt;
            }
            computedGroup._addShapeKey(startingState, false, scatter);
            return startingState;
        };
        return GatherEntrance;
    }(QI.AbstractGrandEntrance));
    QI.GatherEntrance = GatherEntrance;
})(QI || (QI = {}));

/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>






var QI;
(function (QI) {
    /**
     * The Fire Entrance REQUIRES that BABYLON.FireMaterial.js be loaded
     */
    var FireEntrance = (function (_super) {
        __extends(FireEntrance, _super);
        function FireEntrance() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // no need for a constructor, just use super's
        /** @override */
        FireEntrance.prototype.makeEntrance = function () {
            if (!BABYLON.FireMaterial) {
                throw "Fire Material library not found";
            }
            this._count = 3;
            var ref = this;
            var callback = function () { ref._loaded(); };
            // same as coming from https://github.com/BabylonJS/Samples/tree/master/Assets/fire
            this._diffuse = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,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", "fireDiffuseTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
            // same as coming from https://github.com/BabylonJS/Samples/tree/master/Assets/fire
            this._distortion = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,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", "fireDistortionTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
            // see directory for source
            this._opacity = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,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", "fireOpacityTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
        };
        /**
         * Even with inline textures, the shaders must still be compiled.  Cannot
         * allow mesh to be visible prior or permanent material will flash.
         */
        FireEntrance.prototype._loaded = function () {
            if (--this._count === 0)
                this._showTime();
        };
        /**
         * The fire is now ready. Go for it.
         */
        FireEntrance.prototype._showTime = function () {
            // make the Fire Material
            var fire = new BABYLON.FireMaterial("Fire Entrance", this._mesh.getScene());
            fire.diffuseTexture = this._diffuse;
            fire.distortionTexture = this._distortion;
            fire.opacityTexture = this._opacity;
            fire.speed = 1.0;
            fire.alpha = 0.5;
            fire.checkReadyOnlyOnce = true;
            // get all child meshes, so all can be assigned fire material
            var meshNKids = this._mesh.getDescendants();
            meshNKids.push(this._mesh);
            // record permanent material, so can be returned when done
            var materialsHold = new Array(meshNKids.length);
            for (var i = 0, len = meshNKids.length; i < len; i++) {
                materialsHold[i] = meshNKids[i].material;
                meshNKids[i].material = fire;
            }
            // queue a return to actual material
            var ref = this;
            var events = [
                // make all meshes visible
                function () { ref._mesh.makeVisible(true); },
                // let fire flame a little.  Start sound, if passed.
                new QI.Stall(ref.durations[0], QI.PovProcessor.POV_GROUP_NAME, ref.soundEffect),
                //  change back to original materials; clean up fire resources
                function () {
                    for (var i = 0, len = meshNKids.length; i < len; i++) {
                        meshNKids[i].material = materialsHold[i];
                    }
                    // eliminate resources
                    fire.dispose();
                    ref._diffuse.dispose();
                    ref._distortion.dispose();
                    ref._opacity.dispose();
                }
            ];
            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0]);
            // run functions of series on the POV processor, so not dependent on a shapekeygroup or skeleton processor existing
            var series = new QI.EventSeries(events);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        return FireEntrance;
    }(QI.AbstractGrandEntrance));
    QI.FireEntrance = FireEntrance;
})(QI || (QI = {}));

/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>






var QI;
(function (QI) {
    var ExpandEntrance = (function (_super) {
        __extends(ExpandEntrance, _super);
        function ExpandEntrance() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // no need for a constructor, just use super's
        /** @override */
        ExpandEntrance.prototype.makeEntrance = function () {
            var ref = this;
            var origScaling = ref._mesh.scaling;
            ref._mesh.scaling = BABYLON.Vector3.Zero();
            // add the minimum steps
            var events;
            events = [
                // make mesh, and kids visible
                function () { ref._mesh.makeVisible(true); },
                // return to a basis state
                new QI.PropertyEvent(ref._mesh, 'scaling', origScaling, this.durations[0], { sound: ref.soundEffect })
            ];
            var scene = this._mesh.getScene();
            // add a temporary glow for entrance when have HighlightLayer (BJS 2.5), and stencil enabled on engine
            if (BABYLON.HighlightLayer && scene.getEngine().isStencilEnable) {
                // splice as first event
                events.splice(0, 0, function () {
                    // limit effect, so does not show on orthographic cameras, if any
                    var camera = (scene.activeCameras.length > 0) ? scene.activeCameras[0] : scene.activeCamera;
                    ref._HighLightLayer = new BABYLON.HighlightLayer("QI.ExpandEntrance internal", scene, { camera: camera });
                    ref._HighLightLayer.addMesh(ref._mesh, BABYLON.Color3.White());
                    var kids = ref._mesh.getDescendants();
                    for (var i = 0, len = kids.length; i < len; i++) {
                        ref._HighLightLayer.addMesh(kids[i], BABYLON.Color3.White());
                    }
                });
                // add wait & clean up on the end
                events.push(new QI.Stall(ref.durations[1]));
                events.push(function () { ref._HighLightLayer.dispose(); });
            }
            // Make sure there is a block event for all queues not part of this entrance.
            // User could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0] + this.durations[1], QI.Mesh.COMPUTED_GROUP_NAME);
            // run functions of series on the POV processor (default), so not dependent on a Shapekeygroup or skeleton processor existing
            var series = new QI.EventSeries(events);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        return ExpandEntrance;
    }(QI.AbstractGrandEntrance));
    QI.ExpandEntrance = ExpandEntrance;
})(QI || (QI = {}));

/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>






var QI;
(function (QI) {
    /**
     * Implemented using the ShaderBuilder extension embedded into QI.
     * This is an abstract class.  A concrete subclass needs to implement _getEffectHostMesh() & _makeCallback()
     */
    var ShaderBuilderEntrance = (function (_super) {
        __extends(ShaderBuilderEntrance, _super);
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         * @param {boolean} disposeSound - When true, dispose the sound effect on completion. (Default false)
         */
        function ShaderBuilderEntrance(mesh, durations, soundEffect, disposeSound) {
            var _this = _super.call(this, mesh, durations, soundEffect, disposeSound) || this;
            if (!ShaderBuilderEntrance._SB_INITIALIZED) {
                ShaderBuilderEntrance._SB_INITIALIZED = true;
                BABYLONX.ShaderBuilder.InitializeEngine();
            }
            return _this;
        }
        /**
         * The mesh returned contains a material that was built by ShaderBuilder.  Subclass should override.
         */
        ShaderBuilderEntrance.prototype._getEffectHostMesh = function () { return null; };
        /**
         * Method for making the call back for the recurring event.  Subclass should override.
         */
        ShaderBuilderEntrance.prototype._makeCallback = function () { return null; };
        /** @override */
        ShaderBuilderEntrance.prototype.makeEntrance = function () {
            this._originalScale = this._mesh.scaling.clone();
            this._mesh.scaling = new BABYLON.Vector3(0.0000001, 0.0000001, 0.0000001);
            // create host mesh to handle the effect, & disable for now
            this._effectHostMesh = this._getEffectHostMesh();
            this._effectHostMesh.setEnabled(false);
            var ref = this;
            // queue a dispose of hostMesh & beforeRender
            var events = [
                // make mesh, and effectHostMesh visible
                function () {
                    ref._mesh.makeVisible(true); // includes children
                    ref._effectHostMesh.setEnabled(true);
                },
                // Start the shader effect, managed by the callback, & sound, if passed.
                new QI.RecurringCallbackEvent(this._makeCallback(), ref.durations[0], { sound: ref.soundEffect }),
                // clean up
                function () {
                    ref._effectHostMesh.dispose();
                }
            ];
            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0]);
            // run functions of series on the POV processor (default), so not dependent on a shapekeygroup or skeleton processor existing
            var series = new QI.EventSeries(events);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        return ShaderBuilderEntrance;
    }(QI.AbstractGrandEntrance));
    ShaderBuilderEntrance._SB_INITIALIZED = false;
    QI.ShaderBuilderEntrance = ShaderBuilderEntrance;
    //================================================================================================
    //================================================================================================
    /**
     * Sub-class of ShaderBuilderEntrance, for using the teleport entrance
     */
    var TeleportEntrance = (function (_super) {
        __extends(TeleportEntrance, _super);
        function TeleportEntrance() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#0
         */
        TeleportEntrance.prototype._getEffectHostMesh = function () {
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            var dimensions = this._mesh.getSizeCenterWtKids();
            var diameter = Math.max(dimensions.size.x, dimensions.size.z) * TeleportEntrance._RADUIS_MULT;
            var effectHostMesh = BABYLON.Mesh.CreateCylinder(this._mesh + "_tp", dimensions.size.y, diameter, diameter, 30, 6, scene);
            effectHostMesh.position = dimensions.center;
            var magic1 = '16.'; // 16.
            var magic2 = '0.1'; // 0.1  oscillation related
            var heightStr = BABYLONX.Shader.Print(dimensions.size.y);
            var vertex = 'sin(' + magic1 + '* pos.y /' + heightStr + ' - sin(pos.x * ' + magic2 + ' / ' + heightStr + ') + 1. * speed * time * ' + magic2 + '),'
                + 'sin(' + magic1 + ' * pos.y / ' + heightStr + ' + cos(pos.z * ' + magic2 + ' / ' + heightStr + ') + 1. * speed * time * ' + magic2 + ') * 0.2 ,'
                + '0.';
            var magic3 = '16.';
            var fragment = 'vec4(color.xyz,min((5. - ' + magic3 + ' * pos.y / ' + heightStr + ' ),' + magic3 + ' * pos.y / ' + heightStr + ' * 0.5 + 4.) * color.w * length(result.xyz) / 1.5)';
            var sb = new BABYLONX.ShaderBuilder();
            sb.SetUniform('color', 'vec4');
            sb.SetUniform('speed', 'float');
            sb.VertexShader('result = vec4(pos + nrm * (length(vec3( ' + vertex + ' ))) * 0.6, 1.);');
            sb.InLine('result = vec4( ' + vertex + ',1.);');
            sb.InLine('result = ' + fragment + ';');
            sb.Back('result.xyz = color.xyz;');
            sb.Transparency(); // assign material.needAlphaBlending = function () { return true; }
            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 0.3));
            material.setFloat('speed', 1);
            effectHostMesh.material = material;
            return effectHostMesh;
        };
        /**
         * @override
         * method for making the call back for the recurring event.
         */
        TeleportEntrance.prototype._makeCallback = function () {
            var ref = this;
            return function (ratioComplete) {
                // section for host mesh oscillation / set uniforms
                var mat = ref._effectHostMesh.material;
                mat.setFloat('speed', Math.sin(ratioComplete));
                mat.setFloat('time', ratioComplete * 100);
                // section for scaling mesh back to original , but not till .85
                if (ratioComplete >= .85) {
                    ref._mesh.scaling = ref._originalScale;
                }
            };
        };
        return TeleportEntrance;
    }(ShaderBuilderEntrance));
    TeleportEntrance._RADUIS_MULT = 1.2;
    QI.TeleportEntrance = TeleportEntrance;
    //================================================================================================
    /**
     * Sub-class of ShaderBuilderEntrance, for using the poof entrance
     */
    var PoofEntrance = (function (_super) {
        __extends(PoofEntrance, _super);
        function PoofEntrance() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._st_time = 0;
            return _this;
        }
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#21
         */
        PoofEntrance.prototype._getEffectHostMesh = function () {
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            var dimensions = this._mesh.getSizeCenterWtKids();
            var diameter = (dimensions.size.x + dimensions.size.y + dimensions.size.z) / 3;
            var radius = diameter / 2;
            var radiusStr = radius.toFixed(1);
            var effectHostMesh = BABYLON.Mesh.CreateSphere(this._mesh + "_tp", 40, diameter, scene);
            effectHostMesh.position = dimensions.center;
            var color = { r: 0.8, g: 0.8, b: 0.8, a: 1. };
            var bump = '0.1';
            var seed = new Date().getMilliseconds().toFixed(1);
            var vertex = 'nrm * pow(min(20.6, pow(ssp * stt * 1.3 * 2.123423 + sin(ssp * stt)  *0.01 ,0.4)), 1.) + ';
            vertex += 'nrm * pow(ssp * stt * 0.03 * 2.123423, ';
            vertex += '(abs((ssp * stt * 0.003)) * 0.2)) * 3. * vec3(noise(pos * 0.003 + nrm + vec3(0., -1., 0.) * (ssp * stt * 0.001) + ';
            vertex += 'ssp * stt * 0.001 + ' + seed + ' * 0.12568) + ';
            vertex += '0.3 * noise(pos * 0.02 + vec3(0., 1., 0.) * (ssp * stt * 0.003 + ' + seed + ' * 0.12568) * 0.1) )';
            var sb = new BABYLONX.ShaderBuilder();
            sb.Setting.WorldPosition = true;
            sb.SetUniform('color', 'vec4');
            sb.SetUniform('color2', 'vec4');
            sb.SetUniform('speed', 'float');
            sb.SetUniform('st_time', 'float');
            sb.VertexShader('wpos = pos;' +
                'float stt = 0.;' +
                'if (st_time != 0.) stt = time - st_time;' +
                'float ssp = 1.;' +
                'if (stt < 2000.) stt = max(0., stt - stt * stt / 5500.);' +
                'pos = pos + nrm * (max(ssp * stt / 75., length(vec3(' + vertex + ')))) * ' + bump + ';' +
                'result = vec4(pos, 1.);');
            sb.InLine('float stt = 0.;' +
                'float ssp = 1.;' +
                'if (st_time == 0.) discard;' +
                'if (st_time != 0.) stt = time - st_time;' +
                'result = vec4( ' + vertex + ', 1.);' +
                'if (stt < 2000.) stt = max(0., stt - stt * stt / 5500.);');
            sb.Effect({ pr: 'min(1. ,max(-1., pr))' });
            sb.InLine('result = vec4( vec3(length(pos) - 10. * ' + radiusStr + ' )/(20.6 * ' + radiusStr + '), 1.);');
            sb.Reference(2, null);
            sb.Effect({ pr: 'min(1., max(-1., pow(pr, 2.5) * 7.))' });
            sb.Reference(1, null);
            sb.Solid(color);
            sb.InLine('result.xyz = length(result_1.xyz) * vec3(0.,0.,0.) * (min(1., max(0., (stt - 150.) / 1050.))) + result.xyz * (1. - min(1., max(0., (stt - 100.) / 550.)));');
            sb.Effect({ pr: 'pow(pr, 3.) * 7.' });
            sb.InLine('result.w = 1. - (stt - 100.) / 850.;' +
                'if(stt > 300.) result.w = (1.- min(1., (stt - 100.) / 850.)) * length(result_1.xyz);');
            sb.Transparency(); // assign material.needAlphaBlending = function () { return true; }
            //         console.log(sb.toScript("QI", "PoofMaterial", true));
            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 1));
            material.setVector4('color2', new BABYLON.Vector4(1, 0, 0, 1));
            material.setFloat('speed', -2.);
            material.setFloat('st_time', 0);
            effectHostMesh.material = material;
            return effectHostMesh;
        };
        /**
         * @override
         * method for making the call back for the recurring event.  Subclass should override.
         */
        PoofEntrance.prototype._makeCallback = function () {
            var ref = this;
            return function (ratioComplete) {
                // section for host mesh explosion / set uniforms
                var mat = ref._effectHostMesh.material;
                if (ref._st_time === 0) {
                    ref._st_time = 0.0001;
                    mat.setFloat('st_time', ref._st_time);
                }
                mat.setFloat('time', ratioComplete * PoofEntrance._MAX_TIME);
                // section for scaling mesh back to original , but not till .25
                if (ratioComplete >= .25) {
                    ref._mesh.scaling = ref._originalScale;
                }
            };
        };
        return PoofEntrance;
    }(ShaderBuilderEntrance));
    PoofEntrance._MAX_TIME = 1300;
    QI.PoofEntrance = PoofEntrance;
})(QI || (QI = {}));

/// <reference path="../queue/NonMotionEvents.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
/// <
var QI;
(function (QI) {
    var SceneTransition = (function () {
        function SceneTransition() {
        }
        /**
         * This is the entry point call in the Tower of Babel generated code once all textures are buffered.
         */
        SceneTransition.perform = function (sceneTransitionName, meshes, overriddenMillis, overriddenSound, options) {
            var effect = SceneTransition.EFFECTS[sceneTransitionName];
            if (!effect)
                throw "No such scene transition: " + sceneTransitionName;
            SceneTransition.makeAllVisible(meshes);
            effect.initiate(meshes, overriddenMillis, overriddenSound);
        };
        SceneTransition.makeAllVisible = function (meshes) {
            for (var i = 0, mLen = meshes.length; i < mLen; i++) {
                var mesh = meshes[i];
                if (mesh instanceof QI.Mesh)
                    mesh.makeVisible(true); // also resumes event queued, which is always initially paused
                else {
                    var children = mesh.getChildMeshes();
                    mesh.isVisible = true;
                    for (var j = 0, cLen = children.length; j < cLen; j++) {
                        children[i].isVisible = true;
                    }
                }
            }
        };
        return SceneTransition;
    }());
    /**
     * Using a static dictionary to get transitions, so that custom transitions not included can be referenced.
     * Stock transitions already loaded.
     */
    SceneTransition.EFFECTS = {};
    QI.SceneTransition = SceneTransition;
})(QI || (QI = {}));

/// <reference path="./SceneTransition.ts"/>
/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
var QI;
(function (QI) {
    var IntoFocusTransition = (function () {
        function IntoFocusTransition() {
        }
        /**
         * Transition implementation
         */
        IntoFocusTransition.prototype.initiate = function (meshes, overriddenMillis, overriddenSound) {
            var camera = QI.TimelineControl.scene.activeCamera || QI.TimelineControl.scene.activeCameras[0];
            // set up post processes
            var postProcess0 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), IntoFocusTransition._INITIAL_KERNEL, 1.0, camera);
            var postProcess1 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), IntoFocusTransition._INITIAL_KERNEL, 1.0, camera);
            // account for overriding
            var time = overriddenMillis ? overriddenMillis : IntoFocusTransition._DEFAULT_MILLIS;
            var sound = overriddenSound ? overriddenSound : this._sound;
            var options = { pace: new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent: true };
            if (sound)
                options.sound = sound;
            var callBack = function (ratioComplete) {
                postProcess0.kernel = IntoFocusTransition._INITIAL_KERNEL * (1 - ratioComplete);
                postProcess1.kernel = IntoFocusTransition._INITIAL_KERNEL * (1 - ratioComplete);
            };
            var event = new QI.RecurringCallbackEvent(callBack, time, options);
            var dispose = function () {
                postProcess0.dispose();
                postProcess1.dispose();
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        };
        return IntoFocusTransition;
    }());
    IntoFocusTransition.NAME = "INTO_FOCUS";
    IntoFocusTransition._INITIAL_KERNEL = 200;
    IntoFocusTransition._DEFAULT_MILLIS = 5000;
    QI.IntoFocusTransition = IntoFocusTransition;
    // code to run on module load, registering of the transition
    QI.SceneTransition.EFFECTS[IntoFocusTransition.NAME] = new IntoFocusTransition();
})(QI || (QI = {}));

/// <reference path="./SceneTransition.ts"/>
/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
var QI;
(function (QI) {
    var ToColorTransition = (function () {
        function ToColorTransition() {
        }
        /**
         * Transition implementation
         */
        ToColorTransition.prototype.initiate = function (meshes, overriddenMillis, overriddenSound) {
            var camera = QI.TimelineControl.scene.activeCamera || QI.TimelineControl.scene.activeCameras[0];
            // set up post processes
            var postProcess = new BABYLON.BlackAndWhitePostProcess("WelcomeToWonderLand", 1.0, camera);
            // account for overriding
            var time = overriddenMillis ? overriddenMillis : ToColorTransition._DEFAULT_MILLIS;
            var sound = overriddenSound ? overriddenSound : this._sound;
            var options = { pace: new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent: true };
            if (sound)
                options.sound = sound;
            var callBack = function (ratioComplete) {
                postProcess.degree = ratioComplete;
            };
            var event = new QI.PropertyEvent(postProcess, "degree", 0, time, options);
            var dispose = function () {
                postProcess.dispose();
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        };
        return ToColorTransition;
    }());
    ToColorTransition.NAME = "TO_COLOR";
    ToColorTransition._DEFAULT_MILLIS = 5000;
    QI.ToColorTransition = ToColorTransition;
    // code to run on module load, registering of the transition
    QI.SceneTransition.EFFECTS[ToColorTransition.NAME] = new ToColorTransition();
})(QI || (QI = {}));

/// <reference path="./SceneTransition.ts"/>
/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
var QI;
(function (QI) {
    var VisiblityTransition = (function () {
        function VisiblityTransition() {
        }
        /**
         * Transition implementation
         */
        VisiblityTransition.prototype.initiate = function (meshes, overriddenMillis, overriddenSound) {
            this._meshes = meshes;
            // avoid a flash of being fully visible for a frame sometimes
            this._changeVisiblity(0, meshes);
            // account for overriding
            var time = overriddenMillis ? overriddenMillis : VisiblityTransition._DEFAULT_MILLIS;
            var sound = overriddenSound ? overriddenSound : this._sound;
            var options = { pace: new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent: true };
            if (sound)
                options.sound = sound;
            var ref = this;
            var callBack = function (ratioComplete) {
                ref._changeVisiblity(ratioComplete, ref._meshes);
            };
            var event = new QI.RecurringCallbackEvent(callBack, time, options);
            var dispose = function () {
                ref._meshes = null;
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        };
        VisiblityTransition.prototype._changeVisiblity = function (ratioComplete, meshes) {
            for (var i = 0, mLen = meshes.length; i < mLen; i++) {
                var mesh = meshes[i];
                mesh.visibility = ratioComplete;
                var children = mesh.getChildMeshes();
                if (children.length > 0)
                    this._changeVisiblity(ratioComplete, children);
            }
        };
        return VisiblityTransition;
    }());
    VisiblityTransition.NAME = "VISIBLITY";
    VisiblityTransition._DEFAULT_MILLIS = 5000;
    QI.VisiblityTransition = VisiblityTransition;
    // code to run on module load, registering of the transition
    QI.SceneTransition.EFFECTS[VisiblityTransition.NAME] = new VisiblityTransition();
})(QI || (QI = {}));

var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    var MeshFactory = (function () {
        function MeshFactory() {
        }
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        MeshFactory.instance = function (moduleName, meshName, cloneSkeleton) {
            var ret;
            for (var i = 0, len = MeshFactory.MODULES.length; i < len; i++) {
                if (moduleName === MeshFactory.MODULES[i].getModuleName()) {
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret)
                BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        };
        return MeshFactory;
    }());
    MeshFactory.MODULES = new Array();
    TOWER_OF_BABEL.MeshFactory = MeshFactory;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    var Preloader = (function () {
        /**
         * A Preloader holds the info to dynamically load TOB generated files, which are both in the
         * same directory & have the same directory for images.  There are methods to add files (characters, bust, & scene chunks),
         * and methods to request they start loading.
         */
        function Preloader(jsPath, matPath) {
            this.jsPath = jsPath;
            this.matPath = matPath;
            this._characters = new Array();
            this._busts = new Array();
            this._sceneChunks = new Array();
            if (this.jsPath.lastIndexOf("/") + 1 !== this.jsPath.length)
                this.jsPath += "/";
            if (this.matPath.lastIndexOf("/") + 1 !== this.matPath.length)
                this.matPath += "/";
        }
        /**
         * Register a character as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingCharacters() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        Preloader.prototype.addCharacter = function (player) {
            player._preloader = this;
            this._characters.push(player);
        };
        /**
         * Register a bust as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingBusts() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        Preloader.prototype.addBust = function (player) {
            player._preloader = this;
            this._busts.push(player);
        };
        /**
         * Register a scene chunk as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingChunks() is called.
         * @param {SceneChunk} chunk - An instance of the SceneChunk, PreLoadable, to add.
         */
        Preloader.prototype.addSceneChunk = function (chunk) {
            chunk._preloader = this;
            this._sceneChunks.push(chunk);
        };
        Preloader.addtextureBuffer = function (image) {
            Preloader._images.push(image);
        };
        /**
         * Called by defineMaterials(), generated code, to finally assign the pre-loaded texture data to a BABYLON.Texture.
         * Called also by readAhead(), generated code, to detect if there was already an attempt.  Materials using the same texture data,
         * should have the same fName, & namespace .eg. 'shared'.
         * @param {string} fName - The name of the data given when pre-loaded, the base file name before and reduced texture swaps.
         * @returns {TextureBuffer} - The buffer object which might have already been loaded or not yet.
         */
        Preloader.findTextureBuffer = function (fName) {
            for (var i = 0, len = this._images.length; i < len; i++) {
                if (Preloader._images[i].fName === fName)
                    return Preloader._images[i];
            }
            return null;
        };
        Object.defineProperty(Preloader.prototype, "numCharacters", {
            get: function () {
                return this._characters.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Preloader.prototype, "numBusts", {
            get: function () {
                return this._busts.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Preloader.prototype, "numSceneChunks", {
            get: function () {
                return this._sceneChunks.length;
            },
            enumerable: true,
            configurable: true
        });
        Preloader.prototype.prepRemainingCharacters = function () {
            for (var i = 0, len = this._characters.length; i < len; i++) {
                // does nothing once ready
                this._characters[i].makeReady();
            }
        };
        Preloader.prototype.prepRemainingBusts = function () {
            for (var i = 0, len = this._busts.length; i < len; i++) {
                // does nothing once ready
                this._busts[i].makeReady();
            }
        };
        Preloader.prototype.pickCharacter = function (bustOnly, index) {
            var bank = bustOnly ? this._busts : this._characters;
            // not using a ! test, since index can be zero
            if (typeof index === "undefined") {
                index = Math.floor(Math.random() * bank.length);
            }
            return bank[index];
        };
        return Preloader;
    }());
    Preloader.READ_AHEAD_LOGGING = false; // when true, write timings to the console
    Preloader.MAKE_MULTI_SCENE = false; // when true, data retrieved is not deleted after texture is assigned
    // A common TextureBuffer array across all PreLoaders, if multiples.
    // Also allows generated code to be put statically in header section of html, where no Preloader is instanced.
    Preloader._images = new Array();
    TOWER_OF_BABEL.Preloader = Preloader;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));







/// <reference path="./Preloader.ts"/>
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * A Preloadable is a Tower of Babel generated Javascript file.  This class is not intended to
     * be directly instanced.  Use Character or SceneChunk sub-classes.
     *
     * The Character class is a Mesh sub-class within the Javascript file.
     *
     * The SceneChunk class is for calling the initScene of the Javascript file(creating all meshes of .blend).
     * There can be meshes & lights in export, but probably should not have a camera unless it will always be
     * the only or first chunk.
     */
    var PreLoadable = (function () {
        function PreLoadable(moduleName, _jsFile) {
            this.moduleName = moduleName;
            this._jsFile = _jsFile;
            this._onPath = false;
            this._inProgress = false;
        }
        PreLoadable.prototype.makeReady = function (readyCallback) {
            var _this = this;
            if (this._onPath) {
                if (readyCallback)
                    readyCallback();
                return true;
            }
            if (this._inProgress) {
                if (!this._userCallback)
                    this._userCallback = readyCallback;
                return false;
            }
            this._inProgress = true;
            this._loadStart = BABYLON.Tools.Now;
            // record the user callback, if passed
            if (readyCallback)
                this._userCallback = readyCallback;
            // DOM: Create the script element
            var jsElem = document.createElement("script");
            // set the type attribute
            jsElem.type = "application/javascript";
            // make the script element load file
            jsElem.src = this._preloader.jsPath + this._jsFile;
            // finally insert the element to the body element in order to load the script
            document.body.appendChild(jsElem);
            var ref = this;
            jsElem.onload = function () {
                ref._onPath = ref._inProgress = true;
                if (TOWER_OF_BABEL.Preloader.READ_AHEAD_LOGGING)
                    BABYLON.Tools.Log(ref._jsFile + " loaded in " + ((BABYLON.Tools.Now - ref._loadStart) / 1000).toFixed(3) + " secs");
                // begin read ahead for textures
                try {
                    eval(ref.moduleName + '.matReadAhead("' + ref._preloader.matPath + '");');
                }
                catch (err) {
                    BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: module " + ref.moduleName + ".matReadAhead() failed");
                }
                if (ref._userCallback)
                    _this._userCallback();
                ref._userCallback = null;
            };
            jsElem.onerror = function () {
                BABYLON.Tools.Error("TOWER_OF_BABEL.PreLoadable: " + jsElem.src + " failed to load.");
            };
            return false;
        };
        return PreLoadable;
    }());
    TOWER_OF_BABEL.PreLoadable = PreLoadable;
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(moduleName, jsFile, className) {
            var _this = _super.call(this, moduleName, jsFile) || this;
            _this.className = className;
            return _this;
        }
        /**
         * Should be part of the callback passed to makeReady().
         */
        Character.prototype.instance = function (name) {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.Character: Not correctly made ready.");
                return null;
            }
            var ret;
            eval('ret = new ' + this.moduleName + '.' + this.className + '("' + name + '", TOWER_OF_BABEL.Preloader.SCENE, "' + this._preloader.matPath + '")');
            return ret;
        };
        return Character;
    }(PreLoadable));
    TOWER_OF_BABEL.Character = Character;
    var SceneChunk = (function (_super) {
        __extends(SceneChunk, _super);
        function SceneChunk() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor(s) of the scene chunk's meshes / lights / etc.
         */
        SceneChunk.prototype.instance = function (scene) {
            if (!this._onPath) {
                BABYLON.Tools.Error("TOWER_OF_BABEL.SceneChunk: Not correctly made ready.");
                return;
            }
            //            this._instanceCode(scene, this._preloader.matPath);
        };
        return SceneChunk;
    }(PreLoadable));
    TOWER_OF_BABEL.SceneChunk = SceneChunk;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

/// <reference path="./Preloader.ts"/>
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * a class to hold the buffer of pre-fetched texture
     */
    var TextureBuffer = (function () {
        /**
         * Called from the matReadAhead() of the generated code with the info needed to perform fetch.
         * @param {string} path - This is the site / directory part of the URL.  When using read ahead,
         * this is the matPath property of the preloader.  When static, this is passed originally
         * from the Mesh constructor.
         * @param {string} fName - This is the base filename, generated in the matReadAhead() code.
         */
        function TextureBuffer(path, fName) {
            this.path = path;
            this.fName = fName;
            // assigned by _load()
            this._buffer = null;
            this._fetchStart = BABYLON.Tools.Now;
            if (this.path.lastIndexOf("/") + 1 !== this.path.length) {
                this.path += "/";
            }
            this._load(false);
        }
        /**
         * function broken out so can call while falling back, if required.
         * @param {boolean} fallingBack - indicates being called a 2nd time after failing
         */
        TextureBuffer.prototype._load = function (fallingBack) {
            var onError = null;
            var ref = this;
            var url = this.path + this.fName;
            var textureFormatInUse = TOWER_OF_BABEL.Preloader.SCENE.getEngine().textureFormatInUse;
            // section a replication of the beginning part of engine.createTexture()
            var lastDot = url.lastIndexOf('.');
            var isKTX = !fallingBack && textureFormatInUse;
            if (isKTX) {
                url = url.substring(0, lastDot) + textureFormatInUse;
                // fallback for when compressed file not found to try again.  For instance, etc1 does not have an alpha capable type.
                onError = function () { ref._load(true); };
            }
            if (isKTX) {
                BABYLON.Tools.LoadFile(url, function (data) { ref._notifyReady(data); }, null, TOWER_OF_BABEL.Preloader.SCENE.database, true, onError);
            }
            else {
                BABYLON.Tools.LoadImage(url, function (data) { ref._notifyReady(data); }, onError, TOWER_OF_BABEL.Preloader.SCENE.database);
            }
        };
        /**
         * The callback called by either LoadFile or LoadImage.  Does assignment if by the time fetch done, a request has come in.
         * @param {ArrayBuffer | HTMLImageElement} result - buffer of the texture.
         */
        TextureBuffer.prototype._notifyReady = function (result) {
            this._buffer = result;
            if (TOWER_OF_BABEL.Preloader.READ_AHEAD_LOGGING)
                BABYLON.Tools.Log(this.fName + " fetched in " + ((BABYLON.Tools.Now - this._fetchStart) / 1000).toFixed(3) + " secs");
            // assignment of callback is used as the test of whether a request has already been made
            if (this._userCallback)
                this._assign(this._userCallback);
        };
        /**
         * Called in defineMaterials(), generated code, to actually create the texture & assign it to a material.
         * When the preloader has already retrieved the data, the assignment
         */
        TextureBuffer.prototype.applyWhenReady = function (mat, txType, readyCallback) {
            this._mat = mat;
            this._txType = txType;
            if (this._buffer) {
                this._assign(readyCallback);
            }
            else
                this._userCallback = readyCallback;
        };
        /**
         *  Broken out so can be called by either _notifyReady(), or applyWhenReady().
         */
        TextureBuffer.prototype._assign = function (readyCallback) {
            // any rename to a ktx should happen again, just like in _load()
            var texture = new BABYLON.Texture(this.path + this.fName, TOWER_OF_BABEL.Preloader.SCENE, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, readyCallback, null, this._buffer);
            if (this._buffer && !TOWER_OF_BABEL.Preloader.MAKE_MULTI_SCENE)
                delete this._buffer;
            texture.name = this.fName;
            texture.hasAlpha = this.hasAlpha;
            texture.level = this.level;
            texture.coordinatesIndex = this.coordinatesIndex;
            texture.coordinatesMode = this.coordinatesMode;
            texture.uOffset = this.uOffset;
            texture.vOffset = this.vOffset;
            texture.uScale = this.uScale;
            texture.vScale = this.vScale;
            texture.uAng = this.uAng;
            texture.vAng = this.vAng;
            texture.wAng = this.wAng;
            texture.wrapU = this.wrapU;
            texture.wrapV = this.wrapV;
            switch (this._txType) {
                case TextureBuffer.DIFFUSE_TEX:
                    this._mat.diffuseTexture = texture;
                    break;
                case TextureBuffer.BUMP_TEX:
                    this._mat.bumpTexture = texture;
                    break;
                case TextureBuffer.AMBIENT_TEX:
                    this._mat.ambientTexture = texture;
                    break;
                case TextureBuffer.OPACITY_TEX:
                    this._mat.opacityTexture = texture;
                    break;
                case TextureBuffer.EMISSIVE_TEX:
                    this._mat.emissiveTexture = texture;
                    break;
                case TextureBuffer.SPECULAR_TEX:
                    this._mat.specularTexture = texture;
                    break;
                case TextureBuffer.REFLECTION_TEX:
                    this._mat.reflectionTexture = texture;
                    break;
            }
        };
        return TextureBuffer;
    }());
    TextureBuffer.DIFFUSE_TEX = 0;
    TextureBuffer.BUMP_TEX = 1;
    TextureBuffer.AMBIENT_TEX = 2;
    TextureBuffer.OPACITY_TEX = 3;
    TextureBuffer.EMISSIVE_TEX = 4;
    TextureBuffer.SPECULAR_TEX = 5;
    TextureBuffer.REFLECTION_TEX = 6;
    TOWER_OF_BABEL.TextureBuffer = TextureBuffer;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));

if (((typeof window != "undefined" && window.module) || (typeof module != "undefined")) && typeof module.exports != "undefined") {
    module.exports = QI;
};
