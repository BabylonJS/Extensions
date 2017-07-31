/// <reference path="./Pose.ts"/>

/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
module QI{
   /**
    * Class to store Deformation info & evaluate how complete it should be.
    */
    export class PoseEvent extends MotionEvent{
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
        constructor(
            public poseName       : string,
            milliDuration         : number,
            movePOV               : BABYLON.Vector3 = null,
            rotatePOV             : BABYLON.Vector3 = null,
            options?              : IMotionEventOptions)
        {
            super(milliDuration, movePOV, rotatePOV, options);
            this._groupName = PoseProcessor.INTERPOLATOR_GROUP_NAME;
        }
        // ==================================== Getters & setters ====================================
        public toString() : string {
            var ret =  super.toString();
            ret += ", Pose- " + this.poseName + ", ";
            if (this.options.subposes && this.options.subposes.length > 0) {
                ret += "Subposes- [";
                for(var i = 0, len = this.options.subposes.length; i < len; i++) {
                    ret += " " + this.options.subposes[i];
                }
                ret += "], revertSubposes- " + this.options.revertSubposes + ", ";
            }
            return ret;
        }
        
        protected _toScriptCustomArgs() : string {
            return "\"" + this.poseName + "\"";
        }
        
        public getClassName(): string { return "PoseEvent"; } 
    }
}