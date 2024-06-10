import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { ExecuteCodeAction } from "@babylonjs/core/Actions/directActions";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Helpers/sceneHelpers";

import { HtmlMeshRenderer } from "./src/html-mesh-renderer";
import { HtmlMesh } from "./src/html-mesh";

import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { FitStrategy } from "./src/fit-strategy";

const debug = true;

let engine;
let scene;


const createRotatedScreen = (name, content, rotation, position) => {
    const screen = new HtmlMesh(scene, name, { isCanvasOverlay: true, fitStrategy: FitStrategy.COVER });
    const screenDiv = document.createElement('div');
    screenDiv.innerHTML = content;
    screenDiv.style.backgroundColor = 'rgba(25,0,255,0.49)';
    screenDiv.style.width = '400px';
    screenDiv.style.display = 'flex';
    screenDiv.style.alignItems = 'center';
    screenDiv.style.justifyContent = 'center';
    screenDiv.style.padding = '10px';
    screenDiv.style.fontSize = '300px';
    
    screen.setContent(screenDiv, 2, 2);
    screen.position = position;
    screen.rotation = rotation;
}

const createBillboardScreen = (name, content, billboardMode, position) => {
    const screen = new HtmlMesh(scene, name, { isCanvasOverlay: true, fitStrategy: FitStrategy.COVER });
    const screenDiv = document.createElement('div');
    screenDiv.innerHTML = content;
    screenDiv.style.backgroundColor = 'rgba(25,0,255,0.49)';
    screenDiv.style.width = '400px';
    screenDiv.style.display = 'flex';
    screenDiv.style.alignItems = 'center';
    screenDiv.style.justifyContent = 'center';
    screenDiv.style.padding = '10px';
    screenDiv.style.fontSize = '300px';
    
    screen.setContent(screenDiv, 2, 2);
    screen.position = position;
    screen.billboardMode = billboardMode;
}

