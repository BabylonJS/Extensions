[{"Owner":"altreality","Date":"2014-10-04T18:57:29Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_I want to apply a force in the local space of a body._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_But I only see a function to apply it in world space in _lt_a href_eq__qt_http_dd_//blogs.msdn.com/b/eternalcoding/archive/2013/12/19/create-wonderful-interactive-games-for-the-web-using-webgl-and-a-physics-engine-babylon-js-amp-cannon-js.aspx_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//blogs.msdn.com/b/eternalcoding/archive/2013/12/19/create-wonderful-interactive-games-for-the-web-using-webgl-and-a-physics-engine-babylon-js-amp-cannon-js.aspx_lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_under _qt__lt_span style_eq__qt_color_dd_rgb(66_co_66_co_66)_sm_font-family_dd__t_Segoe UI_t__co_ _t_Lucida Grande_t__co_ Verdana_co_ Arial_co_ Helvetica_co_ sans-serif_sm_font-size_dd_1.35em_sm__qt__gt_Applying an impulse_lt_/span_gt__qt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Is there any direct function to apply a force in an object_t_s local space ?_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2014-10-06T18:40:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_just convert your local vector to world vector with_dd_ Vector3.TransformCoordinates(localVector_co_ worldMatrix)_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Stephen Andrews","Date":"2014-10-27T13:57:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_blockquote data-ipsquote_eq__qt__qt_ class_eq__qt_ipsQuote_qt_ data-ipsquote-contentcommentid_eq__qt_57105_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentid_eq__qt_9644_qt_ data-ipsquote-username_eq__qt_Deltakosh_qt_ data-cite_eq__qt_Deltakosh_qt_ data-ipsquote-timestamp_eq__qt_1412620827_qt__gt__lt_div_gt__lt_div_gt__lt_p_gt_just convert your local vector to world vector with_dd_ Vector3.TransformCoordinates(localVector_co_ worldMatrix)_lt_/p_gt__lt_/div_gt__lt_/div_gt__lt_/blockquote_gt__lt_p_gt_Sorry to bump_co_ but how would one get access to the world matrix? I can_t_t tell exactly where it is_co_ as scene has three different types of matrixes._lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2014-10-27T16:35:02Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_you can get a mesh_t_s worldmatrix_dd_ mesh.getWorldMatrix()_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]