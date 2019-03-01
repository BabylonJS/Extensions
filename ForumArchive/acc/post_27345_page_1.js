[{"Owner":"juanmajr93","Date":"2016-12-29T12:39:16Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_co_ I have a new question about how can I get a elevation of terrain. Now I am using this function_dd_CreateGroundFromHeightMap() and I use a png as parameter. However_co_ I dont get the accuracy that I would like having. I have 1 height by each 2meters so I consider that I should use this data to calculate the height of terrain instead of the intensity of color. Do you know how could I do it?\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJMJR\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2016-12-29T13:12:27Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tI don_t_t really get what you mean ...  _lt_a href_eq__qt_http_dd_//doc.babylonjs.com/classes/2.5/MeshBuilder#static-creategroundfromheightmap-name-url-options-scene-rarr-groundmesh-classes-2-5-groundmesh-_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/classes/2.5/MeshBuilder#static-creategroundfromheightmap-name-url-options-scene-rarr-groundmesh-classes-2-5-groundmesh-_lt_/a_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"Dad72","Date":"2016-12-29T13:31:31Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\texemple elevation_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//www.babylonjs.com/Scenes/Worldmonger/index.html_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs.com/Scenes/Worldmonger/index.html_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tmulti-texture_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/extensions/Terrain_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/extensions/Terrain_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2016-12-29T13:43:21Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tWell I have an elevation of terrain in GLOBAL MAPPER_co_ it is a software to load differents type of files. I get this elevation using ortographic information. When I export this to png for using in BabylonJS I dont get the same accuracy. My question is if you know other way to elevate terrain using height data directly instead of image.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tTheese are the captures of elevation of terrain and heigh map in GLOBAL MAPPER\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_span style_eq__qt_font-size_dd_8px_sm__qt__gt__lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ data-fileid_eq__qt_10957_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_12/Captura.PNG.4706df9ed01e9478c7f64978033ccf53.PNG_qt_ rel_eq__qt__qt__gt__lt_img alt_eq__qt_Captura.PNG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_10957_qt_ height_eq__qt_345_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_12/Captura.thumb.PNG.d52a042fea05a27898a283d4501fa1f3.PNG_qt_ width_eq__qt_475_qt_ /_gt__lt_/a_gt__lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ data-fileid_eq__qt_10958_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_12/Captura2.PNG.ee95e2a8a2c2c45dc11c44a5e9b9fac9.PNG_qt_ rel_eq__qt__qt__gt__lt_img alt_eq__qt_Captura2.PNG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_10958_qt_ height_eq__qt_428_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_12/Captura2.thumb.PNG.1a0bfa2ec6bf701e95d620e2d79691c7.PNG_qt_ width_eq__qt_428_qt_ /_gt__lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThe format of the height_t_s file is_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tLatitud_co_ Longitud_co_ Altura\n_lt_/p_gt_\n\n_lt_p_gt_\n\t431001_co_4183099_co_433.692_lt_br /_gt_\n\t431001_co_4183097_co_433.408_lt_br /_gt_\n\t431001_co_4183095_co_433.208_lt_br /_gt_\n\t431001_co_4183093_co_433.115_lt_br /_gt_\n\t431001_co_4183091_co_432.998\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJMJR\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2016-12-29T17:00:28Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tyes_co_ you can.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJust create an _lt_strong_gt_updatable_lt_/strong_gt_ ground (not a ground from heightmap) and then update each vertex y coordinate accordiling to your altitude data. You_t_ll find plenty of examples in this forum about how to do this.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T12:38:53Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi again_co_ finally I got the acuracy that I wanted exporting an image with png 24bits format. I solved this problem. However I have the next question. How could I get the height coordinate of ground after heightmap is applied?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks and HAPPY NEW YEAR!!\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2017-01-03T13:07:09Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/classes/2.5/GroundMesh#getheightatcoordinates-x-z-rarr-number_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/classes/2.5/GroundMesh#getheightatcoordinates-x-z-rarr-number_lt_/a_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T13:18:43Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tyes this function is exactly that I need. However this is my code and it doesnt work...\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_var ground _eq_ BABYLON.Mesh.CreateGroundFromHeightMap(_qt_ground_qt__co_ _qt_assets/textures/map.png_qt__co_ _width_co_ _height_co_ 1000_co_ 0_co_ 150_co_ scene_co_ false)_sm_\n       \nconsole.log(ground.getHeightAtCoordinates(0_co_ 0))_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T13:26:22Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI am confused because when I print the number of vertices i get 0...\n_lt_/p_gt_\n\n_lt_p_gt_\n\tconsole.log(ground.getTotalVertices())_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2017-01-03T15:14:09Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tyou need to wait for your ground to be created once the heightmap is downloaded... so call any method on a heighmap terrain only in the callback function\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//doc.babylonjs.com/classes/2.5/MeshBuilder#static-creategroundfromheightmap-name-url-options-scene-rarr-groundmesh-classes-2-5-groundmesh-_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//doc.babylonjs.com/classes/2.5/MeshBuilder#static-creategroundfromheightmap-name-url-options-scene-rarr-groundmesh-classes-2-5-groundmesh-_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\thave a look at the parameter _qt_onReady_qt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T17:41:38Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tok thanks jerome but how can i use this callback coud you show me and example?\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2017-01-03T18:10:56Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tsomething like this _dd_ \n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_\nvar callbackFunction _eq_ function(mesh) {\n    var h _eq_ mesh.getHeightAtCoordinates(x_co_ z)_sm_\n}_sm_\n\nvar options _eq_ {width_dd_ width_co_ height_dd_ height_co_ subdivisions_dd_ subdivisions_co_ minHeight_dd_ 0_co_  maxHeight_dd_ 60_co_ onReady_dd_ callbackFunction}_sm_\nvar ground _eq_ BABYLON.MeshBuilder.CreateGroundFromHeightMap(_qt_ground_qt__co_ _qt_http_dd_//www.babylonjs-playground.com/textures/heightMap.png_qt__co_ options_co_ scene)_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T19:41:50Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/5453-jerome/?do_eq_hovercard_qt_ data-mentionid_eq__qt_5453_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/5453-jerome/_qt_ rel_eq__qt__qt__gt_@jerome_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis solution is perfect! I have tested it and I get a height. The last question is the follow.  what are all vertices of mesh ?¿width*height ? I wil have to visit all of them and get their height...\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks!\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-03T19:51:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI have made this iteration_dd_\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_      var callbackFunction _eq_ function(mesh) {\n            var vertex_data _eq_ BABYLON.VertexData.ExtractFromMesh(mesh)_sm_\n            var h_sm_    \n            for (var i _eq_ 0_sm_ i &lt_sm_ vertex_data.positions.length_sm_ i+_eq_3) {\n                h _eq_ mesh.getHeightAtCoordinates(vertex_data.positions[i]_co_vertex_data.positions[i+1])_sm_\n                console.log(h)_sm_\n            }\n        }_sm_ _lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tis it well?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2017-01-03T19:57:04Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tIn this case_co_ simply retrieve the vertex positions _dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tpositions _eq_ mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tpositions_lt_em_gt_ -&gt_sm_ x\n_lt_/em_gt__lt_/p_gt_\n_lt_em_gt_\n\n_lt_/em_gt__lt_p_gt__lt_em_gt_\n\tpositions_lt_/em_gt__lt_em_gt_[i + 1]_lt_/em_gt__lt_em_gt_ -&gt_sm_ y  (height)\n_lt_/em_gt__lt_/p_gt_\n_lt_em_gt_\n\n_lt_/em_gt__lt_p_gt__lt_em_gt_\n\tpositions_lt_/em_gt__lt_em_gt_[i + 2]_lt_/em_gt__lt_em_gt_ -&gt_sm_ z\n_lt_/em_gt__lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-04T10:04:05Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\t_lt_a contenteditable_eq__qt_false_qt_ data-ipshover_eq__qt__qt_ data-ipshover-target_eq__qt_http_dd_//www.html5gamedevs.com/profile/5453-jerome/?do_eq_hovercard_qt_ data-mentionid_eq__qt_5453_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/profile/5453-jerome/_qt_ rel_eq__qt__qt__gt_@jerome_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tyes it is well and I store all vertices of ground to array. However_co_ I can not solve my problem by this way. I have different objects(tubes) and I have to get the height of (x_co_y) coordinates of ground wich are under this object exactly to set his height. Firstly_co_ I don_t_t know what are the vertices of ground under theese objects. Maybe_co_ I consider that a solution can be use a ray to get the vertex under each point of tubes.... I hope your help\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2017-01-04T11:15:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tI have just solved my problem. I was importing another version of babylonjs to my project and I get strange heights of vertices. I dont know the reason_co_ maybe some update of framework. Now I am using this import_dd_  &lt_sm_script src_eq__qt_http_dd_//www.babylonjs.com/babylon.js_qt_&gt_sm_&lt_sm_/script&gt_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tis it always the last version of BabylonJS?\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"adam","Date":"2017-01-04T15:47:25Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tYou should use the cdn.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//cdn.babylonjs.com/2-5/babylon.js_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//cdn.babylonjs.com/2-5/babylon.js_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_http_dd_//cdn.babylonjs.com/2-5/babylon.max.js_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//cdn.babylonjs.com/2-5/babylon.max.js_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIf you need the preview release_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tfor production_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_https_dd_//cdn.rawgit.com/BabylonJS/Babylon.js/master/dist/preview%20release/babylon.js_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//cdn.rawgit.com/BabylonJS/Babylon.js/master/dist/preview release/babylon.js_lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tfor development_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a href_eq__qt_https_dd_//rawgit.com/BabylonJS/Babylon.js/master/dist/preview%20release/babylon.js_qt_ rel_eq__qt_external nofollow_qt__gt_https_dd_//rawgit.com/BabylonJS/Babylon.js/master/dist/preview release/babylon.js_lt_/a_gt_\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]