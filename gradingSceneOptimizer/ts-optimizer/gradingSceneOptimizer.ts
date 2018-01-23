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

module BABYLON {



  /***************************
   * GRADING SCENE OPTIMIZER
   **************************/

  // class to controle optimizations
  export class GradingSceneOptimizer {

      // grade : preset options to optimize scene (ex : low, medium, hight)
      public grades: Array<Grade> = new Array();

      // run every x ms
      public autoRunInterval: number = 30000;

      // active occlusion culling to downgrade the number of draw.
      // show only meshes in the frustrum of camera and if we can see it (disable if mesh hide an other mesh)
      public occlusionCullingEnabled: boolean = true; // TODO ( !!! FUTURE FEATURE !!!)

      // try to minimize draw call of CPU
      // based on distance of view in optimizations paramater
      //    add a radius detection around the meshes (useful for big meshes)
      //    add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
      //
      //    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
      //
      // set mesh.isVisible to false
      public minimizeDrawCall: boolean = true; // TODO ( !!! FUTURE FEATURE !!!)


      // device type
      public deviceType: string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' = BABYLON.Hardware.devicesDetection();

      // is mobile ?
      public isMobile: boolean = BABYLON.Hardware.isMobile();

      // is dedicated GPU ?
      public isDedicatedGPU : boolean;


      // to know on wich grade we are.
      private _currentGrade: Grade;

      // current screen size render options for resize event
      private _currentRenderSize: IParamsRenderSizeGradeOptimization;

      // current priority
      private _currentGradePriority: number = -1;

      // to know the step of evaluation :
      // 1. try to upgrading.
      // 2. if fps not reached, dowgrading.
      private _isUpGradingStep: boolean = true;

      // evaluation interval ID
      private _evaluationTimeOutId: number;

      // auto rerun interval ID
      private _autoRunIntervalId: number;

      // resize event function
      private _resizeEvent: any;



