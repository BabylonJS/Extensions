import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Helpers/sceneHelpers';

let _engine;
let _scene;

const createScene = () => {
    const canvas = document.querySelector('canvas');
    _engine = new Engine(canvas, true);
    
    // This creates a basic Babylon Scene object (non-mesh)
    _scene = new Scene(_engine);
    
    _scene.createDefaultCameraOrLight(true, true, true);

    // Some random shapes
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, _scene);
    var box = MeshBuilder.CreateBox("box", {size: 1}, _scene);
    var bg = MeshBuilder.CreatePlane("bg", {width: 1, height: 1}, _scene);
    bg.scaling.x = 12;
    bg.scaling.y = 16
    bg.position.z = 2

    sphere.position.x = 2;
    sphere.position.y = -1.5;
    sphere.position.z = 1;
    box.position.x = -3;
    box.position.z = -2;
};

const startRenderLoop = () => {
    _engine.runRenderLoop(() => {
        _scene.render();
    });
};

createScene();
startRenderLoop();
