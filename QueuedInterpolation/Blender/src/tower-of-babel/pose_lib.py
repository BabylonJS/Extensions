from .animation import *
from .armature import *
from .logger import *
from .package_level import *
from .shape_key_archive import deleteShape

import bpy
from math import radians
from mathutils import Vector, Matrix
from io import open

#===============================================================================
class PoseLibExporter:
    def execute(self, context, filepath, bpySkeleton):
        self.filepathMinusExtension = filepath.rpartition('.')[0]
        nameSpace = getNameSpace(self.filepathMinusExtension)
        print('doing ' + bpySkeleton.name)

        file_handler = open(self.filepathMinusExtension + '.js', 'w', encoding = 'utf8')
        write_js_module_header(file_handler, nameSpace)

        self.perform(context.scene, file_handler, bpySkeleton)

        # Module closing - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        file_handler.write('})(' + nameSpace + ' || ('  + nameSpace + ' = {}));')
        file_handler.close()

        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# broken out so libraries can be in-lined to a scene export
    def perform(self, scene, file_handler, bpySkeleton):
        self.bpySkeleton = bpySkeleton
        roots = self.getRootBones()
        if len(roots) > 1:
            return 'Skeletons with more than 1 root bone not supported'

        indent = '    '
        self.bjsSkeleton = Skeleton(self.bpySkeleton, scene, 'id', True, True)
        dimensions = self.bjsSkeleton.dimensions
        lengths = self.bjsSkeleton.getBoneLengths()

        file_handler.write(indent + 'var boneLengths = {\n' + indent + indent)
        first = True
        for bone in lengths:
            if first == False:
                file_handler.write(',')
            file_handler.write('' + bone[0] + ':' + format_f(bone[1]))
            first = False

        file_handler.write('\n' + indent + '};\n\n')

        libraryName = self.bpySkeleton.data.libraryName
        if libraryName == DEFAULT_LIB_NAME or len(libraryName) == 0:
            libraryName = nameSpace

        file_handler.write(indent + 'var lib = QI.SkeletonPoseLibrary.createLibrary("' + libraryName + '",  new _V('+ format_vector(dimensions) + '), "'  + roots[0].name + '", boneLengths);\n')

        self.basis = self.bjsSkeleton.getRestAsPose()
        self.recordPose(file_handler, 'basis', indent, self.basis)

        if self.bpySkeleton.data.allSkelLibraries:
            #skeleton libraries are just special actions
            for action in bpy.data.actions:
                print("library " + action.name)
                self.bpySkeleton.pose_library = action

                # action might still not be a pose library, but run it through; will not pick up anything is regular action
                self.doCurrentLibrary(file_handler, indent)
        else:
            self.doCurrentLibrary(file_handler, indent)

        # clear all transform of all bones, so last pose does not remain
        bpy.ops.pose.select_all(action = 'SELECT')
        bpy.ops.pose.transforms_clear()
        
        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def doCurrentLibrary(self, file_handler, indent):
        for idx, pose_marker in enumerate(self.bpySkeleton.pose_library.pose_markers):
            self.recordPose(file_handler, pose_marker.name, indent, self.bjsSkeleton.getPose(idx))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def recordPose(self, file_handler, name, indent, pose):
        indent1 = indent + '    '
        file_handler.write(indent + 'new QI.Pose("'+ name + '", lib')

        file_handler.write(', {')
        first = True

        # write BoneName: new QI.MatrixComp(new Q(1,2,3,4), new V(1,2,3)), add scale arg when necessary

        for boneIdx, bone in enumerate(pose):
            # only write non-basis bone when different from basis to support sub-poses
            if name != 'basis' and same_matrix4(bone[1], self.basis[boneIdx][1]):
                continue

            if first == False:
                file_handler.write(',')
            file_handler.write('\n' + indent1 + '' + bone[0] + ': _M(' + format_matrix4(bone[1]) + ')')
#            loc, rot, scale = bone[1].decompose()

