'use strict';

// Faz requisições das dependências
var gulp = require('gulp-param')(require('gulp'), process.argv),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpImports = require('gulp-imports'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    del = require('del'),
    srcPrefix = 'src/',
    distPrefix = 'dist/',

    dir = {
        srcCss: srcPrefix + 'css',
        srcCssFile: function () { return this.srcCss + '/style.' },
        
        srcJs: srcPrefix + 'js',
        srcJsFile: function () { return this.srcJs + '/scripts.' },
        
        distCss: distPrefix + 'css',
        distCssFile: function () { return this.distCss + '/style.' },
        
        distJs: distPrefix + 'js',
        distJsFile: function () { return this.distJs + '/scripts.' },
    };


// Prototype que gera nome da tarefa
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function (task) {
    this.currentTask = task;
    this.__runTask(task);
}

// Task que compila os estilos
gulp.task('styles', function (dev) {
    var output = dev ? 'expanded' : 'compressed'

    return gulp.src(dir.srcCss + '/style.sass')
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass({ outputStyle: output })
            .on('error', sass.logError))
        .pipe(gulpif(dev, sourcemaps.write('../css')))
        .pipe(gulp.dest(dir.distCss))
        .on('end', function () { gutil.log('`-- Styles task complete.'); });
})

// Task que compila os scripts
gulp.task('scripts', function (dev) {
    var output = dev ? 'expanded' : 'compressed'

    return gulp.src(dir.srcJsFile() + 'js')
        .pipe(gulpImports())
        .pipe(gulpif(!dev, uglify()))
        .pipe(rename('app.js'))
        .pipe(gulp.dest(dir.distJs))
        .on('end', function () { gutil.log('`-- Scripts task complete.'); });
})

// Deleta arquivos já gerados anteriormente
gulp.task('clean', function () {
    return del([
        dir.distCss + '/style.css',
        dir.distJs + '/app.js',
        dir.distJs + '/*.map',
        dir.distCss + '/*.map'
    ]);
});

// Task default
gulp.task('default', ['clean'], function (dev) {
    gulp.start('styles', 'scripts')

    if (dev)
        gulp.start('watch');
});

// Watch
gulp.task('watch', function () {
    // Watch .sass files
    gulp.watch(dir.srcCss + '/**/*.sass', ['styles']);

    // Watch .js files
    gulp.watch(dir.srcJs + '/**/*.js', ['scripts']);
})