bl_info = {
    'name': 'Tower of Babel',
    'author': 'David Catuhe, Jeff Palmer',
    'version': (4, 0, 0),
    'blender': (2, 75, 0),
    'location': 'File > Export > Tower of Babel [.js + .ts]',
    'description': 'Translate to inline JavaScript & TypeScript modules',
    'wiki_url': 'https://github.com/BabylonJS/Extensions/tree/master/QueuedInterpolation/Blender',
    'tracker_url': '',
    'category': 'Import-Export'}

import base64
import bpy
import bpy_extras.io_utils
import time
import io
import math
import mathutils
import os
import shutil
import sys, traceback # for writing errors to log file
#===============================================================================
# Registration the calling of the INFO_MT_file_export file selector
def menu_func(self, context):
    self.layout.operator(Main.bl_idname, text = 'Tower of Babel [.js + .ts]')

def register():
    bpy.utils.register_module(__name__)
    bpy.types.INFO_MT_file_export.append(menu_func)

def unregister():
    bpy.utils.unregister_module(__name__)
    bpy.types.INFO_MT_file_export.remove(menu_func)

if __name__ == '__main__':
    register()
#===============================================================================
# output related constants
MAX_VERTEX_ELEMENTS = 65535
MAX_VERTEX_ELEMENTS_32Bit = 16777216
VERTEX_OUTPUT_PER_LINE = 100
MAX_FLOAT_PRECISION = '%.4f'
COMPRESS_MATRIX_INDICES = False # this is True for .babylon exporter & False for TOB

# used in World constructor, defined in BABYLON.Scene
#FOGMODE_NONE = 0
#FOGMODE_EXP = 1
#FOGMODE_EXP2 = 2
FOGMODE_LINEAR = 3

# used in Mesh & Node constructors, defined in BABYLON.AbstractMesh
BILLBOARDMODE_NONE = 0
#BILLBOARDMODE_X = 1
#BILLBOARDMODE_Y = 2
#BILLBOARDMODE_Z = 4
BILLBOARDMODE_ALL = 7

# used in Mesh constructor, defined in BABYLON.PhysicsEngine
SPHERE_IMPOSTER = 1
BOX_IMPOSTER = 2
#PLANE_IMPOSTER = 3
MESH_IMPOSTER = 4
CAPSULE_IMPOSTER = 5
CONE_IMPOSTER = 6
CYLINDER_IMPOSTER = 7
CONVEX_HULL_IMPOSTER = 8

# camera class names, never formally defined in Babylon, but used in babylonFileLoader
ARC_ROTATE_CAM = 'ArcRotateCamera'
DEV_ORIENT_CAM = 'DeviceOrientationCamera'
FOLLOW_CAM = 'FollowCamera'
FREE_CAM = 'FreeCamera'
GAMEPAD_CAM = 'GamepadCamera'
TOUCH_CAM = 'TouchCamera'
V_JOYSTICKS_CAM = 'VirtualJoysticksCamera'
VR_DEV_ORIENT_FREE_CAM ='VRDeviceOrientationFreeCamera'
WEB_VR_FREE_CAM = 'WebVRFreeCamera'

# 3D camera rigs, defined in BABYLON.Camera, must be strings to be in 'dropdown'
RIG_MODE_NONE = '0'
RIG_MODE_STEREOSCOPIC_ANAGLYPH = '10'
RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL = '11'
RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED = '12'
RIG_MODE_STEREOSCOPIC_OVERUNDER = '13'
RIG_MODE_VR = '20'

# used in Light constructor, never formally defined in Babylon, but used in babylonFileLoader
POINT_LIGHT = 0
DIRECTIONAL_LIGHT = 1
SPOT_LIGHT = 2
HEMI_LIGHT = 3

#used in ShadowGenerators
NO_SHADOWS = 'NONE'
STD_SHADOWS = 'STD'
POISSON_SHADOWS = 'POISSON'
VARIANCE_SHADOWS = 'VARIANCE'
BLUR_VARIANCE_SHADOWS = 'BLUR_VARIANCE'

# used in Texture constructor, defined in BABYLON.Texture
CLAMP_ADDRESSMODE = 0
WRAP_ADDRESSMODE = 1
MIRROR_ADDRESSMODE = 2

# used in Texture constructor, defined in BABYLON.Texture
EXPLICIT_MODE = 0
SPHERICAL_MODE = 1
#PLANAR_MODE = 2
CUBIC_MODE = 3
#PROJECTION_MODE = 4
#SKYBOX_MODE = 5

DEFAULT_MATERIAL_NAMESPACE = 'Same as Filename'

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONTYPE_FLOAT = 0
ANIMATIONTYPE_VECTOR3 = 1
ANIMATIONTYPE_QUATERNION = 2
ANIMATIONTYPE_MATRIX = 3
#ANIMATIONTYPE_COLOR3 = 4

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONLOOPMODE_RELATIVE = 0
ANIMATIONLOOPMODE_CYCLE = 1
#ANIMATIONLOOPMODE_CONSTANT = 2
#===============================================================================
# Panel displayed in Scene Tab of properties, so settings can be saved in a .blend file
class ExporterSettingsPanel(bpy.types.Panel):
    bl_label = 'Exporter Settings'
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'scene'

    bpy.types.Scene.export_onlySelectedLayer = bpy.props.BoolProperty(
        name="Export only selected layers",
        description="Export only selected layers",
        default = False,
        )
    bpy.types.Scene.export_flatshadeScene = bpy.props.BoolProperty(
        name="Flat shade entire scene",
        description="Use face normals on all meshes.  Increases vertices.",
        default = False,
        )
    bpy.types.Scene.export_javaScript = bpy.props.BoolProperty(
        name="Export Javascript (.js) File",
        description="Produce an inline JavaScript (xxx.js) File",
        default = True,
        )
    bpy.types.Scene.export_typeScript = bpy.props.BoolProperty(
        name="Export Typescript (.ts) File",
        description="Produce an inline TypeScript (xxx.ts) File",
        default = False,
        )
    bpy.types.Scene.logInBrowserConsole = bpy.props.BoolProperty(
        name="Log in Browser Console",
        description="add console logs for calls to code",
        default = True,
        )
    bpy.types.Scene.attachedSound = bpy.props.StringProperty(
        name='Sound',
        description='',
        default = ''
        )
    bpy.types.Scene.loopSound = bpy.props.BoolProperty(
        name='Loop sound',
        description='',
        default = True
        )
    bpy.types.Scene.autoPlaySound = bpy.props.BoolProperty(
        name='Auto play sound',
        description='',
        default = True
        )
    bpy.types.Scene.inlineTextures = bpy.props.BoolProperty(
        name="inline textures",
        description="turn textures into encoded strings, for direct inclusion into source code",
        default = False,
        )
    bpy.types.Scene.includeInitScene = bpy.props.BoolProperty(
        name="Include initScene()",
        description="add an initScene() method to the .js / .ts",
        default = True,
        )
    bpy.types.Scene.includeMeshFactory = bpy.props.BoolProperty(
        name="Include MeshFactory Class",
        description="add an MeshFactory class to the .js / .ts",
        default = False,
        )

    def draw(self, context):
        layout = self.layout

        scene = context.scene
        layout.prop(scene, "export_onlySelectedLayer")
        layout.prop(scene, "export_flatshadeScene")
        layout.prop(scene, "export_javaScript")
        layout.prop(scene, "export_typeScript")
        layout.prop(scene, "logInBrowserConsole")
        layout.prop(scene, "inlineTextures")

        layout.separator()

        layout.prop(scene, "includeInitScene")
        layout.prop(scene, "includeMeshFactory")

        box = layout.box()
        box.prop(scene, 'attachedSound')
        box.prop(scene, 'autoPlaySound')
        box.prop(scene, 'loopSound')
#===============================================================================
class Main(bpy.types.Operator, bpy_extras.io_utils.ExportHelper):
    bl_idname = 'unknown.use'          # module will not load with out it, also must have a dot
    bl_label = 'TOB Export'            # used on the label of the actual 'save' button
    filename_ext = '.js'               # required to have one, although not really used
    nNonLegalNames = 0

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    log_handler = None  # assigned in execute
    nameSpace   = None  # assigned in execute
    versionCheckCode = 'if (Number(ŝ.Engine.Version.substr(0, ŝ.Engine.Version.lastIndexOf("."))) < 2.3) throw "Babylon version too old";\n'
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    nWarnings = 0
    @staticmethod
    def warn(msg, numTabIndent = 1, noNewLine = False):
        Main.log('WARNING: ' + msg, numTabIndent, noNewLine)
        Main.nWarnings += 1

    @staticmethod
    def log(msg, numTabIndent = 1, noNewLine = False):
        for i in range(numTabIndent):
            Main.log_handler.write('\t')

        Main.log_handler.write(msg)
        if not noNewLine: Main.log_handler.write('\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    logInBrowserConsole = True; # static version, set in execute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def define_module_method(name, is_typescript, loadCheckVar = '', optionalArgs = [], isExportable = True):
        if is_typescript:
            ret  = '\n    export ' if isExportable else '\n    '
            ret += 'function ' + name + '(scene : ŝ.Scene'
            for optArg in optionalArgs:
                ret += ', ' + optArg.argumentName + ' : ' + optArg.tsType + " = " + optArg.default
            ret += ') : void {\n'
        else:
            ret = '\n    function ' + name + '(scene'
            if len(optionalArgs) > 0 :
                constr = ''
                defaults = ''
                for optArg in optionalArgs:
                    constr   += ', ' + optArg.argumentName
                    defaults += '        if (!' + optArg.argumentName + ') { ' + optArg.argumentName + ' = ' + optArg.default + '; }\n'
                ret += constr + ') {\n'
                ret += defaults
            else:
                ret += ') {\n'

        ret += '        ' + Main.versionCheckCode
        if len(loadCheckVar) > 0 : ret += '        if (' + loadCheckVar + ') return;\n'

        if Main.logInBrowserConsole: ret += "        ŝ.Tools.Log('In " + Main.nameSpace + "." + name + "');\n"
        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def getMaterial(self, baseMaterialId):
        fullName = Main.nameSpace + '.' + baseMaterialId
        for material in self.materials:
            if material.name == fullName:
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
    def execute(self, context):
        scene = context.scene
        self.scene = scene # reference for passing
        try:
            start_time = time.time()
            filepathDotExtension = self.filepath.rpartition('.')
            self.filepathMinusExtension = filepathDotExtension[0]

            # assign nameSpace, based on OS
            if self.filepathMinusExtension.find('\\') != -1:
                Main.nameSpace = legal_js_identifier(self.filepathMinusExtension.rpartition('\\')[2])
            else:
                Main.nameSpace = legal_js_identifier(self.filepathMinusExtension.rpartition('/')[2])

            # explicitly reset globals, in case there was an earlier export this session
            Main.nWarnings = 0
            Main.nNonLegalNames = 0
            Main.logInBrowserConsole = scene.logInBrowserConsole

            Main.log_handler = io.open(self.filepathMinusExtension + '.log', 'w', encoding='utf8')
            version = bl_info['version']
            Main.log('Exporter version: ' + str(version[0]) + '.' + str(version[1]) +  '.' + str(version[2]) +
                             ', Blender version: ' + bpy.app.version_string)

            if bpy.ops.object.mode_set.poll():
                bpy.ops.object.mode_set(mode = 'OBJECT')

            Main.log('========= Conversion from Blender to Babylon.js =========', 0)
            Main.log('Scene settings used:', 1)
            Main.log('selected layers only:  ' + format_bool(scene.export_onlySelectedLayer), 2)
            Main.log('flat shading entire scene:  ' + format_bool(scene.export_flatshadeScene), 2)
            Main.log('inline textures:  ' + format_bool(scene.inlineTextures), 2)
            self.world = World(scene)

            bpy.ops.screen.animation_cancel()
            currentFrame = bpy.context.scene.frame_current
            bpy.context.scene.frame_set(0)

            # Active camera
            if scene.camera != None:
                self.activeCamera = scene.camera.name
            else:
                Main.warn('No active camera has been assigned, or is not in a currently selected Blender layer')

            self.cameras = []
            self.lights = []
            self.shadowGenerators = []
            self.skeletons = []
            skeletonId = 0
            self.meshesAndNodes = []
            self.materials = []
            self.multiMaterials = []
            self.sounds = []

            # Scene level sound
            if scene.attachedSound != '':
                self.sounds.append(Sound(scene.attachedSound, scene.autoPlaySound, scene.loopSound))

            # exclude lamps in this pass, so ShadowGenerator constructor can be passed meshesAnNodes
            for object in [object for object in scene.objects]:
                if object.type == 'CAMERA':
                    if object.is_visible(scene): # no isInSelectedLayer() required, is_visible() handles this for them
                        self.cameras.append(Camera(object))
                    else:
                        Main.warn('The following camera not visible in scene thus ignored: ' + object.name)

                elif object.type == 'ARMATURE':  #skeleton.pose.bones
                    if object.is_visible(scene):
                        self.skeletons.append(Skeleton(object, scene, skeletonId))
                        skeletonId += 1
                    else:
                        Main.warn('The following armature not visible in scene thus ignored: ' + object.name)

                elif object.type == 'MESH':
                    forcedParent = None
                    nameID = ''
                    nextStartFace = 0

                    while True and self.isInSelectedLayer(object, scene):
                        mesh = Mesh(object, scene, nextStartFace, forcedParent, nameID, self)
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
                            Main.warn('The following mesh has exceeded the maximum # of vertex elements & will be broken into multiple Babylon meshes: ' + object.name)

                        nameID = nameID + 1

                elif object.type == 'EMPTY':
                    self.meshesAndNodes.append(Node(object, scene.includeMeshFactory))

                elif object.type != 'LAMP':
                    Main.warn('The following object (type - ' +  object.type + ') is not currently exportable thus ignored: ' + object.name)

            # Lamp / shadow Generator pass; meshesAnNodes complete & forceParents included
            for object in [object for object in scene.objects]:
                if object.type == 'LAMP':
                    if object.is_visible(scene): # no isInSelectedLayer() required, is_visible() handles this for them
                        bulb = Light(object)
                        self.lights.append(bulb)
                        if object.data.shadowMap != 'NONE':
                            if bulb.light_type == DIRECTIONAL_LIGHT or bulb.light_type == SPOT_LIGHT:
                                self.shadowGenerators.append(ShadowGenerator(object, self.meshesAndNodes, scene))
                            else:
                                Main.warn('Only directional (sun) and spot types of lamp are valid for shadows thus ignored: ' + object.name)
                    else:
                        Main.warn('The following lamp not visible in scene thus ignored: ' + object.name)

            bpy.context.scene.frame_set(currentFrame)

            # convience members, for less argument passing to world
            self.hasMultiMat  = len(self.multiMaterials) > 0
            self.hasSkeletons = len(self.skeletons) > 0
            self.hasCameras   = len(self.cameras) > 0
            self.hasLights    = len(self.lights ) > 0
            self.hasShadows   = len(self.shadowGenerators) > 0
            self.hasSounds    = len(self.sounds) > 0

            # 2 passes of output files
            if (scene.export_typeScript): self.to_script_file(True , version)
            if (scene.export_javaScript): self.to_script_file(False, version)

        except:# catch *all* exceptions
            ex = sys.exc_info()
            Main.log('========= An error was encountered =========', 0)
            stack = traceback.format_tb(ex[2])
            for line in stack:
               Main.log_handler.write(line) # avoid tabs & extra newlines by not calling log() inside catch

            Main.log_handler.write('ERROR:  ' + str(ex[1]) + '\n')
            raise

        finally:
            Main.log('========= end of processing =========', 0)
            elapsed_time = time.time() - start_time
            minutes = math.floor(elapsed_time / 60)
            seconds = elapsed_time - (minutes * 60)
            Main.log('elapsed time:  ' + str(minutes) + ' min, ' + format_f(seconds) + ' secs', 0)
            Main.log_handler.close()

            if (Main.nWarnings > 0):
                self.report({'WARNING'}, 'Processing completed, but ' + str(Main.nWarnings) + ' WARNINGS were raised,  see log file.')

        return {'FINISHED'}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, is_typescript, TOB_version):
        indent1 = '    '
        indent2 = '        '
        close   = '}\n'        if is_typescript else '};\n'
        name    = 'typescript' if is_typescript else 'javascript'
        ext     = '.ts'        if is_typescript else '.js'

        Main.log('========= Writing of ' + name + ' file started =========', 0)
        file_handler = io.open(self.filepathMinusExtension + ext, 'w') #, encoding='utf8')

        file_handler.write('// File generated with Tower of Babel version: ' + str(TOB_version[0]) + '.' + str(TOB_version[1]) +  '.' + str(TOB_version[2]) +
                           ' on ' + time.strftime("%x") + '\n')

        # module open  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if is_typescript:
            file_handler.write('module ' + Main.nameSpace + '{\n')
            file_handler.write('    private static ŝ = BABYLON;\n')
            file_handler.write('    private static ă = ŝ.Matrix.FromValues;\n')
        else:
            file_handler.write('var __extends = this.__extends || function (d, b) {\n')
            file_handler.write('    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n')
            file_handler.write('    function __() { this.constructor = d; }\n')
            file_handler.write('    __.prototype = b.prototype;\n')
            file_handler.write('    d.prototype = new __();\n')
            file_handler.write('};\n')
            file_handler.write('var ' + Main.nameSpace + ';\n')
            file_handler.write('(function (' + Main.nameSpace + ') {\n')
            file_handler.write('    var ŝ = BABYLON;\n')
            file_handler.write('    var ă = ŝ.Matrix.FromValues;\n')

        # World - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.scene.includeInitScene:
            self.world.initScene_script(file_handler, is_typescript, self)
        if self.scene.includeMeshFactory:
            self.world.meshFactory_script(file_handler, is_typescript, self.meshesAndNodes)

        # Materials - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        # always need defineMaterials, since called by meshes
        file_handler.write('\n' + indent1 + 'var matLoaded = false;')

        callArgs = []
        callArgs.append(OptionalArgument('materialsRootDir', 'string', '"./"'))
        file_handler.write(Main.define_module_method('defineMaterials', is_typescript, 'matLoaded', callArgs))
        file_handler.write(indent2 + 'if (materialsRootDir.lastIndexOf("/") + 1  !== materialsRootDir.length) { materialsRootDir  += "/"; }\n')

        file_handler.write(indent2 + 'var material' + (' : ŝ.StandardMaterial;\n' if is_typescript else ';\n') )
        file_handler.write(indent2 + 'var texture'  + (' : ŝ.Texture;\n\n'        if is_typescript else ';\n\n') )
        for material in self.materials:
            material.to_script_file(file_handler, indent2)
        if self.hasMultiMat:
            file_handler.write(indent2 + 'var multiMaterial' + (' : ŝ.MultiMaterial;\n' if is_typescript else ';\n') )
            for multimaterial in self.multiMaterials:
                multimaterial.to_script_file(file_handler, indent2)
        file_handler.write(indent2 + 'matLoaded = true;\n')
        file_handler.write(indent1 + '}\n')
        if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.defineMaterials = defineMaterials;\n')

        # Armatures/Bones - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasSkeletons:
            file_handler.write('\n' + indent1 + 'var bonesLoaded = false;')
            file_handler.write(Main.define_module_method('defineSkeletons', is_typescript, 'bonesLoaded'))
            file_handler.write(indent2 + 'var skeleton'  + (' : ŝ.Skeleton;\n'    if is_typescript else ';\n') )
            file_handler.write(indent2 + 'var bone'      + (' : ŝ.Bone;\n'        if is_typescript else ';\n') )
            file_handler.write(indent2 + 'var animation' + (' : ŝ.Animation;\n\n' if is_typescript else ';\n\n') )
            for skeleton in self.skeletons:
                skeleton.to_script_file(file_handler, indent2)
            file_handler.write(indent2 + 'bonesLoaded = true;\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.defineSkeletons = defineSkeletons;\n')

        # Meshes and Nodes - - - - - - - - - - - - - - - - - - - - - - - - - - -
        for mesh in self.meshesAndNodes:
            mesh.to_script_file(file_handler, self.get_kids(mesh), indent1, is_typescript)

        # Cameras - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasCameras:
            file_handler.write(Main.define_module_method('defineCameras', is_typescript))
            file_handler.write(indent2 + 'var camera;\n\n') # intensionally vague, since sub-classes instances & different specifc propeties set
            for camera in self.cameras:
                if hasattr(camera, 'fatalProblem'): continue
                camera.update_for_target_attributes(self.meshesAndNodes)
                camera.to_script_file(file_handler, indent2, is_typescript)

            if hasattr(self, 'activeCamera'):
                file_handler.write(indent2 + 'scene.setActiveCameraByID("' + self.activeCamera + '");\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.defineCameras = defineCameras;\n')

        # Sounds - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasSounds:
            file_handler.write('\n' + indent1 + 'var soundsLoaded = false;')

            callArgs = []
            callArgs.append(OptionalArgument('soundsRootDir', 'string', '"./"'))
            file_handler.write(Main.define_module_method('defineSounds', is_typescript, 'soundsLoaded', callArgs))
            file_handler.write(indent2 + 'if (soundsRootDir.lastIndexOf("/") + 1  !== soundsRootDir.length) { soundsRootDir  += "/"; }\n')

            file_handler.write(indent2 + 'var sound' + (' : ŝ.Sound;\n' if is_typescript else ';\n') )
            file_handler.write(indent2 + 'var connectedMesh' + (' : ŝ.Mesh;\n\n' if is_typescript else ';\n\n') )
            for sound in self.sounds:
                sound.to_script_file(file_handler, indent2, is_typescript)
            file_handler.write(indent2 + 'soundsLoaded = true;\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.defineSounds = defineSounds;\n')

        # Lights - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasLights:
            file_handler.write(Main.define_module_method('defineLights', is_typescript))
            file_handler.write(indent2 + 'var light;\n\n') # intensionally vague, since sub-classes instances & different specifc propeties set
            for light in self.lights:
                light.to_script_file(file_handler, indent2, is_typescript)
            if self.hasShadows:
                file_handler.write(indent2 + 'defineShadowGen(scene);\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.defineLights = defineLights;\n')

        # Shadow generators - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if self.hasShadows:
            file_handler.write(Main.define_module_method('defineShadowGen', is_typescript, '', [], False))
            file_handler.write(indent2 + 'var light;\n') # intensionally vague, since scene.getLightByID() returns Light, not DirectionalLight
            file_handler.write(indent2 + 'var shadowGenerator' + (' : ŝ.ShadowGenerator;\n\n' if is_typescript else ';\n\n') )
            for shadowGen in self.shadowGenerators:
                shadowGen.to_script_file(file_handler, indent2)
            file_handler.write(indent2 + 'freshenShadowRenderLists(scene);\n')
            file_handler.write(indent1 + '}\n')

        # freshenShadowRenderLists  - - - - - - - - - - - - - - - - - - - - - - -
        file_handler.write(Main.define_module_method('freshenShadowRenderLists', is_typescript))
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
        if not is_typescript: file_handler.write(indent1 + Main.nameSpace + '.freshenShadowRenderLists = freshenShadowRenderLists;\n')

        # Module closing - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if is_typescript:
            file_handler.write('\n}')
        else:
            file_handler.write('})(' + Main.nameSpace + ' || ('  + Main.nameSpace + ' = {}));')

        file_handler.close()
        Main.log('========= Writing of ' + name + ' file completed =========', 0)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def isInSelectedLayer(self, obj, scene):
        if not scene.export_onlySelectedLayer:
            return True

        for l in range(0, len(scene.layers)):
            if obj.layers[l] and scene.layers[l]:
                return True
        return False
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # not relying on python parentObj.children, since would not account for forced parents (those meshes with > MAX_VERTEX_ELEMENTS)
    def get_kids(self, prospectiveParent):
        kids = []
        for mesh in self.meshesAndNodes:
            if hasattr(mesh, 'parentId') and mesh.parentId == prospectiveParent.name:
                kids.append(mesh)
        return kids
