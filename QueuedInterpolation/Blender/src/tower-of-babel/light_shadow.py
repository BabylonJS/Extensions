from .logger import *
from .package_level import *

from .f_curve_animatable import *

import bpy
from mathutils import Color, Vector

# used in Light constructor, never formally defined in Babylon, but used in babylonFileLoader
POINT_LIGHT = 0
DIRECTIONAL_LIGHT = 1
SPOT_LIGHT = 2
HEMI_LIGHT = 3

#used in ShadowGenerators
NO_SHADOWS = 'NONE'
STD_SHADOWS = 'STD'
POISSON_SHADOWS = 'POISSON'
ESM_SHADOWS = 'ESM'
BLUR_ESM_SHADOWS = 'BLUR_ESM'
#===============================================================================
class Light(FCurveAnimatable):
    def __init__(self, light, meshesAndNodes):
        if light.parent and light.parent.type != 'ARMATURE':
            self.parentId = light.parent.name

        self.name = light.name
        Logger.log('processing begun of light (' + light.data.type + '):  ' + self.name)
        self.define_animations(light, False, True, False)

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
            matrix_local.translation = Vector((0, 0, 0))
            self.direction = (Vector((0, 0, -1)) * matrix_local)
            self.direction = scale_vector(self.direction, -1)
            self.groundColor = Color((0, 0, 0))

        self.intensity = light.data.energy
        self.diffuse   = light.data.color if light.data.use_diffuse  else Color((0, 0, 0))
        self.specular  = light.data.color if light.data.use_specular else Color((0, 0, 0))
        
        #code generated for cameraLight is done in js_exporter
        self.cameraLight = light.data.cameraLight

        # inclusion section
        if light.data.use_own_layer:
            lampLayer = getLayer(light)
            self.includedOnlyMeshesIds = []
            for mesh in meshesAndNodes:
                if mesh.layer == lampLayer:
                    self.includedOnlyMeshesIds.append(mesh.name)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def get_direction(matrix):
        return (matrix.to_3x3() * Vector((0.0, 0.0, -1.0))).normalized()
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        if self.light_type == POINT_LIGHT:
            file_handler.write(indent + 'light = new _B.PointLight("' + self.name + '", new _B.Vector3(' + format_vector(self.position) + '), scene);\n')

        elif self.light_type == DIRECTIONAL_LIGHT:
            file_handler.write(indent + 'light = new _B.DirectionalLight("' + self.name + '", new _B.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.position = new _B.Vector3(' + format_vector(self.position) + ');\n')

        elif self.light_type == SPOT_LIGHT:
            file_handler.write(indent + 'light = new _B.SpotLight("' + self.name + '", new _B.Vector3(' + format_vector(self.position) +
                               '), new _B.Vector3(' + format_vector(self.direction) + '), ' + format_f(self.angle) + ', ' + format_f(self.exponent) + ', scene);\n')

        else: # Hemi
            file_handler.write(indent + 'light = new _B.HemisphericLight("' + self.name + '", new _B.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.groundColor = new _B.Color3(' + format_color(self.groundColor) + ');\n')
            
        if self.light_type != HEMI_LIGHT:
            file_handler.write(indent + 'if (positionOffset) light.position.addInPlace(positionOffset);\n')

        file_handler.write(indent + 'light.intensity = ' + format_f(self.intensity) + ';\n')

        if hasattr(self, 'range'):
            file_handler.write(indent + 'light.range = ' + format_f(self.range) + ';\n')

        if hasattr(self, 'parentId'):
            file_handler.write(indent + 'light.parent = scene.getLastEntryByID("' + self.parentId + '");\n')

        file_handler.write(indent + 'light.diffuse = new _B.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent + 'light.specular = new _B.Color3(' + format_color(self.specular) + ');\n')

        if hasattr(self, 'includedOnlyMeshesIds'):
            file_handler.write(indent + 'light.includedOnlyMeshesIds = [')
            first = True
            for meshId in self.includedOnlyMeshesIds:
                if first != True:
                    file_handler.write(',')
                first = False

                file_handler.write('"' + meshId + '"')

            file_handler.write('];\n')

        super().to_script_file(file_handler, 'light', indent) # Animations
#===============================================================================
class ShadowGenerator:
    def __init__(self, lamp, meshesAndNodes, scene):
        Logger.log('processing begun of shadows for light:  ' + lamp.name)
        self.lightId = lamp.name
        self.mapSize = lamp.data.shadowMapSize
        self.shadowBias = lamp.data.shadowBias
        self.shadowDarkness = lamp.data.shadowDarkness

        if lamp.data.shadowMap == ESM_SHADOWS:
            self.useExponentialShadowMap = True
        elif lamp.data.shadowMap == POISSON_SHADOWS:
            self.usePoissonSampling = True
        elif lamp.data.shadowMap == BLUR_ESM_SHADOWS:
            self.useBlurExponentialShadowMap = True
            self.shadowBlurScale = lamp.data.shadowBlurScale
            self.shadowBlurBoxOffset = lamp.data.shadowBlurBoxOffset
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        file_handler.write(indent + 'light = scene.getLightByID("' + self.lightId + '");\n')
        file_handler.write(indent + 'shadowGenerator = new _B.ShadowGenerator(' + format_int(self.mapSize) + ', light);\n')
        file_handler.write(indent + 'shadowGenerator.bias = ' + format_f(self.shadowBias, precision = 5) + ';\n')
        file_handler.write(indent + 'shadowGenerator.darkness = ' + format_f(self.shadowDarkness) + ';\n')
        if hasattr(self, 'useExponentialShadowMap') :
            file_handler.write(indent + 'shadowGenerator.useExponentialShadowMap = true;\n')
        elif hasattr(self, 'usePoissonSampling'):
            file_handler.write(indent + 'shadowGenerator.usePoissonSampling = true;\n')
        elif hasattr(self, 'useBlurExponentialShadowMap'):
            file_handler.write(indent + 'shadowGenerator.useBlurExponentialShadowMap = true;\n')
            file_handler.write(indent + 'shadowGenerator.blurScale = ' + format_int(self.shadowBlurScale) + ';\n')
            file_handler.write(indent + 'shadowGenerator.blurBoxOffset = ' + format_int(self.shadowBlurBoxOffset) + ';\n')
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
             (ESM_SHADOWS          , 'ESM'          , 'Use Exponential Shadow Maps'),
             (BLUR_ESM_SHADOWS     , 'Blur ESM'     , 'Use Blur Exponential Shadow Maps')
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
    description='Setting when using a Blur Variance shadow map',
    default = 2
)

