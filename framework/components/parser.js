/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var cheerio = require('cheerio'),
	request = require('request');

/**
 * Parser component.
 * This module is a wrapper of cheerio {@see https://github.com/MatthewMueller/cheerio}
 * @property {array} aliveProxy
 */
Nyama.defineClass('Nyama.components.Parser', {
	/**
	 * @var {number} count max threads.
	 */
	maxThreads: 200,

	/**
	 * @var {number} active threads.
	 */
	numThreads: 0,

	/**
	 * @var {number} count attempts.
	 */
	attempts: 16,

	/**
	 * Init component.
	 * @param {object} params
	 * @param {function} callback
	 */
	init: function(params, callback) {
		if (params.useProxy) {
			Nyama.app.utils.proxy.check(function() {
				callback();
			}.bind(this));
		}
		else {
			callback();
		}
	},

	/**
	 * Get content throw proxy if it possible.
	 * @param {String} url
	 * @param {Object} params
	 * @param {Function} callback
	 */
	get: function(url, params, callback) {
		params = this.configure(url, params);

		var interval = setInterval(function() {
			if (this.numThreads >= this.maxThreads) {
				return;
			}

			clearInterval(interval);
			++this.numThreads;

			if (params.logs !== false) {
				_.intel.debug('Get page ' + url);
			}

			request(params, function(error, response, body) {
				params.attempts = _.isNumber(params.attempts) ? params.attempts : this.attempts;

				--this.numThreads;

				//	Check result.
				if (!error && response && response.statusCode === 200) {
					if (params.regexp && !params.regexp.test(body)) {
					}
					else {
						callback(null, response, cheerio.load(body), body);
						return;
					}
				}

				//	Try again.
				--params.attempts;
				if (params.attempts <= 0) {
					callback('Fail load page "' + url + '", can\'t try again :( [' + params.proxy + ']');
					return;
				}

				if (params.log !== false) {
					_.intel.error('Fail load page "' + url + '" try again (' + params.attempts + ')');
					//callback('Fail load page "' + url + '" try again (' + params.attempts + ')');
				}

				//	Switch ip of proxy address and useragent.
				params = _.extend(params, {
					proxy: Nyama.app.utils.proxy.get(),
					headers: {
						'User-Agent': Nyama.app.utils.useragent.get()
					}
				});

				this.get(url, params, callback);
			}.bind(this));
		}.bind(this), 250);
	},

	/**
	 * Download file and save on disk.
	 * @param {string} url
	 * @param {string} fileName
	 * @param {object} params
	 * @param {function} callback
	 */
	download: function(url, fileName, params, callback) {
		_.intel.debug('Download file ' + url + ' to ' + fileName);

		callback = _.isFunction(callback) ? callback : function() {
		};

		var writeStream = _.fs.createWriteStream(fileName);

		writeStream.on('error', function(error) {
			if (error) {
				_.intel.error('Error download file, try again! ' + error);
				this.download(url, fileName, params, callback);
				return;
			}

			callback();
		}.bind(this));

		writeStream.on('close', function(error) {
			if (error) {
				_.intel.error('Error write file, try again! ' + error);
				this.download(url, fileName, params, callback);
				return;
			}

			callback();
		}.bind(this));

		request(this.configure(url, params), function(error) {
			if (error) {
				_.intel.error('Error write file, try again! ' + error);
				this.download(url, fileName, params, callback);
			}
		}.bind(this)).pipe(writeStream);
	},

	/**
	 * Create request params.
	 * @param {string} url
	 * @param {object} params
	 * @returns {object}
	 */
	configure: function(url, params) {
		return _.extend({
			url: url,
			type: 'GET',
			timeout: 60000,
			followAllRedirects: true,
			proxy: Nyama.app.utils.proxy.get(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': Nyama.app.utils.useragent.get()
			}
		}, params);
	}
});
