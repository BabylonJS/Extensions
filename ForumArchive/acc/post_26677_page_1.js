[{"Owner":"Matriax","Date":"2016-11-28T19:04:24Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI_t_m using Blender and i have no much idea but happens two things_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t1.- A Ramp/Plane slide me down.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI tried to set various things but nothing worked. I can walk over the ramp and climb without problems but if i release the action to walk slide me down.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t2.- Even a small box the camera get stucked.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOnly if i set a giant ellipsoid to the camera i can walk over the objects.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tA friend with 3Dmax do it correctly but with blender i can_t_t get it.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tSo_co_ In babylon_co_ there is no way to simply set the maximun size X/Y/Z of what the ellipsoid camera can walk over? And set how much degrees can walk over without sliding? Instead to set object by object the properties a camera or our mesh.player can do?.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-11-29T00:36:30Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello this is define by two values_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t - camera.ellipsoid\n_lt_/p_gt_\n\n_lt_p_gt_\n\t- scene.gravity\n_lt_/p_gt_\n\n_lt_p_gt_\n\tTo reduce the sliding_co_ just reduce gravity.y\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Matriax","Date":"2016-11-29T12:01:10Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSeems was problem of the Scale of the scene that was too tiny.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWith a bigger scene with the same properties and chaning the ellipsoid to be the same tall now seems i can walk over the objects that before was impossible.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAlso removing some X and Z from the ellipsoid the ramp not slide me and i can keep the scene gravity to -9 .\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]