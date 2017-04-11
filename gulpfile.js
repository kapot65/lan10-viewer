/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json");
var gulp_jspm = require('gulp-jspm');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('jspm', function(){
    return gulp.src('public_html/js/main.js')
        .pipe(gulp_jspm({minify: true}))
        .pipe(gulp.dest('public_html/js'));
});

gulp.task('ts', function () {
    //var execSync = require('child_process').execSync;
    //console.log(execSync('emsdk_env && emcc --bind -o ' + 
    //        'public_html/quick_example.js src/quick_example.cpp' +
    //        ' src/quick_example_1.cpp').toString());
    
    return gulp.src("src/*.ts")
        .pipe(ts(tsProject))
        .pipe(gulp.dest('public_html/js'));
        
});

gulp.task('build', ['ts', 'jspm'], function () {
    //var execSync = require('child_process').execSync;
    //console.log(execSync('emsdk_env && emcc --bind -o ' + 
    //        'public_html/quick_example.js src/quick_example.cpp' +
    //        ' src/quick_example_1.cpp').toString());
});