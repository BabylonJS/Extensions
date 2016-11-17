/// <reference path="./deformation/shapeKeyBased/VertexDeformation.ts"/>
/// <reference path="./deformation/shapeKeyBased/ShapeKeyGroup.ts"/>

/// <reference path="./deformation/skeletonBased/Pose.ts"/>
/// <reference path="./deformation/skeletonBased/PoseProcessor.ts"/>
/// <reference path="./deformation/skeletonBased/Skeleton.ts"/>

/// <reference path="./queue/MotionEvent.ts"/>
/// <reference path="./queue/EventSeries.ts"/>
/// <reference path="./queue/PovProcessor.ts"/>
/// <reference path="./queue/TimelineControl.ts"/>

module QI {
    /** An interface used so both implementing classes & Mesh do not have to reference each other.
     *
     * Any class implementing this MUST have constructor with 3 arguments: 
     *      - The root level mesh to display.
     *      - An array of durations, length variable
     *      - An optional sound to accompany the entrance
     * Tower of Babel generates instancing this way.
     */
    export interface GrandEntrance {
        makeEntrance() : void;
    }

    /**
     * Mesh sub-class which has a before render which processes events for ShapeKeysGroups, Skeleton Poses, and POV.
     */
    export class Mesh extends BABYLON.Mesh implements SeriesTargetable{
        public  debug = false;
        private _registeredFN : () => void;
        private _positions32F : Float32Array;
        private _normals32F   : Float32Array;

        public  _povProcessor : PovProcessor; // public for EyeBall
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
        public entranceMethod : GrandEntrance; // set prior to being on screen for any effect

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

            this._povProcessor = new PovProcessor(this, false);  // do not actually register as a beforeRender, use this classes & register below

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
        public convertToFlatShadedMesh() : void {
            if (this._shapeKeyGroups.length > 0){
                 BABYLON.Tools.Error("QI.Mesh:  Flat shading must be done on export with shape keys");
                 return null;

            }else super.convertToFlatShadedMesh();
        }

        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        public setVerticesData(kind: any, data: any, updatable?: boolean) : void {
            super.setVerticesData(kind, data, updatable || kind === BABYLON.VertexBuffer.PositionKind || kind === BABYLON.VertexBuffer.NormalKind);

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
         * Cause the group to go out of scope.  All resources on heap, so GC should remove.
         * @param {string} groupName - The name of the group to look up.
         */
        public removeShapeKeyGroup(groupName : string) : void {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    this._shapeKeyGroups = this._shapeKeyGroups.splice(g, 1);
                    return;
                }
            }
            BABYLON.Tools.Warn("QI.Mesh:  no shape key group with name: " + groupName);
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
         * wrapper a single MotionEvent into an EventSeries, defualting on all EventSeries optional args
         * @param {MotionEvent} event - Event to wrapper.
         */
        public queueSingleEvent(event : MotionEvent) : void {
            this.queueEventSeries(new EventSeries([event]));
        }

        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        public queueEventSeries(eSeries : EventSeries, clearQueue? : boolean, stopCurrentSeries? : boolean, insertSeriesInFront? : boolean) : void {
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
        // ==================================== Shapekey Wrappers ====================================
        public hasShapeKeyGroup(groupName : string) : boolean {
            return this.getShapeKeyGroup(groupName) !== null;
        }

        public getShapeKeyGroup(groupName : string) : ShapeKeyGroup {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    return this._shapeKeyGroups[g];
                }
            }
            return null;
        }

        public getLastPoseNameQueuedOrRun() : string {
            return this._poseProcessor ? this._poseProcessor.getLastPoseNameQueuedOrRun() : null;
        }
        // ==================================== Skeleton Wrappers ====================================
        public assignPoseLibrary(libraryName : string) : void {
            if (this.skeleton) {
                (<Skeleton> this.skeleton).assignPoseLibrary(libraryName);
            }
        }

        public assignPoseImmediately(poseName : string) : void {
             if (this.skeleton) {
                 (<Skeleton> this.skeleton)._assignPoseImmediately(poseName);
                 this._poseProcessor._lastPoseRun = poseName;
            }
        }

       public addSubPose(poseName : string, immediately? : boolean) : void {
            if (this.skeleton) {
                (<Skeleton> this.skeleton).addSubPose(poseName);
                if (immediately) {
                    this.queueSingleEvent(new PoseEvent(poseName, 1) ); // 1 milli is close enough to immediate
                }
            }
        }

        public removeSubPose(poseName : string) : void {
            if (this.skeleton){
                (<Skeleton> this.skeleton).removeSubPose(poseName);
            }
        }

        public clearAllSubPoses(){
            if (this.skeleton){
                (<Skeleton> this.skeleton).clearAllSubPoses();
            }
        }
        // =================================== BJS side ShapeGroup ===================================
        /** entry point called by TOB generated code, when everything is ready. */
        public grandEntrance() : void {
            if (this.entranceMethod) this.entranceMethod.makeEntrance(); else this.makeVisible(true);
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
         * make the whole heirarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        public makeVisible(visible : boolean) : void {
            this.isVisible = visible;
            if (visible)
                this.resumeInstancePlay();
            else
                this.pausePlay();

            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i] instanceof Mesh){
                    (<Mesh> children[i]).makeVisible(visible);

                } else{
                    children[i].isVisible = visible;
                }
            }
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
