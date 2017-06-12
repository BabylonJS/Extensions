/// <reference path="./SceneTransition.ts"/>

/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>

module QI{
    export class ToColorTransition implements Transition {
        public static NAME = "TO_COLOR";
        private static _DEFAULT_MILLIS = 5000;
        
        private _sound : BABYLON.Sound;
        
        /**
         * Transition implementation
         */
        public initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound) : void {
            SceneTransition.makeAllVisible(meshes);
            
            // set up post processes
            var camera = QI.TimelineControl.scene.activeCamera || QI.TimelineControl.scene.activeCameras[0];

            var postProcess = new BABYLON.BlackAndWhitePostProcess("WelcomeToWonderLand", 1.0, camera);
            
            // account for overriding
            var time  = overriddenMillis ? overriddenMillis : ToColorTransition._DEFAULT_MILLIS;
            var sound = overriddenSound  ? overriddenSound  : this._sound;
            
            var options : IMotionEventOptions = { pace : new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent : true };
            if (sound)
                options.sound = sound;
            
            var callBack = function (ratioComplete) {
                postProcess.degree = ratioComplete;
            };
            var event = new QI.PropertyEvent(postProcess, "degree", 0, time, options);
                   
            var dispose = function () {
                postProcess.dispose();
            };
            event.alsoClean(dispose);
            event.initialize(0, QI.TimelineControl.scene);
        }
    }
    // code to run on module load, registering of the transition
    SceneTransition.EFFECTS[ToColorTransition.NAME] = new ToColorTransition(); 
}