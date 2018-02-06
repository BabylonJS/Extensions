window.onload=function() {

  /**
   * ADD ENGINE
   */

  // add engine
  var canvas = document.getElementById('canvas'),
      engine = new BABYLON.Engine(canvas, true);


  // disable babylon offline support
  engine.enableOfflineSupport = true;




  /**
   * CUSTOM SCENE
   */

  // scene
  var scene = new BABYLON.Scene(engine);

  // Environment Texture
  var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/environment.dds", scene);

  console.log(hdrTexture)


  //Adding a light
  var light = new BABYLON.DirectionalLight("spot", new BABYLON.Vector3(-1, -2, 1), scene);
  light.position = new BABYLON.Vector3(20, 40, -20);
  light.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
  light.intensity = 0.5;
  light.shadowMinZ = 10;
  light.shadowMaxZ = 60;

  var ambiant02 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(10, 10, 10), scene);
  ambiant02.diffuse = new BABYLON.Color3(0.7, 0.7, 1);
  ambiant02.intensity = 0.5;


  // shadow generator
  var shadowGenerator = new BABYLON.ShadowGenerator(512, light),
      shMap = shadowGenerator.getShadowMap();
  shadowGenerator.usePoissonSampling = true;

  shadowGenerator.forceBackFacesOnly = true;

  shadowGenerator.useKernelBlur = true;
  shadowGenerator.blurKernel = 32;
  shadowGenerator.blurBoxOffset = 1;
  shadowGenerator.blurScale = 1;


  //Adding an Arc Rotate Camera
  var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-135), BABYLON.Tools.ToRadians(45), 60, new BABYLON.Vector3(0, 4, 0), scene);
  camera.attachControl(canvas, false);



  /**
   * Add materials
   */

  // pbr material
  var plastic = new BABYLON.PBRMaterial("plastic", scene);
      plastic.reflectionTexture = hdrTexture;
      plastic.refractionTexture = hdrTexture;
      plastic.indexOfRefraction = 0.1;
      plastic.microSurface = 0.9;
      plastic.albedoColor = new BABYLON.Color3(0.5, 1, 1);
      plastic.reflectionColor = new BABYLON.Color3(0.5, 1, 1);


  var plastic2 = new BABYLON.PBRMaterial("plastic2", scene);
      plastic2.reflectionTexture = hdrTexture;
      plastic2.refractionTexture = hdrTexture;
      plastic2.indexOfRefraction = 0.2;
      plastic2.microSurface = 0.85;
      plastic2.albedoColor = new BABYLON.Color3(1, 1, 0.5);
      plastic2.reflectionColor = new BABYLON.Color3(1, 1, 0.5);


  var plastic3 = new BABYLON.PBRMaterial("plastic3", scene);
      plastic3.reflectionTexture = hdrTexture;
      plastic3.refractionTexture = hdrTexture;
      plastic3.indexOfRefraction = 0.4;
      plastic3.microSurface = 0.7;
      plastic3.albedoColor = new BABYLON.Color3(1, 0.5, 1);
      plastic3.reflectionColor = new BABYLON.Color3(1, 0.5, 1);




  var floorMat = new BABYLON.StandardMaterial("floorMat", scene);
      floorMat.diffuseTexture = new BABYLON.Texture("assets/floor.128.png", scene);
      floorMat.bumpTexture = new BABYLON.Texture("assets/floor_bump.128.png", scene);



  /**
   * Add meshes
   */

  // add ground
  var ground = BABYLON.Mesh.CreateGround("ground", 32, 32, 8, scene);

  // add mat01 to ground
  ground.material = floorMat;

  // add position to ground
  ground.position = new BABYLON.Vector3(0,0,0);


  // add meshes
  var sphere1 = BABYLON.Mesh.CreateSphere("sphere1", 16, 4, scene),
      sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 4, scene),
      sphere3 = BABYLON.Mesh.CreateSphere("sphere3", 16, 4, scene);

  // pos
  sphere1.position = new BABYLON.Vector3(10,3,0);
  sphere2.position = new BABYLON.Vector3(-10,3,0);
  sphere3.position = new BABYLON.Vector3(0,3,10);

  // mat
  sphere1.material = plastic;

  sphere2.material = plastic2;

  sphere3.material = plastic3;




  /**
   * Add particle
   */

  // Fountain object
  var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene),

  // Create a particle system
  particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

  fountain.position = new BABYLON.Vector3(0, 10, 0)
  // hide fountain
  fountain.isVisible = false;

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);

  // Where the particles come from
  particleSystem.emitter = fountain; // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(-32, -32, -32); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(32, 32, 32); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 3;

  // Emission rate
  particleSystem.emitRate = 3000;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -4, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-1, 2, 1);
  particleSystem.direction2 = new BABYLON.Vector3(1, 2, -1);

  // Speed
  particleSystem.minEmitPower = -5;
  particleSystem.maxEmitPower = 5;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();





  /**
   * Add postprocesses
   */

  var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, ground, 50, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
	godrays.exposure = 0.2;
	godrays.decay = 0.95;
	godrays.weight = 0.8;
	godrays.density = 0.5;

  new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, null, engine, false);





  /**
   * GradingSceneOptimizer
   */

  var GSO = new BABYLON.GradingSceneOptimizer(engine),

      minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

      lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

      standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard(),
          () => {
              // upGradingTask
              sphere2.isVisible = true;
              // console.log('>>> add sphere2')
          },
          () => {
              // downGradingTask
              sphere2.isVisible = false;
              // console.log('>>> remove sphere2')
          }),

      mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

      highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high(),
          () => {
              // upGradingTask
              sphere3.isVisible = true;
              // console.log('>>> add sphere3')
          },
          () => {
              // downGradingTask
              sphere3.isVisible = false;
              // console.log('>>> remove sphere3')
          }),

      ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


  // active occlusion culling ( for the futur with webGl 2.0)
  GSO.occlusionCullingEnabled = true; // TODO : FEATURE

  // try to minimize draw call of CPU ( for the futur )
  // based on view ditance in optimizations parameters
  GSO.minimizeDrawCall = true; // TODO : FEATURE







  /**
   * Add UI to inspect
   */
  var ul = document.createElement('ul'),
      style = document.createElement('style'),
      fragment = document.createDocumentFragment(), // "virtual" dom
      grades = GSO.grades;

  var addEvent = (li, grade) => {

      li.addEventListener('click', () => {
          GSO.updateSceneByGrade(scene, grade);
      });
  }

  var createLi = (text) => {
      var li = document.createElement('li');
          li.textContent = text;
      return li;
  }


  // add css rules
  var css = '#grades {z-index: 1;position: fixed;background-color: white;padding: 20px; top:60px; left:0; list-style: none;}#grades li {font-family: sans-serif;border-bottom: 1px solid black;padding: 10px 0 10px 0;cursor: pointer;}#grades li:hover {color: gray;}'
  style.innerText = css;
  document.getElementsByTagName('head')[0].appendChild(style);
  // add container
  ul.id = 'grades';
  fragment.appendChild(ul);

  // create auto li
  var li = createLi('auto');
  ul.appendChild(li);

  li.addEventListener('click', () => {
      GSO.start(scene);
  });

  // create grade li
  for (let i = 0; i < grades.length; i++) {
      var gradeI = grades[i];

      li = createLi(gradeI.name);

      addEvent(li, gradeI);
      ul.appendChild(li);

  }

  // add to dom
  //parentNode.appendChild(fragment);
  document.body.appendChild(fragment)





  /**
   * Add gltf + asynch load test
   */
  BABYLON.SceneLoader.Append("assets/busterDrone/", "busterDrone.gltf", scene, function (scene) {
    var emptyDrone = new BABYLON.Mesh("emptyDrone", scene)
    var drone = scene.getMeshByName('__root__');
    drone.parent = emptyDrone;
    emptyDrone.scaling = new BABYLON.Vector3(6,6,6);
    emptyDrone.position = new BABYLON.Vector3(0,6,-6);
    scene.getMeshByName('node_Scheibe_-6124').isVisible = false;




    /**
     * Apply shadows on all loaded
     */
    for (let i = 0; i < scene.meshes.length; i++) {
      var mesh = scene.meshes[i];
      if (mesh.name != 'ground') {
        shMap.renderList.push(mesh);
      }
      else {
        mesh.receiveShadows = true;
      }
      mesh.receiveShadows = true;
    }




    /**
     * RUN GSO after when loaded
     */

    GSO.run(scene, minGrade, () => {

      engine.runRenderLoop( () => {
          scene.render();
      });

      console.log(engine);
      console.log(scene);
      console.log(GSO);

    });

    // show inspector
    scene.debugLayer.show();



  });

}
