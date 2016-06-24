(function () {
    'use strict';

    describe('delete courses', function () {
        var Course, ctrl, $httpBackend, $uibModalInstance;

        beforeEach(module('courses.main'));
        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: '.'
                };
            });
        }));

        beforeEach(module(function ($provide) {
            $provide.factory('$uibModalInstance', function () {
                return jasmine.createSpyObj('$uibModalInstance', [
                    'close',
                    'dismiss',
                ]);
            });
            $provide.factory('course', function () {
                return { id : 1};
            });
        }));

        beforeEach(inject(function ($controller, _$httpBackend_, _$uibModalInstance_) {
            ctrl = $controller('CourseDeleteDialogController');
            $httpBackend = _$httpBackend_;
            $uibModalInstance = _$uibModalInstance_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should call resource delete when delete clicked', function () {
            $httpBackend.expectDELETE('./api/courses/1').respond(200);

            ctrl.delete();

            $httpBackend.flush();
        });

        it('should close dialog on delete', function () {
            $httpBackend.expectDELETE('./api/courses/1').respond(200);

            ctrl.delete();

            $httpBackend.flush();

            expect($uibModalInstance.close).toHaveBeenCalled();
        });

        it('should close dialog on cancel', function () {
            ctrl.cancel();

            expect($uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
})();