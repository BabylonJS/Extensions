/// <reference path="../Mesh.ts"/>

module QI{
    export class TeleportEntrance implements GrandEntrance {
        private static _sbInitialized = false;
        
        private _effectHostMesh : BABYLON.Mesh;

        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Teleport only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(public _mesh: Mesh, public durations : Array<number>, public soundEffect? : BABYLON.Sound) {
            if (!TeleportEntrance._sbInitialized) {
                TeleportEntrance._sbInitialized = true;
                BABYLONX.ShaderBuilder.InitializeEngine();
            }
                 
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            
            var dimensions = this._mesh.getBoundingInfo().boundingBox;
            var height = dimensions.extendSize.y;
            var radius = 1.1 * Math.max(dimensions.extendSize.x, dimensions.extendSize.z);
            
            this._effectHostMesh = BABYLON.Mesh.CreateCylinder(this._mesh + "_tp", height, radius, radius, 30, 6, scene);
                
             var s = 'sin(16.*pos.y/'+BABYLONX.Shader.Print(height)+ '-sin(pos.x*0.1/'
                   + BABYLONX.Shader.Print(height)+ ')+1.*speed*time*0.1),sin(  16.*pos.y/'
                   + BABYLONX.Shader.Print(height)+ '+cos(pos.z*0.1/'
                   + BABYLONX.Shader.Print(height)+ ')+1.*speed*time*0.1  )*0.2 ,0.';
            
            var material = new BABYLONX.ShaderBuilder()
                .SetUniform('color','vec4')
                .SetUniform('speed','float')
                .VertexShader('result = vec4(pos+nrm*(length(vec3(' + s + ')))*0.6,1.);')
                .InLine('result = vec4( ' + s + ',1.);')
          
                .InLine('result = vec4(color.xyz,min((5.-16.*pos.y/'+ BABYLONX.Shader.Print(height) + ' ),16.*pos.y/' + BABYLONX.Shader.Print(height) + '*0.5+4.)*color.w*length(result.xyz)/1.5);')
                .Back('result.xyz = color.xyz;')
                .Transparency()
                .BuildMaterial(scene);

            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 0.1));
            material.setFloat('speed', 1);
            
            this._effectHostMesh.material = material;
            this._effectHostMesh.position = dimensions.center.clone();
            this._effectHostMesh.setEnabled(false); // do not show host till mesh is ready
        }

        /** GrandEntrance implementation */
        public makeEntrance() : void {
            var meshNKids = <Array<BABYLON.Mesh>> this._mesh.getDescendants();
            meshNKids.push(this._mesh);
            
            // add scene before render for animations
            var scene = this._mesh.getScene();
            var ref = this;
            var nCalls = 0;
            var createTime = BABYLON.Tools.Now;
            var smHelper = new BABYLONX.ShaderMaterialHelper();
            var beforeRnederer = function(){
                // section for host mesh osolation / set uniforms
                (<BABYLON.ShaderMaterial> ref._effectHostMesh.material).setFloat('speed', Math.sin(++nCalls * 0.01) );          
                smHelper.SetUniforms(scene.meshes, camera.position, camera.target, { x: 0, y: 0 }, { x: 100, y: 100 }, nCalls);
                
                // section for making meshes progressively more visible
                var visibility = (BABYLON.Tools.Now - createTime) / ref.durations[0];
                for (var i = 0, len = meshNKids.length; i < len; i++) {
                   meshNKids[i].visibility = visibility;
                }
            };
            scene.registerBeforeRender(beforeRnederer);

            // queue a dispose of hostMesh & beforeRender
            var events = [
                // make mesh, kids, and effectHostMesh visible
                function() { 
                    ref._mesh.makeVisible(true); 
                },

                // Start sound, if passed.  Wait length of sound to clean up
                new Stall(ref.durations[0], PovProcessor.POV_GROUP_NAME, ref.soundEffect),

                // clean up
                function () {
                    ref._effectHostMesh.dispose();
                    scene.unregisterBeforeRender(beforeRnederer);
                    
                    // make sure fully visible, no matter what
                    for (var i = 0, len = meshNKids.length; i < len; i++) {
                       meshNKids[i].visibility = 1;
                    }
                }
            ];

            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0]);

            // run functions of series on the POV processor, so not dependent on a shapekeygroup or skeleton processor existing
            var series = new EventSeries(events);

            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);

            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        }
    }
}