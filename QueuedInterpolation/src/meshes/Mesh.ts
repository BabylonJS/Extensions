/// <reference path="../deformation/shapeKeyBased/VertexDeformation.ts"/>
/// <reference path="../deformation/shapeKeyBased/ShapeKeyGroup.ts"/>

/// <reference path="../deformation/skeletonBased/Pose.ts"/>
/// <reference path="../deformation/skeletonBased/PoseProcessor.ts"/>
/// <reference path="../deformation/skeletonBased/Skeleton.ts"/>

/// <reference path="../entrances/AbstractGrandEntrance.ts"/>

/// <reference path="../queue/MotionEvent.ts"/>
/// <reference path="../queue/EventSeries.ts"/>
/// <reference path="../queue/PovProcessor.ts"/>
/// <reference path="../queue/TimelineControl.ts"/>

module QI {
    /**
     * Mesh sub-class which has a before render which processes events for ShapeKeysGroups, Skeleton Poses, and POV.
     */
    export class Mesh extends BABYLON.Mesh implements SeriesTargetable{
        public  debug = false;
        private _registeredFN : () => void;
        private _positions32F : Float32Array;
        private _normals32F   : Float32Array;

        private _povProcessor : PovProcessor;
        private _shapeKeyGroups = new Array<ShapeKeyGroup>();
        private _poseProcessor : PoseProcessor;

        // for normal building, full / mesh sized futures; shared by all shapekeygroups
        public  _originalPositions: Float32Array;
        public _futurePositions   : Float32Array;
        public _futureNormals     : Float32Array;

        // tracking system members
        private _clockStart = -1;
        private _renderCPU = 0;
        private _totalDeformations = 0;
        private _totalFrames = 0;

        // info for subclassers of beforeRender, if anything was done last frame
        public _shapeKeyChangesMade : boolean;
        public _skeletonChangesMade : boolean;

        // for Firefox
        private _lastFrameID = -1;

        // for grand entrances
        public static COMPUTED_GROUP_NAME = "COMPUTED-GROUP"; // having a '-' is strategic, since that is the separator for blender shapekeys (GROUP-KEYNAME)
        public entranceMethod : AbstractGrandEntrance; // set prior to being on screen for any effect

        /**
         * @constructor - Args same As BABYLON.Mesh, except that using a source for cloning requires there be no shape keys
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: Mesh, doNotCloneChildren?: boolean) {
            super(name, scene, parent, source, doNotCloneChildren);
            if (source && source._shapeKeyGroups.length > 0) throw "QI.Mesh: meshes with shapekeys cannot be cloned";

            this._povProcessor = new PovProcessor(this, true);  // do not actually register as a beforeRender, use this classes & register below

            // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
            var ref = this;
            this._registeredFN = function(){ref.beforeRender();};
            // using scene level before render, so always runs & only once per frame, incase there are multiple cameras
            scene.registerBeforeRender(this._registeredFN);
        }
        // ============================ beforeRender callback & tracking =============================
        public beforeRender() : void {
            if (this._positions32F === null || this._normals32F === null || TimelineControl.isSystemPaused || this._instancePaused) return;
            var startTime = BABYLON.Tools.Now;

            // Firefox can call for a render occasionally when user is on a different tab; ignore
            if (this._lastFrameID === TimelineControl.FrameID) return;
            this._lastFrameID = TimelineControl.FrameID;

            this._shapeKeyChangesMade = false;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                // do NOT combine these 2 lines or only 1 group will run!
                var changed = this._shapeKeyGroups[g]._incrementallyDeform(this._positions32F, this._normals32F);
                this._shapeKeyChangesMade = this._shapeKeyChangesMade || changed;
            }

            this._skeletonChangesMade = false;
            if (this._poseProcessor){
                this._skeletonChangesMade = this._poseProcessor.incrementallyDeform();
            }

            // perform any POV events on the mesh not assigned a shapekey group or the pose processor
            this._povProcessor._incrementallyMove();

            if (this._shapeKeyChangesMade || this._skeletonChangesMade){
                if (this._shapeKeyChangesMade){
                    if (this.computeBonesUsingShaders || !this._skeletonChangesMade){
                        // resend positions & normals
                        super.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._positions32F);
                        super.updateVerticesData(BABYLON.VertexBuffer.NormalKind  , this._normals32F);
                    }
                }
                if (this._clockStart < 0) this._resetTracking(startTime); // delay tracking until the first change is made
                this._renderCPU += BABYLON.Tools.Now - startTime;
                this._totalDeformations++;
            }

            this._totalFrames ++;
        }

        public resetTracking() : void{
            this._resetTracking(BABYLON.Tools.Now);
        }

        private _resetTracking(startTime : number) : void{
            this._clockStart = startTime;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
        }

        public getTrackingReport(reset : boolean = false) : string{
            var totalWallClock = BABYLON.Tools.Now - this._clockStart;
            var report =
                    "\nNum Deformations: " + this._totalDeformations +
                    "\nRender CPU milli: " + this._renderCPU.toFixed(2) +
                    "\nRender CPU milli / Deformations: " + (this._renderCPU / this._totalDeformations).toFixed(2) +
                    "\nWallclock milli / Deformations: " + (totalWallClock / this._totalDeformations).toFixed(2) +
                    "\nMemo, Deformations / Sec: " + (this._totalDeformations / (totalWallClock / 1000)).toFixed(2) +
                    "\nMemo, Frames with no deformation: " + (this._totalFrames - this._totalDeformations) +
                    "\nMemo, Total vertices: " + this.getTotalVertices() +
                    "\nShape keys:";
            for (var i = 0; i < this._shapeKeyGroups.length; i++)
                report += "\n" + this._shapeKeyGroups[i].toString();

            if (reset) this.resetTracking();
            return report;
        }
        // ======================================== Overrides ========================================
        /** @override */
        public createInstance(name: string): BABYLON.InstancedMesh {
            if (this._shapeKeyGroups.length > 0){
                 BABYLON.Tools.Error("QI.Mesh:  Shared vertex instances not possible with shape keys");
                 return null;

            }else return super.createInstance(name);
        }

