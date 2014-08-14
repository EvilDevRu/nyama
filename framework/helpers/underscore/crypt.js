/**
 * Helper library contains functional of underscore library
 * and additional functions for Nyama framework.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var crypto = require('crypto');

module.exports = {
	/**
	 * Calculate the md5 hash of a string.
	 * @param {string} string hashing string.
	 * @param {string} salt salt.
	 * @return {string} hashed string.
	 */
	md5: function(string, salt) {
		return crypto.createHmac('md5', salt || null).update(string).digest('hex');
	},

	/**
	 * Calculates the sha1 hash of a string.
	 * @param {string} string hashing string.
	 * @param {string} salt salt.
	 * @return {string} hashed string.
	 */
	sha1: function(string, salt) {
		return crypto.createHmac('sha1', salt || null).update(string).digest('hex');
	}
}