(function () {
    'use strict';

    angular.module('courses.main')
        .controller('StudentEditDialogController', EditStudentController);


    function EditStudentController(Student, $uibModalInstance, student) {
        'ngInject';

        var vm = this;

        vm.student = student || {};
        vm.save = save;
        vm.cancel = cancel;

        /// ============== ///

        function save() {
            Student.save(vm.student, {
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