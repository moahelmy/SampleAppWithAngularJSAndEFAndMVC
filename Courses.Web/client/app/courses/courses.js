(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('coursesList', {
            templateUrl: app.config.courses + 'courses.html',
            controller: CoursesListController
        });


    function CoursesListController(uiGridConstants, Course) {
        'ngInject';

        var vm = this;

        vm.courses = Course.query();
        vm.course = {};
        vm.coursesGrid = {};
        
        vm.add = addCourse;
        vm.edit = editCourse;
        vm.remove = removeCourse;

        _init();
        /// ============== ///

        function _init() {
            _initCoursesGrid();            
        }

        function addCourse(entity) {

        }

        function editCourse(entity) {

        }

        function removeCourse(entity) {

        }

        function _initCoursesGrid() {
            vm.coursesGrid = {
                paginationPageSizes: [5],
                paginationPageSize: 5,
                rowHeight: 33,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                enableSelectAll: false,
                multiSelect: false,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableColumnMenus: false,
                enableSorting: true,
                columnDefs: [
                    { field: 'edit', displayName: '', cellTemplate: 'edit-course-template', width: 40, enableSorting: false },
                    { field: 'delete', displayName: '', cellTemplate: 'delete-course-template', width: 40, enableSorting: false },
                    { name: 'Name', field: 'name', displayName: 'Name', width: '30%' },
                    { name: 'Location', field: 'location', displayName: 'Location', width: '40%' },
                    { name: 'Teacher', field: 'teacher', displayName: 'Teacher', width: '25%' },
                ],
                data: '$ctrl.courses',
            };
            vm.coursesGrid.appScopeProvider = vm;
            vm.coursesGrid.onRegisterApi = function (gridApi) {
                gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    vm.course = row.entity;
                    vm.students = vm.course.students;
                });
            };
        }        
    }
})(app);