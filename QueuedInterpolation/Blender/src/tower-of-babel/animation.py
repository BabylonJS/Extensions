from .logger import *
from .package_level import *

import bpy

FRAME_BASED_ANIMATION = True # turn off for diagnostics; only actual keyframes will be written for skeleton animation

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONTYPE_FLOAT = 0
ANIMATIONTYPE_VECTOR3 = 1
ANIMATIONTYPE_QUATERNION = 2
ANIMATIONTYPE_MATRIX = 3
#ANIMATIONTYPE_COLOR3 = 4

# passed to Animation constructor from animatable objects, defined in BABYLON.Animation
#ANIMATIONLOOPMODE_RELATIVE = 0
ANIMATIONLOOPMODE_CYCLE = 1
#ANIMATIONLOOPMODE_CONSTANT = 2
#===============================================================================
class AnimationRange:
    # constructor called by the static actionPrep method
    def __init__(self, name, frames, frameOffset):
        # process input args to members
        self.name = name
        self.frames_in = frames
        self.frame_start = AnimationRange.nextStartingFrame(frameOffset)

        self.frames_out = []
        for frame in self.frames_in:
            self.frames_out.append(self.frame_start + frame)

        highest_idx = len(self.frames_in) - 1
        self.highest_frame_in = self.frames_in [highest_idx]
        self.frame_end        = self.frames_out[highest_idx]
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_string(self):
        return self.name + ': ' + ' in[' + format_int(self.frames_in[0]) + ' - ' + format_int(self.highest_frame_in) + '], out[' + format_int(self.frame_start) + ' - ' + format_int(self.frame_end) + ']'
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent, var):
        file_handler.write(indent + var + '.createAnimationRange("' + self.name + '", ' + format_int(self.frame_start) + ', ' + format_int(self.frame_end) + ');\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def actionPrep(object, action, includeAllFrames, frameOffset):
        # when name in format of object-action, verify object's name matches
        if action.name.find('-') > 0:
            split = action.name.partition('-')
            if split[0] != object.name: return None
            actionName = split[2]
        else:
            actionName = action.name

        # assign the action to the object
        object.animation_data.action = action

        if includeAllFrames:
            frame_start = int(action.frame_range[0])
            frame_end   = int(action.frame_range[1])
            frames = range(frame_start, frame_end + 1) # range is not inclusive with 2nd arg

        else:
            # capture built up from fcurves
            frames = dict()
            for fcurve in object.animation_data.action.fcurves:
                for key in fcurve.keyframe_points:
                    frame = key.co.x
                    frames[frame] = True

            frames = sorted(frames)

        return AnimationRange(actionName, frames, frameOffset)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def nextStartingFrame(frameOffset):
        if frameOffset == 0: return 0

        # ensure a gap of at least 5 frames, starting on an even multiple of 10
        frameOffset += 4
        remainder = frameOffset % 10
        return frameOffset + 10 - remainder

#===============================================================================
class Animation:
    def __init__(self, dataType, loopBehavior, name, propertyInBabylon, attrInBlender = None, mult = 1, xOffset = 0):
        self.dataType = dataType
        self.framePerSecond = bpy.context.scene.render.fps
        self.loopBehavior = loopBehavior
        self.name = name
        self.propertyInBabylon = propertyInBabylon

        # these never get used by Bones, so optional in contructor args
        self.attrInBlender = attrInBlender
        self.mult = mult
        self.xOffset = xOffset

        #keys
        self.frames = []
        self.values = [] # vector3 for ANIMATIONTYPE_VECTOR3 & matrices for ANIMATIONTYPE_MATRIX
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # a separate method outside of constructor, so can be called once for each Blender Action object participates in
    def append_range(self, object, animationRange):
        # action already assigned, always using poses, not every frame, build up again filtering by attrInBlender
        for idx in range(len(animationRange.frames_in)):
            bpy.context.scene.frame_set(animationRange.frames_in[idx])

            self.frames.append(animationRange.frames_out[idx])
            self.values.append(self.get_attr(object))

        return len(animationRange.frames_in) > 0
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # for auto animate
    def get_first_frame(self):
        return self.frames[0] if len(self.frames) > 0 else -1
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # for auto animate
    def get_last_frame(self):
        return self.frames[len(self.frames) - 1] if len(self.frames) > 0 else -1
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assigns the var 'animation', which the caller has already defined
    # .babylon writes 'values', but the babylonFileLoader reads it, changing it to 'value'
    def to_script_file(self, file_handler, indent):
        file_handler.write(indent + 'animation = new _B.Animation("' + self.name + '", "' +
                                                                             self.propertyInBabylon + '", ' +
                                                                             format_int(self.framePerSecond) + ', ' +
                                                                             format_int(self.dataType) + ', ' +
                                                                             format_int(self.loopBehavior) + ');\n')
        file_handler.write(indent + 'animation.setKeys([\n')
        nFrames = len(self.frames)
        for frame_idx in range(nFrames):
            file_handler.write(indent + '{frame: ' + format_int(self.frames[frame_idx]) + ', value: ')
            value_idx = self.values[frame_idx]
            if self.dataType == ANIMATIONTYPE_MATRIX:
                file_handler.write('_M(' + format_matrix4(value_idx) + ')}')
            elif self.dataType == ANIMATIONTYPE_QUATERNION:
               file_handler.write('new _B.Quaternion(' + format_quaternion(value_idx) + ')}')
            else:
                file_handler.write('new _B.Vector3(' + format_vector(value_idx) + ')}')

            if frame_idx + 1 < nFrames:
                file_handler.write(',')
            file_handler.write('\n')

        file_handler.write(indent + ']);\n')
#===============================================================================
class VectorAnimation(Animation):
    def __init__(self, object, propertyInBabylon, attrInBlender, mult = 1, xOffset = 0):
        super().__init__(ANIMATIONTYPE_VECTOR3, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon, attrInBlender, mult, xOffset)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def get_attr(self, object):
        return scale_vector(getattr(object, self.attrInBlender), self.mult, self.xOffset)
#===============================================================================
class QuaternionAnimation(Animation):
    def __init__(self, object, propertyInBabylon, attrInBlender, mult = 1, xOffset = 0):
        super().__init__(ANIMATIONTYPE_QUATERNION, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon, attrInBlender, mult, xOffset)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def get_attr(self, object):
        return post_rotate_quaternion(getattr(object, self.attrInBlender), self.xOffset)
#===============================================================================
class QuaternionToEulerAnimation(Animation):
    def __init__(self, propertyInBabylon, attrInBlender, mult = 1, xOffset = 0):
        super().__init__(ANIMATIONTYPE_VECTOR3, ANIMATIONLOOPMODE_CYCLE, propertyInBabylon + ' animation', propertyInBabylon, attrInBlender, mult, Offset)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def get_attr(self, object):
        quat = getattr(object, self.attrInBlender)
        eul  = quat.to_euler("XYZ")
        return scale_vector(eul, self.mult, self.xOffset)