(function () {
    'use strict';

    describe('add/edit courses', function () {
        var Course, ctrl, $httpBackend, $uibModalInstance;

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

        beforeEach(module(function ($provide) {
            $provide.factory('$uibModalInstance', function () {
                return jasmine.createSpyObj('$uibModalInstance', [
                    'close',
                    'dismiss',
                ]);
            });
            $provide.factory('course', function () {
                return {};
            });
        }));

        beforeEach(inject(function ($controller, _$httpBackend_, _$uibModalInstance_) {
            ctrl = $controller('CourseEditDialogController');
            $httpBackend = _$httpBackend_;
            $uibModalInstance = _$uibModalInstance_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should call resource save when save clicked', function () {
            $httpBackend.expectPOST('./api/courses').respond(200);

            ctrl.save();

            $httpBackend.flush();
        });

        it('should close dialog on save', function () {
            $httpBackend.expectPOST('./api/courses').respond(200);

            ctrl.save();

            $httpBackend.flush();

            expect($uibModalInstance.close).toHaveBeenCalled();
        });

        it('should close dialog on cancel', function () {
            ctrl.cancel();

            expect($uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
})();