[{"Owner":"En929","Date":"2016-04-12T05:29:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tWhen I did 2D coding game coding_co_ in my games I had a _qt_if collision_qt_ function statement that stated _qt_if_qt_ a specific object collided with another specific object then something happens as in the code function below (I wrote notes in the code below to explain what the entities do)_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_//Note that the _qt_o_qt_ means object as in _qt_Object X_sm__qt_ oy means _qt_Object Y_co__qt_ and so forth.\n//Also note that _qt_e_qt_ means enemy as in _qt_Enemy X_sm__qt_ ey means _qt_Enemy Y_co__qt_ and so forth.\n\nfunction Collision(ox_co_ oy_co_ ow_co_ oh_co_ ex_co_ ey_co_ ew_co_ eh) {\n\n\n     \n \n    if (ox &gt_sm_ ex &amp_sm_&amp_sm_ ox &lt_sm_ ex + ew &amp_sm_&amp_sm_ oy &gt_sm_ ey &amp_sm_&amp_sm_ oy &lt_sm_ ey + eh) {\n                return true_sm_\n    }\n    if (ox + ow &lt_sm_ ex + ew &amp_sm_&amp_sm_ ox + ow &gt_sm_ ex &amp_sm_&amp_sm_ oy &gt_sm_ ey &amp_sm_&amp_sm_ oy &lt_sm_ ey + eh) {\n                return true_sm_\n    }\n    if (oy + oh &gt_sm_ ey &amp_sm_&amp_sm_ oy + oh &lt_sm_ ey + eh &amp_sm_&amp_sm_ ox &gt_sm_ ex &amp_sm_&amp_sm_ ox &lt_sm_ ex + ew) {\n                return true_sm_\n    }\n    if (oy + oh &gt_sm_ ey &amp_sm_&amp_sm_ oy + oh &lt_sm_ ey + eh &amp_sm_&amp_sm_ ox + ow &lt_sm_ ex + ew &amp_sm_&amp_sm_ ox + ow &gt_sm_ ex) {\n                return true_sm_\n    }\n }_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThen I would just call the above function as in let_t_s say getting a _qt_player_qt_ character and an _qt_enemy_qt_ character to collide_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_//      \n\n\nif (Collision(playerX_co_ playerY_co_ playerWidth_co_ playerHeight_co_ enemyX_co_ enemyY_co_ enemyWidth_co_ enemyHeight)){\n\n     //Here is where we_t_d choose what happens when the player and an enemy collides\n\n\n} _lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnd I could call on the same collision function throughout my game if I wanted an event to happen after a collision. Thus_co_ I was trying to figure out how to do a similar type of _qt_if collision_qt_ process/statement in Babylon.js. Does anybody know one? Thanks!\n_lt_/p_gt_\n\n_lt_p_gt_\n\tBTW_co_ if anybody is doing 2D game programming in JavaScript_co_ feel free to use the above collision code if you need one. It_t_s a rectangle collision code that works well. Thanks again!\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"RaananW","Date":"2016-04-12T07:07:41Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis is already implemented in the framework. You can find info here_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/tutorials/Cameras_co__Mesh_Collisions_and_Gravity_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/tutorials/Cameras_co__Mesh_Collisions_and_Gravity_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/tutorials/Intersect_Collisions_-_mesh_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/tutorials/Intersect_Collisions_-_mesh_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOr using the physics engine_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/overviews/Using_The_Physics_Engine_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/overviews/Using_The_Physics_Engine_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]