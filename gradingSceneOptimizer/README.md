# Grading Scene Optimizer

The new gradingSceneOptimizer will replace the current sceneOptimizer.

## Description :
GradingSceneOptimizer allows you to create some grade with different render to optimize your scene and performance.
For example, with it, you will be able to set a render for specifics devices.
GradingSceneOptimizer is based on responsive and accessibility concept that's important for web.

## Purpose :
Get the best quality / performance for all devices.

## Quick use :

```javascript
/**
 * Create new GradingSceneOptimizer
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine),

    /**
     * Create new grade
     */
    minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

    lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

    standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard()),

    mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

    highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high()),

    ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


/**
 * Run GradingSceneOptimizer
 */
GSO.run(scene, minGrade, () => {

    // callback when ready
    engine.runRenderLoop( () => {
        scene.render();
    });

});
```

## Roadmap :

## Version :

alpha 0.0.1
