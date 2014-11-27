/**
 * Yandex weather parser.
 * Do not use it! This is only example.
 *
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
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

	var rootUrl = 'http://pogoda.yandex.ru/' + params.city + '/',
		pogoda = app.db.model('Pogoda');

	pogoda
		.find({where: ['`date_create` < NOW()'], order: 'id DESC'})
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

				_.intel.info('Weather in ' + _.str.ucFirst(params.city) + ': ' + temp);

				pogoda.create({
					city: params.city,
					temp: temp,
					date_create: new Date()
				}).complete(function(error) {
					if (error) {
						app.end(1, error);
					}
				});
			});
		});
};