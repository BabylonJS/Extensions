# Grading Scene Optimizer

The new gradingSceneOptimizer will replace the current sceneOptimizer.
Be careful, it's an alpha test version.

## Description :
GradingSceneOptimizer allows you to create some grade with different render to optimize your scene and performance.
For example, you will be able to set a render for specifics devices.
GradingSceneOptimizer is based on responsive and accessibility concept that's important for web.

## Purpose :
Get the best quality / performance for all devices.

## Quick example :

```javascript
/**
 * Create new GradingSceneOptimizer
 * 'engine' : BABYLON engine
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine),

    /**
     * Create new grade
     * 'minimum' : grade name
     * 'BABYLON.PresetGradeOptimization.minimum()' : optimization options
     */
    minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

    lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

    standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard()),

    mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

    highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high()),

    ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


/**
 * Run GradingSceneOptimizer
 * 'scene' : BABYLON scene
 * 'minGrade' : on which grade GradingSceneOptimizer start.
 * 'function' : callback when GradingSceneOptimizer is ready.
 */
GSO.run(scene, minGrade, function() {

    // callback when ready
    engine.runRenderLoop( function() {
        scene.render();
    });

});
```



## GradingSceneOptimizer class :

### properties :

```javascript
/**
    Create new GradingSceneOptimizer :
    1. BABYLON.engine
    2. FPS to reach
    3. duration for fps evaluation in ms
    4. active auto evaluation
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine, 48, 1000, true);

// Run again FPS evaluation every 30 seconds
GSO.autoRunInterval = 30000;

// FEATURE : Active occlusion culling to get more performance
GSO.occlusionCullingEnabled = true;

// FEATURE : Try to minimize the number of draw call of CPU to get more performance
//    * based on distance of view in optimizations parameters
//    * add a radius detection around the meshes (useful for big meshes)
//    * add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
//    
//    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
GSO.minimizeDrawCall = true;

```

### methods :

```javascript

/**
    Create new grade :
    1. grade name
    2. optimization parameters (here is a preset. see below to custom parameters);
    3. upgrading task
    4. downgrading task
 */
var ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra(),
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


/**
    add existing grade :
    1. grade

    (created with new BABYLON.Grade() and not with GSO.createGrade())
 */
GSO.addGrade(gradeCreatedBefore);


/**
    Update scene by grade :
    1. BABYLON.scene
    2. grade
    3. onSuccess

    (stop auto run and evaluation)
 */
GSO.updateSceneByGrade(scene, ultraGrade,
    function(){
      // on success
    });


/**
    Upgrade by one :
    1. BABYLON.scene
    2. onSuccess

    (stop auto run and evaluation)
 */
GSO.upgrade(scene,
    function(){
      // on success
    });


/**
    Downgrade by one :
    1. BABYLON.scene
    2. onSuccess

    (stop auto run and evaluation)
 */
GSO.downgrade(scene,
    function(){
      // on success
    });


// stop auto run and evaluation
GSO.stopAutoEval();


/**
    start auto run and evaluation :
    1. BABYLON.scene
    2. onSuccess
 */
GSO.startAutoEval(scene,
    function(){
      // on success
    });

```







## Grades class :

### Create grade :
```javascript

/**
    Create new grade :
    1. grade name
    2. optimization parameters (here is a preset. see below to custom parameters);
    3. upgrading task
    4. downgrading task

    (Don't forget to add it to GSO with GSO.addGrade())
 */
var ultraGrade = new BABYLON.Grade('ultra', BABYLON.PresetGradeOptimization.ultra(),
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


```

### Custom optimization parameters :

```javascript

// Custom grade optimization parameters :
var customOptimization = {

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
    camera : {
      viewDistance : 200 // FEATURE
    }
    devices : {
        smartPhoneAllowed : false,
        tabletAllowed : false,
        noteBookAllowed : false,
        computerAllowed : true,
        exceptionsList : ['xbox'],
        onlyDedicatedGPU : true,
        benchmarkScore : 10000 // FEATURE
    }

};

// Create new grade :
var ultraGrade = new BABYLON.Grade('ultra', customOptimization,
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


```

### Custom optimization explanation :



## Roadmap :

## Version :

alpha 0.0.1
