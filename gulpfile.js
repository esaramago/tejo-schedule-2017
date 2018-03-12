var srcPath = "src/";
var distPath = "dist/";

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');

gulp.task('styles', function () {

    return gulp.src(srcPath + 'styles/main.scss')

        .pipe(plumber())

        .pipe(sourcemaps.init())

        .pipe(sassGlob())
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))

        .pipe(sourcemaps.write())

        .pipe(gulp.dest(distPath))

});


gulp.task('default', function () {
    gulp.watch(srcPath + '**/*.scss', ['styles']);
});