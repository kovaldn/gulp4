var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'assets/styles/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'assets/scripts/'
    }
};

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())        
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());        
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function clean() {
    return del('assets');
}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}

function serve() {
    browserSync.init({
        server: {
            baseDir: "./"    
        }
    });
    browserSync.watch(['./*.html', './assets/**/*.*'], browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.watch = watch;

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(styles, scripts) 
))

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, scripts),
    gulp.parallel(watch, serve)
));
