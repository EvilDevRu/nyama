/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

//	Repository have old version.
var randomUA = require('./libs/random_ua.js');

/**
 * Random UserAgents generator utility.
 * @module Nyama.utils.randomUA
 * @extends Nyama.base.Utility
 */
Nyama.defineClass('Nyama.utils.Useragent', {
	__extends: Nyama.base.Utility,

	/**
	 * @returns {string} random UserAgent.
	 */
	get: function() {
		return randomUA.generate();
	}
});