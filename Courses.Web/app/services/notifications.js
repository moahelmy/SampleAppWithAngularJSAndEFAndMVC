(function () {
    'use strict';

    var NotificationService = (function () {
        function NotificationService(toaster) {
            var self = this, _id = 1;

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
                var id = _id++;
                toaster.pop({
                    type: type,
                    title: title,
                    body: message,
                    timeout: timeout,
                    notifyCloseButton: true,
                    toastId: id,
                });

                return id;
            }

            function showErrors(errorMessages, title) {
                angular.forEach(errorMessages, function (value, key) {
                    self.showError(title || key, value);
                });
            }
        }

        NotificationService.$inject = ['toaster'];
        return NotificationService;
    })();

    angular.module('courses.common.services')
            .service('notifications', NotificationService);
})();