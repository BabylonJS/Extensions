from .animation import *
from .logger import *
from .package_level import *

import bpy
from math import radians
from mathutils import Vector, Matrix

DEFAULT_LIB_NAME = 'Same as filename'
#===============================================================================
class Bone:
    def __init__(self, bpyBone, bpySkeleton, bonesSoFar, skipLogging = False):
        self.index = len(bonesSoFar)
        if not skipLogging:
            Logger.log('processing begun of bone:  ' + bpyBone.name + ', index:  '+ str(self.index), 2)
        self.name = bpyBone.name
        self.length = bpyBone.length
        self.posedBone = bpyBone # record so can be used by get_matrix, called by append_animation_pose
        self.parentBone = bpyBone.parent

        self.matrix_world = bpySkeleton.matrix_world
        self.matrix = self.get_bone_matrix()

        self.parentBoneIndex = Skeleton.get_bone(bpyBone.parent.name, bonesSoFar).index if bpyBone.parent else -1

        #animation
        if (bpySkeleton.animation_data):
            self.animation = Animation(ANIMATIONTYPE_MATRIX, ANIMATIONLOOPMODE_CYCLE, 'anim', '_matrix')
            self.previousBoneMatrix = None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def append_animation_pose(self, frame, force = False):
        currentBoneMatrix = self.get_bone_matrix()

        if (force or not same_matrix4(currentBoneMatrix, self.previousBoneMatrix)):
            self.animation.frames.append(frame)
            self.animation.values.append(currentBoneMatrix)
            self.previousBoneMatrix = currentBoneMatrix
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def set_rest_pose(self, editBone):
        self.rest = Bone.get_matrix(editBone, self.matrix_world, True)
        # used to calc skeleton restDimensions
        self.restHead = editBone.head
        self.restTail = editBone.tail
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def get_bone_matrix(self, doParentMult = True):
        return Bone.get_matrix(self.posedBone, self.matrix_world, doParentMult)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def get_matrix(bpyBone, matrix_world, doParentMult):
        SystemMatrix = Matrix.Scale(-1, 4, Vector((0, 0, 1))) * Matrix.Rotation(radians(-90), 4, 'X')

        if (bpyBone.parent and doParentMult):
            return (SystemMatrix * matrix_world * bpyBone.parent.matrix).inverted() * (SystemMatrix * matrix_world * bpyBone.matrix)
        else:
            return SystemMatrix * matrix_world * bpyBone.matrix
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume the following JS variables have already been declared: skeleton, bone, animation
    def to_script_file(self, file_handler, indent):
        parentBone = 'skeleton.bones[' + format_int(self.parentBoneIndex) + ']' if self.parentBone else 'null'

        file_handler.write(indent + 'bone = new QI.Bone("' + self.name + '", skeleton,' + parentBone + ', _M(' + format_matrix4(self.matrix) + ')' + ', _M(' + format_matrix4(self.rest) + '));\n')
        file_handler.write(indent + 'bone.length = ' + format_f(self.length) + ';\n')

        if hasattr(self, 'animation'):
            self.animation.to_script_file(file_handler, indent) # declares and set the variable animation
            file_handler.write(indent + 'bone.animations.push(animation);\n\n')
