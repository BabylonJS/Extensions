/// <reference path="./Panel.ts"/>
/// <reference path="./FontFactory.ts"/>
module DIALOG{
    export class DialogSys{
        // stock materials
        public static WHITE   : Array<BABYLON.StandardMaterial>;
        public static BLACK   : Array<BABYLON.StandardMaterial>;
        public static BLUE    : Array<BABYLON.StandardMaterial>;
        public static GOLD    : Array<BABYLON.StandardMaterial>;
        public static RED     : Array<BABYLON.StandardMaterial>;
        public static GREY    : Array<BABYLON.StandardMaterial>;
        public static LT_GREY : Array<BABYLON.StandardMaterial>;
        public static ORANGE  : Array<BABYLON.StandardMaterial>;
        public static GREEN   : Array<BABYLON.StandardMaterial>;
        
        // constants for 2 camera management
        public static ACTIVE_DIALOG_LAYER = 0x10000000;
        public static SUSPENDED_DIALOG_LAYER = 0;
        public static DEFAULT_LAYERMASK = 0x0FFFFFFF; // BJS does not explicitly have
        
        // state equivalent static vars
        private static _dialogStack = new Array<BasePanel>();
        private static _camera : any;  
        private static _light  : BABYLON.PointLight;      
        public  static  _scene : BABYLON.Scene;
        
        private static _onNewLightObserver: BABYLON.Observer<BABYLON.Light>;
        
        // current settings applied as meshes generated, sort of LAF
        public static CURRENT_FONT_MAT_ARRAY : Array<BABYLON.StandardMaterial>;
        public static USE_CULLING_MAT_FOR_2D = true;
        public static DEPTH_SCALING_3D = .05;
        /**
         * Must be run before instancing any panels.  Stores scene, so does not have to be part of Panel constructors.
         * Also instances system camera / lights, load stock fonts in TOB runtime, & build font materials.
         * @param {BABYLON.Scene} scene - The scene to construct Panels in.
         */     
        public static initialize(scene : BABYLON.Scene){
            DialogSys._scene = scene;
            
            if (!DialogSys._camera){
                // distance not that important with ortho cameras, as long as not too close or panels are behind camera
                DialogSys._camera = new BABYLON.FreeCamera("DialogSysCamera", new BABYLON.Vector3(0, 0, -2000), scene);                
                DialogSys._camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                DialogSys._camera.layerMask = DialogSys.ACTIVE_DIALOG_LAYER;
                scene.removeCamera(<BABYLON.Camera> DialogSys._camera);
                
                var lightPosition = new BABYLON.Vector3(-20, 50, -100);
                DialogSys._light = new BABYLON.PointLight("DialogSysLamp", lightPosition, scene);
                DialogSys._light.intensity = 1;
                DialogSys._light.includeOnlyWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;

                window.addEventListener("resize", function () {
                    DIALOG.DialogSys._adjustCameraForPanel();
                });
                BABYLON.Tools.Log("Dialog system (" + DialogSys.Version + ") initialized");
            }
            
            // - - - - - - - -
            DialogSys.WHITE   = DialogSys.buildFontMaterials("DialogSys.WHITE"  , new BABYLON.Color3(1,1,1) );
            DialogSys.BLACK   = DialogSys.buildFontMaterials("DialogSys.BLACK"  , new BABYLON.Color3(0,0,0) );
            DialogSys.BLUE    = DialogSys.buildFontMaterials("DialogSys.BLUE"   , new BABYLON.Color3(0.0815,0.162,0.8), 0.8);
            DialogSys.GOLD    = DialogSys.buildFontMaterials("DialogSys.GOLD"   , new BABYLON.Color3(1,0.8136,0.2218) );
            DialogSys.RED     = DialogSys.buildFontMaterials("DialogSys.RED"    , new BABYLON.Color3(1,0.0046,0.0286) );
            DialogSys.GREY    = DialogSys.buildFontMaterials("DialogSys.GREY"   , new BABYLON.Color3(0.5,0.5,0.5) );
            DialogSys.LT_GREY = DialogSys.buildFontMaterials("DialogSys.LT_GREY", new BABYLON.Color3(0.6,0.6,0.6) );
            DialogSys.ORANGE  = DialogSys.buildFontMaterials("DialogSys.ORANGE" , new BABYLON.Color3(1,0.5,0) );
            DialogSys.GREEN   = DialogSys.buildFontMaterials("DialogSys.GREEN"  , new BABYLON.Color3(0.004,0.319,0.002) );
            // - - - - - - - -
            
            FontFactory.loadStockTypefaces(scene);
            DialogSys.CURRENT_FONT_MAT_ARRAY = DialogSys.WHITE;
            
            // exclude the scene lights from dialog system meshes on stack
            for(var i = scene.lights.length - 1; i >= 0; i--){
                if (scene.lights[i] !== DialogSys._light){
                    scene.lights[i].excludeWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;
                }
            }
            scene
            this._onNewLightObserver = scene.onNewLightAddedObservable.add(DialogSys.onNewLight);
        }
        /**
         * 
         */
        public static onNewLight(newLight?: BABYLON.Light) : void{
            newLight.excludeWithLayerMask = DialogSys.ACTIVE_DIALOG_LAYER;
        }
        /**
         * Remove all the things made / done in initialize().
         */
        public static dispose() : void{
            DialogSys._camera.dispose();
            DialogSys._light.dispose();
            DialogSys.WHITE   [0].dispose(); DialogSys.WHITE   [1].dispose(); 
            DialogSys.BLACK   [0].dispose(); DialogSys.BLACK   [1].dispose(); 
            DialogSys.BLUE    [0].dispose(); DialogSys.BLUE    [1].dispose(); 
            DialogSys.GOLD    [0].dispose(); DialogSys.GOLD    [1].dispose(); 
            DialogSys.RED     [0].dispose(); DialogSys.RED     [1].dispose(); 
            DialogSys.GREY    [0].dispose(); DialogSys.GREY    [1].dispose(); 
            DialogSys.LT_GREY [0].dispose(); DialogSys.LT_GREY [1].dispose(); 
            DialogSys.ORANGE  [0].dispose(); DialogSys.ORANGE  [1].dispose(); 
            DialogSys.GREEN   [0].dispose(); DialogSys.GREEN   [1].dispose();
            DialogSys._scene.onNewLightAddedObservable.remove(DialogSys._onNewLightObserver);
            DialogSys._scene = null;
        }
        
