declare module QI {
    /**
     * Represents Matrices in their component parts
     */
    class MatrixComp {
        rotation: BABYLON.Quaternion;
        translation: BABYLON.Vector3;
        static One: BABYLON.Vector3;
        scale: BABYLON.Vector3;
        rotationBasisDiff: BABYLON.Quaternion;
        translationBasisDiff: BABYLON.Vector3;
        scaleBasisDiff: BABYLON.Vector3;
        rotationBasisRatio: BABYLON.Quaternion;
        translationBasisRatio: BABYLON.Vector3;
        scaleBasisRatio: BABYLON.Vector3;
        /**
         * The separate components of BABYLON.Matrix
         * @param {BABYLON.Quaternion} rotation
         * @param {BABYLON.Vector3} translation
         * @param {BABYLON.Vector3} scale- optional, set to a static (1, 1, 1) when missing or equates to (1, 1, 1)
         */
        constructor(rotation: BABYLON.Quaternion, translation: BABYLON.Vector3, scale?: BABYLON.Vector3);
        /**
         * Difference of a QI.Pose to the Library's Basis (Rest) pose.  Called for each library Pose, EXCEPT Basis (would be zero anyway)
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        setBasisDiffs(libraryBasis: MatrixComp): void;
        /**
         * The relationship between this (the Basis (Rest) of a bone) to that of the pose library's version of that bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        setBasisRatios(libraryBasis: MatrixComp): void;
        /**
         * A relative target (rotation / translation / scale) is made by:
         * (Difference of each to their Basis (Rest)) * (Ratios of the Basic of the bone to library) + Basis of the bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryTarget - The value of this bone for a pose in the library.
         */
        getRelativePose(libraryPose: MatrixComp): MatrixComp;
        /**
         * Recompose the components back into a matrix
         */
        toMatrix(): BABYLON.Matrix;
        /**
         * Equals test.
         */
        equals(rotation: BABYLON.Quaternion, translation: BABYLON.Vector3, scale: BABYLON.Vector3): boolean;
        /**
         *
         */
        static fromMatrix(matrix: BABYLON.Matrix): MatrixComp;
        static needScale(scale: BABYLON.Vector3): boolean;
    }
}
/// <reference path="MatrixComp.d.ts" />
/// <reference path="Pose.d.ts" />
declare module QI {
    /**
     * Instances of this class are computer generated code from Tower of Babel.  A library contains all the
     * poses designed for a skeleton.
     */
    class SkeletonPoseLibrary {
        name: string;
        dimensionsAtRest: BABYLON.Vector3;
        nameOfRoot: string;
        boneLengths: {
            [boneName: string]: number;
        };
        private static _libraries;
        static getLibraryByName(name: string): SkeletonPoseLibrary;
        /**
         * Called in generated code.  If more than one library is exported with the same name, then
         * an attempt will be made to append the poses to the first reference encountered.
         */
        static createLibrary(name: string, dimensionsAtRest: BABYLON.Vector3, nameOfRoot: string, boneLengths: {
            [boneName: string]: number;
        }): SkeletonPoseLibrary;
        poses: {
            [name: string]: Pose;
        };
        nBones: number;
        /**
         * Non exported constructor, called by SkeletonPoseLibrary.createLibrary().
         */
        constructor(name: string, dimensionsAtRest: BABYLON.Vector3, nameOfRoot: string, boneLengths: {
            [boneName: string]: number;
        });
        /**
         * Add the pose supplied by the argument.  Called by the Pose's constructor, which
         * is passed the library as a constructor arg in the generated code.
         */
        _addPose(pose: Pose): void;
        /**
         * @returns {string[]} the names of all poses, subposes with the '.sp' removed; primarily for UI
         */
        getPoses(subPoses: boolean): string[];
    }
}
/// <reference path="PovProcessor.d.ts" />
declare module QI {
    /**
     * This class is used to provide a way to render at a precise frame rate, as opposed to realtime,
     * as well as system level play - pause.
     */
    class TimelineControl {
        private static _afterRenderAssigned;
        private static _manualFrameRate;
        private static _isRealtime;
        private static _now;
        private static _lastRun;
        private static _lastFrame;
        private static _frameID;
        private static _resumeQueued;
        private static _speed;
        private static _scene;
        static MP4Worker: Worker;
        static CHANGED_TABS_THRESHOLD: number;
        /** called by PovProcessor constructor */
        static initialize(scene: BABYLON.Scene): void;
        static change(isRealTime: boolean, rateIfManual?: number): void;
        private static _manualAdvanceAfterRender();
        static sizeFor720(): void;
        static sizeFor1080(): void;
        private static _sizeForRecording(width, height);
        static manualFrameRate: number;
        static isRealtime: boolean;
        static Now: number;
        static FrameID: number;
        static Speed: number;
        private static _systemResumeTime;
        private static _systemPaused;
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        static isSystemPaused: boolean;
        static pauseSystem(): void;
        static resumeSystem(): void;
        static SystemResumeTime: number;
    }
}
declare module QI {
    /**
     * See , https://msdn.microsoft.com/en-us/library/ee308751.aspx, for types.
     * This is largely based on BJS Easing.  A few do not make sense, or are not possible.
     * The static MotionEvent.LINEAR is the default for all cases where a Pace is an argument.
     */
    class Pace {
        _mode: number;
        static MODE_IN: number;
        static MODE_OUT: number;
        static MODE_INOUT: number;
        constructor(_mode?: number);
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        getCompletionMilestone(currentDurationRatio: number): number;
        /**
         * Perform the method without regard for the mode.  MUST be overridden
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        _compute(currentDurationRatio: number): number;
    }
    class CirclePace extends Pace {
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class CubicPace extends Pace {
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class ElasticPace extends Pace {
        oscillations: number;
        springiness: number;
        constructor(oscillations?: number, springiness?: number, mode?: number);
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class ExponentialPace extends Pace {
        exponent: number;
        constructor(exponent?: number, mode?: number);
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class PowerPace extends Pace {
        power: number;
        constructor(power?: number, mode?: number);
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class QuadraticPace extends Pace {
        /** @override */
        _compute(currentDurationRatio: any): number;
    }
    class QuarticPace extends Pace {
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class QuinticPace extends Pace {
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class SinePace extends Pace {
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    class BezierCurvePace extends Pace {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        constructor(x1?: number, y1?: number, x2?: number, y2?: number, mode?: number);
        /** @override */
        _compute(currentDurationRatio: number): number;
    }
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    class SteppedPace extends Pace {
        completionRatios: Array<number>;
        durationRatios: Array<number>;
        steps: number;
        incremetalCompletionBetweenSteps: Array<number>;
        incremetalDurationBetweenSteps: Array<number>;
        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        constructor(completionRatios: Array<number>, durationRatios: Array<number>);
        /** @override
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        getCompletionMilestone(currentDurationRatio: number): number;
    }
}
/// <reference path="Pace.d.ts" />
/// <reference path="TimelineControl.d.ts" />
declare module QI {
    /**
     * MotionEvent options. This helps customizing the behaviour of the event.
     */
    interface IMotionEventOptions {
        /**
         * Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         * When negative, no delay if being repeated in an EventSeries.
         */
        millisBefore?: number;
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
         * Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         */
        sound?: BABYLON.Sound;
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
        mirrorAxes?: string;
        /**
         * Skeletons Only:
         * Subposes which should be substituted during event (default null).
         */
        subposes?: string[];
        /**
         * Skeletons Only:
         * Should any subposes previously applied should be subtracted during event(default false)?
         */
        revertSubposes?: boolean;
    }
    /**
     * Class to store MotionEvent info & evaluate how complete it should be.
     */
    class MotionEvent {
        private _milliDuration;
        movePOV: BABYLON.Vector3;
        rotatePOV: BABYLON.Vector3;
        static LINEAR: SteppedPace;
        private _syncPartner;
        options: IMotionEventOptions;
        private _startTime;
        private _millisSoFar;
        private _currentDurationRatio;
        private _proratedMilliDuration;
        private _proratedMillisBefore;
        _groupName: string;
        muteSound: boolean;
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
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(_milliDuration: number, movePOV: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        toString(): string;
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        activate(lateStartMilli?: number): void;
        /** called to determine how much of the Event should be performed right now */
        getCompletionMilestone(): number;
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        resumePlay(): void;
        pause(): void;
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         * There is no need to call this on both partners, since this call sets both to each other.
         */
        setSyncPartner(syncPartner: MotionEvent): void;
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        private _syncReady(startTime);
        isBlocked(): boolean;
        isWaiting(): boolean;
        isComplete(): boolean;
        isExecuting(): boolean;
        milliDuration: number;
        millisBefore: number;
        pace: Pace;
        syncPartner: MotionEvent;
        /**
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
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
    /**
     * sub-class of MotionEvent, for the convenience of queuing delays, starting sounds capable
     */
    class Stall extends MotionEvent {
        /**
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in.
         * @param {string} groupName - The processor / queue to have the stall.  Useful for EventSeries involving multiple groups.
         * @param {BABYLON.Sound} sound - Sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        constructor(milliDuration: number, groupName?: string, sound?: BABYLON.Sound);
    }
}
/// <reference path="Pace.d.ts" />
/// <reference path="TimelineControl.d.ts" />
/// <reference path="MotionEvent.d.ts" />
declare module QI {
    /**
     * Abstract sub-class of MotionEvent, sub-classed by PropertyEvent & RecurringCallbackEvent
     */
    class NonMotionEvent extends MotionEvent {
        private _paused;
        private _scene;
        private _registeredFN;
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        initialize(lateStartMilli?: number, scene?: BABYLON.Scene): void;
        private _beforeRender();
        _incrementallyUpdate(ratioComplete: number): void;
    }
    /**
     * sub-class of NonMotionEvent, for changing the property of an object
     */
    class PropertyEvent extends NonMotionEvent {
        _object: Object;
        _property: string;
        _targetValue: any;
        _initialValue: any;
        private _datatype;
        private static _NUMBER_TYPE;
        private static _VEC3_TYPE;
        /**
         * @param {Object} object - The object instance on which to make a property change
         * @param {string} _property - The name of the property to change
         * @param {any} - The final value that the property should take
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(_object: Object, _property: string, _targetValue: any, milliDuration: number, options?: IMotionEventOptions);
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        initialize(lateStartMilli?: number, scene?: BABYLON.Scene): void;
        _incrementallyUpdate(ratioComplete: number): void;
    }
    /**
     * Sub-class of NonMotionEvent, for calling a recurring callback
     */
    class RecurringCallbackEvent extends NonMotionEvent {
        private _callback;
        /**
         * @param {(ratioComplete : number) => void} callback - The function to call
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(_callback: (ratioComplete: number) => void, milliDuration: number, options?: IMotionEventOptions);
        _incrementallyUpdate(ratioComplete: number): void;
    }
}
/// <reference path="MotionEvent.d.ts" />
declare module QI {
    /** An interface used by SeriesAction.  Implemented by QI.POVProcessor & QI.Mesh
     */
    interface SeriesTargetable {
        /** Method required by an object to be the target of a QI.SeriesAction (QI.POVProcessor & QI.Mesh)
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        queueEventSeries(eSeries: EventSeries, clearQueue?: boolean, stopCurrentSeries?: boolean): void;
    }
    /** Provide an action for an EventSeries, for integration into action manager */
    class SeriesAction extends BABYLON.Action {
        private _target;
        private _eSeries;
        private _clearQueue;
        private _stopCurrentSeries;
        /**
         * @param {any} triggerOptions - passed to super, same as any other Action
         * @param {SeriesTargetable} _target - The object containing the event queue.  Using an interface for MORPH sub-classing.
         * @param {EventSeries} _eSeries - The event series that the action is to submit to the queue.
         * @param {boolean} _clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} _stopCurrentSeries - When true, stop the current MotionSeries too.
         * @param {boolean} condition - passed to super, same as any other Action
         */
        constructor(triggerOptions: any, _target: SeriesTargetable, _eSeries: EventSeries, _clearQueue?: boolean, _stopCurrentSeries?: boolean, condition?: BABYLON.Condition);
        execute(evt: BABYLON.ActionEvent): void;
    }
    /**
     *  The object processed by each of the Processors.
     */
    class EventSeries {
        _events: Array<any>;
        private _nRepeats;
        private _initialWallclockProrating;
        private _groupForFuncActions;
        _debug: boolean;
        private _syncPartner;
        private _partnerReady;
        private _nEvents;
        private _indexInRun;
        private _repeatCounter;
        private _prorating;
        private _proRatingThisRepeat;
        private _groups;
        private _nGroups;
        private _everybodyReady;
        /**
         * Validate each of the events passed.
         * @param {Array} _events - Elements must either be a MotionEvent, Action, or function. (public for PoseProcessor)
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         * @param {string} _groupForFuncActions - should there be any functions or actions use this group to process them.  The
         *                 default group is the built-in one of BeforeRenderer.  This might always work, if you
         *                 wish the function to run after a deformation.  This never needs to be specified unless it is a QI.Mesh.
         * @param {string} _debug - Write progress messages to console when true (Default false)
         */
        constructor(_events: Array<any>, _nRepeats?: number, _initialWallclockProrating?: number, _groupForFuncActions?: string, _debug?: boolean);
        toString(): string;
        /**
         * Used by constructor for each event.  The first time a particular group (skeleton / shape key group)
         * is encountered, a ParticipatingGroup object is instanced, and added to groups property.
         */
        private _addGroupAsRequired(groupName, eventIdx);
        /**
         * @returns {boolean} True, when more than one processor / queue is involved.
         */
        hasMultipleParticipants(): boolean;
        /**
         * called by QI.Mesh, to figure out which group this should be queued on.
         * @param {string} groupName - This is the group name to see if it has things to do in event series.
         */
        isGroupParticipating(groupName: string): boolean;
        /**
         * @param {EventSeries} syncPartner - EventSeries which should start at the same time as this one.
         */
        setSeriesSyncPartner(syncPartner: EventSeries): void;
        /**
         *  Called by the each of the syncPartners to detect that both are waiting for each other.
         */
        private _setPartnerReady();
        /**
         * Signals ready to start processing. Re-initializes incase of reuse. Also evaluates if everybodyReady, when using groups
         * @param {string} groupName - This is the group name saying it is ready.
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
         * apply prorating to each event, even if not prorating, so event knows it is a repeat or not
         */
        private _appyProrating();
        /**
         * more complicated method used when there are multiple groups.
         * @param {string} groupName - Name of the group calling for its next event
         *
         */
        private _nextGroupEvent(groupName);
    }
}
/// <reference path="TimelineControl.d.ts" />
/// <reference path="MotionEvent.d.ts" />
/// <reference path="NonMotionEvents.d.ts" />
/// <reference path="EventSeries.d.ts" />
declare module QI {
    class PovProcessor implements SeriesTargetable {
        _node: BABYLON.Node;
        private skipRegistration;
        static POV_GROUP_NAME: string;
        static MAX_MILLIS_FOR_EVENT_LATE_START: number;
        private _registeredFN;
        private _isproperty;
        private _isMesh;
        private _isLight;
        private _isCamera;
        _queue: EventSeries[];
        _currentSeries: EventSeries;
        _currentStepInSeries: MotionEvent;
        private _endOfLastFrameTs;
        _ratioComplete: number;
        private _rotationProperty;
        private _doingRotation;
        private _rotationStart;
        private _rotationEnd;
        private _rotationMatrix;
        private _doingMovePOV;
        private _positionStartVec;
        private _positionEndVec;
        private _fullAmtRight;
        private _fullAmtUp;
        private _fullAmtForward;
        private _amtRightSoFar;
        private _amtUpSoFar;
        private _amtForwardSoFar;
        private _u;
        private _activeLockedCamera;
        _name: string;
        /**
         * @param {BABYLON.Node} _node - Node (mesh, camera, or spot / directional light) to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing), ignore when not mesh
         */
        constructor(_node: BABYLON.Node, skipRegistration?: boolean);
        /**
         * Not automatically called.  A QI.Mesh uses its own, so not problem there.
         */
        dispose(): void;
        /**
         * beforeRender() registered to scene for this._node.  Public for sub-classing in QI.ShapekeyGroup.
         */
        _incrementallyMove(): void;
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        queueEventSeries(eSeries: EventSeries, clearQueue?: boolean, stopCurrentSeries?: boolean): void;
        insertSeriesInFront(eSeries: EventSeries): void;
        /**
         * @param {number} _nRepeats - Number of times to run through series elements.
         */
        queueSingleEvent(event: MotionEvent, nRepeats?: number): void;
        /**
         * Clear out any event
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        clearQueue(stopCurrentSeries?: boolean): void;
        /**
         * Stop current activities.
         * @param {boolean} step - When true, stop the current MotionEvent.
         * @param {boolean} series - When true, stop the current MotionSeries.  Note this will also stop
         * the current step.
         */
        stopCurrent(step?: boolean, series?: boolean): void;
        private _nextEventSeries();
        isActive(): boolean;
        /**
         * Public for sub-classing in PoseProcessor & ShapeKeyGroup.
         * @param {MotionEvent} event - The event processed and assigned the current step
         * @param {BABYLON.Vector3} movementScaling - Passed by PoseProcessor sub-class, multiplier to account for
         * the skeleton being different from the one used to build the skeleton library; optional
         */
        _nextEvent(event: MotionEvent, movementScaling?: BABYLON.Vector3): void;
        /**
         * Perform relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the node's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        movePOV(amountRight: number, amountUp: number, amountForward: number): void;
        /**
         * Calculate relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the nodes's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        calcMovePOV(amountRight: number, amountUp: number, amountForward: number): BABYLON.Vector3;
        /**
         * Perform relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): void;
        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        calcRotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.Vector3;
        private _lastResumeTime;
        private _instancePaused;
        isInstancePaused(): boolean;
        pauseInstance(): void;
        resumeInstancePlay(): void;
        static Version: string;
        static LerpToRef(start: BABYLON.Vector3, end: BABYLON.Vector3, amount: number, result: BABYLON.Vector3): void;
        static SlerpToRef(left: BABYLON.Quaternion, right: BABYLON.Quaternion, amount: number, result: BABYLON.Quaternion): BABYLON.Quaternion;
        static formatQuat(d: BABYLON.Quaternion): string;
    }
}
/// <reference path="MatrixComp.d.ts" />
/// <reference path="SkeletonPoseLibrary.d.ts" />
/// <reference path="../../queue/PovProcessor.d.ts" />
declare module QI {
    class Bone extends BABYLON.Bone {
        private _alreadyAtTarget;
        private _restComp;
        private _startScale;
        private _startRotation;
        private _startTranslation;
        private _rel_target;
        private _resultScale;
        private _resultRotation;
        private _resultTranslation;
        private _rotationMatrix;
        /**
         * Argument signature same as that of parent, BABYLON.Bone, except restPose IS NOT optional here.
         */
        constructor(name: string, skeleton: Skeleton, parentBone: Bone, matrix: BABYLON.Matrix, restPose: BABYLON.Matrix);
        /** called by Skeleton.assignPoseLibrary() to compare Basis (Rest) to that of the library, to keep it out of assignPose() */
        assignPoseLibrary(library: SkeletonPoseLibrary): void;
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        /** called by Pose.assignPose(), when bone is potentially changed by the pose (could already be at this setting)
         */
        _assignPose(targetValue: MatrixComp, immediately?: boolean): void;
        /**
         * Called by Pose._assignPose(), when bone is not even changed by the pose
         */
        _setAlreadyAtTarget(): void;
        /**
         * Called by this._assignPose() when immediate & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        _incrementallyDeform(ratioComplete: number): void;
    }
}
/// <reference path="Bone.d.ts" />
/// <reference path="Pose.d.ts" />
/// <reference path="SkeletonPoseLibrary.d.ts" />
declare module QI {
    class Skeleton extends BABYLON.Skeleton {
        _subPoses: Pose[];
        _poseLibrary: SkeletonPoseLibrary;
        _skelDimensionsRatio: BABYLON.Vector3;
        /** called by the PoseProcessor constructor; all bones should have been added by now */
        validateSkeleton(): boolean;
        /** Only one library can be assigned to a library at a time.
         *  Validation of compatiblity, and pre-processing for scaling differences performed.
         *  No effect, if already assigned to that library.
         *  @param {string} libraryName - name of the library to assign; no effect if already assigned
         */
        assignPoseLibrary(libraryName: string): void;
        /** Method which does the validation that this library is compatible
         *  @param {SkeletonPoseLibrary} library - The candidate library
         *  @returns {boolean} - True when valid
         */
        private _validateLibraryForSkeleton(library);
        /**
         * Should not be call here, but through the mesh so that the processor can note the change.
         */
        _assignPoseImmediately(poseName: string): void;
        currentStateAsPose(name: string): Pose;
        addSubPose(poseName: string): void;
        removeSubPose(poseName: string): void;
        clearAllSubPoses(): void;
    }
}
/// <reference path="MatrixComp.d.ts" />
/// <reference path="Bone.d.ts" />
/// <reference path="Skeleton.d.ts" />
/// <reference path="SkeletonPoseLibrary.d.ts" />
declare module QI {
    class Pose {
        name: string;
        library: SkeletonPoseLibrary;
        isSubPose: boolean;
        targets: {
            [boneName: string]: MatrixComp;
        };
        /**
         * @immutable, to be reused across skeletons
         * This is instanced by computer generated code.
         * @param {string} name- The name of the pose given in the Blender skeleton library.  A sub-pose is
         *                 detected by having a '.sp' as part of the name, typically a suffix.
         *
         * @param {SkeletonPoseLibrary} library- The instance of the QI.SkeletonPoseLibrary to add itself to
         * @param {[boneName: string] : BABYLON.Matrix} targets - A dictionary of matrices of the bones that
         *                                              particpate in this pose.
         */
        constructor(name: string, library: SkeletonPoseLibrary, targets: {
            [boneName: string]: BABYLON.Matrix;
        });
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        _assignPose(skeleton: Skeleton, immediately?: boolean): void;
        private _mergeSubPoses(subPoses);
    }
}
declare module BEING {
    /** class for a single eye.  2 Eye Classes are "controlled" in tandem by calling the public methods of this class.
     *
     * Movement up / down left right are controlled by POV rotation. EyeBalls are not inheriting from QI.Mesh, since no shape keys.
     * Just add a pov processor, which registers itself.
     *
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     *
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles paritioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     *
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    class EyeBall extends BABYLON.Mesh {
        private static _FOLLOW_MODE_SET_BACK;
        private static _RANDOM_MODE_SET_BACK;
        private _povProcessor;
        private _pupilSize;
        private _originalPositionZ;
        /**
         * @constructor - Args same As BABYLON.Mesh
         * @param {string} name - The value used by scene.getMeshByName().  Must end in either '_L' or '_R'.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The head / body, so eye stays in head as parent moves
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent?: BABYLON.Node, source?: BABYLON.Mesh, doNotCloneChildren?: boolean);
        /** @override */
        dispose(doNotRecurse?: boolean): void;
        /**
         * @param {QI.MotionEvent} amt - Only the rotation component may be specified.  movePOV MUST be null.
         */
        queueRotation(amt: QI.MotionEvent, postEventFunc?: () => void): void;
        /**
         * called publicly by Eyes.moveRandom()
         */
        stop(): void;
        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        followMode(stop?: boolean): void;
        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        moveRandom(stop?: boolean): void;
        /** shift eyes back slightly, so rotation does not cause eyes to violate skin
         * @param {number} amt - 0 to 1, used
         */
        private _performSetBack(amt);
        /**
         * Getter to identify which EyeBall instance is left or right side.
         * @returns {boolean} - When true instance is left side, else is right side.
         */
        isLeft(): boolean;
        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        setPupilSize(size: number): void;
    }
}
/// <reference path="EyeBall.d.ts" />
declare module BEING {
    /** Class to control a set of EyeBalls.
     *
     * Movement up / down left right are controlled by POV rotation. EyeBalls are not inheriting from QI.Mesh, since no shape keys.
     * Just add a pov processor, which registers itself.
     *
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     *
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles partitioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     *
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    class Eyes {
        private static MAX_UP;
        private static L_EYE_RANGE;
        private static R_EYE_RANGE;
        private _leftEye;
        private _rightEye;
        private _pupilSize;
        private _followMode;
        /** Do not want for force the eye to only work with a make human.  Use this to analze parent mesh to pick out
         *  the eyeballs from the children meshes.
         *
         * @param {BABYLON.Mesh} parentMesh - The mesh search for children that are instances of BEING.EyeBall.
         * @returns {BEING.Eyes} - When 2 child BEING.EyeBalls are found, a constructor is run & returned.  Otherwise
         * null is returned.
         */
        static getInstance(parentMesh: BABYLON.Mesh): Eyes;
        /**
         * Non-exported constructor, called only by Eyes.getInstance().
         */
        constructor(eyes: Array<EyeBall>);
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {number} duration - The time the rotation is to take, in millis (Default 600).
         * @param {number) wait - The time to wait once event is begun execution (Default 0).
         * @param {function} postEventFunc - call this upon completion, only done one eye; presume it is next random
         */
        queueRotation(up: number, left: number, duration?: number, wait?: number, postEventFunc?: () => void): void;
        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        followMode(stop?: boolean): void;
        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        moveRandom(stop?: boolean): void;
        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        setPupilSize(size: number): void;
    }
}
/// <reference path="Pose.d.ts" />
/// <reference path="../../queue/MotionEvent.d.ts" />
/// <reference path="../../queue/Pace.d.ts" />
declare module QI {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    class PoseEvent extends MotionEvent {
        poseName: string;
        /**
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {string[]} subposes - subposes which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any subposes should actually be subtracted during event(default false)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(poseName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        toString(): string;
    }
}
/// <reference path="Pose.d.ts" />
/// <reference path="PoseEvent.d.ts" />
/// <reference path="Skeleton.d.ts" />
/// <reference path="Bone.d.ts" />
/// <reference path="SkeletonPoseLibrary.d.ts" />
/// <reference path="../../queue/PovProcessor.d.ts" />
/// <reference path="../../queue/MotionEvent.d.ts" />
/// <reference path="../../queue/EventSeries.d.ts" />
declare module QI {
    class PoseProcessor extends PovProcessor {
        private _skeleton;
        static INTERPOLATOR_GROUP_NAME: string;
        private _bones;
        _lastPoseRun: string;
        constructor(_skeleton: Skeleton, parentMesh: BABYLON.Mesh, skipRegistration: boolean);
        /**
         * Called by the beforeRender() registered by this._mesh
         * SkeletonInterpolator is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         */
        incrementallyDeform(): boolean;
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        getLastPoseNameQueuedOrRun(): string;
        private _getLastEventInSeries(series);
        /** called by super._incrementallyMove()
         */
        _nextEvent(event: MotionEvent): void;
    }
}
/// <reference path="../../queue/MotionEvent.d.ts" />
/// <reference path="../../queue/Pace.d.ts" />
declare module QI {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    class VertexDeformation extends MotionEvent {
        private _referenceStateName;
        private _endStateNames;
        private _endStateRatios;
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} _referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array} _endStateNames - Names of state keys to deform to
         * @param {Array} _endStateRatios - ratios of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1's)
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(groupName: string, _referenceStateName: string, _endStateNames: Array<string>, _endStateRatios: Array<number>, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        getReferenceStateName(): string;
        getEndStateName(idx: number): string;
        getEndStateNames(): Array<string>;
        getEndStateRatio(idx: number): number;
        getEndStateRatios(): Array<number>;
    }
    /**
     * sub-class of VertexDeformation, where the referenceStateName is Fixed to "BASIS" & only one end state involved
     */
    class Deformation extends VertexDeformation {
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
         *
         * args from super
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(groupName: string, endStateName: string, endStateRatio: number, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
    }
    /**
     * sub-class of Deformation, to immediately attain a shape.  To be truely immediate you need to
     * queue on mesh & specify to clearQueue like:
     *
     * var event = new QI.MorphImmediate(...);
     * var series = new QI.EventSeries([event]);
     * mesh.queueEventSeries(series, true);
     *
     * If you specify a sound, then it will not perform event until sound is ready.
     */
    class MorphImmediate extends Deformation {
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(groupName: string, endStateName: string, endStateRatio?: number, options?: IMotionEventOptions);
    }
    /**
     * sub-class of Deformation, to return to the basis state
     */
    class BasisReturn extends Deformation {
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(groupName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
    }
}
/// <reference path="VertexDeformation.d.ts" />
/// <reference path="../../Mesh.d.ts" />
/// <reference path="../../queue/PovProcessor.d.ts" />
/// <reference path="../../queue/MotionEvent.d.ts" />
declare module QI {
    class ShapeKeyGroup extends PovProcessor {
        private _affectedPositionElements;
        private _nPosElements;
        private _states;
        private _normals;
        private _stateNames;
        private _affectedVertices;
        private _nVertices;
        private _currFinalPositionVals;
        private _priorFinalPositionVals;
        private _currFinalNormalVals;
        private _priorFinalNormalVals;
        private _stalling;
        private _reusablePositionFinals;
        private _reusableNormalFinals;
        private _lastReusablePosUsed;
        private _lastReusableNormUsed;
        private _currFinalPositionSIMD;
        private _priorFinalPositionSIMD;
        private _currFinalNormalSIMD;
        private _priorFinalNormalSIMD;
        private _mirrorAxis;
        static BASIS: string;
        /**
         * @param {Mesh} _mesh - reference of QI.Mesh this ShapeKeyGroup is a part of
         * @param {String} _name - Name of the Key Group, upper case only
         * @param {Uint32Array} _affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
         */
        constructor(_mesh: BABYLON.Mesh, _name: string, _affectedPositionElements: Uint32Array);
        private _getDerivedName(referenceIdx, endStateIdxs, endStateRatios, mirrorAxes?);
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        addDerivedKeyFromDeformation(deformation: VertexDeformation): void;
        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxis - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         */
        addDerivedKey(referenceStateName: string, endStateName: string, endStateRatio: number, mirrorAxis?: string): void;
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on, probably 'Basis'
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {String} newStateName - The name of the new state.  If not set, then it will be computed.
         */
        addComboDerivedKey(referenceStateName: string, endStateNames: Array<string>, endStateRatios: Array<number>, mirrorAxes?: string, newStateName?: string): void;
        /** called in construction code from TOB.  Unlikely to be called by application code. */
        _addShapeKey(stateName: string, stateKey: Float32Array): void;
        /**
         * Remove the resources associated with a end state.
         * @param {string} endStateName - Name of the end state to be removed.
         */
        deleteShapeKey(stateName: string): void;
        /**
         * Called by the beforeRender() registered by this._mesh
         * ShapeKeyGroup is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        _incrementallyDeform(positions: Float32Array, normals: Float32Array): boolean;
        /** Only public, so can be swapped out with SIMD version */
        _updatePositions(positions: Float32Array): void;
        /** Only public, so can be swapped out with SIMD version */
        _updateNormals(normals: Float32Array): void;
        /** @override */
        _nextEvent(event: MotionEvent): void;
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
         * @param {number} referenceIdx - the index into _states[] to use as a reference
         * @param {Array<number>} endStateIdxs - the indexes into _states[] to use as a target
         * @param {Array<number>} endStateRatios - the ratios of the target state to achive, relative to the reference state
         * @param {string} mirrorAxes - axis [X,Y,Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {boolean} log - write console message of action, when true (Default false)
         *
         */
        private _buildPosEndPoint(targetArray, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes?, log?);
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
         * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
         */
        private _buildNormEndPoint(targetArray, endStatePos);
        private static _isMirroring(endStateRatios);
        /**
         * Determine if a key already exists.
         * @param {string} stateName - name of key to check
         */
        hasKey(stateName: string): boolean;
        private _getIdxForState(stateName);
        getName(): string;
        getNPosElements(): number;
        getNStates(): number;
        getStates(): Array<string>;
        toString(): string;
        mirrorAxisOnX(): void;
        mirrorAxisOnY(): void;
        mirrorAxisOnZ(): void;
    }
}
/// <reference path="deformation/shapeKeyBased/VertexDeformation.d.ts" />
/// <reference path="deformation/shapeKeyBased/ShapeKeyGroup.d.ts" />
/// <reference path="deformation/skeletonBased/Pose.d.ts" />
/// <reference path="deformation/skeletonBased/PoseProcessor.d.ts" />
/// <reference path="deformation/skeletonBased/Skeleton.d.ts" />
/// <reference path="queue/MotionEvent.d.ts" />
/// <reference path="queue/EventSeries.d.ts" />
/// <reference path="queue/PovProcessor.d.ts" />
/// <reference path="queue/TimelineControl.d.ts" />
declare module QI {
    /** An interface used so both implementing classes & Mesh do not have to reference each other.
     *
     * Any class implementing this MUST have constructor with 3 arguments:
     *      - The root level mesh to display.
     *      - An array of durations, length variable
     *      - An optional sound to accompany the entrance
     * Tower of Babel generates instancing this way.
     */
    interface GrandEntrance {
        makeEntrance(): void;
    }
    /**
     * Mesh sub-class which has a before render which processes events for ShapeKeysGroups, Skeleton Poses, and POV.
     */
    class Mesh extends BABYLON.Mesh implements SeriesTargetable {
        debug: boolean;
        private _registeredFN;
        private _positions32F;
        private _normals32F;
        private _povProcessor;
        private _shapeKeyGroups;
        private _poseProcessor;
        _originalPositions: Float32Array;
        _futurePositions: Float32Array;
        _futureNormals: Float32Array;
        private _clockStart;
        private _renderCPU;
        private _totalDeformations;
        private _totalFrames;
        _shapeKeyChangesMade: boolean;
        _skeletonChangesMade: boolean;
        private _lastFrameID;
        static COMPUTED_GROUP_NAME: string;
        static WHOOSH: BABYLON.Sound;
        entranceMethod: GrandEntrance;
        /**
         * @constructor - Args same As BABYLON.Mesh, except that using a source for cloning requires there be no shape keys
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent?: BABYLON.Node, source?: Mesh, doNotCloneChildren?: boolean);
        beforeRender(): void;
        resetTracking(): void;
        private _resetTracking(startTime);
        getTrackingReport(reset?: boolean): string;
        /** @override */
        createInstance(name: string): BABYLON.InstancedMesh;
        /** @override */
        convertToFlatShadedMesh(): void;
        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        setVerticesData(kind: any, data: any, updatable?: boolean): void;
        /** @override */
        dispose(doNotRecurse?: boolean): void;
        /**
         * Primarily called by Blender generated code.
         * @param {QI.ShapeKeyGroup} shapeKeyGroup - prebuilt group to add
         */
        addShapeKeyGroup(shapeKeyGroup: ShapeKeyGroup): void;
        /**
         * Cause the group to go out of scope.  All resources on heap, so GC should remove.
         * @param {string} groupName - The name of the group to look up.
         */
        removeShapeKeyGroup(groupName: string): void;
        /**
         * Go thru an array of Events prior to creating an event series.  Add a stall for any queue(s) that
         * does not have an event.  Useful for syncing the entire meshe's groups even though a queue may not
         * have an event.
         *
         * An example is when inserting a Grand Entrance.  The entrance may only use a shape key group.  The
         * coder may wish to add on / directly swing into action afterward using a pose.  If there was not a
         * stall added to the pose processor, pose event would begin before entrance was complete.
         *
         * @param {Array<any>} events - Events argument or EventSeries, prior to instancing.
         * @param {number} stallMillis - Amount of time to stall a queue.  Do not take into account any EventSeries
         * repeats, if any.
         * @param {string} groupForFuncActions - Should match the EventSeries constructor arg.  Defaults are the same.
         * @returns {Array<any>} - Same array as passed, with stalls added.
         */
        appendStallForMissingQueues(events: Array<any>, stallMillis: number, groupForFuncActions?: string): Array<any>;
        /**
         * wrapper a single MotionEvent into an EventSeries, defualting on all EventSeries optional args
         * @param {MotionEvent} event - Event to wrapper.
         */
        queueSingleEvent(event: MotionEvent): void;
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        queueEventSeries(eSeries: EventSeries, clearQueue?: boolean, stopCurrentSeries?: boolean, insertSeriesInFront?: boolean): void;
        hasShapeKeyGroup(groupName: string): boolean;
        getShapeKeyGroup(groupName: string): ShapeKeyGroup;
        getLastPoseNameQueuedOrRun(): string;
        assignPoseLibrary(libraryName: string): void;
        assignPoseImmediately(poseName: string): void;
        addSubPose(poseName: string, immediately?: boolean): void;
        removeSubPose(poseName: string): void;
        clearAllSubPoses(): void;
        /** entry point called by TOB generated code, when everything is ready. */
        grandEntrance(): void;
        /**
         * make computed shape key group when missing.  Used mostly by GrandEntrances.
         * @returns {ShapeKeyGroup} used for Javascript made end states.
         */
        makeComputedGroup(): ShapeKeyGroup;
        /**
         * make the whole heirarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        makeVisible(visible: boolean): void;
        private _instancePaused;
        /**
         * returns {boolean} True, when this specific instance is paused
         */
        isPaused(): boolean;
        /**
         * Called to pause this specific instance from performing additional animation.
         * This is independent of a system pause.
         */
        pausePlay(): void;
        /**
         * Called to resume animating this specific instance.
         * A system in pause will still prevent animation from resuming.
         */
        resumeInstancePlay(): void;
    }
}
declare module QI {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    class AudioRecorder {
        initialized: boolean;
        playbackReady: boolean;
        recording: boolean;
        private _requestedDuration;
        private _startTime;
        private _completionCallback;
        private _leftchannel;
        private _rightchannel;
        private _leftBuffer;
        private _rightBuffer;
        private _recorder;
        private _recordingLength;
        private _volume;
        private _audioInput;
        private static _objectUrl;
        private static _instance;
        /**
         * static function to return a AudioRecorder instance, if supported.  Single instance class.
         * @param {() => void} doneCallback - callback to return when sucessfully complete (optional)
         */
        static getInstance(doneCallback?: () => void): AudioRecorder;
        /**
         * static because it is in a callback for navigator.getUserMedia()
         */
        private static prepMic(stream);
        /**
         * Begin recording from the microphone
         * @param {number} durationMS- Length to record in millis (default Number.MAX_VALUE).
         * @param {() => void} doneCallback - Function to call when recording has completed (optional).
         */
        recordStart(durationMS?: number, doneCallback?: () => void): void;
        /**
         * Stop mic recording.  Called the onaudioprocess() when time expires.  Called actively when a
         * duration was not specified with recordStart().
         */
        recordStop(): void;
        /**
         * recording uses multiple buffers, each pushed onto an array.  This is called for each channel,
         * at the end of the recording, to combine them all into 1.
         * @param {Float32Array[]} channelBuffers- The recording buffers of either left or right channel.
         * @returns {Float32Array} combined data.
         */
        private _mergeBuffers(channelBuffers);
        /**
         * Delete buffers
         * @param {boolean} fullReset- Make no-longer playback ready (default true).
         */
        clean(fullReset?: boolean): void;
        /**
         * play recorded sound from internal buffers
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        playback(begin?: number, end?: number): void;
        /**
         * play sound from an external buffer
         * @param {AudioBuffer} audio - The external bufer
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static playbackExternal(audio: AudioBuffer, begin?: number, end?: number): void;
        /**
         * let it be known how many samples are in a recording
         * @returns{number}
         */
        getNSamples(): number;
        /**
         * Get the mic recorded data in the form of an AudioBuffer.  This can then be put into a
         * BABYLON.Sound via setAudioBuffer().  Also used internally, so can have .WAV / .TS methods work
         * from either an external sound or mic.
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {AudioBuffer}
         */
        getAudioBuffer(begin?: number, end?: number): AudioBuffer;
        /** revoke the last temp url */
        private static _cleanUrl();
        /**
         * Save the last mircorphone recording as an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        micToScript(sndName: string, stereo?: boolean, typeScript?: boolean, begin?: number, end?: number): void;
        /**
         * Save an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static saveToScript(sndName: string, audio: AudioBuffer, stereo?: boolean, typeScript?: boolean, begin?: number, end?: number): void;
        /**
         * Encode an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, and also the name of the function
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {string} - in-line source code
         */
        private static _getScriptSource(sndName, audio, stereo?, typeScript?, begin?, end?);
        /**
         * encode a float array with values (-1 to 1) as BASE 64 string, after converting to a short int (16 bit)
         */
        private static _floatTo16BitIntBase64(array);
        /**
         * Save the last mircorphone recording as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        micToWAV(filename: string, stereo?: boolean, begin?: number, end?: number): void;
        /**
         * Save an audio buffer as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {AudioBuffer} audio - buffer to save
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static saveToWAV(filename: string, audio: AudioBuffer, stereo?: boolean, begin?: number, end?: number): void;
        /**
         * Encode an audio buffer into a WAV formatted DataView
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {DataView} - WAV formatted
         */
        private static _encodeWAV(audio, stereo?, begin?, end?);
        /**
         * Combine left and right channels, alternating values, returned in a new Array
         */
        private static _interleave(left, right);
        /**
         * encode a text string into a dataview as 8 bit characters
         * @param {DataView} view- DataView to update
         * @param {number} offset- location in view to edit
         * @param {string} str- Values to insert
         */
        private static _writeUTFBytes(view, offset, str);
    }
}
declare module QI {
    function decodeChannel(base64: string): Float32Array;
}
/// <reference path="AudioDecoder.d.ts" />
declare module QI {
    function Whoosh(scene: BABYLON.Scene): BABYLON.Sound;
}
/// <reference path="Eyes.d.ts" />
/// <reference path="../Mesh.d.ts" />
declare module BEING {
    class Body extends QI.Mesh {
        private static _WINK;
        private static _BOTH_CLOSED;
        private static _LEFT;
        private static _RIGHT;
        private static _BLINK_DISABLED;
        private static _WINK_BLINK_INPROGRESS;
        private static _NOTHING_QUEUED;
        private static _BLINK_QUEUED;
        private static _WINK_LEFT_QUEUED;
        private static _WINK_RIGHT_QUEUED;
        private static _DEFORM_SPEED;
        private static _CLOSE_PAUSE;
        private static _MAX_INTERVAL;
        static _FACE: string;
        private static _MAX_CHANGES_FOR_MOOD;
        eyes: Eyes;
        private _winker;
        private _winkStatus;
        private _doInvoluntaryBlinking;
        private _blinkInterval;
        private _lastBlink;
        private _winkCloseTime;
        private _stdBlinkSeries;
        private _face;
        hasExpressions: boolean;
        expressionNames: string[];
        private _winkableExpressions;
        private _currentExpressionIdx;
        private _currentExpDegree;
        private _continuousMoodChanging;
        private _numChangesOfCurrentMood;
        private _totChangesOfCurrentMood;
        /** neither the child eye meshes nor the shapekeys will be defined until the subclass constructor has run, so this put here */
        postConstruction(): void;
        /**
         * Broken out from postConstruction for modularity.  Verifies mesh actually has expressions, and lists them.
         */
        private _mapAvailableExpressions();
        /** @override */
        beforeRender(): void;
        /**
         * Called by beforeRender(), unless no wink shape key group, or nothing to do.
         * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
         */
        private _winkPostProcessing();
        /** function added to the end of a wink event series, to schedule the next involuntary blink */
        private _resetForNextBlink();
        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        winkLeft(closeTime?: number): void;
        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        winkRight(closeTime?: number): void;
        /**
         * Indicate that a single blink should occur at the next available opportunity.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        blink(closeTime?: number): void;
        /**
         * Indicate whether involuntary blinking should occur.
         * @param {boolean} enabled - when true
         */
        involuntaryBlinkingEnabled(enabled: boolean): void;
        /**
         * This queues the next change.  When called from beforeRender / continuous Mood changing,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In continuous mood changing, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */
        private _moodPostProcessing(skipChanging?);
        private _pickAMood();
        /**
         * To enable / disable continuous mood changing mode.
         * @param {boolean} on - The switch.
         */
        setContinuousMoodChanging(on: boolean): void;
        /**
         * external call to manually change mood, or at least let the system know what you just queued
         * yourself (useful for speech, so continous mood might resume gracefully).
         * @param {string} expression - Name of the shape key representing the expression to change to, or the
         * last one in the series you just queued yourself.
         * @param {number} degree - This is a value 0 - 1, indicating the degree to which max deformation
         * to expression should occur.
         * @param {boolean} justDocumenting - When true you have already submitted your own event series
         * that set the expression, but you want the system to know.
         */
        setCurrentMood(expression: string, degree: number, justDocumenting?: boolean): void;
    }
}
/// <reference path="../Mesh.d.ts" />
declare module QI {
    class GatherEntrance implements GrandEntrance {
        _mesh: Mesh;
        durations: Array<number>;
        soundEffect: BABYLON.Sound;
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(_mesh: Mesh, durations: Array<number>, soundEffect?: BABYLON.Sound);
        /** GrandEntrance implementation */
        makeEntrance(): void;
        /**
         * Build a SCATTER end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        static buildScatter(mesh: Mesh): string;
    }
}
/// <reference path="../Mesh.d.ts" />
declare module QI {
    /**
     * The Fire Entrance REQUIRES that BABYLON.FireMaterial.js be loaded
     */
    class FireEntrance implements GrandEntrance {
        _mesh: Mesh;
        durations: Array<number>;
        soundEffect: BABYLON.Sound;
        private _count;
        private _diffuse;
        private _distortion;
        private _opacity;
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(_mesh: Mesh, durations: Array<number>, soundEffect?: BABYLON.Sound);
        /** GrandEntrance implementation */
        makeEntrance(): void;
        /**
         * Even with inline textures, the shaders must still be compiled.  Cannot
         * allow mesh to be visible prior or permanent material will flash.
         */
        private _loaded();
        /**
         * The fire is now ready. Go for it.
         */
        private _showTime();
    }
}
/// <reference path="../Mesh.d.ts" />
declare module QI {
    class ExpandEntrance implements GrandEntrance {
        _mesh: Mesh;
        durations: Array<number>;
        soundEffect: BABYLON.Sound;
        private _HighLightLayer;
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(_mesh: Mesh, durations: Array<number>, soundEffect?: BABYLON.Sound);
        /** GrandEntrance implementation */
        makeEntrance(): void;
        /**
         * Build a NUCLEUS end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        static buildNucleus(mesh: Mesh): string;
    }
}
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    var MeshFactory = (function () {
        function MeshFactory() {
        }
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        MeshFactory.instance = function (moduleName, meshName, cloneSkeleton) {
            var ret;
            for (var i = 0, len = MeshFactory.MODULES.length; i < len; i++) {
                if (moduleName === MeshFactory.MODULES[i].getModuleName()) {
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret)
                BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        };
        MeshFactory.MODULES = new Array();
        return MeshFactory;
    }());
    TOWER_OF_BABEL.MeshFactory = MeshFactory;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));
