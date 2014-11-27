/**
 * Helper library contains functional of underscore library
 * and additional functions for Nyama.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
 */

'use strict';

global._ = require('underscore');
global._.str = require('./str.js');
global._.crypt = require('./crypt.js');
global._.fs = _.extend(require('./fs.js'), require('fs'));
global._.async = require('async');
global._.intel = require('intel');

/**
 * Embedding heplers functions in a underscore.
 */
_.mixin({
	/**
	 * Replace underscore function "each"
	 * as it uses forEach method by default for speed.
	 * @param obj
	 * @param iterator
	 * @param context
	 */
	each: function(obj, iterator, context) {
		if (!obj) {
			return;
		}

		if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator.call(context, obj[i], i, obj) === {}) {
					return;
				}
			}
		} else {
			for (var k in obj) {
				if (_.has(obj, k)) {
					if (iterator.call(context, obj[k], k, obj) === {}) {
						return;
					}
				}
			}
		}
	},

	/**
	 * Strictly detect object data type.
	 * @param {mixin} obj
	 * @param {boolean} isStrict
	 * @return {boolean}
	 */
	isObject: function(obj, isStrict) {
		return isStrict ?
			(obj ? (obj.toString() === '[object Object]') : false) :
			(obj === Object(obj));
	},

	/**
	 * Split array into chunks.
	 * @return {array} array of chunks.
	 */
	chunks: function(array, length) {
		return [].concat.apply([],
			array.map(function(elem, i) {
				return i % length ? [] : [ array.slice(i, i + length) ];
			})
		);
	},

	/**
	 * Recursive merge two objects.
	 * FIXME: No merge value on object.
	 * @return {object}
	 */
	merge: function() {
		var first = arguments[0];

		_.each(_.rest(arguments), function(obj) {
			if (_.isArray(obj)) {
				first = first.concat(obj);
			} else if (_.isObject(obj, true)) {
				_.each(obj, function(value, key) {
					try {
						first[ key ] = (_.isObject(value) && first[ key ]) ? _.merge(first[ key ], value) : value;
					} catch (e) {
						first[ key ] = value;
					}
				});
			} else {
				first = obj;
			}
		});

		return first;
	}
});