// Creating a scene to verify right handed system works well. See #293 for more information
const createScene = () => {
    const canvas = document.querySelector("canvas");
    engine = new Engine(canvas, true);
    
    // This creates a basic Babylon Scene object (non-mesh)
    scene = new Scene(engine);
    scene.useRightHandedSystem = true;
    scene.clearColor = new Color4(0,0,0,0);
    
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.radius = 23;

    // Uncomment these lines to test issue #261
    // const camera = new ArcRotateCamera('', -Math.PI / 3, Math.PI / 2.5, 20, Vector3.Zero(), scene)
    // camera.attachControl(true)
    // new HemisphericLight('', new Vector3(100, 100, 100), scene)

    // Some random shapes
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    var box = MeshBuilder.CreateBox("box", {size: 1}, scene);
    var bg = MeshBuilder.CreatePlane("bg", {width: 1, height: 1}, scene);

    // A disc we will use to test masking pointer events.  Note this disc
    // will only be pickable if the pointer enters it without passing
    // over the html mesh, or if it is masked.
    var disc = MeshBuilder.CreateDisc("disc", {radius: 0.5});

    bg.scaling.x = 16;
    bg.scaling.y = 20;
    bg.position.z = 3;

    sphere.position.x = -1.5;
    sphere.position.y = -0.5;
    sphere.position.z = 1.1;
    box.position.x = 3;
    box.position.y = 1;
    box.position.z = -2;
    disc.position.x = -1.7;
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
    const div = document.createElement("div");
    div.innerHTML = `
        <form style="padding: 10px; transform-origin: 0 0; scale: 5">
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
    div.style.backgroundColor = "white";
    div.style.width = "480px";
    div.style.height = "360px";

    htmlMeshDiv.setContent(div, 4, 3);
    htmlMeshDiv.position.x = 3;
    htmlMeshDiv.position.y = 2;
    htmlMeshDiv.rotation = new Vector3(Math.PI / 4, -Math.PI / 4, -Math.PI / 4);

    // Shows how this can be used to include a PDF in your scene.  Note this is
    // conceptual only.  Displaying a PDF like this works, but any links in the
    // PDF will navigate the current tab, which is probably not what you want.
    // There are other solutions out there such as PDF.js that may give you more
    // control, but ultimately proper display of PDFs is not within the scope of
    // this project.
    const pdfUrl = "https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf#zoom=200?v=1599831745689";
    const htmlMeshPdf = new HtmlMesh(scene, "html-mesh-pdf");
    const iframePdf = document.createElement("iframe");
    iframePdf.src = pdfUrl;
    iframePdf.width = "480px";
    iframePdf.height = "360px";
    htmlMeshPdf.setContent(iframePdf, 4, 3);
    htmlMeshPdf.position.x = -3;
    htmlMeshPdf.position.y = 2;
    htmlMeshPdf.position.z = 2;

    // Shows how this can be used to include a website in your scene
    // Becuase the rotation on the mesh introduces a significant difference
    // between the world min and max z values, which result in the
    // element being too large, we wrap the iframe in a div with padding and
    // make the iframe a percentage of the div size.  This ensures that the
    // entire iframe is accessible.
    const outerDivSite = document.createElement("div");
    outerDivSite.style.width = "480px";
    outerDivSite.style.height = "360px";
    outerDivSite.style.backgroundColor = "black";
    outerDivSite.style.padding = "10px";
    const siteUrl = "https://www.babylonjs.com/";
    const htmlMeshSite = new HtmlMesh(scene, "html-mesh-site");
    const iframeSite = document.createElement("iframe");
    iframeSite.src = siteUrl;
    iframeSite.width = "98.5%";
    iframeSite.height = "99%";
    outerDivSite.appendChild(iframeSite);
    htmlMeshSite.setContent(outerDivSite, 4, 3);
    htmlMeshSite.position.x = 3;
    htmlMeshSite.position.y = -2;
    // TODO not working since rotation is hard set in html mesh renderer
    htmlMeshSite.rotation.y = -Math.PI / 4;

    // Shows how this can be used to include a YouTube video in your scene
    const videoId = "zELYw2qEUjI";
    const videoUrl = [ "https://www.youtube.com/embed/", videoId, "?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1" ].join( "" );
    const htmlMeshVideo = new HtmlMesh(scene, "html-mesh-video");
    const iframeVideo = document.createElement("iframe");
    iframeVideo.src = videoUrl;
    iframeVideo.width = "480px";
    iframeVideo.height = "360px";
    htmlMeshVideo.setContent(iframeVideo, 4, 3);
    htmlMeshVideo.position.x = -3;
    htmlMeshVideo.position.y = -2;
    htmlMeshVideo.rotation.x = Math.PI / 4;

    // Uncomment this line to test issue #268 (Delayed creation issue)
    //setTimeout(() => {
    // Shows how to create an HTML Overlay
    const overlayMesh = new HtmlMesh(scene, "html-overlay-mesh", { isCanvasOverlay: true });
    const overlayMeshDiv = document.createElement('div');
    overlayMeshDiv.innerHTML = `<p style="padding: 60px; font-size: 120px;">This is an overlay. It is positioned in front of the canvas This allows it to have transparency and to be non-rectangular, but it will always show over any other content in the scene</p>`;
    overlayMeshDiv.style.backgroundColor = 'rgba(0,255,0,0.49)';
    overlayMeshDiv.style.width = '120px';
    overlayMeshDiv.style.height = '90px';
    overlayMeshDiv.style.display = 'flex';
    overlayMeshDiv.style.alignItems = 'center';
    overlayMeshDiv.style.justifyContent = 'center';
    overlayMeshDiv.style.borderRadius = '20px';
    overlayMeshDiv.style.padding = '10px';

    overlayMesh.setContent(overlayMeshDiv, 4, 3);
    overlayMesh.position.x = 0;
    overlayMesh.position.y = 0;
    // Uncomment this line to test issue #268 (Delayed creation issue)
    //}, 3000);

    // overlayMesh fit contain
    const overlayContainMesh = new HtmlMesh(scene, "html-overlay-mesh-contain",{ isCanvasOverlay: true, fitStrategy: FitStrategy.CONTAIN });
    const overlayContainMeshDiv = document.createElement('div');
    overlayContainMeshDiv.innerHTML = `Contain: This is an overlay. It is positioned in front of the canvas This allows it to have transparency and to be non-rectangular, but it will always show over any other content in the scene`;
    overlayContainMeshDiv.style.width = '200px';
    overlayContainMeshDiv.style.display = 'flex';
    overlayContainMeshDiv.style.alignItems = 'center';
    overlayContainMeshDiv.style.justifyContent = 'center';
    overlayContainMeshDiv.style.padding = '10px';
    overlayContainMeshDiv.style.backgroundColor = 'rgba(25,0,255,0.49)';

    overlayContainMesh.setContent(overlayContainMeshDiv, 4, 3);
    overlayContainMesh.position.x = 0;
    overlayContainMesh.position.y = 3.5;
    overlayContainMesh.billboardMode = 7;

    // overlayMesh fit cover
    const overlayCoverMesh = new HtmlMesh(scene, "html-overlay-mesh-cover", { isCanvasOverlay: true, fitStrategy: FitStrategy.COVER });
    const overlayCoverMeshDiv = document.createElement('div');
    overlayCoverMeshDiv.innerHTML = `Cover: This is an overlay. It is positioned in front of the canvas This allows it to have transparency and to be non-rectangular, but it will always show over any other content in the scene`;
    overlayCoverMeshDiv.style.backgroundColor = 'rgba(25,0,255,0.49)';
    overlayCoverMeshDiv.style.width = '150px';
    overlayCoverMeshDiv.style.display = 'flex';
    overlayCoverMeshDiv.style.alignItems = 'center';
    overlayCoverMeshDiv.style.justifyContent = 'center';
    overlayCoverMeshDiv.style.padding = '10px';
    overlayCoverMeshDiv.style.overflow = 'hidden';

    overlayCoverMesh.setContent(overlayCoverMeshDiv, 4, 3);
    overlayCoverMesh.position.x = 2;
    overlayCoverMesh.position.y = 7;
    overlayCoverMesh.billboardMode = 7;

    // https://github.com/BabylonJS/Extensions/pull/270

    // overlayMesh fit stretch
    const overlayStretchMesh = new HtmlMesh(scene, "html-overlay-mesh-stretch", { isCanvasOverlay: true, fitStrategy: FitStrategy.STRETCH });
    const overlayStretchMeshDiv = document.createElement('div');
    overlayStretchMeshDiv.innerHTML = `Stretch: This is an overlay. It is positioned in front of the canvas This allows it to have transparency and to be non-rectangular, but it will always show over any other content in the scene`;
    overlayStretchMeshDiv.style.backgroundColor = 'rgba(25,0,255,0.49)';
    overlayStretchMeshDiv.style.width = '400px';
    overlayStretchMeshDiv.style.display = 'flex';
    overlayStretchMeshDiv.style.alignItems = 'center';
    overlayStretchMeshDiv.style.justifyContent = 'center';
    overlayStretchMeshDiv.style.padding = '10px';

    overlayStretchMesh.setContent(overlayStretchMeshDiv, 4, 3);
    overlayStretchMesh.position.x = -2.5;
    overlayStretchMesh.position.y = 7;
    overlayStretchMesh.billboardMode = 7;

    // Billboard tests
    createBillboardScreen("html-billboard-0", "0", 0, new Vector3(-6, 7, 0));
    createBillboardScreen("html-billboard-1", "1", 1, new Vector3(-9, 7, 0));
    createBillboardScreen("html-billboard-2", "2", 2, new Vector3(-6, 5, 0));
    createBillboardScreen("html-billboard-4", "4", 4, new Vector3(-9, 5, 0));
    createBillboardScreen("html-billboard-7", "7", 7, new Vector3(-6, 3, 0));

    createRotatedScreen("html-rotate-x", "x", new Vector3(Math.PI, 0, 0), new Vector3(6, 7, 0));
    createRotatedScreen("html-rotate-y", "y", new Vector3(0, Math.PI, 0), new Vector3(9, 7, 0));
    createRotatedScreen("html-rotate-z", "z", new Vector3(0, 0, Math.PI), new Vector3(6, 5, 0));
    createRotatedScreen("html-rotate-xy", "xy", new Vector3(Math.PI, Math.PI, 0), new Vector3(9, 5, 0));
    createRotatedScreen("html-rotate-xz", "xz", new Vector3(Math.PI, 0, Math.PI), new Vector3(6, 3, 0));
    createRotatedScreen("html-rotate-yz", "yz", new Vector3(0, Math.PI, Math.PI), new Vector3(9, 5, 0));

    // Uncomment this line to test issue #264
    //MeshBuilder.CreateBox("box2", {size: 1}, scene);

    if (debug) {
        // Log the scene to the console for debugging
        console.log("scene", scene);
    }
};

const startRenderLoop = () => {
    engine.runRenderLoop(() => {
        scene.render();
    });
};

createScene();
startRenderLoop();
