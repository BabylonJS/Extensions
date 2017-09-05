declare module TOWER_OF_BABEL {
    interface FactoryModule {
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
        getModuleName(): string;
    }
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    class MeshFactory {
        static MODULES: FactoryModule[];
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        static instance(moduleName: string, meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}

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
         * @param {boolean} enableDebug -  This allows turning on debug by POVProcessor after constructor, if QI.Mesh Debug enabled
         */
        activate(groupName: string, enableDebug?: boolean): void;
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
        getClassName(): string;
        toScript(): string;
        /**
         * Perform the method without regard for the mode.  MUST be overridden
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        protected _compute(currentDurationRatio: number): number;
    }
    class CirclePace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class CubicPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class ElasticPace extends Pace {
        oscillations: number;
        springiness: number;
        constructor(oscillations?: number, springiness?: number, mode?: number);
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class ExponentialPace extends Pace {
        exponent: number;
        constructor(exponent?: number, mode?: number);
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class PowerPace extends Pace {
        power: number;
        constructor(power?: number, mode?: number);
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class QuadraticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: any): number;
        getClassName(): string;
    }
    class QuarticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class QuinticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class SinePace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
    }
    class BezierCurvePace extends Pace {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        constructor(x1?: number, y1?: number, x2?: number, y2?: number, mode?: number);
        /** @override */
        protected _compute(currentDurationRatio: number): number;
        getClassName(): string;
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
        getClassName(): string;
        /** @override */
        toScript(): string;
    }
}

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
        private static _privelegedNow;
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
        static readonly manualFrameRate: number;
        static readonly isRealtime: boolean;
        static readonly Now: number;
        static readonly PrivilegedNow: number;
        static readonly FrameID: number;
        static Speed: number;
        static readonly scene: BABYLON.Scene;
        private static _systemResumeTime;
        private static _systemPaused;
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        static readonly isSystemPaused: boolean;
        static pauseSystem(needPrivilegedSound?: boolean): void;
        static resumeSystem(): void;
        static readonly SystemResumeTime: number;
    }
}

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
        private _isQIMesh;
        protected _queue: EventSeries[];
        protected _currentSeries: EventSeries;
        protected _currentStepInSeries: MotionEvent;
        protected _runOfStep: number;
        private _endOfLastFrameTs;
        protected _ratioComplete: number;
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
         * @param {EventSeries| Array<any>} eSeriesOrArray - The series to append to the end of series queue.  Can also be an array when
         * defaulting on other EventSeries Args, to make application level code simpler.
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        queueEventSeries(eSeriesOrArray: EventSeries | Array<any>, clearQueue?: boolean, stopCurrentSeries?: boolean): void;
        /**
         * Place this series next to be run.
         */
        insertSeriesInFront(eSeriesOrArray: EventSeries): void;
        /**
         * @param {number} _nRepeats - Number of times to run through series elements.
         */
        queueSingleEvent(event: MotionEvent, nRepeats?: number): void;
        /**
         * Clear out any events
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
        /** returns true when either something is running (could be blocked or waiting) or something queued */
        isActive(): boolean;
        /**
         * primarily for diagnostic purposes
         */
        getQueueState(): string;
        /**
         * Public for sub-classing in PoseProcessor & ShapeKeyGroup.
         * @param {MotionEvent} event - The event processed and assigned the current step
         * @param {BABYLON.Vector3} movementScaling - Passed by PoseProcessor sub-class, multiplier to account for
         * the skeleton being different from the one used to build the skeleton library; optional
         */
        _nextEvent(event: MotionEvent, movementScaling?: BABYLON.Vector3): void;
        private _calcRef;
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
         * @param {BABYLON.Vector3} ref - optional Vector to use to return the result
         * @returns The vector to add to position
         */
        calcMovePOV(amountRight: number, amountUp: number, amountForward: number, ref?: BABYLON.Vector3): BABYLON.Vector3;
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
        static readonly Version: string;
        static LerpToRef(start: BABYLON.Vector3, end: BABYLON.Vector3, amount: number, result: BABYLON.Vector3): void;
        static SlerpToRef(left: BABYLON.Quaternion, right: BABYLON.Quaternion, amount: number, result: BABYLON.Quaternion): BABYLON.Quaternion;
        static formatQuat(d: BABYLON.Quaternion): string;
    }
}

