var MORPH;
(function (MORPH) {
    /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    var ReferenceDeformation = (function () {
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
        function ReferenceDeformation(shapeKeyGroupName, _referenceStateName, _endStateName, _milliDuration, _millisBefore, _endStateRatio, movePOV, rotatePOV, _pace) {
            if (typeof _millisBefore === "undefined") { _millisBefore = 0; }
            if (typeof _endStateRatio === "undefined") { _endStateRatio = 1; }
            if (typeof movePOV === "undefined") { movePOV = null; }
            if (typeof rotatePOV === "undefined") { rotatePOV = null; }
            if (typeof _pace === "undefined") { _pace = MORPH.Pace.LINEAR; }
            this.shapeKeyGroupName = shapeKeyGroupName;
            this._referenceStateName = _referenceStateName;
            this._endStateName = _endStateName;
            this._milliDuration = _milliDuration;
            this._millisBefore = _millisBefore;
            this._endStateRatio = _endStateRatio;
            this.movePOV = movePOV;
            this.rotatePOV = rotatePOV;
            this._pace = _pace;
            // time and state management members
            this._startTime = -1;
            this._currentDurationRatio = ReferenceDeformation._COMPLETE;
            // argument validations
            if (this._referenceStateName === this._endStateName)
                throw "Deformation: reference state cannot be the same as the end state";
            if (this._milliDuration <= 0)
                throw "Deformation: milliDuration must > 0";
            if (this._millisBefore < 0)
                throw "Deformation: millisBefore cannot be negative";
            if (this._endStateRatio < -1 || this._endStateRatio > 1)
                throw "Deformation: endStateRatio range  > -1 and < 1";

            // mixed case group & state names not supported
            this.shapeKeyGroupName = this.shapeKeyGroupName.toUpperCase();
            this._referenceStateName = this._referenceStateName.toUpperCase();
            this._endStateName = this._endStateName.toUpperCase();

            this.setProratedWallClocks(1); // ensure values actually used for timings are initialized
        }
        // =================================== run time processing ===================================
        /**
        * Indicate readiness by caller to start processing event.
        * @param {number} lateStartMilli - indication of how far behind already
        */
        ReferenceDeformation.prototype.activate = function (lateStartMilli) {
            if (typeof lateStartMilli === "undefined") { lateStartMilli = 0; }
            this._startTime = MORPH.Mesh.now();
            if (lateStartMilli > 0) {
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner) ? ReferenceDeformation._BLOCKED : ((this._proratedMillisBefore > 0) ? ReferenceDeformation._WAITING : ReferenceDeformation._READY);
        };

        /** called by ShapeKeyGroup.incrementallyDeform() to determine how much of the deformation should be performed right now */
        ReferenceDeformation.prototype.getCompletionMilestone = function () {
            if (this._currentDurationRatio === ReferenceDeformation._COMPLETE) {
                return ReferenceDeformation._COMPLETE;
            }

            // BLOCK only occurs when there is a sync partner
            if (this._currentDurationRatio === ReferenceDeformation._BLOCKED) {
                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner.isBlocked()) {
                    this._startTime = MORPH.Mesh.now(); // reset the start clock
                    this._currentDurationRatio = ReferenceDeformation._WAITING;
                    this._syncPartner.syncReady(this._startTime);
                } else
                    return ReferenceDeformation._BLOCKED;
            }

            var millisSoFar = MORPH.Mesh.now() - this._startTime;

            if (this._currentDurationRatio === ReferenceDeformation._WAITING) {
                millisSoFar -= this._proratedMillisBefore;
                if (millisSoFar >= 0) {
                    this._startTime = MORPH.Mesh.now() - millisSoFar; // prorate start for time served
                } else
                    return ReferenceDeformation._WAITING;
            }

            this._currentDurationRatio = millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > ReferenceDeformation._COMPLETE)
                this._currentDurationRatio = ReferenceDeformation._COMPLETE;

            return this._pace.getCompletionMilestone(this._currentDurationRatio);
        };

        /** support game pausing / resuming.  There is no need to actively pause a Deformation. */
        ReferenceDeformation.prototype.resumePlay = function () {
            if (this._currentDurationRatio === ReferenceDeformation._COMPLETE || this._currentDurationRatio === ReferenceDeformation._BLOCKED || this._currentDurationRatio === ReferenceDeformation._COMPLETE)
                return;

            // back into a start time which reflects the currentDurationRatio
            this._startTime = MORPH.Mesh.now() - (this._proratedMilliDuration * this._currentDurationRatio);
        };

        // =================================== sync partner methods ===================================
        /**
        * @param {Deformation} syncPartner - Deformation which should start at the same time as this one.  MUST be in a different shape key group!
        */
        ReferenceDeformation.prototype.setSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
        };

        /**
        *  Called by the first of the syncPartners to detect that both are waiting for each other.
        *  Only intended to be called from getCompletionMilestone() of the partner.
        *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
        */
        ReferenceDeformation.prototype.syncReady = function (startTime) {
            this._startTime = startTime;
            this._currentDurationRatio = ReferenceDeformation._WAITING;
        };

        // ==================================== Getters & setters ====================================
        ReferenceDeformation.prototype.isBlocked = function () {
            return this._currentDurationRatio === ReferenceDeformation._BLOCKED;
        };
        ReferenceDeformation.prototype.isComplete = function () {
            return this._currentDurationRatio === ReferenceDeformation._COMPLETE;
        };

        ReferenceDeformation.prototype.getReferenceStateName = function () {
            return this._referenceStateName;
        };
        ReferenceDeformation.prototype.getEndStateName = function () {
            return this._endStateName;
        };
        ReferenceDeformation.prototype.getMilliDuration = function () {
            return this._milliDuration;
        };
        ReferenceDeformation.prototype.getMillisBefore = function () {
            return this._millisBefore;
        };
        ReferenceDeformation.prototype.getEndStateRatio = function () {
            return this._endStateRatio;
        };
        ReferenceDeformation.prototype.getPace = function () {
            return this._pace;
        };
        ReferenceDeformation.prototype.getSyncPartner = function () {
            return this._syncPartner;
        };

        /**
        * Called by the Event Series, before Deformation is passed to the ShapeKeyGroup.  This
        * is to support acceleration / deceleration across event series repeats.
        * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
        */
        ReferenceDeformation.prototype.setProratedWallClocks = function (factor) {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = this._millisBefore * factor;
        };

        Object.defineProperty(ReferenceDeformation, "BLOCKED", {
            get: function () {
                return ReferenceDeformation._BLOCKED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReferenceDeformation, "WAITING", {
            get: function () {
                return ReferenceDeformation._WAITING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReferenceDeformation, "READY", {
            get: function () {
                return ReferenceDeformation._READY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReferenceDeformation, "COMPLETE", {
            get: function () {
                return ReferenceDeformation._COMPLETE;
            },
            enumerable: true,
            configurable: true
        });
        ReferenceDeformation._BLOCKED = -20;
        ReferenceDeformation._WAITING = -10;
        ReferenceDeformation._READY = 0;
        ReferenceDeformation._COMPLETE = 1;
        return ReferenceDeformation;
    })();
    MORPH.ReferenceDeformation = ReferenceDeformation;
})(MORPH || (MORPH = {}));
var MORPH;
(function (MORPH) {
    var ShapeKeyGroup = (function () {
        /**
        * @param {Mesh} _mesh - reference of MORPH.Mesh this ShapeKeyGroup is a part of
        * @param {String} _name - Name of the Key Group, upper case only
        * @param {Array} affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
        * @param {Array} basisState - original state of the affectedPositionElements of positions
        */
        function ShapeKeyGroup(_mesh, _name, affectedPositionElements, basisState) {
            this._mesh = _mesh;
            this._name = _name;
            // arrays for the storage of each state
            this._states = new Array();
            this._normals = new Array();
            this._stateNames = new Array();
            // event series queue & reference vars for current seris & step within
            this._queue = new Array();
            this._currentSeries = null;
            this._currentStepInSeries = null;
            this._endOfLastFrameTs = -1;
            // typed arrays are more expense to create, pre-allocate pairs for reuse
            this._reusablePositionFinals = new Array();
            this._reusableNormalFinals = new Array();
            this._lastReusablePosUsed = 0;
            this._lastReusableNormUsed = 0;
            // rotation control members
            this._doingRotation = false;
            // position control members
            this._doingMovePOV = false;
            // misc
            this._activeLockedCamera = null;
            this._mirrorAxis = -1;
            if (!(affectedPositionElements instanceof Array) || affectedPositionElements.length === 0)
                throw "ShapeKeyGroup: invalid affectedPositionElements arg";
            if (!(basisState instanceof Array) || basisState.length !== affectedPositionElements.length)
                throw "ShapeKeyGroup: invalid basisState arg";

            // validation that position elements are in ascending order; normals relies on this being true
            this._affectedPositionElements = new Uint16Array(affectedPositionElements);
            this._nPosElements = affectedPositionElements.length;
            for (var i = 0; i + 1 < this._nPosElements; i++)
                if (!(this._affectedPositionElements[i] < this._affectedPositionElements[i + 1]))
                    throw "ShapeKeyGroup: affectedPositionElements must be in ascending order";

            // initialize 2 position reusables, the size needed
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));

            // determine affectedVertices for updating cooresponding normals
            var affectedVert = new Array();
            var vertIdx = -1;
            var nextVertIdx;

            for (var i = 0; i < this._nPosElements; i++) {
                // the vertex index is 1/3 the position element index
                nextVertIdx = Math.floor(this._affectedPositionElements[i] / 3);

                // since position element indexes in ascending order, check if vertex not already added by the x, or y elements
                if (vertIdx !== nextVertIdx) {
                    vertIdx = nextVertIdx;
                    affectedVert.push(vertIdx);
                }
            }
            this._affectedVertices = new Uint16Array(affectedVert);
            this._nVertices = this._affectedVertices.length;

            // initialize 2 normal reusables, the size needed
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));

            // push 'BASIS' to _states & _stateNames, then initialize _currFinalVals to 'BASIS' state
            this.addShapeKey("BASIS", basisState);
            this._currFinalPositionVals = this._states[0];
            this._currFinalNormalVals = this._normals[0];
        }
        // =============================== Shape-Key adding & deriving ===============================
        ShapeKeyGroup.prototype.getDerivedName = function (referenceIdx, endStateIdx, endStateRatio) {
            return referenceIdx + "-" + endStateIdx + "@" + endStateRatio;
        };

        /**
        * add a derived key from the data contained in a deformation; wrapper for addDerivedKey()
        * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
        */
        ShapeKeyGroup.prototype.addDerivedKeyFromDeformation = function (deformation) {
            this.addDerivedKey(deformation.getReferenceStateName(), deformation.getEndStateName(), deformation.getEndStateRatio());
        };

        /**
        * add a derived key from the arguments
        * @param {string} referenceStateName - Name of the reference state to be based on
        * @param {string} endStateName - Name of the end state to be based on
        * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
        */
        ShapeKeyGroup.prototype.addDerivedKey = function (referenceStateName, endStateName, endStateRatio) {
            var referenceIdx = this.getIdxForState(referenceStateName.toUpperCase());
            var endStateIdx = this.getIdxForState(endStateName.toUpperCase());
            if (referenceIdx === -1 || endStateIdx === -1)
                throw "ShapeKeyGroup: invalid source state name(s)";
            if (endStateRatio === 1)
                throw "ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless";

            var stateName = this.getDerivedName(referenceIdx, endStateIdx, endStateRatio);
            var stateKey = new Float32Array(this._nPosElements);
            this.buildPosEndPoint(stateKey, referenceIdx, endStateIdx, endStateRatio);
            this.addShapeKeyInternal(stateName, stateKey);
        };

        /** called in construction code from TOB, but outside the constructor, except for 'BASIS'.  Unlikely to be called by application code. */
        ShapeKeyGroup.prototype.addShapeKey = function (stateName, stateKey) {
            if (!(stateKey instanceof Array) || stateKey.length !== this._nPosElements)
                throw "ShapeKeyGroup: invalid stateKey arg";
            this.addShapeKeyInternal(stateName, new Float32Array(stateKey));
        };

        /** worker method for both the addShapeKey() & addDerivedKey() methods */
        ShapeKeyGroup.prototype.addShapeKeyInternal = function (stateName, stateKey) {
            if (typeof stateName !== 'string' || stateName.length === 0)
                throw "ShapeKeyGroup: invalid stateName arg";
            if (this.getIdxForState(stateName) !== -1)
                throw "ShapeKeyGroup: stateName " + stateName + " is a duplicate";

            this._states.push(stateKey);
            this._stateNames.push(stateName);

            var coorespondingNormals = new Float32Array(this._nVertices * 3);
            this.buildNormEndPoint(coorespondingNormals, stateKey);
            this._normals.push(coorespondingNormals);

            if (this._mesh.debug)
                console.log("Shape key: " + stateName + " added to group: " + this._name + " on MORPH.Mesh: " + this._mesh.name);
        };

        // =================================== inside before render ==================================
        /**
        * Called by the beforeRender() registered by this._mesh
        * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedIndices
        * @param {Float32Array } normals  - Array of the normals for the entire mesh, if not null, portion updated based on _affectedVertices
        */
        ShapeKeyGroup.prototype.incrementallyDeform = function (positions, normals) {
            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents()) {
                if (!this._nextEventSeries())
                    return false;
            }

            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete()) {
                var next = this._currentSeries.nextEvent(this._name);

                if (next === null)
                    return false;
                if (next instanceof BABYLON.Action) {
                    next.execute(BABYLON.ActionEvent.CreateNew(this._mesh));
                } else if (typeof next === "function") {
                    next.call();
                } else {
                    this._nextDeformation(next); // must be a new deformation. _currentStepInSeries assigned if valid
                }
            }

            // have a deformation to process
            var ratioComplete = this._currentStepInSeries.getCompletionMilestone();
            if (ratioComplete < 0)
                return false;

            for (var i = 0; i < this._nPosElements; i++) {
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * ratioComplete);
            }

            // update the normals
            var mIdx, kIdx;
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i];
                kIdx = 3 * i; // offset for this vertex in the shape key group
                normals[mIdx] = this._priorFinalNormalVals[kIdx] + ((this._currFinalNormalVals[kIdx] - this._priorFinalNormalVals[kIdx]) * ratioComplete);
                normals[mIdx + 1] = this._priorFinalNormalVals[kIdx + 1] + ((this._currFinalNormalVals[kIdx + 1] - this._priorFinalNormalVals[kIdx + 1]) * ratioComplete);
                normals[mIdx + 2] = this._priorFinalNormalVals[kIdx + 2] + ((this._currFinalNormalVals[kIdx + 2] - this._priorFinalNormalVals[kIdx + 2]) * ratioComplete);
            }

            if (this._doingRotation) {
                this._mesh.rotation = BABYLON.Vector3.Lerp(this._rotationStartVec, this._rotationEndVec, ratioComplete);
            }

            if (this._doingMovePOV === true) {
                if (this._doingRotation) {
                    // some of these amounts, could be negative, if has a Pace with a hiccup
                    var amtRight = (this._fullAmtRight * ratioComplete) - this._amtRightSoFar;
                    var amtUp = (this._fullAmtUp * ratioComplete) - this._amtUpSoFar;
                    var amtForward = (this._fullAmtForward * ratioComplete) - this._amtForwardSoFar;

                    this._mesh.movePOV(amtRight, amtUp, amtForward);

                    this._amtRightSoFar += amtRight;
                    this._amtUpSoFar += amtUp;
                    this._amtForwardSoFar += amtForward;
                } else {
                    this._mesh.position = BABYLON.Vector3.Lerp(this._positionStartVec, this._positionEndVec, ratioComplete);
                }

                if (this._activeLockedCamera !== null)
                    this._activeLockedCamera._getViewMatrix();
            }
            this._endOfLastFrameTs = MORPH.Mesh.now();
            return true;
        };

        ShapeKeyGroup.prototype.resumePlay = function () {
            if (this._currentStepInSeries !== null)
                this._currentStepInSeries.resumePlay();
        };

        // ============================ Event Series Queueing & retrieval ============================
        ShapeKeyGroup.prototype.queueEventSeries = function (eSeries) {
            this._queue.push(eSeries);
        };

        ShapeKeyGroup.prototype._nextEventSeries = function () {
            var ret = this._queue.length > 0;
            if (ret) {
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name);
            }
            return ret;
        };

        // ===================================== deformation prep ====================================
        ShapeKeyGroup.prototype._nextDeformation = function (deformation) {
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = MORPH.Mesh.now() - this._endOfLastFrameTs;
            deformation.activate((this._currentSeries.nGroups === 1 && lateStart - this._endOfLastFrameTs < 50) ? lateStart : 0);

            this._currentStepInSeries = deformation;
            this._priorFinalPositionVals = this._currFinalPositionVals;
            this._priorFinalNormalVals = this._currFinalNormalVals;

            var referenceIdx = this.getIdxForState(deformation.getReferenceStateName());
            var endStateIdx = this.getIdxForState(deformation.getEndStateName());
            if (referenceIdx === -1 || endStateIdx === -1)
                throw "ShapeKeyGroup " + this._name + ": invalid deformation, source state name(s) not found";

            var endStateRatio = deformation.getEndStateRatio();
            if (endStateRatio < 0 && this._mirrorAxis === -1)
                throw "ShapeKeyGroup " + this._name + ": invalid deformation, negative end state ratios when not mirroring";

            // when endStateRatio is 1 or 0, just assign _currFinalVals directly from _states
            if (endStateRatio === 1 || endStateRatio === 0) {
                if (endStateRatio === 0)
                    endStateIdx = referenceIdx; // really just the reference when 0
                this._currFinalPositionVals = this._states[endStateIdx];
                this._currFinalNormalVals = this._normals[endStateIdx];
            } else {
                // check there was not a pre-built derived key to assign
                var derivedIdx = this.getIdxForState(this.getDerivedName(referenceIdx, endStateIdx, endStateRatio));
                if (derivedIdx !== -1) {
                    this._currFinalPositionVals = this._states[derivedIdx];
                    this._currFinalNormalVals = this._normals[derivedIdx];
                } else {
                    // need to build _currFinalVals, toggling the _lastReusableUsed
                    this._lastReusablePosUsed = (this._lastReusablePosUsed === 1) ? 0 : 1;
                    this.buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed], referenceIdx, endStateIdx, endStateRatio, this._mesh.debug);
                    this._currFinalPositionVals = this._reusablePositionFinals[this._lastReusablePosUsed];

                    // need to build _currFinalNormalVals, toggling the _lastReusableUsed
                    this._lastReusableNormUsed = (this._lastReusableNormUsed === 1) ? 0 : 1;
                    this.buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed], this._currFinalPositionVals);
                    this._currFinalNormalVals = this._reusableNormalFinals[this._lastReusableNormUsed];
                }
            }

            // prepare for rotation, if deformation calls for
            this._doingRotation = deformation.rotatePOV !== null;
            if (this._doingRotation) {
                this._rotationStartVec = this._mesh.rotation; // no clone required, since Lerp() returns a new Vec3 written over .rotation
                this._rotationEndVec = this._rotationStartVec.add(this._mesh.calcRotatePOV(deformation.rotatePOV.x, deformation.rotatePOV.y, deformation.rotatePOV.z));
            }

            // prepare for POV move, if deformation calls for
            this._doingMovePOV = deformation.movePOV !== null;
            if (this._doingMovePOV) {
                this._fullAmtRight = deformation.movePOV.x;
                this._amtRightSoFar = 0;
                this._fullAmtUp = deformation.movePOV.y;
                this._amtUpSoFar = 0;
                this._fullAmtForward = deformation.movePOV.z;
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

        /**
        * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
        * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
        * @param {number} referenceIdx - the index into _states[] to use as a reference
        * @param {number} endStateIdx - the index into _states[] to use as a target
        * @param {number} endStateRatio - the ratio of the target state to achive, relative to the reference state
        * @param {boolean} log - write console message of action, when true (Default false)
        *
        */
        ShapeKeyGroup.prototype.buildPosEndPoint = function (targetArray, referenceIdx, endStateIdx, endStateRatio, log) {
            if (typeof log === "undefined") { log = false; }
            var refEndState = this._states[referenceIdx];
            var newEndState = this._states[endStateIdx];

            // compute each of the new final values of positions
            var deltaToRefState;
            for (var i = 0; i < this._nPosElements; i++) {
                deltaToRefState = (newEndState[i] - refEndState[i]) * endStateRatio;

                // reverse sign on appropriate elements of referenceDelta when ratio neg & mirroring
                if (endStateRatio < 0 && this._mirrorAxis !== (i + 1) % 3) {
                    deltaToRefState *= -1;
                }
                targetArray[i] = refEndState[i] + deltaToRefState;
            }
            if (log)
                console.log(this._name + " end Point built for referenceIdx: " + referenceIdx + ",  endStateIdx: " + endStateIdx + ", endStateRatio: " + endStateRatio);
        };

        /**
        * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
        * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
        * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
        */
        ShapeKeyGroup.prototype.buildNormEndPoint = function (targetArray, endStatePos) {
            // build a full, mesh sized, set of positions & populate with the left-over initial data
            var futurePos = new Float32Array(this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind));

            for (var i = 0; i < this._nPosElements; i++) {
                futurePos[this._affectedPositionElements[i]] = endStatePos[i];
            }

            // compute using method in _mesh
            this._mesh.normalsforVerticesInPlace(this._affectedVertices, targetArray, futurePos);
        };

        // ==================================== Getters & setters ====================================
        ShapeKeyGroup.prototype.getIdxForState = function (stateName) {
            for (var i = this._stateNames.length - 1; i >= 0; i--) {
                if (this._stateNames[i] === stateName) {
                    return i;
                }
            }
            return -1;
        };

        ShapeKeyGroup.prototype.getName = function () {
            return this._name;
        };
        ShapeKeyGroup.prototype.getNPosElements = function () {
            return this._nPosElements;
        };
        ShapeKeyGroup.prototype.getNStates = function () {
            return this._stateNames.length;
        };
        ShapeKeyGroup.prototype.toString = function () {
            return 'ShapeKeyGroup: ' + this._name + ', n position elements: ' + this._nPosElements + ',\nStates: ' + this._stateNames;
        };

        ShapeKeyGroup.prototype.mirrorAxisOnX = function () {
            this._mirrorAxis = 1;
        };
        ShapeKeyGroup.prototype.mirrorAxisOnY = function () {
            this._mirrorAxis = 2;
        };
        ShapeKeyGroup.prototype.mirrorAxisOnZ = function () {
            this._mirrorAxis = 3;
        };
        return ShapeKeyGroup;
    })();
    MORPH.ShapeKeyGroup = ShapeKeyGroup;
})(MORPH || (MORPH = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MORPH;
(function (MORPH) {
    /**
    * sub-class of ReferenceDeformation, where the referenceStateName is Fixed to "BASIS"
    */
    var Deformation = (function (_super) {
        __extends(Deformation, _super);
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
        function Deformation(shapeKeyGroupName, endStateName, milliDuration, millisBefore, endStateRatio, movePOV, rotatePOV, pace) {
            _super.call(this, shapeKeyGroupName, "BASIS", endStateName, milliDuration, millisBefore, endStateRatio, movePOV, rotatePOV, pace);
        }
        return Deformation;
    })(MORPH.ReferenceDeformation);
    MORPH.Deformation = Deformation;
})(MORPH || (MORPH = {}));
var MORPH;
(function (MORPH) {
    /** Internal helper class used by EventSeries to support a multi-shape group EventSeries */
    var ParticipatingGroup = (function () {
        function ParticipatingGroup(groupName) {
            this.groupName = groupName;
            this._indexInRun = -99;
            this._highestIndexInRun = -1;
        }
        ParticipatingGroup.prototype.isReady = function () {
            return this._indexInRun === -1;
        };
        ParticipatingGroup.prototype.runComplete = function () {
            return this._indexInRun > this._highestIndexInRun;
        };
        ParticipatingGroup.prototype.activate = function () {
            this._indexInRun = -1;
        };
        return ParticipatingGroup;
    })();

    /** Provide an action for an EventSeries, for integration into action manager */
    var EventSeriesAction = (function (_super) {
        __extends(EventSeriesAction, _super);
        function EventSeriesAction(triggerOptions, _target, _eSeries, condition) {
            _super.call(this, triggerOptions, condition);
            this._target = _target;
            this._eSeries = _eSeries;
        }
        EventSeriesAction.prototype.execute = function (evt) {
            this._target.queueEventSeries(this._eSeries);
        };
        return EventSeriesAction;
    })(BABYLON.Action);
    MORPH.EventSeriesAction = EventSeriesAction;

    /** main class of file */
    var EventSeries = (function () {
        /**
        * Validate each of the events passed and build unique shapekey groups particpating.
        * @param {Array} _eventSeries - Elements must either be a ReferenceDeformation, Action, or function.  Min # of Deformations: 1
        * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
        * @param {number} _initialWallclockProrating - The factor to multiply the duration of a Deformation before passing to a
        *                 ShapeKeyGroup.  Amount is decreased or increased across repeats, so that it is 1 for the final repeat.
        *                 Facilitates acceleration when > 1, & deceleration when < 1. (Default 1)
        * @param {string} _debug - Write progress messages to console when true (Default false)
        */
        function EventSeries(_eventSeries, _nRepeats, _initialWallclockProrating, _debug) {
            if (typeof _nRepeats === "undefined") { _nRepeats = 1; }
            if (typeof _initialWallclockProrating === "undefined") { _initialWallclockProrating = 1.0; }
            if (typeof _debug === "undefined") { _debug = false; }
            this._eventSeries = _eventSeries;
            this._nRepeats = _nRepeats;
            this._initialWallclockProrating = _initialWallclockProrating;
            this._debug = _debug;
            this._groups = new Array();
            this._nEvents = _eventSeries.length;

            for (var i = 0; i < this._nEvents; i++) {
                if (this._eventSeries[i] instanceof MORPH.ReferenceDeformation || this._eventSeries[i] instanceof BABYLON.Action || typeof this._eventSeries[i] === "function") {
                    if (this._eventSeries[i] instanceof MORPH.ReferenceDeformation) {
                        var groupName = this._eventSeries[i].shapeKeyGroupName;
                        var pGroup = null;

                        for (var g = this._groups.length - 1; g >= 0; g--) {
                            if (this._groups[g].groupName === groupName) {
                                pGroup = this._groups[g];
                                break;
                            }
                        }
                        if (pGroup === null) {
                            pGroup = new ParticipatingGroup(groupName);
                            this._groups.push(pGroup);
                        }
                        pGroup._highestIndexInRun = i;
                    } else {
                        // Actions & function()s all run from group 0 (may not have been assigned yet)
                        if (this._groups.length > 0)
                            this._groups[0]._highestIndexInRun = i;
                        if (this._eventSeries[i] instanceof BABYLON.Action)
                            this._eventSeries[i]._prepare();
                    }
                } else {
                    throw "EventSeries:  eventSeries elements must either be a Deformation, Action, or function";
                }
            }

            // make sure at least 1 Deformation passed, not just Actions or functions, since there will be no group to assign them to
            this.nGroups = this._groups.length;
            if (this.nGroups === 0)
                throw "EventSeries: Must have at least 1 Deformation in series.";

            if (this._debug && this._nRepeats === 1 && this._initialWallclockProrating !== 1)
                console.log("EventSeries: clock prorating ignored when # of repeats is 1");
        }
        /**
        * called by MORPH.Mesh, to figure out which shape key group(s) this should be queued on.
        * @param {string} groupName - This is the group name to see if it has things to do in event series.
        */
        EventSeries.prototype.isShapeKeyGroupParticipating = function (groupName) {
            for (var g = 0; g < this.nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    return true;
            }
            return false;
        };

        /**
        * Signals that a ParticipatingGroup is ready to start processing.  Also evaluates if everyBodyReady.
        * @param {string} groupName - This is the group name saying it is ready.
        */
        EventSeries.prototype.activate = function (groupName) {
            this._everyBodyReady = true;
            for (var g = 0; g < this.nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    this._groups[g].activate();
                else
                    this._everyBodyReady = this._everyBodyReady && this._groups[g].isReady();
            }
            if (this._debug)
                console.log("series activated by " + groupName + ", _everyBodyReady: " + this._everyBodyReady);
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
        };

        /**
        * Called by a shape key group to know if series is complete.  nextEvent() may still
        * return null if other groups not yet completed their events in a run, or this group has
        * no more to do, but is being blocked from starting its next series till all are done here.
        */
        EventSeries.prototype.hasMoreEvents = function () {
            return this._repeatCounter < this._nRepeats;
        };

        /**
        * Called by a shape key group to get its next event of the series.  Returns null if
        * blocked, while waiting for other groups.
        * @param {string} groupName - Name of the group calling for its next event
        *
        */
        EventSeries.prototype.nextEvent = function (groupName) {
            // return nothing till all groups signal they are ready to start
            if (!this._everyBodyReady)
                return null;

            var pGroup;
            var isGroupForActions = false;
            var allGroupsRunComplete = true;

            for (var g = 0; g < this.nGroups; g++) {
                allGroupsRunComplete = allGroupsRunComplete && this._groups[g].runComplete();

                // no break statement inside block, so allGroupsRunComplete is valid
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                    isGroupForActions = g === 0;
                }
            }

            if (allGroupsRunComplete) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    for (var g = 0; g < this.nGroups; g++) {
                        this._groups[g].activate();
                    }
                    if (this._initialWallclockProrating !== 1) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    if (this._debug)
                        console.log("set for repeat # " + this._repeatCounter);
                } else {
                    if (this._debug)
                        console.log("Series complete");
                    this._everyBodyReady = false; // ensure that nothing happens until all groups call activate() again
                }
            }

            if (!pGroup.runComplete()) {
                // test if should declare complete
                if (pGroup._indexInRun === pGroup._highestIndexInRun) {
                    pGroup._indexInRun++;
                    return null;
                }
                for (var i = pGroup._indexInRun + 1; i < this._nEvents; i++) {
                    if (this._eventSeries[i] instanceof MORPH.ReferenceDeformation) {
                        var name = this._eventSeries[i].shapeKeyGroupName;
                        if (pGroup.groupName === name) {
                            pGroup._indexInRun = i;
                            this._eventSeries[i].setProratedWallClocks(this._proRatingThisRepeat);
                            if (this._debug)
                                console.log(i + " in series returned: " + name + ", allGroupsRunComplete " + allGroupsRunComplete + ", everyBodyReady " + this._everyBodyReady);
                            return this._eventSeries[i];
                        }
                    } else if (isGroupForActions) {
                        pGroup._indexInRun = i;
                        return this._eventSeries[i];
                    }
                }
            } else
                return null;
        };
        return EventSeries;
    })();
    MORPH.EventSeries = EventSeries;
})(MORPH || (MORPH = {}));
var MORPH;
(function (MORPH) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(name, scene) {
            _super.call(this, name, scene);
            this.debug = false;
            this._shapeKeyGroups = new Array();
            // for normal processing
            this._vertexMemberOfFaces = new Array();
            // for passive detection of game pause
            this._lastResumeTime = 0;
            this._instancePaused = false;
            // tracking system members
            this._clockStart = -1;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
            // pov orientation
            this._definedFacingForward = true;
            this._engine = scene.getEngine();

            // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
            var ref = this;
            this.registerBeforeRender(function () {
                ref.beforeRender();
            });
        }
        // ============================ beforeRender callback & tracking =============================
        Mesh.prototype.beforeRender = function () {
            if (this._positions32F === null || this._normals32F === null || Mesh._systemPaused || this._instancePaused)
                return;
            var startTime = Mesh.now();

            // system resume test
            if (this._lastResumeTime < Mesh._systemResumeTime) {
                for (var g = this._shapeKeyGroups.length - 1; g >= 0; g--) {
                    this._shapeKeyGroups[g].resumePlay();
                }
                this._lastResumeTime = Mesh._systemResumeTime;
            }

            var changesMade = false;
            for (var g = this._shapeKeyGroups.length - 1; g >= 0; g--) {
                // do NOT combine these 2 lines or only 1 group will run!
                var changed = this._shapeKeyGroups[g].incrementallyDeform(this._positions32F, this._normals32F);
                changesMade = changesMade || changed;
            }

            if (changesMade) {
                if (this._clockStart < 0)
                    this._resetTracking(startTime); // delay tracking until the first change is made

                // resend positions & normals
                _super.prototype.updateVerticesDataDirectly.call(this, BABYLON.VertexBuffer.PositionKind, this._positions32F);
                _super.prototype.updateVerticesDataDirectly.call(this, BABYLON.VertexBuffer.NormalKind, this._normals32F);

                this._renderCPU += Mesh.now() - startTime;
                this._totalDeformations++;
            }

            this._totalFrames++;
        };

        Mesh.prototype.resetTracking = function () {
            this._resetTracking(Mesh.now());
        };
        Mesh.prototype._resetTracking = function (startTime) {
            this._clockStart = startTime;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
        };

        Mesh.prototype.getTrackingReport = function (reset) {
            if (typeof reset === "undefined") { reset = false; }
            var totalWallClock = Mesh.now() - this._clockStart;
            var report = "\nNum Deformations: " + this._totalDeformations + "\nRender CPU milli: " + this._renderCPU.toFixed(2) + "\nRender CPU milli / Deformations: " + (this._renderCPU / this._totalDeformations).toFixed(2) + "\nWallclock milli / Deformations: " + (totalWallClock / this._totalDeformations).toFixed(2) + "\nMemo, Deformations / Sec: " + (this._totalDeformations / (totalWallClock / 1000)).toFixed(2) + "\nMemo, Frames with no deformation: " + (this._totalFrames - this._totalDeformations) + "\nMemo, Total vertices: " + this.getTotalVertices() + "\nShape keys:";
            for (var i = 0; i < this._shapeKeyGroups.length; i++)
                report += "\n" + this._shapeKeyGroups[i].toString();

            if (reset)
                this.resetTracking();
            return report;
        };

        // ======================================== Overrides ========================================
        Mesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            BABYLON.Tools.Error("Shared vertex instances not supported for MORPH.Mesh");
            return null;
        };
        Mesh.prototype.createInstance = function (name) {
            BABYLON.Tools.Error("Shared vertex instances not supported for MORPH.Mesh");
            return null;
        };
        Mesh.prototype.convertToFlatShadedMesh = function () {
            BABYLON.Tools.Error("Flat shading not supported for MORPH.Mesh");
        };

        /* wrappered is so positions & normals vertex buffer & initial data can be captured */
        Mesh.prototype.setVerticesData = function (kind, data, updatable) {
            _super.prototype.setVerticesData.call(this, kind, data, updatable || kind === BABYLON.VertexBuffer.PositionKind || kind === BABYLON.VertexBuffer.NormalKind);

            var babylonVertexBuffer;
            if (kind === BABYLON.VertexBuffer.PositionKind) {
                babylonVertexBuffer = this.getVertexBuffer(BABYLON.VertexBuffer.PositionKind);
                this._positions32F = new Float32Array(babylonVertexBuffer.getData());
            } else if (kind === BABYLON.VertexBuffer.NormalKind) {
                babylonVertexBuffer = this.getVertexBuffer(BABYLON.VertexBuffer.NormalKind);
                this._normals32F = new Float32Array(babylonVertexBuffer.getData());
            }
        };

        /** wrappered so this._vertexMemberOfFaces can be built after super.setIndices() called */
        Mesh.prototype.setIndices = function (indices) {
            _super.prototype.setIndices.call(this, indices);

            // now determine _vertexMemberOfFaces, to improve normals performance
            var nFaces = indices.length / 3;
            var faceOffset;

            // _vertexMemberOfFaces:  outer array each vertex, inner array faces vertex is a member of
            var nVertices = _super.prototype.getTotalVertices.call(this);

            // possibly remove or comment out
            var nZeroAreaFaces = this.findZeroAreaFaces();
            if (nZeroAreaFaces > 0)
                BABYLON.Tools.Warn("MORPH.Mesh: Zero area faces found:  " + nZeroAreaFaces + ", nFaces: " + nFaces + ", nVert " + nVertices);

            for (var v = 0; v < nVertices; v++) {
                var memberOf = new Array();

                for (var f = 0; f < nFaces; f++) {
                    faceOffset = f * 3;
                    if (indices[faceOffset] === v || indices[faceOffset + 1] === v || indices[faceOffset + 2] === v) {
                        memberOf.push(f);
                    }
                }
                this._vertexMemberOfFaces.push(memberOf);
            }
        };

        /** bad things happen to normals when a face has no area.  Double check & put out warning in setIndices() if any found */
        Mesh.prototype.findZeroAreaFaces = function () {
            var indices = _super.prototype.getIndices.call(this);
            var nFaces = indices.length / 3;
            var positions = _super.prototype.getVerticesData.call(this, BABYLON.VertexBuffer.PositionKind);
            var nZeroAreaFaces = 0;
            var faceOffset;
            var p1 = BABYLON.Vector3.Zero();
            var p2 = BABYLON.Vector3.Zero();
            var p3 = BABYLON.Vector3.Zero();

            for (var f = 0; f < nFaces; f++) {
                faceOffset = f * 3;
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset], p1);
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset + 1], p2);
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset + 2], p3);

                if (p1.equals(p2) || p1.equals(p3) || p2.equals(p3))
                    nZeroAreaFaces++;
            }
            return nZeroAreaFaces;
        };

        // ==================================== Normals processing ===================================
        /**
        * based on http://stackoverflow.com/questions/18519586/calculate-normal-per-vertex-opengl
        * @param {Uint16Array} vertices - the vertices which need the normals calculated, so do not have to do the entire mesh
        * @param {Float32Array} normals - the array to place the results, size:  vertices.length * 3
        * @param {Float32Array} futurePos - value of positions on which to base normals, passing since so does not have to be set to in mesh yet
        */
        Mesh.prototype.normalsforVerticesInPlace = function (vertices, normals, futurePos) {
            var indices = _super.prototype.getIndices.call(this);
            var nVertices = vertices.length;

            // Define all the reusable objects outside the for loop, so ..ToRef() & ..InPlace() versions can be used,
            // avoiding many single use objects to garbage collect.
            var memberOfFaces;
            var nFaces;
            var faceOffset;
            var vertexID;
            var p1 = BABYLON.Vector3.Zero();
            var p2 = BABYLON.Vector3.Zero();
            var p3 = BABYLON.Vector3.Zero();
            var p1p2 = BABYLON.Vector3.Zero();
            var p3p2 = BABYLON.Vector3.Zero();

            var cross = BABYLON.Vector3.Zero();
            var normal = BABYLON.Vector3.Zero();
            var sinAlpha;
            var weightedAvgSum = BABYLON.Vector3.Zero();

            for (var v = 0; v < nVertices; v++) {
                memberOfFaces = this._vertexMemberOfFaces[vertices[v]];
                nFaces = memberOfFaces.length;
                BABYLON.Vector3.FromFloatsToRef(0, 0, 0, weightedAvgSum); // initialize reused vector to all zeros

                for (var f = 0; f < nFaces; f++) {
                    faceOffset = memberOfFaces[f] * 3;
                    vertexID = this.indexOfVertInFace(indices[faceOffset], indices[faceOffset + 1], indices[faceOffset + 2], vertices[v]);
                    if (vertexID === -1)
                        throw "MORPH.Mesh: vertex not part of face";

                    // triangleNormalFromVertex() as from example noted above
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset + vertexID], p1);
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset + ((vertexID + 1) % 3)], p2);
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset + ((vertexID + 2) % 3)], p3);

                    p1.subtractToRef(p2, p1p2);
                    p3.subtractToRef(p2, p3p2);

                    BABYLON.Vector3.CrossToRef(p1p2, p3p2, cross);
                    BABYLON.Vector3.NormalizeToRef(cross, normal);

                    sinAlpha = cross.length() / (p1p2.length() * p3p2.length());

                    // due floating point, might not be -1 ≤ sinAlpha ≤ 1, e.g. 1.0000000000000002; fix to avoid Math.asin() from returning NaN
                    if (sinAlpha < -1)
                        sinAlpha = -1;
                    else if (sinAlpha > 1)
                        sinAlpha = 1;

                    normal.scaleInPlace(Math.asin(sinAlpha));
                    weightedAvgSum.addInPlace(normal);
                }
                weightedAvgSum.normalize();
                normals[v * 3] = weightedAvgSum.x;
                normals[(v * 3) + 1] = weightedAvgSum.y;
                normals[(v * 3) + 2] = weightedAvgSum.z;
            }
        };

        Mesh.prototype.indexOfVertInFace = function (idx0, idx1, idx2, vertIdx) {
            if (vertIdx === idx0)
                return 0;
            if (vertIdx === idx1)
                return 1;
            if (vertIdx === idx2)
                return 2;
            return -1;
        };

        // ================================== ShapeKeyGroup related ==================================
        Mesh.prototype.addShapeKeyGroup = function (shapeKeyGroup) {
            this._shapeKeyGroups.push(shapeKeyGroup);
        };

        Mesh.prototype.queueEventSeries = function (eSeries) {
            var groupFound = false;
            for (var g = this._shapeKeyGroups.length - 1; g >= 0; g--) {
                if (eSeries.isShapeKeyGroupParticipating(this._shapeKeyGroups[g].getName())) {
                    this._shapeKeyGroups[g].queueEventSeries(eSeries);
                    groupFound = true;
                }
            }
            if (this.debug && !groupFound)
                BABYLON.Tools.Warn("no shape keys groups participating in event series");
        };

        Mesh.prototype.getShapeKeyGroup = function (groupName) {
            for (var g = this._shapeKeyGroups.length - 1; g >= 0; g--) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    return this._shapeKeyGroups[g];
                }
            }
            return null;
        };

        // ================================== Point of View Movement =================================
        /**
        * When the mesh is defined facing forward, multipliers must be set so that movePOV() is
        * from the point of view of behind the front of the mesh.
        * @param {boolean} definedFacingForward - True is the default
        */
        Mesh.prototype.setDefinedFacingForward = function (definedFacingForward) {
            this._definedFacingForward = definedFacingForward;
        };

        /**
        * Perform relative position change from the point of view of behind the front of the mesh.
        * This is performed taking into account the meshes current rotation, so you do not have to care.
        * Supports definition of mesh facing forward or backward.
        * @param {number} amountRight
        * @param {number} amountUp
        * @param {number} amountForward
        */
        Mesh.prototype.movePOV = function (amountRight, amountUp, amountForward) {
            this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
        };

        /**
        * Calculate relative position change from the point of view of behind the front of the mesh.
        * This is performed taking into account the meshes current rotation, so you do not have to care.
        * Supports definition of mesh facing forward or backward.
        * @param {number} amountRight
        * @param {number} amountUp
        * @param {number} amountForward
        */
        Mesh.prototype.calcMovePOV = function (amountRight, amountUp, amountForward) {
            var rotMatrix = new BABYLON.Matrix();
            var rotQuaternion = (this.rotationQuaternion) ? this.rotationQuaternion : BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
            rotQuaternion.toRotationMatrix(rotMatrix);

            var translationDelta = BABYLON.Vector3.Zero();
            var defForwardMult = this._definedFacingForward ? -1 : 1;
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, rotMatrix, translationDelta);
            return translationDelta;
        };

        // ================================== Point of View Rotation =================================
        /**
        * Perform relative rotation change from the point of view of behind the front of the mesh.
        * Supports definition of mesh facing forward or backward.
        * @param {number} flipBack
        * @param {number} twirlClockwise
        * @param {number} tiltRight
        */
        Mesh.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
        };

        /**
        * Calculate relative rotation change from the point of view of behind the front of the mesh.
        * Supports definition of mesh facing forward or backward.
        * @param {number} flipBack
        * @param {number} twirlClockwise
        * @param {number} tiltRight
        */
        Mesh.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var defForwardMult = this._definedFacingForward ? 1 : -1;
            return new BABYLON.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        };

        /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
        Mesh.pauseSystem = function () {
            Mesh._systemPaused = true;
        };
        Mesh.isSystemPaused = function () {
            return Mesh._systemPaused;
        };

        Mesh.resumeSystem = function () {
            Mesh._systemPaused = false;
            Mesh._systemResumeTime = Mesh.now();
        };

        // instance level methods
        Mesh.prototype.pausePlay = function () {
            this._instancePaused = true;
        };
        Mesh.prototype.isPaused = function () {
            return this._instancePaused;
        };

        Mesh.prototype.resumePlay = function () {
            this._instancePaused = false;
            this._lastResumeTime = Mesh.now();

            for (var g = this._shapeKeyGroups.length - 1; g >= 0; g--) {
                this._shapeKeyGroups[g].resumePlay();
            }
        };

        // ========================================= Statics =========================================
        /** wrapper for window.performance.now, incase not implemented, e.g. Safari */
        Mesh.now = function () {
            return (typeof window.performance === "undefined") ? Date.now() : window.performance.now();
        };

        Object.defineProperty(Mesh, "Version", {
            get: function () {
                return "1.0.0";
            },
            enumerable: true,
            configurable: true
        });
        Mesh._systemPaused = false;
        Mesh._systemResumeTime = 0;
        return Mesh;
    })(BABYLON.Mesh);
    MORPH.Mesh = Mesh;
})(MORPH || (MORPH = {}));
var MORPH;
(function (MORPH) {
    /**
    *  Class used to coorelate duration ratio to completion ratio.  Enables Deformations to have
    *  characteristics like accelation, deceleration, & linear.
    */
    var Pace = (function () {
        /**
        * @immutable, reusable
        * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
        * @param {Array} durationRatios - values from (> 0 to 1.0), MUST increase from left to right
        */
        function Pace(completionRatios, durationRatios) {
            this.completionRatios = completionRatios;
            this.durationRatios = durationRatios;
            // argument validations for JavaScript
            if (!(completionRatios instanceof Array) || !(durationRatios instanceof Array))
                throw "Pace: ratios not arrays";
            if (completionRatios.length !== durationRatios.length)
                throw "Pace: ratio arrays not of equal length";

            if (completionRatios.length === 0)
                throw "Pace: ratio arrays cannot be empty";

            var cRatio, dRatio, prevD = -1;
            for (var i = 0; i < completionRatios.length; i++) {
                cRatio = completionRatios[i];
                dRatio = durationRatios[i];
                if (cRatio <= 0 || dRatio <= 0)
                    throw "Pace: ratios must be > 0";
                if (cRatio > 1 || dRatio > 1)
                    throw "Pace: ratios must be <= 1";
                if (prevD >= dRatio)
                    throw "Pace: durationRatios must be in increasing order";
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1)
                throw "Pace: final ratios must be 1";

            // public member assignment for all, since immutable
            this.steps = completionRatios.length;

            this.incremetalCompletionBetweenSteps = [completionRatios[0]]; // elements can be negative for 'hicups'
            this.incremetalDurationBetweenSteps = [durationRatios[0]];
            for (var i = 1; i < this.steps; i++) {
                this.incremetalCompletionBetweenSteps.push(completionRatios[i] - completionRatios[i - 1]);
                this.incremetalDurationBetweenSteps.push(durationRatios[i] - durationRatios[i - 1]);
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

            var upperIdx = 0;
            for (; upperIdx < this.steps; upperIdx++) {
                if (currentDurationRatio < this.durationRatios[upperIdx])
                    break;
            }

            var baseCompletion = (upperIdx > 0) ? this.completionRatios[upperIdx - 1] : 0;
            var baseDuration = (upperIdx > 0) ? this.durationRatios[upperIdx - 1] : 0;
            var interStepRatio = (currentDurationRatio - baseDuration) / this.incremetalDurationBetweenSteps[upperIdx];

            return baseCompletion + (interStepRatio * this.incremetalCompletionBetweenSteps[upperIdx]);
        };
        Pace.LINEAR = new Pace([1.0], [1.0]);
        return Pace;
    })();
    MORPH.Pace = Pace;
})(MORPH || (MORPH = {}));
