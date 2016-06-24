(function () {
    'use strict';

    angular.module('courses.main')
        .controller('CourseDeleteDialogController', DeleteCourseDialogController);


    function DeleteCourseDialogController(Course, $uibModalInstance, course) {
        'ngInject';

        var vm = this;

        vm.course = course || {};
        vm.delete = _delete;
        vm.cancel = cancel;

        /// ============== ///

        function _delete() {
            Course.delete(vm.course, {
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