declare module QI {
    /**
     * Abstract sub-class of MotionEvent, sub-classed by PropertyEvent & RecurringCallbackEvent
     */
    class NonMotionEvent extends MotionEvent {
        private _paused;
        private _scene;
        private _registeredFN;
        private _alsoCleanFunc;
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        initialize(lateStartMilli?: number, scene?: BABYLON.Scene): void;
        toScript(): string;
        getClassName(): string;
        private _beforeRender();
        /**
         * Stop / cleanup resources. Only does anything when not being added to a queue.
         */
        clear(): void;
        /**
         * assign things to also be done when complete.  Used by instancers which are not sub-classing.
         * Unlike other stuff in clear(), this always runs.
         * @param {() => void} func - run in clear method as well.
         */
        alsoClean(func: () => void): void;
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
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      privilegedEvent - NonMotionEvents Only, when not running from a Queue:
         *                        Support for SceneTransitions, which can then system pause while running.
         */
        constructor(_object: Object, _property: string, _targetValue: any, milliDuration: number, options?: IMotionEventOptions);
        getClassName(): string;
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
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      privilegedEvent - NonMotionEvents Only:
         *                        Support for SceneTransitions, which can then system pause while running.
         */
        constructor(_callback: (ratioComplete: number) => void, milliDuration: number, options?: IMotionEventOptions);
        getClassName(): string;
        _incrementallyUpdate(ratioComplete: number): void;
    }
}

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
        mirrorAxes?: string;
        /**
         * Skeletons Only:
         * Subposes which should be substituted during event (default null).
         */
        subposes?: string[];
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
    class MotionEvent {
        private _milliDuration;
        movePOV: BABYLON.Vector3;
        rotatePOV: BABYLON.Vector3;
        static LINEAR: SteppedPace;
        private _syncPartner;
        options: IMotionEventOptions;
        private _noOptions;
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
        constructor(_milliDuration: number, movePOV: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        toString(): string;
        /** override when millis, move, or rotate not needed */
        toScript(): string;
        protected _toScriptImpl(needMillis: boolean, needMove: boolean, needRotate: boolean): string;
        /** overridden by classes which have custom args in constructor */
        protected _toScriptCustomArgs(): string;
        /**
         * Broken out in case toScript needs to be overridden.
         */
        protected _toScriptOptions(): string;
        /** Needs to be overridden by sub-classes. */
        getClassName(): string;
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        activate(lateStartMilli?: number): void;
        /** called to determine how much of the Event should be performed right now */
        getCompletionMilestone(): number;
        /** Test to see if sound is ready.  Tolerant to sound not part of event */
        isSoundReady(): boolean;
        /** Test to see if prior event is complete.  Tolerant to prior event not part of event */
        isPriorComplete(): boolean;
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
        isSyncBlocked(): boolean;
        isWaiting(): boolean;
        isComplete(): boolean;
        isExecuting(): boolean;
        readonly milliDuration: number;
        readonly millisBefore: number;
        readonly pace: Pace;
        readonly syncPartner: MotionEvent;
        private readonly _now;
        /**
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
         */
        setProratedWallClocks(factor: number, isRepeat: boolean): void;
        private static _BLOCKED;
        private static _SYNC_BLOCKED;
        private static _WAITING;
        private static _READY;
        private static _COMPLETE;
        static readonly BLOCKED: number;
        static readonly SYNC_BLOCKED: number;
        static readonly WAITING: number;
        static readonly READY: number;
        static readonly COMPLETE: number;
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
        toScript(): string;
        getClassName(): string;
    }
}

declare module QI {
    function Whoosh(scene: BABYLON.Scene): BABYLON.Sound;
}

declare module QI {
    function decode16Bit(base64: string): Float32Array;
}

declare module QI {
    function Teleport(scene: BABYLON.Scene): BABYLON.Sound;
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
         * @param {() => void} doneCallback - callback to return when successfully complete (optional)
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
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        playback(downSampling?: number, begin?: number, end?: number): void;
        /**
         * play sound from an external buffer
         * @param {AudioBuffer} audio - The external bufer
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static playbackExternal(audio: AudioBuffer, downSampling?: number, begin?: number, end?: number): void;
        /**
         * let it be known how many samples are in a recording
         * @returns{number}
         */
        getNSamples(): number;
        /**
         * Get the mic recorded data in the form of an AudioBuffer.  This can then be put into a
         * BABYLON.Sound via setAudioBuffer().  Also used internally, so can have .WAV / .TS methods work
         * from either an external sound or mic.
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {AudioBuffer}
         */
        getAudioBuffer(downSampling?: number, begin?: number, end?: number): AudioBuffer;
        /** revoke the last temp url */
        private static _cleanUrl();
        /**
         * Save the last mircorphone recording as an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        micToScript(sndName: string, stereo?: boolean, downSampling?: number, typeScript?: boolean, begin?: number, end?: number): void;
        /**
         * Save an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static saveToScript(sndName: string, audio: AudioBuffer, stereo?: boolean, downSampling?: number, typeScript?: boolean, begin?: number, end?: number): void;
        /**
         * Encode an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, and also the name of the function
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {boolean} typeScript - Style of function to build, Typescript when True, else Javascript
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {string} - in-line source code
         */
        private static _getScriptSource(sndName, audio, stereo, downSampling, typeScript, begin, end?);
        /**
         * encode a float array with values (-1 to 1) as BASE 64 string, after converting to a short int (16 bit)
         */
        private static _floatTo16BitIntBase64(array);
        private static _to16Bit(val);
        /**
         * Save the last mircorphone recording as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        micToWAV(filename: string, stereo?: boolean, downSampling?: number, begin?: number, end?: number): void;
        /**
         * Save an audio buffer as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {AudioBuffer} audio - buffer to save
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        static saveToWAV(filename: string, audio: AudioBuffer, stereo?: boolean, downSampling?: number, begin?: number, end?: number): void;
        /**
         * Encode an audio buffer into a WAV formatted DataView
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {DataView} - WAV formatted
         */
        private static _encodeWAV(audio, stereo, downSampling, begin, end?);
        /**
         * encode a text string into a dataview as 8 bit characters
         * @param {DataView} view- DataView to update
         * @param {number} offset- location in view to edit
         * @param {string} str- Values to insert
         */
        private static _writeUTFBytes(view, offset, str);
        /**
         * Combine left and right channels, alternating values, returned in a new Array
         */
        private static _interleave(left, right);
        private static _downSampling(buf, factor);
    }
}

