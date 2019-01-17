var canvas = first('render > canvas');
var engine = new BABYLON.Engine(canvas, true);
var scene, main_camera,currMesh, time = 0,me0,me1,me2,me3,me4,me5,me6,me7,me8,mesh0,mesh1,mesh2,option_ts , ts_logs, currGiz,currGizSelceted;
 
function showRotateGizmo(a) {
    if (a) {
        showMoveGizmo(false);
        showScaleGizmo(false);
    }
    mesh0.visibility = a;
    mesh1.visibility = a;
    mesh2.visibility = a;
    me0.visibility = a;
    me1.visibility = a;
    me2.visibility = a;

    mesh0.isPickable = a;
    mesh1.isPickable = a;
    mesh2.isPickable = a;
    me0.isPickable = a;
    me1.isPickable = a;
    me2.isPickable = a; 

}

function showMoveGizmo(a) {
    if (a) {
        showRotateGizmo(false);
        showScaleGizmo(false);
    }
    me3.visibility = a;
    me4.visibility = a;
    me5.visibility = a;

    me3.isPickable = a;
    me4.isPickable = a;
    me5.isPickable = a;
    
}

function showScaleGizmo(a) {
    if (a) {
        showMoveGizmo(false);
        showRotateGizmo(false);
    }
    me6.visibility = a;
    me7.visibility = a;
    me8.visibility = a;

    me6.isPickable = a;
    me7.isPickable = a;
    me8.isPickable = a;
}


