/// <reference path="./Mesh.ts"/>
module QI{

    export class Hair extends Mesh {
        //TODO document hair

        // assigned outside of class, at bottom of file since static
        public static _Colors : { [name : string] : BABYLON.Color3} = {};
        public static Debug = false;

        // assigned from assemble, so hair color or skeleton weight can be changed later; primarily for development
        private _nPosElements : number;
        private _strandNumVerts : number[];
        private _segmentLengthSoFar : Float32Array;
        private _headBone : string;
        private _spineBone : string;
        private _longestStrand : number;
        private _lowestRootStrand : number;
        public stiffness : number;

        // members, so it is easier to develop
        public cornerOffset = 0.02; // the distance of the triangle corner from the passed points
        public seed = 0;
        public interStrandColorSpread = 0; // The maximum amount to randomly change the color of a thread
        public intraStrandColorSpread = 0;
        public color = new BABYLON.Color3(1, 1, 1);
        public emissiveColorScaling = 1;
        private _namedColor : string;

        public get namedColor() : string { return this._namedColor; }
        public set namedColor(value : string) {
            this._namedColor = value;
            this.color = Hair._Colors[value];
        }

        /**
         * @constructor - Args same As BABYLON.Mesh, except that the arg for useVertexColor in LinesMesh is not passed an hard-coded to true
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: Mesh, doNotCloneChildren?: boolean) {
            super(name, scene, parent, source, doNotCloneChildren);
        }
        // ====================================== initializing =======================================
        /**
         * Called to generate the geometry using values which are more compact to pass & allow multiple things to be defined.
         * @param {number[]} strandNumVerts -The number of verts per each strand.
         * @param {number[]} rootRelativePositions - The x, y, z values of each point.  First is root is absolute, rest are delta to root.
         *                                           More compact than absolute for all, & useful in calculating hair length at each point.
         * @param {number} headBone - The name of the bone in the skeleton to be used as a bone influencer, optional.
         * @param {number} spineBone - The highest bone in the spine to be a second bone influencer, optional.
         * @param {number} longestStrand - The longest distance between the first & last points in the strands.  Unused when no spineBone, optional.
         * @param {number} stiffness - The matrix weight at the end of the longest strand to the head bone.  Unused when no spine bone, optional.
         */
        public assemble(strandNumVerts : number[], rootRelativePositions : number[], headBone? : string, spineBone? : string, longestStrand? : number, stiffness? : number) : void {
            var adx = 0 // offset for reading absolutePositions
            var pdx = 0; // index used for writing into positions
            var idx = 0; // index used for writing into indices

            // assign stuff to members to be able to change vertex colors or matrix weights afterward & set for the first time
            this._strandNumVerts = strandNumVerts;
            this._headBone = headBone;
            this._spineBone = spineBone;
            this._longestStrand = longestStrand;
            this.stiffness = stiffness;

            var absPositions = this._toAbsolutePositions(rootRelativePositions);
            this._assignSegmentLengthSoFar(rootRelativePositions);

            var indices = [];  // cannot use Uint32Array as it is not worth finding out how big it is going to be in advance
            var positions32 = new Float32Array(this._nPosElements);
            var notLast : boolean;

            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                this._extrudeTriangle(adx, false, true, absPositions, positions32, pdx);
                adx += 3;
                pdx += 9;

                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    notLast = vert + 1 < this._strandNumVerts[i];
                    this._extrudeTriangle(adx, true, notLast, absPositions, positions32, pdx);
                    adx += 3;
                    pdx += notLast ? 9 : 3;

                    if (notLast) {
                        indices.push(idx    ); indices.push(idx + 1); indices.push(idx + 4);
                        indices.push(idx    ); indices.push(idx + 3); indices.push(idx + 4);

                        indices.push(idx + 1); indices.push(idx + 2); indices.push(idx + 5);
                        indices.push(idx + 1); indices.push(idx + 4); indices.push(idx + 5);

                        indices.push(idx + 2); indices.push(idx    ); indices.push(idx + 3);
                        indices.push(idx + 2); indices.push(idx + 5); indices.push(idx + 3);

                        idx += 3;
                    } else {
                        indices.push(idx    ); indices.push(idx + 1); indices.push(idx + 3);
                        indices.push(idx + 1); indices.push(idx + 2); indices.push(idx + 3);
                        indices.push(idx + 2); indices.push(idx    ); indices.push(idx + 3);
                        idx += 4;
                    }
                }
            }
            if (Hair.Debug) {
                this._dump(positions32, "positions32");
                this._dump(indices, "indices");
            }