        /** @override */
        public convertToFlatShadedMesh() : BABYLON.Mesh {
            if (this._shapeKeyGroups.length > 0){
                 BABYLON.Tools.Error("QI.Mesh:  Flat shading must be done on export with shape keys");
                 return null;

            }else return super.convertToFlatShadedMesh();
        }

        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        public setVerticesData(kind: string, data: number[] | Float32Array, updatable?: boolean, stride?: number) : BABYLON.Mesh {
            super.setVerticesData(kind, data, updatable || kind === BABYLON.VertexBuffer.PositionKind || kind === BABYLON.VertexBuffer.NormalKind, stride);

            if (kind === BABYLON.VertexBuffer.PositionKind){
                this._positions32F = this.setPositionsForCPUSkinning(); // get positions from here, so can morph & CPU skin at the same time

                // need to make a by value copy of the orignal position data, to build futurePos in call to normalsforVerticesInPlace()
                this._originalPositions = new Float32Array(data.length);
                for (var i = 0, len = data.length; i < len; i++){
                    this._originalPositions[i] = data[i];
                }
                this._futurePositions = new Float32Array(data.length);
                this._futureNormals   = new Float32Array(data.length);
            }
            else if (kind === BABYLON.VertexBuffer.NormalKind){
                this._normals32F = this.setNormalsForCPUSkinning(); // get normals from here, so can morph & CPU skin at the same time
            }
            else if (kind === BABYLON.VertexBuffer.MatricesWeightsKind){
                // exporter assigns skeleton before setting any vertex data, so should be ok
                if (!this._poseProcessor) this._poseProcessor = new PoseProcessor(<Skeleton> this.skeleton, this, true);
            }
            
            return this;
        }

        /** @override */
        public dispose(doNotRecurse?: boolean) : void {
            super.dispose(doNotRecurse);
            this.getScene().unregisterBeforeRender(this._registeredFN);
        }
        // =================================== EventSeries related ===================================
        /**
         * Primarily called by Blender generated code.
         * @param {QI.ShapeKeyGroup} shapeKeyGroup - prebuilt group to add
         */
        public addShapeKeyGroup(shapeKeyGroup : ShapeKeyGroup) : void {
            this._shapeKeyGroups.push(shapeKeyGroup);
        }
       
