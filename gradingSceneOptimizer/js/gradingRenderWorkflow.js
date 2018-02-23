var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    /*********
     * GRADE
     *********/
    /**
          flow :
            •
            |
      1.a onBeforeLoad
            •
            |
      1.b onLoaded
            •
            |
      2.a onBeforeRender
            •
            |
      2.b onRendered ––––––––> onUpdate • ––>
            •              |                |
            |              |                |
            |              <–––––––—–––––––––
            |
            |
      3.a onBeforeDispose
            •
            |
      3.b onDisposed
            •
  
     */
    // class to customize grade
    var Grade = /** @class */ (function () {
        /**
         * @param _GSO : GradingSceneOptimizer
         * @param name : name of grade
         * @param upGradingTask : task to do when this grade is enabled
         * @param downGradingTask : task to do when this grade is disabled
         * @param optimization : optimization parameters
         */
        function Grade(_GSO, name, optimization, upGradingTask, downGradingTask) {
            if (upGradingTask === void 0) { upGradingTask = null; }
            if (downGradingTask === void 0) { downGradingTask = null; }
            this._GSO = _GSO;
            this.name = name;
            this.upGradingTask = upGradingTask;
            this.downGradingTask = downGradingTask;
            // "enabled" variable
            this.postProcessesEnabled = true;
            this.lensFlaresEnabled = true;
            this.renderTargetsEnabled = true;
            this.particlesEnabled = true;
            this.shadowsEnabled = true;
            // parameters variable
            this.particles = null;
            this.shadows = null;
            this.renderSize = null;
            this.materials = null;
            this.textures = null;
            this.userInfos = null;
            this.camera = null;
            var grades = _GSO.grades, prevGrade, priority, userInfos = _GSO.userInfos, paramsUserInfos, deviceType = userInfos.deviceType;
            // add priority to newGrade
            priority = this.priority = grades.length;
            if (priority > 0) {
                prevGrade = grades[grades.length - 1];
                console.log(prevGrade.name);
            }
            /**
             * 1. check if optimization params exist
             * 2. If not, set optimization params of previous grade
             * 3. else put params by default
             */
            /**
             * PARAMS
             */
            // post process enabled
            if (optimization.postProcessesEnabled != undefined) {
                this.postProcessesEnabled = optimization.postProcessesEnabled;
            }
            else if (prevGrade && prevGrade.postProcessesEnabled) {
                this.postProcessesEnabled = prevGrade.postProcessesEnabled;
            }
            // lensflare enabled
            if (optimization.lensFlaresEnabled != undefined) {
                this.lensFlaresEnabled = optimization.lensFlaresEnabled;
            }
            else if (prevGrade && prevGrade.lensFlaresEnabled) {
                this.lensFlaresEnabled = prevGrade.lensFlaresEnabled;
            }
            // render target texture enabled
            if (optimization.renderTargetsEnabled != undefined) {
                this.renderTargetsEnabled = optimization.renderTargetsEnabled;
            }
            else if (prevGrade && prevGrade.renderTargetsEnabled) {
                this.renderTargetsEnabled = prevGrade.renderTargetsEnabled;
            }
            // particles enabled
            if (optimization.particlesEnabled != undefined) {
                this.particlesEnabled = optimization.particlesEnabled;
            }
            else if (prevGrade && prevGrade.particlesEnabled) {
                this.particlesEnabled = prevGrade.particlesEnabled;
            }
            // shadow enabled
            if (optimization.shadowsEnabled != undefined) {
                this.shadowsEnabled = optimization.shadowsEnabled;
            }
            else if (prevGrade && prevGrade.shadowsEnabled) {
                this.shadowsEnabled = prevGrade.shadowsEnabled;
            }
            // particles
            if (optimization.particles != undefined) {
                this.particles = optimization.particles;
            }
            else if (prevGrade && prevGrade.particles) {
                this.particles = prevGrade.particles;
            }
            // shadow
            if (optimization.shadows != undefined) {
                this.shadows = optimization.shadows;
            }
            else if (prevGrade && prevGrade.shadows) {
                this.shadows = prevGrade.shadows;
            }
            // render size
            if (optimization.renderSize != undefined) {
                this.renderSize = optimization.renderSize;
            }
            else if (prevGrade && prevGrade.renderSize) {
                this.renderSize = prevGrade.renderSize;
            }
            // material
            if (optimization.materials != undefined) {
                this.materials = optimization.materials;
            }
            else if (prevGrade && prevGrade.materials) {
                this.materials = prevGrade.materials;
            }
            // texture
            if (optimization.textures != undefined) {
                this.textures = optimization.textures;
            }
            else if (prevGrade && prevGrade.textures) {
                this.textures = prevGrade.textures;
            }
            // user infos
            if (optimization.userInfos != undefined) {
                paramsUserInfos = this.userInfos = optimization.userInfos;
            }
            else if (prevGrade && prevGrade.userInfos) {
                this.userInfos = prevGrade.userInfos;
            }
            /**
             * IS ON RIGHT SOFTWARE / HARDWARE
             */
            // look if grade need to be enabled
            var isEnable = function (params) {
                var exceptions = params.exceptionsAllowed, phoneAllowed = params.smartPhoneAllowed, tabletAllowed = params.tabletAllowed, noteBookAllowed = params.noteBookAllowed, computerAllowed = params.computerAllowed, tvAllowed = params.tvAllowed, consoleAllowed = params.consoleAllowed, exeptRegex, matches;
                // check if exception
                if (exceptions && exceptions.length > 0) {
                    var L = exceptions.length, exeptI, strRegex = '(';
                    for (var i = 0; i < L; i++) {
                        exeptI = exceptions[i];
                        strRegex = strRegex + exeptI;
                        // add "or"
                        if (i < L - 1) {
                            strRegex = strRegex + '|';
                            continue;
                        }
                        // add closure
                        strRegex = strRegex + ')';
                    }
                    exeptRegex = new RegExp(strRegex, 'i');
                    // match it
                    if (BABYLON.UserInfos.match(userInfos.userAgent, exeptRegex)) {
                        return true;
                    }
                }
                // test smartPhone
                if (!phoneAllowed && deviceType === 'smartPhone') {
                    return false;
                }
                // test tablet
                if (!tabletAllowed && deviceType === 'tablet') {
                    return false;
                }
                // test noteBook
                if (!noteBookAllowed && deviceType === 'noteBook') {
                    return false;
                }
                // test console
                if (!consoleAllowed && deviceType === 'console') {
                    return false;
                }
                // test tv
                if (!tvAllowed && deviceType === 'tv') {
                    return false;
                }
                // test general computer
                if (!computerAllowed && deviceType === 'computer') {
                    return false;
                }
                return true;
            };
            // look if this grade need to be enabled with user info parameter
            // if no user info options, set enabled to true;
            // if user info option is defined and isEnable return true, set enabled to true
            if (!paramsUserInfos || (paramsUserInfos && isEnable(paramsUserInfos))) {
                // enabled
                this.enabled = true;
                // add to gso only if enabled
                _GSO.grades.push(this);
            }
            else {
                this.enabled = false;
            }
        }
        return Grade;
    }());
    BABYLON.Grade = Grade;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /*************************
     * OPTIMISATION FUNCTION
     ************************/
    // Optimize :
    var Optimize = /** @class */ (function () {
        function Optimize() {
        }
        // for materials
        Optimize.materials = function (scene, params) {
            var StandardMaterial = BABYLON.StandardMaterial;
            // render ambiant textures ?
            if (params.ambientTextureEnabled != undefined) {
                StandardMaterial.AmbientTextureEnabled = params.ambientTextureEnabled;
            }
            // render ambiant textures ?
            if (params.bumpTextureEnabled != undefined) {
                StandardMaterial.BumpTextureEnabled = params.bumpTextureEnabled;
            }
            // render color grading textures ?
            if (params.colorGradingTextureEnabled != undefined) {
                StandardMaterial.ColorGradingTextureEnabled = params.colorGradingTextureEnabled;
            }
            // render diffuse textures ?
            if (params.diffuseTextureEnabled != undefined) {
                StandardMaterial.DiffuseTextureEnabled = params.diffuseTextureEnabled;
            }
            // render emissive textures ?
            if (params.emissiveTextureEnabled != undefined) {
                StandardMaterial.EmissiveTextureEnabled = params.emissiveTextureEnabled;
            }
            // render fresnel textures ?
            if (params.fresnelEnabled != undefined) {
                StandardMaterial.FresnelEnabled = params.fresnelEnabled;
            }
            // render light map textures ?
            if (params.lightmapTextureEnabled != undefined) {
                StandardMaterial.LightmapTextureEnabled = params.lightmapTextureEnabled;
            }
            // render opacity textures ?
            if (params.opacityTextureEnabled != undefined) {
                StandardMaterial.OpacityTextureEnabled = params.opacityTextureEnabled;
            }
            // render reflection textures ?
            if (params.reflectionTextureEnabled != undefined) {
                StandardMaterial.ReflectionTextureEnabled = params.reflectionTextureEnabled;
            }
            // render refraction textures ?
            if (params.refractionTextureEnabled != undefined) {
                StandardMaterial.RefractionTextureEnabled = params.refractionTextureEnabled;
            }
            // allow specular textures ?
            if (params.specularTextureEnabled != undefined) {
                StandardMaterial.SpecularTextureEnabled = params.specularTextureEnabled;
            }
        };
        // for particules
        Optimize.particules = function (scene, enabled, params) {
            if (!enabled) {
                scene.particlesEnabled = false;
            }
            else {
                scene.particlesEnabled = true;
            }
            // if no params, stop here.
            if (!params) {
                return;
            }
            var particleSystems = scene.particleSystems, particleSysL = particleSystems.length, partSysI, paramRatio = params.ratio, paramMin = params.minEmitRate, paramMax = params.maxEmitRate, originalEmitRate, newRate;
            for (var i = 0; i < particleSysL; i++) {
                partSysI = scene.particleSystems[i];
                if (!partSysI.originalEmitRate) {
                    partSysI.originalEmitRate = originalEmitRate = partSysI.emitRate;
                }
                else {
                    originalEmitRate = partSysI.originalEmitRate;
                }
                newRate = originalEmitRate * paramRatio;
                if (paramMax && newRate > paramMax) {
                    newRate = paramMax;
                }
                else if (paramMin && newRate < paramMin) {
                    newRate = paramMin;
                }
                partSysI.emitRate = newRate; // TODO : typescript : emitRate not exist on 'IParticuleSystem'
            }
        };
        // for shadows
        Optimize.shadows = function (scene, enabled, params) {
            if (!enabled) {
                scene.shadowsEnabled = false;
            }
            else {
                scene.shadowsEnabled = true;
            }
            // if no params, stop here.
            if (!params) {
                return;
            }
            var shadowsType = [
                'usePoissonSampling',
                'useExponentialShadowMap',
                'useBlurExponentialShadowMap',
                'useCloseExponentialShadowMap',
                'useBlurCloseExponentialShadowMap'
            ], lights = scene.lights, paramSize = params.size, paramType = params.type, shadowMap;
            // change type of shadow
            var setShadowType = function (shadowGenerator) {
                for (var i = 0; i < shadowsType.length; i++) {
                    shadowGenerator[shadowsType[i]] = false;
                }
                shadowGenerator[paramType] = true;
            };
            // for x light
            for (var i = 0; i < lights.length; i++) {
                var sh = lights[i].getShadowGenerator();
                if (!sh) {
                    continue;
                }
                // if need to resize
                if (paramSize) {
                    shadowMap = sh.getShadowMap();
                    // resize map
                    shadowMap.resize(paramSize);
                }
                // if need to change type
                if (paramType) {
                    setShadowType(sh); // TODO : typescript : 'IShadowGenerator' is not assignable to parameter of type 'ShadowGenerator'
                }
            }
        };
        // for render size
        Optimize.renderSize = function (engine, params) {
            // CAREFULL !!!
            // for a screen with a pixel ratio to 200% :
            //    window devicePixelRatio = 2
            //    babylon hardware scaling = 0.5
            var canvas = engine.getRenderingCanvas(), width = canvas.clientWidth, height = canvas.clientHeight, windowPixelRatio = window.devicePixelRatio, paramPixelRatio = params.hardwareScaling || 1, maxWidth = params.maxWidth, maxHeight = params.maxHeight, newScale = 0;
            if (windowPixelRatio < (1 / paramPixelRatio)) {
                paramPixelRatio = 1 / windowPixelRatio;
            }
            if (width > maxWidth || height > maxHeight) {
                if (width > maxWidth && width > height) {
                    newScale = (width / maxWidth) * paramPixelRatio;
                }
                else {
                    newScale = (height / maxHeight) * paramPixelRatio;
                }
            }
            else {
                newScale = paramPixelRatio;
            }
            engine.setHardwareScalingLevel(newScale);
        };
        // for textures
        Optimize.textures = function (scene, params) {
            var materials = scene.materials, matL = materials.length;
            // for x materials
            for (var i = 0; i < matL; i++) {
                BABYLON.Optimize.resizeMaterialChannel(materials[i], params);
            }
        };
        // transform materials channels textures to RenderTargetTexture
        // to be able to rescale texture on demand
        Optimize.resizeMaterialChannel = function (material, params) {
            var _this = this;
            // list of channels
            var channels = ['diffuseTexture',
                'ambientTexture',
                'opacityTexture',
                'reflectionTexture',
                'emissiveTexture',
                'specularTexture',
                'bumpTexture',
                'lightmapTexture',
                'ColorGradingTexture',
                'refractionTexture'], 
            // lenght
            channelsL = channels.length, paramMaxSize = params.maxSize, paramMinSize = params.minSize, paramScale = params.scale;
            // inspect channel
            var resizeChannel = function (texture, channelName) {
                var currentSize = texture.getSize(), currentWidth = currentSize.width, currentHeight = currentSize.height, originalTexture = texture.originalTexture, originalSize, originalWidth, originalHeight, originalSizeRatio, originalMaxWidth, originalMaxHeight, newWidth, newHeight, copyTask;
                // calculate new size
                if (originalTexture) {
                    originalSize = originalTexture.getSize();
                    originalMaxWidth = originalWidth = originalSize.width;
                    originalMaxHeight = originalHeight = originalSize.height;
                    newWidth = originalWidth * paramScale;
                    newHeight = originalHeight * paramScale;
                }
                else {
                    originalMaxWidth = currentWidth;
                    originalMaxHeight = currentHeight;
                    newWidth = currentWidth * paramScale;
                    newHeight = currentHeight * paramScale;
                }
                // if new size > max size of original texture, new size = original texture size. We can't create pixel :)
                if (newWidth > originalMaxWidth || newHeight > originalMaxHeight) {
                    newWidth = originalMaxWidth;
                    newHeight = originalMaxHeight;
                }
                // if new size < param min size, new size = param min size.
                if (newWidth < paramMinSize || newHeight < paramMinSize) {
                    if (originalWidth >= originalHeight) {
                        originalSizeRatio = originalWidth / originalHeight;
                        newWidth = paramMinSize;
                        newHeight = paramMinSize * originalSizeRatio;
                    }
                    else {
                        originalSizeRatio = originalHeight / originalWidth;
                        newWidth = paramMinSize * originalSizeRatio;
                        newHeight = paramMinSize;
                    }
                }
                else if (newWidth > paramMaxSize || newHeight > paramMaxSize) {
                    if (originalWidth >= originalHeight) {
                        originalSizeRatio = originalWidth / originalHeight;
                        newWidth = paramMaxSize;
                        newHeight = paramMaxSize * originalSizeRatio;
                    }
                    else {
                        originalSizeRatio = originalHeight / originalWidth;
                        newWidth = paramMaxSize * originalSizeRatio;
                        newHeight = paramMaxSize;
                    }
                }
                // round
                newWidth = Math.round(newWidth);
                newHeight = Math.round(newHeight);
                if (currentWidth == newWidth && currentHeight == newHeight) {
                    return;
                }
                material[channelName] = _this.resizeTexture(texture, newWidth, newHeight);
            };
            // add observable if needed
            var inspectState = function (texture, channelName) {
                if (texture.isReady()) {
                    resizeChannel(texture, channelName);
                }
                else if (texture.onLoadObservable) {
                    // add new observable
                    texture.onLoadObservable.add(function (texture) {
                        resizeChannel(texture, channelName);
                    });
                }
            };
            // for x channels
            for (var i = 0; i < channelsL; i++) {
                var channel = channels[i], texture = material[channel];
                if (!texture) {
                    continue;
                }
                inspectState(texture, channel);
            }
        };
        // resize texture with RenderTargetTexture
        Optimize.resizeTexture = function (texture, newWidth, newHeight) {
            var name, originalTexture = texture.originalTexture, resizedCopy, needDispose = true;
            if (!originalTexture) {
                originalTexture = texture;
                name = texture.name;
                needDispose = false;
            }
            else {
                name = originalTexture.name;
            }
            resizedCopy = BABYLON.TextureTools.CreateResizedCopy(originalTexture, newWidth, newHeight);
            resizedCopy.name = 'resized_' + name;
            resizedCopy.isResized = true;
            resizedCopy.originalTexture = originalTexture; // TODO originalTexture : add to texture class
            if (needDispose) {
                texture.dispose();
            }
            return resizedCopy;
        };
        return Optimize;
    }());
    BABYLON.Optimize = Optimize;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /***********************
     * PRESET OPTIMISATION
     **********************/
    // preset grade optimization
    var PresetGradeOptimization = /** @class */ (function () {
        function PresetGradeOptimization() {
        }
        // low render quality
        PresetGradeOptimization.minimum = function () {
            return {
                shadowsEnabled: false,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: false,
                textures: {
                    sizeRatio: 0.5,
                    maxSize: 256,
                    minSize: 128
                },
                materials: {
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: false,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1280,
                    maxHeight: 1280,
                    hardwareScaling: 1.5
                },
                userInfos: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: false,
                    exceptionsAllowed: []
                }
            };
        };
        // low render quality
        PresetGradeOptimization.low = function () {
            return {
                shadowsEnabled: false,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: false,
                textures: {
                    sizeRatio: 0.5,
                    maxSize: 512,
                    minSize: 128
                },
                materials: {
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1440,
                    maxHeight: 1440,
                    hardwareScaling: 1
                },
                userInfos: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // standar render quality
        PresetGradeOptimization.standard = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: true,
                textures: {
                    sizeRatio: 0.5,
                    maxSize: 512,
                    minSize: 256
                },
                materials: {
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                shadows: {
                    sizeRatio: 1,
                    minSize: 128,
                    maxSize: 512
                },
                renderSize: {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    hardwareScaling: 1
                },
                userInfos: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // medium render quality
        PresetGradeOptimization.medium = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: true,
                textures: {
                    sizeRatio: 0.75,
                    maxSize: 1024,
                    minSize: 256
                },
                particles: {
                    rateRatio: 1,
                    maxEmitRate: 300,
                    minEmitRate: 1
                },
                materials: {
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    sizeRatio: 2,
                    minSize: 128,
                    maxSize: 1024
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 1
                },
                userInfos: {
                    smartPhoneAllowed: false,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // high render quality
        PresetGradeOptimization.high = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: true,
                lensFlaresEnabled: true,
                renderTargetsEnabled: true,
                textures: {
                    sizeRatio: 1,
                    maxSize: 1024,
                    minSize: 512
                },
                particles: {
                    rateRatio: 2,
                    maxEmitRate: 5000,
                    minEmitRate: 1
                },
                materials: {
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    sizeRatio: 3,
                    minSize: 128,
                    maxSize: 1024
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 1
                },
                userInfos: {
                    smartPhoneAllowed: false,
                    tabletAllowed: false,
                    noteBookAllowed: false,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // best render quality
        PresetGradeOptimization.ultra = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: true,
                lensFlaresEnabled: true,
                renderTargetsEnabled: true,
                textures: {
                    sizeRatio: 1,
                    maxSize: 2048,
                    minSize: 512
                },
                particles: {
                    rateRatio: 3,
                    maxEmitRate: 10000,
                    minEmitRate: 1
                },
                materials: {
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    sizeRatio: 3,
                    minSize: 128,
                    maxSize: 2048
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 0.5
                },
                userInfos: {
                    smartPhoneAllowed: false,
                    tabletAllowed: false,
                    noteBookAllowed: false,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        return PresetGradeOptimization;
    }());
    BABYLON.PresetGradeOptimization = PresetGradeOptimization;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /*************************
     * USER INFORMATIONS :
     * detect software and hardware
     ************************/
    // REGEX :
    // read this :
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    // https://developers.whatismybrowser.com/useragents/explore/
    // https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js
    // http://screensiz.es/
    // Mozilla/5.0   (X11; Linux x86_64)   AppleWebKit/537.36   (KHTML, like Gecko)   Chrome/44.0.2403.157 Safari/537.36
    // --- 1.a ---   ------- 1.b -------   ------- 2.a ------   ------- 2.b -------   --------------- 3 ----------------
    //
    // 1.a : product + version
    // 1.b : system-information ( like os + version )
    // 2.a : platform : layout engine
    // 2.b : platform detail ( optional )
    // 3   : browser or software + version ( commentaire libre )
    // 1.a : /[^\(]+/i                                        | match : "Mozilla/5.0 "
    // 1.b : /(\([^\(][^\)]*\))/i                             | match : "(X11; Linux x86_64)"
    // 2.a : /[\)](\s\w+\/[0-9a-z\.]+)/i                      | match : ") AppleWebKit/537.36"
    // 2.b : /[\)]\s(\w+\/[0-9a-z\.]+)(\s\([^\(\)]+\))/i      | match : ") AppleWebKit/537.36 (KHTML, like Gecko)"
    // 3   : /(\s\w+\/[0-9a-z\.]+){1,3}$/i                    | match : " Chrome/44.0.2403.157 Safari/537.36"
    // capture all with one regex :
    // /([^\(]+)?\(([^\)]*)[\)]\s?([a-z0-9]*\/[0-9a-z\.]+)?\s?\(?(?:([^\)]*)?[\)])?\s?((?:.*\/?[0-9a-z\.]+\s?)*)?/i
    // Work great but some useragent have bracket in bracket.
    // Conclusion :
    // there is too much possibilities to split userAgent.
    // Work fine with a big part of userAgent exept some exeption
    var UserInfosReport = /** @class */ (function () {
        function UserInfosReport() {
            // navigator.userAgent
            this.userAgent = null;
            // device type
            this.deviceType = 'computer';
            // is smartphone ?
            this.isSmartphone = false;
            // is tablet ?
            this.isTablet = false;
            // is notebook ?
            this.isNotebook = false;
            // is computer ?
            this.isComputer = false;
            // is console ?
            this.isConsole = false;
            // is tv ?
            this.isTv = false;
            // browser name
            this.software = null;
            // browser name
            this.softwareVersion = null;
            // operating system name
            this.os = null;
            // operating system name
            this.osVersion = null;
            // operating system name
            this.layout = null;
            // operating system name
            this.layoutVersion = null;
        }
        return UserInfosReport;
    }());
    BABYLON.UserInfosReport = UserInfosReport;
    var UserInfos = /** @class */ (function () {
        function UserInfos() {
        }
        // return a report of user agent
        UserInfos._report = function () {
            // create new report
            var report = new BABYLON.UserInfosReport(), deviceKey, 
            // get user agent
            userAgent = navigator.userAgent, 
            // detect system
            system = this.detectSystem(), 
            // detect software
            software = this.detectSoftware(), 
            // detect layout engine
            layout = this.detectLayout(), 
            // detect device
            device = this.detectDevice();
            report.userAgent = userAgent;
            report.os = system[0];
            report.osVersion = system[1];
            report.layout = layout[0];
            report.layoutVersion = layout[1];
            report.software = software[0];
            report.softwareVersion = software[1];
            deviceKey = 'is' + device[0].substr(0, 1).toUpperCase() + device[0].substr(1);
            report[deviceKey] = true;
            return report;
        };
        // detect device type
        // return [type]
        UserInfos.detectDevice = function () {
            var useragent = navigator.userAgent, result;
            // console
            result = this.match(useragent, /(ouya|nintendo|playstation|xbox)/i, ['console']);
            if (result) {
                return result;
            }
            // smartphone
            result = this.match(useragent, /(mobi|phone|ipod|mini)/i, ['smartphone']);
            if (result) {
                return result;
            }
            // tablet
            result = this.match(useragent, /(tab|ipad)/i, ['tablet']);
            if (result) {
                return result;
            }
            // tv
            result = this.match(useragent, /(tv)/i, ['tv']);
            if (result) {
                return result;
            }
            // ---> try with the screen size if type is undefined
            var screenW = window.screen.width, screenH = window.screen.height, size = Math.max(screenW, screenH);
            // try to catch if it's a mobile or not
            result = this.match(useragent, /(android|ios)/i, ['mobile']);
            if (result) {
                if (screenW < 1024 && screenH < 768) {
                    return ["smartphone"];
                }
                else {
                    return ["tablet"];
                }
            }
            // else try with the screen size
            if (size < 768) {
                return ["smartphone"];
            }
            else if (size < 1025) {
                return ["tablet"];
            }
            else if (size < 1366) {
                return ["notebook"];
            }
            else {
                return ["computer"];
            }
        };
        // get engine layout and version
        // return [name, version]
        UserInfos.detectLayout = function () {
            var useragent = navigator.userAgent, result;
            // EdgeHTML :
            result = this.match(useragent, /(edge)\/?([0-9\.]+)?/i, ['edgeHTML', 2]);
            if (result) {
                return result;
            }
            // Presto :
            result = this.match(useragent, /(presto)\/?([0-9\.]+)?/i, ['presto', 2]);
            if (result) {
                return result;
            }
            // WebKit | Trident | Netfront :
            result = this.match(useragent, /(webKit|trident|netfront)\/?([0-9\.]+)?/i, [1, 2]);
            if (result) {
                return result;
            }
            // KHTML :
            result = this.match(useragent, /(KHTML)\/?([0-9\.]+)?/i, ['KHTML', 2]);
            if (result) {
                return result;
            }
            // Gecko :
            result = this.match(useragent, /.*[rv:]([0-9]\.+)?.*(Gecko)/i, ['gecko', 1]);
            if (result) {
                return result;
            }
            return null;
        };
        // get OS + version if possible
        // return [name, version]
        UserInfos.detectSystem = function () {
            var useragent = navigator.userAgent, result;
            // windows :
            result = this.match(useragent, /(windows)\snt\s([0-9\.]+)/i, ['windows', 2]);
            // get version with "nt x.x"
            if (result && result[1]) {
                switch (result[1]) {
                    // xp
                    case '5.1' || '5.2':
                        result[1] = 'xp';
                        break;
                    // vista
                    case '6.0':
                        result[1] = 'vista';
                        break;
                    // 7
                    case '6.1':
                        result[1] = '7';
                        break;
                    // 8
                    case '6.2':
                        result[1] = '8';
                        break;
                    // 8.1
                    case '6.3':
                        result[1] = '8.1';
                        break;
                    // 10
                    case '10.0':
                        result[1] = '10';
                        break;
                    default:
                        result[1] = null;
                        break;
                }
            }
            if (result) {
                return result;
            }
            // chromium :
            result = this.match(useragent, /\s(cros)\s/i, ['chromium', null]);
            if (result) {
                return result;
            }
            // ios :
            result = this.match(useragent, /(fxios|opios|crios|iphone|ipad|ipod).*\sos\s([0-9_\.]+)/i, ['ios', 2]);
            if (result && result[1]) {
                result[1] = result[1].replace(/\_/g, '.');
            }
            if (result) {
                return result;
            }
            // mac :
            result = this.match(useragent, /(macintosh|mac)\sos\sx\s([0-9_\.]+)/i, ['mac', 2]);
            if (result && result[1]) {
                result[1] = result[1].replace(/\_/g, '.');
            }
            if (result) {
                return result;
            }
            // android :
            result = this.match(useragent, /(android)\s([0-9\.]+)/i, ['android', 2]);
            if (result) {
                return result;
            }
            // linux | blackberry | firefox:
            result = this.match(useragent, /(linux|blackberry|firefox)/i, [1, null]);
            if (result) {
                return result;
            }
            return null;
        };
        // get browser or software name + version
        // return [name, version]
        UserInfos.detectSoftware = function () {
            var useragent = navigator.userAgent, result;
            // edge :
            result = this.match(useragent, /(edge)\/([0-9]+)/i, ['edge', 2]);
            if (result) {
                return result;
            }
            // ie < 11 :
            result = this.match(useragent, /(msie)\s([0-9]+)/i, ['ie', 2]);
            if (result) {
                return result;
            }
            // ie 11 :
            result = this.match(useragent, /(trident).*[rv:]([0-9]+)/i, ["ie", 2]);
            if (result) {
                return result;
            }
            // firefox
            result = this.match(useragent, /(firefox|fxios)\/([0-9]+)/i, ["firefox", 2]);
            if (result) {
                return result;
            }
            // opera
            result = this.match(useragent, /(opios|opr|opera)\/([0-9]+)/i, ["opera", 2]);
            if (result) {
                return result;
            }
            // chrome
            result = this.match(useragent, /(crmo|crios|chrome)\/([0-9]+)/i, ["chrome", 2]);
            if (result) {
                return result;
            }
            // safari
            result = this.match(useragent, /Version\/([0-9]+).*(safari)\//i, ["safari", 1]);
            if (result) {
                return result;
            }
            // undefined
            return null;
        };
        UserInfos._splitUserAgent = function (userAgent) {
            var matches = userAgent.match(/([^\(]+)?\(([^\)]*)[\)]\s?([a-z0-9]*\/[0-9a-z\.]+)?\s?\(?(?:([^\)]*)?[\)])?\s?((?:.*\/?[0-9a-z\.]+\s?)*)?/i);
            return {
                userAgent: userAgent,
                product: matches[1],
                system: matches[2],
                platform: matches[3],
                platformDetails: matches[4],
                software: matches[5]
            };
        };
        // return matches in order you choose.
        // data returned :
        // if string : return string
        // if number : get group in regex matches
        // if data is undefined, return matches
        UserInfos.match = function (str, regex, data) {
            var result = [], matches = str.match(regex);
            if (data && matches) {
                var L = data.length, dataI;
                for (var i = 0; i < L; i++) {
                    dataI = data[i];
                    // if string
                    if (typeof dataI === "string") {
                        result[i] = dataI;
                        continue;
                    }
                    // if number & matches[dataI]
                    if (matches[dataI]) {
                        result[i] = matches[dataI];
                        continue;
                    }
                    result[i] = null;
                }
                return result;
            }
            if (matches) {
                return matches.shift();
            }
            return null;
        };
        // navigator.userAgent
        UserInfos.report = UserInfos._report();
        return UserInfos;
    }());
    BABYLON.UserInfos = UserInfos;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var AbstractGradingAsset = /** @class */ (function (_super) {
        __extends(AbstractGradingAsset, _super);
        function AbstractGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return AbstractGradingAsset;
    }(BABYLON.AbstractAssetTask));
    BABYLON.AbstractGradingAsset = AbstractGradingAsset;
    var GradingGridZone = /** @class */ (function () {
        function GradingGridZone() {
        }
        return GradingGridZone;
    }());
    BABYLON.GradingGridZone = GradingGridZone;
    var GradingAssetsZone = /** @class */ (function () {
        function GradingAssetsZone() {
        }
        return GradingAssetsZone;
    }());
    BABYLON.GradingAssetsZone = GradingAssetsZone;
    var meshGradingAsset = /** @class */ (function (_super) {
        __extends(meshGradingAsset, _super);
        function meshGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return meshGradingAsset;
    }(AbstractGradingAsset));
    BABYLON.meshGradingAsset = meshGradingAsset;
    var soundGradingAsset = /** @class */ (function (_super) {
        __extends(soundGradingAsset, _super);
        function soundGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return soundGradingAsset;
    }(AbstractGradingAsset));
    BABYLON.soundGradingAsset = soundGradingAsset;
    var animationGradingAsset = /** @class */ (function (_super) {
        __extends(animationGradingAsset, _super);
        function animationGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return animationGradingAsset;
    }(AbstractGradingAsset));
    BABYLON.animationGradingAsset = animationGradingAsset;
    var textureGradingAsset = /** @class */ (function (_super) {
        __extends(textureGradingAsset, _super);
        function textureGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return textureGradingAsset;
    }(AbstractGradingAsset));
    BABYLON.textureGradingAsset = textureGradingAsset;
    var scriptGradingAsset = /** @class */ (function (_super) {
        __extends(scriptGradingAsset, _super);
        function scriptGradingAsset(name) {
            return _super.call(this, name) || this;
        }
        return scriptGradingAsset;
    }(AbstractGradingAsset));
    BABYLON.scriptGradingAsset = scriptGradingAsset;
})(BABYLON || (BABYLON = {}));
/***********************
 * CREATED BY PIERRE GLIBERT
 * Version : alpha_0.0.1
 *
 * forum links :
 * http://www.html5gamedevs.com/topic/31108-assetmanager-sceneoptimizer-contribution/
 *
 * Playground :
 * https://playground.babylonjs.com/indexstable#9IXPB8#7
 *
 *
 * TODO :
 *
 **********************/
var BABYLON;
(function (BABYLON) {
    /***************************
     * GRADING RENDER WORKFLOW
     **************************/
    // class to controle optimizations
    var GradingRenderWorkflow = /** @class */ (function () {
        /**
         * @param engine : Babylon engine
         * @param fpsToReach : fps to reach
         * @param evaluationDuration : duration for fps evaluation
         * @param autoReEval : active auto evaluation
         */
        function GradingRenderWorkflow(scene, fpsToReach, evaluationDuration, autoReEval) {
            if (fpsToReach === void 0) { fpsToReach = 48; }
            if (evaluationDuration === void 0) { evaluationDuration = 1000; }
            if (autoReEval === void 0) { autoReEval = false; }
            var _this = this;
            this.scene = scene;
            this.fpsToReach = fpsToReach;
            this.evaluationDuration = evaluationDuration;
            this.autoReEval = autoReEval;
            // grade : preset options to optimize scene (ex : low, medium, hight)
            this.grades = new Array();
            // run every x ms
            this.autoRunInterval = 30000;
            // active occlusion culling to downgrade the number of draw.
            // show only meshes in the frustrum of camera and if we can see it (disable if mesh hide an other mesh)
            this.occlusionCullingEnabled = true; // TODO ( !!! FUTURE FEATURE !!!)
            // try to minimize draw call of CPU
            // based on distance of view in optimizations paramater
            //    add a radius detection around the meshes (useful for big meshes)
            //    add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
            //
            //    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
            //
            // set mesh.isVisible to false
            this.minimizeDrawCall = true; // TODO ( !!! FUTURE FEATURE !!!)
            // user info : os, sofware(browser), device, ...
            this.userInfos = BABYLON.UserInfos.report;
            // current priority
            this._currentGradePriority = -1;
            // to know the step of evaluation :
            // 1. try to upgrading.
            // 2. if fps not reached, dowgrading.
            this._isUpGradingStep = true;
            //
            this._texturesRef = [];
            this._particlesRef = [];
            var engine = scene.getEngine();
            // add resize event
            if (this._resizeEvent) {
                window.removeEventListener("resize", this._resizeEvent);
            }
            this._resizeEvent = function () {
                if (_this._currentRenderSize) {
                    BABYLON.Optimize.renderSize(engine, _this._currentRenderSize);
                }
            };
            window.addEventListener("resize", this._resizeEvent);
        }
        /**
         * Run GradingRenderWorkflow
         * @param scene : BABYLON scene
         * @param starterGrade : on wich grade GradingRenderWorkflow need to start.
         *                       It's interresting to start with the lower grade.
         *                       For exemple, configure your lower grade with only what your scene needed. Load only assets you need allow a best loading time performance.
         *                       You will get a better accessibility and plug and play concept. It's important for web.
         * @param onReady : callback when GradingRenderWorkflow is ready.
         */
        GradingRenderWorkflow.prototype.run = function (scene, onReady) {
            var _this = this;
            var engine = scene.getEngine();
            // If no starterGrade, get the first
            var starterGrade = this.grades[0];
            // start update scene by starterGrade
            this.updateSceneByGrade(scene, starterGrade, function () {
                if (onReady) {
                    onReady();
                }
                _this.start(scene);
            });
        };
        // evaluate and choose the best grade for your hardware
        GradingRenderWorkflow.prototype.start = function (scene, onSuccess) {
            var _this = this;
            var engine = scene.getEngine(), fps, grades = this.grades, gradesL = this.grades.length, gradeI, currentPriority, I, isInit = false, timeToWait = 1000, evalDuration = this.evaluationDuration;
            // stop
            this.stop();
            // onSucess
            var success = function () {
                // if autoReEval
                if (_this.autoReEval) {
                    _this._autoRunIntervalId = setTimeout(function () {
                        // restart
                        autoEvaluate();
                    }, _this.autoRunInterval);
                }
                // if callback onSuccess
                if (onSuccess) {
                    onSuccess();
                }
            };
            // loop in to check all grade
            var autoEvaluate = function () {
                currentPriority = _this._currentGradePriority;
                I = currentPriority;
                BABYLON.Tools.Log('Optimizer : Hardware evaluation : running ...');
                // force to wait minimum 1 sec to get fps (only for initialisation)
                if (!isInit && evalDuration < timeToWait) {
                    isInit = true;
                    evalDuration = timeToWait - evalDuration;
                }
                else {
                    evalDuration = _this.evaluationDuration;
                }
                // start setTimeOut
                _this._evaluationTimeOutId = setTimeout(function () {
                    fps = engine.getFps();
                    BABYLON.Tools.Log('     > Optimizer : result : ' + fps + ' fps');
                    // check fps to reach to upgrade
                    if (fps > _this.fpsToReach) {
                        I++;
                        gradeI = grades[I];
                        // if it's the last grade and if it's disabled, stop.
                        if (!gradeI || I >= gradesL) {
                            success();
                            return;
                        }
                        if (_this._isUpGradingStep && I <= gradesL) {
                            _this.upgrade(scene, function () {
                                autoEvaluate();
                            });
                        }
                        else {
                            success();
                            return;
                        }
                    }
                    else {
                        I--;
                        gradeI = grades[I];
                        // if it's the last grade and if it's disabled, stop.
                        if (!gradeI || I < 0) {
                            success();
                            return;
                        }
                        if (I >= 0) {
                            _this._isUpGradingStep = false;
                            _this.downgrade(scene, function () {
                                autoEvaluate();
                            });
                        }
                        else {
                            _this._isUpGradingStep = true;
                            success();
                            return;
                        }
                    }
                }, evalDuration);
            }; // end of evaluate
            // start autoEval
            autoEvaluate();
        };
        // create grades
        GradingRenderWorkflow.prototype.createGrade = function (name, optimization, upGradingTask, downGradingTask) {
            // create new grade
            var newGrade = new BABYLON.Grade(this, name, optimization, upGradingTask, downGradingTask);
            // return grade result
            return newGrade;
        };
        // update scene by render grade name
        GradingRenderWorkflow.prototype.updateSceneByGrade = function (scene, grade, onSuccess) {
            // clear
            this.stop();
            // if allready on this grade
            if (grade === this._currentGrade) {
                BABYLON.Tools.Log('Optimizer : Grade ' + grade.name + ': allready on it.');
                return;
            }
            BABYLON.Tools.Log('Optimizer : UPDATE scene by grade : ' + grade.name);
            var grades = this.grades, toPriority = grade.priority, gradeToUp = grade, currentGrade, currentPriority, downGradeTask, upGradingTask;
            if (this._currentGrade) {
                currentGrade = this._currentGrade;
                currentPriority = currentGrade.priority;
            }
            else {
                currentPriority = 0;
            }
            // up
            if (currentPriority < toPriority) {
                for (var i = currentPriority; i <= toPriority; i++) {
                    gradeToUp = grades[i];
                    upGradingTask = gradeToUp.upGradingTask;
                    if (upGradingTask) {
                        upGradingTask();
                    }
                }
            }
            else {
                for (var i = currentPriority; i >= toPriority; i--) {
                    gradeToUp = grades[i];
                    downGradeTask = gradeToUp.downGradingTask;
                    if (downGradeTask) {
                        downGradeTask();
                    }
                }
                // upgrade
                upGradingTask = gradeToUp.upGradingTask;
                if (upGradingTask) {
                    upGradingTask();
                }
            }
            // update render with optimization parameter
            this.optimizeRenderByGrade(scene, grade);
            // update current variable
            this._currentRenderSize = grade.renderSize;
            this._currentGrade = grade;
            this._currentGradePriority = toPriority;
            // on success
            if (onSuccess) {
                onSuccess();
            }
        };
        // force upgrade by 1
        GradingRenderWorkflow.prototype.upgrade = function (scene, onSuccess) {
            var I = this._currentGradePriority + 1, grades = this.grades, gradesL = grades.length, gradeI = grades[I], upGradingTask = gradeI.upGradingTask;
            BABYLON.Tools.Log('Optimizer : Upgrade scene to ' + gradeI.name + " grade.");
            if (upGradingTask) {
                upGradingTask();
            }
            // update render with optimization parameter
            this.optimizeRenderByGrade(scene, gradeI);
            // update current variable
            this._currentRenderSize = gradeI.renderSize;
            this._currentGrade = gradeI;
            this._currentGradePriority = gradeI.priority;
            // on success
            if (onSuccess) {
                onSuccess();
            }
        };
        // force downgrade by 1
        GradingRenderWorkflow.prototype.downgrade = function (scene, onSuccess) {
            var grades = this.grades, gradesL = grades.length, currentPriority = this._currentGradePriority, 
            // downgrading options
            gradeToDowngrade = grades[currentPriority], downGradingTask = gradeToDowngrade.downGradingTask, 
            // upgrading options
            I = currentPriority - 1, gradeI = grades[I], upGradingTask = gradeI.upGradingTask;
            BABYLON.Tools.Log('Optimizer :  Downgrade scene to ' + gradeI.name + " grade.");
            if (downGradingTask) {
                downGradingTask();
            }
            if (upGradingTask) {
                upGradingTask();
            }
            // update render with optimization parameter
            this.optimizeRenderByGrade(scene, gradeI);
            // update current variable
            this._currentRenderSize = gradeI.renderSize;
            this._currentGrade = gradeI;
            this._currentGradePriority = gradeI.priority;
            // on success
            if (onSuccess) {
                onSuccess();
            }
        };
        // clear all timer and tasks
        GradingRenderWorkflow.prototype.stop = function () {
            this._isUpGradingStep = true;
            // stop auto run
            clearTimeout(this._autoRunIntervalId);
            // stop evaluation interval
            clearTimeout(this._evaluationTimeOutId);
        };
        // update Render By Optimization parameters
        GradingRenderWorkflow.prototype.optimizeRenderByGrade = function (scene, grade) {
            var engine = scene.getEngine();
            // for render targets
            if (grade.renderTargetsEnabled != undefined) {
                scene.renderTargetsEnabled = grade.renderTargetsEnabled;
            }
            // for postProcess
            if (grade.postProcessesEnabled != undefined) {
                scene.postProcessesEnabled = grade.postProcessesEnabled;
            }
            // for lensFlare
            if (grade.lensFlaresEnabled != undefined) {
                scene.lensFlaresEnabled = grade.lensFlaresEnabled;
            }
            // for shadows
            if (grade.shadowsEnabled != undefined) {
                this.optimizeShadows(scene, grade.shadowsEnabled, grade.shadows);
            }
            // for maxRenderSize
            if (grade.renderSize != undefined) {
                this.optimizeRenderSize(engine, grade.renderSize);
            }
            // for textures
            if (grade.textures != undefined) {
                this._optimizeTextures(scene, grade.textures);
            }
            // for materials
            if (grade.materials != undefined) {
                this.optimizeMaterials(scene, grade.materials); // Done
            }
            // for particles
            if (grade.particlesEnabled != undefined) {
                this.optimizeParticles(scene, grade.particlesEnabled, grade.particles); // done
            }
        };
        ////////////////////////////
        // GSO OPTIMIZE FUNCTIONS //
        ////////////////////////////
        // for texture[S]
        GradingRenderWorkflow.prototype._optimizeTextures = function (scene, params) {
            var textures = scene.textures, L = textures.length, currentRateRatio = 1, textureI, newSize;
            if (this._currentGrade) {
                currentRateRatio = this._currentGrade.textures.sizeRatio;
            }
            for (var i = 0; i < L; i++) {
                textureI = textures[i];
                newSize = textureI.getSize().width * params.sizeRatio / currentRateRatio;
                this.resizeTexture(textureI, newSize);
            }
        };
        // public optimize texture
        GradingRenderWorkflow.prototype._optimizeTexture = function (texture) {
            var params = this._currentGrade.textures;
            this.resizeTexture(texture, newSize);
        };
        // resize texture
        GradingRenderWorkflow.prototype.resizeTexture = function (texture, size) {
            // regex :
            var badUrlRegex = /^(blob:|data:)/i, // look if a blob
            extRegex = /(.*)\.([0-9]+)\.([^\.]*$)/i, // capture size extention methode
            url = texture.url, splittedUrl;
            if (!url) {
                return;
            }
            // if bad url
            if (url && url.match(badUrlRegex)) {
                BABYLON.Tools.Warn("Texture " + texture.name + " can't be resized ! Reason : the type of url is Blob or Data, the asset path is lost : " + url);
                return;
            }
            splittedUrl = url.match(extRegex);
            if (splittedUrl) {
                var newUrl = splittedUrl[1] + '.' + size.toString() + '.' + splittedUrl[3];
                texture.updateURL(newUrl);
            }
        };
        // for materials
        GradingRenderWorkflow.prototype.optimizeMaterials = function (scene, params) {
            var StandardMaterial = BABYLON.StandardMaterial;
            // render ambiant textures ?
            if (params.ambientTextureEnabled != undefined) {
                StandardMaterial.AmbientTextureEnabled = params.ambientTextureEnabled;
            }
            // render ambiant textures ?
            if (params.bumpTextureEnabled != undefined) {
                StandardMaterial.BumpTextureEnabled = params.bumpTextureEnabled;
            }
            // render color grading textures ?
            if (params.colorGradingTextureEnabled != undefined) {
                StandardMaterial.ColorGradingTextureEnabled = params.colorGradingTextureEnabled;
            }
            // render diffuse textures ?
            if (params.diffuseTextureEnabled != undefined) {
                StandardMaterial.DiffuseTextureEnabled = params.diffuseTextureEnabled;
            }
            // render emissive textures ?
            if (params.emissiveTextureEnabled != undefined) {
                StandardMaterial.EmissiveTextureEnabled = params.emissiveTextureEnabled;
            }
            // render fresnel textures ?
            if (params.fresnelEnabled != undefined) {
                StandardMaterial.FresnelEnabled = params.fresnelEnabled;
            }
            // render light map textures ?
            if (params.lightmapTextureEnabled != undefined) {
                StandardMaterial.LightmapTextureEnabled = params.lightmapTextureEnabled;
            }
            // render opacity textures ?
            if (params.opacityTextureEnabled != undefined) {
                StandardMaterial.OpacityTextureEnabled = params.opacityTextureEnabled;
            }
            // render reflection textures ?
            if (params.reflectionTextureEnabled != undefined) {
                StandardMaterial.ReflectionTextureEnabled = params.reflectionTextureEnabled;
            }
            // render refraction textures ?
            if (params.refractionTextureEnabled != undefined) {
                StandardMaterial.RefractionTextureEnabled = params.refractionTextureEnabled;
            }
            // allow specular textures ?
            if (params.specularTextureEnabled != undefined) {
                StandardMaterial.SpecularTextureEnabled = params.specularTextureEnabled;
            }
        };
        // for particles
        GradingRenderWorkflow.prototype.optimizeParticles = function (scene, enabled, params) {
            if (!enabled) {
                scene.particlesEnabled = false;
            }
            else {
                scene.particlesEnabled = true;
            }
            // if no params, stop here.
            if (!params) {
                return;
            }
            var particleSystems = scene.particleSystems, currentRateRatio = 1, particleSysL = particleSystems.length, particleSysI, paramRatio = params.rateRatio, paramMax = params.maxEmitRate, paramMin = params.minEmitRate, newRate;
            if (this._currentGrade) {
                currentRateRatio = this._currentGrade.particles.rateRatio;
            }
            for (var i = 0; i < particleSysL; i++) {
                particleSysI = particleSystems[i];
                newRate = Math.round(particleSysI.emitRate * paramRatio / currentRateRatio);
                // if > max & < min, don't update particle
                if (newRate >= paramMax || newRate <= paramMin) {
                    continue; // pass
                }
                // clear particle
                particleSysI.reset();
                // update emit rate
                particleSysI.emitRate = newRate;
            }
        };
        // for shadows
        GradingRenderWorkflow.prototype.optimizeShadows = function (scene, enabled, params) {
            if (!enabled) {
                scene.shadowsEnabled = false;
            }
            else {
                scene.shadowsEnabled = true;
            }
            // if no params, stop here.
            if (!params) {
                return;
            }
            var lights = scene.lights, paramSize = params.size, shadowMap;
            // for x light
            for (var i = 0; i < lights.length; i++) {
                var sh = lights[i].getShadowGenerator();
                if (!sh) {
                    continue;
                }
                // if need to resize
                if (paramSize) {
                    shadowMap = sh.getShadowMap();
                    // resize map
                    shadowMap.resize(paramSize);
                }
            }
        };
        // for render size
        GradingRenderWorkflow.prototype.optimizeRenderSize = function (engine, params) {
            // CAREFULL !!!
            // for a screen with a pixel ratio to 200% :
            //    window devicePixelRatio = 2
            //    babylon hardware scaling = 0.5
            var canvas = engine.getRenderingCanvas(), width = canvas.clientWidth, height = canvas.clientHeight, windowPixelRatio = window.devicePixelRatio, paramPixelRatio = params.hardwareScaling || 1, maxWidth = params.maxWidth, maxHeight = params.maxHeight, newScale = 0;
            if (windowPixelRatio < (1 / paramPixelRatio)) {
                paramPixelRatio = 1 / windowPixelRatio;
            }
            if (width > maxWidth || height > maxHeight) {
                if (width > maxWidth && width > height) {
                    newScale = (width / maxWidth) * paramPixelRatio;
                }
                else {
                    newScale = (height / maxHeight) * paramPixelRatio;
                }
            }
            else {
                newScale = paramPixelRatio;
            }
            engine.setHardwareScalingLevel(newScale);
        };
        return GradingRenderWorkflow;
    }());
    BABYLON.GradingRenderWorkflow = GradingRenderWorkflow;
})(BABYLON || (BABYLON = {}));
