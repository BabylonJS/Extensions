/// <reference path="./ReferenceDeformation.ts"/>
/// <reference path="./Mesh.ts"/>
module MORPH {
    export class ShapeKeyGroup extends POV.BeforeRenderer{
        // position elements converted to typed array
        private _affectedPositionElements : Uint16Array;
        private _nPosElements : number;
        
        // arrays for the storage of each state
        private _states  = new Array<Float32Array>();
        private _normals = new Array<Float32Array>();
        private _stateNames = new Array<string>();      

        // affected vertices are used for normals, since all the entire vertex is involved, even if only the x of a position is affected
        private _affectedVertices : Uint16Array;
        private _nVertices;
            
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
        
        // misc
        private _mirrorAxis = -1; // when in use x = 1, y = 2, z = 3
 
        /**
         * @param {Mesh} _mesh - reference of MORPH.Mesh this ShapeKeyGroup is a part of
         * @param {String} _name - Name of the Key Group, upper case only
         * @param {Array} affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
         * @param {Array} basisState - original state of the affectedPositionElements of positions
         */
        constructor(_mesh : Mesh, _name : string, affectedPositionElements : Array<number>, basisState : Array<number>){
            super(_mesh, true);
            this._name = _name; // override dummy
            
            if (!(affectedPositionElements instanceof Array) || affectedPositionElements.length === 0                ) BABYLON.Tools.Error("ShapeKeyGroup: invalid affectedPositionElements arg");
            if (!(basisState               instanceof Array) || basisState.length !== affectedPositionElements.length) BABYLON.Tools.Error("ShapeKeyGroup: invalid basisState arg");

            // validation that position elements are in ascending order; normals relies on this being true
            this._affectedPositionElements = new Uint16Array(affectedPositionElements);        
            this._nPosElements = affectedPositionElements.length;
            for (var i = 0; i + 1 < this._nPosElements; i++)
                if (!(this._affectedPositionElements[i] < this._affectedPositionElements[i + 1])) BABYLON.Tools.Error("ShapeKeyGroup: affectedPositionElements must be in ascending order");
            
            // initialize 2 position reusables, the size needed
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            
            // determine affectedVertices for updating cooresponding normals
            var affectedVert = new Array<number>(); // final size unknown, so use a push-able array & convert to Uint16Array at end
            var vertIdx  = -1;
            var nextVertIdx : number;
            
            // go through each position element 
            for (var i = 0; i < this._nPosElements; i++){
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
            
            // initialize 2 normal reusables, the size needed
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));               
        
            // push 'BASIS' to _states & _stateNames, then initialize _currFinalVals to 'BASIS' state
            this.addShapeKey("BASIS", basisState);
            this._currFinalPositionVals  = this._states [0];       
            this._currFinalNormalVals    = this._normals[0];   
        }
        // =============================== Shape-Key adding & deriving ===============================
        private getDerivedName(referenceIdx : number, endStateIdxs : Array<number>, endStateRatios : Array<number>) : string{
            return referenceIdx + "-[" + endStateIdxs + "]@[" + endStateRatios + "]";
        }
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        public addDerivedKeyFromDeformation(deformation : ReferenceDeformation) : void{
            this.addComboDerivedKey(deformation.getReferenceStateName(), deformation.getEndStateNames(), deformation.getEndStateRatios());
        }
        
        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         */
        public addDerivedKey(referenceStateName : string, endStateName : string, endStateRatio : number) : void{
            if (endStateRatio === 1){
                BABYLON.Tools.Warn("ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless, ignored");
                return;
            }
            this.addComboDerivedKey(referenceStateName, [endStateName], [endStateRatio]);
        }
        
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {Array} endStateNames - Names of the end state to be based on
         * @param {Array} endStateRatios - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         */
        public addComboDerivedKey(referenceStateName : string, endStateNames : Array<string>, endStateRatios : Array<number>) : void{
            var referenceIdx = this.getIdxForState(referenceStateName.toUpperCase());
            if (referenceIdx === -1) BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
            
            var endStateIdxs = new Array<number>();
            var endStateIdx : number;
            for (var i = 0; i < endStateNames.length; i++){
                endStateIdx = this.getIdxForState(endStateNames[i].toUpperCase() );
                if (endStateIdx === -1) BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                
                endStateIdxs.push(endStateIdx);
            }
            
            var stateName = this.getDerivedName(referenceIdx, endStateIdxs, endStateRatios);
            var stateKey  = new Float32Array(this._nPosElements);
            
            this.buildPosEndPoint(stateKey, referenceIdx, endStateIdxs, endStateRatios);
            this.addShapeKeyInternal(stateName, stateKey);
        }
        
