[{"Owner":"The Leftover","Date":"2018-01-03T21:22:06Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI had a huge loading performance a couple days ago.  I have gotten past it now but it seems like something you should know about.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI was trying to load a *lot* of meshes_co_ say up to 20_co_000_co_ and ran into a serious wall below that.  The time for the first render completion was over a minute.  I did the most practical thing_co_ hit pause a few times to see what the system was doing.  My system was spending all of its time in a FOR loop in Material.prototype._markAllSubMeshesAsDirty.  (Attach 1)  getScene().meshes is all of my meshes_co_ so this was a long FOR loop.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThe plot thickens because it was a downstream side-effect of another FOR loop Scene._evaluateActiveMeshes.  This FOR loop was also the length of all of my meshes.  So_co_ my first render was blocked by an n-squared algorithm that evaluating dirtiness.  Lots and lots of dirtiness.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI got past this with a hack_co_ initially.  I disabled Material.prototype._markAllSubMeshesAsDirty for the *first* *render* only.  No ill effects.  Later_co_ I started merging meshes.  Let me tell you_co_ the mesh merging is the bomb!  It changed everything for my application.  Instances_co_ yawn.  Clone_co_ snore.  Merging killed it.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI do 3-d graphs and there are a lot of similar meshes (everything is a hexagon_co_ for starters).  In my tests_co_ I could reduce independent mesh count by a factor of twenty.  Now I am loading 150K hexes fast and with good frame rate.   _lt_img alt_eq__qt__dd_D_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_biggrin.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/biggrin@2x.png 2x_qt_ title_eq__qt__dd_D_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tI archived the original problem child at _lt_a href_eq__qt_http_dd_//www.brianbutton.com/chart3d/carthagevirgin.html_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.brianbutton.com/chart3d/carthagevirgin.html_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt__lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2018_01/PausePoint.png.c28845f0a40b4611e731fd911811aac5.png_qt_ class_eq__qt_ipsAttachLink ipsAttachLink_image_qt__gt__lt_img data-fileid_eq__qt_16492_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2018_01/PausePoint.png.c28845f0a40b4611e731fd911811aac5.png_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ alt_eq__qt_PausePoint.png_qt__gt__lt_/a_gt__lt_/p_gt_\n_lt_p_gt__lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2018_01/HigherUpTheStack.png.4dc159b19cb8b2a99ec1a4de6f893c03.png_qt_ class_eq__qt_ipsAttachLink ipsAttachLink_image_qt__gt__lt_img data-fileid_eq__qt_16493_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2018_01/HigherUpTheStack.png.4dc159b19cb8b2a99ec1a4de6f893c03.png_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ alt_eq__qt_HigherUpTheStack.png_qt__gt__lt_/a_gt__lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-01-03T22:26:31Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tThank you for sharing with us!\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]