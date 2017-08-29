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
PLATINUM_BLONDE_VAL = Color((0.95, 0.95, 0.625))
RED_VAL             = Color((0.367, 0.072, 0.026))
ORANGE_VAL          = Color((0.50, 0.19, 0.03))
WHITE_VAL           = Color((0.90, 0.90, 0.95))
#===============================================================================
class Hair():
    def __init__(self, object):
        self.name = object.name
        self.legalName = legal_js_identifier(self.name)
        Logger.log('\nprocessing begun of particle hair:  ' + self.name)
        
        if object.parent is not None:
            self.parentId = object.parent.name
        
        # allow the parent mesh to declare this child correctly in .d.ts file
        self.userSuppliedBaseClass = 'QI.Hair'
        
        # grab the custom properties
        self.boneName  = object.data.boneName
        self.stiffness = object.data.stiffness
        
        if object.data.stdColors != USE_BASE:
            self.namedColor = object.data.stdColors
        else:            
            self.color = object.data.baseColor
            
        self.colorSpread = object.data.colorSpread
            
        verts = object.data.vertices
        edges = object.data.edges
        
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

        nStrands = len(self.strandNumVerts)
        totalVerts = len(verts)
        Logger.log('# of Strands: ' + str(nStrands) + ', Total # of Vertices: ' + str(totalVerts), 2)
        Logger.log('Avg # verts per strand: ' + str(totalVerts / nStrands), 2)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def length(self, deltaX, deltaY, deltaZ):
        return sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) )

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # does not need exporter some args, but need same call signature as Mesh
    def to_script_file(self, file_handler, typescript_file_handler, kids, indent, exporter):
        #todo unparent hair
        indent2 = indent + '    '
        file_handler.write('\n' + indent + 'function child_' + self.legalName + '(scene, parent, source){\n')

        file_handler.write(indent2 + 'var ret = new QI.Hair(parent.name + ".' + self.legalName + '", scene, parent, source);\n')
        file_handler.write(indent2 + 'ret.id = ret.name;\n')
        file_handler.write(indent2 + 'ret.billboardMode  = parent.billboardMode;\n')
        file_handler.write(indent2 + 'ret.isVisible  = false; //always false\n')
        file_handler.write(indent2 + 'ret.setEnabled(parent.isEnabled() );\n')
        file_handler.write(indent2 + 'ret.checkCollisions = parent.checkCollisions;\n')
        file_handler.write(indent2 + 'ret.receiveShadows  = parent.receiveShadows;\n')
        file_handler.write(indent2 + 'ret.castShadows = false;\n') # LinesMeshes error on shadow RenderLists
        file_handler.write(indent2 + 'ret.skeleton = parent.skeleton;\n\n')
        
        if hasattr(self, "namedColor"):
            file_handler.write(indent2 + 'ret.namedColor = "' + self.namedColor + '";\n')
        else:
            file_handler.write(indent2 + 'ret.color = new _B.Color3(' + format_color(self.baseColor) + ');\n')
            
        file_handler.write(indent2 + 'ret.colorSpread = ' + format_f(self.colorSpread) + ';\n')
        
        file_handler.write(indent2 + 'var strandNumVerts;\n')
        writeRepeatableArray(file_handler, 'strandNumVerts', indent2, self.strandNumVerts, 'Uint32Array', False)
        file_handler.write(indent2 + 'var rootRelativePositions = [' + format_array(self.rootRelativePositions, indent2) + '];\n')
        file_handler.write(indent2 + 'ret.assemble(strandNumVerts, rootRelativePositions, ' + format_int(self.longestStrand) + ', ' + format_f(self.stiffness) + ', "' + self.boneName + '");\n')
        file_handler.write(indent2 + 'return ret;\n')
        file_handler.write(indent + '}\n')
#===============================================================================
bpy.types.Mesh.treatAsHair = bpy.props.BoolProperty(
    name='Treat As Hair',
    description='Process the vertices only as if the were converted from a particle hair system',
    default = False
)

bpy.types.Mesh.boneName = bpy.props.StringProperty(
    name='Bone',
    description='',
    default = ''
)

bpy.types.Mesh.stiffness = bpy.props.FloatProperty(
    name='Stiffness',
    description='',
    default = 1.0,
    min = 0.1,
    max = 1.0
)

bpy.types.Mesh.baseColor = bpy.props.FloatVectorProperty(
    name='Custom Color',
    description='Used to generate vertex colors randomly near this.',
    subtype='COLOR',
    default=[0.0,0.0,0.0]
)

bpy.types.Mesh.stdColors = bpy.props.EnumProperty(
    name='Standard Colors',
    description='',
    items = ((USE_BASE       , 'Use Base'       , 'Use the base color setting'),
             (BLACK          , 'Black'          , 'Black hair'),
             (DARK_BROWN     , 'Dark Brown'     , 'Dark brown hair'),
             (MEDIUM_BROWN   , 'Medium Brown'   , 'Medium brown hair'),
             (LIGHT_BROWN    , 'Light Brown'    , 'Light brown hair'),
             (DIRTY_BLONDE   , 'Dirty Blonde'   , 'Dirty blonde hair'),
             (BLONDE         , 'Blonde'         , 'Blonde hair'),
             (PLATINUM_BLONDE, 'Platinum Blonde', 'Platinum Blonde hair'),
             (RED            , 'Red'            , 'Red hair'),
             (ORANGE         , 'Orange'         , 'Orange hair'),
             (WHITE          , 'White'          , 'White hair')
            ),
    default = USE_BASE
)

bpy.types.Mesh.colorSpread = bpy.props.FloatProperty(
    name='Color Spread',
    description='The maximum amount to randomly change the color of a thread.',
    default= 0.05,
    min=0.05,
    max=1.0
)
        
