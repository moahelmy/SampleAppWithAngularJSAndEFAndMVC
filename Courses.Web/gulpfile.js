var config = require('./gulp.config'),
    helper = require('./gulp.helper'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    // delete files
    rimraf = require('rimraf'),
    // loading plugins
    $ = require('gulp-load-plugins')({ lazy: false });

// styles

gulp.task('clean:css', function (cb) {
    log('Deleting ' + config.css.dest + '*.css* ...');
    return rimraf(config.css.dest + '*.css*', cb);
});

gulp.task('styles', ['clean:css'], function () {
    log('Minifying styles into ' + config.css.dest + ' ...');
    return gulp.src(config.cssList())
        .pipe($.concat(config.css.dest + '.min.css'))
        .pipe($.cssmin())
        .pipe(gulp.dest('.'));
});

gulp.task('watch:css', function () {
    return gulp.watch(config.cssList(), ['styles']);
});

// javascript

gulp.task('clean:js', function (cb) {
    log('Deleting ' + config.app.dest + '*.js* ...');
    return rimraf(config.app.dest + '*.js*', cb);
});

gulp.task('scripts', ['clean:js'], function () {
    log('Bundling js into ' + config.app.dest + ' ...');
    return helper.bundle(config.appList(), config.app.dest, { debug: config.debug, compile: config.compile });
});

gulp.task('watch:js', function () {
    return gulp.watch(config.appList(), ['scripts']);
});

// vendors
if (config.bundleVendors) {
    gulp.task('clean:vendors', function (cb) {
        log('Deleting ' + config.vendors.dest + '.*.js* ...');
        return rimraf(config.vendors.dest + '.*.js*', cb);
    });

    gulp.task('vendors', ['clean:vendors'], function () {
        if (config.browserify) {
            log('Bundling 3rd party libs using browserify into ' + config.vendors.dest + ' ...');
            return helper.browserify(config.vendors.main, config.vendors.dest, false, config.debug);
        }
        else {
            log('Bundling 3rd party libs into ' + config.app.dest + ' ...');
            return helper.bundle(config.vendors.list, config.vendors.dest, { compile: false, debug: config.debug });
        }
    });

    gulp.task('watch:vendors', function () {
        if (config.browserify) {
            return helper.browserify(config.vendors.main, config.vendors.dest, true, config.debug);
        }
        else {
            return gulp.watch(config.vendors.list, ['vendors']);
        }
    });
}

// combined tasks

gulp.task('help', $.taskListing);

gulp.task('clean', ['clean:js', 'clean:css']);

gulp.task('build', ['styles', 'scripts']);

gulp.task('watch', ['watch:js', 'watch:css']);

if (config.bundleVendors) {
    gulp.task('clean:all', ['clean', 'clean:vendors']);

    gulp.task('build:all', ['build', 'vendors']);

    gulp.task('watch:all', ['watch', 'watch:vendors']);
}

gulp.task('default', ['watch']);

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (config.log === false) {
        return;
    }
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gutil.log(gutil.colors.blue(msg[item]));
            }
        }
    } else {
        gutil.log(gutil.colors.blue(msg));
    }
}