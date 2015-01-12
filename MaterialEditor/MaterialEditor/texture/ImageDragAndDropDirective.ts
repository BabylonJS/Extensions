module RW.TextureEditor {

    export var textureImage = ["$parse", function ($parse: ng.IParseService) {
        return {
            restrict: 'E',
            templateUrl: function (elem, attr) {
                //return 'image-dnd-' + attr.amount + '.html';
                //console.log(elem, attr);
                return 'template/image-drag-drop.html'
            },
            scope: {
                tex: '=',
                updateTexture: '&onUpdateTexture'
            },
            transclude: true,
            link: function (scope, element, attr) {
                var texture = <TextureDefinition> scope.tex;

                function render(src, canvas: HTMLCanvasElement, onSuccess) {
                    var image = new Image();
                    image.onload = function () {
                        var ctx = canvas.getContext("2d");
                        //todo use canvas.style.height and width to keep aspect ratio
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        var width = BABYLON.Tools.GetExponantOfTwo(image.width, 1024);
                        var height = BABYLON.Tools.GetExponantOfTwo(image.height, 1024);
                        var max = Math.max(width, height);
                        if (width > height) {
                            image.width *= height / image.height;
                            image.height = height;
                        } else {
                            image.height *= width / image.width;
                            image.width = width;
                        }

                        canvas.width = max;
                        canvas.height = max;
                        ctx.drawImage(image, 0, 0, max, max);
                        if (onSuccess) {
                            onSuccess();
                        }
                    };
                    image.src = src;
                }

                function loadImage(src, canvas: HTMLCanvasElement) {
                    //	Prevent any non-image file type from being read.
                    if (!src.type.match(/image.*/)) {
                        console.log("The dropped file is not an image: ", src.type);
                        return;
                    }

                    //	Create our FileReader and run the results through the render function.
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        texture.updateCanvasFromUrl(canvas, e.target.result, function () {
                            if (scope.updateTexture) {
                                scope.updateTexture({ $name: texture.name });
                            }
                        });
                    };
                    reader.readAsDataURL(src);
                }

                element.on("dragover", ".texture-canvas-drop", function (e) {
                    e.preventDefault();
                });
                element.on("dragleave", ".texture-canvas-drop", function (e) {
                    e.preventDefault();
                });
                element.on("drop", ".texture-canvas-drop", function (e) {
                    e.preventDefault();
                    loadImage(e.originalEvent.dataTransfer.files[0], <HTMLCanvasElement> $(this).find("canvas")[0]);
                });
            }
        }
    }]

} 