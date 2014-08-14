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

module.exports = {
	/**
	 * Find the position of the first occurrence of a substring in a string.
	 * @param {string} needle
	 * @param {string} string
	 * @param {string} offset
	 * @return {number} returns character number of string or -1 if not finded.
	 */
	find: function(needle, string, offset) {
		return _.isString(string) ? string.indexOf(needle, (offset || 0)) : -1;
	},

	/**
	 * Replace substring.
	 * @param {string} string
	 * @param {string} needle
	 * @param {string} replace
	 */
	replace: function(string, needle, replace) {
		return string.split(needle).join(replace);
	},

	/**
	 * Make a string's first character to uppercase.
	 * @param {string} string
	 * @return {string}
	 */
	ucFirst: function(string) {
		string += '';
		return string.charAt(0).toUpperCase() + string.substr(1);
	},

	/**
	 * Make a string's first character to lowercase.
	 * @param {string} string
	 * @return {string}
	 */
	lcFirst: function(string) {
		string += '';
		return string.charAt(0).toLowerCase() + string.substr(1);
	}
};