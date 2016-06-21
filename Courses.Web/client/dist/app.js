var app = {
    config:{
        appPath: '/client/app/',
        directivesPath: '/client/app/directives/',
        courses: '/client/app/courses/',
    }
};
(function () {
    'use strict';

    angular.module('courses.main', ['courses.common'])
        .config(config);

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('Default', {
            url: '',
            views: {
                "mainView": {                    
                    template: '<courses-list></courses-list>',                    
                }
            }
        });
    }
})();
(function () {
	'use strict';
	angular.module('courses.common', [
			/* Angular modules */
			'ngMessages',

			/* Cross-app modules */
			'courses.settings',
			'courses.notifications',
			'courses.services',

			/* App directives */
			'courese.directives',

			/* 3rd Party modules */
			'ui.bootstrap',
			'ui.router',
			'ui.select',
			'ui.grid',
			'ui.grid.selection',
			'ui.grid.pagination',
			'ui.grid.autoResize',
			'toaster']
		)
		// if config grow bigger it will be moved to separate file
		.config(['toasterConfig', function (toasterConfig) {
			toasterConfig['close-button'] = true;
			toasterConfig['position-class'] = 'toast-top-right';
			toasterConfig['newest-on-top'] = false;
			toasterConfig.limit = 50;
		}]);
}());

