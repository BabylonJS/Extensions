/// <reference path="./VertexDeformation.ts"/>
/// <reference path="../../meshes/Mesh.ts"/>

/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>

module QI {
//    declare var SIMD;
//    declare var Float32x4Array;

    export class ShapeKeyGroup extends PovProcessor{
        private _nPosElements : number;

        // arrays for the storage of each state
        private _states  = new Array<Float32Array>();
        private _normals = new Array<Float32Array>();
        private _stateNames = new Array<string>();

        // affected vertices are used for normals, since all the entire vertex is involved, even if only the x of a position is affected
        private _affectedVertices : Uint16Array;
        private _nVertices : number;

        // reference vars for the current & prior deformation; assigned either an item of (_states / _normals) or one of the reusables
        private _currFinalPositionVals  : Float32Array;
        private _priorFinalPositionVals : Float32Array;
        private _currFinalNormalVals    : Float32Array;
        private _priorFinalNormalVals   : Float32Array;
        private _stalling : boolean;

        // typed arrays are more expense to create, pre-allocate pairs for reuse
        private _reusablePositionFinals = new Array<Float32Array>();
        private _reusableNormalFinals   = new Array<Float32Array>();
        private _lastReusablePosUsed  = 0;
        private _lastReusableNormUsed = 0;

        // SIMD versions
        private _currFinalPositionSIMD  : any;
        private _priorFinalPositionSIMD : any;
        private _currFinalNormalSIMD    : any;
        private _priorFinalNormalSIMD   : any;

        // misc
        private _mirrorAxis = -1; // when in use x = 1, y = 2, z = 3
        public static BASIS = "BASIS";

        /**
         * @param {Mesh} _mesh - reference of QI.Mesh this ShapeKeyGroup is a part of
         * @param {String} _name - Name of the Key Group, upper case only
         * @param {Uint32Array} _affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
         */
        constructor(_mesh : Mesh, _name : string, private _affectedPositionElements : Uint32Array) {
            super(_mesh, true);
            this._name = _name; // override dummy

            if (!(this._affectedPositionElements instanceof Uint32Array) ) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid affectedPositionElements arg");
                return;
            }
            this._nPosElements = this._affectedPositionElements.length;

