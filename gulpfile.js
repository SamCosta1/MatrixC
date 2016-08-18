var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

options = {
       src: '.',
       dest: './dist'
    };
require('gulp-compress')(gulp, options);

gulp.task('default', function() {
  // place code for your default task here
});

var jsFiles = 'src/js/*.js',
jsDest = 'dist/';

gulp.task('styles', function() {
    gulp.src('src/scss/styleSheets/*.scss')
    .pipe(sass().on('error', sass.logError))    
        .pipe(cleanCSS())
        .pipe(gulp.dest(jsDest));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('./**/*.scss',['styles']);
    gulp.watch('src/**/*.js',['scripts']);
});


gulp.task('libraryScripts', function() {
    return gulp.src('dependencies/*js')
        .pipe(concat('dep.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
