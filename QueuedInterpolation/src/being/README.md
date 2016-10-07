#BEING Workflow for MakeHuman

This process utilitizes the [MHX2 plug-in](https://thomasmakehuman.wordpress.com/) & [MakeHuman Community plug-in](https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community).  The workflow below makes as little use of MHX2 as possible.  It clearly is the best format for Blender right now, however it is complicated, has problems making / saving custom expressions (winking).  It also does not play well with Skeleton Libraries, which are key to this process.

<img src="doc-assist/MH_Community.jpg">

The community plug-in contains operations to transfer information from the MakeHuman application to the Blender mesh / skeleton post import, and in theory could handle other import / export formats, but they are not as good.  Its use allows for publishing a workflow that has a minimum of UI to describe & options to use.  The community platform is a way to preprocess MH meshes in direct support of Babylon.JS / BEING upstream of export.  The 'Separate Eyes' operation directly supports BEING.

##In MakeHuman:##

1. Design a character, assigned with GAME_RIG skeleton, save and export via MHX2 (probably with 'Feet on Ground' checked).
2. Change the rig to Default No Toes, and export a 2nd time, adding ' default NT rig' on to the name.  There is no need to save this single change.
3. On the 'Utilities -> Socket' Tab: Click the 'Accepts connections' checkbox.
4. Leave MakeHuman running.

<img src="doc-assist/MH_ServerConnect.jpg">

##Goto to Blender:##
1. Do an import of the Default No Toes using MHX2, no need to override defaults.
2. Goto the Armature Data Tab, and click the 'New' button in the 'Pose Library' section.  The name of library is of no importance.

Begin a process of transferring poses from Make Human to the library by switching to the 'MakeHuman' (Community Plugin)  tab on the Tool Shelf.  For each expression you wish to transfer:

1. Change to MakeHuman application, and set expression desired in 'Pose/Animate -> Expressions' Tab.
2. Change back to Blender, click 'Sync with MH' in Bone Operators.
3. If exported with 'Feet on Ground', mesh will jump down.  Correct by selecting 'root' bone & clearing transforms {Alt G, Alt R}
4. Ensure all bones selected {A key twice}
5. Click '+' to add the pose to the library.
6. Rename the pose, with a 'FACE-' prefix, and for expressions a '_EXP' suffix.  If it might be appropriate to wink for this pose, also add a '_WINKABLE' suffix.  See table below as an example.  You can use mixed case, if you wish, but on export everything is upper cased.

|MakeHuman Pose | Blender Library Pose
| --- | ---
smile02        | FACE-HAPPY_EXP_WINKABLE
sad02          | FACE-SAD_EXP
anger01        | FACE-ANGRY_EXP
fear03         | FACE-SCARED_EXP
laugh02        | FACE-LAUGHING_EXP_WINKABLE
cry01          | FACE-CRYING_EXP
determination01| FACE-DETERMINED_EXP
effort03       | FACE-STRUGGLING_EXP
disgust01      | FACE-DISGUSTED_EXP
sceptical01    | FACE-SKEPTICAL_EXP

|Armature Data Tab | Mesh |
| --- | --- 
|<img src="doc-assist/ArmatureData.jpg">|<img src="doc-assist/MeshData.jpg">



Once you have all your poses, click the 'Pose lib to Shape keys' button in the 'Tower of Babel' section of the Armature Data Tab.
