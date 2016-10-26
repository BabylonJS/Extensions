/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
module QI{
   /**
    * Class to store MotionEvent info & evaluate how complete it should be.
    */
    export class MotionEvent {
        // Constants
        public static LINEAR = new SteppedPace([1.0], [1.0]);

        private _syncPartner : MotionEvent; // not part of constructor, since cannot be in both partners constructors, use setSyncPartner()

        // time and state management members
        private _startTime = -1;
        private _millisSoFar : number;
        private _currentDurationRatio = MotionEvent._COMPLETE;

        // wallclock prorating members, used for acceleration / deceleration across EventSeries runs
        private _proratedMilliDuration : number;
        private _proratedMillisBefore  : number;

        // misc
        public _groupName = PovProcessor.POV_GROUP_NAME;  // for multi group event series as in MORPH
        public muteSound = false;  // primarily for Voice-sync developer, no actual sound when in the process of recording

        /**
         * Take in all the motion event info.  Movement & rotation are both optional, but both being null is usually for sub-classing.
         *
         * @param {number} _milliDuration - The number of milli seconds the event is to be completed in
         * @param {number} _millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
         *                 When negative, no delay if being repeated in an EventSeries
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null
         *                  flipBack-twirlClockwise-tiltRight
         * @param {boolean} absNotPov - move and rotation are absolute values, not POV (default false)
         * @param {Pace} _pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
         * @param {BABYLON.Sound} _sound - Optional sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        constructor(
            private _milliDuration : number,
            private _millisBefore  : number,
            public  movePOV        : BABYLON.Vector3,
            public  rotatePOV      : BABYLON.Vector3 = null,
            public  absNotPov?     : boolean,
            private _pace          : Pace = MotionEvent.LINEAR,
            private _sound?        : BABYLON.Sound)
        {
            // argument validations
            if (this._milliDuration <= 0){
                BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
                return;
            }

            this.setProratedWallClocks(1, false); // ensure values actually used for timings are initialized
        }

        public toString() : string {
            return "group: " + this._groupName +
                   ", duration: " + this._milliDuration +
                   ", wait: " + this._millisBefore +
                   ", move: " + (this.movePOV ? this.movePOV.toString() : "None") +
                   ", rotate: " + (this.rotatePOV ? this.rotatePOV.toString() : "None");
        }
        // =================================== run time processing ===================================
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        public activate(lateStartMilli = 0) : void {
            this._startTime = TimelineControl.Now;
            if (lateStartMilli > 0){
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner || (this._sound && !this.muteSound) ) ? MotionEvent._BLOCKED :
                                         ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        }

        /** called to determine how much of the Event should be performed right now */
        public getCompletionMilestone() : number {
            if (this._currentDurationRatio === MotionEvent._COMPLETE){
                return MotionEvent._COMPLETE;
            }

            // BLOCK only occurs when there is a sync partner or sound
            if (this._currentDurationRatio === MotionEvent._BLOCKED){
                if (this._sound && !this.muteSound){
                    if (this._sound["_isReadyToPlay"]){
                        this._startTime = TimelineControl.Now; // reset the start clocks
                        this._currentDurationRatio = MotionEvent._WAITING;
                    }
                    else return MotionEvent._BLOCKED;
                }

                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner){
                    if (this._syncPartner.isBlocked() ){
                        this._startTime = TimelineControl.Now; // reset the start clocks
                        this._currentDurationRatio = MotionEvent._WAITING;
                        this._syncPartner._syncReady(this._startTime);
                    }
                    else return MotionEvent._BLOCKED;
                }
            }

            this._millisSoFar = TimelineControl.Now - this._startTime;

            if (this._currentDurationRatio === MotionEvent._WAITING){
                var overandAbove = this._millisSoFar - this._proratedMillisBefore;
                if (overandAbove >= 0){
                    this._startTime = TimelineControl.Now - overandAbove;  // prorate start for time served
                    this._millisSoFar = overandAbove;

                    if (this._sound && !this.muteSound){
                        this._sound.setPlaybackRate(TimelineControl.Speed);
                        this._sound.play();
                    }
                }
                else return MotionEvent._WAITING;
            }

            this._currentDurationRatio = this._millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;

            return this._pace.getCompletionMilestone(this._currentDurationRatio);;
        }
        // =================================== pause resume methods ===================================
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        public resumePlay() : void {
            if (this._currentDurationRatio === MotionEvent._COMPLETE ||
                this._currentDurationRatio === MotionEvent._BLOCKED) return;

            var before = this._startTime;

            // back into a start time which reflects the millisSoFar
            this._startTime = TimelineControl.Now - this._millisSoFar;
        }

        public pause() : void {
            if (this._sound && !this.muteSound) this._sound.pause();
        }
        // =================================== sync partner methods ===================================
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         * There is no need to call this on both partners, since this call sets both to each other.
         */
        public setSyncPartner(syncPartner : MotionEvent) : void {
            this._syncPartner = syncPartner;
            syncPartner._syncPartner = this;
        }
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        private _syncReady(startTime : number) : void {
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
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
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
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of MotionEvent, for the convenience of queuing delays, starting sounds capable
     */
    export class Stall extends MotionEvent {
        /**
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in.
         * @param {string} groupName - The processor / queue to have the stall.  Useful for EventSeries involving multiple groups.
         * @param {BABYLON.Sound} sound - Optional sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        constructor(milliDuration : number, groupName = PovProcessor.POV_GROUP_NAME, sound? : BABYLON.Sound){
            super(milliDuration, 0,  null, null, false, MotionEvent.LINEAR, sound);
            this._groupName = groupName;

        }
    }
}