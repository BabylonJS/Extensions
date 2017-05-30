from .logger import *
from .package_level import *

from .f_curve_animatable import *

import bpy
import math
import mathutils

# camera class names, never formally defined in Babylon, but used in babylonFileLoader
ARC_ROTATE_CAM = 'ArcRotateCamera'
DEV_ORIENT_CAM = 'DeviceOrientationCamera'
FOLLOW_CAM = 'FollowCamera'
UNIVERSAL_CAM = 'UniversalCamera'
GAMEPAD_CAM = 'GamepadCamera'
TOUCH_CAM = 'TouchCamera'
V_JOYSTICKS_CAM = 'VirtualJoysticksCamera'
VR_DEV_ORIENT_FREE_CAM ='VRDeviceOrientationFreeCamera'
WEB_VR_FREE_CAM = 'WebVRFreeCamera'

# 3D camera rigs, defined in BABYLON.Camera, must be strings to be in 'dropdown'
RIG_MODE_NONE = '0'
RIG_MODE_STEREOSCOPIC_ANAGLYPH = '10'
RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL = '11'
RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED = '12'
RIG_MODE_STEREOSCOPIC_OVERUNDER = '13'
RIG_MODE_VR = '20'
#===============================================================================
class Camera(FCurveAnimatable):
    def __init__(self, camera):
        if camera.parent and camera.parent.type != 'ARMATURE':
            self.parentId = camera.parent.name

        self.CameraType = camera.data.CameraType
        self.name = camera.name
        Logger.log('processing begun of camera (' + self.CameraType + '):  ' + self.name)
        self.define_animations(camera, True, True, False, math.pi / 2)
        self.position = camera.location

        # for quaternions, convert to euler XYZ, otherwise, use the default rotation_euler
        eul = camera.rotation_quaternion.to_euler("XYZ") if camera.rotation_mode == 'QUATERNION' else camera.rotation_euler
        self.rotation = mathutils.Vector((-eul[0] + math.pi / 2, eul[1], -eul[2]))

        self.fov = camera.data.angle
        self.minZ = camera.data.clip_start
        self.maxZ = camera.data.clip_end
        self.speed = 1.0
        self.inertia = 0.9
        self.checkCollisions = camera.data.checkCollisions
        self.applyGravity = camera.data.applyGravity
        self.ellipsoid = camera.data.ellipsoid
        self.trackToBoundingCenter = camera.data.trackToBoundingCenter

        self.Camera3DRig = camera.data.Camera3DRig
        self.interaxialDistance = camera.data.interaxialDistance

        for constraint in camera.constraints:
            if constraint.type == 'TRACK_TO':
                self.lockedTargetId = constraint.target.name
                break


        if self.CameraType == ARC_ROTATE_CAM or self.CameraType == FOLLOW_CAM:
            if not hasattr(self, 'lockedTargetId'):
                Logger.warn('Camera type with mandatory target specified, but no target to track set.  Ignored', 2)
                self.fatalProblem = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def update_for_target_attributes(self, meshesAndNodes):
        if not hasattr(self, 'lockedTargetId'): return

        # find the actual mesh tracking, so properties can be derrived
        targetFound = False
        for mesh in meshesAndNodes:
            if mesh.name == self.lockedTargetId:
                targetMesh = mesh
                targetFound = True
                break;

        xApart = 3 if not targetFound else self.position.x - targetMesh.position.x
        yApart = 3 if not targetFound else self.position.y - targetMesh.position.y
        zApart = 3 if not targetFound else self.position.z - targetMesh.position.z

        distance3D = math.sqrt(xApart * xApart + yApart * yApart + zApart * zApart)

        alpha = math.atan2(yApart, xApart);
        beta  = math.atan2(yApart, zApart);

        if self.CameraType == FOLLOW_CAM:
            self.followHeight   =  zApart
            self.followDistance = distance3D
            self.followRotation =  90 + (alpha * 180 / math.pi)

        elif self.CameraType == self.CameraType == ARC_ROTATE_CAM:
            self.arcRotAlpha  = alpha
            self.arcRotBeta   = abs(beta)
            self.arcRotRadius = distance3D
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        # constructor args are not the same for each camera type
        file_handler.write(indent + 'camera = new _B.' + self.CameraType + '("' + self.name + '"')
        if self.CameraType == ARC_ROTATE_CAM:
            target = 'null' if self.trackToBoundingCenter else 'scene.getMeshByID("' + self.lockedTargetId + '")'
            
            file_handler.write(', ' + format_f(self.arcRotAlpha) + ', ' + format_f(self.arcRotBeta) + ', ' + format_f(self.arcRotRadius) + ', ' + target + ', scene);\n')
            if self.trackToBoundingCenter:
                file_handler.write(indent + 'camera.setTarget(scene.getMeshByID("' + self.lockedTargetId + '"), true);\n')
 
        else:
            file_handler.write(', new _B.Vector3(' + format_vector(self.position) + '), scene);\n')
            file_handler.write(indent + 'if (positionOffset) camera.position.addInPlace(positionOffset);\n')
 
        # always assign rig, even when none, Reason:  Could have VR camera with different Rig than default
        file_handler.write(indent + 'camera.setCameraRigMode(' + self.Camera3DRig + ',{interaxialDistance: ' + format_f(self.interaxialDistance) + '});\n')

        file_handler.write(indent + 'camera.rotation = new _B.Vector3(' + format_vector(self.rotation) + ');\n')

        file_handler.write(indent + 'camera.fov = ' + format_f(self.fov) + ';\n')
        file_handler.write(indent + 'camera.minZ = ' + format_f(self.minZ) + ';\n')
        file_handler.write(indent + 'camera.maxZ = ' + format_f(self.maxZ) + ';\n')

        file_handler.write(indent + 'camera.speed = ' + format_f(self.speed) + ';\n')
        file_handler.write(indent + 'camera.inertia = ' + format(self.inertia) + ';\n')

        file_handler.write(indent + 'camera.checkCollisions = ' + format_bool(self.checkCollisions) + ';\n')
        file_handler.write(indent + 'camera.applyGravity = ' + format_bool(self.applyGravity) + ';\n')
        file_handler.write(indent + 'camera.ellipsoid = new _B.Vector3(' + format_array3(self.ellipsoid) + ');\n')

        if self.CameraType == FOLLOW_CAM:
            file_handler.write(indent + 'camera.heightOffset = ' + format_f(self.followHeight) + ';\n')
            file_handler.write(indent + 'camera.radius = ' + format_f(self.followDistance) + ';\n')
            file_handler.write(indent + 'camera.rotationOffset = ' + format_f(self.followRotation) + ';\n')

        if hasattr(self, 'lockedTargetId') and (self.CameraType == FOLLOW_CAM or self.CameraType == UNIVERSAL_CAM):
            file_handler.write(indent + 'camera.lockedTarget = scene.getMeshByID("' + self.lockedTargetId + '");\n')

        if hasattr(self, 'parentId'):
            file_handler.write(indent + 'camera.parent = scene.getLastEntryByID("' + self.parentId + '");\n')

        super().to_script_file(file_handler, 'camera', indent) # Animations
