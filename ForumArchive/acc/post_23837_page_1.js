[{"Owner":"MasterK","Date":"2016-07-15T10:16:37Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tnot find the method...\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-07-15T13:47:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tLet me understand_co_ do you want transparent 3D layer above the 2D layer?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThe problem is when you click the mouse you wont be able to have the proper ZOrder. It will hit the 3D layer first. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThat is why you always see interface elements on top of a 3D scene. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tNOW_co_ if you turned your 2D Canvas into a 3D mesh and replace the text with 2D text and buttons with 3D Meshes then you could\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_line-height_dd_1.6_sm__qt__gt_hit test that and do what you want. _lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_line-height_dd_1.6_sm__qt__gt_There is Text2D that is out there to make the text. And buttons are rounded corner squares. _lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tYou know that is one odd thing. Has anyone come up with a library of 3D interface components that mimic the 2D interface world?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThings like buttons combo boxes and such. I guess since you can overlay them on 3D its not a big deal? \n_lt_/p_gt_\n\n_lt_p_gt_\n\tJust some random thoughts. \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-15T14:15:49Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tGood answer_co_ and cool thoughts_co_ cb.  I_t_ve DEFINITELY thought about what 3D gui widgets would look like.  But why copy 2D sliders_co_ closers_co_ buttons_co_ etc_co_ when you can click on a beer can_co_ slide a snail_co_ drag and drop a mushroom?  A guy could accidentally limit his creativity_co_ here_co_ by not being able to shake-off old ways.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_  Anyway... check this out_co_ guys.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1BKDEO%2331_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1BKDEO#31_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tFun!!!  Lines 6/7 let you position and orient that worldSpaceCanvas... like a mad man.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_  Notice particles never go in front of Canvas2D things?  Not a bug.  Magic_co_ gone _lt_s_gt_wrong_lt_/s_gt_ interesting.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_  It LOOKS like particles go in front_co_ but we are seeing-through the 3/4 transparent world-space rectangle fill.  We are viewing particles that are _lt_u_gt_rendered_lt_/u_gt_ behind it.  Particles are unique in this way.  No issues with rendering-depth for normal mesh like ground and fountain.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tLet_t_s increase the alpha level in line 9... to FF...\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1BKDEO%2332_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1BKDEO#32_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tYep_co_ the particles are behind.  Again_co_ not a bug... don_t_t anyone report it as so.  It is a _qt_phenomena_qt_.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-07-15T15:06:39Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tWingnut yeah but restricting a slider to move left to right and give proper feedback to the position etc Thats not just make a new thumb image. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tCombos have drop downs and sliders on the side. Particles could be used to be able to show two different UV_t_s so the button can look like its clicked. One texture_co_ On Down you move the UV .5 to expose the other half and you get that traditional feel. 3D artists could have a field day. Imagine a Dragon that had several images so it looks like its moving as a scroll bar thumb. Wild thoughts for fun but I wont have much time to ever do them. \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"chicagobob123","Date":"2016-07-15T15:07:55Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tYou could even make a spinning elongated cube show different buttons on each side. The thoughts are endless. \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-07-15T15:23:07Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tYou can use multiple scenes_dd_ one scene for the canvas2d and the main scene and a 2nd scene on top of the first one\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-15T17:53:58Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\ti think he/she just not discovered  WorldSpaceCanvas2D jet._lt_br /_gt__lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#4LXMG%230_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#4LXMG#0_lt_/a_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-18T06:30:19Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tthank u for different options. I should describe more details.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI use 2d things as ui. And on the 2d ui_co_like a hero upgrade things. There is a 3D hero display in the center. So 3D hero covers the background ui.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnd when I rotate the hero the ui is always face to camera.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tthat_t_s what I mean.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tmaybe 2 scenes fit for this?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t2 scenes means 2canvas and 2 engine?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tworldspaceCanvas will move with camera_co_ and can_t_t use layermask.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Nabroski","Date":"2016-07-19T12:27:52Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tHey man_co_ i dont want to upset you_co_ but this is the best thing i read on this forum._lt_br /_gt__lt_br /_gt_\n\tThank you\n_lt_/p_gt_\n_lt_p_gt__lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/masterk.jpg.75275bed917f79a83d87a9fe038a823e.jpg_qt_ class_eq__qt_ipsAttachLink ipsAttachLink_image_qt__gt__lt_img data-fileid_eq__qt_8677_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_07/masterk.jpg.75275bed917f79a83d87a9fe038a823e.jpg_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ alt_eq__qt_masterk.jpg_qt__gt__lt_/a_gt__lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-19T19:36:44Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tOhhh... I think I finally understand.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tHow about this_co_ _lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/17014-masterk/?do_eq_hovercard_qt_ data-mentionid_eq__qt_17014_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/17014-masterk/_qt_ rel_eq__qt__qt__gt_@MasterK_lt_/a_gt_...\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1KRMMG%235_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1KRMMG#5_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI was thinking _qt_above_qt_ meant _qt_in-front-of_qt__co_ but nooo.  You said it correctly the first time.  Duh_co_ Wingnut!  I think I got it_co_ now.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSee line 91?  We return an object_co_ with two properties...  _lt_em_gt_canvas_lt_/em_gt_ and _lt_em_gt_node_lt_/em_gt_.  Now look way down at line 221.  I parent the node to the camera.  That_t_s ONE way to keep a world space canvas ... docked to screen bottom_co_ eh?  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tI built a cool new button generator func at line 17.  It requires quite a mouthful of salad parameters to make it start running.  It_t_s called repeatedly at lines 67-74.  Purina button chow!  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tHow we doing now_co_ MasterK?  I bet THIS is what you were wanting.   Yep_co_ yep_co_ yep.  If you swing the camera around a bit_co_ you may see the ground interfere with the gui.  That is because the ground is BIG_co_ and the gui has a z-position of 300 (in line 4).  Even though the World Space Canvas is parented to the camera_co_ it is still 300 units away from the camera_co_ I believe.  Some experimenting and tweaking might be needed. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tWe also might need to look-into scaling-upon-screen-resize_co_ too.  And _lt_em_gt_defaultColor_lt_/em_gt_ in the docs (text2D)_co_ really means _lt_em_gt_defaultFontColor_lt_/em_gt_.  The system is still evolving_co_ so I guess we_t_ll let that slide_co_ for now.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_ I think I_t_ll ping  _lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/18979-nockawa/?do_eq_hovercard_qt_ data-mentionid_eq__qt_18979_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/18979-nockawa/_qt_ rel_eq__qt__qt__gt_@Nockawa_lt_/a_gt_ to come visit_co_ if only for his good company.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tHope this helps.  Party on!\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-20T03:12:35Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_136771_qt_ data-ipsquote-contentid_eq__qt_23837_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1468957004_qt_ data-ipsquote-userid_eq__qt_5733_qt_ data-ipsquote-username_eq__qt_Wingnut_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t7 hours ago_co_ Wingnut said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tHow we doing now_co_ MasterK?  I bet THIS is what you were wanting. \n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tIt seems great! Thanks.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_ll study.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-20T05:29:17Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/?do_eq_hovercard_qt_ data-mentionid_eq__qt_5733_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/_qt_ rel_eq__qt__qt__gt_@Wingnut_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIt_t_s a little hard to set exact width and height by using z value of canvas2d...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tNow i know i should use worldSpaceCanvas.  And my screen is 1136*640_co_ i use a arcCamera_co_ worldCanvasNode_t_s parent is the camera_co_ like you did. How can i fit a 1136*100 UI on the top of screen?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tif z is too big_co_ the ui will always behind the other 3d meshes.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tif z is little_co_ scale worldspacenode_co_ content will blur...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tif use 114*10 as node size_co_ position will not very simple...\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-20T13:09:25Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tYes_co_ I agree with all.  Canvas 2D is new_co_ still evolving_co_ and we need more time and experiments to see when/where it is useful.  Let_t_s look at a _qt_viewports_qt_ method.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//playground.babylonjs.com/#1VXHZA_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//playground.babylonjs.com/#1VXHZA_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThat is ONLY a picture in the lower viewport.  But _lt_strong_gt_what if_lt_/strong_gt_ that lower panel was an HTML DIV?  (placed inside the canvasZone div_co_ above/below the HTML canvas element).  Could your project use HTML _qt_form widgets_qt_ to create your UI?  By using an HTML _qt_form_qt_ in that lower viewport area_co_ you get the clicking and dragging features of HTML_co_ plus you get HTML _qt_flow_qt_ or absolute positions_co_ plus CSS positions_co_ paddings_co_ margins_co_ borders_co_ etc.  There are lots of advantages to using HTML for your control panel.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tBut I heard rumor that Android devices using CocoonJS... can_t_t access the DOM_co_ so HTML UI doesn_t_t work there.  That is one of the reasons that our friends coded CastorGUI_co_ bGUI_co_ and Dialog.  If you use HTML for the UI_co_ you probably say goodbye to these devices.  darn_co_ eh?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThere_t_s another way.  Look at this.  _lt_a href_eq__qt_http_dd_//playground.babylonjs.com/#13TVWJ_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//playground.babylonjs.com/#13TVWJ_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis time_co_ a camera view is in the bottom panel.  In fact_co_ the 2 thin blue lines are also viewports and camera views - of a blue plane placed at -500_co_ 0_co_ -500 (see line 74).\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis type of system allows you to build a UI panel out of mesh.  You would manually _qt_model_qt_ buttons_co_ labels_co_ readouts_co_ sliders_co_ listboxes_co_ etc... out of mesh.  When done_co_ you shoot a camera at them and put the camera view in the control panel.  Not an easy task_co_ whatsoever_co_ and the UI is certain to look _qt_different_qt_ and have far less functionality than other UI.  Yet_co_ it CAN be done_co_ and it is super-cross-browser because... the UI is webGL.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThere is no _qt_perfect solution_qt_ in UI for scene controls.  At least I can_t_t think of one.  If I had to build a control panel for a scene_co_ I would use HTML (so far).  Canvas2D certainly has a great future to do such things_co_ but maybe_co_ not yet.  Still needs _qt_evolve time_qt__co_ perhaps.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOthers have suggested multiple BJS scenes and/or multiple BJS engines/canvas.  I don_t_t know how many of our issues... that would solve.  Thoughts?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think... the best UI we have _qt_near_qt_ our webGL canvas_co_ so far_co_ is HTML.  I don_t_t know if we can incorporate XUL or XAML.  Generally speaking_co_ Firefox uses XUL to make it_t_s UI widgets.  IE _lt_em_gt_might_lt_/em_gt_ use XAML as its UI widget maker.  SO_co_ the chances to get XUL or XAML working cross-browser... is slim.  And using XUL or XAML for mobile devices?  Probably not easy or perhaps impossible.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI wish I could give you more options and hope.  Thoughts?  Maybe others will visit and give opinions.  I hope I didn_t_t tell you anything incorrect.  I_t_ll keep thinking.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-21T01:56:31Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/?do_eq_hovercard_qt_ data-mentionid_eq__qt_5733_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/_qt_ rel_eq__qt__qt__gt_@Wingnut_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI use The html things in our last project_co_ I made a library of UI but not CastorGUI or bGUI(because they are not satisfy our need).  And i use 2 canvas/engine/scene to handle front/behind relationship. That_t_s ugly but finally solve our problem.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tNow we have a new project so i dont want to use HTML in core game_co_ (maybe some not important place can also use html). And as i said html and one canvas cant handle position-z questions. If html can do_co_ ScreenSpaceCanvas also can do.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI have a thought_co_ use two camera_co_ one is orth**** camera_co_  to set worldSpaceCanvas_co_ so that any z-postion have same look. And use a free or arc camera to display 3d meshes. Use layerMask to separate them. Then ui and 3d mesh can mixed.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI dont know if it_t_s ok. Maybe not.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-21T02:04:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tPLUS_co_ html image has cross-origin problem_co_ very trouble...\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-21T02:50:03Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI try two camera.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThey have draw order_co_ so ui and 3d mesh in different camera can_t_t mix zOrder.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-21T03:32:22Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tand this is the final solution_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tbottom_dd_ 3d scene\n_lt_/p_gt_\n\n_lt_p_gt_\n\tthen UI_dd_{\n_lt_/p_gt_\n\n_lt_p_gt_\n\tbottom_dd_ ORTHOGRAPHIC_CAMERA and world space canvas\n_lt_/p_gt_\n\n_lt_p_gt_\n\tmiddle_dd_ mesh camera\n_lt_/p_gt_\n\n_lt_p_gt_\n\ttop_dd_ ORTHOGRAPHIC_CAMERA and world space canvas(screen space is ok_co_ but position value is not same with bottom ui)\n_lt_/p_gt_\n\n_lt_p_gt_\n\t}\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-21T04:18:07Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tCool!  I would love to see screen grab.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhat is mesh cam?  Single mesh (the selected mesh) ?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMaybe I will try a playground the same_co_ tomorrow.  Ortho camera...  good idea!  Well done.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-07-21T04:39:35Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tanother problem.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tworld space canvas can_t_t handle pointerEvent... Don_t_t know is that a bug..\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo i should use screen Canvas  in UI_t_s top.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMesh cam can be any... just show some 3d content on the bottom ui...like first i said in this topic.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-31T06:37:43Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\toh_co_ sorry_co_ _lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/17014-masterk/?do_eq_hovercard_qt_ data-mentionid_eq__qt_17014_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/17014-masterk/_qt_ rel_eq__qt__qt__gt_@MasterK_lt_/a_gt__co_ I didn_t_t notice your follow-on question.  Um_co_ hmm. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_m not sure what you mean.  _lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1KRMMG%235_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1KRMMG#5_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIn that demo_co_ we do picks/clicks (on the primitives)... using worldspacecanvas.  Clicks are pointer events.  Sort-of.  *shrug*  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tLet me think.  What other pointer events exist?  OnPointerOver_co_ onPointerOut_co_ umm... are there more?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOk_co_ remember that there is a mesh used for worldSpaceCanvas?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1KRMMG%238_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1KRMMG#8_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tLook at lines 221-223.  A mesh (I named it _lt_em_gt_canvMesh_lt_/em_gt_)... is returned from the createC2D call_co_ and we parented it to camera.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tNow look at lines 225 - 234.  I attached an actionManager to the mesh_co_ and then registered a pointerOver and pointerOut action.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo now_co_ you can mouse-over the red part of the button panel_co_ and it will turn green (color2).  Mouse-out_co_ and it goes back to red (color1).\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI don_t_t know if this is the _qt_proper way_qt_ to do mouse over/out events on a world space canvas 2d_co_ but it sure seems to work.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tDid I understand your issue?  I hope so.  If I misunderstood_co_ please explain again and use a playground to show me the issue.  thx!\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think pointerOver and pointerOut already works for primitives (like text2D_co_ rectangle2D_co_ etc).  I think there are some playground demos that use it. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tBe well_co_ talk soon.  Sorry for the slow reply.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-07-31T13:16:00Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI see the discussion in the _lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/topic/24100-the-worldspacecanvas-cant-use-pointevent-in-orthographic_camera/_qt_ rel_eq__qt__qt__gt_other thread_lt_/a_gt__co_ now.  I_t_m off-topic_co_ I think.  Oh well.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tThe pictures helped much.  A 3Dcontext canvas... right in the middle of a worldspacecanvas.  Cool.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMaybe we need a Canvas3d2d custom primitive.  _lt_img alt_eq__qt__dd_D_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_biggrin.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/biggrin@2x.png 2x_qt_ title_eq__qt__dd_D_qt_ width_eq__qt_20_qt_ /_gt_  I suppose it could be a renderTarget texture (a camera view as a texture) ...used for a Sprite2d.  hmm.  Canvas2D on all 4 sides (Rect2D_t_s?)_co_ and a Sprite2D of the 3d rendering... in the center.  hmm.  Nice challenge.  Not sure if anyone has tried a renderTarget texture on a Sprite2D_co_ yet.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tBut yeah_co_ clicking mesh_co_ on a renderTarget textured Sprite2D... won_t_t work.  hmm.  Perhaps it needs FOUR worldSpaceCanvas parented to the camera... one bottom_co_ one top_co_ one left_co_ one right.  Wow.  I think I_t_m going to try it.  _lt_img alt_eq__qt__dd_o_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_ohmy.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/ohmy@2x.png 2x_qt_ title_eq__qt__dd_o_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_strong_gt_update_dd_  _lt_/strong_gt__lt_a href_eq__qt_http_dd_//babylonjs-playground.com/#1KRMMG%2311_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//babylonjs-playground.com/#1KRMMG#11_lt_/a_gt_  - Gruesome!  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_  And fun!\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"MasterK","Date":"2016-08-01T01:59:33Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/?do_eq_hovercard_qt_ data-mentionid_eq__qt_5733_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/5733-wingnut/_qt_ rel_eq__qt__qt__gt_@Wingnut_lt_/a_gt_ Thank you for spend lots of time.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think the most important question between your solution and my need is Orthographic camera can use exact position but your  _qt_add parent_qt_ method is hard to set position...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnd maybe nockawa is fixing orthographic camera worldspacecanvas problem.. I_t_m just waiting for him... haha...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI find out all canvas2d bug that stop our project process. If they_t_re solved_co_ we can go ahead freely~\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]