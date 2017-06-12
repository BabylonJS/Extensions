var gulp = require("gulp");
var uglify = require("gulp-uglify");
var typescript = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var srcToVariable = require("gulp-content-to-variable");
var appendSrcToVariable = require("./gulp-appendSrcToVariable");
var merge2 = require("merge2");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var cleants = require('gulp-clean-ts-extends');
var changedInPlace = require('gulp-changed-in-place');
var runSequence = require('run-sequence');
var replace = require("gulp-replace");
var uncommentShader = require("./gulp-removeShaderComments");
var expect = require('gulp-expect-file');
var optimisejs = require('gulp-optimize-js');
var webserver = require('gulp-webserver');
var path = require('path');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

var zip = require('gulp-zip');

var config = require("./config.json");

var del = require('del');

var debug = require('gulp-debug');
var includeShadersStream;
var shadersStream;
var workersStream;

var extendsSearchRegex = /var\s__extends[\s\S]+?\}\)\(\);/g;
var decorateSearchRegex = /var\s__decorate[\s\S]+?\};/g;
var referenceSearchRegex = /\/\/\/ <reference.*/g;

/**
 * TS configurations shared in the gulp file.
 */
var tsConfig = {
    noResolve: true,
    target: 'ES5',
    declarationFiles: true,
    typescript: require('typescript'),
    experimentalDecorators: true,
    isolatedModules: false
};
var tsProject = typescript.createProject(tsConfig);

var externalTsConfig = {
    noResolve: false,
    target: 'ES5',
    declarationFiles: true,
    typescript: require('typescript'),
    experimentalDecorators: true,
    isolatedModules: false
};

function processDependency(kind, dependency, filesToLoad) {
    if (dependency.dependUpon) {
        for (var i = 0; i < dependency.dependUpon.length; i++) {
            var dependencyName = dependency.dependUpon[i];
            var parent = config.workloads[dependencyName];
            processDependency(kind, parent, filesToLoad);
        }
    }

    var content = dependency[kind];
    if (!content) {
        return;
    }

    for (var i = 0; i < content.length; i++) {
        var file = content[i];

        if (filesToLoad.indexOf(file) === -1) {
            filesToLoad.push(file);
        }
    }
}

function determineFilesToProcess(kind) {
    var currentConfig = config.build.currentConfig;
    var buildConfiguration = config.buildConfigurations[currentConfig];
    var filesToLoad = [];

    for (var index = 0; index < buildConfiguration.length; index++) {
        var dependencyName = buildConfiguration[index];
        var dependency = config.workloads[dependencyName];
        processDependency(kind, dependency, filesToLoad);
    }

    if (kind === "shaderIncludes") {
        for (var index = 0; index < filesToLoad.length; index++) {
            filesToLoad[index] = "../../src/Shaders/ShadersInclude/" + filesToLoad[index] + ".fx";
        }
    } else if (kind === "shaders") {
        for (var index = 0; index < filesToLoad.length; index++) {
            var name = filesToLoad[index];
            filesToLoad[index] = "../../src/Shaders/" + filesToLoad[index] + ".fx";
        }
    }

    return filesToLoad;
}

/*
 * Shader Management.
 */
function shadersName(filename) {
    return path.basename(filename)
        .replace('.fragment', 'Pixel')
        .replace('.vertex', 'Vertex')
        .replace('.fx', 'Shader');
}

function includeShadersName(filename) {
    return path.basename(filename).replace('.fx', '');
}


/**
 * Helper methods to build external library (mat, post processes, ...).
 */
var buildExternalLibraries = function (settings) {
    var tasks = settings.libraries.map(function (library) {
        return buildExternalLibrary(library, settings, false);
    });

    return merge2(tasks);
}

var buildExternalLibrary = function (library, settings, watch) {
    var tsProcess = gulp.src(library.files, { base: settings.build.srcOutputDirectory })
        .pipe(sourcemaps.init())
        .pipe(typescript(externalTsConfig));

    var includeShader = gulp.src(library.shadersIncludeFiles || [], { base: settings.build.srcOutputDirectory })
        .pipe(uncommentShader())
        .pipe(appendSrcToVariable("BABYLON.Effect.IncludesShadersStore", includeShadersName, library.output + '.include.fx'))
        .pipe(gulp.dest(settings.build.srcOutputDirectory));

    var shader = gulp.src(library.shaderFiles || [], { base: settings.build.srcOutputDirectory })
        .pipe(uncommentShader())
        .pipe(appendSrcToVariable("BABYLON.Effect.ShadersStore", shadersName, library.output + '.fx'))
        .pipe(gulp.dest(settings.build.srcOutputDirectory));

    var dev = tsProcess.js.pipe(sourcemaps.write("./", {
        includeContent: false,
        sourceRoot: (filePath) => {
            return '';
        }
    }))
        .pipe(gulp.dest(settings.build.srcOutputDirectory));

    var outputDirectory = config.build.outputDirectory + settings.build.distOutputDirectory;
    var css = gulp.src(library.sassFiles || [])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(library.output.replace(".js", ".css")))
        .pipe(gulp.dest(outputDirectory));

    if (watch) {
        return merge2([shader, includeShader, dev, css]);
    }
    else {
        var code = merge2([tsProcess.js, shader, includeShader])
            .pipe(concat(library.output))
            .pipe(gulp.dest(outputDirectory))
            .pipe(cleants())
            .pipe(replace(extendsSearchRegex, ""))
            .pipe(replace(decorateSearchRegex, ""))
            .pipe(rename({ extname: ".min.js" }))
            .pipe(uglify())
            .pipe(optimisejs())
            .pipe(gulp.dest(outputDirectory));

        var dts = tsProcess.dts
            .pipe(concat(library.output))
            .pipe(replace(referenceSearchRegex, ""))
            .pipe(rename({ extname: ".d.ts" }))
            .pipe(gulp.dest(outputDirectory));

        var waitAll = merge2([dev, code, css, dts]);

        if (library.webpack) {
            return waitAll.on('end', function () {
                webpack(require(library.webpack))
                    .pipe(rename(library.output.replace(".js", ".bundle.js")))
                    .pipe(gulp.dest(outputDirectory))
            });
        }
        else {
            return waitAll;
        }
    }
}

/**
 * Dynamic module creation.
 */
config.modules.map(function (module) {
    gulp.task(module, function () {
        return buildExternalLibraries(config[module]);
    });
});

/**
 * Watch ts files and fire repective tasks.
 */
gulp.task('watch', [], function () {
    var tasks = [gulp.watch(config.typescript)];

    config.modules.map(function (module) {
        config[module].libraries.map(function (library) {
            tasks.push(gulp.watch(library.files, function () {
                console.log(library.output);
                return buildExternalLibrary(library, config[module], true)
                    .pipe(debug());
            }));
            tasks.push(gulp.watch(library.shaderFiles, function () {
                console.log(library.output);
                return buildExternalLibrary(library, config[module], true)
                    .pipe(debug())
            }));
            tasks.push(gulp.watch(library.sassFiles, function () {
                console.log(library.output);
                return buildExternalLibrary(library, config[module], true)
                    .pipe(debug())
            }));
        });
    });

    return tasks;
});

/**
 * Embedded webserver for test convenience.
 */
gulp.task('webserver', function () {
    gulp.src('.').pipe(webserver({
        port: 1338,
        livereload: false
        }));
});

/**
 * Combine Webserver and Watch as long as vscode does not handle multi tasks.
 */
gulp.task('run', ['watch', 'webserver'], function () {
});
