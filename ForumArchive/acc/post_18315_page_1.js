[{"Owner":"Stalker","Date":"2015-11-01T22:20:45Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Hi!_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I created a model_co_ rigged it and started searching how will everything go into Babylon (_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/tutorials/How_to_use_Bones_and_Skeletons_qt_ rel_eq__qt_external nofollow_qt__gt_topic that covers skeletons_lt_/a_gt_)._lt_/p_gt__lt_p_gt_After going through a couple (all) of the tutorials_co_ documentation etc. one thing is still buzzing me._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_What is the best way to structure a model and why?_lt_/p_gt__lt_p_gt_Would it be better to break it down into multiple meshes or keep it a single one? _lt_/p_gt__lt_p_gt_I also spotted _qt_submesh_qt_. What is it? Couldn_t_t find anything useful not for blender not for maya._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I tried making sense from dude model but I couldn_t_t figure it out._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_My mesh (robot on image bellow) is created as a single mesh_co_ only parts are divided into vertex groups._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Thanks!_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt__lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_11_2015/post-17157-0-18400600-1446416156.png_qt_ rel_eq__qt_external nofollow_qt__gt__lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_11_2015/post-17157-0-18400600-1446416156.png_qt_ data-fileid_eq__qt_5476_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ alt_eq__qt_post-17157-0-18400600-1446416156.png_qt__gt__lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_P.S._dd_ It_t_s been four years since I touched Blender so it might not be the best looking creation._lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-11-02T01:53:19Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Hello and welcome!_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_submeshes are used to map parts of a mesh with multiple materials so not what you want here_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Regarding how you want to structure your mesh_co_ my opinion is that you should keep one mesh. Mainly because of performance_dd_ one draw call to draw your mesh as all the skinning will be done by shaders_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Stalker","Date":"2015-11-02T11:41:45Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Thanks for clarifying _lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ alt_eq__qt__dd_)_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ width_eq__qt_20_qt_ height_eq__qt_20_qt__gt_!_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-11-02T15:24:05Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_My pleasure!_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]