var POV;
(function (POV) {
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    var Pace = (function () {
        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        function Pace(completionRatios, durationRatios) {
            this.completionRatios = completionRatios;
            this.durationRatios = durationRatios;
            // argument validations for JavaScript
            if (!(this.completionRatios instanceof Array) || !(this.durationRatios instanceof Array))
                BABYLON.Tools.Error("Pace: ratios not arrays");
            if (this.completionRatios.length !== this.durationRatios.length)
                BABYLON.Tools.Error("Pace: ratio arrays not of equal length");
            this.steps = this.completionRatios.length;
            if (this.steps === 0)
                BABYLON.Tools.Error("Pace: ratio arrays cannot be empty");
            var cRatio, dRatio, prevD = -1;
            for (var i = 0; i < this.steps; i++) {
                cRatio = this.completionRatios[i];
                dRatio = this.durationRatios[i];
                if (cRatio <= 0 || dRatio <= 0)
                    BABYLON.Tools.Error("Pace: ratios must be > 0");
                if (cRatio > 1 || dRatio > 1)
                    BABYLON.Tools.Error("Pace: ratios must be <= 1");
                if (prevD >= dRatio)
                    BABYLON.Tools.Error("Pace: durationRatios must be in increasing order");
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1)
                BABYLON.Tools.Error("Pace: final ratios must be 1");
            this.incremetalCompletionBetweenSteps = [this.completionRatios[0]]; // elements can be negative for 'hicups'
            this.incremetalDurationBetweenSteps = [this.durationRatios[0]];
            for (var i = 1; i < this.steps; i++) {
                this.incremetalCompletionBetweenSteps.push(this.completionRatios[i] - this.completionRatios[i - 1]);
                this.incremetalDurationBetweenSteps.push(this.durationRatios[i] - this.durationRatios[i - 1]);
            }
            Object.freeze(this); // make immutable
        }
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        Pace.prototype.getCompletionMilestone = function (currentDurationRatio) {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0)
                return 0;
            else if (currentDurationRatio >= 1)
                return 1;
            var upperIdx = 0; // ends up being an index into durationRatios, 1 greater than highest obtained
            for (; upperIdx < this.steps; upperIdx++) {
                if (currentDurationRatio < this.durationRatios[upperIdx])
                    break;
            }
            var baseCompletion = (upperIdx > 0) ? this.completionRatios[upperIdx - 1] : 0;
            var baseDuration = (upperIdx > 0) ? this.durationRatios[upperIdx - 1] : 0;
            var interStepRatio = (currentDurationRatio - baseDuration) / this.incremetalDurationBetweenSteps[upperIdx];
            return baseCompletion + (interStepRatio * this.incremetalCompletionBetweenSteps[upperIdx]);
        };
        // Constants
        Pace.LINEAR = new Pace([1.0], [1.0]);
        return Pace;
    })();
    POV.Pace = Pace;
})(POV || (POV = {}));
/// <reference path="./Pace.ts"/>
var POV;
(function (POV) {
    /**
     * Class to store MotionEvent info & evaluate how complete it should be.
     */
    var MotionEvent = (function () {
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
        function MotionEvent(_milliDuration, _millisBefore, movePOV, rotatePOV, _pace) {
            if (_pace === void 0) { _pace = POV.Pace.LINEAR; }
            this._milliDuration = _milliDuration;
            this._millisBefore = _millisBefore;
            this.movePOV = movePOV;
            this.rotatePOV = rotatePOV;
            this._pace = _pace;
            // time and state management members
            this._startTime = -1;
            this._currentDurationRatio = MotionEvent._COMPLETE;
            // argument validations
            if (this._milliDuration <= 0)
                BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
            this.setProratedWallClocks(1, false); // ensure values actually used for timings are initialized
        }
        // =================================== run time processing ===================================    
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        MotionEvent.prototype.activate = function (lateStartMilli) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            this._startTime = BABYLON.Tools.Now;
            if (lateStartMilli > 0) {
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner) ? MotionEvent._BLOCKED : ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        };
        /** called to determine how much of the Event should be performed right now */
        MotionEvent.prototype.getCompletionMilestone = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE) {
                return MotionEvent._COMPLETE;
            }
            // BLOCK only occurs when there is a sync partner
            if (this._currentDurationRatio === MotionEvent._BLOCKED) {
                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner.isBlocked()) {
                    this._startTime = BABYLON.Tools.Now; // reset the start clock
                    this._currentDurationRatio = MotionEvent._WAITING;
                    this._syncPartner.syncReady(this._startTime);
                }
                else
                    return MotionEvent._BLOCKED;
            }
            var millisSoFar = BABYLON.Tools.Now - this._startTime;
            if (this._currentDurationRatio === MotionEvent._WAITING) {
                millisSoFar -= this._proratedMillisBefore;
                if (millisSoFar >= 0) {
                    this._startTime = BABYLON.Tools.Now - millisSoFar; // prorate start for time served   
                }
                else
                    return MotionEvent._WAITING;
            }
            this._currentDurationRatio = millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;
            return this._pace.getCompletionMilestone(this._currentDurationRatio);
        };
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        MotionEvent.prototype.resumePlay = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE || this._currentDurationRatio === MotionEvent._BLOCKED || this._currentDurationRatio === MotionEvent._COMPLETE)
                return;
            // back into a start time which reflects the currentDurationRatio
            this._startTime = BABYLON.Tools.Now - (this._proratedMilliDuration * this._currentDurationRatio);
        };
        // =================================== sync partner methods ===================================    
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         */
        MotionEvent.prototype.setSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
        };
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  Only intended to be called from getCompletionMilestone() of the partner.
         *
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        MotionEvent.prototype.syncReady = function (startTime) {
            this._startTime = startTime;
            this._currentDurationRatio = MotionEvent._WAITING;
        };
        // ==================================== Getters & setters ====================================    
        MotionEvent.prototype.isBlocked = function () {
            return this._currentDurationRatio === MotionEvent._BLOCKED;
        };
        MotionEvent.prototype.isWaiting = function () {
            return this._currentDurationRatio === MotionEvent._WAITING;
        };
        MotionEvent.prototype.isComplete = function () {
            return this._currentDurationRatio === MotionEvent._COMPLETE;
        };
        MotionEvent.prototype.isExecuting = function () {
            return this._currentDurationRatio > MotionEvent._READY && this._currentDurationRatio < MotionEvent._COMPLETE;
        };
        MotionEvent.prototype.getMilliDuration = function () {
            return this._milliDuration;
        };
        MotionEvent.prototype.getMillisBefore = function () {
            return this._millisBefore;
        };
        MotionEvent.prototype.getPace = function () {
            return this._pace;
        };
        MotionEvent.prototype.getSyncPartner = function () {
            return this._syncPartner;
        };
        /**
         * Called by EventSeries, before MotionEvent is return by series.  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         */
        MotionEvent.prototype.setProratedWallClocks = function (factor, isRepeat) {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = (this._millisBefore > 0 || !isRepeat) ? Math.abs(this._millisBefore) * factor : 0;
        };
        Object.defineProperty(MotionEvent, "BLOCKED", {
            get: function () {
                return MotionEvent._BLOCKED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "WAITING", {
            get: function () {
                return MotionEvent._WAITING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "READY", {
            get: function () {
                return MotionEvent._READY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "COMPLETE", {
            get: function () {
                return MotionEvent._COMPLETE;
            },
            enumerable: true,
            configurable: true
        });
        // ========================================== Enums  =========================================    
        MotionEvent._BLOCKED = -20;
        MotionEvent._WAITING = -10;
        MotionEvent._READY = 0;
        MotionEvent._COMPLETE = 1;
        return MotionEvent;
    })();
    POV.MotionEvent = MotionEvent;
})(POV || (POV = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="./MotionEvent.ts"/>
var POV;
(function (POV) {
    /** Provide an action for an EventSeries, for integration into action manager */
    var SeriesAction = (function (_super) {
        __extends(SeriesAction, _super);
        function SeriesAction(triggerOptions, _target, _eSeries, condition) {
            _super.call(this, triggerOptions, condition);
            this._target = _target;
            this._eSeries = _eSeries;
        }
        SeriesAction.prototype.execute = function (evt) {
            this._target.queueEventSeries(this._eSeries);
        };
        return SeriesAction;
    })(BABYLON.Action);
    POV.SeriesAction = SeriesAction;
    /** Main class of file
     *  Many members are public for subclassing, but not intended for external modification (leading _)
     */
    var EventSeries = (function () {
        /**
         * Validate each of the events passed.
         * @param {Array} _eventSeries - Elements must either be a MotionEvent, Action, or function.
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         */
        function EventSeries(_eventSeries, _nRepeats, _initialWallclockProrating) {
            if (_nRepeats === void 0) { _nRepeats = 1; }
            if (_initialWallclockProrating === void 0) { _initialWallclockProrating = 1.0; }
            this._eventSeries = _eventSeries;
            this._nRepeats = _nRepeats;
            this._initialWallclockProrating = _initialWallclockProrating;
            this._nEvents = this._eventSeries.length;
            for (var i = 0; i < this._nEvents; i++) {
                if (this._eventSeries[i] instanceof POV.MotionEvent)
                    continue;
                if (this._eventSeries[i] instanceof BABYLON.Action)
                    continue;
                if (typeof this._eventSeries[i] === "function")
                    continue;
                BABYLON.Tools.Error("EventSeries:  eventSeries elements must either be a MotionEvent, Action, or function");
            }
            this._prorating = this._initialWallclockProrating !== 1;
            if (this._nRepeats === 1 && this._prorating)
                BABYLON.Tools.Warn("EventSeries: clock prorating ignored when # of repeats is 1");
        }
        /**
         * No meaning, except for MORPH subclass
         */
        EventSeries.prototype.hasMultipleParticipants = function () {
            return false;
        };
        /**
         * Signals ready to start processing. Re-initializes incase of reuse.
         * @param {string} groupName - Unused, for subclassing by MORPH
         */
        EventSeries.prototype.activate = function (groupName) {
            this._indexInRun = -1;
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
            this.appyProrating();
        };
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        EventSeries.prototype.hasMoreEvents = function () {
            return this._repeatCounter < this._nRepeats;
        };
        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         *
         */
        EventSeries.prototype.nextEvent = function (groupName) {
            if (++this._indexInRun === this._nEvents) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    this._indexInRun = 0;
                    if (this._prorating) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    this.appyProrating();
                }
                else {
                    return null;
                }
            }
            return this._eventSeries[this._indexInRun];
        };
        /**
         * This methods is called on repeats, even if not prorating, so event knows it is a repeat
         */
        EventSeries.prototype.appyProrating = function () {
            for (var i = 0; i < this._nEvents; i++) {
                if (this._eventSeries[i] instanceof POV.MotionEvent) {
                    this._eventSeries[i].setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                }
            }
        };
        return EventSeries;
    })();
    POV.EventSeries = EventSeries;
})(POV || (POV = {}));
/// <reference path="./EventSeries.ts"/>
/// <reference path="./MotionEvent.ts"/>
var POV;
(function (POV) {
    var BeforeRenderer = (function () {
        /**
         * @param {BABYLON.Mesh} _mesh - Mesh to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing)
         */
        function BeforeRenderer(_mesh, skipRegistration) {
            if (skipRegistration === void 0) { skipRegistration = false; }
            this._mesh = _mesh;
            this.skipRegistration = skipRegistration;
            // event series queue & reference vars for current series & step within
            this._queue = new Array();
            this._currentSeries = null;
            this._currentStepInSeries = null;
            this._endOfLastFrameTs = -1;
            // rotation control members
            this._doingRotation = false;
            // position control members
            this._doingMovePOV = false;
            // misc
            this._activeLockedCamera = null; // any, or would require casting to FreeCamera & no point in JavaScript
            this._name = ""; // for subclassing by MORPH
            // ================================== INSTANCE play - pause ==================================
            this._lastResumeTime = 0; // for passive detection of game pause
            this._instancePaused = false;
            // tricky registering a prototype as a callback in constructor; cannot say 'this.incrementallyMove()' & must be wrappered
            if (!skipRegistration) {
                var ref = this;
                this._mesh.registerBeforeRender(function () {
                    ref._incrementallyMove();
                });
            }
        }
        // =================================== inside before render ==================================
        /**
         * beforeRender() registered to this._mesh.  Public for sub-classing in MORPH Module.
         */
        BeforeRenderer.prototype._incrementallyMove = function () {
            // test for active instance pausing, either instance of entire system
            if (this._instancePaused || BeforeRenderer._systemPaused)
                return;
            // system active resume test
            if (this._lastResumeTime < BeforeRenderer._systemResumeTime) {
                this._lastResumeTime = BeforeRenderer._systemResumeTime;
                this.resumePlay(); // does nothing when this._currentStepInSeries === null
            }
            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents()) {
                if (!this._nextEventSeries())
                    return;
            }
            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete()) {
                var next = this._currentSeries.nextEvent(this._name);
                // being blocked, not ready for us, only occurs in a multi-group series in MORPH
                if (next === null)
                    return;
                if (next instanceof BABYLON.Action) {
                    next.execute(BABYLON.ActionEvent.CreateNew(this._mesh));
                }
                else if (typeof next === "function") {
                    next.call();
                }
                else {
                    this._nextEvent(next); // must be a new MotionEvent. _currentStepInSeries assigned if valid
                }
            }
            // ok, have a motion event to process
            // detect switched tabs & now back
            if (this._currentStepInSeries.isExecuting() && BABYLON.Tools.Now - this._endOfLastFrameTs > BeforeRenderer.CHANGED_TABS_THRESHOLD) {
                this.resumePlay();
                this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
            }
            this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
            if (this._ratioComplete < 0)
                return; // MotionEvent.BLOCKED or MotionEvent.WAITING
            if (this._doingRotation) {
                this._mesh.rotation = BABYLON.Vector3.Lerp(this._rotationStartVec, this._rotationEndVec, this._ratioComplete);
            }
            if (this._doingMovePOV) {
                if (this._doingRotation) {
                    // some of these amounts, could be negative, if has a Pace with a hiccup
                    var amtRight = (this._fullAmtRight * this._ratioComplete) - this._amtRightSoFar;
                    var amtUp = (this._fullAmtUp * this._ratioComplete) - this._amtUpSoFar;
                    var amtForward = (this._fullAmtForward * this._ratioComplete) - this._amtForwardSoFar;
                    this._mesh.movePOV(amtRight, amtUp, amtForward);
                    this._amtRightSoFar += amtRight;
                    this._amtUpSoFar += amtUp;
                    this._amtForwardSoFar += amtForward;
                }
                else {
                    this._mesh.position = BABYLON.Vector3.Lerp(this._positionStartVec, this._positionEndVec, this._ratioComplete);
                }
                if (this._activeLockedCamera !== null)
                    this._activeLockedCamera._getViewMatrix();
            }
            this._endOfLastFrameTs = BABYLON.Tools.Now;
        };
        // ============================ Event Series Queueing & retrieval ============================
        /**
         * PovSeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         */
        BeforeRenderer.prototype.queueEventSeries = function (eSeries) {
            this._queue.push(eSeries);
        };
        BeforeRenderer.prototype._nextEventSeries = function () {
            var ret = this._queue.length > 0;
            if (ret) {
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name);
            }
            else
                this._currentSeries = null;
            // clean out current step in any case, aids un-neccessary resulePlay of a completed step
            this._currentStepInSeries = null;
            return ret;
        };
        // ======================================== event prep =======================================    
        /**
         * Public for sub-classing in MORPH Module.
         * @param {MotionEvent} event - The event processed and assigned the current step
         */
        BeforeRenderer.prototype._nextEvent = function (event) {
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = BABYLON.Tools.Now - this._endOfLastFrameTs;
            event.activate((lateStart - this._endOfLastFrameTs < BeforeRenderer.MAX_MILLIS_FOR_EVENT_LATE_START && !this._currentSeries.hasMultipleParticipants()) ? lateStart : 0);
            this._currentStepInSeries = event;
            // prepare for rotation, if event calls for
            this._doingRotation = event.rotatePOV !== null;
            if (this._doingRotation) {
                this._rotationStartVec = this._mesh.rotation; // no clone required, since Lerp() returns a new Vec3 written over .rotation
                this._rotationEndVec = this._rotationStartVec.add(this._mesh.calcRotatePOV(event.rotatePOV.x, event.rotatePOV.y, event.rotatePOV.z));
            }
            // prepare for POV move, if event calls for
            this._doingMovePOV = event.movePOV !== null;
            if (this._doingMovePOV) {
                this._fullAmtRight = event.movePOV.x;
                this._amtRightSoFar = 0;
                this._fullAmtUp = event.movePOV.y;
                this._amtUpSoFar = 0;
                this._fullAmtForward = event.movePOV.z;
                this._amtForwardSoFar = 0;
                // less resources to calcMovePOV() once then Lerp(), but calcMovePOV() uses rotation, so can only go fast when not rotating too
                if (!this._doingRotation) {
                    this._positionStartVec = this._mesh.position; // no clone required, since Lerp() returns a new Vec3 written over .position
                    this._positionEndVec = this._positionStartVec.add(this._mesh.calcMovePOV(this._fullAmtRight, this._fullAmtUp, this._fullAmtForward));
                }
            }
            // determine if camera needs to be woke up for tracking
            this._activeLockedCamera = null; // assigned for failure
            if (this._doingRotation || this._doingMovePOV) {
                var activeCamera = this._mesh.getScene().activeCamera;
                if (activeCamera.lockedTarget && activeCamera.lockedTarget === this._mesh)
                    this._activeLockedCamera = activeCamera;
            }
        };
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        BeforeRenderer.isSystemPaused = function () {
            return BeforeRenderer._systemPaused;
        };
        BeforeRenderer.pauseSystem = function () {
            BeforeRenderer._systemPaused = true;
        };
        BeforeRenderer.resumeSystem = function () {
            BeforeRenderer._systemPaused = false;
            BeforeRenderer._systemResumeTime = BABYLON.Tools.Now;
        };
        BeforeRenderer.prototype.isPaused = function () {
            return this._instancePaused;
        };
        BeforeRenderer.prototype.pausePlay = function () {
            this._instancePaused = true;
        };
        BeforeRenderer.prototype.resumePlay = function () {
            this._lastResumeTime = BABYLON.Tools.Now;
            this._instancePaused = false;
            // cause Event in progress to calibrate for smooth resume
            if (this._currentStepInSeries !== null)
                this._currentStepInSeries.resumePlay();
        };
        Object.defineProperty(BeforeRenderer, "Version", {
            // ========================================= Statics =========================================
            get: function () {
                return "1.0.0";
            },
            enumerable: true,
            configurable: true
        });
        BeforeRenderer.MAX_MILLIS_FOR_EVENT_LATE_START = 50;
        BeforeRenderer.CHANGED_TABS_THRESHOLD = 200;
        // =================================== SYSTEM play - pause ===================================
        // pause & resume statics
        BeforeRenderer._systemResumeTime = 0;
        BeforeRenderer._systemPaused = false;
        return BeforeRenderer;
    })();
    POV.BeforeRenderer = BeforeRenderer;
})(POV || (POV = {}));
