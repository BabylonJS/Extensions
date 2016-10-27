/// <reference path="./MatrixComp.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>

/// <reference path="../../queue/PovProcessor.ts"/>
module QI{
    export class Bone extends BABYLON.Bone {
        private _alreadyAtTarget : boolean;
        private _restComp : MatrixComp;

        // permanent variable (temporary) values to reduce # of start & end computations, & eliminate garbage generation
        private _startScale = new BABYLON.Vector3(0, 0, 0);
        private _startRotation = new BABYLON.Quaternion();
        private _startTranslation = new BABYLON.Vector3(0, 0, 0);

        private _rel_target : MatrixComp;

        private _resultScale = new BABYLON.Vector3(0, 0, 0);
        private _resultRotation = new BABYLON.Quaternion();
        private _resultTranslation = new BABYLON.Vector3(0, 0, 0);

        private _rotationMatrix = new BABYLON.Matrix();

        /**
         * Argument signature same as that of parent, BABYLON.Bone, except restPose IS NOT optional here.
         */
        constructor(name: string, skeleton: Skeleton, parentBone: Bone, matrix: BABYLON.Matrix, restPose : BABYLON.Matrix) {
            super(name, skeleton, parentBone, matrix, restPose);

            this._restComp = MatrixComp.fromMatrix(restPose);
        }

        /** called by Skeleton.assignPoseLibrary() to compare Basis (Rest) to that of the library, to keep it out of assignPose() */
        public assignPoseLibrary(library : SkeletonPoseLibrary) : void {
            this._restComp.setBasisRatios(library.poses["basis"].targets[this.name]);
        }

        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        /** called by Pose.assignPose(), when bone is potentially changed by the pose (could already be at this setting)
         */
        public _assignPose(targetValue : MatrixComp, immediately?: boolean) : void {
            this._rel_target = this._restComp.getRelativePose(targetValue);

            // decompose the current state (local)
            this.getLocalMatrix().decompose(this._startScale, this._startRotation, this._startTranslation);
            this._alreadyAtTarget = this._rel_target.equals(this._startRotation, this._startTranslation, this._startScale) && !this.getParent();
            if (!this._alreadyAtTarget){
                if (immediately){
                    this._incrementallyDeform(1.0);
                }
            }
        }

        /**
         * Called by Pose._assignPose(), when bone is not even changed by the pose
         */
        public _setAlreadyAtTarget() : void { this._alreadyAtTarget = true; }

        /**
         * Called by this._assignPose() when immediate & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        public _incrementallyDeform(ratioComplete: number): void {
            if (this._alreadyAtTarget) return;

            PovProcessor.LerpToRef (this._startScale      , this._rel_target.scale      , ratioComplete, this._resultScale      );
            PovProcessor.SlerpToRef(this._startRotation   , this._rel_target.rotation   , ratioComplete, this._resultRotation   );
            PovProcessor.LerpToRef (this._startTranslation, this._rel_target.translation, ratioComplete, this._resultTranslation);

            // compose result back into local
            var local = this.getLocalMatrix();
            local.m[ 0] = this._resultScale.x;
            local.m[ 1] = 0;
            local.m[ 2] = 0;
            local.m[ 3] = 0;
            local.m[ 4] = 0;
            local.m[ 5] = this._resultScale.y;
            local.m[ 6] = 0;
            local.m[ 7] = 0;
            local.m[ 8] = 0;
            local.m[ 9] = 0;
            local.m[10] = this._resultScale.z;
            local.m[11] = 0;
            local.m[12] = 0;
            local.m[13] = 0;
            local.m[14] = 0;
            local.m[15] = 1;

            BABYLON.Matrix.IdentityToRef(this._rotationMatrix);
            this._resultRotation.toRotationMatrix(this._rotationMatrix);
            local.multiplyToRef(this._rotationMatrix, local);

            local.setTranslation(this._resultTranslation);

            this.markAsDirty();
        }
    }
}