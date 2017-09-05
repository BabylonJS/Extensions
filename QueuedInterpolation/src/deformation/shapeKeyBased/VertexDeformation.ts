/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
module QI{
   /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    export class VertexDeformation extends MotionEvent {
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
        constructor(
            groupName                   : string,
            private _referenceStateName : string,
            protected _endStateNames    : string[],
            protected _endStateRatios   : Array<number> = null,

            // args from super
            milliDuration               : number,
            movePOV                     : BABYLON.Vector3 = null,
            rotatePOV                   : BABYLON.Vector3 = null,
            options?                    : IMotionEventOptions)
        {
            super(milliDuration, movePOV, rotatePOV, options);

            if (!(this._endStateNames instanceof Array) || (this._endStateRatios !== null && !(this._endStateRatios instanceof Array))) {
                BABYLON.Tools.Error("VertexDeformation: end states / ratios not an array");
                return;
            }
            var nEndStates = this._endStateNames.length;
            if (this._endStateRatios !== null){
                if (this._endStateRatios.length !== nEndStates){
                    BABYLON.Tools.Error("VertexDeformation: end states / ratios not same length");
                    return;
                }
            }

            // mixed case group & state names not supported
            this._groupName = groupName.toUpperCase();
            this._referenceStateName = this._referenceStateName.toUpperCase();

            // skip remaining test when is BasisReturn
            if (this instanceof BasisReturn) return;

            for (var i = 0; i < nEndStates; i++) {
                this._endStateNames[i] = this._endStateNames[i].toUpperCase();
                if (this._referenceStateName === this._endStateNames[i]) {
                    BABYLON.Tools.Error("VertexDeformation: reference state cannot be the same as the end state");
                    return;
                }
            }
        }
        // ==================================== Getters & setters ====================================
        public getReferenceStateName() : string { return this._referenceStateName; }
        public getEndStateName(idx : number) : string { return this._endStateNames[idx]; }
        public getEndStateNames() : Array<string> { return this._endStateNames; }
        public getEndStateRatio(idx : number) :number {return this._endStateRatios[idx]; }
        public getEndStateRatios() : Array<number> {return this._endStateRatios; }
        
        protected _toScriptCustomArgs() : string {
            var names = "";
            var ratios = "";
            for(var i = 0, len = this._endStateNames.length; i < len; i++) {
                if (i > 0) { names += ", "; ratios += ", "; }
                names += "\"" + this._endStateNames[i] + "\"";
                ratios += this._endStateRatios[i];
            }
            
            return "\"" + this._groupName + "\", \"" + this._referenceStateName + "\", [" + names + "], [" + ratios + "]";
        }

        /**
         * This returns a script to request a combined derived keys.
         * @param {string} groupVarName - This is the shapekey group on which to do the combining.
         */
        public toDerivedKeyScript(groupVarName) : string {
            var names = "";
            var ratios = "";
            for(var i = 0, len = this._endStateNames.length; i < len; i++) {
                if (i > 0) { names += ", "; ratios += ", "; }
                names += "\"" + this._endStateNames[i] + "\"";
                ratios += this._endStateRatios[i];
            }
            var mirrorAxes = this.options.mirrorAxes ? "\"" + this.options.mirrorAxes + "\"" : "null";
            return groupVarName + ".addComboDerivedKey(\"" + this._referenceStateName + "\", [" + names + "], [" + ratios + "], " + mirrorAxes + ");";
        }

        public getClassName(): string { return "VertexDeformation"; } 
        public toString() : string {
            var ret = super.toString();
            ret + ", reference state: " + this._referenceStateName;
                for(var i = 0, len = this._endStateNames.length; i < len; i++) {
                    ret += ", [ " + this._endStateNames[i] + " @ " + this._endStateRatios[i] + "]";
                }

            return ret;
        }
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of VertexDeformation, where the referenceStateName is Fixed to "BASIS" & only one end state involved
     */
    export class Deformation extends VertexDeformation {
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
        constructor(
            groupName     : string,
            endStateName  : string,
            endStateRatio : number,

            // args from super
            milliDuration : number,
            movePOV       : BABYLON.Vector3 = null,
            rotatePOV     : BABYLON.Vector3 = null,
            options?      : IMotionEventOptions){
            super(groupName, "BASIS", [endStateName], [endStateRatio], milliDuration, movePOV, rotatePOV, options);
        }
        
        protected _toScriptCustomArgs() : string {
            return "\"" + this._groupName + "\", \"" + this._endStateNames[0] + "\", " + this._endStateRatios[0];
        }
        
        public getClassName(): string { return "Deformation"; } 
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to immediately attain a shape.  To be truly immediate you should call
     * deformImmediately() on the mesh.  This is a convenience method for performing it on a queue.
     *
     * If you specify a sound, then it will not perform event until sound is ready.  Same if millisBefore
     * is specified.
     */
    export class MorphImmediate extends Deformation {
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
        constructor(
            groupName     : string,
            endStateName  : string,
            endStateRatio : number = 1,
            options?      : IMotionEventOptions){
            super(groupName, endStateName, endStateRatio, 0.01, null, null, options);
        }
        
        /** override when millis, move, or rotate not needed */
        public toScript() : string {
            return this._toScriptImpl(false, false, false);
        }
        
        protected _toScriptCustomArgs() : string {
            var names = "";
            var ratios = "";
            for(var i = 0, len = this._endStateNames.length; i < len; i++) {
                if (i > 0) { names += ", "; ratios += ", "; }
                names += "\"" + this._endStateNames[i];
                ratios += this._endStateRatios[i];
            }
            
            return "\"" + this._groupName + "\", \"" + this._endStateNames[0] + "\", " + this._endStateRatios[0];
        }

        public getClassName(): string { return "MorphImmediate"; } 
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to return to the basis state
     */
    export class BasisReturn extends Deformation {
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
        constructor(
            groupName     : string,

            // args from super
            milliDuration : number,
            movePOV       : BABYLON.Vector3 = null,
            rotatePOV     : BABYLON.Vector3 = null,
            options?      : IMotionEventOptions){
            super(groupName, "BASIS", 1, milliDuration, movePOV, rotatePOV, options);
        }
        
        protected _toScriptCustomArgs() : string {
            return "\"" + this._groupName + "\"";
        }

        public getClassName(): string { return "BasisReturn"; } 
   }
}