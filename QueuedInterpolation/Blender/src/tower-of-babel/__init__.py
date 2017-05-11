bl_info = {
    'name': 'Tower of Babel',
    'author': 'David Catuhe, Jeff Palmer',
    'version': (5, 3, -1),
    'blender': (2, 76, 0),
    'location': 'File > Export > Tower of Babel [.js + .d.ts]',
    'description': 'Translate to inline JavaScript modules',
    'wiki_url': 'https://github.com/BabylonJS/Extensions/tree/master/QueuedInterpolation/Blender',
    'tracker_url': '',
    'category': 'Babylon.JS'}

# allow module to be changed during a session (dev purposes)
if "bpy" in locals():
    print('Reloading TOB exporter')
    import imp
    imp.reload(animation)
    imp.reload(armature)
    imp.reload(camera)
    imp.reload(exporter_settings_panel)
    imp.reload(f_curve_animatable)
    imp.reload(js_exporter)
    imp.reload(light_shadow)
    imp.reload(logger)
    imp.reload(material)
    imp.reload(mesh)
    imp.reload(package_level)
    imp.reload(particle_hair)
    imp.reload(sound)
    imp.reload(world)

    #TOB specific
    imp.reload(pose_lib)
    imp.reload(shape_key_group)
    imp.reload(shape_key_archive)
    imp.reload(texture_reduction)
else:
    from . import animation
    from . import armature
    from . import camera
    from . import exporter_settings_panel
    from . import f_curve_animatable
    from . import js_exporter
    from . import light_shadow
    from . import logger
    from . import material
    from . import mesh
    from . import package_level
    from . import particle_hair
    from . import sound
    from . import world

    #TOB specific
    from . import pose_lib
    from . import shape_key_group
    from . import shape_key_archive
    from . import texture_reduction

import bpy
from bpy_extras.io_utils import ExportHelper, ImportHelper
#===============================================================================
def register():
    bpy.utils.register_module(__name__)
    bpy.types.INFO_MT_file_export.append(menu_func)

def unregister():
    bpy.utils.unregister_module(__name__)
    bpy.types.INFO_MT_file_export.remove(menu_func)

# Registration the calling of the INFO_MT_file_export file selector
def menu_func(self, context):
    from .package_level import get_title
    # the info for get_title is in this file, but getting it the same way as others
    self.layout.operator(TOBMain.bl_idname, get_title())

if __name__ == '__main__':
    unregister()
    register()
#===============================================================================
class TOBMain(bpy.types.Operator, ExportHelper):
    bl_idname = 'tob.main'
    bl_label = 'TOB Export'         # used on the label of the actual 'save' button
    filename_ext = '.js'            # used as the extension on file selector

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    filter_glob = bpy.props.StringProperty(name='.js',default='*.js', options={'HIDDEN'})

    def execute(self, context):
        from .js_exporter import JSExporter
        from .package_level import get_title, verify_min_blender_version

        if not verify_min_blender_version():
            self.report({'ERROR'}, 'version of Blender too old.')
            return {'FINISHED'}

        exporter = JSExporter()
        exporter.execute(context, self.filepath)

        if (exporter.fatalError):
            self.report({'ERROR'}, exporter.fatalError)

        elif (exporter.nWarnings > 0):
            self.report({'WARNING'}, 'Processing completed, but ' + str(exporter.nWarnings) + ' WARNINGS were raised,  see log file.')

        return {'FINISHED'}
#===============================================================================
class ArchiveShapeKeys(bpy.types.Operator, ExportHelper):
    bl_idname = 'tob.shape_keys_archive'
    bl_label = 'Archive Shapekeys'
    filename_ext = '.tob'            # used as the extension on file selector
    bl_description = 'Write the shapekeys of the selected meshes to file'
    bl_options = {'REGISTER', 'INTERNAL'}

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    filter_glob = bpy.props.StringProperty(name='.tob',default='*.tob', options={'HIDDEN'})

    def execute(self, context):
        from .shape_key_archive import ShapeKeyExporter

        exporter = ShapeKeyExporter()
        exporter.execute(self, context, self.filepath)
        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob and ob.type == 'MESH'
