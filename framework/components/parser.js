/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
 */

'use strict';

var cheerio = require('cheerio'),
	request = require('request'),
	Q = require('q');

/**
 * Parser component.
 * This module is a wrapper of cheerio {@see https://github.com/MatthewMueller/cheerio}
 * @property {Array} aliveProxy
 */
Nyama.defineClass('Nyama.components.Parser', {
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
			Nyama.app.utils.proxy.check(callback);
		}
		else {
			callback();
		}
	},

	/**
	 * Get content throw proxy if it possible.
	 * @param {String} url
	 * @param {Object} params
	 */
	get: function(url, params) {
		/**
		 * @param url
		 * @param params
		 * @param isGetAll
		 * @returns {Promise.promise|*}
		 */
		function content(url, params, isGetAll) {
			var defer = Q.defer();

			function loop() {
				params = this.configure(url, params);

				if (params.logs !== false) {
					_.intel.debug('Get page ' + url);
				}

				//	Request.
				request(params, function(error, response, body) {
					params.attempts = _.isNumber(params.attempts) ? params.attempts : this.attempts;

					//	Check result.
					if (!error && response && response.statusCode === 200) {
						if (params.regexp && !params.regexp.test(body)) {
						}
						else {
							//	DONE!
							defer.resolve(!isGetAll ? cheerio.load(body) : {
								response: response,
								$: cheerio.load(body),
								body: body
							});
							return;
						}
					}

					//	Try again.
					--params.attempts;
					if (params.attempts <= 0) {
						defer.reject(new Error('Fail load page "' + url + '", can\'t try again :( [' + params.proxy + ']'));
						return;
					}

					if (params.log !== false) {
						_.intel.error('Fail load page "' + url + '" try again (' + params.attempts + ')');
					}

					//	Switch ip of proxy address and useragent.
					params = _.extend(params, {
						proxy: Nyama.app.utils.proxy.get(),
						headers: {
							'User-Agent': Nyama.app.utils.useragent.get()
						}
					});

					Q.when(Q.delay(500), loop.bind(this), defer.reject);
				}.bind(this));
			}

			Q.nextTick(loop.bind(this));

			return defer.promise;
		}

		return content.call(this, url, params);
	},

	/**
	 * @param {String} url
	 * @param {Object} params
	 */
	post: function(url, params) {
		return this.get(url, _.extend(params, {
			type: 'POST'
		}));
	},

	/**
	 * Download file and save on disk.
	 * @param {string} url
	 * @param {string} fileName
	 * @param {object} params
	 */
	download: function(url, fileName, params) {
		/**
		 * @param url
		 * @param params
		 * @param isGetAll
		 * @returns {Promise.promise|*}
		 */
		function content(url, params, isGetAll) {
			var defer = Q.defer();

			function loop() {
				//	DOWNLOAD FILE
				var writeStream = _.fs.createWriteStream(fileName);

				_.intel.debug('Download file ' + url + ' to ' + fileName);

				writeStream.on('error', function(error) {
					if (error) {
						_.fs.unlink(fileName, function(error) {
							_.intel.error((error ? 'Error write file, try again! ' : 'Error delete file ') +
							fileName + ' :: ' + error);
							Q.when(Q.delay(500), loop.bind(this), defer.reject);
						});
					}
				}.bind(this));

				writeStream.on('close', function(error) {
					if (error) {
						_.fs.unlink(fileName, function(error) {
							_.intel.error((error ? 'Error write file, try again! ' : 'Error delete file ') +
							fileName + ' :: ' + error);
							Q.when(Q.delay(500), loop.bind(this), defer.reject);
						});
					}
				}.bind(this));

				request(this.configure(url, params), function(error) {
					if (error) {
						_.intel.error('Error write file, try again! ' + error);
						Q.when(Q.delay(500), loop.bind(this), defer.reject);
						return;
					}

					//	DONE!
					defer.resolve();
				}.bind(this)).pipe(writeStream);
			}

			Q.nextTick(loop.bind(this));

			return defer.promise;
		}

		return content.call(this, url, params);
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
			timeout: 30000,
			followAllRedirects: true,
			proxy: Nyama.app.utils.proxy.get(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': Nyama.app.utils.useragent.get()
			}
		}, params);
	}
});
