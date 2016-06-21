(function () {
    'use strict';

    angular.module('courses.services')
            .service('Teacher', Teacher);

    function Teacher(resource) {
        'ngInject';

        return resource({
            url: 'api/teachers',
            listName: 'Teachers',
            name: 'Teacher'
        });
    }
})();