#===============================================================================
class RestoreShapeKeys(bpy.types.Operator, ImportHelper):
    bl_idname = 'tob.shape_keys_restore'
    bl_label = 'Restore Shapekeys'
    filename_ext = '.tob'            # used as the extension on file selector
    bl_description = 'Restore archived shapekeys to selected meshes, matching to end of mesh name'
    bl_options = {'REGISTER', 'INTERNAL'}

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    filter_glob = bpy.props.StringProperty(name='.tob',default='*.tob', options={'HIDDEN'})

    def execute(self, context):
        from .shape_key_archive import ShapeKeyImporter

        importer = ShapeKeyImporter()
        importer.execute(self, context, self.filepath)
        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob and ob.type == 'MESH'
#===============================================================================
class PoseLibToShapeKeys(bpy.types.Operator):
    bl_idname = 'tob.poselibtoshapekeys'
    bl_label = 'Pose lib to Shape keys'
    bl_description = 'Apply all the poses in current pose library as shape keys'
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        from .pose_lib import poseLibToShapeKeys

        # get a reference of the current skeleton
        skeleton = context.object
        poseLibToShapeKeys(self, context.scene, skeleton)
        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob and ob.type == 'ARMATURE' and ob.pose_library
#===============================================================================
class ApplyCurrentPose(bpy.types.Operator):
    bl_idname = 'tob.posetoshapekey'
    bl_label = 'Pose to Shape key'
    bl_description = 'Convert the current pose to a shape key'
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        from .pose_lib import poseLibToShapeKeys

        # get a reference of the current skeleton
        skeleton = context.object
        shapeKeyName = skeleton.data.shapeKeyName
        poseLibToShapeKeys(self, context.scene, skeleton, shapeKeyName)
        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob and ob.type == 'ARMATURE'
#===============================================================================
class ExportPoselib(bpy.types.Operator, ExportHelper):
    bl_idname = 'tob.exportposes'
    bl_label = 'Export'
    filename_ext = '.js'            # used as the extension on file selector
    bl_description = 'Write the poses of the Pose Libraries to a\nQI.SkeletonPoseLibrary sub-class.'
    bl_options = {'REGISTER', 'INTERNAL'}

    filepath = bpy.props.StringProperty(subtype = 'FILE_PATH') # assigned once the file selector returns
    filter_glob = bpy.props.StringProperty(name='.js',default='*.js', options={'HIDDEN'})

    def execute(self, context):
        from .pose_lib import PoseLibExporter

        # get a reference of the current skeleton
        skeleton = context.object

        exporter = PoseLibExporter()
        result = exporter.execute(context, self.filepath, skeleton)
        if result is not None:
            self.report({'ERROR'}, result)
        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob and ob.type == 'ARMATURE' and ob.pose_library
#===============================================================================
class TextureResize(bpy.types.Operator):
    bl_idname = 'tob.textureresize'
    bl_label = 'Downsize Texture(s)'
    bl_description = 'Change the resolution of textures part of\nselected material & pack'
    bl_options = {'REGISTER', 'INTERNAL'}

    def execute(self, context):
        from .texture_reduction import TextureReduction

        mesh = context.object
        material = TextureResize.getActiveMaterial(mesh)
        reducer = TextureReduction(context, mesh, material)

        return {'FINISHED'}

    @classmethod
    def poll(cls, context):
        ob = context.object
        if not ob or ob.type != 'MESH': return False
        material = TextureResize.getActiveMaterial(ob)
        return material and TextureResize.hasImageTextures(material)

    @staticmethod
    def getActiveMaterial(mesh):
        if len(mesh.material_slots) == 0: return None
        index = mesh.active_material_index

        # a material slot is not a reference to an actual material; need to look up
        return mesh.material_slots[index].material

    @staticmethod
    def hasImageTextures(material):
        textures = [mtex for mtex in material.texture_slots if mtex and mtex.texture]
        for mtex in textures:
            if mtex.texture.type == 'IMAGE': return True

        return False
