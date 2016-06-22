var constructExclude = function (exclude) {
    return exclude.map(function (f) {
        return (f.startsWith('!') ? '' : '!') + f;
    });
};

var appList = function () {
    var config = this;
    if (config.app.list && config.app.list.length > 0)
        return config.app.list;

    var src = config.app.include;
    var exc = constructExclude(config.app.exclude);
    return src.concat(exc);
};

var cssList = function () {
    var config = this;
    var src = config.css.include;
    var exc = constructExclude(config.css.exclude);
    return src.concat(exc);
};

var appRoot = 'client/app/';
var stylesRoot = 'client/styles/';
var vendorsRoot = 'client/vendor/';
var distRoot = 'client/dist/';

module.exports = {
    debug: true,
    bundleVendors: true,
    compile: true,
    browserify: true,
    log: true,
    vendors: {
        main: vendorsRoot + 'vendors.js',
        list: [],
        dest: distRoot + 'vendors',
    },
    app: {
        list: [],
        include: [
                    appRoot + '**/_*.js',
                    appRoot + '**/*.module.js',
                    appRoot + 'common/!(_)*!(module).js',
                    appRoot + '**/*.js',
                ],
        exclude: [
                    appRoot + '**/*.min.js',
                    appRoot + '**/*.spec.js',
                ],
        dest: 'client/dist/app',
    },
    css: {
        include: [stylesRoot + '**/*.css'],
        exclude: [stylesRoot + '**/*.min.css'],
        dest: distRoot + 'styles',
    },
    appList: appList,
    cssList: cssList,
};