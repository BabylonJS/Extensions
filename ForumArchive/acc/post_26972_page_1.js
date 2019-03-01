[{"Owner":"X3MC2","Date":"2016-12-10T20:44:47Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi there_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_m stuck and I can_t_t seem to find a workaround for achieving this_co_ basically what I wanna do is set the Camera as a parent for a small Platform which has a Box impostor of Mass 0_co_ and make a crate which also has physics (Mass 1) land on it. But the problem is that the platform acts as if it has no physics at all_co_ instead of landing on it_co_ the crate goes through _co_ here is the PG _dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#18UP4N_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#18UP4N_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tAny help would be really appreciated. Thanks. \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-12-11T01:45:07Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi again X3_co_ good to see ya.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t    You are mixing the BJS built-in collision system... with 3rd party physics engine stuff.  CAN be done... but... carefully.  Most people don_t_t mix them.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo_co_ let_t_s go with the all-physics engine version_co_ and _lt_strong_gt_turn off_lt_/strong_gt_ all that ellipsoid_co_ checkCollision_co_ etc.  We_t_ll save that for a rainy day.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#18UP4N%231_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#18UP4N#1_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThere_t_s the physics-only box-drop_co_ looking proper.  I switched to arcRotateCam because I like them better.  heh.  AND... I _lt_em_gt_had to _lt_/em_gt_NOT SET platform.parent _eq_ camera (line 29).  It seems that physics impostors HATE being parented to camera.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_  Not sure why.  I _lt_em_gt_think_lt_/em_gt_ they hate being parented to anything.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIs there a way to avoid parenting platform to camera... for your project?  Would that be ok?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tGenerally speaking_co_ physics impostors love to be free.  They dislike being controlled by parents (don_t_t we all?)  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tThere might be other ways to keep camera _qt_soft-attached_qt_ to platform... that won_t_t bother impostors.  I will await your words and keep thinking.  Others may comment.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"X3MC2","Date":"2016-12-11T02:12:10Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi there Mr.Wingnut _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt_ _co_ actually I need to parent the greenbox to the camera (Player) _co_ I_t_m working on a small demo where you play as a steward (The camera)  and have to deliver a cup (The crate) on a platter (The green box) while avoiding dropping it. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo the greenbox should be carried_co_ and the only way to do this is to set the camera as its parent_co_ but there is something wrong with the parenting of a rigid body_co_ after some invistigation_co_ it turns out that parenting does not dispose the physics impostor of the child_co_ the physics body is still there but does not follow its mesh anymore after parenting. Its like the parenting is only applied to the physicsImpostor.object_co_ the physicsImpostor.body and its shape are being left alone. Well atleast this is what I noticed after some tests.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOne more thing_co_ I cannot create a compound object between the camera and the greenbox since the camera does not have physics_co_ and even if I do add a physics impostor to it_co_ it does not work well with the native controls.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Wingnut","Date":"2016-12-11T13:00:03Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tYes_co_ your tests are perfectly accurate and show expected behavior.  And thanks for telling me the premise of your project... that helps us all... think of other ideas.\n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_154677_qt_ data-ipsquote-contentid_eq__qt_26972_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1481422330_qt_ data-ipsquote-userid_eq__qt_23600_qt_ data-ipsquote-username_eq__qt_X3MC2_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t11 hours ago_co_ X3MC2 said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tit turns out that parenting does not dispose the physics impostor of the child\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tCorrect.  Do you think the platter (green box) should turn off it_t_s physics when it is parented to something?  If it does_co_ the crate (cup/goblet) will immediately fall-through the platter_co_ yes?\n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_154677_qt_ data-ipsquote-contentid_eq__qt_26972_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1481422330_qt_ data-ipsquote-userid_eq__qt_23600_qt_ data-ipsquote-username_eq__qt_X3MC2_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t11 hours ago_co_ X3MC2 said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tthe greenbox should be carried_co_ and the only way to do this is to set the camera as its parent\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tAre you SURE it is _qt_the only way_qt_?  What if you turned OFF the camera keypresses_co_ and instead use keypresses to _qt_drive_qt_ the green box itself_co_ and maybe the camera follows the greenbox/platter?   In _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#1YOCO9%231_qt_ rel_eq__qt_external nofollow_qt__gt_this playground_lt_/a_gt__co_ line 49 proves that cameras can follow physics-active mesh.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWith this new direction of thought_co_ now you need to study how to move a physics-active mesh... with keypresses/mouse/whatever.  This is one avenue.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThere is another avenue.  Turn OFF the physics engine_co_ and _qt_fake_qt_ the physics (go back to built-in system... scene gravity_co_ intersectsMesh_co_ checkCollisions_co_ etc).  No physics enabled.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI think_co_ with the built-in gravity system_co_ ONLY cameras are affected by it.  So_co_ box won_t_t drop by itself.  Even though parenting things to the camera... is much more _qt_plausible_qt_ (wise) when no physics engine is turned-on_co_ let_t_s STILL not parent to the camera.  Let_t_s ONLY do camera.setTarget(whatever)... okay?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo where does that leave us?  You must make the box fall... yourself.  We have an excellent utility function for moving .checkCollision-active mesh...  moveWithCollisions().  Many users place one inside the render loop_co_ and then adjust its _qt_throttle_qt__co_ leaving it at zero-throttle when not needed. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis is fine_co_ you can probably figure out how to do that.  BUT... the game is _qt_about_qt_ balancing one thing atop another... while walking.  SO... now we have troubles for a non-physics-active scene.  We would need to _qt_fake_qt_ the whole balancing system_co_ too.  When player.move(forward)... we need to fake a _qt_goblet wants to tip-over backwards_qt_ simulation_co_ yes?  If the goblet/vase/beverage rotates too far_co_ it goes beyond its fulcrum point_co_ and tips over... UNLESS... the steward quickly pulls the tray towards himself_co_ or takes a fast half-step backwards.  You would need to create the entire system... that fakes this activity.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAlthough building the fake physics to do this... might seem difficult_co_ it might not be.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tSOME adventurous people might try building the _qt_proof of concept_qt_ using BOTH methods.  I think you will find that the fake physics will be faster and easier to have full-control-over.  The physics engine version will be more realistic.  The goblet might bounce a bit... when it tips over on the tray.  Then some potential rolling_co_ and possibly falling to the floor_co_ with a little bounce and roll_co_ there_co_ too.  It would be LOTS of work to _qt_fake_qt_ those tiny details.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tBack to the physics... you will want to _qt_walk_qt_ the green box.  I suggest using WASD position keys at this time.  Possibly use Q and E as rotate-around-Y  (steward turns).  Would you want to try to move (applyImpulse) the greenbox... in a way that is similar to a human walking?  I think that can be done.  Start with a physics-active box on the floor (like greenbox).  Give him high friction_co_ and then whack him with an impulse from behind (thrust vector 0_co_ 0_co_ 3 perhaps)... applied at player center [player.getAbsolutePosition()].  That should shove him forward a few units... and he_t_ll slide to a stop due to friction.  Later_co_ player will likely be invisible_co_ yet still physics active and taking thrustings.  Greenbox platter might be compounded or tight-jointed to him.  And our beverage goblet placed gently atop the greenbox serving tray.  Thrust gently with the wasd keys_co_ Mister Steward_co_ or you will tip over that huge stack of pancakes.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tWaiter/Waitress training school!  Fun idea_co_ X3!  And it should be darned fun to code_co_ too.  Make sure your mind is free from limiting thoughts such as camera _eq__eq_ player.  That is not necessarily true.  We can disconnect the keypresses from camera_co_ and attach them to other things_co_ or use different keys_co_ or never attachCamera to canvas.  InvisibleBox _eq__eq_ player_co_ sometimes_co_ too_co_ yes?  Camera can ride-along behind_co_ in a tow-along camera wagon.  _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tJust some idea/thoughts.  Hope this helps.  You don_t_t NEED to use applyImpulse to thrust physics objects.  You can also set their velocity/linearVelocity_co_ and also set their angularVelocity_co_ for rotating.  But you must use friction_co_ or restitution-free invisible stoppers_co_ to stop physics motion.  OR... just go set body.linearVelocity to 0_co_0_co_0... when you want it stopped.  If you are really good_co_ you can make the linearVelocity adjustments you do... _qt_act_qt_ like human walking steps.  A little heavy-on initial take-off horsepower_co_ a softer foot-moving-forward time period_co_ then the heel hits the floor (a potential Y-axis jarring)_co_ and then ball of foot hits floor (a smaller jarring)_co_ and then... possibly stop forward movement... possibly by using an _qt_inverse_qt_ thrust to zero linearVelocity.  (a taper to stop).  (braking thrusters)  _lt_img alt_eq__qt__dd_D_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_biggrin.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/biggrin@2x.png 2x_qt_ title_eq__qt__dd_D_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"X3MC2","Date":"2016-12-11T15:39:46Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tForced the physics to update the body of the child_co_ now it seems to work_dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#18UP4N_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#18UP4N_lt_/a_gt_#2\n_lt_/p_gt_\n\n_lt_p_gt_\n\tBut its nowhere near a robust solution_co_ it needs more tweaking .\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]