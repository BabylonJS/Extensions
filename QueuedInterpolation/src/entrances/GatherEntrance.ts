/// <reference path="../Mesh.ts"/>

module QI {
    export class GatherEntrance implements GrandEntrance {
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
            var startingState = GatherEntrance.buildScatter(this._mesh);

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

            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0], Mesh.COMPUTED_GROUP_NAME);

            // run functions of series on the compute group so everything sequential
            var series = new EventSeries(events, 1, 1.0, Mesh.COMPUTED_GROUP_NAME);

            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);

            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
         }

        /**
         * Build a SCATTER end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        public static buildScatter(mesh : Mesh) : string {
            var startingState = "SCATTER";
            var nElements = mesh._originalPositions.length;
            var computedGroup = mesh.makeComputedGroup();

            // determine the SCATTER key
            var baseFactor = 5;
            var bBox = mesh.getBoundingInfo().boundingBox;
            var center = bBox.center;

            var sz = bBox.extendSize;
            var biggest = (sz.x > sz.y && sz.x > sz.z) ? sz.x : (sz.y > sz.x && sz.y > sz.z) ? sz.y : sz.z;
            var xFactor = baseFactor * biggest / sz.x;
            var yFactor = baseFactor * biggest / sz.y;
            var zFactor = baseFactor * biggest / sz.z;

            var scatter = new Float32Array(nElements);
            for (var i = 0; i < nElements; i += 3){
                scatter[i    ] = (mesh._originalPositions[i    ] - center.x) * xFactor * Math.random();
                scatter[i + 1] = (mesh._originalPositions[i + 1] - center.y) * yFactor * Math.random();
                scatter[i + 2] = (mesh._originalPositions[i + 2] - center.z) * zFactor * Math.random();
            }
            computedGroup._addShapeKey(startingState, scatter);
            return startingState;
        }
    }
}
