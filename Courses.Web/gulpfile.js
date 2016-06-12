var gulp = require('gulp'),
    gutil = require('gulp-util'),
    // jshint
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    // del files
    rimraf = require('rimraf'),
    // obvious
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    // create source maps
    sourcemaps = require('gulp-sourcemaps'),
    // add dependency injects for angular - write "ngInject"; at top of functions to use this
    ngAnnotate = require('gulp-ng-annotate'),
    // browserify
    watchify = require('watchify'),
    browserify = require('browserify'),
    // convert browserify into stream that gulp understands
    source = require('vinyl-source-stream'),    
    buffer = require('vinyl-buffer'),
    // to import css files of libraries as well
    browserifyCss = require('browserify-css'),
    path = require('path'),
    fse = require('fs-extra');

var config = {
    app: './app/**/*.js',
    css: './styles/**/*.css',
    vendor: './vendor/vendors.js',
    vendorDest: './vendors',    
    appDest: './app',
    cssDest: './styles.css',
};

gulp.task('clean:css', function (cb) {
    rimraf(config.cssDest, cb);
});

gulp.task('clean:js', function (cb) {
    rimraf(config.appDest + '*.js*', cb);
});

gulp.task('clean-vendor:js', function (cb) {
    rimraf(config.vendorDest + '.*.js*', cb);
});

gulp.task('clean', ['clean:js', 'clean-vendor:js', 'clean:css']);

var _browserify = function (shouldWatch) {
    var opt = {
        //debug: true,            
    };
    function copyAssets(relativeUrl) {
        // copy assets like images, fonts .. etc to /assets/vendor/..
        var stripQueryStringAndHashFromPath = function (url) {
            return url.split('?')[0].split('#')[0];
        };
        var rootDir = process.cwd();
        var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
        var queryStringAndHash = relativeUrl.substring(relativePath.length);

        // 
        // Copying files from '/node_modules/bootstrap/' to 'dist/vendor/bootstrap/' 
        //                                         
        var prefix = 'node_modules';
        if (relativePath.startsWith(prefix)) {
            var vendorPath = 'assets/vendor/' + relativePath.substring(prefix.length);
            var source = path.join(rootDir, relativePath);
            var target = path.join(rootDir, vendorPath);

            //gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
            fse.copySync(source, target);

            // Returns a new path string with original query string and hash fragments 
            return vendorPath + queryStringAndHash;
        }
        return relativeUrl;
    }

    var b = shouldWatch ? watchify(browserify(config.vendor, opt)) : browserify(config.vendor, opt);

    return b.transform(browserifyCss, {
            autoInject: true,
            rootDir: '.',
            processRelativeUrl: copyAssets
        })
    	.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(config.vendorDest + '.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
};

gulp.task('browserify-vendors', ['clean-vendor:js'], function () {
    return _browserify(false);
});

gulp.task('scripts', ['clean:js'], function () {
    return gulp.src([config.app])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(concat(config.appDest + '.js'))
            .pipe(gulp.dest('.'))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
});

gulp.task('styles', ['clean:css'], function () {
    return gulp.src(config.cssSrc)
        .pipe(concat(config.cssDest))
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
});

gulp.task('bundle', ['styles', 'scripts', 'browserify-vendors']);

gulp.task('watchify-vendors', function () {
    return _browserify(true);
});

gulp.task('watch:js', function () {
    return gulp.watch(config.src, ['scripts']);
});

gulp.task('watch:css', function () {
    return gulp.watch(config.cssSrc, ['styles']);
});

gulp.task('watch', ['watch:js', 'watch:css', 'watchify-vendors']);

gulp.task('default', ['watch']);