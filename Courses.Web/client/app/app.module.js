(function (app) {
    'use strict';

    angular.module('courses.main', ['courses.common', 'courese.directives', 'courses.services'])
        .config(config);

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('Default', {
            url: '',
            views: {
                "mainView": {                    
                    templateUrl: app.config.courses + '/courses.list.html',
                    controller: 'CoursesListController',
                    controllerAs: 'vm',
                }
            }
        });
    }
})(app);