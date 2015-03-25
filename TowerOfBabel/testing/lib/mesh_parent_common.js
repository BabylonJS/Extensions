/**
 *  called by mesh_parent.html 
 */
var duration = 2500;
var nClones = 2;

var delayBetween = duration / (nClones + 1);  //1 for original
var initialInstance;
var kiddies;
var parenting = true;

function initialize(scene){
    materialsRootDir = "./TOB-out"; // edit when texture files in a different dir than html
    mesh_parent.initScene(scene, materialsRootDir); // construct scene
    
    //retrieve initial Instance of Gus made initScene; store kids; assign beforeRender with no delay
    initialInstance = scene.getMeshByID("Gus");
    kiddies = initialInstance.getChildren();
    assignPOV(initialInstance, 0);
    
    // add some clones with a delay to animation start
    for (var i = 1; i <= nClones; i++){
        var clone = TOWER_OF_BABEL.MeshFactory.instance("mesh_parent", "Gus", true);
        assignPOV(clone, -1 * delayBetween * i);    	
    }
    
    // change material of original 
    var material = new BABYLON.StandardMaterial("color for original", scene);
    material.ambientColor  = new BABYLON.Color3(0.6,0.1,0.1);
    material.diffuseColor  = new BABYLON.Color3(0.72,0,0);
    material.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
    material.emissiveColor = new BABYLON.Color3(0,0,0);
    material.specularPower = 50;
    material.alpha =  1;
    material.backFaceCulling = true;
    initialInstance.material = material;
    
}

function assignPOV(mesh, initialDelay){
	//                                 milli   , varied      , go 25 units forward           , over 1 full twirlClockwise & tiltRight
	var event  = [ new POV.MotionEvent(duration, initialDelay, new BABYLON.Vector3(0,  0, 25), new BABYLON.Vector3(0, 6.28, 6.28)) ];
	var series  = new POV.EventSeries(event, 1000);  // do 1000 loops
	var renderer = new POV.BeforeRenderer(mesh);
	renderer.queueEventSeries(series);
}
 
function pausePlay() {
	console.log("Requesting " + (POV.BeforeRenderer.isSystemPaused() ? "resume" : "pause"));
	// test system wide pause-play
	if (POV.BeforeRenderer.isSystemPaused()) POV.BeforeRenderer.resumeSystem();
   	else POV.BeforeRenderer.pauseSystem();
}
 
 function orphanConceive() {
	 parenting = !parenting;
     for (index = 0; index < kiddies.length; index++) {
         kiddies[index].parent = parenting ? initialInstance : null;
     }
  }
 
 function freshenShadows() {
	 mesh_parent.freshenShadowRenderLists(scene);
 }