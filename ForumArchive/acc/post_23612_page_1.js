[{"Owner":"Vijay Kumar","Date":"2016-07-05T07:35:19Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi Deltakosh_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tcan we skip the mesh not to be rendered when camera is not able to see that mesh.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#UJEZ1%238_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#UJEZ1#8_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tin below screenshot camera is able to see two meshes so active indices count is 3912.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_img alt_eq__qt_1.JPG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_8477_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/1.JPG.dd0aa043cb3534ddab2fbd42ffcb7abe.JPG_qt_ style_eq__qt_width_dd_500px_sm_height_dd_430px_sm__qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tin below screenshot sphere is behind the ground mesh so any how it is required to render the sphere_co_ so can we skip that object from being rendered_co_ so that active indices count also will be reduced.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_img alt_eq__qt_2.JPG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_8478_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/2.JPG.2ba6e232e33266ac3aa7397be5468abb.JPG_qt_ style_eq__qt_width_dd_581px_sm_height_dd_500px_sm__qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\ti have seen LOD concept but it is not helpful for my situation.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThe reason why i am asking this is_co_ in my scene the objects in other room also getting rendered when camera is at that  direction actually those are behind the wall .\n_lt_/p_gt_\n\n_lt_p_gt_\n\tbecause of that my active indices count is very high and my scene performance is very slow.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tsorry for my poor English_co_ but at least i think you guys understand what i am trying to explain.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"aWeirdo","Date":"2016-07-05T20:33:53Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/18131-vijay-kumar/?do_eq_hovercard_qt_ data-mentionid_eq__qt_18131_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/18131-vijay-kumar/_qt_ rel_eq__qt__qt__gt_@Vijay Kumar_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think there were a post about this a while back_co__lt_br /_gt_\n\tand if i don_t_t recall completely wrong_co_ it isn_t_t posible before webgl 2.0.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t i don_t_t quite remember what the correct term for it was though _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\ti suppose something you could do is to apply some kind of area triggers_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\texample_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tall meshes that can_t_t be seen from the starting point(either due to walls or distance_co_ etc) are set to isVisible _eq_ false_sm_ by default.\n_lt_/p_gt_\n\n_lt_p_gt_\n\twhen a player then starts moving around_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tand is between this and that x and this and that z the meshes he is moving towards gets set to isVisible _eq_ true_sm_ while the meshes he is moving away from is set to isVisible _eq_ false_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tif that makes any sense _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-07-05T21:58:10Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello!\n_lt_/p_gt_\n\n_lt_p_gt_\n\twe do not support occlusions queries as this will come with WebGL 2.0\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIn the meantime_co_ as aWeirdo mentioned_co_ you have to do it manually _lt_img alt_eq__qt__dd_(_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_sad.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/sad@2x.png 2x_qt_ title_eq__qt__dd_(_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"aWeirdo","Date":"2016-07-06T00:25:39Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tMade a quick AreaTrigger example _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_img alt_eq__qt_AreaTriggers_Example.png_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_8485_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/AreaTriggers_Example.png.82b0faf4b7d5442be34a1edc03617431.png_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tSo_co_ basicly..\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_var player_sm_\n    player.area1shown _eq_ true_sm_ //starting area.\n    player.area2shown _eq_ false_sm_\n    player.area3shown _eq_ false_sm_\n\nvar timeout_eq_ false_sm_\n\n//registerBeforeRender..\nif( player.position.x &gt_sm_ -25 &amp_sm_&amp_sm_ player.position.x &lt_sm_ -20 &amp_sm_&amp_sm_  player.position.z &gt_sm_ 2 &amp_sm_&amp_sm_ player.position.z &lt_sm_ 5 &amp_sm_&amp_sm_ !timeout){\ntimeout _eq_ true_sm_ //only run one time while the player is standing in the trigger field.\n    if( player.area1shown ){\n        //area1 (starting area) is already visible so player is mostlikely leaving.\n        player.area1shown _eq_ false_sm_\n        //call function to set meshes in starting area to isVisible _eq_ false_sm_\n    } else {\n        player.area1shown _eq_ true_sm_\n        //call function to set meshes in starting area to isVisible _eq_ true_sm_\n    }\n} else {\n//when player leaves the areatrigger_co_ allow it to be triggered again..\ntimeout_eq_ false_sm_\n}_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Vijay Kumar","Date":"2016-07-06T05:00:24Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi  _lt_span style_eq__qt_color_dd_rgb(39_co_42_co_52)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_background-color_dd_rgb(255_co_255_co_255)_sm_float_dd_none_sm__qt__gt_aWeirdo_lt_/span_gt_ _co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks for your suggestion and the valuable time you spent for me.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tthe above concept will work when the camera is moving in straight path.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tFor example in the below screenshot if the camera is in 1st position i can at least disable some meshes in 1st room_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tbut if the camera is in 2nd position i think it is not possible to disable meshes in any room ..\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_img class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_8490_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/3.jpg.7da57649ab18756dc0bc54d6be76c8bc.jpg_qt_ alt_eq__qt_3.jpg_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tIs there any method like that the mesh is visible or not visible to camera in current frame.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Kesshi","Date":"2016-07-06T07:02:33Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tI don_t_t know how this is done in games nowadays but older games like Doom or Quake used BSP trees to decide which part of the level is visible.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2016-07-06T15:59:49Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_135098_qt_ data-ipsquote-contentid_eq__qt_23612_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1467781224_qt_ data-ipsquote-userid_eq__qt_18131_qt_ data-ipsquote-username_eq__qt_Vijay Kumar_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t11 hours ago_co_ Vijay Kumar said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tbut if the camera is in 2nd position i think it is not possible to disable meshes in any room\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tYou know what room you are in_co_ and I_t_m assuming you know what objects are in each room.  Just render the objects that are in your current room and the objects in any adjacent room if you are facing the doorway.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2016-07-06T17:16:59Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_135098_qt_ data-ipsquote-contentid_eq__qt_23612_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1467781224_qt_ data-ipsquote-userid_eq__qt_18131_qt_ data-ipsquote-username_eq__qt_Vijay Kumar_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t12 hours ago_co_ Vijay Kumar said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tIs there any method like that the mesh is visible or not visible to camera in current frame.\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n_lt_iframe data-embedcontent_eq__qt__qt_ frameborder_eq__qt_0_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/topic/16927-determine-when-3d-point-is-out-of-view/?do_eq_embed&amp_sm_embedComment_eq_95231&amp_sm_embedDo_eq_findComment_qt__gt__lt_/iframe_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2016-07-06T17:20:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#1J96H2%230_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#1J96H2#0_lt_/a_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Vijay Kumar","Date":"2016-07-07T04:27:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi adam_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks for the solutions provided by you.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_color_dd_rgb(82_co_82_co_82)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_13px_sm_font-style_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_background-color_dd_rgb(252_co_252_co_252)_sm_float_dd_none_sm__qt__gt_Frustum_lt_/span_gt_  technique is a good concept but in my case this is not that much useful as i want avoid the meshes which are behind the other objects.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_img class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_8499_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/4.JPG.b97e5a8db90c4acb2fc8d66d3559a24e.JPG_qt_ alt_eq__qt_4.JPG_qt_ /_gt_ \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2016-07-07T18:21:22Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/18131-vijay-kumar/?do_eq_hovercard_qt_ data-mentionid_eq__qt_18131_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/18131-vijay-kumar/_qt_ rel_eq__qt__qt__gt_@Vijay Kumar_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI thought that would be useful if you want to know if you are facing a doorway.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Vijay Kumar","Date":"2016-07-08T06:04:08Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tOk Thanks Adam_co_ now i understand your thought.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]