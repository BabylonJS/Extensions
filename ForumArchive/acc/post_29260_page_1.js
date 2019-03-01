[{"Owner":"Lande","Date":"2017-03-22T14:15:21Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_div style_eq__qt_color_dd_#d4d4d4_sm__qt__gt_\n\t_lt_p_gt_\n\t\t_lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_Hello everyone!. I_t_m trying to create new Canvas inside my scene and draw a text inside of it_co_ but the text never appears. I must use WorldSpace because I am using Oculus Rift with WebVRFreeCamera._lt_/span_gt_\n\t_lt_/p_gt_\n\n\t_lt_p_gt_\n\t\t_lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_ I have read a lot of posts and watched severad PG_t_s without luck._lt_/span_gt_\n\t_lt_/p_gt_\n\n\t_lt_p_gt_\n\t\t_lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_Here is my PG example_dd__lt_/span_gt_\n\t_lt_/p_gt_\n\n\t_lt_p_gt_\n\t\t_lt_span style_eq__qt_color_dd_#000000_sm__qt__gt__lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#H8NOA%232_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#H8NOA#2_lt_/a_gt__lt_/span_gt_\n\t_lt_/p_gt_\n\n\t_lt_p_gt_\n\t\t_lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_Help would be appreciated!. Thanks!._lt_/span_gt_\n\t_lt_/p_gt_\n\n\t_lt_pre_gt_\n_lt_code_gt_ var canvasTwo _eq_ new BABYLON.WorldSpaceCanvas2D(scene_co_ new BABYLON.Size(4_co_ 4)_co_ {            \n            id_dd_ _qt_WorldSpaceCanvas_qt__co_\n            worldPosition_dd_ new BABYLON.Vector3(0_co_ 0.8_co_ 0)_co_     \n            worldRotation_dd_ BABYLON.Quaternion.Identity()_co_                                         \n            backgroundFill_dd_ _qt_#ff000090_qt_                 \n        })_sm_\n\n        var text2d _eq_ new BABYLON.Text2D(_qt_THIS IS WONDERFUL_qt__co_ {\n            parent_dd_ canvasTwo_co_\n            id_dd_ _qt_subtitleLabel_qt__co_\n            fontName_dd_ _qt_Bold 24pt Arial_qt__co_   \n            fontSuperSample_dd_ true_co_         \n            defaultFontColor_dd_ new BABYLON.Color4(255_co_ 255_co_ 255_co_ 0.7)_co_\n            marginAlignment_dd_ _qt_h_dd_ center_co_ v_dd_ center_qt_            \n        })_sm_\n\n        //try update text\n        text2d.text _eq_ _qt_Updated test_qt__sm__lt_/code_gt__lt_/pre_gt_\n_lt_/div_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2017-03-22T15:56:43Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tPing _lt_span_gt__lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/18979-nockawa/?do_eq_hovercard_qt_ data-mentionid_eq__qt_18979_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/18979-nockawa/_qt_ rel_eq__qt__qt__gt_@Nockawa_lt_/a_gt__lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"mirco","Date":"2017-03-22T16:22:42Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI think the problem is that your _qt_canvasTwo_qt_ is to small and your text to long.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tnew BABYLON.Size(100_co_ 100) will make that the text appears (parts of it)\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Lande","Date":"2017-03-22T16:39:04Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_168280_qt_ data-ipsquote-contentid_eq__qt_29260_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1490199762_qt_ data-ipsquote-userid_eq__qt_26126_qt_ data-ipsquote-username_eq__qt_mirco_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t19 minutes ago_co_ mirco said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tI think the problem is that your _qt_canvasTwo_qt_ is to small and your text to long.\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tnew BABYLON.Size(100_co_ 100) will make that the text appears (parts of it)\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tYou are right_co_ I was using the size of my scene_co_ I updated and it is showing now_co_ I_t_m gonna check if my scene works too. The measure in my scene is in meters and 400_co_ 400 will be huge_co_ I guess I should scale it.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks!\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#H8NOA%234_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#H8NOA#4_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Lande","Date":"2017-03-22T17:03:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_168289_qt_ data-ipsquote-contentid_eq__qt_29260_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1490200744_qt_ data-ipsquote-userid_eq__qt_25916_qt_ data-ipsquote-username_eq__qt_Lande_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t24 minutes ago_co_ Lande said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tYou are right_co_ I was using the size of my scene_co_ I updated and it is showing now_co_ I_t_m gonna check if my scene works too. The measure in my scene is in meters and 400_co_ 400 will be huge_co_ I guess I should scale it.\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\tThanks!\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#H8NOA%234_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#H8NOA#4_lt_/a_gt_\n\t\t_lt_/p_gt_\n\n\t\t_lt_p_gt_\n\t\t\t \n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tIt is working ok using \n_lt_/p_gt_\n\n_lt_div style_eq__qt_color_dd_#000000_sm__qt__gt_\n\t_lt_div_gt_\n\t\t_lt_span style_eq__qt_color_dd_#001080_sm__qt__gt_canvas_lt_/span_gt__lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_._lt_/span_gt__lt_span style_eq__qt_color_dd_#001080_sm__qt__gt_worldSpaceCanvasNode_lt_/span_gt__lt_span style_eq__qt_color_dd_#000000_sm__qt__gt_._lt_/span_gt__lt_span style_eq__qt_color_dd_#001080_sm__qt__gt_scaling._lt_/span_gt_\n\t_lt_/div_gt_\n\n\t_lt_div_gt_\n\t\t \n\t_lt_/div_gt_\n_lt_/div_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nockawa","Date":"2017-03-23T15:08:41Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tYep_co_ that_t_s actually a bug_co_ if the text is too long there_t_s a line returned happening. I_t_ll fix it asap_co_ it shouldn_t_t be like that.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]