/// <reference path="./Pace.ts"/>
module POV{
   /**
    * Class to store MotionEvent info & evaluate how complete it should be.
    */
    export class MotionEvent {
        private _syncPartner : MotionEvent; // not part of constructor, since cannot be in both partners constructors, use setSyncPartner()

        // time and state management members
        private _startTime = -1;
        private _currentDurationRatio = MotionEvent._COMPLETE;
        
        // wallclock prorating members, used for acceleration / deceleration across EventSeries runs
        private _proratedMilliDuration : number;
        private _proratedMillisBefore : number;

        /**
         * Take in all the motion event info.  Movement & rotation are both optional, but both being null usually for sub-classing.
         * 
         * @param {number} _milliDuration - The number of milli seconds the event is to be completed in
         * @param {number} _millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
         *                 When negative, no delay if being repeated in an EventSeries
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null
         *                  flipBack-twirlClockwise-tiltRight
         * @param {Pace} _pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
         */
        constructor(
            private _milliDuration      : number, 
            private _millisBefore       : number, 
            public  movePOV             : BABYLON.Vector3, 
            public  rotatePOV           : BABYLON.Vector3,  
            private _pace               : Pace = Pace.LINEAR)
        {
            // argument validations
            if (this._milliDuration <= 0) BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
            
            this.setProratedWallClocks(1, false); // ensure values actually used for timings are initialized
        }
        // =================================== run time processing ===================================    
        /**
         * Indicate readiness by caller to start processing event.  
         * @param {number} lateStartMilli - indication of how far already behind 
         */
        public activate(lateStartMilli = 0) : void {
            this._startTime = BABYLON.Tools.Now;
            if (lateStartMilli > 0){
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner) ? MotionEvent._BLOCKED : 
                                         ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        }
    
        /** called to determine how much of the Event should be performed right now */
        public getCompletionMilestone() : number {
            if (this._currentDurationRatio === MotionEvent._COMPLETE){
                return MotionEvent._COMPLETE;
            }

            // BLOCK only occurs when there is a sync partner
            if (this._currentDurationRatio === MotionEvent._BLOCKED){                
                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner.isBlocked() ){
                    this._startTime = BABYLON.Tools.Now; // reset the start clock
                    this._currentDurationRatio = MotionEvent._WAITING;
                    this._syncPartner.syncReady(this._startTime);
                }
                else return MotionEvent._BLOCKED;
            }
        
            var millisSoFar = BABYLON.Tools.Now - this._startTime;
        
            if (this._currentDurationRatio === MotionEvent._WAITING){
                millisSoFar -= this._proratedMillisBefore;
                if (millisSoFar >= 0){
                    this._startTime = BABYLON.Tools.Now - millisSoFar;  // prorate start for time served   
                }
                else return MotionEvent._WAITING;
            }
        
            this._currentDurationRatio = millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;
        
            return this._pace.getCompletionMilestone(this._currentDurationRatio);
        }
       
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        public resumePlay() : void {
            if (this._currentDurationRatio === MotionEvent._COMPLETE ||
                this._currentDurationRatio === MotionEvent._BLOCKED  ||
                this._currentDurationRatio === MotionEvent._COMPLETE) return;
            
            // back into a start time which reflects the currentDurationRatio
            this._startTime = BABYLON.Tools.Now - (this._proratedMilliDuration * this._currentDurationRatio);            
        }
        // =================================== sync partner methods ===================================    
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         */
        public setSyncPartner(syncPartner : MotionEvent) : void{
            this._syncPartner = syncPartner;            
        }
        /** 
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  Only intended to be called from getCompletionMilestone() of the partner.
         * 
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        public syncReady(startTime : number) : void{
            this._startTime = startTime;
            this._currentDurationRatio = MotionEvent._WAITING;
        }
        // ==================================== Getters & setters ====================================    
        public isBlocked  () : boolean { return this._currentDurationRatio === MotionEvent._BLOCKED ; }
        public isWaiting  () : boolean { return this._currentDurationRatio === MotionEvent._WAITING ; }
        public isComplete () : boolean { return this._currentDurationRatio === MotionEvent._COMPLETE; }
        public isExecuting() : boolean { return this._currentDurationRatio >   MotionEvent._READY && this._currentDurationRatio < MotionEvent._COMPLETE; }
       
        public getMilliDuration() : number { return this._milliDuration; }      
        public getMillisBefore() : number { return this._millisBefore; }     
        public getPace() : Pace {return this._pace; }
        public getSyncPartner() : MotionEvent{return this._syncPartner; }
       
        /**
         * Called by EventSeries, before MotionEvent is return by series.  This is to support 
         * acceleration / deceleration across event series repeats.
         * 
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         */
        public setProratedWallClocks(factor : number, isRepeat : boolean) : void {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = (this._millisBefore > 0 || !isRepeat) ? Math.abs(this._millisBefore) * factor : 0;
        }
        // ========================================== Enums  =========================================    
        private static _BLOCKED  = -20;
        private static _WAITING  = -10;
        private static _READY    =   0;
        private static _COMPLETE =   1;

        public static get BLOCKED (): number { return MotionEvent._BLOCKED ; }
        public static get WAITING (): number { return MotionEvent._WAITING ; }
        public static get READY   (): number { return MotionEvent._READY   ; }
        public static get COMPLETE(): number { return MotionEvent._COMPLETE; }
    }
}