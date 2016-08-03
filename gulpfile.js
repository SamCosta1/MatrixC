var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

options = {
       src: '.',
       dest: './dist'
    };
require('gulp-compress')(gulp, options);

gulp.task('default', function() {
  // place code for your default task here
});


gulp.task('styles', function() {
    gulp.src('src/scss/**/*.scss')
    gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('./**/*.scss',['styles']);
    gulp.watch('src/**/*.js',['scripts']);
});

var jsFiles = 'src/js/*.js',
    jsDest = 'dist/';

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
