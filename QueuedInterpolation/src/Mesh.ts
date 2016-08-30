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
    export class Mesh extends BABYLON.Mesh  implements SeriesTargetable{
        public  debug = false;
        private _engine: BABYLON.Engine;
        private _positions32F : Float32Array;
        private _normals32F   : Float32Array;
        public  originalPositions: Float32Array;
        
        private _povProcessor : PovProcessor;
        private _shapeKeyGroups = new Array<ShapeKeyGroup>();
        private _poseProcessor : PoseProcessor;
        
        // for normal processing
        private _vertexMemberOfFaces = new Array<Array<number>>(); // outer array each vertex, inner array faces vertex is a member of

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
        
        // std BJS computed shape key group, ENTIRE_MESH
        public static JUST_MAKE_VISIBLE = 0;
        public static GATHER = -1;
        public entranceMethod = Mesh.JUST_MAKE_VISIBLE; // set prior to being on screen for any effect
        
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
            this._engine = scene.getEngine(); 
            
            this._povProcessor = new PovProcessor(this, false);  // do not actually register as a beforeRender, use this classes & register below
            
            // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
            var ref = this;
            // using scene level before render, so always runs & only once per frame, incase there are multiple cameras
            scene.registerBeforeRender(function(){ref.beforeRender();});
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
                this.originalPositions = new Float32Array(data.length);
                for (var i = 0, len = data.length; i < len; i++){
                    this.originalPositions[i] = data[i];
                }
            }
            else if (kind === BABYLON.VertexBuffer.NormalKind){
                this._normals32F = this.setNormalsForCPUSkinning(); // get normals from here, so can morph & CPU skin at the same time
            }
            else if (kind === BABYLON.VertexBuffer.MatricesWeightsKind){
                // exporter assigns skeleton before setting any vertex data, so should be ok
                if (!this._poseProcessor) this._poseProcessor = new PoseProcessor(<Skeleton> this.skeleton, this, true);
            }
        }
        
        /** 
         * @override
         * wrappered so this._vertexMemberOfFaces can be built after super.setIndices() called
         */
        public setIndices(indices: number[]): void {
            super.setIndices(indices);            
           
            // now determine _vertexMemberOfFaces, to improve normals performance
            var nFaces = indices.length / 3;
            var faceOffset : number;
            
            // _vertexMemberOfFaces:  outer array each vertex, inner array faces vertex is a member of
            var nVertices = super.getTotalVertices();

            // possibly remove or comment out
            var nZeroAreaFaces = this.findZeroAreaFaces();
            if (nZeroAreaFaces > 0) BABYLON.Tools.Warn("QI.Mesh: Zero area faces found:  " + nZeroAreaFaces + ", nFaces: " + nFaces + ", nVert " + nVertices);
            
            for (var v = 0; v < nVertices; v++){
                var memberOf = new Array<number>();
                
                for (var f = 0; f < nFaces; f++){
                    faceOffset = f * 3;
                    if (indices[faceOffset] === v || indices[faceOffset + 1] === v ||indices[faceOffset + 2] === v){
                        memberOf.push(f);
                    }
                }
                this._vertexMemberOfFaces.push(memberOf);
            }     
        }
        /** bad things happen to normals when a face has no area.  Double check & put out warning in setIndices() if any found */
        private findZeroAreaFaces() : number {
            var indices = super.getIndices();
            var nFaces = indices.length / 3;
            var positions = super.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var nZeroAreaFaces = 0;
            var faceOffset : number;
            var p1 = BABYLON.Vector3.Zero();
            var p2 = BABYLON.Vector3.Zero();
            var p3 = BABYLON.Vector3.Zero();
    
            for (var f = 0; f < nFaces; f++){
                faceOffset = f * 3;
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset    ], p1);
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset + 1], p2);
                BABYLON.Vector3.FromArrayToRef(positions, 3 * indices[faceOffset + 2], p3);
                
                if (p1.equals(p2) || p1.equals(p3) || p2.equals(p3)) nZeroAreaFaces++
            }
            return nZeroAreaFaces;
        }
        // ==================================== Normals processing ===================================
        /**
         * based on http://stackoverflow.com/questions/18519586/calculate-normal-per-vertex-opengl 
         * @param {Uint32Array} vertices - the vertices which need the normals calculated, so do not have to do the entire mesh
         * @param {Float32Array} normals - the array to place the results, size:  vertices.length * 3
         * @param {Float32Array} futurePos - value of positions on which to base normals, passing since so does not have to be set to in mesh yet
         */
        public normalsforVerticesInPlace(vertices : Uint32Array, normals : Float32Array, futurePos : Float32Array) : void {
            var indices = super.getIndices();
            var nVertices = vertices.length;
            
            // Define all the reusable objects outside the for loop, so ..ToRef() & ..InPlace() versions can be used, 
            // avoiding many single use objects to garbage collect.
            var memberOfFaces : Array<number>;
            var nFaces : number;
            var faceOffset : number;
            var vertexID : number;
            var p1 = BABYLON.Vector3.Zero();
            var p2 = BABYLON.Vector3.Zero();
            var p3 = BABYLON.Vector3.Zero();
            var p1p2 = BABYLON.Vector3.Zero();
            var p3p2 = BABYLON.Vector3.Zero();

            var cross = BABYLON.Vector3.Zero();
            var normal = BABYLON.Vector3.Zero();
            var sinAlpha :number;
            var weightedAvgSum = BABYLON.Vector3.Zero();
            
            for (var v = 0; v < nVertices; v++){
                memberOfFaces = this._vertexMemberOfFaces[vertices[v]];
                nFaces = memberOfFaces.length;
                BABYLON.Vector3.FromFloatsToRef(0, 0, 0, weightedAvgSum); // initialize reused vector to all zeros
                
                for (var f = 0; f < nFaces; f++){
                    faceOffset = memberOfFaces[f] * 3;
                    vertexID = Mesh._indexOfVertInFace(indices[faceOffset], indices[faceOffset + 1], indices[faceOffset + 2], vertices[v]);
                    if (vertexID === -1) throw "QI.Mesh: vertex not part of face";  // should not happen, but better to check
                    
                    // triangleNormalFromVertex() as from example noted above
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset +   vertexID], p1);
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset + ((vertexID + 1) % 3)], p2);
                    BABYLON.Vector3.FromFloatArrayToRef(futurePos, 3 * indices[faceOffset + ((vertexID + 2) % 3)], p3);
                        
                    p1.subtractToRef(p2, p1p2);
                    p3.subtractToRef(p2, p3p2);
                    
                    BABYLON.Vector3.CrossToRef(p1p2, p3p2, cross);
                    BABYLON.Vector3.NormalizeToRef(cross, normal);
                    
                    sinAlpha = cross.length() / (p1p2.length() * p3p2.length());
                    
                    // due floating point, might not be -1 <= sinAlpha <= 1, e.g. 1.0000000000000002; fix to avoid Math.asin() from returning NaN
                    if (sinAlpha < -1) sinAlpha = -1;
                    else if (sinAlpha > 1) sinAlpha = 1;
                    
                    normal.scaleInPlace(Math.asin(sinAlpha));                    
                    weightedAvgSum.addInPlace(normal);
                }
                weightedAvgSum.normalize();
                normals[ v * 3     ] = weightedAvgSum.x;
                normals[(v * 3) + 1] = weightedAvgSum.y;
                normals[(v * 3) + 2] = weightedAvgSum.z;
            }
        }
        
        /** Front-end the normalsforVerticesInPlace() method to generate original normals for entire mesh.
         *  Optionally called by code generated by Tower of Babel.  Position & Indices must have already set.
         */
        public _generateStartingNormals() : void {
            var positions = this.originalPositions;
            var nVertices = super.getTotalVertices();
            var vertices = new Uint32Array(nVertices);
            for (var i = 0; i < nVertices; i++){
                vertices[i] = i;
            }
            var normals = new Float32Array(this.originalPositions.length);
            this.normalsforVerticesInPlace(vertices, normals, this.originalPositions);
            this.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true);
        }

        private static _indexOfVertInFace(idx0 : number, idx1 : number, idx2 : number, vertIdx : number) : number{
            if (vertIdx === idx0) return 0;
            if (vertIdx === idx1) return 1;
            if (vertIdx === idx2) return 2;
            return -1;
        }
        // =================================== EventSeries related ===================================
        public addShapeKeyGroup(shapeKeyGroup : ShapeKeyGroup) : void {
            this._shapeKeyGroups.push(shapeKeyGroup);
        }
            
        public queueSingleEvent(event : MotionEvent) : void {
            this.queueEventSeries(new EventSeries([event]));
        }
        
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        public queueEventSeries(eSeries : EventSeries, clearQueue? : boolean, stopCurrentSeries? : boolean) : void {
            var groups : Array<string>;
            if  (this.debug) groups = [];
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                if (eSeries.isGroupParticipating(this._shapeKeyGroups[g].getName())){
                    this._shapeKeyGroups[g].queueEventSeries(eSeries, clearQueue, stopCurrentSeries);
                    if (groups) groups.push(this._shapeKeyGroups[g].getName());
                }
            }
            if (eSeries.isGroupParticipating(PoseProcessor.INTERPOLATOR_GROUP_NAME)){
                this._poseProcessor.queueEventSeries(eSeries);
                if (groups) groups.push(PoseProcessor.INTERPOLATOR_GROUP_NAME);
            }
            
            if (eSeries.isGroupParticipating(PovProcessor.POV_GROUP_NAME)){
                this._povProcessor.queueEventSeries(eSeries);
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
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                if (this._shapeKeyGroups[g].getName() === groupName){
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
            if (this.skeleton){
                (<Skeleton> this.skeleton).assignPoseLibrary(libraryName);
            }
        }
        
        public assignPoseImmediately(poseName : string) : void {
             if (this.skeleton){
                (<Skeleton> this.skeleton).assignPoseImmediately(poseName);
            }
        }
        
       public addSubPose(poseName : string, immediately? : boolean) : void {
            if (this.skeleton){
                (<Skeleton> this.skeleton).addSubPose(poseName);
                if (immediately){
                    this.queueSingleEvent(new QI.PoseEvent(poseName, 1) ); // 1 milli is close enough to immediate
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
        // ============================ Mesh-instance wide play - pause ==============================
        private _instancePaused = false;
        
        public isPaused() : boolean { return this._instancePaused; }
        
        public pausePlay(){ 
             this._instancePaused = true; 
            
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                this._shapeKeyGroups[g].pauseInstance();
            }
        }       
        
        public resumeInstancePlay(){
            this._instancePaused = false;
            
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++){
                this._shapeKeyGroups[g].resumeInstancePlay();
            }
        }
    }
}
