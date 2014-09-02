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

Nyama.defineClass('Nyama.commands.Index', {
	/**
	 * This is start method of application.
	 * @param {Application} app
	 * @param {string} city
	 */
	run: function(app, city) {
		if (!city) {
			app.end(1, 'You need set city name.');
		}

		var rootUrl = 'http://pogoda.yandex.ru/' + city + '/',
			pogoda = app.db.model('Pogoda');

		pogoda.find({ where: ['`date_create` < NOW()'], order: 'id DESC' })
			.complete(function(error, model) {
				if (error) {
					app.end(1, error);
				}

				if (model) {
					_.intel.info('Previously temprature: ' + model.values.temp + ' °C');
				}

				app.parser.get(rootUrl, {}, function(error, response, $) {
					if (error) {
						app.end(1, error);
					}

					var temp = $('.b-thermometer__now').text();

					_.intel.info('Weather in ' + _.str.ucFirst(city) + ': ' + temp);

					pogoda.create({
						city: city,
						temp: temp,
						date_create: new Date()
					}).complete(function(error) {
						if (error) {
							app.end(1, error);
						}
					});
				});
			});
	}
});