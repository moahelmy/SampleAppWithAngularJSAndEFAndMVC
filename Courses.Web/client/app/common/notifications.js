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