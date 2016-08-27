var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
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

var jsFiles = 'src/js/**/*.js',
jsDest = 'dist/';

gulp.task('styles', function() {
    gulp.src('src/scss/styleSheets/*.scss')
    .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(deploy,cleanCSS()))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(!deploy,browserSync.reload({stream: true})));
});

var deploy = false;
gulp.task('deploy', function() {
    deploy = true;
    gulp.start('default');
});

gulp.task('default', function() {
    gulp.start('libraryScripts');
    gulp.start('scripts');
    gulp.start('styles');
});

gulp.task('icon-update', shell.task([
  './updateicons'
]));

gulp.task('develop', ['default', 'browser-sync'], function() {
    gulp.watch('./*.zip',['icon-update']);
    gulp.watch('./**/*.scss',['styles']);
    gulp.watch('src/**/*.js',['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('libraryScripts', function() {
    return gulp.src('dependencies/*js')
        .pipe(concat('dep.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(deploy, uglify()))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(deploy, uglify()))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(!deploy,browserSync.reload({stream: true})));
});
