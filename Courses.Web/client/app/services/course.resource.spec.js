(function () {
    'use strict';

    describe('courses service', function () {
        var $httpBackend, baseUrl = './', Course, coursesList = [{
                name: 'Biology',
                location: 'Building 1 - Room 102',
                teacher: 'Adam Smith',
            }
        ], studentsList = [{
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

        beforeEach(inject(function (_Course_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;

            Course = _Course_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should populate courses from backend', function () {
            $httpBackend.expectGET('./api/courses')
                        .respond(coursesList);

            var courses = Course.query();
            expect(courses).toEqual([]);

            $httpBackend.flush();
            expect(courses).toEqual(coursesList);
        });

        it('should populate students for course from backend', function () {
            $httpBackend.expectGET('./api/courses/1/students')
                        .respond(studentsList);

            var students = Course.students(1);
            expect(students).toEqual([]);

            $httpBackend.flush();
            expect(students).toEqual(studentsList);
        });
    });
})();