            this.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions32);
            this.setIndices(indices);

            // cannot calculate normals until positions & indices have been loaded, do now
            var normals = new Float32Array(this._nPosElements);
            BABYLON.VertexData.ComputeNormals(positions32, indices, normals);
            this.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);

            // cannot write weights until position have, do now
            this.assignWeights();

            this.assignVertexColor();
        }

        /**
         * Positions of strands are sent relative to the start of each strand, which saves space; undo here
         * Also accumulates the # of position elements (verts * 3), for easy FloatArray initialization.
         */
        private _toAbsolutePositions(rootRelativePositions : number[]) : number[] {
            var pdx = 0; // index used for writing into positions
            this._nPosElements = 0;
            this._lowestRootStrand = Number.MAX_VALUE;

            var absPositions = new Array<number>(rootRelativePositions.length);

            var rootX  : number, rootY  : number, rootZ  : number;

            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                rootX = absPositions[pdx    ] = rootRelativePositions[pdx    ];
                rootY = absPositions[pdx + 1] = rootRelativePositions[pdx + 1];
                rootZ = absPositions[pdx + 2] = rootRelativePositions[pdx + 2];
                pdx += 3;
                this._nPosElements += 9; // first point of strand will have 3 positions
                if (this._lowestRootStrand > rootY)
                    this._lowestRootStrand = rootY;

                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    absPositions[pdx    ] = rootRelativePositions[pdx    ] + rootX;
                    absPositions[pdx + 1] = rootRelativePositions[pdx + 1] + rootY;
                    absPositions[pdx + 2] = rootRelativePositions[pdx + 2] + rootZ;
                    pdx += 3;
                    this._nPosElements += (vert + 1 < this._strandNumVerts[i]) ? 9 : 3; // all but last segment has 9; last 3
                }
            }
            if (Hair.Debug) {
                this._dump(rootRelativePositions, "relative pos");
                this._dump(absPositions, "abs");
            }
            return absPositions;
        }

