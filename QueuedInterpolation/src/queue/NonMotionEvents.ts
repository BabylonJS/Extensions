/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
module QI{
    /**
     * Abstract sub-class of MotionEvent, sub-classed by PropertyEvent & RecurringCallbackEvent
     */
    export class NonMotionEvent extends MotionEvent {
        private _paused = false;
        private _scene : BABYLON.Scene;
        private _registeredFN : () => void;

        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        public initialize(lateStartMilli = 0, scene? : BABYLON.Scene) :void {
            this.activate(lateStartMilli);

            if (scene) {
                TimelineControl.initialize(scene); // only does something the first call
                var ref = this;
                this._registeredFN = function(){ref._beforeRender();};
                scene.registerBeforeRender(this._registeredFN );

                // store scene, so can unregister
                this._scene = scene;
            }
        }


        private _beforeRender() : void {
            if (TimelineControl.isSystemPaused) {
                if (!this._paused){
                    this.pause();
                    this._paused = true;
                }
                return;

            }else if (this._paused){
                this._paused = false;
                this.resumePlay();
            }
            var resume = !this._paused;
            var ratioComplete = this.getCompletionMilestone();
            if (ratioComplete < 0) return; // MotionEvent.BLOCKED, Motion.SYNC_BLOCKED or MotionEvent.WAITING

            this._incrementallyUpdate(ratioComplete);

            if (this.isComplete() ) {
                this.clear();
            }
        }
        
        /**
         * Stop / cleanup resources. Only does anything when not being added to a queue.
         */
        public clear() {
            if (this._scene){
                this._paused = false;
                this._scene.unregisterBeforeRender(this._registeredFN);
                this._scene = null; 
            }
        }

        // method to be overridden
        public _incrementallyUpdate(ratioComplete : number) : void { }
    }
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of NonMotionEvent, for changing the property of an object
     */
    export class PropertyEvent extends NonMotionEvent {
        public _initialValue : any;
        private _datatype : number;

        private static _NUMBER_TYPE = 1;
        private static _VEC3_TYPE   = 2;

        /**
         * @param {Object} object - The object instance on which to make a property change
         * @param {string} _property - The name of the property to change
         * @param {any} - The final value that the property should take
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(public _object : Object, public _property : string, public _targetValue : any, milliDuration : number, options? : IMotionEventOptions) {
            super(milliDuration, null, null, options);

            if (typeof this._targetValue === "number"){
                this._datatype = PropertyEvent._NUMBER_TYPE;

            }else if (this._targetValue instanceof BABYLON.Vector3){
                this._datatype = PropertyEvent._VEC3_TYPE;

            }else throw "Datatype not supported";
        }

        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        public initialize(lateStartMilli = 0, scene? : BABYLON.Scene) : void {
            switch (this._datatype){
                case PropertyEvent._NUMBER_TYPE:
                    this._initialValue = this._object[this._property];
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._initialValue = (<BABYLON.Vector3> this._object[this._property]).clone();
                    break;
            }
            this._initialValue = this._object[this._property];

            super.initialize(lateStartMilli, scene);
        }

        public _incrementallyUpdate(ratioComplete : number) : void {
            switch (this._datatype){
                case PropertyEvent._NUMBER_TYPE:
                    this._object[this._property] = this._initialValue + ((this._targetValue - this._initialValue) * ratioComplete);
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._object[this._property] = BABYLON.Vector3.Lerp(this._initialValue, this._targetValue, ratioComplete);
                    break;
            }
        }
    }
    //================================================================================================
    //================================================================================================
    /**
     * Sub-class of NonMotionEvent, for calling a recurring callback
     */
    export class RecurringCallbackEvent extends NonMotionEvent {
        /**
         * @param {(ratioComplete : number) => void} callback - The function to call
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        constructor(private _callback : (ratioComplete : number) => void, milliDuration : number, options? : IMotionEventOptions) {
            super(milliDuration, null, null, options);
        }

        public _incrementallyUpdate(ratioComplete : number) : void {
            this._callback(ratioComplete);
        }
    }
}