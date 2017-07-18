/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>

module QI {
    export class GatherEntrance extends AbstractGrandEntrance {
        
        // no need for a constructor, just use super's

        /** @override */
        public makeEntrance() : void {
            var startingState = GatherEntrance.buildScatter(this._mesh);

            // queue a return to basis
            var ref = this;
            var events : Array<any>;
            events = [
                // morphImmediate to starting state prior making root mesh visible.  Start sound, if passed.
                new MorphImmediate(Mesh.COMPUTED_GROUP_NAME, startingState, 1, ref._options),

                // make root mesh visible
                function(){ref._mesh.isVisible = true;},

                // return to a basis state
                new BasisReturn(Mesh.COMPUTED_GROUP_NAME, ref.durations[0]),

                // make any children visible
                function(){
                    ref._mesh.makeVisible(true);
                    ref._mesh.removeShapeKeyGroup(Mesh.COMPUTED_GROUP_NAME);
                    ref._options = null;
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
            var center = mesh.getBoundingInfo().boundingBox.center;

            var scatter = new Float32Array(nElements);
            var amt : number;
            for (var i = 0; i < nElements; i += 3){
                amt = (mesh._originalPositions[i    ] - center.x) * Math.random();
                scatter[i    ] = mesh._originalPositions[i    ] + amt;
                
                amt = (mesh._originalPositions[i + 1] - center.y) * Math.random();
                scatter[i + 1] = mesh._originalPositions[i + 1] + amt;
                
                amt = (mesh._originalPositions[i + 2] - center.z) * Math.random();
                scatter[i + 2] = mesh._originalPositions[i + 2] + amt;
            }
            computedGroup._addShapeKey(startingState, false, scatter);
            return startingState;
        }
    }
}