        /** called in construction code from TOB, but outside the constructor, except for 'BASIS'.  Unlikely to be called by application code. */
        public addShapeKey(stateName : string, stateKey : Array<number>) : void {
            if (!(stateKey instanceof Array) || stateKey.length !== this._nPosElements) BABYLON.Tools.Error("ShapeKeyGroup: invalid stateKey arg");
            this.addShapeKeyInternal(stateName, new Float32Array(stateKey) );
        }

        /** worker method for both the addShapeKey() & addDerivedKey() methods */
        private addShapeKeyInternal(stateName : string, stateKey : Float32Array) : void {
            if (typeof stateName !== 'string' || stateName.length === 0) BABYLON.Tools.Error("ShapeKeyGroup: invalid stateName arg");
            if (this.getIdxForState(stateName) !== -1){
                BABYLON.Tools.Warn("ShapeKeyGroup: stateName " + stateName + " is a duplicate, ignored");
                return;
            }

            this._states.push(stateKey);
            this._stateNames.push(stateName);
                                
            var coorespondingNormals = new Float32Array(this._nVertices * 3);
            this.buildNormEndPoint(coorespondingNormals, stateKey);
            this._normals.push(coorespondingNormals);

            if ((<MORPH.Mesh> this._mesh).debug) BABYLON.Tools.Log("Shape key: " + stateName + " added to group: " + this._name + " on MORPH.Mesh: " + this._mesh.name);
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
            // is possible to have a MotionEvent(with no deformation), which is not a ReferenceDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof MORPH.ReferenceDeformation) ) return false;
            
            if (this._ratioComplete < 0) return false; // MotionEvent.BLOCKED or MotionEvent.WAITING
            
            // update the positions
            for (var i = 0; i < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
            
            // update the normals
            var mIdx : number, kIdx : number;
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                normals[mIdx    ] = this._priorFinalNormalVals[kIdx    ] + ((this._currFinalNormalVals[kIdx    ] - this._priorFinalNormalVals[kIdx    ]) * this._ratioComplete);
                normals[mIdx + 1] = this._priorFinalNormalVals[kIdx + 1] + ((this._currFinalNormalVals[kIdx + 1] - this._priorFinalNormalVals[kIdx + 1]) * this._ratioComplete);
                normals[mIdx + 2] = this._priorFinalNormalVals[kIdx + 2] + ((this._currFinalNormalVals[kIdx + 2] - this._priorFinalNormalVals[kIdx + 2]) * this._ratioComplete);
            }
            return true;
        }
        // ======================================== event prep =======================================    
        public _nextEvent(event : POV.MotionEvent) : void {
            super._nextEvent(event);
            
            // is possible to have a MotionEvent(with no deformation), not ReferenceDeformation sub-class
            if (!(event instanceof MORPH.ReferenceDeformation) ) return;        

            this._priorFinalPositionVals = this._currFinalPositionVals;
            this._priorFinalNormalVals   = this._currFinalNormalVals  ;
            
            var deformation : ReferenceDeformation = <MORPH.ReferenceDeformation> event;
            var referenceIdx = this.getIdxForState(deformation.getReferenceStateName() );
            if (referenceIdx === -1) BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
            
            var endStateNames  = deformation.getEndStateNames();
            var endStateRatios = deformation.getEndStateRatios();
            this._stalling = endStateRatios === null;
            
            if (!this._stalling){
                var endStateIdxs = new Array<number>();
                var endStateIdx : number;
                var allZeros : boolean = true;
                for (var i = 0; i < endStateNames.length; i++){
                   endStateIdx = this.getIdxForState(endStateNames[i].toUpperCase());
                   if (endStateIdx === -1) BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());              
                   endStateIdxs.push(endStateIdx);

                    if (endStateRatios[i] < 0 && this._mirrorAxis === -1) BABYLON.Tools.Error("ShapeKeyGroup " + this._name + ": invalid deformation, negative end state ratios when not mirroring");
                    allZeros = allZeros && endStateRatios[i] === 0;
                }
           
                // when a single end state key, & endStateRatio is 1 or 0, just assign _currFinalVals directly from _states
                if (allZeros || (endStateRatios.length === 1 && (endStateRatios[0] === 1 || endStateRatios[0] === 0)) ){
                     var idx = (allZeros || endStateRatios[0] === 0)? referenceIdx : endStateIdxs[0]; // really just the reference when 0
                     this._currFinalPositionVals = this._states [idx];
                     this._currFinalNormalVals   = this._normals[idx];
                }else{
                    // check there was not a pre-built derived key to assign
                    var derivedIdx = this.getIdxForState(this.getDerivedName(referenceIdx, endStateIdxs, endStateRatios) );
                    if (derivedIdx !== -1){
                        this._currFinalPositionVals = this._states [derivedIdx];
                        this._currFinalNormalVals   = this._normals[derivedIdx];
                    } else{
                        // need to build _currFinalVals, toggling the _lastReusablePosUsed
                        this._lastReusablePosUsed = (this._lastReusablePosUsed === 1) ? 0 : 1;
                        this.buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed], referenceIdx, endStateIdxs, endStateRatios, (<MORPH.Mesh> this._mesh).debug);
                        this._currFinalPositionVals = this._reusablePositionFinals[this._lastReusablePosUsed];
                    
                        // need to build _currFinalNormalVals, toggling the _lastReusableNormUsed
                        this._lastReusableNormUsed = (this._lastReusableNormUsed === 1) ? 0 : 1;
                        this.buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed], this._currFinalPositionVals);
                        this._currFinalNormalVals = this._reusableNormalFinals[this._lastReusableNormUsed];
                    }
                }
            }
        }
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
         * @param {number} referenceIdx - the index into _states[] to use as a reference
         * @param {Array<number>} endStateIdxs - the indexes into _states[] to use as a target
         * @param {Array<number>} endStateRatios - the ratios of the target state to achive, relative to the reference state
         * @param {boolean} log - write console message of action, when true (Default false)
         * 
         */
        private buildPosEndPoint(targetArray : Float32Array, referenceIdx: number, endStateIdxs : Array<number>, endStateRatios : Array<number>, log = false) : void {            
            var refEndState = this._states[referenceIdx];
            var nEndStates = endStateIdxs.length;
            
            // compute each of the new final values of positions
            var deltaToRefState : number;
            var stepDelta : number;
            var j;
            for (var i = 0; i < this._nPosElements; i++){
                deltaToRefState = 0;
                for(j = 0; j < nEndStates; j++){
                    stepDelta = (this._states[endStateIdxs[j]][i] - refEndState[i]) * endStateRatios[j];
                    
                    // reverse sign on appropriate elements of referenceDelta when ratio neg & mirroring
                    if (endStateRatios[j] < 0 && this._mirrorAxis !== (i + 1) % 3){
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
        private buildNormEndPoint(targetArray : Float32Array, endStatePos : Float32Array) : void {
            var mesh = <MORPH.Mesh> this._mesh;
            // build a full, mesh sized, set of positions & populate with the left-over initial data 
            var futurePos = new Float32Array(mesh.originalPositions);
            
            // populate the changes that this state has
            for (var i = 0; i < this._nPosElements; i++){
                futurePos[this._affectedPositionElements[i]] = endStatePos[i];
            }
            
            // compute using method in _mesh
            mesh.normalsforVerticesInPlace(this._affectedVertices, targetArray, futurePos);
        }
        // ==================================== Getters & setters ====================================    
        private getIdxForState(stateName : string) : number{
            for (var i = this._stateNames.length - 1; i >= 0; i--){
                if (this._stateNames[i] === stateName){
                    return i;
                }
            }
            return -1;
        }

        public getName() : string { return this._name; }
        public getNPosElements() : number { return this._nPosElements; }
        public getNStates() : number { return this._stateNames.length; }
        public toString() : string { return 'ShapeKeyGroup: ' + this._name + ', n position elements: ' + this._nPosElements + ',\nStates: ' + this._stateNames; }
       
        public mirrorAxisOnX() : void {this._mirrorAxis = 1;}
        public mirrorAxisOnY() : void {this._mirrorAxis = 2;}
        public mirrorAxisOnZ() : void {this._mirrorAxis = 3;}
    }
}