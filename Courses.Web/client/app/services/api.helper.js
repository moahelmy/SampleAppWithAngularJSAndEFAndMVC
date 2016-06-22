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