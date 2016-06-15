(function (app) {
    'use strict';

    angular.module('courese.directives.layout')
        .component('courses.footer', {
            templateUrl: app.config.directivesPath + 'views/footer.html',
            controller: function () {
                var vm = this;

                vm.author = 'Mohammad Helmy (@moahelmy)';
            },
            controllerAs: 'vm'
        });
})(app);