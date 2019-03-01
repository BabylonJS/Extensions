[{"Owner":"Dad72","Date":"2018-10-10T19:15:18Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI ask myself this question_dd_ sometimes our animate models are totally distorted and with the use of updatePoseMatrix () this solves the problem.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMy question is why some model updatePoseMatrix()  it is not needed and others need it.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhat exactly is this function? What is she doing ? why some model do not need it? Is this a defect in our animations?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThank you for the clarification. It happens in users of my software asks me the question and I do not really know what to answer. So I_t_m asking the question here to be less stupid.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-10-10T23:09:54Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThis function will reset the pose matrix to the current mesh matrix. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis will mostly depends upon the way you created the mesh in your DCC tool. Sometimes the pose matrix is wrong and needs to be updated.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tTLDR_dd_ The default mesh position should be equals to the pose position\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-10T23:21:42Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tOk_co_ I understand better. Thank you.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI just had a hard time understanding that_dd_\n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\tQuote\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\t_lt_span style_eq__qt_background-color_dd_#ffffff_sm_color_dd_#353c41_sm_font-size_dd_14px_sm__qt__gt_The default mesh position should be equals to the pose position_lt_/span_gt_\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tThe pose position of what? skeleton?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-10-10T23:26:14Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThe initial pose of the mesh (the first frame) should be the same as the poseMatrix\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t_qt_En gros ton mesh doit etre exactement le meme a t_eq_0 que la premiere frame d_t_animation du squelette_qt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-10T23:38:29Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tOk_co_ Merci beaucoup DK\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-11T10:25:35Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSo is it possible to create a condition that verifies the pose of the matrix to that of the matrix of the current mesh.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_ve seen his functions _lt_span_gt__dd__lt_/span_gt_ (but I_t_m not sure what to use.)\n_lt_/p_gt_\n\n_lt_div style_eq__qt_background-color_dd_#fffffe_sm_color_dd_#000000_sm_font-size_dd_14px_sm__qt__gt_\n\t_lt_div_gt_\n\t\t_lt_pre_gt_\n_lt_code_gt_if(mesh.getPoseMatrix() !_eq__eq_ mesh.getWorldMatrix()) {\n    mesh.updatePoseMatrix(BABYLON.Matrix.Identity())_sm_\n}\n\n//OR\n\nif(mesh.getPoseMatrix() !_eq__eq_ BABYLON.Matrix.Identity()) {\n    mesh.updatePoseMatrix(BABYLON.Matrix.Identity())_sm_\n}\n\n// OR\n\nif(mesh.getPoseMatrix() !_eq__eq_ mesh.computeWorldMatrix()) {\n    mesh.updatePoseMatrix(BABYLON.Matrix.Identity())_sm_\n}\n_lt_/code_gt__lt_/pre_gt_\n\n\t\t_lt_div_gt_\n\t\t\t \n\t\t_lt_/div_gt_\n\t_lt_/div_gt_\n\n\t_lt_div_gt_\n\t\t \n\t_lt_/div_gt_\n_lt_/div_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-10-11T16:04:03Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_pre_gt_\n_lt_code class_eq__qt_language-javascript_qt__gt_if(!mesh.getPoseMatrix().isEquals(mesh.computeWorldMatrix())) {\n    mesh.updatePoseMatrix(BABYLON.Matrix.Identity())_sm_\n}_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tThis should work\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-11T16:37:50Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tisEquals  does not exist. but I try var pose _eq_ dude.getPoseMatrix().equals(dude.computeWorldMatrix())_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tit always returns false_co_ even if it is true.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tbecause of values on -0 and other 0 so this returns false even if it is true.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2018-10-11T17:14:03Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\targ...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tso you may need to write your own equal function which will go through all the 16 cells\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-11T17:25:47Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tOk I see. I will do that. Thank you DK\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2018-10-11T18:56:39Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI have to create the function like that_co_ I add all the sums and at the end they must be equal or different.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tMaybe we can do it differently_co_ but like that_co_ it works.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI put my function here in case it interests someone.\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_isPoseMatrixEqual(mesh)\n{\n\t\tlet poseMatrix _eq_ 0_sm_\n\t\tlet computeMatrix _eq_ 0_sm_\t\t\n\t\tfor(let i _eq_ 0_sm_ i &lt_sm_ mesh.getPoseMatrix().m.length_sm_ i++) {\n\t\t\tposeMatrix +_eq_ Math.abs(mesh.getPoseMatrix().m[i])_sm_\t\t\t\n\t\t}\t\t\n\t\tfor(let i _eq_ 0_sm_ i &lt_sm_  mesh.computeWorldMatrix().m.length_sm_ i++) {\t\t\t\n\t\t\tcomputeMatrix +_eq_ Math.abs(mesh.computeWorldMatrix().m[i])_sm_\t\t\t\n\t\t}\t\t\n\t\tif(poseMatrix _eq__eq__eq_ computeMatrix) return true_sm_\n\t\telse return false_sm_\t\t\n}_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]