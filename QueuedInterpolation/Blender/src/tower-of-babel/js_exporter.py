from .animation import *
from .armature import *
from .camera import *
from .exporter_settings_panel import *
from .light_shadow import *
from .logger import *
from .material import *
from .mesh import *
from .package_level import *
from .pose_lib import PoseLibExporter
from .sound import *
from .world import *

import bpy
from io import open
from os import path, makedirs
#===============================================================================
class JSExporter:
    nameSpace   = None  # assigned in execute
    nNonLegalNames = 0

    versionCheckCode = '' #'if (Number(B.Engine.Version.substr(0, B.Engine.Version.lastIndexOf("."))) < 2.4) throw "Babylon version too old";\n'
    logInBrowserConsole = True; # static version, set in execute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def execute(self, context, filepath):
        scene = context.scene
        self.scene = scene # reference for passing
        self.fatalError = None
        self.cameraLight = None
        try:
            self.filepathMinusExtension = filepath.rpartition('.')[0]
            JSExporter.nameSpace = getNameSpace(self.filepathMinusExtension)

            # explicitly reset globals, in case there was an earlier export this session
            JSExporter.nNonLegalNames = 0
            JSExporter.logInBrowserConsole = scene.logInBrowserConsole

            log = Logger(self.filepathMinusExtension + '.log')

            if bpy.ops.object.mode_set.poll():
                bpy.ops.object.mode_set(mode = 'OBJECT')

            # assign texture location, purely temporary if in-lining
            self.textureDir = path.dirname(filepath)
            if not scene.inlineTextures:
                self.textureDir = path.join(self.textureDir, scene.textureDir)
                if not path.isdir(self.textureDir):
                    makedirs(self.textureDir)
                    Logger.warn('Texture sub-directory did not already exist, created: ' + self.textureDir)

            Logger.log('========= Conversion from Blender to Babylon.js =========', 0)
            Logger.log('Scene settings used:', 1)
            Logger.log('selected layers only:  ' + format_bool(scene.export_onlySelectedLayer), 2)
            Logger.log('flat shading entire scene:  ' + format_bool(scene.export_flatshadeScene), 2)
            Logger.log('inline textures:  ' + format_bool(scene.inlineTextures), 2)
            if not scene.inlineTextures:
                Logger.log('texture directory:  ' + self.textureDir, 2)
            self.world = World(scene)

            bpy.ops.screen.animation_cancel()
            currentFrame = bpy.context.scene.frame_current

            # Active camera
            if scene.camera != None:
                self.activeCamera = scene.camera.name
            else:
                Logger.warn('No active camera has been assigned, or is not in a currently selected Blender layer')

            self.cameras = []
            self.lights = []
            self.shadowGenerators = []
            self.skeletons = []
            skeletonId = 0
            self.meshesAndNodes = []
            self.materials = []
            self.multiMaterials = []
            self.sounds = []
            self.needPhysics = False

            # Scene level sound
            if scene.attachedSound != '':
                self.sounds.append(Sound(scene.attachedSound, scene.autoPlaySound, scene.loopSound))

            # separate loop doing all skeletons, so available in Mesh to make skipping IK bones possible
            for object in [object for object in scene.objects]:
                scene.frame_set(currentFrame)
                if object.type == 'ARMATURE':  #skeleton.pose.bones
                    if object.is_visible(scene):
                        self.skeletons.append(Skeleton(object, scene, skeletonId, scene.ignoreIKBones))
                        skeletonId += 1
                    else:
                        Logger.warn('The following armature not visible in scene thus ignored: ' + object.name)

            # exclude lamps in this pass, so ShadowGenerator constructor can be passed meshesAnNodes
            for object in [object for object in scene.objects]:
                scene.frame_set(currentFrame)
                if object.type == 'CAMERA':
                    if object.is_visible(scene): # no isInSelectedLayer() required, is_visible() handles this for them
                        self.cameras.append(Camera(object))
                    else:
                        Logger.warn('The following camera not visible in scene thus ignored: ' + object.name)

                elif object.type == 'MESH':
                    if object.data.treatAsHair:
                        self.meshesAndNodes.append(Hair(object))
                    else:
                        forcedParent = None
                        nameID = ''
                        nextStartFace = 0
    
                        while True and self.isInSelectedLayer(object, scene):
                            mesh = Mesh(object, scene, nextStartFace, forcedParent, nameID, self)
                            if mesh.hasUnappliedTransforms and hasattr(mesh, 'skeletonWeights'):
                                self.fatalError = 'Mesh: ' + mesh.name + ' has un-applied transformations.  This will never work for a mesh with an armature.  Export cancelled'
                                Logger.log(self.fatalError)
                                return
                            
                            if hasattr(mesh, 'physicsImpostor'): self.needPhysics = True
    
                            if hasattr(mesh, 'instances'):
                                self.meshesAndNodes.append(mesh)
                            else:
                                break
    
                            if object.data.attachedSound != '':
                                self.sounds.append(Sound(object.data.attachedSound, object.data.autoPlaySound, object.data.loopSound, object))
    
                            nextStartFace = mesh.offsetFace
                            if nextStartFace == 0:
                                break
    
                            if forcedParent is None:
                                nameID = 0
                                forcedParent = object
                                Logger.warn('The following mesh has exceeded the maximum # of vertex elements & will be broken into multiple Babylon meshes: ' + object.name)
    
                            nameID = nameID + 1

                elif object.type == 'EMPTY':
                    self.meshesAndNodes.append(Node(object, scene.includeMeshFactory))

                elif object.type != 'LAMP' and object.type != 'ARMATURE':
                    Logger.warn('The following object (type - ' +  object.type + ') is not currently exportable thus ignored: ' + object.name)

            # Lamp / shadow Generator pass; meshesAnNodes complete & forceParents included
            for object in [object for object in scene.objects]:
                if object.type == 'LAMP':
                    if object.is_visible(scene): # no isInSelectedLayer() required, is_visible() handles this for them
                        bulb = Light(object, self.meshesAndNodes)
                        self.lights.append(bulb)
                        
                        if bulb.cameraLight:
                            if self.cameraLight == None:
                                self.cameraLight = bulb
                            else:
                                Logger.warn('Only camera light allowed.  Setting ignored for : ' + object.name)
                            
                        if object.data.shadowMap != 'NONE':
                            if bulb.light_type == DIRECTIONAL_LIGHT or bulb.light_type == SPOT_LIGHT:
                                self.shadowGenerators.append(ShadowGenerator(object, self.meshesAndNodes, scene))
                            else:
                                Logger.warn('Only directional (sun) and spot types of lamp are valid for shadows thus ignored: ' + object.name)
                    else:
                        Logger.warn('The following lamp not visible in scene thus ignored: ' + object.name)

            bpy.context.scene.frame_set(currentFrame)

            # convience members, for less argument passing to world
            self.hasMultiMat  = len(self.multiMaterials) > 0
            self.hasSkeletons = len(self.skeletons) > 0
            self.hasCameras   = len(self.cameras) > 0
            self.hasLights    = len(self.lights ) > 0
            self.hasShadows   = len(self.shadowGenerators) > 0
            self.hasSounds    = len(self.sounds) > 0

            # output files, .js & .d.ts
            self.to_script_file()

        except:# catch *all* exceptions
            log.log_error_stack()
            raise

        finally:
            log.close()

        self.nWarnings = log.nWarnings
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self):
        indent1 = '    '
        indent2 = '        '
        indent3 = '            '

        Logger.log('========= Writing of files started =========', 0)
        file_handler            = open(self.filepathMinusExtension + '.js'  , 'w', encoding='utf8')
        typescript_file_handler = open(self.filepathMinusExtension + '.d.ts', 'w', encoding='utf8')

        write_js_module_header(file_handler, JSExporter.nameSpace, self.hasSkeletons)
        typescript_file_handler.write('declare module ' + JSExporter.nameSpace + '{\n')

        # Pose Libraries - - - - - - - - - - - - - - - - - - - - - - - - - - -
        # before anything, so in existence when assigned by skeleton
        for skeleton in self.skeletons:
            if hasattr(skeleton, 'libraryName'):
                Logger.log('adding pose library- ' + skeleton.libraryName, 1)
                lib = PoseLibExporter()
                error = lib.perform(self.scene, file_handler, skeleton.bpySkeleton)
                if error is not None:
                    Logger.warn(error, 2)

        # World - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        # scope these regardless of initScene, so can be used for detection of
        file_handler.write(indent1 + 'var _sceneTransitionName;\n')
        file_handler.write(indent1 + 'var _overriddenMillis;\n')
        file_handler.write(indent1 + 'var _overriddenSound;\n')
        file_handler.write(indent1 + 'var _options;\n')
        if self.scene.includeInitScene:
            self.world.initScene_script(file_handler, typescript_file_handler, self.needPhysics, self)
        if self.scene.includeMeshFactory:
            self.world.meshFactory_script(file_handler, typescript_file_handler, self.meshesAndNodes, self)

        # Materials - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        file_handler.write('\n')
        file_handler.write(indent1 + 'var waitingMeshes = [];\n')
        file_handler.write(indent1 + 'var pendingTextures = 0;\n')
        if JSExporter.logInBrowserConsole:
            file_handler.write(indent1 + 'var texLoadStart = 0;\n')
        file_handler.write(indent1 + 'function onTexturesLoaded(){\n')
        file_handler.write(indent2 + 'if (--pendingTextures > 0) return;\n')
        if JSExporter.logInBrowserConsole:
            file_handler.write(indent2 + '_B.Tools.Log("Texture Load delay:  " + ((_B.Tools.Now - texLoadStart) / 1000).toFixed(2) + " secs");\n')
        file_handler.write(indent2 + 'if (_sceneTransitionName) QI.SceneTransition.perform(_sceneTransitionName, waitingMeshes, _overriddenMillis, _overriddenSound, _options);\n')
        file_handler.write(indent2 + 'else {\n')
        file_handler.write(indent3 + 'for (var i = 0, len = waitingMeshes.length; i < len; i++) {\n')
        file_handler.write(indent3 + '    if (!waitingMeshes[i].initComplete) continue;\n')
        file_handler.write(indent3 + '    if (typeof waitingMeshes[i].grandEntrance == "function") waitingMeshes[i].grandEntrance();\n')
        file_handler.write(indent3 + '    else makeVisible(waitingMeshes[i]);\n')
        file_handler.write(indent3 + '}\n')
        file_handler.write(indent2 + '}\n')
        file_handler.write(indent2 + 'waitingMeshes = [];\n')
        file_handler.write(indent2 + '_sceneTransitionName = null;\n')
        file_handler.write(indent2 + 'matLoaded = true;\n')
        file_handler.write(indent1 + '}\n\n')

        file_handler.write(indent1 + '// QI.Mesh has similar method, using this to not require QI\n')
        file_handler.write(indent1 + 'function makeVisible(mesh){\n')
        file_handler.write(indent2 + 'var children = mesh.getChildMeshes();\n')
        file_handler.write(indent2 + 'mesh.isVisible = true;\n')
        file_handler.write(indent2 + 'for (var i = 0, len = children.length; i < len; i++) {\n')
        file_handler.write(indent2 + '    children[i].isVisible = true;\n')
        file_handler.write(indent2 + '}\n')
        file_handler.write(indent1 + '}\n')
        
        # not using define_module_method, since scene arg is not wanted
        typescript_file_handler.write('\n    export function matReadAhead(materialsRootDir) : void;')
        file_handler.write('\n' + indent1 + 'var aheadQueued = false;\n')
        file_handler.write(indent1 + 'function matReadAhead(materialsRootDir) {\n')
        file_handler.write(indent2 + 'if (aheadQueued) return;\n')
        file_handler.write(indent2 + 'var txBuffer;\n')
        file_handler.write(indent2 + 'var fName;\n\n')

        for material in self.materials:
            material.to_script_file(file_handler, indent2, True)

        file_handler.write(indent2 + 'aheadQueued = true;\n')
        file_handler.write(indent1 + '}\n')
        file_handler.write(indent1 + JSExporter.nameSpace + '.matReadAhead = matReadAhead;\n')


        # always need defineMaterials, since called by meshes
        file_handler.write('\n' + indent1 + 'var matLoaded = false;')

        callArgs = []
        callArgs.append(OptionalArgument('materialsRootDir', 'string', '"./"'))
        file_handler           .write(JSExporter.define_module_method    ('defineMaterials', '', callArgs))
        typescript_file_handler.write(JSExporter.define_Typescript_method('defineMaterials', '', callArgs))

        file_handler.write(indent2 + 'if (materialsRootDir.lastIndexOf("/") + 1  !== materialsRootDir.length) { materialsRootDir  += "/"; }\n')
        file_handler.write(indent2 + 'if (typeof(QI) !== "undefined") QI.TimelineControl.initialize(scene);\n')
        file_handler.write(indent2 + 'if (typeof(TOWER_OF_BABEL) !== "undefined") TOWER_OF_BABEL.Preloader.SCENE = scene;\n')

        if JSExporter.logInBrowserConsole:
            file_handler.write(indent2 + 'var loadStart = _B.Tools.Now;\n')
        file_handler.write(indent2 + 'matReadAhead(materialsRootDir);\n')
        file_handler.write(indent2 + 'var material;\n')
        file_handler.write(indent2 + 'var texture;\n')
        file_handler.write(indent2 + 'var txBuffer;\n')

        for material in self.materials:
            material.to_script_file(file_handler, indent2, False)
        if self.hasMultiMat:
            file_handler.write(indent2 + 'var multiMaterial;\n')
            for multimaterial in self.multiMaterials:
                multimaterial.to_script_file(file_handler, indent2)
                
        file_handler.write('\n' + indent2 + 'matLoaded = pendingTextures === 0;\n')

        if JSExporter.logInBrowserConsole:
            file_handler.write(indent2 + 'if (!matLoaded) texLoadStart = _B.Tools.Now;\n')
        if JSExporter.logInBrowserConsole:
            file_handler.write(indent2 + '_B.Tools.Log("' + JSExporter.nameSpace + '.defineMaterials completed:  " + ((_B.Tools.Now - loadStart) / 1000).toFixed(2) + " secs");\n')
        file_handler.write(indent1 + '}\n')
        file_handler.write(indent1 + JSExporter.nameSpace + '.defineMaterials = defineMaterials;\n')

        # Armatures/Bones - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasSkeletons:
            for skeleton in self.skeletons:
                skeleton.to_script_file(file_handler, indent1, JSExporter.logInBrowserConsole)

        # Meshes and Nodes - - - - - - - - - - - - - - - - - - - - - - - - - - -
        for mesh in self.meshesAndNodes:
            mesh.to_script_file(file_handler, typescript_file_handler, self.get_kids(mesh), indent1, self)

        # Cameras - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasCameras:
            callArgs = []
            callArgs.append(OptionalArgument('positionOffset', 'BABYLON.Vector3'))
            file_handler           .write(JSExporter.define_module_method    ('defineCameras', '', callArgs))
            typescript_file_handler.write(JSExporter.define_Typescript_method('defineCameras', '', callArgs))

            file_handler.write(indent2 + 'var camera;\n\n') # intensionally vague, since sub-classes instances & different specific properties set
            for camera in self.cameras:
                if hasattr(camera, 'fatalProblem'): continue
                camera.update_for_target_attributes(self.meshesAndNodes)
                camera.to_script_file(file_handler, indent2)

            if hasattr(self, 'activeCamera'):
                file_handler.write(indent2 + 'scene.setActiveCameraByID("' + self.activeCamera + '");\n')
            file_handler.write(indent1 + '}\n')
            file_handler.write(indent1 + JSExporter.nameSpace + '.defineCameras = defineCameras;\n')

        # Sounds - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasSounds:
            file_handler.write('\n' + indent1 + 'var soundsLoaded = false;')

            callArgs = []
            callArgs.append(OptionalArgument('soundsRootDir', 'string', '"./"'))
            file_handler           .write(JSExporter.define_module_method    ('defineSounds', 'soundsLoaded', callArgs))
            typescript_file_handler.write(JSExporter.define_Typescript_method('defineSounds', 'soundsLoaded', callArgs))

            file_handler.write(indent2 + 'if (soundsRootDir.lastIndexOf("/") + 1  !== soundsRootDir.length) { soundsRootDir  += "/"; }\n')

            file_handler.write(indent2 + 'var sound;\n')
            file_handler.write(indent2 + 'var connectedMesh;\n\n')
            for sound in self.sounds:
                sound.to_script_file(file_handler, indent2)
            file_handler.write(indent2 + 'soundsLoaded = true;\n')
            file_handler.write(indent1 + '}\n')
            file_handler.write(indent1 + JSExporter.nameSpace + '.defineSounds = defineSounds;\n')

        # Lights - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasLights:
            callArgs = []
            callArgs.append(OptionalArgument('positionOffset', 'BABYLON.Vector3'))
            file_handler           .write(JSExporter.define_module_method    ('defineLights', '', callArgs))
            typescript_file_handler.write(JSExporter.define_Typescript_method('defineLights', '', callArgs))

            file_handler.write(indent2 + 'var light;\n\n') # intensionally vague, since sub-classes instances & different specific properties set
            for light in self.lights:
                light.to_script_file(file_handler, indent2)
                
            if self.cameraLight is not None:
                file_handler.write(indent2 + 'var camlight = scene.getLightByName("' + self.cameraLight.name + '");\n')
                file_handler.write(indent2 + 'scene.beforeCameraRender = function () {\n')
                file_handler.write(indent2 + '    var cam = (scene.activeCameras.length > 0) ? scene.activeCameras[0] : scene.activeCamera;\n')
                file_handler.write(indent2 + '    // move the light to match where the camera is\n')
                file_handler.write(indent2 + '    camlight.position = cam.position;\n')
                file_handler.write(indent2 + '    camlight.rotation = cam.rotation;\n')
                file_handler.write(indent2 + '};\n\n')
                
            if self.hasShadows:
                file_handler.write(indent2 + 'defineShadowGen(scene);\n')
            file_handler.write(indent1 + '}\n')
            file_handler.write(indent1 + JSExporter.nameSpace + '.defineLights = defineLights;\n')

        # Shadow generators - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasShadows:
            file_handler           .write(JSExporter.define_module_method    ('defineShadowGen'))
            typescript_file_handler.write(JSExporter.define_Typescript_method('defineShadowGen'))

            file_handler.write(indent2 + 'var light;\n') # intensionally vague, since scene.getLightByID() returns Light, not DirectionalLight
            file_handler.write(indent2 + 'var shadowGenerator;\n\n')
            for shadowGen in self.shadowGenerators:
                shadowGen.to_script_file(file_handler, indent2)
            file_handler.write(indent2 + 'freshenShadowRenderLists(scene);\n')
            file_handler.write(indent1 + '}\n')

        # freshenShadowRenderLists  - - - - - - - - - - - - - - - - - - - - - - -
        file_handler           .write(JSExporter.define_module_method    ('freshenShadowRenderLists'))
        typescript_file_handler.write(JSExporter.define_Typescript_method('freshenShadowRenderLists'))

        file_handler.write(indent2 + 'var renderList = [];\n')
        file_handler.write(indent2 + 'for (var i = 0; i < scene.meshes.length; i++){\n')
        file_handler.write(indent2 + '    if (scene.meshes[i]["castShadows"])\n')
        file_handler.write(indent2 + '        renderList.push(scene.meshes[i]);\n')
        file_handler.write(indent2 + '}\n\n')
        file_handler.write(indent2 + 'for (var i = 0; i < scene.lights.length; i++){\n')
        file_handler.write(indent2 + '    if (scene.lights[i]._shadowGenerator)\n')
        file_handler.write(indent2 + '        scene.lights[i]._shadowGenerator.getShadowMap().renderList = renderList;\n')
        file_handler.write(indent2 + '}\n')
        file_handler.write(indent1 + '}\n')
        file_handler.write(indent1 + JSExporter.nameSpace + '.freshenShadowRenderLists = freshenShadowRenderLists;\n')

        # Module closing - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        file_handler.write('})(' + JSExporter.nameSpace + ' || ('  + JSExporter.nameSpace + ' = {}));')
        typescript_file_handler.write('}\n')

        file_handler.close()
        typescript_file_handler.close()
        Logger.log('========= Writing of files completed =========', 0)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # material can be deleted when part of a particle hair system
    def getMaterial(self, baseMaterialId, delete = False):
        fullName = JSExporter.nameSpace + '.' + baseMaterialId
        for idx, material in enumerate(self.materials):
            if material.name == fullName:
                if delete:
                    self.materials.pop(idx)
                    Logger.log(material.name + ' removed from export', 2)
                    
                return material

        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def getSourceMeshInstance(self, dataName):
        for mesh in self.meshesAndNodes:
            # nodes have no 'dataName', cannot be instanced in any case
            if hasattr(mesh, 'dataName') and mesh.dataName == dataName:
                return mesh

        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def isInSelectedLayer(self, obj, scene):
        if not scene.export_onlySelectedLayer:
            return True

        for l in range(0, len(scene.layers)):
            if obj.layers[l] and scene.layers[l]:
                return True
        return False
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def get_skeleton(self, name):
        for skeleton in self.skeletons:
            if skeleton.name == name:
                return skeleton
        #really cannot happen, will cause exception in caller
        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # not relying on python parentObj.children, since would not account for forced parents (those meshes with > MAX_VERTEX_ELEMENTS)
    def get_kids(self, prospectiveParent):
        kids = []
        for mesh in self.meshesAndNodes:
            if hasattr(mesh, 'parentId') and mesh.parentId == prospectiveParent.name:
                kids.append(mesh)
        return kids
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def define_Typescript_method(name, loadCheckVar = '', optionalArgs = []):
        ret  = '\n    export function ' + name + '(scene : BABYLON.Scene'
        for optArg in optionalArgs:
            if optArg.default is not None: 
                ret += ', ' + optArg.argumentName + ' : ' + optArg.tsType + " = " + optArg.default
            else:
                ret += ', ' + optArg.argumentName + '? : ' + optArg.tsType
                
        ret += ') : void;\n'
        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def define_module_method(name, loadCheckVar = '', optionalArgs = []):
        ret = '\n    function ' + name + '(scene'
        if len(optionalArgs) > 0 :
            constr = ''
            defaults = ''
            for optArg in optionalArgs:
                constr   += ', ' + optArg.argumentName
                if optArg.default is not None: defaults += '        if (!' + optArg.argumentName + ') { ' + optArg.argumentName + ' = ' + optArg.default + '; }\n'
            ret += constr + ') {\n'
            if len(defaults) > 0: ret += defaults
        else:
            ret += ') {\n'

        #ret += '        ' + JSExporter.versionCheckCode
        if len(loadCheckVar) > 0 : ret += '        if (' + loadCheckVar + ') return;\n'
        return ret
