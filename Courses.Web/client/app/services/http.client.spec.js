(function () {
    'use strict';

    describe('http helper', function () {
        var $httpBackend, httpClient, settings;

        beforeEach(module('courses.services'));

        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: ''
                };
            });
        }));

        beforeEach(inject(function (_$httpBackend_, _httpClient_, _settings_) {
            $httpBackend = _$httpBackend_;
            httpClient = _httpClient_;
            settings = _settings_;
        }));

        describe('get url', function () {

            it('should add trailing slash to webservice url', function () {
                var apiUrl = 'api/tests/';
                settings.webserviceUrl = 'http://wbtest.com';
                var expectedUrl = 'http://wbtest.com/api/tests/';

                var url = httpClient.getUrl(apiUrl);

                expect(url).toEqual(expectedUrl);
            });

            it('should omit slash from url if it starts with it', function () {
                var apiUrl = '/api/tests/';
                settings.webserviceUrl = 'http://wbtest.com';
                var expectedUrl = 'http://wbtest.com/api/tests/';

                var url = httpClient.getUrl(apiUrl);

                expect(url).toEqual(expectedUrl);
            });

            it('should do nothing if webservice url ends with slash and url does start with slash', function () {
                var apiUrl = 'api/tests/';
                settings.webserviceUrl = 'http://wbtest.com/';
                var expectedUrl = 'http://wbtest.com/api/tests/';

                var url = httpClient.getUrl(apiUrl);

                expect(url).toEqual(expectedUrl);
            });

            it('should use slash if webservice url ends with slash and url starts with one', function () {
                var apiUrl = '/api/tests/';
                settings.webserviceUrl = 'http://wbtest.com/';
                var expectedUrl = 'http://wbtest.com/api/tests/';

                var url = httpClient.getUrl(apiUrl);

                expect(url).toEqual(expectedUrl);
            });
        });

        describe('http requests', function () {
            var wsUrl = 'http://wbtest.com/',
            coursesUrl = 'json/courses.json';
            var expectedCourses = [{ name: 'Biology' }];

            beforeEach(function () {
                settings.webserviceUrl = 'http://wbtest.com/';
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should use extract response.data when request is successful', function () {
                var url = wsUrl + coursesUrl;
                $httpBackend.expectGET(url)
                        .respond(expectedCourses);

                var courses = [];
                httpClient.get(coursesUrl, {}).then(function (data) {
                    courses = data;
                });

                $httpBackend.flush();

                expect(courses).toEqual(expectedCourses);
            });

            it('should leave data unchanged when request fails', function () {
                var url = wsUrl + coursesUrl;
                $httpBackend.expectGET(url)
                        .respond(400, "Very bad request");

                var courses = [];
                httpClient.get(coursesUrl, {}).then(function (data) {
                    if (data) courses = data;
                });

                $httpBackend.flush();

                expect(courses).toEqual([]);
            });

            it('should use GET method when httpClient.get is called', function () {
                var url = wsUrl + coursesUrl;
                $httpBackend.expectGET(url)
                        .respond(expectedCourses);

                httpClient.get(coursesUrl, {});

                $httpBackend.flush();
            });

            it('should use POST method when httpClient.post is called', function () {
                var url = wsUrl + coursesUrl, course = { name: 'Math' };
                $httpBackend.when('POST', url, course)
                        .respond(200);

                httpClient.post(coursesUrl, course);

                $httpBackend.flush();
            });

            it('should use PUT method when httpClient.put is called', function () {
                var url = wsUrl + coursesUrl + '?id=1', course = { name: 'Math' };
                $httpBackend.expectPUT(url, course)
                        .respond(200);

                httpClient.put(coursesUrl, { id: 1 }, course);

                $httpBackend.flush();
            });

            it('should use PUT method when httpClient.put is called', function () {
                var url = wsUrl + coursesUrl + '?id=1';
                $httpBackend.expectDELETE(url)
                        .respond(200);

                httpClient.delete(coursesUrl, { id: 1 });

                $httpBackend.flush();
            });
        });
    });
})();