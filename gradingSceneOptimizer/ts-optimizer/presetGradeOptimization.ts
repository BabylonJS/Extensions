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
                  sizeRatio : 0.5,
                  maxSize : 256,
                  minSize : 128
              },
              materials : {
                  refractionTextureEnabled : false,
                  bumpTextureEnabled : false,
                  fresnelEnabled : false
              },
              renderSize : {
                  maxWidth : 1280,
                  maxHeight : 1280,
                  hardwareScaling : 1.5
              },
              userInfos : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : false,
                  exceptionsAllowed : []
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
                  sizeRatio : 0.5,
                  maxSize : 512,
                  minSize : 128
              },
              materials : {
                  refractionTextureEnabled : false,
                  bumpTextureEnabled : true,
                  fresnelEnabled : false
              },
              renderSize : {
                  maxWidth : 1440,
                  maxHeight : 1440,
                  hardwareScaling : 1
              },
              userInfos : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsAllowed : []
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
                  sizeRatio : 0.5,
                  maxSize : 512,
                  minSize : 256
              },
              materials : {
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : false
              },
              shadows : {
                  sizeRatio : 1,
                  minSize : 128,
                  maxSize : 512
              },
              renderSize : {
                  maxWidth : 1600,
                  maxHeight : 1600,
                  hardwareScaling : 1
              },
              userInfos : {
                  smartPhoneAllowed : true,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsAllowed : []
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
                  sizeRatio : 0.75,
                  maxSize : 1024,
                  minSize : 256
              },
              particles : {
                  rateRatio : 1,
                  maxEmitRate : 300,
                  minEmitRate : 1
              },
              materials : {
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  sizeRatio : 2,
                  minSize : 128,
                  maxSize : 1024
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 1
              },
              userInfos : {
                  smartPhoneAllowed : false,
                  tabletAllowed : true,
                  noteBookAllowed : true,
                  computerAllowed : true,
                  exceptionsAllowed : []
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
                  sizeRatio : 1,
                  maxSize : 1024,
                  minSize : 512
              },
              particles : {
                  rateRatio : 2,
                  maxEmitRate : 5000,
                  minEmitRate : 1
              },
              materials : {
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  sizeRatio : 3,
                  minSize : 128,
                  maxSize : 1024
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 1
              },
              userInfos : {
                  smartPhoneAllowed : false,
                  tabletAllowed : false,
                  noteBookAllowed : false,
                  computerAllowed : true,
                  exceptionsAllowed : []
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
                  sizeRatio : 1,
                  maxSize : 2048,
                  minSize : 512
              },
              particles : {
                  rateRatio : 3,
                  maxEmitRate : 10000,
                  minEmitRate : 1
              },
              materials : {
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  sizeRatio : 3,
                  minSize : 128,
                  maxSize : 2048
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 0.5
              },
              userInfos : {
                  smartPhoneAllowed : false,
                  tabletAllowed : false,
                  noteBookAllowed : false,
                  computerAllowed : true,
                  exceptionsAllowed : []
              }
          };
      }

    }
}
