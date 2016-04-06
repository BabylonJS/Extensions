var gulp = require('gulp');
var uglify = require("gulp-uglify");
var ts = require('gulp-typescript');
var merge = require('merge2');
var sass = require('gulp-sass');
var rename = require("gulp-rename");

gulp.task('scripts', function() {
  var tsResult = gulp.src('*.ts')
    .pipe(ts({
        declarationFiles: true,
        target: 'es5',
        out: 'ManipulationHelpers.js'
      }));
 
  return merge([
    tsResult.dts.pipe(gulp.dest('../')),
    tsResult.js.pipe(rename('ManipulationHelpers.min.js')).pipe(uglify()).pipe(gulp.dest('../')),
    tsResult.js.pipe(gulp.dest('../'))
    ]);
});
 
gulp.task('watch', function () {
  gulp.watch('*.ts', ['scripts']);
});