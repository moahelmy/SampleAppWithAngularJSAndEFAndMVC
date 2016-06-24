(function () {
    'use strict';

    angular.module('courese.directives.common', []);
    angular.module('courese.directives.form', ['ngAnimate', 'ui.bootstrap', 'courese.directives.common']);
    angular.module('courese.directives.layout', ['courese.directives.common']);

    angular.module('courese.directives', ['courese.directives.form', 'courese.directives.layout']);

})();