module BABYLON {
    export class Utilities {
        /** TODO: angle */
		public static Angle(from:BABYLON.Vector3, to:BABYLON.Vector3):number {
			return Math.acos(BABYLON.Scalar.Clamp(BABYLON.Vector3.Dot(from.normalize(), to.normalize()), -1, 1)) * 57.29578;
        }
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        public static Euler(eulerX:number, eulerY:number, eulerZ:number) : BABYLON.Quaternion {
            return BABYLON.Quaternion.RotationYawPitchRoll(eulerY, eulerX, eulerZ);
        }
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        public static EulerToRef(eulerX:number, eulerY:number, eulerZ:number, result:BABYLON.Quaternion):void  {
            BABYLON.Quaternion.RotationYawPitchRollToRef(eulerY, eulerX, eulerZ, result);
        }
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        public static Matrix(eulerX:number, eulerY:number, eulerZ:number) : BABYLON.Matrix {
            return BABYLON.Matrix.RotationYawPitchRoll(eulerY, eulerX, eulerZ);
        }
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        public static MatrixToRef(eulerX:number, eulerY:number, eulerZ:number, result:BABYLON.Matrix): void {
            BABYLON.Matrix.RotationYawPitchRollToRef(eulerY, eulerX, eulerZ, result);
        }
        /** TODO: clamp angle */
        public static ClampAngle(angle:number, min:number, max:number):number {
            var result:number = angle;
            do {
                if (result < -360) {
                    result += 360;
                }
                if (result > 360) {
                    result -= 360;
                }
            } while (result < -360 || result > 360)
            return BABYLON.Scalar.Clamp(result, min, max);
        }
        /** Multplies a quaternion by a vector (rotates vector) */
        public static RotateVector(vec: BABYLON.Vector3, quat: BABYLON.Quaternion): BABYLON.Vector3 {
            var tx:number = 2 * (quat.y * vec.z - quat.z * vec.y);
            var ty:number = 2 * (quat.z * vec.x - quat.x * vec.z);
            var tz:number = 2 * (quat.x * vec.y - quat.y * vec.x);
            return new BABYLON.Vector3(vec.x + quat.w * tx + (quat.y * tz - quat.z * ty), vec.y + quat.w * ty + (quat.z * tx - quat.x * tz), vec.z + quat.w * tz + (quat.x * ty - quat.y * tx));
        }
        /** Multplies a quaternion by a vector (rotates vector) */
        public static RotateVectorToRef(vec: BABYLON.Vector3, quat: BABYLON.Quaternion, result: BABYLON.Vector3): void {
            var tx:number = 2 * (quat.y * vec.z - quat.z * vec.y);
            var ty:number = 2 * (quat.z * vec.x - quat.x * vec.z);
            var tz:number = 2 * (quat.x * vec.y - quat.y * vec.x);
            result.x = vec.x + quat.w * tx + (quat.y * tz - quat.z * ty);
            result.y = vec.y + quat.w * ty + (quat.z * tx - quat.x * tz);
            result.z = vec.z + quat.w * tz + (quat.x * ty - quat.y * tx);
        }
        /** TODO: move towards vector */
        public static MoveTowardsVector(current:BABYLON.Vector3, target:BABYLON.Vector3, maxDistanceDelta:number):BABYLON.Vector3 {
			var a:BABYLON.Vector3 = target.subtract(current);
			var magnitude:number = a.length();
			var result:BABYLON.Vector3;
			if (magnitude <= maxDistanceDelta || magnitude === 0) {
				result = target;
			} else {
				//result = current + a / magnitude * maxDistanceDelta;
			}
			return result;
        }        
        /** TODO: move torward angle */
        public static MoveTowardsAngle(current:number, target:number, maxDelta:number):number {
			var num:number = BABYLON.Scalar.DeltaAngle(current, target);
			var result:number;
			if (-maxDelta < num && num < maxDelta) {
				result = target;
			} else {
				target = current + num;
				result = BABYLON.Scalar.MoveTowards(current, target, maxDelta);
			}
			return result;
        }       
        
        // *********************************** //
        // *  Scene Transform Tools Support  * //
        // *********************************** //
        
