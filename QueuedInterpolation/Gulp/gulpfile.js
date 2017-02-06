var gulp = require("gulp");
var uglify = require("gulp-uglify");
var typescript = require("gulp-typescript");
var addModuleExports = require("./gulp-addModuleExports");
var merge2 = require("merge2");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var cleants = require('gulp-clean-ts-extends');
var runSequence = require('run-sequence');
var replace = require("gulp-replace");
var expect = require('gulp-expect-file');
var optimisejs = require('gulp-optimize-js');

var zip = require('gulp-zip');

var config = require("./config.json");

var extendsSearchRegex = /var\s__extends[\s\S]+?\};/g;
var decorateSearchRegex = /var\s__decorate[\s\S]+?\};/g;

var tsConfig = {
	    noResolve: true,
	    target: 'ES5',
	    declarationFiles: true,
	    typescript: require('typescript'),
	    experimentalDecorators: true,
	    isolatedModules: false
	};
var tsProject = typescript.createProject(tsConfig);

/*
* Compiles all typescript files and creating a js and a declaration file.
*/
gulp.task('typescript-compile', function () {
    var tsResult = gulp.src(config.project.typescript)
        .pipe(tsProject());

    return merge2([
        tsResult.dts
            .pipe(concat(config.build.declarationFilename))
            .pipe(gulp.dest(config.build.outputDirectory))
            .pipe(gulp.dest(config.build.dialogDirectory)),
        tsResult.js
            .pipe(gulp.dest(config.build.srcOutputDirectory))
    ])
});

/**
 * Build tasks to concat minify uglify optimize the js
 */
gulp.task("merge-minify",function () {
    return merge2(
        gulp.src(config.project.files).        
            pipe(expect.real({ errorOnFailure: true }, config.project.files))
        )
        .pipe(concat(config.build.filename))
        .pipe(cleants())
        .pipe(replace(extendsSearchRegex, ""))
        .pipe(replace(decorateSearchRegex, ""))
        .pipe(addModuleExports("QI"))
        .pipe(gulp.dest(config.build.outputDirectory))
        
        .pipe(rename(config.build.minFilename))
        .pipe(uglify())
        .pipe(optimisejs())
        .pipe(gulp.dest(config.build.outputDirectory))
        .pipe(gulp.dest(config.build.blogDirectory));
});

/**
 * Build the releasable files.
 */
gulp.task("build", function (cb) {
    runSequence("typescript-compile", "merge-minify", cb);
});

gulp.task("zip-tob" , function() {
    return gulp.src('../Blender/src/**')
    .pipe(zip('towerOfBabel.5.1.zip'))
    .pipe(gulp.dest('../Blender'));
});