        /**
         * create a new shapekey group from a list of others.  Useful to export smaller more focused groups
         * upon load.
         * @param {string} newGroupName - The name the consolidated group to create
         * @param {Array<string>} thoseToMerge - Names of the groups to merge
         * @param {boolean} keepOrig - Do not delete original groups when true. (default: false)
         * @returns {ShapeKeyGroup} The consolidate group
         */
        public consolidateShapeKeyGroups(newGroupName : string, thoseToMerge : Array<string>, keepOrig? : boolean) : ShapeKeyGroup {
            var nGroups = thoseToMerge.length;
            // gather all the groups
            var groups = new Array<ShapeKeyGroup>(nGroups);
            for (var i = 0; i < nGroups; i++) {
                groups[i] = this.getShapeKeyGroup(thoseToMerge[i]);
                if (!groups[i]) {
                    BABYLON.Tools.Error("QI.Mesh: no shape key group with name: " + thoseToMerge[i]);
                    return null;
                }
            }
            var ret = ShapeKeyGroup._buildConsolidatedGroup(this, newGroupName, groups);
            
            // remove original groups
            if (!keepOrig) { 
                for (var i = 0; i < nGroups; i++) {
                    this.removeShapeKeyGroup(thoseToMerge[i]);
                }
            }
            return ret;
        }

        /**
         * Cause the group to go out of scope.  All resources on heap, so GC should remove it.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        public removeShapeKeyGroup(groupName : string) : void {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    this._shapeKeyGroups.splice(g, 1);
                    return;
                }
            }
            BABYLON.Tools.Warn("QI.Mesh: no shape key group with name: " + groupName);
        }
        
        /**
         * When there are overlaps of vertices of shapekey groups, the last one processed wins
         * if both are active in a given frame.  eg. Automaton's WINK & FACE groups.  Can be
         * run multiple times, but of course order your calls in the opposite order.
         * @param {string} groupName - Group to process last.
         */
        public setShapeKeyGroupLast(groupName : string) : void {
            var currIdx = -1;
            var len = this._shapeKeyGroups.length;
        
            for (var g = 0; g < len; g++) {
                if (this._shapeKeyGroups[g]._name === groupName) {
                    currIdx = g;
                    break;
                }
            }
            if (currIdx === -1) {
                BABYLON.Tools.Error("QI.Mesh: no shape key group with name: " + groupName);
                return;
            }
            
            // test for not being last already
            if (currIdx + 1 < len) {
                var chosen = this._shapeKeyGroups[currIdx];
                this._shapeKeyGroups.splice(currIdx, 1);
                this._shapeKeyGroups.splice(len, 0, chosen);
            }
        }
        
