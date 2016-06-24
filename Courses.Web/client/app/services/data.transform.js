(function () {
    'use strict';

    angular.module('courses.services')
        .factory('transformData', transformFactory);

    function transformFactory() {
        function transformObject(data) {
            var obj = {};

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var newPropName = _lower(prop);
                    var splitted = newPropName.split(/[\s-_]+/);
                    for (var i = 1; i < splitted.length; i++) {
                        splitted[i] = _upperFirstLetter(splitted[i]);
                    }
                    newPropName = splitted.join('');
                    obj[newPropName] = data[prop];
                }
            }

            return obj;
        }

        function _lower(val) {
            if (_allUpper(val))
                return val.toLowerCase();
            return val !== '' && val.charAt(0).toLowerCase() + val.substring(1);
        }

        function _allUpper(value) {
            for (var i = 0; i < value.length; i++) {
                if (value.charAt(i) !== value.charAt(i).toUpperCase())
                    return false;
            }
            return true;
        }

        function _upperFirstLetter(val) {
            return val !== '' && val.charAt(0).toUpperCase() + val.substring(1);
        }

        function _transform(data) {
            if (angular.isArray(data)) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(_transform(data[i]));
                }
                return arr;
            }

            if (angular.isObject(data)) {
                return transformObject(data);
            }
        }

        return function (data) {
            return angular.isDefined(data) ? _transform(data) : data;
        };
    }

})();