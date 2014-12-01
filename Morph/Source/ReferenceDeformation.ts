/// <reference path="./Mesh.ts"/>
/// <reference path="./Pace.ts"/>
module MORPH{
   /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    export class ReferenceDeformation {
        private _syncPartner : ReferenceDeformation; // not part of constructor, since cannot be in both partners constructors, use setSyncPartner()

        // time and state management members
        private _startTime = -1;
        private _currentDurationRatio = ReferenceDeformation._COMPLETE;
        
        // wallclock prorating members, used for acceleration / deceleration across AutomaonEventSeries runs
        private _proratedMilliDuration : number;
        private _proratedMillisBefore : number;

        /**
         * @param {string} shapeKeyGroupName -  Used by MORPH.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array} endStateNames - Names of state keys to deform to
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {number} millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
         * @param {Array} endStateRatios - ratios of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1's)
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null)
         *                  right-up-forward
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null)
         *                  flipBack-twirlClockwise-tiltRight
         * @param {Pace} pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
         */
        constructor(
            public  shapeKeyGroupName   : string, 
            private _referenceStateName : string, 
            private _endStateNames      : Array<string>, 
            private _milliDuration      : number, 
            private _millisBefore       : number = 0, 
            private _endStateRatios     : Array<number> = null, 
            public  movePOV             : BABYLON.Vector3 = null, 
            public  rotatePOV           : BABYLON.Vector3 = null,  
            private _pace               : Pace = Pace.LINEAR)
        {
            // argument validations
            if (this._milliDuration <= 0) throw "ReferenceDeformation: milliDuration must > 0";
            if (this._millisBefore < 0) throw "ReferenceDeformation: millisBefore cannot be negative";
            if (!(this._endStateNames instanceof Array) || (this._endStateRatios !== null && !(this._endStateRatios instanceof Array))) throw "ReferenceDeformation: end states / ratios not an array";

            var nEndStates = this._endStateNames.length;
            if (this._endStateRatios !== null){
                if (this._endStateRatios.length !== nEndStates) throw "ReferenceDeformation: end states / ratios not same length";
                
            }
                        
            // mixed case group & state names not supported
            this.shapeKeyGroupName   = this.shapeKeyGroupName  .toUpperCase(); 
            this._referenceStateName = this._referenceStateName.toUpperCase();
            
            for (var i = 0; i < nEndStates; i++){
                this._endStateNames[i] = this._endStateNames[i].toUpperCase();
                if (this._referenceStateName === this._endStateNames[i]) throw "ReferenceDeformation: reference state cannot be the same as the end state";
                if (this._endStateRatios !== null && (this._endStateRatios[i] < -1 || this._endStateRatios[i] > 1) ) throw "ReferenceDeformation: endStateRatio range  > -1 and < 1";
            }
            
            this.setProratedWallClocks(1); // ensure values actually used for timings are initialized
        }
        // =================================== run time processing ===================================    
        /**
         * Indicate readiness by caller to start processing event.  
         * @param {number} lateStartMilli - indication of how far behind already 
         */
        public activate(lateStartMilli = 0) : void {
            this._startTime = Mesh.now();
            if (lateStartMilli > 0){
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner) ? ReferenceDeformation._BLOCKED : 
                                         ((this._proratedMillisBefore > 0) ? ReferenceDeformation._WAITING : ReferenceDeformation._READY);
        }
    
        /** called by ShapeKeyGroup.incrementallyDeform() to determine how much of the deformation should be performed right now */
        public getCompletionMilestone() : number {
            if (this._currentDurationRatio === ReferenceDeformation._COMPLETE){
                return ReferenceDeformation._COMPLETE;
            }

            // BLOCK only occurs when there is a sync partner
            if (this._currentDurationRatio === ReferenceDeformation._BLOCKED){                
                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner.isBlocked() ){
                    this._startTime = Mesh.now(); // reset the start clock
                    this._currentDurationRatio = ReferenceDeformation._WAITING;
                    this._syncPartner.syncReady(this._startTime);
                }
                else return ReferenceDeformation._BLOCKED;
            }
        
            var millisSoFar = Mesh.now() - this._startTime;
        
            if (this._currentDurationRatio === ReferenceDeformation._WAITING){
                millisSoFar -= this._proratedMillisBefore;
                if (millisSoFar >= 0){
                    this._startTime = Mesh.now() - millisSoFar;  // prorate start for time served   
                }
                else return ReferenceDeformation._WAITING;
            }
        
            this._currentDurationRatio = millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > ReferenceDeformation._COMPLETE)
                this._currentDurationRatio = ReferenceDeformation._COMPLETE;
        