      /**
       * @param engine : Babylon engine
       * @param fpsToReach : fps to reach
       * @param evaluationDuration : duration for fps evaluation
       * @param autoReEval : active auto evaluation
       */
      constructor (engine: Engine, public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoReEval: boolean = true) {

          // Detect dedicated GPU
          this.isDedicatedGPU = BABYLON.Hardware.isDedicatedGPU(engine);

          // add resize event
          if (this._resizeEvent) {
              window.removeEventListener("resize", this._resizeEvent);
          }

          this._resizeEvent = () => {
              if (this._currentRenderSize) {
                  BABYLON.Optimize.renderSize(engine, this._currentRenderSize);
              }
          }

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
      public run(scene: Scene, starterGrade?: Grade, onReady?: Function) {
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
          this.updateSceneByGrade(scene, starterGrade, () => {

              if (onReady) {
                  onReady();
              }

              this.startAutoEval(scene);

          });
      }

      // evaluate and choose the best grade for your hardware
      public startAutoEval(scene: Scene, onSuccess?: Function){

          var engine = scene.getEngine(),
              fps,
              grades = this.grades,
              gradesL = this.grades.length,
              gradeI,
              currentPriority,
              I,
              isInit = false,
              timeToWait = 1000,
              evalDuration = this.evaluationDuration;

          // stop
          this.stopAutoEval();



          // onSucess
          var success = () => {

              // if autoReEval
              if (this.autoReEval) {
                  this._autoRunIntervalId = setTimeout(() => {

                    // restart
                    autoEvaluate();

                  }, this.autoRunInterval);
              }

              // if callback onSuccess
              if (onSuccess) {
                  onSuccess();
              }
          }



          // loop in to check all grade
          var autoEvaluate = () => {

              currentPriority = this._currentGradePriority;
              I = currentPriority;

              BABYLON.Tools.Log('Optimizer : Hardware evaluation : running ...');

              // force to wait minimum 1 sec to get fps (only for initialisation)
              if (!isInit && evalDuration < timeToWait) {
                  isInit = true;
                  evalDuration = timeToWait - evalDuration;
              }
              else {
                  evalDuration = this.evaluationDuration;
              }



              // start setTimeOut
              this._evaluationTimeOutId = setTimeout( () => {

                  fps = engine.getFps();

                  BABYLON.Tools.Log('     > Optimizer : result : ' + fps + ' fps');

                  // check fps to reach to upgrade
                  if (fps > this.fpsToReach) {

                      I ++;

                      gradeI = grades[I];

                      // if it's the last grade and if it's disabled, stop.
                      if (!gradeI || I >= gradesL) {
                        success();
                        return;
                      }

                      if (this._isUpGradingStep && I <= gradesL) {

                          this.upgrade(scene, () => {
                              autoEvaluate();
                          });

                      }

                      // if it's a success for all grade
                      else {
                          success();
                          return;
                      }

                  }

                  // if fps not reach, start downgrade step
                  else {

                    I --;

                    gradeI = grades[I];

                    // if it's the last grade and if it's disabled, stop.
                    if (!gradeI || I < 0) {
                      success();
                      return;
                    }

                    if (I >= 0) {
                        this._isUpGradingStep = false;

                        this.downgrade(scene, () => {
                            autoEvaluate();
                        });
                    }

                    // when finished
                    else {

                        this._isUpGradingStep = true;

                        success();
                        return;

                    }

                  }

              }, evalDuration);

          } // end of evaluate

          // start autoEval
          autoEvaluate();

      }

      // create grades
      public createGrade(name: string, optimization : ParamsGradeOptimizationI, upGradingTask?: Function, downGradingTask?: Function) {

          // create new grade
          var newGrade = new BABYLON.Grade(name, optimization, upGradingTask, downGradingTask);

          // add grade to GSO
          this.addGrade(newGrade);

          // return grade result
          return newGrade;

      }

      // add existing grade
      public addGrade(grade: Grade) {

          var grades = this.grades,
              devices = grade.devices,
              deviceType = this.deviceType,


              isOnAllowedDevice = (params: IParamsDevicesGradeOptimization) : boolean => {
                  var exceptions = params.exceptionsAllowed,
                      phoneAllowed = params.smartPhoneAllowed,
                      tabletAllowed = params.tabletAllowed,
                      noteBookAllowed = params.noteBookAllowed,
                      computerAllowed = params.computerAllowed;

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

              }

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

      }


      // update scene by render grade name
      public updateSceneByGrade(scene : Scene, grade : Grade, onSuccess?: Function) {

          // clear
          this.stopAutoEval();

          // if allready on this grade
          if (grade === this._currentGrade) {
              BABYLON.Tools.Log('Optimizer : Grade ' + grade.name + ': allready on it.');
              return;
          }

          BABYLON.Tools.Log('Optimizer : UPDATE scene by grade : ' + grade.name);

          var grades = this.grades,
              toPriority = grade.priority,
              gradeToUp = grade,
              currentGrade,
              currentPriority,
              downGradeTask,
              upGradingTask;



          if (this._currentGrade) {
              currentGrade = this._currentGrade;
              currentPriority = currentGrade.priority;
          }
          else {
              currentPriority = 0;
          }


          // up
          if (currentPriority < toPriority) {

              for (let i = currentPriority; i <= toPriority; i++) {
                  gradeToUp = grades[i];

                  upGradingTask = gradeToUp.upGradingTask;

                  if (upGradingTask) {
                      upGradingTask();
                  }
              }

          }

          // down
          else {

              for (let i = currentPriority; i >= toPriority; i--) {
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

      }

      // force upgrade by 1
      public upgrade(scene: Scene, onSuccess? : Function) {

          var I = this._currentGradePriority + 1,
              grades = this.grades,
              gradesL = grades.length,
              gradeI = grades[I],
              upGradingTask = gradeI.upGradingTask;

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

      }

      // force downgrade by 1
      public downgrade(scene: Scene, onSuccess? : Function) {

          var grades = this.grades,
              gradesL = grades.length,
              currentPriority = this._currentGradePriority,

              // downgrading options
              gradeToDowngrade = grades[currentPriority],
              downGradingTask = gradeToDowngrade.downGradingTask,

              // upgrading options
              I = currentPriority - 1,
              gradeI = grades[I],
              upGradingTask = gradeI.upGradingTask;


          BABYLON.Tools.Log('Optimizer :  Downgrade scene to ' + gradeI.name + " grade.")

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

      }

      // clear all timer and tasks
      public stopAutoEval() {

          this._isUpGradingStep = true;

          // stop auto run
          clearTimeout(this._autoRunIntervalId);

          // stop evaluation interval
          clearTimeout(this._evaluationTimeOutId);

      }

      // update Render By Optimization parameters
      public optimizeRenderByGrade(scene: Scene, grade : Grade) {

          var engine = scene.getEngine();

          // for render targets
          if (grade.renderTargetsEnabled != undefined) { // DONE
              BABYLON.Optimize.renderTargets(scene, grade.renderTargetsEnabled);
          }

          // for postProcess
          if (grade.postProcessesEnabled != undefined) { // DONE
              BABYLON.Optimize.postProcesses(scene, grade.postProcessesEnabled);
          }

          // for lensFlare
          if (grade.lensFlaresEnabled != undefined) { // DONE
              BABYLON.Optimize.lensFlares(scene, grade.lensFlaresEnabled);
          }

          // for shadows
          if (grade.shadowsEnabled != undefined) { //done
              BABYLON.Optimize.shadows(scene, grade.shadowsEnabled, grade.shadows);
          }

          // for maxRenderSize
          if (grade.renderSize != undefined) { // DONE
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

      }

  }





  /*********
   * GRADE
   *********/

  // class to customize grade
  export class Grade {

      // priority
      public priority: number;

      // enabled
      // ex : if this grade is not allowed on mobile device
      public enabled: boolean;

      // OPTIMIZATION PARAMETERS :
      // "enabled" variable
      postProcessesEnabled? : boolean = undefined;
      lensFlaresEnabled? : boolean = undefined;
      renderTargetsEnabled? : boolean = undefined;
      particulesEnabled? : boolean = undefined;
      shadowsEnabled?: boolean = undefined;

      // parameters variable
      particules? : IParamsParticulesGradeOptimization = undefined;
      shadows? : IParamsShadowsGradeOptimization = undefined;
      renderSize? : IParamsRenderSizeGradeOptimization = undefined;
      materials? : IParamsMaterialsGradeOptimization = undefined;
      textures? : IParamsTexturesGradeOptimization = undefined;
      devices? : IParamsDevicesGradeOptimization = undefined;
      camera? : IParamsCameraGradeOptimization = undefined;

      /**
       * @param GSO : GradingSceneOptimizer
       * @param name : name of grade
       * @param upGradingTask : task to do when this grade is enabled
       * @param downGradingTask : task to do when this grade is disabled
       * @param optimization : optimization parameters
       */
      constructor (public name: string, optimization : ParamsGradeOptimizationI, public upGradingTask: Function = null, public downGradingTask: Function = null) {

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

  }





  /**************
   * INTERFACES
   *************/

  // interface grade parameter
  export interface ParamsGradeOptimizationI {
      // ENABLED variable
      postProcessesEnabled? : boolean;
      lensFlaresEnabled? : boolean;
      renderTargetsEnabled? : boolean;
      particlesEnabled? : boolean;
      shadowsEnabled?: boolean;


      // parameters variable
      particles? : IParamsParticulesGradeOptimization;
      shadows? : IParamsShadowsGradeOptimization;
      renderSize? : IParamsRenderSizeGradeOptimization;
      materials? : IParamsMaterialsGradeOptimization;
      textures? : IParamsTexturesGradeOptimization;
      devices? : IParamsDevicesGradeOptimization;
      camera? : IParamsCameraGradeOptimization;
  }

  // interface shadow grade parameter
  export interface IParamsShadowsGradeOptimization {
      type? : 'usePoissonSampling' | 'useExponentialShadowMap' | 'useBlurExponentialShadowMap' | 'useCloseExponentialShadowMap' | 'useBlurCloseExponentialShadowMap';
      size? : number;
  }

  // interface particule grade parameter
  export interface IParamsParticulesGradeOptimization {
      ratio : number;
      maxEmitRate? : number;
      minEmitRate? : number;
  }

  // interface render size grade parameter
  export interface IParamsRenderSizeGradeOptimization {
      maxWidth : number;
      maxHeight : number;
      hardwareScaling? : number;
  }

  // interface material grade parameter
  export interface IParamsMaterialsGradeOptimization {
      diffuseTextureEnabled? : boolean;
      opacityTextureEnabled? : boolean;
      reflectionTextureEnabled? : boolean;
      emissiveTextureEnabled? : boolean;
      specularTextureEnabled? : boolean;
      ambientTextureEnabled? : boolean;
      bumpTextureEnabled? : boolean;
      lightmapTextureEnabled? : boolean;
      refractionTextureEnabled? : boolean;
      colorGradingTextureEnabled? : boolean;
      fresnelEnabled? : boolean;
  }

  // interface texture grade parameter
  export interface IParamsTexturesGradeOptimization {
      scale : number; // to keep ratio
      maxSize? : number; // max size
      minSize? : number;
  }

  // interface shadow grade parameter
  export interface IParamsDevicesGradeOptimization {
      smartPhoneAllowed? : boolean; // size : 0 - 767 px && mobile detection = true
      tabletAllowed? : boolean; // size : 768 - 1024 px && mobile detection = true
      noteBookAllowed? : boolean; // size : < 1280 px && mobile detection = false
      computerAllowed? : boolean; // size : > 1280 px
      exceptionsAllowed? : Array<string>;
      onlyDedicatedGPU? : boolean;
      benchmarkScore? : number;
  }

  // interface camera grade parameter
  export interface IParamsCameraGradeOptimization {
      viewDistance : number; // TODO
  }

}
