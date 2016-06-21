(function () {
    'use strict';

    describe('courses', function () {
        var $httpBackend, ctrl, courses = [{
                name: 'Biology',
                location: 'Building 1 - Room 102',
                teacher: 'Adam Smith',
                students: [{
                    name: 'Mohammad Helmy',
                    age: '33',
                    gpa: '3.8',
                }],
            }
        ];

        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: '.'
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
        beforeEach(module('courses.common'));
        beforeEach(module('courses.main'));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        beforeEach(inject(function ($componentController, _$httpBackend_) {
            $httpBackend = _$httpBackend_;

            $httpBackend.expectGET('./api/courses')
                        .respond(courses);
            ctrl = $componentController('coursesList');
        }));

        it('should populate courses from backend', function () {
            expect(ctrl.courses).toEqual([]);

            $httpBackend.flush();
            expect(ctrl.courses).toEqual(courses);
        });
    });
})();