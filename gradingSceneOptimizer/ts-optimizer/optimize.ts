module BABYLON {


  /*************************
   * OPTIMISATION FUNCTION
   ************************/

  // Optimize :
  export class Optimize {

      // for materials
      public static materials(scene : Scene, params: IParamsMaterialsGradeOptimization) {

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

          var shadowsType = [
                  'usePoissonSampling',
                  'useExponentialShadowMap',
                  'useBlurExponentialShadowMap',
                  'useCloseExponentialShadowMap',
                  'useBlurCloseExponentialShadowMap'
              ],
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
                          'ColorGradingTexture',
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
              else if (texture.onLoadObservable){
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


}
