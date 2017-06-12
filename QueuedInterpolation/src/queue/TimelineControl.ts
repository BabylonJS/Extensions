/// <reference path="./PovProcessor.ts"/>
module QI {
    /**
     * This class is used to provide a way to render at a precise frame rate, as opposed to realtime,
     * as well as system level play - pause.
     */
    export class TimelineControl{
        // ======================================= Mode Control ======================================
        private static _afterRenderAssigned: boolean;
        private static _manualFrameRate : number;
        private static _isRealtime = true;
        private static _now = BABYLON.Tools.Now;
        private static _privelegedNow = BABYLON.Tools.Now;
        private static _lastRun = BABYLON.Tools.Now;
        private static _lastFrame = BABYLON.Tools.Now;
        private static _frameID = 0; // useful for new in frame detection
        private static _resumeQueued = false;
        private static _speed = 1.0;  // applies only to realtime
        private static _scene : BABYLON.Scene;

        public  static MP4Worker : Worker;
        public  static CHANGED_TABS_THRESHOLD = 500; // milli sec

        /** called by PovProcessor constructor */
        public static initialize(scene : BABYLON.Scene){
            if (!TimelineControl._afterRenderAssigned){
                scene.registerAfterRender(TimelineControl._manualAdvanceAfterRender);

                // built-in hooks for CocoonJS
                if (navigator.isCocoonJS){
                    Cocoon.App.on("activated" , TimelineControl.resumeSystem );
                    Cocoon.App.on("suspending", TimelineControl.pauseSystem  );
                }

                TimelineControl._scene = scene
                TimelineControl._afterRenderAssigned = true;
                BABYLON.Tools.Log("Queued Interpolation Timeline Control system initialized, version: " + PovProcessor.Version);
            }
        }

        public static change(isRealTime : boolean, rateIfManual = 24) : void {
            TimelineControl._isRealtime = isRealTime;
            TimelineControl._manualFrameRate = rateIfManual;
        }

        private static _manualAdvanceAfterRender() : void {
            // realtime elapsed & set up for "next" elapsed
            var elapsed = BABYLON.Tools.Now - TimelineControl._lastFrame;
            TimelineControl._lastFrame = BABYLON.Tools.Now;
            
            if (!TimelineControl._systemPaused || TimelineControl._resumeQueued){
                TimelineControl._frameID++;

                // assign a new Now based on whether realtime or not
                if (TimelineControl._isRealtime){
                    TimelineControl._now += elapsed * TimelineControl._speed;

                } else TimelineControl._now += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance

                // process a resume with a good 'Now'
                // The system might not officially have been paused, rather browser tab switched & now switched back
                if ( TimelineControl._resumeQueued || BABYLON.Tools.Now - TimelineControl._lastRun > TimelineControl.CHANGED_TABS_THRESHOLD) {
                    TimelineControl._systemPaused = TimelineControl._resumeQueued = false;
                    TimelineControl._systemResumeTime = TimelineControl._now;

                // optionally capture frame, when not realtime & MP4Worker
                }else if (!TimelineControl._isRealtime && TimelineControl.MP4Worker) {
                    var engine = TimelineControl._scene.getEngine();
                    var screen = engine.readPixels(0, 0, engine.getRenderWidth(), engine.getRenderHeight() );
                    // . . .
                }
            }
            
            // always assign the privileged time, which is not subject to stopping
            if (TimelineControl._isRealtime){
                TimelineControl._privelegedNow += elapsed * TimelineControl._speed;

            } else TimelineControl._privelegedNow += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance

            // record last time after render processed regardless of paused or not; used to detect tab change
            TimelineControl._lastRun = BABYLON.Tools.Now;
        }
        
        public static sizeFor720 () : void { TimelineControl._sizeForRecording(1280,  720); }
        public static sizeFor1080() : void { TimelineControl._sizeForRecording(1920, 1080); }

        private static _sizeForRecording(width : number, height : number){
            TimelineControl._scene.getEngine().setSize(width, height);
        }

        // =========================================== Gets ==========================================
        public static get manualFrameRate() : number        { return TimelineControl._manualFrameRate; }
        public static get isRealtime     () : boolean       { return TimelineControl._isRealtime; }
        public static get Now            () : number        { return TimelineControl._now; }
        public static get PrivilegedNow  () : number        { return TimelineControl._privelegedNow; }
        public static get FrameID        () : number        { return TimelineControl._frameID; }
        public static get Speed          () : number        { return TimelineControl._speed; }
        public static get scene          () : BABYLON.Scene { return TimelineControl._scene; }
        
        public static set Speed          (newSpeed : number) {
            if (!TimelineControl._isRealtime){
                BABYLON.Tools.Error("TimelineControl: changing speed only supported for realtime mode");
                return;
            }

            TimelineControl._speed = newSpeed;

            // reset the speed of all sound tracks
            var tracks = TimelineControl._scene.mainSoundTrack.soundCollection;
            for (var i = 0, len = tracks.length; i < len; i++) {
                tracks[i].setPlaybackRate(newSpeed);
            }
        }
        // =================================== SYSTEM play - pause ===================================
        // pause & resume statics
        private static _systemResumeTime = 0;
        private static _systemPaused = false;

        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        public static get isSystemPaused() : boolean { return TimelineControl._systemPaused; }
        public static pauseSystem(needPrivilegedSound ? : boolean) : void { 
            TimelineControl._systemPaused = true;

             // disable the audio system
            TimelineControl._scene.audioEnabled = needPrivilegedSound;
        }

        public static resumeSystem() : void {
           // since Now is computed in an after renderer, resumes are queued. Processing a call to resumeSystem directly would have a stale 'Now'.
           TimelineControl._resumeQueued = true;

            // resume the audio system
            TimelineControl._scene.audioEnabled = true;
        }
        public static get SystemResumeTime() : number { return TimelineControl._systemResumeTime; }
    }
}