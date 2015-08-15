/**
 *  called by shape_key.html
 */
var cloths = [];
var Xs = [0, -7, +7, -14, +14, 0, -7, +7, -14, +14, 0, -7, +7, -14, +14, 0, -7, +7, -14, +14, 0, -7, +7, -14, +14];
var Zs = [0, -7, +7, -14, +14];
var signs = [];
var isAnimating = false;


// a custom non-linear Pace   completionRatios    durationRatios
var hiccup = new POV.Pace([.1, .8, .6, 1.0],[.25, .6, .8, 1.0]);

/* this assumes that the dialog system has already been initialized */
function prepCloth(cloth, scene){
	if (!cloth) {
		cloth = new shape_key.Cloth("Cloth", scene);
		var n = cloths.length;
		
		// a little confusing, since camara is facing from right, so x looks like z
		cloth.position.x = Xs[n];
		cloth.position.z = Zs[Math.floor(n / 5)];
		cloth.originalPos = cloth.position.clone();
		cloth.originalRot = cloth.rotation.clone();
		
	}else{
		cloth.originalPos = cloth.position.clone();
		cloth.originalRot = cloth.rotation.clone();		
		
		// want emissive color, so does not change under lighting, backface culling off for woosh
        var alwaysWhite = new BABYLON.StandardMaterial("alwaysWhite", scene);
        alwaysWhite.checkReadyOnlyOnce = true;
        alwaysWhite.emissiveColor  = new BABYLON.Color3(1,1,1);
        alwaysWhite.backFaceCulling = false;
		
		var stretch = new DIALOG.Label("Stretching","Font2D", alwaysWhite);
		stretch.layout();
		stretch.unfreezeWorldMatrixTree();
		stretch.position.y = cloth.position.y + 3; 
		stretch.rotation.y = -3.14 / 2;
		stretch.setEnabled(false);
		signs.push(stretch);
		
		var hFlap = new DIALOG.Label("Hard Flapping","Font2D", alwaysWhite);
		hFlap.layout();
		hFlap.unfreezeWorldMatrixTree();
		// also need set this here, so no gap in display of captions
		hFlap.position.x = cloth.position.x;
		hFlap.position.y = cloth.position.y + 3;
		hFlap.position.z = cloth.position.z;
		hFlap.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					hFlap.position.x = cloth.position.x;
					hFlap.position.y = cloth.position.y + 3;
					hFlap.position.z = cloth.position.z;
				}
		);
		hFlap.setEnabled(false);
		signs.push(hFlap);
		
		var offAway = new DIALOG.Label("Off & Away","Font2D", alwaysWhite);
		offAway.layout();
		offAway.unfreezeWorldMatrixTree();
		offAway.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					offAway.position.x = cloth.position.x;
					offAway.position.y = cloth.position.y + 3;
					offAway.position.z = cloth.position.z;
				}
		);
		offAway.setEnabled(false);
		signs.push(offAway);
		
		var bRight = new DIALOG.Label("Banking Right","Font2D", alwaysWhite).setSubsFaceSize(1.25);
		bRight.layout();
		bRight.unfreezeWorldMatrixTree();
		bRight.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					bRight.position.x = cloth.position.x;
					bRight.position.y = cloth.position.y + 4;
					bRight.position.z = cloth.position.z;
				}
		);
		bRight.setEnabled(false);
		signs.push(bRight);
		
		var bStretch = new DIALOG.Label("In the Back Stretch","Font2D", alwaysWhite).setSubsFaceSize(2.0);
		bStretch.layout();
		bStretch.unfreezeWorldMatrixTree();
		bStretch.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					bStretch.position.x = cloth.position.x;
					bStretch.position.y = cloth.position.y + 5;
					bStretch.position.z = cloth.position.z;
				}
		);
		bStretch.setEnabled(false);
		signs.push(bStretch);
		
		var rTurn = new DIALOG.Label("Turning Right","Font2D", alwaysWhite).setSubsFaceSize(2.0);
		rTurn.layout();
		rTurn.unfreezeWorldMatrixTree();
		rTurn.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					rTurn.position.x = cloth.position.x;
					rTurn.position.y = cloth.position.y + 5;
					rTurn.position.z = cloth.position.z;
				}
		);
		rTurn.setEnabled(false);
		signs.push(rTurn);
		
		var tilt = new DIALOG.Label("Tilt to Horizontal","Font2D", alwaysWhite).setSubsFaceSize(1.5);
		tilt.layout();
		tilt.unfreezeWorldMatrixTree();
		tilt.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					tilt.position.x = cloth.position.x;
					tilt.position.y = cloth.position.y + 5;
					tilt.position.z = cloth.position.z;
				}
		);
		tilt.setEnabled(false);
		signs.push(tilt);
		
		var woosh = new DIALOG.Label("Woosh!","Font2D", alwaysWhite);
		woosh.layout();
		woosh.unfreezeWorldMatrixTree();
		woosh.rotation.y = -3.14 / 2;
		cloth.registerAfterWorldMatrixUpdate(
				function(){
					woosh.position.x = cloth.position.x;
					woosh.position.y = cloth.position.y + 3;
					woosh.position.z = cloth.position.z;
				}
		);
		woosh.setEnabled(false);
		signs.push(woosh);
	}
	
	cloths.push(cloth);
	console.log("cloth added at " + cloth.position.toString());

	var entireGrp = cloth.getShapeKeyGroup("ENTIRE MESH");
	entireGrp.mirrorAxisOnY(); // mirror on Y, so wings flapping up past horizontal created, using negative end state ratios 
	
 	entireGrp.addDerivedKey("BASIS", "DRAPED", -0.2);	
   	entireGrp.addDerivedKey("BASIS", "DRAPED", -0.1);	
   	entireGrp.addDerivedKey("BASIS", "DRAPED",  0.1);
   	entireGrp.addDerivedKey("BASIS", "DRAPED",  0.3);
   	entireGrp.addDerivedKey("BASIS", "DRAPED",  0.9);
}

