/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
/// <reference path="./NonMotionEvents.ts"/>
/// <reference path="./EventSeries.ts"/>
module QI {
    export class PovProcessor implements SeriesTargetable {
        public static POV_GROUP_NAME = "POV_PROCESSOR";
        public static MAX_MILLIS_FOR_EVENT_LATE_START = 50;

        private _registeredFN : () => void;
        private _isproperty : boolean;
        private _isMesh     : boolean;
        private _isLight    : boolean;
        private _isCamera   : boolean;
        private _isQIMesh   : boolean;

        // event series queue & reference vars for current series & step within
        protected  _queue = new Array<EventSeries>();
        protected  _currentSeries : EventSeries = null;
        protected  _currentStepInSeries : MotionEvent = null;
        protected _runOfStep : number;
        private _endOfLastFrameTs = -1;
        protected  _ratioComplete : number;

        // rotation control members
        private _rotationProperty : string;
        private _doingRotation = false;
        private _rotationStart : BABYLON.Vector3;
        private _rotationEnd   : BABYLON.Vector3;
        private _rotationMatrix = new BABYLON.Matrix();

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

        // do freezeWorldMatrix (only want to do this when actual rotation / motion, not just morphing / skelatal interpolation)
        // reason being that freezeWorldMatrix wrappers a call to computeWorldMatrix, so un-neccessary refreezing defeats purpose
        private _u = false;

        // misc
        private _activeLockedCamera : BABYLON.Camera;
        public _name = PovProcessor.POV_GROUP_NAME;  // for multi group event series as in MORPH; public for QI.Mesh

        /**
         * @param {BABYLON.Node} _node - Node (mesh, camera, or spot / directional light) to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing), ignore when not mesh
         */
        constructor(public _node : BABYLON.Node, private skipRegistration = false) {
            var scene = this._node.getScene();
            TimelineControl.initialize(scene); // only does something the first call
            this._isproperty = this._node === null;
            this._isMesh     = (!this._isproperty) && this._node instanceof BABYLON.Mesh;
            this._isLight    = (!this._isproperty) && this._node instanceof BABYLON.Light;
            this._isCamera   = (!this._isproperty) && this._node instanceof BABYLON.Camera;
            this._isQIMesh   = this._isMesh        && this._node instanceof Mesh; 

            // validate this node is usable
            if (this._isCamera) {
                if (!(this._node instanceof BABYLON.TargetCamera) ) throw new Error("PovProcessor: Only TargetCamera subclasses can use Queued Interpolation");
                if ((<BABYLON.TargetCamera> this._node).lockedTarget) throw new Error("PovProcessor: Camera with a lockedTarget cannot use Queued Interpolation");
                this._rotationProperty = "rotation";
            }

            else if (this._isLight) {
                if (!this._node["position"] || !this._node["direction"]) throw new Error("PovProcessor: Only SpotLight & DirectionalLight can use Queued Interpolation");
                this._rotationProperty = "direction";

            }else if (this._isMesh) {
                this._rotationProperty = "rotation";
            }

            // tricky registering a prototype as a callback in constructor; cannot say 'this._incrementallyMove()' & must be wrappered
            var ref = this;

            // using scene level before render, so always runs & only once per frame;  non-mesh nodes, have no choice anyway
            if (!skipRegistration) {
                this._registeredFN = function(){ref._incrementallyMove();};
                scene.registerBeforeRender(this._registeredFN);
//                (<BABYLON.Mesh> this._node).registerBeforeRender(this._registeredFN);
            }
        }

        /**
         * Not automatically called.  A QI.Mesh uses its own, so not problem there.
         */
        public dispose() : void {
            this._node.getScene().unregisterBeforeRender(this._registeredFN);
        }
        // =================================== inside before render ==================================
        /**
         * beforeRender() registered to scene for this._node.  Public for sub-classing in QI.ShapekeyGroup.
         */
        public _incrementallyMove() : void {
            // test for active instance pausing, either instance of entire system
            if (this._instancePaused || TimelineControl.isSystemPaused) {
                if (this._currentStepInSeries) this._currentStepInSeries.pause();
                return;
            }

            // system resume test
            if (this._lastResumeTime < TimelineControl.SystemResumeTime) {
                this._lastResumeTime = TimelineControl.SystemResumeTime;
                this.resumeInstancePlay(); // does nothing when this._currentStepInSeries === null
            }

            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents() ) {
                if (! this._nextEventSeries()) return;
            }

