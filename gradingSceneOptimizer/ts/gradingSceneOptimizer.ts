/***********************
 * CREATED BY PIERRE GLIBERT
 * Version : alpha_0.0.1
 **********************/

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
              particlesEnabled : false,
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
              },
              devices : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : false,
                  exceptionsList : []
              }

          };
      }

      // low render quality
      public static low() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : false,
              particlesEnabled : false,
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
              },
              devices : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsList : []
              }
          };
      }

      // standar render quality
      public static standard() : ParamsGradeOptimizationI{
          return {
              shadowsEnabled : true,
              particlesEnabled : false,
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
              },
              devices : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsList : []
              }
          };
      }

      // medium render quality
      public static medium() : ParamsGradeOptimizationI{
          return {
              shadowsEnabled : true,
              particlesEnabled : true,
              postProcessesEnabled : false,
              lensFlaresEnabled : false,
              renderTargetsEnabled : true,
              textures : {
                  scale : 0.75,
                  maxSize : 1024,
                  minSize : 256
              },
              particles : {
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
              },
              devices : {
                  smartPhoneAllowed : false,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsList : []
              }
          };
      }

      // high render quality
      public static high() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : true,
              particlesEnabled : true,
              postProcessesEnabled : true,
              lensFlaresEnabled : true,
              renderTargetsEnabled : true,
              textures : {
                  scale : 1,
                  maxSize : 1024,
                  minSize : 512
              },
              particles : {
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
              },
              devices : {
                  smartPhoneAllowed : false,
                  tabletAllowed : false,
                  noteBookAllowed : false,
                  computerAllowed : true,
                  exceptionsList : []
              }
          };
      }

      // best render quality
      public static ultra() : ParamsGradeOptimizationI {
          return {
              shadowsEnabled : true,
              particlesEnabled : true,
              postProcessesEnabled : true,
              lensFlaresEnabled : true,
              renderTargetsEnabled : true,
              textures : {
                  scale : 1,
                  maxSize : 2048,
                  minSize : 512
              },
              particles : {
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
              },
              devices : {
                  smartPhoneAllowed : false,
                  tabletAllowed : false,
                  noteBookAllowed : false,
                  computerAllowed : true,
                  exceptionsList : []
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
      public static renderSize(engine : Engine, params: IParamsRenderSizeGradeOptimization) {
          var canvas = engine.getRenderingCanvas(),
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




  /*************************
   * HARDWARE DETECTION
   ************************/

  // hardware :
  export class Hardware {

      // is there a dedicated GPU
      public static isDedicatedGPU (engine : Engine) : boolean {
          var GPUs = [
            'amd',
            'nvidia',
            'radeon',
            'geforce'
          ],
          vendor = engine.getGlInfo().renderer;
          return this._refDetection(vendor, GPUs);
      }

      // device exception detection
      public static isDevices(devices : Array<string>) : boolean {
          var userAgent = navigator.userAgent;
          return this._refDetection(userAgent, devices);
      }

      // detectMobile
      public static isMobile() : boolean {
          var userAgent = navigator.userAgent,
              mobiles = [
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
      }

      // device detection
      public static devicesDetection() : string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' {

          // get screen size
          var screenWidth = screen.height,
              screenHeight = screen.width,
              size = Math.max(screenWidth, screenHeight),
              userAgent = navigator.userAgent,
              isMobile = this.isMobile(),
              regex;

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
      }

      // TODO : FEATURE : get a benchMark reference for GPU and CPU
      public static getBenchmarkScore (engine : Engine) : number{
          return;
      }

      // regex expression detection
      private static _refDetection (pattern: string, references : Array<string>) : boolean{

          var L = references.length,
              refI,
              regex;

          for (let i = 0; i < L; i++) {

              refI = references[i];

              regex = new RegExp(refI, 'i');

              if( pattern.match(regex)){
                  return true;
              };

          }

          return false;
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
      public occlusionCullingEnabled: boolean = true; // TODO ( !!! FEATURE !!!)

      // try to minimize draw call of CPU
      // based on distance of view in optimizations paramater
      //    add a radius detection around the meshes (useful for big meshes)
      //    add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
      //
      //    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
      //
      // set mesh.isVisible to false
      public minimizeDrawCall: boolean = true; // TODO ( !!! FEATURE !!!)

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

      // device type
      private _deviceType: string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' = BABYLON.Hardware.devicesDetection();

      // is mobile ?
      private _isMobile: boolean = BABYLON.Hardware.isMobile();

      // is dedicated GPU ?
      private _isDedicatedGPU : boolean;

      /**
       * @param engine : Babylon engine
       * @param fpsToReach : fps to reach
       * @param evaluationDuration : duration for fps evaluation
       * @param autoReEval : active auto evaluation
       */
      constructor (engine: Engine, public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoReEval: boolean = true) {

          // Detect dedicated GPU
          this._isDedicatedGPU = BABYLON.Hardware.isDedicatedGPU(engine);

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

                      I ++;

                      gradeI = grades[I];

                      // if it's the last grade and if it's disabled, stop.
                      if (!gradeI || I >= (gradesL - 1)) {
                        success();
                        return;
                      }

                      if (this._isUpGradingStep && I <= (gradesL - 1)) {

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
                    if (!gradeI || I <= 0) {
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
              deviceType = this._deviceType,


              isOnAllowedDevice = (params: IParamsDevicesGradeOptimization) : boolean => {
                  var exceptions = params.exceptionsList,
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
              console.log('Grade ' + grade.name + ': allready on it.');
              return;
          }

          console.log('UPDATE scene by grade : ' + grade.name);

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
              upGradingTask;

          console.log(' • Upgrade scene to ' + gradeI.name + " grade.");

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
              upGradingTask;


          console.log(' • Downgrade scene to ' + gradeI.name + " grade.");


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
              BABYLON.Optimize.textures(scene, grade.textures);
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

      // add ui to inspect
      public addUI (scene: Scene, parentNode: HTMLElement) {

        var fragment = document.createDocumentFragment(), // "virtual" dom
            grades = this.grades,
            engine = scene.getEngine();

        var addEvent = (li, grade) => {

            li.addEventListener('click', () => {
                this.updateSceneByGrade(scene, grade);
            });
        }

        var createLi = (text) => {
            var li = document.createElement('li');
                li.textContent = text;
            return li;
        }

        // create auto li
        var li = createLi('auto');
        parentNode.appendChild(li);

        li.addEventListener('click', () => {
            this.startAutoEval(scene);
        });

        // create grade li
        for (let i = 0; i < grades.length; i++) {
            var gradeI = grades[i];

            li = createLi(gradeI.name);

            addEvent(li, gradeI);
            fragment.appendChild(li);

        }

        // add to dom
        parentNode.appendChild(fragment);

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
      devicePixelRatio? : number;
  }

  // interface material grade parameter
  export interface IParamsMaterialsGradeOptimization {
      bumpEnabled? : boolean;
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
      exceptionsList? : Array<string>;
      onlyDedicatedGPU? : boolean;
  }

  // interface camera grade parameter
  export interface IParamsCameraGradeOptimization {
      viewDistance : number; // TODO
  }

}
