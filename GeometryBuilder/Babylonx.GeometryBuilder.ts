module BABYLONX {
    export interface IVertexPoint {
        x: any,
        y: any,
        z: any,
    }
    export interface IUV {
        u: any,
        v: any,
    }
    export interface IGeometry {
        faces: any[],
        vertices: any[],
        normals: any[],
        positions: any[],
        uvs: any[],
        uvs2: any[],
        name: string
    }

    export interface IVertexPushOption {
        faceUVMap: string,
        pointIndex1: any,
        pointIndex2: any,
        pointIndex3: any,
        pointIndex4: any,
        uvStart: IUV,
        uvEnd: IUV,
        Face3Point: boolean,
        flip: boolean,
        onlyPush: boolean
    }
    export interface SVGPointSetting {
        step: any,

    }

    export interface IFaceVertices {
        point1: IVertexPoint,
        point2: IVertexPoint,
        point3: IVertexPoint,
        point4: IVertexPoint
    }
    export interface IImportGeoOption {
        x: any,
        y: any,
        z: any,
        checkFace: boolean,
        face: any
    }

    export class GeometryBuilder {
        static isInOption = null;
        static face3UV012 = "012";
        static face3UV021 = "021";
        static face3UV201 = "201";
        static face3UV210 = "210";
        static face4UV0123 = "0123";
        static face4UV0132 = "0132";
        static face4UV1023 = "1023";
        static face4UV1032 = "1032";
        static _null = 'set null anyway';
        static GetTotalLength(path: any) {
            return null;
        }
        static Dim(v: any, u: any) {
            return Math.sqrt(Math.pow(u.x - v.x, 2.) + Math.pow(u.y - v.y, 2.) + (GeometryBuilder.Def(u.z, GeometryBuilder._null) ? Math.pow(u.z - v.z, 2.) : 0));
        }
        static Def(a: any, d: any) {
            if (a != undefined && a != null) return (d != undefined && d != null ? a : true);
            else
                if (d != GeometryBuilder._null)
                    return (d != undefined && d != null ? d : false);
            return null;
        }
        static Replace(s: string, t: string, d: string) {
            var ignore = null;
            return s.replace(new RegExp(t.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (d) == "string") ? d.replace(/\$/g, "$$$$") : d);

        }
        static AddUv(faceUV: string, geo: IGeometry, index: number, uvs: IUV, uve: IUV) {
            if (!faceUV || faceUV.length == 0 || faceUV.length < index) {
                geo.uvs.push(uvs.u, uvs.v); return;
            }
            if (faceUV[index].toString() == "0") geo.uvs.push(uvs.u, uvs.v);
            if (faceUV[index].toString() == "1") geo.uvs.push(uvs.u, uve.v);
            if (faceUV[index].toString() == "2") geo.uvs.push(uve.u, uvs.v);
            if (faceUV[index].toString() == "3") geo.uvs.push(uve.u, uve.v);
        };
        static Exchange(p: IVertexPoint) {
            if (!GeometryBuilder.Def(p, GeometryBuilder._null)) return false; return (p.x || p.x == 0.0);
        }
        static PushVertex(geo: IGeometry, p1: IVertexPoint, uv: IUV) {
            if (uv) uv = { u: 0., v: 0. };
            geo.vertices.push({ x: p1.x, y: p1.y, z: p1.z });
            geo.positions.push(p1.x, p1.y, p1.z);
            if (uv) geo.uvs.push(uv.u, uv.v);
            return geo.vertices.length - 1;
        }
        static MakeFace(geo: IGeometry, _points: IVertexPoint[], option: IVertexPushOption) {
            if (!option) option = {
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

            if (!option.uvStart) option.uvStart = { u: 0., v: 0. };
            if (!option.uvEnd) option.uvEnd = { u: 1., v: 1. };

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

                if (option.pointIndex1 == null || option.pointIndex1 == undefined) option.pointIndex1 = points.point1;
                if (option.pointIndex2 == null || option.pointIndex2 == undefined) option.pointIndex2 = points.point2;
                if (option.pointIndex3 == null || option.pointIndex3 == undefined) option.pointIndex3 = points.point3;
                if (!option.Face3Point)
                { if (option.pointIndex4 == null || option.pointIndex4 == undefined) option.pointIndex4 = points.point4; }

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

                } else {
                    if (option.flip) {
                        if (GeometryBuilder.isInOption.a && GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.c) geo.faces.push(option.pointIndex1, option.pointIndex2, option.pointIndex3);
                        if (GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.d && GeometryBuilder.isInOption.c && !option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex4, option.pointIndex3);
                    }
                    else {
                        if (GeometryBuilder.isInOption.a && GeometryBuilder.isInOption.c && GeometryBuilder.isInOption.b) geo.faces.push(option.pointIndex1, option.pointIndex3, option.pointIndex2);
                        if (GeometryBuilder.isInOption.b && GeometryBuilder.isInOption.c && GeometryBuilder.isInOption.d && !option.Face3Point)
                            geo.faces.push(option.pointIndex2, option.pointIndex3, option.pointIndex4);
                    }
                }
            }


            if (!option.onlyPush)
                GeometryBuilder.isInOption = null;
            return [option.pointIndex1, option.pointIndex2, option.pointIndex3, option.pointIndex4];
        }
        static ImportGeometry(geo: IGeometry, v: any[], f: any[], ts: IImportGeoOption) {
            var st = geo.vertices.length;

            for (var i = 0; i < v.length; i++) {
                geo.vertices.push({ x: v[i].x + (ts.x), y: v[i].y + (ts.y), z: v[i].z + (ts.z) });
                geo.positions.push(v[i].x + (ts.x), v[i].y + (ts.y), v[i].z + (ts.z));
            }

            for (var i = 0; i < f.length; i++) {
                if (!ts || !ts.checkFace || ts.face(i, f[i]))
                    geo.faces.push(f[i].a + st, f[i].b + st, f[i].c + st);
            }
        }
        static GeometryBase(firstp: any, builder: any, exGeo: IGeometry, custom: any) {
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
        }
        static GetGeometryFromBabylon(geo: any, to: IGeometry) {
            to.faces = geo.indices;
            to.positions = geo.positions;
            to.normals = geo.normals;
            to.uvs = geo.uvs;
            return to;
        }
        static SvgCalibration = 0.00001;
        static GetPoints(op) {
            var h1 = 1;
            function getLenRounded(pat, i) {
                var i = pat.getPointAtLength(i);
                return i;//{ x: round(i.x * ik) / ik, y: round(i.y * ik) / ik };
            }

            op.step = GeometryBuilder.Def(op.step, 0.5);
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", op.path);
            var result = [];
            var len = GeometryBuilder.GetTotalLength(path);//path.getTotalLength();
            if (GeometryBuilder.Def(op.inLine, GeometryBuilder._null) && (!GeometryBuilder.Def(op.pointLength, GeometryBuilder._null) || op.pointLength < 1000)) {
                op.step = 0.3;
            }
            if (GeometryBuilder.Def(op.pointLength, GeometryBuilder._null)) {
                op.min = len / op.pointLength;
            }
            var plen = 0.0
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
                        op.push(result, n); plen = 0.0;
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
                            op.push(result, n); oo_p = n;
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
        }
        static BuildBabylonMesh(scene: any, geo: any) {
            return null;
        }
        static ToBabylonGeometry(geo: any) {
            return null;
        }
        static InitializeEngine() {
            eval("BABYLONX.GeometryBuilder.ToBabylonGeometry = function(op) {    var vertexData = new BABYLON.VertexData();  vertexData.indices = op.faces;    vertexData.positions = op.positions;    vertexData.normals = op.normals; vertexData.uvs = op.uvs;    if (BABYLONX.GeometryBuilder.Def(op.uv2s , GeometryBuilder._null))        vertexData.uv2s = op.uv2s;    else        vertexData.uv2s = [];    return vertexData; } ");
            eval('BABYLONX.GeometryBuilder.GetTotalLength = function(path){return path.getTotalLength();}');
            eval("BABYLONX.GeometryBuilder.BuildBabylonMesh = function(opscene,opgeo){        var geo = BABYLONX.GeometryBuilder.ToBabylonGeometry(opgeo);    var mesh = new BABYLON.Mesh(  opgeo.name, opscene);    geo.normals = BABYLONX.GeometryBuilder.Def(geo.normals, []);    try {  BABYLON.VertexData.ComputeNormals(geo.positions, geo.indices, geo.normals);    } catch (e) {    }    geo.applyToMesh(mesh, false);  var center = { x: 0, y: 0, z: 0 };  for (i = 0; i < geo.positions.length; i += 3.0) {  center.x += geo.positions[i];  center.y += geo.positions[i + 1];  center.z += geo.positions[i + 2];  }  center = { x: center.x * 3.0 / geo.positions.length, y: center.y * 3.0 / geo.positions.length, z: center.z * 3.0 / geo.positions.length };    mesh.center = center;    return mesh; }");

        }
    }
    export class Geometry {
        faces: any;
        positions: any;
        vertices: any;
        normals: any;
        uvs: any;
        uvs2: {};
        name: string;
        toMesh(scene: any) {
            var mesh = GeometryBuilder.BuildBabylonMesh(scene, this);
            return mesh;
        }
        constructor(geo: IGeometry) {
            if (geo == null) {
                geo = {
                    faces: [],
                    vertices: [],
                    normals: [],
                    positions: [],
                    uvs: [],
                    uvs2: [],
                    name: ""
                };
            }

            this.faces = GeometryBuilder.Def(geo.faces, []);
            this.positions = GeometryBuilder.Def(geo.positions, []);
            this.vertices = GeometryBuilder.Def(geo.vertices, []);
            this.normals = GeometryBuilder.Def(geo.normals, []);
            this.uvs = GeometryBuilder.Def(geo.uvs, []);
            this.uvs2 = GeometryBuilder.Def(geo.uvs2, []);
            this.name = geo.name;
        }
    }

    export class GeometryParser {
        Objects: any;
        NewVtx: number;
        Uvs_helper1: any;
        Uv_helper2: any;
        Geometry: Geometry;
        Flip: boolean;
        Index_helper: number;
        static OldIndex = 0;
        static Vertices = [];
        static Normals = [];
        Uv_update: boolean;

        static _null = "null all time";
        static def(a: any, d: any) {
            if (a != undefined && a != null) return (d != undefined && d != null ? a : true);
            else
                if (d != GeometryParser._null)
                    return (d != undefined && d != null ? d : false);
            return null;
        }

        static n_1(ar: any[]) {
            ar = GeometryParser.def(ar, []);
            if (!GeometryParser.def(ar.length, null)) return null;
            return ar[ar.length - 1];
        }

        Vector(x: any, y: any, z: any) {
            return { x: x, y: y, z: z };
        }

        Face3(a: any, b: any, c: any, normals: any) {
            return { x: a - GeometryParser.OldIndex, y: b - GeometryParser.OldIndex, z: c - GeometryParser.OldIndex };
        }

        ParseVertexIndex(index: any) {

            index = parseInt(index);

            return index >= 0 ? index - 1 : index + GeometryParser.Vertices.length;
        }

        ParseNormalIndex(index) {

            index = parseInt(index);

            return index >= 0 ? index - 1 : index + GeometryParser.Normals.length;
        }

        ParseUVIndex(index) {

            index = parseInt(index);

            return index >= 0 ? index - 1 : 1.0;
        }

        Add_face(a: any, b: any, c: any, uvs: any) {

            var GP = GeometryParser;

            a = this.ParseVertexIndex(a - GP.OldIndex);
            b = this.ParseVertexIndex(b - GP.OldIndex);
            c = this.ParseVertexIndex(c - GP.OldIndex);

            if (this.Uv_update) {
                if (GP.def(GP.n_1(this.Objects).uvs[a * 2], null) && GP.n_1(this.Objects).uvs[a * 2] != this.Uvs_helper1[this.ParseUVIndex(uvs[0])].x && GP.n_1(this.Objects).uvs[a * 2 + 1] != this.Uvs_helper1[this.ParseUVIndex(uvs[0])].y) {

                    this.NewVtx++;
                    a = GeometryBuilder.PushVertex(GP.n_1(this.Objects), { x: parseFloat(GP.n_1(this.Objects).positions[a * 3]), y: parseFloat(GP.n_1(this.Objects).positions[a * 3 + 1]), z: parseFloat(GP.n_1(this.Objects).positions[a * 3 + 2]) }, null); // uv !uc
                    
                }

                if (GP.def(GP.n_1(this.Objects).uvs[b * 2], null) && GP.n_1(this.Objects).uvs[b * 2] != this.Uvs_helper1[this.ParseUVIndex(uvs[1])].x && GP.n_1(this.Objects).uvs[b * 2 + 1] != this.Uvs_helper1[this.ParseUVIndex(uvs[1])].y) {

                    b = GeometryBuilder.PushVertex(GP.n_1(this.Objects), { x: parseFloat(GP.n_1(this.Objects).positions[b * 3]), y: parseFloat(GP.n_1(this.Objects).positions[b * 3 + 1]), z: parseFloat(GP.n_1(this.Objects).positions[b * 3 + 2]) }, null); // uv !uc
                    this.NewVtx++;
                }

                if (GP.def(GP.n_1(this.Objects).uvs[c * 2], null) && GP.n_1(this.Objects).uvs[c * 2] != this.Uvs_helper1[this.ParseUVIndex(uvs[2])].x && GP.n_1(this.Objects).uvs[c * 2 + 1] != this.Uvs_helper1[this.ParseUVIndex(uvs[2])].y) {

                    c = GeometryBuilder.PushVertex(GP.n_1(this.Objects), { x: parseFloat(GP.n_1(this.Objects).positions[c * 3]), y: parseFloat(GP.n_1(this.Objects).positions[c * 3 + 1]), z: parseFloat(GP.n_1(this.Objects).positions[c * 3 + 2]) }, null); // uv !uc
                    this.NewVtx++;
                }
            }


            GeometryBuilder.MakeFace(GP.n_1(this.Objects),
                [a,
                    b,
                    c], {
                    faceUVMap: GeometryBuilder.face3UV012,
                    Face3Point: true,
                    pointIndex1: null,
                    pointIndex2: null,
                    pointIndex3: null,
                    pointIndex4: null,
                    uvStart: null,
                    uvEnd: null,
                    flip: this.Flip, onlyPush: false
                });

            var faceIndex = GP.n_1(this.Objects).faces.length;

            try {
                if (!GP.def(GP.n_1(this.Objects).uvs[a * 2], null))
                    GP.n_1(this.Objects).uvs[a * 2] = this.Uvs_helper1[this.ParseUVIndex(uvs[0])].x;
                if (!GP.def(GP.n_1(this.Objects).uvs[a * 2 + 1], null))
                    GP.n_1(this.Objects).uvs[a * 2 + 1] = this.Uvs_helper1[this.ParseUVIndex(uvs[0])].y;

                if (!GP.def(GP.n_1(this.Objects).uvs[b * 2], null))
                    GP.n_1(this.Objects).uvs[b * 2] = this.Uvs_helper1[this.ParseUVIndex(uvs[1])].x;
                if (!GP.def(GP.n_1(this.Objects).uvs[b * 2 + 1], null))
                    GP.n_1(this.Objects).uvs[b * 2 + 1] = this.Uvs_helper1[this.ParseUVIndex(uvs[1])].y;

                if (!GP.def(GP.n_1(this.Objects).uvs[c * 2], null))
                    GP.n_1(this.Objects).uvs[c * 2] = this.Uvs_helper1[this.ParseUVIndex(uvs[2])].x;
                if (!GP.def(GP.n_1(this.Objects).uvs[c * 2 + 1], null))
                    GP.n_1(this.Objects).uvs[c * 2 + 1] = this.Uvs_helper1[this.ParseUVIndex(uvs[2])].y;


                GP.n_1(this.Objects).uvh = GP.def(GP.n_1(this.Objects).uvh, []);
                GP.n_1(this.Objects).uvf = GP.def(GP.n_1(this.Objects).uvf, []);

                GP.n_1(this.Objects).uvh[a] = GP.def(GP.n_1(this.Objects).uvh[a], []);
                GP.n_1(this.Objects).uvh[b] = GP.def(GP.n_1(this.Objects).uvh[b], []);
                GP.n_1(this.Objects).uvh[c] = GP.def(GP.n_1(this.Objects).uvh[c], []);


                GP.n_1(this.Objects).uvh[a * 2] = (this.Uvs_helper1[this.ParseUVIndex(uvs[0])].x);
                GP.n_1(this.Objects).uvh[a * 2 + 1] = (this.Uvs_helper1[this.ParseUVIndex(uvs[0])].y);

                GP.n_1(this.Objects).uvf[a] = faceIndex;

                GP.n_1(this.Objects).uvh[b * 2] = (this.Uvs_helper1[this.ParseUVIndex(uvs[1])].x);
                GP.n_1(this.Objects).uvh[b * 2 + 1] = (this.Uvs_helper1[this.ParseUVIndex(uvs[1])].y);

                GP.n_1(this.Objects).uvf[b] = faceIndex;

                GP.n_1(this.Objects).uvh[c * 2] = (this.Uvs_helper1[this.ParseUVIndex(uvs[2])].x);
                GP.n_1(this.Objects).uvh[c * 2 + 1] = (this.Uvs_helper1[this.ParseUVIndex(uvs[2])].y);

                GP.n_1(this.Objects).uvf[c] = faceIndex;

            } catch (e) {
            }
        }

        Handle_face_line(faces: any[], uvs: any[], normals_inds: any) {
            var GP = GeometryParser;

            uvs = GP.def(uvs, [0, 0, 0, 0]);

            if (faces[3] === undefined) {

                this.Add_face(faces[0], faces[1], faces[2], uvs);

            } else {
                this.Add_face(faces[0], faces[1], faces[3], [uvs[0], uvs[1], uvs[3]]);
                this.Add_face(faces[1], faces[2], faces[3], [uvs[1], uvs[2], uvs[3]]);
            }

        }

        // v float float float

        static VertexPattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vn float float float

        static NormalPattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vt float float

        static UVPattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // f vertex vertex vertex ...

        static FacePattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

        // f vertex/uv vertex/uv vertex/uv ...

        static FacePattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

        static FacePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

        // f vertex//normal vertex//normal vertex//normal ... 

        static FacePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

        //
        NewGeo() {
            var GP = GeometryParser;
            if (this.Objects.length == 0 || GP.n_1(this.Objects).vertices.length > 0) {
                GP.OldIndex += GP.n_1(this.Objects).length > 0 ? GP.n_1(this.Objects).vertices.length - this.NewVtx : 0;
                this.NewVtx = 0;
                this.Geometry = new Geometry(null);
                this.Objects.push(this.Geometry);
            }
        }

        constructor(data: any, lastUV: boolean, flip: boolean) {
            
            var GP = GeometryParser;
            this.Objects = GP.def(this.Objects, []);
            this.Uv_update = lastUV;
            this.Uvs_helper1 = [];
            this.Flip = flip;

            if (/^o /gm.test(data) === false) {
                this.Geometry = new Geometry(null);
                this.Objects.push(this.Geometry);
            }
            var lines = data.split('\n');
            var oldIndex = 0;
            var oldLine = '';
            var lastchar = '';
            for (var i = 0; i < lines.length; i++) {

                var line = lines[i];
                line = line.trim();

                var result;

                if (line.length === 0 || line.charAt(0) === '#') {

                    continue;

                } else if ((result = GP.VertexPattern.exec(line)) !== null) {

                    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                    if (lastchar == 'g')
                        this.NewGeo();

                    GeometryBuilder.PushVertex(GP.n_1(this.Objects), { x: -1 * result[1], y: result[2] * 1.0, z: result[3] * 1.0 }, null); // un !uc

                    lastchar = 'v';
                } else if ((result = GP.NormalPattern.exec(line)) !== null) {

                    lastchar = 'n';

                } else if ((result = GP.UVPattern.exec(line)) !== null) {

                    // ["vt 0.1 0.2", "0.1", "0.2"]
                    this.Uvs_helper1.push({ x: parseFloat(result[1]), y: parseFloat(result[2]) });
                    // uvs.push({ x: result[1], y: result[2] });
                    lastchar = 't';

                } else if ((result = GP.FacePattern1.exec(line)) !== null) {

                    // ["f 1 2 3", "1", "2", "3", undefined]

                    this.Handle_face_line(
                        [result[1], result[2], result[3], result[4]], null, null
                    );
                    lastchar = 'f';

                } else if ((result = GP.FacePattern2.exec(line)) !== null) {

                    // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

                    this.Handle_face_line(
                        [result[2], result[5], result[8], result[11]], //faces
                        [result[3], result[6], result[9], result[12]], null //uv
                    );
                    lastchar = 'f';

                } else if ((result = GP.FacePattern3.exec(line)) !== null) {

                    // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

                    this.Handle_face_line(
                        [result[2], result[6], result[10], result[14]], //faces
                        [result[3], result[7], result[11], result[15]], //uv
                        [result[4], result[8], result[12], result[16]] //normal
                    );
                    lastchar = 'f';

                } else if ((result = GP.FacePattern4.exec(line)) !== null) {

                    // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

                    this.Handle_face_line(
                        [result[2], result[5], result[8], result[11]], //faces
                        [], //uv
                        [result[3], result[6], result[9], result[12]] //normal
                    );
                    lastchar = 'f';

                } else if (/^o /.test(line)) { // || /^g /.test(line)) {

                    if (line.replace('o', '').trim() != 'default') {
                        oldLine = line.replace('o', '').trim();
                        if (oldLine != '' && this.Objects.length > 0)
                            GP.n_1(this.Objects).refname = oldLine;
                    }
                    else oldLine = '';

                    this.NewGeo();
                    lastchar = 'o';

                }
                else if (/^g /.test(line)) {
                    if (line.replace('g', '').trim() != 'default') {
                        oldLine = line.replace('g', '').trim();
                        if (oldLine != '' && this.Objects.length > 0)
                            GP.n_1(this.Objects).refname = oldLine;
                    }
                    else oldLine = '';

                    lastchar = 'g';
                }
                else if (/^usemtl /.test(line)) {

                    // material

                    // material.name = line.substring( 7 ).trim();
                    lastchar = 'u';
                } else if (/^mtllib /.test(line)) {

                    // mtl file
                    lastchar = 'm';
                } else if (/^s /.test(line)) {
                    // smooth shading 
                    lastchar = 's';
                }


            }
             
        } 

    }

}
