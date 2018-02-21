'use strict';

const gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    concat = require('gulp-concat'),
    path = require('path'),
    babel = require('gulp-babel'),
    reload = browserSync.reload,
    imagemin = require('gulp-imagemin');

const pathes = require('./pathes.json');

console.log('img---', pathes.src.img);

gulp.task('app:build', function () {
    gulp.src(pathes.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'stage-3']
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(pathes.build.js))
        .pipe(reload({stream: true}))
});

gulp.task('vendor:build',function () {
    gulp.src(pathes.src.vendor)
        .pipe(sourcemaps.write())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(pathes.build.vendor));
});

gulp.task('css:build', function () {
    gulp.src(pathes.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(pathes.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('html:build', function () {
    gulp.src(pathes.src.html) 
        .pipe(gulp.dest(pathes.build.html)) 
        .pipe(reload({stream: true})); 
});

gulp.task('img:build', function () {
    gulp.src(pathes.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(pathes.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('server', _ => {
    browserSync({
        server: {
            baseDir: './build'
        },
        tunnel: true,
        host: 'localhost',
        port: '1337'
    })
});

gulp.task('build', [
    'html:build',
    'vendor:build',
    'app:build',
    'css:build',
    'img:build'
]);

gulp.task('watch', function(){
    watch([pathes.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([pathes.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([pathes.watch.js], function(event, cb) {
        gulp.start('app:build');
    });
    watch([pathes.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});


gulp.task('default', ['build', 'server', 'watch']);