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
            // user info : os, sofware(browser), device, ...
            this.userInfos = BABYLON.UserInfos.report();
            // current priority
            this._currentGradePriority = -1;
            // to know the step of evaluation :
            // 1. try to upgrading.
            // 2. if fps not reached, dowgrading.
            this._isUpGradingStep = true;
            // to keep original params of particules systems
            this._originalParticules = [];
            // to keep original texture size
            this._originalTextures = [];
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
            // get all original references we need
            // like particules emit rate or original textures size
            this._getOriginalReferences(scene);
            // start update scene by starterGrade
            this.updateSceneByGrade(scene, starterGrade, function () {
                if (onReady) {
                    onReady();
                }
                _this.start(scene);
            });
        };
        // evaluate and choose the best grade for your hardware
        GradingSceneOptimizer.prototype.start = function (scene, onSuccess) {
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
            var grades = this.grades, userInfos = this.userInfos, devices = grade.devices, deviceType = this.deviceType, isEnable = function (params) {
                var exceptions = params.exceptionsAllowed, phoneAllowed = params.smartPhoneAllowed, tabletAllowed = params.tabletAllowed, noteBookAllowed = params.noteBookAllowed, computerAllowed = params.computerAllowed;
                // check if exception
                if (exceptions && exceptions.length > 0 && BABYLON.UserInfos._isDevices(exceptions)) {
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
                if (exceptions && exceptions.length > 0 && BABYLON.UserInfos._isDevices(exceptions)) {
                    return false;
                }
                return true;
            };
            // add priority to newGrade
            grade.priority = grades.length;
            // look if this grade need to be enabled with devices parameter
            // if no devices options, set enabled to true;
            // if devices option is defined and isOnAllowedDevice return true, set enabled to true
            if (!devices || (devices && isEnable(devices))) {
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
        GradingSceneOptimizer.prototype.stop = function () {
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
                this.optimizeTextures(scene, grade.textures);
            }
            // for materials
            if (grade.materials != undefined) {
                this.optimizeMaterials(scene, grade.materials); // Done
            }
            // for particules
            if (grade.particulesEnabled != undefined) {
                this.optimizeParticules(scene, grade.particulesEnabled, grade.particules); // done
            }
        };
        ///////////////////
        // GET ORIGINALS //
        ///////////////////
        GradingSceneOptimizer.prototype._getOriginalReferences = function (scene) {
            // for particules , keep :
            // -  emitRate
            var particulesSys = scene.particleSystems, L = particulesSys.length, particulesSysI;
            for (var i = 0; i < L; i++) {
                particulesSysI = particulesSys[i];
                this._originalParticules.push({
                    "emitRate": particulesSysI.emitRate,
                    "system": particulesSysI
                });
            }
            // for textures , keep :
            // - width
            // - height
            // - channel
            // - texture ( only if autorized)
            var textures = scene.textures, L = textures.length, textureI, size;
            for (var i = 0; i < L; i++) {
                textureI = textures[i];
                size = textureI.getSize();
                this._originalTextures.push({
                    "width": size.width,
                    "height": size.height,
                    "texture": textureI,
                    "useExtention": true
                });
            }
        };
        ////////////////////////////
        // GSO OPTIMIZE FUNCTIONS //
        ////////////////////////////
        // for textures
        GradingSceneOptimizer.prototype.optimizeTextures = function (scene, params) {
            // regex :
            var blobRegex = /^(blob:)/g, // look if a blob
            extRegex = /\.([0-9]+)\.(?=[^\.]*$)/g; // capture size extention methode
            var blob = "blob:http://localhost:8889/4a9cad29-06cb-4a23-9e2e-c981a2deea4b", ext = "image.1024.png";
            var textures = scene.textures, textureI, L = textures.length;
            // if it's a blob
            if (!blobRegex) {
            }
        };
        // resize material
        GradingSceneOptimizer.prototype.resizeChannelsMaterial = function () {
            var standardChannels = [
                'diffuseTexture',
                'ambientTexture',
                'opacityTexture',
                'reflectionTexture',
                'emissiveTexture',
                'specularTexture',
                'bumpTexture',
                'lightmapTexture',
                'colorGradingTexture',
                'refractionTexture'
            ], pbrChannels;
        };
        // resize texture
        GradingSceneOptimizer.prototype.resizeTexture = function (texture, width, height) {
        };
        // for materials
        GradingSceneOptimizer.prototype.optimizeMaterials = function (scene, params) {
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
        GradingSceneOptimizer.prototype.optimizeParticules = function (scene, enabled, params) {
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
            var oParticleSystems = this._originalParticules, // original particles systems
            oParticleSysL = oParticleSystems.length, oParticleSysI, particleSys, paramRatio = params.ratio, paramMin = params.minEmitRate, paramMax = params.maxEmitRate, originalEmitRate, newRate;
            for (var i = 0; i < oParticleSysL; i++) {
                oParticleSysI = oParticleSystems[i];
                originalEmitRate = oParticleSysI.emitRate;
                particleSys = oParticleSysI.system;
                newRate = originalEmitRate * paramRatio;
                if (paramMax && newRate > paramMax) {
                    newRate = paramMax;
                }
                else if (paramMin && newRate < paramMin) {
                    newRate = paramMin;
                }
                // clear particule
                particleSys.reset();
                // update emit rate
                particleSys.emitRate = newRate;
            }
        };
        // for shadows
        GradingSceneOptimizer.prototype.optimizeShadows = function (scene, enabled, params) {
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
        GradingSceneOptimizer.prototype.optimizeRenderSize = function (engine, params) {
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
                    scale: 0.5,
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
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                shadows: {
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
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
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
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    size: 1024
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
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
                    refractionTextureEnabled: true,
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    size: 2048
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 0.5
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
        UserInfos.report = function () {
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
            result = this._match(useragent, /(ouya|nintendo|playstation|xbox)/i, [1]);
            if (result) {
                return result;
            }
            // smartphone
            result = this._match(useragent, /(mobi|phone|ipod|mini)/i, ['smartphone']);
            if (result) {
                return result;
            }
            // tablet
            result = this._match(useragent, /(tab|ipad)/i, ['tablet']);
            if (result) {
                return result;
            }
            // tv
            result = this._match(useragent, /(tv)/i, ['tv']);
            if (result) {
                return result;
            }
            // ---> try with the screen size if type is undefined
            var screenW = window.screen.width, screenH = window.screen.height, size = Math.max(screenW, screenH);
            // try to catch if it's a mobile or not
            result = this._match(useragent, /(android|ios)/i, ['mobile']);
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
            result = this._match(useragent, /(edge)\/?([0-9\.]+)?/i, ['edgeHTML', 2]);
            if (result) {
                return result;
            }
            // Presto :
            result = this._match(useragent, /(presto)\/?([0-9\.]+)?/i, ['presto', 2]);
            if (result) {
                return result;
            }
            // WebKit | Trident | Netfront :
            result = this._match(useragent, /(webKit|trident|netfront)\/?([0-9\.]+)?/i, [1, 2]);
            if (result) {
                return result;
            }
            // KHTML :
            result = this._match(useragent, /(KHTML)\/?([0-9\.]+)?/i, ['KHTML', 2]);
            if (result) {
                return result;
            }
            // Gecko :
            result = this._match(useragent, /.*[rv:]([0-9]\.+)?.*(Gecko)/i, ['gecko', 1]);
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
            result = this._match(useragent, /(windows)\snt\s([0-9\.]+)/i, ['windows', 2]);
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
            result = this._match(useragent, /\s(cros)\s/i, ['chromium', null]);
            if (result) {
                return result;
            }
            // ios :
            result = this._match(useragent, /(fxios|opios|crios|iphone|ipad|ipod).*\sos\s([0-9_\.]+)/i, ['ios', 2]);
            if (result && result[1]) {
                result[1] = result[1].replace(/\_/g, '.');
            }
            if (result) {
                return result;
            }
            // mac :
            result = this._match(useragent, /(macintosh|mac)\sos\sx\s([0-9_\.]+)/i, ['mac', 2]);
            if (result && result[1]) {
                result[1] = result[1].replace(/\_/g, '.');
            }
            if (result) {
                return result;
            }
            // android :
            result = this._match(useragent, /(android)\s([0-9\.]+)/i, ['android', 2]);
            if (result) {
                return result;
            }
            // linux | blackberry | firefox:
            result = this._match(useragent, /(linux|blackberry|firefox)/i, [1, null]);
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
            result = this._match(useragent, /(edge)\/([0-9]+)/i, ['edge', 2]);
            if (result) {
                return result;
            }
            // ie < 11 :
            result = this._match(useragent, /(msie)\s([0-9]+)/i, ['ie', 2]);
            if (result) {
                return result;
            }
            // ie 11 :
            result = this._match(useragent, /(trident).*[rv:]([0-9]+)/i, ["ie", 2]);
            if (result) {
                return result;
            }
            // firefox
            result = this._match(useragent, /(firefox|fxios)\/([0-9]+)/i, ["firefox", 2]);
            if (result) {
                return result;
            }
            // opera
            result = this._match(useragent, /(opios|opr|opera)\/([0-9]+)/i, ["opera", 2]);
            if (result) {
                return result;
            }
            // chrome
            result = this._match(useragent, /(crmo|crios|chrome)\/([0-9]+)/i, ["chrome", 2]);
            if (result) {
                return result;
            }
            // safari
            result = this._match(useragent, /Version\/([0-9]+).*(safari)\//i, ["safari", 1]);
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
        UserInfos._match = function (str, regex, data) {
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
        return UserInfos;
    }());
    BABYLON.UserInfos = UserInfos;
})(BABYLON || (BABYLON = {}));
