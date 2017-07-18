/// <reference path="../meshes/Mesh.ts"/>
/// <reference path="./AbstractGrandEntrance.ts"/>

module QI{
    /**
     * Implemented using the ShaderBuilder extension embedded into QI.
     * This is an abstract class.  A concrete subclass needs to implement _getEffectHostMesh() & _makeCallback()
     */
    export class ShaderBuilderEntrance extends AbstractGrandEntrance {
        private static _SB_INITIALIZED = false;

        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         * @param {boolean} disposeSound - When true, dispose the sound effect on completion. (Default false)
         */
        constructor(mesh: Mesh, durations : Array<number>, soundEffect? : BABYLON.Sound, disposeSound? : boolean) {
            super(mesh, durations, soundEffect, disposeSound);

            if (!ShaderBuilderEntrance._SB_INITIALIZED) {
                ShaderBuilderEntrance._SB_INITIALIZED = true;
                BABYLONX.ShaderBuilder.InitializeEngine();
            }        
        }
        
        /**
         * The mesh returned contains a material that was built by ShaderBuilder.  Subclass should override.
         */        
        protected _getEffectHostMesh() : BABYLON.Mesh { return null; }   
        
        /**
         * Method for making the call back for the recurring event.  Subclass should override.
         */
        protected _makeCallback() : (ratioComplete : number) => void { return null; }
        
        // made properties, so they can be accessed by a sub-classes _makeCallback() method
        protected _effectHostMesh : BABYLON.Mesh;
        protected _originalScale : BABYLON.Vector3;
        
        /** @override */
        public makeEntrance() : void {
            this._originalScale = this._mesh.scaling.clone();
            this._mesh.scaling = new BABYLON.Vector3(0.0000001, 0.0000001, 0.0000001);
            
            // create host mesh to handle the effect, & disable for now
            this._effectHostMesh = this._getEffectHostMesh();
            this._effectHostMesh.setEnabled(false);
            
            var ref = this;

            // queue a dispose of hostMesh & beforeRender
            var events = [
                // make mesh, and effectHostMesh visible
                function() { 
                    ref._mesh.makeVisible(true); // includes children
                    ref._effectHostMesh.setEnabled(true);
                },

                // Start the shader effect, managed by the callback, & sound, if passed.
                new RecurringCallbackEvent(this._makeCallback(), ref.durations[0], ref._options),

                // clean up
                function () {
                    ref._effectHostMesh.dispose();
                    ref._options = null;
                }
            ];

            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0]);

