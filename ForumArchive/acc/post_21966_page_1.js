[{"Owner":"sociofob","Date":"2016-04-16T15:24:39Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_co_I have hard times with asynchronous mesh loading.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI need to apply textures to meshes right after meshes are ready. I_t_m importing in this way_dd_\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_        var loader _eq_ new BABYLON.AssetsManager(scene)_sm_\n        someLoader _eq_ loader.addMeshTask(_qt_roulette_qt__co_ _qt__qt__co_ _qt__qt__co_ _qt_rouletteTable.obj_qt_)_sm_\n        anotherLoader _eq_loader.addMeshTask(_qt_chip_qt__co_ _qt__qt__co_ _qt__qt__co_ _qt_blackChip.obj_qt_)_sm_\n        someLoader.onSuccess _eq_ function (t) {\n            t.loadedMeshes.forEach(function (m) {\n                tableMeshArr.push(m)_sm_\n            })_sm_\n        tableMeshArr[0].material _eq_ materialWheel_sm_\n        tableMeshArr[1].material _eq_ materialRoulette_sm_\n        tableMeshArr[2].material _eq_ materialBlack_sm_\n        \n        }_sm_\n        anotherLoader.onSuccess _eq_ function (t) {\n            t.loadedMeshes.forEach(function (m) {\n                chip_eq_m_sm_\n                chip.material_eq_materialChips_sm_\n            })_sm_\n        }_sm_\n        loader.onFinish _eq_ applyObjTextures_sm_\n        loader.load()_sm_\n\n\n var applyObjTextures _eq_ function () {\n        tableMeshArr[0].material _eq_ materialWheel_sm_\n        tableMeshArr[1].material _eq_ materialRoulette_sm_\n        tableMeshArr[2].material _eq_ materialBlack_sm_\n        chip.material _eq_ materialChips_sm_\n    }_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tBut it applies only to _lt_strong_gt_tableMeshArr[0]_lt_/strong_gt_ mesh.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_color_dd_rgb(248_co_248_co_242)_sm_font-family_dd_monospace_co_ monospace_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-variant_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_line-height_dd_22.4px_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_pre_sm_word-spacing_dd_0px_sm_float_dd_none_sm_background-color_dd_rgb(35_co_36_co_31)_sm__qt__gt_onFinish_lt_/span_gt_  Callback works right after finishing importing first mesh_co_ but I need a callback when all meshes are loaded.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-04-16T15:46:29Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI see no obvious error.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tCan you reproduce on the playground or share a link to your demo?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"sociofob","Date":"2016-04-19T20:24:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI supposed_co_ the problem is in applying texture to mesh before texture is loaed.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tObviously the solution here is to wait for loading_co_ checking texture.isReady() time by time until it happens_co_ but_co_ it doesn_t_t work in my case_dd_(\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_ this.applyMaterials_eq_function(){   \n        if(wheelTexture.isReady&amp_sm_&amp_sm_rouletteTexture.isReady){\n            blackChipMesh.material_eq_materialChips_sm_\n            redChipMesh.material_eq_materialChips_sm_\n            blueChipMesh.material_eq_materialChips_sm_\n            greenChipMesh.material_eq_materialChips_sm_\n            whiteChipMesh.material_eq_materialChips_sm_\n            plane.material _eq_ materialCarpet_sm_  \n            tableMeshes[0].material _eq_ materialWheel_sm_\n            tableMeshes[1].material _eq_ materialRoulette_sm_\n            tableMeshes[2].material _eq_ materialBlack_sm_\n         }\n        else\n        {\n            setTimeout (applyMaterials_co_ 1000)_sm_\n        }\n    }_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tI call this function onAssetsManager_t_s _lt_strong_gt_onFinish _lt_/strong_gt_callback\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_var meshLoader _eq_ new BABYLON.AssetsManager(scene)_sm_\n//...\nmeshLoader.onFinish _eq_ onMeshLoadingFinish_sm_\nmeshLoader.load()_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tBut_co_ I suspect this callback this callback dont work properly.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAlso_co_ I have some error message in console_co_ so that can be connected. I get this error although meshes are imported.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_04/Untitled.png.3d8aa39fe5431b4613b77b416eaf25f6.png_qt_ data-fileid_eq__qt_7349_qt_ rel_eq__qt_external nofollow_qt__gt__lt_img alt_eq__qt_Untitled.png_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_7349_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_04/Untitled.png.3d8aa39fe5431b4613b77b416eaf25f6.png_qt_ /_gt__lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-04-19T21:42:39Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\t_lt_span style_eq__qt_color_dd_rgb(39_co_42_co_52)_sm_font-family_dd__t_Helvetica Neue_t__co_ Helvetica_co_ Arial_co_ sans-serif_sm_font-size_dd_14px_sm_font-style_dd_normal_sm_font-variant_dd_normal_sm_font-weight_dd_normal_sm_letter-spacing_dd_normal_sm_line-height_dd_22.4px_sm_text-indent_dd_0px_sm_text-transform_dd_none_sm_white-space_dd_normal_sm_word-spacing_dd_0px_sm_float_dd_none_sm_background-color_dd_rgb(255_co_255_co_255)_sm__qt__gt_Can you reproduce on the playground or share a link to your demo?_lt_/span_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]