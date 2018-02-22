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
      public userInfos: UserInfosReport = UserInfos.report;

      // use texture extention workflow
      public useTextureExtWorkflow : boolean = false;

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

      //
      private _texturesRef : Array<any> = [];

      private _particlesRef : Array<any> = [];




      /**
       * @param engine : Babylon engine
       * @param fpsToReach : fps to reach
       * @param evaluationDuration : duration for fps evaluation
       * @param autoReEval : active auto evaluation
       */
      constructor (public scene: Scene, public fpsToReach: number = 48, public evaluationDuration: number = 1000, public autoReEval: boolean = false) {

          var engine = scene.getEngine();

          // observable event
          scene.onNewMeshAddedObservable.add((e, e2) => {
              console.log(e.material)
              // this._updateRefs(e);
          });

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
      public run(scene: Scene, onReady?: Function) {
          var engine = scene.getEngine();

          // If no starterGrade, get the first
          var starterGrade = this.grades[0];


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
          var newGrade = new BABYLON.Grade(this, name, optimization, upGradingTask, downGradingTask);

          // return grade result
          return newGrade;
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

          // for particles
          if (grade.particlesEnabled != undefined) {
              this.optimizeParticles(scene, grade.particlesEnabled, grade.particles); // done
          }

      }



      ////////////////////////////
      // GSO OPTIMIZE FUNCTIONS //
      ////////////////////////////

      // for textures
      public optimizeTextures(scene : Scene, params : IParamsTexturesGradeOptimization) {
          var textures = scene.textures,
              L = textures.length,
              currentRateRatio = 1,
              textureI,
              newSize;

          if (this._currentGrade) {
              currentRateRatio = this._currentGrade.textures.sizeRatio;
          }

          for (let i = 0; i < L; i++) {
              textureI = textures[i];
              newSize = textureI.getSize().width * params.sizeRatio / currentRateRatio;

              this.resizeTexture(textureI, newSize);
          }

      }

      // resize texture
      public resizeTexture(texture : Texture, size: number) : Texture {

          // regex :
          var badUrlRegex = /^(blob:|data:)/i, // look if a blob
              extRegex = /(.*)\.([0-9]+)\.([^\.]*$)/i, // capture size extention methode
              url = texture.url,
              splittedUrl;

          if (!url) {
              return;
          }

          // if bad url
          if (url && url.match(badUrlRegex)) {
              // BABYLON.Tools.Warn("Texture " + texture.name + " can't be resized ! Reason : bad url, the asset path is lost : " + url);
              return;
          }

          if (url) {
              //BABYLON.TextureTools.CreateResizedCopy
              //console.log(url);
              //texture.updateURL(url);
              //texture.scale(0.5);
              texture.getInternalTexture().updateSize(size,size)
              return;
          }


          splittedUrl = url.match(extRegex);
          if (splittedUrl) {
              var newUrl = splittedUrl[1] + '.' + size.toString() + '.' + splittedUrl[3];

              texture.updateURL(newUrl);
          }

          return null;
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

      // for particles
      public optimizeParticles(scene : Scene, enabled: boolean, params: IParamsParticlesGradeOptimization) {

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
              currentRateRatio = 1,
              particleSysL = particleSystems.length,
              particleSysI : IParticleSystem,
              paramRatio = params.rateRatio,
              paramMax = params.maxEmitRate,
              paramMin = params.minEmitRate,
              newRate;

          if (this._currentGrade) {
              currentRateRatio = this._currentGrade.particles.rateRatio;
          }

          for (let i = 0; i < particleSysL; i++) {

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

}