declare module QI {
    /**
     * Implemented using the ShaderBuilder extension embedded into QI.
     * This is an abstract class.  A concrete subclass needs to implement _getEffectHostMesh() & _makeCallback()
     */
    class ShaderBuilderEntrance extends AbstractGrandEntrance {
        private static _SB_INITIALIZED;
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         * @param {boolean} disposeSound - When true, dispose the sound effect on completion. (Default false)
         */
        constructor(mesh: Mesh, durations: Array<number>, soundEffect?: BABYLON.Sound, disposeSound?: boolean);
        /**
         * The mesh returned contains a material that was built by ShaderBuilder.  Subclass should override.
         */
        protected _getEffectHostMesh(): BABYLON.Mesh;
        /**
         * Method for making the call back for the recurring event.  Subclass should override.
         */
        protected _makeCallback(): (ratioComplete: number) => void;
        protected _effectHostMesh: BABYLON.Mesh;
        protected _originalScale: BABYLON.Vector3;
        /** @override */
        makeEntrance(): void;
    }
    /**
     * Sub-class of ShaderBuilderEntrance, for using the teleport entrance
     */
    class TeleportEntrance extends ShaderBuilderEntrance {
        private static _RADUIS_MULT;
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#0
         */
        _getEffectHostMesh(): BABYLON.Mesh;
        /**
         * @override
         * method for making the call back for the recurring event.
         */
        _makeCallback(): (ratioComplete: number) => void;
    }
    /**
     * Sub-class of ShaderBuilderEntrance, for using the poof entrance
     */
    class PoofEntrance extends ShaderBuilderEntrance {
        private static _MAX_TIME;
        private _st_time;
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#21
         */
        _getEffectHostMesh(): BABYLON.Mesh;
        /**
         * @override
         * method for making the call back for the recurring event.  Subclass should override.
         */
        _makeCallback(): (ratioComplete: number) => void;
    }
}

declare module QI {
    class GatherEntrance extends AbstractGrandEntrance {
        /** @override */
        makeEntrance(): void;
        /**
         * Build a SCATTER end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        static buildScatter(mesh: Mesh): string;
    }
}

declare module QI {
    class AbstractGrandEntrance {
        _mesh: QI.Mesh;
        durations: Array<number>;
        protected soundEffect: BABYLON.Sound;
        protected _options: IMotionEventOptions;
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.
         * @param {BABYLON.Sound} soundEffect - An optional sound to play as a part of entrance.
         * @param {boolean} disposeSound - When true, dispose the sound effect on completion. (Default false)
         */
        constructor(_mesh: QI.Mesh, durations: Array<number>, soundEffect?: BABYLON.Sound, disposeSound?: boolean);
        makeEntrance(): void;
    }
}

declare module QI {
    class FadeInEntrance extends AbstractGrandEntrance {
        /** @override */
        makeEntrance(): void;
    }
}

