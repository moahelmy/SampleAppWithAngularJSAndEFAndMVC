var constructExclude = function (exclude) {
    return exclude.map(function (f) {
        return (f.startsWith('!') ? '' : '!') + f;
    });
};

var appList = function () {
    var config = this;    
    if (config.app.list && config.app.list.length > 0)
        return config.app.list;

    var src = config.app.nonAngular;
    config.app.ngModules && src.push(config.app.ngModules);
    src.push(config.app.src);
    config.app.minified && src.push('!' + config.app.minified);
    config.app.specs && src.push('!' + config.app.specs);    
    var exc = constructExclude(config.app.exclude);
    src = src.concat(exc);
    
    return src;
};

var cssList = function () {
    var config = this;
    var src = [config.css.src, '!' + config.css.minified];
    var exc = constructExclude(config.css.exclude);
    return src.concat(exc);
};

module.exports = {
    bundleVendors: true,
    jshint: true,
    browserify: true,
    log: true,
    vendors: {
        main: 'client/vendor/vendors.js',
        list: [],
        dest: 'client/dist/vendors',
    },
    app: {
        list: [],
        nonAngular: ['client/app/**/_*.js'],
        ngModules: 'client/app/**/*.module.js',
        src: 'client/app/**/*.js',
        minified: 'client/app/**/*.min.js',
        specs: 'client/app/**/*.spec.js',
        exclude: [],
        dest: 'client/dist/app',
    },
    css: {
        src: 'client/styles/**/*.css',
        minified: 'client/styles/**/*.min.js',
        exclude: [],
        dest: 'client/dist/styles',
    },
    appList: appList,
    cssList: cssList,
};