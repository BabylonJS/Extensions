module BABYLON {

  /***********************
   * PRESET OPTIMISATION
   **********************/

  // preset grade optimization
  export class PresetGradeOptimization {

      // low render quality
      public static minimum() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : false,
              particulesEnabled : false,
              postProcessesEnabled : false,
              lensFlaresEnabled : false,
              renderTargetsEnabled : false,
              textures : {
                scale : 0.5,
                maxSize : 256,
                minSize : 128
              },
              materials : {
                bumpEnabled : false,
                fresnelEnabled : false
              },
              renderSize : {
                maxWidth : 1024,
                maxHeight : 1024,
                devicePixelRatio : 1
              }

          };
      }

      // low render quality
      public static low() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : false,
              particulesEnabled : false,
              postProcessesEnabled : false,
              lensFlaresEnabled : false,
              renderTargetsEnabled : false,
              textures : {
                scale : 0.5,
                maxSize : 512,
                minSize : 128
              },
              materials : {
                bumpEnabled : true,
                fresnelEnabled : false
              },
              renderSize : {
                maxWidth : 1440,
                maxHeight : 1440,
                devicePixelRatio : 1
              }
          };
      }

      // standar render quality
      public static standard() : ParamsGradeOptimizationI{
          return {
              shadowsEnabled : true,
              particulesEnabled : false,
              postProcessesEnabled : false,
              lensFlaresEnabled : false,
              renderTargetsEnabled : true,
              textures : {
                scale : 0.5,
                maxSize : 512,
                minSize : 256
              },
              materials : {
                bumpEnabled : true,
                fresnelEnabled : false
              },
              shadows : {
                type : 'usePoissonSampling',
                size : 256
              },
              renderSize : {
                maxWidth : 1600,
                maxHeight : 1600,
                devicePixelRatio : 1
              }
          };
      }

      // medium render quality
      public static medium() : ParamsGradeOptimizationI{
          return {
              shadowsEnabled : true,
              particulesEnabled : true,
              postProcessesEnabled : false,
              lensFlaresEnabled : false,
              renderTargetsEnabled : true,
              textures : {
                scale : 0.75,
                maxSize : 1024,
                minSize : 256
              },
              particules : {
                ratio : 0.25,
                maxEmitRate : 300,
                minEmitRate : 100
              },
              materials : {
                bumpEnabled : true,
                fresnelEnabled : true
              },
              shadows : {
                type : 'usePoissonSampling',
                size : 512
              },
              renderSize : {
                maxWidth : 1920,
                maxHeight : 1920,
                devicePixelRatio : 1
              }
          };
      }

      // high render quality
      public static high() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : true,
              particulesEnabled : true,
              postProcessesEnabled : true,
              lensFlaresEnabled : true,
              renderTargetsEnabled : true,
              textures : {
                scale : 1,
                maxSize : 1024,
                minSize : 512
              },
              particules : {
                ratio : 0.5,
                maxEmitRate : 5000,
                minEmitRate : 100
              },
              materials : {
                bumpEnabled : true,
                fresnelEnabled : true
              },
              shadows : {
                type : 'useBlurCloseExponentialShadowMap',
                size : 256
              },
              renderSize : {
                maxWidth : 2560,
                maxHeight : 2560,
                devicePixelRatio : 1
              }
          };
      }

      // best render quality
      public static ultra() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : true,
              particulesEnabled : true,
              postProcessesEnabled : true,
              lensFlaresEnabled : true,
              renderTargetsEnabled : true,
              textures : {
                scale : 1,
                maxSize : 2048,
                minSize : 512
              },
              particules : {
                ratio : 1,
                maxEmitRate : 10000,
                minEmitRate : 100
              },
              materials : {
                bumpEnabled : true,
                fresnelEnabled : true
              },
              shadows : {
                type : 'useBlurCloseExponentialShadowMap',
                size : 512
              },
              renderSize : {
                maxWidth : 2560,
                maxHeight : 2560,
                devicePixelRatio : 2
              }
          };
      }

    }





  /*************************
   * OPTIMISATION FUNCTION
   ************************/

  // Optimize :
  export class Optimize {

      // for materials
      public static materials(scene : Scene, params: IParamsMaterialsGradeOptimization) {

          // verify bump
          if (params.bumpEnabled != undefined) {
              BABYLON.StandardMaterial.BumpTextureEnabled = params.bumpEnabled;
          }

          if (params.fresnelEnabled != undefined) {
              BABYLON.StandardMaterial.FresnelEnabled = params.bumpEnabled;
          }

      }

      // for postProcesses
      public static postProcesses(scene : Scene, enabled: boolean) {
          scene.postProcessesEnabled = enabled;
      }

      // for lensFlares
      public static lensFlares(scene : Scene, enabled: boolean) {
          scene.lensFlaresEnabled = enabled;
      }

      // for render Targets (like mirror and bump)
      public static renderTargets(scene : Scene, enabled: boolean) {
          scene.renderTargetsEnabled = enabled;
      }

      // for particules
      public static particules(scene : Scene, enabled: boolean, params: IParamsParticulesGradeOptimization) {

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

          var particleSystems = scene.particleSystems,
              particleSysL = particleSystems.length,
              partSysI,
              paramRatio = params.ratio,
              paramMin = params.minEmitRate,
              paramMax = params.maxEmitRate,
              originalEmitRate,
              newRate;

          for (let i = 0; i < particleSysL; i++) {
              partSysI = scene.particleSystems[i];

              if (!partSysI.originalEmitRate) { // TODO add originalEmitRate to IParticuleSystem
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

      }

      // for shadows
      public static shadows(scene : Scene, enabled: boolean, params: IParamsShadowsGradeOptimization) {

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

          var shadowsType = ['usePoissonSampling', 'useExponentialShadowMap', 'useBlurExponentialShadowMap', 'useCloseExponentialShadowMap', 'useBlurCloseExponentialShadowMap'],
              lights = scene.lights,
              paramSize = params.size,
              paramType = params.type,

              shadowMap;

          // change type of shadow
          var setShadowType = (shadowGenerator: ShadowGenerator) => {

              for (let i = 0; i < shadowsType.length; i++) {
                  shadowGenerator[shadowsType[i]] = false;
              }
              shadowGenerator[paramType] = true;

          }

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

              // if need to change type
              if (paramType) {
                  setShadowType(sh); // TODO : typescript : 'IShadowGenerator' is not assignable to parameter of type 'ShadowGenerator'
              }

          }
      }

      // for render size
      public static renderSize(scene : Scene, params: IParamsRenderSizeGradeOptimization) {
          var engine = scene.getEngine(),
              canvas = engine.getRenderingCanvas(),
              width = canvas.clientWidth,
              height = canvas.clientHeight,
              windowPixelRatio = window.devicePixelRatio,
              paramPixelRatio = params.devicePixelRatio || 1,
              maxWidth = params.maxWidth,
              maxHeight = params.maxHeight,
              newScale = 0;

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

      }

      // for textures
      public static textures(scene : Scene, params: IParamsTexturesGradeOptimization) {

          var materials = scene.materials,
              matL = materials.length;

          // for x materials
          for (let i = 0; i < matL; i++) {
              BABYLON.Optimize.resizeMaterialChannel(materials[i], params);
          }

      }

      // transform materials channels textures to RenderTargetTexture
      // to be able to rescale texture on demand
      public static resizeMaterialChannel (material : Material, params : IParamsTexturesGradeOptimization) {

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
              channelsL = channels.length,
              paramMaxSize = params.maxSize,
              paramMinSize = params.minSize,
              paramScale = params.scale;


          // inspect channel
          var resizeChannel = (texture: Texture, channelName : string) => {

              var currentSize = texture.getSize(),
                  currentWidth = currentSize.width,
                  currentHeight = currentSize.height,

                  originalTexture = texture.originalTexture,
                  originalSize,
                  originalWidth,
                  originalHeight,
                  originalSizeRatio,

                  originalMaxWidth,
                  originalMaxHeight,

                  newWidth,
                  newHeight,
                  copyTask;

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
                        originalSizeRatio = originalWidth/originalHeight;

                        newWidth = paramMinSize;
                        newHeight = paramMinSize * originalSizeRatio;
                  }
                  else {
                      originalSizeRatio = originalHeight/originalWidth;

                      newWidth = paramMinSize * originalSizeRatio;
                      newHeight = paramMinSize;
                  }
              }

              // else if new size > param max size, new size = param max size.
              else if(newWidth > paramMaxSize || newHeight > paramMaxSize){

                  if (originalWidth >= originalHeight) {
                      originalSizeRatio = originalWidth/originalHeight;

                      newWidth = paramMaxSize;
                      newHeight = paramMaxSize * originalSizeRatio;
                  }
                  else {
                      originalSizeRatio = originalHeight/originalWidth;

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

              material[channelName] = this.resizeTexture(texture, newWidth, newHeight);

          }


          // add observable if needed
          var inspectState = (texture: Texture, channelName : string) => {

              if (texture.isReady()) {
                  resizeChannel(texture, channelName);
              }

              // wait load end
              else {
                  // add new observable
                  texture.onLoadObservable.add((texture) => {
                      resizeChannel(texture, channelName);
                  });
              }
          }


          // for x channels
          for (let i = 0; i < channelsL; i++) {
              var channel = channels[i],
                  texture = material[channel];

              if (!texture) {
                  continue;
              }

              inspectState(texture, channel)
          }


      }

      // resize texture with RenderTargetTexture
      public static resizeTexture(texture: Texture, newWidth: number, newHeight: number) {

          var name,
              originalTexture = texture.originalTexture,
              resizedCopy,
              needDispose = true;

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
      }

  }





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
      public occlusionCullingEnabled: boolean = false;

      // try to minimize draw call of CPU
      // based on distance of view in optimizations paramater
      //    add a radius detection around the meshes (useful for big meshes)
      //    add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
      //
      //    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
      //
      // set mesh.isVisible to false
      public minimizeDrawCall: boolean = false; // TODO

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
       * @param scene : BABYLON.Scene
       * @param fpsToReach : fps to reach
       * @param trackerDuration : duration between two fps evaluation
       * @param starterGrade : on wich grade renderGradingSceneOptimizer need to start.
       *                       It's interresting to start with the lower grade.
       *                       For exemple, configure your lower grade with only what is needed. Load only assets you need allow a best loading time performance.
       *                       You will get a better accessibility and plug and play concept. It's important for web.
       * @param autoRunInterval : run automaticaly fps evaluation every 'x' ms. 0 mean desactived
       */
      constructor (public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoReEval: boolean = true) {

      }

      // start
      public run(engine: Engine, scene: Scene, starterGrade?: Grade, onReady?: Function) {

          // add resize event
          if (this._resizeEvent) {
              window.removeEventListener("resize", this._resizeEvent);
          }

          this._resizeEvent = () => {
              if (this._currentRenderSize) {
                  BABYLON.Optimize.renderSize(scene, this._currentRenderSize);
              }
          }

          window.addEventListener("resize", this._resizeEvent);

          // get starter
          if (!starterGrade) {
              starterGrade = this.grades[0];
          }


          // start update scene by starterGrade
          this.updateSceneByGrade(scene, starterGrade, () => {

              if (onReady) {
                  onReady();
              }

              this.hardwareEval(engine, scene);

          });
      }

      // eval your hardware performance
      public hardwareEval(engine: Engine, scene: Scene, onSuccess?: Function){

          var fps,
              isInit = false,
              timeToWait = 1000,
              evalDuration = this.evaluationDuration;

          // stop
          this.stop();

          // loop in to check all grade
          var autoEvaluate = () => {

              console.log('   > Hardware evaluation : running ...');

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

                  console.log('     > result : ' + fps + ' fps');

                  // check fps to reach to upgrade
                  if (fps > this.fpsToReach) {
                      if (this._isUpGradingStep && this._currentGradePriority < this.grades.length - 1) {
                          this.upgrade(scene, () => {
                              autoEvaluate();
                          });
                      }

                      // if it's a success for all grade
                      else {

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

                  }

                  // if fps not reach, start downgrade step
                  else if (this._currentGradePriority > 0) {
                      this._isUpGradingStep = false;

                      this.downgrade(scene, () => {
                          autoEvaluate();
                      });
                  }

                  // when finished
                  else {

                      this._isUpGradingStep = true;

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

              }, evalDuration);

          } // end of evaluate

          // start autoEval
          autoEvaluate();

      }

      // create grades
      public createGrade(name: string, optimization : ParamsGradeOptimizationI, upGradingTask?: Function, downGradingTask?: Function) {

          // create new grade
          var newGrade = new BABYLON.Grade(this, name, optimization, upGradingTask, downGradingTask);

          // return grade result
          return newGrade;

      }


      // update scene by render grade name
      public updateSceneByGrade(scene : Scene, grade : Grade, onSuccess?: Function) {

          // clear
          this.stop();

          if (grade === this._currentGrade) {
              console.log('Allready on grade : ' + grade.name);
              return;
          }

          console.log('UPDATE scene by grade : ' + grade.name);

          var grades = this.grades,
              optimization = grade.optimization,
              toPriority = grade.priority,
              gradeToUp,
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

              for (let i = currentPriority; i < toPriority; i++) {
                  gradeToUp = grades[i];
                  upGradingTask = gradeToUp.upGradingTask;

                  if (upGradingTask) {
                      upGradingTask();
                  }
              }

          }

          // down
          else {

              for (let i = currentPriority; i > toPriority; i--) {
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
          this.updateSceneByOptimization(scene, optimization);

          // update current variable
          this._currentRenderSize = optimization.renderSize;
          this._currentGrade = grade;
          this._currentGradePriority = toPriority;

          // on success
          if (onSuccess) {
              onSuccess();
          }

      }

      // force upgrade by 1
      public upgrade(scene: Scene, onSuccess? : Function) {

          var grade = this.grades[this._currentGradePriority + 1],
              upGradingTask = grade.upGradingTask,
              optimization = grade.optimization;

          console.log(' • Upgrade scene to ' + grade.name + " grade.");

          if (upGradingTask) {
              upGradingTask();
          }

          // update render with optimization parameter
          this.updateSceneByOptimization(scene, optimization);

          // update current variable
          this._currentRenderSize = optimization.renderSize;
          this._currentGrade = grade;
          this._currentGradePriority = grade.priority;

          // on success
          if (onSuccess) {
              onSuccess();
          }

      }

      // force downgrade by 1
      public downgrade(scene: Scene, onSuccess? : Function) {

              // downgrading options
          var gradeToDowngrade = this.grades[this._currentGradePriority],
              downGradingTask = gradeToDowngrade.downGradingTask,

              // upgrading options
              gradeToUpgrade = this.grades[this._currentGradePriority - 1],
              upGradingTask = gradeToUpgrade.upGradingTask,
              optimization = gradeToUpgrade.optimization;


          console.log(' • Downgrade scene to ' + gradeToUpgrade.name + " grade.");


          if (downGradingTask) {
              downGradingTask();
          }

          if (upGradingTask) {
              upGradingTask();
          }

          // update render with optimization parameter
          this.updateSceneByOptimization(scene, optimization);

          // update current variable
          this._currentRenderSize = optimization.renderSize;
          this._currentGrade = gradeToUpgrade;
          this._currentGradePriority = gradeToUpgrade.priority;

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
      public updateSceneByOptimization(scene: Scene, paramsOptimization : ParamsGradeOptimizationI) {

          // for render targets
          if (paramsOptimization.renderTargetsEnabled != undefined) {
              BABYLON.Optimize.renderTargets(scene, paramsOptimization.renderTargetsEnabled);
          }

          // for postProcess
          if (paramsOptimization.postProcessesEnabled != undefined) {
              BABYLON.Optimize.postProcesses(scene, paramsOptimization.postProcessesEnabled);
          }

          // for lensFlare
          if (paramsOptimization.lensFlaresEnabled != undefined) {
              BABYLON.Optimize.lensFlares(scene, paramsOptimization.lensFlaresEnabled);
          }

          // for shadows
          if (paramsOptimization.shadowsEnabled != undefined) {
              BABYLON.Optimize.shadows(scene, paramsOptimization.shadowsEnabled, paramsOptimization.shadows);
          }

          // for maxRenderSize
          if (paramsOptimization.renderSize != undefined) {
              BABYLON.Optimize.renderSize(scene, paramsOptimization.renderSize);
          }

          // for textures
          if (paramsOptimization.textures != undefined) {
              BABYLON.Optimize.textures(scene, paramsOptimization.textures);
          }

          // for materials
          if (paramsOptimization.materials != undefined) {
              BABYLON.Optimize.materials(scene, paramsOptimization.materials);
          }

          // for particules
          if (paramsOptimization.particulesEnabled != undefined) {
              BABYLON.Optimize.particules(scene, paramsOptimization.particulesEnabled, paramsOptimization.particules);
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

      /**
       * @param name : name of grade
       * @param upGradingTask : task to do when this grade is enabled
       * @param downGradingTask : task to do when this grade is disabled
       * @param optimization : optimization parameters
       */
      constructor (GSO: GradingSceneOptimizer, public name: string, public optimization : ParamsGradeOptimizationI, public upGradingTask: Function = null, public downGradingTask: Function = null) {
          this.priority = GSO.grades.length;
          GSO.grades.push(this);
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
      particulesEnabled? : boolean;
      shadowsEnabled?: boolean;


      // parameters variable
      particules? : IParamsParticulesGradeOptimization
      shadows? : IParamsShadowsGradeOptimization;
      renderSize? : IParamsRenderSizeGradeOptimization;
      materials? : IParamsMaterialsGradeOptimization;
      textures? : IParamsTexturesGradeOptimization;
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
      devicePixelRatio? : number;
  }

  // interface material grade parameter
  export interface IParamsMaterialsGradeOptimization {
      bumpEnabled? : boolean;
      fresnelEnabled? : boolean; // TODO
  }

  // interface texture grade parameter
  export interface IParamsTexturesGradeOptimization {
      scale : number; // to keep ratio
      maxSize? : number; // max size accepted
      minSize? : number;
  }

  // interface camera grade parameter
  export interface IParamsCameraGradeOptimization {
      viewDistance? : number;
  }

}
