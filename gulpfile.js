'use strict';

var gulp = require('gulp');
var minifycss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

// 引入babel，万一用了ES6呢
var babel = require('gulp-babel');

// 压缩 public 目录 html
gulp.task('minify-html', async function() {
    await gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,  //清除HTML注释
            collapseWhitespace: true,  //压缩HTML
            collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
            minifyJS: true,  //压缩页面JS
            minifyCSS: true  //压缩页面CSS
        }))
        .on('error', function(err) {
            console.log('html Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest('./public'))
});
// 压缩 public 目录 css
gulp.task('minify-css', async function() {
    await gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});
// 压缩js
gulp.task('minify-js', async function() {
    await gulp.src(['./public/js/**/*.js', '!./public/js/**/*.{min,mini}.js'])
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});
// 压缩图片
gulp.task('minify-images', async function() {
    await gulp.src('./public/img/**/*.*')
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}),
        imagemin.mozjpeg({'progressive': true}),
        imagemin.optipng({'optimizationLevel': 8}),
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public/img'))
});

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    process.exit(1) // To exit with a 'failure' code
});

// 默认任务
gulp.task('default', gulp.parallel('minify-html','minify-css','minify-js','minify-images', function(done){
    done();
}));
