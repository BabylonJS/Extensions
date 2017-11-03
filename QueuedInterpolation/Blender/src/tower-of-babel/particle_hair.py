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
        Logger.log('processing begun of particle hair:  ' + self.name)
        
        if object.parent is not None:
            self.parentId = object.parent.name
        
        self.userSuppliedBaseClass = 'QI.Hair'
        
        # grab the custom properties
        self.headBone  = object.data.headBone
        self.spineBone  = object.data.spineBone
        
        if object.data.stdColors != USE_BASE:
            self.namedColor = object.data.stdColors
        else:            
            self.color = object.data.baseColor
            
        self.interStrandColorSpread = object.data.interStrandColorSpread
        self.intraStrandColorSpread = object.data.intraStrandColorSpread
        self.emissiveColorScaling = object.data.emissiveColorScaling
            
        verts = object.data.vertices
        edges = object.data.edges
        
        self.strandNumVerts = []
        self.rootRelativePositions = []
        self.lowestRoot  =  100000
        self.highestRoot = -100000
        self.lowestTip   =  100000
        self.cornerOffset = 0.02

        # determine the number of verts per stand after the dissolve & save rootRelative Positions
        nVerts = 0
        tailVertIdx = -1
        root = None
        for idx, edge in enumerate(edges):
            if tailVertIdx != edge.vertices[0]:
                # write out the stand length unless first strand
                if tailVertIdx != -1:
                    self.strandNumVerts.append(nVerts)
                
                root = verts[edge.vertices[0]].co
                nVerts = 2
                
                # need to write both vertices at the beginning of a strand
                self.rootRelativePositions.append(root.x)
                self.rootRelativePositions.append(root.z)
                self.rootRelativePositions.append(root.y)
                
                if self.lowestRoot > root.z: 
                    self.lowestRoot = root.z
                
                if self.highestRoot < root.z: 
                    self.highestRoot = root.z
            
            else: 
                nVerts += 1 
                  
            # always write the tail vertex
            tail = verts[edge.vertices[1]].co
            self.rootRelativePositions.append(tail.x - root.x)
            self.rootRelativePositions.append(tail.z - root.z)
            self.rootRelativePositions.append(tail.y - root.y)
                
            if self.lowestTip > tail.z: 
                self.lowestTip = tail.z
        
            # always record tail vertex index for next test
            tailVertIdx = edge.vertices[1]

        # write out the last strand length 
        self.strandNumVerts.append(nVerts)

        nStrands = len(self.strandNumVerts)
        totalVerts = len(verts)
        Logger.log('# of Strands: ' + str(nStrands) + ', Total # of Vertices: ' + str(totalVerts), 2)
        Logger.log('Avg # verts per strand: ' + str(totalVerts / nStrands), 2)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# not in use
    def length(self, deltaX, deltaY, deltaZ):
        return sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) )

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # does not need exporter some args, but need same call signature as Mesh
    def to_script_file(self, file_handler, typescript_file_handler, kids, indent, exporter):
        # this is very similar to mesh_node_common_script in mesh.py;  not worth trying to call with slight differences
        isRootMesh = not hasattr(self, 'parentId')
        baseClass = self.userSuppliedBaseClass
        var = ''
        indent2 = ''
        if isRootMesh:
            var = 'this'
            indent2 = indent + '        '
    
            # declaration of class
            typescript_file_handler.write('\n' + indent + 'class ' + self.legalName + ' extends ' + baseClass + ' {\n')
            for kid in kids:
                typescript_file_handler.write(indent + '    public ' + kid.legalName + ' : ' + get_base_class(kid) + ';\n')
    
            typescript_file_handler.write(indent + '    constructor(name: string, scene: BABYLON.Scene);\n')
    
            # - - - - - - - - - - -
            file_handler.write('\n' + indent + 'var ' + self.legalName + ' = (function (_super) {\n')
            file_handler.write(indent + '    __extends(' + self.legalName + ', _super);\n')
            file_handler.write(indent + '    function ' + self.legalName + '(name, scene) {\n')
            file_handler.write(indent2 + '_super.call(this, name, scene, null, source, true);\n\n')
    
        else:
            var = 'ret'
            indent2 = indent + '    '
            file_handler.write('\n' + indent + 'function child_' + self.legalName + '(scene, parent) {\n')
            file_handler.write(indent2 + 'var ' + var + ' = new ' + baseClass + '(parent.name + ".' + self.legalName + '", scene, parent);\n')

        file_handler.write(indent2 + 'ret.id = ret.name;\n')
        writeRepeatableArray(file_handler, var + '.strandNumVerts', indent2, self.strandNumVerts, 'Uint32Array', False)
        file_handler.write(indent2 + var + '.rootRelativePositions = [' + format_array(self.rootRelativePositions, indent2) + '];\n')
        file_handler.write(indent2 + var + '.lowestRoot = ' + format_f(self.lowestRoot) + ';\n')
        file_handler.write(indent2 + var + '.highestRoot = ' + format_f(self.highestRoot) + ';\n')
        file_handler.write(indent2 + var + '.lowestTip = ' + format_f(self.lowestTip) + ';\n')
        file_handler.write(indent2 + var + '.headBone = "' + self.headBone + '";\n')
        file_handler.write(indent2 + var + '.spineBone = "' + self.spineBone + '";\n')
        file_handler.write(indent2 + var + '.interStrandColorSpread = ' + format_f(self.interStrandColorSpread) + ';\n')
        file_handler.write(indent2 + var + '.intraStrandColorSpread = ' + format_f(self.intraStrandColorSpread) + ';\n')
        file_handler.write(indent2 + var + '.emissiveColorScaling = ' + format_f(self.emissiveColorScaling) + ';\n')
        file_handler.write(indent2 + var + '.cornerOffset = ' + format_f(self.cornerOffset) + ';\n')
        
        if hasattr(self, "namedColor"):
            file_handler.write(indent2 + var + '.namedColor = "' + self.namedColor + '";\n')
        else:
            file_handler.write(indent2 +  var + '.color = new _B.Color3(' + format_color(self.baseColor) + ');\n')
                    
        # end of constructor; other methods for root mesh, or return for child meshes
        if isRootMesh:
            file_handler.write(indent + '    }\n')

            file_handler.write(indent + '    return ' + self.legalName + ';\n')
            file_handler.write(indent + '}(' + baseClass + '));\n')
            file_handler.write(indent + exporter.nameSpace + '.' + self.legalName + ' = ' + self.legalName + ';\n')
        else:
            file_handler.write(indent2 + 'ret.assemble();\n')
            file_handler.write(indent2 + 'return ret;\n')
            file_handler.write(indent + '}\n')
