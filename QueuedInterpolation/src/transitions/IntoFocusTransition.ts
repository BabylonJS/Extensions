/// <reference path="./SceneTransition.ts"/>

/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>

module QI{
    export class IntoFocusTransition implements Transition {
        public static NAME = "INTO_FOCUS";
        private static _INITIAL_KERNEL = 200;
        private static _DEFAULT_MILLIS = 5000;
        
        private _sound : BABYLON.Sound;
        
        /**
         * Transition implementation
         */
        public initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound) : void {
            SceneTransition.makeAllVisible(meshes);
            
            // set up post processes
            var camera = QI.TimelineControl.scene.activeCamera || QI.TimelineControl.scene.activeCameras[0];

            var postProcess0 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), IntoFocusTransition._INITIAL_KERNEL, 1.0, camera);
            var postProcess1 = new BABYLON.BlurPostProcess("Vertical blur"  , new BABYLON.Vector2(0, 1.0), IntoFocusTransition._INITIAL_KERNEL, 1.0, camera);
            
            // account for overriding
            var time  = overriddenMillis ? overriddenMillis : IntoFocusTransition._DEFAULT_MILLIS;
            var sound = overriddenSound  ? overriddenSound  : this._sound;
            
            var options : IMotionEventOptions = { pace : new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent : true };
            if (sound)
                options.sound = sound;
            
            var callBack = function (ratioComplete) {
                postProcess0.kernel = IntoFocusTransition._INITIAL_KERNEL * (1 - ratioComplete);
                postProcess1.kernel = IntoFocusTransition._INITIAL_KERNEL * (1 - ratioComplete);
            };
            var event = new QI.RecurringCallbackEvent(callBack, time, options);

            var dispose = function () {
                postProcess0.dispose();
                postProcess1.dispose();
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        }
    }
    // code to run on module load, registering of the transition
    SceneTransition.EFFECTS[IntoFocusTransition.NAME] = new IntoFocusTransition(); 
}