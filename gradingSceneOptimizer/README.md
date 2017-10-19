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
 * 'minGrade' : on which grade renderGradingSceneOptimizer start.
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
    Create new GradingSceneOptimizer
    1. engine : BABYLON.engine
    2. 48 : FPS to reach
    3. 1000 : duration for fps evaluation in ms
    4. true : active auto evaluation
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine, 48, 1000, true);

// Run again every 30 seconds
GSO.autoRunInterval = 30000;

// FEATURE : Active occlusion culling to get more performance
GSO.occlusionCullingEnabled = true;

// FEATURE : Try to minimize the number of draw call to get more performance
GSO.minimizeDrawCall = true;

```

### methods :









## Grades class :


## Roadmap :

## Version :

alpha 0.0.1
