/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json");
var gulp_jspm = require('gulp-jspm');
var exec_simple = require('child_process').exec;

gulp.task('default', function () {
    
    // place code for your default task here
    
});

gulp.task('jspm', function(){
    
    return gulp.src('public_html/js/main.js')
        .pipe(gulp_jspm({minify: true}))
        .pipe(gulp.dest('public_html/js'));

});

gulp.task('ts', function () {
    
    return gulp.src("src/*.ts")
        .pipe(ts(tsProject))
        .pipe(gulp.dest('public_html/js'));
        
});

gulp.task('build-server', function () {
    
    exec_simple('pip3 install -r server/requirements.txt --user', 
                    function (err, stdout, stderr) {
        
        console.log(stdout);
        if (err !== null) {
            throw new Error(stderr);
        };
    
        exec_simple('git submodule init', function (err, stdout, stderr) {

            console.log(stdout);
            if (err !== null) {
                throw new Error(stderr);
            };

            exec_simple('pip3 install -r ' + 
                        'server/counter-redirecter/requrements.txt --user', 
                        function (err, stdout, stderr) {

                console.log(stdout);
                if (err !== null) {
                    throw new Error(stderr);
                };

                exec_simple('cd server/counter-redirecter/configs && ' + 
                            'protoc rsb_event.proto  --python_out ../utils ' + 
                            '&& cd ../../../', function (err, stdout, stderr) {

                    console.log(stdout);
                    if (err !== null) {
                        throw new Error(stderr);
                    };
                }); 
            });
        });
    });
});

gulp.task('build', ['ts', 'build-server'], function () {
});

