/**
 * Nyama core.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
 */

'use strict';

var Class = require(__dirname + '/helpers/class.js');

/**
 * @class Nyama
 *
 * @property {object} _mapClasses
 * @property async async
 * @property fs fs
 * @property Application app
 */
Class.defineClass('Nyama', {
	__static: {
		defineClass: Class.defineClass,

		/**
		 * @var {object} components container.
		 */
		components: {},

		/**
		 * Create application.
		 * @param {object} params
		 */
		createApplication: function(params) {
			require(__dirname + '/base/application.js');
			require(__dirname + '/base/utility.js');
			return new Nyama.base.Application(params || {});
		}
	}
});