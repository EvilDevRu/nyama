/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var Class = require('./class.js');

/**
 * Singleton class.
 */
module.exports = function(data) {
	return Class(_.merge(data, {
		__static: {
			/**
			 * @constructor
			 */
			construct: function() {
				this._instance = null;
			},

			/**
			 * @returns {mixin} instance.
			 */
			getInstance: function() {
				if (_.isNull(this._instance)) {
					this._instance = new this();
				}

				return this._instance;
			}
		}
	}));
};