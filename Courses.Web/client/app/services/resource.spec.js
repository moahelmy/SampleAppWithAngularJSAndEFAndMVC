(function () {
    'use strict';

    describe('custom resource', function () {
        var httpClient, apiHelper, resource, $rootScope, $q;
        var baseUrl = './', relativeUrl = 'api/tests', fullUrl = './api/tests';

        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: baseUrl
                };
            });
        }));

        angular.module('courses.notifications', []);
        beforeEach(module(function ($provide) {
            $provide.factory('notifications', function () {
                return jasmine.createSpyObj('notification', [
                    'showError',
                    'showSuccess',
                    'showInfo',
                    'showSpinner',
                    'showErrors',
                    'clear',
                    'remove'
                ]);
            });
        }));

        beforeEach(module('courses.services'));

        beforeEach(inject(function (_httpClient_, _apiHelper_, _resource_, _$rootScope_, _$q_) {
            resource = _resource_;
            httpClient = _httpClient_;
            apiHelper = _apiHelper_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        }));

        describe('initialize', function () {
            it("should throw an exception if no options provided", function () {
                expect(function () {
                    return resource();
                }).toThrowError(/Url/);
            });

            it("should throw an exception if options has no url", function () {
                expect(function () {
                    return resource({});
                }).toThrowError(/Url/);
            });

            it("should throw an exception if options.url is empty", function () {
                expect(function () {
                    return resource({ url: '' });
                }).toThrowError(/Url/);
            });

            it("should throw an exception if options.id is not a string", function () {
                expect(function () {
                    return resource({ url: '/api/test', id: 1 });
                }).toThrowError(/id/);
            });

            it("should not throw an exception if options.id is a string", function () {
                expect(function () {
                    return resource({ url: '/api/test', id: 'userId' });
                }).not.toThrowError(/id/);
            });

            it("should throw an exception if options.getId is not a function", function () {
                expect(function () {
                    return resource({ url: '/api/test', getId: 'id' });
                }).toThrowError(/getId[\w\s]+function/);
            });

            it("should not throw an exception if options.getId is a function", function () {
                expect(function () {
                    return resource({ url: '/api/test', getId: function () { } });
                }).not.toThrowError(/getId[\w\s]+function/);
            });
        });

        describe('query', function () {
            var list = [{ name: 'test' }];
            var resourceOptions = { url: relativeUrl, listName: 'Users' };
            var prepare = function (options, backEndReturn) {
                var testResource = resource(resourceOptions);
                var promise = $q.when(backEndReturn || list);
                spyOn(httpClient, 'get').and.returnValue(promise);
                spyOn(apiHelper, 'call').and.returnValue(promise);
                spyOn(apiHelper, 'load').and.returnValue(promise);

                return testResource.query(options);
            };

            it('should hit get on httpClient', function () {
                var data = prepare();

                expect(httpClient.get).toHaveBeenCalledWith(relativeUrl);
            });

            it('should use options.url if defined', function () {
                var testUrl = 'api/users';
                var data = prepare({ url: testUrl });

                expect(httpClient.get).toHaveBeenCalledWith(testUrl);
            });

            it('should fill data after call back', function () {
                var data = prepare();

                expect(data).toEqual([]);
                $rootScope.$apply();
                expect(data).toEqual(list);
            });

            it('should throw an error if non-array returned from the backend', function () {
                expect(function () {
                    prepare({}, {});

                    $rootScope.$apply();
                }).toThrowError(/array/);
            });

            it('should call fail on error', function () {
                var _fail = jasmine.createSpy('error');
                var testResource = resource({ url: relativeUrl });
                spyOn(httpClient, 'get').and.returnValue($q.reject('error'));
                spyOn(apiHelper, 'load').and.returnValue($q.reject('error'));

                var data = testResource.query({ error: _fail });

                $rootScope.$apply();
                expect(_fail).toHaveBeenCalledWith('error');
            });

            it('should call success on success', function () {
                var _success = jasmine.createSpy('success');
                var data = prepare({ success: _success });

                $rootScope.$apply();
                expect(_success).toHaveBeenCalledWith(list);
            });

            it('should use notifications if given', function () {
                var notifications = {
                    success: { title: 'Success', message: 'Saved!' }
                };
                var data = prepare({
                    notifications: notifications
                });

                $rootScope.$apply();
                expect(apiHelper.call).toHaveBeenCalled();

            });

            it('should use description if given', function () {
                var data = prepare({
                    description: 'test'
                });

                $rootScope.$apply();
                expect(apiHelper.load).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: 'test'
                }));
            });

            it('should use resource description if none given', function () {
                var data = prepare();

                $rootScope.$apply();
                expect(apiHelper.load).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: resourceOptions.listName
                }));
            });
        });

        describe('get', function () {
            var result = { name: 'test' };
            var resourceOptions = { url: relativeUrl, name: 'Users' };
            var prepare = function (options, backEndReturn) {
                var testResource = resource(resourceOptions);
                var promise = $q.when(backEndReturn || result);
                spyOn(httpClient, 'get').and.returnValue(promise);
                spyOn(apiHelper, 'call').and.returnValue(promise);
                spyOn(apiHelper, 'load').and.returnValue(promise);

                return testResource.get(1, options);
            };

            it('should hit get on httpClient', function () {
                var data = prepare();

                expect(httpClient.get).toHaveBeenCalledWith(relativeUrl, { id: 1 });
            });

            it('should use options.url if defined', function () {
                var testUrl = 'api/users';
                var data = prepare({ url: testUrl });

                expect(httpClient.get).toHaveBeenCalledWith(testUrl, { id: 1 });
            });

            it('should fill data after call back', function () {
                var data = prepare();

                expect(data).toEqual({});
                $rootScope.$apply();
                expect(data).toEqual(result);
            });

            it('should throw an error if array returned from the backend', function () {
                expect(function () {
                    prepare({}, []);

                    $rootScope.$apply();
                }).toThrowError(/single/);
            });

            it('should call fail on error', function () {
                var _fail = jasmine.createSpy('error');
                var testResource = resource({ url: relativeUrl });
                spyOn(httpClient, 'get').and.returnValue($q.reject('error'));
                spyOn(apiHelper, 'load').and.returnValue($q.reject('error'));

                var data = testResource.get(1, { error: _fail });

                $rootScope.$apply();
                expect(_fail).toHaveBeenCalledWith('error');
            });

            it('should call success on success', function () {
                var _success = jasmine.createSpy('success');
                var data = prepare({ success: _success });

                $rootScope.$apply();
                expect(_success).toHaveBeenCalledWith(result);
            });

            it('should use notifications if given', function () {
                var notifications = {
                    success: { title: 'Success', message: 'Saved!' }
                };
                var data = prepare({
                    notifications: notifications
                });

                $rootScope.$apply();
                expect(apiHelper.call).toHaveBeenCalled();

            });

            it('should use description if given', function () {
                var data = prepare({
                    description: 'test'
                });

                $rootScope.$apply();
                expect(apiHelper.load).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: 'test'
                }));
            });

            it('should use resource description if none given', function () {
                var data = prepare();

                $rootScope.$apply();
                expect(apiHelper.load).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: resourceOptions.name
                }));
            });
        });

        describe('save', function () {
            var result = { id: 1, name: 'test' };
            var resultWithoutId = { name: 'test' };
            var resourceOptions = { url: relativeUrl, name: 'User' };
            var prepare = function (isNew, options, backEndReturn) {
                var testResource = resource(resourceOptions);
                var promise = $q.when(backEndReturn || result);
                spyOn(httpClient, 'post').and.returnValue(promise);
                spyOn(httpClient, 'put').and.returnValue(promise);
                spyOn(apiHelper, 'call').and.returnValue(promise);
                spyOn(apiHelper, 'create').and.returnValue(promise);
                spyOn(apiHelper, 'save').and.returnValue(promise);

                return testResource.save(isNew ? resultWithoutId : result, options);
            };

            it('should hit post on httpClient if entity is new', function () {
                var data = prepare(true);

                expect(httpClient.post).toHaveBeenCalledWith(relativeUrl, jasmine.any(Object));
            });

            it('should hit put on httpClient if entity exists', function () {
                var data = prepare(false);

                expect(httpClient.put).toHaveBeenCalledWith(relativeUrl + '/' + result.id, jasmine.any(Object), result);
            });

            it('should use options.url if defined', function () {
                var testUrl = 'api/users';
                var data = prepare(true, { url: testUrl });

                expect(httpClient.post).toHaveBeenCalledWith(testUrl, jasmine.any(Object));
            });

            it('should fill data after call back', function () {
                var data = prepare(true);

                expect(data).toEqual({});
                $rootScope.$apply();
                expect(data).toEqual(result);
            });

            it('should throw an error if array returned from the backend', function () {
                expect(function () {
                    prepare(true, {}, []);

                    $rootScope.$apply();
                }).toThrowError(/single/);
            });

            it('should call fail on error', function () {
                var _fail = jasmine.createSpy('error');
                var testResource = resource({ url: relativeUrl });
                spyOn(httpClient, 'post').and.returnValue($q.reject('error'));
                spyOn(apiHelper, 'create').and.returnValue($q.reject('error'));

                var data = testResource.save(resultWithoutId, { error: _fail });

                $rootScope.$apply();
                expect(_fail).toHaveBeenCalledWith('error');
            });

            it('should call success on success', function () {
                var _success = jasmine.createSpy('success');
                var data = prepare(true, { success: _success });

                $rootScope.$apply();
                expect(_success).toHaveBeenCalledWith(result);
            });

            it('should use notifications if given', function () {
                var notifications = {
                    success: { title: 'Success', message: 'Saved!' }
                };
                var data = prepare(true, {
                    notifications: notifications
                });

                $rootScope.$apply();
                expect(apiHelper.call).toHaveBeenCalled();
            });

            it('should use description if given', function () {
                var data = prepare(true, {
                    description: 'test'
                });

                $rootScope.$apply();
                expect(apiHelper.create).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: 'test'
                }));
            });

            it('should use resource description if none given', function () {
                var data = prepare(true);

                $rootScope.$apply();
                expect(apiHelper.create).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: resourceOptions.name
                }));
            });
        });

        describe('delete', function () {
            var result = { name: 'test' };
            var resourceOptions = { url: relativeUrl, name: 'User' };
            var prepare = function (options, backEndReturn) {
                var testResource = resource(resourceOptions);
                var promise = $q.when(backEndReturn || result);
                spyOn(httpClient, 'delete').and.returnValue(promise);
                spyOn(apiHelper, 'call').and.returnValue(promise);
                spyOn(apiHelper, 'delete').and.returnValue(promise);

                return testResource.delete({ id: 1 }, options);
            };

            it('should hit delete on httpClient', function () {
                var data = prepare();

                expect(httpClient.delete).toHaveBeenCalledWith(relativeUrl, { id: 1 });
            });

            it('should use options.url if defined', function () {
                var testUrl = 'api/users';
                var data = prepare({ url: testUrl });

                expect(httpClient.delete).toHaveBeenCalledWith(testUrl, { id: 1 });
            });

            it('should fill data after call back', function () {
                var data = prepare();

                expect(data).toEqual({});
                $rootScope.$apply();
                expect(data).toEqual(result);
            });

            it('should throw an error if array returned from the backend', function () {
                expect(function () {
                    prepare({}, []);

                    $rootScope.$apply();
                }).toThrowError(/single/);
            });

            it('should call fail on error', function () {
                var _fail = jasmine.createSpy('error');
                var testResource = resource({ url: relativeUrl });
                spyOn(httpClient, 'get').and.returnValue($q.reject('error'));
                spyOn(apiHelper, 'load').and.returnValue($q.reject('error'));

                var data = testResource.get(1, { error: _fail });

                $rootScope.$apply();
                expect(_fail).toHaveBeenCalledWith('error');
            });

            it('should call success on success', function () {
                var _success = jasmine.createSpy('success');
                var data = prepare({ success: _success });

                $rootScope.$apply();
                expect(_success).toHaveBeenCalledWith(result);
            });

            it('should use notifications if given', function () {
                var notifications = {
                    success: { title: 'Success', message: 'Saved!' }
                };
                var data = prepare({
                    notifications: notifications
                });

                $rootScope.$apply();
                expect(apiHelper.call).toHaveBeenCalled();

            });

            it('should use description if given', function () {
                var data = prepare({
                    description: 'test'
                });

                $rootScope.$apply();
                expect(apiHelper.delete).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: 'test'
                }));
            });

            it('should use resource description if none given', function () {
                var data = prepare();

                $rootScope.$apply();
                expect(apiHelper.delete).toHaveBeenCalledWith(jasmine.objectContaining({
                    description: resourceOptions.name
                }));
            });
        });
    });
})();