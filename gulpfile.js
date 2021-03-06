const paths = {
    entry: "./src",
    output: "./app/dist"
}

const gulp = require('gulp');
const plumber = require('gulp-plumber');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('scripts', () => {
    gulp.src(paths.entry + '/js/app.js')
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest(paths.output));
});



const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const uglifycss = require('gulp-uglifycss');
//const injectCSS = require('gulp-inject-css');
const watch = require('gulp-watch');

gulp.task('styles', function () {

    return gulp.src(paths.entry + '/scss/main.scss')

        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(uglifycss())

        .pipe(gulp.dest(paths.output))

});

gulp.task('default', function () {
    gulp.watch([paths.entry + '/scss/**/*.scss'], ['styles']);
    gulp.watch(paths.entry + '/js/**/*.js', ['scripts']); // watch for webpack
});