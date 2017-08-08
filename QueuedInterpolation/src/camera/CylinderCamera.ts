
module QI {
    export class CylinderCamera extends BABYLON.ArcRotateCamera {
        // TODO add documentation
        private _targetMesh: BABYLON.AbstractMesh;
        
        private _traverseOffset = 0;
        
        static FixedVert = Math.PI / 2;
        static FixedHorz = Math.PI / 2;

        constructor(name: string, public _isVertical : boolean, alphaOrBeta: number, radius: number, scene: BABYLON.Scene, targetMesh?: BABYLON.AbstractMesh, toBoundingCenter = true) {
            super(name, 0, 0, radius, BABYLON.Vector3.Zero(), scene);
                        
            if (targetMesh) this.setTargetMesh(targetMesh, toBoundingCenter);

            // apply the angle to the correct axis, otherwise 0
            this.alpha = this._isVertical ? alphaOrBeta : CylinderCamera.FixedHorz;
            this.beta  = this._isVertical ? CylinderCamera.FixedVert : alphaOrBeta;

            this.getViewMatrix();
        }

        protected _getTargetPosition(): BABYLON.Vector3 {                
            if (this._targetMesh) {
                this._target.copyFrom(this._targetMesh.getAbsolutePosition());
                if (this._isVertical) this._target.y += this._traverseOffset;
                else this._target.x += this._traverseOffset;
            }

            return this._target;
        }

        public _checkInputs(): void {
            //if (async) collision inspection was triggered, don't update the camera's position - until the collision callback was called.
            if (this._collisionTriggered) {
                return;
            }

            this.inputs.checkInputs();
            // Inertia
            if (this.inertialAlphaOffset !== 0 || this.inertialBetaOffset !== 0 || this.inertialRadiusOffset !== 0) {

                if (this._isVertical) {
                    if (this.getScene().useRightHandedSystem) {
                        this.alpha -= this.inertialAlphaOffset;
                    } else {
                        this.alpha += this.inertialAlphaOffset;
                    }
                }else this._traverseOffset -= this.inertialAlphaOffset;

                if (!this._isVertical) this.beta += this.inertialBetaOffset;
                else this._traverseOffset -= this.inertialBetaOffset;

                this.radius -= this.inertialRadiusOffset;
                this.inertialAlphaOffset *= this.inertia;
                this.inertialBetaOffset *= this.inertia;
                this.inertialRadiusOffset *= this.inertia;
                if (Math.abs(this.inertialAlphaOffset) < this.speed * BABYLON.Epsilon)
                    this.inertialAlphaOffset = 0;
                if (Math.abs(this.inertialBetaOffset) < this.speed * BABYLON.Epsilon)
                    this.inertialBetaOffset = 0;
                if (Math.abs(this.inertialRadiusOffset) < this.speed * BABYLON.Epsilon)
                    this.inertialRadiusOffset = 0;
            }

            // Panning inertia
            if (this.inertialPanningX !== 0 || this.inertialPanningY !== 0) {
                if (!this._localDirection) {
                    this._localDirection = BABYLON.Vector3.Zero();
                    this._transformedDirection = BABYLON.Vector3.Zero();
                }

                this._localDirection.copyFromFloats(this.inertialPanningX, this.inertialPanningY, this.inertialPanningY);
                this._localDirection.multiplyInPlace(this.panningAxis);
                this._viewMatrix.invertToRef(this._cameraTransformMatrix);
                BABYLON.Vector3.TransformNormalToRef(this._localDirection, this._cameraTransformMatrix, this._transformedDirection);
                //Eliminate y if map panning is enabled (panningAxis == 1,0,1)
                if (!this.panningAxis.y) {
                    this._transformedDirection.y = 0;
                }

                this.inertialPanningX *= this.panningInertia;
                this.inertialPanningY *= this.panningInertia;

                if (Math.abs(this.inertialPanningX) < this.speed * BABYLON.Epsilon)
                    this.inertialPanningX = 0;
                if (Math.abs(this.inertialPanningY) < this.speed * BABYLON.Epsilon)
                    this.inertialPanningY = 0;
            }

            // Limits
            this._checkLimits();

            super._checkInputs();
        }

