var mats = {
    "default": function (op,sc) {
        var cl = { r: Math.random() * 0.6, g: Math.random() * 0.6, b: Math.random() * 0.6 };

        op = def(op, {});
        op.color = def(op.color, { r: cl.r, g: cl.g, b: cl.b });
        
        if (sc == null) return op;
        cl = op.color;
        return  new SB().Solid(cl)
            .Light({ direction: 'vec3(1000.)', phonge: 1.0, specular: 1 })
            .Light({ direction: 'vec3(1000.)*-1.0', darkColorMode: 1, color: { r: 0, g: 0, b: 0, a: 1 }, phonge: 0.5, specular: 0 })
        .Light({ direction: 'vec3(camera)', phonge: 0.5, specular: 0.5 })

            .Back(BABYLONX.Helper().Solid({ r: cl.r * 0.6, g: cl.g * 0.6, b: cl.b * 0.6 }).Build())
            .BuildMaterial(sc) ;
    }, 
    "metal": function (op, sc) {
        op = def(op, {}); 
        if (sc == null) return op;
        return new SB()
            .InLine('vec3 nemn = nrm;').Back('nemn = -1.0*nrm;')
            .Solid({ r: 0.5, g: 0.5, b: 0.5 })
            .Light({
                nrm:'nemn',
                direction: 'camera', 
                color: { r: 1, g: 1, b: 1, a: 1 }, phonge: 1.0, specular: 0
            })
            .InLine('result = 1. - result; result.w = 1.;')
            .Effect({ pr: 'pow(pr,2.)*2.' })
            .InLine('vec3 r_l1 = result.xyz;') 
             .Solid()
            .Light({ nrm: 'nemn', direction: 'camera', phonge: 0.5, specular: 0.1, specularPower: 3., specularLevel: 2. }) 
             .InLine('result.xyz = max(result.xyz,r_l1); ')
            .Effect({ pr: 'pow(pr,2.)*2.' })
            .Back('result.xyz = result.xyz*0.5;')
            .BuildMaterial(sc);

    },
    "uv": function (op, sc) {
        op = def(op, {});
        if (sc == null) return op;
        return new SB()
            .InLine('vec3 nemn = nrm;result  = vec4(vuv.x,vuv.y,0.,1.);').Back('nemn = -1.0*nrm;')
            .Back('result.xyz = result.xyz*0.5;')
            .BuildMaterial(sc);

    },
    "nrm": function (op, sc) {
        op = def(op, {});
        if (sc == null) return op;
        return new SB()
            .InLine('vec3 nemn = nrm;result  = vec4(nrm*0.5+0.5,1.);').Back('nemn = -1.0*nrm;')
            .Back('result.xyz = result.xyz*0.5;')
            .BuildMaterial(sc);

    },
    "geology": function (op, sc) {
        op = def(op, {}); 
        op.map1 = def(op.map1, 'shale.jpg');
        op.map2 = def(op.map2, 'oil.jpg');
        op.map3 = def(op.map3, 'bassalt.jpg');
        op.map4 = def(op.map4, 'sand.jpg');
        op.map5 = def(op.map5, 'rock.jpg');
        op.uvscale = def(op.uvscale, 0.01);

        if (sc == null) return op;
        return new SB()
            .InLine('vec3 nemn = nrm;').Back('nemn = -1.0*nrm;') 
           


            //
                .Func(function (me) {

                    me.FragmentBeforeMain = '\
\
   vec4 getTileFromAtlasMap(sampler2D txtRef_0,vec2 tile ,vec2 pos,vec2 size,vec2 SIZE,vec2 vuv){\
\
      vec4 result = vec4(0.);\
     float uv_w =  size.x / SIZE.x;\
     float uv_h =  size.y / SIZE.y;\
     float uv_x =  pos.x / SIZE.x ;\
     float uv_y =  1.-  pos.y  / SIZE.y -uv_h;\
\
     tile.x = tile.x*uv_w*0.5;\
     tile.y = tile.y*uv_h *(size.x/size.y)*0.5 ;\
\
\
     vec2 newUvAtlas = vec2( mod( vuv.x*tile.x   , uv_w ) +uv_x  , mod(vuv.y*tile.y    ,uv_h)+uv_y  );\
     vec2 edgeUvAtlas_x = vec2( mod( vuv.x*tile.x  +0.5*uv_w , uv_w ) +uv_x  , mod(vuv.y*tile.y -0.0*uv_h  ,uv_h)+uv_y  );\
     vec2 edgeUvAtlas_y = vec2( mod( vuv.x*tile.x  -0.0*uv_w , uv_w ) +uv_x  , mod(vuv.y*tile.y   -0.5*uv_h  ,uv_h)+uv_y  );\
     vec2 edgeUvAtlas_xy = vec2( mod( vuv.x*tile.x  -0.5*uv_w , uv_w ) +uv_x  , mod(vuv.y*tile.y  -0.5*uv_h  ,uv_h)+uv_y  );\
\
                     vec4 color_2_ = texture2D(txtRef_0 ,edgeUvAtlas_x.xy*vec2(1.,1.)+vec2(0.,0.));\
\
                       result = vec4(color_2_.rgb , 1.);\
                       vec4 resHelp_2_ = result; vec4 result_1 = vec4(0.);\
                  result_1 = result;result = resHelp_2_ ;\
\
                        vec4 color_3_ = texture2D(txtRef_0 ,edgeUvAtlas_y.xy*vec2(1.,1.)+vec2(0.,0.));\
\
                       result = vec4(color_3_.rgb , 1.);\
                      vec4 resHelp_3_ = result; vec4 result_2 = vec4(0.);\
                  result_2 = result;result = resHelp_3_ ;\
\
                        vec4 color_4_ = texture2D(txtRef_0 ,edgeUvAtlas_xy.xy*vec2(1.,1.)+vec2(0.,0.));\
\
                       result = vec4(color_4_.rgb , 1.);\
                       vec4 resHelp_4_ = result; vec4 result_3 = vec4(0.);\
                  result_3 = result;result = resHelp_4_ ;\
\
                        vec4 color_5_ = texture2D(txtRef_0 ,newUvAtlas.xy*vec2(1.,1.)+vec2(0.,0.));\
\
                       result = vec4(color_5_.rgb , 1.);\
                       vec2 edge = vec2(  pow( 2.*abs((newUvAtlas.x-uv_x)/uv_w -0.5), 3.),  pow( 2.*abs((newUvAtlas.y-uv_y)/uv_h \-0.5), 3.) ) ;vec4 resHelp_5_ = result; vec4 result_4 = vec4(0.);\
                 result = vec4(  edge.x ,edge.y,  max(edge.x,edge.y)  ,1.);\
                 result_4 = result;\
\
                 result = resHelp_5_ ;\
\
                 if( ((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))) > 0.5 + -0.48  && ((result_4.y*1.-0.)>1.0 ? 0. : \max(0.,(result_4.y*1.-0.))) < 0.5 - -0.48  && ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))) > 0.5 + -0.48  ) { vec4 oldrs_6_ = vec4(result);float al_6_ = max(0.0,min(1.0,(((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))) + ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))))/2.0 - (((result_4.y*1.-0.)>1.0 ? 0. : max(0.,(result_4.y*1.-0.))))/1.0+(0.48))); float  l_6_ =  1.0-al_6_;   result =  result_1   ;  result = result*al_6_ +  oldrs_6_ * l_6_;    } if( ((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))) < 0.5 - -0.48  && ((result_4.y*1.-0.)>1.0 ? 0. : max(0.,(result_4.y*1.-0.))) > 0.5 + -0.48  && ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))) > 0.5 + -0.48  ) { vec4 oldrs_7_ = vec4(result);float al_7_ = max(0.0,min(1.0,(((result_4.y*1.-0.)>1.0 ? 0. : max(0.,(result_4.y*1.-0.))) + ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))))/2.0 - (((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))))/1.0+(0.48))); float  l_7_ =  1.0-al_7_;   result =  result_2 ;  result = result*al_7_ +  oldrs_7_ * l_7_;    } if( ((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))) > 0.5 + -0.48  && ((result_4.y*1.-0.)>1.0 ? 0. : max(0.,(result_4.y*1.-0.))) > 0.5 + -0.48  && ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))) > 0.5 + -0.48  ) { vec4 oldrs_8_ = vec4(result);float al_8_ = max(0.0,min(1.0,(((result_4.x*1.-0.)>1.0 ? 0. : max(0.,(result_4.x*1.-0.))) + ((result_4.y*1.-0.)>1.0 ? 0. : max(0.,(result_4.y*1.-0.))) + ((result_4.z*1.-0.)>1.0 ? 0. : max(0.,(result_4.z*1.-0.))))/3.0+(0.48))); float  l_8_ =  1.0-al_8_;   result =  result_3  ;  result = result*al_8_ +  oldrs_8_ * l_8_;    }\
   return result;\
}\
\
vec4 getTextureFromAtlasMap(sampler2D txtRef_0,vec2 scale ,vec2 pos,vec2 size,vec2 SIZE,vec2 vuv){\
\
      vec4 result = vec4(0.);\
     float uv_w =  size.x / SIZE.x;\
     float uv_h =  size.y / SIZE.y;\
     float uv_x =  pos.x / SIZE.x ;\
     float uv_y =  1.-  pos.y  / SIZE.y -uv_h;\
\
     scale.x = scale.x*uv_w;\
     scale.y = scale.y*uv_h *(size.x/size.y) ;\
\
     vec2 newUvAtlas = vec2( mod( vuv.x*scale.x   , uv_w ) +uv_x  , mod(vuv.y*scale.y    ,uv_h)+uv_y  );\
\
                     vec4 color  = texture2D(txtRef_0 ,newUvAtlas.xy*vec2(1.,1.)+vec2(0.,0.));\
\
                   return color ;\
}\
\
vec4  layerTxt(sampler2D txtRef_1,vec2 vuv2,float lip,float lm , float nm,float scale,float ph,float ps){\
 vuv2 *= scale;\
  vec4 result = vec4(0.);\
 vec3 def  = getTileFromAtlasMap(\
       txtRef_1,\
       vec2(2.),\
       vec2(0.,0.),\
       vec2(512.,512.),\
       vec2(1024.,1024.),\
       vuv2\
       ).rgb;\
\
        vec3 nm1  = getTileFromAtlasMap(\
       txtRef_1,\
       vec2(2.),\
       vec2(512.,0.),\
       vec2(512.,512.),\
       vec2(1024.,1024.),\
       vuv2\
       ).rgb*2.-1.;\
\
         vec3 rog  = getTileFromAtlasMap(\
       txtRef_1,\
       vec2(2.),\
       vec2(0.,512.),\
       vec2(256.,256.),\
       vec2(1024.,1024.),\
       vuv2\
       ).rgb;\
\
        vec3 hig  = getTileFromAtlasMap(\
       txtRef_1,\
       vec2(2.),\
       vec2(256.,512.),\
       vec2(256.,256.),\
       vec2(1024.,1024.),\
       vuv2\
       ).rgb;\
\
        vec3 mat  = getTileFromAtlasMap(\
       txtRef_1,\
       vec2(2.),\
       vec2(256.,512.),\
       vec2(0.,768.),\
       vec2(1024.,1024.),\
       vuv2\
       ).rgb;\
\
\
\
       vec3 new_nrm = normalize(nm1+nrm+cross(nrm,nm1)-nm1*0.5*hig.x) ;\
\
         '+ BABYLONX.Helper()
                 .Solid()
                 .Light({
                     normal: 'new_nrm', direction: 'camera',
                     phonge: 1,
                     specular: 1,
                     specularPower: 0.1,
                     specularLevel: 10.1,
                 }).Effect({ pr: 'pow(pr,lm)*nm' }).InLine('float l1 = ph*result.x;')
                 .Solid()
                 .Light({
                     normal: 'new_nrm', direction: 'camera',
                     phonge: 1,
                     specular: 100,
                     specularPower: 1,
                     specularLevel: 0.1,
                 }).InLine('float l2 = ps*result.x;')


                    .InLine('\
\
            result.xyz = def*max(l1,l2)*0.5+def*0.5-hig.x*0.05;\
\
            return  result ;\
}\
            ').Build();

                    return me;
                })
        .Map({ path: 'https://i.imgur.com/LWg8i8C.jpg' })
        // enviroment map in txtRef_0 sampler
        //https://i.imgur.com/4LudcMp.jpg normal map
        .Map({ path: '../Files/uploads/' + op.map1 })
        .Map({ path: '../Files/uploads/' + op.map2 })
        .Map({ path: '../Files/uploads/' + op.map3 })
         .Map({ path:'../Files/uploads/' + op.map4 })
         .InLine('\
         float  scale = ' + BABYLONX.Shader.Print(op.uvscale) + ';\
      vec2 sp_uv = pos.zx*scale;\
        if(abs(nrm.y)> 0.5 && abs(nrm.x)<0.5 && abs(nrm.z)<0.5)\
        sp_uv = vec2(0.);\
        if(abs(nrm.z)> 0.5 && abs(nrm.x)<0.5 && abs(nrm.y)<0.5)\
        sp_uv = pos.xy*scale;\
        if(abs(nrm.x)> 0.5 && abs(nrm.y)<0.5 && abs(nrm.z)<0.5)\
         sp_uv = pos.zy*scale;\
\
        if(vuv.y > 0.75)\
       result = layerTxt(txtRef_1,sp_uv,1.,1.,1.,0.3,0.5,0.);\
       else   if(vuv.y > 0.5)\
\
       result = layerTxt(txtRef_2 ,sp_uv,0.3,2.,1.,1.,2.,0.1);\
           else   if(vuv.y > 0.25)\
\
       result = layerTxt(txtRef_3 ,sp_uv,0.3,2.,1.,1.,1.5,0.1);\
        else\
          result = layerTxt(txtRef_4 ,sp_uv,0.3,1.,1.,1.,1.5,0.9);\
            ') 

            .Back('result.xyz = result.xyz*0.5;')
            .BuildMaterial(sc);


    },

    "geology1": function (op, sc) {
        op = def(op, {});
        op.map = def(op.map,'default.jpg');
        op.map2 = def(op.map2, 'default.jpg');
        op.uv = def(op.uv,1.);

        if (sc == null) return op;

        return new SB()
            .Map({ path: '../Files/uploads/' + op.map, uv: 'vec2(pos.xz*0.002*' + BABYLONX.Shader.Print(op.uv) + ')' })
            .InLine('vec3 map1 = result.xyz;')
            .Map({ path: '../Files/uploads/' + op.map2, uv: 'vec2(pos.zy*0.0033*' + BABYLONX.Shader.Print(op.uv) + ')' })
            .InLine('vec3 map2 = result.xyz;')
            .Map({ path: '../Files/uploads/' + op.map2, uv: 'vec2(vuv*0.33*' + BABYLONX.Shader.Print(op.uv) + ')' })
            .InLine('vec3 map3 = result.xyz;')
            .InLine('vec3 nemn =  ' + BABYLONX.Normals.Flat + ';').Back('nemn = -1.0*nemn;')
            .Solid({ r: 0.5, g: 0.5, b: 0.5 })
            .Light({
                nrm: BABYLONX.Normals.Flat,
                direction: 'camera',
                color: { r: 1, g: 1, b: 1, a: 1 }, phonge: '2.', specular: 0
            })
           
             .InLine('vec3 res =  (result.xyz ); ') 

             .InLine('result = vec4((vuv.x > 0.98 || vuv.x <0.01? res*map2:((vuv.y > 0. && vuv.y <0.25) || (vuv.y > 0.5 && vuv.y <0.75)? res*map3:res*map1) ),1.); ') 

            .Back('result.xyz = result.xyz*0.5;')


            .BuildMaterial(sc);

    },
    "standard": function (op, sc) {
        op = def(op, {});  

        if (sc == null) return op;
        return new SB()
             .Map({ path: 'Files/uploads/' + path, uv: 'vec2(vuv*' + BABYLONX.Shader.Print(uv) + ')' })
            
            .Back('result.xyz = result.xyz*0.5;')


            .BuildMaterial(sc);

    },
    
};

// http://demos.5kb.me/Petrocad/Files/uploads/asdasdsad2.jpg

