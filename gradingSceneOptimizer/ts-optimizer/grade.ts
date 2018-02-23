module BABYLON {

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
  export class Grade {

      // priority
      public priority: number;

      // enabled
      // ex : if this grade is not allowed on mobile device
      public enabled: boolean;

      // observable
      public onBeforeLoad: Function;
      public onLoaded: Function;

      public onBeforeRender: Function;
      public onRendered: Function;
      public onUpdate: Function;

      public onBeforeDispose: Function;
      public onDisposed: Function;


      // OPTIMIZATION PARAMETERS :

      // static assets :
      // active all trick to get more performance like "freeze" & "refreshRate"
      public staticAssets : Array<GradingAsset>;

      // dynamic assets :
      // all asset that need to be updated
      public dynamicAssets : Array<GradingAsset>;


      // "enabled" variable
      public postProcessesEnabled? : boolean = true;
      public lensFlaresEnabled? : boolean = true;
      public renderTargetsEnabled? : boolean = true;
      public particlesEnabled? : boolean = true;
      public shadowsEnabled?: boolean = true;

      // parameters variable
      public particles? : IParamsParticlesGradeOptimization = null;
      public shadows? : IParamsShadowsGradeOptimization = null;
      public renderSize? : IParamsRenderSizeGradeOptimization = null;
      public materials? : IParamsMaterialsGradeOptimization = null;
      public textures? : IParamsTexturesGradeOptimization = null;
      public userInfos? : IParamsUserInfosGradeOptimization = null;
      public camera? : IParamsCameraGradeOptimization = null;


      /**
       * @param _GSO : GradingSceneOptimizer
       * @param name : name of grade
       * @param upGradingTask : task to do when this grade is enabled
       * @param downGradingTask : task to do when this grade is disabled
       * @param optimization : optimization parameters
       */
      constructor (private _GSO : GradingRenderWorkflow, public name: string, optimization : ParamsGradeOptimizationI, public upGradingTask: Function = null, public downGradingTask: Function = null) {



          var grades = _GSO.grades,
              prevGrade : Grade,
              priority,
              userInfos = _GSO.userInfos,
              paramsUserInfos,
              deviceType = userInfos.deviceType;

          // add priority to newGrade
          priority = this.priority = grades.length;

          if (priority > 0) {
              prevGrade = grades[grades.length - 1]
              console.log(prevGrade.name)
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
          else if (prevGrade && prevGrade.postProcessesEnabled){
              this.postProcessesEnabled = prevGrade.postProcessesEnabled;
          }

          // lensflare enabled
          if (optimization.lensFlaresEnabled != undefined) {
              this.lensFlaresEnabled = optimization.lensFlaresEnabled;
          }
          else if (prevGrade && prevGrade.lensFlaresEnabled){
              this.lensFlaresEnabled = prevGrade.lensFlaresEnabled;
          }

          // render target texture enabled
          if (optimization.renderTargetsEnabled != undefined) {
              this.renderTargetsEnabled = optimization.renderTargetsEnabled;
          }
          else if (prevGrade && prevGrade.renderTargetsEnabled){
              this.renderTargetsEnabled = prevGrade.renderTargetsEnabled;
          }

          // particles enabled
          if (optimization.particlesEnabled != undefined) {
              this.particlesEnabled = optimization.particlesEnabled;
          }
          else if (prevGrade && prevGrade.particlesEnabled){
              this.particlesEnabled = prevGrade.particlesEnabled;
          }

          // shadow enabled
          if (optimization.shadowsEnabled != undefined) {
              this.shadowsEnabled = optimization.shadowsEnabled;
          }
          else if (prevGrade && prevGrade.shadowsEnabled){
              this.shadowsEnabled = prevGrade.shadowsEnabled;
          }

          // particles
          if (optimization.particles != undefined) {
              this.particles = optimization.particles;
          }
          else if (prevGrade && prevGrade.particles){
              this.particles = prevGrade.particles;
          }

          // shadow
          if (optimization.shadows != undefined) {
              this.shadows = optimization.shadows;
          }
          else if (prevGrade && prevGrade.shadows){
              this.shadows = prevGrade.shadows;
          }

          // render size
          if (optimization.renderSize != undefined) {
              this.renderSize = optimization.renderSize;
          }
          else if (prevGrade && prevGrade.renderSize){
              this.renderSize = prevGrade.renderSize;
          }

          // material
          if (optimization.materials != undefined) {
              this.materials = optimization.materials;
          }
          else if (prevGrade && prevGrade.materials){
              this.materials = prevGrade.materials;
          }

          // texture
          if (optimization.textures != undefined) {
              this.textures = optimization.textures;
          }
          else if (prevGrade && prevGrade.textures){
              this.textures = prevGrade.textures;
          }

          // user infos
          if (optimization.userInfos != undefined) {
              paramsUserInfos = this.userInfos = optimization.userInfos;
          }
          else if (prevGrade && prevGrade.userInfos){
              this.userInfos = prevGrade.userInfos;
          }




          /**
           * IS ON RIGHT SOFTWARE / HARDWARE
           */

          // look if grade need to be enabled
          var isEnable = (params: IParamsUserInfosGradeOptimization) : boolean => {
              var exceptions = params.exceptionsAllowed,
                  phoneAllowed = params.smartPhoneAllowed,
                  tabletAllowed = params.tabletAllowed,
                  noteBookAllowed = params.noteBookAllowed,
                  computerAllowed = params.computerAllowed,
                  tvAllowed = params.tvAllowed,
                  consoleAllowed = params.consoleAllowed,
                  exeptRegex : RegExp,
                  matches;

              // check if exception
              if (exceptions && exceptions.length > 0) {
                  var L = exceptions.length,
                      exeptI : string,
                      strRegex : string = '(';

                  for (let i = 0; i < L; i++) {
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

          }

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
      particles? : IParamsParticlesGradeOptimization;
      shadows? : IParamsShadowsGradeOptimization;
      renderSize? : IParamsRenderSizeGradeOptimization;
      materials? : IParamsMaterialsGradeOptimization;
      textures? : IParamsTexturesGradeOptimization;
      userInfos? : IParamsUserInfosGradeOptimization;
      camera? : IParamsCameraGradeOptimization;
  }

  // interface shadow grade parameter
  export interface IParamsShadowsGradeOptimization {
      sizeRatio? : number;
      maxSize? : number;
      minSize? : number;
  }

  // interface particule grade parameter
  export interface IParamsParticlesGradeOptimization {
      rateRatio : number;
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
      sizeRatio : number; // to keep ratio
      maxSize? : number; // max size
      minSize? : number;
  }

  // interface shadow grade parameter
  export interface IParamsUserInfosGradeOptimization {
      smartPhoneAllowed? : boolean;
      tabletAllowed? : boolean;
      noteBookAllowed? : boolean;
      computerAllowed? : boolean;
      consoleAllowed?: boolean;
      tvAllowed?: boolean;
      exceptionsAllowed? : Array<string>;
  }

  // interface camera grade parameter
  export interface IParamsCameraGradeOptimization {
      viewDistance : number; // TODO
  }

}
