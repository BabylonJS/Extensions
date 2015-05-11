module MORPH{
   /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    export class ReferenceDeformation extends POV.MotionEvent{
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
        constructor(
            public  shapeKeyGroupName   : string, 
            private _referenceStateName : string, 
            private _endStateNames      : Array<string>, 
            _milliDuration              : number, 
            _millisBefore               : number = 0, 
            private _endStateRatios     : Array<number> = null, 
            movePOV                     : BABYLON.Vector3 = null, 
            rotatePOV                   : BABYLON.Vector3 = null,  
            _pace                       : POV.Pace = POV.Pace.LINEAR)
        {
            super(_milliDuration, _millisBefore, movePOV, rotatePOV, _pace);
            if (!(this._endStateNames instanceof Array) || (this._endStateRatios !== null && !(this._endStateRatios instanceof Array))) 
                BABYLON.Tools.Error("ReferenceDeformation: end states / ratios not an array");

            var nEndStates = this._endStateNames.length;
            if (this._endStateRatios !== null){
                if (this._endStateRatios.length !== nEndStates) BABYLON.Tools.Error("ReferenceDeformation: end states / ratios not same length");                
            }
                        
            // mixed case group & state names not supported
            this.shapeKeyGroupName   = this.shapeKeyGroupName  .toUpperCase(); 
            this._referenceStateName = this._referenceStateName.toUpperCase();
            
            for (var i = 0; i < nEndStates; i++){
                this._endStateNames[i] = this._endStateNames[i].toUpperCase();
                if (this._referenceStateName === this._endStateNames[i]) BABYLON.Tools.Error("ReferenceDeformation: reference state cannot be the same as the end state");
                if (this._endStateRatios !== null && (this._endStateRatios[i] < -1 || this._endStateRatios[i] > 1) ) BABYLON.Tools.Error("ReferenceDeformation: endStateRatio range  > -1 and < 1");
            }
        }
        // ==================================== Getters & setters ====================================    
        public getReferenceStateName() : string { return this._referenceStateName; }     
        public getEndStateName(idx : number) : string { return this._endStateNames[idx]; }     
        public getEndStateNames() : Array<string> { return this._endStateNames; }     
        public getEndStateRatio(idx : number) :number {return this._endStateRatios[idx]; }
        public getEndStateRatios() : Array<number> {return this._endStateRatios; }
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of ReferenceDeformation, where the referenceStateName is Fixed to "BASIS"
     */ 
    export class Deformation extends ReferenceDeformation{
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
        constructor(shapeKeyGroupName : string, endStateName : string, milliDuration : number, millisBefore : number, endStateRatio : number, movePOV : BABYLON.Vector3 = null, rotatePOV : BABYLON.Vector3 = null, pace = POV.Pace.LINEAR){
            super(shapeKeyGroupName, "BASIS", [endStateName], milliDuration, millisBefore, [endStateRatio], movePOV, rotatePOV, pace);
        }   
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of ReferenceDeformation, where defaulting to null for endStateRatios, thus signalling no deforming
     * POV movement & rotation still possible though
     */ 
    export class DeformStall extends ReferenceDeformation{
        /**
         * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         */
        constructor(shapeKeyGroupName : string, milliDuration : number, movePOV : BABYLON.Vector3 = null, rotatePOV : BABYLON.Vector3 = null){
            super(shapeKeyGroupName, "BASIS", [], milliDuration, 0,  null,  movePOV, rotatePOV);
        }   
    }
}