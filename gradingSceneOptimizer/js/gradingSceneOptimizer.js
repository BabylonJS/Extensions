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
                // TODO : BABYLON.Optimize.textures(scene, grade.textures);
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