#===============================================================================
class OptionalArgument:
    def __init__(self, argumentName, tsType = '', default = '""'):
        self.argumentName = argumentName
        self.tsType = tsType
        self.default = default
#===============================================================================
class World:
    def __init__(self, scene):
        self.autoClear = True
        world = scene.world
        if world:
            self.ambient_color = world.ambient_color
            self.clear_color   = world.horizon_color
        else:
            self.ambient_color = mathutils.Color((0.2, 0.2, 0.3))
            self.clear_color   = mathutils.Color((0.0, 0.0, 0.0))

        self.gravity = scene.gravity

        if world and world.mist_settings.use_mist:
            self.fogMode = FOGMODE_LINEAR
            self.fogColor = world.horizon_color
            self.fogStart = world.mist_settings.start
            self.fogEnd = world.mist_settings.depth
            self.fogDensity = 0.1

        Main.log('Python World class constructor completed')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def initScene_script(self, file_handler, is_typescript, exporter):
        callArgs = []
        callArgs.append(OptionalArgument('resourcesRootDir', 'string', '"./"'))
        file_handler.write(Main.define_module_method('initScene', is_typescript, '', callArgs))

        indent = '        '
        file_handler.write(indent + 'scene.autoClear = ' + format_bool(self.autoClear) + ';\n')
        file_handler.write(indent + 'scene.clearColor    = new ŝ.Color3(' + format_color(self.clear_color) + ');\n')
        file_handler.write(indent + 'scene.ambientColor  = new ŝ.Color3(' + format_color(self.ambient_color) + ');\n')
        file_handler.write(indent + 'scene.gravity = new ŝ.Vector3(' + format_vector(self.gravity) + ');\n')

        if hasattr(self, 'fogMode'):
            file_handler.write(indent + 'scene.fogMode = ' + self.fogMode + ';\n')
            file_handler.write(indent + 'scene.fogColor = new ŝ.Color3(' + format_color(self.fogColor) + ');\n')
            file_handler.write(indent + 'scene.fogStart = ' + self.fogStart + ';\n')
            file_handler.write(indent + 'scene.fogEnd = ' + self.fogEnd + ';\n')
            file_handler.write(indent + 'scene.fogDensity = ' + self.fogDensity + ';\n')

        file_handler.write('\n' + indent + '// define materials & skeletons before meshes\n')
        file_handler.write(indent + 'defineMaterials(scene, resourcesRootDir);\n')
        if exporter.hasSkeletons: file_handler.write(indent + 'defineSkeletons(scene);\n')

        file_handler.write('\n' + indent + '// instance all root meshes\n')

        if exporter.scene.includeMeshFactory:
            factoryVersion  = indent + 'if (typeof (TOWER_OF_BABEL) !== \'undefined\'){\n'
            factoryVersion += indent + '    TOWER_OF_BABEL.MeshFactory.MODULES.push(new MeshFactory(scene));\n'

        meshIndent = indent + ('    '  if exporter.scene.includeMeshFactory else '')
        regVersion = ''
        for mesh in exporter.meshesAndNodes:
            if not hasattr(mesh, 'parentId'):
                if exporter.scene.includeMeshFactory and not hasattr(mesh, 'shapeKeyGroups'):
                    factoryVersion += meshIndent + 'TOWER_OF_BABEL.MeshFactory.instance("' + Main.nameSpace + '", "' + mesh.name + '", true);\n'
                regVersion += meshIndent + 'new ' + mesh.legalName + '("' + mesh.name + '", scene)'
                if not hasattr(mesh, 'shapeKeyGroups'):
                    regVersion += '.makeInstances();\n' if hasattr(mesh, "instances") and len(mesh.instances) > 0 else ';\n'
                else:
                    regVersion += ';\n'

        # code to optionally
        if exporter.scene.includeMeshFactory:
            file_handler.write(factoryVersion)
            file_handler.write(indent + '} else {\n')
            file_handler.write(regVersion)
            file_handler.write(indent + '}\n')
        else:
            file_handler.write(regVersion)

        if exporter.hasCameras: file_handler.write('\n' + indent + '// define cameras after meshes, incase LockedTarget is in use\n')
        if exporter.hasCameras: file_handler.write(indent +'defineCameras(scene);\n')

        if exporter.hasSounds : file_handler.write('\n' + indent + '// define sounds after meshes, incase attached\n')
        if exporter.hasSounds : file_handler.write(indent + 'defineSounds(scene, resourcesRootDir);\n')

        if exporter.hasLights : file_handler.write('\n' + indent + '// lights defined after meshes, so shadow gen\'s can also be defined\n')
        if exporter.hasLights : file_handler.write(indent + 'defineLights(scene);\n')

        file_handler.write('    }\n')
        if not is_typescript:
            file_handler.write('    ' + Main.nameSpace + '.initScene = initScene;\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def meshFactory_script(self, file_handler, is_typescript, meshesAndNodes):
        rootMeshes = []
        classNames = []
        isNode     = []
        factoryIdx = 0
        for mesh in meshesAndNodes:
            if not hasattr(mesh, 'parentId'):
                name = mesh.name
                # a few mods for special chars in fonts,  never want to do \\ replace for '""
                if '"' in name:
                    name = name.replace('"', '\\"')
                else:
                    name = name.replace('\\', '\\\\')

                rootMeshes.append(name)
                classNames.append(mesh.legalName)
                isNode.append(True if hasattr(mesh, 'isNode') else False)

                mesh.setFactoryIdx(factoryIdx)
                factoryIdx += 1

        if len(rootMeshes) == 0:
            Main.warn('No meshes without parents, so meshFactory not built')
            return

        file_handler.write('    var meshLib = new Array' + ('<Array<ŝ.Mesh>>(' if is_typescript else '(') + str(len(rootMeshes)) + ');\n')
        file_handler.write('    var cloneCount = 1;\n\n')
        file_handler.write('    var originalVerts = 0;\n')
        file_handler.write('    var clonedVerts = 0;\n')

        if is_typescript:
            file_handler.write('    export class MeshFactory implements TOWER_OF_BABEL.FactoryModule {\n')
            file_handler.write('        constructor(private _scene : ŝ.Scene, materialsRootDir: string = "./") {\n')
            file_handler.write('            defineMaterials(_scene, materialsRootDir); //embedded version check\n')
            file_handler.write('        }\n\n')
            file_handler.write('        public getModuleName() : string { return "' + Main.nameSpace + '";}\n\n')
            file_handler.write('        public instance(meshName : string, cloneSkeleton? : boolean) : ŝ.Mesh {\n')

        else:
            file_handler.write('    var MeshFactory = (function () {\n')
            file_handler.write('        function MeshFactory(_scene, materialsRootDir) {\n')
            file_handler.write('            this._scene = _scene;\n');
            file_handler.write('            if (!materialsRootDir) { materialsRootDir = "./"; }\n')
            file_handler.write('            defineMaterials(_scene, materialsRootDir); //embedded version check\n')
            file_handler.write('        }\n\n')
            file_handler.write('        MeshFactory.prototype.getModuleName = function () { return "' + Main.nameSpace + '";};\n\n')
            file_handler.write('        MeshFactory.prototype.instance = function (meshName, cloneSkeleton) {\n')

        file_handler.write('            var ret' + (':ŝ.Mesh' if is_typescript else '') + ' = null;\n')
        file_handler.write('            var src' + (':ŝ.Mesh' if is_typescript else '') + ';\n')
        file_handler.write('            switch (meshName){\n')

        for i in range(0, len(rootMeshes)):
            file_handler.write('                case "' + rootMeshes[i] + '":\n')
            file_handler.write('                    src = getViable(' + str(i) + (', true' if isNode[i] else '') + ');\n')
            file_handler.write('                    if (src === null){\n')
            file_handler.write('                        ret = new ' + classNames[i] + '("' + rootMeshes[i] + '", this._scene);\n')
            file_handler.write('                        originalVerts += ret.getTotalVertices();\n')
            file_handler.write('                        meshLib[' + str(i) + '].push(ret);\n')
            file_handler.write('                    }else{\n')
            if is_typescript:
                file_handler.write('                        ret = new ' + classNames[i] + '("' + rootMeshes[i] + '" + "_" + cloneCount++, this._scene, null, <' + classNames[i] + '> src);\n')
            else:
                file_handler.write('                        ret = new ' + classNames[i] + '("' + rootMeshes[i] + '" + "_" + cloneCount++, this._scene, null, src);\n')
            file_handler.write('                        clonedVerts += ret.getTotalVertices();\n')
            file_handler.write('                    }\n')
            file_handler.write('                    break;\n')

        file_handler.write('            }\n')
        file_handler.write('            if (ret !== null){\n')
        file_handler.write('                if (cloneSkeleton && src && src.skeleton){\n')
        file_handler.write('                    var skelName = src.skeleton.name + cloneCount;\n')
        file_handler.write('                    ret.skeleton = src.skeleton.clone(skelName, skelName);\n')
        file_handler.write('                }\n')
        file_handler.write('            }\n')
        file_handler.write('            else ŝ.Tools.Error("Mesh not found: " + meshName);\n')
        file_handler.write('            return ret;\n')

        if is_typescript:
             file_handler.write('        }\n')
             file_handler.write('    }\n')

        else:
            file_handler.write('        };\n')
            file_handler.write('        return MeshFactory;\n')
            file_handler.write('    })();\n')
            file_handler.write('    ' + Main.nameSpace + '.MeshFactory = MeshFactory;\n')

        if is_typescript:
            file_handler.write('    function getViable(libIdx : number, isNode? : boolean) : ŝ.Mesh {\n')
        else:
            file_handler.write('    function getViable(libIdx, isNode) {\n')
        file_handler.write('        var meshes = meshLib[libIdx];\n')
        file_handler.write('        if (!meshes || meshes === null){\n')
        file_handler.write('            if (!meshes) meshLib[libIdx] = new Array' + ('<ŝ.Mesh>' if is_typescript else '') + '();\n')
        file_handler.write('            return null;\n')
        file_handler.write('        }\n\n')

        file_handler.write('        for (var i = meshes.length - 1; i >= 0; i--){\n')
        file_handler.write('            if (meshes[i].geometry || isNode) return meshes[i];\n')
        file_handler.write('        }\n')
        file_handler.write('        return null;\n')
        file_handler.write('    }\n\n')

        if is_typescript:
            file_handler.write('    function clean(libIdx : number) : void {\n')
        else:
            file_handler.write('    function clean(libIdx) {\n')
        file_handler.write('        var meshes = meshLib[libIdx];\n')
        file_handler.write('        if (!meshes  || meshes === null) return;\n\n')

        file_handler.write('        var stillViable = false;\n')
        file_handler.write('        for (var i = meshes.length - 1; i >= 0; i--){\n')
        file_handler.write('            if (!meshes[i].geometry) meshes[i] = null;\n')
        file_handler.write('            else stillViable = true;\n')
        file_handler.write('        }\n')
        file_handler.write('        if (!stillViable) meshLib[libIdx] = null;\n')
        file_handler.write('    }\n\n')

        if is_typescript:
            file_handler.write('    export function getStats() : [number] { return [cloneCount, originalVerts, clonedVerts]; }\n\n')
        else:
            file_handler.write('    function getStats() { return [cloneCount, originalVerts, clonedVerts]; }' + Main.nameSpace + '.getStats = getStats;\n\n')

#===============================================================================
class Sound:
    def __init__(self, name, autoplay, loop, connectedMesh = None):
        self.name = name;
        self.autoplay = autoplay
        self.loop = loop
        if connectedMesh != None:
            self.connectedMeshId = connectedMesh.name
            self.maxDistance = connectedMesh.data.maxSoundDistance
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent, is_typescript):
        options = 'autoplay: ' + format_bool(self.autoplay) + ', loop: ' + format_bool(self.loop)
        if hasattr(self, 'connectedMeshId'):
            options += ', maxDistance: ' + format_f(self.maxDistance)

        file_handler.write('\n' + indent + 'sound = new ŝ.Sound("' + self.name + '", soundsRootDir + "' + self.name + '", scene, ')
        if is_typescript:
            file_handler.write('() => { scene._removePendingData(sound); }, ')
        else:
            file_handler.write('function () { scene._removePendingData(sound); }, ')

        file_handler.write('{' + options + '});\n')
        file_handler.write(indent + 'scene._addPendingData(sound);\n')

        if hasattr(self, 'connectedMeshId'):
            file_handler.write(indent + 'connectedMesh = scene.getMeshByID("' + self.connectedMeshId + '");\n')
            file_handler.write(indent + 'if (connectedMesh) {\n')
            file_handler.write(indent + '    newSound.attachToMesh(connectedMesh);\n')
            file_handler.write(indent + '}\n')
