/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
module QI{
    /**
     * MotionEvent options. This helps customizing the behaviour of the event.
     */
    export interface IMotionEventOptions {
        /**
         * Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         * When negative, no delay if being repeated in an EventSeries.
         */
        millisBefore? : number;

        /**
         * Movement arg is an absolute value, not POV (default false).
         */
        absoluteMovement?: boolean;

        /**
         * Rotation arg is an absolute value, not POV (default false).
         */
        absoluteRotation?: boolean;

        /**
         * Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR).
         */
        pace?: Pace;

        /**
         * Sound to start with event.
         */
        sound?: BABYLON.Sound;

        /**
         * A way to serialize events from different queues e.g. shape key & skeleton.
         */
        requireCompletionOf?: MotionEvent;

        /**
         * Calc the full amount of movement from Node's original position / rotation,
         * rather than stepwise (default false).  No meaning when no rotation in event.
         */
        noStepWiseMovement?: boolean;

        /**
         * Shapekeys Only:
         * Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         * If null, shape key group setting used.
         */
        mirrorAxes? : string;

        /**
         * Skeletons Only:
         * Subposes which should be substituted during event (default null).
         */
        subposes? : string[];

        /**
         * Skeletons Only:
         * Should any sub-poses previously applied should be subtracted during event (default false)
         */
        revertSubposes?: boolean;
        
        /**
         * NonMotionEvents Only, when not running from a Queue:
         * Support for SceneTransitions, which can then system pause while running (default false)
         */
        privilegedEvent?: boolean;
    }

   /**
    * Class to store MotionEvent info & evaluate how complete it should be.
    */
    export class MotionEvent {
        // Constants
        public static LINEAR = new SteppedPace([1.0], [1.0]);

        private _syncPartner : MotionEvent; // not part of constructor, since cannot be in both partners constructors, use setSyncPartner()
        public options : IMotionEventOptions;
        private _noOptions : boolean;

        // time and state management members
        private _startTime = -1;
        private _millisSoFar : number;
        private _currentDurationRatio = MotionEvent._BLOCKED;

        // wallclock prorating members, used for acceleration / deceleration across EventSeries runs
        private _proratedMilliDuration : number;
        private _proratedMillisBefore  : number;

        // misc
        public _groupName = PovProcessor.POV_GROUP_NAME;  // For a multi group event series.  Overridden by PoseProcessor & ShapeKeyGroup.
        public muteSound = false;  // no actual sound when in the process of recording

        /**
         * Take in all the motion event info.  Movement & rotation are both optional, but both being null is usually for sub-classing.
         *
         * @param {number} _milliDuration - The number of milli seconds the event is to be completed in.
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null.
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed (optional).
         *                  flipBack-twirlClockwise-tiltRight

         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         * 
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event (default false)
         * 
         *      privilegedEvent - NonMotionEvents Only, when not running from a Queue:
         *                        Support for SceneTransitions, which can then system pause while running (default false)
         */
        constructor(
            private _milliDuration : number,
            public  movePOV        : BABYLON.Vector3,
            public  rotatePOV      : BABYLON.Vector3 = null,
            options?               : IMotionEventOptions)
        {
            // argument validations
            if (this._milliDuration <= 0){
                BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
                return;
            }

            // Adapt options
            this._noOptions = !options;
            this.options = options || {
                millisBefore: 0,
                absoluteMovement: false,
                absoluteRotation: false,
                pace: MotionEvent.LINEAR,
                sound: null,
                requireCompletionOf: null,
                noStepWiseMovement: false,
                mirrorAxes: null,
                subposes : null,
                revertSubposes : false,
                privilegedEvent : false
            };
            this.options.millisBefore = this.options.millisBefore || 0;
            this.options.absoluteMovement = this.options.absoluteMovement || false;
            this.options.absoluteRotation = this.options.absoluteRotation || false;
            this.options.pace = this.options.pace || MotionEvent.LINEAR;
            this.options.sound = this.options.sound || null;
            this.options.requireCompletionOf = this.options.requireCompletionOf || null;
            this.options.noStepWiseMovement = this.options.noStepWiseMovement || false;

            // subclass specific
            this.options.mirrorAxes = this.options.mirrorAxes || null;
            this.options.subposes = this.options.subposes || null;
            this.options.revertSubposes = this.options.revertSubposes || false;

            // ensure values actually used for timings are initialized
            this.setProratedWallClocks(1, false);
        }

        public toString() : string {
            var ret = "group: " + this._groupName + 
                     ", type: " + this.getClassName() + 
                     ", duration: " + this._milliDuration + 
                     ", wait: " + this.options.millisBefore +
                     ", pace: " + this.options.pace.getClassName();
            if (this.movePOV                    ) ret += ", move: " + this.movePOV.toString();
            if (this.rotatePOV                  ) ret += ", rotate: " + this.rotatePOV.toString();
            if (this.options.sound              ) ret += ", sound: " + this.options.sound.name;
            if (this.options.requireCompletionOf) ret += ", HAS mustComplete event";
            if (this.options.absoluteMovement   ) ret += ", absoluteMovement";
            if (this.options.absoluteRotation   ) ret += ", absoluteRotation: ";
            if (this.options.noStepWiseMovement ) ret += ", noStepWiseMovement: ";
            
            return ret;
        }
        
