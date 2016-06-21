(function () {
    'use strict';

    describe('students service', function () {
        var baseUrl = './', $httpBackend, Student, studentsList = [{
            name: 'Mohammad Helmy',
            age: '33',
            gpa: '3.8',
        }];

        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: baseUrl
                };
            });
        }));

        beforeEach(module('courses.notifications'));
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

        beforeEach(inject(function (_Student_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;

            $httpBackend.expectGET('./api/students')
                        .respond(studentsList);
            Student = _Student_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should populate courses from backend', function () {
            var students = Student.query();
            expect(students).toEqual([]);

            $httpBackend.flush();
            expect(students).toEqual(studentsList);
        });
    });
})();