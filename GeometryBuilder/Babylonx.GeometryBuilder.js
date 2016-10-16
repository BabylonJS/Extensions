var BABYLONX;
(function (BABYLONX) {
    var GeometryBuilder = (function () {
        function GeometryBuilder() {
        }
        GeometryBuilder.GetTotalLength = function (path) {
            return null;
        };
        GeometryBuilder.Dim = function (v, u) {
            return Math.sqrt(Math.pow(u.x - v.x, 2.) + Math.pow(u.y - v.y, 2.) + (GeometryBuilder.Def(u.z, GeometryBuilder._null) ? Math.pow(u.z - v.z, 2.) : 0));
        };
        GeometryBuilder.Def = function (a, d) {
            if (a != undefined && a != null)
                return (d != undefined && d != null ? a : true);
            else if (d != GeometryBuilder._null)
                return (d != undefined && d != null ? d : false);
            return null;
        };
        GeometryBuilder.Replace = function (s, t, d) {
            var ignore = null;
            return s.replace(new RegExp(t.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (d) == "string") ? d.replace(/\$/g, "$$$$") : d);
        };
        GeometryBuilder.AddUv = function (faceUV, geo, index, uvs, uve) {
            if (!faceUV || faceUV.length == 0 || faceUV.length < index) {
                geo.uvs.push(uvs.u, uvs.v);
                return;
            }
            if (faceUV[index].toString() == "0")
                geo.uvs.push(uvs.u, uvs.v);
            if (faceUV[index].toString() == "1")
                geo.uvs.push(uvs.u, uve.v);
            if (faceUV[index].toString() == "2")
                geo.uvs.push(uve.u, uvs.v);
            if (faceUV[index].toString() == "3")
                geo.uvs.push(uve.u, uve.v);
        };
        ;
        GeometryBuilder.Exchange = function (p) {
            if (!GeometryBuilder.Def(p, GeometryBuilder._null))
                return false;
            return (p.x || p.x == 0.0);
        };
        GeometryBuilder.PushVertex = function (geo, p1, uv) {
            if (uv)
                uv = { u: 0., v: 0. };
            geo.vertices.push({ x: p1.x, y: p1.y, z: p1.z });
            geo.positions.push(p1.x, p1.y, p1.z);
            if (uv)
                geo.uvs.push(uv.u, uv.v);
            return geo.vertices.length - 1;
        };
        GeometryBuilder.MakeFace = function (geo, _points, option) {
            if (!option)
                option = {
                    faceUVMap: "",
                    pointIndex1: null,
                    pointIndex2: null,
                    pointIndex3: null,
                    pointIndex4: null,
                    uvStart: null,
                    uvEnd: null,
                    Face3Point: false,
                    flip: false,
                    onlyPush: false
                };
            var points = { point1: _points[0], point2: _points[1], point3: _points[2], point4: _points[3] };
            if (!option.uvStart)
                option.uvStart = { u: 0., v: 0. };
            if (!option.uvEnd)
                option.uvEnd = { u: 1., v: 1. };
            if (option.onlyPush || GeometryBuilder.Exchange(points.point1)) {
                geo.vertices.push({ x: points.point1.x, y: points.point1.y, z: points.point1.z });
                geo.positions.push(points.point1.x, points.point1.y, points.point1.z);
                GeometryBuilder.AddUv(option.faceUVMap, geo, 0, option.uvStart, option.uvEnd);
                option.pointIndex1 = geo.vertices.length - 1;
            }
            if (option.onlyPush || GeometryBuilder.Exchange(points.point2)) {
                geo.vertices.push({ x: points.point2.x, y: points.point2.y, z: points.point2.z });
                geo.positions.push(points.point2.x, points.point2.y, points.point2.z);
                GeometryBuilder.AddUv(option.faceUVMap, geo, 1, option.uvStart, option.uvEnd);
                option.pointIndex2 = geo.vertices.length - 1;
            }
            if (option.onlyPush || GeometryBuilder.Exchange(points.point3)) {
                geo.vertices.push({ x: points.point3.x, y: points.point3.y, z: points.point3.z });
                geo.positions.push(points.point3.x, points.point3.y, points.point3.z);
                GeometryBuilder.AddUv(option.faceUVMap, geo, 2, option.uvStart, option.uvEnd);
                option.pointIndex3 = geo.vertices.length - 1;
            }
            if (!option.Face3Point) {
                if (option.onlyPush || GeometryBuilder.Exchange(points.point4)) {
                    geo.vertices.push({ x: points.point4.x, y: points.point4.y, z: points.point4.z });
                    geo.positions.push(points.point4.x, points.point4.y, points.point4.z);
                    GeometryBuilder.AddUv(option.faceUVMap, geo, 3, option.uvStart, option.uvEnd);
                    option.pointIndex4 = geo.vertices.length - 1;
                }
            }
            if (!option.onlyPush) {
                if (option.pointIndex1 == null || option.pointIndex1 == undefined)
                    option.pointIndex1 = points.point1;
                if (option.pointIndex2 == null || option.pointIndex2 == undefined)
                    option.pointIndex2 = points.point2;
                if (option.pointIndex3 == null || option.pointIndex3 == undefined)
                    option.pointIndex3 = points.point3;
                if (!option.Face3Point) {
                    if (option.pointIndex4 == null || option.pointIndex4 == undefined)
                        option.pointIndex4 = points.point4;
                }
                if (!GeometryBuilder.Def(GeometryBuilder.isInOption, GeometryBuilder._null)) {
                    if (option.flip) {
                        geo.faces.push(option.pointIndex1, option.pointIndex2, option.pointIndex3);
                        if (!option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex4, option.pointIndex3);
                    }
                    else {
                        geo.faces.push(option.pointIndex1, option.pointIndex3, option.pointIndex2);
                        if (!option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex3, option.pointIndex4);
                    }
                }
                else {
                    if (option.flip) {
                        if (GeometryBuilder.isInOption.a && GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.c)
                            geo.faces.push(option.pointIndex1, option.pointIndex2, option.pointIndex3);
                        if (GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.d && GeometryBuilder.isInOption.c && !option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex4, option.pointIndex3);
                    }
                    else {
                        if (GeometryBuilder.isInOption.a && GeometryBuilder.isInOption.c && GeometryBuilder.isInOption.b)
                            geo.faces.push(option.pointIndex1, option.pointIndex3, option.pointIndex2);
                        if (GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.c && GeometryBuilder.isInOption.d && !option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex3, option.pointIndex4);
                    }
                }
            }
            if (!option.onlyPush)
                GeometryBuilder.isInOption = null;
            return [option.pointIndex1, option.pointIndex2, option.pointIndex3, option.pointIndex4];
        };
        GeometryBuilder.ImportGeometry = function (geo, v, f, ts) {
            var st = geo.vertices.length;
            for (var i = 0; i < v.length; i++) {
                geo.vertices.push({ x: v[i].x + (ts.x), y: v[i].y + (ts.y), z: v[i].z + (ts.z) });
                geo.positions.push(v[i].x + (ts.x), v[i].y + (ts.y), v[i].z + (ts.z));
            }
            for (var i = 0; i < f.length; i++) {
                if (!ts || !ts.checkFace || ts.face(i, f[i]))
                    geo.faces.push(f[i].a + st, f[i].b + st, f[i].c + st);
            }
        };
        GeometryBuilder.GeometryBase = function (firstp, builder, exGeo, custom) {
            var geo = {
                faces: [],
                vertices: [],
                normals: [],
                positions: [],
                uvs: [],
                uvs2: [],
                name: ""
            };
            if (!exGeo)
                exGeo = geo;
            if (builder) {
                builder(firstp, exGeo);
            }
            if (custom) {
                exGeo = custom(exGeo);
            }
            return exGeo;
        };
        GeometryBuilder.GetGeometryFromBabylon = function (geo, to) {
            to.faces = geo.indices;
            to.positions = geo.positions;
            to.normals = geo.normals;
            to.uvs = geo.uvs;
            return to;
        };
        GeometryBuilder.GetPoints = function (op) {
            var h1 = 1;
            function getLenRounded(pat, i) {
                var i = pat.getPointAtLength(i);
                return i; //{ x: round(i.x * ik) / ik, y: round(i.y * ik) / ik };
            }
            op.step = GeometryBuilder.Def(op.step, 0.5);
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", op.path);
            var result = [];
            var len = GeometryBuilder.GetTotalLength(path); //path.getTotalLength();
            if (GeometryBuilder.Def(op.inLine, GeometryBuilder._null) && (!GeometryBuilder.Def(op.pointLength, GeometryBuilder._null) || op.pointLength < 1000)) {
                op.step = 0.3;
            }
            if (GeometryBuilder.Def(op.pointLength, GeometryBuilder._null)) {
                op.min = len / op.pointLength;
            }
            var plen = 0.0;
            var s = getLenRounded(path, 0);
            op.density = GeometryBuilder.Def(op.density, [1]);
            function getDensityMapStep(index) {
                var ps = Math.floor(op.density.length * (index / len));
                return op.step / op.density[ps];
            }
            var p = s;
            var c = getLenRounded(path, op.step);
            plen += op.step;
            op.push(result, s);
            var p_o = 0;
            var oo_p = { x: 0, y: 0 };
            for (var i = op.step * 2; i < len; i += getDensityMapStep(i)) {
                h1++;
                var n = getLenRounded(path, i);
                plen += op.step;
                if (GeometryBuilder.Def(op.inLine, true)) {
                    if (i == op.step * 2)
                        op.push(result, c);
                    if (plen > GeometryBuilder.Def(op.min, 10.)) {
                        op.push(result, n);
                        plen = 0.0;
                    }
                }
                else {
                    var d1 = GeometryBuilder.Dim(p, c);
                    var d2 = GeometryBuilder.Dim(c, n);
                    var d3 = GeometryBuilder.Dim(p, n);
                    var d4 = 0;
                    var d5 = 0;
                    if (GeometryBuilder.Def(p_o, GeometryBuilder._null)) {
                        d4 = GeometryBuilder.Dim(p_o, c);
                        d5 = GeometryBuilder.Dim(p_o, n);
                    }
                    var iilen = Math.abs(d3 - (d2 + d1));
                    var lll = GeometryBuilder.SvgCalibration;
                    if (iilen > lll || p_o > lll) {
                        if (GeometryBuilder.Dim(n, oo_p) > 4.0) {
                            op.push(result, n);
                            oo_p = n;
                        }
                        plen = 0.0;
                        p_o = 0;
                    }
                    else {
                        p_o += iilen;
                    }
                }
                p = c;
                c = n;
            }
            result = op.push(result, getLenRounded(path, len), true);
            var sr = [];
            var i = 0;
            for (i = GeometryBuilder.Def(op.start, 0); i < result.length - GeometryBuilder.Def(op.end, 0); i++) {
                sr.push(result[i]);
            }
            return sr;
        };
        GeometryBuilder.BuildBabylonMesh = function (scene, geo) {
            return null;
        };
        GeometryBuilder.ToBabylonGeometry = function (geo) {
            return null;
        };
        GeometryBuilder.InitializeEngine = function () {
            eval("BABYLONX.GeometryBuilder.ToBabylonGeometry = function(op) {    var vertexData = new BABYLON.VertexData();  vertexData.indices = op.faces;    vertexData.positions = op.positions;    vertexData.normals = op.normals; vertexData.uvs = op.uvs;    if (BABYLONX.GeometryBuilder.Def(op.uv2s , GeometryBuilder._null))        vertexData.uv2s = op.uv2s;    else        vertexData.uv2s = [];    return vertexData; } ");
            eval('BABYLONX.GeometryBuilder.GetTotalLength = function(path){return path.getTotalLength();}');
            eval("BABYLONX.GeometryBuilder.BuildBabylonMesh = function(opscene,opgeo){        var geo = BABYLONX.GeometryBuilder.ToBabylonGeometry(opgeo);    var mesh = new BABYLON.Mesh(  opgeo.name, opscene);    geo.normals = BABYLONX.GeometryBuilder.Def(geo.normals, []);    try {  BABYLON.VertexData.ComputeNormals(geo.positions, geo.indices, geo.normals);    } catch (e) {    }    geo.applyToMesh(mesh, false);  var center = { x: 0, y: 0, z: 0 };  for (i = 0; i < geo.positions.length; i += 3.0) {  center.x += geo.positions[i];  center.y += geo.positions[i + 1];  center.z += geo.positions[i + 2];  }  center = { x: center.x * 3.0 / geo.positions.length, y: center.y * 3.0 / geo.positions.length, z: center.z * 3.0 / geo.positions.length };    mesh.center = center;    return mesh; }");
        };
        GeometryBuilder.isInOption = null;
        GeometryBuilder.face3UV012 = "012";
        GeometryBuilder.face3UV021 = "021";
        GeometryBuilder.face3UV201 = "201";
        GeometryBuilder.face3UV210 = "210";
        GeometryBuilder.face4UV0123 = "0123";
        GeometryBuilder.face4UV0132 = "0132";
        GeometryBuilder.face4UV1023 = "1023";
        GeometryBuilder.face4UV1032 = "1032";
        GeometryBuilder._null = 'set null anyway';
        GeometryBuilder.SvgCalibration = 0.00001;
        return GeometryBuilder;
    })();
    BABYLONX.GeometryBuilder = GeometryBuilder;
    var Geometry = (function () {
        function Geometry(geo) {
            this.faces = GeometryBuilder.Def(geo.faces, []);
            this.positions = GeometryBuilder.Def(geo.positions, []);
            this.normals = GeometryBuilder.Def(geo.normals, []);
            this.uvs = GeometryBuilder.Def(geo.uvs, []);
            this.uvs2 = GeometryBuilder.Def(geo.uvs2, []);
            this.name = geo.name;
        }
        Geometry.prototype.toMesh = function (scene) {
            var mesh = GeometryBuilder.BuildBabylonMesh(scene, this);
            return mesh;
        };
        return Geometry;
    })();
    BABYLONX.Geometry = Geometry;
})(BABYLONX || (BABYLONX = {}));
//# sourceMappingURL=GeometryBuilder.js.map
