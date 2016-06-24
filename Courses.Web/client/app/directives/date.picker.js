(function (app) {
    "use strict";

    angular
        .module('courese.directives.form')
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