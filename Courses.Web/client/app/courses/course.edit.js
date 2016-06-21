(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('courseEdit', {
            templateUrl: app.config.courses + 'course.edit.html',
            controller: EditCoursesController,
            bindings: {
                course: '=',
            }
        });


    function EditCoursesController(Teacher) {
        'ngInject';

        var vm = this;

        vm.teachers = Teacher.query();
        vm.teacher = vm.course && { id: vm.course.teacherId, name: vm.course.teacherName } || {};
        vm.teacherSelected = teacherSelected;

        vm.course = vm.course || {};

        /// ============== ///

        function teacherSelected(selectedTeacher) {
            vm.course.teacherId = selectedTeacher.id;
            vm.course.teacherName = selectedTeacher.name;
        }
    }
})(app);