            // run functions of series on the POV processor (default), so not dependent on a shapekeygroup or skeleton processor existing
            var series = new EventSeries(events);

            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);

            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        }
    }
    //================================================================================================
    //================================================================================================
    /**
     * Sub-class of ShaderBuilderEntrance, for using the teleport entrance
     */
    export class TeleportEntrance extends ShaderBuilderEntrance {
        private static _RADUIS_MULT = 1.2;
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#0
         */        
        public _getEffectHostMesh() : BABYLON.Mesh {
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            
            var dimensions = this._mesh.getSizeCenterWtKids();
            var diameter = Math.max(dimensions.size.x, dimensions.size.z) * TeleportEntrance._RADUIS_MULT;
            
            var effectHostMesh = BABYLON.Mesh.CreateCylinder(this._mesh + "_tp", dimensions.size.y, diameter, diameter, 30, 6,scene);            
            effectHostMesh.position = dimensions.center;
            
            var magic1 = '16.'; // 16.
            var magic2 = '0.1'; // 0.1  oscillation related
            
            var heightStr = BABYLONX.Shader.Print(dimensions.size.y);
            var vertex = 'sin(' + magic1 + '* pos.y /' + heightStr + ' - sin(pos.x * ' + magic2 + ' / ' + heightStr + ') + 1. * speed * time * ' + magic2 + '),'
                  + 'sin(' + magic1 + ' * pos.y / ' + heightStr + ' + cos(pos.z * ' + magic2 + ' / ' + heightStr + ') + 1. * speed * time * ' + magic2 + ') * 0.2 ,'
                  + '0.';
            
            var magic3 = '16.';
            var fragment = 'vec4(color.xyz,min((5. - ' + magic3 + ' * pos.y / '+ heightStr + ' ),' + magic3 + ' * pos.y / ' + heightStr + ' * 0.5 + 4.) * color.w * length(result.xyz) / 1.5)';
            
            var sb = new BABYLONX.ShaderBuilder();
            sb.SetUniform('color','vec4');
            sb.SetUniform('speed','float');
            sb.VertexShader('result = vec4(pos + nrm * (length(vec3( ' + vertex + ' ))) * 0.6, 1.);');
            sb.InLine('result = vec4( ' + vertex + ',1.);');
          
            sb.InLine('result = ' + fragment + ';');
            sb.Back('result.xyz = color.xyz;');
            sb.Transparency(); // assign material.needAlphaBlending = function () { return true; }

            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 0.3));
            material.setFloat('speed', 1);
            
            effectHostMesh.material = material;
            return effectHostMesh;
        }
        /**
         * @override
         * method for making the call back for the recurring event.
         */
        public _makeCallback() : (ratioComplete : number) => void {
            var ref = this;
            return function (ratioComplete) {
                // section for host mesh oscillation / set uniforms
                var mat = (<BABYLON.ShaderMaterial> ref._effectHostMesh.material);
                mat.setFloat('speed', Math.sin(ratioComplete) );          
                mat.setFloat('time', ratioComplete * 100);
            
                // section for scaling mesh back to original , but not till .85
                if (ratioComplete >= .85) {
                    ref._mesh.scaling = ref._originalScale;
                }
            };
        }
    } 
    //================================================================================================
    /**
     * Sub-class of ShaderBuilderEntrance, for using the poof entrance
     */
    export class PoofEntrance extends ShaderBuilderEntrance {
        private static _MAX_TIME = 1300;
        private _st_time = 0;
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#21
         */        
        public _getEffectHostMesh() : BABYLON.Mesh {
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            
            var dimensions = this._mesh.getSizeCenterWtKids();
            var diameter = (dimensions.size.x + dimensions.size.y + dimensions.size.z) / 3;
            var radius = diameter / 2;
            var radiusStr = radius.toFixed(1);
            
            var effectHostMesh =  BABYLON.Mesh.CreateSphere(this._mesh + "_tp", 40, diameter ,scene);
            effectHostMesh.position = dimensions.center;
            
            var color = {r:0.8, g:0.8, b:0.8, a:1.};
            var bump = '0.1';
            var seed = new Date().getMilliseconds().toFixed(1);
            
            var vertex = 'nrm * pow(min(20.6, pow(ssp * stt * 1.3 * 2.123423 + sin(ssp * stt)  *0.01 ,0.4)), 1.) + ';
            vertex    += 'nrm * pow(ssp * stt * 0.03 * 2.123423, ';
            vertex    += '(abs((ssp * stt * 0.003)) * 0.2)) * 3. * vec3(noise(pos * 0.003 + nrm + vec3(0., -1., 0.) * (ssp * stt * 0.001) + ';
            vertex    += 'ssp * stt * 0.001 + ' + seed + ' * 0.12568) + ';
            vertex    += '0.3 * noise(pos * 0.02 + vec3(0., 1., 0.) * (ssp * stt * 0.003 + ' + seed + ' * 0.12568) * 0.1) )';
            
            var sb = new BABYLONX.ShaderBuilder();
            sb.Setting.WorldPosition = true;
            sb.SetUniform('color','vec4');
            sb.SetUniform('color2','vec4');
            sb.SetUniform('speed','float');
            sb.SetUniform('st_time','float');

            sb.VertexShader(
                'wpos = pos;' + 
                'float stt = 0.;' +
                'if (st_time != 0.) stt = time - st_time;' +
                'float ssp = 1.;' +
                'if (stt < 2000.) stt = max(0., stt - stt * stt / 5500.);' +
                'pos = pos + nrm * (max(ssp * stt / 75., length(vec3('+ vertex + ')))) * ' + bump + ';' +
                'result = vec4(pos, 1.);');
            
            sb.InLine(
                'float stt = 0.;' +
                'float ssp = 1.;' +
                'if (st_time == 0.) discard;' +
                'if (st_time != 0.) stt = time - st_time;' + 
                'result = vec4( '+ vertex +', 1.);' +
                'if (stt < 2000.) stt = max(0., stt - stt * stt / 5500.);');
            
            sb.Effect(<BABYLONX.IEffect> {pr:'min(1. ,max(-1., pr))'});          
            sb.InLine('result = vec4( vec3(length(pos) - 10. * '+ radiusStr +' )/(20.6 * '+ radiusStr +'), 1.);');
            sb.Reference(2, null);
            sb.Effect(<BABYLONX.IEffect> {pr:'min(1., max(-1., pow(pr, 2.5) * 7.))'});
            sb.Reference(1, null);
            sb.Solid(color);
            sb.InLine('result.xyz = length(result_1.xyz) * vec3(0.,0.,0.) * (min(1., max(0., (stt - 150.) / 1050.))) + result.xyz * (1. - min(1., max(0., (stt - 100.) / 550.)));');
            sb.Effect(<BABYLONX.IEffect> {pr:'pow(pr, 3.) * 7.'});
            sb.InLine(
                'result.w = 1. - (stt - 100.) / 850.;' +
                'if(stt > 300.) result.w = (1.- min(1., (stt - 100.) / 850.)) * length(result_1.xyz);');
            
            sb.Transparency(); // assign material.needAlphaBlending = function () { return true; }
              
   //         console.log(sb.toScript("QI", "PoofMaterial", true));
            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 1));
            material.setVector4('color2', new BABYLON.Vector4(1, 0, 0, 1));
            material.setFloat('speed', -2.);
            material.setFloat('st_time', 0);
            
            effectHostMesh.material = material;
            return effectHostMesh;
        } 
        
        /**
         * @override
         * method for making the call back for the recurring event.  Subclass should override.
         */
        public _makeCallback() : (ratioComplete : number) => void {
            var ref = this;
            return function (ratioComplete) {
                // section for host mesh explosion / set uniforms
                var mat = (<BABYLON.ShaderMaterial> ref._effectHostMesh.material);
                if (ref._st_time === 0) {
                    ref._st_time = 0.0001;
                    mat.setFloat('st_time',ref._st_time);
                }
                mat.setFloat('time', ratioComplete * PoofEntrance._MAX_TIME);
            
                // section for scaling mesh back to original , but not till .25
                if (ratioComplete >= .25) {
                    ref._mesh.scaling = ref._originalScale;
                }
            };
        }
    }
}