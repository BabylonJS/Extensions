/// <reference path="./EventSeries.ts"/>
/// <reference path="./MotionEvent.ts"/>
module POV {
    export class BeforeRenderer implements SeriesTargetable {
        public static MAX_MILLIS_FOR_EVENT_LATE_START = 50;
        public static CHANGED_TABS_THRESHOLD = 200;
        
        // event series queue & reference vars for current series & step within
        private _queue = new Array<EventSeries>();
        public  _currentSeries : EventSeries = null;
        public  _currentStepInSeries : MotionEvent = null;
        private _endOfLastFrameTs = -1;
        public  _ratioComplete : number;
        
        // rotation control members
        private _doingRotation = false;
        private _rotationStartVec : BABYLON.Vector3;
        private _rotationEndVec   : BABYLON.Vector3;
        
        // position control members
        private _doingMovePOV = false;
        private _positionStartVec : BABYLON.Vector3;  // for lerp(ing) when NOT also rotating too
        private _positionEndVec   : BABYLON.Vector3;  // for lerp(ing) when NOT also rotating too
        private _fullAmtRight     : number;   // for when also rotating
        private _fullAmtUp        : number;   // for when also rotating
        private _fullAmtForward   : number;   // for when also rotating
        private _amtRightSoFar    : number;   // for when also rotating
        private _amtUpSoFar       : number;   // for when also rotating
        private _amtForwardSoFar  : number;   // for when also rotating
        
        // misc
        private _activeLockedCamera : any = null; // any, or would require casting to FreeCamera & no point in JavaScript
        public _name = "";  // for subclassing by MORPH
 
        /**
         * @param {BABYLON.Mesh} _mesh - Mesh to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing)
         */
        constructor(public _mesh : BABYLON.Mesh, private skipRegistration = false){            
            // tricky registering a prototype as a callback in constructor; cannot say 'this.incrementallyMove()' & must be wrappered
            if (!skipRegistration){
                var ref = this;
                this._mesh.registerBeforeRender(function(){ref._incrementallyMove();});
            }
        }
        // =================================== inside before render ==================================
        /**
         * beforeRender() registered to this._mesh.  Public for sub-classing in MORPH Module.
         */
        public _incrementallyMove() : void {
            // test for active instance pausing, either instance of entire system
            if (this._instancePaused || BeforeRenderer._systemPaused) return;
            
            // system active resume test
            if (this._lastResumeTime < BeforeRenderer._systemResumeTime){
                this._lastResumeTime = BeforeRenderer._systemResumeTime;
                this.resumePlay(); // does nothing when this._currentStepInSeries === null
            }

            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents() ){
                if (! this._nextEventSeries()) return;
            }
            
            // ok, have an active event series, now get the next motion event in series if required
            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete() ){
                var next : any = this._currentSeries.nextEvent(this._name);
                
                // being blocked, not ready for us, only occurs in a multi-group series in MORPH
                if (next === null) return;
                
                if (next instanceof BABYLON.Action){
                    (<BABYLON.Action> next).execute(BABYLON.ActionEvent.CreateNew(this._mesh));    
                }
                else if (typeof next === "function"){
                    next.call();
                }
                else{
                   this._nextEvent(<MotionEvent> next);  // must be a new MotionEvent. _currentStepInSeries assigned if valid
                }  
            }
            
            // ok, have a motion event to process
            // detect switched tabs & now back
            if (this._currentStepInSeries.isExecuting() && BABYLON.Tools.Now - this._endOfLastFrameTs > BeforeRenderer.CHANGED_TABS_THRESHOLD){
                this.resumePlay();
                this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
            }

            this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
            if (this._ratioComplete < 0) return; // MotionEvent.BLOCKED or MotionEvent.WAITING
                        
            if (this._doingRotation){
                this._mesh.rotation = BABYLON.Vector3.Lerp(this._rotationStartVec, this._rotationEndVec, this._ratioComplete);
            }
            
