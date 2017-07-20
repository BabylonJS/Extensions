from .logger import *
from .package_level import *

import bpy
from math import sqrt, radians
from mathutils import Color, Vector

USE_BASE = 'USE_BASE'
BLACK = 'BLACK'
DARK_BROWN = 'DARK_BROWN'
MEDIUM_BROWN = 'MEDIUM_BROWN'
LIGHT_BROWN = 'LIGHT_BROWN'
DIRTY_BLONDE = 'DIRTY_BLONDE'
BLONDE = 'BLONDE'
PLATINUM_BLONDE = 'PLATINUM_BLONDE'
RED = 'RED'
ORANGE = 'ORANGE'
WHITE = 'WHITE'

BLACK_VAL           = Color((0.05, 0.05, 0.05))
DARK_BROWN_VAL      = Color((0.10, 0.03, 0.005))
MEDIUM_BROWN_VAL    = Color((0.30, 0.16, 0.05))
LIGHT_BROWN_VAL     = Color((0.35, 0.22, 0.09))
DIRTY_BLONDE_VAL    = Color((0.45, 0.35, 0.15))
BLONDE_VAL          = Color((0.65, 0.55, 0.28))
PLATINUM_BLONDE_VAL = Color((0.75, 0.70, 0.35))
RED_VAL             = Color((0.367, 0.072, 0.026))
ORANGE_VAL          = Color((0.50, 0.19, 0.03))
WHITE_VAL           = Color((0.90, 0.90, 0.95))
#===============================================================================
class Hair():
    def __init__(self, particle_sys, mesh, bjsMesh, exporter):
        self.name = particle_sys.name
        self.legalName = legal_js_identifier(self.name)
        Logger.log('processing begun of particle hair:  ' + self.name, 2)
        
        self.bjsMesh = bjsMesh
        
        # make a child of the emitter in export
        self.parentId = bjsMesh.name
        
        # allow the parent mesh to declare this child correctly in .d.ts file
        self.userSuppliedBaseClass = 'QI.Hair'
        
        # grab the custom properties
        self.boneName  = particle_sys.settings.boneName
        self.stiffness = particle_sys.settings.stiffness
        self.baseColor = particle_sys.settings.baseColor
        if particle_sys.settings.stdColors != USE_BASE:
            asDict = {BLACK: BLACK_VAL, DARK_BROWN: DARK_BROWN_VAL, MEDIUM_BROWN: MEDIUM_BROWN_VAL, LIGHT_BROWN: LIGHT_BROWN_VAL, DIRTY_BLONDE: DIRTY_BLONDE_VAL, BLONDE: BLONDE_VAL, PLATINUM_BLONDE: PLATINUM_BLONDE_VAL, RED: RED_VAL, ORANGE: ORANGE_VAL, WHITE: WHITE_VAL}
            self.baseColor = asDict[particle_sys.settings.stdColors]
            
        self.colorSpread = particle_sys.settings.colorSpread
            
        # find the modifier name & temporarily convert it
        for mod in [m for m in mesh.modifiers if m.type == 'PARTICLE_SYSTEM']:
            bpy.ops.object.modifier_convert( modifier = mod.name )
            break
        
        scene = exporter.scene
        # get the new active mesh is the converted hair
        hairMesh = scene.objects.active 
        nVertsBefore = len(hairMesh.data.vertices)       
#        verts = hairMesh.data.vertices
#        edges = hairMesh.data.edges
#        for idx, vert in enumerate(verts):
#            print('vert: ' + str(idx) + ' location: ' + format_vector(vert.co) )

