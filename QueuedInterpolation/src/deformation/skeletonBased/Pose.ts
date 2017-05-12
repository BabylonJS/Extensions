/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
module QI{
    export class Pose{
        public isSubPose : boolean;
        public targets : { [boneName: string] : MatrixComp};
        /**
         * @immutable, to be reused across skeletons
         * This is instanced by computer generated code.
         * @param {string} name- The name of the pose given in the Blender skeleton library.  A sub-pose is
         *                 detected by having a '.sp' as part of the name, typically a suffix.
         *
         * @param {SkeletonPoseLibrary} library- The instance of the QI.SkeletonPoseLibrary to add itself to
         * @param {[boneName: string] : BABYLON.Matrix} targets - A dictionary of matrices of the bones that
         *                                              particpate in this pose.
         */
        constructor (public name : string, public library : SkeletonPoseLibrary, targets : { [boneName: string] : BABYLON.Matrix} ) {
            this.targets = {};
            for (var boneName in targets) {
                this.targets[boneName] = MatrixComp.fromMatrix(targets[boneName]);
            }

           // library would like to know is this is a sub-pose, so determine before adding
           this.isSubPose = name.indexOf(".sp") != -1;
           this.library._addPose(this);
 
            if (this.isSubPose && Object.keys(this.targets).length === library.nBones){
                BABYLON.Tools.Error("QI.Pose:  sub-pose(" + this.name + "), must have fewer bones than found in library(" + library.name + ")");
                return;
            }

            if (name !== "basis"){
                var basis = this.library.poses["basis"].targets;
                for (var boneName in basis) {
                    // add back any targets from basis pose in library, which are missing; except root bone or sub-poses
                    if (boneName === this.library.nameOfRoot) continue;
                    if (!this.targets[boneName]){
                        if (!this.isSubPose){
                            this.targets[boneName] = basis[boneName];
                        }
                    }else{
                        // get the ratio of the Basis (Rest) pose
                        this.targets[boneName].setBasisDiffs(basis[boneName]);
                        if (name === "sitting2"){ // remove
                            console.log(boneName + ": " + this.targets[boneName].rotationBasisDiff.toString());
                        }
                    }
                }
            }

            // freeze everything to make immutable
            for (var boneName in this.targets) {
                var target = this.targets[boneName];
                // Object.freeze(target.m); you cannot freeze Typed Arrays
                Object.freeze(target);
            }
            Object.freeze(this);
        }

        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        public _assignPose(skeleton : Skeleton, immediately? : boolean) : void {
            // merge the bone targets of any skeleton sub-poses, if they exist
            var targets = (skeleton._subPoses.length > 0) ? this._mergeSubPoses(skeleton._subPoses) : this.targets;

            for(var i = 0, len = skeleton.bones.length; i < len; i++){
                var bone = <QI.Bone> skeleton.bones[i];
                var target = targets[bone.name];

                if (target){
                    bone._assignPose(target, immediately);
                }
                else bone._setAlreadyAtTarget();
            }
        }

        private _mergeSubPoses(subPoses : Pose[]) : { [boneName: string] : MatrixComp}{
            var targets : { [boneName: string] : MatrixComp} = {};
            for (var boneName in this.targets) {
                targets[boneName] = this.targets[boneName];
            }

            // subPoses applied second, which will over write bone targets from this pose
            for(var i = 0, len = subPoses.length; i < len; i++){
                for (var boneName in subPoses[i].targets) {
                    targets[boneName] = subPoses[i].targets[boneName];
                }
            }
            return targets;
        }
    }
}