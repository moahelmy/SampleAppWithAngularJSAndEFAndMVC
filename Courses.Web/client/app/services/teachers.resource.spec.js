(function () {
    'use strict';

    describe('courses service', function () {
        var $httpBackend, baseUrl = './', Teacher, teachersList = [{
            id: 1,
            name: 'Mark Wilson',
        }
        ];


        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: baseUrl
                };
            });
        }));
        
        beforeEach(module('courses.services'));

        beforeEach(inject(function (_Teacher_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;

            Teacher = _Teacher_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should populate courses from backend', function () {
            $httpBackend.expectGET('./api/teachers')
                        .respond(teachersList);

            var teachers = Teacher.query();
            expect(teachers).toEqual([]);

            $httpBackend.flush();
            expect(teachers).toEqual(teachersList);
        });
    });
})();