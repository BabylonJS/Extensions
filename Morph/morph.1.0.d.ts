declare module MORPH {
    class ShapeKeyGroup {
        private _mesh;
        private _name;
        private _affectedPositionElements;
        private _nPosElements;
        private _states;
        private _normals;
        private _stateNames;
        private _queue;
        private _currentSeries;
        private _currentStepInSeries;
        private _endOfLastFrameTs;
        private _affectedVertices;
        private _nVertices;
        private _currFinalPositionVals;
        private _priorFinalPositionVals;
        private _currFinalNormalVals;
        private _priorFinalNormalVals;
        private _reusablePositionFinals;
        private _reusableNormalFinals;
        private _lastReusablePosUsed;
        private _lastReusableNormUsed;
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
        private _mirrorAxis;
        /**
        * @param {Mesh} _mesh - reference of MORPH.Mesh this ShapeKeyGroup is a part of
        * @param {String} _name - Name of the Key Group, upper case only
        * @param {Array} affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
        * @param {Array} basisState - original state of the affectedPositionElements of positions
        */
        constructor(_mesh: Mesh, _name: string, affectedPositionElements: number[], basisState: number[]);
        private getDerivedName(referenceIdx, endStateIdx, endStateRatio);
        /**
        * add a derived key from the data contained in a deformation; wrapper for addDerivedKey()
        * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
        */
        public addDerivedKeyFromDeformation(deformation: ReferenceDeformation): void;
        /**
        * add a derived key from the arguments
        * @param {string} referenceStateName - Name of the reference state to be based on
        * @param {string} endStateName - Name of the end state to be based on
        * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
        */
        public addDerivedKey(referenceStateName: string, endStateName: string, endStateRatio: number): void;
        /** called in construction code from TOB, but outside the constructor, except for 'BASIS'.  Unlikely to be called by application code. */
        public addShapeKey(stateName: string, stateKey: number[]): void;
        /** worker method for both the addShapeKey() & addDerivedKey() methods */
        private addShapeKeyInternal(stateName, stateKey);
        /**
        * Called by the beforeRender() registered by this._mesh
        * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedIndices
        * @param {Float32Array } normals  - Array of the normals for the entire mesh, if not null, portion updated based on _affectedVertices
        */
        public incrementallyDeform(positions: Float32Array, normals: Float32Array): boolean;
        public resumePlay(): void;
        public queueEventSeries(eSeries: EventSeries): void;
        private _nextEventSeries();
        private _nextDeformation(deformation);
        /**
        * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
        * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
        * @param {number} referenceIdx - the index into _states[] to use as a reference
        * @param {number} endStateIdx - the index into _states[] to use as a target
        * @param {number} endStateRatio - the ratio of the target state to achive, relative to the reference state
        * @param {boolean} log - write console message of action, when true (Default false)
        *
        */
        private buildPosEndPoint(targetArray, referenceIdx, endStateIdx, endStateRatio, log?);
        /**
        * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
        * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
        * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
        */
        private buildNormEndPoint(targetArray, endStatePos);
        private getIdxForState(stateName);
        public getName(): string;
        public getNPosElements(): number;
        public getNStates(): number;
        public toString(): string;
        public mirrorAxisOnX(): void;
        public mirrorAxisOnY(): void;
        public mirrorAxisOnZ(): void;
    }
}
declare module MORPH {
    /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    class ReferenceDeformation {
        public shapeKeyGroupName: string;
        private _referenceStateName;
        private _endStateName;
        private _milliDuration;
        private _millisBefore;
        private _endStateRatio;
        public movePOV: BABYLON.Vector3;
        public rotatePOV: BABYLON.Vector3;
        private _pace;
        private _syncPartner;
        private _startTime;
        private _currentDurationRatio;
        private _proratedMilliDuration;
        private _proratedMillisBefore;
        /**
        * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
        * @param {string} referenceStateName - Name of state key to be used as a reference, so that a endStateRatio can be used
        * @param {string} endStateName - Name of state key to deform to
        * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
        * @param {number} millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
        * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
        * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null)
        *                  right-up-forward
        * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null)
        *                  flipBack-twirlClockwise-tiltRight
        * @param {Pace} pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
        */
        constructor(shapeKeyGroupName: string, _referenceStateName: string, _endStateName: string, _milliDuration: number, _millisBefore?: number, _endStateRatio?: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, _pace?: Pace);
        /**
        * Indicate readiness by caller to start processing event.
        * @param {number} lateStartMilli - indication of how far behind already
        */
        public activate(lateStartMilli?: number): void;
        /** called by ShapeKeyGroup.incrementallyDeform() to determine how much of the deformation should be performed right now */
        public getCompletionMilestone(): number;
        /** support game pausing / resuming.  There is no need to actively pause a Deformation. */
        public resumePlay(): void;
        /**
        * @param {Deformation} syncPartner - Deformation which should start at the same time as this one.  MUST be in a different shape key group!
        */
        public setSyncPartner(syncPartner: ReferenceDeformation): void;
        /**
        *  Called by the first of the syncPartners to detect that both are waiting for each other.
        *  Only intended to be called from getCompletionMilestone() of the partner.
        *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
        */
        public syncReady(startTime: number): void;
        public isBlocked(): boolean;
        public isComplete(): boolean;
        public getReferenceStateName(): string;
        public getEndStateName(): string;
        public getMilliDuration(): number;
        public getMillisBefore(): number;
        public getEndStateRatio(): number;
        public getPace(): Pace;
        public getSyncPartner(): ReferenceDeformation;
        /**
        * Called by the Event Series, before Deformation is passed to the ShapeKeyGroup.  This
        * is to support acceleration / deceleration across event series repeats.
        * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
        */
        public setProratedWallClocks(factor: number): void;
        private static _BLOCKED;
        private static _WAITING;
        private static _READY;
        private static _COMPLETE;
        static BLOCKED : number;
        static WAITING : number;
        static READY : number;
        static COMPLETE : number;
    }
}
declare module MORPH {
    /** Provide an action for an EventSeries, for integration into action manager */
    class EventSeriesAction extends BABYLON.Action {
        private _target;
        private _eSeries;
        constructor(triggerOptions: any, _target: Mesh, _eSeries: EventSeries, condition?: BABYLON.Condition);
        public execute(evt: BABYLON.ActionEvent): void;
    }
    /** main class of file */
    class EventSeries {
        private _eventSeries;
        private _nRepeats;
        private _initialWallclockProrating;
        private _debug;
        private _nEvents;
        private _groups;
        public nGroups: number;
        private _everyBodyReady;
        private _repeatCounter;
        private _proRatingThisRepeat;
        /**
        * Validate each of the events passed and build unique shapekey groups particpating.
        * @param {Array} _eventSeries - Elements must either be a ReferenceDeformation, Action, or function.  Min # of Deformations: 1
        * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
        * @param {number} _initialWallclockProrating - The factor to multiply the duration of a Deformation before passing to a
        *                 ShapeKeyGroup.  Amount is decreased or increased across repeats, so that it is 1 for the final repeat.
        *                 Facilitates acceleration when > 1, & deceleration when < 1. (Default 1)
        * @param {string} _debug - Write progress messages to console when true (Default false)
        */
        constructor(_eventSeries: any[], _nRepeats?: number, _initialWallclockProrating?: number, _debug?: boolean);
        /**
        * called by MORPH.Mesh, to figure out which shape key group(s) this should be queued on.
        * @param {string} groupName - This is the group name to see if it has things to do in event series.
        */
        public isShapeKeyGroupParticipating(groupName: string): boolean;
        /**
        * Signals that a ParticipatingGroup is ready to start processing.  Also evaluates if everyBodyReady.
        * @param {string} groupName - This is the group name saying it is ready.
        */
        public activate(groupName: string): void;
        /**
        * Called by a shape key group to know if series is complete.  nextEvent() may still
        * return null if other groups not yet completed their events in a run, or this group has
        * no more to do, but is being blocked from starting its next series till all are done here.
        */
        public hasMoreEvents(): boolean;
        /**
        * Called by a shape key group to get its next event of the series.  Returns null if
        * blocked, while waiting for other groups.
        * @param {string} groupName - Name of the group calling for its next event
        *
        */
        public nextEvent(groupName: string): any;
    }
}
declare module MORPH {
    /**
    * sub-class of ReferenceDeformation, where the referenceStateName is Fixed to "BASIS"
    */ 
    class Deformation extends ReferenceDeformation {
        /**
        * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
        * @param {string} endStateName - Name of state key to deform to
        * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
        * @param {number} millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
        * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
        * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
        *                  right-up-forward
        * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
        *                  flipBack-twirlClockwise-tiltRight
        * @param {Pace} pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
        */
        constructor(shapeKeyGroupName: string, endStateName: string, milliDuration: number, millisBefore: number, endStateRatio: number, movePOV: BABYLON.Vector3, rotatePOV: BABYLON.Vector3, pace: Pace);
    }
}
declare module MORPH {
    /**
    *  Class used to coorelate duration ratio to completion ratio.  Enables Deformations to have
    *  characteristics like accelation, deceleration, & linear.
    */ 
    class Pace {
        public completionRatios: number[];
        public durationRatios: number[];
        static LINEAR: Pace;
        public steps: number;
        public incremetalCompletionBetweenSteps: number[];
        public incremetalDurationBetweenSteps: number[];
        /**
        * @immutable, reusable
        * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
        * @param {Array} durationRatios - values from (> 0 to 1.0), MUST increase from left to right
        */
        constructor(completionRatios: number[], durationRatios: number[]);
        /**
        * Determine based on time since beginning,  return what should be ration of completion
        * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
        */
        public getCompletionMilestone(currentDurationRatio: number): number;
    }
}
declare module MORPH {
    class Mesh extends BABYLON.Mesh {
        public debug: boolean;
        private _engine;
        private _positions32F;
        private _normals32F;
        private _shapeKeyGroups;
        private _vertexMemberOfFaces;
        private _lastResumeTime;
        private _instancePaused;
        private _clockStart;
        private _renderCPU;
        private _totalDeformations;
        private _totalFrames;
        private _definedFacingForward;
        constructor(name: string, scene: BABYLON.Scene);
        public beforeRender(): void;
        public resetTracking(): void;
        private _resetTracking(startTime);
        public getTrackingReport(reset?: boolean): string;
        public clone(name: string, newParent: BABYLON.Node, doNotCloneChildren?: boolean): Mesh;
        public createInstance(name: string): BABYLON.InstancedMesh;
        public convertToFlatShadedMesh(): void;
        public setVerticesData(kind: any, data: any, updatable?: boolean): void;
        /** wrappered so this._vertexMemberOfFaces can be built after super.setIndices() called */
        public setIndices(indices: number[]): void;
        /** bad things happen to normals when a face has no area.  Double check & put out warning in setIndices() if any found */
        private findZeroAreaFaces();
        /**
        * based on http://stackoverflow.com/questions/18519586/calculate-normal-per-vertex-opengl
        * @param {Uint16Array} vertices - the vertices which need the normals calculated, so do not have to do the entire mesh
        * @param {Float32Array} normals - the array to place the results, size:  vertices.length * 3
        * @param {Float32Array} futurePos - value of positions on which to base normals, passing since so does not have to be set to in mesh yet
        */
        public normalsforVerticesInPlace(vertices: Uint16Array, normals: Float32Array, futurePos: Float32Array): void;
        private indexOfVertInFace(idx0, idx1, idx2, vertIdx);
        public addShapeKeyGroup(shapeKeyGroup: ShapeKeyGroup): void;
        public queueEventSeries(eSeries: EventSeries): void;
        public getShapeKeyGroup(groupName: string): ShapeKeyGroup;
        /**
        * When the mesh is defined facing forward, multipliers must be set so that movePOV() is
        * from the point of view of behind the front of the mesh.
        * @param {boolean} definedFacingForward - True is the default
        */
        public setDefinedFacingForward(definedFacingForward: boolean): void;
        /**
        * Perform relative position change from the point of view of behind the front of the mesh.
        * This is performed taking into account the meshes current rotation, so you do not have to care.
        * Supports definition of mesh facing forward or backward.
        * @param {number} amountRight
        * @param {number} amountUp
        * @param {number} amountForward
        */
        public movePOV(amountRight: number, amountUp: number, amountForward: number): void;
        /**
        * Calculate relative position change from the point of view of behind the front of the mesh.
        * This is performed taking into account the meshes current rotation, so you do not have to care.
        * Supports definition of mesh facing forward or backward.
        * @param {number} amountRight
        * @param {number} amountUp
        * @param {number} amountForward
        */
        public calcMovePOV(amountRight: number, amountUp: number, amountForward: number): BABYLON.Vector3;
        /**
        * Perform relative rotation change from the point of view of behind the front of the mesh.
        * Supports definition of mesh facing forward or backward.
        * @param {number} flipBack
        * @param {number} twirlClockwise
        * @param {number} tiltRight
        */
        public rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): void;
        /**
        * Calculate relative rotation change from the point of view of behind the front of the mesh.
        * Supports definition of mesh facing forward or backward.
        * @param {number} flipBack
        * @param {number} twirlClockwise
        * @param {number} tiltRight
        */
        public calcRotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.Vector3;
        private static _systemPaused;
        private static _systemResumeTime;
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        static pauseSystem(): void;
        static isSystemPaused(): boolean;
        static resumeSystem(): void;
        public pausePlay(): void;
        public isPaused(): boolean;
        public resumePlay(): void;
        /** wrapper for window.performance.now, incase not implemented, e.g. Safari */
        static now(): number;
        static Version : string;
    }
}
