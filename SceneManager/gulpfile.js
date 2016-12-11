var gulp = require("gulp");
var typescript = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var merge2 = require("merge2");
var concat = require("gulp-concat");

var tsConfig = {
    noExternalResolve: true,
    target: 'ES5',
    declarationFiles: true,
    typescript: require('typescript'),
    experimentalDecorators: true,
    isolatedModules: false
};
var tsProject = typescript.createProject(tsConfig);

gulp.task("default", function () {
    var tsResult = gulp.src("./src/**/*.ts")      
            .pipe(sourcemaps.init())
            .pipe(typescript(tsProject));

    return merge2([
        tsResult.dts
            .pipe(concat("babylon.scenemanager.d.ts"))
            .pipe(gulp.dest("./dist")),
        tsResult.js
            .pipe(sourcemaps.write("./", 
                {
                    includeContent:false, 
                    sourceRoot: (filePath) => {
                        return ''; 
                    }
                }))
            .pipe(gulp.dest("./dist"))
    ])            
});
