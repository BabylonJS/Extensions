bl_info = {
    'name': 'Tower of Babel',
    'author': 'David Catuhe, Jeff Palmer',
    'version': (2, 0, 0),
    'blender': (2, 72, 0),
    'location': 'File > Export > Tower of Babel [.js + .ts + .html(s)]',
    'description': 'Translate to inline JavaScript & TypeScript modules',
    'warning': "Holy crap batman!  You've been warned!",
    'wiki_url': 'https://github.com/BabylonJS/Babylon.js/wiki/13-Blender',
    'tracker_url': '',
    'category': 'Import-Export'}
    
import bpy
import bpy_extras.io_utils
import time
import gpu # for experimental use in Materials constructor:   shader = gpu.export_shader(scene, material), (currently commented out)
import io
import math
import mathutils
import os
import shutil
import sys, traceback # for writing errors to log file
#===============================================================================
# Registration the calling of the INFO_MT_file_export file selector
def menu_func(self, context):
    self.layout.operator(TowerOfBabel.bl_idname, text = 'Tower of Babel [.js + .ts + .html(s)]')

# store keymaps here to access after registration (commented out for now)
#addon_keymaps = []

def register():
    bpy.utils.register_module(__name__)
    bpy.types.INFO_MT_file_export.append(menu_func)
    
    # create the hotkey
#    kc = bpy.context.window_manager.keyconfigs.addon
#    km = kc.keymaps.new(name='3D View', space_type='VIEW_3D')
#    kmi = km.keymap_items.new('wm.call_menu', 'W', 'PRESS', alt=True)
#    kmi.properties.name = TowerOfBabel.bl_idname
#    kmi.active = True
#    addon_keymaps.append((km, kmi))
    
def unregister():
    bpy.utils.unregister_module(__name__)
    bpy.types.INFO_MT_file_export.remove(menu_func)
    
#    for km, kmi in addon_keymaps:
#        km.keymap_items.remove(kmi)
#    addon_keymaps.clear()
    
if __name__ == '__main__':
    register()
#===============================================================================
# output related constants
MAX_VERTEX_ELEMENTS = 65535
VERTEX_OUTPUT_PER_LINE = 1000
MAX_FLOAT_PRECISION = '%.4f'
MAX_INFLUENCERS_PER_VERTEX = 4

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
ANAGLYPH_ARC_CAM = 'AnaglyphArcRotateCamera' 
ANAGLYPH_FREE_CAM = 'AnaglyphFreeCamera'
ARC_ROTATE_CAM = 'ArcRotateCamera' 
DEV_ORIENT_CAM = 'DeviceOrientationCamera'
FOLLOW_CAM = 'FollowCamera'
FREE_CAM = 'FreeCamera' 
GAMEPAD_CAM = 'GamepadCamera'
OCULUS_CAM = 'OculusCamera'
TOUCH_CAM = 'TouchCamera'
V_JOYSTICKS_CAM = 'VirtualJoysticksCamera'
OCULUS_GAMEPAD_CAM = 'OculusGamepadCamera'
VR_DEV_ORIENT_CAM ='VRDeviceOrientationCamera'
WEB_VR_CAM = 'WebVRCamera'

