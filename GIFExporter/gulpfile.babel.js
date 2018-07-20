'use strict';

const gulp = require("gulp");
const ts = require("gulp-typescript");
const uglify = require('gulp-uglify')

const tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', () => {

    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('worker', () => {

});


gulp.task('default', ['html', 'ts', 'worker', 'js']);