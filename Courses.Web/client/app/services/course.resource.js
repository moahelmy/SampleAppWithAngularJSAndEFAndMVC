(function () {
    'use strict';

    angular.module('courses.services')
            .service('Course', Courses);

    function Courses(resource) {
        'ngInject';

        var courseResource = resource({
            url: 'api/courses',
            nameList: 'Course',
            name: 'course'
        });

        courseResource.students = function (courseId) {
            return courseResource.query({
                url: 'api/courses/' + courseId + '/students',
            });
        };

        return courseResource;
    }
})();