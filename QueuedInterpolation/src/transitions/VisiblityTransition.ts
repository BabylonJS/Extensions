/// <reference path="./SceneTransition.ts"/>

/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>

module QI{
    export class VisiblityTransition implements Transition {
        public static NAME = "VISIBLITY";
        private static _DEFAULT_MILLIS = 5000;
        
        private _sound : BABYLON.Sound;
        private _meshes : Array<BABYLON.AbstractMesh>;
        
        /**
         * Transition implementation
         */
        public initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound) : void {
            SceneTransition.makeAllVisible(meshes);
            this._meshes = meshes;
            
            // set up post processes
            var camera = QI.TimelineControl.scene.activeCamera || QI.TimelineControl.scene.activeCameras[0];
            
            // account for overriding
            var time  = overriddenMillis ? overriddenMillis : VisiblityTransition._DEFAULT_MILLIS;
            var sound = overriddenSound  ? overriddenSound  : this._sound;
            
            var options : IMotionEventOptions = { pace : new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent : true };
            if (sound)
                options.sound = sound;
            
            var ref = this;
            var callBack = function (ratioComplete) {
                ref._changeVisiblity(ratioComplete, ref._meshes);
            };
            var event = new QI.RecurringCallbackEvent(callBack, time, options);
                
            var dispose = function () {
                ref._meshes = null;
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        }
        
        private _changeVisiblity(ratioComplete : number, meshes : Array<BABYLON.AbstractMesh>) : void {
            for (var i = 0, mLen = meshes.length; i < mLen; i++) {
                var mesh = meshes[i];
                mesh.visibility = ratioComplete;
                var children = <Array<BABYLON.AbstractMesh>> mesh.getChildMeshes();
                if (children.length > 0)
                    this._changeVisiblity(ratioComplete, children);
            }
        }
    }
    // code to run on module load, registering of the transition
    SceneTransition.EFFECTS[VisiblityTransition.NAME] = new VisiblityTransition(); 
}