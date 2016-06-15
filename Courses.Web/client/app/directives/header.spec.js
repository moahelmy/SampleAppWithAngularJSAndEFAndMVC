(function () {
    'use strict';

    describe('footer', function () {

        beforeEach(module('courese.directives.layout'));

        describe('header controller', function () {

            var ctrl;

            beforeEach(inject(function ($componentController) {
                ctrl = $componentController('courses.header');
            }));

            it('should have a non-empty title', function () {
                expect(ctrl.title).not.toBe('');
            });

        });

    });
})();