bpy.types.Lamp.shadowBlurBoxOffset = bpy.props.IntProperty(
    name='Blur Box Offset',
    description='Setting when using a Blur Variance shadow map',
    default = 0
)
bpy.types.Lamp.shadowDarkness = bpy.props.FloatProperty(
    name='Shadow Darkness',
    description='Shadow Darkness',
    default = 1,
    min = 0, 
    max = 1
)
bpy.types.Lamp.cameraLight = bpy.props.BoolProperty(
    name='Camera Light (point type only)',
    description='attach this light to move / rotate with the active camera using a scene.beforeCameraRender,\nor activeCameras[0] when more than 1 active',
    default = False
)
#===============================================================================
class LightPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'data'

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob is not None and isinstance(ob.data, bpy.types.Lamp)

    def draw(self, context):
        ob = context.object
        layout = self.layout
        layout.prop(ob.data, 'shadowMap')
        
        usingShadows =  ob.data.shadowMap != NO_SHADOWS
        row = layout.row()
        row.enabled = usingShadows
        row.prop(ob.data, 'shadowMapSize')
        
        row = layout.row()
        row.enabled = usingShadows
        row.prop(ob.data, 'shadowBias')

        row = layout.row()
        row.enabled = usingShadows
        row.prop(ob.data, 'shadowDarkness')

        box = layout.box()
        box.label(text="Blur ESM Shadows")
        usingBlur = ob.data.shadowMap == BLUR_ESM_SHADOWS
        row = box.row()
        row.enabled = usingBlur
        row.prop(ob.data, 'shadowBlurScale')
        row = box.row()
        row.enabled = usingBlur
        row.prop(ob.data, 'shadowBlurBoxOffset')

        layout.prop(ob.data, 'autoAnimate')
        
        row = layout.row()
        row.enabled = ob.data.type == 'POINT'
        row.prop(ob.data, 'cameraLight')
        