#===============================================================================
bpy.types.Camera.autoAnimate = bpy.props.BoolProperty(
    name='Auto launch animations',
    description='',
    default = False
)
bpy.types.Camera.CameraType = bpy.props.EnumProperty(
    name='Camera Type',
    description='',
    # ONLY Append, or existing .blends will have their camera changed
    items = (
             (V_JOYSTICKS_CAM        , 'Virtual Joysticks'       , 'Use Virtual Joysticks Camera'),
             (TOUCH_CAM              , 'Touch'                   , 'Use Touch Camera'),
             (GAMEPAD_CAM            , 'Gamepad'                 , 'Use Gamepad Camera'),
             (UNIVERSAL_CAM          , 'Universal'               , 'Use Universal Camera'),
             (FOLLOW_CAM             , 'Follow'                  , 'Use Follow Camera'),
             (DEV_ORIENT_CAM         , 'Device Orientation'      , 'Use Device Orientation Camera'),
             (ARC_ROTATE_CAM         , 'Arc Rotate'              , 'Use Arc Rotate Camera'),
             (VR_DEV_ORIENT_FREE_CAM , 'VR Dev Orientation Free' , 'Use VR Dev Orientation Free Camera'),
             (WEB_VR_FREE_CAM        , 'Web VR Free'             , 'Use Web VR Free Camera')
            ),
    default = UNIVERSAL_CAM
)
bpy.types.Camera.checkCollisions = bpy.props.BoolProperty(
    name='Check Collisions',
    description='',
    default = False
)
bpy.types.Camera.trackToBoundingCenter = bpy.props.BoolProperty(
    name='Track to Bounding Center',
    description='Arc rotate cam only,\nuseful when mesh is defined with "feet on the ground"',
    default = False
)
bpy.types.Camera.applyGravity = bpy.props.BoolProperty(
    name='Apply Gravity',
    description='',
    default = False
)
bpy.types.Camera.ellipsoid = bpy.props.FloatVectorProperty(
    name='Ellipsoid',
    description='',
    default = mathutils.Vector((0.2, 0.9, 0.2))
)
bpy.types.Camera.Camera3DRig = bpy.props.EnumProperty(
    name='Rig',
    description='',
    items = (
             (RIG_MODE_NONE                             , 'None'                  , 'No 3D effects'),
             (RIG_MODE_STEREOSCOPIC_ANAGLYPH            , 'Anaglyph'              , 'Stereoscopic Anagylph'),
             (RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL , 'side-by-side Parallel' , 'Stereoscopic side-by-side parallel'),
             (RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED, 'side-by-side crosseyed', 'Stereoscopic side-by-side crosseyed'),
             (RIG_MODE_STEREOSCOPIC_OVERUNDER           , 'over-under'            , 'Stereoscopic over-under'),
             (RIG_MODE_VR                               , 'VR distortion'         , 'Use Web VR Free Camera')
            ),
    default = RIG_MODE_NONE
)
bpy.types.Camera.interaxialDistance = bpy.props.FloatProperty(
    name='Interaxial Distance',
    description='Distance between cameras.  Used by all but VR 3D rigs.',
    default = 0.0637
)
#===============================================================================
class CameraPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'data'

    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob is not None and isinstance(ob.data, bpy.types.Camera)

    def draw(self, context):
        ob = context.object
        layout = self.layout
        layout.prop(ob.data, 'CameraType')
        layout.prop(ob.data, 'checkCollisions')
        layout.prop(ob.data, 'applyGravity')
        layout.prop(ob.data, 'ellipsoid')

        row = layout.row()
        row.enabled = ob.data.CameraType == ARC_ROTATE_CAM
        row.prop(ob.data, 'trackToBoundingCenter')
        
        box = layout.box()
        box.label(text="3D Camera Rigs")
        box.prop(ob.data, 'Camera3DRig')
        box.prop(ob.data, 'interaxialDistance')

        layout.prop(ob.data, 'autoAnimate')
