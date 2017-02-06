/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Pose.ts"/>
module QI{
    /**
     * Instances of this class are computer generated code from Tower of Babel.  A library contains all the
     * poses designed for a skeleton.
     */
    export class SkeletonPoseLibrary {
        private static _libraries : { [name : string] : SkeletonPoseLibrary} = {};
        public static getLibraryByName(name : string) : SkeletonPoseLibrary {
            return SkeletonPoseLibrary._libraries[name];
        }

        /**
         * Called in generated code.  If more than one library is exported with the same name, then
         * an attempt will be made to append the poses to the first reference encountered.
         */
        public static createLibrary(name: string, dimensionsAtRest : BABYLON.Vector3, nameOfRoot : string, boneLengths : { [boneName: string] : number }) : SkeletonPoseLibrary {
            var alreadyCreated = SkeletonPoseLibrary._libraries[name];
            if (alreadyCreated){
                // validate # of bones & lengths match
                if (Object.keys(boneLengths).length !== alreadyCreated.nBones){
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  library(" + name + ") already created; # of has Bones mis-match; " + Object.keys(boneLengths).length + ", but " + alreadyCreated.nBones + " already");
                    return null;
                }

                // with # of bones the same, can just iterate thru lengths to check for match
                for (var boneName in boneLengths) {
                    if (!alreadyCreated.boneLengths[boneName]){
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") not found in library already created");
                        return null;
                    }
                    if (alreadyCreated.boneLengths[boneName] !== boneLengths[boneName]){
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") length mis-match in library already created");
                        return null;
                    }
                }
                return alreadyCreated;

            } else return new SkeletonPoseLibrary(name, dimensionsAtRest, nameOfRoot, boneLengths);
        }

        public poses : { [name : string] : Pose} = {};
        public nBones : number;

        /**
         * Non exported constructor, called by SkeletonPoseLibrary.createLibrary().
         */
        constructor(public name: string, public dimensionsAtRest : BABYLON.Vector3, public nameOfRoot : string, public boneLengths : { [boneName: string] : number }) {
            Object.freeze(this.boneLengths); // should never change

            this.nBones = Object.keys(this.boneLengths).length;
            Object.freeze(this.nBones); // should never change

            SkeletonPoseLibrary._libraries[this.name] = this;
        }

        /**
         * Add the pose supplied by the argument.  Called by the Pose's constructor, which
         * is passed the library as a constructor arg in the generated code.
         */
        public _addPose(pose : Pose) : void {
            // ensure not already added
            if (this.poses[pose.name]){
                BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has already been added in library(" + this.name + ")");
                return;
            }
            // verify bones match; pose does not have to have all bones though
            for (var boneName in pose.targets) {
                if (!this.boneLengths[boneName]){
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has Bone(" + boneName + ") not found in library(" + this.name + ")");
                    return;
                }
            }
            this.poses[pose.name] = pose;
            if (pose.isSubPose)  BABYLON.Tools.Log("QI.SkeletonPoseLibrary:  added sub-pose (" + this.name + "." + pose.name + "), using " + Object.keys(pose.targets).length + " bones");
            else BABYLON.Tools.Log("QI.SkeletonPoseLibrary:  added pose (" + this.name + "." + pose.name + ")");
        }

        /**
         * @returns {string[]} the names of all poses, subposes with the '.sp' removed; primarily for UI
         */
        public getPoses(subPoses : boolean) : string[] {
            var ret = new Array<string>();
            for (var poseName in this.poses) {
                if (this.poses[poseName].isSubPose && subPoses) {
                    ret.push(poseName.replace(".sp", ""));
                }
                else if (!this.poses[poseName].isSubPose && !subPoses) {
                    ret.push(poseName);
                }
            }
            return ret;
        }

        /**
         * add a derived pose from the arguments
         * @param {Array} endPoseNames - Names of the end poses to be based on
         * @param {Array} endStateRatios - values of greater than 0 to 1
         * @param {String} newPoseName - The name of the new pose.  Not checking that has .sp.  Will just fail in Pose constructor
         */
/*        public addCompositePose(endPoseNames : Array<string>, endStateRatios : Array<number>, newPoseName : string) : void {
            // test if pose already exists, then leave
            if (this.poses[newPoseName]) return;

            var nEndStates = endStateRatios.length;
            if (endPoseNames.length !== nEndStates){
                BABYLON.Tools.Error("QI.SkeletonPoseLibrary: number of endPoseNames & endStateRatios does not match");
                return;
            }

            for (var i = 0; i < endPoseNames.length; i++){
                if (!this.poses[endPoseNames[i]]) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary: invalid end pose name: " + endPoseNames[i]);
                    return;
                }
                if (endStateRatios[i] <= 0 || endStateRatios[i] > 1) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary: invalid end state: " + endStateRatios[i]);
                    return;
                }
            }

            var deltaToBasisState : BABYLON.Matrix;
            var stepDelta : BABYLON.Matrix;
            var targets : { [boneName: string] : BABYLON.Matrix} = {};

            for (var boneName in this.boneLengths) {
                var basis = this.poses["basis"].targets[boneName];
                deltaToBasisState = new BABYLON.Matrix();

                for(var i = 0; i < nEndStates; i++){
                    var source = this.poses[endPoseNames[i]].targets[boneName];
                    if (!source) continue; // could be a sub-pose, where not all bones are present (remember missing bones of regular poses are set to basis in constructor)

                    for (var j = 0; j < 16; j++){
                        deltaToBasisState.m[j] += (source.m[j] - basis.m[j]) * endStateRatios[i];
                    }
                }
                targets[boneName] = deltaToBasisState.addToSelf(basis);
            }
            new Pose(newPoseName, this, targets);
        }*/
   }
}