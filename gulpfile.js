var gulp = require('gulp');
var concat  = require('gulp-concat');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var headerfooter = require('gulp-header-footer');

var header="\
/*\n\
    MIT LICENSE @2016 Ivan Lausuch <ilausuch@gmail.com>\
*/";

gulp.task('compile', function(){
    return gulp.src('src/*.js')
        .pipe(strip())
        .pipe(concat('ilPromises.js'))
        .pipe(headerfooter({
            header:header,
            footer:'',
            filter: function(file){
                return true;
            }
          }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minimize', function(){
    return gulp.src('src/*.js')
        .pipe(strip())
        .pipe(concat('ilPromises.min.js'))
        .pipe(headerfooter({
            header:header,
            footer:'',
            filter: function(file){
                return true;
            }
          }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
         
});

gulp.task("build",["compile","minimize"]);
