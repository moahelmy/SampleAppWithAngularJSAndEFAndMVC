(function (app) {
    'use strict';

    angular.module('courses.main')
        .component('coursesList', {
            templateUrl: app.config.courses + 'courses.html',
            controller: CoursesListController
        });


    function CoursesListController(uiGridConstants, Course, $uibModal, $templateCache) {
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

        function addCourse() {
            _openDialog()
                .result.then(function (course) {
                    course && vm.courses.push(course);
                });
        }

        function editCourse(entity) {
            _openDialog(entity)
                .result.then(function (course) {
                    course && _updateCourse(entity, course);
                });
        }

        function removeCourse(entity) {
            _openDialog(entity, 'course.delete.dialog.html', 'CourseDeleteDialogController')
                .result.then(function (course) {
                course && _removeCourse(entity);
            });
        }

        function _updateCourse(entity, course) {
            var index = vm.courses.indexOf(entity);
            index > -1 && (vm.courses[index] = course);
        }

        function _removeCourse(entity) {
            var index = vm.courses.indexOf(entity);
            index > -1 && vm.courses.splice(index, 1);
        }

        function _openDialog(course, viewName, ctrl) {
            var tUrl = app.config.courses + (viewName || 'course.edit.dialog.html');
            $templateCache.remove(tUrl);
            return $uibModal.open({
                animation: true,
                templateUrl: tUrl,
                controller: ctrl || 'CourseEditDialogController',
                controllerAs: 'vm',
                keyboard: true,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    course: function () {
                        return course || null;
                    }
                }
            })
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
                    { name: 'Teacher', field: 'teacherName', displayName: 'Teacher', width: '25%' },
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