#===============================================================================
class Skeleton:
    # skipAnimations argument only used when exporting QI.SkeletonPoseLibrary
    def __init__(self, bpySkeleton, scene, id, ignoreIKBones, skipAnimations = False):
        if not skipAnimations:
            Logger.log('processing begun of skeleton:  ' + bpySkeleton.name + ', id:  '+ str(id))
        self.name = bpySkeleton.name
        self.id = id
        self.bones = []

        # Tower of Babel specific members
        self.functionName = 'skel_' + legal_js_identifier(self.name)
            
        if bpySkeleton.data.LibraryWithScene:
            self.libraryName = bpySkeleton.data.libraryName
            self.bpySkeleton = bpySkeleton # needed for call to build library

        for bone in bpySkeleton.pose.bones:
            if ignoreIKBones and Skeleton.isIkName(bone.name):
                if not skipAnimations: Logger.log('Ignoring IK bone:  ' + bone.name, 2)
                continue

            self.bones.append(Bone(bone, bpySkeleton, self.bones, skipAnimations))

        if (bpySkeleton.animation_data and not skipAnimations):
            self.ranges = []
            frameOffset = 0
            for action in bpy.data.actions:
                # get the range / assigning the action to the object
                animationRange = AnimationRange.actionPrep(bpySkeleton, action, FRAME_BASED_ANIMATION, frameOffset)
                if animationRange is None:
                    continue

                Logger.log('processing action ' + animationRange.to_string(), 2)
                self.ranges.append(animationRange)

                nFrames = len(animationRange.frames_in)
                for idx in range(nFrames):
                    bpy.context.scene.frame_set(animationRange.frames_in[idx])
                    firstOrLast = idx == 0 or idx == nFrames - 1

                    for bone in self.bones:
                        bone.append_animation_pose(animationRange.frames_out[idx], firstOrLast)

                frameOffset = animationRange.frame_end

        # mode_set's only work when there is an active object, switch bones to edit mode to rest position
        scene.objects.active = bpySkeleton
        bpy.ops.object.mode_set(mode='EDIT')

        # you need to access edit_bones from skeleton.data not skeleton.pose when in edit mode
        for editBone in bpySkeleton.data.edit_bones:
            for myBoneObj in self.bones:
                if editBone.name == myBoneObj.name:
                    myBoneObj.set_rest_pose(editBone)
                    break

        self.dimensions = self.getDimensions()

        bpy.ops.object.mode_set(mode='OBJECT')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # do not use .dimensions from blender, it might be including IK bones
    def getDimensions(self):
        highest = Vector((-10000, -10000, -10000))
        lowest  = Vector(( 10000,  10000,  10000))

        for bone in self.bones:
            if highest.x < bone.restHead.x: highest.x = bone.restHead.x
            if highest.y < bone.restHead.y: highest.y = bone.restHead.y
            if highest.z < bone.restHead.z: highest.z = bone.restHead.z

            if highest.x < bone.restTail.x: highest.x = bone.restTail.x
            if highest.y < bone.restTail.y: highest.y = bone.restTail.y
            if highest.z < bone.restTail.z: highest.z = bone.restTail.z

            if lowest .x > bone.restHead.x: lowest .x = bone.restHead.x
            if lowest .y > bone.restHead.y: lowest .y = bone.restHead.y
            if lowest .z > bone.restHead.z: lowest .z = bone.restHead.z

            if lowest .x > bone.restTail.x: lowest .x = bone.restTail.x
            if lowest .y > bone.restTail.y: lowest .y = bone.restTail.y
            if lowest .z > bone.restTail.z: lowest .z = bone.restTail.z

        return Vector((highest.x - lowest.x, highest.y - lowest.y, highest.z - lowest.z))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # used in PoseLibExporter; assume skeletion is the active object
    def getPose(self, idx):
        # ensure pose mode, select all bones, clear tranforms, apply pose
        bpy.ops.object.mode_set(mode='POSE')
        bpy.ops.pose.select_all(action='SELECT')
        bpy.ops.pose.transforms_clear()
        bpy.ops.poselib.apply_pose(pose_index = idx)

        ret = []
        for bone in self.bones:
            ret.append([bone.name, bone.get_bone_matrix()])

        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # used in PoseLibExporter
    def getRestAsPose(self):
        # ensure pose mode, select all bones, clear tranforms, apply pose
        bpy.ops.object.mode_set(mode='POSE')
        bpy.ops.pose.select_all(action='SELECT')
        bpy.ops.pose.transforms_clear()

        ret = []
        for bone in self.bones:
            ret.append([bone.name, bone.get_bone_matrix()])

        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # used in PoseLibExporter
    def getBoneLengths(self):
        ret = []
        for bone in self.bones:
            ret.append([bone.name, bone.length])

        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def isIkName(boneName):
        return '.ik' in boneName.lower() or 'ik.' in boneName.lower()
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # Since IK bones could be being skipped, looking up index of bone in second pass of mesh required
    def get_index_of_bone(self, boneName):
        return Skeleton.get_bone(boneName, self.bones).index

    @staticmethod
    def get_bone(boneName, bones):
        for bone in bones:
            if boneName == bone.name:
                return bone

        # should not happen, but if it does clearly a bug, so terminate
        raise Exception('bone name "' + boneName + '" not found in skeleton')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume the following JS variables have already been declared: scene, skeleton, bone, animation
    def to_script_file(self, file_handler, indent, logInBrowserConsole):
        indent1 = indent + '    '
        # specifying scene gets skeleton added to scene in constructor        
        file_handler.write('\n' + indent + 'function ' + self.functionName + '(name, scene){\n')
        if logInBrowserConsole: file_handler.write(indent1 + "_B.Tools.Log('defining skeleton:  " + self.name + "');\n")
        file_handler.write(indent1 + 'var bone;\n')
        file_handler.write(indent1 + 'var animation;\n\n')
        file_handler.write(indent1 + 'var skeleton = new QI.Skeleton(name, "' + format_int(self.id) + '", scene);\n') # MUST be String for inline
        file_handler.write(indent1 + 'skeleton.dimensionsAtRest = new _V(' + format_vector(self.dimensions) + ');\n')
        
        for bone in self.bones:
            bone.to_script_file(file_handler, indent1)

        if hasattr(self, 'libraryName'):
            file_handler.write(indent1 +'skeleton.assignPoseLibrary("' + self.libraryName + '");\n')

        if hasattr(self, 'ranges'):
            for range in self.ranges:
                range.to_script_file(file_handler, indent1, 'skeleton')
                
        file_handler.write(indent1 +'return skeleton;\n')
        file_handler.write(indent +'}\n')