function queueAnimation(numNeeded, scene, button){
	isAnimating = true;
	if (cloths.length < numNeeded){
		for (var i = cloths.length; i < numNeeded; i++){
			prepCloth(null, scene);			
		}
	}else if (cloths.length > numNeeded){
		for(var i = cloths.length - 1; i >= numNeeded; i--){
			cloths[i].dispose();
		}
		cloths.splice(numNeeded, cloths.length - numNeeded);
	}
	// queue all of the cloths
	for (var i = 0; i < cloths.length; i++){
		stretchSeries(cloths[i], i === 0);
	}
	for (var i = 0; i < cloths.length; i++){
		hardFlapSeries(cloths[i], i === 0);
		awaySeries(cloths[i], i === 0);
		bankRightSeries(cloths[i], i === 0);
		backStretchSeries(cloths[i], i === 0);
		turnRightSeries(cloths[i], i === 0);
		tiltToHorizSeries(cloths[i], i === 0);
		wooshSeries(cloths[i], i === 0);
		resetSeries(cloths[i], i === 0, button);
	}
}

function stretchSeries(cloth, isFirst){
	 var stretch     = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  900, 500,   0.9), 
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED", 1500,   0,  -0.1, null, null, hiccup) 
	                   ];//  illustrates the millisBefore parameter & the non-linear pace
	 if (isFirst){
		 stretch.splice(0, 0, function(){signs[0].setEnabled(true);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(stretch   , 2) ); // 2 repeats
};

function hardFlapSeries(cloth, isFirst){
	 var hardFlap    = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  800,   0,   0.1),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  300,   0,  -0.2, new BABYLON.Vector3( 0,   2,  0))  
	                   ];// when your horizontal, up is really up; not all deformations need the same movePOV
	 
	 if (isFirst){
		 hardFlap.splice(0, 0, function(){signs[1].setEnabled(true); signs[0].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(hardFlap  , 4) ); // 4 repeats                     
}

function awaySeries(cloth, isFirst){
	 var away        = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  200,   0,   0.3, new BABYLON.Vector3( 0, 1.5, 3.3)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  400,   0,  -0.2, new BABYLON.Vector3( 0, 1.5, 6.7)),
	                   ];// climbing forward; series repeat acceleration applied when queued to avoid jerk start
	                     // forward velocity: (3.3 + 6.7) / (200 + 400) = 0.016666 units / milli
	 
	 if (isFirst){
		 away.splice(0, 0, function(){signs[2].setEnabled(true); signs[1].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(away       , 5     , 2.0) ); // 5 repeats, prorated acceleration
}

function bankRightSeries(cloth, isFirst){
	 var bankRight   = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  750,   0,   0.1, new BABYLON.Vector3(-2,   0, 16), new BABYLON.Vector3(0, .4,  .2)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  750,   0,  -0.2, new BABYLON.Vector3(-2,   0, 16), new BABYLON.Vector3(0, .4,  .2))  
	                   ];// twirl clockwise while tilting right; going left while on your right side is really up
	                     // forward velocity: (16 + 16) / (750 + 750) = 0.021333 units / milli

	 if (isFirst){
		 bankRight.splice(0, 0, function(){signs[3].setEnabled(true); signs[2].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(bankRight  , 3     , 0.021333 / 0.016666) ); // 3 repeats, prorated acceleration
}

function backStretchSeries(cloth, isFirst){
	 var backStretch = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  450,   0,   0.3, new BABYLON.Vector3( 0,   0, 12)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  450,   0,  -0.2, new BABYLON.Vector3( 0,   0, 12))  
	                   ];// need to make range (0.3 to -0.2), same as away, so can be seen so far away from camera
	                     // forward velocity: (12 + 12) / (450 + 450) = 0.026666 units / milli
	 
	 if (isFirst){
		 backStretch.splice(0, 0, function(){signs[4].setEnabled(true); signs[3].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(backStretch, 2     , 0.026666 / 0.021333) );
}

function turnRightSeries(cloth, isFirst){
	 var turnRight   = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  450,   0,  -0.1, new BABYLON.Vector3( 3,  0,  24), new BABYLON.Vector3(0, .6,   0)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  450,   0,  -0.2, new BABYLON.Vector3( 3,  0,  24), new BABYLON.Vector3(0, .6,   0)) 
	                   ];// twirl without aditional tilt; going right which starts to make it go down;
	                     // forward velocity: (24 + 24) / (450 + 450) = 0.053333 units / milli
	 
	 if (isFirst){
		 turnRight.splice(0, 0, function(){signs[5].setEnabled(true); signs[4].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(turnRight  , 2     , 0.053333 / 0.026666) );
}

function tiltToHorizSeries(cloth, isFirst){
	 var tiltToHoriz = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  250,   0,   0.3, new BABYLON.Vector3( 0,  -1,  8), new BABYLON.Vector3(0,  0, -.2)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  250,   0,  -0.1, new BABYLON.Vector3( 0,  -1,  8), new BABYLON.Vector3(0,  0, -.2))  
	                   ];// reverse the tilt from 'transRight' and 'bankRight'; down hill
	                     // forward velocity: (8 + 8) / (250 + 250) = 0.032 units / milli
	 
	 if (isFirst){
		 tiltToHoriz.splice(0, 0, function(){signs[6].setEnabled(true); signs[5].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(tiltToHoriz, 3) );
}

function wooshSeries(cloth, isFirst){
	 var woosh       = [new MORPH.Deformation("ENTIRE MESH", "DRAPED",  400,   0  , 0.3, new BABYLON.Vector3( 12, -1, 25)),
	                    new MORPH.Deformation("ENTIRE MESH", "DRAPED",  400,   0,  -0.1, new BABYLON.Vector3( 12, -1, 25))  
	                   ];// cross over right / down hill; eat your heart out Roddenberry
	                     // forward velocity: (25 + 25) / (400 + 400) = 0.0625 units / milli
	 
	 if (isFirst){
		 woosh.splice(0, 0, function(){signs[7].setEnabled(true); signs[6].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(woosh      , 3) );
}

function resetSeries(cloth, isFirst, button){
    // using the version of Deformation which does not default on the reference state, here "DRAPED", to going back to 'BASIS'
	 var reset       = [new MORPH.ReferenceDeformation("ENTIRE MESH", "DRAPED", ["BASIS"],  1, 0, [1]), 
	                    function(){
	                         cloth.position = cloth.originalPos;
	                         cloth.rotation = cloth.originalRot;
	                         scene.activeCamera._getViewMatrix(); // jiggle camera to re-lock on target,  also done by ShapeKeyGroup.incrementallyDeform()
	                       	 var report = cloth.getTrackingReport();
//	                       	 window.alert(report);
	                       	 console.log(report);
	                         isAnimating = false;
	                         button.reAppearNoCallback();
	                    } 
	                   ];                        
	 if (isFirst){
		 reset.splice(0, 0, function(){signs[7].setEnabled(false);});
	 }
	 cloth.queueEventSeries(new MORPH.EventSeries(reset) );
}