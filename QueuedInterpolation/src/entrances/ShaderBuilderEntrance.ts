/// <reference path="../Mesh.ts"/>

module QI{
    /**
     * Implemented using the ShaderBuilder extension embedded into QI.
     * This is an abstract class.  A concrete subclass needs to implement _getEffectHostMesh()
     */
    export class ShaderBuilderEntrance implements GrandEntrance {
        public static _SB_INITIALIZED = false;

        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Teleport only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        constructor(public _mesh: Mesh, public durations : Array<number>, public soundEffect? : BABYLON.Sound) {
            if (!ShaderBuilderEntrance._SB_INITIALIZED) {
                ShaderBuilderEntrance._SB_INITIALIZED = true;
                BABYLONX.ShaderBuilder.InitializeEngine();
            }        
        }
        
        /**
         * The mesh returned contains a material that was built by ShaderBuilder.  Subclass should override.
         */        
        public _getEffectHostMesh() : BABYLON.Mesh { return null; }   
        
        /**
         * Method for making the call back for the recurring event.  Subclass should override.
         */
        public _makeCallback() : (ratioComplete : number) => void { return null; }
        
        // made properties, so they can be accessed by a sub-classes _makeCallback() method
        public _effectHostMesh : BABYLON.Mesh;
        public _meshNKids : Array<BABYLON.Mesh>; 
        