        /** override when millis, move, or rotate not needed */
        public toScript() : string {
            return this._toScriptImpl(true, true, true);
        }
        
        protected _toScriptImpl(needMillis : boolean, needMove : boolean, needRotate : boolean) : string { 
            var ret = "new QI." + this.getClassName() + "(";
            ret += this._toScriptCustomArgs();
            var first = this._toScriptCustomArgs() === "";
            
            if (needMillis) {
                if (!first) ret += ", "; else first = false;
                ret += this._milliDuration;
            }
            
            if (needMove) {
                if (!first) ret += ", "; else first = false;
                if (this.movePOV) 
                    ret += "new BABYLON.Vector3(" +this.movePOV.x + ", " + this.movePOV.y + ", " + this.movePOV.z + ")";
                else
                    ret += "null";
            }
            
            if (needRotate) {
                if (!first) ret += ", "; else first = false;
                if (this.rotatePOV) 
                    ret += "new BABYLON.Vector3(" +this.rotatePOV.x + ", " + this.rotatePOV.y + ", " + this.rotatePOV.z + ")";
                else
                    ret += "null";
            }
            
            if (!this._noOptions) ret += ", " + this._toScriptOptions();
            return ret + ")";
        }
        
        /** overridden by classes which have custom args in constructor */
        protected _toScriptCustomArgs() : string {
            return "";
        }
        
        /**
         * Broken out in case toScript needs to be overridden.
         */
        protected _toScriptOptions() : string { 
            if (this._noOptions) return null;
            if (this.options.requireCompletionOf) throw "QI.MotionEvent: requireCompletionOf cannot be assigned for toScript";
            
            var ret = "";
            var first = true;
            
            if (this.options.millisBefore !== 0) {
                if (!first) ret += ", "; else first = false;
                ret += "millisBefore: " + this.options.millisBefore;
            }
            
            if (this.options.absoluteMovement) {
                if (!first) ret += ", "; else first = false;
                ret += "absoluteMovement : true";
            }
            
            if (this.options.absoluteRotation) {
                if (!first) ret += ", "; else first = false;
                ret += "absoluteRotation : true";
            }
            
            if (this.options.pace != MotionEvent.LINEAR) {
                if (!first) ret += ", "; else first = false;
                ret += "pace : " + this.options.pace.toScript();
            }
            
            if (this.options.sound) {
                if (!first) ret += ", "; else first = false;
                ret += "sound : " + this.options.sound.name; // name must match the object name
            }
            
            if (this.options.noStepWiseMovement) {
                if (!first) ret += ", "; else first = false;
                ret += "noStepWiseMovement : true";
            }
            
            if (this.options.mirrorAxes) {
                if (!first) ret += ", "; else first = false;
                ret += "mirrorAxes : \"" + this.options.mirrorAxes + "\"";
            }
            
            if (this.options.subposes) {
                if (!first) ret += ", "; else first = false;
                ret += "subposes : \"[";
                for (var i = 0, len = this.options.subposes.length; i < len; i++) {
                    if (i > 0) ret += ", ";
                    ret += "\"" + this.options.subposes[i] + "\"";
                }
                ret += "]";
            }
            
            if (this.options.revertSubposes) {
                if (!first) ret += ", "; else first = false;
                ret += "revertSubposes : true";
            }
            
            if (this.options.privilegedEvent) {
                if (!first) ret += ", "; else first = false;
                ret += "privilegedEvent : true";
            }
            
            return (ret.length > 0) ? "{" + ret + "}" : null;
        }
        
        /** Needs to be overridden by sub-classes. */
        public getClassName(): string { return "MotionEvent"; } 
        // =================================== run time processing ===================================
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        public activate(lateStartMilli = 0) : void {
            this._startTime = this._now;
            if (lateStartMilli > 0){
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner || this.options.requireCompletionOf || (this.options.sound && !this.muteSound) ) ? MotionEvent._BLOCKED :
                                         ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        }

