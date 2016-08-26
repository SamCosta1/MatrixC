var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


options = {
       src: '.',
       dest: './dist'
    };
require('gulp-compress')(gulp, options);

gulp.task('default', function() {
  // place code for your default task here
});

var jsFiles = 'src/js/**/*.js',
jsDest = 'dist/';

gulp.task('styles', function() {
    gulp.src('src/scss/styleSheets/*.scss')
    .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({stream: true}));
});


//Watch task
gulp.task('default', ['browser-sync'], function() {
    gulp.watch('./**/*.scss',['styles']);
    gulp.watch('src/**/*.js',['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('libraryScripts', function() {
    return gulp.src('dependencies/*js')
        .pipe(concat('dep.min.js'))
        .pipe(gulp.dest(jsDest))
    //    .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(jsDest))
//        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({stream: true}));
});
