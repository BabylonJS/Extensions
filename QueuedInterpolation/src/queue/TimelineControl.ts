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
        private static _lastRun = 0; // used to detect changed tabs stop
        private static _frameID = 0; // useful for new in frame detection
        private static _resumeQueued = false;
        public  static CHANGED_TABS_THRESHOLD = 500; // milli sec
        
        public  static _engine : BABYLON.Engine;  // only used for MP4 recordings
        public  static MP4Worker : Worker;
                
        /** called by PovProcessor constructor */
        public static initialize(scene : BABYLON.Scene){
            if (!TimelineControl._afterRenderAssigned){
                scene.registerAfterRender(TimelineControl._manualAdvanceAfterRender);     
                
                // built-in hooks for CocoonJS
                if (navigator.isCocoonJS){
                    Cocoon.App.on("activated" , TimelineControl.resumeSystem );
                    Cocoon.App.on("suspending", TimelineControl.pauseSystem  );
                }
                
                TimelineControl._engine = scene.getEngine();
                TimelineControl._afterRenderAssigned = true;
                BABYLON.Tools.Log("Queued Interpolation Timeline Control system initialized, version: " + PovProcessor.Version);      
            }            
        }
        
        public static change(isRealTime : boolean, rateIfManual = 24) : void {
            TimelineControl._isRealtime = isRealTime;
            TimelineControl._manualFrameRate = rateIfManual;
        }
        
        private static _manualAdvanceAfterRender() : void {           
            if (!TimelineControl._systemPaused || TimelineControl._resumeQueued){
                    TimelineControl._frameID++;
                  
                    // assign a new Now based on whether realtime or not
                    if (TimelineControl._isRealtime){ 
                        TimelineControl._now = BABYLON.Tools.Now;
                        
                    } else TimelineControl._now += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance
                
                // process a resume with a good 'Now'
                // The system might not officially have been paused, rather browser tab switched & now switched back
                if ( TimelineControl._resumeQueued || BABYLON.Tools.Now - TimelineControl._lastRun > TimelineControl.CHANGED_TABS_THRESHOLD) {
                    TimelineControl._systemPaused = TimelineControl._resumeQueued = false;
                    TimelineControl._systemResumeTime = TimelineControl._now;
                
                // optionally capture frame, when not realtime & MP4Worker
                }else if (!TimelineControl._isRealtime && TimelineControl.MP4Worker) {
                    var screen = TimelineControl._engine.readPixels(0, 0, TimelineControl._engine.getRenderWidth(), TimelineControl._engine.getRenderHeight() );
                    // . . .
                }
            }
            TimelineControl._lastRun = BABYLON.Tools.Now;
        }
        
        public static sizeFor720 () : void { TimelineControl._sizeForRecording(1280,  720); }
        public static sizeFor1080() : void { TimelineControl._sizeForRecording(1920, 1080); }
        
        private static _sizeForRecording(width : number, height : number){
            TimelineControl._engine.setSize(width, height);
        }
        
        // =========================================== Gets ==========================================
        public static get manualFrameRate() : number  { return TimelineControl._manualFrameRate; }
        public static get isRealtime     () : boolean { return TimelineControl._isRealtime; }
        public static get Now            () : number  { return TimelineControl._now; }
        public static get FrameID        () : number  { return TimelineControl._frameID; }
        // =================================== SYSTEM play - pause ===================================
        // pause & resume statics
        private static _systemResumeTime = 0;
        private static _systemPaused = false;
        
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        public static get isSystemPaused() : boolean { return TimelineControl._systemPaused; }
        public static pauseSystem() : void { TimelineControl._systemPaused = true; }        
        
        public static resumeSystem() : void {
           // since Now is computed in an after renderer, resumes are queued. Processing a call to resumeSystem directly would have a stale 'Now'.
           TimelineControl._resumeQueued = true;
        }
        public static get SystemResumeTime() : number { return TimelineControl._systemResumeTime; }
    }
}