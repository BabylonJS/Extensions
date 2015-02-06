declare module POV {
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    class Pace {
        completionRatios: Array<number>;
        durationRatios: Array<number>;
        static LINEAR: Pace;
        steps: number;
        incremetalCompletionBetweenSteps: Array<number>;
        incremetalDurationBetweenSteps: Array<number>;
        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        constructor(completionRatios: Array<number>, durationRatios: Array<number>);
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        getCompletionMilestone(currentDurationRatio: number): number;
    }
}
/// <reference path="Pace.d.ts" />
declare module POV {
    /**
     * Class to store MotionEvent info & evaluate how complete it should be.
     */
    class MotionEvent {
        private _milliDuration;
        private _millisBefore;
        movePOV: BABYLON.Vector3;
        rotatePOV: BABYLON.Vector3;
        private _pace;
        private _syncPartner;
        private _startTime;
        private _currentDurationRatio;
        private _proratedMilliDuration;
        private _proratedMillisBefore;
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
        constructor(_milliDuration: number, _millisBefore: number, movePOV: BABYLON.Vector3, rotatePOV: BABYLON.Vector3, _pace?: Pace);
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        activate(lateStartMilli?: number): void;
        /** called to determine how much of the Event should be performed right now */
        getCompletionMilestone(): number;
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        resumePlay(): void;
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         */
        setSyncPartner(syncPartner: MotionEvent): void;
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  Only intended to be called from getCompletionMilestone() of the partner.
         *
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        syncReady(startTime: number): void;
        isBlocked(): boolean;
        isWaiting(): boolean;
        isComplete(): boolean;
        isExecuting(): boolean;
        getMilliDuration(): number;
        getMillisBefore(): number;
        getPace(): Pace;
        getSyncPartner(): MotionEvent;
        /**
         * Called by EventSeries, before MotionEvent is return by series.  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         */
        setProratedWallClocks(factor: number, isRepeat: boolean): void;
        private static _BLOCKED;
        private static _WAITING;
        private static _READY;
        private static _COMPLETE;
        static BLOCKED: number;
        static WAITING: number;
        static READY: number;
        static COMPLETE: number;
    }
}
/// <reference path="MotionEvent.d.ts" />
declare module POV {
    /** an interface used by SeriesAction.  Implemented by POV.PovRenderer & MORPH.Mesh
     */
    interface SeriesTargetable {
        queueEventSeries(eSeries: EventSeries): void;
    }
    /** Provide an action for an EventSeries, for integration into action manager */
    class SeriesAction extends BABYLON.Action {
        private _target;
        private _eSeries;
        constructor(triggerOptions: any, _target: SeriesTargetable, _eSeries: EventSeries, condition?: BABYLON.Condition);
        execute(evt: BABYLON.ActionEvent): void;
    }
    /** Main class of file
     *  Many members are public for subclassing, but not intended for external modification (leading _)
     */
    class EventSeries {
        _eventSeries: Array<any>;
        _nRepeats: number;
        _initialWallclockProrating: number;
        _nEvents: number;
        private _indexInRun;
        _repeatCounter: number;
        private _prorating;
        _proRatingThisRepeat: any;
        /**
         * Validate each of the events passed.
         * @param {Array} _eventSeries - Elements must either be a MotionEvent, Action, or function.
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         */
        constructor(_eventSeries: Array<any>, _nRepeats?: number, _initialWallclockProrating?: number);
        /**
         * No meaning, except for MORPH subclass
         */
        hasMultipleParticipants(): boolean;
        /**
         * Signals ready to start processing. Re-initializes incase of reuse.
         * @param {string} groupName - Unused, for subclassing by MORPH
         */
        activate(groupName: string): void;
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        hasMoreEvents(): boolean;
        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         *
         */
        nextEvent(groupName: string): any;
        /**
         * This methods is called on repeats, even if not prorating, so event knows it is a repeat
         */
        private appyProrating();
    }
}
/// <reference path="EventSeries.d.ts" />
/// <reference path="MotionEvent.d.ts" />
declare module POV {
    class BeforeRenderer implements SeriesTargetable {
        _mesh: BABYLON.Mesh;
        private skipRegistration;
        static MAX_MILLIS_FOR_EVENT_LATE_START: number;
        static CHANGED_TABS_THRESHOLD: number;
        private _queue;
        _currentSeries: EventSeries;
        _currentStepInSeries: MotionEvent;
        private _endOfLastFrameTs;
        _ratioComplete: number;
        private _doingRotation;
        private _rotationStartVec;
        private _rotationEndVec;
        private _doingMovePOV;
        private _positionStartVec;
        private _positionEndVec;
        private _fullAmtRight;
        private _fullAmtUp;
        private _fullAmtForward;
        private _amtRightSoFar;
        private _amtUpSoFar;
        private _amtForwardSoFar;
        private _activeLockedCamera;
        _name: string;
        /**
         * @param {BABYLON.Mesh} _mesh - Mesh to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing)
         */
        constructor(_mesh: BABYLON.Mesh, skipRegistration?: boolean);
        /**
         * beforeRender() registered to this._mesh.  Public for sub-classing in MORPH Module.
         */
        _incrementallyMove(): void;
        /**
         * PovSeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         */
        queueEventSeries(eSeries: EventSeries): void;
        private _nextEventSeries();
        /**
         * Public for sub-classing in MORPH Module.
         * @param {MotionEvent} event - The event processed and assigned the current step
         */
        _nextEvent(event: MotionEvent): void;
        private static _systemResumeTime;
        private static _systemPaused;
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        static isSystemPaused(): boolean;
        static pauseSystem(): void;
        static resumeSystem(): void;
        private _lastResumeTime;
        private _instancePaused;
        isPaused(): boolean;
        pausePlay(): void;
        resumePlay(): void;
        static Version: string;
    }
}