declare module QI {
    /**
     * The Fire Entrance REQUIRES that BABYLON.FireMaterial.js be loaded
     */
    class FireEntrance extends AbstractGrandEntrance {
        private _count;
        private _diffuse;
        private _distortion;
        private _opacity;
        /** @override */
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

declare module QI {
    class ExpandEntrance extends AbstractGrandEntrance {
        private _HighLightLayer;
        private _kids;
        /** @override */
        makeEntrance(): void;
    }
}

declare module QI {
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
        entranceMethod: AbstractGrandEntrance;
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
        convertToFlatShadedMesh(): BABYLON.Mesh;
        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        setVerticesData(kind: string, data: number[] | Float32Array, updatable?: boolean, stride?: number): BABYLON.Mesh;
        /** @override */
        dispose(doNotRecurse?: boolean): void;
        /**
         * Primarily called by Blender generated code.
         * @param {QI.ShapeKeyGroup} shapeKeyGroup - prebuilt group to add
         */
        addShapeKeyGroup(shapeKeyGroup: ShapeKeyGroup): void;
        /**
         * create a new shapekey group from a list of others.  Useful to export smaller more focused groups
         * upon load.
         * @param {string} newGroupName - The name the consolidated group to create
         * @param {Array<string>} thoseToMerge - Names of the groups to merge
         * @param {boolean} keepOrig - Do not delete original groups when true. (default: false)
         * @returns {ShapeKeyGroup} The consolidate group
         */
        consolidateShapeKeyGroups(newGroupName: string, thoseToMerge: Array<string>, keepOrig?: boolean): ShapeKeyGroup;
        /**
         * Cause the group to go out of scope.  All resources on heap, so GC should remove it.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        removeShapeKeyGroup(groupName: string): void;
        /**
         * When there are overlaps of vertices of shapekey groups, the last one processed wins
         * if both are active in a given frame.  eg. Automaton's WINK & FACE groups.  Can be
         * run multiple times, but of course order your calls in the opposite order.
         * @param {string} groupName - Group to process last.
         */
        setShapeKeyGroupLast(groupName: string): void;
        /**
         * Clear out any events, on all the queues the Mesh has.
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        clearAllQueues(stopCurrentSeries?: boolean): void;
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
         * wrapper a single MotionEvent into an EventSeries, defaulting on all EventSeries optional args
         * @param {MotionEvent or function} event - Event or function to wrapper.
         */
        queueSingleEvent(event: MotionEvent): void;
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries| Array<any>} eSeriesOrArray - The series to append to the end of series queue.  Can also be an array when
         * defaulting on other EventSeries Args, to make application level code simpler.
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        queueEventSeries(eSeriesOrArray: EventSeries | Array<any>, clearQueue?: boolean, stopCurrentSeries?: boolean, insertSeriesInFront?: boolean): void;
        /**
         * primarily for diagnostic purposes
         */
        getAllQueueStates(): string;
        /**
         * Query for determining if a given shapekey has been defined for the mesh.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        hasShapeKeyGroup(groupName: string): boolean;
        /**
         * Return a ShapeKeyGroup Object defined for the mesh.  Primarily for internal use.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        getShapeKeyGroup(groupName: string): ShapeKeyGroup;
        /**
         * Convenience method for queuing a single deform with a single endstate relative to basis state.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1
         *
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
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         * @returns {Deformation} This is the event which gets queued.
         */
        queueDeform(groupName: string, endStateName: string, endStateRatio: number, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions): Deformation;
        /**
         * Go to a single pre-defined state immediately.  Much like assignPoseImmediately, can be done while
         * mesh is not currently visible.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         */
        deformImmediately(groupName: string, stateName: string): void;
        /**
         * Assign the pose library to the mesh.  Only one library can be assigned at once, so any it
         * is a bad idea to perform this while pose events are queued.
         * @param {string} libraryName - The name given in Blender when library generated.
         */
        assignPoseLibrary(libraryName: string): void;
        /**
         * Go to a pose immediately.  This can done while the mesh is not currently visible.
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         */
        assignPoseImmediately(poseName: string): void;
        /**
         * Convenience method for queuing a single pose on the skeleton.
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {string[]} subposes - sub-poses which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any sub-poses should actually be subtracted during event(default false)
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
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         *
         * @returns {PoseEvent} This is the event which gets queued.
         */
        queuePose(poseName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions): PoseEvent;
        /**
         * assign a sub-pose onto the current state of the skeleton.  Not truly immediate, since it is still queued,
         * unlike assignPoseImmediately().
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         *
         * @returns {PoseEvent} This is the event which gets queued.
         */
        assignSubPoseImmediately(poseName: string): PoseEvent;
        /**
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         * @param {number} standAloneMillis - optional, when present an event is generated to assignment to current pose.
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level (when standalone)
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         *
         * @returns {PoseEvent} This is the event which gets queued.  Null when no millis.
         */
        addSubPose(poseName: string, standAloneMillis?: number, options?: IMotionEventOptions): PoseEvent;
        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        removeSubPose(poseName: string): void;
        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        clearAllSubPoses(): void;
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        getLastPoseNameQueuedOrRun(): string;
        /**
         * Convenience method for queuing a single move on the mesh.
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
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
         * @returns {MotionEvent} This is the event which gets queued.
         */
        queuePOV(milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions): MotionEvent;
        /** Entry point called by TOB generated code, when everything is ready.
         *  To load in advance without showing export disabled.  Call this when ready.
         *  Can also be called after the first time, if makeVisible(false) was called.
         */
        grandEntrance(): void;
        /**
         * Get Every material in use by the mesh & it's children.  This is primarily for compileMaterials(),
         * but needs to be broken out, so it can be called recursively.
         *
         * @param repo - This is an array of dictionaries with entries of a mesh & material, initialized when missing.
         * @param meshPassed - An argument of the mesh (child mesh) to operate on.
         * @returns an array of dictionaries with entries of a mesh & material.
         */
        getEverySimpleMaterial(repo?: Array<{
            mesh: BABYLON.Mesh;
            mat: BABYLON.Material;
        }>, meshPassed?: BABYLON.Mesh): Array<{
            mesh: BABYLON.Mesh;
            mat: BABYLON.Material;
        }>;
        /**
         * Ensure that all materials for this mesh & it's children are actively forced to compile
         */
        compileMaterials(completionCallback?: () => void): void;
        /**
         * make computed shape key group when missing.  Used mostly by GrandEntrances.
         * @returns {ShapeKeyGroup} used for Javascript made end states.
         */
        makeComputedGroup(): ShapeKeyGroup;
        /**
         * make the whole hierarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        makeVisible(visible: boolean, compileMats?: boolean): void;
        /**
         * Used by some GrandEntrances to get the center of the entire mesh with children too.
         *
         */
        getSizeCenterWtKids(): {
            size: BABYLON.Vector3;
            center: BABYLON.Vector3;
        };
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
    class Hair extends BABYLON.Mesh {
        static _Colors: {
            [name: string]: BABYLON.Color3;
        };
        private _nPosElements;
        private _strandNumVerts;
        cornerOffset: number;
        namedParameter: any;
        seed: number;
        colorSpread: number;
        intraStrandColorSpread: number;
        alpha: number;
        color: BABYLON.Color3;
        private _namedColor;
        namedColor: string;
        /**
         * @constructor - Args same As BABYLON.Mesh, except that the arg for useVertexColor in LinesMesh is not passed an hard-coded to true
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent?: BABYLON.Node, source?: BABYLON.LinesMesh, doNotCloneChildren?: boolean);
        /**
         * Called to generate the geometry using values which are more compact to pass & allow multiple things to be defined.
         * @param {number[]} strandNumVerts -The number of verts per each strand.
         * @param {number[]} rootRelativePositions - The x, y, z values of each point.  First is root is absolute, rest are delta to root.
         *                                           More compact than absolute for all, & useful in calculating hair length at each point.
         * @param {number} longestStrand - The longest distance between the first & last points in the strands, optional.
         * @param {number} stiffness - The matrix weight at the end of the longest strand, optional.
         * @param {number} boneName - The name of the bone in the skeleton to be used as a bone influencer, optional.
         */
        assemble(strandNumVerts: number[], rootRelativePositions: number[], longestStrand?: number, stiffness?: number, boneName?: string): void;
        /**
         * Positions of strands are sent relative to the start of each strand, which saves space; undo here
         * Also accumulates the # of position elements (verts * 3), for easy FloatArray initialization.
         */
        private _toAbsolutePositions(rootRelativePositions);
        private _dump(values, name);
        private static _right;
        private static _up;
        private static _forward;
        private _extrudeTriangle(adx, hasPrev, hasNext, absPositions, positions32, pdx);
        private _assignWeights(rootRelativePositions, longestStrand?, stiffness?, boneName?);
        assignVertexColor(): void;
        private _lengthSoFar(deltaX, deltaY, deltaZ);
        private _workingSeed;
        random(): number;
    }
}

declare module QI {
    interface Transition {
        initiate(meshes: Array<BABYLON.AbstractMesh>, overriddenMillis: number, overriddenSound: BABYLON.Sound, options?: any): void;
    }
    class SceneTransition {
        /**
         * Using a static dictionary to get transitions, so that custom transitions not included can be referenced.
         * Stock transitions already loaded.
         */
        static EFFECTS: {
            [name: string]: Transition;
        };
        /**
         * This is the entry point call in the Tower of Babel generated code once all textures are buffered.
         */
        static perform(sceneTransitionName: string, meshes: Array<BABYLON.AbstractMesh>, overriddenMillis?: number, overriddenSound?: BABYLON.Sound, options?: any): void;
        static makeAllVisible(meshes: Array<BABYLON.AbstractMesh>): void;
    }
}

declare module QI {
    class IntoFocusTransition implements Transition {
        static NAME: string;
        private static _INITIAL_KERNEL;
        private static _DEFAULT_MILLIS;
        private _sound;
        /**
         * Transition implementation
         */
        initiate(meshes: Array<BABYLON.AbstractMesh>, overriddenMillis: number, overriddenSound: BABYLON.Sound): void;
    }
}

declare module QI {
    class ToColorTransition implements Transition {
        static NAME: string;
        private static _DEFAULT_MILLIS;
        private _sound;
        /**
         * Transition implementation
         */
        initiate(meshes: Array<BABYLON.AbstractMesh>, overriddenMillis: number, overriddenSound: BABYLON.Sound): void;
    }
}

declare module QI {
    class VisiblityTransition implements Transition {
        static NAME: string;
        private static _DEFAULT_MILLIS;
        private _sound;
        private _meshes;
        /**
         * Transition implementation
         * uses an option runUnPrivileged
         */
        initiate(meshes: Array<BABYLON.AbstractMesh>, overriddenMillis: number, overriddenSound: BABYLON.Sound, options?: any): void;
        private _changeVisiblity(ratioComplete, meshes);
    }
}

declare module QI {
    class CylinderCamera extends BABYLON.ArcRotateCamera {
        _isVertical: boolean;
        private _targetMesh;
        private _traverseOffset;
        static FixedVert: number;
        static FixedHorz: number;
        constructor(name: string, _isVertical: boolean, alphaOrBeta: number, radius: number, scene: BABYLON.Scene, targetMesh?: BABYLON.AbstractMesh, toBoundingCenter?: boolean);
        protected _getTargetPosition(): BABYLON.Vector3;
        _checkInputs(): void;
        protected _checkLimits(): void;
        rebuildAnglesAndRadius(): void;
        setTargetMesh(target: BABYLON.AbstractMesh, toBoundingCenter?: boolean): void;
        zoomOn(meshes?: BABYLON.AbstractMesh[], doNotUpdateMaxZ?: boolean): void;
        focusOn(meshesOrMinMaxVectorAndDistance: any, doNotUpdateMaxZ?: boolean): void;
        createRigCamera(name: string, cameraIndex: number): BABYLON.Camera;
        dispose(): void;
        getClassName(): string;
    }
}

declare module TOWER_OF_BABEL {
    class Preloader {
        jsPath: string;
        matPath: string;
        static READ_AHEAD_LOGGING: boolean;
        static MAKE_MULTI_SCENE: boolean;
        static SCENE: BABYLON.Scene;
        _characters: {
            [desc: string]: Character;
        };
        _busts: {
            [desc: string]: Character;
        };
        private _sceneChunks;
        private static _images;
        /**
         * A Preloader holds the info to dynamically load TOB generated files, which are both in the
         * same directory & have the same directory for images.  There are methods to add files (characters, bust, & scene chunks),
         * and methods to request they start loading.
         */
        constructor(jsPath: string, matPath: string);
        /**
         * Register a character as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingCharacters() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        addCharacter(player: Character, desc: string): void;
        /**
         * Register a bust as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingBusts() is called.
         * @param {Character} player - An instance of the Character, PreLoadable, to add.
         */
        addBust(player: Character, desc: string): void;
        /**
         * Register a scene chunk as a pre-loadable object.  Nothing actually is retrieved unless it is picked,
         * or prepRemainingChunks() is called.
         * @param {SceneChunk} chunk - An instance of the SceneChunk, PreLoadable, to add.
         */
        addSceneChunk(chunk: SceneChunk, desc: string): void;
        static addtextureBuffer(image: TextureBuffer): void;
        /**
         * Called by defineMaterials(), generated code, to finally assign the pre-loaded texture data to a BABYLON.Texture.
         * Called also by readAhead(), generated code, to detect if there was already an attempt.  Materials using the same texture data,
         * should have the same fName, & namespace .eg. 'shared'.
         * @param {string} fName - The name of the data given when pre-loaded, the base file name before and reduced texture swaps.
         * @returns {TextureBuffer} - The buffer object which might have already been loaded or not yet.
         */
        static findTextureBuffer(fName: string): TextureBuffer;
        readonly numCharacters: number;
        readonly numBusts: number;
        readonly numSceneChunks: number;
        getCharacterKeys(): string[];
        getBustKeys(): string[];
        getSceneChunkKeys(): string[];
        prepRemainingCharacters(): void;
        prepRemainingBusts(): void;
        prepRemainingSceneChunks(): void;
        private _prepRemaining(dict);
        /** return a character
         *  @param {number | string} indexOrKey - The order in the dictionary, or the key.  Random when not specified
         */
        pickCharacter(indexOrKey?: number | string): Character;
        /** return a bust
         *  @param {number | string} indexOrKey - The order in the dictionary, or the key.  Random when not specified
         */
        pickBust(indexOrKey?: number | string): Character;
        private _pick(dict, indexOrKey?);
        private _getNth(dict, index);
    }
}

declare module TOWER_OF_BABEL {
    /**
     * A Preloadable is a Tower of Babel generated Javascript file.  This class is not intended to
     * be directly instanced.  Use Character or SceneChunk sub-classes.
     *
     * The Character class is a Mesh sub-class within the Javascript file.
     *
     * The SceneChunk class is for calling the initScene of the Javascript file(creating all meshes of .blend).
     * There can be meshes & lights in export, but probably should not have a camera unless it will always be
     * the only or first chunk.
     */
    class PreLoadable {
        moduleName: string;
        private _jsFile;
        _preloader: Preloader;
        _onPath: boolean;
        private _inProgress;
        private _loadStart;
        private _userCallback;
        constructor(moduleName: string, _jsFile: string);
        makeReady(readyCallback?: () => void): boolean;
    }
    class Character extends PreLoadable {
        className: string;
        constructor(moduleName: string, jsFile: string, className: string);
        /**
         * Should be part of the callback passed to makeReady().
         */
        instance(name: string): BABYLON.Mesh;
    }
    class SceneChunk extends PreLoadable {
        /**
         * Should be part of the callback passed to makeReady().
         * @param {BABYLON.Scene} scene - Needed to pass to the Mesh constructor(s) of the scene chunk's meshes / lights / etc.
         */
        instance(scene: BABYLON.Scene): void;
    }
}

declare module TOWER_OF_BABEL {
    /**
     * a class to hold the buffer of pre-fetched texture
     */
    class TextureBuffer {
        path: string;
        fName: string;
        static DIFFUSE_TEX: number;
        static BUMP_TEX: number;
        static AMBIENT_TEX: number;
        static OPACITY_TEX: number;
        static EMISSIVE_TEX: number;
        static SPECULAR_TEX: number;
        static REFLECTION_TEX: number;
        hasAlpha: boolean;
        level: number;
        coordinatesIndex: number;
        coordinatesMode: number;
        uOffset: number;
        vOffset: number;
        uScale: number;
        vScale: number;
        uAng: number;
        vAng: number;
        wAng: number;
        wrapU: number;
        wrapV: number;
        _buffer: ArrayBuffer | HTMLImageElement;
        private _fetchStart;
        private _mat;
        private _txType;
        private _userCallback;
        /**
         * Called from the matReadAhead() of the generated code with the info needed to perform fetch.
         * @param {string} path - This is the site / directory part of the URL.  When using read ahead,
         * this is the matPath property of the preloader.  When static, this is passed originally
         * from the Mesh constructor.
         * @param {string} fName - This is the base filename, generated in the matReadAhead() code.
         */
        constructor(path: string, fName: string);
        /**
         * function broken out so can call while falling back, if required.
         * @param {boolean} fallingBack - indicates being called a 2nd time after failing
         */
        private _load(fallingBack);
        /**
         * The callback called by either LoadFile or LoadImage.  Does assignment if by the time fetch done, a request has come in.
         * @param {ArrayBuffer | HTMLImageElement} result - buffer of the texture.
         */
        private _notifyReady(result);
        /**
         * Called in defineMaterials(), generated code, to actually create the texture & assign it to a material.
         * When the preloader has already retrieved the data, the assignment
         */
        applyWhenReady(mat: BABYLON.StandardMaterial, txType: number, readyCallback: () => void): void;
        /**
         *  Broken out so can be called by either _notifyReady(), or applyWhenReady().
         */
        private _assign(readyCallback);
    }
}

declare module QI {
    class MaterialPreCompiler {
        private static _mesh;
        static compile(mat: BABYLON.Material, scene: BABYLON.Scene, readyCallback: () => void): void;
        private static _getMesh(scene);
    }
}

declare module QI {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    class VertexDeformation extends MotionEvent {
        private _referenceStateName;
        protected _endStateNames: string[];
        protected _endStateRatios: Array<number>;
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} _referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array<string>} _endStateNames - Names of state keys to deform to
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
         */
        constructor(groupName: string, _referenceStateName: string, _endStateNames: string[], _endStateRatios: Array<number>, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        getReferenceStateName(): string;
        getEndStateName(idx: number): string;
        getEndStateNames(): Array<string>;
        getEndStateRatio(idx: number): number;
        getEndStateRatios(): Array<number>;
        protected _toScriptCustomArgs(): string;
        /**
         * This returns a script to request a combined derived keys.
         * @param {string} groupVarName - This is the shapekey group on which to do the combining.
         */
        toDerivedKeyScript(groupVarName: any): string;
        getClassName(): string;
        toString(): string;
    }
    /**
     * sub-class of VertexDeformation, where the referenceStateName is Fixed to "BASIS" & only one end state involved
     */
    class Deformation extends VertexDeformation {
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1
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
         */
        constructor(groupName: string, endStateName: string, endStateRatio: number, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        protected _toScriptCustomArgs(): string;
        getClassName(): string;
    }
    /**
     * sub-class of Deformation, to immediately attain a shape.  To be truly immediate you should call
     * deformImmediately() on the mesh.  This is a convenience method for performing it on a queue.
     *
     * If you specify a sound, then it will not perform event until sound is ready.  Same if millisBefore
     * is specified.
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
         */
        constructor(groupName: string, endStateName: string, endStateRatio?: number, options?: IMotionEventOptions);
        /** override when millis, move, or rotate not needed */
        toScript(): string;
        protected _toScriptCustomArgs(): string;
        getClassName(): string;
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
         */
        constructor(groupName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        protected _toScriptCustomArgs(): string;
        getClassName(): string;
    }
}

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
        constructor(_mesh: Mesh, _name: string, _affectedPositionElements: Uint32Array);
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
         * @param {number} endStateRatio - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxis - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         */
        addDerivedKey(referenceStateName: string, endStateName: string, endStateRatio: number, mirrorAxis?: string): void;
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on, probably 'Basis'
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {String} newStateName - The name of the new state.  If not set, then it will be computed. (optional)
         * @returns {String} The state name, which might be useful, if you did not include it as an argument
         */
        addComboDerivedKey(referenceStateName: string, endStateNames: Array<string>, endStateRatios: Array<number>, mirrorAxes?: string, newStateName?: string): string;
        /**
         * Called in construction code from TOB.  Unlikely to be called by application code.
         * @param {string} stateName - Name of the end state to be added.
         * @param {boolean} basisRelativeVals - when true, values are relative to basis, which is usually much more compact
         * @param {Float32Array} stateKey - Array of the positions for the _affectedPositionElements
         */
        _addShapeKey(stateName: string, basisRelativeVals: boolean, stateKey: Float32Array): void;
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
        /**
         * Go to a single pre-defined state immediately.  Much like Skeleton._assignPoseImmediately, can be done while
         * mesh is not currently visible.  Should not be call here, but through the mesh.
         * @param {string} stateName - Names of the end state to take.
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        _deformImmediately(stateName: string, positions: Float32Array, normals: Float32Array): void;
        /** Only public, so can be swapped out with SIMD version */
        _updatePositions(positions: Float32Array): void;
        /** Only public, so can be swapped out with SIMD version */
        _updateNormals(normals: Float32Array): void;
        /**
         * delay swapping currents to priors, in-case event gets cancelled after starting, but in an initial wait
         */
        private _firstRun();
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
        /**
         * Only public for QI.MeshconsolidateShapeKeyGroups(), where this should be called from.
         */
        static _buildConsolidatedGroup(mesh: Mesh, newGroupName: string, thoseToMerge: Array<ShapeKeyGroup>): ShapeKeyGroup;
    }
}

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
         * @param {string} poseName - The name in the library of the pose.
         */
        _assignPoseImmediately(poseName: string): void;
        /**
         * Derive the current state of the skeleton as a new Pose in the library.
         * @param {string} name - What the new Pose is to be called.
         * @returns {Pose} The new Pose Object
         */
        currentStateAsPose(name: string): Pose;
        /**
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        addSubPose(poseName: string): void;
        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        removeSubPose(poseName: string): void;
        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        clearAllSubPoses(): void;
    }
}

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
         * @param {string[]} subposes - sub-poses which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any sub-poses should actually be subtracted during event(default false)
         *
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
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      subposes - Skeletons Only:
         *                 Sub-poses which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         */
        constructor(poseName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, options?: IMotionEventOptions);
        toString(): string;
        protected _toScriptCustomArgs(): string;
        getClassName(): string;
    }
}

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
        private _getLastPoseEventInSeries(series);
        /** called by super._incrementallyMove()
         */
        _nextEvent(event: MotionEvent): void;
    }
}

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

