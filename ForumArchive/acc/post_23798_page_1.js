[{"Owner":"tranlong021988","Date":"2016-07-13T16:56:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi everyone_co_ I already face to new issue with DeviceOrientationCamera. First_co_ you may take a look my game (with mobile browser_co_ ofcourse)_dd_ _lt_a href_eq__qt_https_dd_//dl.dropboxusercontent.com/u/86585940/BabylonWave/optimized4/index.html_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//dl.dropboxusercontent.com/u/86585940/BabylonWave/optimized4/index.html_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tDon_t_t touch/tap_co_ just move you phone to look around slowly_co_ when camera pan to JetSki_co_ it cause a fast flicker. Then you touch/tap the screen_co_ the game begin_co_ and you can see flicker issue happen sometimes. And it_t_s not random_co_ I notice that it only happen when camera.y value between -1.5 and -1.6. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tI already create a PG with a simple scene_co_ just change current Camera to DeviceOrientationCamera_co_ and that issue happen_co_too. You can check here(with mobile browser)_dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#16OJL4_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#16OJL4_lt_/a_gt_ \n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo anyone can help ?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSorry for my poor English.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"RaananW","Date":"2016-07-13T18:39:05Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi tranlong_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI checked your demo and it didn_t_t really flicker. I do believe however there is an issue_co_ so if you don_t_t mind I_t_ll ask a few questions_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t1. Did you try with one single mobile_co_ or did you try with a few?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t2. What do you mean with camera.y? Position?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t3. In your demo_co_ I_t_d the camera attached to any mesh (parent or child)?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnd_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tCan anyone else test the scene and see if it flickers? \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks!\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-13T19:09:44Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tdemo not flickering _lt_br /_gt_\n\tplayground flicker_lt_br /_gt__lt_br /_gt_\n\tlooks like a value _eq_ something_sm_ renderloop( value *_eq_-1_sm_ )_lt_br /_gt__lt_br /_gt__lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#NUH5F%230_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#NUH5F#0_lt_/a_gt__lt_br /_gt__lt_br /_gt__lt_br /_gt_\n\tBest\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"tranlong021988","Date":"2016-07-13T19:54:48Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/?do_eq_hovercard_qt_ data-mentionid_eq__qt_10310_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/_qt_ rel_eq__qt__qt__gt_@RaananW_lt_/a_gt__dd_ I just test in my mobile Google Nexuus 6_co_ and already record some video from my mobile screen.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t- Playground test_dd_ \n_lt_/p_gt_\n\n_lt_div class_eq__qt_ipsEmbeddedVideo_qt__gt_\n\t_lt_div_gt_\n\t\t_lt_iframe allowfullscreen_eq__qt_true_qt_ frameborder_eq__qt_0_qt_ height_eq__qt_344_qt_ src_eq__qt_https_dd_//www.youtube.com/embed/e3Sg9qnPsqk?feature_eq_oembed_qt_ width_eq__qt_459_qt__gt__lt_/iframe_gt_\n\t_lt_/div_gt_\n_lt_/div_gt_\n\n_lt_p_gt_\n\t- My game demo (landscape)_dd_\n_lt_/p_gt_\n\n_lt_div class_eq__qt_ipsEmbeddedVideo_qt__gt_\n\t_lt_div_gt_\n\t\t_lt_iframe allowfullscreen_eq__qt_true_qt_ frameborder_eq__qt_0_qt_ height_eq__qt_344_qt_ src_eq__qt_https_dd_//www.youtube.com/embed/STB3VZ0JjuQ?feature_eq_oembed_qt_ width_eq__qt_459_qt__gt__lt_/iframe_gt_\n\t_lt_/div_gt_\n_lt_/div_gt_\n\n_lt_p_gt_\n\t- My game demo (portrait)_dd_\n_lt_/p_gt_\n\n_lt_div class_eq__qt_ipsEmbeddedVideo_qt__gt_\n\t_lt_div_gt_\n\t\t_lt_iframe allowfullscreen_eq__qt_true_qt_ frameborder_eq__qt_0_qt_ height_eq__qt_344_qt_ src_eq__qt_https_dd_//www.youtube.com/embed/T4l1sNOv4sI?feature_eq_oembed_qt_ width_eq__qt_459_qt__gt__lt_/iframe_gt_\n\t_lt_/div_gt_\n_lt_/div_gt_\n\n_lt_p_gt_\n\t2. My mistake_co_ I mean camera.rotation.y and actually scene.activeCamera.rotationQuaternion.toEulerAngles().y since I use RotationQuaternion. \n_lt_/p_gt_\n\n_lt_p_gt_\n\t3. I just create a simple DeviceOrientationCamera in scene_co_ no attach to any mesh. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tMy girlfriend test it _dd__qt_Is there something in my eyes or your game go flicker_co_ honey ?_qt_. _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-13T20:03:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/21019-tranlong021988/?do_eq_hovercard_qt_ data-mentionid_eq__qt_21019_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/21019-tranlong021988/_qt_ rel_eq__qt__qt__gt_@tranlong021988_lt_/a_gt__lt_br /_gt__lt_br /_gt_\n\ttry to hit the _qt_right_qt_ value exactly_co_ so the flickering becomes really _qt_visible_qt_ - continue._lt_br /_gt__lt_br /_gt_\n\ti use this as creative effect. hope they not bug fixing it everywhere._lt_br /_gt__lt_br /_gt_\n\tBest\n_lt_/p_gt_\n\n\t\t\t\n\t\t\t\t\n\n_lt_span class_eq__t_ipsType_reset ipsType_medium ipsType_light_t_ data-excludequote_gt_\n\t_lt_strong_gt_Edited _lt_time datetime_eq__t_2016-07-14T02_dd_08_dd_59Z_t_ title_eq__t_07/14/2016 02_dd_08  AM_t_ data-short_eq__t_2 yr_t__gt_July 14_co_ 2016_lt_/time_gt_ by Nabroski_lt_/strong_gt_\n\t\n\t\t_lt_br_gt_bugs are good\n\t\n\t\n_lt_/span_gt_\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"tranlong021988","Date":"2016-07-13T20:15:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/21965-nabroski/?do_eq_hovercard_qt_ data-mentionid_eq__qt_21965_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/21965-nabroski/_qt_ rel_eq__qt__qt__gt_@Nabroski_lt_/a_gt__dd_ The top-left number in my game showing Y-axis Camera Rotation_co_ and I used 1000% focus power to notice that value between -1.5 and -1.6_co_ sometime it go up to some positive number. _lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/?do_eq_hovercard_qt_ data-mentionid_eq__qt_10310_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/_qt_ rel_eq__qt__qt__gt_@RaananW_lt_/a_gt__dd_ I think it cause that issue. \n_lt_/p_gt_\n\n_lt_p style_eq__qt_color_dd_rgb(39_co_42_co_52)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-variant_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_line-height_dd_22.4px_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_background-color_dd_rgb(255_co_255_co_255)_sm__qt__gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"tranlong021988","Date":"2016-07-14T05:31:52Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tafter convert camera rotation y  from Radian value to Degree_co_ I notice that flicker happen when this value hit -90 degree. It_t_s not random number. Seem that something wrong in Device Orientation Camera source code. I will try with some another devices for sure.  \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-14T09:56:05Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tI_t_m sure they work on it right now_co_ meanwhile_dd_ u can add a tribune with shouting people_co_ some sounds_co_ would also be nice. _lt_br /_gt_\n\tMaybe the bugfix never comes_co_ - so you could add some sharks that jump out of the water_co_ at a specific device rotation_co__lt_br /_gt_\n\tand dragging the player under water. the possibilities are endless._lt_br /_gt__lt_br /_gt_\n\tBest_lt_br /_gt__lt_br /_gt_\n\tI debug my device drawcalls_co_ and the window of the browser runs at ~60fps  but the playground is still at 16pfs_co_ maybe a synch. problem. at somepoint the playground try to take thouse 60 from the browser. and its flickering.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"tranlong021988","Date":"2016-07-14T17:50:42Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tit seem that it happen on my mobile only. Not know why. \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-14T22:23:58Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tand i dont mind about flickering also. problem solved. thread closed _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"RaananW","Date":"2016-07-18T19:57:24Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSo!\n_lt_/p_gt_\n\n_lt_p_gt_\n\tYou can_t_t change the camera_t_s ration by yourself. As this is a device orientation camera_co_ changing the rotation will cause it to... flicker_co_ and then go back to the rotation the device is sending. Let the device do its own thing.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIf you want to rotate the camera_co_ you will have to do it in a beforeRender loop_co_ and using quaternions (multiply the rotation you want with the camera_t_s rotationQuaternion).\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"tranlong021988","Date":"2016-07-19T18:53:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/?do_eq_hovercard_qt_ data-mentionid_eq__qt_10310_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/10310-raananw/_qt_ rel_eq__qt__qt__gt_@RaananW_lt_/a_gt_ _dd_ I used to try to make a custom Device Orientation handler but that code is removed_co_ and don_t_t touch anything to modify camera rotation. Since that issue happen only on my device so I just give up. \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]