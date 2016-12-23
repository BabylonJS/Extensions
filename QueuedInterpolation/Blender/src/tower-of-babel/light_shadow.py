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
VARIANCE_SHADOWS = 'VARIANCE'
BLUR_VARIANCE_SHADOWS = 'BLUR_VARIANCE'
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
            file_handler.write(indent + 'light = new B.PointLight("' + self.name + '", new B.Vector3(' + format_vector(self.position) + '), scene);\n')

        elif self.light_type == DIRECTIONAL_LIGHT:
            file_handler.write(indent + 'light = new B.DirectionalLight("' + self.name + '", new B.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.position = new B.Vector3(' + format_vector(self.position) + ');\n')

        elif self.light_type == SPOT_LIGHT:
            file_handler.write(indent + 'light = new B.SpotLight("' + self.name + '", new B.Vector3(' + format_vector(self.position) +
                               '), new B.Vector3(' + format_vector(self.direction) + '), ' + format_f(self.angle) + ', ' + format_f(self.exponent) + ', scene);\n')

        else:
            file_handler.write(indent + 'light = new B.HemisphericLight("' + self.name + '", new B.Vector3(' + format_vector(self.direction) + '), scene);\n')
            file_handler.write(indent + 'light.groundColor = new B.Color3(' + format_color(self.groundColor) + ');\n')

        file_handler.write(indent + 'light.intensity = ' + format_f(self.intensity) + ';\n')

        if hasattr(self, 'range'):
            file_handler.write(indent + 'light.range = ' + format_f(self.range) + ';\n')

        if hasattr(self, 'parentId'):
            file_handler.write(indent + 'light.parent = scene.getLastEntryByID("' + self.parentId + '");\n')

        file_handler.write(indent + 'light.diffuse = new B.Color3(' + format_color(self.diffuse) + ');\n')
        file_handler.write(indent + 'light.specular = new B.Color3(' + format_color(self.specular) + ');\n')

        if hasattr(self, 'includedOnlyMeshesIds'):
            file_handler.write(indent + 'light._includedOnlyMeshesIds = [')
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
        file_handler.write(indent + 'shadowGenerator = new B.ShadowGenerator(' + format_int(self.mapSize) + ', light);\n')
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
        layout.prop(ob.data, 'shadowMapSize')
        layout.prop(ob.data, 'shadowBias')

        box = layout.box()
        box.label(text="Blur Variance Shadows")
        box.prop(ob.data, 'shadowBlurScale')
        box.prop(ob.data, 'shadowBlurBoxOffset')

        layout.prop(ob.data, 'autoAnimate')
