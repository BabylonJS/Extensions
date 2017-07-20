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
         * uses an option runUnPrivileged
         */
        public initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound, options?) : void {
            this._meshes = meshes;
            
            // avoid a flash of being fully visible for a frame sometimes
            this._changeVisiblity(0, meshes);
            
            // account for overriding
            var time  = overriddenMillis ? overriddenMillis : VisiblityTransition._DEFAULT_MILLIS;
            var sound = overriddenSound  ? overriddenSound  : this._sound;
            var isPrivledged = (options && options.runUnPrivileged) ? false : true; 
            
            var eventOptions : IMotionEventOptions = { pace : new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent : isPrivledged };
            if (sound)
                eventOptions.sound = sound;
            
            var ref = this;
            var callBack = function (ratioComplete) {
                ref._changeVisiblity(ratioComplete, ref._meshes);
            };
            var event = new QI.RecurringCallbackEvent(callBack, time, eventOptions);
                
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