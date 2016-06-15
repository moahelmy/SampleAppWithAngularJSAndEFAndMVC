var gulp = require('gulp'),
    gutil = require('gulp-util'),    
    // obvious
    concat = require('gulp-concat'),   
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    // create source maps
    sourcemaps = require('gulp-sourcemaps'),
    // add dependency injects for angular - write "ngInject"; at top of functions to use this
    ngAnnotate = require('gulp-ng-annotate');

// =====================//
var isTrue = function (val) {
    return val === undefined || val === true;
};

//  opts
//  {
//      useJsHint: whether to _compile js with jshint or not
//      sourceMapsOpts :{
//          use: whether to use sourcemaps or not
//          concat: whether to concat before creating source maps or not.
//      }
//  }
var bundle = function(files, dest, opts) {

    var concatAndAnnotate = function (pipeline) {
        return pipeline.pipe(concat(dest + '.js'))
                        .pipe(ngAnnotate());
    };
    var minfiy = function (pipeline, concatenated) {
        var p = pipeline;
        if (!concatenated) {
            var p = concatAndAnnotate(p);
        }
        return p.pipe(uglify());
    };

    var pipeline = gulp.src(files);
    opts = opts || {};
    if (isTrue(opts.useJsHint) && _compile) {
        pipeline = _compile(pipeline);
    }

    if (opts.sourceMapsOpts === undefined || isTrue(opts.sourceMapsOpts.use)) {
        var shouldConcat = !opts.sourceMapsOpts || opts.sourceMapsOpts.concat;
        if (shouldConcat) {
            pipeline = concatAndAnnotate(pipeline);
        }
        pipeline = pipeline.pipe(sourcemaps.init({ loadMaps: true }));
        pipeline = minfiy(pipeline, shouldConcat)
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(sourcemaps.write('./'));
    }
    else {
        pipeline = minfiy(pipeline, false)
                    .pipe(rename({ suffix: '.min' }));
    }

    return pipeline.pipe(gulp.dest('.'));
};    

var browserify = function (mainFile, dest, shouldWatch) {
    var watchify = require('watchify'),
        browserify = require('browserify'),
        // convert browserify into stream that gulp understands
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        // to import css files of libraries as well
        browserifyCss = require('browserify-css'),
        path = require('path'),
        fse = require('fs-extra');

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
            var vendorPath = 'client/assets/vendor/' + relativePath.substring(prefix.length);
            var source = path.join(rootDir, relativePath);
            var target = path.join(rootDir, vendorPath);

            //gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
            fse.copySync(source, target);

            // Returns a new path string with original query string and hash fragments
            return vendorPath + queryStringAndHash;
        }
        return relativeUrl;
    }

    var b = shouldWatch ? watchify(browserify(mainFile, opt)) : browserify(mainFile, opt);

    return b.transform(browserifyCss, {
        autoInject: true,
        rootDir: '.',
        processRelativeUrl: copyAssets
    })
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(dest + '.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
};

function _compile(pipeline) {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    return pipeline.pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
};

module.exports = {
    bundle: bundle,
    browserify: browserify
};