import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/core/Helpers/sceneHelpers';

// Import debug layer only if debug build
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";


import { HtmlMeshRenderer } from './src/html-mesh-renderer';
import { HtmlMesh } from './src/html-mesh';

let engine;
let scene;

const createScene = () => {
    const canvas = document.querySelector('canvas');
    engine = new Engine(canvas, true);
    
    // This creates a basic Babylon Scene object (non-mesh)
    scene = new Scene(engine);
    scene.clearColor = new Color4(0,0,0,0);
    
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.radius = 20;

    // Some random shapes
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    var box = MeshBuilder.CreateBox("box", {size: 1}, scene);
    var bg = MeshBuilder.CreatePlane("bg", {width: 1, height: 1}, scene);

    // A disc we will use to test masking pointer events
    var disc = MeshBuilder.CreateDisc("disc", {radius: 0.5})

    bg.scaling.x = 12;
    bg.scaling.y = 16
    bg.position.z = 2

    sphere.position.x = 2;
    sphere.position.y = -1.5;
    sphere.position.z = 1.1;
    box.position.x = -3;
    box.position.z = -2;
    disc.position.x = -0.5;
    disc.position.y = -3.1;
    disc.position.z = -1.1;

    // Add action manager to box so it can receive pointer events
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(new ExecuteCodeAction(
            ActionManager.OnPointerOverTrigger, (ev) => {
                console.log("pointer over box");    
            }));
    
    // Add action manager to disc so it can receive pointer events
    disc.actionManager = new ActionManager(scene);
    disc.actionManager.registerAction(new ExecuteCodeAction(
            ActionManager.OnPointerOverTrigger, (ev) => {
                console.log("pointer over disc");    
            }));

    // Create the HtmlMeshRenderer
    const htmlMeshRenderer = new HtmlMeshRenderer(scene);

    // const htmlMeshDiv = new HtmlMesh(scene, "html-mesh-div");
    // const div = document.createElement('div');
    // div.style.width = '480px';
    // div.style.height = '360px';
    // div.style.backgroundColor = 'red';
    // htmlMeshDiv.setContent(div, 4, 3);

    // Shows how this can be used to include a PDF in your scene
    // const pdfUrl = 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf?v=1599831745689'
    // const htmlMeshPdf = new HtmlMesh(scene, "html-mesh-pdf");
    // const iframePdf = document.createElement('iframe');
    // iframePdf.src = pdfUrl;
    // iframePdf.width = '480px';
    // iframePdf.height = '360px';
    // htmlMeshPdf.setContent(iframePdf, 4, 3);
    // htmlMeshPdf.position.x = 4;
    // htmlMeshPdf.position.y = 4;

    //Shows how this can be used to include a website in your scene
    const siteUrl = 'https://www.babylonjs.com/';
    const htmlMeshSite = new HtmlMesh(scene, "html-mesh-site");
    const iframeSite = document.createElement('iframe');
    iframeSite.src = siteUrl;
    iframeSite.width = '480px';
    iframeSite.height = '360px';
    htmlMeshSite.setContent(iframeSite, 4, 3);
    
    // Shows how this can be used to include a YouTube video in your scene
    // const videoId = 'zELYw2qEUjI';
    // const videoUrl = [ 'https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1' ].join( '' );
    // const htmlMeshVideo = new HtmlMesh(scene, "html-mesh-video");
    // const iframeVideo = document.createElement('iframe');
    // iframeVideo.src = videoUrl;
    // iframeVideo.width = '480px';
    // iframeVideo.height = '360px';
    // htmlMeshVideo.setContent(iframeVideo, 4, 3);
    // htmlMeshVideo.position.x = 4;
    // htmlMeshVideo.position.y = -4;

    // log out scene for debugging
    console.log(scene);
};

const startRenderLoop = () => {
    engine.runRenderLoop(() => {
        scene.render();
    });
};

createScene();
startRenderLoop();
