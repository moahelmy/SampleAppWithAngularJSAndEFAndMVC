(function () {
    'use strict';

    // common services like notifications, log, .. etc
    angular.module('courses.common.services', ['courses.common']);
    // services that get/send data from/to backend
    angular.module('courses.data.services', ['courses.common', 'ngResource']);

    angular.module('courses.services', ['courses.common.services', 'courses.data.services']);
})();