        protected _checkLimits() {
            // only limit beta (vertical) the same way as ArchRotateCamera when not a vertical cylinder
            if (!this._isVertical) {
                if (this.lowerBetaLimit === null || this.lowerBetaLimit === undefined) {
                    if (this.allowUpsideDown && this.beta > Math.PI) {
                        this.beta = this.beta - (2 * Math.PI);
                    }
                } else {
                    if (this.beta < this.lowerBetaLimit) {
                        this.beta = this.lowerBetaLimit;
                    }
                }
    
                if (this.upperBetaLimit === null || this.upperBetaLimit === undefined) {
                    if (this.allowUpsideDown && this.beta < -Math.PI) {
                        this.beta = this.beta + (2 * Math.PI);
                    }
                } else {
                    if (this.beta > this.upperBetaLimit) {
                        this.beta = this.upperBetaLimit;
                    }
                }
            } else this.beta = CylinderCamera.FixedVert;

            // only limit alpha (horizontal) the same way as ArchRotateCamera when a vertical cylinder
            if (this._isVertical) {
                if (this.lowerAlphaLimit && this.alpha < this.lowerAlphaLimit) {
                    this.alpha = this.lowerAlphaLimit;
                }
                if (this.upperAlphaLimit && this.alpha > this.upperAlphaLimit) {
                    this.alpha = this.upperAlphaLimit;
                }
            } else this.alpha = CylinderCamera.FixedHorz;
            
            // radius limits the same as ArchRotateCamera
            if (this.lowerRadiusLimit && this.radius < this.lowerRadiusLimit) {
                this.radius = this.lowerRadiusLimit;
            }
            if (this.upperRadiusLimit && this.radius > this.upperRadiusLimit) {
                this.radius = this.upperRadiusLimit;
            }
        }

        public rebuildAnglesAndRadius() {
            var radiusv3 = this.position.subtract(this._getTargetPosition());
            this.radius = radiusv3.length();

            // Alpha, only rebuilt when a vertical cylinder
            if (this._isVertical) {
                this.alpha = Math.acos(radiusv3.x / Math.sqrt(Math.pow(radiusv3.x, 2) + Math.pow(radiusv3.z, 2)));
    
                if (radiusv3.z < 0) {
                    this.alpha = 2 * Math.PI - this.alpha;
                }
            }

            // Beta, only rebuilt when not a vertical cylinder
            if (!this._isVertical) {
                this.beta = Math.acos(radiusv3.y / this.radius);
            }
            this._checkLimits();
        }

        public setTargetMesh(target: BABYLON.AbstractMesh, toBoundingCenter = true): void {
            this._targetMesh = target;
            var boundingCenter = target.getBoundingInfo().boundingBox.center;
            var dimensions = boundingCenter.scale(2);
            
            if (toBoundingCenter) {
                if (this._isVertical) this._traverseOffset = boundingCenter.y;
                else this._traverseOffset = boundingCenter.x;
                
            } else this._traverseOffset = 0;
            
            // need to reduce default angular sensitively for the dimension now used to traverse; was 1000
            // was used as 1000 points / radians
            // now as 5000 points / extent
            if (this._isVertical) this.angularSensibilityY = 5000 / dimensions.y;
            else this.angularSensibilityX = 5000 / dimensions.x;
                                    
            this._target = this._getTargetPosition();
            this.rebuildAnglesAndRadius();
        }
        
        public zoomOn(meshes?: BABYLON.AbstractMesh[], doNotUpdateMaxZ = false): void {
            throw "has no meaning in CylinderCamera";
        }

        public focusOn(meshesOrMinMaxVectorAndDistance, doNotUpdateMaxZ = false): void {
            throw "has no meaning in CylinderCamera";
        }

        public createRigCamera(name: string, cameraIndex: number): BABYLON.Camera {
            throw "No currently supported";
        }

        public dispose(): void {
            this.inputs.clear();
            super.dispose();
        }

        public getClassName(): string {
            return "CylinderCamera";
        }
    }
}
