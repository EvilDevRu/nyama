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
 * This module is a wrapper of cheerio {@link https://github.com/MatthewMueller/cheerio}
 * @property {array} aliveProxy
 */
module.exports = Nyama.Singleton({
	/**
	 * @constructor
	 */
	construct: function() {
		this.maxThreads = 200;
		this.numThreads = 0;
		this.attempts = 16;
		this.aliveProxy = [];
		this.userAgents = _.fs.readFileSync(Nyama.app.getBasePath() + '/config/useragent.list').toString().split("\n");
	},

	/**
	 * Init component.
	 * @param {object} params
	 * @param {function} callback
	 */
	init: function(params, callback) {
		if (params.useProxy) {
			this.checkProxy(callback);
		}
		else {
			callback();
		}
	},

	/**
	 * Check proxy ips for alive.
	 * @param {function} rootCallback
	 */
	checkProxy: function(rootCallback) {
		//	Read proxies list.
		var f = _.fs.readFileSync(Nyama.app.getBasePath() + '/config/proxy.list'),
			ips = f.toString().split("\n"),
			count = ips.length,
			checked = 0,
			maxThreads = this.maxThreads,
			taskCallbacks = [];

		_.intel.debug('Start checking proxy list..');
		this.maxThreads = 500;

		//	Check proxies.
		_.each(ips, function(ip) {
			taskCallbacks.push(function(taskCallback) {
				this.get('http://google.ru', {
					proxy: 'http://' + ip,
					attempts: 0,
					logs: false,
					timeout: 6000,
					regexp: /Google/
				}, function(error) {
					++checked;

					var progress = '[' + checked + '/' + count + '] ';

					if (!error) {
						_.intel.debug(progress + 'Proxy\t' + ip + '\t\tis alive!');
						if (_.indexOf(this.aliveProxy, ip) === -1) {
							this.aliveProxy.push(ip);
						}
					}
					/*else {
					 _.intel.debug(progress + 'Proxy status\t' + ip + '\t\tfail...');
					 }*/

					taskCallback();
				}.bind(this));
			}.bind(this));
		}, this);

		_.async.parallel(taskCallbacks, function(error) {
			if (error) {
				_.intel.error(error);
				return;
			}

			_.intel.debug('Alive proxy: ' + this.aliveProxy.length);

			this.maxThreads = maxThreads;
			rootCallback();
		}.bind(this));
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
					proxy: this.getRandomProxy(),
					headers: {
						'User-Agent': this.getRandomUserAgent()
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
	 */
	download: function(url, fileName, params) {
		_.intel.debug('Download file ' + url + ' to ' + fileName);
		request(this.configure(url, params)).pipe(_.fs.createWriteStream(fileName));
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
			proxy: this.getRandomProxy(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': this.getRandomUserAgent()
			}
		}, params);
	},

	/**
	 * @returns {string|null} random proxy ip if proxy accepted.
	 */
	getRandomProxy: function() {
		return this.aliveProxy.length ?
			('http://' + this.aliveProxy[Math.floor(Math.random() * this.aliveProxy.length)]) : null;
	},

	/**
	 * @returns {string|null} random user agent string if it is accepted.
	 */
	getRandomUserAgent: function() {
		return this.userAgents.length ?
			(this.userAgents[Math.floor(Math.random() * this.userAgents.length)]) : null;
	}
});
