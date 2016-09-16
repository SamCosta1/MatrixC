var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var fs = require('fs');

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

var colours = ['blue', 'green'];
var themes = ['dark', 'light'];

var theme = 0;
var col = 0;
gulp.task('all-styles', function() {
    generateThemes();
});

function generateThemes() {
    console.log(theme,col);
    var str = "@import \"colours/" + colours[col] + "\"; \n@import \"themes/" + themes[theme] + "\";    ";

    fs.writeFile("src/scss/themes/_includer.scss", str);
    gulp.src('src/scss/styleSheets/*.scss')
    .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(deploy,cleanCSS()))
        .pipe(gulp.dest(jsDest + themes[theme] + '/' + colours[col]))
        .pipe(gulpif(!deploy,browserSync.reload({stream: true})))
        .pipe(function() {

            col = (col + 1) % colours.length;
            if (col === 0)
            theme++;

            if (theme < themes.length) {
                generateThemes();
            }
        });

}

function errorHandle(err) {
    if (err) {
        return console.log(err);
    } else {
        console.log("The file was saved!===");
    }
}

var deploy = false;
gulp.task('deploy', function() {
    deploy = true;
    gulp.start('default');
});

gulp.task('default', function() {
    gulp.start('libraryScripts');
    gulp.start('scripts');
    gulp.start('all-styles');
});

gulp.task('icon-update', shell.task([
  './updateicons'
]));

gulp.task('develop', ['default', 'browser-sync'], function() {
    gulp.watch('./*.zip',['icon-update']);
    gulp.watch('./**/*.scss',['all-styles']);
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
