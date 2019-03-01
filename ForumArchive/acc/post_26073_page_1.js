[{"Owner":"juanmajr93","Date":"2016-10-28T09:53:34Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_co_ it is my first post in this forum because I have a question with no answer. I have to draw differents spheres which represent the location of some cities (coordinates UTM). Firstly I have done the conversion to x_co_y pixels on screen. However after apply the ecuations the sphere doesnt appear_co_ so the question is_dd_ which is the reference system that BabylonJS uses?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tIf I define the positon of sphere for example position.x_eq_8_co_ it appear in the limit of screen.What is the meaning of the value 8?\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks_co_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJuanMa.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"jerome","Date":"2016-10-28T11:56:48Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tplease have a look at this old topic _dd_ \n_lt_/p_gt_\n_lt_iframe data-embedcontent_eq__qt__qt_ frameborder_eq__qt_0_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/topic/11767-dimensions-in-the-world/?do_eq_embed_qt__gt__lt_/iframe_gt_\n\n_lt_p_gt_\n\tthen everything depends on the distance between your spheres and the camera\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2016-10-31T10:05:03Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tok_co_ but how can I draw this image where each city has a spatial relation with others? I have theirs UTM coordinates and i have to draw this map in canvas using Babylonjs. For me_co_ the real position on screen is very important so if i consider that my canvas is 800*800_co_ this image must be scaled to this size and the cities(black point) should be represented in their good place.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\tThanks.\n_lt_/p_gt_\n\n_lt_p_gt__lt_a href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_10/Captura.PNG.a9620332570845a74d6ddc4614bc8cd7.PNG_qt_ class_eq__qt_ipsAttachLink ipsAttachLink_image_qt__gt__lt_img data-fileid_eq__qt_10076_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_10/Captura.PNG.a9620332570845a74d6ddc4614bc8cd7.PNG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ alt_eq__qt_Captura.PNG_qt__gt__lt_/a_gt__lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JohnK","Date":"2016-10-31T13:28:14Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tSome initial thoughts.\n_lt_/p_gt_\n\n_lt_ol_gt__lt_li_gt_\n\t\tThe map is not square so scaling to fit 800 x 800 is going to distort the map.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tSet a ground that has the same proportions of the map.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tUse the map as a texture for the ground.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tKnowing the UTM coordinates for the west and east edges of the map and the north and south edges of the map scale the coordinates to fit width and height of map.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tKnowing origin of ground is at its centre translate scaled coordinates as appropriate.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tCreate spheres and position as wanted using calculated coordinates.\n\t_lt_/li_gt_\n\t_lt_li_gt_\n\t\tSet camera in a good position to view map and spheres.\n\t_lt_/li_gt_\n_lt_/ol_gt__lt_p_gt_\n\tTry out in a playground and if still having difficulties ask again. Forum members are always happy to edit a playground to help.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2016-11-01T19:10:06Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHi_co_ I have tried to do the steps that you said and i have found the next problems_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t1. This image has this size_dd_ (764*739 pixels) How can I set a ground with the same proportion if his width and height are units(no pixels).\n_lt_/p_gt_\n\n_lt_p_gt_\n\t2. When I converse the UTM coordinates to the screen_co_ I have a random position. Cities that I have to draw in map are_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tLondon_co_England_dd_ latitude-&gt_sm_-01257_sm_Longitude-&gt_sm_51.508\n_lt_/p_gt_\n\n_lt_p_gt_\n\tLondon_co_Ontario_dd_ latitude-&gt_sm_-81.233_sm_Longitude-&gt_sm_42.983\n_lt_/p_gt_\n\n_lt_p_gt_\n\tEast London_co_ SA_dd_ latitude-&gt_sm_27.91162491_sm_Longitude-&gt_sm_-33.01529\n_lt_/p_gt_\n\n_lt_p_gt_\n\tThis is the operation_dd_\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_var X _eq_ 5_sm_ //This value must be 764 pixels\nvar Y _eq_ 3_sm_ //This value must be 739 pixels\n\t\t \nvar x1 _eq_ X + ((_qt_&lt_sm_?php echo $puntos[0]-&gt_sm_x_sm_?&gt_sm__qt_ * X) / 180)\nvar y1 _eq_ Y - ((_qt_&lt_sm_?php echo $puntos[0]-&gt_sm_y_sm_?&gt_sm__qt_ * Y) / 180)_lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tTo sum up_co_ my problem is to translate the UTM coordinates to the correct positon over the ground. Their properties are_dd_\n_lt_/p_gt_\n\n_lt_pre_gt_\n_lt_code_gt_//Ground (764*739)\nvar ground _eq_ BABYLON.Mesh.CreateGround(_qt_ground_qt__co_ 7.5_co_ 7_co_ 1_co_ scene)_sm_\nvar material _eq_ new BABYLON.StandardMaterial(_qt_mapa_qt__co_ scene)_sm_\nmaterial.diffuseTexture _eq_ new BABYLON.Texture(_qt_textures/mapa.png_qt__co_ scene)_sm_\nmaterial.backFaceCulling _eq_ false_sm_\nground.material _eq_ material_sm_\nground.rotation.x _eq_ -Math.PI/2_sm__lt_/code_gt__lt_/pre_gt_\n\n_lt_p_gt_\n\tThanks.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJuanMa J.R.\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ data-fileid_eq__qt_10099_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_11/Captura1.PNG.7b4261778067f576b8fa9d85f9519c97.PNG_qt_ rel_eq__qt__qt__gt__lt_img alt_eq__qt_Captura1.PNG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_10099_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_11/Captura1.thumb.PNG.a74dc983f1fbcbba820270129c194214.PNG_qt_ /_gt__lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t_lt_a class_eq__qt_ipsAttachLink ipsAttachLink_image_qt_ data-fileid_eq__qt_10100_qt_ href_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_11/Captura2.PNG.618249c1850f96856d78eab0a1c6d266.PNG_qt_ rel_eq__qt__qt__gt__lt_img alt_eq__qt_Captura2.PNG_qt_ class_eq__qt_ipsImage ipsImage_thumbnailed_qt_ data-fileid_eq__qt_10100_qt_ src_eq__qt_http_dd_//www.html5gamedevs.com/uploads/monthly_2016_11/Captura2.thumb.PNG.f16732f7a9adb19afb191c927d5b0c31.PNG_qt_ /_gt__lt_/a_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JohnK","Date":"2016-11-01T19:47:15Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tHave you created a playground? If you have can you add a link it makes it a lot easier to help you. Even if the ground is blank we could work with the figures you have included. Well done on what you have done so far.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tYou can make the width of the ground 764 and its height 739 and put the camera further away.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tStill need UTM coordinates for edges of the map.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JohnK","Date":"2016-11-01T20:44:59Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tPerhaps this will help get you started _lt_a href_eq__qt_http_dd_//www.babylonjs-playground.com/#SQIFZ%231_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//www.babylonjs-playground.com/#SQIFZ#1_lt_/a_gt_\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2016-11-02T17:47:35Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThanks JohnK by your fast answers. This link is the access to my project. _lt_a href_eq__qt_http_dd_//217.217.131.1_dd_8081/_qt_ rel_eq__qt_external nofollow_qt__gt_http_dd_//217.217.131.1_dd_8081/ _lt_/a_gt__lt_span_gt_ _lt_/span_gt_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tI can`t create playground because I have a connection with postgres database where I have the UTM coordinates. As you can see_co_ the relation spatial of spheres which represent Ontario(Canada)_co_ London(England) and East London(South America) are correct. However_co_ the position are not good because the coordinates are not scaled to the size of ground. I have seen your playground and I dont understand the value of  theese variables_dd_\n_lt_/p_gt_\n\n_lt_p_gt_\n\t    var utmTop _eq_ 1787_sm__lt_br /_gt_\n\t    var utmBottom _eq_ 309_sm__lt_br /_gt_\n\t    var utmLeft _eq_ 562_sm__lt_br /_gt_\n\t    var utmRight _eq_ 2090_sm_\n_lt_/p_gt_\n\n_lt_p_gt_\n\tJuanMa J.R\n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n_lt_p_gt_\n\t \n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"JohnK","Date":"2016-11-02T18:54:43Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t\n_lt_p_gt_\n\tThe numbers were just ones I made up\n_lt_/p_gt_\n\n_lt_p_gt_\n\tutmTop should be the latitude of all the places at the top of the map. utmBottom the latitude of those at the bottom.\n_lt_/p_gt_\n\n_lt_p_gt_\n\tutmLeft should be the longitude of all the places on the left of the map_co_ utmRight the longitude of all places on the right of the map.\n_lt_/p_gt_\n\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"},{"Owner":"juanmajr93","Date":"2016-11-07T16:53:57Z","Content":"_lt_div class_eq__qt_mages_qt__gt_\n\t\t\t_lt_p_gt_\n\tThanks_co_ I got it.\n_lt_/p_gt_\n\n\t\t\t\n\t\t_lt_/div_gt_\n\n\t\t_lt_div class_eq__qt_ipsI_qt__gt__lt_/div_gt__lt_/div_gt_"}]