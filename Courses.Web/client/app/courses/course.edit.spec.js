(function () {
    'use strict';

    describe('edit courses', function () {
        var $httpBackend, ctrl, teachersList = [
            {
                id: 1,
                name: 'Will Smith'
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

        beforeEach(inject(function ($componentController, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('./api/teachers')
                        .respond(teachersList);

            ctrl = $componentController('courseEdit');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should populate teachers from backend', function () {
            expect(ctrl.teachers).toEqual([]);

            $httpBackend.flush();
            expect(ctrl.teachers).toEqual(teachersList);
        });

        it('should update course when teacher selected', function () {
            $httpBackend.flush();

            ctrl.teachers = teachersList;

            ctrl.teacherSelected(teachersList[0]);

            expect(ctrl.course.teacherId).toEqual(teachersList[0].id);
            expect(ctrl.course.teacherName).toEqual(teachersList[0].name);
        });
    });
})();