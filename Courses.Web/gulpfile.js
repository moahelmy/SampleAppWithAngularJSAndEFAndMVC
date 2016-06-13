var config = {
    bundleVendors: true,
    jshint: true,
    browserify: true,
    vendors: {
        main: 'vendor/vendors.js',
        list: [],        
        dest: 'dist/vendors',
    },
    app: {
        ngModules: 'app/**/*.module.js',
        src: 'app/**/*.js',
        minified: 'app/**/*.min.js',
        exclude: [],
        dest: 'dist/app',
    },
    css: {
        src: './app/**/*.js',
        minified: './app/**/*.min.js',
        exclude: [],
        dest: './dist/styles',
    },    
};

var gulp = require('gulp'),
    gutil = require('gulp-util'),
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
    bundleVendors, watchVendors;

// jshint
if (config.jshint) {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    var compile = function (pipeline) {
        return pipeline.pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(jshint.reporter('fail'));
    };
}

//  opts
//  {
//      useJsHint: whether to compile js with jshint or not
//      sourceMapsOpts :{
//          use: whether to use sourcemaps or not
//          concat: whether to concat before creating source maps or not.
//      }
//  }
var bundle = function (files, dest, opts) {

    var isTrue = function (val) {
        return val === undefined || val === true;
    };
    var minifyAndAnnotate = function (pipeline, concatenated) {
        var p = pipeline;
        if (!concatenated) {
            var p = p.pipe(concat(dest + '.js'));
        }
        return p.pipe(ngAnnotate())
            .pipe(uglify());
    };

    var pipeline = gulp.src(files);
    opts = opts || {};
    if (isTrue(opts.useJsHint) && compile) {
        pipeline = compile(pipeline);
    }

    if (opts.sourceMapsOpts === undefined || isTrue(opts.sourceMapsOpts.use)) {
        var shouldConcat = !opts.sourceMapsOpts || opts.sourceMapsOpts.concat;
        if (shouldConcat) {
            pipeline = pipeline.pipe(concat(dest + '.js'));
        }
        pipeline = pipeline.pipe(sourcemaps.init({ loadMaps: true }));
        pipeline = minifyAndAnnotate(pipeline, shouldConcat)
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(sourcemaps.write('./'));
    }
    else {
        pipeline = minifyAndAnnotate(pipeline, false)
                    .pipe(rename({ suffix: '.min' }));
    }

    return pipeline.pipe(gulp.dest('.'));
};

if (config.bundleVendors) {

    // browserify
    if (config.browserify) {
        // browserify
        var watchify = require('watchify'),
            browserify = require('browserify'),
            // convert browserify into stream that gulp understands
            source = require('vinyl-source-stream'),
            buffer = require('vinyl-buffer'),
            // to import css files of libraries as well
            browserifyCss = require('browserify-css'),
            path = require('path'),
            fse = require('fs-extra');

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

            var b = shouldWatch ? watchify(browserify(config.vendors.main, opt)) : browserify(config.vendors.main, opt);

            return b.transform(browserifyCss, {
                autoInject: true,
                rootDir: '.',
                processRelativeUrl: copyAssets
            })
                .bundle()
                .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                .pipe(source(config.vendors.dest + '.js'))
                .pipe(buffer())
                .pipe(sourcemaps.init({ loadMaps: true }))
                    .pipe(uglify())
                    .pipe(rename({ suffix: '.min' }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('.'));
        };

        bundleVendors = function () {
            return _browserify(false);
        };

        watchVendors = function () {
            return _browserify(true);
        };
    }
    else {
        bundleVendors = function () {
            return bundle(config.vendors.list, config.vendors.dest, { useJsHint: false });
        };

        watchVendors = function () {
            return gulp.watch(config.vendors.list, ['bundle-vendors']);
        };
    }
}

gulp.task('clean:css', function (cb) {
    rimraf(config.css.dest + '*.css*', cb);
});

gulp.task('clean:js', function (cb) {
    rimraf(config.app.dest + '*.js*', cb);
});

gulp.task('clean-vendor:js', function (cb) {
    config.bundleVendors && rimraf(config.vendors.dest + '.*.js*', cb);
});

gulp.task('clean', ['clean:js', 'clean-vendor:js', 'clean:css']);

gulp.task('scripts', ['clean:js'], function () {
    var src = [config.app.ngModules, config.app.src, '!' + config.app.minified];
    var exc = config.app.exclude.map(function (f) {
        return (f.startsWith('!') ? '' : '!') + f;
    });
    src = src.concat(exc);
    return bundle(src, config.app.dest);
});

gulp.task('styles', ['clean:css'], function () {
    var src = [config.css.src, '!' + config.css.minified];
    var exc = config.css.exclude.map(function (f) {
        return (f.startsWith('!') ? '' : '!') + f;
    });
    src = src.concat(exc);

    return gulp.src(src)
        .pipe(concat(config.css.dest + '.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
});

gulp.task('vendors', ['clean-vendor:js'], function () {
    return config.bundleVendors && bundleVendors && bundleVendors();
});

gulp.task('bundle', ['styles', 'scripts', 'vendors']);

gulp.task('watch:vendors', function () {
    return config.bundleVendors && watchVendors && watchVendors();
});

gulp.task('watch:js', function () {
    return gulp.watch(config.src, ['scripts']);
});

gulp.task('watch:css', function () {
    return gulp.watch(config.cssSrc, ['styles']);
});

gulp.task('watch', ['watch:js', 'watch:css', 'watchify-vendors']);

gulp.task('default', ['watch']);