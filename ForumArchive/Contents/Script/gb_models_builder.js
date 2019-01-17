// {id:'a1',seg1:150,seg2:50,oin:10,len:80,radius:0.2}



function appendItem(objName) {
    var html = first('modelTemp').innerHTML
        .replaceAll('#[Name]', objName)
        .replaceAll('#[adv]', 'hdn-i')
        
        .replaceAll('#[Action]', 'attachToModelsList')
        .replaceAll('#[Theme]', 'm-00125 w-auto cblue c-hnavy pl-005 pr-005 rad-05 ba-i-02 c-b-inavy')
        .replaceAll('#[Index]', '');
    first('helper').innerHTML += html;
}


var geo_ObjectTest = {
    prps: ['id:a1', 'seg1:150', 'seg2:50', 'oin:10', 'len:80', 'radius:0.2','transform:{}',
    'material:default',
    'options:{}', ],
    builder: function (setting /*{seg:number}*/, geo) {
        setting.seg1 = setting.seg1.valueOf() * 1.0;
        setting.seg2 = setting.seg2.valueOf() * 1.0;
        setting.len = setting.len.valueOf() * 1.0;
        setting.radius = setting.radius.valueOf() * 1.0;
        setting.oin = setting.oin.valueOf() * 1.0;

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

        var cylc = function (s, l, r, f, p, path/*{d:svg path ,c:point length,l:inline 1 0,s:scale,p:push fun(r,n,e)} */) {

            var path_pts = null;
            if (path) {

                path.d = def(path.d, "m 547.25,526.17859 c 0,0 -0.75,-28.06641 -21.25,-28.31641 -20.5,-0.25 -20.25,16.5 -20.25,16.5");
                path.l = def(path.l, 0);
                path.s = def(path.s, 100);
                path.c = def(path.c, 100);

                var key = JSON.stringify(path);

                if (!GB.cache) GB.cache = [];

                if (GB.cache[key]) path_pts = GB.cache[key];

                else {

                    path_pts = GB.GetPoints({
                        path: path.d,
                        push: def(path.p, function (r, n, e) {
                            if (e) return r;
                            r.push({ x: (-n.x + 526) / path.s, y: 0.0, z: (n.y - 526) / path.s });
                        }), pointLength: path.c, inLine: path.l
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
                console.log(JSON.stringify(sylc));
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

                GB.MakeFace(geo, [p1[hlp.p1[hlp.p1.length - 1]], r.i[hlp.p2[hlp.p1.length - 1]], p1[hlp.p1[0]], r.i[hlp.p2[0]]], { flip: f, faceUVMap: "0123" });
                sylc.f[geo.faces.length];
            }

            return sylc;
        };

        setting.struct = def(setting.struct, function () {
            var ref = 0;

            var pts = GB.GetPoints({
                path:
                "M 473.76156," + (526.17859 + setting.len) + " V 467.9384 l  " + setting.oin + ",-12.38366 v -37.46737 h 9.11375 v 44.54773 l -6.24849,10.8227 v " + (52.72079 + setting.len) + " z",
                push: function (r, n, e) {
                    if (e) return r;

                    r.push({ x: (-n.x + 526) / 100., y: 0.0, z: (n.y - 526) / 100. });

                }, pointLength: setting.seg1, inLine: 1
            });


            for (var it_pt in pts) {
                var pt = pts[it_pt];


                ref = cylc(80, it_pt / pts.length, [ref], 0, { y: -pt.z * 4., sa: setting.radius * 0.1 + pt.x * 0.05, ry: 30. },
                        {
                            s: 1, l: 1, c: setting.seg2,
                            d: "M 576.99916,526.17859 A 50.999157,50.999157 0 0 1 526,577.17775 50.999157,50.999157 0 0 1 475.00084,526.17859 50.999157,50.999157 0 0 1 526,475.17943 a 50.999157,50.999157 0 0 1 50.99916,50.99916 z"
                        });


            }
        });

        setting.struct();
    },
    define: function (build) {

        var geo1 = function (op) {
            return new BABYLONX.Geometry(GB.GeometryBase(op, build, op.custom));
        };
        return geo1;
    },
    toMesh: function (set, mat) {
        var cl = { r: Math.random() * 0.6, g: Math.random() * 0.6, b: Math.random() * 0.6 };
        var mesh = geo_ObjectTest.define(geo_ObjectTest.builder)(set).toMesh(scene);;
        mesh.material = mats["metal"](scene);
        return mesh;
    }
};
appendItem('ObjectTest');

var geo_Geology = {
    prps: ['id:a1',
        'seg:100',
        'hseg:5',
        'wseg:5',
        'deep:200.',
        'ns_l:0.001',
        'ns_n:0.',
        'path1:M 927.72414,372.17859 H 135.76451',
        'path2:M 927.72414,372.17859 H 135.76451', 
        'transform:{}',
        'material:default',
        'options:{}',

    ],
    builder: function (setting /*{seg:number}*/, geo) {
        
        setting.seg = setting.seg.valueOf() * 1.0;
        setting.hseg = setting.hseg.valueOf() * 1.0;
        setting.wseg = setting.wseg.valueOf() * 1.0;
        setting.deep = setting.deep.valueOf() * 1.0;
        setting.ns_l = setting.ns_l.valueOf() * 1.0;
        setting.ns_n = setting.ns_n.valueOf() * 1.0;
        setting.up = 0.0;
        setting.down = 0.0;


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

        var cylc = function (s, l, r, f, p,
            pa /*{d:svg path ,c:point length,l:inline 1 0,s:scale,p:push fun(r,n,e)}  
               [{l:0.1,n:1.,x:0.,y:1.,z:0.}]*/, pa2) {

            var path = { ns:pa.ns, d: pa.d, l: pa.l, c: pa.c, s: pa.s };
            var pat2 = null;
            if (pa2)
                pat2 = { d: pa2.d, l: pa2.l, c: pa2.c, s: pa2.s };


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

                if (GB.cache[key]) path_pts = GB.cache[key];

                else {

                    path_pts = GB.GetPoints({
                        path: path.d,
                        push: def(path.p, function (r, n, e) {

                            if (e) return r;
                            if (n != 0)
                                r.push({ x: (-n.x + 526) / path.s, y: 0.0, z: (n.y - 526) / path.s });
                        }), pointLength: path.c - 1, inLine: path.l
                    });

                    GB.cache[key] = path_pts;
                }

                s = path_pts.length;

            }

            var path2_pts = null;
            if (pat2) {

                if (!GB.cachePath) GB.cachePath = [];
                if (pat2.d.indexOf('|') != -1) {
                    var key = pat2.d.split('|')[0];
                    pat2.d = pat2.d.split('|')[1];
                    GB.cachePath[key] = pat2.d;
                }
                if (pat2.d.indexOf('=') == 0) {
                    pat2.d = GB.cachePath[pat2.d.replace('=', '')];
                }


                pat2.d = def(pat2.d, "m 547.25,526.17859 c 0,0 -0.75,-28.06641 -21.25,-28.31641 -20.5,-0.25 -20.25,16.5 -20.25,16.5");

                pat2.l = def(pa2.l, 0);
                pat2.s = def(pa2.s, 100);
                pat2.c = def(pa2.c, 100);

                var key = JSON.stringify(pat2);

                if (!GB.cache) GB.cache = [];

                if (GB.cache[key]) path2_pts = GB.cache[key];

                else {

                    path2_pts = GB.GetPoints({
                        path: pat2.d,
                        push: def(pat2.p, function (r, n, e) {
                            if (e) return r;
                            r.push({ x: (-n.x + 526) / pat2.s, y: 0.0, z: (n.y - 526) / pat2.s });
                        }), pointLength: pat2.c - 1, inLine: pat2.l
                    });

                    GB.cache[key] = path2_pts;
                }



            }
            var ptts = [];
            var last_ind = 0;
            for (var i = 0; i < path_pts.length; i++) {
                if (path2_pts) {
                    if (!path2_pts[i])
                        last_ind = path2_pts.length - 1;
                    else last_ind = i;
                    ptts[i] = {
                        x: (path_pts[i].x * (pa2.pr) + (1. - pa2.pr) * def(path2_pts[last_ind].x, path_pts[last_ind].x)),
                        y: (path_pts[i].y * (pa2.pr) + (1. - pa2.pr) * def(path2_pts[last_ind].y, path_pts[last_ind].y)),
                        z: (path_pts[i].z * (pa2.pr) + (1. - pa2.pr) * def(path2_pts[last_ind].z, path_pts[last_ind].z))
                    };
                } else {
                    ptts[i] = {
                        x: (path_pts[i].x),
                        y: (path_pts[i].y),
                        z: (path_pts[i].z)
                    };
                }
            }
            s = ptts.length;


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

                    if (ptts && ptts[i])
                        pot = { x: ptts[i].x, y: ptts[i].y, z: ptts[i].z };

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

                    if (path.ns) {
                        var pnoise = { x: 0, y: 0, z: 0 };
                        for (var sind in path.ns) {
                            var ns = noise.simplex3(path.ns[sind].l * pot3.x, path.ns[sind].l * pot3.y, path.ns[sind].l * pot3.z) * path.ns[sind].n;

                            pnoise.x += path.ns[sind].x * ns;
                            pnoise.y += path.ns[sind].y * ns;
                            pnoise.z += path.ns[sind].z * ns;

                        }

                        pot3.x += pnoise.x;
                        pot3.y += pnoise.y;
                        pot3.z += pnoise.z;
                    }


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


        setting.path1 = def(setting.path1, 'm 694.00003,531.42859 c 0,0 -48.45079,-4.5 -52.75753,-4.5 -4.30673,0 -42.52901,-2.75 -42.52901,-2.75 0,0 -31.76222,-4.75 -31.76222,-8 0,-3.25 -13.99684,-5.75 -13.99684,-5.75 0,0 -19.91865,-2.25 -24.76373,-2.25 -4.84508,0 -9.15181,-1.75 -19.38031,0.25 -10.2285,2 -9.15181,1 -19.91865,3.75 -10.76684,2.75 -12.38187,3.5 -22.07202,5 -9.69016,1.5 -35.53057,5 -35.53057,5 l -44.14403,4');
        setting.path2 = def(setting.path2, 'm 692.385,557.42859 c 0,0 -12.38186,-3 -19.3803,-4 -6.99845,-1 -26.91712,-3.5 -34.99225,-4.5 -8.07513,-1 -20.99534,-7.43357 -26.9171,-7.43357 -5.92176,0 -19.38031,0 -19.38031,0 0,0 -24.76377,5.06644 -24.76377,0 0,-5.06643 -16.68855,-7.06643 -16.68855,-7.06643 0,0 -13.99689,-4.25 -17.76529,-4.75 -3.76839,-0.5 -24.22538,-0.25 -27.45543,0.25 -3.23006,0.5 -11.84353,3 -17.22695,4.5 -5.38342,1.5 1.61503,7.06643 -11.84352,7.06643 -13.45855,0 -10.22849,-5.43356 -22.61036,0 -12.38186,5.43357 -17.76528,4.93357 -37.14559,9.43357 -19.38031,4.5 -31.76217,6 -31.76217,6');
        

        setting.struct = def(setting.struct, function(){
            var ref = 0;
 
            var cord = {s:[],e:[]};
            var uvv = 0.;
       
            ref = cylc(  80,0.,[ref],0,{ y:setting.up, rx:90, z:-setting.deep   },
            {s:1,l:1,c:setting.seg,
                d:setting.path1} ); 
            cord.s.push(ref.i[0]*1);
            cord.e.push(ref.i[ref.i.length-1]*1);

            for (var i = 1; i < setting.hseg-1  ; i++) {
                ref = cylc(1, uvv + 0.25*i/setting.hseg, [ref], 0, {rx:90,
                    y: setting.up - (setting.up-setting.down) * i / setting.hseg,
                    z: -setting.deep,  
                },
               { ns:[{l:0.1,n:0.1,x:0.,y:0.,z:10.}] , s: 1, l: 1, c: setting.seg, d: setting.path2 }, 
               { s: 1, l: 1, c: setting.seg, d: setting.path1, pr: (i + 1.) / setting.hseg });

                cord.s.push(ref.i[0]*1);
                cord.e.push(ref.i[ref.i.length-1]*1);
            } 
            uvv = 0.25;
            ref = cylc(80, 0.25, [ref], 0, { rx: 90, z: -setting.deep, y: -1.0*setting.down },
             {s:1,l:1,c:setting.seg,
                 d:setting.path2} );
            cord.s.push(ref.i[0]*1);
            cord.e.push(ref.i[ref.i.length-1]*1);

            for (var i = 1; i < setting.wseg-1  ; i++) {
                ref = cylc(1, uvv + 0.25*i/setting.wseg, [ref], 0, {rx:90,
                    y:  - setting.down ,
                    z: -setting.deep+i*setting.deep*2./setting.wseg,  
                },
               { ns:[{l:setting.ns_l,n:setting.ns_n,x:0.,y:10.,z: 0.}] , s: 1, l: 1, c: setting.seg, d: setting.path2 } );

                cord.s.push(ref.i[0]*1);
                cord.e.push(ref.i[ref.i.length-1]*1);
            } 
            uvv = 0.5;
            ref = cylc(80, 0.5, [ref], 0, {
                rx: 90, z: setting.deep,
                y:  - setting.down ,
            },
                   {s:1,l:1,c:100,
                       d:setting.path2} );
            cord.s.push(ref.i[0]*1);
            cord.e.push(ref.i[ref.i.length-1]*1);

            for (var i = 1; i < setting.hseg-1  ; i++) {
                ref = cylc(1, uvv + 0.25*i/setting.hseg, [ref], 0, {rx:90,
                    y: -setting.down  + (setting.up + setting.down) * i / setting.hseg,
                    z:  setting.deep,  
                },
               { ns:[{l:0.1,n:0.1,x:0.,y:0.,z:10.}] , s: 1, l: 1, c: setting.seg, d: setting.path1 },
                { s: 1, l: 1, c: setting.seg, d: setting.path2, pr: (i + 1.) / setting.hseg });

                cord.s.push(ref.i[0]*1);
                cord.e.push(ref.i[ref.i.length-1]*1);
            } 
      
            uvv = 0.75;
            ref = cylc(  80,0.75,[ref],0,{rx:90 ,z: setting.deep , y:setting.up },
                   {s:1,l:1,c:setting.seg,
                       d:setting.path1} );
            cord.s.push(ref.i[0]*1);
            cord.e.push(ref.i[ref.i.length-1]*1);

            for (var i = 1; i < setting.wseg-1  ; i++) {
                ref = cylc(1, uvv + 0.25*i/setting.wseg, [ref], 0, {rx:90,
                    y:setting.up,
                    z:  setting.deep-i*setting.deep*2./setting.wseg,  
                },
               { ns:[{l:setting.ns_l,n:setting.ns_n,x:0.,y:10.,z: 0.}] , s: 1, l: 1, c: setting.seg, d: setting.path1 } );

                cord.s.push(ref.i[0]*1);
                cord.e.push(ref.i[ref.i.length-1]*1);
            } 
  
            ref = cylc(80, 1., [ref], 0, { rx: 90, z: -setting.deep, y: setting.up },
                   {s:1,l:1,c:100,
                       d:setting.path1} );
            cord.s.push(ref.i[0]*1);
            cord.e.push(ref.i[ref.i.length - 1] * 1);


             

            for (var j = 0; j < cord.s.length / 2.; j++) {

                if(cord.s[j] && cord.s[j+1] && cord.s[cord.s.length - j - 1])
                    GB.MakeFace(geo, [cord.s[j], cord.s[j + 1], cord.s[cord.s.length - j - 1]], {
                        flip: false,
                        Face3Point: true,
                        faceUVMap: "012"
                    });
                

                if (cord.s[cord.s.length - j - 1] && cord.s[j] && cord.s[cord.s.length - j]) 
                    GB.MakeFace(geo, [cord.s[cord.s.length - j - 1], cord.s[j], cord.s[cord.s.length - j]], {
                        flip: true,
                        Face3Point: true,
                        faceUVMap: "012"
                    });
                

            }

            for (var j = 0; j < cord.e.length / 2.; j++) {

                if(cord.e[j] && cord.e[j+1] && cord.e[cord.e.length - j - 1]) 
                    GB.MakeFace(geo, [cord.e[j], cord.e[j + 1], cord.e[cord.e.length - j - 1]], {
                        flip: true,
                        Face3Point: true,
                        faceUVMap: "012"
                    });
                 

                if (cord.e[cord.e.length - j - 1] && cord.e[j] && cord.e[cord.e.length - j])  
                    GB.MakeFace(geo, [cord.e[cord.e.length - j - 1], cord.e[j], cord.e[cord.e.length - j]], {
                        flip: false,
                        Face3Point: true,
                        faceUVMap: "012"
                    });
                

            }




        }); 
        setting.struct(); 

    
    },
    define: function (build) {

        var geo1 = function (op) {
            return new BABYLONX.Geometry(GB.GeometryBase(op, build, op.custom));
        };
        return geo1;
    },
    toMesh: function (set, mat) {
        var mesh = geo_Geology.define(geo_Geology.builder)(set).toMesh(scene);;
        try {
            mesh.material = mats[set.material](js(set.options), scene);
        } catch (e) { }
        try {
            if (set.ts) {
                var ots = js(set.ts);

                ots = def(ots, {});


                ots.mx = def(ots.mx, 0.);
                ots.my = def(ots.my, 0.);
                ots.mz = def(ots.mz, 0.);
                ots.rx = def(ots.rx, 0.);
                ots.ry = def(ots.ry, 0.);
                ots.rz = def(ots.rz, 0.);
                ots.mcx = def(ots.mcx, 0.);
                ots.mcy = def(ots.mcy, 0.);
                ots.mcz = def(ots.mcz, 0.);
                ots.rcx = def(ots.rcx, 0.);
                ots.rcy = def(ots.rcy, 0.);
                ots.rcz = def(ots.rcz, 0.);
                ots.sa = def(ots.sa, 1.);


                mesh.rotation.x = ots.rx * Math.PI / 180.;
                mesh.rotation.y = ots.ry * Math.PI / 180.;
                mesh.rotation.z = ots.rz * Math.PI / 180.;

                mesh.position.x = ots.mx;
                mesh.position.y = ots.my;
                mesh.position.z = ots.mz;
            }
        } catch (e) { }
        return mesh;
    }
}
appendItem('Geology');

var geo_Ring = {
    prps: ['id:a1',
       'seg:140',
       'flip:0',
       'rad:0.1',
       'deep:0.04',
       'h:0.08',
       'close:1',
       'path:0',
       'path2:0',
       'transform:{}',
       'material:default',
       'options:{}', 

    ],
    builder: function (setting /*{seg:number}*/, geo) {
         

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

            var cylc = function (s, l, r, f, p, path/*{d:svg path ,c:point length,l:inline 1 0,s:scale,p:push fun(r,n,e)} */ , t) {

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

                    if (t) { GB.cache[key] = null;}

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
                    console.log(JSON.stringify(sylc));
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
                    },true);


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
    },
    define: function (build) {

        var geo1 = function (op) {
            return new BABYLONX.Geometry(GB.GeometryBase(op, build, op.custom));
        };
        return geo1;
    },
    toMesh: function (set, mat) {
        var mesh = geo_Ring.define(geo_Ring.builder)(set).toMesh(scene);;
        try {
            mesh.material = mats[set.material](js(set.options), scene);
        } catch (e) { }
        try {
            if (set.transform) {
                 
                var ots = js(set.transform);

                ots = def(ots, {});


                ots.mx = def(ots.mx, 0.);
                ots.my = def(ots.my, 0.);
                ots.mz = def(ots.mz, 0.);
                ots.rx = def(ots.rx, 0.);
                ots.ry = def(ots.ry, 0.);
                ots.rz = def(ots.rz, 0.);
                ots.mcx = def(ots.mcx, 0.);
                ots.mcy = def(ots.mcy, 0.);
                ots.mcz = def(ots.mcz, 0.);
                ots.rcx = def(ots.rcx, 0.);
                ots.rcy = def(ots.rcy, 0.);
                ots.rcz = def(ots.rcz, 0.);
                ots.sa = def(ots.sa, 1.);


                mesh.rotation.x = ots.rx * Math.PI / 180.;
                mesh.rotation.y = ots.ry * Math.PI / 180.;
                mesh.rotation.z = ots.rz * Math.PI / 180.;

                mesh.position.x = ots.mx;
                mesh.position.y = ots.my;
                mesh.position.z = ots.mz;
            }
        } catch (e) { }
        return mesh;
    }
};
appendItem('Ring');

var geo_Geology_CSV = {
    prps: ['id:a1', 
        'seg:10.',
        'deep:10.',
        'scale:1.0',
         'data:[]',
        'noise:[{l:0.1,n:0.2}]',
        'transform:{}',
        'material:geology',
        'options:{}', 
    ],
    builder: function (setting /*{seg:number}*/, geo) {

        setting.seg = setting.seg.valueOf() * 1.0; 
        setting.deep = setting.deep.valueOf() * 1.0;
        setting.scale = setting.scale.valueOf() * 1.0;
         
        setting.center = def(setting.center, { x: 0, y: 0, z: 0 });
        setting.noise = def(setting.noise, []);
        if (typeof setting.noise == typeof "s") {
            setting.noise = js(setting.noise);
        }
       

        if (setting.data == '[]') setting.data = null;
        else if(typeof setting.data == typeof "s") setting.data = js(setting.data);
        var data = def(setting.data, [
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 0, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0.1, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 1, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 1, 1, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 1, 1, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 1, 1, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0.1, 0, 0, 0, 0, 0, 0, 0,
            0, 2, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 2, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 2, 1, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 2, 1, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 2, 1, 3, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0.1, 0, 0, 0, 0, 0, 0, 0,
            0, 3, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 3, 1, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 3, 1, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 3, 1.5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 3, 1.5, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 3, 1.5, 4, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0.1, 0, 0, 0, 0, 0, 0, 0,
            0, 4, 1.5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 4, 1.5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 4, 1.5, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 4, 1.5, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 4, 1.5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 4, 1.5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0.1, 0, 0, 0, 0, 0, 0, 0,
            0, 5, 1.5, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0.1, 0, 0, 0, 0, 0, 0, 0,
            1, 5, 1.5, 6, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0.1, 0, 0, 0, 0, 0, 0, 0,
            2, 5, 1, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0.1, 0, 0, 0, 0, 0, 0, 0,
            3, 5, 1, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 0.1, 0, 0, 0, 0, 0, 0, 0,
            4, 5, 1, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 0.1, 0, 0, 0, 0, 0, 0, 0,
            5, 5, 1, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 0.1, 0, 0, 0, 0, 0, 0, 0, 
        ]);

        var rows = [], deepData = [];
        var maxi = 0, maxj = 0, maxv = { x: 0., x: 0., z: 0. }, minv = { x: 0., y: 0., z: 0. };
        var ce = { x: data[2] * setting.scale - setting.center.x, y: data[3] * setting.scale - setting.center.y, z: data[4] * setting.scale - setting.center.z };
        for (var i = 0; i < data.length; i += 23) {
            if (data[i] && rows[data[i]]) rows[data[i]] = def(rows[data[i]], []);

            var vector = {
                i: data[i],
                j: data[i + 1],
                v1: { x: data[i + 2] * setting.scale - ce.x, z: data[i + 3] * setting.scale - ce.y, y: data[i + 4] * setting.scale - ce.z },
                ym: data[i + 14],
                pr: data[i + 15]
            };

            if (data[i] > maxi) maxi = data[i];
            if (data[i + 1] > maxj) maxj = data[i + 1];

            if (vector.v1.x > maxv.x) maxv.x = vector.v1.x;
            if (vector.v1.y > maxv.y) maxv.x = vector.v1.y;
            if (vector.v1.z > maxv.z) maxv.x = vector.v1.z;

            if (vector.v1.x < minv.x) minv.x = vector.v1.x;
            if (vector.v1.y < minv.y) minv.x = vector.v1.y;
            if (vector.v1.z < minv.z) minv.x = vector.v1.z; 

            var id = (GB.PushVertex(geo, vector.v1));
            geo.uvs.push(0., (vector.ym) / 50 );

            rows[data[i]] = def(rows[data[i]], []);
            rows[data[i]][data[i + 1]] = id; 
        }

        setting.row = maxi + 1;
        setting.col = maxj + 1;

       
        for (var i = 0; i < data.length; i += 23) {
            if (data[i] && rows[data[i]]) rows[data[i]] = def(rows[data[i]], []);

            var vector = {
                i: data[i],
                j: data[i + 1],
                v1: { x: data[i + 2] * setting.scale - ce.x, z: data[i + 3] * setting.scale - ce.y, y: data[i + 4] * setting.scale - ce.z },
                ym: data[i + 14],
                pr: data[i + 15]
            };



            if (data[i] == 0 || data[i + 1] == 0 || data[i + 1] == setting.col - 1 || data[i] == setting.row - 1) {
                 
                for (var z = 0; z < setting.seg; z++) {

                    var l = 0.03, n = 0.1;
                    var ns = 0.;
                   
                    for (var ns1 = 0; ns1 < setting.noise.length; ns1++) {
                        l = setting.noise[ns1].l, n = setting.noise[ns1].n;
                        if (setting.noise[ns1].z)
                            ns *= (z / setting.deep) * n * noise.simplex3(-z * l * setting.deep / setting.seg + vector.v1.x, l * vector.v1.y, l * vector.v1.z);
                        else
                            ns += (z / setting.deep) * n * noise.simplex3(-z * l * setting.deep / setting.seg + vector.v1.x, l * vector.v1.y, l * vector.v1.z);
                    }

                    if (z == 0) ns = 0;

                     
                    var id2 = (GB.PushVertex(geo, { x: -z * setting.deep / setting.seg + vector.v1.x, y: ns + vector.v1.y, z: vector.v1.z }));
                    geo.uvs.push(z / setting.seg, (vector.ym  ) / 50  );

                    deepData[data[i]] = def(deepData[data[i]], []);
                    deepData[data[i]][data[i + 1]] = def(deepData[data[i]][data[i + 1]], []);
                    deepData[data[i]][data[i + 1]][z] = id2;
                }
            }

        }


        for (var i = 0; i < maxi; i++) {
            for (var j = 0; j < maxj; j++) {

                GB.MakeFace(geo, [
                  rows[i][j],
                  rows[(i + 1)][j],
                  rows[(i)][(j + 1)],
                  rows[(i + 1)][(j + 1)],
                ], {
                    flip: false,
                    faceUVMap: "0123",
                    uvStart: { u: 0.01, v: 0.5 },
                    uvEnd: { u: 0.01, v: 0.5 },
                });

            }
        }

        
        for (var z = 0; z < setting.seg - 1; z++) {
            for (var ci = 0; ci < maxj; ci++) {
                
                GB.MakeFace(geo, [
                  deepData[0][ci][z],
                  deepData[0][ci + 1][z],
                  deepData[0][ci][z + 1],
                  deepData[0][ci + 1][z + 1],
                ], {
                    flip: false,
                    faceUVMap: "0123",
                    uvStart: { u: 0.01, v: 0.5 },
                    uvEnd: { u: 0.01, v: 0.5 },
                });
            }

            for (var ci = 0; ci < maxj; ci++) {
                GB.MakeFace(geo, [
                  deepData[maxi][ci][z],
                  deepData[maxi][ci + 1][z],
                  deepData[maxi][ci][z + 1],
                  deepData[maxi][ci + 1][z + 1],
                ], {
                    flip: !false,
                    faceUVMap: "0123",
                    uvStart: { u: 0.01, v: 0.5 },
                    uvEnd: { u: 0.01, v: 0.5 },
                });
            }

            for (var ci = 0; ci < maxi; ci++) {
                GB.MakeFace(geo, [
                  deepData[ci][maxj][z],
                  deepData[ci + 1][maxj][z],
                  deepData[ci][maxj][z + 1],
                  deepData[ci + 1][maxj][z + 1],
                ], {
                    flip: false,
                    faceUVMap: "0123",
                    uvStart: { u: 0.01, v: 0.5 },
                    uvEnd: { u: 0.01, v: 0.5 },
                });
            }

            for (var ci = 0; ci < maxi; ci++) {
                GB.MakeFace(geo, [
                  deepData[ci][0][z],
                  deepData[ci + 1][0][z],
                  deepData[ci][0][z + 1],
                  deepData[ci + 1][0][z + 1],
                ], {
                    flip: !false,
                    faceUVMap: "0123",
                    uvStart: { u: 0.01, v: 0.5 },
                    uvEnd: { u: 0.01, v: 0.5 },
                });
            } 
        } 
    },
    define: function (build) {

        var geo1 = function (op) {
            return new BABYLONX.Geometry(GB.GeometryBase(op, build, op.custom));
        };
        return geo1;
    },
    toMesh: function (set, mat) {
        var mesh = geo_Geology_CSV.define(geo_Geology_CSV.builder)(set).toMesh(scene); 
        try {
            mesh.material = mats[set.material](js(set.options), scene);
        } catch (e) { }
        try {
            if (set.transform) {

                var ots = js(set.transform);

                ots = def(ots, {});


                ots.mx = def(ots.mx, 0.);
                ots.my = def(ots.my, 0.);
                ots.mz = def(ots.mz, 0.);
                ots.rx = def(ots.rx, 0.);
                ots.ry = def(ots.ry, 0.);
                ots.rz = def(ots.rz, 0.);
                ots.mcx = def(ots.mcx, 0.);
                ots.mcy = def(ots.mcy, 0.);
                ots.mcz = def(ots.mcz, 0.);
                ots.rcx = def(ots.rcx, 0.);
                ots.rcy = def(ots.rcy, 0.);
                ots.rcz = def(ots.rcz, 0.);
                ots.sa = def(ots.sa, 1.);


                mesh.rotation.x = ots.rx * Math.PI / 180.;
                mesh.rotation.y = ots.ry * Math.PI / 180.;
                mesh.rotation.z = ots.rz * Math.PI / 180.;

                mesh.position.x = ots.mx;
                mesh.position.y = ots.my;
                mesh.position.z = ots.mz;
            }
        } catch (e) { }
        return mesh;
    }
};
appendItem('Geology_CSV');