        /**
         * Clear out any events, on all the queues the Mesh has.
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        public clearAllQueues(stopCurrentSeries? : boolean) :void {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].clearQueue(stopCurrentSeries);
            }
            if (this._poseProcessor){
                this._poseProcessor.clearQueue(stopCurrentSeries);
            }

            if (this._povProcessor){
                this._povProcessor.clearQueue(stopCurrentSeries);
            }
        }

        /**
         * Go thru an array of Events prior to creating an event series.  Add a stall for any queue(s) that
         * does not have an event.  Useful for syncing the entire meshe's groups even though a queue may not
         * have an event.
         *
         * An example is when inserting a Grand Entrance.  The entrance may only use a shape key group.  The
         * coder may wish to add on / directly swing into action afterward using a pose.  If there was not a
         * stall added to the pose processor, pose event would begin before entrance was complete.
         *
         * @param {Array<any>} events - Events argument or EventSeries, prior to instancing.
         * @param {number} stallMillis - Amount of time to stall a queue.  Do not take into account any EventSeries
         * repeats, if any.
         * @param {string} groupForFuncActions - Should match the EventSeries constructor arg.  Defaults are the same.
         * @returns {Array<any>} - Same array as passed, with stalls added.
         */
        public appendStallForMissingQueues(events : Array<any>, stallMillis : number, groupForFuncActions = PovProcessor.POV_GROUP_NAME) : Array<any> {
            // flags of things to check for
            var povFound = false;
            var skeletonFound = !this._poseProcessor; // say found when no pose processor
            var nSkGrps = this._shapeKeyGroups.length;
            var shapeGrpFound = new Array<boolean>(nSkGrps);
            var funcActionsFound = false;

            // populate all the flags of things found
            for (var i = 0, len = events.length; i < len; i++) {
                if (events[i] instanceof VertexDeformation){
                    var grpName = (<VertexDeformation> events[i])._groupName;
                    for (var s = 0; s < nSkGrps; s++){
                        if (this._shapeKeyGroups[s]._name === grpName) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                } else if (events[i] instanceof PoseEvent) {
                    skeletonFound = true;

                // must check last, since VertexDeformation & PoseEvent subclasses of MotionEvent
                } else if (!(events[i] instanceof MotionEvent)) {
                    // functions / actions / & nonMotionEvents
                    funcActionsFound = true;

                } else povFound = true;
            }

            // flag queue for functions / actions / nonMotionEvents, when present
            if (funcActionsFound) {
                if (groupForFuncActions === PovProcessor.POV_GROUP_NAME) {
                    povFound = true;

                } else if (groupForFuncActions === PoseProcessor.INTERPOLATOR_GROUP_NAME) {
                    skeletonFound = true;

                } else {
                    for (var s = 0; s < nSkGrps; s++) {
                        if (groupForFuncActions === this._shapeKeyGroups[s]._name) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                }
            }

            // add stalls for missing queues
            if (!povFound) {
                events.push(new Stall(stallMillis, PovProcessor.POV_GROUP_NAME));
            }

            if (!skeletonFound) {
                events.push(new Stall(stallMillis, PoseProcessor.INTERPOLATOR_GROUP_NAME));
            }

            for (var s = 0; s < nSkGrps; s++) {
                if (!shapeGrpFound[s]) {
                    events.push(new Stall(stallMillis, this._shapeKeyGroups[s]._name));
                }
            }
            return events;
        }

        /**
         * wrapper a single MotionEvent into an EventSeries, defaulting on all EventSeries optional args
         * @param {MotionEvent or function} event - Event or function to wrapper.
         */
        public queueSingleEvent(event : MotionEvent) : void {
            this.queueEventSeries(new EventSeries([event]));
        }

        /**
         * SeriesTargetable implementation method
         * @param {EventSeries| Array<any>} eSeriesOrArray - The series to append to the end of series queue.  Can also be an array when 
         * defaulting on other EventSeries Args, to make application level code simpler.
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        public queueEventSeries(eSeriesOrArray : EventSeries | Array<any>, clearQueue? : boolean, stopCurrentSeries? : boolean, insertSeriesInFront? : boolean) : void {
            var eSeries : EventSeries;
            if (eSeriesOrArray instanceof EventSeries) eSeries = eSeriesOrArray;
            else eSeries = new EventSeries(eSeriesOrArray);
            
            var groups : Array<string>;
            if  (this.debug) groups = [];
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                if (eSeries.isGroupParticipating(this._shapeKeyGroups[g].getName())){
                    if (insertSeriesInFront){
                        this._shapeKeyGroups[g].insertSeriesInFront(eSeries);
                    } else {
                        this._shapeKeyGroups[g].queueEventSeries(eSeries, clearQueue, stopCurrentSeries);
                    }
                    if (groups) groups.push(this._shapeKeyGroups[g].getName());
                }
            }
            if (eSeries.isGroupParticipating(PoseProcessor.INTERPOLATOR_GROUP_NAME)){
                if (insertSeriesInFront){
                    this._poseProcessor.insertSeriesInFront(eSeries);
                } else {
                    this._poseProcessor.queueEventSeries(eSeries);
                }
                if (groups) groups.push(PoseProcessor.INTERPOLATOR_GROUP_NAME);
            }

            if (eSeries.isGroupParticipating(PovProcessor.POV_GROUP_NAME)){
                if (insertSeriesInFront){
                    this._povProcessor.insertSeriesInFront(eSeries);
                } else {
                    this._povProcessor.queueEventSeries(eSeries);
                }
                if (groups) groups.push(PovProcessor.POV_GROUP_NAME);
            }

            // diagnostic logging
            if (groups){
                if (groups.length === 0) BABYLON.Tools.Warn("QI.Mesh:  no shape keys groups or skeleton participating in event series");
                else{
                    var msg = "QI.Mesh:  series queued to " + groups.length + " group(s): [ ";
                    for (var i = 0; i < groups.length; i++){
                        msg += groups[i] + " ";
                    }
                    BABYLON.Tools.Log(msg + "]");
                }
            }
        }
        
        /**
         * primarily for diagnostic purposes
         */
        public getAllQueueStates() : string {
            var ret = this._povProcessor.getQueueState();
            if (this._poseProcessor) ret +=  "\n\n" + this._poseProcessor.getQueueState();
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                 ret +=  "\n\n" + this._shapeKeyGroups[g].getQueueState();
            }
            return ret;
        }
        // ==================================== Shapekey Wrappers ====================================
        /**
         * Query for determining if a given shapekey has been defined for the mesh.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        public hasShapeKeyGroup(groupName : string) : boolean {
            return this.getShapeKeyGroup(groupName) !== null;
        }

        /**
         * Return a ShapeKeyGroup Object defined for the mesh.  Primarily for internal use.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         */
        public getShapeKeyGroup(groupName : string) : ShapeKeyGroup {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    return this._shapeKeyGroups[g];
                }
            }
            return null;
        }
        
