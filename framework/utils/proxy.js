/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var request = require('request');

/**
 * ProxyChecker utility.
 * @module Nyama.utils.ProxyChecker
 * @extends Nyama.base.Utility
 */
Nyama.defineClass('Nyama.utils.Proxy', {
	__extends: Nyama.base.Utility,

	/**
	 * @var {array} alive proxy list.
	 */
	aliveProxy: [],

	/**
	 * Check proxy list.
	 * @param {function} callback
	 * @param {object|null} params
	 */
	check: function(callback, params) {
		//	Read proxies list.
		var options = _.extend({}, this.params, params),
			f = _.fs.readFileSync(options.fileName),
			ips = f.toString().split("\n"),
			tasks = [];

		_.intel.debug('Start checking proxy list..');

		//	Check proxies.
		_.each(ips, function(ip) {
			tasks.push(function(taskCallback) {
				var isHttp = true,
					regexp = options.regexp || /Google/,
					paramsRequest = _.extend({
						timeout: 6000
					}, options, {
						proxy: 'http://' + ip
					});

				/**
				 * @var error
				 * @var response
				 * @var body
				 */
				var callbackRequest = function(error, response, body) {
					if (error) {
						_.intel.debug('Proxy status\t' + ip + '\t[' + (isHttp ? 'HTTP' : 'HTTPS') + ']\t\tfail...');
						if (isHttp) {
							isHttp = false;
							paramsRequest.proxy = 'https://' + ip;
							request(paramsRequest, callbackRequest);
						}
						else {
							taskCallback();
						}
					}
					else {
						if (regexp && !regexp.test(body)) {
						}
						else {
							_.intel.debug('Proxy status\t' + ip + '\t\tis alive!');
							if (_.indexOf(this.aliveProxy, ip) === -1) {
								this.aliveProxy.push((isHttp ? 'http://' : 'https://') + ip);
							}
						}

						taskCallback();
					}
				}.bind(this);

				request(paramsRequest, callbackRequest);
			}.bind(this));
		}, this);

		_.async.parallel(tasks, function(error) {
			if (error) {
				_.intel.error(error);
				return;
			}

			_.intel.debug('Alive proxy: ' + this.aliveProxy.length);
			callback(null, this.aliveProxy);
		}.bind(this));
	},

	/**
	 * @returns {string} proxy address
	 */
	get: function() {
		return this.aliveProxy.length ? (this.aliveProxy[Math.floor(Math.random() * this.aliveProxy.length)]) : null;
	}
});