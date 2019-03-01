[{"Owner":"altreality","Date":"2015-01-27T17:12:20Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_I have tried to select Arc Rotate in the Babylon.js  Camera Type option in Blender. But while exporting it says in the log that the target was not specified_dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_\tBabylon.js Exporter version_dd_ 1.6.2_co_ Blender version_dd_ 2.73 (sub 0)_eq__eq__eq__eq__eq__eq__eq__eq__eq_ Conversion from Blender to Babylon.js _eq__eq__eq__eq__eq__eq__eq__eq__eq_\tPython World class constructor completed\tprocessing begun of material_dd_  loco.Material\tWARNING texture type not currently supported_dd_  NONE_co_ ignored.\tprocessing begun of material_dd_  loco.Material.001\tprocessing begun of material_dd_  loco.Material.002\tprocessing begun of mesh_dd_  Cylinder.003\t\tnum positions      _dd_  64\t\tnum normals        _dd_  64\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  372\tprocessing begun of mesh_dd_  Cylinder.002\t\tnum positions      _dd_  64\t\tnum normals        _dd_  64\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  372\tprocessing begun of mesh_dd_  Cylinder.001\t\tnum positions      _dd_  64\t\tnum normals        _dd_  64\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  372\tprocessing begun of mesh_dd_  Cylinder\t\tnum positions      _dd_  64\t\tnum normals        _dd_  64\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  372\tprocessing begun of camera (ArcRotateCamera)_dd_  Camera\t\tERROR_dd_ Camera type with manditory target specified_co_ but no target to track set\tprocessing begun of mesh_dd_  Plane\t\tnum positions      _dd_  4\t\tnum normals        _dd_  4\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  6\tprocessing begun of mesh_dd_  chassis\t\tnum positions      _dd_  8\t\tnum normals        _dd_  8\t\tnum uvs            _dd_  0\t\tnum uvs2           _dd_  0\t\tnum colors         _dd_  0\t\tnum indices        _dd_  36\tprocessing begun of light (SUN)_dd_  Lamp_eq__eq__eq__eq__eq__eq__eq__eq__eq_ Writing of scene file started _eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq_ Writing of scene file completed _eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq__eq_ end of processing _eq__eq__eq__eq__eq__eq__eq__eq__eq__lt_/pre_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JCPalmer","Date":"2015-01-27T17:46:59Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt__lt_/p_gt__lt_ol_gt__lt_li_gt_Select Camera (Right Mouse Button)_lt_/li_gt__lt_/ol_gt__lt_p_gt_\n\t_lt_/p_gt_Also select Target Mesh (Shift-Right Mouse Button)_lt_p_gt_\n\t_lt_/p_gt_Press Crtl-T_co_ select _t_Track to Constraint_t_ off popup-menu_lt_p_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"altreality","Date":"2015-01-28T04:35:45Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Ok_co_ now I have got a free camera with target set in _lt_a href_eq__qt_http_dd_//synth2014.github.io/Age-of-Steam/babylon/indexLocoScene.html_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//synth2014.github.io/Age-of-Steam/babylon/indexLocoScene.html_lt_/a_gt__lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_There is no mouse support by default for the free camera ? I can move the camera with the arrow keys but there is no response when using the mouse. Also when rotating around the target_co_ the target seems to be receding away in a kind of spiral movement. Shortened babylon file _dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt_{_qt_autoClear_qt__dd_true_co__qt_clearColor_qt__dd_[0_co_0_co_0]_co__qt_ambientColor_qt__dd_[0_co_0_co_0]_co__qt_gravity_qt__dd_[0_co_-9.81_co_0]_co__qt_materials_qt__dd_[{_qt_name_qt__dd__qt_new.Material_qt__co__qt_id_qt__dd__qt_new.Material_qt__co__qt_ambient_qt__dd_[0.8_co_0.6715_co_0.0617]_co__qt_diffuse_qt__dd_[0.64_co_0.5372_co_0.0494]_co__qt_specular_qt__dd_[0.5_co_0.5_co_0.5]_co__qt_emissive_qt__dd_[0_co_0_co_0]_co__qt_specularPower_qt__dd_50_co__qt_alpha_qt__dd_1_co__qt_backFaceCulling_qt__dd_true}_co_{_qt_name_qt__dd__qt_new.Material.001_qt__co__qt_id_qt__dd__qt_new.Material.001_qt__co__qt_ambient_qt__dd_[0.2076_co_0.8_co_0.1588]_co__qt_diffuse_qt__dd_[0.1661_co_0.64_co_0.127]_co__qt_specular_qt__dd_[0.5_co_0.5_co_0.5]_co__qt_emissive_qt__dd_[0_co_0_co_0]_co__qt_specularPower_qt__dd_50_co__qt_alpha_qt__dd_1_co__qt_backFaceCulling_qt__dd_true}_co_{_qt_name_qt__dd__qt_new.Material.002_qt__co__qt_id_qt__dd__qt_new.Material.002_qt__co__qt_ambient_qt__dd_[0.0012_co_0.0009_co_0.0111]_co__qt_diffuse_qt__dd_[0.001_co_0.0007_co_0.0089]_co__qt_specular_qt__dd_[0.5_co_0.5_co_0.5]_co__qt_emissive_qt__dd_[0_co_0_co_0]_co__qt_specularPower_qt__dd_50_co__qt_alpha_qt__dd_1_co__qt_backFaceCulling_qt__dd_true}]_co__qt_multiMaterials_qt__dd_[]_co__qt_skeletons_qt__dd_[]_co__qt_meshes_qt__dd_[{_qt_name_qt__dd__qt_Cylinder.003_qt__co__qt_id_qt__dd__qt_Cylinder.003_qt__co__qt_materialId_qt__dd__qt_new.Material.002_qt__co__qt_billboardMode_qt__dd_0_co__qt_position_qt__dd_[8_co_1.2_co_-1]_co__qt_rotation_qt__dd_[-1.5708_co_0_co_0]_co__qt_scaling_qt__dd_[0.5_co_1_co_0.5]_co__qt_isVisible_qt__dd_true_co__qt_isEnabled_qt__dd_true_co__qt_useFlatShading_qt__dd_false_co__qt_checkCollisions_qt__dd_false_co__qt_receiveShadows_qt__dd_false_co__qt_positions_qt__dd_[0_co_0.05_co_1_co_0.1951_co_0.05_co_0.9808_co_0.1951_co_-0.05_co_0.9808_co_0.3827_co_0.05_co_0.9239_co_0.3827_co_-0.05_co_0.9239_co_0.5556_co_0.05_co_0.8315_co_0.5556_co_-0.05_co_0.8315_co_0.7071_co_0.05_co_0.7071_co_0.7071_co_-0.05_co_0.7071_co_0.8315_co_0.05_co_0.5556_co_0.8315_co_-0.05_co_0.5556_co_0.9239_co_0.05_co_0.3827_co_0.9239_co_-0.05_co_0.3827_co_0.9808_co_0.05_co_0.1951_co_0.9808_co_-0.05_co_0.1951_co_1_co_0.05_co_0_co_1_co_-0.05_co_0_co_0.9808_co_0.05_co_-0.1951........._co__qt_subMeshes_qt__dd_[{_qt_materialIndex_qt__dd_0_co__qt_verticesStart_qt__dd_0_co__qt_verticesCount_qt__dd_64_co__qt_indexStart_qt__dd_0_co__qt_indexCount_qt__dd_372}]_co__qt_instances_qt__dd_[]}_co_{_qt_name_qt__dd__qt_Plane_qt__co__qt_id_qt__dd__qt_Plane_qt__co__qt_materialId_qt__dd__qt_new.Material.001_qt__co__qt_billboardMode_qt__dd_0_co__qt_position_qt__dd_[0_co_0_co_-500]_co__qt_rotation_qt__dd_[0_co_0_co_0]_co__qt_scaling_qt__dd_[550_co_1_co_550]_co__qt_isVisible_qt__dd_true_co__qt_isEnabled_qt__dd_true_co__qt_useFlatShading_qt__dd_false_co__qt_checkCollisions_qt__dd_false_co__qt_receiveShadows_qt__dd_false_co__qt_positions_qt__dd_[1_co_0_co_-1_co_1_co_0_co_1_co_-1_co_0_co_1_co_-1_co_0_co_-1]_co__qt_normals_qt__dd_[0_co_1_co_0_co_0_co_1_co_0_co_0_co_1_co_0_co_0_co_1_co_0]_co__qt_indices_qt__dd_[0_co_1_co_2_co_3_co_0_co_2]_co__qt_subMeshes_qt__dd_[{_qt_materialIndex_qt__dd_0_co__qt_verticesStart_qt__dd_0_co__qt_verticesCount_qt__dd_4_co__qt_indexStart_qt__dd_0_co__qt_indexCount_qt__dd_6}]_co__qt_instances_qt__dd_[]}_co_{_qt_name_qt__dd__qt_Cube_qt__co__qt_id_qt__dd__qt_Cube_qt__co__qt_materialId_qt__dd__qt_new.Material_qt__co__qt_billboardMode_qt__dd_0_co__qt_position_qt__dd_[0_co_2_co_0]_co__qt_rotation_qt__dd_[0_co_0_co_0]_co__qt_scaling_qt__dd_[10_co_1_co_1.5]_co__qt_isVisible_qt__dd_true_co__qt_isEnabled_qt__dd_true_co__qt_useFlatShading_qt__dd_false_co__qt_checkCollisions_qt__dd_false_co__qt_receiveShadows_qt__dd_false_co__qt_positions_qt__dd_[1_co_-1_co_-1_co_-1_co_-1_co_-1_co_-1_co_-1_co_1_co_-1_co_1_co_1_co_-1_co_1_co_-1_co_1_co_1_co_-1_co_1_co_1_co_1_co_1_co_-1_co_1]_co__qt_normals_qt__dd_[0.5773_co_-0.5773_co_-0.5773_co_-0.5773_co_-0.5773_co_-0.5773_co_-0.5773_co_-0.5773_co_0.5773_co_-0.5773_co_0.5773_co_0.5773_co_-0.5773_co_0.5773_co_-0.5773_co_0.5773_co_0.5773_co_-0.5773_co_0.5773_co_0.5773_co_0.5773_co_0.5773_co_-0.5773_co_0.5773]_co__qt_indices_qt__dd_[0_co_1_co_2_co_3_co_4_co_5_co_6_co_5_co_0_co_5_co_4_co_1_co_1_co_4_co_3_co_7_co_2_co_3_co_7_co_0_co_2_co_6_co_3_co_5_co_7_co_6_co_0_co_0_co_5_co_1_co_2_co_1_co_3_co_6_co_7_co_3]_co__qt_subMeshes_qt__dd_[{_qt_materialIndex_qt__dd_0_co__qt_verticesStart_qt__dd_0_co__qt_verticesCount_qt__dd_8_co__qt_indexStart_qt__dd_0_co__qt_indexCount_qt__dd_36}]_co__qt_instances_qt__dd_[]}]_co__qt_cameras_qt__dd_[{_qt_name_qt__dd__qt_Camera_qt__co__qt_id_qt__dd__qt_Camera_qt__co__qt_position_qt__dd_[3.1255_co_3.6096_co_19.6474]_co__qt_rotation_qt__dd_[0.051_co_-2.9574_co_0]_co__qt_fov_qt__dd_0.8576_co__qt_minZ_qt__dd_0.1_co__qt_maxZ_qt__dd_100_co__qt_speed_qt__dd_1_co__qt_inertia_qt__dd_0.9_co__qt_checkCollisions_qt__dd_false_co__qt_applyGravity_qt__dd_false_co__qt_ellipsoid_qt__dd_[0.2_co_0.9_co_0.2]_co__qt_type_qt__dd__qt_FreeCamera_qt__co__qt_lockedTargetId_qt__dd__qt_Cube_qt_}]_co__qt_activeCamera_qt__dd__qt_Camera_qt__co__qt_lights_qt__dd_[{_qt_name_qt__dd__qt_Lamp_qt__co__qt_id_qt__dd__qt_Lamp_qt__co__qt_type_qt__dd_1_co__qt_position_qt__dd_[4.0762_co_20.6462_co_1.0055]_co__qt_direction_qt__dd_[-0.5664_co_-0.7947_co_-0.2184]_co__qt_intensity_qt__dd_1_co__qt_diffuse_qt__dd_[1_co_1_co_1]_co__qt_specular_qt__dd_[1_co_1_co_1]}]_co__qt_shadowGenerators_qt__dd_[]}_lt_/pre_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"altreality","Date":"2015-01-28T04:39:11Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Also I have specified the lamp in Blender to be the Sun_co_ but it seems the Sun is not lighting up the rear of the cube. Are there any other settings needed for lights ?_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_If I select a _lt_strong_gt_arc rotate camera _lt_/strong_gt_in blender and then add the track to constraint as specified above then my babylon file does not load. Does it work for you guys ?_lt_/p_gt__lt_p_gt_ _lt_/p_gt__lt_p_gt_Here are the last 2 lines of the generated babylon file_dd__lt_/p_gt__lt_pre class_eq__qt_ipsCode prettyprint_qt__gt__qt_cameras_qt__dd_[{_qt_name_qt__dd__qt_Camera_qt__co__qt_id_qt__dd__qt_Camera_qt__co__qt_position_qt__dd_[3.1255_co_3.0021_co_19.6474]_co__qt_rotation_qt__dd_[-0.145_co_-2.9364_co_0]_co__qt_fov_qt__dd_0.8576_co__qt_minZ_qt__dd_0.1_co__qt_maxZ_qt__dd_100_co__qt_speed_qt__dd_1_co__qt_inertia_qt__dd_0.9_co__qt_checkCollisions_qt__dd_false_co__qt_applyGravity_qt__dd_false_co__qt_ellipsoid_qt__dd_[0.2_co_0.9_co_0.2]_co__qt_type_qt__dd__qt_ArcRotateCamera_qt__co__qt_alpha_qt__dd_1.413_co__qt_beta_qt__dd_1.5198_co__qt_radius_qt__dd_19.9197_co__qt_lockedTargetId_qt__dd__qt_Cube_qt_}]_co__qt_activeCamera_qt__dd__qt_Camera_qt__co__qt_lights_qt__dd_[{_qt_name_qt__dd__qt_Lamp_qt__co__qt_id_qt__dd__qt_Lamp_qt__co__qt_type_qt__dd_1_co__qt_position_qt__dd_[4.0762_co_20.6462_co_1.0055]_co__qt_direction_qt__dd_[-0.5664_co_-0.7947_co_-0.2184]_co__qt_intensity_qt__dd_1_co__qt_diffuse_qt__dd_[1_co_1_co_1]_co__qt_specular_qt__dd_[1_co_1_co_1]}]_co__qt_shadowGenerators_qt__dd_[]}_lt_/pre_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"altreality","Date":"2015-01-29T12:43:57Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Anyone facing the same issue with the Arc Rotate camera and the lighting for a scene read from a .babylon file ?_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2015-01-29T19:46:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_Could you share your .babylon file? I_t_ll try to check why it is not loading_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]