/// <reference path="./Mesh.ts"/>
module QI{

    export class Hair extends BABYLON.LinesMesh {
        //TODO get matrix weights to use stiffness
        //TODO document hair
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
         * @param {number} colorSpread - The maximum amount to randomly change the color of a thread, optional.
         * @param {number} longestStrand - The longest distance between the first & last points in the strands, optional.
         * @param {number} stiffness - The matrix weight at the end of the longest strand, optional.
         * @param {number} boneName - The name of the bone in the skeleton to be used as a bone influencer, optional.
         */
        public assemble(strandNumVerts : number[], rootRelativePositions : number[], colorSpread = 0.05, longestStrand? : number, stiffness? : number, boneName? : string) : void {
            var idx = 0; // index used for writing into indices
            var pdx = 0; // index used for writing into positions
            var cdx = 0; // index used for writing into vertex colors
            var mdx = 0; // index used for writing into matrix indices & weights
            
            var indices = [];  // cannot use Uint32Array as it is not worth finding out how big it is going to be in advance
            var nPosElements = rootRelativePositions.length;
            var positions32 = new Float32Array(nPosElements);
            var colors32    = new Float32Array(nPosElements / 3 * 4);
            
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
            var colorR : number, colorG : number, colorB : number, colorA : number;
            var colorOffset = new Array<number>(3);

            for (var i = 0, nStrands = strandNumVerts.length; i < nStrands; i++) {
                rootX = positions32[pdx    ] = rootRelativePositions[pdx    ];
                rootY = positions32[pdx + 1] = rootRelativePositions[pdx + 1];
                rootZ = positions32[pdx + 2] = rootRelativePositions[pdx + 2];
                pdx += 3;
                
                 // between -.05 and .05 using default
                colorOffset[0] = Math.random() * (2 * colorSpread) - colorSpread; 
                colorOffset[1] = Math.random() * (2 * colorSpread) - colorSpread; 
                colorOffset[2] = Math.random() * (2 * colorSpread) - colorSpread; 
                
                colorR = colors32[cdx    ] = Math.min(1, Math.max(0, this.color.r + colorOffset[0]));
                colorG = colors32[cdx + 1] = Math.min(1, Math.max(0, this.color.g + colorOffset[0]));
                colorB = colors32[cdx + 2] = Math.min(1, Math.max(0, this.color.b + colorOffset[0]));
                colorA = colors32[cdx + 3] = 1;
                cdx += 4;
                
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
                    
                    colors32[cdx    ] = colorR;
                    colors32[cdx + 1] = colorG;
                    colors32[cdx + 2] = colorB;
                    colors32[cdx + 3] = colorA;
                    cdx += 4;
                    
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
            this.setVerticesData(BABYLON.VertexBuffer.ColorKind   , colors32   );
            
            this.setIndices(indices);
            if (boneIndex) {
                this.numBoneInfluencers = 1;
                this.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matrixIndices);
                this.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matrixWeights);
            }
        }
        
        private _lengthSoFar(deltaX : number, deltaY : number, deltaZ : number) : number {
            return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ) );
        }
    }
}