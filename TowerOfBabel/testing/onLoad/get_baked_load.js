var frameCount;
var startTime;

function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    
    var canvas = document.getElementById("renderCanvas");
    canvas.screencanvas = true; // for CocoonJS
    var engine = new BABYLON.Engine(canvas, true);

    var scene = new BABYLON.Scene(engine);
        
    get_baked.initScene(scene, "./TOB-out/");

    // get the render list for the Mirror
    var gus = scene.getMeshByID("Gus");
    var renderList = gus.getChildren();
    renderList.push(gus);

    var mirrorMaterial = new BABYLON.StandardMaterial("mirrorMat", scene);
    mirrorMaterial.diffuseColor  = new BABYLON.Color3(0.1,0.1,0.1);
    mirrorMaterial.emissiveColor = new BABYLON.Color3(0.1,0.1,0.1);

    mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirrorTex", 4096, scene, true);
    mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0,0,-1,-6);
    mirrorMaterial.reflectionTexture.renderList = renderList;
    if (scene.getMeshByID("Mirror") !== null)
    scene.getMeshByID("Mirror").material = mirrorMaterial;

    frameCount = 0;
    startTime = BABYLON.Tools.Now;
    	
    scene.activeCamera.attachControl(canvas);
        engine.runRenderLoop(function () {
            scene.render();
            frameCount++;
    });
}
// this is an XDK event; when not using XDK, place in <body onload="onAppReady()">
document.addEventListener("app.Ready", onAppReady, false) ;

// in order for logging to work in XDK, change "dev.LOG" in "init-dev.js" to "true"
function logPerformance(description) {
    var totalWallClock = BABYLON.Tools.Now - startTime;
    var fps = (frameCount / (totalWallClock / 1000)).toFixed(2);
    BABYLON.Tools.Log(description + " was performed @ " + fps + " fps");

    // reset for the next activity
    frameCount = 0;
    startTime = BABYLON.Tools.Now;
}
