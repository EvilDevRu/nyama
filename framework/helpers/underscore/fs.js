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
	 * Returns trailing name component of path.
	 * @param {string} path path to a file.
	 * @param {string} suffix if path ends for suffix then erase it.
	 * @return {string}
	 */
	baseName: function(path, suffix) {
		path = path.replace(/^.*[\/\\]/g, '');
		if (_.isString(suffix) && path.substr(path.length - suffix.length) === suffix) {
			path = path.substr(0, path.length - suffix.length);
		}

		return path;
	},

	/**
	 * Given a string containing the path of a file or directory.
	 * @param {string} path path to a directory or file.
	 * @return {string}
	 */
	dirName: function(path) {
		return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
	},

	/**
	 * Returns extension of a file.
	 * @param {string} fileName name of file.
	 * @return {string} file extension.
	 */
	fileExt: function(fileName) {
		return _.isString(fileName) ? _.last(fileName.split('.')) : '';
	},

	/**
	 * Tells whether the path is a regular file.
	 * @param {string} path path to a file.
	 * @returns {boolean}
	 */
	isFile: function(path) {
		try {
			return _.fs.lstatSync(path).isFile();
		}
		catch (e) {
			return false;
		}
	},

	/**
	 * Tells whether the dirName is a directory.
	 * @param {string} path path to a directory.
	 * @returns {boolean}
	 */
	isDir: function(path) {
		try {
			return _.fs.lstatSync(path).isDirectory();
		}
		catch (e) {
			return false;
		}
	},

	/**
	 * Make directory.
	 * @param {string} path path to a directory.
	 * @param {number} mode directory access mode.
	 * @returns {boolean} returns true if directory is successfully created.
	 */
	mkDir: function(path, mode) {
		try {
			_.fs.mkdirSync(path, mode);
		}
		catch (e) {
			return false;
		}

		return true;
	}
};