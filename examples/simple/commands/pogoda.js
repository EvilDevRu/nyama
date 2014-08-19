/**
 * Yandex weather parser.
 * Do not use it! This is only example.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

Nyama.defineClass('Nyama.commands.Pogoda', {
	/**
	 * This is start method of application.
	 * @param {Nyama.app} app
	 * @param {string} city
	 */
	run: function(app, city) {
		if (!city) {
			app.end(1, 'You need set city name.');
		}

		var rootUrl = 'http://pogoda.yandex.ru/' + city + '/';

		app.parser.get(rootUrl, {}, function(error, response, $) {
			if (error) {
				app.end(1, error);
			}

			_.intel.info('Weather in ' + _.str.ucFirst(city) + ': ' + $('.b-thermometer__now').text());
		});
	}
});