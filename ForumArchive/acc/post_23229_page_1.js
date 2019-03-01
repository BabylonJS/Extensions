[{"Owner":"chicagobob123","Date":"2016-06-16T20:43:30Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI have a problem that I just can_t_t figure and some code text handling code that you might find handy. (I did)\n_lt_/p_gt_\n\n_lt_p_gt_\n\tCan a ground plane be transparent? I put some text on it and used it here but its not transparent\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#1MCWZJ%2314_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#1MCWZJ#14_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"gryff","Date":"2016-06-16T21:16:17Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHow about adding this at line 196\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_ground.visibility _eq_ 0_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-06-17T00:22:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHey Sorry must not be clear_co_ this is the plane I want to make transparent. \n_lt_/p_gt_\n\n_lt_p_gt_\n\t     // used a ground so I can have a X/Y ? Not sure this is right._lt_br /_gt_\n\t     // may be a better way _lt_br /_gt_\n\t     var textMesh1 _eq_ BABYLON.Mesh.CreateGround(_qt_MJID_qt_+mytext_co_ width_co_ height[2]_co_ 2_co_ scene)_sm__lt_br /_gt_\n\t     textMesh1.material _eq_ MaterialText_sm__lt_br /_gt_\n\t     Setting the visibility to 0 makes the text disappear. _lt_br /_gt_\n\t     textMesh1.visibility _eq_ 0_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhat I want is the black rectangle to be transparent. \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"dbawel","Date":"2016-06-17T00:33:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tYou need to create an alpha channel for your texture to make the black area of your texture transparent when rendered on you ground plane. Simply copy your image to a new layer in photoshop_co_ and select the black area in your image (texture)_co_ and use the _qt_delete button to delete this color. Then delete the original layer in your image file_co_ and this will result in adding an 8 bit alpha channel that will save if you save in an image format such as .png which I often prefer as it is an efficient compression format. Applying the new .png image back onto your mesh will not display the black area of your image.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIf you re already familiar with creating n alpha channel for selective transparency_co_ please ignore the tutorial above_co_ however I hope it might be valuable to those who don_t_t yet have the experience in generating alpha channels.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tDB\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-06-17T00:52:10Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tI don_t_t have an image. I just used a virtual texture and added text. So I don_t_t have alpha. \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"dbawel","Date":"2016-06-17T02:23:38Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSorry_co_ misunderstood. Here is your solution_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#1MCWZJ%2317_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#1MCWZJ#17_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tDB\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-06-17T03:57:14Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tThanks a bunch. \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]