        /**
         * Build sets of materials for Letter generation.  Output should be to DialogSys.CURRENT_FONT_MAT_ARRAY,
         * prior to Letter creation.
         * 
         * @return {Array<BABYLON.StandardMaterial>}:
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         */
        public static buildFontMaterials(baseName : String, color : BABYLON.Color3, intensity = 1, alpha = 1) : Array<BABYLON.StandardMaterial> {
            var ret = new Array<BABYLON.StandardMaterial>(2);
            var mat = new BABYLON.StandardMaterial(baseName + "-3D", DialogSys._scene);
            mat.checkReadyOnlyOnce = true;
            mat.ambientColor  = color;
            mat.diffuseColor  = (intensity === 1) ? color : new BABYLON.Color3(color.r * intensity, color.g * intensity, color.b * intensity);
            mat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
            mat.specularPower = 80;
            mat.alpha = alpha;
            ret[0] = mat;
            
            mat = mat.clone(baseName + "-2D");
            mat.backFaceCulling = false;
            ret[1] = mat;
            return ret;
        }
        /**
         * Add a top level panel to the modal stack.  When first panel re-enable system camera,
         * otherwise hide the previous panel using layermask.
         * @param {BasePanel} panel - The new top of the stack panel.
         */
        public static pushPanel(panel : BasePanel) : void{
            if (!panel._topLevel){
                BABYLON.Tools.Error("Only top Level panels can be used in displayPanel()");
            }
            // prep a new panel, never layed out, except for layermast
            if (panel.getReqdWidth() === 0){
                panel.layout();
            }
            
            // suspend current Panel, if one is showing
            if (DialogSys._dialogStack.length > 0){
                DialogSys._dialogStack[DialogSys._dialogStack.length - 1].setLayerMask(DialogSys.SUSPENDED_DIALOG_LAYER);
                
            // otherwise need to activate system camera
            }else{
                DialogSys._scene.addCamera(DialogSys._camera);
//                DialogSys._scene.cameraToUseForPointers = DialogSys._camera;
                
                if (DialogSys._scene.activeCameras.length === 0){
                    DialogSys._scene.activeCameras.push(DialogSys._scene.activeCamera);
                }              
                DialogSys._scene.activeCameras.push(DialogSys._camera);
            }
            
            // always set so dialogs cannot be seen on scene camera
            DialogSys._scene.activeCameras[0].layerMask = DialogSys.DEFAULT_LAYERMASK;
            
            // push new panel & show
            DialogSys._dialogStack.push(panel);
            DialogSys._adjustCameraForPanel();
            panel.setLayerMask(DialogSys.ACTIVE_DIALOG_LAYER);
        }
        
