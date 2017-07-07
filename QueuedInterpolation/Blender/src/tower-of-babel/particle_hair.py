from .logger import *
from .package_level import *

import bpy
from math import sqrt
from mathutils import Color, Vector

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
        bpy.ops.mesh.dissolve_limited(angle_limit=0.087) # 5%
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
        file_handler.write(indent2 + 'ret.castShadows  = ' + format_bool(self.bjsMesh.castShadows) + ';\n')
        file_handler.write(indent2 + 'ret.skeleton = parent.skeleton;\n\n')
        
        file_handler.write(indent2 + 'ret.color = new _B.Color3(' + format_color(self.baseColor) + ');\n')
        
        file_handler.write(indent2 + 'var strandNumVerts = [' + format_array(self.strandNumVerts, indent2) + '];\n')
        file_handler.write(indent2 + 'var rootRelativePositions = [' + format_array(self.rootRelativePositions, indent2) + '];\n')
        file_handler.write(indent2 + 'ret.assemble(strandNumVerts, rootRelativePositions, ' + format_int(self.longestStrand) + ', ' + format_f(self.stiffness) + ', "' + self.boneName + '");\n')
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

bpy.types.ParticleSettings.dissolveAnlge = bpy.props.FloatProperty(
    name='Dissolve Angle',
    description='Used to do a limited dissolve to remove some vertices',
    default = 1.0,
    min = 0.1,
    max = 1.0
)

bpy.types.ParticleSettings.baseColor = bpy.props.FloatVectorProperty(
    name='Base Color',
    description='Used to generate vertex colors randomly near this.',
    subtype='COLOR',
    default=[0.0,0.0,0.0]
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
        layout.prop(hair, 'baseColor')
        
