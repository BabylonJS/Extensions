var gulp = require("gulp");
var typescript = require("gulp-typescript");
var merge2 = require("merge2");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var cleants = require('gulp-clean-ts-extends');
var replace = require("gulp-replace");
var webserver = require('gulp-webserver');
var uglify = require("gulp-uglify");
var uncommentShader = require("./gulp-removeShaderComments");
var srcToVariable = require("gulp-content-to-variable");

var config = require("./config.json");
var extendsSearchRegex = /var\s__extends[\s\S]+?\};/g;
var shaderStream = '';

gulp.task('default', ['build']);

/**
 * function to convert the shaders' filenames to variable names.
 */
function shadersName(filename) {
    return filename.replace('.fragment', 'Pixel')
        .replace('.vertex', 'Vertex')
        .replace('.fx', 'Shader');
}

/**
 * Builds the shader file.
 */
gulp.task('shaders', function (cb) {
    shaderStream = gulp.src(config.shaderFiles).
            pipe(uncommentShader()).
            pipe(srcToVariable({
                variableName: config.shaderVariableName, 
                asMap: true, 
                namingCallback: shadersName
            }));
    cb();
});

/**
 * Compiles all typescript files.
 */
gulp.task('build', ['shaders'], function (cb) {
    var compilOutput = gulp.src(config.sourceFiles)
                    .pipe(typescript({
                            noExternalResolve: false,
                            target: 'ES5',
                            declarationFiles: true,
                            typescript: require('typescript'),
                            experimentalDecorators: true
                        }));
                        
    var js = compilOutput.js;
    return merge2(js, 
            shaderStream,
            gulp.src(config.initScript))
        .pipe(cleants())
        .pipe(replace(extendsSearchRegex, ""))
        .pipe(concat(config.distFile))
        .pipe(gulp.dest(config.distDirectory))
        .pipe(rename({extname: ".min.js"}))
        .pipe(uglify())
        .pipe(gulp.dest(config.distDirectory));
});

/**
 * Web server task to serve a local test page
 */
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      open: 'http://localhost:31337/index.html',
      port: 31337,
      fallback: 'index.html'
    }));
});

