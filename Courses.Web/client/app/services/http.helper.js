(function () {
    'use strict';

    angular.module('courses.services')
        .service('httpHelper', Helper);

    function Helper($q, $http, settings) {
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
        // also, it's god because I can tailor the success and fail behavior
        // same technique will apply for $resource
        function _http(url, method, params, data) {
            return $http({
                method: method,
                url: getUrl(url),
                params: params,
                headers: { 'Content-Type': 'application/json ; ' },
                data: data
            }).then(function (response) {
                return response && response.data || response;
            }).catch(function (response) {
                $q.reject(response);
            });
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