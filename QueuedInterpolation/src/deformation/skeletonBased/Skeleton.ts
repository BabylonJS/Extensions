/// <reference path="./Bone.ts"/>
/// <reference path="./Pose.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>

module QI{
    export class Skeleton extends BABYLON.Skeleton{
        public _subPoses = new Array<Pose>();
        public _poseLibrary : SkeletonPoseLibrary;

        public _skelDimensionsRatio : BABYLON.Vector3; // public for poseProcessor, so it can pass to super._nextEvent

        // no constructor required, using super's

        /** called by the PoseProcessor constructor; all bones should have been added by now */
        public validateSkeleton() : boolean {
            var nBones = this.bones.length;
            var nRootBones = 0;

            for(var i = 0; i < nBones; i++){
                var bone = this.bones[i];
                if (!bone.getParent()) nRootBones++;

                // verify only one root & all bones instance of QI.Bone
                if (!(bone instanceof Bone) ){
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", Bone(" + bone.name + ") is not a QI.Bone");
                    return false;
                }
            }
            if (nRootBones !== 1){
                BABYLON.Tools.Error("QI.Skeleton:  " + this.name + " has more than 1 bone without a parent");
                return false;
            }
            return true;
        }
        // =================================== Library assignment ====================================
        /** Only one library can be assigned to a library at a time.
         *  Validation of compatiblity, and pre-processing for scaling differences performed.
         *  No effect, if already assigned to that library.
         *  @param {string} libraryName - name of the library to assign; no effect if already assigned
         */
        public assignPoseLibrary(libraryName : string) : void {
            if (this._poseLibrary && this._poseLibrary.name === libraryName) return;

            var library =  SkeletonPoseLibrary.getLibraryByName(libraryName);
            if (!library){
                BABYLON.Tools.Error("QI.Skeleton:  library(" + libraryName + ") not found");

            }else if (this._validateLibraryForSkeleton(library)){
                this._poseLibrary = library;
                this.clearAllSubPoses();

                // scaling pre-processing
                this._skelDimensionsRatio = this.dimensionsAtRest.divide(this._poseLibrary.dimensionsAtRest);

                // test if dimensions all the same, if so better performance setting to null
                if (this._skelDimensionsRatio.x === 1 && this._skelDimensionsRatio.y === 1 && this._skelDimensionsRatio.z === 1){
                    this._skelDimensionsRatio = null;
                }
                for (var i = 0, len = this.bones.length; i < len; i++){
                    (<QI.Bone> this.bones[i]).assignPoseLibrary(this._poseLibrary);
                }
            }
        }

        /** Method which does the validation that this library is compatible
         *  @param {SkeletonPoseLibrary} library - The candidate library
         *  @returns {boolean} - True when valid
         */
        private _validateLibraryForSkeleton(library : SkeletonPoseLibrary) : boolean {
            var nBones = this.bones.length;
            if (Object.keys(library.boneLengths).length !== nBones){
                BABYLON.Tools.Error("QI.Skeleton:  library(" + library.name + ") has incorrect # of bones; " + nBones + " in skeleton " + library.nBones + " in library");
                return false;
            }

            // verify bone matches one in library
            for(var i = 0; i < nBones; i++){
                var bone = this.bones[i];

                if (!library.boneLengths[bone.name]){
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", has Bone(" + bone.name + ") not found in library");
                    return false;
                }
            }
            return true;
        }
        // ====================================== pose methods =====================================
        /**
         * Should not be call here, but through the mesh so that the processor can note the change.
         * @param {string} poseName - The name in the library of the pose.
         */
        public _assignPoseImmediately(poseName : string) : void {
            var pose = this._poseLibrary.poses[poseName];
            if (pose){
                pose._assignPose(this, true);

            } else {
                BABYLON.Tools.Error("QI.Skeleton:  pose(" + poseName + ") not found");
            }
        }
        /**
         * Derive the current state of the skeleton as a new Pose in the library.
         * @param {string} name - What the new Pose is to be called.
         * @returns {Pose} The new Pose Object
         */
        public currentStateAsPose(name : string) : Pose {
            var basis = this._poseLibrary.poses["basis"];

            var targets : { [boneName: string] : BABYLON.Matrix} = {};
            for(var i = 0, nBones = this.bones.length; i < nBones; i++){
                targets[this.bones[i].name] = this.bones[i].getLocalMatrix().clone();
            }
            return new Pose(name, this._poseLibrary, targets);
        }
        // ==================================== sub-pose methods ===================================
        /** 
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */
        public addSubPose(poseName : string) : void {
            // check sub-pose has not already been added
            for(var i = 0, len = this._subPoses.length; i < len; i++){
                if (this._subPoses[i].name === poseName) return;
            }

            var subPose = this._poseLibrary ? this._poseLibrary.poses[poseName] : null;
            if (!subPose) BABYLON.Tools.Error("QI.Skeleton:  sub-pose(" + poseName + ") not found");
            else if (!subPose.isSubPose ) BABYLON.Tools.Error("QI.Skeleton:  pose(" + subPose.name + ") is not a sub-pose");
            else this._subPoses.push(subPose);
        }

        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */ 
        public removeSubPose(poseName : string) : void {
            for (var i = 0; i < this._subPoses.length; i++){
                if (this._subPoses[i].name === poseName){
                    this._subPoses.splice(i, 1);
                    return;
                }
            }
        }

        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        public clearAllSubPoses() : void {
             this._subPoses = new Array<Pose>();
        }
    }
}