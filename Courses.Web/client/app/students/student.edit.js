(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('editStudent', {
            templateUrl: app.config.students + 'student.edit.html',
            controller: EditStudentController,
            bindings: {
                student: '=',
            }
        });


    function EditStudentController() {
        'ngInject';

        var vm = this;
        vm.dateOptions = { datepickerMode: 'month' };
        vm.student = vm.student || {};
        vm.student.birthDate = vm.student.birthDate && new Date(vm.student.birthDate) || null;
    }
})(app);