declare module QI {
    /**
     * @immutable, reusable
     * data class to hold values to create VertexDeformations.  These are like recipes or the directions.  They need to be
     * applied to the each Automaton.
     */
    class Expression {
        name: string;
        winkable: boolean;
        blinkable: boolean;
        randomizable: boolean;
        endStateNames: string[];
        endStateRatios: number[];
        mirrorAxes: string;
        type: number;
        static STOCK: number;
        static CUSTOM: number;
        static VISEME: number;
        static SPEECH_CAPABLE: number;
        static NONE: Expression;
        static ANGRY: Expression;
        static CRYING: Expression;
        static DISGUSTED: Expression;
        static HAPPY: Expression;
        static LAUGH: Expression;
        static PPHPHT: Expression;
        static SAD: Expression;
        static SCARED: Expression;
        static SKEPTICAL: Expression;
        static STRUGGLING: Expression;
        static ANGRY_NM: Expression;
        static CRYING_NM: Expression;
        static DISGUSTED_NM: Expression;
        static HAPPY_NM: Expression;
        static LAUGH_NM: Expression;
        static PPHPHT_NM: Expression;
        static SAD_NM: Expression;
        static SCARED_NM: Expression;
        static SKEPTICAL_NM: Expression;
        static STRUGGLING_NM: Expression;
        static VISEME_DICT: {
            ".": Expression;
            "AA": Expression;
            "AO": Expression;
            "AW-OW": Expression;
            "AE-EH": Expression;
            "AH": Expression;
            "AY-IH": Expression;
            "B-M-P": Expression;
            "CH-JH-SH-ZH": Expression;
            "D": Expression;
            "DH-TH": Expression;
            "ER-R-W": Expression;
            "EY": Expression;
            "F-V": Expression;
            "IY": Expression;
            "L": Expression;
            "OY-UH-UW": Expression;
            "S": Expression;
        };
        mirrorReqd: boolean;
        /**
         * @param {string} name - Used to populate dropdowns, upper case recommended since this will end up being an endStateName in group FACE.
         * @param {boolean} winkable - Indicate that it makes sense for a wink to be done.  Should not have any EyeLid or EyeBrow states.
         * @param {boolean} blinkable - Indicate that blinking could be allow for this expression.
         * @param {boolean} randomizable - Indicate that this expression is usable for random mood.  Strong expressions (like Crying) are not good candidates.
         * @param {string[]} endStateNames - names of state to combine.
         * @param {number[]} endStateRatios - ratios of states to combine.
         * @param {string} mirrorAxes - When one of the endStateRatios is negative, this must be specified to indicate the axis to mirror on:
         *                 Use anything for endstates >= 0, but '-' is a good convention.
         * @param {number} type - easy ways to group
         */
        constructor(name: string, winkable: boolean, blinkable: boolean, randomizable: boolean, endStateNames: string[], endStateRatios: number[], mirrorAxes?: string, type?: number);
        readonly isViseme: boolean;
        readonly isRegular: boolean;
        readonly isSpeechCapable: boolean;
        readonly regularNameFor: string;
        readonly speechCapableNameFor: string;
        static convertForSpeech(name: string): string;
        stripMouthTargets(): Expression;
        /**
         * This is so expression developer can log changes to be communicated back for source code implementation.
         */
        toScript(): string;
    }
    class Automaton extends Mesh {
        private static _WINK;
        private _winker;
        private doInvoluntaryBlinking;
        private static _BLINK;
        private static _BOTH_CLOSED;
        private static _WINK_LEFT;
        private static _LEFT;
        private static _WINK_RIGHT;
        private static _RIGHT;
        static _FACE: string;
        private _face;
        private static _MAX_CHANGES_FOR_MOOD;
        expressions: Expression[];
        private _randomExpressions;
        private _currentExpression;
        private _currentExpDegree;
        private _idleMode;
        private _randomMode;
        private _numChangesOfCurrentMood;
        private _totChangesOfCurrentMood;
        static _EYES: string;
        private _eyes;
        doRandomEyes: boolean;
        /**
         * The shapekeys will not be defined until the subclass constructor has run, so this put here.
         */
        protected postConstruction(): void;
        /**
         * @param {Expression} exp - The expression to be made available.
         * @param {boolean} winkable - Not all expressions is it appropriate to wink, indicate this one is with true.
         * @param {boolean} blinkable - It is not appropriate when an expression closes eyelids to allow blinking. Indicate no closing with true.
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.
         */
        addExpression(exp: Expression): void;
        /**
         * Adds the expressions contained in this file.  These do take both time to construct and memory, so doing all might be wasteful.
         * @param {string} whichOnes - names of the ones to load, e.g. 'ANGRY LAUGH'.  When "", then all.
         * @param {boolean} visemesToo - When true, also add speech friendly versions of the expressions.
         */
        addStockExpressions(whichOnes?: string, visemesToo?: boolean): void;
        /**
         * Release the shape key components after all the base expressions have been created.  Those for winking are always kept.
         */
        removeExpressionComponents(): void;
        getExpressionNames(): Array<string>;
        getVisemeNames(): Array<string>;
        /** @override */
        beforeRender(): void;
        /**
         * This queues the next random move.
         */
        private _eyeProcessing();
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {number} duration - The time the rotation is to take, in millis (Default 300).
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        queueEyeRotation(up: number, left: number, duration?: number, delay?: number, clearQueue?: boolean): void;
        /**
         * Called by beforeRender(), unless no wink shape key group, or nothing to do.
         * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
         */
        private static _MAX_INTERVAL;
        private _winkProcessing();
        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        winkLeft(timeClosed?: number): void;
        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        winkRight(timeClosed?: number): void;
        /**
         * Indicate that a single blink should occur at the next available opportunity.
         */
        blink(): void;
        private static _DEFORM_SPEED;
        /**
         * @param {number} event   - either blink, wink left, or wink right
         * @param {number} timeClosed - Millis to stay closed, not including the close itself.
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        private _queueLids(event, timeClosed, delay?, clearQueue?);
        /**
         * This queues the next change.  When called from beforeRender in idle mode,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In idle mode, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */
        private _moodPostProcessing(skipChanging?);
        private _pickAMood();
        /**
         * To enable / disable idle mood changing mode.  Here the current oscillates by degree.
         * This will turn off random mode, if on, when switched off.
         * @param {boolean} on - The switch.
         */
        setIdleMode(on: boolean): void;
        /**
         * Allow automatic switching between expressions loaded which are indicated as 'randomizable'.
         * This will turn on idle mode, if off, when switched on.  Will not switch off idle mode, when switched
         * off, though.
         */
        setRandomExpressionSwitching(on: boolean): void;
        /**
         * external call to manually change mood, or at least let the system know what you just queued
         * yourself (useful for speech, so idle mode might resume gracefully).
         * @param {string | Expression} expOrName - Name of the shape key representing the expression to change to or an expression.
         * When it is an Expression & not currently loaded, random & idle ARE turned off.  This is only for Expression development.
         *
         * Could also be the last one in the series you just queued yourself, if just documenting.
         * @param {number} degree - This is a value 0 - 1, indicating the degree to which max deformation
         * to expression should occur.
         * @param {boolean} justDocumenting - When true you have already submitted your own event series
         * that set the expression, but you want the system to know.
         */
        setCurrentMood(expOrName: string | Expression, degree: number, justDocumenting?: boolean): Expression;
    }
}