#===============================================================================
# determine all the meshes which are controlled by skeleton, called also by pose_lib
def getMeshesForRig(scene, skeleton, prepForShapekeys = False):
    meshes = []
    for object in [object for object in scene.objects]:
        if object.type == 'MESH' and len(object.vertex_groups) > 0 and skeleton == object.find_armature():
            meshes.append(object)
            print('meshes with armature: ' + object.name)
            # ensure that there is a Basis key
            if prepForShapekeys and not object.data.shape_keys:
                object.shape_key_add('Basis')

    return meshes
#===============================================================================
bpy.types.Armature.libraryName = bpy.props.StringProperty(
    name='Library name',
    description='Allow the same library in JS to be multiple Blender libraries.',
    default = DEFAULT_LIB_NAME
)
bpy.types.Armature.allSkelLibraries = bpy.props.BoolProperty(
    name='Include all Blender Pose Libraries',
    description='',
    default = True
)
bpy.types.Armature.LibraryWithScene = bpy.props.BoolProperty(
    name='Include with scene export',
    description='',
    default = False
)
bpy.types.Armature.shapeKeyName = bpy.props.StringProperty(
    name='As Key',
    description='Name of the key to use in meshes controlled',
    default = 'key'
)
#===============================================================================
class SkeletonPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'data'

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob is not None and isinstance(ob.data, bpy.types.Armature)

    def draw(self, context):
        ob = context.object
        layout = self.layout
        box1 = layout.box()
        box1.label(text='Export to QI Pose Library:')
        box1.prop(ob.data, 'libraryName')
        box1.prop(ob.data, 'allSkelLibraries')
        box1.prop(ob.data, 'LibraryWithScene')
        box1.operator('tob.exportposes')

        box2 = layout.box()
        box2.label(text='Shape Keys:')

        box2.operator('tob.poselibtoshapekeys')
        inner_box = box2.box()
        inner_box.label(text='Current pose as a shape key')
        inner_box.prop(ob.data, 'shapeKeyName')
        inner_box.operator('tob.posetoshapekey')

