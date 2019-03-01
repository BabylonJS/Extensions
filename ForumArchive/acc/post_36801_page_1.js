[{"Owner":"Hagop","Date":"2018-04-02T16:50:44Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi all\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI needed to know if my free camera is moving or looking forward (+ve z) or backward (-ve z) at any given time. So I wrote the following code. \n_lt_/p_gt_\n\n_lt_p_gt_\n\t _lt_span style_eq__qt_color_dd_#c0392b_sm__qt__gt__lt_em_gt_var createScene _eq_ function () {_lt_br /_gt_\n\t             var scene _eq_ new BABYLON.Scene(engine)_sm__lt_br /_gt_\n\t            var camera _eq_ new BABYLON.TouchCamera(_qt_TouchCamera1_qt__co_ new BABYLON.Vector3(0_co_ 10_co_ -60)_co_ scene)_sm__lt_br /_gt_\n\t            camera.speed _eq_ 6_sm__lt_br /_gt_\n\t            scene.activeCamera _eq_ camera_sm__lt_br /_gt_\n\t            camera.attachControl(canvas_co_ true)_sm__lt_br /_gt_\n\t              var light _eq_ new BABYLON.HemisphericLight(_qt_light1_qt__co_ new BABYLON.Vector3(0_co_ 1_co_ 0)_co_ scene)_sm__lt_br /_gt_\n\t                var ground _eq_ BABYLON.Mesh.CreateGround(_qt_ground1_qt__co_ 460_co_ 460_co_ 2_co_ scene)_sm__lt_br /_gt_\n\t        _lt_br /_gt_\n\t            return scene_sm__lt_br /_gt_\n\t        _lt_br /_gt_\n\t        }_sm__lt_br /_gt_\n\t        _lt_br /_gt_\n\t       var scene _eq_ createScene()_sm__lt_br /_gt_\n\t        _lt_br /_gt_\n\t        var switchDirection _eq_ false_sm__lt_br /_gt_\n\t        var rayZ_sm__lt_br /_gt_\n\t        var previousRayZ_sm__lt_br /_gt_\n\t        _lt_br /_gt_\n\t        scene.registerBeforeRender(function () {_lt_br /_gt_\n\t                _lt_br /_gt_\n\t            if(scene.isReady())_lt_br /_gt_\n\t            {    _lt_br /_gt_\n\t              scene.activeCamera.position.y _eq_ 20_sm__lt_br /_gt_\n\t               directionRay _eq_ BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position_co_ scene.activeCamera.getTarget()).direction_sm__lt_br /_gt_\n\t               rayZ _eq_ directionRay.z_sm__lt_br /_gt_\n\t            _lt_br /_gt_\n\t                if ( (rayZ &gt_sm_0 &amp_sm_&amp_sm_ previousRayZ &lt_sm_0) || (rayZ &lt_sm_0 &amp_sm_&amp_sm_ previousRayZ &gt_sm_0) )_lt_br /_gt_\n\t                       {_lt_br /_gt_\n\t                         switchDirection _eq_ true_sm__lt_br /_gt_\n\t                        console.log(_qt_rayZ _qt_ +rayZ)_sm__lt_br /_gt_\n\t                        console.log(_qt_previousRayZ _qt_ +previousRayZ)_sm__lt_br /_gt_\n\t                    }_lt_br /_gt_\n\t                                                _lt_br /_gt_\n\t                if (switchDirection _eq__eq_ true)_lt_br /_gt_\n\t                    {_lt_br /_gt_\n\t                        switchDirection _eq_ false_sm__lt_br /_gt_\n\t                        //do something_lt_br /_gt_\n\t                    }_lt_br /_gt_\n\t                previousRayZ _eq_ rayZ_sm__lt_br /_gt_\n\t                _lt_br /_gt_\n\t            }_lt_br /_gt_\n\t    })_sm__lt_/em_gt__lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI noticed the following abnormality in the trace when_lt_strong_gt_ moving forward _lt_/strong_gt_with the _lt_strong_gt_keyboard _lt_/strong_gt_(the error does not occur when rotating with the mouse)\n_lt_/p_gt_\n\n_lt_div_gt_\n\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_rayZ -1_lt_/span_gt__lt_/span_gt_ _lt_/span_gt_ _lt_/span_gt_\n_lt_/div_gt_\n\n_lt_div_gt_\n\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_previousRayZ 1_lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt_\n_lt_/div_gt_\n\n_lt_div_gt_\n\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_This means _lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_span style_eq__qt_color_dd_#c0392b_sm__qt__gt__lt_em_gt_scene.activeCamera.getTarget() _lt_/em_gt__lt_/span_gt__lt_span_gt_is less that its position at some stage_co_ whilst it should be always more..._lt_/span_gt_\n_lt_/div_gt_\n\n_lt_div_gt_\n\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_After a lot of _lt_strong_gt_headache _lt_/strong_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_img alt_eq__qt__dd_wub_dd__qt_ data-emoticon_eq__qt__qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_wub.png_qt_ title_eq__qt__dd_wub_dd__qt_ /_gt__lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt__lt_strong_gt_ _lt_/strong_gt_I found out that this error occurs only if the camera speed is  a large number ie_dd_ 5_lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt_\n_lt_/div_gt_\n\n_lt_div_gt_\n\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_The error does _lt_strong_gt_not _lt_/strong_gt_occur_lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt_\n_lt_/div_gt_\n\n_lt_ul_gt_\n\t_lt_li_gt_\n\t\t_lt_span_gt__lt_span_gt__lt_span_gt__lt_span_gt_when I have a mesh in front of the camera parented to the camera_lt_/span_gt__lt_/span_gt__lt_/span_gt__lt_/span_gt_\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tdirectionRay _eq_ scene.activeCamera.getFrontPosition(1).subtract(_lt_span style_eq__qt_color_dd_#c0392b_sm__qt__gt__lt_em_gt_  scene.activeCamera.position_lt_/em_gt__lt_/span_gt_)\n\t_lt_/li_gt_\n_lt_/ul_gt_\n\n_lt_p_gt_\n\tMust be a bug\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-04-02T17:32:41Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello! Can you repro in the playground? It is tough to detect a bug here _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt_1_qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt__gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI copy pasted your code here_dd_ _lt_a href_eq__qt_https_dd_//www.babylonjs-playground.com/#986E06_qt_ ipsnoembed_eq__qt_true_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//www.babylonjs-playground.com/#986E06_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tNow regarding your question_dd_ This happens because you are using beforeRender event. At that time the camera position has been updated but not the target.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tYou may want to instead use afterRender to be sure all info are synchronized_dd_ _lt_a href_eq__qt_https_dd_//www.babylonjs-playground.com/#986E06#1_qt_ ipsnoembed_eq__qt_true_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//www.babylonjs-playground.com/#986E06#1_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tOther option_dd_ You can force the cache to update with camera.getViewMatrix(true)_dd_ _lt_a href_eq__qt_https_dd_//www.babylonjs-playground.com/#986E06#2_qt_ ipsnoembed_eq__qt_true_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//www.babylonjs-playground.com/#986E06#2_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Hagop","Date":"2018-04-02T20:16:00Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tWell Delatosh_co_ if the camera position is updated before the target_co_ then why is it working when camera.speed _eq_ 1 ?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnyhow afterRender  solves the issue.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tFinally where do we specify camera.getViewMatrix(true)  ?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-04-03T19:28:19Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThe getViewMatrix is called automatically at rendering time\n_lt_/p_gt_\n\n_lt_p_gt_\n\tit works with camera.speed _eq_ 1 because the camera does not move enough to go over its target _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt_1_qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt__gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]