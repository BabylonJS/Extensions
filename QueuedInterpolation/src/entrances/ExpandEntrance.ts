/// <reference path="../Mesh.ts"/>

module QI {
    export class ExpandEntrance implements GrandEntrance {
        private _HighLightLayer : BABYLON.HighlightLayer;

        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(public _mesh: Mesh, public durations : Array<number>, public soundEffect? : BABYLON.Sound) { }

        /** GrandEntrance implementation */
        public makeEntrance() : void {
            var startingState = ExpandEntrance.buildNucleus(this._mesh);

            // queue a return to basis
            var ref = this;
            var events : Array<any>;
            events = [
                // start sound, if passed. When using inline sound, this could be in MorphImmediate, but if changed don't know.
                new Stall(1, Mesh.COMPUTED_GROUP_NAME, ref.soundEffect),

                // morphImmediate to starting state prior making root mesh visible
                new MorphImmediate(Mesh.COMPUTED_GROUP_NAME, startingState),

                // make root mesh visible
                function(){ref._mesh.isVisible = true;},

                // return to a basis state
                new BasisReturn(Mesh.COMPUTED_GROUP_NAME, ref.durations[0]),

                // make any children visible
                function(){
                    ref._mesh.makeVisible(true);
                    ref._mesh.getShapeKeyGroup(Mesh.COMPUTED_GROUP_NAME).dispose();
                }
            ];

            var scene = this._mesh.getScene();
            // add a temporary glow for entrance when have HighlightLayer (BJS 2.5), and stencil enabled on engine
            if (BABYLON.HighlightLayer && scene.getEngine().isStencilEnable){

                // splice as first event
                events.splice(0, 0, function(){
                    // limit effect, so does not othographic cameras, if any
                    var camera = (scene.activeCameras.length > 0) ? scene.activeCameras[0] : scene.activeCamera;
                    ref._HighLightLayer = new BABYLON.HighlightLayer("QI.ExpandEntrance internal", scene, {camera: camera});

                    this._HighLightLayer.addMesh(ref._mesh, BABYLON.Color3.White());
                });

                // add wait & clean up on the end
                events.push(new Stall(ref.durations[1], Mesh.COMPUTED_GROUP_NAME));
                events.push(function(){ ref._HighLightLayer.dispose();  });
            }

            // Make sure there is a block event for all queues not part of this entrance.
            // User could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0] + this.durations[1], Mesh.COMPUTED_GROUP_NAME);

            // run functions of series on the compute group so everything sequential
            var series = new EventSeries(events, 1, 1.0, Mesh.COMPUTED_GROUP_NAME);

            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);

            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
         }

        /**
         * Build a NUCLEUS end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        public static buildNucleus(mesh : Mesh) : string {
            var startingState = "NUCLEUS";
            var nElements = mesh._originalPositions.length;
            var computedGroup = mesh.makeComputedGroup();

            var center = mesh.getBoundingInfo().boundingBox.center;

            var nucleus = new Float32Array(nElements);
            for (var i = 0; i < nElements; i += 3){
                nucleus[i    ] = center.x;
                nucleus[i + 1] = center.y;
                nucleus[i + 2] = center.z;
            }
            computedGroup._addShapeKey(startingState, nucleus);
            return startingState;
        }
    }
}
