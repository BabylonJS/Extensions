from .animation import *
from .logger import *
from .package_level import *

import bpy
#===============================================================================
class FCurveAnimatable:
    def define_animations(self, object, supportsRotation, supportsPosition, supportsScaling, xOffsetForRotation = 0):

        # just because a sub-class can be animatable does not mean it is
        self.animationsPresent = object.animation_data and object.animation_data.action

        if (self.animationsPresent):
            Logger.log('animation processing begun', 2)
            # instance each type of animation support regardless of whether there is any data for it
            if supportsRotation:
                if object.rotation_mode == 'QUATERNION':
                    if object.type == 'CAMERA':
                        # if it's a camera, convert quaternions to euler XYZ
                        rotAnimation = QuaternionToEulerAnimation(object, 'rotation', 'rotation_quaternion', -1, xOffsetForRotation)
                    else:
                        rotAnimation = QuaternionAnimation(object, 'rotationQuaternion', 'rotation_quaternion', 1, xOffsetForRotation)
                else:
                    rotAnimation = VectorAnimation(object, 'rotation', 'rotation_euler', -1, xOffsetForRotation)

            if supportsPosition:
                posAnimation = VectorAnimation(object, 'position', 'location')

            if supportsScaling:
                scaleAnimation = VectorAnimation(object, 'scaling', 'scale')

            self.ranges = []
            frameOffset = 0

            currentAction = object.animation_data.action
            currentFrame = bpy.context.scene.frame_current
            for action in bpy.data.actions:
                # get the range / assigning the action to the object
                animationRange = AnimationRange.actionPrep(object, action, False, frameOffset)
                if animationRange is None:
                    continue

                if supportsRotation:
                    hasData = rotAnimation.append_range(object, animationRange)

                if supportsPosition:
                    hasData |= posAnimation.append_range(object, animationRange)

                if supportsScaling:
                    hasData |= scaleAnimation.append_range(object, animationRange)

                if hasData:
                    Logger.log('processing action ' + animationRange.to_string(), 3)
                    self.ranges.append(animationRange)
                    frameOffset = animationRange.frame_end

            object.animation_data.action = currentAction
            bpy.context.scene.frame_set(currentFrame)
            #Set Animations
            self.animations = []
            if supportsRotation and len(rotAnimation.frames) > 0:
                 self.animations.append(rotAnimation)

            if supportsPosition and len(posAnimation.frames) > 0:
                 self.animations.append(posAnimation)

            if supportsScaling and len(scaleAnimation.frames) > 0:
                 self.animations.append(scaleAnimation)

            if (hasattr(object.data, "autoAnimate") and object.data.autoAnimate):
                self.autoAnimate = True
                self.autoAnimateFrom = bpy.context.scene.frame_end
                self.autoAnimateTo =  0
                for animation in self.animations:
                    if self.autoAnimateFrom > animation.get_first_frame():
                        self.autoAnimateFrom = animation.get_first_frame()
                    if self.autoAnimateTo < animation.get_last_frame():
                        self.autoAnimateTo = animation.get_last_frame()
                self.autoAnimateLoop = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, jsVarName, indent):
        if (self.animationsPresent):
            file_handler.write(indent + 'var animation;\n')
            for animation in self.animations:
                animation.to_script_file(file_handler, indent) # assigns the previously declared js variable 'animation'
                file_handler.write(indent + jsVarName + '.animations.push(animation);\n')

            if (hasattr(self, "autoAnimate") and self.autoAnimate):
                file_handler.write(indent + 'scene.beginAnimation(' + jsVarName + ', ' +
                                             format_int(self.autoAnimateFrom) + ',' +
                                             format_int(self.autoAnimateTo) + ',' +
                                             format_bool(self.autoAnimateLoop) + ', 1.0);\n')

            for range in self.ranges:
                range.to_script_file(file_handler, indent, jsVarName)