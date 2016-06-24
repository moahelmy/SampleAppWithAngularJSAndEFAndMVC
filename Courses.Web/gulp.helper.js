var gulp = require('gulp'),
    gutil = require('gulp-util'),
    $ = require('gulp-load-plugins')({ lazy: false });

// =====================//
var isTrue = function (val) {
    return val === undefined || val === true;
};

/*
 * This bundles list of files into one minimified file.
 * It does concatenate, minmify, annotate angular files, and create source maps for the files.
 * {
 *      files: list of files
 *      dest: destination file without extension
 *      options: described below
 * }
 * opts
 * {
 *      debug: use not minimied version of app code
 *      compile: whether to compile js with jshint or not
 *      annotate:  whether to annotate angular files or not
 *      sourceMapsOpts :{
 *          use: whether to use sourcemaps or not
 *          concat: whether to concat before creating source maps or not
 *      }
 * }
 */
var bundle = function(files, dest, opts) {

    opts = opts || {};
    var shouldCompile = isTrue(opts.compile);
    var annotate = isTrue(opts.annotate);
    var debug = opts.debug === true;
    var smaps = !debug && (opts.sourceMapsOpts === undefined || isTrue(opts.sourceMapsOpts.use));
    var shouldConcat = !opts.sourceMapsOpts || opts.sourceMapsOpts.concat;    
    return gulp.src(files)
            .pipe($.if(shouldCompile, $.eslint()))
            .pipe($.if(shouldCompile, $.eslint.format()))
            .pipe($.if(shouldCompile, $.eslint.failAfterError()))
            .pipe($.if(smaps && shouldConcat, $.concat(dest + '.js')))            
            .pipe($.if(smaps && shouldConcat && annotate, $.ngAnnotate()))
            .pipe($.if(smaps, $.sourcemaps.init({ loadMaps: true })))
            .pipe($.if(!(smaps && shouldConcat), $.concat(dest + '.js')))            
            .pipe($.if(!(smaps && shouldConcat) && annotate, $.ngAnnotate()))
            .pipe($.if(!debug, $.uglify()))
            .pipe($.rename({ suffix: '.min' }))
            .pipe($.if(smaps, $.sourcemaps.write('./')))
            .pipe(gulp.dest('.'));
};

/*
 * Concatenate and minify css files
 * {
 *      cssList: list of files to be processed
 *      dest: destination file without extension
 * }
 */
var bundleCss = function (cssList, dest) {
    return gulp.src(cssList)
        .pipe($.concat(dest + '.min.css'))
        .pipe($.cssmin())
        .pipe(gulp.dest('.'));
};
/*
 * Use broweserify to bundle files
 * {
*       mainFile: the entry file
*       dest: the destination file without extension
*       shouldWatch: to determine whether to use watchify or browserify
*       debug: in debug mode, the concatenated file will be written to disk
*  }
 */
var browserify = function (mainFile, dest, shouldWatch, debug) {
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
            var vendorPath = 'client/assets/vendor' + relativePath.substring(prefix.length);
            var source = path.join(rootDir, relativePath);
            var target = path.join(rootDir, vendorPath);

            //gutil.log('Copying file from '  JSON.stringify(source)  ' to '  JSON.stringify(target));
            fse.copySync(source, target);

            // Returns a new path string with original query string and hash fragments
            return vendorPath + queryStringAndHash;
        }
        return relativeUrl;
    }
    
    var debug = debug === true;    
    return $.if(shouldWatch, watchify(browserify(mainFile, opt)), browserify(mainFile, opt))
        .transform(browserifyCss, {
            autoInject: true,
            rootDir: '.',
            processRelativeUrl: copyAssets
        })
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(dest + '.js'))
        .pipe(buffer())        
        .pipe($.if(!debug, $.sourcemaps.init({ loadMaps: true })))
            .pipe($.uglify())
            .pipe($.if(!debug, $.uglify()))
            .pipe($.rename({ suffix: '.min' }))
        .pipe($.if(!debug, $.sourcemaps.write('./')))
        .pipe(gulp.dest('.'));
};
/*
 * Compile code with JShint and check styles with JSCS
 */
function compileWithJSHint(files) {

    return gulp.src(files)
        .pipeline.pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/*
 * Get directories of given path
 */
function getFolders(dir) {
    var fs = require('fs'),
        path = require('path');
    
    return fs.readdirSync(dir)
      .filter(function (file) {
          return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

module.exports = {
    bundle: bundle,
    bundleCss: bundleCss,
    browserify: browserify,
    compileWithJSHint: compileWithJSHint,
    log: log,
    getFolders: getFolders
};