        /**
         * Convenience method for queuing a single deform with a single endstate relative to basis state.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1
         *
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
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
         *      requireCompletionOf - A way to serialize events from different queues e.g. shape key & skeleton.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         * 
         * @returns {Deformation} This is the event which gets queued.
         */
        public queueDeform(
            groupName     : string,
            endStateName  : string,
            endStateRatio : number,
            milliDuration : number,
            movePOV       : BABYLON.Vector3 = null,
            rotatePOV     : BABYLON.Vector3 = null,
            options?      : IMotionEventOptions) : Deformation 
        {    
            var event = new Deformation(groupName, endStateName, endStateRatio, milliDuration, movePOV, rotatePOV, options);
            this.queueSingleEvent(event);
            return event;
        }

        /**
         * Go to a single pre-defined state immediately.  Much like assignPoseImmediately, can be done while
         * mesh is not currently visible.
         * @param {string} groupName - The name of the shapekey group on the mesh.
         * @param {string} endStateName - Name of state key to deform to
         */
        public deformImmediately(groupName : string, stateName : string) : void {
            var group = this.getShapeKeyGroup(groupName);
            if (!group) {
                BABYLON.Tools.Error("QI.Mesh: invalid shape key group: " + groupName.toUpperCase());
                return;
            }
            group._deformImmediately(stateName, this._positions32F, this._normals32F);
            super.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._positions32F);
            super.updateVerticesData(BABYLON.VertexBuffer.NormalKind  , this._normals32F);
        }
        // ==================================== Skeleton Wrappers ====================================
        /** 
         * Assign the pose library to the mesh.  Only one library can be assigned at once, so any it
         * is a bad idea to perform this while pose events are queued.
         * @param {string} libraryName - The name given in Blender when library generated.
         */
        public assignPoseLibrary(libraryName : string) : void {
            if (this.skeleton) {
                (<Skeleton> this.skeleton).assignPoseLibrary(libraryName);
            }
        }

        /**
         * Go to a pose immediately.  This can done while the mesh is not currently visible.
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         */
        public assignPoseImmediately(poseName : string) : void {
             if (this.skeleton) {
                 (<Skeleton> this.skeleton)._assignPoseImmediately(poseName);
                 this._poseProcessor._lastPoseRun = poseName;
            }
        }
        
        /**
         * Convenience method for queuing a single pose on the skeleton.
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
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
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
         * 
         * @returns {PoseEvent} This is the event which gets queued.
         */
        public queuePose(
            poseName       : string,
            milliDuration  : number,
            movePOV        : BABYLON.Vector3 = null,
            rotatePOV      : BABYLON.Vector3 = null,
            options?       : IMotionEventOptions) : PoseEvent
        {
            var event = new PoseEvent(poseName, milliDuration, movePOV, rotatePOV, options);
            this.queueSingleEvent(event);
            return event;
        }

        /**
         * assign a sub-pose onto the current state of the skeleton.  Not truly immediate, since it is still queued,
         * unlike assignPoseImmediately().
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         * 
         * @returns {PoseEvent} This is the event which gets queued.
         */
        public assignSubPoseImmediately(poseName : string) : PoseEvent {
            return this.addSubPose(poseName, 0.01); // 0.01 milli is close enough to immediate
        }
        
        /** 
         * Add a sub-pose with limited # of bones, to be added to any subsequent poses, until removed.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         * @param {number} standAloneMillis - optional, when present an event is generated to assignment to current pose.
         * 
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level (when standalone)
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any sub-poses previously applied should be subtracted during event(default false)?
         *
         * @returns {PoseEvent} This is the event which gets queued.  Null when no millis.
         */
       public addSubPose(poseName : string, standAloneMillis? : number, options? : IMotionEventOptions) : PoseEvent {
            if (this.skeleton) {
                if (standAloneMillis) {
                    var skel = <Skeleton> this.skeleton;
                    var pose = new PoseEvent(this.getLastPoseNameQueuedOrRun(), standAloneMillis, null, null, options);
                    var events = [
                        function() { skel.addSubPose(poseName); },
                        pose
                    ];
                    this.queueEventSeries(new EventSeries(events, 1, 1, PoseProcessor.INTERPOLATOR_GROUP_NAME) ); 
                    return pose;
                    
                } else {
                    (<Skeleton> this.skeleton).addSubPose(poseName);
                    return null;
                }
            }
        }

        /**
         * Remove a sub-pose at the next posing of the skeleton.
         * @param {string} poseName - The name in the library of the sub-pose (.sp suffix)
         */ 
        public removeSubPose(poseName : string) : void {
            if (this.skeleton){
                (<Skeleton> this.skeleton).removeSubPose(poseName);
            }
        }

        /**
         * Remove all sub-poses at the next posing of the skeleton.
         */
        public clearAllSubPoses(){
            if (this.skeleton){
                (<Skeleton> this.skeleton).clearAllSubPoses();
            }
        }
        
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        public getLastPoseNameQueuedOrRun() : string {
            return this._poseProcessor ? this._poseProcessor.getLastPoseNameQueuedOrRun() : null;
        }
        
        /**
         * Convenience method for queuing a single move on the mesh.
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
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
         * @returns {MotionEvent} This is the event which gets queued.
         */
        public queuePOV(
            milliDuration  : number,
            movePOV        : BABYLON.Vector3 = null,
            rotatePOV      : BABYLON.Vector3 = null,
            options?       : IMotionEventOptions) : MotionEvent
        {
            var event = new MotionEvent(milliDuration, movePOV, rotatePOV, options);
            this.queueSingleEvent(event);
            return event;
        }

        // ================================= Grand Entrance Methods ==================================
        /** Entry point called by TOB generated code, when everything is ready.
         *  To load in advance without showing export disabled.  Call this when ready.
         *  Can also be called after the first time, if makeVisible(false) was called.
         */
        public grandEntrance() : void {
            if (this.isEnabled() && !this.isVisible) {
                var ref = this;
                this.compileMaterials(function() {
                    if (ref.entranceMethod) ref.entranceMethod.makeEntrance(); else ref.makeVisible(true);
                });
            }
         }

        /**
         * Get Every material in use by the mesh & it's children.  This is primarily for compileMaterials(),
         * but needs to be broken out, so it can be called recursively.
         * 
         * @param repo - This is an array of dictionaries with entries of a mesh & material, initialized when missing.
         * @param meshPassed - An argument of the mesh (child mesh) to operate on.
         * @returns an array of dictionaries with entries of a mesh & material.
         */
        public getEverySimpleMaterial(repo? : Array<{mesh: BABYLON.Mesh, mat: BABYLON.Material}>, meshPassed? : BABYLON.Mesh) : Array<{mesh: BABYLON.Mesh, mat: BABYLON.Material}> {
            if (!repo) repo = new Array<{mesh: BABYLON.Mesh, mat: BABYLON.Material}>(0);
            
            var mesh = meshPassed ? meshPassed : this;
            
            // take care of this mesh or the one passed
            if (mesh.material instanceof BABYLON.MultiMaterial) {
                var subMaterials = (<BABYLON.MultiMaterial> mesh.material).subMaterials;
                for (var i = 0, len = subMaterials.length; i < len; i++) {
                    repo.push( {mesh : mesh, mat: subMaterials[i]} );
                }
            } else repo.push( {mesh : mesh, mat: mesh.material} );
            
            // take care of children only needing to go one level, since getChildMeshes() is also recursive
            if (!meshPassed) {
                var children = mesh.getChildMeshes();
                for (var i = 0, len = children.length; i < len; i++) {
                    this.getEverySimpleMaterial(repo, <BABYLON.Mesh> children[i]);
                } 
            }           
            return repo;
        }
        
        /**
         * Ensure that all materials for this mesh & it's children are actively forced to compile
         */
        public compileMaterials(completionCallback? : () => void) : void {
            var everyMatSet = this.getEverySimpleMaterial();
            var compiledMaterials = 0;
            var nMaterials = everyMatSet.length;
            
            // find how many materials are StandardMaterials, since ShaderMaterials do not override isReadyForSubMesh()
            var nReportingBack = 0;
            for (var i = 0; i < nMaterials; i++) {
                if (everyMatSet[i].mat instanceof BABYLON.StandardMaterial) nReportingBack++;
            }
            
            // the callback to forceCompilation 
            if (completionCallback) {
                var callback = function(material : BABYLON.Material) : void {
                    if (++compiledMaterials < nReportingBack) return;
                    completionCallback();     
                };
            }
            
            // force compile each mesh & material set
            for (var i = 0; i < nMaterials; i++) {
                everyMatSet[i].mat.forceCompilation(everyMatSet[i].mesh, callback);
            }
        }

        /**
         * make computed shape key group when missing.  Used mostly by GrandEntrances.
         * @returns {ShapeKeyGroup} used for Javascript made end states.
         */
        public makeComputedGroup() : ShapeKeyGroup {
            var computedGroup = this.getShapeKeyGroup(Mesh.COMPUTED_GROUP_NAME);

            if (!computedGroup){
                var nElements = this._originalPositions.length;
                var affectedPositionElements = new Uint32Array(nElements);

                for (var i = 0; i < nElements; i++){
                    affectedPositionElements[i] = i;
                }
                computedGroup = new ShapeKeyGroup(this, Mesh.COMPUTED_GROUP_NAME, affectedPositionElements);
                this.addShapeKeyGroup(computedGroup);
            }
            return computedGroup;
        }

        /**
         * make the whole hierarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        public makeVisible(visible : boolean, compileMats? : boolean) : void {
            this.isVisible = visible;
            if (visible)
                this.resumeInstancePlay();
            else
                this.pausePlay();
            
            // compileMaterials may have already been called
            if (compileMats) this.compileMaterials();

            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i] instanceof Mesh){
                    (<Mesh> children[i]).makeVisible(visible);

                } else{
                    children[i].isVisible = visible;
                }
            }
        }
        
        /**
         * Used by some GrandEntrances to get the center of the entire mesh with children too.
         * 
         */
        public getSizeCenterWtKids() : {size : BABYLON.Vector3, center : BABYLON.Vector3} {
            var boundingBox = this.getBoundingInfo().boundingBox;
            var minmin = boundingBox.minimumWorld.clone();
            var maxmax = boundingBox.maximumWorld.clone();
            
            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                boundingBox = children[i].getBoundingInfo().boundingBox;
                if (minmin.x > boundingBox.minimumWorld.x) minmin.x = boundingBox.minimumWorld.x;
                if (minmin.y > boundingBox.minimumWorld.y) minmin.y = boundingBox.minimumWorld.y;
                if (minmin.z > boundingBox.minimumWorld.z) minmin.z = boundingBox.minimumWorld.z;
                
                if (maxmax.x < boundingBox.maximumWorld.x) maxmax.x = boundingBox.maximumWorld.x;
                if (maxmax.y < boundingBox.maximumWorld.y) maxmax.y = boundingBox.maximumWorld.y;
                if (maxmax.z < boundingBox.maximumWorld.z) maxmax.z = boundingBox.maximumWorld.z;
            }
            
            return {size: maxmax.subtract(minmin), center: maxmax.addInPlace(minmin).scaleInPlace(0.5)};
        }
        // ============================ Mesh-instance wide play - pause ==============================
        private _instancePaused = true; // do not allow anything to run till visible; managed by grand entrance

        /**
         * returns {boolean} True, when this specific instance is paused
         */
        public isPaused() : boolean { return this._instancePaused; }

        /**
         * Called to pause this specific instance from performing additional animation.
         * This is independent of a system pause.
         */
        public pausePlay() : void {
             this._instancePaused = true;

            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].pauseInstance();
            }

            if (this._poseProcessor){
                this._poseProcessor.pauseInstance();
            }

            if (this._povProcessor){
                this._povProcessor.pauseInstance();
            }
        }

        /**
         * Called to resume animating this specific instance.
         * A system in pause will still prevent animation from resuming.
         */
        public resumeInstancePlay() : void {
            this._instancePaused = false;

            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].resumeInstancePlay();
            }

            if (this._poseProcessor){
                this._poseProcessor.resumeInstancePlay();
            }

            if (this._povProcessor){
                this._povProcessor.resumeInstancePlay();
            }
        }
    }
}
