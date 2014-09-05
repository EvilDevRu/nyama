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
	},

	/**
	 * Convert string to latin and back.
	 * @param {string} string
	 * @param {boolean} isDecode
	 * @return {string} decoded or encoded string.
	 */
	translit: function(string, isDecode) {
		var rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g),
			x;

		for (x = 0; x < rus.length; x++) {
			string = string.split(isDecode ? eng[x] : rus[x]).join(isDecode ? rus[x] : eng[x]);
			string = string.split(isDecode ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(isDecode ? rus[x].toUpperCase() : eng[x].toUpperCase());
		}

		return string;
	}
};