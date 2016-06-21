(function () {
    'use strict';

    angular.module('courses.services')
        .service('httpClient', Helper);

    function Helper($q, $http, settings, transformData) {
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
        // also, it's good because I can tailor the success and fail behavior        
        function _http(url, method, params, data) {
            var deferred = $q.defer();            
            $http({
                method: method,
                url: getUrl(url),
                data: data,                
                headers: { contentType: "application/json; charset=utf-8" },
                params: params,
            }).then(function (response) {
                var data = response && response.data;                
                return deferred.resolve(data ? transformData(data) : response);
            }).catch(function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
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