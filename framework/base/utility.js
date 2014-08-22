/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

/**
 * Utility base class.
 * @property {object} params
 * @class Application
 */
Nyama.defineClass('Nyama.base.Utility', {
	/**
	 * @var {object} utility params.
	 */
	params: {},

	/**
	 * @constructor
	 * @param {object} params
	 */
	constructor: function(params) {
		this.params = params || {};
	}
});