        /** GrandEntrance implementation */
        public makeEntrance() : void {
            // create host mesh to handle the effect
            this._effectHostMesh = this._getEffectHostMesh();
            
            // get all child meshes, so not done in loop; set all to non-visible
            this._meshNKids = <Array<BABYLON.Mesh>> this._mesh.getDescendants();
            this._meshNKids.push(this._mesh);
            for (var i = 0, len = this._meshNKids.length; i < len; i++) {
               this._meshNKids[i].visibility = 0;
            }
            
            var ref = this;

            // queue a dispose of hostMesh & beforeRender
            var events = [
                // make mesh, kids, and effectHostMesh visible
                function() { 
                    ref._mesh.makeVisible(true); 
                    ref._effectHostMesh.setEnabled(true);
                },

                // Start sound, if passed.  Fade-in & oscillation
                new RecurringCallbackEvent(this._makeCallback(), ref.durations[0], {sound: ref.soundEffect}),

                // clean up
                function () {
                    ref._effectHostMesh.dispose();
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
            
            var boundingBox = this._mesh.getBoundingInfo().boundingBox;
            var height = boundingBox.extendSize.y * 2;
            var diameter = Math.max(boundingBox.extendSize.x, boundingBox.extendSize.z) * 2 * TeleportEntrance._RADUIS_MULT;
            
            var effectHostMesh = BABYLON.Mesh.CreateCylinder(this._mesh + "_tp", height, diameter, diameter, 30, 6,scene);
            effectHostMesh.setEnabled(false);
            
            var minY = boundingBox.minimumWorld.y;
            var maxY = boundingBox.maximumWorld.y;
            var center = boundingBox.center.clone();
            center.y = (maxY - minY) * 0.7; // use a vertical center slightly higher Y.
            effectHostMesh.position = center;
            
            var magic1 = '16.'; // 16.
            var magic2 = '0.1'; // 0.1  oscillation related
            
            var heightStr = BABYLONX.Shader.Print(height);
            var vertex = 'sin(' + magic1 + '*pos.y/' + heightStr + '-sin(pos.x*' + magic2 + '/' + heightStr + ')+1.*speed*time*' + magic2 + '),'
                  + 'sin(' + magic1 + '*pos.y/' + heightStr + '+cos(pos.z*' + magic2 + '/' + heightStr + ')+1.*speed*time*' + magic2 + ')*0.2 ,'
                  + '0.';
            console.log("vertex: " + vertex);
            
            var magic3 = '16.';
            var fragment = 'vec4(color.xyz,min((5.-' + magic3 + '*pos.y/'+ heightStr + ' ),' + magic3 + '*pos.y/' + heightStr + '*0.5+4.)*color.w*length(result.xyz)/1.5)';
            console.log("fragment: " + fragment);
            
            var sb = new BABYLONX.ShaderBuilder();
            sb.SetUniform('color','vec4');
            sb.SetUniform('speed','float');
            sb.VertexShader('result = vec4(pos+nrm*(length(vec3(' + vertex + ')))*0.6,1.);');
            sb.InLine('result = vec4( ' + vertex + ',1.);');
          
            sb.InLine('result = ' + fragment + ';');
            sb.Back('result.xyz = color.xyz;');
            sb.Transparency();

            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 0.3));
            material.setFloat('speed', 1);
            
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
                // section for host mesh oscillation / set uniforms
                var mat = (<BABYLON.ShaderMaterial> ref._effectHostMesh.material);
//                mat.setFloat('speed', Math.sin(++nCalls * 0.01) );          
//                mat.setFloat('time', nCalls);
                mat.setFloat('speed', Math.sin(ratioComplete) );          
                mat.setFloat('time', ratioComplete * 100);
            
                // section for making meshes progressively more visible, but do not start till half way
                if (ratioComplete >= .85 && ref._mesh.visibility === 0){
                    for (var i = 0, len = ref._meshNKids.length; i < len; i++) {
                       ref._meshNKids[i].visibility = 1;
                    }
                }
            };
        }
    } 
    //================================================================================================
    /**
     * Sub-class of ShaderBuilderEntrance, for using the poof entrance
     */
    export class PoofEntrance extends ShaderBuilderEntrance {
        private static _RADUIS_MULT = 1.2;
        /**
         * @override
         * Cannot be part of the constructor, since this is called before geometry is even loaded in TOB generated code.
         * Based on playground http://www.babylonjs-playground.com/#1JUXK5#21
         */        
        public _getEffectHostMesh() : BABYLON.Mesh {
            // create the host mesh and build shader
            var scene = this._mesh.getScene();
            
            var boundingBox = this._mesh.getBoundingInfo().boundingBox;
            var height = boundingBox.extendSize.y * 2;
            var radius = Math.max(Math.max(boundingBox.extendSize.x, boundingBox.extendSize.y), boundingBox.extendSize.z);
            var diameter = radius * 2 * PoofEntrance._RADUIS_MULT;
            
            var effectHostMesh =  BABYLON.Mesh.CreateSphere(this._mesh + "_tp", 40, diameter ,scene);
            effectHostMesh.setEnabled(false);            
            effectHostMesh.position = boundingBox.center.clone();
            
            var color = BABYLONX.Shader.Def({r:1.,g:1.,b:0.,a:1. },{r:1.,g:1.,b:1.,a:0.1 });
            var color2 = BABYLONX.Shader.Def({r:1.,g:0.,b:0.0,a:1. },{r:0.,g:0.,b:0.,a:0.0 });
            var bump = BABYLONX.Shader.Def(bump,0.6);
            var seed = BABYLONX.Shader.Def(seed,new Date().getMilliseconds());
            
            var heightStr = BABYLONX.Shader.Print(height);
            var vertex = 'nrm* pow(min(20.6,pow( ssp*stt*1.3*2.123423+sin(ssp*stt)*0.01,0.4)),1.)+\
               nrm* pow(  ssp*stt* 0.03*2.123423 ,\
               (abs((ssp*stt*0.003))*0.2))*3.*vec3( noise(pos*0.003+nrm+vec3(0.,-1.,0.)*(ssp*stt*0.001)\
                +ssp*stt*0.001+' + BABYLONX.Shader.Print(seed) + '*0.12568 )+\
                 0.3*noise(pos*0.02+vec3(0.,1.,0.)*(ssp*stt*0.003+' + BABYLONX.Shader.Print(seed) + '*0.12568)*0.1   ) )';
            
            console.log("vertex: " + vertex);
            
            var magic3 = '16.';
            var fragment = 'vec4(color.xyz,min((5.-' + magic3 + '*pos.y/'+ heightStr + ' ),' + magic3 + '*pos.y/' + heightStr + '*0.5+4.)*color.w*length(result.xyz)/1.5)';
            console.log("fragment: " + fragment);
            
            var sb = new BABYLONX.ShaderBuilder();
            sb.Setting.WorldPosition = true;
            sb.SetUniform('color','vec4');
            sb.SetUniform('color2','vec4');
            sb.SetUniform('speed','float');
            sb.SetUniform('st_time','float');

            sb.VertexShader(
                'wpos = pos;' + 
                'float stt = 0.;' +
                'if(st_time != 0.) stt = time-st_time;' +
                'float ssp = 1.;' +
                'if(stt < 2000.) stt = max(0., stt - stt*stt/5500.);' +
                'pos =  pos+nrm*( max(ssp*stt/75.,length(vec3('+ vertex + '))))*' + BABYLONX.Shader.Print(bump) + ' ;' +
                'result = vec4(pos,1.);');
            sb.InLine(
                'float stt = 0.;' +
                'float ssp = 1.;' +
                'if(st_time == 0.) discard;' +
                'if(st_time != 0.) stt = time-st_time;' + 
                'result = vec4( '+ vertex +',1.);' +
                'if(stt <2000.) stt = max(0., stt - stt*stt/5500.);');
            sb.Effect(<BABYLONX.IEffect> {pr:'min( 1.,max(-1.,pr))'});
          
            sb.InLine('result = vec4(  vec3(length(pos)- 10.*'+ BABYLONX.Shader.Print(radius)+' )/(20.6* '+ BABYLONX.Shader.Print(radius)+') ,1.   );');
            sb.Reference(2, null);
            sb.Effect(<BABYLONX.IEffect> {pr:'min( 1.,max(-1.,pow(pr,2.5)*7.))'});
            sb.Reference(1, null);
            sb.Solid(color);
            sb.Black(1, sb.Instance().Solid(color2).Build(), null);
            sb.Transparency();
            sb.InLine('result.xyz = length(result_1.xyz)*vec3(0.,0.,0.)*(  min(1.,max(0.,(stt - 150.)/ 1050.)))+ result.xyz*( 1.-min(1.,max(0.,(stt - 100.)/ 550.)));');
            sb.Effect(<BABYLONX.IEffect> {pr:'pow(pr,3.)*7.'});
            sb.InLine(
                'result.w = 1. - (stt-100.)/850.;' +
                'if(stt > 300.) result.w = (1.- min(1., (stt - 100.) / 850.)) * length(result_1.xyz);');
              
            var material = sb.BuildMaterial(scene);
            material.setVector4('color', new BABYLON.Vector4(1, 1, 0, 1));
            material.setVector4('color2', new BABYLON.Vector4(1, 0, 0, 1));
            material.setFloat('speed', 1);
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
                // section for host mesh oscillation / set uniforms
                var mat = (<BABYLON.ShaderMaterial> ref._effectHostMesh.material);
//                mat.setFloat('speed', Math.sin(++nCalls * 0.01) );          
//                mat.setFloat('time', nCalls);
                mat.setFloat('speed', Math.sin(ratioComplete) );          
                mat.setFloat('st_time', ratioComplete * 100);
            
                // section for making meshes progressively more visible, but do not start till half way
                if (ratioComplete >= .85 && ref._mesh.visibility === 0){
                    for (var i = 0, len = ref._meshNKids.length; i < len; i++) {
                       ref._meshNKids[i].visibility = 1;
                    }
                }
            };
        }
        
        public Helper2(parent) : BABYLONX.ShaderBuilder {
            var setting = BABYLONX.Shader.Me.Setting;
            var instance = new BABYLONX.ShaderBuilder();
            instance.Parent = parent;
            instance.Setting = parent.Setting;
    
            return instance;
        }
    }
}