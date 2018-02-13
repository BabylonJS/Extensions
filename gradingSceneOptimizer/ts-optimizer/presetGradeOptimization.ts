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
                  refractionTextureEnabled : false,
                  bumpTextureEnabled : false,
                  fresnelEnabled : false
              },
              renderSize : {
                  maxWidth : 1280,
                  maxHeight : 1280,
                  hardwareScaling : 1.5
              },
              devices : {
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
                  scale : 0.5,
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
              devices : {
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
                  scale : 0.5,
                  maxSize : 512,
                  minSize : 256
              },
              materials : {
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : false
              },
              shadows : {
                  size : 256
              },
              renderSize : {
                  maxWidth : 1600,
                  maxHeight : 1600,
                  hardwareScaling : 1
              },
              devices : {
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
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  size : 512
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 1
              },
              devices : {
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
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  size : 1024
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 1
              },
              devices : {
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
                  refractionTextureEnabled : true,
                  bumpTextureEnabled : true,
                  fresnelEnabled : true
              },
              shadows : {
                  size : 2048
              },
              renderSize : {
                  maxWidth : 1920,
                  maxHeight : 1920,
                  hardwareScaling : 0.5
              },
              devices : {
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