#===============================================================================
class FCurveAnimatable:
    def __init__(self, object, supportsRotation, supportsPosition, supportsScaling, xOffsetForRotation = 0):

        # just because a sub-class can be animatable does not mean it is
        self.animationsPresent = object.animation_data and object.animation_data.action

        rotAnim = False
        locAnim = False
        scaAnim = False
        useQuat = object.rotation_mode=='QUATERNION'

        if (self.animationsPresent):
            Main.log('FCurve animation processing begun for:  ' + object.name, 1)
            self.animations = []
            for fcurve in object.animation_data.action.fcurves:
                if supportsRotation and fcurve.data_path == 'rotation_euler' and rotAnim == False and useQuat == False:
                    self.animations.append(VectorAnimation(object, 'rotation_euler', 'rotation', -1, xOffsetForRotation))
                    rotAnim = True
                elif supportsRotation and fcurve.data_path == 'rotation_quaternion' and rotAnim == False and useQuat == True:
                    self.animations.append(QuaternionAnimation(object, 'rotation_quaternion', 'rotationQuaternion', 1, xOffsetForRotation))
                    rotAnim = True
                elif supportsPosition and fcurve.data_path == 'location' and locAnim == False:
                    self.animations.append(VectorAnimation(object, 'location', 'position', 1))
                    locAnim = True
                elif supportsScaling and fcurve.data_path == 'scale' and scaAnim == False:
                    self.animations.append(VectorAnimation(object, 'scale', 'scaling', 1))
                    scaAnim = True
            #Set Animations

            if (hasattr(object.data, "autoAnimate") and object.data.autoAnimate):
                self.autoAnimate = True
                self.autoAnimateFrom = bpy.context.scene.frame_end
                self.autoAnimateTo =  0
                for animation in self.animations:
                    if self.autoAnimateFrom > animation.get_first_frame():
                        self.autoAnimateFrom = animation.get_first_frame()
                    if self.autoAnimateTo < animation.get_last_frame():
                        self.autoAnimateTo = animation.get_last_frame()
                self.autoAnimateLoop = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, jsVarName, indent, is_typescript):
        if (self.animationsPresent):
            file_handler.write(indent + 'var animation' + (' : ŝ.Animation;\n' if is_typescript else ';\n') )
            for animation in self.animations:
                animation.to_script_file(file_handler, indent) # assigns the previously declared js variable 'animation'
                file_handler.write(indent + jsVarName + '.animations.push(animation);\n')

            if (hasattr(self, "autoAnimate") and self.autoAnimate):
                file_handler.write(indent + 'scene.beginAnimation(' + jsVarName + ', ' +
                                             format_int(self.autoAnimateFrom) + ',' +
                                             format_int(self.autoAnimateTo) + ',' +
                                             format_bool(self.autoAnimateLoop) + ', 1.0);\n')
