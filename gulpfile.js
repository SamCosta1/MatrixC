var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var gcallback = require('gulp-callback');
var inject = require('gulp-inject-string');

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

var colours = ['blue', 'green', 'purple', 'cyan'];
var themes = ['light', 'dark'];

gulp.task('styles', function() {
    for (var theme = 0; theme < themes.length; theme++) {
        for (var col = 0; col < colours.length; col++) {
            themeCompile(theme,col);
        }
    }
});

function themeCompile(theme, col) {
    gulp.src('src/scss/styleSheets/*.scss')
    .pipe(inject.prepend("$COLOUR: '" + colours[col] + "'; $THEME: '" + themes[theme] + "';"))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(deploy,cleanCSS()))
        .pipe(gulp.dest(jsDest + themes[theme] + '/' + colours[col]))
        .pipe(gulpif(!deploy,browserSync.reload({stream: true})));
}

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
        .pipe(inject.after('// GULP-INCLUDE(THEME&COLOURS)', getArraysAsStrings()))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(deploy, uglify()))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(jsDest))
        .pipe(gulpif(!deploy,browserSync.reload({stream: true})));
});

function getArraysAsStrings() {
    return '\nvar colours = ' + JSON.stringify(colours) + '; \n' +
           'var themes = ' + JSON.stringify(themes) + ';';
}
