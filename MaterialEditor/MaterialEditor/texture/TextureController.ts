module RW.TextureEditor {
    
    export class TextureController {

        public static $inject = [
            '$scope',
            'canvasService',
            'materialService'
        ];

        public textures;

        constructor(
            private $scope: ng.IScope,
            private canvasService: CanvasService,
            private materialService:MaterialService
            ) {
        }
    }
}