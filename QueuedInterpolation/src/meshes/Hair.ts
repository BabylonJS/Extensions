/// <reference path="./Mesh.ts"/>
module QI{

    export class Hair extends BABYLON.LinesMesh {
        //TODO get matrix weights to use stiffness
        //TODO document hair
        
        // assigned outside of class, at bottom of file since static
        public static _Colors : { [name : string] : BABYLON.Color3} = {};
        
        // assigned from assemble, so hair color can be changed later; primarily for development
        private _nPosElements : number;
        private _strandNumVerts : number[];
        
        // members, so it is easier to develop
        public seed = 0;
        public colorSpread = 0.05; // The maximum amount to randomly change the color of a thread
        public intraStrandColorSpread = 0.02;
        public alpha = 1.0;
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
        constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node = null, source?: BABYLON.LinesMesh, doNotCloneChildren?: boolean) {
            super(name, scene, parent, source, doNotCloneChildren, true);
        }
        // ====================================== initializing =======================================
        /** 
         * Called to generate the geometry using values which are more compact to pass & allow multiple things to be defined.
         * @param {number[]} strandNumVerts -The number of verts per each strand.
         * @param {number[]} rootRelativePositions - The x, y, z values of each point.  First is root is absolute, rest are delta to root.  
         *                                           More compact than absolute for all, & useful in calculating hair length at each point.
         * @param {number} longestStrand - The longest distance between the first & last points in the strands, optional.
         * @param {number} stiffness - The matrix weight at the end of the longest strand, optional.
         * @param {number} boneName - The name of the bone in the skeleton to be used as a bone influencer, optional.
         */
        public assemble(strandNumVerts : number[], rootRelativePositions : number[], longestStrand? : number, stiffness? : number, boneName? : string) : void {
            var idx = 0; // index used for writing into indices
            var pdx = 0; // index used for writing into positions
            var mdx = 0; // index used for writing into matrix indices & weights
            
            var indices = [];  // cannot use Uint32Array as it is not worth finding out how big it is going to be in advance
            var nPosElements = rootRelativePositions.length;
            var positions32 = new Float32Array(nPosElements);
            
            var matrixIndices : Float32Array;
            var matrixWeights : Float32Array;
            var deltaStiffness : number;
            var boneIndex = (this.skeleton && boneName) ? this.skeleton.getBoneIndexByName(boneName): null;
            if (boneIndex) {
                matrixIndices = new Float32Array(nPosElements / 3 * 4);
                matrixWeights = new Float32Array(nPosElements / 3 * 4);
                deltaStiffness = 1 - stiffness;
            }
            
            var rootX  : number, rootY  : number, rootZ  : number;
            var deltaX : number, deltaY : number, deltaZ : number;

            for (var i = 0, nStrands = strandNumVerts.length; i < nStrands; i++) {
                rootX = positions32[pdx    ] = rootRelativePositions[pdx    ];
                rootY = positions32[pdx + 1] = rootRelativePositions[pdx + 1];
                rootZ = positions32[pdx + 2] = rootRelativePositions[pdx + 2];
                pdx += 3;
                
                idx++;
                
                 if (boneIndex) {
                    matrixIndices[mdx] = boneIndex;
                    matrixWeights[mdx] = 1;
                    mdx += 4;
                }
                
                for (var vert = 1; vert < strandNumVerts[i]; vert++) {
                    deltaX = rootRelativePositions[pdx    ]; positions32[pdx    ] = rootX + deltaX;
                    deltaY = rootRelativePositions[pdx + 1]; positions32[pdx + 1] = rootY + deltaY;
                    deltaZ = rootRelativePositions[pdx + 2]; positions32[pdx + 2] = rootZ + deltaZ;
                    pdx += 3;
                    
                   if (boneIndex) {
                        matrixIndices[mdx] = boneIndex;
                        matrixWeights[mdx] = .0000010; //1 - (deltaStiffness * (this._lengthSoFar(deltaX, deltaY, deltaZ) / longestStrand));
                        mdx += 4;
                    }
                    
                    indices.push(idx - 1);
                    indices.push(idx);
                    idx++;
                }
            }
            this.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions32);
             
            this.setIndices(indices);
            if (boneIndex) {
                this.numBoneInfluencers = 1;
                this.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matrixIndices);
                this.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matrixWeights);
            }
            
            // assign stuff to members to be able to change vertex colors afterward & set for the first time
            this._strandNumVerts = strandNumVerts;
            this._nPosElements = nPosElements;
            this.assignVertexColor();
        }


        public assignVertexColor() : void {
            this._workingSeed = this.seed;
            
            var cdx = 0; // index used for writing into vertex colors
            
            var colors32 = new Float32Array(this._nPosElements / 3 * 4);
            
            var colorR : number, colorG : number, colorB : number, colorA : number;
            var colorOffset = new Array<number>(3);

            for (var i = 0, nStrands = this._strandNumVerts.length; i < nStrands; i++) {
                 // between -.05 and .05 using default; only use 1 for all channels at the strand level; individuals change too much
                colorOffset[0] = this.random() * (2 * this.colorSpread) - this.colorSpread; 
                
                colorR = colors32[cdx    ] = Math.min(1, Math.max(0, this.color.r + colorOffset[0]));
                colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, this.color.g + colorOffset[0]));
                colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, this.color.b + colorOffset[0]));
                colorA = colors32[cdx + 3] = this.alpha;
                cdx += 4;
               
                
                for (var vert = 1; vert < this._strandNumVerts[i]; vert++) {
                    colorOffset[0] = this.random() * this.intraStrandColorSpread; 
                    colorOffset[1] = this.random() * this.intraStrandColorSpread; 
                    colorOffset[2] = this.random() * this.intraStrandColorSpread; 

                    colorR = colors32[cdx    ] = Math.min(1, Math.max(0, colorR + colorOffset[0]));
                    colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, colorG + colorOffset[1]));
                    colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, colorB + colorOffset[2]));
                    colorA = colors32[cdx + 3] = this.alpha;
                    cdx += 4;
                }
            }
            this.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors32, true);            
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
    }
    
    // The keys match those in particle_hair.py
    Hair._Colors["BLACK"          ] = new BABYLON.Color3(0.05,  0.05,  0.05);
    Hair._Colors["DARK_BROWN"     ] = new BABYLON.Color3(0.10,  0.03,  0.005);
    Hair._Colors["MEDIUM_BROWN"   ] = new BABYLON.Color3(0.30,  0.16,  0.05);
    Hair._Colors["LIGHT_BROWN"    ] = new BABYLON.Color3(0.35,  0.22,  0.09);
    Hair._Colors["DIRTY_BLONDE"   ] = new BABYLON.Color3(0.45,  0.35,  0.15);
    Hair._Colors["BLONDE"         ] = new BABYLON.Color3(0.65,  0.55,  0.28);
    Hair._Colors["PLATINUM_BLONDE"] = new BABYLON.Color3(0.75,  0.70,  0.35);
    Hair._Colors["RED"            ] = new BABYLON.Color3(0.367, 0.072, 0.026);
    Hair._Colors["ORANGE"         ] = new BABYLON.Color3(0.50,  0.19,  0.03);
    Hair._Colors["WHITE"          ] = new BABYLON.Color3(0.90,  0.90,  0.95);
}