/// <reference path="../queue/NonMotionEvents.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>
/// <

module QI {
    export interface Transition {
        initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound, options?) : void;
    }
    
    export class SceneTransition {
        /**
         * Using a static dictionary to get transitions, so that custom transitions not included can be referenced.
         * Stock transitions already loaded.
         */
        public static EFFECTS : { [name: string] : Transition; } = {};
               
        /**
         * This is the entry point call in the Tower of Babel generated code once all textures are buffered.
         */
        public static perform(sceneTransitionName : string, meshes : Array<BABYLON.AbstractMesh>, overriddenMillis? : number, overriddenSound? : BABYLON.Sound, options?) : void {
            var effect = SceneTransition.EFFECTS[sceneTransitionName];
            if (!effect) throw "No such scene transition: " + sceneTransitionName;
            
            SceneTransition.makeAllVisible(meshes);
            effect.initiate(meshes, overriddenMillis, overriddenSound, options);
        }
        
        public static makeAllVisible(meshes : Array<BABYLON.AbstractMesh>) : void {
            for (var i = 0, mLen = meshes.length; i < mLen; i++) {
                var mesh = meshes[i];
                if (mesh instanceof QI.Mesh) (<QI.Mesh> mesh).makeVisible(true, true); // also resumes event queued, which is always initially paused
                else {
                    var children = mesh.getChildMeshes();
                    mesh.isVisible = true;
                    for (var j = 0, cLen = children.length; j < cLen; j++) {
                        children[i].isVisible = true;
                    }
                }
            }
        }
    }
}