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
        private static ACTIVE_DIALOG_LAYER = 0x10000000;
        private static SUSPENDED_DIALOG_LAYER = 0;
        
        // state equivalent static vars
        private static _dialogStack = new Array<BasePanel>();
        private static _camera : BABYLON.FreeCamera;        
        public static  _scene : BABYLON.Scene;
        
        // current settings applied as meshes generated, sort of LAF
        public static CURRENT_FONT_MAT_ARRAY : Array<BABYLON.StandardMaterial>;
        public static USE_CULLING_MAT_FOR_2D = true;
        public static DEPTH_SCALING_3D = .05;
                
        public static initialize(scene : BABYLON.Scene){
            DialogSys._scene = scene;
            
            if (!DialogSys._camera){
//                DialogSys._camera = new BABYLON.FreeCamera("DialogSys",  BABYLON.Vector3.Zero(), scene);
//                DialogSys._camera.layerMask = DialogSys.ACTIVE_DIALOG_LAYER;
//                scene.activeCameras.push(DialogSys._camera);
            }
            
            // - - - - - - - -
            DialogSys.WHITE   = DialogSys.buildFontMaterials(new BABYLON.Color3(1,1,1) );
            DialogSys.BLACK   = DialogSys.buildFontMaterials(new BABYLON.Color3(0,0,0) );
            DialogSys.BLUE    = DialogSys.buildFontMaterials(new BABYLON.Color3(0.0815,0.162,0.8), 0.8);
            DialogSys.GOLD    = DialogSys.buildFontMaterials(new BABYLON.Color3(1,0.8136,0.2218) );
            DialogSys.RED     = DialogSys.buildFontMaterials(new BABYLON.Color3(1,0.0046,0.0286) );
            DialogSys.GREY    = DialogSys.buildFontMaterials(new BABYLON.Color3(0.5,0.5,0.5) );
            DialogSys.LT_GREY = DialogSys.buildFontMaterials(new BABYLON.Color3(0.6,0.6,0.6) );
            DialogSys.ORANGE  = DialogSys.buildFontMaterials(new BABYLON.Color3(1,0.5,0) );
            DialogSys.GREEN   = DialogSys.buildFontMaterials(new BABYLON.Color3(0.004,0.319,0.002) );
            // - - - - - - - -
            
            FontFactory.loadStockTypefaces(scene);
            DialogSys.CURRENT_FONT_MAT_ARRAY = DialogSys.WHITE;
        }
        /**
         * Build sets of materials for Letter generation.  Output should be to DialogSys.CURRENT_FONT_MAT_ARRAY,
         * prior to Letter creation.
         * 
         * @return {Array<BABYLON.StandardMaterial>}:
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         */
        public static buildFontMaterials(color : BABYLON.Color3, intensity = 1, alpha = 1) : Array<BABYLON.StandardMaterial> {
            var ret = new Array<BABYLON.StandardMaterial>(2);
            var mat = new BABYLON.StandardMaterial(color.toString() + "-3D", DialogSys._scene);
            mat.ambientColor  = color;
            mat.diffuseColor  = (intensity === 1) ? color : new BABYLON.Color3(color.r * intensity, color.g * intensity, color.b * intensity);
            mat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
            mat.specularPower = 80;
            mat.alpha = alpha;
            ret[0] = mat;
            
            mat = mat.clone(color.toString() + "-2D");
            mat.backFaceCulling = false;
            ret[1] = mat;
            return ret;
        }
        
        public static displayPanel(panel : BasePanel) : void{
            // prep new panel, except for layer
            
            // suspend current container, if showing
            if (DialogSys._dialogStack.length > 0){
                DialogSys._dialogStack[DialogSys._dialogStack.length - 1].setLayerMask(DialogSys.SUSPENDED_DIALOG_LAYER);
            }
            
            // push & show
            DialogSys._dialogStack.push(panel);
            panel.setLayerMask(DialogSys.ACTIVE_DIALOG_LAYER);
        }
        
        public static get Version(): string {
            return "1.0.0";
        }
    }
}