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
            .pipe(concat(config.build.QI_declarationFilename))
            .pipe(gulp.dest(config.build.outputDirectory))
            .pipe(gulp.dest(config.build.dialogDirectory)),
        tsResult.js
            .pipe(gulp.dest(config.build.srcOutputDirectory))
    ])
});

/**
 * Build tasks to concat minify uglify optimize the QI js
 */
gulp.task("QI-merge-minify",function () {
    return merge2(
        gulp.src(config.project.QI_files).        
            pipe(expect.real({ errorOnFailure: true }, config.project.QI_files))
        )
        .pipe(concat(config.build.QI_filename))
        .pipe(cleants())
        .pipe(replace(extendsSearchRegex, ""))
        .pipe(replace(decorateSearchRegex, ""))
        .pipe(addModuleExports("QI"))
        .pipe(gulp.dest(config.build.blogDirectory))
        .pipe(gulp.dest(config.build.outputDirectory))
        
        .pipe(rename(config.build.QI_minFilename))
        .pipe(uglify())
        .pipe(optimisejs())
        .pipe(gulp.dest(config.build.outputDirectory))
        .pipe(gulp.dest(config.build.blogDirectory));
});
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
/**
 * Build tasks to concat minify uglify optimize the TOB_runtime js
 */
gulp.task("TOB-merge-minify",function () {
    return merge2(
        gulp.src(config.project.TOB_runtime_files).        
            pipe(expect.real({ errorOnFailure: true }, config.project.TOB_runtime_files))
        )
        .pipe(concat(config.build.TOB_filename))
        .pipe(cleants())
        .pipe(replace(extendsSearchRegex, ""))
        .pipe(replace(decorateSearchRegex, ""))
        .pipe(addModuleExports("TOWER_OF_BABEL"))
        .pipe(gulp.dest(config.build.blogDirectory))
        .pipe(gulp.dest(config.build.outputDirectory))
        
        .pipe(rename(config.build.TOB_minFilename))
        .pipe(uglify())
        .pipe(optimisejs())
        .pipe(gulp.dest(config.build.outputDirectory))
        .pipe(gulp.dest(config.build.blogDirectory));
});

/**
 * Build the releasable files.
 */
gulp.task("build", function (cb) {
    runSequence("typescript-compile", "QI-merge-minify", "TOB-merge-minify", cb);
});

gulp.task("zip-tob" , function() {
    return gulp.src('../Blender/src/**')
    .pipe(zip('towerOfBabel.5.3.zip'))
    .pipe(gulp.dest('../Blender'));
});
