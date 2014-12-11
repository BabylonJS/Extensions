declare module MORPH {
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables Deformations to have
     *  characteristics like accelation, deceleration, & linear.
     */
    class Pace {
        completionRatios: number[];
        durationRatios: number[];
        static LINEAR: Pace;
        steps: number;
        incremetalCompletionBetweenSteps: number[];
        incremetalDurationBetweenSteps: number[];
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
        getCompletionMilestone(currentDurationRatio: number): number;
    }
}
declare module MORPH {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    class ReferenceDeformation {
        shapeKeyGroupName: string;
        private _referenceStateName;
        private _endStateNames;
        private _milliDuration;
        private _millisBefore;
        private _endStateRatios;
        movePOV: BABYLON.Vector3;
        rotatePOV: BABYLON.Vector3;
        private _pace;
        private _syncPartner;
        private _startTime;
        private _currentDurationRatio;
        private _proratedMilliDuration;
        private _proratedMillisBefore;
        /**
         * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} _referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array} _endStateNames - Names of state keys to deform to
         * @param {number} _milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {number} _millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
         * @param {Array} _endStateRatios - ratios of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1's)
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null)
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null)
         *                  flipBack-twirlClockwise-tiltRight
         * @param {Pace} _pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
         */
        constructor(shapeKeyGroupName: string, _referenceStateName: string, _endStateNames: string[], _milliDuration: number, _millisBefore?: number, _endStateRatios?: number[], movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, _pace?: Pace);
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far behind already
         */
        activate(lateStartMilli?: number): void;
        /** called by ShapeKeyGroup.incrementallyDeform() to determine how much of the deformation should be performed right now */
        getCompletionMilestone(): number;
        /** support game pausing / resuming.  There is no need to actively pause a Deformation. */
        resumePlay(): void;
        /**
         * @param {Deformation} syncPartner - Deformation which should start at the same time as this one.  MUST be in a different shape key group!
         */
        setSyncPartner(syncPartner: ReferenceDeformation): void;
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  Only intended to be called from getCompletionMilestone() of the partner.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        syncReady(startTime: number): void;
        isBlocked(): boolean;
        isComplete(): boolean;
        getReferenceStateName(): string;
        getEndStateName(idx: number): string;
        getEndStateNames(): string[];
        getMilliDuration(): number;
        getMillisBefore(): number;
        getEndStateRatio(idx: number): number;
        getEndStateRatios(): number[];
        getPace(): Pace;
        getSyncPartner(): ReferenceDeformation;
        /**
         * Called by the Event Series, before Deformation is passed to the ShapeKeyGroup.  This
         * is to support acceleration / deceleration across event series repeats.
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         */
        setProratedWallClocks(factor: number): void;
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
        constructor(shapeKeyGroupName: string, endStateName: string, milliDuration: number, millisBefore: number, endStateRatio: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3, pace?: Pace);
    }
    /**
     * sub-class of ReferenceDeformation, where defaulting to null for endStateRatios, thus signalling no deforming
     * POV movement & rotation still possible though
     */
    class DeformStall extends ReferenceDeformation {
        /**
         * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         */
        constructor(shapeKeyGroupName: string, milliDuration: number, movePOV?: BABYLON.Vector3, rotatePOV?: BABYLON.Vector3);
    }
}
declare module MORPH {
    class Mesh extends BABYLON.Mesh {
        debug: boolean;
        private _engine;
        private _positions32F;
        private _normals32F;
        originalPositions: number[];
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
        beforeRender(): void;
        resetTracking(): void;
        private _resetTracking(startTime);
        getTrackingReport(reset?: boolean): string;
        clone(name: string, newParent: BABYLON.Node, doNotCloneChildren?: boolean): Mesh;
        createInstance(name: string): BABYLON.InstancedMesh;
        convertToFlatShadedMesh(): void;
        setVerticesData(kind: any, data: any, updatable?: boolean): void;
        /** wrappered so this._vertexMemberOfFaces can be built after super.setIndices() called */
        setIndices(indices: number[]): void;
        /** bad things happen to normals when a face has no area.  Double check & put out warning in setIndices() if any found */
        private findZeroAreaFaces();
        /**
         * based on http://stackoverflow.com/questions/18519586/calculate-normal-per-vertex-opengl
         * @param {Uint16Array} vertices - the vertices which need the normals calculated, so do not have to do the entire mesh
         * @param {Float32Array} normals - the array to place the results, size:  vertices.length * 3
         * @param {Float32Array} futurePos - value of positions on which to base normals, passing since so does not have to be set to in mesh yet
         */
        normalsforVerticesInPlace(vertices: Uint16Array, normals: Float32Array, futurePos: Float32Array): void;
        private indexOfVertInFace(idx0, idx1, idx2, vertIdx);
        addShapeKeyGroup(shapeKeyGroup: ShapeKeyGroup): void;
        queueSingleEvent(event: ReferenceDeformation): void;
        queueEventSeries(eSeries: EventSeries): void;
        getShapeKeyGroup(groupName: string): ShapeKeyGroup;
        /**
         * When the mesh is defined facing forward, multipliers must be set so that movePOV() is
         * from the point of view of behind the front of the mesh.
         * @param {boolean} definedFacingForward - True is the default
         */
        setDefinedFacingForward(definedFacingForward: boolean): void;
        /**
         * Perform relative position change from the point of view of behind the front of the mesh.
         * This is performed taking into account the meshes current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        movePOV(amountRight: number, amountUp: number, amountForward: number): void;
        /**
         * Calculate relative position change from the point of view of behind the front of the mesh.
         * This is performed taking into account the meshes current rotation, so you do not have to care.
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
        private static _systemPaused;
        private static _systemResumeTime;
        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        static pauseSystem(): void;
        static isSystemPaused(): boolean;
        static resumeSystem(): void;
        pausePlay(): void;
        isPaused(): boolean;
        resumePlay(): void;
        /** wrapper for window.performance.now, incase not implemented, e.g. Safari */
        static now(): number;
        static Version: string;
    }
}
declare module MORPH {
    /** Provide an action for an EventSeries, for integration into action manager */
    class EventSeriesAction extends BABYLON.Action {
        private _target;
        private _eSeries;
        constructor(triggerOptions: any, _target: Mesh, _eSeries: EventSeries, condition?: BABYLON.Condition);
        execute(evt: BABYLON.ActionEvent): void;
    }
    /** main class of file */
    class EventSeries {
        private _eventSeries;
        private _nRepeats;
        private _initialWallclockProrating;
        private _debug;
        private _nEvents;
        private _groups;
        nGroups: number;
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
        isShapeKeyGroupParticipating(groupName: string): boolean;
        /**
         * Signals that a ParticipatingGroup is ready to start processing.  Also evaluates if everyBodyReady.
         * @param {string} groupName - This is the group name saying it is ready.
         */
        activate(groupName: string): void;
        /**
         * Called by a shape key group to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        hasMoreEvents(): boolean;
        /**
         * Called by a shape key group to get its next event of the series.  Returns null if
         * blocked, while waiting for other groups.
         * @param {string} groupName - Name of the group calling for its next event
         *
         */
        nextEvent(groupName: string): any;
    }
}
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
        private _stalling;
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
        private getDerivedName(referenceIdx, endStateIdxs, endStateRatios);
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        addDerivedKeyFromDeformation(deformation: ReferenceDeformation): void;
        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         */
        addDerivedKey(referenceStateName: string, endStateName: string, endStateRatio: number): void;
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {Array} endStateNames - Names of the end state to be based on
         * @param {Array} endStateRatios - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         */
        addComboDerivedKey(referenceStateName: string, endStateNames: string[], endStateRatios: number[]): void;
        /** called in construction code from TOB, but outside the constructor, except for 'BASIS'.  Unlikely to be called by application code. */
        addShapeKey(stateName: string, stateKey: number[]): void;
        /** worker method for both the addShapeKey() & addDerivedKey() methods */
        private addShapeKeyInternal(stateName, stateKey);
        /**
         * Called by the beforeRender() registered by this._mesh
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedIndices
         * @param {Float32Array } normals  - Array of the normals for the entire mesh, if not null, portion updated based on _affectedVertices
         */
        incrementallyDeform(positions: Float32Array, normals: Float32Array): boolean;
        resumePlay(): void;
        queueEventSeries(eSeries: EventSeries): void;
        private _nextEventSeries();
        private _nextDeformation(deformation);
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
         * @param {number} referenceIdx - the index into _states[] to use as a reference
         * @param {Array<number>} endStateIdxs - the indexes into _states[] to use as a target
         * @param {Array<number>} endStateRatios - the ratios of the target state to achive, relative to the reference state
         * @param {boolean} log - write console message of action, when true (Default false)
         *
         */
        private buildPosEndPoint(targetArray, referenceIdx, endStateIdxs, endStateRatios, log?);
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
         * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
         */
        private buildNormEndPoint(targetArray, endStatePos);
        private getIdxForState(stateName);
        getName(): string;
        getNPosElements(): number;
        getNStates(): number;
        toString(): string;
        mirrorAxisOnX(): void;
        mirrorAxisOnY(): void;
        mirrorAxisOnZ(): void;
    }
}
declare module MORPH {
    /**
     * @immutable
     * An individual sentence, precompiled in the constructor.  Allows for multiple sentences to be processed in advance.
     * Todo:  need to leash each instance with the Web Audio associated with it.  Waiting implementation in BJS.
     * Todo:  probably need to rejigger everything to get to work with upcoming MakeHuman release.
     */
    class Sentence {
        static _MOUTH_KEYS: string[];
        static _BASIS: string;
        static _MOUTH: string;
        static VISEMES: number[][];
        private static ARPABET_DICT;
        static SPEECH_RATE: number[];
        static SLOW: number;
        static NORMAL_RATE: number;
        static FAST: number;
        private static DURATION;
        private static REST;
        static VOICE_LEVEL: number[];
        static WHISPER: number;
        static TALK: number;
        static SHOUT: number;
        static RATE: string;
        static LOUDNESS: string;
        static MOOD: string;
        static CENSORED: string;
        censoringReqd: boolean;
        deformations: ReferenceDeformation[];
        censored: ReferenceDeformation[];
        censoredDur: number[];
        totalDuration: number;
        /**
         * @param {string} sentence - Arpabet+ encoded string with what to say
         * @param {string} phonemeSeparator - single character to use to split the sentence into individual letters, default: ' '
         */
        constructor(sentence: string, phonemeSeparator?: string);
        /**
         * Determine the last alphabet character of the arpabet+ encoded letter
         * @param {string} letterWithSuffixes - Arpabet+ encoded letter
         */
        private static getLastLetterIdx(letterWithSuffixes);
        /**
         * Convenience method for the voice recorder webpage, to embed the '+' values of the sliders into the first raw arpabet letter
         * @param {string} sentence - Arpabet+ encoded string with what to say
         * @param {string} indicator - the code of the '+' variable to embed:  RATE, LOUDNESS, MOOD, CENSORED
         * @param {number} value - the value for this indicator to take
         */
        static embedAtFirstLetter(sentence: string, indicator: string, value: number): string;
    }
    class Voice {
        private mesh;
        /**
         * Not sure what this class may become.  Maybe a sub-class of MORPH.Mesh.
         * @param {MORPH.Mesh} mesh - the object to compile shape keys & say sentences for
         */
        constructor(mesh: Mesh);
        /**
         * pre-make all the shapekey targets (vertex positions & normals) for smoother execution when talking
         */
        compileAll(): void;
        /**
         * pre-make all the shapekey targets (vertex positions & normals) for a given LOUDNESS,  need to account for mood next release
         * @param {number} loudness - The index into Sentence.VOICE_LEVEL to multiply each of the VISMES by.
         */
        compile(loudness: number): void;
        /**
         * Direct the mesh to deform to say the sentence.
         * Todo:  add code to initiate sound from BABYLON web audio system
         *
         * @param {MORPH.Sentence} sentence - Compile sentence to queue
         * @param {boolean} ignoreCensor - indicate to use the non-censored version, default false, no meaning if no '#'s in sentence
         */
        say(sentence: Sentence, ignoreCensor?: boolean): void;
    }
}
interface Navigator {
    isCocoonJS: boolean;
    getUserMedia(options: {
        video?: boolean;
        audio?: boolean;
    }, success: (stream: any) => void, error?: (error: string) => void): void;
    webkitGetUserMedia(options: {
        video?: boolean;
        audio?: boolean;
    }, success: (stream: any) => void, error?: (error: string) => void): void;
    mozGetUserMedia(options: {
        video?: boolean;
        audio?: boolean;
    }, success: (stream: any) => void, error?: (error: string) => void): void;
}
interface Window {
    AudioContext: AudioContext;
    webkitAudioContext: AudioContext;
}
interface HTMLAnchorElement {
    download: string;
}
interface HTMLURL {
    revokeObjectURL: (string: any) => void;
}
interface AudioContext {
    new (): any;
    destination: AudioDestinationNode;
    sampleRate: number;
    currentTime: number;
    state: AudioContextState;
    suspend(): any;
    resume(): any;
    close(): any;
    onstatechange: () => void;
    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    createBufferSource(): AudioBufferSourceNode;
    createMediaStreamSource(mediaStream: any): MediaStreamAudioSourceNode;
    createScriptProcessor(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): ScriptProcessorNode;
    createGain(): GainNode;
}
interface AudioBuffer {
    sampleRate: number;
    length: number;
    duration: number;
    numberOfChannels: number;
    getChannelData(channel: number): Float32Array;
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;
    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
}
declare enum AudioContextState {
    "suspended" = 0,
    "running" = 1,
    "closed" = 2,
}
interface AudioNode {
    connect(destination: AudioNode, output?: number, input?: number): void;
    connect(destination: AudioParam, output?: number): void;
    disconnect(output?: number): void;
    context: AudioContext;
    numberOfInputs: number;
    numberOfOutputs: number;
    channelCount: number;
    channelCountMode: number;
    channelInterpretation: any;
}
interface GainNode extends AudioNode {
    gain: AudioParam;
}
interface AudioDestinationNode extends AudioNode {
    maxChannelCount: number;
}
interface ScriptProcessorNode extends AudioNode {
    onaudioprocess: (any: any) => void;
    bufferSize: number;
}
interface AudioBufferSourceNode extends AudioNode {
    buffer: AudioBuffer;
    playbackRate: AudioParam;
    detune: AudioParam;
    loop: boolean;
    loopStart: number;
    loopEnd: number;
    start(when?: number, offset?: number, duration?: number): void;
    stop(when?: number): void;
    onended: any;
}
interface MediaStreamAudioSourceNode extends AudioNode {
}
interface AudioParam {
    value: number;
    defaultValue: number;
    setValueAtTime(value: number, startTime: number): void;
    linearRampToValueAtTime(value: number, endTime: number): void;
    exponentialRampToValueAtTime(value: number, endTime: number): void;
    setTargetAtTime(target: number, startTime: number, timeConstant: number): void;
    setValueCurveAtTime(values: Float32Array, startTime: number, duration: number): void;
    cancelScheduledValues(startTime: number): void;
}
declare module MORPH {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    class AudioRecorder {
        private context;
        initialized: boolean;
        playbackReady: boolean;
        recording: boolean;
        private requestedDuration;
        private startTime;
        private completionCallback;
        private leftchannel;
        private rightchannel;
        private leftBuffer;
        private rightBuffer;
        private recorder;
        private recordingLength;
        private volume;
        private audioInput;
        private objectUrl;
        private static instance;
        static getInstance(doneCallback?: () => void): AudioRecorder;
        /**
         *  static because it is in a callback for navigator.getUserMedia()
         */
        private static prepMic(stream);
        recordStart(durationMS?: number, doneCallback?: () => void): void;
        recordStop(): void;
        private mergeBuffers(channelBuffers);
        private clean();
        playback(censoredDur?: number[]): void;
        saveToWAV(filename: string, stereo?: boolean, censoredDur?: number[]): void;
        private encodeWAV(nChannels, censoredDur);
        private embedBeep(channelBuffer, censoredDur);
        private interleave(left, right);
        private writeUTFBytes(view, offset, string);
    }
}
