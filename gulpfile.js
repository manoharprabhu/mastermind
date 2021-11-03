var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var uglify = require('gulp-uglify');

gulp.task("default", function () {
    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(gulp.dest("build"));
});