#        for idx, edge in enumerate(edges):
#            print('edge: ' + str(idx) + ' locations: ' + str(edge.vertices[0]) + ' and ' + str(edge.vertices[1]))

        # perform a limited Dissolve
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        degrees = particle_sys.settings.dissolveAngle
        bpy.ops.mesh.dissolve_limited(angle_limit=radians(degrees)) # 5% is 0.087
        bpy.ops.object.mode_set(mode='OBJECT')
        
        verts = hairMesh.data.vertices
        edges = hairMesh.data.edges
        
        self.strandNumVerts = []
        self.rootRelativePositions = []
        longestStrand = -1

        # determine the number of verts per stand after the dissolve & save rootRelative Positions
        nVerts = 0
        tailVertIdx = -1
        root = None
        self.longestStrand = -1
        for idx, edge in enumerate(edges):
            if tailVertIdx != edge.vertices[0]:
                # write out the stand length unless first strand
                if tailVertIdx != -1:
                    self.strandNumVerts.append(nVerts)
                    strandLength = self.length(tail.x - root.x, tail.z - root.z, tail.y - root.y)
                    if self.longestStrand < strandLength:
                        self.longestStrand = strandLength
                
                root = verts[edge.vertices[0]].co
                nVerts = 2
                
                # need to write both vertices at the beginning of a strand
                self.rootRelativePositions.append(root.x)
                self.rootRelativePositions.append(root.z)
                self.rootRelativePositions.append(root.y)
            
            else: 
                nVerts += 1 
                  
            # always write the tail vertex
            tail = verts[edge.vertices[1]].co
            self.rootRelativePositions.append(tail.x - root.x)
            self.rootRelativePositions.append(tail.z - root.z)
            self.rootRelativePositions.append(tail.y - root.y)
            
            # always record tail vertex index for next test
            tailVertIdx = edge.vertices[1]

        # write out the last strand length 
        self.strandNumVerts.append(nVerts)
            
        bpy.ops.object.delete(use_global=False)

        nStrands = len(self.strandNumVerts)
        nVerts = len(verts)
        Logger.log('# of Strands: ' + str(nStrands) + ', reduced from ' + str(nVertsBefore) + ' to ' + str(nVerts), 3)
        Logger.log('Avg # verts per strand reduced from ' + str(nVertsBefore / nStrands) + ' to ' + str(nVerts / nStrands), 3)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def length(self, deltaX, deltaY, deltaZ):
        return sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) )

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # does not need exporter some args, but need same call signature as Mesh
    def to_script_file(self, file_handler, typescript_file_handler, kids, indent, exporter):
        indent2 = indent + '    '
        file_handler.write('\n' + indent + 'function child_' + self.legalName + '(scene, parent, source){\n')

        file_handler.write(indent2 + 'var ret = new QI.Hair(parent.name + ".' + self.legalName + '", scene, parent, source);\n')
        file_handler.write(indent2 + 'ret.id = ret.name;\n')
        file_handler.write(indent2 + 'ret.billboardMode  = ' + format_int(self.bjsMesh.billboardMode) + ';\n')
        file_handler.write(indent2 + 'ret.isVisible  = false; //always false\n')
        file_handler.write(indent2 + 'ret.setEnabled(' + format_bool(self.bjsMesh.isEnabled) + ');\n')
        file_handler.write(indent2 + 'ret.checkCollisions = ' + format_bool(self.bjsMesh.checkCollisions) + ';\n')
        file_handler.write(indent2 + 'ret.receiveShadows  = ' + format_bool(self.bjsMesh.receiveShadows) + ';\n')
        file_handler.write(indent2 + 'ret.castShadows = false;\n') # LinesMeshes error on shadow RenderLists
        file_handler.write(indent2 + 'ret.skeleton = parent.skeleton;\n\n')
        
        file_handler.write(indent2 + 'ret.color = new _B.Color3(' + format_color(self.baseColor) + ');\n')
        
        file_handler.write(indent2 + 'var strandNumVerts;\n')
        writeRepeatableArray(file_handler, 'strandNumVerts', indent2, self.strandNumVerts, 'Uint32Array', False)
        file_handler.write(indent2 + 'var rootRelativePositions = [' + format_array(self.rootRelativePositions, indent2) + '];\n')
        file_handler.write(indent2 + 'ret.assemble(strandNumVerts, rootRelativePositions, ' + format_f(self.colorSpread) + ', ' + format_int(self.longestStrand) + ', ' + format_f(self.stiffness) + ', "' + self.boneName + '");\n')
        file_handler.write(indent2 + 'return ret;\n')
        file_handler.write(indent + '}\n')
#===============================================================================

bpy.types.ParticleSettings.boneName = bpy.props.StringProperty(
    name='Bone',
    description='',
    default = ''
)

bpy.types.ParticleSettings.stiffness = bpy.props.FloatProperty(
    name='Stiffness',
    description='',
    default = 1.0,
    min = 0.1,
    max = 1.0
)

bpy.types.ParticleSettings.dissolveAngle = bpy.props.FloatProperty(
    name='Dissolve Angle',
    description='Used to do a limited dissolve to remove some vertices',
    default = 5.0,
    min = 0,
    max = 20
)

bpy.types.ParticleSettings.baseColor = bpy.props.FloatVectorProperty(
    name='Base Color',
    description='Used to generate vertex colors randomly near this.',
    subtype='COLOR',
    default=[0.0,0.0,0.0]
)

bpy.types.ParticleSettings.stdColors = bpy.props.EnumProperty(
    name='Standard Colors',
    description='',
    items = ((USE_BASE, 'Use Base', 'Use the base color setting'),
             (BLACK   , 'Black'   , 'Black hair'),
             (DARK_BROWN   , 'Dark Brown'   , 'Dark brown hair'),
             (MEDIUM_BROWN   , 'Medium Brown'   , 'Medium brown hair'),
             (LIGHT_BROWN   , 'Light Brown'   , 'Light brown hair'),
             (DIRTY_BLONDE  , 'Dirty Blonde'  , 'Dirty blonde hair'),
             (BLONDE  , 'Blonde'  , 'Blonde hair'),
             (PLATINUM_BLONDE  , 'Blonde'  , 'Platinum Blonde hair'),
             (RED     , 'Red'     , 'Red hair'),
             (ORANGE     , 'Orange'     , 'Orange hair'),
             (WHITE   , 'White'   , 'White hair')
            ),
    default = USE_BASE
)

bpy.types.ParticleSettings.colorSpread = bpy.props.FloatProperty(
    name='Color Spread',
    description='The maximum amount to randomly change the color of a thread.',
    default= 0.05,
    min=0.05,
    max=1.0
)

#===============================================================================
class HairPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'particle'

    @classmethod
    def poll(cls, context):
        mesh = context.object
        if mesh is None or len(mesh.particle_systems) == 0: return False
        
        index = mesh.particle_systems.active_index
        return mesh.particle_systems[index].settings.type == 'HAIR'
    
    def draw(self, context):
        layout = self.layout
        
        mesh = context.object
        index = mesh.particle_systems.active_index
        
        hair = mesh.particle_systems[index].settings
        layout.prop(hair, 'boneName')        
        layout.prop(hair, 'stiffness')
        layout.prop(hair, 'dissolveAngle')
        
        box = layout.box()
        box.label(text="Color")
        usingWheel = hair.stdColors == USE_BASE
        row = box.row()
        row.enabled = usingWheel
        row.prop(hair, 'baseColor')
        row = box.row()
        row.prop(hair, 'stdColors')
        row = box.row()
        row.prop(hair, 'colorSpread')
        
