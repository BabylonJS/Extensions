# BEING Automaton Module#
The BEING module is built into and based upon the QueuedInterpolation extension.  An automaton is one whose base class is `BEING.Body`.  Any other meshes associated, e.g. hair, clothes, shoes, should be child meshes.  The `Body` class coordinates a number of separate independent functions:
- Facial expressions
- Blinking, both actively directed, and involuntary
- Winking
- Eye Movement
- Speech (development tools not publicly released)

The mesh that constitutes the `Body`, does not HAVE to come from MakeHuman.  It merely needs to have shapekeys whose naming conventions match what are expected.

### Demo Scenes###

- [Emotions](https://palmer-jc.github.io/scenes/Being/human_emotions/index.html)
- [Fingers](https://palmer-jc.github.io/scenes/QueuedInterpolation/finger_shapekeys/index.html)
- [Eyes](https://palmer-jc.github.io/scenes/Being/eye_model/index.html)

# Expressions / Finger Shapekeys Work-flow for MakeHuman#

The process illustrated allows one to define expression and finger shapekeys for use with the MakeHuman`GAME_RIG`.  Once the poses are in a Pose Library of a `.blend` file though, all the back and forth using `Sync with MH` can be skipped.  In fact, there is a `shapekey_pose_libs.blend` in this directory with several Pose Libraries.  Simply use Blender's `file->Append` to copy them.  Pose Libraries are found in the `Actions` directory.  Since expression and finger poses only involve rotation, they work acceptably with a wide variety of MakeHuman models.

<img src="doc-assist/process.png">

## Required Plug-ins ##

### MHX2###
[MHX2](https://thomasmakehuman.wordpress.com/) has pieces installed in both MakeHuman & Blender (see its documentation). As little use of MHX2 as possible is made.  It clearly is the best MakeHuman transfer format for Blender right now, however it is complicated (multiple versions of the same skeleton), and has problems making / saving custom expressions (e.g. winking).  It also does not play well with Pose Libraries, which are key to this process.

### Tower-of-Babel###
The [Tower-of-Babel](https://github.com/BabylonJS/Extensions/tree/master/QueuedInterpolation/Blender) add-in for Blender is also more than just an exporter.  It has many pieces which make this work-flow possible.  Indeed, the last step of actually generating in-line Javascript source code for the QueuedInterpolation extension of Babylon.JS is not actually required.

### MakeHuman Community###

<img src="doc-assist/MH_community.jpg">

The [community](https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community) plug-in (also in 2 pieces) contains operations to transfer information from the MakeHuman application to the Blender mesh / skeleton after import.  In theory, these operations could also be performed when using a format other than MHX2, but those are not currently as good.  While the plug-in operations are performed once the mesh has been imported into Blender, it highly recommended that you perform them prior to modification of the meshes.

## Expressions ##
### In MakeHuman:###

1. Design a character, assigned with `GAME_RIG` skeleton, save and export via MHX2 (probably with 'Feet on Ground' checked).
2. Change the rig to Default No Toes, and export a 2nd time, adding ` default NT rig` on to the name.  There is probably no need to save this single change as a separate MakeHuman model.
3. On the `Utilities -> Socket` Tab: Click the `Accept connections` checkbox for later.
4. Leave MakeHuman running.

<img src="doc-assist/MH_ServerConnect.jpg">

### Goto to Blender:###
1. Do an import of the Default No Toes export using MHX2, no need to override defaults.
2. Goto the Armature Data Tab, and click the `New` button in the `Pose Library` section.  The name of library is of no importance.

Begin a process of transferring poses from Make Human to the library by switching to the `MakeHuman` (Community Plug-in)  tab on the Tool Shelf.  If exported with `Feet on Ground`, insure the checkbox below the `Sync with MH` is selected.  For each expression you wish to transfer:

1. Change to MakeHuman application, and set the expression desired in `Pose/Animate -> Expressions` Tab.
2. Change back to Blender, click `Sync with MH` in Bone Operators.
3. Click `+` to add the pose to the library.
4. Rename the pose, with a `FACE-` prefix, and for expressions a `_EXP` suffix.  Depending on the appropriateness to wink or not blink for this pose, also add `_WINKABLE` or `_NO_BLINK` suffixes.  See table below as an example of mapping.  You can use mixed case for your Blender pose names, if you wish, but on export to BJS everything is upper cased.

Note: Neither the `Sync with MH` button, nor the adding of a pose to the library are affected by the bones which are selected.  All are bones sync-ed, and all are saved with the pose in the library.  Below, are the poses used saved in the library `.blend`.

|MakeHuman Pose | Blender Library Pose
| --- | ---
|smile02        | FACE-HAPPY_EXP_WINKABLE
|sad02          | FACE-SAD_EXP
|anger01        | FACE-ANGRY_EXP
|fear03         | FACE-SCARED_EXP_NO_BLINK
|laugh02        | FACE-LAUGHING_EXP_WINKABLE
|cry01          | FACE-CRYING_EXP_NO_BLINK
|determination01| FACE-DETERMINED_EXP
|effort03       | FACE-STRUGGLING_EXP_NO_BLINK
|disgust01      | FACE-DISGUSTED_EXP
|sceptical01    | FACE-SKEPTICAL_EXP

|Armature Data Tab (library) | Mesh Tab |
| --- | --- 
|<img src="doc-assist/ArmatureData.jpg">|<img src="doc-assist/MeshData.jpg">

### Key Generation###
Once you have all your poses, click the `Pose lib to Shape keys` button in the `Tower of Babel` section of the Armature Data Tab.

For each pose, there will be shape key generated for each mesh where there is at least 1 vertex more than 0.00025 different than the basis value.  This is not an exact process, so extra keys will probably be generated which should not.  Tongue seems to have keys for everything.  These can either be discarded or ignored in the next step.  A small amount of proofing the results will keep your final export size to BJS much smaller.

### Key Transfer###
The keys now are on the meshes, but this is not on a skeleton of reasonable size for WebGL.  Remember, that you exported twice.  To get keys on a mesh with the `GAME_RIG`, they need to be written to an archive file (.TOB).  Do that by:

1. Selecting meshes which should be archived, eliminating meshes where the keys should be ignored.
2. Click `Archive Shapekeys` button in the `Tower of Babel` section of the Mesh Data Tab.
3. Specify a file location.

Now import the mesh / armature that you wish to have the keys.  Then click the `Restore Shapekeys` button, after selecting the meshes to receive them.  The names of the meshes will have a different name prefix, but anything before the delimiter (:) will be ignored.  If Collada or FBX formats become viable, the `restore delimiter` may need to be changed.

The restore should be done pretty early. The meshes need to have the exact same number of vertices at restore.  Also, afterwards you may not manually delete or add vertices.  Operations like `Limited Dissolve` also update the shapekeys, but manual adds or deletes will not export correctly as the shapekeys are out of sync with geometry.

#### Custom Expressions / Winking####
The `Expression Mixer` in MH `Utilities` allows you to make your own expressions.  This is also how to make the 2 shape keys in the `WINK` shape key group.  Once you save the new expression, you need to restart MakeHuman before the expression shows up.  The process for Custom Expressions is the same.

# Early Operations#
Utilizing Blender's filename incrementer, transferred expressions and other shapekeys is recommended as the first save with no geometry changes.  If you wanted to go back and add expressions, having a first level save with some of the stuff below already done, would be advisable.

## Other MakeHuman Community Operations##
There are also other operators made specifically for Babylon.JS which are safe to do prior to transferring expression shape keys.  These include:

- `Separate Eyes` into 2 separate meshes.  BEING can move eyes in a number of ways, but they need to be separate.
- `Convert to IK Rig` will add bones & bone constraints to a `GAME_RIG`.  The operation also tells exporter to ignore IK bones.
- `Remove Finger Bones`, in case either you will be doing via shape keys (similar to expressions) or not at all.  Important for mobile bone limits.

## Exporter Custom Properties / Materials changes##
Any settings that you know of, not just exporter, which do not change vertices means will make it easier to change expressions without have to re-do.  If you will eventually be merging all meshes which have expressions (recommended), you would only need to change exporter custom properties on the Body mesh.

## Parent Other Meshes to Body##
This not strictly needed to be done except for the eye meshes, but is safe to do / reversible.

# Finger Shapekeys#

|Finger IK Rig | Custom Shape |
| --- | --- |
|<img src="doc-assist/finger_IK_rig.jpg">|<img src="doc-assist/fingerBoneCustShape.jpg">|

Finger shapekeys start from posing a skeleton as well.  Fingers are very difficult to pose though due to the number of bones.  There is an operation in community plug-in to `Add Finger IK Bones`.  This operation works for both the `Default` and `GAME_RIG`.  Since you already have an export using the `Default` rig for expressions, it is recommended that you use it, since it has more finger bones.

Once the IK bones are added, most of the finger bones they control are hidden to make it easier.  You can also assign a custom shape, `KZM_Knuckle`, from the `shapekey_pose_libs.blend` file in this directory.  Use `file->Append`.  Select the shape mesh from the `Objects` directory.

You should use a separate prefix for poses of each hand, so that they can be operated independently.  After you have your poses, just click the `Pose lib to Shape Keys` operation again.  Work-flow after that is the same as expressions.  You would probably want to run `Remove Finger Bones` where the shapekeys are going.




