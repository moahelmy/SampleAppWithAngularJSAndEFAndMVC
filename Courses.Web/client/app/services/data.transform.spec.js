(function () {
    'use strict';

    describe('data transform', function () {
        var transformData;

        angular.module('courses.settings', []);
        beforeEach(module(function ($provide) {
            $provide.factory('settings', function () {
                return {
                    webserviceUrl: baseUrl
                };
            });
        }));

        beforeEach(module('courses.services'));

        beforeEach(inject(function (_transformData_) {
            transformData = _transformData_;
        }));

        it('should lowercase first letter of property name', function () {
            var test = { Name: 'test' };
            var data = transformData(test);

            expect(data.name).toEqual(test.Name);
        });

        it('should remove spaces and upper case following letter', function () {
            var test = { 'first name': 'test' };
            var data = transformData(test);

            expect(data.firstName).toEqual(test['first name']);
        });

        it('should remove hyphens and upper case following letter', function () {
            var test = { 'first-name': 'test' };
            var data = transformData(test);

            expect(data.firstName).toEqual(test['first-name']);
        });

        it('should remove underscores and upper case following letter', function () {
            var test = { 'first_name': 'test' };
            var data = transformData(test);

            expect(data.firstName).toEqual(test['first_name']);
        });

        it('should transform each object in array', function () {
            var test = [{ Name: 'test' }];
            var data = transformData(test);

            expect(data[0].name).toEqual(test[0].Name);
        });

        it('should lowercase uppered case properties', function () {
            var test = [{ NAME: 'test' }];
            var data = transformData(test);

            expect(data[0].name).toEqual(test[0].NAME);
        });
    });
})();