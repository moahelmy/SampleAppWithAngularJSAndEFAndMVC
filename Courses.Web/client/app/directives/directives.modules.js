(function () {
    'use strict';

    angular.module('courese.directives.common', []);
    angular.module('courese.directives.forms', ['courese.directives.common']);
    angular.module('courese.directives.layout', ['courese.directives.common']);

    angular.module('courese.directives', ['courese.directives.forms', 'courese.directives.layout']);

})();