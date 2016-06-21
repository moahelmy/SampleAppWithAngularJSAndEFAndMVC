(function () {
    'use strict';

    angular.module('courses.services')
            .service('Student', Student);

    function Student(resource) {
        'ngInject';

        return resource({
            url: 'api/students',
            listName: 'Students',
            name: 'Student'
        });
    }
})();