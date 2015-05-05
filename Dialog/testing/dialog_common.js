var scene;

var mainPanel;
var fitChk;
var sysCameraChk;
var details;
var inputBtn;
var dockBtn;

var load = function (sceneArg) {
	scene = sceneArg;
    scene.clearColor = new BABYLON.Color3(1, 1, .5);
    
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.z = 5;
    var lightPosition = new BABYLON.Vector3(-20, 50, -100)
    var light = new BABYLON.PointLight("Lamp", lightPosition, scene);
    // - - - -           
    DIALOG.DialogSys.initialize(scene);
    DIALOG.Label.DEFAULT_FONT_MODULE = 'Font2D'; // not required, 2D is the default
    DIALOG.DialogSys.CURRENT_FONT_MAT_ARRAY = DIALOG.DialogSys.BLACK;
    DIALOG.Label.NO_MERGING = false;  // not required, for dev testing only
   
    mainPanel = createMainPanel();
    
    // add a little scene label
    var sceneLabel = new DIALOG.Label("Arc rotate scene camera", 'Font3D').setLetterMaterial(DIALOG.DialogSys.RED);
    sceneLabel.scaleZ(0.20);
    sceneLabel.position.z = 5;
    sceneLabel.position.y = 7;
    sceneLabel.layout();
       
    return sphere;
};

