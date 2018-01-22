var BABYLON;
(function (BABYLON) {
    /***********************
     * PRESET OPTIMISATION
     **********************/
    // preset grade optimization
    var PresetGradeOptimization = /** @class */ (function () {
        function PresetGradeOptimization() {
        }
        // low render quality
        PresetGradeOptimization.minimum = function () {
            return {
                shadowsEnabled: false,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: false,
                textures: {
                    scale: 0.5,
                    maxSize: 256,
                    minSize: 128
                },
                materials: {
                    reflectionTextureEnabled: false,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: false,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1024,
                    maxHeight: 1024,
                    hardwareScaling: 1
                },
                devices: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: false,
                    exceptionsAllowed: []
                }
            };
        };
        // low render quality
        PresetGradeOptimization.low = function () {
            return {
                shadowsEnabled: false,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: false,
                textures: {
                    scale: 0.5,
                    maxSize: 512,
                    minSize: 128
                },
                materials: {
                    reflectionTextureEnabled: false,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                renderSize: {
                    maxWidth: 1440,
                    maxHeight: 1440,
                    hardwareScaling: 1
                },
                devices: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // standar render quality
        PresetGradeOptimization.standard = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: false,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: true,
                textures: {
                    scale: 0.5,
                    maxSize: 512,
                    minSize: 256
                },
                materials: {
                    reflectionTextureEnabled: true,
                    refractionTextureEnabled: false,
                    bumpTextureEnabled: true,
                    fresnelEnabled: false
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 256
                },
                renderSize: {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    hardwareScaling: 1
                },
                devices: {
                    smartPhoneAllowed: true,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // medium render quality
        PresetGradeOptimization.medium = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: false,
                lensFlaresEnabled: false,
                renderTargetsEnabled: true,
                textures: {
                    scale: 0.75,
                    maxSize: 1024,
                    minSize: 256
                },
                particles: {
                    ratio: 0.25,
                    maxEmitRate: 300,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 512
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 1
                },
                devices: {
                    smartPhoneAllowed: false,
                    tabletAllowed: true,
                    noteBookAllowed: true,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // high render quality
        PresetGradeOptimization.high = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: true,
                lensFlaresEnabled: true,
                renderTargetsEnabled: true,
                textures: {
                    scale: 1,
                    maxSize: 1024,
                    minSize: 512
                },
                particles: {
                    ratio: 0.5,
                    maxEmitRate: 5000,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 1024
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 1
                },
                devices: {
                    smartPhoneAllowed: false,
                    tabletAllowed: false,
                    noteBookAllowed: false,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        // best render quality
        PresetGradeOptimization.ultra = function () {
            return {
                shadowsEnabled: true,
                particlesEnabled: true,
                postProcessesEnabled: true,
                lensFlaresEnabled: true,
                renderTargetsEnabled: true,
                textures: {
                    scale: 1,
                    maxSize: 2048,
                    minSize: 512
                },
                particles: {
                    ratio: 1,
                    maxEmitRate: 10000,
                    minEmitRate: 100
                },
                materials: {
                    bumpTextureEnabled: true,
                    fresnelEnabled: true
                },
                shadows: {
                    type: 'usePoissonSampling',
                    size: 2048
                },
                renderSize: {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    hardwareScaling: 0.5
                },
                devices: {
                    smartPhoneAllowed: false,
                    tabletAllowed: false,
                    noteBookAllowed: false,
                    computerAllowed: true,
                    exceptionsAllowed: []
                }
            };
        };
        return PresetGradeOptimization;
    }());
    BABYLON.PresetGradeOptimization = PresetGradeOptimization;
})(BABYLON || (BABYLON = {}));
