/**
 * Nyama core.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

/**
 * @class Nyama
 *
 * @property {object} _mapClasses
 * @property async async
 * @property fs fs
 * @property Application app
 */
global.Nyama = require(__dirname + '/helpers/singleton.js')({
	/**
	 * Create application.
	 * @param {object} params
	 */
	createApplication: function(params) {
		this._mapClasses = {
			Class: '/helpers/class.js',
			Singleton: '/helpers/singleton.js',
			Application: '/base/application.js'
		};

		_.each(this._mapClasses, function(path, name) {
			Nyama[name] = require(__dirname + path);
		});

		Nyama.app = new Nyama.Application(params || {});

		return Nyama.app;
	}
}).getInstance();