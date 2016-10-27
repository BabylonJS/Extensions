module BEING{
    /** class for a single eye.  2 Eye Classes are "controlled" in tandem by calling the public methods of this class.
     *
     * Movement up / down left right are controlled by POV rotation. EyeBalls are not inheriting from QI.Mesh, since no shape keys.
     * Just add a pov processor, which registers itself.
     *
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     *
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles paritioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     *
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    export class EyeBall extends BABYLON.Mesh {

        private static _FOLLOW_MODE_SET_BACK = 0.15;
        private static _RANDOM_MODE_SET_BACK = 0.10;

        private _povProcessor : QI.PovProcessor;
        private _pupilSize = 0.5;
        private _originalPositionZ : number;

        /**
         * @constructor - Args same As BABYLON.Mesh
         * @param {string} name - The value used by scene.getMeshByName().  Must end in either '_L' or '_R'.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The head / body, so eye stays in head as parent moves
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.Mesh, doNotCloneChildren?: boolean) {
            super(name, scene, parent, source, doNotCloneChildren);
            this._povProcessor = new QI.PovProcessor(this, false);
        }

        /** @override */
        public dispose(doNotRecurse?: boolean) : void {
            super.dispose(doNotRecurse);
            this._povProcessor.dispose();
        }

        /**
         * @param {QI.MotionEvent} amt - Only the rotation component may be specified.  movePOV MUST be null.
         */
        public queueRotation(amt : QI.MotionEvent, postEventFunc?: () => void) : void {
            // do not call setFollowMode(), since it clears the queue
            this.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE;

            var deformations : Array<any> = [amt];
            if (postEventFunc) deformations.push(postEventFunc);
            var series = new QI.EventSeries(deformations);
//            series._debug = true;
            this._povProcessor.queueEventSeries(series);
        }

        /**
         * called publicly by Eyes.moveRandom()
         */
        public stop() : void {
            this._povProcessor.clearQueue(true);
        }

        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        public followMode(stop? : boolean) : void {
            if (!stop) this._povProcessor.clearQueue(true);
            this._performSetBack(stop ? 0 : EyeBall._FOLLOW_MODE_SET_BACK);
            this.billboardMode = stop ? BABYLON.Mesh.BILLBOARDMODE_NONE : BABYLON.Mesh.BILLBOARDMODE_ALL;
        }

        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        public moveRandom(stop? : boolean) : void {
            this._performSetBack(stop ? 0 : EyeBall._RANDOM_MODE_SET_BACK);
        }

        /** shift eyes back slightly, so rotation does not cause eyes to violate skin
         * @param {number} amt - 0 to 1, used
         */
        private _performSetBack(amt : number) : void {
            if (!this._originalPositionZ) this._originalPositionZ = this.position.z

            var boundingBox = this.getBoundingInfo().boundingBox;
            this.position.z = this._originalPositionZ + (boundingBox.maximum.z * amt);
        }

        /**
         * Getter to identify which EyeBall instance is left or right side.
         * @returns {boolean} - When true instance is left side, else is right side.
         */
        public isLeft() : boolean {
            return this.name.substring(this.name.length - 3) === "_L";
        }


        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        public setPupilSize(size : number) : void {
            // to-do
        }
    }
}