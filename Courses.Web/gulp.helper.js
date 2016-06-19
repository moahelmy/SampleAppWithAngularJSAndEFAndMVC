var gulp = require('gulp'),    
    gutil = require('gulp-util'),
    $ = require('gulp-load-plugins')({ lazy: false });

// =====================//
var isTrue = function (val) {
    return val === undefined || val === true;
};

//  opts
//  {
//      compile: whether to compile js with jshint or not
//      sourceMapsOpts :{
//          use: whether to use sourcemaps or not
//          concat: whether to concat before creating source maps or not.
//      }
//  }
var bundle = function(files, dest, opts) {

    opts = opts || {};
    var shouldCompile = isTrue(opts.compile);
    var smaps = opts.sourceMapsOpts === undefined || isTrue(opts.sourceMapsOpts.use);
    var shouldConcat = !opts.sourceMapsOpts || opts.sourceMapsOpts.concat;
    return gulp.src(files)            
            .pipe($.if(shouldCompile, $.eslint()))
            .pipe($.if(shouldCompile, $.eslint.format()))
            .pipe($.if(shouldCompile, $.eslint.failAfterError()))
            .pipe($.if(smaps && shouldConcat, $.concat(dest + '.js')))
            .pipe($.if(smaps && shouldConcat, gulp.dest('.')))
            .pipe($.if(smaps && shouldConcat, $.ngAnnotate()))
            .pipe($.if(smaps, $.sourcemaps.init({ loadMaps: true })))
            .pipe($.if(!(smaps && shouldConcat), $.concat(dest + '.js')))
            .pipe($.if(!(smaps && shouldConcat), $.ngAnnotate()))
            .pipe($.uglify())
            .pipe($.if(smaps, $.rename({ suffix: '.min' })))
            .pipe($.if(smaps, $.sourcemaps.write('./')))
            .pipe(gulp.dest('.'));
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
 
            //gutil.log('Copying file from '  JSON.stringify(source)  ' to '  JSON.stringify(target));
            fse.copySync(source, target);
 
            // Returns a new path string with original query string and hash fragments
            return vendorPath + queryStringAndHash;
        }
        return relativeUrl;
    }
 
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
         .pipe($.sourcemaps.init({ loadMaps: true }))
             .pipe($.uglify())
             .pipe($.rename({ suffix: '.min' }))
         .pipe($.sourcemaps.write('./'))
         .pipe(gulp.dest('.'));
};

function compile(files) {

    return gulp.src(files)
        pipeline.pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
};

module.exports = {
    bundle: bundle,
    browserify: browserify,
    compile: compile
};