#===============================================================================
class Mesh(FCurveAnimatable):
    def __init__(self, object, scene, startFace, forcedParent, nameID, exporter):
        super().__init__(object, True, True, True)  #Should animations be done when forcedParent

        self.name = object.name + str(nameID)
        Main.log('processing begun of mesh:  ' + self.name)

        # Tower of Babel specific member
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(Main.nNonLegalNames)
            Main.nNonLegalNames = Main.nNonLegalNames + 1

        self.isVisible = not object.hide_render
        self.isEnabled = not object.data.loadDisabled
        useFlatShading = scene.export_flatshadeScene or object.data.useFlatShading
        self.checkCollisions = object.data.checkCollisions
        self.receiveShadows = object.data.receiveShadows
        self.castShadows = object.data.castShadows
        self.freezeWorldMatrix = object.data.freezeWorldMatrix
        self.baseClass = object.data.baseClass

        # hasSkeleton detection & skeletonID determination
        hasSkeleton = False
        objArmature = None      # if there's an armature, this will be the one!
        if len(object.vertex_groups) > 0:
            objArmature = object.find_armature()
            if objArmature != None:
                hasSkeleton = True
                i = 0
                for obj in scene.objects:
                    if obj.type == "ARMATURE":
                        if obj == objArmature:
                            self.skeletonId = i
                            break
                        else:
                            i += 1

        # determine Position, rotation, & scaling
        if forcedParent is None:
            # Use local matrix
            locMatrix = object.matrix_local
            if objArmature != None:
                # unless the armature is the parent
                if object.parent and object.parent == objArmature:
                    locMatrix = object.matrix_world * object.parent.matrix_world.inverted()

            loc, rot, scale = locMatrix.decompose()
            self.position = loc
            if object.rotation_mode == 'QUATERNION':
                self.rotationQuaternion = rot
            else:
                self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
            self.scaling  = scale
        else:
            # use defaults when not None
            self.position = mathutils.Vector((0, 0, 0))
            self.rotation = scale_vector(mathutils.Vector((0, 0, 0)), 1) # isn't scaling 0's by 1 same as 0?
            self.scaling  = mathutils.Vector((1, 1, 1))

        # determine parent & dataName
        if forcedParent is None:
            self.dataName = object.data.name # used to support shared vertex instances in later passed
            if object.parent and object.parent.type != 'ARMATURE':
                self.parentId = object.parent.name
        else:
            self.dataName = self.name
            self.parentId = forcedParent.name

        # Get if this will be an instance of another, before processing materials, to avoid multi-bakes
        sourceMesh = exporter.getSourceMeshInstance(self.dataName)
        if sourceMesh is not None:
            #need to make sure rotation mode matches, since value initially copied in InstancedMesh constructor
            if hasattr(sourceMesh, 'rotationQuaternion'):
                instRot = None
                instRotq = rot
            else:
                instRot = scale_vector(rot.to_euler('XYZ'), -1)
                instRotq = None

            instance = MeshInstance(self.name, self.position, instRot, instRotq, self.scaling, self.freezeWorldMatrix)
            sourceMesh.instances.append(instance)
            Main.log('mesh is an instance of :  ' + sourceMesh.name + '.  Processing halted.', 2)
            return
        else:
            self.instances = []

        # Physics
        if object.rigid_body != None:
            shape_items = {'SPHERE'     : SPHERE_IMPOSTER,
                           'BOX'        : BOX_IMPOSTER,
                           'MESH'       : MESH_IMPOSTER,
                           'CAPSULE'    : CAPSULE_IMPOSTER,
                           'CONE'       : CONE_IMPOSTER,
                           'CYLINDER'   : CYLINDER_IMPOSTER,
                           'CONVEX_HULL': CONVEX_HULL_IMPOSTER}

            shape_type = shape_items[object.rigid_body.collision_shape]
            self.physicsImpostor = shape_type
            mass = object.rigid_body.mass
            if mass < 0.005:
                mass = 0
            self.physicsMass = mass
            self.physicsFriction = object.rigid_body.friction
            self.physicsRestitution = object.rigid_body.restitution

        # process all of the materials required
        maxVerts = MAX_VERTEX_ELEMENTS # change for multi-materials
        recipe = BakingRecipe(object)
        self.billboardMode = recipe.billboardMode

        if recipe.needsBaking:
            if recipe.multipleRenders:
                Main.warn('Mixing of Cycles & Blender Render in same mesh not supported.  No materials exported.', 2)
            else:
                bakedMat = BakedMaterial(exporter, object, recipe)
                exporter.materials.append(bakedMat)
                self.materialId = bakedMat.name

        else:
            bjs_material_slots = []
            for slot in object.material_slots:
                # None will be returned when either the first encounter or must be unique due to baked textures
                material = exporter.getMaterial(slot.name)
                if (material != None):
                    Main.log('registered as also a user of material:  ' + slot.name, 2)
                else:
                    material = StdMaterial(slot, exporter, object)
                    exporter.materials.append(material)

                bjs_material_slots.append(material)

            if len(bjs_material_slots) == 1:
                self.materialId = bjs_material_slots[0].name

            elif len(bjs_material_slots) > 1:
                multimat = MultiMaterial(bjs_material_slots, len(exporter.multiMaterials))
                self.materialId = multimat.name
                exporter.multiMaterials.append(multimat)
                maxVerts = MAX_VERTEX_ELEMENTS_32Bit
            else:
                Main.warn('No materials have been assigned: ', 2)

        # Get mesh
        mesh = object.to_mesh(scene, True, 'PREVIEW')

        # Triangulate mesh if required
        Mesh.mesh_triangulate(mesh)
        
        # Getting vertices and indices
        self.positions  = []
        self.normals    = []
        self.uvs        = [] # not always used
        self.uvs2       = [] # not always used
        self.colors     = [] # not always used
        self.indices    = []
        self.subMeshes  = []

        hasUV = len(mesh.tessface_uv_textures) > 0
        if hasUV:
            which = len(mesh.tessface_uv_textures) - 1 if recipe.needsBaking else 0
            UVmap = mesh.tessface_uv_textures[which].data

        hasUV2 = len(mesh.tessface_uv_textures) > 1 and not recipe.needsBaking
        if hasUV2:
            UV2map = mesh.tessface_uv_textures[1].data

        hasVertexColor = len(mesh.vertex_colors) > 0
        if hasVertexColor:
            Colormap = mesh.tessface_vertex_colors.active.data

        if hasSkeleton:
            weightsPerVertex = []
            indicesPerVertex = []
            influenceCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0] # 9, so accessed orign 1
            highestInfluenceObserved = 0

        hasShapeKeys = False
        if object.data.shape_keys and not object.data.ignoreShapeKeys:
            for block in object.data.shape_keys.key_blocks:
                if (block.name == 'Basis'):
                    hasShapeKeys = True
                    keyOrderMap = []
                    basis = block
                    maxVerts = MAX_VERTEX_ELEMENTS_32Bit
                    break

            if not hasShapeKeys:
                Main.warn('Basis key missing, shape-key processing NOT performed', 2)
            
        # used tracking of vertices as they are received
        alreadySavedVertices = []
        vertices_Normals = []
        vertices_UVs = []
        vertices_UV2s = []
        vertices_Colors = []
        vertices_indices = []
        vertices_sk_weights = []
        vertices_sk_indices = []
             
        self.offsetFace = 0

        for v in range(0, len(mesh.vertices)):
            alreadySavedVertices.append(False)
            vertices_Normals.append([])
            vertices_UVs.append([])
            vertices_UV2s.append([])
            vertices_Colors.append([])
            vertices_indices.append([])
            vertices_sk_weights.append([])
            vertices_sk_indices.append([])

        materialsCount = 1 if recipe.needsBaking else max(1, len(object.material_slots))
        verticesCount = 0
        indicesCount = 0

        for materialIndex in range(materialsCount):
            if self.offsetFace != 0:
                break

            subMeshVerticesStart = verticesCount
            subMeshIndexStart = indicesCount

            for faceIndex in range(startFace, len(mesh.tessfaces)):  # For each face
                face = mesh.tessfaces[faceIndex]

                if face.material_index != materialIndex and not recipe.needsBaking:
                    continue

                if verticesCount + 3 > maxVerts:
                    self.offsetFace = faceIndex
                    break

                for v in range(3): # For each vertex in face
                    vertex_index = face.vertices[v]

                    vertex = mesh.vertices[vertex_index]
                    position = vertex.co
                    normal = face.normal if useFlatShading else vertex.normal

                    #skeletons
                    if hasSkeleton:
                        matricesWeights = []
                        matricesIndices = []

                        # Getting influences
                        for group in vertex.groups:
                            index = group.group
                            weight = group.weight

                            for boneIndex, bone in enumerate(objArmature.pose.bones):
                                if object.vertex_groups[index].name == bone.name:
                                    matricesWeights.append(weight)
                                    matricesIndices.append(boneIndex)

                    # Texture coordinates
                    if hasUV:
                        vertex_UV = UVmap[face.index].uv[v]

                    if hasUV2:
                        vertex_UV2 = UV2map[face.index].uv[v]

                    # Vertex color
                    if hasVertexColor:
                        if v == 0:
                            vertex_Color = Colormap[face.index].color1
                        if v == 1:
                            vertex_Color = Colormap[face.index].color2
                        if v == 2:
                            vertex_Color = Colormap[face.index].color3

                    # Check if the current vertex is already saved
                    alreadySaved = alreadySavedVertices[vertex_index] and not useFlatShading
                    if alreadySaved:
                        alreadySaved = False

                        # UV
                        index_UV = 0
                        for savedIndex in vertices_indices[vertex_index]:
                            vNormal = vertices_Normals[vertex_index][index_UV]
                            if (normal.x != vNormal.x or normal.y != vNormal.y or normal.z != vNormal.z):
                                continue;
                            
                            if hasUV:
                                vUV = vertices_UVs[vertex_index][index_UV]
                                if (vUV[0] != vertex_UV[0] or vUV[1] != vertex_UV[1]):
                                    continue

                            if hasUV2:
                                vUV2 = vertices_UV2s[vertex_index][index_UV]
                                if (vUV2[0] != vertex_UV2[0] or vUV2[1] != vertex_UV2[1]):
                                    continue

                            if hasVertexColor:
                                vColor = vertices_Colors[vertex_index][index_UV]
                                if (vColor.r != vertex_Color.r or vColor.g != vertex_Color.g or vColor.b != vertex_Color.b):
                                    continue
                                
                            if hasSkeleton:
                                vSkWeight = vertices_sk_weights[vertex_index]
                                vSkIndices = vertices_sk_indices[vertex_index]
                                if not same_array(vSkWeight[index_UV], matricesWeights) or not same_array(vSkIndices[index_UV], matricesIndices):
                                    continue 

                            if vertices_indices[vertex_index][index_UV] >= subMeshVerticesStart:
                                alreadySaved = True
                                break

                            index_UV += 1

                    if (alreadySaved):
                        # Reuse vertex
                        index = vertices_indices[vertex_index][index_UV]
                    else:
                        # Export new one
                        index = verticesCount
                        alreadySavedVertices[vertex_index] = True
                        
                        vertices_Normals[vertex_index].append(normal)                        
                        self.normals.append(normal)
                        
                        if hasUV:
                            vertices_UVs[vertex_index].append(vertex_UV)
                            self.uvs.append(vertex_UV[0])
                            self.uvs.append(vertex_UV[1])
                        if hasUV2:
                            vertices_UV2s[vertex_index].append(vertex_UV2)
                            self.uvs2.append(vertex_UV2[0])
                            self.uvs2.append(vertex_UV2[1])
                        if hasVertexColor:
                            vertices_Colors[vertex_index].append(vertex_Color)
                            self.colors.append(vertex_Color.r)
                            self.colors.append(vertex_Color.g)
                            self.colors.append(vertex_Color.b)
                            self.colors.append(1.0)
                        if hasSkeleton:
                            vertices_sk_weights[vertex_index].append(matricesWeights)
                            vertices_sk_indices[vertex_index].append(matricesIndices)
                            nInfluencers = len(matricesWeights)
                            influenceCounts[nInfluencers] += 1
                            highestInfluenceObserved = nInfluencers if nInfluencers > highestInfluenceObserved else highestInfluenceObserved
                            weightsPerVertex.append(matricesWeights)
                            indicesPerVertex.append(matricesIndices)
                                
                        if hasShapeKeys:         
                            keyOrderMap.append([vertex_index, len(self.positions)]) # use len positions before it is append to convert from 1 to 0 origin

                        vertices_indices[vertex_index].append(index)

                        self.positions.append(position)

                        verticesCount += 1
                    self.indices.append(index)
                    indicesCount += 1

            self.subMeshes.append(SubMesh(materialIndex, subMeshVerticesStart, subMeshIndexStart, verticesCount - subMeshVerticesStart, indicesCount - subMeshIndexStart))

        if verticesCount > MAX_VERTEX_ELEMENTS:
            Main.warn('Due to multi-materials / Shapekeys & this meshes size, 32bit indices must be used.  This may not run on all hardware.', 2)

        BakedMaterial.meshBakingClean(object)

        Main.log('num positions      :  ' + str(len(self.positions)), 2)
        Main.log('num normals        :  ' + str(len(self.normals  )), 2)
        Main.log('num uvs            :  ' + str(len(self.uvs      )), 2)
        Main.log('num uvs2           :  ' + str(len(self.uvs2     )), 2)
        Main.log('num colors         :  ' + str(len(self.colors   )), 2)
        Main.log('num indices        :  ' + str(len(self.indices  )), 2)
        if hasSkeleton:
            Main.log('Skeleton stats:  ', 2)
            self.toFixedInfluencers(weightsPerVertex, indicesPerVertex, object.data.maxInfluencers, highestInfluenceObserved)
                
            if (COMPRESS_MATRIX_INDICES):
                self.skeletonIndices = Mesh.packSkeletonIndices(self.skeletonIndices)
                if (self.numBoneInfluencers > 4):
                    self.skeletonIndicesExtra = Mesh.packSkeletonIndices(self.skeletonIndicesExtra)
                
            totalInfluencers  = influenceCounts[1]
            totalInfluencers += influenceCounts[2] * 2
            totalInfluencers += influenceCounts[3] * 3
            totalInfluencers += influenceCounts[4] * 4
            totalInfluencers += influenceCounts[5] * 5
            totalInfluencers += influenceCounts[6] * 6
            totalInfluencers += influenceCounts[7] * 7
            totalInfluencers += influenceCounts[8] * 8
            Main.log('Total Influencers:  ' + format_f(totalInfluencers), 3)
            Main.log('Avg # of influencers per vertex:  ' + format_f(totalInfluencers / len(self.positions)), 3)
            Main.log('Highest # of influencers observed:  ' + str(highestInfluenceObserved) + ', num vertices with this:  ' + format_int(influenceCounts[highestInfluenceObserved]), 3)
            Main.log('exported as ' + str(self.numBoneInfluencers) + ' influencers', 3)
            nWeights = len(self.skeletonWeights) + len(self.skeletonWeightsExtra) if hasattr(self, 'skeletonWeightsExtra') else 0
            Main.log('num skeletonWeights and skeletonIndices:  ' + str(nWeights), 3)

        numZeroAreaFaces = self.find_zero_area_faces()
        if numZeroAreaFaces > 0:
            Main.warn('# of 0 area faces found:  ' + str(numZeroAreaFaces), 2)

        # shape keys for mesh
        if hasShapeKeys:
            Mesh.sort(keyOrderMap)
            rawShapeKeys = []
            groupNames = []
            Main.log('Shape Keys:', 2)
            for block in object.data.shape_keys.key_blocks:
                # perform name format validation, before processing
                keyName = block.name

                # the Basis shape key is a member of all groups, processed in 2nd pass
                if (keyName == 'Basis'): continue

                if (keyName.find('-') <= 0):
                    keyName = object.data.defaultShapeKeyGroup + '-' + keyName

                temp = keyName.upper().partition('-')
                rawShapeKeys.append(RawShapeKey(block, temp[0], temp[2], keyOrderMap, basis))

                # check for a new group, add to groupNames if so
                newGroup = True
                for group in groupNames:
                    if temp[0] == group:
                        newGroup = False
                        break
                if newGroup:
                   groupNames.append(temp[0])

            # process into ShapeKeyGroups, when rawShapeKeys found
            if (len(groupNames) > 0):
                self.shapeKeyGroups = []
                basis = RawShapeKey(basis, None, 'BASIS', keyOrderMap, basis)
                for group in groupNames:
                    self.shapeKeyGroups.append(ShapeKeyGroup(group, rawShapeKeys, basis.vertices))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def setFactoryIdx(self, factoryIdx):
        self.factoryIdx = factoryIdx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def find_zero_area_faces(self):
        nFaces = int(len(self.indices) / 3)
        nZeroAreaFaces = 0
        for f in range(0, nFaces):
            faceOffset = f * 3
            p1 = self.positions[self.indices[faceOffset    ]]
            p2 = self.positions[self.indices[faceOffset + 1]]
            p3 = self.positions[self.indices[faceOffset + 2]]

            if same_vertex(p1, p2) or same_vertex(p1, p3) or same_vertex(p2, p3): nZeroAreaFaces += 1

        return nZeroAreaFaces
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    # ShapeKeyGroup depends on AffectedIndices being in asending order, so sort it, probably nothing to do
    def sort(keyOrderMap):
        notSorted = True
        while(notSorted):
            notSorted = False
            for idx in range(1, len(keyOrderMap)):
                if keyOrderMap[idx - 1][1] > keyOrderMap[idx][1]:
                    tmp = keyOrderMap[idx]
                    keyOrderMap[idx    ] = keyOrderMap[idx - 1]
                    keyOrderMap[idx - 1] = tmp
                    notSorted = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def mesh_triangulate(mesh):
        try:
            import bmesh
            bm = bmesh.new()
            bm.from_mesh(mesh)
            bmesh.ops.triangulate(bm, faces = bm.faces)
            bm.to_mesh(mesh)
            mesh.calc_tessface()
            bm.free()
        except:
            pass
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def toFixedInfluencers(self, weightsPerVertex, indicesPerVertex, maxInfluencers, highestObserved):
        if (maxInfluencers > 8 or maxInfluencers < 1):
            maxInfluencers = 8
            Main.warn('Maximum # of influencers invalid, set to 8', 3)
            
        self.numBoneInfluencers = maxInfluencers if maxInfluencers < highestObserved else highestObserved
        needExtras = self.numBoneInfluencers > 4
        
        maxInfluencersExceeded = 0
        
        fixedWeights = []
        fixedIndices = []
        
        fixedWeightsExtra = []
        fixedIndicesExtra = []
        
        for i in range(len(weightsPerVertex)):
            weights = weightsPerVertex[i]
            indices = indicesPerVertex[i]
            nInfluencers = len(weights)
            
            if (nInfluencers > self.numBoneInfluencers):
                maxInfluencersExceeded += 1
                Mesh.sortByDescendingInfluence(weights, indices)
                
            for j in range(4):
                fixedWeights.append(weights[j] if nInfluencers > j else 0.0)
                fixedIndices.append(indices[j] if nInfluencers > j else 0  )
                
            if needExtras:
                for j in range(4, 8):
                    fixedWeightsExtra.append(weights[j] if nInfluencers > j else 0.0)
                    fixedIndicesExtra.append(indices[j] if nInfluencers > j else 0  )
                            
        self.skeletonWeights = fixedWeights
        self.skeletonIndices = fixedIndices
        
        if needExtras:
            self.skeletonWeightsExtra = fixedWeightsExtra
            self.skeletonIndicesExtra = fixedIndicesExtra
            
        if maxInfluencersExceeded > 0:
            Main.warn('Maximum # of influencers exceeded for ' + format_int(maxInfluencersExceeded) + ' vertices, extras ignored', 3)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # sorts one set of weights & indices by descending weight, by reference
    # not shown to help with MakeHuman, but did not hurt.  In just so it is not lost for future.
    @staticmethod
    def sortByDescendingInfluence(weights, indices):
        notSorted = True
        while(notSorted):
            notSorted = False
            for idx in range(1, len(weights)):
                if weights[idx - 1] < weights[idx]:
                    tmp = weights[idx]
                    weights[idx    ] = weights[idx - 1]
                    weights[idx - 1] = tmp
                    
                    tmp = indices[idx]
                    indices[idx    ] = indices[idx - 1]
                    indices[idx - 1] = tmp
                    
                    notSorted = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume that toFixedInfluencers has already run, which ensures indices length is a multiple of 4
    @staticmethod
    def packSkeletonIndices(indices):
        compressedIndices = []

        for i in range(math.floor(len(indices) / 4)):
            idx = i * 4
            matricesIndicesCompressed  = indices[idx    ]
            matricesIndicesCompressed += indices[idx + 1] <<  8
            matricesIndicesCompressed += indices[idx + 2] << 16
            matricesIndicesCompressed += indices[idx + 3] << 24
            
            compressedIndices.append(matricesIndicesCompressed)
            
        return compressedIndices
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, kids, indent, is_typescript):
        isRootMesh = not hasattr(self, 'parentId')
        mesh_node_common_script(file_handler, self, isRootMesh, kids, indent, is_typescript)
        hasShapeKeys = hasattr(self, 'shapeKeyGroups')
        baseClass = get_base_class(self)
        var = 'this' if isRootMesh else 'ret'
        indent2 = indent + ('        ' if isRootMesh else '    ')

        if hasattr(self, 'physicsImpostor'):
            file_handler.write(indent2 + 'if (!scene.isPhysicsEnabled()) {\n')
            file_handler.write(indent2 + '\tscene.enablePhysics();\n')
            file_handler.write(indent2 + '}\n')
            file_handler.write(indent2 + var + '.setPhysicsState({ impostor: '    + format_int(self.physicsImpostor) +
                                                                ', mass: '        + format_f(self.physicsMass) +
                                                                ', friction: '    + format_f(self.physicsFriction) +
                                                                ', restitution: ' + format_f(self.physicsRestitution) + '});\n')

        # section that is not done for clones
        file_handler.write(indent2 + 'if (!cloning){\n')
        indent2A = indent2 + '    '
        indent3A = indent2A + '    '
        # Geometry
        if hasattr(self, 'skeletonId'):
            file_handler.write('\n' + indent2A + 'defineSkeletons(scene);\n')
            file_handler.write(indent2A + var + '.skeleton = scene.getLastSkeletonByID("' + format_int(self.skeletonId) + '");\n')
            file_handler.write(indent2A + var + '.numBoneInfluencers = ' + format_int(self.numBoneInfluencers) + ';\n\n')
            

        file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.PositionKind, new Float32Array([\n')
        file_handler.write(indent3A + format_vector_array(self.positions, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + ']),\n')
        file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')

        file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.NormalKind, new Float32Array([\n')
        file_handler.write(indent3A + format_vector_array(self.normals, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + ']),\n')
        file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')

        if len(self.uvs) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.UVKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.uvs, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if len(self.uvs2) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.UV2Kind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.uvs2, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if len(self.colors) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.ColorKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.colors, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if hasattr(self, 'skeletonWeights'):
            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.MatricesWeightsKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.skeletonWeights, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.MatricesIndicesKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.skeletonIndices, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if hasattr(self, 'skeletonWeightsExtra'):
            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.MatricesWeightsExtraKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.skeletonWeightsExtra, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

            file_handler.write(indent2A + var + '.setVerticesData(ŝ.VertexBuffer.MatricesIndicesExtraKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.skeletonIndicesExtra, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        file_handler.write(indent2A + var + '.setIndices([\n')
        file_handler.write(indent3A + format_array(self.indices, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + ']);\n\n')

        if hasattr(self, 'materialId'): file_handler.write(indent2A + var + '.setMaterialByID("' + self.materialId + '");\n')
        # this can be in core, since submesh is same for both JS & TS
        file_handler.write(indent2A + var + '.subMeshes = [];\n')
        for subMesh in self.subMeshes:
            subMesh.to_script_file(file_handler, var, indent2A)

        # Octree, cannot predetermine since something in scene; break down and write an if
        file_handler.write(indent2A + 'if (scene["_selectionOctree"]) {// typescript safe\n')
        file_handler.write(indent3A + 'scene.createOrUpdateSelectionOctree();\n')
        file_handler.write(indent2A + '}\n')

        if (hasShapeKeys):
            file_handler.write(indent2A + 'var shapeKeyGroup' + (' : QI.ShapeKeyGroup;\n' if is_typescript else ';\n') )
            for shapeKeyGroup in self.shapeKeyGroups:
                shapeKeyGroup.to_script_file(file_handler, var, indent2A) # assigns the previously declared js variable 'shapeKeyGroup'
                file_handler.write(indent2A + 'this.addShapeKeyGroup(shapeKeyGroup);\n')

        super().to_script_file(file_handler, var, indent2A, is_typescript) # Animations

        # close no cloning section
        file_handler.write(indent2 + '}\n')

        if isRootMesh:
            file_handler.write(indent + '    }\n')

            if hasattr(self,'factoryIdx'):
                file_handler.write('\n')
                if is_typescript:
                    file_handler.write(indent + '    public dispose(doNotRecurse?: boolean): void {\n')
                    file_handler.write(indent + '        super.dispose(doNotRecurse);\n')
                    file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
                    file_handler.write(indent + '    }\n')
                else:
                    file_handler.write(indent + '    ' + self.legalName + '.prototype.dispose = function (doNotRecurse) {\n')
                    file_handler.write(indent + '        _super.prototype.dispose.call(this, doNotRecurse);\n')
                    file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
                    file_handler.write(indent + '    };\n')

            # instances handled as a separate function when a root mesh
            if len(self.instances) > 0:
                file_handler.write('\n')
                if is_typescript:
                    file_handler.write(indent + '    public makeInstances(): void {\n')
                else:
                    file_handler.write(indent + '    ' + self.legalName + '.prototype.makeInstances = function () {\n')

                self.writeMakeInstances(file_handler, var, indent + '        ')
                file_handler.write(indent + '    };\n')

            if is_typescript:
                file_handler.write(indent + '}\n')
            else:
                file_handler.write(indent + '    return ' + self.legalName + ';\n')
                file_handler.write(indent + '})(' + baseClass + ');\n')
                file_handler.write(indent + Main.nameSpace + '.' + self.legalName + ' = ' + self.legalName + ';\n')
        else:
            # instances handled as inline code when a child mesh
            if len(self.instances) > 0:
                self.writeMakeInstances(file_handler, var, indent + '    ')
            file_handler.write(indent + '    return ret;\n')
            file_handler.write(indent + '}\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def writeMakeInstances(self, file_handler, var, indent):
        file_handler.write(indent + 'var instance;\n')
        for instance in self.instances:
            file_handler.write(indent + 'instance =  ' + var + '.createInstance("' + instance.name + '");\n')
            writePosRotScale(file_handler, instance, 'instance', indent)
            file_handler.write(indent + 'instance.checkCollisions = ' + format_bool(self.checkCollisions) + ';\n')
            if self.animationsPresent:
                for idx in range(0, len(self.animations)):
                    file_handler.write(indent + 'instance.animations.push(' + var + '.animations[' + format_int(idx) + '].clone() );\n')
#===============================================================================
#  module level since called from Mesh & Node
def mesh_node_common_script(file_handler, meshOrNode, isRoot, kids, indent, is_typescript):
    isRootMesh = not hasattr(meshOrNode, 'parentId')
    hasShapeKeys = hasattr(meshOrNode, 'shapeKeyGroups')
    baseClass = get_base_class(meshOrNode)
    var = ''
    indent2 = ''
    if isRootMesh:
        var = 'this'
        indent2 = indent + '        '
        if is_typescript:
            # declaration of class & memeber kids
            file_handler.write('\n' + indent + 'export class ' + meshOrNode.legalName + ' extends ' + baseClass + ' {\n')
            for kid in kids:
                file_handler.write(indent + '    public ' + kid.legalName + ' : ' + get_base_class(kid) + ';\n')

            file_handler.write(indent + '    constructor(name: string, scene: ŝ.Scene, materialsRootDir: string = "./", source? : ' + meshOrNode.legalName + ') {\n')
            file_handler.write(indent2 + 'super(name, scene, null, source, true);\n\n')
        else:
            file_handler.write('\n' + indent + 'var ' + meshOrNode.legalName + ' = (function (_super) {\n')
            file_handler.write(indent + '    __extends(' + meshOrNode.legalName + ', _super);\n')
            file_handler.write(indent + '    function ' + meshOrNode.legalName + '(name, scene, materialsRootDir, source) {\n')
            file_handler.write(indent2 + '_super.call(this, name, scene, null, source, true);\n\n')

            file_handler.write(indent2 + 'if (!materialsRootDir) { materialsRootDir = "./"; }\n')

        file_handler.write(indent2 + 'defineMaterials(scene, materialsRootDir); //embedded version check\n')

    else:
        var = 'ret'
        indent2 = indent + '    '
        if is_typescript:
            file_handler.write('\n' + indent + 'function child_' + meshOrNode.legalName + '(scene : ŝ.Scene, parent : any, source? : any) : ' + baseClass + ' {\n')
        else:
            file_handler.write('\n' + indent + 'function child_' + meshOrNode.legalName + '(scene, parent, source){\n')

        file_handler.write(indent2 + Main.versionCheckCode)
        file_handler.write(indent2 + 'var ' + var + ' = new ' + baseClass + '(parent.name + ".' + meshOrNode.legalName + '", scene, parent, source);\n')

    file_handler.write(indent2 + "var cloning = source && source !== null;\n")

    if Main.logInBrowserConsole: file_handler.write(indent2 + "ŝ.Tools.Log('defining mesh: ' + " + var + ".name + (cloning ? ' (cloned)' : ''));\n")

    writePosRotScale(file_handler, meshOrNode, var, indent2)

    # not part of root mesh test to allow for nested parenting
    for kid in kids:
        nm = kid.legalName
        func = 'child_' + nm
        file_handler.write(indent2 + var + '.' + nm + ' = cloning ? ' + func + '(scene, ' + var + ', source.' + nm +') : ' + func + '(scene, ' + var + ');\n')
    file_handler.write('\n')


    file_handler.write(indent2 + var + '.id = ' + var + '.name;\n')
    file_handler.write(indent2 + var + '.billboardMode  = ' + format_int(meshOrNode.billboardMode) + ';\n')
    file_handler.write(indent2 + var + '.isVisible       = ' + format_bool(meshOrNode.isVisible) + ';\n')
    file_handler.write(indent2 + var + '.setEnabled(' + format_bool(meshOrNode.isEnabled) + ');\n')
    file_handler.write(indent2 + var + '.checkCollisions = ' + format_bool(meshOrNode.checkCollisions) + ';\n')
    file_handler.write(indent2 + var + '.receiveShadows  = ' + format_bool(meshOrNode.receiveShadows) + ';\n')
    file_handler.write(indent2 + var + '["castShadows"]  = ' + format_bool(meshOrNode.castShadows) + '; // typescript safe\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  module level since called from Mesh & Node, and also for instances
def writePosRotScale(file_handler, object, var, indent):
    # these need to be written prior to freezing
    # this also needs to be called in parent, prior to children instancing, so freeze works for them too
    # remember switching y with z at the same time
    file_handler.write(indent + var + '.position.x  = ' + format_f(object.position.x) + ';\n')
    file_handler.write(indent + var + '.position.y  = ' + format_f(object.position.z) + ';\n')
    file_handler.write(indent + var + '.position.z  = ' + format_f(object.position.y) + ';\n')
    if hasattr(object, 'rotation'):
        file_handler.write(indent + var + '.rotation.x  = ' + format_f(object.rotation.x) + ';\n')
        file_handler.write(indent + var + '.rotation.y  = ' + format_f(object.rotation.z) + ';\n')
        file_handler.write(indent + var + '.rotation.z  = ' + format_f(object.rotation.y) + ';\n')
    else:
        file_handler.write(indent + var + '.rotationQuaternion  = new ŝ.Quaternion(' + format_quaternion(object.rotationQuaternion) + ');\n')
    file_handler.write(indent + var + '.scaling.x   = ' + format_f(object.scaling.x) + ';\n')
    file_handler.write(indent + var + '.scaling.y   = ' + format_f(object.scaling.z) + ';\n')
    file_handler.write(indent + var + '.scaling.z   = ' + format_f(object.scaling.y) + ';\n')
    
    # need to check if present, since Node has no freezeWorldMatrix
    if hasattr(object, 'freezeWorldMatrix') and object.freezeWorldMatrix:
        file_handler.write(indent + var + '.freezeWorldMatrix();\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def get_base_class(meshOrNode):
        if len(meshOrNode.baseClass) > 0: return meshOrNode.baseClass
        else: return 'QI.Mesh' if hasattr(meshOrNode, 'shapeKeyGroups') else 'ŝ.Mesh'

#===============================================================================
class MeshInstance:
     def __init__(self, name, position, rotation, rotationQuaternion, scaling, freezeWorldMatrix):
        self.name = name
        self.position = position
        if rotation is not None:
            self.rotation = rotation
        if rotationQuaternion is not None:
            self.rotationQuaternion = rotationQuaternion
        self.scaling = scaling
        self.freezeWorldMatrix = freezeWorldMatrix
#===============================================================================
class Node(FCurveAnimatable):
    def __init__(self, node, includeMeshFactory):
        super().__init__(node, True, True, True)  #Should animations be done when forcedParent
        Main.log('processing begun of node:  ' + node.name)
        self.name = node.name
        self.baseClass = 'ŝ.Mesh'
        self.isNode = True # used in meshFactory

        # Tower of Babel specific member
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(Main.nNonLegalNames)
            Main.nNonLegalNames = Main.nNonLegalNames + 1

        if node.parent and node.parent.type != 'ARMATURE':
            self.parentId = node.parent.name

        loc, rot, scale = node.matrix_local.decompose()

        self.position = loc if not includeMeshFactory else mathutils.Vector((0, 0, 0))
        if node.rotation_mode == 'QUATERNION':
            self.rotationQuaternion = rot
        else:
            self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
        self.scaling = scale
        self.isVisible = False
        self.isEnabled = True
        self.checkCollisions = False
        self.billboardMode = BILLBOARDMODE_NONE
        self.castShadows = False
        self.receiveShadows = False
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def setFactoryIdx(self, factoryIdx):
        self.factoryIdx = factoryIdx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, kids, indent, is_typescript):
        isRootNode = not hasattr(self, 'parentId')
        mesh_node_common_script(file_handler, self, isRootNode, kids, indent, is_typescript)

        if isRootNode:
            file_handler.write(indent + '    }\n')

            if hasattr(self,'factoryIdx'):
                file_handler.write('\n')
                if is_typescript:
                    file_handler.write(indent + '    public dispose(doNotRecurse?: boolean): void {\n')
                    file_handler.write(indent + '        super.dispose(doNotRecurse);\n')
                    file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
                    file_handler.write(indent + '    }\n')
                else:
                    file_handler.write(indent + '    ' + self.legalName + '.prototype.dispose = function (doNotRecurse) {\n')
                    file_handler.write(indent + '        super.dispose(doNotRecurse);\n')
                    file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
                    file_handler.write(indent + '    };\n')

            if is_typescript:
                file_handler.write(indent + '}\n')
            else:
                file_handler.write(indent + '    return ' + self.legalName + ';\n')
                file_handler.write(indent + '})(ŝ.Mesh);\n')
        else:
            file_handler.write(indent + '    return ret;\n')
            file_handler.write(indent + '}\n')
#===============================================================================
class SubMesh:
    def __init__(self, materialIndex, verticesStart, indexStart, verticesCount, indexCount):
        self.materialIndex = materialIndex
        self.verticesStart = verticesStart
        self.indexStart = indexStart
        self.verticesCount = verticesCount
        self.indexCount = indexCount
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, jsMeshVar, indent):
        file_handler.write(indent + 'new ŝ.SubMesh(' +
                          format_int(self.materialIndex) + ', ' +
                          format_int(self.verticesStart) + ', ' +
                          format_int(self.verticesCount) + ', ' +
                          format_int(self.indexStart)    + ', ' +
                          format_int(self.indexCount)    + ', ' + jsMeshVar + ');\n')
#===============================================================================
# extract data in Mesh order, no optimization from group analyse yet; mapped into a copy of position
class RawShapeKey:
    def __init__(self, keyBlock, group, state, keyOrderMap, basis):
        self.group = group
        self.state = state
        self.vertices = []

        retSz = len(keyOrderMap)
        for i in range(0, retSz):
            self.vertices.append(None)

        nDifferent = 0
        for i in range(0, retSz):
            pair = keyOrderMap[i]
            value = keyBlock.data[pair[0]].co
            self.vertices[pair[1]] = value
            if not same_vertex(value, basis.data[pair[0]].co):                
                nDifferent += 1

        if state != 'BASIS':
            Main.log('shape key "' + group + '-' + state + '":  n verts different from basis: ' + str(nDifferent), 3)
#===============================================================================
class ShapeKeyGroup:
    def __init__(self, group, rawShapeKeys, basisVerts):
        self.group = group
        self.stateNames = []
        self.stateVertices = []
        self.affectedIndices = []

        nRawKeys = len(rawShapeKeys)
        nSize = len(basisVerts)

        sameForAll = []
        for i in range(0, nSize):
            sameForAll.append(True)

        # first pass to determine which vertices are not the same across all members of a group & also positions
        for i in range(0, nSize):
            for key in rawShapeKeys:
                # no need for more checking once 1 difference is found
                if not sameForAll[i]:
                    break;

                # skip key if not member of the current group being processed
                if group != key.group:
                    continue;

                # check vertex not different from Basis
                if not same_vertex(key.vertices[i],  basisVerts[i]):
                    sameForAll[i] = False
                    break;

        affectedWholeVertices = []
        affectedVertices = []
        # pass to convert sameForAll into self.affectedIndices, build 'BASIS' state at the same time
        for i in range(0, nSize):
            if not sameForAll[i]:
                affectedWholeVertices.append(i)
                self.affectedIndices.append(i * 3 + 0)
                self.affectedIndices.append(i * 3 + 1)
                self.affectedIndices.append(i * 3 + 2)
                affectedVertices.append(basisVerts[i])

        self.basisState = affectedVertices
        Main.log('Shape-key group, ' + group + ', # of affected vertices: '+ str(len(affectedWholeVertices)) + ', out of ' + str(nSize), 2)

        # pass to convert rawShapeKeys in this group, to stateVertices of only affected indices
        for key in rawShapeKeys:
            if group != key.group:
                continue;

            affectedVertices = []
            for idx in affectedWholeVertices:
                affectedVertices.append(key.vertices[idx])

            self.stateNames.append(key.state)
            self.stateVertices.append(affectedVertices)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, var, indent):
        indent2 = indent + '    '
        file_handler.write(indent  + 'shapeKeyGroup = new QI.ShapeKeyGroup(' + var + ', "' + self.group + '", new Uint32Array([\n')
        file_handler.write(indent2 + format_array(self.affectedIndices, VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
        file_handler.write(indent  + ']), new Float32Array([\n')
        file_handler.write(indent2 + format_vector_array(self.basisState, VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
        file_handler.write(indent  + ']));\n')

        for state_idx in range(len(self.stateVertices)):
            file_handler.write(indent  + 'shapeKeyGroup._addShapeKey("' + self.stateNames[state_idx] + '", new Float32Array([\n')
            file_handler.write(indent2 + format_vector_array(self.stateVertices[state_idx], VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
            file_handler.write(indent  + ']));\n')
#===============================================================================
class Bone:
    def __init__(self, bone, skeleton, scene, index):
        Main.log('processing begun of bone:  ' + bone.name + ', index:  '+ str(index), 2)
        self.name = bone.name
        self.index = index

        matrix_world = skeleton.matrix_world
        self.matrix = Bone.get_matrix(bone, matrix_world)

        parentId = -1
        if (bone.parent):
            for parent in skeleton.pose.bones:
                parentId += 1
                if parent == bone.parent:
                    break;

        self.parentBoneIndex = parentId

        #animation
        if (skeleton.animation_data):
            Main.log('animation begun of bone:  ' + self.name, 3)
            self.animation = Animation(ANIMATIONTYPE_MATRIX, scene.render.fps, ANIMATIONLOOPMODE_CYCLE, 'anim', '_matrix')

            start_frame = scene.frame_start
            end_frame = scene.frame_end
            previousBoneMatrix = None
            for frame in range(start_frame, end_frame + 1):
                bpy.context.scene.frame_set(frame)
                currentBoneMatrix = Bone.get_matrix(bone, matrix_world)

                if (frame != end_frame and currentBoneMatrix == previousBoneMatrix):
                    continue

                self.animation.frames.append(frame)
                self.animation.values.append(Bone.get_matrix(bone, matrix_world))
                previousBoneMatrix = currentBoneMatrix

            bpy.context.scene.frame_set(start_frame)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def get_matrix(bone, matrix_world):
        SystemMatrix = mathutils.Matrix.Scale(-1, 4, mathutils.Vector((0, 0, 1))) * mathutils.Matrix.Rotation(math.radians(-90), 4, 'X')

        if (bone.parent):
            return (SystemMatrix * matrix_world * bone.parent.matrix).inverted() * (SystemMatrix * matrix_world * bone.matrix)
        else:
            return SystemMatrix * matrix_world * bone.matrix
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume the following JS variables have already been declared: skeleton, bone, animation
    def to_script_file(self, file_handler, indent):
        parentBone = 'skeleton.bones[' + format_int(self.parentBoneIndex) + ']' if self.parentBoneIndex != -1 else 'null'

        file_handler.write(indent + 'bone = new ŝ.Bone("' + self.name + '", skeleton,' + parentBone + ', ă(' + format_matrix4(self.matrix) + '));\n')

        if hasattr(self, 'animation'):
            self.animation.to_script_file(file_handler, indent) # declares and set the variable animation
            file_handler.write(indent + 'bone.animations.push(animation);\n\n')
#===============================================================================
class Skeleton:
    def __init__(self, skeleton, scene, id):
        Main.log('processing begun of skeleton:  ' + skeleton.name + ', id:  '+ str(id))
        self.name = skeleton.name
        self.id = id
        self.bones = []

        bones = skeleton.pose.bones
        j = 0
        for bone in bones:
            self.bones.append(Bone(bone, skeleton, scene, j))
            j = j + 1

        Main.log('processing complete of skeleton:  ' + skeleton.name)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume the following JS variables have already been declared: scene, skeleton, bone, animation
    def to_script_file(self, file_handler, indent):
        # specifying scene gets skeleton added to scene in constructor
        if Main.logInBrowserConsole: file_handler.write(indent + "ŝ.Tools.Log('defining skeleton:  " + self.name + "');\n")
        file_handler.write(indent + 'skeleton = new ŝ.Skeleton("' + self.name + '", "' + format_int(self.id) + '", scene);\n') # MUST be String for inline

        for bone in self.bones:
            bone.to_script_file(file_handler, indent)
#===============================================================================
class Camera(FCurveAnimatable):
    def __init__(self, camera):
        super().__init__(camera, True, True, False, math.pi / 2)

        if camera.parent and camera.parent.type != 'ARMATURE':
            self.parentId = camera.parent.name

        self.CameraType = camera.data.CameraType
        self.name = camera.name
        Main.log('processing begun of camera (' + self.CameraType + '):  ' + self.name)
        self.position = camera.location

        # for quaternions, convert to euler XYZ, otherwise, use the default rotation_euler
        eul = camera.rotation_quaternion.to_euler("XYZ") if camera.rotation_mode == 'QUATERNION' else camera.rotation_euler
        self.rotation = mathutils.Vector((-eul[0] + math.pi / 2, eul[1], -eul[2]))

        self.fov = camera.data.angle
        self.minZ = camera.data.clip_start
        self.maxZ = camera.data.clip_end
        self.speed = 1.0
        self.inertia = 0.9
        self.checkCollisions = camera.data.checkCollisions
        self.applyGravity = camera.data.applyGravity
        self.ellipsoid = camera.data.ellipsoid

        self.Camera3DRig = camera.data.Camera3DRig
        self.interaxialDistance = camera.data.interaxialDistance

        for constraint in camera.constraints:
            if constraint.type == 'TRACK_TO':
                self.lockedTargetId = constraint.target.name
                break


        if self.CameraType == ARC_ROTATE_CAM or self.CameraType == FOLLOW_CAM:
            if not hasattr(self, 'lockedTargetId'):
                Main.warn('Camera type with manditory target specified, but no target to track set.  Ignored', 2)
                self.fatalProblem = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def update_for_target_attributes(self, meshesAndNodes):
        if not hasattr(self, 'lockedTargetId'): return

        # find the actual mesh tracking, so properties can be derrived
        targetFound = False
        for mesh in meshesAndNodes:
            if mesh.name == self.lockedTargetId:
                targetMesh = mesh
                targetFound = True
                break;

        xApart = 3 if not targetFound else self.position.x - targetMesh.position.x
        yApart = 3 if not targetFound else self.position.y - targetMesh.position.y
        zApart = 3 if not targetFound else self.position.z - targetMesh.position.z

        distance3D = math.sqrt(xApart * xApart + yApart * yApart + zApart * zApart)

        alpha = math.atan2(yApart, xApart);
        beta  = math.atan2(yApart, zApart);

        if self.CameraType == FOLLOW_CAM:
            self.followHeight   =  zApart
            self.followDistance = distance3D
            self.followRotation =  90 + (alpha * 180 / math.pi)

        elif self.CameraType == self.CameraType == ARC_ROTATE_CAM:
            self.arcRotAlpha  = alpha
            self.arcRotBeta   = beta
            self.arcRotRadius = distance3D
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent, is_typescript):
        # constructor args are not the same for each camera type
        file_handler.write(indent + 'camera = new ŝ.' + self.CameraType + '("' + self.name + '"')
        if self.CameraType == ARC_ROTATE_CAM:
            file_handler.write(', ' + format_f(self.arcRotAlpha) + ', ' + format_f(self.arcRotBeta) + ', ' + format_f(self.arcRotRadius))
            file_handler.write(', scene.getMeshByID("' + self.lockedTargetId + '")')

        else:
            file_handler.write(', new ŝ.Vector3(' + format_vector(self.position) + ')')

        file_handler.write(', scene);\n')

        # always assign rig, even when none, Reason:  Could have VR camera with different Rig than default
        file_handler.write(indent + 'camera.setCameraRigMode(' + self.Camera3DRig + ',{interaxialDistance: ' + format_f(self.interaxialDistance) + '});\n')

        file_handler.write(indent + 'camera.rotation = new ŝ.Vector3(' + format_vector(self.rotation) + ');\n')

        file_handler.write(indent + 'camera.fov = ' + format_f(self.fov) + ';\n')
        file_handler.write(indent + 'camera.minZ = ' + format_f(self.minZ) + ';\n')
        file_handler.write(indent + 'camera.maxZ = ' + format_f(self.maxZ) + ';\n')

        file_handler.write(indent + 'camera.speed = ' + format_f(self.speed) + ';\n')
        file_handler.write(indent + 'camera.inertia = ' + format(self.inertia) + ';\n')

        file_handler.write(indent + 'camera.checkCollisions = ' + format_bool(self.checkCollisions) + ';\n')
        file_handler.write(indent + 'camera.applyGravity = ' + format_bool(self.applyGravity) + ';\n')
        file_handler.write(indent + 'camera.ellipsoid = new ŝ.Vector3(' + format_array3(self.ellipsoid) + ');\n')

        if self.CameraType == FOLLOW_CAM:
            file_handler.write(indent + 'camera.heightOffset = ' + format_f(self.followHeight) + ';\n')
            file_handler.write(indent + 'camera.radius = ' + format_f(self.followDistance) + ';\n')
            file_handler.write(indent + 'camera.rotationOffset = ' + format_f(self.followRotation) + ';\n')

        if hasattr(self, 'lockedTargetId') and (self.CameraType == FOLLOW_CAM or self.CameraType == FREE_CAM):
            if self.CameraType == FOLLOW_CAM:
                file_handler.write(indent + 'camera.target = scene.getMeshByID("' + self.lockedTargetId + '");\n')
            else:
                file_handler.write(indent + 'camera.lockedTarget = scene.getMeshByID("' + self.lockedTargetId + '");\n')

        if hasattr(self, 'parentId'):
            file_handler.write(indent + 'camera.parent = scene.getLastEntryByID("' + self.parentId + '");\n')

        super().to_script_file(file_handler, 'camera', indent, is_typescript) # Animations
#===============================================================================
class Light(FCurveAnimatable):
    def __init__(self, light):
        super().__init__(light, False, True, False)

        if light.parent and light.parent.type != 'ARMATURE':
            self.parentId = light.parent.name

        self.name = light.name
        Main.log('processing begun of light (' + light.data.type + '):  ' + self.name)
        light_type_items = {'POINT': POINT_LIGHT, 'SUN': DIRECTIONAL_LIGHT, 'SPOT': SPOT_LIGHT, 'HEMI': HEMI_LIGHT, 'AREA': POINT_LIGHT}
        self.light_type = light_type_items[light.data.type]

        if self.light_type == POINT_LIGHT:
            self.position = light.location
            if hasattr(light.data, 'use_sphere'):
                if light.data.use_sphere:
                    self.range = light.data.distance

        elif self.light_type == DIRECTIONAL_LIGHT:
            self.position = light.location
            self.direction = Light.get_direction(light.matrix_local)

        elif self.light_type == SPOT_LIGHT:
            self.position = light.location
            self.direction = Light.get_direction(light.matrix_local)
            self.angle = light.data.spot_size
            self.exponent = light.data.spot_blend * 2
            if light.data.use_sphere:
                self.range = light.data.distance

        else:
            # Hemi
            matrix_local = light.matrix_local.copy()
            matrix_local.translation = mathutils.Vector((0, 0, 0))
            self.direction = (mathutils.Vector((0, 0, -1)) * matrix_local)
            self.direction = scale_vector(self.direction, -1)
            self.groundColor = mathutils.Color((0, 0, 0))

        self.intensity = light.data.energy
        self.diffuse   = light.data.color if light.data.use_diffuse  else mathutils.Color((0, 0, 0))
        self.specular  = light.data.color if light.data.use_specular else mathutils.Color((0, 0, 0))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent, is_typescript):
        if self.light_type == POINT_LIGHT:
            file_handler.write(indent + 'light = new ŝ.PointLight("' + self.name + '", new ŝ.Vector3(' + format_vector(self.position) + '), scene);\n')

        elif self.light_type == DIRECTIONAL_LIGHT:
            file_handler.write(indent + 'light = new ŝ.DirectionalLight("' + self.name + '", new ŝ.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.position = new ŝ.Vector3(' + format_vector(self.position) + ');\n')

        elif self.light_type == SPOT_LIGHT:
            file_handler.write(indent + 'light = new ŝ.SpotLight("' + self.name + '", new ŝ.Vector3(' + format_vector(self.position) +
                               '), new ŝ.Vector3(' + format_vector(self.direction) + '), ' + format_f(self.angle) + ', ' + format_f(self.exponent) + ', scene);\n')

        else:
            file_handler.write(indent + 'light = new ŝ.HemisphericLight("' + self.name + '", new ŝ.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.groundColor = new ŝ.Color3(' + format_color(self.groundColor) + ');\n')

        file_handler.write(indent + 'light.intensity = ' + format_f(self.intensity) + ';\n')

        if hasattr(self, 'range'):
            file_handler.write(indent + 'light.range = ' + format_f(self.range) + ';\n')

        if hasattr(self, 'parentId'):
            file_handler.write(indent + 'light.parent = scene.getLastEntryByID("' + self.parentId + '");\n')

        file_handler.write(indent + 'light.diffuse = new ŝ.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent + 'light.specular = new ŝ.Color3(' + format_color(self.specular) + ');\n')
        super().to_script_file(file_handler, 'light', indent, is_typescript) # Animations

    @staticmethod
    def get_direction(matrix):
        return (matrix.to_3x3() * mathutils.Vector((0.0, 0.0, -1.0))).normalized()
#===============================================================================
class ShadowGenerator:
    def __init__(self, lamp, meshesAndNodes, scene):
        Main.log('processing begun of shadows for light:  ' + lamp.name)
        self.lightId = lamp.name
        self.mapSize = lamp.data.shadowMapSize
        self.shadowBias = lamp.data.shadowBias

        if lamp.data.shadowMap == VARIANCE_SHADOWS:
            self.useVarianceShadowMap = True
        elif lamp.data.shadowMap == POISSON_SHADOWS:
            self.usePoissonSampling = True
        elif lamp.data.shadowMap == BLUR_VARIANCE_SHADOWS:
            self.useBlurVarianceShadowMap = True
            self.shadowBlurScale = lamp.data.shadowBlurScale
            self.shadowBlurBoxOffset = lamp.data.shadowBlurBoxOffset
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        file_handler.write(indent + 'light = scene.getLightByID("' + self.lightId + '");\n')
        file_handler.write(indent + 'shadowGenerator = new ŝ.ShadowGenerator(' + format_int(self.mapSize) + ', light);\n')
        file_handler.write(indent + 'shadowGenerator.bias = ' + format_f(self.shadowBias) + ';\n')
        if hasattr(self, 'useVarianceShadowMap') :
            file_handler.write(indent + 'shadowGenerator.useVarianceShadowMap = true;\n')
        elif hasattr(self, 'usePoissonSampling'):
            file_handler.write(indent + 'shadowGenerator.usePoissonSampling = true;\n')
        elif hasattr(self, 'useBlurVarianceShadowMap'):
            file_handler.write(indent + 'shadowGenerator.useBlurVarianceShadowMap = true;\n')
            file_handler.write(indent + 'shadowGenerator.blurScale = ' + format_int(self.shadowBlurScale) + ';\n')
            file_handler.write(indent + 'shadowGenerator.blurBoxOffset = ' + format_int(self.shadowBlurBoxOffset) + ';\n')
#===============================================================================
class MultiMaterial:
    def __init__(self, material_slots, idx):
        self.name = Main.nameSpace + '.' + 'Multimaterial#' + str(idx)
        Main.log('processing begun of multimaterial:  ' + self.name, 2)
        self.material_slots = material_slots
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        file_handler.write(indent + 'multiMaterial = new ŝ.MultiMaterial("' + self.name + '", scene);\n')

        for material in self.material_slots:
            file_handler.write(indent + 'multiMaterial.subMaterials.push(scene.getMaterialByID("' + material.name + '"));\n')
#===============================================================================
class Texture:
    def __init__(self, slot, level, textureOrImage, mesh, exporter):
        wasBaked = not hasattr(textureOrImage, 'uv_layer')
        if wasBaked:
            image = textureOrImage
            texture = None

            repeat = False
            self.hasAlpha = False
            self.coordinatesIndex = 0
        else:
            texture = textureOrImage
            image = texture.texture.image

            repeat = texture.texture.extension == 'REPEAT'
            self.hasAlpha = texture.texture.use_alpha

            usingMap = texture.uv_layer
            if len(usingMap) == 0:
                usingMap = mesh.data.uv_textures[0].name
                
            Main.log('Image texture found, type:  ' + slot + ', mapped using: "' + usingMap + '"', 3)
            if mesh.data.uv_textures[0].name == usingMap:
                self.coordinatesIndex = 0
            elif mesh.data.uv_textures[1].name == usingMap:
                self.coordinatesIndex = 1
            else:
                Main.warn('Texture is not mapped as UV or UV2, assigned 1', 4)
                self.coordinatesIndex = 0

        # always write the file out, since base64 encoding is easiest from a file
        try:
            imageFilepath = os.path.normpath(bpy.path.abspath(image.filepath))
            basename = os.path.basename(imageFilepath)
            targetdir = os.path.dirname(exporter.filepath)

            internalImage = image.packed_file or wasBaked

            # when coming from either a packed image or a baked image, then save_render
            if internalImage:
                if exporter.scene.inlineTextures:
                    textureFile = os.path.join(targetdir, basename + "temp")
                else:
                    textureFile = os.path.join(targetdir, basename)

                image.save_render(textureFile)

            # when backed by an actual file, copy to target dir, unless inlining
            else:
                textureFile = bpy.path.abspath(image.filepath)
                if not exporter.scene.inlineTextures:
                    shutil.copy(textureFile, targetdir)
        except:
            ex = sys.exc_info()
            Main.log('Error encountered processing image file:  ' + ', Error:  '+ str(ex[1]))

        if exporter.scene.inlineTextures:
            # base64 is easiest from a file, so sometimes a temp file was made above;  need to delete those
            with open(textureFile, "rb") as image_file:
                asString = base64.b64encode(image_file.read()).decode()
            self.encoded_URI = 'data:image/' + image.file_format + ';base64,' + asString

            if internalImage:
                os.remove(textureFile)

        # capture texture attributes
        self.slot = slot
        self.name = basename
        self.level = level

        if (texture and texture.mapping == 'CUBE'):
            self.coordinatesMode = CUBIC_MODE
        if (texture and texture.mapping == 'SPHERE'):
            self.coordinatesMode = SPHERICAL_MODE
        else:
            self.coordinatesMode = EXPLICIT_MODE

        self.uOffset = texture.offset.x if texture else 0.0
        self.vOffset = texture.offset.y if texture else 0.0
        self.uScale  = texture.scale.x  if texture else 1.0
        self.vScale  = texture.scale.y  if texture else 1.0
        self.uAng = 0
        self.vAng = 0
        self.wAng = 0

        if (repeat):
            if (texture.texture.use_mirror_x):
                self.wrapU = MIRROR_ADDRESSMODE
            else:
                self.wrapU = WRAP_ADDRESSMODE

            if (texture.texture.use_mirror_y):
                self.wrapV = MIRROR_ADDRESSMODE
            else:
                self.wrapV = WRAP_ADDRESSMODE
        else:
            self.wrapU = CLAMP_ADDRESSMODE
            self.wrapV = CLAMP_ADDRESSMODE
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        if hasattr(self,'encoded_URI'):
            file_handler.write(indent + 'texture = ŝ.Texture.CreateFromBase64String(\n')
            file_handler.write(indent + '"' + self.encoded_URI + '"\n')
            file_handler.write(indent + ', "' + self.name + '", scene);\n')
        else:
            file_handler.write(indent + 'texture = new ŝ.Texture(materialsRootDir + "' + self.name + '", scene);\n')

        file_handler.write(indent + 'texture.hasAlpha = ' + format_bool(self.hasAlpha) + ';\n')
        file_handler.write(indent + 'texture.level = ' + format_f(self.level) + ';\n')

        file_handler.write(indent + 'texture.coordinatesIndex = ' + format_int(self.coordinatesIndex) + ';\n')
        file_handler.write(indent + 'texture.coordinatesMode = ' + format_int(self.coordinatesMode) + ';\n')
        file_handler.write(indent + 'texture.uOffset = ' + format_f(self.uOffset) + ';\n')
        file_handler.write(indent + 'texture.vOffset = ' + format_f(self.vOffset) + ';\n')
        file_handler.write(indent + 'texture.uScale = ' + format_f(self.uScale) + ';\n')
        file_handler.write(indent + 'texture.vScale = ' + format_f(self.vScale) + ';\n')
        file_handler.write(indent + 'texture.uAng = ' + format_f(self.uAng) + ';\n')
        file_handler.write(indent + 'texture.vAng = ' + format_f(self.vAng) + ';\n')
        file_handler.write(indent + 'texture.wAng = ' + format_f(self.wAng) + ';\n')

        file_handler.write(indent + 'texture.wrapU = ' + format_int(self.wrapU) + ';\n')
        file_handler.write(indent + 'texture.wrapV = ' + format_int(self.wrapV) + ';\n')
#===============================================================================
# need to evaluate the need to bake a mesh before even starting; class also stores specific types of bakes
class BakingRecipe:
    def __init__(self, mesh, forceBaking = False):
        # initialize all members
        self.needsBaking      = forceBaking
        self.diffuseBaking    = forceBaking
        self.ambientBaking    = False
        self.opacityBaking    = False
        self.reflectionBaking = False
        self.emissiveBaking   = False
        self.bumpBaking       = False
        self.specularBaking   = False

        # need to make sure a single render
        self.cyclesRender     = False
        blenderRender         = False

        # transfer from Mesh custom properties
        self.bakeSize    = mesh.data.bakeSize
        self.bakeQuality = mesh.data.bakeQuality # for lossy compression formats

        # accumulators set by Blender Game
        self.backFaceCulling = True  # used only when baking
        self.billboardMode = BILLBOARDMODE_ALL if len(mesh.material_slots) == 1 and mesh.material_slots[0].material.game_settings.face_orientation == 'BILLBOARD' else BILLBOARDMODE_NONE

        # Cycles specific, need to get the node trees of each material
        self.nodeTrees = []

        for material_slot in mesh.material_slots:
            # a material slot is not a reference to an actual material; need to look up
            material = material_slot.material

            self.backFaceCulling &= material.game_settings.use_backface_culling

            # testing for Cycles renderer has to be different
            if material.use_nodes == True:
                self.needsBaking = True
                self.cyclesRender = True
                self.nodeTrees.append(material.node_tree)

                for node in material.node_tree.nodes:
                    id = node.bl_idname
                    if id == 'ShaderNodeBsdfDiffuse':
                        self.diffuseBaking = True

                    if id == 'ShaderNodeAmbientOcclusion':
                        self.ambientBaking = True

                    # there is no opacity baking for Cycles AFAIK
                    if id == '':
                        self.opacityBaking = True

                    if id == 'ShaderNodeEmission':
                        self.emissiveBaking = True

                    if id == 'ShaderNodeNormal' or id == 'ShaderNodeNormalMap':
                        self.bumpBaking = True

                    if id == '':
                        self.specularBaking = True

            else:
                blenderRender = True
                nDiffuseImages = 0
                nReflectionImages = 0
                nAmbientImages = 0
                nOpacityImages = 0
                nEmissiveImages = 0
                nBumpImages = 0
                nSpecularImages = 0

                textures = [mtex for mtex in material.texture_slots if mtex and mtex.texture]
                for mtex in textures:
                    # ignore empty slots
                    if mtex.texture.type == 'NONE':
                        continue

                    # for images, just need to make sure there is only 1 per type
                    if mtex.texture.type == 'IMAGE' and not forceBaking:
                        if mtex.use_map_diffuse or mtex.use_map_color_diffuse:
                            if mtex.texture_coords == 'REFLECTION':
                                nReflectionImages += 1
                            else:
                                nDiffuseImages += 1
    
                        if mtex.use_map_ambient:
                            nAmbientImages += 1
    
                        if mtex.use_map_alpha:
                            nOpacityImages += 1
    
                        if mtex.use_map_emit:
                            nEmissiveImages += 1
    
                        if mtex.use_map_normal:
                            nBumpImages += 1
    
                        if mtex.use_map_color_spec:
                            nSpecularImages += 1

                    else:
                        self.needsBaking = True

                        if mtex.use_map_diffuse or mtex.use_map_color_diffuse:
                            if mtex.texture_coords == 'REFLECTION':
                                self.reflectionBaking = True
                            else:
                                self.diffuseBaking = True

                        if mtex.use_map_ambient:
                            self.ambientBaking = True

                        if mtex.use_map_alpha:
                            self.opacityBaking = True

                        if mtex.use_map_emit:
                            self.emissiveBaking = True

                        if mtex.use_map_normal:
                            self.bumpBaking = True

                        if mtex.use_map_color_spec:
                            self.specularBaking = True
                            
                # 2nd pass 2 check for multiples of a given image type
                if nDiffuseImages > 1:
                    self.needsBaking = self.diffuseBaking = True
                if nReflectionImages > 1:
                    self.needsBaking = self.nReflectionImages = True
                if nAmbientImages > 1:
                    self.needsBaking = self.ambientBaking = True
                if nOpacityImages > 1:
                    self.needsBaking = self.opacityBaking = True
                if nEmissiveImages > 1:
                    self.needsBaking = self.emissiveBaking = True
                if nBumpImages > 1:
                    self.needsBaking = self.bumpBaking = True
                if nSpecularImages > 1:
                    self.needsBaking = self.specularBaking = True
                        
        self.multipleRenders = blenderRender and self.cyclesRender
        
        # check for really old .blend file, eg. 2.49, to ensure that everything requires exists
        if self.needsBaking and bpy.data.screens.find('UV Editing') == -1:
            Main.warn('Contains material requiring baking, but resources not available.  Probably .blend very old', 2)
            self.needsBaking = False     
#===============================================================================
# Not intended to be instanced directly
class Material:
    def __init__(self, checkReadyOnlyOnce):
        self.checkReadyOnlyOnce = checkReadyOnlyOnce
        # first pass of textures, either appending image type or recording types of bakes to do
        self.textures = []
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        indent2 = indent + '    '
        file_handler.write('\n')
        file_handler.write(indent + 'if (!scene.getMaterialByID("' + self.name + '")){\n')
        file_handler.write(indent2 + 'material = new ŝ.StandardMaterial("' + self.name + '", scene);\n')
        file_handler.write(indent2 + 'material.ambientColor  = new ŝ.Color3(' + format_color(self.ambient) + ');\n')
        file_handler.write(indent2 + 'material.diffuseColor  = new ŝ.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent2 + 'material.emissiveColor = new ŝ.Color3(' + format_color(self.emissive) + ');\n')
        file_handler.write(indent2 + 'material.specularColor = new ŝ.Color3(' + format_color(self.specular) + ');\n')
        file_handler.write(indent2 + 'material.specularPower = ' + format_f(self.specularPower) + ';\n')
        file_handler.write(indent2 + 'material.alpha =  '        + format_f(self.alpha        ) + ';\n')
        file_handler.write(indent2 + 'material.backFaceCulling = ' + format_bool(self.backFaceCulling) + ';\n')
        file_handler.write(indent2 + 'material.checkReadyOnlyOnce = ' + format_bool(self.checkReadyOnlyOnce) + ';\n')

        for texSlot in self.textures:
            texSlot.to_script_file(file_handler, indent2)
            file_handler.write(indent2 + 'material.' + texSlot.slot + ' = texture;\n')
            
        file_handler.write(indent + '}\n')
#===============================================================================
class StdMaterial(Material):
    def __init__(self, material_slot, exporter, mesh):
        super().__init__(mesh.data.checkReadyOnlyOnce)
        nameSpace = Main.nameSpace if mesh.data.materialNameSpace == DEFAULT_MATERIAL_NAMESPACE else mesh.data.materialNameSpace 
        self.name = nameSpace + '.' + material_slot.name
                
        Main.log('processing begun of Standard material:  ' +  material_slot.name, 2)

        # a material slot is not a reference to an actual material; need to look up
        material = material_slot.material

        self.ambient = material.ambient * material.diffuse_color
        self.diffuse = material.diffuse_intensity * material.diffuse_color
        self.specular = material.specular_intensity * material.specular_color
        self.emissive = material.emit * material.diffuse_color
        self.specularPower = material.specular_hardness
        self.alpha = material.alpha

        self.backFaceCulling = material.game_settings.use_backface_culling

        textures = [mtex for mtex in material.texture_slots if mtex and mtex.texture]
        for mtex in textures:
            # test should be un-neccessary, since should be a BakedMaterial; just for completeness
            if (mtex.texture.type != 'IMAGE'):
                continue
            elif not mtex.texture.image:
                Main.warn('Material has un-assigned image texture:  "' + mtex.name + '" ignored', 3)
                continue
            elif len(mesh.data.uv_textures) == 0:
                Main.warn('Mesh has no UV maps, material:  "' + mtex.name + '" ignored', 3)
                continue

            if mtex.use_map_diffuse or mtex.use_map_color_diffuse:
                if mtex.texture_coords == 'REFLECTION':
                    Main.log('Reflection texture found"' + mtex.name + '"', 2)
                    self.textures.append(Texture('reflectionTexture', mtex.diffuse_color_factor, mtex, mesh, exporter))
                else:
                    Main.log('Diffuse texture found"' + mtex.name + '"', 2)
                    self.textures.append(Texture('diffuseTexture', mtex.diffuse_color_factor, mtex, mesh, exporter))

            if mtex.use_map_ambient:
                Main.log('Ambient texture found"' + mtex.name + '"', 2)
                self.textures.append(Texture('ambientTexture', mtex.ambient_factor, mtex, mesh, exporter))

            if mtex.use_map_alpha:
                if self.alpha > 0:
                    Main.log('Opacity texture found"' + mtex.name + '"', 2)
                    self.textures.append(Texture('opacityTexture', mtex.alpha_factor, mtex, mesh, exporter))
                else:
                    Main.warn('Opacity non-std way to indicate opacity, use material alpha to also use Opacity texture', 2)
                    self.alpha = 1

            if mtex.use_map_emit:
                Main.log('Emissive texture found"' + mtex.name + '"', 2)
                self.textures.append(Texture('emissiveTexture', mtex.emit_factor, mtex, mesh, exporter))

            if mtex.use_map_normal:
                Main.log('Bump texture found"' + mtex.name + '"', 2)
                self.textures.append(Texture('bumpTexture', 1.0 / mtex.normal_factor, mtex, mesh, exporter))

            if mtex.use_map_color_spec:
                Main.log('Specular texture found"' + mtex.name + '"', 2)
                self.textures.append(Texture('specularTexture', mtex.specular_color_factor, mtex, mesh, exporter))
#===============================================================================
class BakedMaterial(Material):
    def __init__(self, exporter, mesh, recipe):
        super().__init__(mesh.data.checkReadyOnlyOnce)
        nameSpace = Main.nameSpace if mesh.data.materialNameSpace == DEFAULT_MATERIAL_NAMESPACE else mesh.data.materialNameSpace 
        self.name = nameSpace + '.' + mesh.name
        Main.log('processing begun of baked material:  ' +  mesh.name, 2)

        # any baking already took in the values. Do not want to apply them again, but want shadows to show.
        # These are the default values from StandardMaterials
        self.ambient = mathutils.Color((0, 0, 0))
        self.diffuse = mathutils.Color((0.8, 0.8, 0.8)) # needed for shadows, but not change anything else
        self.specular = mathutils.Color((1, 1, 1))
        self.emissive = mathutils.Color((0, 0, 0))
        self.specularPower = 64
        self.alpha = 1.0

        self.backFaceCulling = recipe.backFaceCulling

        # texture is baked from selected mesh(es), need to insure this mesh is only one selected
        bpy.ops.object.select_all(action='DESELECT')
        mesh.select = True

        # store setting to restore
        engine = exporter.scene.render.engine

        # mode_set's only work when there is an active object
        exporter.scene.objects.active = mesh

        # you need UV on a mesh in order to bake image.  This is not reqd for procedural textures, so may not exist
        # need to look if it might already be created, as for a mesh with multi-materials
        uv = mesh.data.uv_textures[0] if len(mesh.data.uv_textures) > 0 else None

        if uv == None:
            mesh.data.uv_textures.new('BakingUV')
            uv = mesh.data.uv_textures['BakingUV']

        uv.active = True
        uv.active_render = True

        # UV unwrap operates on mesh in only edit mode
        # select all verticies of mesh, since smart_project works only with selected verticies
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit = 66.0, island_margin = 0.0, user_area_weight = 1.0, use_aspect = True)

        # create a temporary image & link it to the UV/Image Editor so bake_image works
        bpy.data.images.new(name = mesh.name + '_BJS_BAKE', width = recipe.bakeSize, height = recipe.bakeSize, alpha = False, float_buffer = False)
        image = bpy.data.images[mesh.name + '_BJS_BAKE']
        image.file_format = 'JPEG'
        image.mapping = 'UV' # default value

        image_settings = exporter.scene.render.image_settings
        image_settings.file_format = 'JPEG'
        image_settings.quality = recipe.bakeQuality # for lossy compression formats
#        image_settings.compression = 100  # Amount of time to determine best compression: 0 = no compression with fast file output, 100 = maximum lossless compression with slow file output

        # now go thru all the textures that need to be baked
        if recipe.diffuseBaking:
            self.bake('diffuseTexture', 'DIFFUSE_COLOR', 'TEXTURE', image, mesh, uv, exporter, recipe)

        if recipe.ambientBaking:
            self.bake('ambientTexture', 'AO', 'AO', image, mesh, uv, exporter, recipe)

        if recipe.opacityBaking:  # no eqivalent found for cycles
            self.bake('opacityTexture', None, 'ALPHA', image, mesh, uv, exporter, recipe)

        if recipe.reflectionBaking:
            self.bake('reflectionTexture', 'REFLECTION', 'MIRROR_COLOR', image, mesh, uv, exporter, recipe)

        if recipe.emissiveBaking:
            self.bake('emissiveTexture', 'EMIT', 'EMIT', image, mesh, uv, exporter, recipe)

        if recipe.bumpBaking:
            self.bake('bumpTexture', 'NORMAL', 'NORMALS', image, mesh, uv, exporter, recipe)

        if recipe.specularBaking:
            self.bake('specularTexture', 'SPECULAR', 'SPEC_COLOR', image, mesh, uv, exporter, recipe)

        # Toggle vertex selection & mode, if setting changed their value
        bpy.ops.mesh.select_all(action='TOGGLE')  # still in edit mode toggle select back to previous
        bpy.ops.object.mode_set(toggle=True)      # change back to Object

        bpy.ops.object.select_all(action='TOGGLE') # change scene selection back, not seeming to work

        exporter.scene.render.engine = engine
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def bake(self, bjs_type, cycles_type, internal_type, image, mesh, uv, exporter, recipe):
        if recipe.cyclesRender:
            if cycles_type is None:
                return
            self.bakeCycles(cycles_type, image, uv, recipe.nodeTrees)
        else:
            self.bakeInternal(internal_type, image, uv)

        self.textures.append(Texture(bjs_type, 1.0, image, mesh, exporter))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def bakeInternal(self, bake_type, image, uv):
        Main.log('Internal baking texture, type: ' + bake_type + ', mapped using: ' + uv.name, 3)
        # need to use the legal name, since this will become the file name, chars like ':' not legal
        legalName = legal_js_identifier(self.name)
        image.filepath = legalName + '_' + bake_type + '.jpg'

        scene = bpy.context.scene
        scene.render.engine = 'BLENDER_RENDER'

        scene.render.bake_type = bake_type

        # assign the image to the UV Editor, which does not have to shown
        bpy.data.screens['UV Editing'].areas[1].spaces[0].image = image

        renderer = scene.render
        renderer.use_bake_selected_to_active = False
        renderer.use_bake_to_vertex_color = False
        renderer.use_bake_clear = True
        renderer.bake_quad_split = 'AUTO'
        renderer.bake_margin = 5
        renderer.use_file_extension = True

        renderer.use_bake_normalize = True
        renderer.use_bake_antialiasing = True

        bpy.ops.object.bake_image()
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def bakeCycles(self, bake_type, image, uv, nodeTrees):
        Main.log('Cycles baking texture, type: ' + bake_type + ', mapped using: ' + uv.name, 3)
        legalName = legal_js_identifier(self.name)
        image.filepath = legalName + '_' + bake_type + '.jpg'

        scene = bpy.context.scene
        scene.render.engine = 'CYCLES'

        # create an unlinked temporary node to bake to for each material
        for tree in nodeTrees:
            bakeNode = tree.nodes.new(type='ShaderNodeTexImage')
            bakeNode.image = image
            bakeNode.select = True
            tree.nodes.active = bakeNode

        bpy.ops.object.bake(type = bake_type, use_clear = True, margin = 5, use_selected_to_active = False)

        for tree in nodeTrees:
            tree.nodes.remove(tree.nodes.active)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def meshBakingClean(mesh):
        for uvMap in mesh.data.uv_textures:
            if uvMap.name == 'BakingUV':
                mesh.data.uv_textures.remove(uvMap)
                break

        # remove an image if it was baked
        for image in bpy.data.images:
            if image.name == mesh.name + '_BJS_BAKE':
                image.user_clear() # cannot remove image unless 0 references
                bpy.data.images.remove(image)
                break
#===============================================================================
class Animation:
    def __init__(self, dataType, framePerSecond, loopBehavior, name, propertyInBabylon):
        self.dataType = dataType
        self.framePerSecond = framePerSecond
        self.loopBehavior = loopBehavior
        self.name = name
        self.propertyInBabylon = propertyInBabylon

        #keys
        self.frames = []
        self.values = [] # vector3 for ANIMATIONTYPE_VECTOR3 & matrices for ANIMATIONTYPE_MATRIX
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # for auto animate
    def get_first_frame(self):
        return self.frames[0] if len(self.frames) > 0 else -1
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # for auto animate
    def get_last_frame(self):
        return self.frames[len(self.frames) - 1] if len(self.frames) > 0 else -1
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assigns the var 'animation', which the caller has already defined
    # .babylon writes 'values', but the babylonFileLoader reads it, changing it to 'value'
    def to_script_file(self, file_handler, indent):
        file_handler.write(indent + 'animation = new ŝ.Animation("' + self.name + '", "' +
                                                                             self.propertyInBabylon + '", ' +
                                                                             format_int(self.framePerSecond) + ', ' +
                                                                             format_int(self.dataType) + ', ' +
                                                                             format_int(self.loopBehavior) + ');\n')
        file_handler.write(indent + 'animation.setKeys([\n')
        nFrames = len(self.frames)
        for frame_idx in range(nFrames):
            file_handler.write(indent + '{frame: ' + format_int(self.frames[frame_idx]) + ', value: ')
            value_idx = self.values[frame_idx]
            if self.dataType == ANIMATIONTYPE_MATRIX:
                file_handler.write('ă(' + format_matrix4(value_idx) + ')}')
            elif self.dataType == ANIMATIONTYPE_QUATERNION:
               file_handler.write('new ŝ.Quaternion(' + format_quaternion(value_idx) + ')}')
            else:
                file_handler.write('new ŝ.Vector3(' + format_vector(value_idx) + ')}')

            if frame_idx + 1 < nFrames:
                file_handler.write(',')
            file_handler.write('\n')

        file_handler.write(indent + ']);\n')
#===============================================================================
class VectorAnimation(Animation):
    def __init__(self, object, attrInBlender, propertyInBabylon, mult, xOffset = 0):
        super().__init__(ANIMATIONTYPE_VECTOR3, 30, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon)

        # capture  built up from fcurves
        frames = dict()
        for fcurve in object.animation_data.action.fcurves:
            if fcurve.data_path == attrInBlender:
                for key in fcurve.keyframe_points:
                    frame = key.co.x
                    frames[frame] = 1

        #for each frame (next step ==> set for key frames)
        for Frame in sorted(frames):
            self.frames.append(Frame)
            bpy.context.scene.frame_set(int(Frame + bpy.context.scene.frame_start))
            self.values.append(scale_vector(getattr(object, attrInBlender), mult, xOffset))
#===============================================================================
class QuaternionAnimation(Animation):
    def __init__(self, object, attrInBlender, propertyInBabylon, mult, xOffset = 0):
        super().__init__(ANIMATIONTYPE_QUATERNION, 30, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon)

        # capture  built up from fcurves
        frames = dict()
        for fcurve in object.animation_data.action.fcurves:
            if fcurve.data_path == attrInBlender:
                for key in fcurve.keyframe_points:
                    frame = key.co.x
                    frames[frame] = 1

        #for each frame (next step ==> set for key frames)
        for Frame in sorted(frames):
            self.frames.append(Frame)
            bpy.context.scene.frame_set(int(Frame + bpy.context.scene.frame_start))
            self.values.append(post_rotate_quaternion(getattr(object, attrInBlender), xOffset))
#===============================================================================
class QuaternionToEulerAnimation(Animation):
    def __init__(self, object, attrInBlender, propertyInBabylon, mult, xOffset = 0):
        super().__init__(ANIMATIONTYPE_VECTOR3, 30, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon)

        # capture  built up from fcurves
        frames = dict()
        for fcurve in object.animation_data.action.fcurves:
            if fcurve.data_path == attrInBlender:
                for key in fcurve.keyframe_points:
                    frame = key.co.x
                    frames[frame] = 1

        #for each frame (next step ==> set for key frames)
        for Frame in sorted(frames):
            self.frames.append(Frame)
            bpy.context.scene.frame_set(int(Frame + bpy.context.scene.frame_start))
            quat = getattr(object, attrInBlender)
            eul  = quat.to_euler("XYZ")
            self.values.append(scale_vector(eul, mult, xOffset))
#===============================================================================
#  module level formatting methods, called from multiple classes
#===============================================================================
def legal_js_identifier(input):
    out = ''
    prefix = ''
    for char in input:
        if len(out) == 0:
            if char in '0123456789':
                # cannot take the chance that leading numbers being chopped of cause name conflicts, e.g (01.R & 02.R)
                prefix += char
                continue
            elif char.upper() not in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
                continue

        legal = char if char.upper() in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_' else '_'
        out += legal

    if len(prefix) > 0:
        out += '_' + prefix
    return out

def format_f(num):
    s = MAX_FLOAT_PRECISION % num # rounds to N decimal places while changing to string
    s = s.rstrip('0') # ignore trailing zeroes
    s = s.rstrip('.') # ignore trailing .
    return '0' if s == '-0' else s

def format_matrix4(matrix):
    tempMatrix = matrix.copy()
    tempMatrix.transpose()

    ret = ''
    first = True
    for vect in tempMatrix:
        if (first != True):
            ret +=','
        first = False;

        ret += format_f(vect[0]) + ',' + format_f(vect[1]) + ',' + format_f(vect[2]) + ',' + format_f(vect[3])

    return ret

def format_array3(array):
    return format_f(array[0]) + ',' + format_f(array[1]) + ',' + format_f(array[2])

def format_array(array, max_per_line = MAX_VERTEX_ELEMENTS, indent = ''):
    ret = ''
    first = True
    nOnLine = 0
    for element in array:
        if (first != True):
            ret +=','
        first = False;

        ret += format_f(element)
        nOnLine += 1

        if nOnLine >= max_per_line:
            ret += '\n' + indent
            nOnLine = 0

    return ret

def format_color(color):
    return format_f(color.r) + ',' + format_f(color.g) + ',' + format_f(color.b)

def format_vector(vector):
    return format_f(vector.x) + ',' + format_f(vector.z) + ',' + format_f(vector.y)

def format_vector_array(vectorArray, max_per_line = MAX_VERTEX_ELEMENTS, indent = ''):
    ret = ''
    first = True
    nOnLine = 0
    for vector in vectorArray:
        if (first != True):
            ret +=','
        first = False;

        ret += format_vector(vector)
        nOnLine += 3

        if nOnLine >= max_per_line:
            ret += '\n' + indent
            nOnLine = 0

    return ret

def format_quaternion(quaternion):
    return format_f(quaternion.x) + ',' + format_f(quaternion.z) + ',' + format_f(quaternion.y) + ',' + format_f(-quaternion.w)

def format_int(int):
    candidate = str(int) # when int string of an int
    if '.' in candidate:
        return format_f(math.floor(int)) # format_f removes un-neccessary precision
    else:
        return candidate

def format_bool(bool):
    if bool:
        return 'true'
    else:
        return 'false'

def scale_vector(vector, mult, xOffset = 0):
    ret = vector.copy()
    ret.x *= mult
    ret.x += xOffset
    ret.z *= mult
    ret.y *= mult
    return ret

def same_vertex(vertA, vertB):
    return vertA.x == vertB.x and vertA.y == vertB.y and vertA.z == vertB.z

def same_array(arrayA, arrayB):
    if len(arrayA) != len(arrayB): return False
    for i in range(len(arrayA)):
        if arrayA[i] != arrayB[i] : return False
        
    return True
#===============================================================================
# custom properties definition and display
#===============================================================================
bpy.types.Mesh.autoAnimate = bpy.props.BoolProperty(
    name='Auto launch animations',
    description='',
    default = False
)
bpy.types.Mesh.baseClass = bpy.props.StringProperty(
    name='Base class',
    description='Explicitly specify base class, system determines if blank',
    default = ''
)
bpy.types.Mesh.useFlatShading = bpy.props.BoolProperty(
    name='Use Flat Shading',
    description='Use face normals.  Increases vertices.',
    default = False
)
bpy.types.Mesh.checkCollisions = bpy.props.BoolProperty(
    name='Check Collisions',
    description='Indicates mesh should be checked that it does not run into anything.',
    default = False
)
bpy.types.Mesh.castShadows = bpy.props.BoolProperty(
    name='Cast Shadows',
    description='',
    default = False
)
bpy.types.Mesh.receiveShadows = bpy.props.BoolProperty(
    name='Receive Shadows',
    description='',
    default = False
)
bpy.types.Mesh.bakeSize = bpy.props.IntProperty(
    name='Texture Size',
    description='',
    default = 1024
)
bpy.types.Mesh.bakeQuality = bpy.props.IntProperty(
    name='Quality 1-100',
    description='The trade-off between Quality - File size(100 highest quality)',
    default = 50, min = 1, max = 100
)
bpy.types.Mesh.materialNameSpace = bpy.props.StringProperty(
    name='Name Space',
    description='Prefix to use for materials for sharing across .blends.',
    default = DEFAULT_MATERIAL_NAMESPACE
)
bpy.types.Mesh.checkReadyOnlyOnce = bpy.props.BoolProperty(
    name='Check Ready Only Once',
    description='When checked better CPU utilization.  Advanced user option.',
    default = False
)
bpy.types.Mesh.freezeWorldMatrix = bpy.props.BoolProperty(
    name='Freeze World Matrix',
    description='Indicate the position, rotation, & scale do not change for performance reasons',
    default = False
)
bpy.types.Mesh.loadDisabled = bpy.props.BoolProperty(
    name='Load Disabled',
    description='Indicate this mesh & children should not be active until enabled by code.',
    default = False
)
bpy.types.Mesh.attachedSound = bpy.props.StringProperty(
    name='Sound',
    description='',
    default = ''
)
bpy.types.Mesh.loopSound = bpy.props.BoolProperty(
    name='Loop sound',
    description='',
    default = True
)
bpy.types.Mesh.autoPlaySound = bpy.props.BoolProperty(
    name='Auto play sound',
    description='',
    default = True
)
bpy.types.Mesh.maxSoundDistance = bpy.props.FloatProperty(
    name='Max sound distance',
    description='',
    default = 100
)
bpy.types.Mesh.maxInfluencers = bpy.props.IntProperty(
    name='Max bone Influencers / Vertex',
    description='When fewer than this are observed, the lower value is used.',
    default = 8, min = 1, max = 8
)
bpy.types.Mesh.ignoreShapeKeys = bpy.props.BoolProperty(
    name='Ignore',
    description='Do not export shapekeys if found',
    default = False
)
bpy.types.Mesh.defaultShapeKeyGroup = bpy.props.StringProperty(
    name='Default group',
    description='The shape key group name to use when Shape key name not in the format:GROUP-KEY_NAME (upper case only)',
    default = 'ENTIRE_MESH'
)
#===============================================================================
bpy.types.Camera.autoAnimate = bpy.props.BoolProperty(
    name='Auto launch animations',
    description='',
    default = False
)
bpy.types.Camera.CameraType = bpy.props.EnumProperty(
    name='Camera Type',
    description='',
    # ONLY Append, or existing .blends will have their camera changed
    items = (
             (V_JOYSTICKS_CAM        , 'Virtual Joysticks'       , 'Use Virtual Joysticks Camera'),
             (TOUCH_CAM              , 'Touch'                   , 'Use Touch Camera'),
             (GAMEPAD_CAM            , 'Gamepad'                 , 'Use Gamepad Camera'),
             (FREE_CAM               , 'Free'                    , 'Use Free Camera'),
             (FOLLOW_CAM             , 'Follow'                  , 'Use Follow Camera'),
             (DEV_ORIENT_CAM         , 'Device Orientation'      , 'Use Device Orientation Camera'),
             (ARC_ROTATE_CAM         , 'Arc Rotate'              , 'Use Arc Rotate Camera'),
             (VR_DEV_ORIENT_FREE_CAM , 'VR Dev Orientation Free' , 'Use VR Dev Orientation Free Camera'),
             (WEB_VR_FREE_CAM        , 'Web VR Free'             , 'Use Web VR Free Camera')
            ),
    default = FREE_CAM
)
bpy.types.Camera.checkCollisions = bpy.props.BoolProperty(
    name='Check Collisions',
    description='',
    default = False
)
bpy.types.Camera.applyGravity = bpy.props.BoolProperty(
    name='Apply Gravity',
    description='',
    default = False
)
bpy.types.Camera.ellipsoid = bpy.props.FloatVectorProperty(
    name='Ellipsoid',
    description='',
    default = mathutils.Vector((0.2, 0.9, 0.2))
)
bpy.types.Camera.Camera3DRig = bpy.props.EnumProperty(
    name='Rig',
    description='',
    items = (
             (RIG_MODE_NONE                             , 'None'                  , 'No 3D effects'),
             (RIG_MODE_STEREOSCOPIC_ANAGLYPH            , 'Anaaglph'              , 'Stereoscopic Anagylph'),
             (RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL , 'side-by-side Parallel' , 'Stereoscopic side-by-side parallel'),
             (RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED, 'side-by-side crosseyed', 'Stereoscopic side-by-side crosseyed'),
             (RIG_MODE_STEREOSCOPIC_OVERUNDER           , 'over-under'            , 'Stereoscopic over-under'),
             (RIG_MODE_VR                               , 'VR distortion'         , 'Use Web VR Free Camera')
            ),
    default = RIG_MODE_NONE
)
bpy.types.Camera.interaxialDistance = bpy.props.FloatProperty(
    name='Interaxial Distance',
    description='Distance between cameras.  Used by all but VR 3D rigs.',
    default = 0.0637
)
#===============================================================================
bpy.types.Lamp.autoAnimate = bpy.props.BoolProperty(
    name='Auto launch animations',
    description='',
    default = False
)
bpy.types.Lamp.shadowMap = bpy.props.EnumProperty(
    name='Shadow Map',
    description='',
    items = ((NO_SHADOWS           , 'None'         , 'No Shadow Maps'),
             (STD_SHADOWS          , 'Standard'     , 'Use Standard Shadow Maps'),
             (POISSON_SHADOWS      , 'Poisson'      , 'Use Poisson Sampling'),
             (VARIANCE_SHADOWS     , 'Variance'     , 'Use Variance Shadow Maps'),
             (BLUR_VARIANCE_SHADOWS, 'Blur Variance', 'Use Blur Variance Shadow Maps')
            ),
    default = NO_SHADOWS
)

bpy.types.Lamp.shadowMapSize = bpy.props.IntProperty(
    name='Shadow Map Size',
    description='',
    default = 512
)
bpy.types.Lamp.shadowBias = bpy.props.FloatProperty(
    name='Shadow Bias',
    description='',
    default = 0.00005
)

bpy.types.Lamp.shadowBlurScale = bpy.props.IntProperty(
    name='Blur Scale',
    description='',
    default = 2
)

bpy.types.Lamp.shadowBlurBoxOffset = bpy.props.IntProperty(
    name='Blur Box Offset',
    description='',
    default = 0
)

class ObjectPanel(bpy.types.Panel):
    bl_label = 'Tower of Babel'
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'data'

    def draw(self, context):
        ob = context.object
        if not ob or not ob.data:
            return

        layout = self.layout
        isMesh = isinstance(ob.data, bpy.types.Mesh)
        isCamera = isinstance(ob.data, bpy.types.Camera)
        isLight = isinstance(ob.data, bpy.types.Lamp)

        if isMesh:
            layout.prop(ob.data, 'baseClass')
            
            row = layout.row()
            row.prop(ob.data, 'useFlatShading')
            row.prop(ob.data, 'checkCollisions')
            
            row = layout.row()
            row.prop(ob.data, 'castShadows')
            row.prop(ob.data, 'receiveShadows')
            
            row = layout.row()
            row.prop(ob.data, 'freezeWorldMatrix')
            row.prop(ob.data, 'loadDisabled')
            
            layout.prop(ob.data, 'autoAnimate')            
            layout.prop(ob.data, 'maxInfluencers')
            
            box = layout.box()
            box.label(text="Shape Keys:")
            box.prop(ob.data, 'ignoreShapeKeys')
            box.prop(ob.data, 'defaultShapeKeyGroup')

            box = layout.box()
            box.label('Materials')
            box.prop(ob.data, 'materialNameSpace')
            box.prop(ob.data, 'checkReadyOnlyOnce')
            
            box = layout.box()
            box.label(text='Procedural Texture / Cycles Baking')
            box.prop(ob.data, 'bakeSize')
            box.prop(ob.data, 'bakeQuality')

            box = layout.box()
            box.prop(ob.data, 'attachedSound')
            box.prop(ob.data, 'autoPlaySound')
            box.prop(ob.data, 'loopSound')
            box.prop(ob.data, 'maxSoundDistance')

        elif isCamera:
            layout.prop(ob.data, 'CameraType')
            layout.prop(ob.data, 'checkCollisions')
            layout.prop(ob.data, 'applyGravity')
            layout.prop(ob.data, 'ellipsoid')

            box = layout.box()
            box.label(text="3D Camera Rigs")
            box.prop(ob.data, 'Camera3DRig')
            box.prop(ob.data, 'interaxialDistance')

            layout.prop(ob.data, 'autoAnimate')

        elif isLight:
            layout.prop(ob.data, 'shadowMap')
            layout.prop(ob.data, 'shadowMapSize')
            layout.prop(ob.data, 'shadowBias')

            box = layout.box()
            box.label(text="Blur Variance Shadows")
            box.prop(ob.data, 'shadowBlurScale')
            box.prop(ob.data, 'shadowBlurBoxOffset')

            layout.prop(ob.data, 'autoAnimate')