            // ok, have an active event series, now get the next motion event in series if required
            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete() ) {
                var next : any = this._currentSeries.nextEvent(this._name);

                // being blocked, not ready for us, only occurs in a multi-group series in MORPH
                if (next === null) return;

                if (next instanceof BABYLON.Action && this._isMesh) {
                    (<BABYLON.Action> next).execute(BABYLON.ActionEvent.CreateNew(<BABYLON.Mesh> this._node));
                }
                else if (typeof (next) === "function") {
                    next.call();
                }
                else{
                    this._nextEvent(<MotionEvent> next);  // must be a new MotionEvent. _currentStepInSeries assigned if valid
                }
            }

            // ok, have a motion event to process
            try{
                this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
                if (this._ratioComplete < 0) return; // MotionEvent.BLOCKED, Motion.SYNC_BLOCKED or MotionEvent.WAITING

                // not used in here, but in ShapeKeyGroup
                this._runOfStep++;
                
                // processing of a NonMotionEvent
                if (this._currentStepInSeries instanceof NonMotionEvent) {
                    (<NonMotionEvent> this._currentStepInSeries)._incrementallyUpdate(this._ratioComplete);
                    return;
                }

                if (this._doingRotation) {
                    PovProcessor.LerpToRef(this._rotationStart, this._rotationEnd, this._ratioComplete, <BABYLON.Vector3> this._node[this._rotationProperty]);
                }

                if (this._doingMovePOV) {
                    if (this._doingRotation && !this._currentStepInSeries.options.noStepWiseMovement && ! this._currentStepInSeries.options.absoluteMovement) {
                        // some of these amounts, could be negative, if has a Pace with a hiccup
                        var amtRight   = (this._fullAmtRight   * this._ratioComplete) - this._amtRightSoFar;
                        var amtUp      = (this._fullAmtUp      * this._ratioComplete) - this._amtUpSoFar;
                        var amtForward = (this._fullAmtForward * this._ratioComplete) - this._amtForwardSoFar;

                        this.movePOV(amtRight, amtUp, amtForward);

                        this._amtRightSoFar   += amtRight;
                        this._amtUpSoFar      += amtUp;
                        this._amtForwardSoFar += amtForward;

                    }else{
                        PovProcessor.LerpToRef(this._positionStartVec, this._positionEndVec, this._ratioComplete, <BABYLON.Vector3> this._node["position"]);
                    }

                    if (this._activeLockedCamera !== null) this._activeLockedCamera._getViewMatrix();
                }

            } finally {
                this._endOfLastFrameTs = TimelineControl.Now;
            }
        }
        // ============================ Event Series Queueing & retrieval ============================
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries| Array<any>} eSeriesOrArray - The series to append to the end of series queue.  Can also be an array when 
         * defaulting on other EventSeries Args, to make application level code simpler.
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        public queueEventSeries(eSeriesOrArray : EventSeries | Array<any>, clearQueue? : boolean, stopCurrentSeries? : boolean) : void {
            var eSeries : EventSeries;
            if (eSeriesOrArray instanceof EventSeries) eSeries = eSeriesOrArray;
            else eSeries = new EventSeries(eSeriesOrArray);
            
            if (clearQueue) this.clearQueue(stopCurrentSeries);
            this._queue.push(eSeries);
        }

        /**
         * Place this series next to be run.
         */
        public insertSeriesInFront(eSeriesOrArray : EventSeries) : void {
            var eSeries : EventSeries;
            if (eSeriesOrArray instanceof EventSeries) eSeries = eSeriesOrArray;
            else eSeries = new EventSeries(eSeriesOrArray);
            
            this._queue.splice(0, 0, eSeries);      
        }

        /**
         * @param {number} _nRepeats - Number of times to run through series elements.
         */
        public queueSingleEvent(event : MotionEvent, nRepeats = 1) : void {
            this.queueEventSeries(new EventSeries([event], nRepeats));
        }

        /**
         * Clear out any events
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        public clearQueue(stopCurrentSeries? : boolean) : void {
            this._queue = new Array<EventSeries>();
            if (stopCurrentSeries) this._currentSeries = null;
        }

        /**
         * Stop current activities.
         * @param {boolean} step - When true, stop the current MotionEvent.
         * @param {boolean} series - When true, stop the current MotionSeries.  Note this will also stop
         * the current step.
         */
        public stopCurrent(step? : boolean, series? : boolean) : void {
            if (step) this._currentStepInSeries = null;
            if (series) this._currentSeries = null;
        }

        private _nextEventSeries() : boolean {
            // finish all events no matter what, but do not start a new one unless node is enabled, and rendered at least once
            var ret = this._queue.length > 0 && this._node.isEnabled() && this._node._currentRenderId !== -1;
            if (ret){
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name, this._isQIMesh && (<QI.Mesh> this._node).debug);
            }else
                this._currentSeries = null;

            // clean out current step in any case, aids unnecessary resumePlay of a completed step
            this._currentStepInSeries = null;

            return ret;
        }

        /** returns true when either something is running (could be blocked or waiting) or something queued */
        public isActive() : boolean {
            return this._currentSeries !== null || this._queue.length > 0;
        }
        
        /**
         * primarily for diagnostic purposes
         */
        public getQueueState() : string {
            var ret = this._name + " queue state:  number series queued: " + this._queue.length;
            
            if (this._isQIMesh) {
                ret += ", paused : " + (<QI.Mesh> this._node).isPaused();
                ret += ", mesh visible : " + (<QI.Mesh> this._node).isVisible;
            }
            for (var i = 0, len = this._queue.length; i < len; i++) {
                ret += "\n\tSeries " + i + "- " + this._queue[i].toString();
            }
            
            if (this._currentSeries) {
                ret += "\n\n\t Current processing: \n" + this._currentSeries.toString();
            }
            return ret;
        }
        // ======================================== event prep =======================================
        /**
         * Public for sub-classing in PoseProcessor & ShapeKeyGroup.
         * @param {MotionEvent} event - The event processed and assigned the current step
         * @param {BABYLON.Vector3} movementScaling - Passed by PoseProcessor sub-class, multiplier to account for
         * the skeleton being different from the one used to build the skeleton library; optional
         */
        public _nextEvent(event : MotionEvent, movementScaling : BABYLON.Vector3 = null) : void {
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = TimelineControl.isRealtime ? TimelineControl.Now - this._endOfLastFrameTs : 0;
            event.activate((lateStart - this._endOfLastFrameTs < PovProcessor.MAX_MILLIS_FOR_EVENT_LATE_START && !this._currentSeries.hasMultipleParticipants()) ? lateStart : 0);

            this._currentStepInSeries = event;

            // initialize a NonMotionEvent event, so any queue can process them
            if (event instanceof NonMotionEvent){
                (<NonMotionEvent> event).initialize(lateStart);
                // rest of method mostly does nothing, but could be change to _activeLockedCamera
            }

            // prepare for rotation, if event calls for
            this._doingRotation = event.rotatePOV !== null;
            if (this._doingRotation){
                this._rotationStart = this._node[this._rotationProperty].clone();
                this._rotationEnd = event.options.absoluteRotation ? event.rotatePOV : this._rotationStart.add(this.calcRotatePOV(event.rotatePOV.x, event.rotatePOV.y, event.rotatePOV.z));
            }

            // prepare for POV move, if event calls for
            this._doingMovePOV = event.movePOV !== null;
            if (this._doingMovePOV){
                var movePOV = event.movePOV;
                if (movementScaling) movePOV = movePOV.multiply(movementScaling);
                this._positionStartVec = this._node["position"].clone();
                
                this._fullAmtRight   = movePOV.x; this._amtRightSoFar   = 0;
                this._fullAmtUp      = movePOV.y; this._amtUpSoFar      = 0;
                this._fullAmtForward = movePOV.z; this._amtForwardSoFar = 0;

                // less resources to calcMovePOV() once then Lerp(), but calcMovePOV() uses rotation, so can only go fast when not rotating too
                if (!this._doingRotation || event.options.noStepWiseMovement || event.options.absoluteMovement){
                    this._positionEndVec = event.options.absoluteMovement ? event.movePOV : this._positionStartVec.add(this.calcMovePOV(this._fullAmtRight, this._fullAmtUp, this._fullAmtForward));
                }
            }

            // determine if camera needs to be woke up for tracking
            this._activeLockedCamera = null; // assigned for failure

            if ((this._doingRotation || this._doingMovePOV) && this._isMesh){
                var activeCamera = <any> this._node.getScene().activeCamera;
                // TargetCamera uses lockedTarget & ArcRotateCamera uses target, so must test both
                var target = activeCamera.lockedTarget || activeCamera.target;
                if(target && target === this._node)
                     this._activeLockedCamera = activeCamera;
            }
            
            // will not be changed until any wait or block is done
            this._runOfStep = 0;
        }
        // ================================== Point of View Movement =================================
        private _calcRef = BABYLON.Vector3.Zero();
        /**
         * Perform relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the node's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        public movePOV(amountRight: number, amountUp: number, amountForward: number) : void {
            this._node["position"].addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward, this._calcRef));
        }

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
        public calcMovePOV(amountRight: number, amountUp: number, amountForward: number, ref?: BABYLON.Vector3) : BABYLON.Vector3 {
            var rot = <BABYLON.Vector3> this._node[this._rotationProperty];
            BABYLON.Matrix.RotationYawPitchRollToRef(rot.y, rot.x, rot.z, this._rotationMatrix);

            var translationDelta = ref ? ref : BABYLON.Vector3.Zero();
            var defForwardMult = this._isMesh ? ((<BABYLON.Mesh> this._node).definedFacingForward ? -1 : 1 ) : 1;
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, this._rotationMatrix, translationDelta);
            return translationDelta;
        }
        // ================================== Point of View Rotation =================================
        /**
         * Perform relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        public rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number) : void {
            var amt = this.calcRotatePOV(flipBack, twirlClockwise, tiltRight);
            this._node[this._rotationProperty].addInPlace(<BABYLON.Vector3> amt);
        }

        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        public calcRotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number) : BABYLON.Vector3 {
            var defForwardMult = this._isMesh ? ((<BABYLON.Mesh> this._node).definedFacingForward ? 1 : -1 ) : 1;
            return new BABYLON.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        }
        // ================================== INSTANCE play - pause ==================================
        private _lastResumeTime = 0; // for passive detection of game pause
        private _instancePaused = false;

        public isInstancePaused() : boolean { return this._instancePaused; }
        public pauseInstance(){ this._instancePaused = true; }

        public resumeInstancePlay() : void {
            this._lastResumeTime = TimelineControl.Now;
            this._instancePaused = false;
            // cause Event in progress to calibrate for smooth resume
            if (this._currentStepInSeries !== null) this._currentStepInSeries.resumePlay();
        }
        // ========================================= Statics =========================================
        public static get Version() : string {
            return "1.1.0 Beta";
        }

        public static LerpToRef(start: BABYLON.Vector3, end: BABYLON.Vector3, amount: number, result: BABYLON.Vector3) : void {
            result.x = start.x + ((end.x - start.x) * amount);
            result.y = start.y + ((end.y - start.y) * amount);
            result.z = start.z + ((end.z - start.z) * amount);
        }

        public static SlerpToRef(left: BABYLON.Quaternion, right: BABYLON.Quaternion, amount: number, result : BABYLON.Quaternion) : BABYLON.Quaternion {
            var num2 : number;
            var num3 : number;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;

            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }

            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }

            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);

            return result;
        }


        public static formatQuat(d : BABYLON.Quaternion) : string {
            return "{X: " +  d.x.toFixed(4) + " Y:" + d.y.toFixed(4) + " Z:" + d.z.toFixed(4) + " W:" + d.w.toFixed(4) + "}";
        }
    }
}