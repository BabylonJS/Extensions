window.onload=function() {

  // GLOBAL VARIABLE
  var particuleSystem,
      colorPostProcess;





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
  var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-135), BABYLON.Tools.ToRadians(65), 60, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, false);

  // add ground
  var ground = BABYLON.Mesh.CreateGround("ground", 24, 24, 8, scene),
      groundMat = new BABYLON.StandardMaterial("matGround", scene);

  // add mat01 to ground
  ground.material = groundMat;

  // add position to ground
  ground.position = new BABYLON.Vector3(0,0,0);

  // active recieve shadows
  ground.receiveShadows = true;

  // load assets
  BABYLON.SceneLoader.Append('assets/', 'simpleScene.babylon', scene, () => {
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
  });
  groundMat.diffuseTexture = new BABYLON.Texture("assets/floor.png", scene);
  groundMat.bumpTexture = new BABYLON.Texture("assets/floor_bump.png", scene);


  scene.executeWhenReady( () => {


    // Fountain object
    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene),

    // Create a particle system
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    // hide fountain
    fountain.isVisible = false;

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = fountain; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

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
    particleSystem.gravity = new BABYLON.Vector3(0, -8, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-1, 2, 1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 2, -1);

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 10;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();


    var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, ground, 50, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
  	godrays.exposure = 0.1;
  	godrays.decay = 0.95;
  	godrays.weight = 0.4;
  	godrays.density = 0.3;

    new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, null, engine, false);

  })





  /**
   * GradingSceneOptimizer
   */

  var GSO = new BABYLON.GradingSceneOptimizer(),

      minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

      lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

      standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard()),

      mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

      highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high()),

      ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


  // active occlusion culling ( for the futur with webGl 2.0)
  GSO.occlusionCullingEnabled = true; // TODO

  // try to minimize draw call of CPU ( for the futur )
  // based on view ditance in optimizations parameters
  GSO.minimizeDrawCall = true; // TODO




  /**
   * UI
   */
  var uiGrades = document.getElementById('grades'),
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

  // create auto li
  var li = createLi('auto');
  uiGrades.appendChild(li);

  li.addEventListener('click', () => {
    GSO.hardwareEval(engine, scene);
  });

  // create grade li
  for (let i = 0; i < grades.length; i++) {
    var gradeI = grades[i];

    li = createLi(gradeI.name);

    addEvent(li, gradeI);
    uiGrades.appendChild(li);
  }



  // show inspector
  scene.debugLayer.show();


  // run GradingSceneOptimizer
  GSO.run(engine, scene, standardGrade, () => {

    engine.runRenderLoop( () => {
        scene.render();
    });

    console.log(GSO);

  });

}
