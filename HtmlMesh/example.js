import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Matrix } from '@babylonjs/core/Maths/math';
import { Viewport } from '@babylonjs/core/Maths/math.viewport';
import { Vector3 } from '@babylonjs/core';
import '@babylonjs/core/Helpers/sceneHelpers';

// Import debug layer only if debug build
// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";

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

    // A disc we will use to test masking pointer events.  Note this disc
    // will only be pickable if the pointer enters it without passing
    // over the html mesh, or if it is masked.
    var disc = MeshBuilder.CreateDisc("disc", {radius: 0.5})

    bg.scaling.x = 12;
    bg.scaling.y = 16
    bg.position.z = 2

    sphere.position.x = 1.5;
    sphere.position.y = -0.5;
    sphere.position.z = 1.1;
    box.position.x = -3;
    box.position.y = 1;
    box.position.z = -2;
    disc.position.x = 1.7;
    disc.position.y = -2.6;
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

    // Shows how this can be used to include html content, such
    // as a form, in your scene.  This can be used to create
    // richer UIs than can be created with the standard Babylon
    // UI control, albeit with the restriction that such UIs would
    // not display in native mobile apps or XR applications.
    const htmlMeshDiv = new HtmlMesh(scene, "html-mesh-div");
    const div = document.createElement('div');
    div.innerHTML = `
        <form style="padding: 10px; transform: scale(4); transform-origin: 0 0;">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required><br><br>
            
            <label for="country">Country:</label>
            <select id="country" name="country">
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
            </select><br><br>
            
            <label for="hobbies">Hobbies:</label><br>
            <input type="checkbox" id="hobby1" name="hobbies" value="Reading">
            <label for="hobby1">Reading</label><br>
            <input type="checkbox" id="hobby2" name="hobbies" value="Gaming">
            <label for="hobby2">Gaming</label><br>
            <input type="checkbox" id="hobby3" name="hobbies" value="Sports">
            <label for="hobby3">Sports</label><br><br>
        </form>
    `;
    div.style.backgroundColor = 'white';
    div.style.width = '480px';
    div.style.height = '360px';
    // Style the form
    
    htmlMeshDiv.setContent(div, 4, 3);
    htmlMeshDiv.position.x = -3;
    htmlMeshDiv.position.y = 2;

    // Shows how this can be used to include a PDF in your scene.  Note this is 
    // conceptual only.  Displaying a PDF like this works, but any links in the
    // PDF will navigate the current tab, which is probably not what you want.
    // There are other solutions out there such as PDF.js that may give you more
    // control, but ultimately proper display of PDFs is not within the scope of
    // this project.
    const pdfUrl = 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf#zoom=200?v=1599831745689'
    const htmlMeshPdf = new HtmlMesh(scene, "html-mesh-pdf");
    const iframePdf = document.createElement('iframe');
    iframePdf.src = pdfUrl;
    iframePdf.width = '480px';
    iframePdf.height = '360px';
    htmlMeshPdf.setContent(iframePdf, 4, 3);
    htmlMeshPdf.position.x = 3;
    htmlMeshPdf.position.y = 2;

    // Shows how this can be used to include a website in your scene
    const siteUrl = 'https://www.babylonjs.com/';
    const htmlMeshSite = new HtmlMesh(scene, "html-mesh-site");
    const iframeSite = document.createElement('iframe');
    iframeSite.src = siteUrl;
    iframeSite.width = '480px';
    iframeSite.height = '360px';
    htmlMeshSite.setContent(iframeSite, 4, 3);
    htmlMeshSite.position.x = -3;
    htmlMeshSite.position.y = -2;
    
    // Shows how this can be used to include a YouTube video in your scene
    const videoId = 'zELYw2qEUjI';
    const videoUrl = [ 'https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1' ].join( '' );
    const htmlMeshVideo = new HtmlMesh(scene, "html-mesh-video");
    const iframeVideo = document.createElement('iframe');
    iframeVideo.src = videoUrl;
    iframeVideo.width = '480px';
    iframeVideo.height = '360px';
    htmlMeshVideo.setContent(iframeVideo, 4, 3);
    htmlMeshVideo.position.x = 3;
    htmlMeshVideo.position.y = -2;

    // Shows an example of how you can mask pointer events for a mesh, in this example the disc
    // If you allow rotation, you'd have to use CSS transforms to align the mask with the disc
    // const mask = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // mask.style = `z-index: 1000; position: absolute; pointer-events: none;`;
    // mask.setAttribute('width', 100);
    // mask.setAttribute('height', 100);
    // const maskBounds = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // maskBounds.setAttribute('data-pointer-event-mask', true);
    // maskBounds.setAttribute('fill', "#FF0000");
    // maskBounds.setAttribute('fill-opacity', 0.5);
    // maskBounds.setAttribute('cx', 1);
    // maskBounds.setAttribute('cy', 1);
    // maskBounds.setAttribute('r', 1);
    // maskBounds.setAttribute('pointer-events', 'fill');
    // mask.appendChild(maskBounds);
    // document.body.appendChild(mask);

    // const world = Matrix.IdentityReadOnly;
    // let viewport = new Viewport(0, 0, 0, 0);
    // let maskCenter = new Vector3(); 
    // let maskTangent = new Vector3();
    
    // scene.onAfterRenderObservable.add(() => {
    //     // force a transformMatrix update if it is currenty zero
    //     if (scene.getTransformMatrix().m.every(v => v === 0)) {
    //         scene.updateTransformMatrix(true);
    //     }

    //     // Get the current viewport
    //     scene.activeCamera.viewport.toGlobalToRef(engine.getRenderWidth(), engine.getRenderHeight(), viewport);

    //     // Get disc bounds
    //     const meshBounds = disc.getBoundingInfo().boundingBox;

    //     // Get the projected center
    //     Vector3.ProjectToRef(
    //         meshBounds.centerWorld,
    //         world,
    //         scene.getTransformMatrix(),
    //         viewport,
    //         maskCenter
    //     );

    //     // Get a point tangent to the circle at min x
    //     maskTangent.copyFrom(maskCenter);
    //     maskTangent.x = meshBounds.minimumWorld.x;
    //     Vector3.ProjectToRef(
    //         maskTangent,
    //         world,
    //         scene.getTransformMatrix(),
    //         viewport,
    //         maskTangent
    //     );

    //     // Projected radius is just the difference between these two point x coords
    //     const maskRadius = Math.abs(maskCenter.x - maskTangent.x);

    //     mask.style.top = `${maskCenter.y - maskRadius}px`;
    //     mask.style.left = `${maskCenter.x - maskRadius}px`;
    //     maskBounds.setAttribute('cx', maskRadius);
    //     maskBounds.setAttribute('cy', maskRadius);
    //     maskBounds.setAttribute('r', maskRadius);
    // });

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
