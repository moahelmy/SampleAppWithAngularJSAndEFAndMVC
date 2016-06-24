(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('viewStudent', {
            templateUrl: app.config.students + 'student.view.html',
            controller: ViewStudentController,
            bindings: {
                student: '=',
            }
        });


    function ViewStudentController() {
        'ngInject';

        var vm = this;
        vm.dateOptions = { datepickerMode: 'month' };
        vm.student = vm.student || {};
        vm.student.birthDate = _formatDate(vm.student.birthDate);
    }

    function _formatDate(value) {
        if (!value)
            return '';
        var dateValue = new Date(value);
        return dateValue.getDate() + '.' + (dateValue.getMonth() + 1) + '.' + dateValue.getYear();
    }
})(app);