var createMainPanel = function () {
    var topLevel = new DIALOG.Panel("Top", DIALOG.Panel.LAYOUT_VERTICAL, true);
    // initial alignment so it matches checkboxes in stack panel
    topLevel.horizontalAlignment = DIALOG.Panel.ALIGN_LEFT;
    topLevel.verticalAlignment   = DIALOG.Panel.ALIGN_BOTTOM;
    	 
    var title = new DIALOG.Panel("title", DIALOG.Panel.LAYOUT_HORIZONTAL);
    
    var leftChecks = new DIALOG.Panel('leftChecks', DIALOG.Panel.LAYOUT_VERTICAL);
         
    var bordersCheck = new DIALOG.CheckBox("Show All Borders");
    bordersCheck.setFontSize(.5);
    bordersCheck.assignCallback(function(){ 
        showBorders(topLevel, bordersCheck.isSelected() );
    });
    leftChecks.addSubPanel(bordersCheck);
            
    var debugChk = new DIALOG.CheckBox("Debug Mode");
    debugChk.setFontSize(.5);
    debugChk.assignCallback(function(){ 
    	if (debugChk.isSelected())
            DIALOG.DialogSys._scene.debugLayer.show();
    	else
            DIALOG.DialogSys._scene.debugLayer.hide();
    });
    leftChecks.addSubPanel(debugChk);
    
    title.addSubPanel(leftChecks);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   	     
    title.addSubPanel(new DIALOG.Label("Dialog System").setFontSize(1.5).setLetterMaterial(DIALOG.DialogSys.BLUE).horizontalAlign(DIALOG.Panel.ALIGN_HCENTER) );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   	 
    var riteChecks = new DIALOG.Panel('riteChecks', DIALOG.Panel.LAYOUT_VERTICAL);
    riteChecks.horizontalAlign(DIALOG.Panel.ALIGN_RIGHT);
    
    sysCameraChk = new DIALOG.CheckBox("Use System Camera");
    sysCameraChk.setFontSize(.5);
    sysCameraChk.assignCallback(function(){ 
        inputBtn.enableButton(sysCameraChk.isSelected() );
        dockBtn .enableButton(sysCameraChk.isSelected() );
        fitChk  .enableButton(sysCameraChk.isSelected() );

    	if (sysCameraChk.isSelected())
            DIALOG.DialogSys.pushPanel(topLevel);
    	else
            DIALOG.DialogSys.popPanel(true);
    });
    riteChecks.addSubPanel(sysCameraChk);
    
    fitChk = new DIALOG.CheckBox("Fit to Window");
    fitChk.enableButton(false);
    fitChk.setFontSize(.5);
    fitChk.assignCallback(function(){ 
    	topLevel.fitToWindow = fitChk.isSelected();
    	sysCameraChk.enableButton(!fitChk.isSelected() );
    });
    riteChecks.addSubPanel(fitChk);
                 
    title.addSubPanel(riteChecks);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   	     
    
    topLevel.addSubPanel(title);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   	 
    
    var menuAndDetails = new DIALOG.Panel("multiCenter", DIALOG.Panel.LAYOUT_HORIZONTAL);
    menuAndDetails.stretchHorizontal = true;
    menuAndDetails.stretchVertical   = true;
    	 
    var menu = new DIALOG.Menu("Menu", ["Layout", "Fonts", "Panels", "LCD", "Limitations", "Modal Stack", "Look & Feel"]);
    menu.stretchVertical   = true;
    menu.assignMenuCallback(0, showLayoutDetails     );
    menu.assignMenuCallback(1, showFontDetails       );
    menu.assignMenuCallback(2, showPanelsDetails     );
    menu.assignMenuCallback(3, showLCDDetails        );
    menu.assignMenuCallback(4, showLimitationsDetails);
    menu.assignMenuCallback(5, showModalStackDetails );
    menu.assignMenuCallback(6, showLAFDetails        );
    menuAndDetails.addSubPanel(menu);
    	 
    details = new DIALOG.Panel("details", DIALOG.Panel.LAYOUT_HORIZONTAL);
    details.stretchHorizontal = true;
    details.stretchVertical   = true;
    details.setBorderVisible(true);
	
    menuAndDetails.addSubPanel(details);
    	     	 
    topLevel.addSubPanel(menuAndDetails);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
    var buttons = new DIALOG.Panel("buttons", DIALOG.Panel.LAYOUT_HORIZONTAL);
    buttons.horizontalAlignment = DIALOG.Panel.ALIGN_RIGHT;
    buttons.verticalAlignment   = DIALOG.Panel.ALIGN_BOTTOM;
    
    var returnedValue = new DIALOG.Panel(null);
    buttons.addSubPanel(returnedValue);
    
    inputBtn = new DIALOG.Button("Input");
    inputBtn.enableButton(false);
    inputBtn.assignCallback(function(){ 
        DIALOG.DialogSys.pushPanel(createInputPanel() );
    });
    buttons.addSubPanel(inputBtn);
    
    // dockBtn has global scope, so can be enabled / disabled in sysCameraCheck callback
    dockBtn = new DIALOG.Button("Dock");
    dockBtn.enableButton(false);
    dockBtn.assignCallback(function(){ 
        DIALOG.DialogSys.pushPanel(createDockingPanel() );
    });
    buttons.addSubPanel(dockBtn);
        
    topLevel.addSubPanel(buttons);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    topLevel.modalReturnCallBack = function(){
    	returnedValue.removeAll();
    	
    	if (topLevel.modalReturnedValue){
    	    returnedValue.addSubPanel(new DIALOG.Label("Value returned:  " + topLevel.modalReturnedValue) );
    	}
    };
    return topLevel;
};
//==============================================================================
var createInputPanel = function () {
    var panel = new DIALOG.Panel("InputPanel", DIALOG.Panel.LAYOUT_VERTICAL, true);
    panel.addSubPanel(new DIALOG.Label("Input Panel").horizontalAlign(DIALOG.Panel.ALIGN_HCENTER) );
    	 
    var scroller = new DIALOG.NumberScroller('# of Players:', 2, 1, 10, 1);
    panel.addSubPanel(scroller);
    
    var backBtn = new DIALOG.Button("OK").horizontalAlign(DIALOG.Panel.ALIGN_RIGHT);
    backBtn.assignCallback(function(){ 
    	panel.modalReturnedValue = scroller.value;
        DIALOG.DialogSys.popPanel();
    });
    panel.addSubPanel(backBtn);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   
    panel.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
    panel.verticalAlignment   = DIALOG.Panel.ALIGN_VCENTER;
    panel.maxViewportWidth  = 0.45;
    panel.maxViewportHeight = 0.45;
    return panel;
};
//==============================================================================
var createDockingPanel = function () {
    var panel = new DIALOG.Panel("DockingPanel", DIALOG.Panel.LAYOUT_VERTICAL, true);
    	 
    var display = new DIALOG.LCD('display', 3, false, 1);
    display.value = 0;
    panel.addSubPanel(display);
    
    var start = BABYLON.Tools.Now;
    var renderer = function(){
    	var since = (BABYLON.Tools.Now - start) / 1000;
    	if (since > display.value + 0.1)
    		// messy, but only way to not get many decimal places
    		display.value = Number((display.value + 0.1).toFixed(1));
    };
    // do not change value in mesh renderer, changing materials there causes flashing
    scene.registerBeforeRender(renderer);
    
    var backBtn = new DIALOG.Button("Done").horizontalAlign(DIALOG.Panel.ALIGN_HCENTER).stretch(false, true);
    backBtn.assignCallback(function(){ 
        DIALOG.DialogSys.popPanel();
        scene.unregisterBeforeRender(renderer);
    });
    panel.addSubPanel(backBtn);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   
    panel.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
    panel.verticalAlignment   = DIALOG.Panel.ALIGN_TOP;
    panel.maxViewportWidth  = 0.1;
    panel.maxViewportHeight = 0.1;
    return panel;
};
//==============================================================================
var assignDetailsPanel = function(panel){
	panel.stretchHorizontal = true;
	panel.stretchVertical   = true;
	details.removeAll();
	details.addSubPanel(panel);
	details.setSubsFaceSize(0.45, true);

//    var stats = Font3D.getStats()
//    console.log("clone count: " + stats[0]);
//    console.log("originalVerts: " + stats[1]);
//    console.log("clonedVerts: " + stats[2]); 
};
//==============================================================================     
var showLayoutDetails = function () {
    var panel = new DIALOG.Panel("LayoutDetails", DIALOG.Panel.LAYOUT_VERTICAL);

    var title = new DIALOG.Label("Layout");
    title.setFontSize(1.5);
    title.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
    panel.addSubPanel(title);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
    var leftCenterRight = new DIALOG.Panel("lcr", DIALOG.Panel.LAYOUT_HORIZONTAL);
    leftCenterRight.stretchHorizontal = true;
         
    var left = new DIALOG.Label("left-top");
    left.horizontalAlignment = DIALOG.Panel.ALIGN_LEFT;
    left.verticalAlignment   = DIALOG.Panel.ALIGN_TOP;
    left.setFontSize(.80);
    leftCenterRight.addSubPanel(left);
         
    var multiCenter = new DIALOG.Panel("multiCenter", DIALOG.Panel.LAYOUT_HORIZONTAL);    	 
    multiCenter.addSubPanel(new DIALOG.Label("Center 1") );
    multiCenter.addSubPanel(new DIALOG.Label("Center 2") );
    multiCenter.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
    	 
    leftCenterRight.addSubPanel(multiCenter);
    	    	 
    var right = new DIALOG.Label("right-vcenter");
    right.setFontSize(.80);
    right.horizontalAlignment = DIALOG.Panel.ALIGN_RIGHT;
    right.verticalAlignment   = DIALOG.Panel.ALIGN_VCENTER;
    leftCenterRight.addSubPanel(right);
         
    panel.addSubPanel(leftCenterRight);
    
    panel.addSubPanel(null);
    panel.addSubPanel(new DIALOG.Label("There is no formal assignment of Layout, since there is only one.") );
    panel.addSubPanel(new DIALOG.Label("It is an ordered list oriented vertically or horizontally.  Nesting") );
    panel.addSubPanel(new DIALOG.Label("along with alignment, margins, & stretching make it very powerful.") );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    assignDetailsPanel(panel);
};
//==============================================================================     
var showFontDetails = function () {
    var panel = new DIALOG.Panel("FontDetails", DIALOG.Panel.LAYOUT_VERTICAL);
    var fileNmMat  = DIALOG.DialogSys.BLUE;
    var codeMat    = DIALOG.DialogSys.GREEN;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(new DIALOG.Label("Stock font modules in repo:  Font2D.js & Font3D.js.  For").setLetterMaterial(fileNmMat, "Font2D.js").setLetterMaterial(fileNmMat, "Font3D.js") );
    panel.addSubPanel(new DIALOG.Label("non-english letters (áöøûæÇÑß), add Font*_EXT.js module too.").setLetterMaterial(fileNmMat, "Font*_EXT.js") );
    panel.addSubPanel(new DIALOG.Label("2D is default font, if both 2D & 3D included.") );
    
    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Each duplicate letter is a clone.  Need Tower of Babel runtime,") );
    panel.addSubPanel(new DIALOG.Label("TOB-runtime.js, to dynamically call a module's mesh factory.").setLetterMaterial(fileNmMat, "TOB-runtime.js") );
    
    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Custom fonts can built using fontgen.blend. Include meshFactory").setLetterMaterial(fileNmMat, "fontgen.blend") );
    panel.addSubPanel(new DIALOG.Label("on TOB export.  Letters with character codes > 128 must be in a")  );
    panel.addSubPanel(new DIALOG.Label("matching xxx_EXT.js.  3D needed in module name, if 3D.").setLetterMaterial(fileNmMat, "xxx_EXT.js") );
    
    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Custom fonts must be intialized: (_EXT only if required)") );
    
    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("TOWER_OF_BABEL.MeshFactory.MODULES.push(new xxx3D.MeshFactory(scene));")    .setFontSize(.70).setLetterMaterial(codeMat) );
    panel.addSubPanel(new DIALOG.Label("TOWER_OF_BABEL.MeshFactory.MODULES.push(new xxx3D_EXT.MeshFactory(scene));").setFontSize(.70).setLetterMaterial(codeMat) );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    assignDetailsPanel(panel);
};
//==============================================================================     
var showPanelsDetails = function () {
    var panel = new DIALOG.Panel("PanelDetails", DIALOG.Panel.LAYOUT_VERTICAL);
    var twoFer = new DIALOG.Panel("twoFerPanels", DIALOG.Panel.LAYOUT_HORIZONTAL);   
    var color = DIALOG.DialogSys.GREEN;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var left = new DIALOG.Panel("PanelLeft", DIALOG.Panel.LAYOUT_VERTICAL);

    left.addSubPanel(new DIALOG.Label("The root GUI class is BasePanel.  A") );
    left.addSubPanel(new DIALOG.Label("top level panel has a back, and has") );
    left.addSubPanel(new DIALOG.Label("a before renderer for processing") );
    left.addSubPanel(new DIALOG.Label("changes to the layout.") );

    left.addSubPanel(null); // small amount of vertical spacing
    left.addSubPanel(new DIALOG.Label("A BasePanel is list of sub-panels,") );
    left.addSubPanel(new DIALOG.Label("which can be shown horizontally or,") );
    left.addSubPanel(new DIALOG.Label("vertically.") );

    left.addSubPanel(null); // small amount of vertical spacing
    left.addSubPanel(new DIALOG.Label("Attributes in both directions: ") );
    left.addSubPanel(new DIALOG.Label("   - alignment (left, center, right)").setFontSize(.70).setLetterMaterial(color) );
    left.addSubPanel(new DIALOG.Label("   - stretch"                        ).setFontSize(.70).setLetterMaterial(color) );
    left.addSubPanel(new DIALOG.Label("   - margins"                        ).setFontSize(.70).setLetterMaterial(color) );
    
    twoFer.addSubPanel(left);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var rite = new DIALOG.Panel("PanelLeft", DIALOG.Panel.LAYOUT_VERTICAL);
    var panels = [];
    panels.push(new DIALOG.Label("- Panel") );
    panels.push(new DIALOG.Label("- LCD") );
    panels.push(new DIALOG.Label("- NumberScroller") );
    panels.push(new DIALOG.Label("- Menu") );
    panels.push(DIALOG.Panel.makeList("- Label", ["CheckBox", "Button"], DIALOG.Panel.LAYOUT_VERTICAL, .5) );
    panels.push(DIALOG.Panel.makeList("- Letter*", ["A, B, C, ...  Built from Blender"], DIALOG.Panel.LAYOUT_VERTICAL, .5) );
    panels.push(DIALOG.Panel.makeList("- MeshWrapperPanel*", ["DigitWtLogic"], DIALOG.Panel.LAYOUT_VERTICAL, .5) );

    rite.addSubPanel(DIALOG.Panel.nestPanels("BasePanel", panels, DIALOG.Panel.LAYOUT_VERTICAL, true).stretch(true, false) );
    
    rite.addSubPanel(new DIALOG.Label("* - Content / Donor Panel").setFontSize(.5) );
    twoFer.addSubPanel(rite);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(twoFer);
    assignDetailsPanel(panel);
};
//==============================================================================     
var showLCDDetails = function () {
    var panel = new DIALOG.Panel("Top", DIALOG.Panel._LAYOUT_VERTICAL);
    	 
    var display = new DIALOG.LCD('display', 8);
    display.value = 5318008;
    panel.addSubPanel(display);
         
    var flipCheck = new DIALOG.CheckBox("(o)  (o)");
    flipCheck.setFontSize(.9);
    flipCheck.assignCallback(function(){ 
        display.unfreezeWorldMatrix();
    	display.rotation.z = flipCheck.isSelected() ? 3.14 : 0;
        display.freezeWorldMatrix();
    });
    panel.addSubPanel(flipCheck);
    
    var scroller = new DIALOG.NumberScroller('# of Players:', 2, 1, 10, 1);
    panel.addSubPanel(scroller);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    assignDetailsPanel(panel);
};
//==============================================================================     
var showLimitationsDetails = function () {
    var panel = new DIALOG.Panel("LimitationsDetails", DIALOG.Panel.LAYOUT_VERTICAL);

    var title = new DIALOG.Label("Limitations");
    title.setFontSize(1.5);
    title.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER;
    panel.addSubPanel(title);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(new DIALOG.Label("- Text input fields not really possible.") );
    panel.addSubPanel(new DIALOG.Label("- Only one sub-panel can have center alignment.") );
    panel.addSubPanel(new DIALOG.Label("- Minimim BabylonJS version 2.1") );
    panel.addSubPanel(new DIALOG.Label("- Mult-line Labels, embedded with \\n, are not supported.") );
    panel.addSubPanel(new DIALOG.Label("- Scene is not passd as arg, so Dialogs can only be in one scene.") );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    assignDetailsPanel(panel);
};
//==============================================================================     
var showModalStackDetails = function () {
    var panel = new DIALOG.Panel("ModalStackDetails", DIALOG.Panel.LAYOUT_VERTICAL);
    var color = DIALOG.DialogSys.GREEN;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(new DIALOG.Label("To use the system camera / modal stack, add & remove top level panels as:") );
    panel.addSubPanel(new DIALOG.Label("  - DIALOG.DialogSys.pushPanel(topLevel);").setLetterMaterial(color) );
    panel.addSubPanel(new DIALOG.Label("  - DIALOG.DialogSys.popPanel();").setLetterMaterial(color) );

    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Values can be returned by setting modalReturnedValue.").setLetterMaterial(color, "modalReturnedValue") );

    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Panels lower on the stack can register a callback to use a returned value:") );
    panel.addSubPanel(new DIALOG.Label("  - panel.modalReturnCallBack = function(){ ... panel.modalReturnedValue)};").setLetterMaterial(color) );

    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("Alignment properties of Panel are re-purposed to locate them in the window.") );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var menus = new DIALOG.Panel("Menus", DIALOG.Panel.LAYOUT_HORIZONTAL);
    var menu = new DIALOG.Menu("Horizontal:", ["Left", "Center", "Right"], DIALOG.Panel.LAYOUT_HORIZONTAL);
    menu.assignMenuCallback(0, function(){mainPanel.horizontalAlignment = DIALOG.Panel.ALIGN_LEFT   ; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.assignMenuCallback(1, function(){mainPanel.horizontalAlignment = DIALOG.Panel.ALIGN_HCENTER; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.assignMenuCallback(2, function(){mainPanel.horizontalAlignment = DIALOG.Panel.ALIGN_RIGHT  ; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.selectedIndex = 0;
    menus.addSubPanel(menu);

    menu = new DIALOG.Menu("Vertical:", ["Top", "Center", "Bottom"], DIALOG.Panel.LAYOUT_HORIZONTAL);
    menu.assignMenuCallback(0, function(){mainPanel.verticalAlignment = DIALOG.Panel.ALIGN_TOP    ; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.assignMenuCallback(1, function(){mainPanel.verticalAlignment = DIALOG.Panel.ALIGN_VCENTER; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.assignMenuCallback(2, function(){mainPanel.verticalAlignment = DIALOG.Panel.ALIGN_BOTTOM ; DIALOG.DialogSys._adjustCameraForPanel();} );
    menu.selectedIndex = 2;
    menus.addSubPanel(menu);   
    
    var note = new DIALOG.Panel("note", DIALOG.Panel.LAYOUT_VERTICAL);
    note.addSubPanel(new DIALOG.Label("Note: changes only take effect when").setFontSize(.70) );
    note.addSubPanel(new DIALOG.Label("Use System Camera checkbox is selected.").setFontSize(.70) );
    menus.addSubPanel(note);
    
    panel.addSubPanel(menus);   
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(new DIALOG.Label("max size constraints can be put on Panels setting these < 1:") );
    panel.addSubPanel(new DIALOG.Label("  - maxViewportWidth").setLetterMaterial(color) );
    panel.addSubPanel(new DIALOG.Label("  - maxViewportHeight").setLetterMaterial(color) );
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(null); // small amount of vertical spacing
    panel.addSubPanel(new DIALOG.Label("To size panel to window or tablet, set panel.fitToWindow = true") );
    assignDetailsPanel(panel);
};
//==============================================================================     
var showLAFDetails = function () {
    var panel = new DIALOG.Panel("LAFDetails", DIALOG.Panel.LAYOUT_VERTICAL);
    var color = DIALOG.DialogSys.GREEN;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    panel.addSubPanel(new DIALOG.Label("The following can change how subsequent meshes look:") );
    var panels = [];
    var twoFer = new DIALOG.Panel("twoFerLAF", DIALOG.Panel.LAYOUT_HORIZONTAL);
    var faceScale = 0.6;

    panels.push(DIALOG.Panel.makeList("DialogSys",
            ["CURRENT_FONT_MAT_ARRAY : Array<StandardMaterial>", "USE_CULLING_MAT_FOR_2D = true", "DEPTH_SCALING_3D = .05"], DIALOG.Panel.LAYOUT_VERTICAL, faceScale, color) );
    panels.push(DIALOG.Panel.makeList("Panel", ["BORDER_MAT : StandardMaterial", "TOP_LEVEL_BORDER_MAT : MultiMaterial"], DIALOG.Panel.LAYOUT_VERTICAL, faceScale, color) );
    var left = DIALOG.Panel.nestPanels(null, panels, DIALOG.Panel.LAYOUT_VERTICAL);
    left.stretchVertical = true;
    twoFer.addSubPanel(left);
    
    panels = [];
    panels.push(DIALOG.Panel.makeList("LCD", ["MAT : StandardMaterial"], DIALOG.Panel.LAYOUT_VERTICAL, faceScale, color) );    
    panels.push(DIALOG.Panel.makeList("Label", ["DEFAULT_FONT_MODULE_NM : string"], DIALOG.Panel.LAYOUT_VERTICAL, faceScale, color) );
    panels.push(DIALOG.Panel.makeList("Button/NumberScroller", ["MAT : MultiMaterial", "SELECTED_MAT : MultiMaterial"], DIALOG.Panel.LAYOUT_VERTICAL, faceScale, color) );
    var rite = DIALOG.Panel.nestPanels(null, panels, DIALOG.Panel.LAYOUT_VERTICAL);
    rite.stretchVertical = true;
    twoFer.addSubPanel(rite);
        
    panel.addSubPanel(twoFer);

    panel.addSubPanel(new DIALOG.Label("Instance level Look & Feel (setters available):") );
    panels = [];
    twoFer = new DIALOG.Panel("twoFerB", DIALOG.Panel.LAYOUT_HORIZONTAL);    
    left = DIALOG.Panel.makeList(null, 
    		["horizontalMargin = 0.1",
    		 "horizontalAlignment = Panel.ALIGN_LEFT",
    		 "stretchHorizontal = false",
    		 "placeHolderWidth = 0.3",
    		 "borderInsideVert = 0.05"],
             DIALOG.Panel.LAYOUT_VERTICAL, faceScale);
    left.stretchVertical = true;
    twoFer.addSubPanel(left);
            
    rite = DIALOG.Panel.makeList(null, 
            ["verticalMargin = 0.1",
             "verticalAlignment = Panel.ALIGN_TOP",
             "stretchVertical = false",
             "placeHolderHeight = 0.5",
             "borderDepth : DialogSys.DEPTH_SCALING_3D"],
             DIALOG.Panel.LAYOUT_VERTICAL, faceScale);
    rite.stretchVertical = true;
    twoFer.addSubPanel(rite);
        
    panel.addSubPanel(twoFer);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    assignDetailsPanel(panel);
};
//==============================================================================     
var showBorders = function(panel, show) {
 	if (panel instanceof DIALOG.Letter || panel instanceof DIALOG.Button) return;
    	 
    panel.visibility = (show || panel.isBorderVisible()) ? 1 : 0;
    var subs = panel.getSubPanels();
    for (var i = 0; i < subs.length; i++){
        if (subs[i] && subs[i] !== null){
            showBorders(subs[i], show);
        }
    }
};
//==============================================================================     