        /** Transforms position from local space to world space. */
        public  static TransformPosition(owner: BABYLON.AbstractMesh | BABYLON.Camera, position:BABYLON.Vector3):BABYLON.Vector3 {
            return BABYLON.Vector3.TransformCoordinates(position, owner.getWorldMatrix());
        }
        /** Transforms position from local space to world space. */
        public static TransformPositionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, position:BABYLON.Vector3, result:BABYLON.Vector3):void {
            return BABYLON.Vector3.TransformCoordinatesToRef(position, owner.getWorldMatrix(), result);
        }
        /** Transforms direction from local space to world space. */
        public static TransformDirection(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction:BABYLON.Vector3):BABYLON.Vector3 {
            return BABYLON.Vector3.TransformNormal(direction, owner.getWorldMatrix());
        }
        /** Transforms direction from local space to world space. */
        public static TransformDirectionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction:BABYLON.Vector3, result:BABYLON.Vector3):void {
            return BABYLON.Vector3.TransformNormalToRef(direction, owner.getWorldMatrix(), result);
        }

        // ************************************ //
        // *  Scene Direction Helper Support  * //
        // ************************************ //

        /** Gets any direction vector of the owner in world space. */
        public static GetDirectionVector(owner: BABYLON.AbstractMesh | BABYLON.Camera, vector:BABYLON.Vector3):BABYLON.Vector3 {
            return owner.getDirection(vector);
        }
        /** Gets any direction vector of the owner in world space. */
        public static GetDirectionVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, vector:BABYLON.Vector3, result:BABYLON.Vector3):void {
            owner.getDirectionToRef(vector, result);
        }
        /** Gets the blue axis of the owner in world space. */
        public static GetForwardVector(owner: BABYLON.AbstractMesh | BABYLON.Camera):BABYLON.Vector3 {
            return owner.getDirection(BABYLON.Vector3.Forward());
        }
        /** Gets the blue axis of the owner in world space. */
        public static GetForwardVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result:BABYLON.Vector3):void {
            owner.getDirectionToRef(BABYLON.Vector3.Forward(), result);
        }
        /** Gets the red axis of the owner in world space. */
        public static GetRightVector(owner: BABYLON.AbstractMesh | BABYLON.Camera):BABYLON.Vector3 {
            return owner.getDirection(BABYLON.Vector3.Right());
        }
        /** Gets the red axis of the owner in world space. */
        public static GetRightVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result:BABYLON.Vector3):void {
            owner.getDirectionToRef(BABYLON.Vector3.Right(), result);
        }
        /** Gets the green axis of the owner in world space. */
        public static GetUpVector(owner: BABYLON.AbstractMesh | BABYLON.Camera):BABYLON.Vector3 {
            return owner.getDirection(BABYLON.Vector3.Up());
        }
        /** Gets the green axis of the owner in world space. */
        public static GetUpVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result:BABYLON.Vector3):void {
            owner.getDirectionToRef(BABYLON.Vector3.Up(), result);
        }

        // ************************************* //
        // *  Public Quaternion Tools Support  * //
        // ************************************* //

        /** Computes the Quaternion forward vector */
        public static GetQuaternionForwardVector(quat:Quaternion):BABYLON.Vector3 {
            return new BABYLON.Vector3( 2 * (quat.x * quat.z + quat.w * quat.y), 2 * (quat.y * quat.x - quat.w * quat.x), 1 - 2 * (quat.x * quat.x + quat.y * quat.y));
        }
        /** Computes the Quaternion forward vector */
        public static GetQuaternionForwardVectorToRef(quat:Quaternion, result:BABYLON.Vector3):void {
            if (result != null) {
                result.x = 2 * (quat.x * quat.z + quat.w * quat.y);
                result.y = 2 * (quat.y * quat.x - quat.w * quat.x);
                result.z = 1 - 2 * (quat.x * quat.x + quat.y * quat.y);
            }
        }
        /** Computes the Quaternion right vector */
        public static GetQuaternionRightVector(quat:Quaternion):BABYLON.Vector3  {
            return new BABYLON.Vector3( 1 - 2 * (quat.y * quat.y + quat.z * quat.z), 2 * (quat.x * quat.y + quat.w * quat.z), 2 * (quat.x * quat.z - quat.w * quat.y));
        }
        /** Computes the Quaternion right vector */
        public static GetQuaternionRightVectorToRef(quat:Quaternion, result:BABYLON.Vector3):void  {
            if (result != null) {
                result.x = 1 - 2 * (quat.y * quat.y + quat.z * quat.z);
                result.y = 2 * (quat.x * quat.y + quat.w * quat.z);
                result.z = 2 * (quat.x * quat.z - quat.w * quat.y);
            }
        }
        /** Computes the Quaternion up vector */
        public static GetQuaternionUpVector(quat:Quaternion): BABYLON.Vector3 {
            return new BABYLON.Vector3( 2 * (quat.x * quat.y - quat.w * quat.z), 1 - 2 * (quat.x * quat.x + quat.z * quat.z), 2 * (quat.y * quat.z + quat.w * quat.x));
        }
        /** Computes the Quaternion up vector */
        public static GetQuaternionUpVectorToRef(quat:Quaternion, result:BABYLON.Vector3): void {
            if (result != null) {
                result.x = 2 * (quat.x * quat.y - quat.w * quat.z);
                result.y = 1 - 2 * (quat.x * quat.x + quat.z * quat.z);
                result.z = 2 * (quat.y * quat.z + quat.w * quat.x);
            }
        }
        
        // ********************************** //
        // * Public Blending Speed Support  * //
        // ********************************** //

        public static ComputeBlendingSpeed(rate:number, duration:number):number {
            return 1 / (rate * duration);
        }
        
        // *********************************** //
        // *   Public Parse Tools Support    * //
        // *********************************** //

        public static ParseColor3(source:any, defaultValue:BABYLON.Color3 = null):BABYLON.Color3 {
            var result:BABYLON.Color3 = null
            if (source != null && source.r != null && source.g != null&& source.b != null) {
                result = new BABYLON.Color3(source.r, source.g, source.b);
            } else {
                result = defaultValue;
            }
            return result;
        }

        public static ParseColor4(source:any, defaultValue:BABYLON.Color4 = null):BABYLON.Color4 {
            var result:BABYLON.Color4 = null
            if (source != null && source.r != null && source.g != null && source.b != null && source.a != null) {
                result = new BABYLON.Color4(source.r, source.g, source.b, source.a);
            } else {
                result = defaultValue;
            }
            return result;
        }
        
        public static ParseVector2(source:any, defaultValue:BABYLON.Vector2 = null):BABYLON.Vector2 {
            var result:BABYLON.Vector2 = null
            if (source != null && source.x != null && source.y != null) {
                result = new BABYLON.Vector2(source.x, source.y);
            } else {
                result = defaultValue;
            }
            return result;
        }

        public static ParseVector3(source:any, defaultValue:BABYLON.Vector3 = null):BABYLON.Vector3 {
            var result:BABYLON.Vector3 = null
            if (source != null && source.x != null && source.y != null && source.z != null) {
                result = new BABYLON.Vector3(source.x, source.y, source.z);
            } else  {
                result = defaultValue;
            }
            return result;
        }

        public static ParseVector4(source:any, defaultValue:BABYLON.Vector4 = null):BABYLON.Vector4 {
            var result:BABYLON.Vector4 = null
            if (source != null && source.x != null && source.y != null && source.z != null && source.w != null) {
                result = new BABYLON.Vector4(source.x, source.y, source.z, source.w);
            } else {
                result = defaultValue;
            }
            return result;
        }

        // ************************************ //
        // * Public String Tools Support * //
        // ************************************ //

        public static StartsWith(source:string, word:string):boolean {
            return source.lastIndexOf(word, 0) === 0;
        }

        public static EndsWith(source:string, word:string):boolean {
            return source.indexOf(word, source.length - word.length) !== -1;
        }
        
        public static ReplaceAll(source:string, word:string, replace:string):string {
            return source.replace(new RegExp(word, 'g'), replace);            
        }
        
        // *********************************** //
        // *   Public Binary Tools Support   * //
        // *********************************** //
        
        public static EncodeBinay(obj:any):Uint8Array {
            var result:Uint8Array = null;
            var wnd:any = <any>window;
            if (wnd.msgpack) {
                result = wnd.msgpack.encode(obj);
            } else {
                BABYLON.Tools.Warn("Failed to load msgpack library.");
            }
            return result;
        }

        public static DecodeBinary<T>(data:Uint8Array):T {
            var result:any = null;
            var wnd:any = <any>window;
            if (wnd.msgpack) {
                result = wnd.msgpack.decode(data);
            } else {
                BABYLON.Tools.Warn("Failed to load msgpack library.");
            }
            return (result != null) ? result as T : null;
        }

        // ************************************ //
        // * Public Compression Tools Support * //
        // ************************************ //

        public static CompressToString(data:Uint8Array):string { 
            var result:string = null;
            var wnd:any = <any>window;
            if (wnd.pako) {
                result = wnd.pako.deflate(data, { to: 'string' });
            } else {
                BABYLON.Tools.Warn("Failed to load pako library.");
            }
            return result;
        }

        public static CompressToArray(data:Uint8Array):Uint8Array { 
            var result:Uint8Array = null;
            var wnd:any = <any>window;
            if (wnd.pako) {
                result = wnd.pako.deflate(data);
            } else {
                BABYLON.Tools.Warn("Failed to load pako library.");
            }
            return result;
        }
        
        public static DecompressToString(data:Uint8Array):string { 
            var result:string = null;
            var wnd:any = <any>window;
            if (wnd.pako) {
                result = wnd.pako.inflate(data, { to: 'string' });
            } else {
                BABYLON.Tools.Warn("Failed to load pako library.");
            }
            return result;
        }
        public static DecompressToArray(data:Uint8Array):Uint8Array { 
            var result:Uint8Array = null;
            var wnd:any = <any>window;
            if (wnd.pako) {
                result = wnd.pako.inflate(data);
            } else {
                BABYLON.Tools.Warn("Failed to load pako library.");
            }
            return result;
        }
    }
}