            if (this._doingMovePOV){
                if (this._doingRotation){
                    // some of these amounts, could be negative, if has a Pace with a hiccup
                    var amtRight   = (this._fullAmtRight   * this._ratioComplete) - this._amtRightSoFar;
                    var amtUp      = (this._fullAmtUp      * this._ratioComplete) - this._amtUpSoFar;
                    var amtForward = (this._fullAmtForward * this._ratioComplete) - this._amtForwardSoFar;
                    
                    this._mesh.movePOV(amtRight, amtUp, amtForward);
                    
                    this._amtRightSoFar   += amtRight;
                    this._amtUpSoFar      += amtUp;
                    this._amtForwardSoFar += amtForward;
                    
                }else{
                    this._mesh.position = BABYLON.Vector3.Lerp(this._positionStartVec, this._positionEndVec, this._ratioComplete);
                }
                
                if (this._activeLockedCamera !== null) this._activeLockedCamera._getViewMatrix();
            }
            this._endOfLastFrameTs = BABYLON.Tools.Now;       
        }
       
        // ============================ Event Series Queueing & retrieval ============================
        /**
         * PovSeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         */
        public queueEventSeries(eSeries : EventSeries) :void {
            this._queue.push(eSeries);
        }
    
        private _nextEventSeries() : boolean {
            var ret = this._queue.length > 0;
            if (ret){
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name);
            }else
                this._currentSeries = null;
            
            // clean out current step in any case, aids un-neccessary resulePlay of a completed step
            this._currentStepInSeries = null;
            
            return ret;
        }
        // ======================================== event prep =======================================    
        /**
         * Public for sub-classing in MORPH Module.
         * @param {MotionEvent} event - The event processed and assigned the current step 
         */
        public _nextEvent(event : MotionEvent) : void {
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = BABYLON.Tools.Now - this._endOfLastFrameTs;
            event.activate((lateStart - this._endOfLastFrameTs < BeforeRenderer.MAX_MILLIS_FOR_EVENT_LATE_START && !this._currentSeries.hasMultipleParticipants()) ? lateStart : 0);
            
            this._currentStepInSeries = event;

            // prepare for rotation, if event calls for
            this._doingRotation = event.rotatePOV !== null;
            if (this._doingRotation){
                this._rotationStartVec = this._mesh.rotation; // no clone required, since Lerp() returns a new Vec3 written over .rotation
                this._rotationEndVec   = this._rotationStartVec.add(this._mesh.calcRotatePOV(event.rotatePOV.x, event.rotatePOV.y, event.rotatePOV.z));
            }
            
            // prepare for POV move, if event calls for
            this._doingMovePOV = event.movePOV !== null;
            if (this._doingMovePOV){
                this._fullAmtRight   = event.movePOV.x; this._amtRightSoFar   = 0;
                this._fullAmtUp      = event.movePOV.y; this._amtUpSoFar      = 0;
                this._fullAmtForward = event.movePOV.z; this._amtForwardSoFar = 0;
                
                // less resources to calcMovePOV() once then Lerp(), but calcMovePOV() uses rotation, so can only go fast when not rotating too
                if (!this._doingRotation){
                    this._positionStartVec = this._mesh.position; // no clone required, since Lerp() returns a new Vec3 written over .position
                    this._positionEndVec   = this._positionStartVec.add(this._mesh.calcMovePOV(this._fullAmtRight, this._fullAmtUp, this._fullAmtForward));
                }
            }
            
            // determine if camera needs to be woke up for tracking
            this._activeLockedCamera = null; // assigned for failure
            
            if (this._doingRotation || this._doingMovePOV){
                var activeCamera = <any> this._mesh.getScene().activeCamera;
                if(activeCamera.lockedTarget && activeCamera.lockedTarget === this._mesh)
                     this._activeLockedCamera = activeCamera;
            }
        }
        // =================================== SYSTEM play - pause ===================================
        // pause & resume statics
        private static _systemResumeTime = 0;
        private static _systemPaused = false;
        
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        public static isSystemPaused() : boolean { return BeforeRenderer._systemPaused; }
        public static pauseSystem(){ BeforeRenderer._systemPaused = true; }        
        
        public static resumeSystem(){
            BeforeRenderer._systemPaused = false;
            BeforeRenderer._systemResumeTime = BABYLON.Tools.Now;
        }
        // ================================== INSTANCE play - pause ==================================
        private _lastResumeTime = 0; // for passive detection of game pause
        private _instancePaused = false;
        
        public isPaused() : boolean { return this._instancePaused; }
        public pausePlay(){ this._instancePaused = true; }       
        
        public resumePlay() : void {
            this._lastResumeTime = BABYLON.Tools.Now; 
            this._instancePaused = false;
            // cause Event in progress to calibrate for smooth resume
            if (this._currentStepInSeries !== null) this._currentStepInSeries.resumePlay();
        }
        // ========================================= Statics =========================================
        public static get Version(): string {
            return "1.0.0";
        }
    }
}