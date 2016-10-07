/// <reference path="./EyeBall.ts"/>

module BEING{
    /** Class to control a set of EyeBalls.
     *
     * Movement up / down left right are controlled by POV rotation. EyeBalls are not inheriting from QI.Mesh, since no shape keys.  
     * Just add a pov processor, which registers itself.
     * 
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     * 
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles partitioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     * 
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    export class Eyes {
        // these are in absolute radian amounts
        private static MAX_UP = 0.12;
        //                            right - left
        private static L_EYE_RANGE = [0.35, -0.50];
        private static R_EYE_RANGE = [0.50, -0.35];
        
        private _leftEye  : EyeBall;
        private _rightEye : EyeBall;

        private _pupilSize = 0.5;
        private _followMode = false;
        
        /** Do not want for force the eye to only work with a make human.  Use this to analze parent mesh to pick out
         *  the eyeballs from the children meshes.
         * 
         * @param {BABYLON.Mesh} parentMesh - The mesh search for children that are instances of BEING.EyeBall.
         * @returns {BEING.Eyes} - When 2 child BEING.EyeBalls are found, a constructor is run & returned.  Otherwise
         * null is returned. 
         */
        public static getInstance(parentMesh : BABYLON.Mesh) : Eyes {
            var children = parentMesh.getChildren();
            var eyes = new Array<EyeBall>();
            for (var i = 0, nKids = children.length; i < nKids; i++){
                if (children[i] instanceof EyeBall){
                    eyes.push(<EyeBall> children[i]);
                    if (eyes.length === 2) break;
                }
            }
            var ret = (eyes.length === 2) ? new Eyes(eyes) : null;
            return ret;
        }
        
        constructor(eyes : Array<EyeBall>) {
            var leftIdx = (eyes[0].isLeft()) ? 0 : 1;
            var rightIdx = (leftIdx === 1) ? 0 : 1;
            this._leftEye  = eyes[leftIdx ];
            this._rightEye = eyes[rightIdx];
        }
        
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {function} postEventFunc - call this upon completion, only done one eye; presume it is next random
         */
        public queueRotation(up : number, left : number, duration = 600, wait = 0, postEventFunc?: () => void) : void {
            // ignore any queuing till eyes are ready & enabled; getInstance() run very early in Body postConstruction()
            if (!this._leftEye.isVisible || !this._rightEye.isVisible) return;
            
            // up processed the same way regardless of eye
            var absUp = Eyes.MAX_UP * up;
            
            // the sign of left determines which set of values of EYE_RANGE to use
            var idx = (left < 0) ? 0 : 1;
            
            // no longer need sign on left
            left = Math.abs(left);
            
            // assign left for Left eye, create motion event
            var absLeftL = Eyes.L_EYE_RANGE[idx] * left;
            var eventL = new QI.MotionEvent(duration, wait, null, new BABYLON.Vector3(absUp, absLeftL, 0), true );
            
            // assign left for Right eye, create motion event
            var absLeftR = Eyes.R_EYE_RANGE[idx] * left;
            var eventR = new QI.MotionEvent(duration, wait, null, new BABYLON.Vector3(absUp, absLeftR, 0), true );
            
            // sync pair them for least error; especially important for random
            eventL.setSyncPartner(eventR);
            eventR.setSyncPartner(eventL);
            
            // queue them
            this._leftEye .queueRotation(eventL, postEventFunc);
            this._rightEye.queueRotation(eventR);
        }  
        
        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        public followMode(stop? : boolean) : void {
            this._leftEye .followMode(stop);
            this._rightEye.followMode(stop);
        }
        
        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        public moveRandom(stop? : boolean) : void {
            // adjust the Z axis setback for each eye
            this._leftEye .moveRandom(stop);
            this._rightEye.moveRandom(stop);
            
            if (stop) {
                this._leftEye .stop();
                this._rightEye.stop();
                return;
            }
            this.followMode(true);
            
            var duration = Math.random() * (500 - 100) + 100; // between 100 & 500 millis
            var wait = Math.random() * (12000 - 5000) + 5000; // between 5 & 12 secs
            var up   = Math.random() * 2 - 1;                 // between -1 & 1
            var left = Math.random() * 2 - 1;                 // between -1 & 1
        //    var idx = Math.floor(Math.random() * Eyes._RANDOM.length);
        //    var pos = Eyes._RANDOM[idx];
            var me = this;
           this.queueRotation(up, left, duration, wait, function(){me.moveRandom();});
        }
        
        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        public setPupilSize(size : number) : void {
            // to-do
            BABYLON.Tools.Error("setPupilSize() not yet implemented");
        }
    }
}