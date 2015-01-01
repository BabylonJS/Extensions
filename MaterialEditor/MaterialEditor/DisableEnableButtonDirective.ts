module RW.TextureEditor {

    export var disableEnableButton = [function () {
        return {
            require: 'ngModel',
            priority: 1,
            link: function (scope, element, attrs, ngModel: ng.INgModelController) {
                var render = ngModel.$render;
                var addedText = attrs['extraText'] ? " " + attrs['extraText'] + " " : "";
                function resetButton() {
                    if (ngModel.$modelValue===true || ngModel.$modelValue ===1) {
                        element.html(addedText+"Enabled");
                        element.addClass('btn-success');
                        element.removeClass('btn-danger');
                    } else {
                        element.html(addedText +"Disabled");
                        element.addClass('btn-danger');
                        element.removeClass('btn-success');
                    }
                    render();
                }

                element.bind('mouseenter', function () {
                    if (ngModel.$modelValue === true || ngModel.$modelValue === 1) {
                        element.html("Disable" + addedText);
                        element.addClass('btn-danger');
                        element.removeClass('btn-success');
                    } else {
                        element.html("Enable" + addedText);
                        element.addClass('btn-success');
                        element.removeClass('btn-danger');
                    }
                });
                element.bind('mouseleave', resetButton);

                ngModel.$render = resetButton;

                resetButton();
            }
        }
    }]
}