        public static popPanel(doNotDispose? : boolean) : any{
            var gone = DialogSys._dialogStack.pop();
            var ret = gone.modalReturnedValue;
            
            if (doNotDispose){
                gone.setLayerMask(DialogSys.DEFAULT_LAYERMASK);
            }else {
                gone.dispose();
            }
            
            // suspend current container, if showing
            if (DialogSys._dialogStack.length > 0){
                var current = DialogSys._dialogStack[DialogSys._dialogStack.length - 1];
                current.setLayerMask(DialogSys.ACTIVE_DIALOG_LAYER);
                DialogSys._adjustCameraForPanel();

                current.modalReturnedValue = ret;
                if (current.modalReturnCallBack){
                    current.modalReturnCallBack();
                }
                
            }else{
                DialogSys._scene.activeCameras.pop();
                DialogSys._scene.removeCamera(DialogSys._camera);               
//                DialogSys._scene.cameraToUseForPointers = null;
            }
            return ret;
        }
        /**
         * Adjusts camera ortho settings & viewport based on the top panel on the stack.
         * Called by pushPanel(), popPanel(), & window resize event registered for above.
         * Called externally in BasePanel._beforeRender(), for top level Panels.
         */
        public static _adjustCameraForPanel() : void{
            if (!DialogSys._dialogStack || DialogSys._dialogStack.length === 0) return;    
        
            // work with the panel on the top of the stack
            var panel = DialogSys._dialogStack[DialogSys._dialogStack.length - 1];
            
            // call _layout, when Panel, after manually assigning requirements,says to fit to window
            if (panel.fitToWindow){
                // need to adjust the reqd size of one of the dimensions, so that re-laying out will cause it to now be in the shape of window             
                var scaling = DialogSys._getScalingToWindow(panel._originalReqdWidth, panel._originalReqdHeight);
                var w = panel._originalReqdWidth  * ((scaling.y < scaling.x) ? scaling.x / scaling.y : 1);
                var h = panel._originalReqdHeight * ((scaling.y > scaling.x) ? scaling.y / scaling.x : 1);
                panel._assignRequirements(w, h);
                
                panel._layout(panel.getReqdWidth(), panel.getReqdHeight());
                panel.freezeWorldMatrix();
            }

            // assign the ortho, based on the half width & height
            var halfWidth  = panel.getReqdWidth () / 2;
            var halfHeight = panel.getReqdHeight() / 2;
            DialogSys._camera.orthoTop    =  halfHeight;
            DialogSys._camera.orthoBottom = -halfHeight;
            DialogSys._camera.orthoLeft   = -halfWidth;
            DialogSys._camera.orthoRight  =  halfWidth;
            DialogSys._camera.getProjectionMatrix(); // required to force ortho to take effect after first setting
            
            // keep dialog from being distorted by window size
            var scaling = DialogSys._getScalingToWindow(halfWidth, halfHeight);
            
            var w = window.innerWidth  * ((scaling.y < scaling.x) ? scaling.y / scaling.x : 1);
            var h = window.innerHeight * ((scaling.y > scaling.x) ? scaling.x / scaling.y : 1);
            
            // derive width & height
            var width  = panel.maxViewportWidth  * w / window.innerWidth ;
            var height = panel.maxViewportHeight * h / window.innerHeight; 
            
            // assign x & y, based on layout of panel
            var x : number;
            switch(panel.fitToWindow ? Panel.ALIGN_HCENTER : panel.horizontalAlignment){
                case Panel.ALIGN_LEFT:
                    x = 0; break;
                    
                case Panel.ALIGN_HCENTER:
                    x = (1 - width) / 2; break;
                    
                case Panel.ALIGN_RIGHT:
                    x = 1 - width;
            }
            
            var y : number;
            switch(panel.fitToWindow ? Panel.ALIGN_VCENTER : panel.verticalAlignment){
                case Panel.ALIGN_TOP:
                    y = 1 - height; break;
                    
                case Panel.ALIGN_VCENTER:
                    y = (1 - height) / 2; break;
                    
                case Panel.ALIGN_BOTTOM:
                    y = 0;
            }
            DialogSys._camera.viewport = new BABYLON.Viewport(x, y, width, height);
        }
        /**
         * called internally to get the ratios of a panel relative to thecurrent window size
         */
        private static _getScalingToWindow(width, height) : BABYLON.Vector2{
            return new BABYLON.Vector2(window.innerWidth  / width, window.innerHeight / height);
        }
        
        public static get Version(): string {
            return "1.2.0";
        }
    }
}