(function () {
    'use strict';

    angular.module('courses.notifications', ['toaster']);
})();
(function () {
    'use strict';

    angular.module('courses.services', ['courses.notifications', 'courses.settings']);
})();
(function () {
    'use strict';

    var Notifications = (function () {
        function Notifications(toaster) {
            var self = this;

            self.showError = showError;
            self.showSuccess = showSuccess;
            self.showInfo = showInfo;
            self.showSpinner = showSpinner;
            self.clear = clear;
            self.remove = remove;
            self.showErrors = showErrors;

            /// Implementation ///
            function showError(title, message) {
                return notifyMessage(title, message, 0, 'error');
            }

            function showSuccess(title, message) {
                return notifyMessage(title, message, 2000, 'success');
            }

            function showInfo(title, message) {
                return notifyMessage(title, message, 5000, 'info');
            }

            function showSpinner(title, message) {
                return notifyMessage(title, message, 0, 'wait');
            }

            function clear() {
                toaster.clear();
            }

            function remove(notificationId, containerId) {
                toaster.clear(containerId, notificationId);
            }

            function notifyMessage(title, message, timeout, type) {
                return toaster.pop({
                    type: type,
                    title: title,
                    body: message,
                    timeout: timeout,
                    notifyCloseButton: true,
                }).toastId;
            }

            function showErrors(errorMessages, title) {
                angular.forEach(errorMessages, function (value, key) {
                    self.showError(title || key, value);
                });
            }
        }

        Notifications.$inject = ['toaster'];
        return Notifications;
    })();

    angular.module('courses.notifications')
            .service('notifications', Notifications);
})();
(function (app) {
    "use strict";

    angular
        .module('courese.directives.forms', ['ngAnimate', 'ui.bootstrap'])
        .directive('swrtDatePicker', datePicker);

    function datePicker() {
        var directive = {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                ngModel: '=',
                ngRequired: '=',
                ngChange: '&',
                field: '@',
                format: '@',
                closeText: '@',
                clearText: '@',
                currentText: '@',
                altInputFormats: '=',
                datepickerOptions: '=',
                manualEntry: '@',
            },
            replace: true,
            templateUrl: app.config.directivesPath + 'views/date.picker.html',
            controller: DatePickerController,
            controllerAs: 'vm',
        };

        DatePickerController.$inject = ['$scope', '$timeout'];
        function DatePickerController($scope, $timeout) {
            var vm = this;
            vm.isOpened = false;
            vm.open = function () {
                vm.isOpened = true;
            };
            vm.closeText = angular.isDefined($scope.closeText) ? $scope.closeText : 'Close';
            vm.format = angular.isDefined($scope.format) ? $scope.format : 'dd-MMMM-yyyy';
            vm.manualEntry = angular.isDefined($scope.manualEntry) ? $scope.manualEntry : false;
            vm.onDateChange = function () {
                if ($scope.ngChange)
                    $timeout($scope.ngChange);
            };
            vm.isReadOnly = function () {
                return isReadOnly(vm.manualEntry);
            };
        }

        function isReadOnly(manualEntry) {
            return manualEntry === 'false' || manualEntry === false || manualEntry === '';
        }
        return directive;
    }
})(app);
(function () {
    'use strict';

    angular.module('courese.directives.common', []);
    angular.module('courese.directives.forms', ['courese.directives.common']);
    angular.module('courese.directives.layout', ['courese.directives.common']);

    angular.module('courese.directives', ['courese.directives.forms', 'courese.directives.layout']);

})();
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
(function () {
    'use strict';

    angular.module('courses.main')
        .controller('CourseEditDialogController', EditCoursesController);


    function EditCoursesController(Course, $uibModalInstance, course) {
        'ngInject';

        var vm = this;

        vm.course = course || {};
        vm.save = save;
        vm.cancel = cancel;

        /// ============== ///

        function save() {
            Course.save(vm.course, {
                success: function (data) {
                    $uibModalInstance.close(data);
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
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
(function () {
    'use strict';

    angular.module('courses.services')
            .service('apiHelper', ApiHelper);

    function ApiHelper($q, $log, notifications) {
        'ngInject';

        var self = this, loadAction = "load", createAction = "create", saveAction = "save", deleteAction = "delete", _notificationSettings;

        self.call = call;
        self.load = load;
        self.create = create;
        self.save = save;
        self.delete = deleteRecord;

        _init();

        /// =================== ///
        function _init() {
            _notificationSettings = {};
            _notificationSettings[loadAction] = {
                title: 'Loading',
                spinningPrefix: 'Loading ',
                successSuffix: ' loaded!',
                errorPrefix: 'An unexpected error while loading ',
            };
            _notificationSettings[createAction] = {
                title: 'Saving',
                spinningPrefix: 'Saving ',
                successSuffix: ' has been created!',
                errorPrefix: 'An unexpected error while creating ',
            };
            _notificationSettings[saveAction] = {
                title: 'Saving',
                spinningPrefix: 'Saving changes to ',
                successSuffix: ' saved!',
                errorPrefix: 'An unexpected error while saving ',
            };
            _notificationSettings[deleteAction] = {
                title: 'Deleting',
                spinningPrefix: 'Deleting ',
                successSuffix: ' deleted!',
                errorPrefix: 'An unexpected error while deleting ',
            };
        }

        function load(params) {
            params.actionName = loadAction;
            return _call(params);
        }

        function create(params) {
            params.actionName = createAction;
            return _call(params);
        }

        function save(params) {
            params.actionName = saveAction;
            return _call(params);
        }

        function deleteRecord(params) {
            params.actionName = deleteAction;
            return _call(params);
        }

        function call(params) {
            var spinningNotification = params.notifications && params.notifications.spinning,
                successNotification = params.notifications && params.notifications.success,
                errorNotification = params.notifications && params.notifications.error,
                action = params.action;
            // spinning/success/error notifications are shown only if spinning/success/error is defined.
            var deferred = $q.defer();
            var notificationId = null;
            try {
                notificationId = spinningNotification && notifications.showSpinner(spinningNotification.title, spinningNotification.message);
                action().then(function (response) {
                    if (notificationId) notifications.remove(notificationId);
                    if (successNotification) notifications.showSuccess(successNotification.title, successNotification.message);
                    deferred.resolve(_getData(response));
                })
                .catch(function (response) {
                    if (notificationId) notifications.remove(notificationId);
                    if (response.data && response.data.message) {
                        notifications.showError('Error', response.data.message);
                    } else {
                        if (errorNotification) notifications.showError(errorNotification.title, errorNotification.message);
                    }
                    deferred.reject(response);                    
                });
            }
            catch (ex) {
                $log.error(ex);
                if (notificationId) notifications.remove(notificationId);
                if (errorNotification) notifications.showError(errorNotification.title, 'An unexpected error occured. Check log.');
                deferred.reject({ Exception: ex });
            }
            return deferred.promise;
        }

        function _call(params) {
            var args = {
                notifications: _getNotifications({
                    description: params.description,
                    action: params.actionName,
                }),
                action: params.action,
            };
            return call(args);
        }

        function _getNotifications(params) {
            if (!params.description || params.description.length === 0)
                return;
            var description = params.description,
                upperFirstLetterDescription = description[0].toUpperCase() + description.substring(1),
                lowerFirstLetterDescription = description[0].toLowerCase() + description.substring(1),
                title, spinningPrefix, successSuffix, errorPrefix;
            var actionNotificationSetting = _notificationSettings[params.action];
            if (!actionNotificationSetting)
                return;

            title = actionNotificationSetting.title;
            spinningPrefix = actionNotificationSetting.spinningPrefix;
            successSuffix = actionNotificationSetting.successSuffix;
            errorPrefix = actionNotificationSetting.errorPrefix;
            return {
                spinning: (params.showSpinnerNotifications || true) && { title: title, message: spinningPrefix + lowerFirstLetterDescription },
                success: (params.showSuccessNoifications || true) && { title: upperFirstLetterDescription, message: upperFirstLetterDescription + successSuffix },
                error: (params.showErrorNoifications || true) && { title: 'Error!', message: errorPrefix + lowerFirstLetterDescription + '.' },
            };
        }

        function _getData(response) {
            return response && angular.isDefined(response.data) ? response.data : response;
        }
    }
})();
(function () {
    'use strict';

    angular.module('courses.services')
            .service('Course', Courses);

    function Courses(resource) {
        'ngInject';

        var courseResource = resource({
            url: 'api/courses',
            listName: 'Course',
            name: 'course'
        });

        courseResource.students = function (courseId) {
            return courseResource.query({
                url: 'api/courses/' + courseId + '/students',
            });
        };

        return courseResource;
    }
})();
(function () {
    'use strict';

    angular.module('courses.services')
        .factory('transformData', transformFactory);

    function transformFactory() {
        function transformObject(data) {
            var obj = {};

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var newPropName = prop.charAt(0).toLowerCase() + prop.substring(1);
                    newPropName = newPropName.replace(' ', '').replace('-', '');
                    obj[newPropName] = data[prop];
                }
            }

            return obj;
        }

        function transform(data) {
            if (angular.isArray(data)) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(transform(data[i]));
                }
                return arr;
            }

            if (angular.isObject(data)) {
                return transformObject(data);
            }
        }

        return function (data) {
            return angular.isDefined(data) ? transform(data) : data;
        };
    }

})();
(function () {
    'use strict';

    angular.module('courses.services')
        .service('httpClient', Helper);

    function Helper($q, $http, settings, transformData) {
        'ngInject';

        var self = this;

        self.getUrl = getUrl;
        self.getDataFromResponse = getDataFromResponse;
        self.get = function (url, params) {
            return _http(url, 'GET', params);
        };
        self.post = function (url, data) {
            return _http(url, 'POST', undefined, data);
        };
        self.put = function (url, params, data) {
            return _http(url, 'PUT', params, data);
        };
        self.delete = function (url, params) {
            return _http(url, 'DELETE', params);
        };

        /// =================== ///

        // this is useful when we need to add constant headers to all requests
        // also, it's good because I can tailor the success and fail behavior        
        function _http(url, method, params, data) {
            var deferred = $q.defer();            
            $http({
                method: method,
                url: getUrl(url),
                data: data,                
                headers: { contentType: "application/json; charset=utf-8" },
                params: params,
            }).then(function (response) {
                var data = response && response.data;                
                return deferred.resolve(data ? transformData(data) : response);
            }).catch(function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function getUrl(url) {
            var wsUrl = settings.webserviceUrl;
            wsUrl = wsUrl + (wsUrl.charAt(wsUrl.length - 1) === '/' ? '' : '/');
            return wsUrl + (url.charAt(0) ===  '/' ? url.substring(1) : url);
        }

        function getDataFromResponse(response) {
            return response && angular.isDefined(response.data) ? response.data : response;
        }
    }
})();
(function () {
    'use strict';

    angular.module('courses.services')
        .factory('resource', resourceFactory);

    function resourceFactory(httpClient, apiHelper, notifications) {
        'ngInject';

        /*  opts
        *  {
        *      url: url, can override in save/delete options
        *      listName: name used in notifications, can override in save/delete options
        *      name: name used in notifications, can override in save/delete options
        *      id: name of id property, id can be provided explicitily in save/delete options
        *      getId: function to get id from data, id can be provided explicitily in save/delete options
        *  }
        */
        return function (opts) {
            opts = opts || {};
            if (!opts.url) {
                throw new Error('Url is required.');
            }
            if (opts.id && !angular.isString(opts.id))
                throw new Error("id should be the name of id property");
            if (opts.getId && !angular.isFunction(opts.getId))
                throw new Error("getId should be a function to get id from data");
            var getId = function (data) {
                if (opts.id)
                    return data[opts.id];
                if (opts.getId)
                    return opts.getId(data);
                return data.id || data.Id;
            };

            var Resource = function (data) {
                angular.extend(this, data);

                this.$save = function (options) {
                    return _save(this, options);
                };

                this.$delete = function (options) {
                    return _delete(this, options);
                };
            };

            Resource.query = _query;
            Resource.get = _get;
            Resource.save = _save;
            Resource.delete = _delete;

            /// ========== ///

            /*
             * All options in these methods are the same:
             * {
             *      id: use this id in delete or save
             *      url: use this url instead of default
             *      description: used to construct notifications
             *      notifications: used to override notifications
             *      success: what to do on success
             *      error: what to do on error
             * }
             */

            function _save(data, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};

                var promise, method;
                var id = getId(data);
                notifications.clear();
                if (id) {
                    method = 'save';
                    url = url + '/' + id;
                    promise = httpClient.put(url, {}, data);
                } else {
                    method = 'create';
                    promise = httpClient.post(url, data);
                }

                _call(promise, options, method, value);

                return value;
            }

            function _delete(data, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};

                notifications.clear();
                _call(httpClient.delete(url, { id: getId(data) }), options, 'delete', value);

                return value;
            }

            function _query(options) {
                options = options || {};
                var url = options.url || opts.url;
                var list = [];

                _apiCall(httpClient.get(url), options, 'load', true).then(function (data) {
                    if (data && !angular.isArray(data)) {
                        throw new Error('Expected an array from the backend');
                    }
                    angular.forEach(data, function (value) {
                        list.push(value);
                    });
                    options.success && options.success(list);
                }).catch(function (error) {
                    options.error && options.error(error);
                });

                return list;
            }

            function _get(id, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};

                _call(httpClient.get(url, { id: id }), options, 'load', value);

                return value;
            }

            function _apiCall(promise, options, method, isList) {
                var promiseFn = function(){
                    return promise;
                };
                if (options.notifications)
                    return apiHelper.call({ notifications: options.notifications, action: promiseFn });
                return apiHelper[method]({
                    description: options.description || (isList === true ? opts.listName : opts.name),
                    action: promiseFn
                });
            }

            function _call(promise, options, method, value) {
                _apiCall(promise, options, method).then(function (data) {
                    if (data && angular.isArray(data)) {
                        throw new Error('Expected single value from the backend');
                    }
                    angular.copy(data, value);
                    options.success && options.success(value);
                }).catch(function (error) {
                    options.error && options.error(error);
                });
            }

            return Resource;

        };
    }
})();
(function () {
    'use strict';

    angular.module('courses.services')
            .service('Student', Student);

    function Student(resource) {
        'ngInject';

        return resource({
            url: 'api/students',
            listName: 'Students',
            name: 'Student'
        });
    }
})();
(function () {
    'use strict';

    angular.module('courses.services')
            .service('Teacher', Teacher);

    function Teacher(resource) {
        'ngInject';

        return resource({
            url: 'api/teachers',
            listName: 'Teachers',
            name: 'Teacher'
        });
    }
})();