const paths = {
    entry: "./src",
    output: "./app/dist"
}

const gulp = require('gulp');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');


gulp.task('scripts', () => {
    gulp.src(paths.entry + '/js/app.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest(paths.output));
});



const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');

gulp.task('styles', function () {

    return gulp.src(paths.entry + '/scss/main.scss')

        .pipe(plumber())

        .pipe(sourcemaps.init())

        .pipe(sassGlob())
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))

        .pipe(sourcemaps.write())

        .pipe(gulp.dest(paths.output))

});

gulp.task('default', function () {
    gulp.watch(paths.entry + '/scss/**/*.scss', ['styles']);
    gulp.watch(paths.entry + '/js/**/*.js', ['scripts']); // watch for webpack
});