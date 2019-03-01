[{"Owner":"pheinisch","Date":"2016-07-29T10:30:12Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHello everyone !\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_m having a bit of a misunderstanding with the TriPlanarMaterial of the material library. If I understand correctly_co_ a face of a mesh looking exactly at the X axis sould be textured only with the texture assigned to the X axis_co_ same with Y and Z_co_ and a face with a (1_co_ 1_co_ 1) normal should have a blending of the three textures. Thus_co_ a vertical face should not show any sign of the texture assigned to the Y axis. \n_lt_/p_gt_\n\n_lt_p_gt_\n\tI_t_m having a practical issue as you can see in this playground _dd_ \n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#E6OZX%2338_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#E6OZX#38_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tHere_co_ the vertical faces of the ground mesh are textured both with the grass and the floor texture_co_ just as if they were oriented 45°. But the side of the box is almost not textured with grass_co_ whereas it is more facing the Y axis.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhat could be the origin of this issue ?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks in advance !\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Deltakosh","Date":"2016-07-29T17:46:43Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tSummoning _lt_span_gt_@luaacro_lt_/span_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Luaacro","Date":"2016-08-10T19:26:00Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi pheinisch _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n_lt_p_gt_\n\tAccording to the material_t_s code (vertex shader)_co_ the textures coordinates are not related to the normal of the vertices_co_ but related to the final world position of the current vertex. The advantage of this material is that meshes don_t_t need normals and/or uvs buffers_co_ only positions\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_vec4 worldPos _eq_ finalWorld * vec4(position_co_ 1.0)_sm_\n\n#ifdef DIFFUSEX\n\tvTextureUVX _eq_ worldPos.zy / tileSize_sm_\n#endif\n\n#ifdef DIFFUSEY\n\tvTextureUVY _eq_ worldPos.xz / tileSize_sm_\n#endif\n\n#ifdef DIFFUSEZ\n\tvTextureUVZ _eq_ worldPos.xy / tileSize_sm_\n#endif_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tThere is a very good tutorial which explains everything (better than me) here _dd_ _lt_a href_eq__qt_http_dd_//www.martinpalko.com/triplanar-mapping/_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.martinpalko.com/triplanar-mapping/_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tAdding a new material which works with normals might be a good idea btw _lt_img alt_eq__qt__dd_)_qt_ data-emoticon_eq__qt__qt_ height_eq__qt_20_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/default_smile.png_qt_ srcset_eq__qt_http_dd_//www.html5gamedevs.com/uploads/emoticons/smile@2x.png 2x_qt_ title_eq__qt__dd_)_qt_ width_eq__qt_20_qt_ /_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Pryme8","Date":"2016-08-11T00:15:40Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_iframe data-embedcontent_eq__qt__qt_ frameborder_eq__qt_0_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/topic/24395-smoothing-a-shader-contraint/?do_eq_embed_qt__gt__lt_/iframe_gt_\n\n_lt_p_gt_\n\tthis could be edited to do textures_co_ I just kept it simple and did colors for now... it needs to be finished up but once i I am done you will have 4 zones_dd__lt_br /_gt__lt_br /_gt_\n\tSand_lt_br /_gt_\n\tGrass_lt_br /_gt_\n\tGrass2_lt_br /_gt_\n\tSnow or Rock_lt_br /_gt__lt_br /_gt_\n\tWith 3 angle zones in each so flat areas will have a texture then the transition from flat to vertical and beyond will have both have a texture._lt_br /_gt__lt_br /_gt_\n\tSo you will need 12 seamless textures to reference_co_ and then I may take it a step farther and let you put more then one in per each Range/Zone._lt_br /_gt__lt_br /_gt_\n\tIm thinking this is more what your looking for.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"pheinisch","Date":"2016-08-11T09:03:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThanks to both of you for your anwsers !\n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_139513_qt_ data-ipsquote-contentid_eq__qt_24152_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1470874540_qt_ data-ipsquote-userid_eq__qt_19199_qt_ data-ipsquote-username_eq__qt_Pryme8_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t8 hours ago_co_ Pryme8 said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\t_lt_br /_gt_\n\t\t\tIm thinking this is more what your looking for.\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tThis is indeed working with colors_co_ but with textures you would still need to solve UV mapping issues right ?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_blockquote class_eq__qt_ipsQuote_qt_ data-ipsquote_eq__qt__qt_ data-ipsquote-contentapp_eq__qt_forums_qt_ data-ipsquote-contentclass_eq__qt_forums_Topic_qt_ data-ipsquote-contentcommentid_eq__qt_139487_qt_ data-ipsquote-contentid_eq__qt_24152_qt_ data-ipsquote-contenttype_eq__qt_forums_qt_ data-ipsquote-timestamp_eq__qt_1470857160_qt_ data-ipsquote-userid_eq__qt_11802_qt_ data-ipsquote-username_eq__qt_Luaacro_qt__gt_\n\t_lt_div class_eq__qt_ipsQuote_citation_qt__gt_\n\t\t13 hours ago_co_ Luaacro said_dd_\n\t_lt_/div_gt_\n\n\t_lt_div class_eq__qt_ipsQuote_contents_qt__gt_\n\t\t_lt_p_gt_\n\t\t\tAccording to the material_t_s code (vertex shader)_co_ the textures coordinates are not related to the normal of the vertices_co_ but related to the final world position of the current vertex. The advantage of this material is that meshes don_t_t need normals and/or uvs buffers_co_ only positions\n\t\t_lt_/p_gt_\n\t_lt_/div_gt_\n_lt_/blockquote_gt_\n\n_lt_p_gt_\n\tI understand that the texture coordinates are based on vertex position_co_ but I don_t_t see what_t_s the difference between the ground and the box in this playground _dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#E6OZX%2349_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#E6OZX#49_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tWhy is it that the box is correctly textured_co_ but the ground have this grass texture artefact on its vertical faces ? \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tAnother thing_co_ if you don_t_t set normalTextures_co_ everything fades to black _dd_ _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#E6OZX%2351_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#E6OZX#51_lt_/a_gt__co_ any idea why ?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]