var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../lib/babylon.d.ts" />
///<reference path="../lib/babylon.marbleProceduralTexture.d.ts" />
var BABYLONX;
(function (BABYLONX) {
    var Demomeshes = (function () {
        function Demomeshes(scene) {
            Demomeshes.objInstances = 0 | (Demomeshes.objInstances + 1);
            this._scene = scene;
        }
        Demomeshes.prototype.createCube = function (size, color) {
            if (size === void 0) { size = { w: 1, h: 1, d: 1 }; }
            if (color === void 0) { color = "#FF0000"; }
            var options = { width: size.w, depth: size.d, height: size.h };
            var cube = BABYLON.MeshBuilder.CreateBox("cube" + Demomeshes.objInstances, options, this._scene);
            var mat = new BABYLON.StandardMaterial("mcube" + Demomeshes.objInstances, this._scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(color);
            mat.specularColor = BABYLON.Color3.Green();
            //mat.wireframe=true;
            cube.material = mat;
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble" + Demomeshes.objInstances, 512, this._scene);
            marbleTexture.numberOfTilesHeight = .5;
            marbleTexture.numberOfTilesWidth = .5;
            marbleTexture.jointColor = new BABYLON.Color3(0, 0, 1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.0;
            mat.diffuseTexture = marbleTexture;
            //mat.alpha=.3;
            //mat.diffuseTexture.hasAlpha=true;  
            Demomeshes.objInstances++;
            return cube;
        };
        Demomeshes.prototype.createCylinder = function (height, color, top, bottom) {
            if (height === void 0) { height = 1; }
            if (color === void 0) { color = "#00ff00"; }
            if (top === void 0) { top = 0.5; }
            if (bottom === void 0) { bottom = 0.5; }
            var mat = new BABYLON.StandardMaterial("cmat" + Demomeshes.objInstances, this._scene);
            var cone = BABYLON.MeshBuilder.CreateCylinder("cone" + Demomeshes.objInstances, { height: height, diameterTop: top, diameterBottom: bottom, tessellation: 32 }, this._scene);
            //var cone = BABYLON.MeshBuilder.CreateCylinder("cone" + Demomeshes.objInstances, { height: height, tessellation: 32 }, this._scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(color);
            mat.specularColor = BABYLON.Color3.Green();
            cone.material = mat;
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble" + Demomeshes.objInstances, 512, this._scene);
            marbleTexture.numberOfTilesHeight = 1.0;
            marbleTexture.numberOfTilesWidth = .5;
            //marbleTexture.jointColor=new BABYLON.Color3(0,0,1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.2;
            mat.diffuseTexture = marbleTexture;
            Demomeshes.objInstances++;
            //cone.rotation.x=Math.PI/4;
            return cone;
        };
        Demomeshes.prototype.createIcoSphere = function (radius) {
            if (radius === void 0) { radius = 6; }
            var mesh = BABYLON.MeshBuilder.CreateIcoSphere("m", { radius: radius }, this._scene);
            mesh.updateFacetData();
            return mesh;
        };
        Demomeshes.prototype.createSphere = function (diameter, color, segments) {
            if (diameter === void 0) { diameter = 1; }
            if (color === void 0) { color = "#0000ff"; }
            if (segments === void 0) { segments = 32; }
            var mat = new BABYLON.StandardMaterial("stdmat" + Demomeshes.objInstances, this._scene);
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere" + Demomeshes.objInstances, { diameter: diameter, segments: segments }, this._scene);
            //mat.diffuseTexture= new BABYLON.Texture("testtexture.png",this.scene);
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, this._scene);
            marbleTexture.numberOfTilesHeight = 1.0;
            marbleTexture.numberOfTilesWidth = .5;
            //marbleTexture.jointColor=new BABYLON.Color3(0,0,1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.2;
            mat.diffuseTexture = marbleTexture;
            mat.diffuseColor = BABYLON.Color3.FromHexString(color);
            mat.specularColor = BABYLON.Color3.Green();
            sphere.material = mat;
            Demomeshes.objInstances++;
            return sphere;
        };
        return Demomeshes;
    }());
    BABYLONX.Demomeshes = Demomeshes;
    var Demoscene = (function () {
        function Demoscene() {
            Demoscene.objInstances = 0 | (Demoscene.objInstances + 1);
        }
        Demoscene.prototype.init = function () {
            this.dom();
            this._engine = new BABYLON.Engine(this._canvas, true, { stencil: true });
            this._scene = new BABYLON.Scene(this._engine);
            this.cameras();
            this.lights();
            //this.objects();
            //this._scene.debugLayer.show();
            this._engine.runRenderLoop(this.renderloop.bind(this));
        };
        Demoscene.prototype.dom = function () {
            this._canvas = document.getElementById("renderCanvas");
        };
        Demoscene.prototype.cameras = function () {
            this._camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2 + .2, Math.PI / 2, 10, new BABYLON.Vector3(-2.0, 10.19, 22.73), this._scene);
            this._camera.setTarget(new BABYLON.Vector3(0, 0, 0));
            this._camera.attachControl(this._canvas, true);
            this._camera.wheelPrecision = 8;
            this._camera.radius = 25;
            this._camera.alpha = 1.66;
            this._camera.beta = 1.2;
        };
        Demoscene.prototype.lights = function () {
            var lightpos = new BABYLON.Vector3(0, 10, 0);
            this._light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 3, -10), this._scene);
            this._light.groundColor = new BABYLON.Color3(.9, .9, .9);
            this._light.intensity = 1.0;
        };
        Demoscene.prototype.objects = function () {
        };
        Demoscene.prototype.createCubeInternal = function (cube, color) {
            var mat = new BABYLON.StandardMaterial("mcube" + Demoscene.objInstances, this._scene);
            mat.diffuseColor = color; // BABYLON.Color3.FromHexString(color);
            mat.specularColor = BABYLON.Color3.Green();
            //mat.wireframe=true;
            cube.material = mat;
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, this.scene);
            marbleTexture.numberOfTilesHeight = .5;
            marbleTexture.numberOfTilesWidth = .5;
            marbleTexture.jointColor = new BABYLON.Color3(0, 0, 1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.0;
            mat.diffuseTexture = marbleTexture;
            //mat.alpha=.3;
            //mat.diffuseTexture.hasAlpha=true;  
            Demoscene.objInstances++;
            return cube;
        };
        Demoscene.prototype.createCubeX = function (scene, size, color) {
            if (size === void 0) { size = { w: 1, h: 1, d: 1 }; }
            if (color === void 0) { color = "#FF0000"; }
            var options = { width: size.w, depth: size.d, height: size.h };
            var cube = BABYLON.MeshBuilder.CreateBox("cube", options, scene);
            return this.createCubeInternal(cube, BABYLON.Color3.FromHexString(color));
        };
        Demoscene.prototype.createCube = function (size, color) {
            if (size === void 0) { size = 1; }
            if (color === void 0) { color = BABYLON.Color3.Red(); }
            var cube = BABYLON.Mesh.CreateBox("cube" + Demoscene.objInstances, size, this._scene);
            return this.createCubeInternal(cube, color);
        };
        Demoscene.prototype.createCone = function (height, color) {
            if (height === void 0) { height = 1; }
            if (color === void 0) { color = BABYLON.Color3.Green(); }
            var mat = new BABYLON.StandardMaterial("cmat" + Demoscene.objInstances, this._scene);
            var cone = BABYLON.MeshBuilder.CreateCylinder("cone" + Demoscene.objInstances, { height: 1, diameterTop: 0, tessellation: 32 }, this._scene);
            mat.diffuseColor = color;
            mat.specularColor = BABYLON.Color3.Green();
            cone.material = mat;
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, this.scene);
            marbleTexture.numberOfTilesHeight = 1.0;
            marbleTexture.numberOfTilesWidth = .5;
            //marbleTexture.jointColor=new BABYLON.Color3(0,0,1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.2;
            mat.diffuseTexture = marbleTexture;
            Demoscene.objInstances++;
            //cone.rotation.x=Math.PI/4;
            return cone;
        };
        Demoscene.prototype.createCylinder = function (height, color) {
            if (height === void 0) { height = 1; }
            if (color === void 0) { color = BABYLON.Color3.Green(); }
            var mat = new BABYLON.StandardMaterial("cmat" + Demoscene.objInstances, this._scene);
            //var cone = BABYLON.MeshBuilder.CreateCylinder("cone" + Demoscene.objInstances, { height: height, diameterTop: height/2,diameterBottom: height/2, tessellation: 32 }, this._scene);
            var cone = BABYLON.MeshBuilder.CreateCylinder("cone" + Demoscene.objInstances, { height: height, tessellation: 32 }, this._scene);
            mat.diffuseColor = color;
            mat.specularColor = BABYLON.Color3.Green();
            cone.material = mat;
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, this.scene);
            marbleTexture.numberOfTilesHeight = 1.0;
            marbleTexture.numberOfTilesWidth = .5;
            //marbleTexture.jointColor=new BABYLON.Color3(0,0,1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.2;
            mat.diffuseTexture = marbleTexture;
            Demoscene.objInstances++;
            //cone.rotation.x=Math.PI/4;
            return cone;
        };
        Demoscene.prototype.createIcoSphere = function (scene, radius) {
            if (radius === void 0) { radius = 6; }
            var mesh = BABYLON.MeshBuilder.CreateIcoSphere("m", { radius: radius }, scene);
            mesh.updateFacetData();
            return mesh;
        };
        Demoscene.prototype.createSphere = function (diameter, color, segments) {
            if (diameter === void 0) { diameter = 1; }
            if (color === void 0) { color = BABYLON.Color3.Blue(); }
            if (segments === void 0) { segments = 32; }
            var mat = new BABYLON.StandardMaterial("stdmat" + Demoscene.objInstances, this._scene);
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere" + Demoscene.objInstances, { diameter: diameter, segments: segments }, this._scene);
            //mat.diffuseTexture= new BABYLON.Texture("testtexture.png",this.scene);
            var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, this._scene);
            marbleTexture.numberOfTilesHeight = 1.0;
            marbleTexture.numberOfTilesWidth = .5;
            //marbleTexture.jointColor=new BABYLON.Color3(0,0,1);
            //marbleTexture.marbleColor=new BABYLON.Color3(1,0,0);
            marbleTexture.amplitude = 9.2;
            mat.diffuseTexture = marbleTexture;
            mat.diffuseColor = color;
            mat.specularColor = BABYLON.Color3.Green();
            sphere.material = mat;
            Demoscene.objInstances++;
            return sphere;
        };
        Demoscene.prototype.renderloop = function () {
            this._scene.render();
        };
        Object.defineProperty(Demoscene.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        return Demoscene;
    }());
    BABYLONX.Demoscene = Demoscene;
    var CMesh = (function (_super) {
        __extends(CMesh, _super);
        function CMesh(name, scene, parent, cloner) {
            if (cloner === void 0) { cloner = null; }
            var _this = _super.call(this, name, scene, parent) || this;
            _this._cloner = null;
            _this._cloner = cloner;
            return _this;
            //this.parent=parent;
        }
        CMesh.prototype.delete = function () {
            if (this._cloner != null) {
                this._cloner.delete();
            }
            else {
                this.getChildren()[0].dispose();
            }
            this.parent = null;
            this.dispose();
        };
        CMesh.prototype.createClone = function (item, useInstances, name) {
            var c;
            if (item instanceof Cloner) {
                c = item.createClone(this);
            }
            else {
                if (useInstances) {
                    c = item.createInstance(name + "_i");
                    c.parent = this;
                }
                else {
                    c = item.clone(name + "_c");
                    c.parent = this;
                }
            }
            return c;
        };
        return CMesh;
    }(BABYLON.Mesh));
    BABYLONX.CMesh = CMesh;
    var EFFECTOR_STRENGTHXX;
    (function (EFFECTOR_STRENGTHXX) {
        EFFECTOR_STRENGTHXX[EFFECTOR_STRENGTHXX["ALL"] = 7] = "ALL";
        EFFECTOR_STRENGTHXX[EFFECTOR_STRENGTHXX["POSITION"] = 1] = "POSITION";
        EFFECTOR_STRENGTHXX[EFFECTOR_STRENGTHXX["ROTATION"] = 2] = "ROTATION";
        EFFECTOR_STRENGTHXX[EFFECTOR_STRENGTHXX["SCALE"] = 4] = "SCALE";
    })(EFFECTOR_STRENGTHXX || (EFFECTOR_STRENGTHXX = {}));
    var RandomEffector = (function () {
        function RandomEffector(seed) {
            if (seed === void 0) { seed = 42; }
            this._strength = 0.0;
            this._position = new BABYLON.Vector3(0, 0, 0);
            this._rotation = new BABYLON.Vector3(0, 0, 0);
            this._scale = new BABYLON.Vector3(0, 0, 0);
            this._uniformScale = false;
            this._clients = [];
            this._seed = this._s = seed;
            this._rfunction = function () {
                this._s = Math.sin(this._s) * 10000;
                return this._s - Math.floor(this._s);
            };
        }
        RandomEffector.prototype.random = function () {
            return this._rfunction();
        };
        RandomEffector.prototype.reset = function () {
            this._s = this._seed;
        };
        RandomEffector.prototype.updateRotation = function (vec) {
            var m1 = this._rotation.multiplyByFloats((-.5 + this.random()) * this._strength, (-.5 + this.random()) * this._strength, (-.5 + this.random()) * this._strength);
            return vec.add(m1);
        };
        RandomEffector.prototype.updatePosition = function (vec) {
            var m1 = this._position.multiplyByFloats((-.5 + this.random()) * this._strength, (-.5 + this.random()) * this._strength, (-.5 + this.random()) * this._strength);
            return vec.add(m1);
        };
        RandomEffector.prototype.updateScale = function (vec) {
            var a = this.random();
            var b = a;
            var c = a;
            if (this._uniformScale == false) {
                b = this.random();
                c = this.random();
            }
            var m1 = this._scale.multiplyByFloats((-.5 + a) * this._strength, (-.5 + b) * this._strength, (-.5 + b) * this._strength);
            //var m1=this._scale.multiplyByFloats(this._strength,this._strength,this._strength);
            return vec.add(m1);
        };
        RandomEffector.prototype.addClient = function (c) {
            this._clients.push(c);
        };
        RandomEffector.prototype.updateClients = function () {
            this._clients.forEach(function (c) { c.update(); });
        };
        Object.defineProperty(RandomEffector.prototype, "strength", {
            get: function () {
                return this._strength;
            },
            set: function (s) {
                this._strength = s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomEffector.prototype, "position", {
            set: function (p) {
                this._position.x = p.x;
                this._position.y = p.y;
                this._position.z = p.z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomEffector.prototype, "scale", {
            set: function (s) {
                this._uniformScale = s.u;
                this._scale.x = this._scale.y = this._scale.z = s.x;
                if (s.u == false) {
                    this._scale.y = s.y;
                    this._scale.z = s.z;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomEffector.prototype, "rotation", {
            set: function (s) {
                this._rotation.x = s.x * Math.PI / 180;
                this._rotation.y = s.y * Math.PI / 180;
                this._rotation.z = s.z * Math.PI / 180;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomEffector.prototype, "seed", {
            set: function (s) {
                this._seed = this._s = s;
            },
            enumerable: true,
            configurable: true
        });
        return RandomEffector;
    }());
    BABYLONX.RandomEffector = RandomEffector;
    var Cloner = (function () {
        function Cloner() {
            this._rootNode = null;
            this._effectors = [];
        }
        Cloner.prototype.setEnabled = function (enabled) {
            this._rootNode.setEnabled(enabled);
        };
        Cloner.prototype.createClone = function (parent) { };
        Cloner.prototype.update = function () { };
        Cloner.prototype.addEffector = function (effector, sensitivity) {
            this._effectors.push({ effector: effector, sensitivity: sensitivity });
            effector.addClient(this);
            this.update();
        };
        Object.defineProperty(Cloner.prototype, "effectors", {
            get: function () {
                return this._effectors;
            },
            enumerable: true,
            configurable: true
        });
        Cloner.prototype.eScale = function (vec) {
            var vRet = Cloner.vZero.add(vec);
            for (var i = 0; i < this._effectors.length; i++) {
                vRet = BABYLON.Vector3.Lerp(vec, this._effectors[i].effector.updateScale(vRet), this._effectors[i].sensitivity);
            }
            return vRet;
        };
        Cloner.prototype.eRotate = function (vec) {
            var vRet = Cloner.vZero.add(vec);
            for (var i = 0; i < this._effectors.length; i++) {
                vRet = BABYLON.Vector3.Lerp(vec, this._effectors[i].effector.updateRotation(vRet), this._effectors[i].sensitivity);
            }
            return vRet;
        };
        Cloner.prototype.ePosition = function (vec) {
            var vRet = Cloner.vZero.add(vec);
            for (var i = 0; i < this._effectors.length; i++) {
                vRet = BABYLON.Vector3.Lerp(vec, this._effectors[i].effector.updatePosition(vRet), this._effectors[i].sensitivity);
            }
            return vRet; // BABYLON.Vector3.Lerp(vec,vRet,this._effectorStrength.x);
        };
        Cloner.prototype.eReset = function () {
            this._effectors.forEach(function (e) { e.effector.reset(); });
        };
        return Cloner;
    }());
    Cloner.vOne = new BABYLON.Vector3(1, 1, 1);
    Cloner.vZero = new BABYLON.Vector3(0, 0, 0);
    BABYLONX.Cloner = Cloner;
    var RadialCloner = (function (_super) {
        __extends(RadialCloner, _super);
        function RadialCloner(mesh, scene, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.count, count = _c === void 0 ? 3 : _c, _d = _b.offset, offset = _d === void 0 ? 0 : _d, _e = _b.radius, radius = _e === void 0 ? 3 : _e, _f = _b.align, align = _f === void 0 ? true : _f, _g = _b.startangle, startangle = _g === void 0 ? 0 : _g, _h = _b.endangle, endangle = _h === void 0 ? 360 : _h, _j = _b.useInstances, useInstances = _j === void 0 ? true : _j, _k = _b.plane, plane = _k === void 0 ? { x: 1, y: 0, z: 1 } : _k;
            var _this = _super.call(this) || this;
            RadialCloner.instance_nr = 0 | (RadialCloner.instance_nr + 1);
            _this._instance_nr = RadialCloner.instance_nr;
            _this._mesh = mesh;
            _this._mesh.forEach(function (m) { m.setEnabled(false); });
            _this._scene = scene;
            _this._useInstances = useInstances;
            _this._clones = [];
            _this._count = Number(count);
            _this._radius = Number(radius);
            _this._plane = new BABYLON.Vector3(plane.x, plane.y, plane.z);
            _this._startangle = Math.PI * startangle / 180;
            _this._endangle = Math.PI * endangle / 180;
            _this._offset = offset;
            _this._align = align;
            _this._frame = 0;
            _this._formula = "2-Math.pow(Math.abs(Math.sin(frame/10+Math.PI*i/2)),0.1)*1.5";
            _this._formula = "scaling=1-Math.sin(frame/6+2*ix*Math.PI)/2";
            //this._rootNode=new CMesh("root",this._scene,this);
            _this._rootNode = new CMesh("rootRC_" + _this._instance_nr, _this._scene, null, _this);
            _this.createClones();
            _this.update();
            return _this;
        }
        RadialCloner.prototype.createClone = function (parent, dummyUseInstances, dummyName) {
            if (dummyUseInstances === void 0) { dummyUseInstances = null; }
            if (dummyName === void 0) { dummyName = null; }
            var c = new RadialCloner(this._mesh, this._scene, { count: this._count, offset: this._offset, radius: this._radius, startangle: this._startangle * 180 / Math.PI, endangle: this._endangle * 180 / Math.PI, useInstances: this._useInstances, plane: { x: this._plane.x, y: this._plane.y, z: this._plane.z } });
            parent._cloner = c;
            c.root.parent = parent;
            return c.root;
        };
        RadialCloner.prototype.createClones = function (start) {
            if (start === void 0) { start = 0; }
            for (var i = start; i < this._count; i++) {
                //create Node for each clone, RADIAL=>parent = rootnode 
                var n = new CMesh("n_rc" + this._instance_nr + "_" + i, this._scene, this._rootNode);
                //n.index = i;
                this._clones.push(n);
                //create clone
                var cix = i % this._mesh.length;
                n.createClone(this._mesh[cix], this._useInstances, this._mesh[cix].name + "_rc" + this._instance_nr + "_" + i);
            }
        };
        RadialCloner.prototype.calcRot = function () {
            for (var i = 0; i < this._count; i++) {
                var arange = this._endangle - this._startangle;
                var step = arange / this._count;
                this._clones[i].getChildren()[0].rotation.x = this._clones[i].getChildren()[0].rotation.y = this._clones[i].getChildren()[0].rotation.z = 0;
                if (this._plane.y === 0) {
                    this._clones[i].getChildren()[0].rotation.y = this._align ? this._offset + this._startangle + i * step : 0;
                }
                else if (this._plane.x === 0) {
                    this._clones[i].getChildren()[0].rotation.x = this._align ? -this._offset - this._startangle - i * step : 0;
                }
                else {
                    this._clones[i].getChildren()[0].rotation.z = this._align ? -this._offset - this._startangle - i * step : 0;
                }
                var vRet = this.eRotate(this._clones[i].getChildren()[0].rotation);
                this._clones[i].getChildren()[0].rotation = vRet;
            }
        };
        RadialCloner.prototype.calcSize = function () {
            for (var i = 0; i < this._count; i++) {
                //var orig=BABYLON.Vector3.Lerp(Cloner.vOne, this._S, this._iModeStep ? i : i / (this._count - 1));
                this._clones[i].getChildren()[0].scaling = this.eScale(Cloner.vOne);
            }
        };
        RadialCloner.prototype.calcPos = function () {
            this.eReset();
            for (var i = 0; i < this._count; i++) {
                var arange = this._endangle - this._startangle;
                var step = arange / this._count;
                this._clones[i].position.x = this._clones[i].position.y = this._clones[i].position.z = 0;
                //this._clones[i].getChildren()[0].rotation.x = this._clones[i].getChildren()[0].rotation.y = this._clones[i].getChildren()[0].rotation.z = 0;
                if (this._plane.y === 0) {
                    this._clones[i].position.x = Math.sin(this._offset + this._startangle + i * step) * this._radius;
                    this._clones[i].position.z = Math.cos(this._offset + this._startangle + i * step) * this._radius;
                    //console.log(this._clones[i].position);
                    this._clones[i].position = this.ePosition(this._clones[i].position);
                    //this._clones[i].getChildren()[0].rotation.y = this._align ? this._offset + this._startangle + i * step : 0;
                    //this._clones[i].scaling=RadialCloner.vOne.multiplyByFloats(1,(0.5+(this.frame%this._count))/this._count,1);
                }
                else if (this._plane.x === 0) {
                    this._clones[i].position.y = Math.sin(this._offset + this._startangle + i * step) * this._radius;
                    this._clones[i].position.z = Math.cos(this._offset + this._startangle + i * step) * this._radius;
                    this._clones[i].position = this.ePosition(this._clones[i].position);
                    //this._clones[i].getChildren()[0].rotation.x = this._align ? -this._offset - this._startangle - i * step : 0;
                }
                else {
                    this._clones[i].position.x = Math.sin(this._offset + this._startangle + i * step) * this._radius;
                    this._clones[i].position.y = Math.cos(this._offset + this._startangle + i * step) * this._radius;
                    this._clones[i].position = this.ePosition(this._clones[i].position);
                    //this._clones[i].getChildren()[0].rotation.z = this._align ? -this._offset - this._startangle - i * step : 0;
                }
            }
        };
        RadialCloner.prototype.update = function () {
            this.calcRot();
            this.calcPos();
            this.calcSize();
        };
        RadialCloner.prototype.delete = function () {
            for (var i = this._count - 1; i >= 0; i--) {
                this._clones[i].delete();
            }
            this._rootNode.dispose();
        };
        RadialCloner.prototype.recalc = function () {
            var cnt = this._count;
            this.count = 0;
            this.count = cnt;
        };
        Object.defineProperty(RadialCloner.prototype, "count", {
            get: function () {
                return this._count;
            },
            set: function (scnt) {
                var cnt = Number(scnt);
                if (cnt < Number(this._count)) {
                    for (var i = this._count - 1; i >= cnt; i--) {
                        this._clones[i].delete();
                    }
                    this._count = cnt;
                    this._clones.length = cnt;
                }
                else if (cnt > Number(this._count)) {
                    var start = this._count;
                    this._count = cnt;
                    this.createClones(start);
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "offset", {
            get: function () {
                return this._offset * 180 / Math.PI;
            },
            set: function (off) {
                this._offset = Math.PI * off / 180;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "root", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (r) {
                this._radius = r;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "align", {
            get: function () {
                return this._align;
            },
            set: function (a) {
                this._align = a;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "startangle", {
            get: function () {
                return this._startangle * 180 / Math.PI;
            },
            set: function (sa) {
                this._startangle = Math.PI * sa / 180;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "endangle", {
            get: function () {
                return this._endangle * 180 / Math.PI;
            },
            set: function (se) {
                this._endangle = Math.PI * se / 180;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadialCloner.prototype, "plane", {
            set: function (p) {
                this._plane = new BABYLON.Vector3(p.x, p.y, p.z);
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        RadialCloner.prototype.setScaling = function (ix, sc) {
            this._clones[ix].scaling = new BABYLON.Vector3(sc.x, sc.y, sc.z);
            this.update();
        };
        return RadialCloner;
    }(Cloner));
    BABYLONX.RadialCloner = RadialCloner;
    var ObjectCloner = (function (_super) {
        __extends(ObjectCloner, _super);
        function ObjectCloner(mesh, template, scene) {
            var _this = _super.call(this) || this;
            _this._useInstances = true;
            ObjectCloner.instance_nr = 0 | (ObjectCloner.instance_nr + 1);
            _this._mesh = mesh;
            _this._scene = scene;
            _this._template = template;
            _this._clones = [];
            _this._positions = template.getFacetLocalPositions();
            _this._normals = template.getFacetLocalNormals();
            _this._template.isVisible = false; //  setEnabled(false);
            _this._mesh.forEach(function (m) {
                m.setEnabled(false);
            });
            _this._instance_nr = ObjectCloner.instance_nr;
            _this._rootNode = new CMesh("rootOC_" + ObjectCloner.instance_nr, _this._scene, null, _this);
            _this.createClones();
            _this.calcPos();
            return _this;
        }
        ObjectCloner.prototype.createClones = function (start) {
            if (start === void 0) { start = 0; }
            var cix = 0;
            this._count = this._positions.length;
            for (var i = 0; i < this._positions.length; i++) {
                cix = i % this._mesh.length;
                var n = new CMesh("n_lc" + ObjectCloner.instance_nr + "_" + i, this._scene, this._rootNode);
                this._clones.push(n);
                n.createClone(this._mesh[cix], this._useInstances, this._mesh[cix].name + "_mc" + ObjectCloner.instance_nr + "_" + i);
            }
        };
        ObjectCloner.prototype.calcRot = function () {
            for (var i = 0; i < this._count; i++) {
                var vRet = this.eRotate(Cloner.vZero);
                this._clones[i].getChildren()[0].rotation = vRet;
            }
        };
        ObjectCloner.prototype.calcSize = function () {
            for (var i = 0; i < this._count; i++) {
                this._clones[i].scaling = this.eScale(Cloner.vOne);
            }
        };
        ObjectCloner.prototype.calcPos = function () {
            this.eReset();
            for (var i = 0; i < this._clones.length; i++) {
                this._clones[i].position = this.ePosition(this._positions[i]);
                /*
                this._clones[i].position.x=this._positions[i].x;
                this._clones[i].position.y=this._positions[i].y;
                this._clones[i].position.z=this._positions[i].z;
                */
            }
        };
        ObjectCloner.prototype.update = function () {
            if (this._count > 0) {
                this.calcRot();
                this.calcPos();
                this.calcSize();
            }
        };
        Object.defineProperty(ObjectCloner.prototype, "root", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        return ObjectCloner;
    }(Cloner));
    BABYLONX.ObjectCloner = ObjectCloner;
    var MatrixCloner = (function (_super) {
        __extends(MatrixCloner, _super);
        function MatrixCloner(mesh, scene, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.useInstances, useInstances = _c === void 0 ? true : _c, _d = _b.mcount, mcount = _d === void 0 ? { x: 3, y: 3, z: 3 } : _d, _e = _b.size, size = _e === void 0 ? { x: 2, y: 2, z: 2 } : _e, _f = _b.iModeStep, iModeStep = _f === void 0 ? false : _f;
            var _this = _super.call(this) || this;
            MatrixCloner.instance_nr = 0 | (MatrixCloner.instance_nr + 1);
            _this._mesh = mesh;
            _this._mesh.forEach(function (m) {
                m.setEnabled(false);
            });
            _this._scene = scene,
                _this._useInstances = useInstances;
            _this._clones = [];
            _this._size = size;
            _this._mcount = mcount;
            _this._count = Number(mcount.x * mcount.y * mcount.z);
            _this._iModeStep = iModeStep;
            _this._instance_nr = MatrixCloner.instance_nr;
            _this._rootNode = new CMesh("rootMC_" + MatrixCloner.instance_nr, _this._scene, null, _this);
            _this.createClones();
            _this.update();
            return _this;
        }
        MatrixCloner.prototype.createClone = function (parent, dummyUseInstances, dummyName) {
            if (dummyUseInstances === void 0) { dummyUseInstances = null; }
            if (dummyName === void 0) { dummyName = null; }
            var c = new MatrixCloner(this._mesh, this._scene, { mcount: this._mcount, size: this._size });
            parent._cloner = c;
            c.root.parent = parent;
            return c.root;
        };
        MatrixCloner.prototype.createClones = function (start) {
            if (start === void 0) { start = 0; }
            var cix = 0;
            for (var z = start; z < this._mcount.z; z++) {
                for (var y = start; y < this._mcount.y; y++) {
                    for (var x = start; x < this._mcount.x; x++) {
                        var n = new CMesh("n_lc" + MatrixCloner.instance_nr + "_" + x + y + z, this._scene, this._rootNode);
                        this._clones.push(n);
                        var xyz = x + this._mcount.x * y + this._mcount.x * this._mcount.y * z;
                        cix = xyz % this._mesh.length;
                        n.createClone(this._mesh[cix], this._useInstances, this._mesh[cix].name + "_mc" + MatrixCloner.instance_nr + "_" + x + y + z);
                    }
                }
            }
            this.calcPos();
        };
        Object.defineProperty(MatrixCloner.prototype, "mcount", {
            set: function (m) {
                this._mcount = m;
                this.delete();
                this._count = Number(this._mcount.x * this._mcount.y * this._mcount.z);
                this.createClones();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixCloner.prototype, "size", {
            set: function (s) {
                this._size = s;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        MatrixCloner.prototype.calcRot = function () {
            for (var i = 0; i < this._count; i++) {
                var vRet = this.eRotate(Cloner.vZero);
                this._clones[i].getChildren()[0].rotation = vRet;
            }
        };
        MatrixCloner.prototype.calcSize = function () {
            for (var i = 0; i < this._count; i++) {
                this._clones[i].getChildren()[0].scaling = this.eScale(Cloner.vOne);
            }
        };
        MatrixCloner.prototype.calcPos = function () {
            this.eReset();
            var cix = 0;
            for (var z = 0; z < this._mcount.z; z++) {
                for (var y = 0; y < this._mcount.y; y++) {
                    for (var x = 0; x < this._mcount.x; x++) {
                        var xyz = x + this._mcount.x * y + this._mcount.x * this._mcount.y * z;
                        cix = xyz % this._mesh.length;
                        var xo = -this._size.x * (this._mcount.x - 1) / 2;
                        var yo = -this._size.y * (this._mcount.y - 1) / 2;
                        var zo = -this._size.z * (this._mcount.z - 1) / 2;
                        this._clones[xyz].position.x = xo + x * this._size.x;
                        this._clones[xyz].position.y = yo + y * this._size.y;
                        this._clones[xyz].position.z = zo + z * this._size.z;
                        this._clones[xyz].getChildren()[0].position = this.ePosition(Cloner.vZero);
                    }
                }
            }
        };
        Object.defineProperty(MatrixCloner.prototype, "root", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        MatrixCloner.prototype.delete = function () {
            for (var i = this._count - 1; i >= 0; i--) {
                this._clones[i].delete();
            }
            this._clones.length = 0;
            //this._rootNode.dispose();
        };
        MatrixCloner.prototype.update = function () {
            if (this._count > 0) {
                this.calcRot();
                this.calcPos();
                this.calcSize();
            }
        };
        return MatrixCloner;
    }(Cloner));
    BABYLONX.MatrixCloner = MatrixCloner;
    var LinearCloner = (function (_super) {
        __extends(LinearCloner, _super);
        function LinearCloner(mesh, scene, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.count, count = _c === void 0 ? 3 : _c, _d = _b.offset, offset = _d === void 0 ? 0 : _d, _e = _b.growth, growth = _e === void 0 ? 1 : _e, _f = _b.useInstances, useInstances = _f === void 0 ? true : _f, _g = _b.P, P = _g === void 0 ? { x: 0, y: 2, z: 0 } : _g, _h = _b.S, S = _h === void 0 ? { x: 1, y: 1, z: 1 } : _h, _j = _b.R, R = _j === void 0 ? { x: 0, y: 0, z: 0 } : _j, _k = _b.iModeStep, iModeStep = _k === void 0 ? false : _k;
            var _this = _super.call(this) || this;
            LinearCloner.instance_nr = 0 | (LinearCloner.instance_nr + 1);
            _this._mesh = mesh;
            _this._mesh.forEach(function (m) {
                m.setEnabled(false);
            });
            _this._scene = scene,
                _this._useInstances = useInstances;
            _this._clones = [];
            _this._count = Number(count);
            _this._offset = offset;
            _this._P = new BABYLON.Vector3(P.x, P.y, P.z);
            _this._S = new BABYLON.Vector3(S.x, S.y, S.z);
            _this._R = new BABYLON.Vector3(R.x, R.y, R.z);
            _this._iModeStep = iModeStep;
            _this._growth = growth;
            _this._instance_nr = LinearCloner.instance_nr;
            _this._rootNode = new CMesh("rootLC_" + LinearCloner.instance_nr, _this._scene, null, _this);
            _this.createClones();
            _this.update();
            return _this;
        }
        LinearCloner.prototype.createClone = function (parent, dummyUseInstances, dummyName) {
            if (dummyUseInstances === void 0) { dummyUseInstances = null; }
            if (dummyName === void 0) { dummyName = null; }
            var c = new LinearCloner(this._mesh, this._scene, { count: this._count, offset: this._offset, growth: this._growth, useInstances: this._useInstances, P: { x: this._P.x, y: this._P.y, z: this._P.z }, S: { x: this._S.x, y: this._S.y, z: this._S.z }, R: { x: this._R.x, y: this._R.y, z: this._R.z }, iModeStep: this._iModeStep });
            parent._cloner = c;
            c.root.parent = parent;
            return c.root;
        };
        LinearCloner.prototype.createClones = function (start) {
            if (start === void 0) { start = 0; }
            var cix = 0;
            for (var i = start; i < this._count; i++) {
                var n = new CMesh("n_lc" + LinearCloner.instance_nr + "_" + i, this._scene, i == 0 ? this._rootNode : this._clones[i - 1]);
                this._clones.push(n);
                cix = i % this._mesh.length;
                n.createClone(this._mesh[cix], this._useInstances, this._mesh[cix].name + "_lc" + LinearCloner.instance_nr + "_" + i);
            }
        };
        LinearCloner.prototype.calcSize = function () {
            for (var i = 1; i < this._count; i++) {
                var orig = BABYLON.Vector3.Lerp(Cloner.vOne, this._S, this._iModeStep ? i : i / (this._count - 1));
                this._clones[i].getChildren()[0].scaling = this.eScale(orig);
            }
        };
        LinearCloner.prototype.calcPos = function () {
            this.eReset();
            var f = this._growth;
            if (this._iModeStep == false) {
                var tcm1 = this._count == 1 ? 1 : this._count - 1;
                f = 1 / (tcm1) * this._growth;
            }
            //shift offset
            this._clones[0].position = BABYLON.Vector3.Lerp(Cloner.vZero, this._P, f * this._offset);
            this._clones[0].position = this.ePosition(this._clones[0].position);
            for (var i = 1; i < this._count; i++) {
                this._clones[i].position = BABYLON.Vector3.Lerp(Cloner.vZero, this._P, f);
                this._clones[i].getChildren()[0].position = this.ePosition(Cloner.vZero);
            }
        };
        LinearCloner.prototype.calcRot = function () {
            for (var i = 1; i < this._count; i++) {
                var item = this._clones[i].getChildren()[0];
                //this._clones[i].getChildren()[0].rotation = BABYLON.Vector3.Lerp(Cloner.vZero, this._R, this._iModeStep ? i * this._growth : i / (this._count - 1) * this._growth);
                //this._clones[i].getChildren()[0].rotation = this.eRotate(Cloner.vZero);//   this._clones[i].rotation);
                var vRot = BABYLON.Vector3.Lerp(Cloner.vZero, this._R, this._iModeStep ? i * this._growth : i / (this._count - 1) * this._growth);
                this._clones[i].getChildren()[0].rotation = this.eRotate(vRot); //   this._clones[i].rotation);
            }
        };
        LinearCloner.prototype.update = function () {
            if (this._count > 0) {
                this.calcRot();
                this.calcPos();
                this.calcSize();
            }
        };
        LinearCloner.prototype.recalc = function () {
            var cnt = this._count;
            this.count = 0;
            this.count = cnt;
        };
        Object.defineProperty(LinearCloner.prototype, "growth", {
            set: function (g) {
                this._growth = g;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        LinearCloner.prototype.delete = function () {
            for (var i = this._count - 1; i >= 0; i--) {
                this._clones[i].parent = null;
                this._clones[i].getChildren()[0].dispose();
                this._clones[i].dispose();
            }
            this._rootNode.dispose();
        };
        Object.defineProperty(LinearCloner.prototype, "count", {
            get: function () {
                return this._count;
            },
            set: function (scnt) {
                var cnt = Number(scnt);
                if (cnt < Number(this._count)) {
                    for (var i = this._count - 1; i >= cnt; i--) {
                        this._clones[i].delete();
                    }
                    this._count = cnt;
                    this._clones.length = cnt;
                }
                else if (cnt > Number(this._count)) {
                    var start = this._count;
                    this._count = cnt;
                    this.createClones(start);
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "mode", {
            set: function (m) {
                var newMode = (m == "step") ? true : false;
                var f = (this._count - 1);
                if (newMode && this._iModeStep == false) {
                    f = 1 / f;
                }
                this._R = BABYLON.Vector3.Lerp(Cloner.vZero, this._R, f);
                this._P = BABYLON.Vector3.Lerp(Cloner.vZero, this._P, f);
                this._S = BABYLON.Vector3.Lerp(Cloner.vOne, this._S, f);
                this._iModeStep = newMode;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "position", {
            get: function () {
                return { x: this._P.x, y: this._P.y, z: this._P.z };
            },
            set: function (pos) {
                this._P.x = pos.x;
                this._P.y = pos.y;
                this._P.z = pos.z;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "scale", {
            get: function () {
                return { x: this._S.x, y: this._S.y, z: this._S.z };
            },
            set: function (s) {
                this._S.x = s.x;
                this._S.y = s.y;
                this._S.z = s.z;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "rotation", {
            get: function () {
                return { x: this._R.x * 180 / Math.PI, y: this._R.y * 180 / Math.PI, z: this._R.z * 180 / Math.PI };
            },
            set: function (r) {
                this._R.x = r.x * Math.PI / 180;
                this._R.y = r.y * Math.PI / 180;
                this._R.z = r.z * Math.PI / 180;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "offset", {
            get: function () {
                return this._offset;
            },
            set: function (o) {
                this._offset = o;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "root", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearCloner.prototype, "mesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        return LinearCloner;
    }(Cloner));
    BABYLONX.LinearCloner = LinearCloner;
})(BABYLONX || (BABYLONX = {}));
