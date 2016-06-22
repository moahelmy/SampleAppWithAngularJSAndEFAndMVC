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

        beforeEach(module('courses.main'));        
        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: '.'
                };
            });
        }));       

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