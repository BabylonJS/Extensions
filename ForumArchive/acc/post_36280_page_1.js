[{"Owner":"kurhlaa","Date":"2018-03-11T10:37:04Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhen I use Blender and apply texture to some object - I can select an image from any folder. However_co_ when I import scene to the BJS - it looks for all images in the folder where _lt_strong_gt_*.babylon_lt_/strong_gt_ file is.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tImport example_dd_ \n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_var meshTask _eq_ loader.addMeshTask(_qt_someName_qt__co_ _qt__qt__co_ _qt_assets/_qt__co_ _qt_myScene.babylon_qt_)_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tAs a result - _lt_strong_gt_*.babylon_lt_/strong_gt_ file contains filenames only and BJS looks for them only in _lt_strong_gt__qt_assets/_qt_ + image_name.png_lt_/strong_gt_.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tIf we want to store images (and other files?) in a different separate folders - how it can be achieved? Because putting all Blender source files and all related files in one folder - not comfortable at all _lt_img alt_eq__qt__dd_(_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_sad.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/sad@2x.png 2x_qt_ title_eq__qt__dd_(_qt_ width_eq__qt_20_qt_ /_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI see that Blender has a field with a relative path - maybe it can be exported/used somehow?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JCPalmer","Date":"2018-03-11T15:22:01Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThat option to save images in another folder is really an option for the javascript generator variant that leaked into this. It will actually save in the location specified for the JSON exporter.  Only the filename without path is written to the JSON file though. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tWriting the full path into the field looks simple enough.  Do not know if it works.  Manually edit your .babylon with the extra info &amp_sm_ test it works_co_ then report back.  Adding a fixed or DOS formatted location would cause problems_co_ but you cannot always save everybody.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kurhlaa","Date":"2018-03-11T15:39:46Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/8492-jcpalmer/?do_eq_hovercard_qt_ data-mentionid_eq__qt_8492_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/8492-jcpalmer/_qt_ rel_eq__qt__qt__gt_@JCPalmer_lt_/a_gt__co_ I tried to edit _lt_strong_gt_*.babylon_lt_/strong_gt_ file and to replace name_co_ for example_co_ _lt_strong_gt__qt_image_name.png_qt__lt_/strong_gt_ with _lt_strong_gt__qt_images/image_name.png_qt__lt_/strong_gt_. There probably can be any path_co_ relative to the _lt_strong_gt_assets/_lt_/strong_gt_ folder. It works_co_ but that means editing these files (every texture_t_s path!) after every Blender_t_s exporting.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tHow do you deal with that?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JCPalmer","Date":"2018-03-11T15:51:00Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSince you reported it works_co_ I_t_ll change the code.  When I do not know.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kurhlaa","Date":"2018-03-11T16:02:54Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/8492-jcpalmer/?do_eq_hovercard_qt_ data-mentionid_eq__qt_8492_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/8492-jcpalmer/_qt_ rel_eq__qt__qt__gt_@JCPalmer_lt_/a_gt__co_ Thanks anyway _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_ May I one more question about Blender exporter without new topic?! In Blender (mesh Data) you have a checkbox _qt_Cast Shadows_qt__co_ but I don_t_t see it in the exported *.babylon file. How this setting can be used in BJS?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JCPalmer","Date":"2018-03-11T16:41:42Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThis is used in the mesh list for any _lt_a href_eq__qt_https_dd_//github.com/BabylonJS/Exporters/blob/master/Blender/src/babylon-js/light_shadow.py#L130_qt_ rel_eq__qt_external nofollow_qt__gt_shadow generators_lt_/a_gt_ for Blender lights.  It is not recognized as a field in BABYLON.Mesh or BABYLON.AbstractMesh.  The javascript generator does use assign it directly_co_ but shadows mesh lists are updated with a function also written into the file.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JCPalmer","Date":"2018-03-23T19:48:33Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/29483-kurhlaa/?do_eq_hovercard_qt_ data-mentionid_eq__qt_29483_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/29483-kurhlaa/_qt_ rel_eq__qt__qt__gt_@kurhlaa_lt_/a_gt__co_ have added the path onto the exporter.  Commit message_dd_\n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\tQuote\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tBlender 5.6.2 minor release\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tThe custom property_co_ textureDir_co_ originally for Tower of Babel to indicate the directory to write images_co_ is now joined into the name field of the texture in the .babylon file.\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tIf the field does not end with _t_/_t__co_ then one will be added between the directory &amp_sm_ file name.\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tThe field is relative to the .babylon file.  For this to work probably implies that the .babylon is in the same directory as the html file.  Still it now allows images to be in a separate directory.\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tHave not tested where the the .babylon is in a different directory from html file.\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]