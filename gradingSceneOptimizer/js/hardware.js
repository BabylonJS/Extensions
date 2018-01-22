var BABYLON;
(function (BABYLON) {
    /*************************
     * HARDWARE DETECTION
     ************************/
    // hardware :
    var Hardware = /** @class */ (function () {
        function Hardware() {
        }
        // is there a dedicated GPU
        Hardware.isDedicatedGPU = function (engine) {
            var GPUs = [
                'amd',
                'nvidia',
                'radeon',
                'geforce'
            ], vendor = engine.getGlInfo().renderer;
            return this._refDetection(vendor, GPUs);
        };
        // device exception detection
        Hardware.isDevices = function (devices) {
            var userAgent = navigator.userAgent;
            return this._refDetection(userAgent, devices);
        };
        // detectMobile
        Hardware.isMobile = function () {
            var userAgent = navigator.userAgent, mobiles = [
                'Android',
                'webOS',
                'iPhone',
                'iPad',
                'iPod',
                'BlackBerry',
                'Windows Phone',
                'Phone'
            ];
            return this._refDetection(userAgent, mobiles);
        };
        // device detection
        Hardware.devicesDetection = function () {
            // get screen size
            var screenWidth = screen.height, screenHeight = screen.width, size = Math.max(screenWidth, screenHeight), userAgent = navigator.userAgent, isMobile = this.isMobile(), regex;
            // SMARTPHONE
            if (isMobile && size < 768) {
                return 'smartPhone';
            }
            // TABLET
            if (isMobile) {
                return 'tablet';
            }
            // NOTEBOOK
            if (size <= 1280) {
                return 'noteBook';
            }
            // computer
            return 'computer';
        };
        // TODO : FUTURE FEATURE : get a benchMark reference for GPU and CPU
        Hardware.getBenchmarkScore = function (engine) {
            return;
        };
        // regex expression detection
        Hardware._refDetection = function (pattern, references) {
            var L = references.length, refI, regex;
            for (var i = 0; i < L; i++) {
                refI = references[i];
                regex = new RegExp(refI, 'i');
                if (pattern.match(regex)) {
                    return true;
                }
                ;
            }
            return false;
        };
        return Hardware;
    }());
    BABYLON.Hardware = Hardware;
})(BABYLON || (BABYLON = {}));
