(function () {
    'use strict';

    angular.module('courses.services')
        .factory('resource', resourceFactory);

    function resourceFactory(httpClient, apiHelper) {
        'ngInject';

        /*  opts
        *  {
        *      url: url, can override in save/delete options
        *      name: name used in notifications, can override in save/delete options
        *      id: name of id property, id can be provided explicitily in save/delete options
        *      getId: function to get id from data, id can be provided explicitily in save/delete options
        *  }
        */
        return function (opts) {
            opts = opts || {};
            if (!opts.url) {
                throw new Error('Url is required.');
            }
            if (opts.id && !angular.isString(opts.id))
                throw new Error("id should be the name of id property");
            if (opts.getId && !angular.isFunction(opts.getId))
                throw new Error("getId should be a function to get id from data");
            var getId = function (data) {
                if (opts.id)
                    return data[opts.id];
                if (opts.getId)
                    return opts.getId(data);
                return data.id || data.Id;
            };

            var Resource = function (data) {
                angular.extend(this, data);

                this.$save = function (options) {
                    return _save(this, options);
                };

                this.$delete = function (options) {
                    return _delete(this, options);
                };
            };

            Resource.query = _query;
            Resource.get = _get;
            Resource.save = _save;
            Resource.delete = _delete;

            /// ========== ///

            /*
             * All options in these methods are the same:
             * {
             *      id: use this id in delete or save
             *      url: use this url instead of default
             *      description: used to construct notifications
             *      notifications: used to override notifications
             *      success: what to do on success
             *      error: what to do on error
             * }
             */

            function _save(data, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};

                var promise, method;
                var id = getId(data);
                if (id) {
                    method = 'save';
                    promise = httpClient.put(url, { id: id }, data);
                } else {
                    method = 'create';
                    promise = httpClient.post(url, data);
                }

                _call(promise, options, method, value);

                return value;
            }

            function _delete(data, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};

                _call(httpClient.delete(url, { id: getId(data) }), options, 'delete', value);

                return value;
            }

            function _query(options) {
                options = options || {};
                var url = options.url || opts.url;
                var list = [];
                
                _apiCall(httpClient.get(url), options, 'load').then(function (data) {
                    if (!angular.isArray(data)) {
                        throw new Error('Expected an array from the backend');
                    }
                    angular.forEach(data, function (value) {
                        list.push(value);
                    });
                    options.success && options.success(list);
                }).catch(function (error) {
                    options.error && options.error(error);
                });

                return list;
            }

            function _get(id, options) {
                options = options || {};
                var url = options.url || opts.url;
                var value = {};
                
                _call(httpClient.get(url, { id: id }), options, 'load', value);

                return value;
            }

            function _apiCall(promise, options, method) {
                var promiseFn = function(){
                    return promise;
                };
                if (options.notifications)
                    return apiHelper.call({ notifications: options.notifications, action: promiseFn });
                return apiHelper[method]({
                    description: options.description || opts.description
                });
            }

            function _call(promise, options, method, value) {
                _apiCall(promise, options, method).then(function (data) {
                    if (angular.isArray(data)) {
                        throw new Error('Expected single value from the backend');
                    }
                    angular.copy(data, value);
                    options.success && options.success(value);
                }).catch(function (error) {
                    options.error && options.error(error);
                });
            }

            return Resource;

        };
    }
})();