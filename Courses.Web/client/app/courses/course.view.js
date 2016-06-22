(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('courseView', {
            templateUrl: app.config.courses + 'course.view.html',
            controller: ViewCourseController,
            bindings: {
                course: '=',
            }
        });


    function ViewCourseController() {
        'ngInject';

        var vm = this;
        vm.course = vm.course || {};
    }
})(app);