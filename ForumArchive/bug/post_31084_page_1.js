[{"Owner":"Paradine","Date":"2017-06-15T09:16:25Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tEven main demo does not work_dd__lt_br /_gt__lt_a href_eq__qt_http_dd_//www.babylonjs.com/demos/gui/_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs.com/demos/gui/_lt_/a_gt__lt_br /_gt__lt_br /_gt_\n\tFails here_dd_\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_ try {\n    o _eq_ r.getBoundingClientRect().top - e.getBoundingClientRect().top_co_ r.style.verticalAlign _eq_ _qt_baseline_qt__co_ s _eq_ r.getBoundingClientRect().top - e.getBoundingClientRect().top_sm_\n }\n finally {\n    n.remove()_sm_\n }_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2017-06-15T12:55:21Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI think we need to use_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_code_gt__lt_span style_eq__qt_color_dd_#101094_sm__qt__gt_this_lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_._lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_parentNode_lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_._lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_removeChild_lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_(_lt_/span_gt__lt_span style_eq__qt_color_dd_#101094_sm__qt__gt_this_lt_/span_gt__lt_span style_eq__qt_color_dd_#303336_sm__qt__gt_)_sm__lt_/span_gt__lt_/code_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tfor ie11\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2017-06-15T13:00:13Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tsee the polyfill section\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_https_dd_//developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2017-06-15T15:30:18Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tCan you do a PR? \n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2017-06-15T17:18:45Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tI will tonight.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Paradine","Date":"2017-06-17T09:42:28Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_pre_gt_\n_lt_code_gt_e.prototype._localDraw _eq_ function (t) {\n                t.save()_co_ t.beginPath()_co_ t.ellipse(this._currentMeasure.left + this._currentMeasure.width / 2_co_ this._currentMeasure.top + this._currentMeasure.height / 2_co_ this._currentMeasure.width / 2 - this._thickness / 2_co_ this._currentMeasure.height / 2 - this._thickness / 2_co_ 0_co_ 0_co_ 2 * Math.PI)_co_ t.closePath()_co_ this._background &amp_sm_&amp_sm_ (t.fillStyle _eq_ this._background_co_ t.fill())_co_ this._thickness &amp_sm_&amp_sm_ (this.color &amp_sm_&amp_sm_ (t.strokeStyle _eq_ this.color)_co_ t.lineWidth _eq_ this._thickness_co_ t.stroke())_co_ t.restore()_sm_\n}_co__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tThx my code started working as I dont use ellipse_co_ but yours demo does not still work._lt_br /_gt_\n\tIE11 has new bugs come out_dd__lt_br /_gt_\n\tSCRIPT438_dd_ Object doesn_t_t support property or method _t_ellipse_t_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2017-06-19T16:23:13Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tShould be good now\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]