#===============================================================================
bpy.types.Mesh.headBone = bpy.props.StringProperty(
    name='Head Bone',
    description='This name of the bone at the top of the skeleton, optional.',
    default = ''
)

bpy.types.Mesh.spineBone = bpy.props.StringProperty(
    name='Spine Bone',
    description='This name of the bone at the top of the body, requires head bone, optional.',
    default = ''
)

bpy.types.Mesh.baseColor = bpy.props.FloatVectorProperty(
    name='Custom Color',
    description='Used to generate vertex colors randomly near this.',
    subtype='COLOR',
    default=[0.0,0.0,0.0]
)

bpy.types.Mesh.stdColors = bpy.props.EnumProperty(
    name='Standard Colors',
    description='These are some pre-assigned vertex colors',
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

bpy.types.Mesh.interStrandColorSpread = bpy.props.FloatProperty(
    name='Inter-Strand Color Spread',
    description='The maximum amount to randomly change the color of a thread from the base color.',
    default= 0.00,
    min=0.0,
    max=1.0
)      

bpy.types.Mesh.intraStrandColorSpread = bpy.props.FloatProperty(
    name='Intra-Strand Color Spread',
    description='The maximum amount to randomly change from one segment of a strand to the next.',
    default= 0.00,
    min=0.0,
    max=0.05
)

bpy.types.Mesh.emissiveColorScaling = bpy.props.FloatProperty(
    name='Emissive Scaling',
    description='The scaling of the vertex color to also be applied to entire mesh.',
    default= 1.0,
    min=0.5,
    max=1.5
)