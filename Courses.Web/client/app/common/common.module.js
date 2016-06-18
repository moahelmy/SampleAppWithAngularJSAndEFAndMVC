(function () {
	'use strict';
	angular.module('courses.common', [
			/* Angular modules */
			'ngMessages',

			/* Cross-app modules */
			'courses.settings',
			'courses.notifications',
			'courses.services',

			/* App directives */
			'courese.directives',

			/* 3rd Party modules */
			'ui.bootstrap',
			'ui.router',
			'ui.select',
			'ui.grid',
			'ui.grid.selection',
			'ui.grid.pagination',
			'ui.grid.autoResize',
			'toaster']
		)
		// if config grow bigger it will be moved to separate file
		.config(['toasterConfig', function (toasterConfig) {
			toasterConfig['close-button'] = true;
			toasterConfig['position-class'] = 'toast-top-right';
			toasterConfig['newest-on-top'] = false;
			toasterConfig.limit = 50;
		}]);
}());
