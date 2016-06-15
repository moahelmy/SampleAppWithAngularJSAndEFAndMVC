(function () {
    'use strict';

    describe('footer', function () {

        beforeEach(module('courese.directives.layout'));

        describe('footer.controller', function () {

            var ctrl;

            beforeEach(inject(function ($componentController) {
                ctrl = $componentController('courses.footer');
            }));

            it('should have author as moahelmy', function () {
                expect(ctrl.author).toBe('Mohammad Helmy (@moahelmy)');
            });

        });

    });
})();