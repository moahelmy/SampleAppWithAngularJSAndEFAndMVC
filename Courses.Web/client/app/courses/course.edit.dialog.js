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