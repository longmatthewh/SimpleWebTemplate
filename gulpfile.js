var gulp = require('gulp');
var less = require('gulp-less');
var nano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var transpile = require('gulp-babel');
var jshint = require('gulp-jshint');
var lesshint = require('gulp-lesshint');
var watch = require('gulp-watch');
var jasmine = require('gulp-jasmine-browser');

var testJsFiles = [
    'src/js/*',
    'test/js/*Spec.js'
];

gulp.task('travis', ['jshint','lesshint', 'jsmin', 'test-headless']);

gulp.task('build', ['jshint','lesshint', 'jsmin', 'less', 'test-headless']);

gulp.task('default', ['watch']);

gulp.task('test-browser', ['watch', 'test-jasmine']);

gulp.task('test-jasmine', function () {
    return gulp.src(testJsFiles)
        .pipe(watch(testJsFiles))
        .pipe(jasmine.specRunner())
        .pipe(jasmine.server({port: 8000}));
});

gulp.task('test-headless', function() {
    return gulp.src(testJsFiles)
        .pipe(jasmine.specRunner({console: true}))
        .pipe(jasmine.headless());
});

gulp.task('less', function () {
    return gulp.src(['src/less/main.less'])
        .pipe(less())
        .pipe(nano({
            autoprefixer: {add:'true'}
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('jsmin', function () {
    return gulp.src('src/js/*.js')
        .pipe(transpile())
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('jshint', function () {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lesshint', function () {
    return gulp.src('src/less/*.less')
        .pipe(lesshint())
        .pipe(lesshint.reporter())
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['jshint','jsmin']);
    gulp.watch('src/less/**/*.less', ['less']);
});