#            file_handler.write('\n' + indent1 + '' + bone[0] + ': new QI.MatrixComp(')
#            file_handler.write('new Q(' + format_quaternion(rot) + ')')
#            file_handler.write(',new V(' + format_vector(loc) + ')')
#            if self.needScale(scale):
#                file_handler.write(',new V(' + format_vector(scale) + ')')
#            file_handler.write(')')
            first = False

        file_handler.write('\n'+ indent + '});\n\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#    def needScale(self, scale):
#        return (abs(1 - scale.x) > 0.0001 or
#                abs(1 - scale.y) > 0.0001 or
#                abs(1 - scale.z) > 0.0001)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def getRootBones(self):
        roots = []
        for bone in self.bpySkeleton.data.bones:
            if bone.parent is None:
                roots.append(bone)
        return roots
#===============================================================================
# convert each element in pose Library
def poseLibToShapeKeys(operator, scene, skeleton, shapeKeyName = None):
    #selectedBones = getSelectedBones(skeleton)       

    # clear all transform of all bones, to avoid strays when a vertex shares has vertex group of un-selected bone with a selected bone
    bpy.ops.object.mode_set(mode = 'POSE')
    bpy.ops.pose.select_all(action = 'SELECT')
    bpy.ops.pose.transforms_clear()
    
    # better results still occur when posing all the bones, so comment this out
    #setSelectedBones(skeleton, selectedBones)
    selectedBones = getAllBones(skeleton)
    operator.report({'INFO'}, 'Taking into account ' + str(len(selectedBones)) + ' bones')
    
    # get the list meshes this rig controls (creates basis key if missing)
    meshes = getMeshesForRig(scene, skeleton, True)
    
    # much easier to get vertex stats sorted by mesh; initialize
    meshStats = []
    for i in range(len(meshes)):
        meshStats.append([])
    
    # process each of the poses
    if shapeKeyName is None:
        for idx in range(len(skeleton.pose_library.pose_markers)):
            name = skeleton.pose_library.pose_markers[idx].name
            bpy.ops.poselib.apply_pose(pose_index = idx)
            applyPose(scene, meshes, name, selectedBones, meshStats)
    else:
        applyPose(scene, meshes, shapeKeyName, selectedBones, meshStats)
         
    # clear all transform of all bones, so last pose does not remain
    bpy.ops.pose.select_all(action = 'SELECT')
    bpy.ops.pose.transforms_clear()
    
    # create report in shape within mesh order
    for m, mesh in enumerate(meshes):
        operator.report({'INFO'}, 'Total Vertices for ' + mesh.name + ':  ' + str(len(mesh.data.vertices)))
        stats = meshStats[m]
        
        if shapeKeyName is None:
            for idx in range(len(skeleton.pose_library.pose_markers)):
                operator.report({'INFO'}, '     ' + skeleton.pose_library.pose_markers[idx].name + ':  ' + str(stats[idx]))
        else:
            operator.report({'INFO'}, '     ' + shapeKeyName + ':  ' + str(stats[0]))            
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# This is opposed to:
#    bpy.ops.object.modifier_apply(apply_as='SHAPE', modifier='ARMATURE')
# which removes modifier, so only one pose can be done
def applyPose(scene, meshes, name, selectedBones, meshStats):
    for m, mesh in enumerate(meshes):
        stats = meshStats[m]
        
        # delete if key already exists
        deleteShape(mesh, name)

        # add an empty key (create a basis when none)
        key = mesh.shape_key_add(name, False)
        key.value = 0 # keep un-applied

        # get basis, so can write only verts different than
        basis = mesh.data.shape_keys.key_blocks['Basis']

        # get temporary version with modifiers applies
        tmp = mesh.to_mesh(scene, True, 'PREVIEW')

        # assign the key the vert values of the current pose, when different than Basis
        nDiff = 0
        for v in tmp.vertices:
            # first pass; exclude verts not influenced by the Bones selected
            if not isVertexInfluenced(mesh.vertex_groups, v, selectedBones) : continue
            
            value   = v.co
            baseval = basis.data[v.index].co
            if not similar_vertex(value, baseval, 0.00025):
                key.data[v.index].co = value
                nDiff += 1

        stats.append(nDiff)

        # when no verts different, delete key for this mesh
        if nDiff == 0:
            mesh.shape_key_remove(key)

        # remove temp mesh
        bpy.data.meshes.remove(tmp)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# This also returns hidden bones, critical for finger shape keys
def getAllBones(skeleton):
    vGroupNames = []
    for bone in skeleton.data.bones:
        vGroupNames.append(bone.name)
        
    return vGroupNames
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# not in use
def getSelectedBones(skeleton):
    vGroupNames = []
    for bone in skeleton.data.bones:
        if bone.select:
            vGroupNames.append(bone.name)

    return vGroupNames
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# not in use
def setSelectedBones(skeleton, selectedBones):
    bpy.ops.pose.select_all(action = 'DESELECT')
    for bone in skeleton.data.bones:
        for boneName in selectedBones:  
           if bone.name == boneName:
               bone.select = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def isVertexInfluenced(mesh_vertex_groups, vertex, selectedBones):
    for group in vertex.groups:
        for bone in selectedBones:
            if mesh_vertex_groups[group.group].name == bone:
                return True