            // initialize 2 position reusables, the size needed
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));

            // determine affectedVertices for updating cooresponding normals
            var affectedVert = new Array<number>(); // final size unknown, so use a push-able array & convert to Uint16Array at end
            var vertIdx  = -1;
            var nextVertIdx : number;

            // go through each position element
            for (var i = 0; i < this._nPosElements; i++) {
                // the vertex index is 1/3 the position element index
                nextVertIdx = Math.floor(this._affectedPositionElements[i] / 3);

                // since position element indexes in ascending order, check if vertex not already added by the x, or y elements
                if (vertIdx !== nextVertIdx){
                    vertIdx = nextVertIdx;
                    affectedVert.push(vertIdx);
                }
            }
            this._affectedVertices = new Uint16Array(affectedVert);
            this._nVertices = this._affectedVertices.length;

            // initialize 2 normal reusables, the full size needed
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));

            // fish out the basis state from the mesh vertex data
            var basisState = new Float32Array(this._nPosElements);
            var OriginalPositions = _mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (var i = 0; i < this._nPosElements; i++) {
                basisState[i] = OriginalPositions[this._affectedPositionElements[i]];
            }

            // push 'BASIS' to _states & _stateNames, then initialize _currFinalVals to 'BASIS' state
            this._addShapeKey(ShapeKeyGroup.BASIS, false, basisState);
            this._currFinalPositionVals  = this._states [0];
            this._currFinalNormalVals    = this._normals[0];
        }
        // =============================== Shape-Key adding & deriving ===============================
        private _getDerivedName(referenceIdx : number, endStateIdxs : Array<number>, endStateRatios : Array<number>, mirrorAxes : string = null) : string {
            return referenceIdx + "-[" + endStateIdxs + "]@[" + endStateRatios + "]" + (mirrorAxes ? "-" + mirrorAxes : "");
        }
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        public addDerivedKeyFromDeformation(deformation : VertexDeformation) : void {
            this.addComboDerivedKey(deformation.getReferenceStateName(), deformation.getEndStateNames(), deformation.getEndStateRatios());
        }

        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxis - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         */
        public addDerivedKey(referenceStateName : string, endStateName : string, endStateRatio : number, mirrorAxis : string = null) : void {
            if (endStateRatio === 1) {
                BABYLON.Tools.Warn("ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless, ignored");
                return;
            }
            this.addComboDerivedKey(referenceStateName, [endStateName], [endStateRatio], mirrorAxis);
        }

        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on, probably 'Basis'
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {String} newStateName - The name of the new state.  If not set, then it will be computed. (optional)
         * @returns {String} The state name, which might be useful, if you did not include it as an argument
         */
        public addComboDerivedKey(referenceStateName : string, endStateNames : Array<string>, endStateRatios : Array<number>, mirrorAxes : string = null, newStateName ? : string) : string {
            // test if key already exists, then leave
            if (newStateName && this.hasKey(newStateName) ) return null;

            var referenceIdx = this._getIdxForState(referenceStateName);
            if (referenceIdx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            var endStateIdxs = new Array<number>();
            var endStateIdx : number;
            for (var i = 0; i < endStateNames.length; i++) {
                endStateIdx = this._getIdxForState(endStateNames[i]);
                if (endStateIdx === -1) {
                    BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                    return;
                }
                endStateIdxs.push(endStateIdx);
            }

            var stateName = newStateName ? newStateName : this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, mirrorAxes);
            var stateKey  = new Float32Array(this._nPosElements);
            this._buildPosEndPoint(stateKey, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes, (<QI.Mesh> this._node).debug);
            this._addShapeKey(stateName, false, stateKey);
            return stateName;
        }

        /** 
         * Called in construction code from TOB.  Unlikely to be called by application code. 
         * @param {string} stateName - Name of the end state to be added.
         * @param {boolean} basisRelativeVals - when true, values are relative to basis, which is usually much more compact
         * @param {Float32Array} stateKey - Array of the positions for the _affectedPositionElements
         */
        public _addShapeKey(stateName : string, basisRelativeVals : boolean, stateKey : Float32Array) : void {
            if (typeof stateName !== 'string' || stateName.length === 0) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid stateName arg");
                return;
            }
            if (this.hasKey(stateName) ){
                BABYLON.Tools.Warn("ShapeKeyGroup: stateName " + stateName + " is a duplicate, ignored");
                return;
            }
            this._states.push(stateKey);
            this._stateNames.push(stateName);
            
            if (basisRelativeVals) {
                var basis = this._states[0];
                for (var i = 0; i < this._nPosElements; i++) {
                    stateKey[i] += basis[i];
                }
            }

            var coorespondingNormals = new Float32Array(this._nVertices * 3);
            this._buildNormEndPoint(coorespondingNormals, stateKey);
            this._normals.push(coorespondingNormals);

            if ((<QI.Mesh> this._node).debug) BABYLON.Tools.Log("Shape key: " + stateName + " added to group: " + this._name + " on QI.Mesh: " + this._node.name);
        }

        /**
         * Remove the resources associated with a end state.
         * @param {string} endStateName - Name of the end state to be removed.
         */
        public deleteShapeKey(stateName : string) : void {
            var idx = this._getIdxForState(stateName);
            if (idx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            this._stateNames.splice(idx, 1);
            this._states.splice(idx, 1);
            this._normals.splice(idx, 1);

            if ((<QI.Mesh> this._node).debug) BABYLON.Tools.Log("Shape key: " + stateName + " deleted from group: " + this._name + " on QI.Mesh: " + this._node.name);
        }
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * ShapeKeyGroup is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        public _incrementallyDeform(positions : Float32Array, normals :Float32Array) : boolean {
            super._incrementallyMove();

            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a VertexDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof VertexDeformation) ) return false;

            if (this._ratioComplete < 0) return false; // MotionEvent.BLOCKED or MotionEvent.WAITING

            // delay swapping currents to priors, in-case event gets cancelled after starting, but in an initial wait
            if (this._runOfStep === 1) this._firstRun();
            
            // update the positions
            this._updatePositions(positions);

            // update the normals
            this._updateNormals(normals);

            return true;
        }
        
        /**
         * Go to a single pre-defined state immediately.  Much like Skeleton._assignPoseImmediately, can be done while
         * mesh is not currently visible.  Should not be call here, but through the mesh.
         * @param {string} stateName - Names of the end state to take.
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        public _deformImmediately(stateName : string, positions : Float32Array, normals : Float32Array) : void {
            var idx = this._getIdxForState(stateName);
            if (idx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + stateName.toUpperCase());
                return;
            }
            // interrupt any current deform, if any
            if (this._currentStepInSeries instanceof VertexDeformation) this.stopCurrent(true);
            
            // assign the currFinal's so next deform knows where it is coming from
            this._currFinalPositionVals = this._states [idx];
            this._currFinalNormalVals   = this._normals[idx];
            
            for (var i = 0; i < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._currFinalPositionVals[i];
            }
            
            var mIdx : number, kIdx : number;
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                normals[mIdx    ] = this._currFinalNormalVals[kIdx    ];
                normals[mIdx + 1] = this._currFinalNormalVals[kIdx + 1];
                normals[mIdx + 2] = this._currFinalNormalVals[kIdx + 2];
            }
        }

        /** Only public, so can be swapped out with SIMD version */
        public _updatePositions(positions : Float32Array) : void {
            for (var i = 0; i < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4.splat(this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4.load(this._priorFinalPositionVals, i);
                var currFinalPositionVals  = SIMD.Float32x4.load(this._currFinalPositionVals, i);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMDToo(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4(this._priorFinalPositionVals[i], this._priorFinalPositionVals[i + 1], this._priorFinalPositionVals[i + 2], this._priorFinalPositionVals[i + 3]);
                var currFinalPositionVals  = SIMD.Float32x4(this._currFinalPositionVals [i], this._currFinalPositionVals [i + 1], this._currFinalPositionVals [i + 2], this._currFinalPositionVals [i + 3]);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD4(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            var nX4Pos = Math.floor(this._nPosElements / 4);

            for (var i = 0; i < nX4Pos; i++){
                var positionx4 = SIMD.Float32x4.add(this._priorFinalPositionSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalPositionSIMD[i], this._priorFinalPositionSIMD[i]), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i * 4], positionx4);
            }
            // do up to 3 leftovers
            var nLeftovers = this._nPosElements - nX4Pos * 4;
            for (var i = this._nPosElements - (nLeftovers + 1); i  < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        }
*/
        /** Only public, so can be swapped out with SIMD version */
        public _updateNormals(normals :Float32Array) : void {
            var mIdx : number, kIdx : number;
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                normals[mIdx    ] = this._priorFinalNormalVals[kIdx    ] + ((this._currFinalNormalVals[kIdx    ] - this._priorFinalNormalVals[kIdx    ]) * this._ratioComplete);
                normals[mIdx + 1] = this._priorFinalNormalVals[kIdx + 1] + ((this._currFinalNormalVals[kIdx + 1] - this._priorFinalNormalVals[kIdx + 1]) * this._ratioComplete);
                normals[mIdx + 2] = this._priorFinalNormalVals[kIdx + 2] + ((this._currFinalNormalVals[kIdx + 2] - this._priorFinalNormalVals[kIdx + 2]) * this._ratioComplete);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD(normals :Float32Array) : void {
            var mIdx : number, kIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                var currFinalNormalVals  = SIMD.Float32x4.load3(this._currFinalNormalVals, kIdx);
                var priorFinalNormalVals = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                var normalx4             = SIMD.Float32x4.add(priorFinalNormalVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalNormalVals, priorFinalNormalVals), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }
        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD4(normals :Float32Array) : void {
            var mIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                var normalx4 = SIMD.Float32x4.add(this._priorFinalNormalSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalNormalSIMD[i], this._priorFinalNormalSIMD[i]), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }*/
        // ======================================== event prep =======================================
        /**
         * delay swapping currents to priors, in-case event gets cancelled after starting, but in an initial wait
         */
        private _firstRun() : void {
            // is possible to have a MotionEvent(with no deformation), not VertexDeformation sub-class
            if (!(this._currentStepInSeries instanceof VertexDeformation) ) return;

            this._priorFinalPositionVals = this._currFinalPositionVals;
            this._priorFinalNormalVals   = this._currFinalNormalVals  ;

            var deformation : VertexDeformation = <VertexDeformation> this._currentStepInSeries;
            var referenceIdx = this._getIdxForState(deformation.getReferenceStateName() );
            if (referenceIdx === -1) {
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
                return;
            }
            var endStateNames  = deformation.getEndStateNames();
            var endStateRatios = deformation.getEndStateRatios();
            this._stalling = endStateRatios === null;

            if (!this._stalling){
                var endStateIdxs = new Array<number>();
                var endStateIdx : number;
                var allZeros : boolean = true;
                for (var i = 0; i < endStateNames.length; i++){
                   endStateIdx = this._getIdxForState(endStateNames[i]);
                   if (endStateIdx === -1) {
                       BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                       return;
                   }
                   endStateIdxs.push(endStateIdx);

                   allZeros = allZeros && endStateRatios[i] === 0;
                }

                // when a single end state key, & endStateRatio is 1 or 0, just assign _currFinalVals directly from _states
                if (allZeros || (endStateRatios.length === 1 && (endStateRatios[0] === 1 || endStateRatios[0] === 0)) ){
                     var idx = (allZeros || endStateRatios[0] === 0)? referenceIdx : endStateIdxs[0]; // really just the reference when 0
                     this._currFinalPositionVals = this._states [idx];
                     this._currFinalNormalVals   = this._normals[idx];
                }else{
                    // check there was not a pre-built derived key to assign
                    var derivedIdx = this._getIdxForState(this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes) );
                    if (derivedIdx !== -1){
                        this._currFinalPositionVals = this._states [derivedIdx];
                        this._currFinalNormalVals   = this._normals[derivedIdx];
                    } else{
                        // need to build _currFinalVals, toggling the _lastReusablePosUsed
                        this._lastReusablePosUsed = (this._lastReusablePosUsed === 1) ? 0 : 1;
                        this._buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed], referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes, (<QI.Mesh> this._node).debug);
                        this._currFinalPositionVals = this._reusablePositionFinals[this._lastReusablePosUsed];

                        // need to build _currFinalNormalVals, toggling the _lastReusableNormUsed
                        this._lastReusableNormUsed = (this._lastReusableNormUsed === 1) ? 0 : 1;
                        this._buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed], this._currFinalPositionVals);
                        this._currFinalNormalVals = this._reusableNormalFinals[this._lastReusableNormUsed];
                    }
                }
//                if (SIMDHelper.IsEnabled) this._prepForSIMD();
            }
        }

