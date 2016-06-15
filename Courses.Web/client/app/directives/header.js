(function (app) {
    'use strict';

    angular.module('courese.directives.layout')
        .component('courses.header', {
            templateUrl: app.config.directivesPath + 'views/header.html',
            controller: function () {
                var vm = this;

                vm.title = 'Courses - Sample App with AngularJS, EF and ASP.NET MVC';
            },
            controllerAs: 'vm'
        });
})(app);