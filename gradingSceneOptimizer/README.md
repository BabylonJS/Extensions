# Grading Scene Optimizer

The new gradingSceneOptimizer will replace the current sceneOptimizer.

## How to use :

```
// create new GradingSceneOptimizer
var GSO = new BABYLON.GradingSceneOptimizer(engine),

    minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

    lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

    standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard()),

    mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

    highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high()),

    ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


// run GradingSceneOptimizer
GSO.run(scene, minGrade, () => {

  // callback when ready
  engine.runRenderLoop( () => {
      scene.render();
  });

});
```

## Version :

alpha 0.0.1

```
Give examples
```
