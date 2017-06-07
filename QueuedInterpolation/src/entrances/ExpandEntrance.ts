/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>

module QI {
    export class ExpandEntrance extends AbstractGrandEntrance {
        private _HighLightLayer : BABYLON.HighlightLayer;

        // no need for a constructor, just use super's

        /** @override */
        public makeEntrance() : void {
            var ref = this;
            var origScaling = ref._mesh.scaling;
            ref._mesh.scaling = BABYLON.Vector3.Zero();
            
            // add the minimum steps
            var events : Array<any>;
            events = [
                // make mesh, and kids visible
                function() { ref._mesh.makeVisible(true);},

                // return to a basis state
                new PropertyEvent(ref._mesh, 'scaling', origScaling, this.durations[0], {sound : ref.soundEffect})
            ];

            var scene = this._mesh.getScene();
            // add a temporary glow for entrance when have HighlightLayer (BJS 2.5), and stencil enabled on engine
            if (BABYLON.HighlightLayer && scene.getEngine().isStencilEnable){

                // splice as first event
                events.splice(0, 0, function(){
                    // limit effect, so does not show on orthographic cameras, if any
                    var camera = (scene.activeCameras.length > 0) ? scene.activeCameras[0] : scene.activeCamera;
                    ref._HighLightLayer = new BABYLON.HighlightLayer("QI.ExpandEntrance internal", scene, {camera: camera});

                    ref._HighLightLayer.addMesh(ref._mesh, BABYLON.Color3.White());
                    
                    var kids = <Array<BABYLON.Mesh>> ref._mesh.getDescendants();
                    for (var i = 0, len = kids.length; i < len; i++) {
                        ref._HighLightLayer.addMesh(kids[i], BABYLON.Color3.White());
                    }
                });

                // add wait & clean up on the end
                events.push(new Stall(ref.durations[1]));
                events.push(function(){ ref._HighLightLayer.dispose();  });
            }

            // Make sure there is a block event for all queues not part of this entrance.
            // User could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0] + this.durations[1], Mesh.COMPUTED_GROUP_NAME);

            // run functions of series on the POV processor (default), so not dependent on a Shapekeygroup or skeleton processor existing
            var series = new EventSeries(events);

            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);

            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
         }
    }
}
