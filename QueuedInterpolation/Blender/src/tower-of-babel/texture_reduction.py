from .package_level import *

import bpy
from os import path

#===============================================================================
class TextureReduction:
    def __init__(self, context, mesh, material):
        # bring custom properties into local variable
        self.usePNG = material.usePNG
        self.longestSideSize = material.longestSideSize
        texQuality = material.texQuality

        scene = context.scene
        # explicitly set all baking options, since user can modify these
        renderer = scene.render
        renderer.engine = 'BLENDER_RENDER'
        renderer.bake_type = 'TEXTURE'
        renderer.use_bake_selected_to_active = False
        renderer.use_bake_to_vertex_color = False
        renderer.use_bake_clear = False
        renderer.bake_quad_split = 'AUTO'
        renderer.bake_margin = 0
        renderer.use_file_extension = True

        renderer.use_bake_normalize = True
        renderer.use_bake_antialiasing = True

        image_settings = renderer.image_settings
        image_settings.file_format = 'PNG' if self.usePNG else 'JPEG'
        image_settings.color_mode = 'RGBA' if self.usePNG else 'RGB'
        image_settings.quality     = texQuality # for lossy compression formats
        image_settings.compression = texQuality  # Amount of time to determine best compression: 0 = no compression with fast file output, 100 = maximum lossless compression with slow file output

        # must be in OBJECT mode to add meshes or its geometry
        bpy.ops.object.mode_set(mode='OBJECT')

        # make a plane mesh of dimension 1 square (scaling for non-square images inside bake)
        bpy.ops.object.add(type='MESH')
        self.plane = bpy.context.active_object
        self.plane.name = 'temp_plane'
        verts = [(0,0,0), (1,0,0),(1,0,1), (0,0,1)]
        faces = [(0,1,2,3)]
        data = self.plane.data
        data.from_pydata(verts, [], faces)
        data.update()

        # add UV for single quad
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.uv.unwrap(margin = 0)

        # add a materal to hold diffuse texture, to bake an image
        # does not matter whether or not texture is diffuse on passed material
        tempMat = bpy.data.materials.new('temp_material')
        self.plane.data.materials.append(tempMat)

        # copy material properties to temp material
        tempMat.diffuse_color       = material.diffuse_color
        tempMat.diffuse_intensity   = material.diffuse_intensity
        tempMat.ambient             = material.ambient
        tempMat.specular_color      = material.specular_color
        tempMat.specular_intensity  = material.specular_intensity
        tempMat.emit                = material.emit
        tempMat.specular_hardness   = material.specular_hardness

        # setting these for PNG files that you wish to convert to JPEG sometimes cause problems
        if self.usePNG:
            tempMat.transparency_method = material.transparency_method
            tempMat.use_transparency    = material.use_transparency
            tempMat.alpha               = material.alpha
            tempMat.specular_alpha      = material.specular_alpha

        # create temp texture & add it to a texture slot of the temp material
        tempTex = bpy.data.textures.new('temp_texture', type='IMAGE')

        tSlot = tempMat.texture_slots.add()
        tSlot.texture = tempTex
        tSlot.texture_coords = 'UV'
        tSlot.mapping = 'FLAT'

        # always map to color_diffuse; conditionally to alpha
        tSlot.use_map_color_diffuse = True
        tSlot.use_map_alpha = self.usePNG

        # get filled slots that also have a texture
        tSlots = [mtex for mtex in material.texture_slots if mtex and mtex.texture]

        # bake each texture of type image
        for mtex in tSlots:
            if mtex.texture.type != 'IMAGE': continue

            # assign the texture image to the temp Texture
            originalImage = mtex.texture.image
            tempTex.image = originalImage
            tempTex.use_alpha = originalImage.use_alpha

            self.bake(mtex, originalImage, image_settings.file_format, renderer.filepath)

            # remove old image
            tempTex.image = None
            if not originalImage.users:
                bpy.data.images.remove(originalImage)


        # delete temporary Mesh, material, texture slot
        bpy.ops.object.mode_set(mode='OBJECT')
        self.plane.select = True
        bpy.ops.object.delete()

        bpy.data.materials.remove(tempMat, do_unlink = True)
        tSlot.texture = None

        # re-select original mesh
        mesh.select = True
        scene.objects.active = mesh
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def bake(self, mtex, originalImage, file_format, filepath):
        origWidth  = originalImage.size[0]
        origHeight = originalImage.size[1]

        if origWidth > origHeight:
            imgWidth = self.longestSideSize
            w = 1
            h = origHeight / origWidth
            imgHeight = self.longestSideSize * h

        elif origWidth < origHeight:
            imgHeight = self.longestSideSize
            h = 1
            w = origWidth / origHeight
            imgWidth = self.longestSideSize * w

        else:
            imgWidth = imgHeight = self.longestSideSize
            w = h = 1

        # scaling in case non-square image
        self.plane.scale[0] = w
        self.plane.scale[2] = h

        # create a replacement image
        baked = bpy.data.images.new(name = mtex.texture.image.name, width = imgWidth, height = imgHeight, alpha = self.usePNG, float_buffer = False)
        baked.file_format = file_format
        baked.mapping = 'UV' # default value

        # give image a good name, so export has one (BJS optimized using the .jpg in the name)
        extension = baked.file_format.lower()
        if extension == 'jpeg': extension = 'jpg'
        legalName = legal_js_identifier(mtex.texture.name)+ '.' + extension
        baked.filepath_raw = path.join(filepath, legalName)

        # assign the image to the UV Editor, which does not have to shown
        bpy.data.screens['UV Editing'].areas[1].spaces[0].image = baked
        bpy.ops.object.bake_image()

        # save to temp drive
        baked.save()

        # update with lower resolution image
        mtex.texture.image = baked
#===============================================================================
bpy.types.Material.usePNG = bpy.props.BoolProperty(
    name='Need Alpha',
    description='Saved as PNG when alpha is required, else JPG.',
    default = False
)
bpy.types.Material.longestSideSize = bpy.props.IntProperty(
    name='Longest Side Size',
    description='Final dimension longest side of texture(s).\nNot required to be a power of 2, but recommended.',
    default = 1024
)
bpy.types.Material.texQuality = bpy.props.IntProperty(
    name='Quality 1-100',
    description='For JPG: The trade-off between Quality - File size(100 highest quality)\nFor PNG: amount of time spent for compression',
    default = 100, min = 1, max = 100
)
#===============================================================================
class TextureReductionPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'material'

    def draw(self, context):
        layout = self.layout

        mesh = context.object
        index = mesh.active_material_index
        material = mesh.material_slots[index].material

        box = layout.box()
        box.prop(material, 'usePNG')
        box.prop(material, 'longestSideSize')
        box.prop(material, 'texQuality')
        box.operator('tob.textureresize')