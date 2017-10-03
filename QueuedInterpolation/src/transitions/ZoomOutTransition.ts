/// <reference path="./SceneTransition.ts"/>

/// <reference path="../queue/Pace.ts"/>
/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>

module QI{
    export class ZoomOutTransition implements Transition {
        public static NAME = "FLASHBACK";
        private static _DEFAULT_MILLIS = 5000;
        
        private _sound : BABYLON.Sound;
        private _meshes : Array<BABYLON.AbstractMesh>;
        
        /**
         * Transition implementation
         * uses an option runUnPrivileged
         */
        public initiate(meshes : Array<BABYLON.AbstractMesh>, overriddenMillis : number, overriddenSound : BABYLON.Sound) : void {
            var camera = meshes[0].getScene().activeCamera;
            if (!camera) camera = meshes[0].getScene().activeCameras[0];
            var finalFOV = camera.fov;
            
            camera.fov = .05; // super wide 630 mm focal length
            
            // account for overriding
            var time  = overriddenMillis ? overriddenMillis : ZoomOutTransition._DEFAULT_MILLIS;
            var sound = overriddenSound  ? overriddenSound  : this._sound;
            
            var options : IMotionEventOptions = { pace : new QI.SinePace(QI.Pace.MODE_INOUT), privilegedEvent : true };
            if (sound)
                options.sound = sound;
            
            var event = new QI.PropertyEvent(camera, "fov", finalFOV, time, options);
                
            event.initialize(0, QI.TimelineControl.scene);
        }        
    }
    // code to run on module load, registering of the transition
    SceneTransition.EFFECTS[ZoomOutTransition.NAME] = new ZoomOutTransition(); 
}