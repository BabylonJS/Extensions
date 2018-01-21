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
                    scale: 0.5,
                    maxSize: 256,
                    minSize: 128
                },
                materials: {
                    reflectionTextureEnabled: false,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: false,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1024,
                    maxHeight: 1024,
                    hardwareScaling: 1
                },
                devices: {
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
                    scale: 0.5,
                    maxSize: 512,
                    minSize: 128
                },
                materials: {
                    reflectionTextureEnabled: false,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1440,
                    maxHeight: 1440,
                    hardwareScaling: 1
                },
                devices: {
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
                    scale: 0.5,
                    maxSize: 512,
                    minSize: 256
                },
                materials: {
                    reflectionTextureEnabled: true,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 256
                },
                renderSize: {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    hardwareScaling: 1
                },
                devices: {
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
                    scale: 0.75,
                    maxSize: 1024,
                    minSize: 256
                },
                particles: {
                    ratio: 0.25,
                    maxEmitRate: 300,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 512
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 1
                },
                devices: {
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
                    scale: 1,
                    maxSize: 1024,
                    minSize: 512
                },
                particles: {
                    ratio: 0.5,
                    maxEmitRate: 5000,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 1024
                },
                renderSize: {
                    maxWidth: 2560,
                    maxHeight: 2560,
                    hardwareScaling: 1
                },
                devices: {
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
                    scale: 1,
                    maxSize: 2048,
                    minSize: 512
                },
                particles: {
                    ratio: 1,
                    maxEmitRate: 10000,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 2048
                },
                renderSize: {
                    maxWidth: 2560,
                    maxHeight: 2560,
                    hardwareScaling: 2
                },
                devices: {
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
    /*************************
     * OPTIMISATION FUNCTION
     ************************/
    // Optimize :
    var Optimize = /** @class */ (function () {
        function Optimize() {
        }
        // for materials
        Optimize.materials = function (scene, params) {
            // render ambiant textures ?
            if (params.ambientTextureEnabled != undefined) {
                BABYLON.StandardMaterial.AmbientTextureEnabled = params.ambientTextureEnabled;
            }
            // render ambiant textures ?
            if (params.bumpTextureEnabled != undefined) {
                BABYLON.StandardMaterial.BumpTextureEnabled = params.bumpTextureEnabled;
            }
            // render color grading textures ?
            if (params.colorGradingTextureEnabled != undefined) {
                BABYLON.StandardMaterial.ColorGradingTextureEnabled = params.colorGradingTextureEnabled;
            }
            // render diffuse textures ?
            if (params.diffuseTextureEnabled != undefined) {
                BABYLON.StandardMaterial.DiffuseTextureEnabled = params.diffuseTextureEnabled;
            }
            // render emissive textures ?
            if (params.emissiveTextureEnabled != undefined) {
                BABYLON.StandardMaterial.EmissiveTextureEnabled = params.emissiveTextureEnabled;
            }
            // render fresnel textures ?
            if (params.fresnelEnabled != undefined) {
                BABYLON.StandardMaterial.FresnelEnabled = params.fresnelEnabled;
            }
            // render light map textures ?
            if (params.lightmapTextureEnabled != undefined) {
                BABYLON.StandardMaterial.LightmapTextureEnabled = params.lightmapTextureEnabled;
            }
            // render opacity textures ?
            if (params.opacityTextureEnabled != undefined) {
                BABYLON.StandardMaterial.OpacityTextureEnabled = params.opacityTextureEnabled;
            }
            // render reflection textures ?
            if (params.reflectionTextureEnabled != undefined) {
                BABYLON.StandardMaterial.ReflectionTextureEnabled = params.reflectionTextureEnabled;
            }
            // render refraction textures ?
            if (params.refractionTextureEnabled != undefined) {
                BABYLON.StandardMaterial.RefractionTextureEnabled = params.refractionTextureEnabled;
            }
            // allow specular textures ?
            if (params.specularTextureEnabled != undefined) {
                BABYLON.StandardMaterial.SpecularTextureEnabled = params.specularTextureEnabled;
            }
        };
        // for postProcesses
        Optimize.postProcesses = function (scene, enabled) {
            scene.postProcessesEnabled = enabled;
        };
        // for lensFlares
        Optimize.lensFlares = function (scene, enabled) {
            scene.lensFlaresEnabled = enabled;
        };
        // for render Targets (like mirror and bump)
        Optimize.renderTargets = function (scene, enabled) {
            scene.renderTargetsEnabled = enabled;
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
            var shadowsType = ['usePoissonSampling', 'useExponentialShadowMap', 'useBlurExponentialShadowMap', 'useCloseExponentialShadowMap', 'useBlurCloseExponentialShadowMap'], lights = scene.lights, paramSize = params.size, paramType = params.type, shadowMap;
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
            var canvas = engine.getRenderingCanvas(), width = canvas.clientWidth, height = canvas.clientHeight, windowPixelRatio = window.devicePixelRatio, paramPixelRatio = params.hardwareScaling || 1, maxWidth = params.maxWidth, maxHeight = params.maxHeight, newScale = 0;
            if (windowPixelRatio < paramPixelRatio) {
                paramPixelRatio = 1 / windowPixelRatio;
            }
            else {
                paramPixelRatio = 1 / paramPixelRatio;
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
    /*************************
     * HARDWARE DETECTION
     ************************/
    // hardware :
    var Hardware = /** @class */ (function () {
        function Hardware() {
        }
        // is there a dedicated GPU
        Hardware.isDedicatedGPU = function (engine) {
            var GPUs = [
                'amd',
                'nvidia',
                'radeon',
                'geforce'
            ], vendor = engine.getGlInfo().renderer;
            return this._refDetection(vendor, GPUs);
        };
        // device exception detection
        Hardware.isDevices = function (devices) {
            var userAgent = navigator.userAgent;
            return this._refDetection(userAgent, devices);
        };
        // detectMobile
        Hardware.isMobile = function () {
            var userAgent = navigator.userAgent, mobiles = [
                'Android',
                'webOS',
                'iPhone',
                'iPad',
                'iPod',
                'BlackBerry',
                'Windows Phone',
                'Phone'
            ];
            return this._refDetection(userAgent, mobiles);
        };
        // device detection
        Hardware.devicesDetection = function () {
            // get screen size
            var screenWidth = screen.height, screenHeight = screen.width, size = Math.max(screenWidth, screenHeight), userAgent = navigator.userAgent, isMobile = this.isMobile(), regex;
            // SMARTPHONE
            if (isMobile && size < 768) {
                return 'smartPhone';
            }
            // TABLET
            if (isMobile) {
                return 'tablet';
            }
            // NOTEBOOK
            if (size <= 1280) {
                return 'noteBook';
            }
            // computer
            return 'computer';
        };
        // TODO : FUTURE FEATURE : get a benchMark reference for GPU and CPU
        Hardware.getBenchmarkScore = function (engine) {
            return;
        };
        // regex expression detection
        Hardware._refDetection = function (pattern, references) {
            var L = references.length, refI, regex;
            for (var i = 0; i < L; i++) {
                refI = references[i];
                regex = new RegExp(refI, 'i');
                if (pattern.match(regex)) {
                    return true;
                }
                ;
            }
            return false;
        };
        return Hardware;
    }());
    BABYLON.Hardware = Hardware;
    /***************************
     * GRADING SCENE OPTIMIZER
     **************************/
    // class to controle optimizations
    var GradingSceneOptimizer = /** @class */ (function () {
        /**
         * @param engine : Babylon engine
         * @param fpsToReach : fps to reach
         * @param evaluationDuration : duration for fps evaluation
         * @param autoReEval : active auto evaluation
         */
        function GradingSceneOptimizer(engine, fpsToReach, evaluationDuration, autoReEval) {
            if (fpsToReach === void 0) { fpsToReach = 48; }
            if (evaluationDuration === void 0) { evaluationDuration = 1000; }
            if (autoReEval === void 0) { autoReEval = true; }
            var _this = this;
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
            // device type
            this.deviceType = BABYLON.Hardware.devicesDetection();
            // is mobile ?
            this.isMobile = BABYLON.Hardware.isMobile();
            // current priority
            this._currentGradePriority = -1;
            // to know the step of evaluation :
            // 1. try to upgrading.
            // 2. if fps not reached, dowgrading.
            this._isUpGradingStep = true;
            // Detect dedicated GPU
            this.isDedicatedGPU = BABYLON.Hardware.isDedicatedGPU(engine);
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
         * Run GradingSceneOptimizer
         * @param scene : BABYLON scene
         * @param starterGrade : on wich grade renderGradingSceneOptimizer need to start.
         *                       It's interresting to start with the lower grade.
         *                       For exemple, configure your lower grade with only what your scene needed. Load only assets you need allow a best loading time performance.
         *                       You will get a better accessibility and plug and play concept. It's important for web.
         * @param onReady : callback when GradingSceneOptimizer is ready.
         */
        GradingSceneOptimizer.prototype.run = function (scene, starterGrade, onReady) {
            var _this = this;
            var engine = scene.getEngine();
            // If no starterGrade, get the first
            if (!starterGrade) {
                starterGrade = this.grades[0];
            }
            else if (!starterGrade.enabled) {
                var grades = this.grades;
                starterGrade = grades[starterGrade.priority];
                // If no starterGrade, get the last
                if (!starterGrade) {
                    starterGrade = grades[grades.length - 1];
                }
            }
            // start update scene by starterGrade
            this.updateSceneByGrade(scene, starterGrade, function () {
                if (onReady) {
                    onReady();
                }
                _this.startAutoEval(scene);
            });
        };
        // evaluate and choose the best grade for your hardware
        GradingSceneOptimizer.prototype.startAutoEval = function (scene, onSuccess) {
            var _this = this;
            var engine = scene.getEngine(), fps, grades = this.grades, gradesL = this.grades.length, gradeI, currentPriority, I, isInit = false, timeToWait = 1000, evalDuration = this.evaluationDuration;
            // stop
            this.stopAutoEval();
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
        GradingSceneOptimizer.prototype.createGrade = function (name, optimization, upGradingTask, downGradingTask) {
            // create new grade
            var newGrade = new BABYLON.Grade(name, optimization, upGradingTask, downGradingTask);
            // add grade to GSO
            this.addGrade(newGrade);
            // return grade result
            return newGrade;
        };
        // add existing grade
        GradingSceneOptimizer.prototype.addGrade = function (grade) {
            var grades = this.grades, devices = grade.devices, deviceType = this.deviceType, isOnAllowedDevice = function (params) {
                var exceptions = params.exceptionsAllowed, phoneAllowed = params.smartPhoneAllowed, tabletAllowed = params.tabletAllowed, noteBookAllowed = params.noteBookAllowed, computerAllowed = params.computerAllowed;
                // check if exception
                if (exceptions && exceptions.length > 0 && BABYLON.Hardware.isDevices(exceptions)) {
                    return true;
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
                // test general computer
                if (!computerAllowed && deviceType === 'computer') {
                    return false;
                }
                // check if exception
                if (exceptions && exceptions.length > 0 && BABYLON.Hardware.isDevices(exceptions)) {
                    return false;
                }
                return true;
            };
            // add priority to newGrade
            grade.priority = grades.length;
            // look if this grade need to be enabled with devices parameter
            // if no devices options, set enabled to true;
            // if devices option is defined and isOnAllowedDevice return true, set enabled to true
            if (!devices || (devices && isOnAllowedDevice(devices))) {
                // enabled
                grade.enabled = true;
                // add to gso only if enabled
                this.grades.push(grade);
            }
            else {
                grade.enabled = false;
            }
        };
        // update scene by render grade name
        GradingSceneOptimizer.prototype.updateSceneByGrade = function (scene, grade, onSuccess) {
            // clear
            this.stopAutoEval();
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
        GradingSceneOptimizer.prototype.upgrade = function (scene, onSuccess) {
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
        GradingSceneOptimizer.prototype.downgrade = function (scene, onSuccess) {
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
        GradingSceneOptimizer.prototype.stopAutoEval = function () {
            this._isUpGradingStep = true;
            // stop auto run
            clearTimeout(this._autoRunIntervalId);
            // stop evaluation interval
            clearTimeout(this._evaluationTimeOutId);
        };
        // update Render By Optimization parameters
        GradingSceneOptimizer.prototype.optimizeRenderByGrade = function (scene, grade) {
            var engine = scene.getEngine();
            // for render targets
            if (grade.renderTargetsEnabled != undefined) {
                BABYLON.Optimize.renderTargets(scene, grade.renderTargetsEnabled);
            }
            // for postProcess
            if (grade.postProcessesEnabled != undefined) {
                BABYLON.Optimize.postProcesses(scene, grade.postProcessesEnabled);
            }
            // for lensFlare
            if (grade.lensFlaresEnabled != undefined) {
                BABYLON.Optimize.lensFlares(scene, grade.lensFlaresEnabled);
            }
            // for shadows
            if (grade.shadowsEnabled != undefined) {
                BABYLON.Optimize.shadows(scene, grade.shadowsEnabled, grade.shadows);
            }
            // for maxRenderSize
            if (grade.renderSize != undefined) {
                BABYLON.Optimize.renderSize(engine, grade.renderSize);
            }
            // for textures
            if (grade.textures != undefined) {
                // BABYLON.Optimize.textures(scene, grade.textures);
            }
            // for materials
            if (grade.materials != undefined) {
                BABYLON.Optimize.materials(scene, grade.materials);
            }
            // for particules
            if (grade.particulesEnabled != undefined) {
                BABYLON.Optimize.particules(scene, grade.particulesEnabled, grade.particules);
            }
        };
        return GradingSceneOptimizer;
    }());
    BABYLON.GradingSceneOptimizer = GradingSceneOptimizer;
    /*********
     * GRADE
     *********/
    // class to customize grade
    var Grade = /** @class */ (function () {
        /**
         * @param GSO : GradingSceneOptimizer
         * @param name : name of grade
         * @param upGradingTask : task to do when this grade is enabled
         * @param downGradingTask : task to do when this grade is disabled
         * @param optimization : optimization parameters
         */
        function Grade(name, optimization, upGradingTask, downGradingTask) {
            if (upGradingTask === void 0) { upGradingTask = null; }
            if (downGradingTask === void 0) { downGradingTask = null; }
            this.name = name;
            this.upGradingTask = upGradingTask;
            this.downGradingTask = downGradingTask;
            // OPTIMIZATION PARAMETERS :
            // "enabled" variable
            this.postProcessesEnabled = undefined;
            this.lensFlaresEnabled = undefined;
            this.renderTargetsEnabled = undefined;
            this.particulesEnabled = undefined;
            this.shadowsEnabled = undefined;
            // parameters variable
            this.particules = undefined;
            this.shadows = undefined;
            this.renderSize = undefined;
            this.materials = undefined;
            this.textures = undefined;
            this.devices = undefined;
            this.camera = undefined;
            // enabled variable
            if (optimization.postProcessesEnabled != undefined) {
                this.postProcessesEnabled = optimization.postProcessesEnabled;
            }
            if (optimization.lensFlaresEnabled != undefined) {
                this.lensFlaresEnabled = optimization.lensFlaresEnabled;
            }
            if (optimization.renderTargetsEnabled != undefined) {
                this.renderTargetsEnabled = optimization.renderTargetsEnabled;
            }
            if (optimization.particlesEnabled != undefined) {
                this.particulesEnabled = optimization.particlesEnabled;
            }
            if (optimization.shadowsEnabled != undefined) {
                this.shadowsEnabled = optimization.shadowsEnabled;
            }
            // parameters variable
            if (optimization.particles != undefined) {
                this.particules = optimization.particles;
            }
            if (optimization.shadows != undefined) {
                this.shadows = optimization.shadows;
            }
            if (optimization.renderSize != undefined) {
                this.renderSize = optimization.renderSize;
            }
            if (optimization.materials != undefined) {
                this.materials = optimization.materials;
            }
            if (optimization.textures != undefined) {
                this.textures = optimization.textures;
            }
            if (optimization.devices != undefined) {
                this.devices = optimization.devices;
            }
            if (optimization.camera != undefined) {
                this.camera = optimization.camera;
            }
        }
        return Grade;
    }());
    BABYLON.Grade = Grade;
})(BABYLON || (BABYLON = {}));
