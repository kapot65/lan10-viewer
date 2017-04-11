/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json");

//var browserSync = require('browser-sync');
//var less = require('gulp-less');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('build', function () {
    //var execSync = require('child_process').execSync;
    //console.log(execSync('emsdk_env && emcc --bind -o ' + 
    //        'public_html/quick_example.js src/quick_example.cpp' +
    //        ' src/quick_example_1.cpp').toString());
    
    var tsResult = tsProject.src()
        .pipe(ts(tsProject))
        .pipe(gulp.dest('public_html/js'));
        
});