var createScene = function () {

    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0., 0., 0., 0.);

    main_camera = new BABYLON.ArcRotateCamera("camera1", 3, 3, 3, new BABYLON.Vector3(0, 5, -10), scene);
    main_camera.setTarget(BABYLON.Vector3.Zero());
    main_camera.attachControl(canvas, true);
    main_camera.lowerRadiusLimit = 2;
    
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene); 
    light.intensity = 0.7;

    
    GB = BABYLONX.GeometryBuilder;
    SB = BABYLONX.ShaderBuilder;
    BABYLONX.GeometryBuilder.InitializeEngine();
    BABYLONX.ShaderBuilder.InitializeEngine();



    var geo1 = function (op) {
        var builder = function (setting /*{seg:number}*/, geo) {


            setting.seg = setting.seg.valueOf() * 1.0;
            setting.flip = setting.flip.valueOf() * 1;
            setting.close = setting.close.valueOf() * 1;
            setting.rad = setting.rad.valueOf() * 1.0;
            setting.deep = setting.deep.valueOf() * 1.0;
            setting.h = setting.h.valueOf() * 1.0;
            if (setting.path == "0") {
                setting.path = "M 668.18358,526.17859 A 142.18358,142.18358 0 0 1 526,668.36217 142.18358,142.18358 0 0 1 383.81642,526.17859 142.18358,142.18358 0 0 1 526,383.99501 142.18358,142.18358 0 0 1 668.18358,526.17859 Z";
            }
            if (setting.path2 == "0") {
                setting.path2 = "M 668.18358,526.17859 A 142.18358,142.18358 0 0 1 526,668.36217 142.18358,142.18358 0 0 1 383.81642,526.17859 142.18358,142.18358 0 0 1 526,383.99501 142.18358,142.18358 0 0 1 668.18358,526.17859 Z";
            }

            var ind = 0;
            var process = function (pts1, pts2) {

                var n = pts1.length;
                var m = pts2.length;
                var r = max(n, m);

                var fy = function (i, n) {
                    var f = function (ix) { return ceil((ix + 1) * (n / r)) - 1; };
                    var f2 = function (ix) { return ceil(ix * (n / r)); };

                    var fn = f(n);
                    if (fn <= n) return f2(i);
                    else f(i);
                };

                var p = { p1: [], p2: [] };
                for (var i = 1; i <= r; i++) {
                    p.p1.push(fy(i, n) - 1);
                    p.p2.push(fy(i, m) - 1);
                }
                return p;
            };

            var cylc = function (s, l, r, f, p, path/*{d:svg path ,c:point length,l:inline 1 0,s:scale,p:push fun(r,n,e)} */, t) {

                var path_pts = null;
                if (path) {

                    if (!GB.cachePath) GB.cachePath = [];

                    if (path.d.indexOf('|') != -1) {
                        var key = path.d.split('|')[0];
                        path.d = path.d.split('|')[1];
                        GB.cachePath[key] = path.d;
                    }

                    if (path.d.indexOf('=') == 0) {
                        path.d = GB.cachePath[path.d.replace('=', '')];
                    }

                    path.d = def(path.d, "m 547.25,526.17859 c 0,0 -0.75,-28.06641 -21.25,-28.31641 -20.5,-0.25 -20.25,16.5 -20.25,16.5");
                    path.l = def(path.l, 0);
                    path.s = def(path.s, 100);
                    path.c = def(path.c, 100);

                    var key = JSON.stringify(path);

                    if (!GB.cache) GB.cache = [];

                    if (t) { GB.cache[key] = null; }

                    if (GB.cache[key]) path_pts = GB.cache[key];

                    else {

                        path_pts = GB.GetPoints({
                            path: path.d,
                            push: def(path.p, function (r, n, e) {
                                if (e) {
                                    if (setting.close) r.push(r[0]);
                                    return r;
                                }
                                r.push({ x: (-n.x + 526) / path.s, y: 0.0, z: (n.y - 526) / path.s });
                            }), pointLength: path.c - 1, inLine: path.l
                        });

                        GB.cache[key] = path_pts;
                    }

                    s = path_pts.length;

                }

                if (r.length == 1) {

                    r = r[0];
                    if (r.step) {
                        var i = { i: [], f: [], isCylc: true, std: r.std };
                        for (var j in r.step)
                        { i.i.push(r.r.i[r.step[j]]); }
                        r = i;
                    }

                }



                var sylc = { i: [], f: [], isCylc: true, std: ind };
                var std = ind;

                if (!s.step && s > 1) {
                    var al = (2. * Math.PI) / (s - 1);

                    for (var i = 0; i < s; i++) {
                        var al1 = i * al;
                        var pot = { x: 10. * sin(al1), y: 0., z: 10. * cos(al1) };

                        if (path && path_pts && path_pts[i])
                            pot = { x: path_pts[i].x, y: path_pts[i].y, z: path_pts[i].z };

                        var pot1 = r_y(pot, def(p.ry, 0.) * Math.PI / 180., def(p.ce, { x: 0, y: 0, z: 0 }));
                        var pot2 = r_x(pot1, def(p.rx, 0.) * Math.PI / 180., def(p.ce, { x: 0, y: 0, z: 0 }));
                        var pot3 = r_z(pot2, def(p.rz, 0.) * Math.PI / 180., def(p.ce, { x: 0, y: 0, z: 0 }));

                        pot3.y *= def(p.sy, 1.);
                        pot3.z *= def(p.sz, 1.);
                        pot3.x *= def(p.sx, 1.);
                        pot3.y *= def(p.sa, 1.);
                        pot3.z *= def(p.sa, 1.);
                        pot3.x *= def(p.sa, 1.);

                        pot3.y += def(p.y, 0.);
                        pot3.z += def(p.z, 0.);
                        pot3.x += def(p.x, 0.);



                        pot3 = r_y(pot, def(p.mry, 0.) * Math.PI / 180., def(p.mce, { x: 0, y: 0, z: 0 }));
                        pot3 = r_x(pot1, def(p.mrx, 0.) * Math.PI / 180., def(p.mce, { x: 0, y: 0, z: 0 }));
                        pot3 = r_z(pot2, def(p.mrz, 0.) * Math.PI / 180., def(p.mce, { x: 0, y: 0, z: 0 }));



                        GB.PushVertex(geo, pot3);
                        sylc.i[i] = ind;
                        ind++;
                        geo.uvs.push(i / s, l);
                    }

                } else {
                    for (var j in s.step)
                    { sylc.i.push(s.r.i[s.step[j]]); }
                    sylc.std = s.r.std;
                }



                if (r == 0) {
                    return sylc;
                }



                if (r.isCylc) {
                    var p1 = [];
                    for (var i = 0; i < sylc.i.length ; i++) {
                        p1.push(sylc.i[i]);
                    }
                    var hlp = process(p1, r.i);

                    for (var i = 0; i < hlp.p1.length - 1; i++) {
                        GB.MakeFace(geo, [p1[hlp.p1[i]], r.i[hlp.p2[i]], p1[hlp.p1[i + 1]], r.i[hlp.p2[i + 1]]], { flip: f, faceUVMap: "0123" });
                        sylc.f[geo.faces.length];
                    }


                }

                return sylc;
            };


            setting.struct = def(setting.struct, function () {
                var refn = 0;

                var pt = { x: 0, y: 0, z: 0 };

                var ref0 = cylc(80, 0., [refn], !setting.flip, { x: pt.x, y: 0., z: pt.z, sa: setting.rad - setting.deep / 2. },
                    {
                        s: 1, l: 1, c: setting.seg,
                        d: "A|" + def(setting.path, 'M 668.18358,526.17859 A 142.18358,142.18358 0 0 1 526,668.36217 142.18358,142.18358 0 0 1 383.81642,526.17859 142.18358,142.18358 0 0 1 526,383.99501 142.18358,142.18358 0 0 1 668.18358,526.17859 Z')
                    }, true);


                var ref = cylc(80, 0., [refn], !setting.flip, { x: pt.x, y: -30. * setting.h / 2., z: pt.z, sa: setting.rad },
                   {
                       s: 1, l: 1, c: setting.seg,
                       d: "=A"
                   });

                var ref1 = cylc(80, 0.25, [ref], !setting.flip, { x: pt.x, y: -30. * setting.h / 2., z: pt.z, sa: setting.rad - setting.deep },
                   {
                       s: 1, l: 1, c: setting.seg,
                       d: "B|" + def(setting.path2, setting.path)
                   });
                ref1 = cylc(80, 0.25, [ref1], !setting.flip, { x: pt.x, y: -30. * setting.h / 2., z: pt.z, sa: setting.rad - setting.deep },
                {
                    s: 1, l: 1, c: setting.seg,
                    d: "=B"
                });


                var ref2 = cylc(80, 0.5, [ref1], !setting.flip, { x: pt.x, y: 30. * setting.h / 2., z: pt.z, sa: setting.rad - setting.deep },
                    {
                        s: 1, l: 1, c: setting.seg,
                        d: "=B"
                    });
                ref2 = cylc(80, 0.5, [ref2], !setting.flip, { x: pt.x, y: 30. * setting.h / 2., z: pt.z, sa: setting.rad - setting.deep },
                      {
                          s: 1, l: 1, c: setting.seg,
                          d: "=B"
                      });


                var ref3 = cylc(80, 0.75, [ref2], !setting.flip, { x: pt.x, y: 30. * setting.h / 2., z: pt.z, sa: setting.rad },
                     {
                         s: 1, l: 1, c: setting.seg,
                         d: "=A"
                     });
                ref3 = cylc(80, 0.75, [ref3], !setting.flip, { x: pt.x, y: 30. * setting.h / 2., z: pt.z, sa: setting.rad },
              {
                  s: 1, l: 1, c: setting.seg,
                  d: "=A"
              });


                cylc(80, 1., [ref3], !setting.flip, { x: pt.x, y: -30. * setting.h / 2., z: pt.z, sa: setting.rad },
                    {
                        s: 1, l: 1, c: setting.seg,
                        d: "=A"
                    });


                if (!setting.close) {

                    GB.MakeFace(geo, [ref0.i[0], ref.i[0], ref1.i[0]], {
                        flip: 1, Face3Point: true
                    });
                    GB.MakeFace(geo, [ref0.i[0], ref1.i[0], ref2.i[0]], { flip: 1, Face3Point: true });
                    GB.MakeFace(geo, [ref0.i[0], ref2.i[0], ref3.i[0]], {
                        flip: 1, Face3Point: true
                    });
                    GB.MakeFace(geo, [ref0.i[0], ref3.i[0], ref.i[0]], {
                        flip: 1, Face3Point: true
                    });

                    GB.MakeFace(geo, [ref0.i[ref0.i.length - 1], ref.i[ref.i.length - 1], ref1.i[ref1.i.length - 1]]
                    , { flip: 0, Face3Point: true });

                    GB.MakeFace(geo, [ref0.i[ref0.i.length - 1], ref1.i[ref1.i.length - 1], ref2.i[ref2.i.length - 1]]
             , { flip: 0, Face3Point: true });

                    GB.MakeFace(geo, [ref0.i[ref0.i.length - 1], ref2.i[ref2.i.length - 1], ref3.i[ref3.i.length - 1]]
        , { flip: 0, Face3Point: true });
                    GB.MakeFace(geo, [ref0.i[ref0.i.length - 1], ref3.i[ref3.i.length - 1], ref.i[ref.i.length - 1]]
                      , { flip: 0, Face3Point: true });
                }


            });



            setting.struct();
        };

        return new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom));
    };

    var geo2 = function (op) {
        var builder = function (setting /*{seg:number}*/, geo) {
            var fx = function (i) {
                return { x: sin(i * PI / 180.) * 14, y: 0., z: cos(i * PI / 180.) * 14 };
            };
            GB.PushVertex(geo, { x: 0, y: 0, z: 0 });
            geo.uvs.push(0, 0);

            for (var i = 0; i < 37; i++) {
                GB.PushVertex(geo, fx(i * 10.));
                geo.uvs.push(1., i / 37);
            }

            for (var i = 1; i < 37 ; i++) {
                GB.MakeFace(geo, [0, i, i + 1], {
                    flip: false,
                    Face3Point: true,
                    faceUVMap: "201",
                });
            }
        };

        return new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom));
    };

    var geo3 = function (op) {
        var builder = function (setting /*{seg:number}*/, geo) {
            var fx = function (i) {
                return { x: sin(i * PI / 180.) * setting.h * 0.5, y: setting.h * 6 - setting.h, z: cos(i * PI / 180.) * setting.h * 0.5 };
            };
            GB.PushVertex(geo, { x: 0, y: setting.h * 6 +setting.h, z: 0 });
            geo.uvs.push(0, 0);

            for (var i = 0; i < setting.seg+1; i++) {
                GB.PushVertex(geo, fx(i * (360. / setting.seg)));
                geo.uvs.push(1., i / setting.seg);
            }

            for (var i = 1; i < setting.seg+1 ; i++) {
                GB.MakeFace(geo, [0, i, i + 1], {
                    flip: false,
                    Face3Point: true,
                    faceUVMap: "201",
                });
            }


            var f_x = function (i) {
                return Math.sin((Math.PI / 180.) * i * 360. / setting.seg) * 0.02;
            };

            var f_z = function (i) {
                return Math.cos((Math.PI / 180.) * i * 360. / setting.seg) * 0.02;
            };

            for (var i = 0; i < setting.seg; i++) {
                GB.MakeFace(geo,
                       [
                           { x: f_x(i), y: setting.h*6, z: f_z(i) },
                           { x: f_x(i + 1), y: setting.h * 6, z: f_z(i + 1) },
                           { x: f_x(i), y: 0, z: f_z(i) },
                           { x: f_x(i + 1), y: 0, z: f_z(i + 1) },
                       ]
                  , {
                      flip: true,
                      faceUVMap: "0123",
                      uvStart: { v: i / setting.seg, u: 0. },
                      uvEnd: { v: (i + 1) / setting.seg, u: 1. }
                  });
            }

        };

        return new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom));
    };

    var geo4 = function (op) {
        var builder = function (setting /*{seg:number}*/, geo) {
             
            var fx = function (i) {
                return { x: sin(i * PI / 180.) * setting.h * 1. , y: setting.h * 6  , z: cos(i * PI / 180.) * setting.h * 1.  };
            };
            GB.PushVertex(geo, { x: 0, y: setting.h * 6  , z: 0 });
            geo.uvs.push(0, 0);

            for (var i = 0; i < setting.seg + 1; i++) {
                GB.PushVertex(geo, fx(i * (360. / setting.seg)));
                geo.uvs.push(1., i / setting.seg);
            }

            for (var i = 1; i < setting.seg + 1 ; i++) {
                GB.MakeFace(geo, [0, i, i + 1], {
                    flip: false,
                    Face3Point: true,
                    faceUVMap: "201",
                });
            }


            var f_x = function (i) {
                return Math.sin((Math.PI / 180.) * i * 360. / setting.seg) * 0.02;
            };

            var f_z = function (i) {
                return Math.cos((Math.PI / 180.) * i * 360. / setting.seg) * 0.02;
            };

            for (var i = 0; i < setting.seg; i++) {
                GB.MakeFace(geo,
                       [
                           { x: f_x(i), y: setting.h * 6, z: f_z(i) },
                           { x: f_x(i + 1), y: setting.h * 6, z: f_z(i + 1) },
                           { x: f_x(i), y: 0, z: f_z(i) },
                           { x: f_x(i + 1), y: 0, z: f_z(i + 1) },
                       ]
                  , {
                      flip: true,
                      faceUVMap: "0123",
                      uvStart: { v: i / setting.seg, u: 0. },
                      uvEnd: { v: (i + 1) / setting.seg, u: 1. }
                  });
            }

            var f1_x = function (i) {
                return Math.sin((Math.PI / 180.) * i * 360. / setting.seg) * 0.2;
            };

            var f1_z = function (i) {
                return Math.cos((Math.PI / 180.) * i * 360. / setting.seg) * 0.2;
            };

            for (var i = 0; i < setting.seg; i++) {
                GB.MakeFace(geo,
                       [
                           { x: f1_x(i), y: setting.h * 6, z: f1_z(i) },
                           { x: f1_x(i + 1), y: setting.h * 6, z: f1_z(i + 1) },
                           { x: f1_x(i), y: setting.h * 5, z: f1_z(i) },
                           { x: f1_x(i + 1), y: setting.h * 5, z: f1_z(i + 1) },
                       ]
                  , {
                      flip: true,
                      faceUVMap: "0123",
                      uvStart: { v: i / setting.seg, u: 0. },
                      uvEnd: { v: (i + 1) / setting.seg, u: 1. }
                  });
            }



        };

        return new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom));
    };


    var wx = new wind();
    wx.steps = 10;
    wx.fun = function (i, par) {

        mesh0.scaling.x = i * 0.02;
        mesh0.scaling.y = i * 0.02;
        mesh0.scaling.z = i * 0.02;

        me3.scaling.x = i * 0.2;
        me3.scaling.y = i * 0.2;
        me3.scaling.z = i * 0.2;

        me6.scaling.x = i * 0.2;
        me6.scaling.y = i * 0.2;
        me6.scaling.z = i * 0.2;
    };

    var r = 0.1, d = 0.002, h = 0.025;
      mesh0 = geo1({ seg: 100, flip: 0, rad: r, deep: d, h: h, close: 1, path: 0, path2: 0 }).toMesh(scene);
      mesh1 = geo1({ seg: 100, flip: 0, rad: r, deep: d, h: h, close: 1, path: 0, path2: 0 }).toMesh(scene); mesh1.rotation.x = Math.PI / 2.;
      mesh2 = geo1({ seg: 100, flip: 0, rad: r, deep: d, h: h, close: 1, path: 0, path2: 0 }).toMesh(scene); mesh2.rotation.z = Math.PI / 2.;

     me0 = geo2({}).toMesh(scene);
     me1 = geo2({}).toMesh(scene); me1.rotation.x = PI / 2.;
     me2 = geo2({}).toMesh(scene); me2.rotation.z = PI / 2.;

     mesh1.parent = mesh0;
     mesh2.parent = mesh0;
     me0.parent = mesh0;
     me1.parent = mesh0;
     me2.parent = mesh0;


     me3 = geo3({h:0.2,seg:6}).toMesh(scene);
     me4 = geo3({h:0.2,seg:6}).toMesh(scene); me4.rotation.x = PI / 2.;
     me5 = geo3({h:0.2,seg:6}).toMesh(scene); me5.rotation.z = PI / 2.;
     me4.parent = me3;
     me5.parent = me3;


     me6 = geo4({ h: 0.2, seg: 10 }).toMesh(scene);
     me7 = geo4({ h: 0.2, seg: 10 }).toMesh(scene); me7.rotation.x = PI / 2.;
     me8 = geo4({ h: 0.2, seg: 10 }).toMesh(scene); me8.rotation.z = PI / 2.;
     me7.parent = me6;
     me8.parent = me6;

     showRotateGizmo(false);
     showMoveGizmo(false);
     showScaleGizmo(false);



    var mat1 = function (m) {
        var mate =  new SB()
        .SetUniform('radiuss', 'float')
        .VertexShader(  (m == 'z' ? 'pos = r_y(pos,-90.,vec3(0.));' : '')  +'\
            pos = r_y(pos,(360.-mod(radiuss,360.))*1.*uv.y,vec3(0.));\
            result = vec4(pos,1.);\
            ')
        .InLine(`
            result = vec4(`+ (m != "y" ? (m == "z" ? '1.,0.,0.' : '0.,0.,1.') : '0.,1.,0.') + `,max(0.05,vuv.x>0.65 && vuv.x <0.75 ?0.5:0.));
            `)
        .Transparency()
        .Back()
        .BuildMaterial(scene);

        mate.ctl = m;
        return mate;
    };

    var mat2 = function (m,t) {
        var r = (m != "y" ? (m == "z" ?  1.  :  0. ) :  0. );
        var b = (m != "y" ? (m == "z" ?  0.  :  1. ) :  0. );
        var g = (m != "y" ? (m == "z" ?  0.  :  0. ) :  1. );

        var mate = new SB()
       .Solid({ r: r*0.5,g:g*0.5,b:b*0.5 , a:0.15 }) 
       .Event(2, BABYLONX.Helper().Solid({ r: r*0.5, g: g*0.5, b: b*0.5, a: 1 }).Build())
       .Event(1, BABYLONX.Helper().Solid({ r: 1, g: 1, b: 0, a: 1 }).Build())
       .Back() 
       .BuildMaterial(scene);
        mate.ctl = def(t,'')+m;
        return mate;
    };

    var itm = [mesh0, mesh1, mesh2,me3,me4,me5,me6,me7,me8];

    for (var itt in itm ) {
        mesh = itm[itt];
        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
             
                ev.source.material.flagUp(2);
                currGiz = ev.source;
            

        }));
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
               ev.source.material.flagDown(2);
               currGiz = null;
        }));

    }
     
    
    first('render > canvas').addEventListener("mousedown", function (event) {
        if (currGiz) {
            main_camera.detachControl(canvas);
            currGiz.material.flagUp(1);
            currGizSelceted = { o: currGiz, x: event.clientX, y: event.clientY ,d:new Date().getTime() };


            option_ts = def(option_ts, {});
            if (currGizSelceted.o.material.ctl == 'x') {
                option_ts.orx = def(option_ts.rx, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'y') {
                option_ts.ory = def(option_ts.ry, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'z') {
                option_ts.orz = def(option_ts.rz, 0.);
            }

            else if (currGizSelceted.o.material.ctl == 'mx') {
                option_ts.omx = def(option_ts.mx, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'my') {
                option_ts.omy = def(option_ts.my, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'mz') {
                option_ts.omz = def(option_ts.mz, 0.);
            }


            else if (currGizSelceted.o.material.ctl == 'sx') {
                option_ts.osx = def(option_ts.sx, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'sy') {
                option_ts.osy = def(option_ts.sy, 0.);
            }
            else if (currGizSelceted.o.material.ctl == 'sz') {
                option_ts.osz = def(option_ts.sz, 0.);
            }
        }
    });

    first('render > canvas').addEventListener("mousemove", function (event) {
        if (currGizSelceted) {
            option_ts = def(option_ts, {});
            var drg = (event.clientX - currGizSelceted.x) * 1.001;
            if (currGizSelceted.o.material.ctl == 'x') {
                option_ts.orx = def(option_ts.rx, 0.);
                option_ts.rx = option_ts.orx +drg ;
            }
            else if (currGizSelceted.o.material.ctl == 'y') {
                option_ts.ory = def(option_ts.ry, 0.);
                option_ts.ry = option_ts.ory + drg;
            }
            else if (currGizSelceted.o.material.ctl == 'z') {
                option_ts.orz = def(option_ts.rz, 0.);
                option_ts.rz = option_ts.orz + drg;
            }

           else if (currGizSelceted.o.material.ctl == 'mx') {
                option_ts.omx = def(option_ts.mx, 0.);
                option_ts.mx = option_ts.omx + drg;
            }
            else if (currGizSelceted.o.material.ctl == 'my') {
                option_ts.omy = def(option_ts.my, 0.);
                option_ts.my = option_ts.omy + drg;
            }
            else if (currGizSelceted.o.material.ctl == 'mz') {
                option_ts.omz = def(option_ts.mz, 0.);
                option_ts.mz = option_ts.omz + drg;
            }

            else if (currGizSelceted.o.material.ctl == 'sx') {
                option_ts.osx = def(option_ts.sx, 0.);
                option_ts.sx = option_ts.osx + drg;
            }
            else if (currGizSelceted.o.material.ctl == 'sy') {
                option_ts.osy = def(option_ts.sy, 0.);
                option_ts.sy = option_ts.osy + drg;
            }
            else if (currGizSelceted.o.material.ctl == 'sz') {
                option_ts.osz = def(option_ts.sz, 0.);
                option_ts.sz = option_ts.osz + drg;
            }


            first('TS #rx').value = floor(def(option_ts.rx, 0.0) * 0.003 * 100) / 100;
            first('TS #ry').value = floor(def(option_ts.ry, 0.0) * 0.003 * 100) / 100;
            first('TS #rz').value = floor(def(option_ts.rz, 0.0) * 0.003 * 100) / 100;

            first('TS #mx').value = -1. * me3.scaling.x * floor(def(option_ts.mx, 0.0) * 0.003 * 100) / 100;
            first('TS #my').value = me3.scaling.x * floor(def(option_ts.my, 0.0) * 0.003 * 100) / 100;
            first('TS #mz').value = me3.scaling.x * floor(def(option_ts.mz, 0.0) * 0.003 * 100) / 100;

            var sx = -1. *   floor(def(option_ts.sx, 0.0) * 0.0001 * 100) / 100;
            var sy = floor(def(option_ts.sy, 0.0) * 0.0001 * 100) / 100;
            var sz = floor(def(option_ts.sz, 0.0) * 0.0001 * 100) / 100;


            first('TS #sx').value = (sx <0 ?-1./(abs(sx)+1.0001):sx) ;
            first('TS #sy').value = (sy <0 ?-1./(abs(sy)+1.0001):sy) ;
            first('TS #sz').value = (sz <0 ?-1./(abs(sz)+1.0001):sz) ;

            me3.position.x = first('TS #mx').value.valueOf() * 1.0/me3.scaling.x ;
            me3.position.y = first('TS #my').value.valueOf() * 1.0/me3.scaling.x ;
            me3.position.z = first('TS #mz').value.valueOf() * 1.0/me3.scaling.x ;

            if (currMesh) {  
                 
                currMesh.rotation.x = first('TS #rx').value.valueOf() * PI / 180.0;
                currMesh.rotation.y = first('TS #ry').value.valueOf() * PI / 180.0;
                currMesh.rotation.z = first('TS #rz').value.valueOf() * PI / 180.0;


                currMesh.position.x = first('TS #mx').value.valueOf()*1.0;
                currMesh.position.y = first('TS #my').value.valueOf()*1.0;
                currMesh.position.z = first('TS #mz').value.valueOf()*1.0;

               
                currMesh.scaling.x =1.+ first('TS #sx').value.valueOf() * 1.0;
                currMesh.scaling.y =1.+ first('TS #sy').value.valueOf() * 1.0;
                currMesh.scaling.z =1.+ first('TS #sz').value.valueOf() * 1.0;

            }
            
        }
    });

    first('render > canvas').addEventListener("mouseup", function (event) {
        if (currGizSelceted) {
            
            if (new Date().getTime() - currGizSelceted.d < 200) {
                // lock gizmo
            }

            main_camera.attachControl(canvas, true);
            mesh0.material.flagDown(1);
            mesh1.material.flagDown(1);
            mesh2.material.flagDown(1);
            me3.material.flagDown(1);
            me4.material.flagDown(1);
            me5.material.flagDown(1);
            me6.material.flagDown(1);
            me7.material.flagDown(1);
            me8.material.flagDown(1);

            currGiz = null;
            currGizSelceted = null;
        } 
    });
    first('render > canvas').addEventListener("resize", function (event) {
        engine.resize();
    });

    mesh0.material = mat2('y');
    mesh1.material = mat2('z');
    mesh2.material = mat2('x'); 

    me0.material = mat1('y');
    me1.material = mat1('z');
    me2.material = mat1('x');

    me3.material = mat2('y', 'm');
    me4.material = mat2('z', 'm');
    me5.material = mat2('x', 'm');

    me6.material = mat2('y', 's');
    me7.material = mat2('z', 's');
    me8.material = mat2('x', 's');


    scene.registerBeforeRender(function () {
        var op_ry = 0, op_rx = 0, op_rz = 0;

        if (option_ts) {
            if (option_ts.ry) op_ry = option_ts.ry;
            if (option_ts.rx) op_rx = option_ts.rx;
            if (option_ts.rz) op_rz = option_ts.rz;
        }

        me0.material.setFloat('radiuss', op_ry*0.003);
        me1.material.setFloat('radiuss', op_rz*0.003);
        me2.material.setFloat('radiuss', op_rx*0.003); 
        
        wx.go(main_camera.radius);
         
        new BABYLONX.ShaderMaterialHelper().SetUniforms( 
         
             scene.meshes,
             main_camera.position,
             main_camera.target,
              { x: 0, y: 0 },
              { x: 100, y: 100 },
                 time++);
    });

    return scene;

};

var scene = createScene()

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

var GB;
var SB;

var db_temp = new $db('tempDtorage');

db_temp.tables = [
    {
        name: 'meshInstance',
        key: 'id',
        autoKey: true,
        initFields: function (obj) {
            obj.createIndex('id', 'id', { unique: true }); 
        }
    },
    {
        name: 'material',
        key: 'id',
        autoKey: true,
        initFields: function (obj) {
            obj.createIndex('id', 'id', { unique: true });
        }
    }
];



var db_main = new $db('mainDtorage');

db_main.tables = [
    {
        name: 'meshInstance',
        key: 'id',
        autoKey: true,
        initFields: function (obj) {
            obj.createIndex('id', 'id', { unique: true });
        }
    },
    {
        name: 'material',
        key: 'id',
        autoKey: true,
        initFields: function (obj) {
            obj.createIndex('id', 'id', { unique: true });
        }
    }
];
 
window.onload = function () {
    db_temp.initDb(); db_main.initDb();
}