/*        private _prepForSIMD(){
            var nX4Pos = Math.floor(this._nPosElements / 4);
            var priorCopied = typeof (this._currFinalPositionSIMD) !== "undefined";

            this._priorFinalPositionSIMD = priorCopied ? this._currFinalPositionSIMD : [];
            this._currFinalPositionSIMD  = [];

            for (var i = 0, x4 = 0; i < nX4Pos;  i++, x4 += 4){
                if (!priorCopied){
                    this._priorFinalPositionSIMD[i] = SIMD.Float32x4(this._priorFinalPositionVals[x4], this._priorFinalPositionVals[x4 + 1], this._priorFinalPositionVals[x4 + 2], this._priorFinalPositionVals[x4 + 3]);
                }
                    this._currFinalPositionSIMD [i] = SIMD.Float32x4(this._currFinalPositionVals [x4], this._currFinalPositionVals [x4 + 1], this._currFinalPositionVals [x4 + 2], this._currFinalPositionVals [x4 + 3]);
            }

            priorCopied = typeof (this._currFinalNormalSIMD) !== "undefined";
            this._priorFinalNormalSIMD = priorCopied ? this._currFinalNormalSIMD : [];
            this._currFinalNormalSIMD  = [];

            var kIdx : number;
            for (var i = 0; i < this._nVertices; i++){
                kIdx = 3 * i;                        // offset for this vertex in the shape key group

                if (!priorCopied){
                    this._priorFinalNormalSIMD[i] = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                }
                    this._currFinalNormalSIMD [i] = SIMD.Float32x4.load3(this._currFinalNormalVals , kIdx);
            }
        }*/
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
        private _buildPosEndPoint(targetArray : Float32Array, referenceIdx: number, endStateIdxs : Array<number>, endStateRatios : Array<number>, mirrorAxes : string = null, log = false) : void {
            var refEndState = this._states[referenceIdx];
            var nEndStates = endStateIdxs.length;

            // compute each of the new final values of positions
            var deltaToRefState : number;
            var stepDelta : number;
            var j : number;

            var mirroring : number[];
            if (mirrorAxes || ShapeKeyGroup._isMirroring(endStateRatios) ){
                mirroring = new Array<number>(endStateRatios.length);
                if (mirrorAxes) mirrorAxes = mirrorAxes.toUpperCase();
                for (j = 0; j < endStateRatios.length; j++){
                    if (mirrorAxes){
                        switch (mirrorAxes.charAt(j)){
                            case "X": mirroring[j] =  1; break;
                            case "Y": mirroring[j] =  2; break;
                            case "Z": mirroring[j] =  3; break;
                        }
                    }else mirroring[j] = this._mirrorAxis;
                }
            }
            for (var i = 0; i < this._nPosElements; i++){
                deltaToRefState = 0;
                for(j = 0; j < nEndStates; j++){
                    stepDelta = (this._states[endStateIdxs[j]][i] - refEndState[i]) * endStateRatios[j];

                    // reverse sign on appropriate elements of referenceDelta when ratio neg & mirroring, except when Z since left handed
                    if (endStateRatios[j] < 0 && mirroring[j] !== (i + 1) % 3 && mirroring[j] !== 3){
                        stepDelta *= -1;
                    }
                    deltaToRefState += stepDelta;
                }
                targetArray[i] = refEndState[i] + deltaToRefState;
            }
            if (log) BABYLON.Tools.Log(this._name + " end Point built for referenceIdx: " + referenceIdx + ",  endStateIdxs: " + endStateIdxs + ", endStateRatios: " + endStateRatios);
        }

        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
         * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
         */

        private _buildNormEndPoint(targetArray : Float32Array, endStatePos : Float32Array) : void {
            var mesh = <QI.Mesh> this._node;
            mesh._futurePositions.set(mesh._originalPositions);

            // populate the changes that this state has
            for (var i = 0; i < this._nPosElements; i++){
                mesh._futurePositions[this._affectedPositionElements[i]] = endStatePos[i];
            }

            BABYLON.VertexData.ComputeNormals(mesh._futurePositions, mesh.getIndices(), mesh._futureNormals);

            var mIdx : number, kIdx : number;
            // populate the changes that this state has
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                targetArray[kIdx    ] = mesh._futureNormals[mIdx    ];
                targetArray[kIdx + 1] = mesh._futureNormals[mIdx + 1];
                targetArray[kIdx + 2] = mesh._futureNormals[mIdx + 2];
            }
        }

        private static _isMirroring(endStateRatios : Array<number>) : boolean {
            for (var i = 0, len = endStateRatios.length; i < len; i++)
                if (endStateRatios[i] < 0) return true;
            return false;
        }
        // ==================================== Getters & setters ====================================
        /**
         * Determine if a key already exists.
         * @param {string} stateName - name of key to check
         */
        public hasKey(stateName : string) : boolean {
            return this._getIdxForState(stateName) !== -1;
        }

        private _getIdxForState(stateName : string) : number {
            stateName = stateName.toUpperCase();
            for (var i = 0, len = this._stateNames.length; i < len; i++){
                if (this._stateNames[i] === stateName){
                    return i;
                }
            }
            return -1;
        }

        public getName() : string { return this._name; }
        public getNPosElements() : number { return this._nPosElements; }
        public getNStates() : number { return this._stateNames.length; }
        public getStates() : Array<string> { return this._stateNames.slice(0); } // do not allow actual access to names, copy
        public toString() : string { return 'ShapeKeyGroup: ' + this._name + ', n position elements: ' + this._nPosElements + ',\nStates: ' + this._stateNames; }

        public mirrorAxisOnX  () : void {this._mirrorAxis =  1;}
        public mirrorAxisOnY  () : void {this._mirrorAxis =  2;}
        public mirrorAxisOnZ  () : void {this._mirrorAxis =  3;}
        // ========================================= statics =========================================
        /**
         * Only public for QI.MeshconsolidateShapeKeyGroups(), where this should be called from.
         */
        public static _buildConsolidatedGroup(mesh : Mesh, newGroupName : string, thoseToMerge : Array<ShapeKeyGroup>) : ShapeKeyGroup {
            var nVerts = mesh._originalPositions.length;
            var nSources = thoseToMerge.length;
            
            // determine which vertices are used in the consolidated group
            var nPosElements = 0;
            var affectedBool = new Array<boolean>(nVerts);
            for (var i = 0; i < nSources; i++) {
                var sourceGrp = thoseToMerge[i];
                
                for (var j = 0; j < sourceGrp._nPosElements; j++) {
                    var vert = sourceGrp._affectedPositionElements[j];
                    
                    if (!affectedBool[vert]){
                        affectedBool[vert] = true;
                        nPosElements++;
                    }
                }
            }
            
            // assemble affectedPositionElements & instance consolidated
            var affectedPositionElements = new Uint32Array(nPosElements);
            var idx = 0;
            for (var i = 0; i < nVerts; i++) {
                if (affectedBool[i]) affectedPositionElements[idx++] = i;
            }
            var ret = new ShapeKeyGroup(mesh, newGroupName, affectedPositionElements);
            mesh.addShapeKeyGroup(ret);
            
            // transfer each key from source group
            for (var i = 0; i < nSources; i++) {
                var sourceGrp = thoseToMerge[i];
                
                // need to determine where the source group maps into the larger group
                var map = new Array(sourceGrp._nPosElements);
                var srcIdx = 0;
                for (var destIdx = 0; destIdx < nPosElements; destIdx++) {
                    if (affectedPositionElements[destIdx] === sourceGrp._affectedPositionElements[srcIdx]) {
                        map[srcIdx++] = destIdx;
                    }
                }
                
                // key zero is basis
                for (var k = 1, nKeys = sourceGrp._states.length; k < nKeys; k++) {
                    var key = new Float32Array(nPosElements);
                    key.set(ret._states[0]); // initialize with basis, in a c++ loop
                    
                    var origKey = sourceGrp._states[k];
                    
                    for (var j = 0; j < sourceGrp._nPosElements; j++) {
                        key[map[j]] = origKey[j];
                    }
                    ret._addShapeKey(sourceGrp._name + "_" + sourceGrp._stateNames[k], false, key);
                } 
            }
            
            return ret;
        }
    }