        /** called to determine how much of the Event should be performed right now */
        public getCompletionMilestone() : number {
            if (this._currentDurationRatio === MotionEvent._COMPLETE) {
                return MotionEvent._COMPLETE;
            }

            // BLOCK only occurs when there is a sync partner, prior event from different queue, or sound
            if (this._currentDurationRatio === MotionEvent._BLOCKED) {
                // check sound and prior event first
               
                if (this.isSoundReady() && this.isPriorComplete()) {
                    this._startTime = this._now; // reset the start clocks
                    this._currentDurationRatio = MotionEvent._SYNC_BLOCKED;           
                } else return MotionEvent._BLOCKED;
            }
            
            // SYNC_BLOCKED occurs after a BLOCK has been satisfied
            if (this._currentDurationRatio === MotionEvent._SYNC_BLOCKED) {
                // change both to WAITING & start clock, once both are SYNC_BLOCKED
                if (this._syncPartner){
                    if (this._syncPartner.isSyncBlocked() ){
                        this._startTime = this._now; // reset the start clocks
                        this._syncPartner._syncReady(this._startTime);
                    }
                    else return MotionEvent._SYNC_BLOCKED;
                } 
                this._currentDurationRatio = MotionEvent._WAITING;
            }
            
            // go time, or at least time waiting from millis before
            this._millisSoFar = this._now - this._startTime;

            if (this._currentDurationRatio === MotionEvent._WAITING) {
                var overandAbove = this._millisSoFar - this._proratedMillisBefore;
                if (overandAbove >= 0){
                    this._startTime = this._now - overandAbove;  // prorate start for time served
                    this._millisSoFar = overandAbove;

                    if (this.options.sound && !this.muteSound){
                        this.options.sound.setPlaybackRate(TimelineControl.Speed);
                        this.options.sound.play();
                    }
                }
                else return MotionEvent._WAITING;
            }
            
            this._currentDurationRatio = this._millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;

            return this.pace.getCompletionMilestone(this._currentDurationRatio);
        }
        // ================================== blocking eval methods ===================================
        /** Test to see if sound is ready.  Tolerant to sound not part of event */
        public isSoundReady() : boolean {
            return !this.options.sound || this.muteSound || this.options.sound["_isReadyToPlay"];
        }
        
       /** Test to see if prior event is complete.  Tolerant to prior event not part of event */
        public isPriorComplete() : boolean {
            return !this.options.requireCompletionOf || this.options.requireCompletionOf.isComplete();
        }
        // =================================== pause resume methods ===================================
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        public resumePlay() : void {
            if (this._currentDurationRatio === MotionEvent._COMPLETE ||
                this._currentDurationRatio === MotionEvent._BLOCKED) return;

            var before = this._startTime;

            // back into a start time which reflects the millisSoFar
            this._startTime = this._now - this._millisSoFar;

            if (this.options.sound && !this.muteSound && this.options.sound.isPaused) this.options.sound.play();
        }

        public pause() : void {
            if (this.options.sound && !this.options.privilegedEvent) this.options.sound.pause();
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
        public isBlocked    () : boolean { return this._currentDurationRatio <=  MotionEvent._BLOCKED ; }
        public isSyncBlocked() : boolean { return this._currentDurationRatio === MotionEvent._SYNC_BLOCKED ; }
        public isWaiting    () : boolean { return this._currentDurationRatio === MotionEvent._WAITING ; }
        public isComplete   () : boolean { return this._currentDurationRatio === MotionEvent._COMPLETE; }
        public isExecuting  () : boolean { return this._currentDurationRatio >   MotionEvent._READY && this._currentDurationRatio < MotionEvent._COMPLETE; }

        public get milliDuration() : number      { return this._milliDuration; }
        public get millisBefore () : number      { return this.options.millisBefore; }
        public get pace         () : Pace        { return this.options.pace; }
        public get syncPartner  () : MotionEvent { return this._syncPartner; }
        private get _now        () : number      { return this.options.privilegedEvent ? TimelineControl.PrivilegedNow : TimelineControl.Now; }

        /**
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
         */
        public setProratedWallClocks(factor : number, isRepeat : boolean) : void {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = (this.millisBefore > 0 || !isRepeat) ? Math.abs(this.millisBefore) * factor : 0;
        }
        // ========================================== Enums  =========================================
        private static _BLOCKED      = -30;
        private static _SYNC_BLOCKED = -20;
        private static _WAITING      = -10;
        private static _READY        =   0;
        private static _COMPLETE     =   1;

        public static get BLOCKED     (): number { return MotionEvent._BLOCKED      ; }
        public static get SYNC_BLOCKED(): number { return MotionEvent._SYNC_BLOCKED ; }
        public static get WAITING     (): number { return MotionEvent._WAITING      ; }
        public static get READY       (): number { return MotionEvent._READY        ; }
        public static get COMPLETE    (): number { return MotionEvent._COMPLETE     ; }
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
         * @param {BABYLON.Sound} sound - Sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        constructor(milliDuration : number, groupName = PovProcessor.POV_GROUP_NAME, sound? : BABYLON.Sound){
            super(milliDuration,  null, null, {sound : sound});
            this._groupName = groupName;
        }
        
        public toScript() : string {
            var ret =  "new QI.Stall(" + this.milliDuration;
            if (this._groupName !== PovProcessor.POV_GROUP_NAME) ret += ", \"" + this._groupName + "\"";
            if (this.options.sound) ret += ", " + this.options.sound.name; // name must match the object name
            return ret + ")";
        }
        
        public getClassName(): string { return "Stall"; } 
    }
}