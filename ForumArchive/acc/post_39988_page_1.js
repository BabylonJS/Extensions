[{"Owner":"MadnessOfMadara","Date":"2018-09-13T20:00:55Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tWhile fiddling around with the examples_co_ I opened the dummy3.babylon of the weighted animation example and found that it does not have _qt_animation_qt__co_ but has animationClips? Trying to access animation through the animations property gives you an error as the property is undefined_co_ but you can get the animationClips from the AnimationRange method. I am curious how this is possible and the pros and cons.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kcoley","Date":"2018-09-14T16:10:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi _lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/32782-madnessofmadara/?do_eq_hovercard_qt_ data-mentionid_eq__qt_32782_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/32782-madnessofmadara/_qt_ rel_eq__qt__qt__gt_@MadnessOfMadara_lt_/a_gt_.  An animationClip in Babylon.js is an AnimationGroup.  This allows you to have a set of animations that are separated from a mesh.  The advantage of this is that you can apply the animation group to multiple meshes.  You would have to make sure that the properties that the animation group targets are available on the mesh.  The other advantage of an AnimationGroup is that collections of animations can be played simultaneously_co_ and you can specify the range to play the animations._lt_br /_gt_\n\t_lt_br /_gt_\n\tYou can also apply animations directly to the mesh_co_ but you lose the flexibility of sharing the same animations to other meshes.  Plus you would have to rely on the scene to play all the animations.  Though this is fine as long as you do not need to share animations.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tHere is a sample playground_dd_ _lt_a href_eq__qt_http_dd_//playground.babylonjs.com/#HLZYVM%231_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//playground.babylonjs.com/#HLZYVM#1_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]