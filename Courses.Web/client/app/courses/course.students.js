(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('courseStudents', {
            templateUrl: app.config.courses + 'course.students.html',
            controller: CourseStudentsController,
            bindings: {
                courseId: '='
            }
        });

    function CourseStudentsController(uiGridConstants) {
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
        }

        function addStudent(entity) {

        }

        function editStudent(entity) {

        }

        function removeStudent(entity) {

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
                    { name: 'Name', field: 'name', displayName: 'Name', width: '65%' },
                    { name: 'Age', field: 'age', displayName: 'Age', cellClass: 'text-center', width: '15%%' },
                    { name: 'GPA', field: 'gpa', displayName: 'GPA', cellClass: 'text-center', width: '15%' },
                ],
                data: '$ctrl.students',
            };
            vm.studentsGrid.appScopeProvider = vm;
        }
    }

})(app);