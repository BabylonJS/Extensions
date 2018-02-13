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

      // user info : os, sofware(browser), device, ...
      public userInfos: UserInfosReport = BABYLON.UserInfos.report();

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

      // to keep original params of particules systems
      private _originalParticules: Array<IParamsOriginalParticules> = [];

      // to keep original texture size
      private _originalTextures: Array<IParamsOriginalTexture> = [];



      /**
       * @param engine : Babylon engine
       * @param fpsToReach : fps to reach
       * @param evaluationDuration : duration for fps evaluation
       * @param autoReEval : active auto evaluation
       */
      constructor (engine: Engine, public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoReEval: boolean = true) {

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


          // get all original references we need
          // like particules emit rate or original textures size
          this._getOriginalReferences(scene);


          // start update scene by starterGrade
          this.updateSceneByGrade(scene, starterGrade, () => {

              if (onReady) {
                  onReady();
              }

              this.start(scene);

          });
      }

      // evaluate and choose the best grade for your hardware
      public start(scene: Scene, onSuccess?: Function){

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
          this.stop();



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
              userInfos = this.userInfos,
              devices = grade.devices,
              deviceType = this.deviceType,


          isEnable = (params: IParamsDevicesGradeOptimization) : boolean => {
              var exceptions = params.exceptionsAllowed,
                  phoneAllowed = params.smartPhoneAllowed,
                  tabletAllowed = params.tabletAllowed,
                  noteBookAllowed = params.noteBookAllowed,
                  computerAllowed = params.computerAllowed;

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

          }

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

      }


      // update scene by render grade name
      public updateSceneByGrade(scene : Scene, grade : Grade, onSuccess?: Function) {

          // clear
          this.stop();

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
      public stop() {

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
              scene.renderTargetsEnabled = grade.renderTargetsEnabled;
          }

          // for postProcess
          if (grade.postProcessesEnabled != undefined) { // DONE
              scene.postProcessesEnabled = grade.postProcessesEnabled;
          }

          // for lensFlare
          if (grade.lensFlaresEnabled != undefined) { // DONE
              scene.lensFlaresEnabled = grade.lensFlaresEnabled;
          }

          // for shadows
          if (grade.shadowsEnabled != undefined) { //done
              this.optimizeShadows(scene, grade.shadowsEnabled, grade.shadows);
          }

          // for maxRenderSize
          if (grade.renderSize != undefined) { // DONE
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

      }



      ///////////////////
      // GET ORIGINALS //
      ///////////////////

      private _getOriginalReferences(scene : Scene) {

          // for particules , keep :
          // -  emitRate
          var particulesSys = scene.particleSystems,
              L = particulesSys.length,
              particulesSysI : IParticleSystem;

          for (let i = 0; i < L; i++) {
              particulesSysI = particulesSys[i];
              this._originalParticules.push(
                  {
                      "emitRate" : particulesSysI.emitRate,
                      "system" : particulesSysI
                  }
              )
          }

          // for textures , keep :
          // - width
          // - height
          // - channel
          // - texture ( only if autorized)
          var textures = scene.textures,
              L = textures.length,
              textureI : BaseTexture,
              size: ISize;

          for (let i = 0; i < L; i++) {
              textureI = textures[i];
              size = textureI.getSize();

              this._originalTextures.push(
                  {
                      "width" : size.width,
                      "height" : size.height,
                      "texture" : textureI,
                      "useExtention": true
                  }
              );

          }

      }





      ////////////////////////////
      // GSO OPTIMIZE FUNCTIONS //
      ////////////////////////////

      // for textures
      public optimizeTextures(scene : Scene, params : IParamsTexturesGradeOptimization) {

          // regex :
          var blobRegex = /^(blob:)/g, // look if a blob
              extRegex = /\.([0-9]+)\.(?=[^\.]*$)/g; // capture size extention methode

          var blob = "blob:http://localhost:8889/4a9cad29-06cb-4a23-9e2e-c981a2deea4b",
              ext = "image.1024.png";

          var textures = scene.textures,
              textureI,
              L = textures.length;


          // if it's a blob
          if (!blobRegex) {

          }
      }

      // resize material
      public resizeChannelsMaterial() {

          var standardChannels =
              [
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
              ],

              pbrChannels;
      }

      // resize texture
      public resizeTexture(texture : Texture, width: number, height: number) {

      }

      // for materials
      public optimizeMaterials(scene : Scene, params: IParamsMaterialsGradeOptimization) {

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

      }

      // for particules
      public optimizeParticules(scene : Scene, enabled: boolean, params: IParamsParticulesGradeOptimization) {

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
              oParticleSysL = oParticleSystems.length,
              oParticleSysI : IParamsOriginalParticules,
              particleSys : BABYLON.ParticleSystem,
              paramRatio = params.ratio,
              paramMin = params.minEmitRate,
              paramMax = params.maxEmitRate,
              originalEmitRate,
              newRate;

          for (let i = 0; i < oParticleSysL; i++) {

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

      }

      // for shadows
      public optimizeShadows(scene : Scene, enabled: boolean, params: IParamsShadowsGradeOptimization) {

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

          var lights = scene.lights,
              paramSize = params.size,
              shadowMap;

          // for x light
          for (let i = 0; i < lights.length; i++) {

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
      }

      // for render size
      public optimizeRenderSize(engine : Engine, params: IParamsRenderSizeGradeOptimization) {

          // CAREFULL !!!
          // for a screen with a pixel ratio to 200% :
          //    window devicePixelRatio = 2
          //    babylon hardware scaling = 0.5

          var canvas = engine.getRenderingCanvas(),
              width = canvas.clientWidth,
              height = canvas.clientHeight,
              windowPixelRatio = window.devicePixelRatio,
              paramPixelRatio = params.hardwareScaling || 1,
              maxWidth = params.maxWidth,
              maxHeight = params.maxHeight,
              newScale = 0;

          if (windowPixelRatio < ( 1 / paramPixelRatio )) {
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

  // interface to keep original particule system
  export interface IParamsOriginalParticules {
      emitRate : number;
      system : IParticleSystem;
  }

  // interface to keep original particule system
  export interface IParamsOriginalTexture {
      width : number;
      height : number;
      texture : BaseTexture;
      useExtention : boolean; // use extention for load system
  }

}
