module QI{
    /**
     * Represents Matrices in their component parts
     */
    export class MatrixComp{
        public static One = new BABYLON.Vector3(1, 1, 1);

        public scale : BABYLON.Vector3;

        // properties written to by setBasisDiffs() for pre-calculation of difference to Basis (Rest)
        public rotationBasisDiff : BABYLON.Quaternion;
        public translationBasisDiff : BABYLON.Vector3;
        public scaleBasisDiff : BABYLON.Vector3;

        // properties written to by setBasisRatios() to compare the Basis (Rest) to that of the Bone in the pose library
        public rotationBasisRatio : BABYLON.Quaternion;
        public translationBasisRatio : BABYLON.Vector3;
        public scaleBasisRatio : BABYLON.Vector3;

        /**
         * The separate components of BABYLON.Matrix
         * @param {BABYLON.Quaternion} rotation
         * @param {BABYLON.Vector3} translation
         * @param {BABYLON.Vector3} scale- optional, set to a static (1, 1, 1) when missing or equates to (1, 1, 1)
         */
        constructor(public rotation : BABYLON.Quaternion, public translation : BABYLON.Vector3, scale? : BABYLON.Vector3) {
            // verify a scale is truly needed, when passed
            this.scale = (scale && MatrixComp.needScale(scale)) ? scale : MatrixComp.One;
        }

        /**
         * Difference of a QI.Pose to the Library's Basis (Rest) pose.  Called for each library Pose, EXCEPT Basis (would be zero anyway)
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        public setBasisDiffs(libraryBasis : MatrixComp) : void {
            this.rotationBasisDiff    = this.rotation   .subtract(libraryBasis.rotation   );
            this.translationBasisDiff = this.translation.subtract(libraryBasis.translation);
            this.scaleBasisDiff       = this.scale      .subtract(libraryBasis.scale      );
        }

        /**
         * The relationship between this (the Basis (Rest) of a bone) to that of the pose library's version of that bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        public setBasisRatios(libraryBasis : MatrixComp) : void {
            // there is no divide for Quaternion, but multiplying by Inverse is equivalent
            this.rotationBasisRatio = this.rotation.multiply(BABYLON.Quaternion.Inverse(libraryBasis.rotation));

            this.translationBasisRatio = BABYLON.Vector3.Zero();
            if (libraryBasis.translation.x !== 0) this.translationBasisRatio.x = this.translation.x / libraryBasis.translation.x;
            if (libraryBasis.translation.y !== 0) this.translationBasisRatio.y = this.translation.y / libraryBasis.translation.y;
            if (libraryBasis.translation.z !== 0) this.translationBasisRatio.z = this.translation.z / libraryBasis.translation.z;

            if (this.scale.equals(MatrixComp.One) && libraryBasis.scale.equals(MatrixComp.One)){
                this.scaleBasisRatio = MatrixComp.One;

            }else{
                this.scaleBasisRatio = BABYLON.Vector3.Zero();
                if (libraryBasis.scale.x !== 0) this.scaleBasisRatio.x = this.scale.x / libraryBasis.scale.x;
                if (libraryBasis.scale.y !== 0) this.scaleBasisRatio.y = this.scale.y / libraryBasis.scale.y;
                if (libraryBasis.scale.z !== 0) this.scaleBasisRatio.z = this.scale.z / libraryBasis.scale.z;
            }
        }

        /**
         * A relative target (rotation / translation / scale) is made by:
         * (Difference of each to their Basis (Rest)) * (Ratios of the Basic of the bone to library) + Basis of the bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryTarget - The value of this bone for a pose in the library.
         */
        public getRelativePose(libraryPose : MatrixComp) : MatrixComp {
            // when there are diffs to Basis, build realative target
            if (libraryPose.rotationBasisDiff) {
                var relRot   = libraryPose.rotationBasisDiff   .multiply(this.rotationBasisRatio   ).add(this.rotation);
                var relTrans = libraryPose.translationBasisDiff.multiply(this.translationBasisRatio).addInPlace(this.translation);
                var retScale = libraryPose.scaleBasisDiff      .multiply(this.scaleBasisRatio      ).addInPlace(this.scale);

                return new MatrixComp(relRot, relTrans, retScale);

            // otherwise target for this bone is basis, so return this
            } else {
                return this;
            }
        }

        /**
         * Recompose the components back into a matrix
         */
        public toMatrix() : BABYLON.Matrix {
            return BABYLON.Matrix.Compose(this.scale ? this.scale : MatrixComp.One, this.rotation, this.translation);
        }

        /**
         * Equals test.
         */
        public equals(rotation : BABYLON.Quaternion, translation : BABYLON.Vector3, scale : BABYLON.Vector3) : boolean {
            if (!this.rotation.equals(rotation)) return false;
            if (!this.translation.equals(translation)) return false;
            if (!this.scale.equals(scale)) return false;
            return true;
        }

        /**
         *
         */
        public static fromMatrix(matrix : BABYLON.Matrix) : MatrixComp {
            var scale = new BABYLON.Vector3(0, 0, 0);
            var rotation = new BABYLON.Quaternion();
            var translation = new BABYLON.Vector3(0, 0, 0);
            matrix.decompose(scale, rotation, translation);

            return new MatrixComp(rotation, translation, scale);
        }

        public static needScale(scale : BABYLON.Vector3) : boolean {
            return Math.abs(1 - scale.x) > 0.0001 ||
                   Math.abs(1 - scale.y) > 0.0001 ||
                   Math.abs(1 - scale.z) > 0.0001;
        }
    }
}