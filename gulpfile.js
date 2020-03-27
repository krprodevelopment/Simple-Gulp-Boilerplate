const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');

//Styles
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const {task, parallel, src, dest} = gulp;

//Tasks
//Start Browser Sync
task('server', function () {
    browserSync.init({
        server: {
            baseDir: './app/'
        }
    })
});

// Task to watch for changes in app folder
task('watch', function () {
    watch(['./app/*.html', './app/css/**/*.css'], parallel( browserSync.reload ));
    watch('./src/scss/**/*.scss', function () {
        setTimeout(parallel('styles'), 1000);
    })
    watch('./src/html/**/*.html', parallel('html'))
});

// Task to compile HTML
task('html', function (cb) {
    return src('./src/html/*.html')
        .pipe( plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'HTML Include',
                    sound: false,
                    message: err.message
                }
            })
        }) )
        .pipe( fileinclude({prefix: '@@'}) )
        .pipe( dest('./app/') )

    cb();
})


//Task to compile SCSS to CSS
task('styles', function (cb) {
    return src('./src/scss/main.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }) )
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }) )
        .pipe( sourcemaps.write() )
        .pipe( dest('./app/css/') );

    cb();
});


// Default Task
task('default', parallel('server', 'watch', 'styles', 'html'));
