(function () {
    'use strict';

    angular.module('courses.main')
        .controller('StudentDeleteDialogController', DeleteStudentDialogController);


    function DeleteStudentDialogController(Student, $uibModalInstance, student) {
        'ngInject';

        var vm = this;

        vm.student = student || {};
        vm.delete = _delete;
        vm.cancel = cancel;

        /// ============== ///

        function _delete() {
            Student.delete(vm.student, {
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