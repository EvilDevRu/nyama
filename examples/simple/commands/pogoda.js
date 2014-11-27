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

var Q = require('q');

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

	//																									@formatter:off
	Q.async(function*() {
		var $ = yield app.parser.get(rootUrl, {});
		_.intel.info('Weather in ' + _.str.ucFirst(params.city) + ': ' + $('.b-thermometer__now').text());
	})().fail(function() {
		console.log('fail');
	});
	//																									@formatter:on
};