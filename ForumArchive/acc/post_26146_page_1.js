[{"Owner":"onurhanaytac","Date":"2016-11-01T12:41:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi everyone!\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI want to dispose mesh on click but i am getting an error_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tUncaught TypeError_dd_ Cannot read property _t_processTrigger_t_ of null\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think when i am trying to dispose mesh the actionManager returns null because of there is no mesh anymore _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_ and actionManager.processTrigger returns error.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhat is the proper way to dispose mesh onClick? \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tplayground example_dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#187MLU%230_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#187MLU#0_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Théo Sabattié","Date":"2016-11-01T13:44:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_t__co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tuse BABYLON.ActionManager.OnPickTrigger instead of BABYLON.ActionManager.OnPickDownTrigger to prevent errors.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"onurhanaytac","Date":"2016-11-01T13:53:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/22148-th%C3%A9o-sabatti%C3%A9/?do_eq_hovercard_qt_ data-mentionid_eq__qt_22148_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/22148-th%C3%A9o-sabatti%C3%A9/_qt_ rel_eq__qt__qt__gt_@Théo Sabattié_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThank you for your answer! It works well..\n_lt_/p_gt_\n\n_lt_p_gt_\n\tCan you tell me the difference why should i use pick instead of down or up? \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Théo Sabattié","Date":"2016-11-01T14:50:37Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tOn basic button_co_ you can perform mouse down on it and mouse up out of it. -&gt_sm_ that doesn_t_t perform button action.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMouse down on something + mouse up on same thing _eq_ _lt_span style_eq__qt_color_dd_rgb(39_co_42_co_52)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_background-color_dd_rgb(255_co_255_co_255)_sm_float_dd_none_sm__qt__gt_OnPickTrigger _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_color_dd_rgb(39_co_42_co_52)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_background-color_dd_rgb(255_co_255_co_255)_sm_float_dd_none_sm__qt__gt_But I am not able to explain why PickDown invokes errors. _dd_S_lt_/span_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]