            return this._pace.getCompletionMilestone(this._currentDurationRatio);
        }
       
        /** support game pausing / resuming.  There is no need to actively pause a Deformation. */
        public resumePlay() : void {
            if (this._currentDurationRatio === ReferenceDeformation._COMPLETE ||
                this._currentDurationRatio === ReferenceDeformation._BLOCKED  ||
                this._currentDurationRatio === ReferenceDeformation._COMPLETE) return;
            
            // back into a start time which reflects the currentDurationRatio
            this._startTime = Mesh.now() - (this._proratedMilliDuration * this._currentDurationRatio);            
        }
        // =================================== sync partner methods ===================================    
        /**
         * @param {Deformation} syncPartner - Deformation which should start at the same time as this one.  MUST be in a different shape key group!
         */
        public setSyncPartner(syncPartner : ReferenceDeformation) : void{
            this._syncPartner = syncPartner;            
        }
        /** 
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  Only intended to be called from getCompletionMilestone() of the partner.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        public syncReady(startTime : number) : void{
            this._startTime = startTime;
            this._currentDurationRatio = ReferenceDeformation._WAITING;
        }
        // ==================================== Getters & setters ====================================    
        public isBlocked () : boolean { return this._currentDurationRatio === ReferenceDeformation._BLOCKED ; }
        public isComplete() : boolean { return this._currentDurationRatio === ReferenceDeformation._COMPLETE; }
       
        public getReferenceStateName() : string { return this._referenceStateName; }     
        public getEndStateName(idx : number) : string { return this._endStateNames[idx]; }     
        public getEndStateNames() : Array<string> { return this._endStateNames; }     
        public getMilliDuration() : number { return this._milliDuration; }      
        public getMillisBefore() : number { return this._millisBefore; }     
        public getEndStateRatio(idx : number) :number {return this._endStateRatios[idx]; }
        public getEndStateRatios() : Array<number> {return this._endStateRatios; }
        public getPace() : Pace {return this._pace; }
        public getSyncPartner() : ReferenceDeformation{return this._syncPartner; }
       
        /**
         * Called by the Event Series, before Deformation is passed to the ShapeKeyGroup.  This
         * is to support acceleration / deceleration across event series repeats.
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         */
        public setProratedWallClocks(factor : number) : void {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = this._millisBefore * factor;
        }
        // ========================================== Enums  =========================================    
        private static _BLOCKED  = -20;
        private static _WAITING  = -10;
        private static _READY    =   0;
        private static _COMPLETE =   1;

        public static get BLOCKED (): number { return ReferenceDeformation._BLOCKED ; }
        public static get WAITING (): number { return ReferenceDeformation._WAITING ; }
        public static get READY   (): number { return ReferenceDeformation._READY   ; }
        public static get COMPLETE(): number { return ReferenceDeformation._COMPLETE; }
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
        constructor(shapeKeyGroupName : string, endStateName : string, milliDuration : number, millisBefore : number, endStateRatio : number, movePOV : BABYLON.Vector3, rotatePOV : BABYLON.Vector3, pace : Pace){
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
        constructor(shapeKeyGroupName : string, milliDuration : number, movePOV : BABYLON.Vector3, rotatePOV : BABYLON.Vector3){
            super(shapeKeyGroupName, "BASIS", [], milliDuration, 0,  null,  movePOV, rotatePOV);
        }   
    }
}