[{"Owner":"kpko","Date":"2015-02-17T01:08:50Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Hi guys_co__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I want to bump this topic since nobody answered it yet. I tried to implement matrix interpolation_co_ which led to the problem described here_dd_ _lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/topic/12023-blender-animations-inverting-mesh-normals/_qt__gt_http_dd_//www.html5gamedevs.com/topic/12023-blender-animations-inverting-mesh-normals/_lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_The interpolation itself worked_co_ but we got some weird inverted normals in some models. Since blender exporter only exports key matrices_co_ we can_t_t interpolate these animations. This means we have to create as many keyframes as the frames per second in babylon.js. An animation with 3 keyframes has to be blown up to 60 keyframes if the framerate equals 60 fps. _lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I don_t_t know which operation in my code led to inverted normals_co_ I encountered a strange exported scaling from the Blender exporter as I described in the other thread. Deltakosh was right when he wrote_co_ the animations without interpolations worked. But my question regarding the negative scaling at z axis is still unanswered._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Do we know anyone who knows the Blender exporter and could tell us where the -1 z scaling comes from? Maybe I_t_m wrong in my interpretation of this value_co_ though. Could someone with deeper knowledge of matrices clarify this? _dd_-)_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Looking forward to hear from you guys._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt__lt_strong_gt_For reference_lt_/strong_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_My original thread regarding this issue_dd_ _lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/topic/11753-issues-with-babylonjs-blender-exporter/_qt__gt_http_dd_//www.html5gamedevs.com/topic/11753-issues-with-babylonjs-blender-exporter/_lt_/a_gt__lt_/p_gt__lt_blockquote data-ipsquote_eq__qt__qt_ class_eq__qt_ipsQuote_qt__gt__lt_div_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_span style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_I_t_m having two problems with the exporter for Blender at the moment._lt_/span_gt__lt_br_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_I have 3 key frames in my animation in Blender_co_ the exporter exports 100 key frames (one for each frame in the animation). This doesn_t_t really make sense to me_co_ since we could use those 3 key frames and interpolate. Which leads to my second problem..._lt_/span_gt__lt_br_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_Babylon.js doesn_t_t support interpolation between matrices. I animated the position and rotation of a bone in Blender_co_ so it should export the key frames with the position as a vector3 and the rotation as a quaternion - both data types where Babylon.js could interpolate by itself. Shouldn_t_t the exporter export the simple vectors and quaternions? Or is it possible to somehow interpolate between matrices? _lt_/span_gt__lt_/div_gt__lt_/blockquote_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_My assumption regarding matrix interpolation and the scale values_dd__lt_/p_gt__lt_blockquote data-ipsquote_eq__qt__qt_ class_eq__qt_ipsQuote_qt__gt__lt_div_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt__lt_span style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_Hi again_co__lt_/span_gt__lt_/p_gt__lt_p style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_ _lt_/p_gt__lt_p style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_I think I found a clue leading to the problem. I looked into the file exported by Blender_dd__lt_/p_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_..._lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_skeletons_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_[_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_{_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_name_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_Skeleton_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_id_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_bones_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_[_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_{_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_name_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_pelvis_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_index_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_136_co_0)_sm__qt__gt__qt_matrix_qt__lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__dd__lt_/span_gt__lt_span_gt_ _lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_[_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_1_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_1_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_-_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_1_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_4_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_-_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_0.1425_lt_/span_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt__co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(0_co_102_co_102)_sm__qt__gt_1_lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_]_co__lt_/span_gt__lt_br_gt__lt_span style_eq__qt_color_dd_rgb(102_co_102_co_0)_sm__qt__gt_..._lt_/span_gt__lt_p style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_If you have no rotation_co_ the scale values of the matrix (the values at position 0 (scale x)_co_ 5 (scale y) and 10 (scale z)) would be X_dd_ 1_co_ Y_dd_ 1 and Z_dd_ _lt_strong_gt_-1._lt_/strong_gt_ This could lead to the flipped normals problem. These values are created from the Blender exporter which I_t_m not very familiar with. _lt_/p_gt__lt_p style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_ _lt_/p_gt__lt_p style_eq__qt_color_dd_rgb(40_co_40_co_40)_sm_font-family_dd_helvetica_co_ arial_co_ sans-serif_sm__qt__gt_Maybe my code did reveal that issue because I multiply with those matrices when I do the interpolation. I_t_m still looking into this issue_co_ but could anyone who knows the Blender exporter tell me where the value _qt_-1_qt_ is coming from? Just to be sure _dd_-)_lt_/p_gt__lt_/div_gt__lt_/blockquote_gt__lt_p_gt_ _lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-02-17T01:52:14Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_can you provide simple examples of mesh exported wrong?_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kpko","Date":"2015-02-20T14:29:55Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Hi_co__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I_t_m not sure the mesh is exported wrong though_co_ I want to investigate that with you guys. Could be as well a problem with my interpolation code_co_ but I would really like to have a better understanding of what_t_s going on here _dd_-)_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_One example would be the model from this post_dd_ _lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/topic/12023-blender-animations-inverting-mesh-normals/_qt__gt_http_dd_//www.html5gamedevs.com/topic/12023-blender-animations-inverting-mesh-normals/_lt_/a_gt__lt_/p_gt__lt_p_gt_You can find the link to his exported model here_dd_ _lt_a href_eq__qt_https_dd_//dl.dropboxusercontent.com/u/70260871/webgl/amorgan/figure.zip_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//dl.dropboxusercontent.com/u/70260871/webgl/amorgan/figure.zip_lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_When opening the PlayerBody3.babylon file_co_ I wonder how this matrix was constructed (the first one I_t_ve found on the first bone (pelvis) of the first skeleton)_dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_[1_co_0_co_0_co_0_co_0_co_1_co_0_co_0_co_0_co_0_co_-1_co_0_co_0_co_4_co_-0.1425_co_1]_lt_/pre_gt__lt_p_gt_Given we have no rotation on this model and the scaling is defined as in _lt_a href_eq__qt_https_dd_//www.opengl.org/discussion_boards/showthread.php/159215-Is-it-possible-to-extract-rotation-translation-scale-given-a-matrix_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//www.opengl.org/discussion_boards/showthread.php/159215-Is-it-possible-to-extract-rotation-translation-scale-given-a-matrix_lt_/a_gt__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_[sx 0 0 0]| 0 sy 0 0|| 0 0 sz 0|[ 0 0 0 1]_lt_/pre_gt__lt_p_gt_The scaling would be -1 on z axis. _lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-02-20T17:23:37Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Oh that _lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ alt_eq__qt__dd_)_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ width_eq__qt_20_qt_ height_eq__qt_20_qt__gt_ this is because blender is a right handed system and babylon.js a left handed so to switch hand I invert the z _lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ alt_eq__qt__dd_)_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ width_eq__qt_20_qt_ height_eq__qt_20_qt__gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kpko","Date":"2015-02-22T22:08:06Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Aaah_co_ I see _dd_-) But doesn_t_t this lead to an inverted mesh? I mean_co_ isn_t_t the mesh wrapped inside out after scaling -1 on z?_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-02-23T19:14:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Actually no_co_ this works well (you can test it easily) _lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_wink.png_qt_ alt_eq__qt__sm_)_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/wink@2x.png 2x_qt_ width_eq__qt_20_qt_ height_eq__qt_20_qt__gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"kpko","Date":"2015-02-23T21:24:00Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Ah_co_ because the normals are not influenced by the scaling_co_ I guess_co_ they are laid out separately in the babylon.js file. I guess the problems lies in the composition / decomposition code itself. _lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Thank you very much so far for clarifying those points! _dd_-) Just wanted to make sure it_t_s not one of those more obvious things before I disassemble my current interpolation code._lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I used the following code to decompose the incoming matrix_dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_public decompose(scale_dd_ Vector3_co_ rotation_dd_ Quaternion_co_ translation_dd_ Vector3) {    translation.x _eq_ this.m[12]_sm_    translation.y _eq_ this.m[13]_sm_    translation.z _eq_ this.m[14]_sm_    var xs _eq_ Tools.Sign(this.m[0] * this.m[1] * this.m[2] * this.m[3]) &lt_sm_ 0 ? -1 _dd_ 1_sm_    var ys _eq_ Tools.Sign(this.m[4] * this.m[5] * this.m[6] * this.m[7]) &lt_sm_ 0 ? -1 _dd_ 1_sm_    var zs _eq_ Tools.Sign(this.m[8] * this.m[9] * this.m[10] * this.m[11]) &lt_sm_ 0 ? -1 _dd_ 1_sm_    scale.x _eq_ xs * Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2])_sm_    scale.y _eq_ ys * Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5] + this.m[6] * this.m[6])_sm_    scale.z _eq_ zs * Math.sqrt(this.m[8] * this.m[8] + this.m[9] * this.m[9] + this.m[10] * this.m[10])_sm_    if (scale.x _eq__eq_ 0 || scale.y _eq__eq_ 0 || scale.z _eq__eq_ 0) {        rotation.x _eq_ 0_sm_        rotation.y _eq_ 0_sm_        rotation.z _eq_ 0_sm_        rotation.w _eq_ 1_sm_        return false_sm_    }    var rotationMatrix _eq_ BABYLON.Matrix.FromValues(        this.m[0] / scale.x_co_ this.m[1] / scale.x_co_ this.m[2] / scale.x_co_ 0_co_        this.m[4] / scale.y_co_ this.m[5] / scale.y_co_ this.m[6] / scale.y_co_ 0_co_        this.m[8] / scale.z_co_ this.m[9] / scale.z_co_ this.m[10] / scale.z_co_ 0_co_        0_co_ 0_co_ 0_co_ 1)_sm_    rotation.fromRotationMatrix(rotationMatrix)_sm_    return true_sm_}_lt_/pre_gt__lt_p_gt_which I based on the matrix decomposition code from MonoGame_dd_ _lt_a href_eq__qt_https_dd_//github.com/mono/MonoGame/blob/develop/MonoGame.Framework/Matrix.cs#L1055-L1082_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//github.com/mono/MonoGame/blob/develop/MonoGame.Framework/Matrix.cs#L1055-L1082_lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_I use the builtin vector and quaternion interpolation functions of Babylon.js to interpolate the individual values. After doing that_co_ I compose the matrix again which the Compose method_dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_public static Compose(scale_dd_ Vector3_co_ rotation_dd_ Quaternion_co_ translation_dd_ Vector3)_dd_ Matrix {    var result _eq_ Matrix.FromValues(scale.x_co_ 0_co_ 0_co_ 0_co_        0_co_ scale.y_co_ 0_co_ 0_co_        0_co_ 0_co_ scale.z_co_ 0_co_        0_co_ 0_co_ 0_co_ 1)_sm_    var rotationMatrix _eq_ Matrix.Identity()_sm_    rotation.toRotationMatrix(rotationMatrix)_sm_    result _eq_ result.multiply(rotationMatrix)_sm_    result.setTranslation(translation)_sm_    return result_sm_}_lt_/pre_gt__lt_p_gt_I will run a few tests later this week_co_ being a little busy because of my current main projects. I really want this to work though_co_ we have an upcoming project which was supposed to be a windows application. BabylonJS could help us bringing the software to the web which our solution would really benefit from. We rely heavily on skeletal animation though. If you guys have any ideas_co_ feel free to share them with us _dd_-)_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-02-24T16:47:25Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Sounds good at first glance _lt_img src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ alt_eq__qt__dd_)_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ width_eq__qt_20_qt_ height_eq__qt_20_qt__gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]