/*        public computeNormals(positions32 : Float32Array, indices : any[]) : void {
            var normals = new Float32Array(this._nPosElements);
            BABYLON.VertexData.ComputeNormals(positions32, indices, normals);

            // determine min max of X position
            var minX = Number.MAX_VALUE;
            var maxX = Number.MIN_VALUE;
            for (var i = 0; i < this._nPosElements; i += 3) {
                if (minX > positions32[i])
                    minX = positions32[i];
                if (maxX < positions32[i])
                    maxX = positions32[i];
            }

            var signZ : number;
            // change the Z component of the normal, based on the positions
            for (var i = 0; i < this._nPosElements; i += 3) {

                // the sign of the normal depends of the sign of the Z position
                signZ = (positions32[i + 2] < 0) ? -1 : 1;

                // when x is negative on right side of head; positive
                if (positions32[i] < 0) {
                    normals[i + 2] = signZ * (1 - positions32[i] / minX); // the closer position is to minX, the closer to 0 of the normal
                } else {
                    normals[i + 2] = signZ * (1 - positions32[i] / maxX); // the closer position is to maxX, the closer to 0 of the normal
                }
            }
            this.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);

        }*/

        /**
         * primary reason to convert is so skeleton weights are simpler to calculate & can be changed after assemble.  Also takes up less than
         * 1/3 of the space of the root relative positions.
         */
        private _assignSegmentLengthSoFar(rootRelativePositions) : void {
            // determine the total number of segments
            var nSegments = 0;
            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                nSegments += this._strandNumVerts[i] - 1; // the number of segments is always 1 less than the # of vertices
            }

            this._segmentLengthSoFar = new Float32Array(nSegments);
            var pdx = 0; // index used for reading into the original relative positions

            // loop thru each strand to write indices & weights
            for (var i = 0, c = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                pdx += 3; // skip over the positions of the strand root

                // assign the remaining vertices
                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    this._segmentLengthSoFar[c++] = this._lengthSoFar(rootRelativePositions[pdx], rootRelativePositions[pdx + 1], rootRelativePositions[pdx + 2]);
                    pdx += 3;
                 }
            }
       }

         // less garbage getting only once
        private static _right = BABYLON.Vector3.Right();
        private static _up = BABYLON.Vector3.Up();
        private static _forward = BABYLON.Vector3.Forward();

        private _extrudeTriangle(adx : number, hasPrev : boolean, hasNext : boolean, absPositions : number[] , positions32 : Float32Array, pdx : number) : void {
            // when this is the end of the strand, just use the actual position once
            if (!hasNext) {
                positions32[pdx    ] = absPositions[adx    ];
                positions32[pdx + 1] = absPositions[adx + 1];
                positions32[pdx + 2] = absPositions[adx + 2];
                return;
            }
            var at = new BABYLON.Vector3(absPositions[adx], absPositions[adx + 1], absPositions[adx + 2]);

            var prevOffset =  hasPrev ? adx - 3: adx;
            var prev = new BABYLON.Vector3(absPositions[prevOffset], absPositions[prevOffset + 1], absPositions[prevOffset + 2]);

            var next  = new BABYLON.Vector3(absPositions[adx + 3], absPositions[adx + 4], absPositions[adx + 5]);

            // the direction of the 2 points
            var dir = next.subtract(prev).normalize();

            var right = BABYLON.Vector3.Cross(dir, Hair._right);
            var xCorner = at.add(right.scale(this.cornerOffset));
            positions32[pdx    ] = xCorner.x;
            positions32[pdx + 1] = xCorner.y;
            positions32[pdx + 2] = xCorner.z;

            var up = BABYLON.Vector3.Cross(dir, Hair._up);
            var yCorner = at.add(up.scale(this.cornerOffset));
            positions32[pdx + 3] = yCorner.x;
            positions32[pdx + 4] = yCorner.y;
            positions32[pdx + 5] = yCorner.z;

            var forward = BABYLON.Vector3.Cross(dir, Hair._forward);
            var zCorner = at.add(forward.scale(this.cornerOffset));
            positions32[pdx + 6] = zCorner.x;
            positions32[pdx + 7] = zCorner.y;
            positions32[pdx + 8] = zCorner.z;
        }

        /**
         * The assignment of matrix weights depend on headBone assigned, and having a skeleton of course.
         * If spineBone is also assigned.  Some weight can be diverted from the head to avoid the hair cutting into the body
         * as turned.  This diversion only takes place, when the height, Y, of a vertex is lower than the lowest root of the
         * strands.
         */
        public assignWeights() : boolean {
            var headBoneIndex = (this.skeleton && this._headBone) ? this.skeleton.getBoneIndexByName(this._headBone): null;
            if (!headBoneIndex) return false;

            var spineBoneIndex = (this.skeleton && this._spineBone) ? this.skeleton.getBoneIndexByName(this._spineBone): null;
            this.numBoneInfluencers = spineBoneIndex ? 2 : 1;

            var sdx = 0; // index used for reading into the strand lengths
            var mdx = 0; // index used for writing into matrix indices & weights

            var matrixIndices = new Float32Array(this._nPosElements / 3 * 4);
            var matrixWeights = new Float32Array(this._nPosElements / 3 * 4);
            var deltaStiffness = 1 - this.stiffness;
            var t;

            // loop thru each strand to write indices & weights
            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                // assign the triangle of vertices up next to head, no need to account for stiffness / spine influencer (is 0)
                for (var v = 0; v < 3; v++) {
                    matrixIndices[mdx] = headBoneIndex;
                    matrixWeights[mdx] = 1;
                    mdx += 4;
                }

                // assign the rest of the triangles & last point
                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    t = (vert + 1 < this._strandNumVerts[i]) ? 3 : 1; // all but last segment has 3; last 1

                    var headInfluence = this._spineBone ? 1 - (deltaStiffness * this._segmentLengthSoFar[sdx++] / this._longestStrand) : 1;
                    for (var v = 0; v < t; v++) {
                        // head bone
                        matrixIndices[mdx] = headBoneIndex;
                        matrixWeights[mdx] = headInfluence;

                        if (this._spineBone) {
                        matrixIndices[mdx + 1] = spineBoneIndex;
                        matrixWeights[mdx + 1] = 1 - headInfluence; // make sure both adds to 1
                        }
                        mdx += 4;
                    }
                 }
            }
            this.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matrixIndices);
            this.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matrixWeights);
        }

        public assignVertexColor() : void {
            this._workingSeed = this.seed;

            var cdx = 0; // index used for writing into vertex colors

            var colors32 = new Float32Array(this._nPosElements / 3 * 4);

            var colorR : number, colorG : number, colorB : number, colorA : number;
            var interOffset : number;
            var intraOffset = new Array<number>(3);
            var t;

            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                 // between -.05 and .05 using default; only use 1 for all channels at the strand level; individuals change too much
                interOffset = this.random() * (2 * this.interStrandColorSpread) - this.interStrandColorSpread;

                for (var v = 0; v < 3; v++) {
                    colorR = colors32[cdx    ] = Math.min(1, Math.max(0, this.color.r + interOffset));
                    colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, this.color.g + interOffset));
                    colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, this.color.b + interOffset));
                    colorA = colors32[cdx + 3] = 1.0;
                    cdx += 4;
                }

                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    t = (vert + 1 < this._strandNumVerts[i]) ? 3 : 1; // all but last segment has 3; last 1

                    for (var v = 0; v < t; v++) {
                        intraOffset[0] = this.random() * this.intraStrandColorSpread;
                        intraOffset[1] = this.random() * this.intraStrandColorSpread;
                        intraOffset[2] = this.random() * this.intraStrandColorSpread;

                        colorR = colors32[cdx    ] = Math.min(1, Math.max(0, colorR + intraOffset[0]));
                        colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, colorG + intraOffset[1]));
                        colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, colorB + intraOffset[2]));
                        colors32[cdx + 3] = 1.0;
                        cdx += 4;
                    }
                }
            }
            this.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors32, true);

            // also add an emissive material, slightly darker to be used as a minimum when normals going wrong way
            if (!this.material){
                var material = new BABYLON.StandardMaterial(this.name + "_emissive", this.getScene() );
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                material.specularPower = 0;
                if (this.parent instanceof BABYLON.Mesh) {
                    var parent = <BABYLON.Mesh> this.parent;
                    if (parent && parent.material && parent.material instanceof BABYLON.StandardMaterial)
                        material.maxSimultaneousLights = (<BABYLON.StandardMaterial> parent.material).maxSimultaneousLights;
                }
                this.material = material;
            }
            var emissiveColor = this.color.scale(this.emissiveColorScaling);
            if (emissiveColor.r > 0.5) emissiveColor.r = 0.5;
            if (emissiveColor.g > 0.5) emissiveColor.g = 0.5;
            if (emissiveColor.b > 0.5) emissiveColor.b = 0.5;
            (<BABYLON.StandardMaterial> this.material).emissiveColor = emissiveColor;
        }

        private _lengthSoFar(deltaX : number, deltaY : number, deltaZ : number) : number {
            return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) );
        }

        // from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
        private _workingSeed = this.seed;
        public random() : number {
            var x = Math.sin(this._workingSeed++) * 10000;
            return x - Math.floor(x);
        }

        private _dump(values : any, name) : void {
            console.log("\n\n" + name + ":");
            for (var i = 0, len = values.length; i < len; i+=3) {
                console.log((i/3) + ":\t" + values[i] + ", " + values[i + 1], ", " + values[i + 2]);
            }
        }
    }

    // The keys match those in particle_hair.py
    Hair._Colors["BLACK"          ] = new BABYLON.Color3(0.05,  0.05,  0.05);
    Hair._Colors["DARK_BROWN"     ] = new BABYLON.Color3(0.10,  0.03,  0.005);
    Hair._Colors["MEDIUM_BROWN"   ] = new BABYLON.Color3(0.30,  0.16,  0.05);
    Hair._Colors["LIGHT_BROWN"    ] = new BABYLON.Color3(0.35,  0.22,  0.09);
    Hair._Colors["DIRTY_BLONDE"   ] = new BABYLON.Color3(0.45,  0.35,  0.15);
    Hair._Colors["BLONDE"         ] = new BABYLON.Color3(0.65,  0.55,  0.28);
    Hair._Colors["PLATINUM_BLONDE"] = new BABYLON.Color3(0.92,  0.92,  0.625); //0.95,  0.95,  0.625);
    Hair._Colors["RED"            ] = new BABYLON.Color3(0.367, 0.072, 0.026);
    Hair._Colors["ORANGE"         ] = new BABYLON.Color3(0.50,  0.19,  0.03);
    Hair._Colors["WHITE"          ] = new BABYLON.Color3(0.87,  0.87,  0.92); //0.90,  0.90,  0.95);
}