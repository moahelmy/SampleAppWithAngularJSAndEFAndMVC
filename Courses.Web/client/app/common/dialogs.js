(function () {
    'use strict';

    angular.module('course.dialogs', ['ui.bootstrap'])
            .factory('dialog', dialogsFactory);

    function dialogsFactory($uibModal) {
        'ngInject';

        return function (opts) {

            var tUrl = opts.templateUrl;
            return $uibModal.open({
                animation: true,
                template: opts.template,
                templateUrl: tUrl,
                controller: opts.controller,
                controllerAs: opts.controllerAs,
                keyboard: true,
                backdrop: 'static',
                size: opts.size || 'lg',
                resolve: opts.resolve || {
                    data: function () {
                        return opts.data || null;
                    }
                }
            });
        };
    }

})();