/// <reference path="./Pose.ts"/>
/// <reference path="./PoseEvent.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>

/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/EventSeries.ts"/>
module QI{
    export class PoseProcessor extends PovProcessor {
        public static INTERPOLATOR_GROUP_NAME = "SKELETON";
        private _bones : Array<Bone>;
        public _lastPoseRun : string = "basis"; // only public for Pose

        constructor(private _skeleton : Skeleton, parentMesh : BABYLON.Mesh, skipRegistration : boolean){
            super(parentMesh, skipRegistration);
            this._name = PoseProcessor.INTERPOLATOR_GROUP_NAME; // override dummy
            var nBones = this._skeleton.bones.length;

            this._skeleton.validateSkeleton();
        }
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * SkeletonInterpolator is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         */
        public incrementallyDeform(): boolean {
            super._incrementallyMove();

            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a SkeletalDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof PoseEvent) ) return false;

            this._lastPoseRun = (<PoseEvent> this._currentStepInSeries).poseName;

            if (this._ratioComplete < 0) return false; // MotionEvent.BLOCKED or MotionEvent.WAITING

            for(var i = 0, nBones = this._skeleton.bones.length; i < nBones; i++){
                (<Array<Bone>>this._skeleton.bones)[i]._incrementallyDeform(this._ratioComplete);
            }
            return true;
        }

        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        public getLastPoseNameQueuedOrRun() : string {
            // check the queue first for the last pose set to run
            var lastPose : any;
            for (var i = this._queue.length - 1; i >= 0; i--){
                lastPose = this._getLastPoseEventInSeries(this._queue[i]);
                if (lastPose) return lastPose;
            }

            // queue could be empty, return last of current series if exists
            if (this._currentSeries){
                lastPose = this._getLastPoseEventInSeries(this._currentSeries);
                if (lastPose) return lastPose;
            }

            // nothing running or queued; return last recorded
            return this._lastPoseRun;
        }

        private _getLastPoseEventInSeries(series : EventSeries) : string {
            var events = series._events;
            for (var i = events.length - 1; i >= 0; i--){
                if (events[i] instanceof PoseEvent) return (<PoseEvent> events[i]).poseName;
            }
            return null;
        }
        // ======================================== event prep =======================================
        /** called by super._incrementallyMove()
         */
        public _nextEvent(event : MotionEvent) : void {
            var movementScaling : number;

            // is possible to have a MotionEvent(with no deformation), not SkeletalDeformation sub-class
            if (event instanceof PoseEvent){
                var poseEvent = <PoseEvent> event;
                var pose = this._skeleton._poseLibrary.poses[poseEvent.poseName];
                if (pose){
                    // sub-pose addition / substraction
                    if (poseEvent.options.subposes){
                        for(var i = 0, len = poseEvent.options.subposes.length; i < len; i++){
                            if (poseEvent.options.revertSubposes) this._skeleton.removeSubPose(poseEvent.options.subposes[i]);
                            else this._skeleton.addSubPose(poseEvent.options.subposes[i]);
                        }
                    }
                    pose._assignPose(this._skeleton);

                } else if (poseEvent.poseName !== null) {
                    BABYLON.Tools.Error("PoseProcessor:  pose(" + poseEvent.poseName + ") not found");
                    return;
                }
            }
            super._nextEvent(event, this._skeleton._skelDimensionsRatio);
         }
    }
}