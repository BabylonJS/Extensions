module RW.TextureEditor {

    export interface ObjectSubMeshesScope extends ng.IScope {
        object: BABYLON.AbstractMesh;
        totalNumberOfIndices: number;
        indicesLeft: number;
        close: () => void;
        updateObject: (closeObject: boolean) => void;
        addSubMesh: () => void;
        removeSubMesh: (index: number) => void;
        division: number;
        divideObject: () => void;
    }

    export class ObjectSubMeshesController {

        public static $inject = [
            '$scope',
            '$timeout',
            '$modalInstance',
            'object'
        ];

        constructor(private $scope: ObjectSubMeshesScope, private $timeout:ng.ITimeoutService, private $modalInstance: any, private object: BABYLON.Mesh) {

            $scope.object = object;
            $scope.totalNumberOfIndices = object.getTotalIndices();

            $scope.division = 2;

            $scope.close = () => {
                $scope.updateObject(true);
                $modalInstance.close();
            }

            $scope.updateObject = (closeObject:boolean = false) => {
                var usedVertics: number = 0;
                var idx = 0;
                object.subMeshes.forEach((subMesh) => {
                    //rounding to threes.
                    var substract = subMesh.indexCount % 3;
                    subMesh.indexCount -= subMesh.indexCount % 3;
                    //validation of using too many vertices
                    if (usedVertics + subMesh.indexCount > $scope.totalNumberOfIndices) {
                        subMesh.indexCount = $scope.totalNumberOfIndices - usedVertics;
                    }
                    //substract = subMesh.indexStart % 3;
                    //subMesh.indexStart -= substract;
                    subMesh.indexStart = usedVertics;
                    //validation - too many indices from startIndex
                    if (subMesh.indexStart + subMesh.indexCount > $scope.totalNumberOfIndices) {
                        subMesh.indexCount = $scope.totalNumberOfIndices - subMesh.indexStart;
                    }

                    //making sure material index is correct.
                    subMesh.materialIndex = idx;

                    usedVertics += subMesh.indexCount;
                    idx++;
                    //make sure all indices are used.
                    if (closeObject && idx == object.subMeshes.length && usedVertics < $scope.totalNumberOfIndices) {
                        subMesh.indexCount += $scope.totalNumberOfIndices - usedVertics;
                    }
                });
                $scope.indicesLeft = $scope.totalNumberOfIndices - usedVertics;
            }

            $scope.addSubMesh = () => {
                var count = this.$scope.indicesLeft < 0 ? 0 : this.$scope.indicesLeft;
                new BABYLON.SubMesh(object.subMeshes.length, 0, object.getTotalVertices(),
                    this.$scope.totalNumberOfIndices - this.$scope.indicesLeft, count, object);
                $scope.updateObject(false);
            }

            $scope.removeSubMesh = (index:number) => {
                object.subMeshes.splice(index, 1);
                $scope.updateObject(false);
            }

            $scope.divideObject = () => {
                if ($scope.division * 3 > $scope.totalNumberOfIndices) {
                    $scope.division = ~~($scope.totalNumberOfIndices / 3);
                }
                object.subdivide($scope.division);
                $scope.updateObject(false);
            }

            $scope.updateObject(false);

        }

    }
}  