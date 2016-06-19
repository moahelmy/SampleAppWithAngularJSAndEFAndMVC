(function () {
    'use strict';

    angular.module('courses.main', ['courses.common'])
        .config(config);

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('Default', {
            url: '',
            views: {
                "mainView": {                    
                    template: '<courses-list></courses-list>',                    
                }
            }
        });
    }
})();