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
          bumpEnabled : false
        },
        maxRenderSize : {
          maxWidth : 1024,
          maxHeight : 640,
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
          bumpEnabled : true
        },
        maxRenderSize : {
          maxWidth : 1440,
          maxHeight : 900,
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
          bumpEnabled : true
        },
        shadows : {
          type : 'usePoissonSampling',
          size : 256
        },
        maxRenderSize : {
          maxWidth : 1600,
          maxHeight : 1000,
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
          bumpEnabled : true
        },
        shadows : {
          type : 'usePoissonSampling',
          size : 512
        },
        maxRenderSize : {
          maxWidth : 1920,
          maxHeight : 1200,
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
          bumpEnabled : true
        },
        shadows : {
          type : 'useBlurCloseExponentialShadowMap',
          size : 256
        },
        maxRenderSize : {
          maxWidth : 1920,
          maxHeight : 1200,
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
          bumpEnabled : true
        },
        shadows : {
          type : 'useBlurCloseExponentialShadowMap',
          size : 512
        },
        maxRenderSize : {
          maxWidth : 1920,
          maxHeight : 1200,
          devicePixelRatio : 2
        }
      };
    }
  }





  /*************************
   * OPTIMISATION FUNCTION
   ************************/

  // optimization :
  export class Optimization {

    // for textures
    public static textures(scene : Scene, params: IParamsTexturesGradeOptimization) {

      var materials = scene.materials,
          matL = materials.length;

      // for x materials
      for (let i = 0; i < matL; i++) {
        BABYLON.Optimization.resizeMaterialChannel(materials[i], params);
      }

      // for particules texture
      // ...

    }

    // for materials
    public static materials(scene : Scene, params: IParamsMaterialsGradeOptimization) {

      // verify bump
      if (params.bumpEnabled != undefined) {
        BABYLON.StandardMaterial.BumpTextureEnabled = params.bumpEnabled;
      }

      // fresnel
      // ...

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
    public static renderSize(scene : Scene, params: IParamsMaxRenderSizeGradeOptimization) {
      var engine = scene.getEngine(),
          canvas = engine.getRenderingCanvas(),
          width = canvas.clientWidth,
          height = canvas.clientHeight,

          pxDensity = 1 / params.devicePixelRatio || 1,
          maxWidth = params.maxWidth,
          maxHeight = params.maxHeight,

          newScale = 0;

      if (width > maxWidth || height > maxHeight) {
        if (width > maxWidth && width > height) {
          newScale = (width / maxWidth) * pxDensity;
        }
        else {
          newScale = (height / maxHeight) * pxDensity;
        }
      }
      else {
        newScale = pxDensity;
      }

      engine.setHardwareScalingLevel(newScale);

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
          texture.onLoadObservable.add( (texture) => {
            resizeChannel(texture, channelName);
          })
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
    public autoRunInterval: number = 12000;

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

    // optimizations
    public gradeOptimizations: Array<ParamsGradeOptimizationI> = [];

    // upgrade taks
    public upGradingTasks: Array<Function> = [];

    // downgrade taks
    public downGradingTasks: Array<Function> = [];

    // to know on wich grade we are.
    private _currentGrade: Grade;

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
    constructor (public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoUpdate: boolean = true) {

    }

    // start
    public run(engine: Engine, scene: Scene, starterGrade?: Grade, onReady?: Function) {

      // add resize event
      window.addEventListener("resize", () => {
        if (this._currentGrade) {
          BABYLON.Optimization.renderSize(scene, this._currentGrade.optimization.maxRenderSize);
        }
      });

      // get starter
      if (!starterGrade) {
        starterGrade = this.grades[0];
      }


      // start update scene by starterGrade
      this.updateSceneByGrade(scene, starterGrade, () => {

        if (onReady) {
          onReady();
        }

        // if auto update is enabled
        if (this.autoUpdate) {

          // force to wait minimum 1 sec to get fps (only for initialisation)
          var duration = this.evaluationDuration;
          if (duration < 1000) {
            setTimeout( () => {
              this.autoRun(engine, scene);
            }, 1000 - duration);
          }
          else {
            this.autoRun(engine, scene);
          }

        }
      });
    }

    public autoRun(engine: Engine, scene: Scene) {

      //clear
      this.stop();

      console.log('AUTORUN starting');

      // start hardware evaluation
      this._hardwareEvaluation(engine, scene, true, () => {

        // start autoRun
        this._autoRunIntervalId = setTimeout(() => {

          // restart
          this.autoRun(engine, scene);

        }, this.autoRunInterval);

      });
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

      if (grade === this._currentGrade) {
        console.log('Allready on grade : ' + grade.name);
        return;
      }

      console.log('UPDATE scene by grade : ' + grade.name);

      // clear
      this.stop();

      var toPriority = grade.priority,
          currentGrade,
          currentPriority,
          priorityLoop,

          downGradingTasks = this.downGradingTasks,
          upGradingTasks = this.upGradingTasks,
          optimization = this.gradeOptimizations[toPriority],

          downGradeTask,
          upGradingTask,


          // to do after tasks
          applySuccess = () => {

            // update render with optimization parameter
            this.updateSceneByOptimization(scene, optimization);

            // update current variable
            this._currentGrade = grade;
            this._currentGradePriority = grade.priority;

            // on success
            if (onSuccess) {
              onSuccess();
            }

          },



          // loop to apply all tasks
          applyTasks = (priority: number) => {
            downGradeTask = downGradingTasks[priority];
            upGradingTask = upGradingTasks[priority];

            // up
            if (priorityLoop < toPriority) {
              priorityLoop ++;

              if (upGradingTask) {
                upGradingTask( () => {
                  applyTasks(priorityLoop);
                });
              }
              else {
                applyTasks(priorityLoop);
              }

            }

            // down
            else if (priorityLoop > toPriority) {
              priorityLoop --;

              if (downGradeTask) {
                downGradeTask( () => {
                  applyTasks(priorityLoop);
                });
              }
              else {
                applyTasks(priorityLoop);
              }
            }

            // if priorityLoop = toPriority, upgrade scene with grade optimization
            else if (upGradingTask){
              upGradingTask( () => {
                applySuccess();
              });
            }

            else {
              applySuccess();
            }
          }



      if (this._currentGrade) {
        currentGrade = this._currentGrade;
        currentPriority = currentGrade.priority;
        priorityLoop = currentPriority;
      }
      else {
        currentPriority = 0;
        priorityLoop = 0;
      }

      // loop in tasks to do
      applyTasks(currentPriority);

    }

    // force downgrade by 1
    public downgrade(scene: Scene, onSuccess? : Function) {

      var meshes = scene.meshes,

          // downgrading options
          gradeToDowngrade = this.grades[this._currentGradePriority],
          downGradingTask = gradeToDowngrade.downGradingTask,

          // upgrading options
          gradeToUpgrade = this.grades[this._currentGradePriority - 1],
          upGradingTask = gradeToUpgrade.upGradingTask,
          optimization = gradeToUpgrade.optimization,

          // to do after tasks
          applySuccess = () => {

            // update render with optimization parameter
            this.updateSceneByOptimization(scene, optimization);

            // update current variable
            this._currentGrade = gradeToUpgrade;
            this._currentGradePriority = gradeToUpgrade.priority;

            // on success
            if (onSuccess) {
              onSuccess();
            }

          }


      console.log(' • Downgrade scene to ' + gradeToUpgrade.name + " grade.");

      // downgrade task
      if (downGradingTask) {
        downGradingTask( () => {

          // upgrade task
          if (upGradingTask) {
            upGradingTask( () => {
              applySuccess();
            });
          }
          else {
            applySuccess();
          }

        });
      }

      // upgrade task
      else if (upGradingTask) {
        upGradingTask( () => {
          applySuccess();
        });
      }

      else {
        applySuccess();
      }

    }

    // force upgrade by 1
    public upgrade(scene: Scene, onSuccess? : Function) {

      var grade = this.grades[this._currentGradePriority + 1],
          upGradingTask = grade.upGradingTask,
          optimization = grade.optimization,

          // to do after tasks
          applySucess = () => {

            // update render with optimization parameter
            this.updateSceneByOptimization(scene, optimization);

            // update current variable
            this._currentGrade = grade;
            this._currentGradePriority = grade.priority;

            // on success
            if (onSuccess) {
              onSuccess();
            }

          }

      console.log(' • Upgrade scene to ' + grade.name + " grade.");

      // upgrade task
      if (upGradingTask) {
        upGradingTask( () => {
          applySucess();
        });
      }

      else {
        applySucess();
      }

    }

    // clear all timer and tasks
    public stop() {

      // set false
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
        BABYLON.Optimization.renderTargets(scene, paramsOptimization.renderTargetsEnabled);
      }

      // for postProcess
      if (paramsOptimization.postProcessesEnabled != undefined) {
        BABYLON.Optimization.postProcesses(scene, paramsOptimization.postProcessesEnabled);
      }

      // for lensFlare
      if (paramsOptimization.lensFlaresEnabled != undefined) {
        BABYLON.Optimization.lensFlares(scene, paramsOptimization.lensFlaresEnabled);
      }

      // for shadows
      if (paramsOptimization.shadowsEnabled != undefined) {
        BABYLON.Optimization.shadows(scene, paramsOptimization.shadowsEnabled, paramsOptimization.shadows);
      }

      // for maxRenderSize
      if (paramsOptimization.maxRenderSize != undefined) {
        BABYLON.Optimization.renderSize(scene, paramsOptimization.maxRenderSize);
      }

      // for textures
      if (paramsOptimization.textures != undefined) {
        BABYLON.Optimization.textures(scene, paramsOptimization.textures);
      }

      // for materials
      if (paramsOptimization.materials != undefined) {
        BABYLON.Optimization.materials(scene, paramsOptimization.materials);
      }

      // for particules
      if (paramsOptimization.particulesEnabled != undefined) {
        BABYLON.Optimization.particules(scene, paramsOptimization.particulesEnabled, paramsOptimization.particules);
      }

    }

    // eval your hardware performance
    private _hardwareEvaluation(engine: Engine, scene: Scene, autoRun?: boolean, onSuccess?: Function){

      console.log('   > Hardware evaluation : running ...');

      // stop OLD evaluation interval
      clearTimeout(this._evaluationTimeOutId);

      // wait 1 sec for the first time to get the good FPS average
      var fps;

      // start setTimeOut
      this._evaluationTimeOutId = setTimeout( () => {

        fps = engine.getFps();

        console.log('     > result : ' + fps + ' fps');

        // if autoRun is disable, return fps value
        if (!autoRun) {
          return fps;
        }

        // if autoRun is enable, upgrade and downgrade automaticaly
        // check fps to reach
        if (fps > this.fpsToReach) {
          if (this._isUpGradingStep && this._currentGradePriority < this.grades.length - 1) {
            this.upgrade(scene, () => {
              this._hardwareEvaluation(engine, scene, autoRun, onSuccess);
            });
          }

          // if it's a success for all grade
          else if (onSuccess) {
            onSuccess();
          }

        }

        // if fps not reach, start downgrade step
        else if (this._currentGradePriority > 0) {
          this._isUpGradingStep = false;

          this.downgrade(scene, () => {
            this._hardwareEvaluation(engine, scene, autoRun, onSuccess);
          });
        }

        // when finished
        else if (onSuccess) {
          this._isUpGradingStep = true;
          onSuccess();
        }

      }, this.evaluationDuration);
    }

  }





  /*********
   * GRADE
   *********/

  // class to customize grade
  export class Grade {

    // priority
    private _priority: number;
    public set priority(priority: number) {
      this._priority = priority;
    }
    public get priority() {
      return this._priority;
    }

    // upGradingTask
    private _upGradingTask : Function;
    public set upGradingTask(task: Function) {
      this._GSO.upGradingTasks[this.priority] = task;
      this._upGradingTask = task;
    }
    public get upGradingTask() {
      return this._upGradingTask;
    }

    // downGradingTask
    private _downGradingTask : Function;
    public set downGradingTask(task: Function) {
      this._GSO.downGradingTasks[this.priority] = task;
      this._downGradingTask = task;
    }
    public get downGradingTask() {
      return this._downGradingTask;
    }

    /**
     * @param name : name of grade
     * @param upGradingTask : task to do when this grade is enabled
     * @param downGradingTask : task to do when this grade is disabled
     * @param optimization : optimization parameters
     */
    constructor (private _GSO: GradingSceneOptimizer, public name: string, public optimization : ParamsGradeOptimizationI, upGradingTask: Function = null, downGradingTask: Function = null) {

      //this._GSO = _GSO
      this.priority = _GSO.grades.length;
      this.optimization = optimization;
      this.upGradingTask = upGradingTask;
      this.downGradingTask = downGradingTask;
      _GSO.gradeOptimizations.push(optimization);
      _GSO.grades.push(this);

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
    particulesEnabled? : boolean; // TODO
    shadowsEnabled?: boolean;


    // parameters variable
    particules? : IParamsParticulesGradeOptimization
    shadows? : IParamsShadowsGradeOptimization;
    maxRenderSize? : IParamsMaxRenderSizeGradeOptimization;
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
  export interface IParamsMaxRenderSizeGradeOptimization {
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
    viewDistance? : number; // to keep ratio
  }



}
