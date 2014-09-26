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

/**
 * This is a start method of the application.
 * @param {Nyama.app} app
 * @param {Object} params
 */
module.exports = function(app, params) {
	if (!params.city) {
		app.end(1, 'You need set city name.');
	}

	var rootUrl = 'http://pogoda.yandex.ru/' + params.city + '/';

	app.parser.get(rootUrl, {}, function(error, response, $) {
		if (error) {
			app.end(1, error);
		}

		_.intel.info('Weather in ' + _.str.ucFirst(params.city) + ': ' + $('.b-thermometer__now').text());

		app.end();
	});
};