from .logger import *
from .package_level import *

import bpy
from mathutils import Color, Vector

#===============================================================================
class Hair():
    def __init__(self, particle_sys, mesh, bjsMesh, exporter):
        self.name = particle_sys.name
        self.legalName = legal_js_identifier(self.name)
        Logger.log('processing begun of particle hair:  ' + self.name)
        
        self.bjsMesh = bjsMesh
        
        # make a child of the emitter in export
        self.parentId = bjsMesh.name
        
        # allow the parent mesh to declare this child correctly in .d.ts file
        self.userSuppliedBaseClass = 'QI.Hair'

        # since materials of mesh have already been processed, just need to assign it here
        bjsMaterial = exporter.getMaterial( particle_sys.settings.material_slot, True)
        if bjsMaterial is not None and hasattr(bjsMaterial, 'diffuse'):
            self.color = bjsMaterial.diffuse
        else:
            self.color = Color((1, 1, 1))
        
        # add a restore point onto the undo stack, before converting to a mesh    
#        bpy.ops.ed.undo_push()
        
        # find the modifier name & temporarily convert it
        for mod in [m for m in mesh.modifiers if m.type == 'PARTICLE_SYSTEM']:
            bpy.ops.object.modifier_convert( modifier = mod.name )
            break
        
        scene = exporter.scene
        # get the new active mesh is the converted hair
        hairMesh = scene.objects.active
        self.nStrands = int(len(hairMesh.data.vertices) / 65)
        roots = []
        
        verts = hairMesh.data.vertices
        for idx, vert in enumerate(hairMesh.data.vertices):
            print('vert: ' + str(idx) + ' location: ' + format_vector(vert.co) )

        for idx, edge in enumerate(hairMesh.data.edges):
            print('edge: ' + str(idx) + ' locations: ' + str(edge.vertices[0]) + ' and ' + str(edge.vertices[1]))

        # get the root vertex of each strand while it is still known what it is
        for idx in range(self.nStrands):
            roots.append(hairMesh.data.vertices[idx * 65].co.copy())
        
        # perform a limited Dissolve
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        #bmesh.ops.dissolve_limit 
        bpy.ops.mesh.dissolve_limited(angle_limit=0.087) # 5%
        bpy.ops.object.mode_set(mode='OBJECT')
        
        self.strandNumVerts = []
        self.rootRelativePositions = []
        longestStrand = -1

        Logger.log('# of Strands: ' + str(self.nStrands) + ', reduced from ' + str(self.nStrands * 65) + ' to ' + str(len(hairMesh.data.vertices)))
        # determine the number of verts per stand after the dissolve & save rootRelative Positions
        strand = 0
        strandStart = -1
        currRoot = nextRoot = roots[strand]
        for idx, vert in enumerate(hairMesh.data.vertices):
            v = vert.co
            if same_vertex(nextRoot, v):
                # write out the stand length unless first strand
                if strandStart != -1:
                    self.strandNumVerts.append(idx - strandStart)
                
                currRoot = nextRoot
                
                # prepare to now start looking for the next strand unless this is the last
                if strand + 1 < self.nStrands:
                    strand += 1
                    nextRoot = roots[strand]
                else:
                    nextRoot = Vector((-1, -1, -1))
                    
                strandStart = idx
                self.rootRelativePositions.append(v.x)
                self.rootRelativePositions.append(v.z)
                self.rootRelativePositions.append(v.y)
            
            else:    
                self.rootRelativePositions.append(v.x - currRoot.x)
                self.rootRelativePositions.append(v.z - currRoot.z)
                self.rootRelativePositions.append(v.y - currRoot.y)
            
        self.strandNumVerts.append(len(hairMesh.data.vertices) - strandStart)
            
#        bpy.ops.ed.undo()
        #bpy.ops.particle.copy_particle_systems()
        
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#    def length(self, deltaX, deltaY : number, deltaZ : number) : number {
#            return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) );
#        }
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
        file_handler.write(indent2 + 'ret.castShadows  = ' + format_bool(self.bjsMesh.castShadows) + ';\n\n')
        
        file_handler.write(indent2 + 'ret.color = new _B.Color3(' + format_color(self.color) + ');\n')
        
        file_handler.write(indent2 + 'var strandNumVerts = [' + format_array(self.strandNumVerts, indent2) + '];\n')
        file_handler.write(indent2 + 'var rootRelativePositions = [' + format_array(self.rootRelativePositions, indent2) + '];\n')
        file_handler.write(indent2 + 'ret.assemble(strandNumVerts, rootRelativePositions);\n')
        file_handler.write(indent2 + 'return ret;\n')
        file_handler.write(indent + '}\n')

