/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var nodeMailer = require('nodemailer');

/**
 * Email component.
 * @module Nyama.app.email
 * @see https://github.com/andris9/nodemailer-smtp-transport
 * @see https://github.com/andris9/Nodemailer
 * @provate {nodemailer} _transporter
 */
Nyama.defineClass('Nyama.components.Email', {
	/**
	 * Init component.
	 * @param {object} params
	 * @param {function} callback
	 */
	init: function(params, callback) {
		if (!params) {
			callback();
			return;
		}

		this.params = params;

		if (!params.transport) {
			callback('You need email transport');
			return;
		}

		if (params.transport.name) {
			var transport = require(params.transport.name);
			this._transporter = nodeMailer.createTransport(transport(params.transport));
		}
		else {
			this._transporter = nodeMailer.createTransport(params.transport);
		}

		callback();
	},

	/**
	 * Send email.
	 * @param {object} params
	 * @param {function} callback
	 */
	send: function(params, callback) {
		var emails = _.isArray(params.to) ? params.to : [params.to];
		_.each(emails, function(email) {
			this._transporter.sendMail(_.extend({
				from: this.params.transport.auth.user
			}, params, {
				to: email
			}), callback);
		}, this);
	}
});