/*    // SIMD
    var previousUpdatePositions = ShapeKeyGroup.prototype._updatePositions;
    var previousUpdateNormals = ShapeKeyGroup.prototype._updateNormals;

    export class SIMDHelper {
        private static _isEnabled = false;

        public static get IsEnabled(): boolean {
            return SIMDHelper._isEnabled;
        }

        public static DisableSIMD(): void {
            // Replace functions
            ShapeKeyGroup.prototype._updatePositions = <any> previousUpdatePositions;
            ShapeKeyGroup.prototype._updateNormals   = <any> previousUpdateNormals;

            SIMDHelper._isEnabled = false;
        }

        public static EnableSIMD(): void {
            if (window.SIMD === undefined) {
                return;
            }

            // Replace functions
            ShapeKeyGroup.prototype._updatePositions = <any> ShapeKeyGroup.prototype._updatePositionsSIMDToo;
            ShapeKeyGroup.prototype._updateNormals   = <any> ShapeKeyGroup.prototype._updateNormalsSIMD;

            SIMDHelper._isEnabled = true;
            BABYLON.Tools.Log("QI SIMD mode enabled");
        }
    }

    if (window.SIMD !== undefined) {
        SIMDHelper.EnableSIMD();
    }else{
        BABYLON.Tools.Log("Environment not QI SIMD capable, sorry");
    }*/
}