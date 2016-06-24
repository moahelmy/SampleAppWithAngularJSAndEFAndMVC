(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('courseStudents', {
            templateUrl: app.config.students + 'course.students.html',
            controller: CourseStudentsController,
            bindings: {
                courseId: '='
            }
        });

    function CourseStudentsController($scope, uiGridConstants, dialog, Course) {
        'ngInject';

        var vm = this;

        vm.students = [];
        vm.studentsGrid = [];

        vm.add = addStudent;
        vm.edit = editStudent;
        vm.remove = removeStudent;

        _init();
        /// ============== ///

        function _init() {
            _initStudentsGrid();
            $scope.$watch('$ctrl.courseId', function () {
                vm.students = vm.courseId ? Course.students(vm.courseId) : [];
            });
        }

        function addStudent() {
            _openDialog({courseId: vm.courseId})
                .result.then(function (student) {
                    student && vm.students.push(student);
                });
        }

        function editStudent(entity) {
            entity.courseId = vm.courseId;
            _openDialog(entity)
                .result.then(function (student) {
                    student && _updateStudent(entity, student);
                });
        }

        function removeStudent(entity) {
            _openDialog(entity, 'student.delete.dialog.html', 'StudentDeleteDialogController')
                .result.then(function (student) {
                    student && _removeStudent(entity);
                });
        }

        function _updateStudent(entity, student) {
            var index = vm.students.indexOf(entity);
            index > -1 && (vm.students[index] = student);
        }

        function _removeStudent(entity) {
            var index = vm.students.indexOf(entity);
            index > -1 && vm.students.splice(index, 1);
        }

        function _openDialog(student, viewName, ctrl) {
            var tUrl = app.config.students + (viewName || 'student.edit.dialog.html');
            return dialog({
                templateUrl: tUrl,
                controller: ctrl || 'StudentEditDialogController',
                controllerAs: 'vm',
                resolve: {
                    student: function () {
                        return student || null;
                    }
                }
            });
        }

        function _initStudentsGrid() {
            vm.studentsGrid = {
                paginationPageSizes: [5],
                paginationPageSize: 5,
                rowHeight: 33,
                enableRowSelection: false,
                enableRowHeaderSelection: false,
                enableSelectAll: false,
                multiSelect: false,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableColumnMenus: false,
                enableSorting: true,
                columnDefs: [
                    { field: 'edit', displayName: '', cellTemplate: 'edit-student-template', width: 40, enableSorting: false },
                    { field: 'delete', displayName: '', cellTemplate: 'delete-student-template', width: 40, enableSorting: false },
                    { name: 'Name', field: 'fullName', displayName: 'Name', width: 500 },
                    { name: 'Age', field: 'age', displayName: 'Age', cellClass: 'text-center', width: 100 },
                    { name: 'GPA', field: 'gpa', displayName: 'GPA', cellClass: 'text-center', width: 100 },
                ],
                data: '$ctrl.students',
            };
            vm.studentsGrid.appScopeProvider = vm;
        }
    }

})(app);