# used in Light constructor, never formally defined in Babylon, but used in babylonFileLoader
POINT_LIGHT = 0
DIRECTIONAL_LIGHT = 1
SPOT_LIGHT = 2
HEMI_LIGHT = 3

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

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONTYPE_FLOAT = 0
ANIMATIONTYPE_VECTOR3 = 1
#ANIMATIONTYPE_QUATERNION = 2
ANIMATIONTYPE_MATRIX = 3
#ANIMATIONTYPE_COLOR3 = 4

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONLOOPMODE_RELATIVE = 0
ANIMATIONLOOPMODE_CYCLE = 1
#ANIMATIONLOOPMODE_CONSTANT = 2
#===============================================================================
class TowerOfBabel(bpy.types.Operator, bpy_extras.io_utils.ExportHelper):  
    bl_idname = 'unknown.use'          # module will not load with out it, also must have a dot
    bl_label = 'TOB Export'            # used on the label of the actual 'save' button
    filename_ext = '.js'               # required to have one, although not really used
    nNonLegalNames = 0

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    log_handler = None  # assigned in execute
    nameSpace   = None  # assigned in execute
    versionCheckCode = 'if (!BABYLON.Engine.Version || Number(BABYLON.Engine.Version.substr(0, BABYLON.Engine.Version.lastIndexOf("."))) < 2.0) throw "Babylon version too old";\n'
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                
    export_onlyCurrentLayer = bpy.props.BoolProperty(
        name="Export only current layer",
        description="Export only current layer",
        default = False,
        )
    
    export_javaScript = bpy.props.BoolProperty(
        name="Export Javascript (.js) File",
        description="Produce an inline JavaScript (xxx.js) File",
        default = True,
        )
    
    export_typeScript = bpy.props.BoolProperty(
        name="Export Typescript (.ts) File",
        description="Produce an inline TypeScript (xxx.ts) File",
        default = False,
        )
    
    export_html = bpy.props.BoolProperty(
        name="Export applicable .html File(s)",
        description="Produce a xxx_JSON.html and/or xxx_inline.html as required by other selections",
        default = False,
        )
   
    logInBrowserConsole = bpy.props.BoolProperty(
        name="Log in Browser Console",
        description="add console logs for calls to code",
        default = True,
        )
    
    includeInitScene = bpy.props.BoolProperty(
        name="Include initScene()",
        description="add an initScene() method to the .js / .ts",
        default = True,
        )
    
    includeMeshFactory = bpy.props.BoolProperty(
        name="Include meshFactory()",
        description="add an meshFactory() method to the .js / .ts",
        default = False,
        )
    
    def draw(self, context):
        layout = self.layout

        layout.prop(self, 'export_onlyCurrentLayer') 
        layout.prop(self, "export_javaScript")
        layout.prop(self, "export_typeScript")
        layout.prop(self, "export_html")
        layout.prop(self, "logInBrowserConsole")
        layout.separator()
        
        layout.prop(self, "includeInitScene")
        layout.prop(self, "includeMeshFactory")
      
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    nWarnings = 0      
    @staticmethod
    def warn(msg, numTabIndent = 1, noNewLine = False):
        TowerOfBabel.log(msg, numTabIndent, noNewLine)
        TowerOfBabel.nWarnings += 1
                  
    @staticmethod
    def log(msg, numTabIndent = 1, noNewLine = False):
        for i in range(numTabIndent):
            TowerOfBabel.log_handler.write('\t')
            
        TowerOfBabel.log_handler.write(msg)
        if not noNewLine: TowerOfBabel.log_handler.write('\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    logInConsole = True; # static version, set in execute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                
    @staticmethod
    def define_module_method(name, is_typescript, loadCheckVar = '', optionalArg = '', optionalTsType = '', optionalDefault = '""'):
        if is_typescript:
            ret = '\n    export function ' + name + '(scene : BABYLON.Scene'
            if len(optionalArg) > 0 : ret += ', ' + optionalArg + ' : ' + optionalTsType + " = " + optionalDefault
            ret += ') : void {\n'
        else:
            ret = '\n    function ' + name + '(scene'
            if len(optionalArg) > 0 : 
                ret += ', ' + optionalArg + ') {\n'
                ret += '        if (!' + optionalArg + ') { ' + optionalArg + ' = ' + optionalDefault + '; }\n'
            else:
                ret += ') {\n'
            
        ret += '        ' + TowerOfBabel.versionCheckCode
        if len(loadCheckVar) > 0 : ret += '        if (' + loadCheckVar + ') return;\n'
        
        if TowerOfBabel.logInConsole: ret += "        BABYLON.Tools.Log('In " + TowerOfBabel.nameSpace + "." + name + "');\n"
        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    materials = []               
    @staticmethod
    def uvRequiredForMaterial(baseMaterialId):
        fullName = TowerOfBabel.nameSpace + '.' + baseMaterialId
        for material in TowerOfBabel.materials:
            if material.name == fullName and len(material.textures) > 0:
                return True
        return False
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                
    def execute(self, context):
        try:
            filepathDotExtension = self.filepath.rpartition('.')
            self.filepathMinusExtension = filepathDotExtension[0]
            
            # assign nameSpace, based on OS
            if self.filepathMinusExtension.find('\\') != -1:
                TowerOfBabel.nameSpace = legal_js_identifier(self.filepathMinusExtension.rpartition('\\')[2])
            else:
                TowerOfBabel.nameSpace = legal_js_identifier(self.filepathMinusExtension.rpartition('/')[2])

            # explicitly reset globals, in case there was an earlier export this session
            TowerOfBabel.nNonLegalNames = 0
            TowerOfBabel.nWarnings = 0
            TowerOfBabel.materials = []
            TowerOfBabel.logInConsole = self.logInBrowserConsole  # cannot be the same name, or checkbox does not show

            
            TowerOfBabel.log_handler = io.open(self.filepathMinusExtension + '.log', 'w', encoding='utf8')
            TOB_version = bl_info['version']
            TowerOfBabel.log('Tower of Babel version: ' + str(TOB_version[0]) + '.' + str(TOB_version[1]) +  '.' + str(TOB_version[2]) + 
                             ', Blender version: ' + bpy.app.version_string)

            if bpy.ops.object.mode_set.poll():
                bpy.ops.object.mode_set(mode = 'OBJECT')      

            scene = context.scene   
            TowerOfBabel.log('========= Conversion from Blender to Babylon friendly Python objects =========', 0)
            self.world = World(scene)

            bpy.ops.screen.animation_cancel()
            currentFrame = bpy.context.scene.frame_current
            bpy.context.scene.frame_set(0)

            # Active camera
            if scene.camera != None:
                self.activeCamera = scene.camera.name
            else:
                TowerOfBabel.warn('WARNING: No active camera has been assigned, or is not in a currently selected Blender layer')

            # Materials, static for ease of uvs requirement testing
            stuffs = [mat for mat in bpy.data.materials if mat.users >= 1]
            for material in stuffs:
                TowerOfBabel.materials.append(Material(material, scene, self.filepath)) # need file path incase an image texture

            self.cameras = []
            self.lights = []
            self.shadowGenerators = []
            self.skeletons = []
            skeletonId = 0
            self.meshesAndNodes = []
            self.hasShapeKeys = False
            self.multiMaterials = []
            
            # exclude lamps in this pass, so ShadowGenerator constructor can be passed meshesAnNodes
            for object in [object for object in scene.objects]:
                if object.type == 'CAMERA':
                    if object.is_visible(scene): # no isInSelectedLayer() required, is_visible() handles this for them
                        self.cameras.append(Camera(object))
                    else:
                        TowerOfBabel.warn('WARNING: The following camera not visible in scene thus ignored: ' + object.name)

                elif object.type == 'ARMATURE':  #skeleton.pose.bones
                    if object.is_visible(scene):
                        self.skeletons.append(Skeleton(object, scene, skeletonId))
                        skeletonId += 1
                    else:
                        TowerOfBabel.warn('WARNING: The following armature not visible in scene thus ignored: ' + object.name)

                elif object.type == 'MESH':
                    forcedParent = None
                    nameID = ''
                    nextStartFace = 0

                    while True and self.isInSelectedLayer(object, scene):
                        mesh = Mesh(object, scene, self.multiMaterials, nextStartFace, forcedParent, nameID, self.includeMeshFactory)
                        self.meshesAndNodes.append(mesh)
                        self.hasShapeKeys = self.hasShapeKeys or hasattr(mesh, 'shapeKeyGroups')
                        nextStartFace = mesh.offsetFace
                        if nextStartFace == 0:
                            break

                        if forcedParent is None:
                            nameID = 0
                            forcedParent = object
                            TowerOfBabel.warn('WARNING: The following mesh has exceeded the maximum # of vertex elements & will be broken into multiple Babylon meshes: ' + object.name)

                        nameID = nameID + 1
                    
                elif object.type == 'EMPTY':
                    self.meshesAndNodes.append(Node(object, self.includeMeshFactory))
                                     
                elif object.type != 'LAMP':
                    TowerOfBabel.warn('WARNING: The following object (type - ' +  object.type + ') is not currently exportable thus ignored: ' + object.name)
            
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
                                TowerOfBabel.warn('WARNING: Only directional (sun) and spot types of lamp are valid for shadows thus ignored: ' + object.name)                                
                    else:
                        TowerOfBabel.warn('WARNING: The following lamp not visible in scene thus ignored: ' + object.name)

            bpy.context.scene.frame_set(currentFrame)

            # 3 passes of output files
            if (self.export_typeScript): self.core_script_file(True , TOB_version)
            if (self.export_javaScript): self.core_script_file(False, TOB_version)
            if (self.export_html):
                TowerOfBabel.log('========= Writing of html files started =========', 0)
                self.writeHtmls(True , self.hasShapeKeys, self.includeMeshFactory)
                self.writeHtmls(False, self.hasShapeKeys, self.includeMeshFactory)
                TowerOfBabel.log('========= Writing of html files completed =========', 0)
            
        except:# catch *all* exceptions
            ex = sys.exc_info()
            TowerOfBabel.log('========= An error was encountered =========', 0)
            stack = traceback.format_tb(ex[2])
            for line in stack:
               TowerOfBabel.log_handler.write(line) # avoid tabs & extra newlines by not calling log() inside catch
               
            TowerOfBabel.log_handler.write('ERROR:  ' + str(ex[1]) + '\n')
            raise
        
        finally:
            TowerOfBabel.log('========= end of processing =========', 0)
            TowerOfBabel.log_handler.close()
            
            if (TowerOfBabel.nWarnings > 0):
                self.report({'WARNING'}, 'Processing completed, but ' + str(TowerOfBabel.nWarnings) + ' WARNINGS were raised,  see log file.')
        
        return {'FINISHED'}
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                
    def core_script_file(self, is_typescript, TOB_version): 
        indent1 = '    '
        indent2 = '        '
        close   = '}\n'        if is_typescript else '};\n' 
        name    = 'typescript' if is_typescript else 'javascript'
        ext     = '.ts'        if is_typescript else '.js'
        
        TowerOfBabel.log('========= Writing of ' + name + ' file started =========', 0)
        file_handler = io.open(self.filepathMinusExtension + ext, 'w', encoding='utf8') 
        
        file_handler.write('// File generated with Tower of Babel version: ' + str(TOB_version[0]) + '.' + str(TOB_version[1]) +  '.' + str(TOB_version[2]) +
                           ' on ' + time.strftime("%x") + '\n\n')
        
        # module open  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if is_typescript:
            file_handler.write('module ' + TowerOfBabel.nameSpace + '{\n\n')
        else:
            file_handler.write('var __extends = this.__extends || function (d, b) {\n')
            file_handler.write('    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n')
            file_handler.write('    function __() { this.constructor = d; }\n')
            file_handler.write('    __.prototype = b.prototype;\n')
            file_handler.write('    d.prototype = new __();\n')
            file_handler.write('};\n')
            file_handler.write('var ' + TowerOfBabel.nameSpace + ';\n')
            file_handler.write('(function (' + TowerOfBabel.nameSpace + ') {\n')
            
        # World - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        hasMultiMat  = len(self.multiMaterials) > 0
        hasSkeletons = len(self.skeletons) > 0
        hasCameras   = len(self.cameras) > 0
        hasLights    = len(self.lights ) > 0
        hasShadows   = len(self.shadowGenerators) > 0
        if self.includeInitScene:
            self.world.initScene_script(file_handler, self.meshesAndNodes, is_typescript, hasSkeletons, hasCameras, hasLights, hasShadows, self.includeMeshFactory)
        if self.includeMeshFactory:
            self.world.meshFactory_script(file_handler, self.meshesAndNodes, is_typescript)
            
        # Materials - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        # always need defineMaterials, since called by meshes
        file_handler.write('\n' + indent1 + 'var matLoaded = false;')
        file_handler.write(TowerOfBabel.define_module_method('defineMaterials', is_typescript, 'matLoaded', 'materialsRootDir', 'string', '"./"'))
        file_handler.write(indent2 + 'if (materialsRootDir.lastIndexOf("/") + 1  !== materialsRootDir.length) { materialsRootDir  += "/"; }\n')

        file_handler.write(indent2 + 'var material' + (' : BABYLON.StandardMaterial;\n' if is_typescript else ';\n') )          
        file_handler.write(indent2 + 'var texture'  + (' : BABYLON.Texture;\n'          if is_typescript else ';\n') )           
        for material in TowerOfBabel.materials:
            material.core_script(file_handler, indent2)
        if hasMultiMat: file_handler.write(indent2 + 'defineMultiMaterials(scene);\n')
        file_handler.write(indent2 + 'matLoaded = true;\n')
        file_handler.write(indent1 + '}\n')
        if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineMaterials = defineMaterials;\n')
        
        # Multi-materials - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if hasMultiMat:
            file_handler.write(TowerOfBabel.define_module_method('defineMultiMaterials', is_typescript))
            file_handler.write(indent2 + 'var multiMaterial' + (' : BABYLON.MultiMaterial;\n' if is_typescript else ';\n') )           
            for multimaterial in self.multiMaterials: 
                multimaterial.core_script(file_handler, indent2)
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineMultiMaterials = defineMultiMaterials;\n')

        # Armatures/Bones - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if hasSkeletons:
            file_handler.write('\n' + indent1 + 'var bonesLoaded = false;')
            file_handler.write(TowerOfBabel.define_module_method('defineSkeletons', is_typescript, 'bonesLoaded'))
            file_handler.write(indent2 + 'var skeleton'  + (' : BABYLON.Skeleton;\n'  if is_typescript else ';\n') )          
            file_handler.write(indent2 + 'var bone'      + (' : BABYLON.Bone;\n'      if is_typescript else ';\n') )           
            file_handler.write(indent2 + 'var animation' + (' : BABYLON.Animation;\n' if is_typescript else ';\n') )          
            for skeleton in self.skeletons:
                skeleton.core_script(file_handler, indent2)
            file_handler.write(indent2 + 'bonesLoaded = true;\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineSkeletons = defineSkeletons;\n')

        # Meshes and Nodes - - - - - - - - - - - - - - - - - - - - - - - - - - -
        for mesh in self.meshesAndNodes:
            mesh.core_script(file_handler, self.get_kids(mesh), indent1, is_typescript)
        
        # Cameras - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        if hasCameras:
            file_handler.write(TowerOfBabel.define_module_method('defineCameras', is_typescript))
            file_handler.write(indent2 + 'var camera;\n') # intensionally vague, since sub-classes instances & different specifc propeties set           
            for camera in self.cameras:
                if hasattr(camera, 'fatalProblem'): continue
                camera.update_for_target_attributes(self.meshesAndNodes)
                camera.core_script(file_handler, indent2, is_typescript)
            
            if hasattr(self, 'activeCamera'):
                file_handler.write(indent2 + 'scene.setActiveCameraByID("' + self.activeCamera + '");\n')
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineCameras = defineCameras;\n')
        
        # Lights - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if hasLights:
            file_handler.write(TowerOfBabel.define_module_method('defineLights', is_typescript))
            file_handler.write(indent2 + 'var light;\n') # intensionally vague, since sub-classes instances & different specifc propeties set          
            for light in self.lights:
                light.core_script(file_handler, indent2, is_typescript)
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineLights = defineLights;\n')
                                    
        # Shadow generators - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if len(self.shadowGenerators) > 0:
            file_handler.write(TowerOfBabel.define_module_method('freshenShadowRenderLists', is_typescript))
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
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.freshenShadowRenderLists = freshenShadowRenderLists;\n')
            
            file_handler.write(TowerOfBabel.define_module_method('defineShadowGen', is_typescript))
            file_handler.write(indent2 + 'var light;\n') # intensionally vague, since scene.getLightByID() returns Light, not DirectionalLight          
            file_handler.write(indent2 + 'var shadowGenerator' + (' : BABYLON.ShadowGenerator;\n' if is_typescript else ';\n') )           
            for shadowGen in self.shadowGenerators:
                shadowGen.core_script(file_handler, indent2)
            file_handler.write(indent2 + 'freshenShadowRenderLists(scene);\n')           
            file_handler.write(indent1 + '}\n')
            if not is_typescript: file_handler.write(indent1 + TowerOfBabel.nameSpace + '.defineShadowGen = defineShadowGen;\n')

        # Module closing - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        if is_typescript:
            file_handler.write('\n}')
        else:
            file_handler.write('})(' + TowerOfBabel.nameSpace + ' || ('  + TowerOfBabel.nameSpace + ' = {}));')
            
        file_handler.close()        
        TowerOfBabel.log('========= Writing of ' + name + ' file completed =========', 0)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    def writeHtmls(self, is_cocoonJS, hasShapeKeys, useFactory): 
        header =  '<head>\n'
        header += '    <meta charset="UTF-8">\n'
        header += '    <title>' + TowerOfBabel.nameSpace + '</title>\n' 
        header += '    <!-- edit path - name of babylon & other libraries as required -->\n'
        header += '    <script src="http://cdn.babylonjs.com/2-0/babylon.js"></script>\n'
        if hasShapeKeys:
            header += '    <script src="./POV.js"></script>\n' 
            header += '    <script src="./morph.js"></script>\n' 
        if useFactory:
            header += '    <script src="./TOB-runtime.js"></script>\n' 
        if is_cocoonJS:
            header += '    <script src="./cocoon.js"></script>\n' 
        header += '    <script src="./' + TowerOfBabel.nameSpace + '.js"></script>\n' 
        
        if is_cocoonJS:
            header += '    <meta name="viewport" \n'
            header += '          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi">\n'
        else:
            header += '    <style>\n' 
            header += '         html, body   { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; } \n' 
            header += '         #renderCanvas{ width: 100%; height: 100%; } \n' 
            header += '    </style>\n' 
            
        header += '</head>\n'
        
        body   =  '<body>\n<canvas id="renderCanvas"></canvas>\n'

        supported     = '    if (BABYLON.Engine.isSupported()) {\n'
        
        scriptBody   =  '        var canvas = document.getElementById("renderCanvas");\n'
        if is_cocoonJS:
            scriptBody   += '        canvas.screencanvas = true;\n'
            scriptBody   += '        var width  = window.devicePixelRatio * window.innerWidth;\n'
            scriptBody   += '        var height = window.devicePixelRatio * window.innerHeight;\n'
            scriptBody   += '        canvas.width = width;\n'
            scriptBody   += '        canvas.height = height;\n'
            scriptBody   += '        canvas.getContext("webgl"); // preemptively create a device sized, webgl context; only 1 is ever created \n\n'

        scriptBody   += '        var engine = new BABYLON.Engine(canvas, true);\n'
        if is_cocoonJS:
            scriptBody   += '        engine.setSize(width, height);\n'
            if TowerOfBabel.logInConsole: scriptBody   += '        BABYLON.Tools.Log("Cocoon version:  " + Cocoon.version);\n'

        scriptBody   += '\n'
        scriptBody   += '        var scene = new BABYLON.Scene(engine);\n'
        scriptBody   += '        materialsRootDir = "."; // edit when texture files in a different dir than html\n'
        scriptBody   += '        ' + TowerOfBabel.nameSpace + '.initScene(scene, materialsRootDir);\n'
        scriptBody   += '        scene.activeCamera.attachControl(canvas);\n'
        scriptBody   += '        engine.runRenderLoop(function () {\n'
        scriptBody   += '            scene.render();\n'
        scriptBody   += '        });\n'
        
        noWebGL      =  '    }else{\n'
        noWebGL      += '        alert("WebGL not supported in this browser.\\n\\n" + \n'
        noWebGL      += '              "If in Safari browser, check \'Show Develop menu in menu bar\' on the Advanced tab of Preferences.  " +\n'
        noWebGL      += '              "On the \'Develop\' menu, check the \'Enable WebGL\' menu item.");\n'
        noWebGL      += '    }\n\n'

        resize       =  '    //Resize\n'
        resize       += '    window.addEventListener("resize", function () {\n'
        resize       += '        engine.resize();\n'
        resize       += '    });\n'
        
        appEvents     = '        //app activation\n'
        appEvents    += '        Cocoon.App.on("activated", function(){\n'
        appEvents    += '            POV.BeforeRenderer.resumeSystem();\n'
        appEvents    += '        });\n\n'
        
        appEvents    += '        //app Resume\n'
        appEvents    += '        Cocoon.App.on("suspending", function () {\n'
        appEvents    += '            POV.BeforeRenderer.pauseSystem();\n'
        appEvents    += '        });\n\n'
        
        filename =  self.filepathMinusExtension;
        filename += '_cocoon.html' if is_cocoonJS else '.html'
        file_handler = io.open(filename, 'w', encoding='utf8') 
        file_handler.write('<html>\n')
        file_handler.write(header)
        file_handler.write(body)
        file_handler.write('<script>\n')
        if is_cocoonJS:
            file_handler.write(scriptBody)
            if hasShapeKeys:
                file_handler.write(appEvents)
        else:
            file_handler.write(supported)
            file_handler.write(scriptBody)
            file_handler.write(noWebGL)
            file_handler.write(resize)
        file_handler.write('</script>\n')
        file_handler.write('</body>\n')
        file_handler.write('</html>\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                
    def isInSelectedLayer(self, obj, scene):
        return not self.export_onlyCurrentLayer or obj.layers[scene.active_layer]
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
    # not relying on python parentObj.children, since would not account for forced parents (those meshes with > MAX_VERTEX_ELEMENTS)
    def get_kids(self, prospectiveParent):
        kids = []
        for mesh in self.meshesAndNodes:
            if hasattr(mesh, 'parentId') and mesh.parentId == prospectiveParent.name:
                kids.append(mesh)
        return kids
#===============================================================================
class World:
    def __init__(self, scene):
        self.autoClear = True
        world = scene.world
        if world:
            self.world_ambient = world.ambient_color
        else:
            self.world_ambient = mathutils.Color((0.2, 0.2, 0.3))

        self.gravity = scene.gravity
        
        if world and world.mist_settings.use_mist:
            self.fogMode = FOGMODE_LINEAR
            self.fogColor = world.horizon_color
            self.fogStart = world.mist_settings.start
            self.fogEnd = world.mist_settings.depth
            self.fogDensity = 0.1
    
        TowerOfBabel.log('Python World class constructor completed')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def initScene_script(self, file_handler, meshes, is_typescript, hasSkeletons, hasCameras, hasLights, hasShadows, useFactory): 
        file_handler.write(TowerOfBabel.define_module_method('initScene', is_typescript, '', 'materialsRootDir', 'string', '"./"'))
            
        indent = '        '           
        file_handler.write(indent + 'scene.autoClear = ' + format_bool(self.autoClear) + ';\n')
        file_handler.write(indent + 'scene.clearColor    = new BABYLON.Color3(' + format_color(self.world_ambient) + ');\n')
        file_handler.write(indent + 'scene.ambientColor  = new BABYLON.Color3(' + format_color(self.world_ambient) + ');\n')
        file_handler.write(indent + 'scene.gravity = new BABYLON.Vector3(' + format_vector(self.gravity) + ');\n')

        if hasattr(self, 'fogMode'):
            file_handler.write(indent + 'scene.fogMode = ' + self.fogMode + ';\n')
            file_handler.write(indent + 'scene.fogColor = new BABYLON.Color3(' + format_color(self.fogColor) + ');\n')
            file_handler.write(indent + 'scene.fogStart = ' + self.fogStart + ';\n')
            file_handler.write(indent + 'scene.fogEnd = ' + self.fogEnd + ';\n')
            file_handler.write(indent + 'scene.fogDensity = ' + self.fogDensity + ';\n')
            
        file_handler.write('\n' + indent + '// define materials & skeletons before meshes\n')
        file_handler.write(indent + 'defineMaterials(scene, materialsRootDir);\n')
        if hasSkeletons: file_handler.write(indent + 'defineSkeletons(scene);\n')
    
        file_handler.write('\n' + indent + '// instance all root meshes\n')
        if useFactory: file_handler.write(indent + 'TOWER_OF_BABEL.MeshFactory.MODULES.push(new MeshFactory(scene));\n')

        for mesh in meshes:
            if not hasattr(mesh, 'parentId'):
                if useFactory and not hasattr(mesh, 'shapeKeyGroups'):
                    file_handler.write(indent + 'TOWER_OF_BABEL.MeshFactory.instance("' + TowerOfBabel.nameSpace + '", "' + mesh.name + '", true);\n')
                else:
                    file_handler.write(indent + 'new ' + mesh.legalName + '("' + mesh.name + '", scene);\n')
        
        if hasCameras: file_handler.write('\n' + indent + '// define cameras after meshes, incase LockedTarget is in use\n')
        if hasCameras: file_handler.write(indent +'defineCameras(scene);\n')
        
        if hasLights : file_handler.write(indent + 'defineLights(scene);\n')
        if hasShadows: file_handler.write('\n' + indent + '// cannot call Shadow Gen prior to all lights & meshes being instanced\n')
        if hasShadows: file_handler.write(indent + 'defineShadowGen(scene);\n') 
        
        file_handler.write('    }\n')                                                                                   
        if not is_typescript:
            file_handler.write('    ' + TowerOfBabel.nameSpace + '.initScene = initScene;\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def meshFactory_script(self, file_handler, meshesAndNodes, is_typescript): 
        rootMeshes = []
        classNames = []
        isNode     = []
        factoryIdx = 0
        for mesh in meshesAndNodes:
            if not hasattr(mesh, 'parentId') and not hasattr(mesh, 'shapeKeyGroups'):
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
            TowerOfBabel.warn('WARNING: No meshes without parents, so meshFactory not built')
            return
        
        file_handler.write('    var meshLib = new Array' + ('<Array<BABYLON.Mesh>>(' if is_typescript else '(') + str(len(rootMeshes)) + ');\n')
        file_handler.write('    var cloneCount = 1;\n\n') 
        file_handler.write('    var originalVerts = 0;\n')
        file_handler.write('    var clonedVerts = 0;\n')
       
        if is_typescript:
            file_handler.write('    export class MeshFactory implements TOWER_OF_BABEL.FactoryModule {\n')                
            file_handler.write('        constructor(private _scene : BABYLON.Scene, materialsRootDir: string = "./") {\n')
            file_handler.write('            ' + TowerOfBabel.nameSpace + '.defineMaterials(_scene, materialsRootDir); //embedded version check\n')
            file_handler.write('        }\n\n')
            file_handler.write('        public getModuleName() : string { return "' + TowerOfBabel.nameSpace + '";}\n\n')
            file_handler.write('        public instance(meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh {\n')

        else:
            file_handler.write('    var MeshFactory = (function () {\n')
            file_handler.write('        function MeshFactory(_scene, materialsRootDir) {\n')
            file_handler.write('            this._scene = _scene;\n');
            file_handler.write('            if (!materialsRootDir) { materialsRootDir = "./"; }\n')                
            file_handler.write('            ' + TowerOfBabel.nameSpace + '.defineMaterials(_scene, materialsRootDir); //embedded version check\n')
            file_handler.write('        }\n\n')
            file_handler.write('        MeshFactory.prototype.getModuleName = function () { return "' + TowerOfBabel.nameSpace + '";};\n\n')
            file_handler.write('        MeshFactory.prototype.instance = function (meshName, cloneSkeleton) {\n')
        
        file_handler.write('            var ret' + (':BABYLON.Mesh' if is_typescript else '') + ' = null;\n')
        file_handler.write('            var src' + (':BABYLON.Mesh' if is_typescript else '') + ';\n')
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
        file_handler.write('            else BABYLON.Tools.Error("Mesh not found: " + meshName);\n')
        file_handler.write('            return ret;\n')

        if is_typescript:
             file_handler.write('        }\n')                                                                                   
             file_handler.write('    }\n')                                                                                   
                                                                                           
        else:
            file_handler.write('        };\n')                                                                                   
            file_handler.write('        return MeshFactory;\n')
            file_handler.write('    })();\n')                                                                                   
            file_handler.write('    ' + TowerOfBabel.nameSpace + '.MeshFactory = MeshFactory;\n')
            
        if is_typescript:
            file_handler.write('    function getViable(libIdx : number, isNode? : boolean) : BABYLON.Mesh {\n')
        else:
            file_handler.write('    function getViable(libIdx, isNode) {\n')
        file_handler.write('        var meshes = meshLib[libIdx];\n')
        file_handler.write('        if (!meshes || meshes === null){\n')
        file_handler.write('            if (!meshes) meshLib[libIdx] = new Array' + ('<BABYLON.Mesh>' if is_typescript else '') + '();\n')
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
            file_handler.write('    function getStats() { return [cloneCount, originalVerts, clonedVerts]; }' + TowerOfBabel.nameSpace + '.getStats = getStats;\n\n')

#===============================================================================
class FCurveAnimatable:
    def __init__(self, object, supportsRotation, supportsPosition, supportsScaling, xOffsetForRotation = 0):  
        
        # just because a sub-class can be animatable does not mean it is
        self.animationsPresent = object.animation_data and object.animation_data.action
        
        rotAnim = False
        locAnim = False
        scaAnim = False
        
        if (self.animationsPresent):
            TowerOfBabel.log('FCurve animation processing begun for:  ' + object.name, 1)
            self.animations = []
            for fcurve in object.animation_data.action.fcurves:
                if supportsRotation and fcurve.data_path == 'rotation_euler' and rotAnim == False:
                    self.animations.append(VectorAnimation(object, 'rotation_euler', 'rotation', -1, xOffsetForRotation))
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
    def core_script(self, file_handler, jsVarName, indent, is_typescript): 
        if (self.animationsPresent):
            file_handler.write(indent + 'var animation' + (' : BABYLON.Animation;\n' if is_typescript else ';\n') )          
            for animation in self.animations:
                animation.core_script(file_handler, indent) # assigns the previously declared js variable 'animation'
                file_handler.write(indent + jsVarName + '.animations.push(animation);\n')

            if (hasattr(self, "autoAnimate") and self.autoAnimate):
                file_handler.write(indent + 'scene.beginAnimation(' + jsVarName + ', ' + 
                                             format_int(self.autoAnimateFrom) + ',' + 
                                             format_int(self.autoAnimateTo) + ',' + 
                                             format_bool(self.autoAnimateLoop) + ', 1.0);\n')
#===============================================================================
class Mesh(FCurveAnimatable):
    def __init__(self, object, scene, multiMaterials, startFace, forcedParent, nameID, includeMeshFactory):
        super().__init__(object, True, True, True)  #Should animations be done when foredParent
        
        self.name = object.name + str(nameID)
        TowerOfBabel.log('processing begun of mesh:  ' + self.name)
        
        # Tower of Babel specific member
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(TowerOfBabel.nNonLegalNames)
            TowerOfBabel.nNonLegalNames = TowerOfBabel.nNonLegalNames + 1
            
        self.isVisible = not object.hide_render
        self.isEnabled = True
        self.useFlatShading = object.data.useFlatShading
        self.checkCollisions = object.data.checkCollisions
        self.receiveShadows = object.data.receiveShadows
        self.castShadows = object.data.castShadows
        self.baseClass = object.data.baseClass
        
        if forcedParent is None:     
            self.dataName = object.data.name # used to support shared vertex instances in later passed
            if object.parent and object.parent.type != 'ARMATURE':
                self.parentId = object.parent.name
        else:
            self.dataName = self.name
            self.parentId = forcedParent.name

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
        
        # hasSkeleton detection & skeletonID determination
        hasSkeleton = True if object.parent and object.parent.type == 'ARMATURE' and object.parent.is_visible(scene) and len(object.vertex_groups) > 0 else False
        if hasSkeleton:
            # determine the skeleton ID by iterating thru objects counting armatures until parent is found
            i = 0
            for obj in [object for object in scene.objects if object.is_visible(scene)]:
                if (obj.type == 'ARMATURE'):
                    if (obj.name == object.parent.name):
                        self.skeletonId = i
                        break;
                    else:
                        i += 1
                        
        # detect if any textures in the material slots, which would mean UV mapping is required                         
        uvRequired = False
        for slot in object.material_slots:
            uvRequired |= TowerOfBabel.uvRequiredForMaterial(slot.name)
           
        if len(object.material_slots) == 1:
            self.materialId = TowerOfBabel.nameSpace + '.' + object.material_slots[0].name           
            self.billboardMode = BILLBOARDMODE_ALL if object.material_slots[0].material.game_settings.face_orientation == 'BILLBOARD' else BILLBOARDMODE_NONE;
                
        elif len(object.material_slots) > 1:
            multimat = MultiMaterial(object.material_slots, len(multiMaterials))
            self.materialId = multimat.name
            multiMaterials.append(multimat)
            self.billboardMode = BILLBOARDMODE_NONE
        else:
            self.billboardMode = BILLBOARDMODE_NONE
            TowerOfBabel.warn('WARNING:  No materials have been assigned: ', 2)
            
        # Get mesh  
        mesh = object.to_mesh(scene, True, 'PREVIEW')
        
        world = object.matrix_world
        if object.parent and not hasSkeleton:
            world = object.matrix_local
            
        # use defaults when not None
        if forcedParent is None:
            loc, rot, scale = world.decompose()
            # only zero out position for mesh factory with no children
            self.position = loc if not includeMeshFactory or object.parent else mathutils.Vector((0, 0, 0))
            self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
            self.scaling  = scale
        else:
            self.position = mathutils.Vector((0, 0, 0))
            self.rotation = scale_vector(mathutils.Vector((0, 0, 0)), 1) # isn't scaling 0's by 1 same as 0?
            self.scaling  = mathutils.Vector((1, 1, 1))
                                                
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
            UVmap = mesh.tessface_uv_textures[0].data
        
        hasUV2 = len(mesh.tessface_uv_textures) > 1     
        if hasUV2:
            UV2map = mesh.tessface_uv_textures[1].data

        hasVertexColor = len(mesh.vertex_colors) > 0
        if hasVertexColor:
            Colormap = mesh.tessface_vertex_colors.active.data

        if hasSkeleton:
            self.skeletonWeights = []
            self.skeletonIndices = []
    
        # used tracking of vertices as they are received     
        alreadySavedVertices = []
        vertices_UVs = []
        vertices_UV2s = []
        vertices_Colors = []
        vertices_indices = []

        self.offsetFace = 0
                
        for v in range(0, len(mesh.vertices)):
            alreadySavedVertices.append(False)
            vertices_UVs.append([])
            vertices_UV2s.append([])
            vertices_Colors.append([])
            vertices_indices.append([])
                       
        materialsCount = max(1, len(object.material_slots))
        verticesCount = 0
        indicesCount = 0

        for materialIndex in range(materialsCount):
            if self.offsetFace != 0:
                break

            subMeshVerticesStart = verticesCount
            subMeshIndexStart = indicesCount
        
            for faceIndex in range(startFace, len(mesh.tessfaces)):  # For each face
                face = mesh.tessfaces[faceIndex]

                if face.material_index != materialIndex:
                    continue

                if verticesCount + 3 > MAX_VERTEX_ELEMENTS:
                    self.offsetFace = faceIndex
                    break
                
                for v in range(3): # For each vertex in face
                    vertex_index = face.vertices[v]

                    vertex = mesh.vertices[vertex_index]
                    position = vertex.co
                    normal = vertex.normal

                    #skeletons
                    if hasSkeleton:
                        matricesWeights = []
                        matricesWeights.append(0.0)
                        matricesWeights.append(0.0)
                        matricesWeights.append(0.0)
                        matricesWeights.append(0.0)
                        matricesIndices = []
                        matricesIndices.append(0.0)
                        matricesIndices.append(0.0)
                        matricesIndices.append(0.0)
                        matricesIndices.append(0.0)

                        # Getting influences
                        i = 0
                        offset = 0
                        for group in vertex.groups:
                            index = group.group
                            weight = group.weight

                            for boneIndex, bone in enumerate(object.parent.pose.bones):
                                if object.vertex_groups[index].name == bone.name:
                                    if (i == MAX_INFLUENCERS_PER_VERTEX):
                                        TowerOfBabel.warn('WARNING: Maximum # of influencers exceeded for a vertex, extras ignored', 2)
                                        break
                                    matricesWeights[i] = weight
                                    matricesIndices[i] = boneIndex
                                    offset = offset + 8

                                    i = i + 1                                    

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
                    alreadySaved = alreadySavedVertices[vertex_index] and not hasSkeleton
                    if alreadySaved:
                        alreadySaved = False                      
                    
                        # UV
                        index_UV = 0
                        for savedIndex in vertices_indices[vertex_index]:
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
                            self.skeletonWeights.append(matricesWeights[0])
                            self.skeletonWeights.append(matricesWeights[1])
                            self.skeletonWeights.append(matricesWeights[2])
                            self.skeletonWeights.append(matricesWeights[3])
                            self.skeletonIndices.append(matricesIndices[0])
                            self.skeletonIndices.append(matricesIndices[1])
                            self.skeletonIndices.append(matricesIndices[2])
                            self.skeletonIndices.append(matricesIndices[3])

                        vertices_indices[vertex_index].append(index)
                        
                        self.positions.append(position)             
                        self.normals.append(normal)                    
                        
                        verticesCount += 1
                    self.indices.append(index)
                    indicesCount += 1           
                    
            self.subMeshes.append(SubMesh(materialIndex, subMeshVerticesStart, subMeshIndexStart, verticesCount - subMeshVerticesStart, indicesCount - subMeshIndexStart))

        TowerOfBabel.log('num positions      :  ' + str(len(self.positions)), 2)
        TowerOfBabel.log('num normals        :  ' + str(len(self.normals  )), 2)
        TowerOfBabel.log('num uvs            :  ' + str(len(self.uvs      )), 2)
        TowerOfBabel.log('num uvs2           :  ' + str(len(self.uvs2     )), 2)
        TowerOfBabel.log('num colors         :  ' + str(len(self.colors   )), 2)
        TowerOfBabel.log('num indices        :  ' + str(len(self.indices  )), 2)
        if hasattr(self, 'skeletonWeights'):
            TowerOfBabel.log('num skeletonWeights:  ' + str(len(self.skeletonWeights)), 2)
            TowerOfBabel.log('num skeletonIndices:  ' + str(len(self.skeletonIndices)), 2)
            
        if uvRequired and len(self.uvs) == 0:
            TowerOfBabel.warn('WARNING: textures being used, but no UV Map found', 2)
        
        numZeroAreaFaces = self.find_zero_area_faces()    
        if numZeroAreaFaces > 0:
            TowerOfBabel.warn('WARNING: # of 0 area faces found:  ' + str(numZeroAreaFaces), 2)
        
        # shape keys for mesh 
        if object.data.shape_keys:
            basisFound = False
            for block in object.data.shape_keys.key_blocks:
                if (block.name == 'Basis'):
                    keyOrderMap = self.get_key_order_map(block)
                    basisFound = True
                    break
                
            if not basisFound:
                TowerOfBabel.warn('WARNING: Basis key missing, shape-key processing NOT performed', 2)
            
            else:
                rawShapeKeys = []
                groupNames = []
                for block in object.data.shape_keys.key_blocks:
                    # perform name format validation, before processing
                    keyName = block.name
                
                    # the Basis shape key is a member of all groups, each automatically built from positions, Blender version ignored
                    if (keyName == 'Basis'): continue
                
                    if (keyName.find('-') <= 0):
                        keyName = 'ENTIRE MESH-' + keyName.upper();
                        TowerOfBabel.warn('WARNING: Key shape not in group-state format, changed to:  ' + keyName, 2)
                    
                    temp = keyName.upper().partition('-')
                    rawShapeKeys.append(RawShapeKey(block, temp[0], temp[2], keyOrderMap, self.positions))
                
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
                    for group in groupNames:
                        self.shapeKeyGroups.append(ShapeKeyGroup(group, rawShapeKeys, self.positions))
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
    # - map is an array of 2 element arrays, element 1 is the index in the key, element 2 index into positions
    def get_key_order_map(self, basisKey):
        basisData = basisKey.data
        keySz =len(basisData)
        
        ret = []
        positionsSz = len(self.positions)
        for keyIdx in range(0, keySz):
            for posIdx in range(0, positionsSz):
                if same_vertex(basisData[keyIdx].co, self.positions[posIdx]): 
#                    TowerOfBabel.log('keyIdx:  ' + str(keyIdx) + ', posIdx:  ' +  str(posIdx), 2)
                    ret.append([keyIdx, posIdx])
                
        TowerOfBabel.log('Order of Basis Key mapped to Babylon.Mesh order;  num vertices matched:  ' + str(len(ret)) + ', keySz:  ' + str(keySz), 2)
        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
    def core_script(self, file_handler, kids, indent, is_typescript): 
        isRootMesh = not hasattr(self, 'parentId')
        mesh_node_common_script(file_handler, self, isRootMesh, kids, indent, is_typescript)
        hasShapeKeys = hasattr(self, 'shapeKeyGroups')
        baseClass = get_base_class(self)
        var = 'this' if isRootMesh else 'ret'
        indent2 = indent + ('        ' if isRootMesh else '    ')

        if hasattr(self, 'physicsImpostor'):
            file_handler.write(indent2 + 'if (!scene.isPhysicsEnabled()) {\n')
            file_handler.write(indent2 + '\tscene.enablePhysics();\n')
            file_handler.write(indent2 + '}\t')
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
            file_handler.write('\n' + indent2A + TowerOfBabel.nameSpace + '.defineSkeletons(scene);\n')
            file_handler.write(indent2A + var + '.skeleton = scene.getLastSkeletonByID("' + format_int(self.skeletonId) + '");\n\n')
        
        file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.PositionKind, [\n')
        file_handler.write(indent3A + format_vector_array(self.positions, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + '],\n')
        file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')
        
        file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.NormalKind, [\n')
        file_handler.write(indent3A + format_vector_array(self.normals, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + '],\n')
        file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')

        if len(self.uvs) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.UVKind, [\n')
            file_handler.write(indent3A + format_array(self.uvs, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + '],\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if len(self.uvs2) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.UV2Kind, [\n')
            file_handler.write(indent3A + format_array(self.uvs2, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + '],\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if len(self.colors) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.ColorKind, [\n')
            file_handler.write(indent3A + format_array(self.colors, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + '],\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        if hasattr(self, 'skeletonWeights'):
            file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, [\n')
            file_handler.write(indent3A + format_array(self.skeletonWeights, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + '],\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

            file_handler.write(indent2A + var + '.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, [\n')
            file_handler.write(indent3A + format_array(self.skeletonIndices, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
            file_handler.write(indent2A + '],\n')
            file_handler.write(indent2A + format_bool(False) + ');\n\n')

        file_handler.write(indent2A + var + '.setIndices([\n')
        file_handler.write(indent3A + format_array(self.indices, VERTEX_OUTPUT_PER_LINE, indent3A) + '\n')
        file_handler.write(indent2A + ']);\n\n')
        
        if hasattr(self, 'materialId'): file_handler.write(indent2A + var + '.setMaterialByID("' + self.materialId + '");\n')
        # this can be in core, since submesh is same for both JS & TS
        file_handler.write(indent2A + var + '.subMeshes = [];\n')
        for subMesh in self.subMeshes:
            subMesh.core_script(file_handler, var, indent2A)
        
        if self.useFlatShading:
            file_handler.write(indent2A + var + '.convertToFlatShadedMesh();\n')
            
        # Update, but not sure why, did not change position, rotation, or scaling objects
        file_handler.write(indent2A + var + '.computeWorldMatrix(true);\n')

        # Octree, cannot predetermine since something in scene; break down and write an if (ERRORS in Typescript)
        if not is_typescript:
            file_handler.write(indent2A + 'if (scene._selectionOctree) {\n')
            file_handler.write(indent3A + 'scene.createOrUpdateSelectionOctree();\n')
            file_handler.write(indent2A + '}\n') 
        
        if (hasShapeKeys):
            file_handler.write(indent2A + '// MORPH.Mesh always has source as null, so does not matter it conditional or not\n')
            file_handler.write(indent2A + 'var shapeKeyGroup' + (' : MORPH.ShapeKeyGroup;\n' if is_typescript else ';\n') )
            for shapeKeyGroup in self.shapeKeyGroups:
                shapeKeyGroup.core_script(file_handler, var, indent2A) # assigns the previously declared js variable 'shapeKeyGroup'
                file_handler.write(indent2A + 'this.addShapeKeyGroup(shapeKeyGroup);\n')
        
        super().core_script(file_handler, var, indent2A, is_typescript) # Animations
        
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

            if is_typescript:
                file_handler.write(indent + '}\n')
            else:
                file_handler.write(indent + '    return ' + self.legalName + ';\n')
                file_handler.write(indent + '})(' + baseClass + ');\n')      
                file_handler.write(indent + TowerOfBabel.nameSpace + '.' + self.legalName + ' = ' + self.legalName + ';\n')
        else:
            file_handler.write(indent + '    return ret;\n')             
            file_handler.write(indent + '}\n') 
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
               
            if hasShapeKeys:
                file_handler.write(indent + '    constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./") {\n')
                file_handler.write(indent2 + 'super(name, scene, null);\n\n')
            else:
                file_handler.write(indent + '    constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : ' + meshOrNode.legalName + ') {\n')
                file_handler.write(indent2 + 'super(name, scene, null, source, true);\n\n')
        else:
            file_handler.write('\n' + indent + 'var ' + meshOrNode.legalName + ' = (function (_super) {\n')
            file_handler.write(indent + '    __extends(' + meshOrNode.legalName + ', _super);\n')
            if hasShapeKeys:
                file_handler.write(indent + '    function ' + meshOrNode.legalName + '(name, scene, materialsRootDir) {\n')
                file_handler.write(indent2 + '_super.call(this, name, scene, null);\n\n')
            else:
                file_handler.write(indent + '    function ' + meshOrNode.legalName + '(name, scene, materialsRootDir, source) {\n')
                file_handler.write(indent2 + '_super.call(this, name, scene, null, source, true);\n\n')
                    
            file_handler.write(indent2 + 'if (!materialsRootDir) { materialsRootDir = "./"; }\n')
                
        file_handler.write(indent2 + TowerOfBabel.nameSpace + '.defineMaterials(scene, materialsRootDir); //embedded version check\n')
            
    else:
        var = 'ret'
        indent2 = indent + '    '
        if is_typescript:
            file_handler.write('\n' + indent + 'function child_' + meshOrNode.legalName + '(scene : BABYLON.Scene, parent : any, source? : any) : ' + baseClass + ' {\n')
        else:
            file_handler.write('\n' + indent + 'function child_' + meshOrNode.legalName + '(scene, parent, source){\n')
                
        file_handler.write(indent2 + TowerOfBabel.versionCheckCode)
        if hasShapeKeys:
            file_handler.write(indent2 + 'var ' + var + ' = new ' + baseClass + '(parent.name + ".' + meshOrNode.legalName + '", scene, parent);\n')
        else:
            file_handler.write(indent2 + 'var ' + var + ' = new ' + baseClass + '(parent.name + ".' + meshOrNode.legalName + '", scene, parent, source);\n')
        
    if hasShapeKeys:
        file_handler.write(indent2 + "var cloning = false;\n")
    else:
        file_handler.write(indent2 + "var cloning = source && source !== null;\n")
        
    if TowerOfBabel.logInConsole: file_handler.write(indent2 + "BABYLON.Tools.Log('defining mesh: ' + " + var + ".name + (cloning ? ' (cloned)' : ''));\n")
        
    # not part of root mesh test to allow for nested parenting
    for kid in kids:
        nm = kid.legalName
        func = 'child_' + nm
        file_handler.write(indent2 + var + '.' + nm + ' = cloning ? ' + func + '(scene, this, source.' + nm +') : ' + func + '(scene, this);\n')    
    file_handler.write('\n')


    file_handler.write(indent2 + var + '.id = ' + var + '.name;\n')
    file_handler.write(indent2 + var + '.billboardMode  = ' + format_int(meshOrNode.billboardMode) + ';\n')
        
    # remember switching y with z at the same time
    file_handler.write(indent2 + var + '.position.x  = ' + format_f(meshOrNode.position.x) + ';\n')
    file_handler.write(indent2 + var + '.position.y  = ' + format_f(meshOrNode.position.z) + ';\n')
    file_handler.write(indent2 + var + '.position.z  = ' + format_f(meshOrNode.position.y) + ';\n')
    file_handler.write(indent2 + var + '.rotation.x  = ' + format_f(meshOrNode.rotation.x) + ';\n')
    file_handler.write(indent2 + var + '.rotation.y  = ' + format_f(meshOrNode.rotation.z) + ';\n')
    file_handler.write(indent2 + var + '.rotation.z  = ' + format_f(meshOrNode.rotation.y) + ';\n')
    file_handler.write(indent2 + var + '.scaling.x   = ' + format_f(meshOrNode.scaling.x) + ';\n')
    file_handler.write(indent2 + var + '.scaling.y   = ' + format_f(meshOrNode.scaling.z) + ';\n')
    file_handler.write(indent2 + var + '.scaling.z   = ' + format_f(meshOrNode.scaling.y) + ';\n')
    file_handler.write(indent2 + var + '.isVisible       = ' + format_bool(meshOrNode.isVisible) + ';\n')
    file_handler.write(indent2 + var + '.setEnabled(' + format_bool(meshOrNode.isEnabled) + ');\n')
    file_handler.write(indent2 + var + '.checkCollisions = ' + format_bool(meshOrNode.checkCollisions) + ';\n')
    file_handler.write(indent2 + var + '.receiveShadows  = ' + format_bool(meshOrNode.receiveShadows) + ';\n') 
    file_handler.write(indent2 + var + '["castShadows"]  = ' + format_bool(meshOrNode.castShadows) + '; // typescript safe\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
def get_base_class(meshOrNode):
        if len(meshOrNode.baseClass) > 0: return meshOrNode.baseClass
        else: return 'MORPH.Mesh' if hasattr(meshOrNode, 'shapeKeyGroups') else 'BABYLON.Mesh'

#===============================================================================
class Node:
    def __init__(self, node, includeMeshFactory):
        TowerOfBabel.log('processing begun of node:  ' + node.name)
        self.name = node.name
        self.baseClass = 'BABYLON.Mesh'
        self.isNode = True # used in meshFactory
        
        # Tower of Babel specific member
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(TowerOfBabel.nNonLegalNames)
            TowerOfBabel.nNonLegalNames = TowerOfBabel.nNonLegalNames + 1
        
        world = node.matrix_world
        if (node.parent):
            world = node.parent.matrix_world.inverted() * node.matrix_world

        loc, rot, scale = world.decompose()

        if node.parent != None:
            self.parentId = node.parent.name
                   
        self.position = loc if not includeMeshFactory else mathutils.Vector((0, 0, 0))
        self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
        self.scaling = scale
        self.isVisible = False
        self.isEnabled = True
        self.checkCollisions = False
        self.billboardMode = BILLBOARDMODE_NONE
        self.receiveShadows = False
        self.castShadows = False
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def setFactoryIdx(self, factoryIdx):
        self.factoryIdx = factoryIdx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, kids, indent, is_typescript): 
        isRootNode = not hasattr(self, 'parentId')
        mesh_node_common_script(file_handler, self, isRootNode, kids, indent, is_typescript)

        if isRootNode:
            file_handler.write(indent + '    }\n')
            
            if hasattr(self,'factoryIdx'):                
                file_handler.write('\n')
                if is_typescript:
                    file_handler.write(indent + '    public dispose(doNotRecurse?: boolean): void {\n')
                    file_handler.write(indent + '        this.setEnabled(false);\n')
                    file_handler.write(indent + '    }\n')
                else:
                    file_handler.write(indent + '    ' + self.legalName + '.prototype.dispose = function (doNotRecurse) {\n')
                    file_handler.write(indent + '        this.setEnabled(false);\n')
                    file_handler.write(indent + '    };\n')

            if is_typescript:
                file_handler.write(indent + '}\n')
            else:
                file_handler.write(indent + '    return ' + self.legalName + ';\n')
                file_handler.write(indent + '})(BABYLON.Mesh);\n')      
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
    def core_script(self, file_handler, jsMeshVar, indent):
        file_handler.write(indent + 'new BABYLON.SubMesh(' + 
                          format_int(self.materialIndex) + ', ' + 
                          format_int(self.verticesStart) + ', ' + 
                          format_int(self.verticesCount) + ', ' + 
                          format_int(self.indexStart)    + ', ' + 
                          format_int(self.indexCount)    + ', ' + jsMeshVar + ');\n')
#===============================================================================   
# extract data in Mesh order, no optimization from group analyse yet; mapped into a copy of position
class RawShapeKey:
    def __init__(self, keyBlock, group, state, keyOrderMap, positions):
        self.group = group
        self.state = state
        self.vertices = []   
#        previousValue = keyBlock.value
#        keyBlock.value = keyBlock.slider_max
        
        # populate vertices with copy of positions, so keys can be smaller than positions
        nSize = len(positions)
        for i in range(0, nSize):
            self.vertices.append(positions[i])

        retSz = len(keyOrderMap)
        nReplaced = 0
        for i in range(0, retSz):
            pair = keyOrderMap[i]
            if not same_vertex(self.vertices[pair[1]],  keyBlock.data[pair[0]].co):
                self.vertices[pair[1]] = keyBlock.data[pair[0]].co
                nReplaced += 1
                
 #       keyBlock.value = previousValue    
        TowerOfBabel.log('shape key "' + group + '-' + state + '" key size:  ' + str(len(keyBlock.data)) + ', n diff from basis: ' + str(nReplaced), 2)
#===============================================================================
class ShapeKeyGroup:
    def __init__(self, group, rawShapeKeys, positions):
        self.group = group
        self.stateNames = []
        self.stateVertices = []
        self.affectedIndices = []   

        nRawKeys = len(rawShapeKeys)
        nSize = len(positions)
                
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
                    
                # check vertex not different from positions, aka. Basis
                if not same_vertex(key.vertices[i],  positions[i]):
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
                affectedVertices.append(positions[i])
                
        self.basisState = affectedVertices
        TowerOfBabel.log('Shape-key group, ' + group + ', # of affected vertices: '+ str(len(affectedWholeVertices)) + ', out of ' + str(nSize), 2)
                
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
    def core_script(self, file_handler, var, indent):
        indent2 = indent + '    '
        file_handler.write(indent  + 'shapeKeyGroup = new MORPH.ShapeKeyGroup(' + var + ', "' + self.group + '",[\n')
        file_handler.write(indent2 + format_array(self.affectedIndices, VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
        file_handler.write(indent  + '],[\n')
        file_handler.write(indent2 + format_vector_array(self.basisState, VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
        file_handler.write(indent  + ']);\n')
        
        for state_idx in range(len(self.stateVertices)):
            file_handler.write(indent  + 'shapeKeyGroup.addShapeKey("' + self.stateNames[state_idx] + '",[\n')
            file_handler.write(indent2 + format_vector_array(self.stateVertices[state_idx], VERTEX_OUTPUT_PER_LINE, indent2) + '\n')
            file_handler.write(indent  + ']);\n')
#===============================================================================
class Bone:
    def __init__(self, bone, skeleton, scene, index):
        TowerOfBabel.log('processing begun of bone:  ' + bone.name + ', index:  '+ str(index))
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
            TowerOfBabel.log('animation begun of bone:  ' + self.name)
            self.animation = Animation(ANIMATIONTYPE_MATRIX, scene.render.fps, ANIMATIONLOOPMODE_CYCLE, 'anim', '_matrix')

            start_frame = scene.frame_start
            end_frame = scene.frame_end
            previousBoneMatrix = None
            for frame in range(start_frame, end_frame + 1):
                bpy.context.scene.frame_set(frame)
                currentBoneMatrix = Bone.get_matrix(bone, skeleton.matrix_world)

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
    def core_script(self, file_handler, indent): 
        parentBone = 'skeleton.bones[' + format_int(self.parentBoneIndex) + ']' if self.parentBoneIndex != -1 else 'null' 

        file_handler.write(indent + 'bone = new BABYLON.Bone("' + self.name + '", skeleton,' + parentBone + ', BABYLON.Matrix.FromValues(' + format_matrix4(self.matrix) + '));\n')

        if hasattr(self, 'animation'):
            self.animation.core_script(file_handler, indent) # declares and set the variable animation
            file_handler.write(indent + 'bone.animations.push(animation);\n\n')
#===============================================================================
class Skeleton:
    def __init__(self, skeleton, scene, id):
        TowerOfBabel.log('processing begun of skeleton:  ' + skeleton.name + ', id:  '+ str(id))
        self.name = skeleton.name        
        self.id = id        
        self.bones = []
        
        bones = skeleton.pose.bones
        j = 0
        for bone in bones:
            self.bones.append(Bone(bone, skeleton, scene, j))
            j = j + 1
            
        TowerOfBabel.log('processing complete of skeleton:  ' + skeleton.name)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    # assume the following JS variables have already been declared: scene, skeleton, bone, animation
    def core_script(self, file_handler, indent): 
        # specifying scene gets skeleton added to scene in constructor
        if TowerOfBabel.logInConsole: file_handler.write(indent + "BABYLON.Tools.Log('defining skeleton:  " + self.name + "');\n")
        file_handler.write(indent + 'skeleton = new BABYLON.Skeleton("' + self.name + '", "' + format_int(self.id) + '", scene);\n') # MUST be String for inline

        for bone in self.bones:
            bone.core_script(file_handler, indent)
#===============================================================================
class Camera(FCurveAnimatable):
    def __init__(self, camera):         
        super().__init__(camera, True, True, False, math.pi / 2)
        
        self.CameraType = camera.data.CameraType  
        self.name = camera.name        
        TowerOfBabel.log('processing begun of camera (' + self.CameraType + '):  ' + self.name)
        self.position = camera.location
        self.rotation = mathutils.Vector((-camera.rotation_euler[0] + math.pi / 2, camera.rotation_euler[1], -camera.rotation_euler[2])) # extra parens needed
        self.fov = camera.data.angle
        self.minZ = camera.data.clip_start
        self.maxZ = camera.data.clip_end
        self.speed = 1.0
        self.inertia = 0.9
        self.checkCollisions = camera.data.checkCollisions
        self.applyGravity = camera.data.applyGravity
        self.ellipsoid = camera.data.ellipsoid
        
        for constraint in camera.constraints:
            if constraint.type == 'TRACK_TO':
                self.lockedTargetId = constraint.target.name
                break
                               
        if self.CameraType == ANAGLYPH_ARC_CAM or self.CameraType == ANAGLYPH_FREE_CAM:
            self.anaglyphEyeSpace = camera.data.anaglyphEyeSpace
        
        if self.CameraType == ANAGLYPH_ARC_CAM or self.CameraType == ARC_ROTATE_CAM or self.CameraType == FOLLOW_CAM:
            if not hasattr(self, 'lockedTargetId'):
                TowerOfBabel.warn('ERROR: Camera type with manditory target specified, but no target to track set', 2)
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
                
        elif self.CameraType ==  ANAGLYPH_ARC_CAM or self.CameraType == ARC_ROTATE_CAM:
            self.arcRotAlpha  = alpha
            self.arcRotBeta   = beta 
            self.arcRotRadius = distance3D
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent, is_typescript): 
        # constructor args are not the same for each camera type
        file_handler.write(indent + 'camera = new BABYLON.' + self.CameraType + '("' + self.name + '"')
        if self.CameraType == ANAGLYPH_ARC_CAM or self.CameraType == ARC_ROTATE_CAM:
            file_handler.write(', ' + format_f(self.arcRotAlpha) + ', ' + format_f(self.arcRotBeta) + ', ' + format_f(self.arcRotRadius))
            file_handler.write(', scene.getMeshByID("' + self.lockedTargetId + '")')
            
            if self.CameraType ==  ANAGLYPH_ARC_CAM:
                file_handler.write(', ' + format_f(self.anaglyphEyeSpace))
                            
        else:
            file_handler.write(', new BABYLON.Vector3(' + format_vector(self.position) + ')')
            if self.CameraType == ANAGLYPH_FREE_CAM:
                file_handler.write(', ' + format_f(self.anaglyphEyeSpace))
            
        file_handler.write(', scene);\n')
        
        file_handler.write(indent + 'camera.id = "' + self.name + '";\n')
        file_handler.write(indent + 'camera.rotation = new BABYLON.Vector3(' + format_vector(self.rotation) + ');\n')

        file_handler.write(indent + 'camera.fov = ' + format_f(self.fov) + ';\n')
        file_handler.write(indent + 'camera.minZ = ' + format_f(self.minZ) + ';\n')
        file_handler.write(indent + 'camera.maxZ = ' + format_f(self.maxZ) + ';\n')

        file_handler.write(indent + 'camera.speed = ' + format_f(self.speed) + ';\n')
        file_handler.write(indent + 'camera.inertia = ' + format(self.inertia) + ';\n')

        file_handler.write(indent + 'camera.checkCollisions = ' + format_bool(self.checkCollisions) + ';\n')
        file_handler.write(indent + 'camera.applyGravity = ' + format_bool(self.applyGravity) + ';\n')
        file_handler.write(indent + 'camera.ellipsoid = new BABYLON.Vector3(' + format_array3(self.ellipsoid) + ');\n')
                 
        if self.CameraType == FOLLOW_CAM:
            file_handler.write(indent + 'camera.heightOffset = ' + format_f(self.followHeight) + ';\n')
            file_handler.write(indent + 'camera.radius = ' + format_f(self.followDistance) + ';\n')
            file_handler.write(indent + 'camera.rotationOffset = ' + format_f(self.followRotation) + ';\n')
                        
        if hasattr(self, 'lockedTargetId') and (self.CameraType == FOLLOW_CAM or self.CameraType == FREE_CAM):
            if self.CameraType == FOLLOW_CAM:
                file_handler.write(indent + 'camera.target = scene.getMeshByID("' + self.lockedTargetId + '");\n')
            else:
                file_handler.write(indent + 'camera.lockedTarget = scene.getMeshByID("' + self.lockedTargetId + '");\n')
            
        super().core_script(file_handler, 'camera', indent, is_typescript) # Animations
#===============================================================================
class Light(FCurveAnimatable):
    def __init__(self, light):      
        super().__init__(light, False, True, False)
        
        self.name = light.name        
        TowerOfBabel.log('processing begun of light (' + light.data.type + '):  ' + self.name)
        light_type_items = {'POINT': POINT_LIGHT, 'SUN': DIRECTIONAL_LIGHT, 'SPOT': SPOT_LIGHT, 'HEMI': HEMI_LIGHT, 'AREA': 0}
        self.light_type = light_type_items[light.data.type]
        
        if self.light_type == POINT_LIGHT:
            self.position = light.location
            if light.data.use_sphere:
                self.range = light.data.distance            
            
        elif self.light_type == DIRECTIONAL_LIGHT:
            self.position = light.location
            self.direction = Light.get_direction(light.matrix_world)
            
        elif self.light_type == SPOT_LIGHT:
            self.position = light.location
            self.direction = Light.get_direction(light.matrix_world)
            self.angle = light.data.spot_size
            self.exponent = light.data.spot_blend * 2
            if light.data.use_sphere:
                self.range = light.data.distance            
            
        else:
            # Hemi & Area
            matrix_world = light.matrix_world.copy()
            matrix_world.translation = mathutils.Vector((0, 0, 0))
            self.direction = mathutils.Vector((0, 0, -1)) * matrix_world
            self.direction = scale_vector(self.direction, -1)
            self.groundColor = mathutils.Color((0, 0, 0))
            
        self.intensity = light.data.energy        
        self.diffuse   = light.data.color if light.data.use_diffuse  else mathutils.Color((0, 0, 0))
        self.specular  = light.data.color if light.data.use_specular else mathutils.Color((0, 0, 0))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent, is_typescript): 
        if self.light_type == POINT_LIGHT:
            file_handler.write(indent + 'light = new BABYLON.PointLight("' + self.name + '", new BABYLON.Vector3(' + format_vector(self.position) + '), scene);\n')

        elif self.light_type == DIRECTIONAL_LIGHT:
            file_handler.write(indent + 'light = new BABYLON.DirectionalLight("' + self.name + '", new BABYLON.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.position = new BABYLON.Vector3(' + format_vector(self.position) + ');\n')

        elif self.light_type == SPOT_LIGHT:
            file_handler.write(indent + 'light = new BABYLON.SpotLight("' + self.name + '", new BABYLON.Vector3(' + format_vector(self.position) + 
                               '), new BABYLON.Vector3(' + format_vector(self.direction) + '), ' + format_f(self.angle) + ', ' + format_f(self.exponent) + ', scene);\n')

        else:
            file_handler.write(indent + 'light = new BABYLON.HemisphericLight("' + self.name + '", new BABYLON.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.groundColor = new BABYLON.Color3(' + format_color(self.groundColor) + ');\n')

        file_handler.write(indent + 'light.id = "' + self.name + '";\n')
        file_handler.write(indent + 'light.intensity = ' + format_f(self.intensity) + ';\n')

        if hasattr(self, 'range'):
            file_handler.write(indent + 'light.range = ' + format_f(self.range) + ';\n')

        file_handler.write(indent + 'light.diffuse = new BABYLON.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent + 'light.specular = new BABYLON.Color3(' + format_color(self.specular) + ');\n')
        super().core_script(file_handler, 'light', indent, is_typescript) # Animations

    @staticmethod
    def get_direction(matrix):
        return (matrix.to_3x3() * mathutils.Vector((0.0, 0.0, -1.0))).normalized()
#===============================================================================
class ShadowGenerator:
    def __init__(self, lamp, meshesAndNodes, scene):       
        TowerOfBabel.log('processing begun of shadows for light:  ' + lamp.name)
        self.useVarianceShadowMap = lamp.data.shadowMap == 'VAR' if True else False
        self.mapSize = lamp.data.shadowMapSize  
        self.lightId = lamp.name     
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent): 
        file_handler.write(indent + 'light = scene.getLightByID("' + self.lightId + '");\n')
        file_handler.write(indent + 'shadowGenerator = new BABYLON.ShadowGenerator(' + format_int(self.mapSize) + ', light);\n')
        file_handler.write(indent + 'shadowGenerator.useVarianceShadowMap = ' + format_bool(self.useVarianceShadowMap) + ';\n')
#===============================================================================
class MultiMaterial:
    def __init__(self, material_slots, idx):
        self.name = TowerOfBabel.nameSpace + '.' + 'Multimaterial#' + str(idx)
        TowerOfBabel.log('processing begun of multimaterial:  ' + self.name, 2)
        self.materials = []

        for mat in material_slots:
            self.materials.append(TowerOfBabel.nameSpace + '.' + mat.name)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent): 
        file_handler.write(indent + 'multiMaterial = new BABYLON.MultiMaterial("' + self.name + '", scene);\n')
        file_handler.write(indent + 'multiMaterial.id = "' + self.name + '";\n')

        for materialName in self.materials:
            file_handler.write(indent + 'multiMaterial.subMaterials.push(scene.getMaterialByID("' + materialName + '"));\n')
#===============================================================================
class Texture:
    def __init__(self, slot, level, texture, filepath):       
        # Copy image to output
        try:
            image = texture.texture.image
            imageFilepath = os.path.normpath(bpy.path.abspath(image.filepath))
            basename = os.path.basename(imageFilepath)
            targetdir = os.path.dirname(filepath)
            targetpath = os.path.join(targetdir, basename)
            
            if image.packed_file:
                image.save_render(targetpath)
            else:
                sourcepath = bpy.path.abspath(image.filepath)
                shutil.copy(sourcepath, targetdir)
        except:
            ex = sys.exc_info()
            TowerOfBabel.log_handler.write('Error encountered processing image file:  ' + imageFilepath + ', Error:  '+ str(ex[1]) + '\n')
            #pass
        
        # Export
        self.slot = slot
        self.name = basename
        self.level = level
        self.hasAlpha = texture.texture.use_alpha
        
        if (texture.mapping == 'CUBE'):
            self.coordinatesMode = CUBIC_MODE
        if (texture.mapping == 'SPHERE'):
            self.coordinatesMode = SPHERICAL_MODE
        else:
            self.coordinatesMode = EXPLICIT_MODE
        
        self.uOffset = texture.offset.x
        self.vOffset = texture.offset.y
        self.uScale  = texture.scale.x
        self.vScale  = texture.scale.y
        self.uAng = 0
        self.vAng = 0     
        self.wAng = 0
        
        if (texture.texture.extension == 'REPEAT'):
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
            
        self.coordinatesIndex = 0
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent): 
        file_handler.write(indent + 'texture = new BABYLON.Texture(materialsRootDir + "' + self.name + '", scene);\n')

        file_handler.write(indent + 'texture.name = materialsRootDir + "' + self.name + '";\n')
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
class Material:
    def __init__(self, material, scene, filepath):       
        self.name = TowerOfBabel.nameSpace + '.' + material.name        
        TowerOfBabel.log('processing begun of material:  ' + self.name)
        self.ambient = material.ambient * material.diffuse_color
        self.diffuse = material.diffuse_intensity * material.diffuse_color
        self.specular = material.specular_intensity * material.specular_color
        self.emissive = material.emit * material.diffuse_color       
        self.specularPower = material.specular_hardness
        self.alpha = material.alpha
        self.backFaceCulling = material.game_settings.use_backface_culling
                
        # Textures
        self.textures = []
        textures = [mtex for mtex in material.texture_slots if mtex and mtex.texture]
        for mtex in textures:
            if mtex.texture.type == 'IMAGE': 
                if mtex.texture.image:
                    if (mtex.use_map_color_diffuse and (mtex.texture_coords != 'REFLECTION')):
                        # Diffuse
                        TowerOfBabel.log('Diffuse texture found');
                        self.textures.append(Texture('diffuseTexture', mtex.diffuse_color_factor, mtex, filepath))
                    if mtex.use_map_ambient:
                        # Ambient
                        TowerOfBabel.log('Ambient texture found');
                        self.textures.append(Texture('ambientTexture', mtex.ambient_factor, mtex, filepath))
                    if mtex.use_map_alpha:
                        # Opacity
                        TowerOfBabel.log('Opacity texture found');
                        self.textures.append(Texture('opacityTexture', mtex.alpha_factor, mtex, filepath))
                    if mtex.use_map_color_diffuse and (mtex.texture_coords == 'REFLECTION'):
                        # Reflection
                        TowerOfBabel.log('Reflection texture found');
                        self.textures.append(Texture('reflectionTexture', mtex.diffuse_color_factor, mtex, filepath))
                    if mtex.use_map_emit:
                        # Emissive
                        TowerOfBabel.log('Emissive texture found');
                        self.textures.append(Texture('emissiveTexture', mtex.emit_factor, mtex, filepath))     
                    if mtex.use_map_normal:
                        # Bump
                        TowerOfBabel.log('Bump texture found');
                        self.textures.append(Texture('bumpTexture', mtex.normal_factor, mtex, filepath))  
                    elif mtex.use_map_color_spec:
                        # Specular
                        TowerOfBabel.log('Specular texture found');
                        self.textures.append(Texture('specularTexture', mtex.specular_color_factor, mtex, filepath))                        
            else: #type ==  'STUCCI' or 'NOISE'
                 TowerOfBabel.warn('WARNING texture type not currently supported:  ' + mtex.texture.type + ', ignored.')
#                glsl_handler = open('/home/jeff/Desktop/' + mtex.texture.type + '.glsl', 'w')  
#                glsl_handler.write(shader['vertex'])                      
#                glsl_handler.write('\n//#############################################################################\n')                      
#                glsl_handler.write(shader['fragment'])
#                glsl_handler.close()
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -        
    def core_script(self, file_handler, indent):       
        file_handler.write(indent + 'material = new BABYLON.StandardMaterial("' + self.name + '", scene);\n')
        file_handler.write(indent + 'material.ambientColor  = new BABYLON.Color3(' + format_color(self.ambient) + ');\n')
        file_handler.write(indent + 'material.diffuseColor  = new BABYLON.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent + 'material.specularColor = new BABYLON.Color3(' + format_color(self.specular) + ');\n')
        file_handler.write(indent + 'material.emissiveColor = new BABYLON.Color3(' + format_color(self.emissive) + ');\n')
        file_handler.write(indent + 'material.specularPower = ' + format_f(self.specularPower) + ';\n')
        file_handler.write(indent + 'material.alpha =  '        + format_f(self.alpha        ) + ';\n')
        file_handler.write(indent + 'material.backFaceCulling = ' + format_bool(self.backFaceCulling) + ';\n')             
        for texSlot in self.textures:
            texSlot.core_script(file_handler, indent)
            file_handler.write(indent + 'material.' + texSlot.slot + ' = texture;\n')                      
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
    def core_script(self, file_handler, indent): 
        file_handler.write(indent + 'animation = new BABYLON.Animation("' + self.name + '", "' + 
                                                                             self.propertyInBabylon + '", ' + 
                                                                             format_int(self.framePerSecond) + ', ' + 
                                                                             format_int(self.dataType) + ', ' + 
                                                                             format_int(self.loopBehavior) + ');\n')
        file_handler.write(indent + 'animation.setKeys([\n')
        nFrames = len(self.frames)
        for frame_idx in range(nFrames):
            file_handler.write(indent + '{frame: ' + format_int(self.frames[frame_idx]) + ', value: ')
            if self.dataType == ANIMATIONTYPE_MATRIX:
                file_handler.write('BABYLON.Matrix.FromValues(' + format_matrix4(self.values[frame_idx]) + ')}')
            else:
                file_handler.write('new BABYLON.Vector3(' + format_vector(self.values[frame_idx]) + ')}')

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
#===============================================================================
# custom properties definition and display 
#===============================================================================
bpy.types.Mesh.baseClass = bpy.props.StringProperty(
    name='Base class', 
    description='Explicitly specify base class, system determines if blank',
    default = ''
)
bpy.types.Mesh.useFlatShading = bpy.props.BoolProperty(
    name='Use Flat Shading', 
    description='',
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
#===============================================================================
bpy.types.Camera.autoAnimate = bpy.props.BoolProperty(
    name='Automatically launch animations', 
    description='',
    default = False
)
bpy.types.Camera.CameraType = bpy.props.EnumProperty(
    name='Camera Type', 
    description='',
    # ONLY Append, or existing .blends will have their camera changed
    items = ( 
             (V_JOYSTICKS_CAM   , 'Virtual Joysticks'  , 'Use Virtual Joysticks Camera'),
             (TOUCH_CAM         , 'Touch'              , 'Use Touch Camera'),
             (OCULUS_CAM        , 'Oculus'             , 'Use Oculus Camera'),
             (GAMEPAD_CAM       , 'Gamepad'            , 'Use Gamepad Camera'),
             (FREE_CAM          , 'Free'               , 'Use Free Camera'),
             (FOLLOW_CAM        , 'Follow'             , 'Use Follow Camera'),
             (DEV_ORIENT_CAM    , 'Device Orientation' , 'Use Device Orientation Camera'),
             (ARC_ROTATE_CAM    , 'Arc Rotate'         , 'Use Arc Rotate Camera'),
             (ANAGLYPH_FREE_CAM , 'Anaglyph Free'      , 'Use Anaglyph Free Camera'), 
             (ANAGLYPH_ARC_CAM  , 'Anaglyph Arc Rotate', 'Use Anaglyph Arc Rotate Camera'),
             (OCULUS_GAMEPAD_CAM, 'Oculus Gampad'      , 'Use Oculus Gamepad Camera'),
             (VR_DEV_ORIENT_CAM , 'VR Dev Orientation' , 'Use VR Dev Orientation Camera'),
             (WEB_VR_CAM        , 'Web VR'             , 'Use Web VR Camera')
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
bpy.types.Camera.anaglyphEyeSpace = bpy.props.IntProperty(
    name='Anaglyph Eye space', 
    description='Used by the Anaglyph Arc Rotate camera',
    default = 1
)    
#===============================================================================
bpy.types.Lamp.autoAnimate = bpy.props.BoolProperty(
    name='Automatically launch animations', 
    description='',
    default = False
)
bpy.types.Lamp.shadowMap = bpy.props.EnumProperty(
    name='Shadow Map Type', 
    description='',
    items = (('NONE', 'None', 'No Shadow Maps'), ('STD', 'Standard', 'Use Standard Shadow Maps'), ('VAR', 'Variance', 'Use Variance Shadow Maps')),
    default = 'NONE'
) 
bpy.types.Lamp.shadowMapSize = bpy.props.IntProperty(
    name='Shadow Map Size', 
    description='',
    default = 512
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
            layout.prop(ob.data, 'useFlatShading') 
            layout.prop(ob.data, 'checkCollisions')     
            layout.prop(ob.data, 'castShadows')     
            layout.prop(ob.data, 'receiveShadows')   

            layout.separator()

            layout.prop(ob.data, 'autoAnimate')   
                        
        elif isCamera:
            layout.prop(ob.data, 'CameraType')
            layout.prop(ob.data, 'checkCollisions')
            layout.prop(ob.data, 'applyGravity')
            layout.prop(ob.data, 'ellipsoid')

            layout.separator()
            
            layout.prop(ob.data, 'anaglyphEyeSpace')

            layout.separator()

            layout.prop(ob.data, 'autoAnimate')   
                        
        elif isLight:
            layout.prop(ob.data, 'shadowMap')
            layout.prop(ob.data, 'shadowMapSize') 
       
            layout.separator()

            layout.prop(ob.data, 'autoAnimate')   
