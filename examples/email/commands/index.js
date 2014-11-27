/**
 * Example show you, how you can you email with Nyama.
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
 */
module.exports = function(app) {
	app.email.send({
		to: app.getParam('emails'),
		subject: 'Subject',
		text: 'Text'
	}, function(error) {
		if (error) {
			_.intel.info('I can\'t send email :( ' + error);
		}
		else {
			_.intel.info('Yes! I send it!');
		}
	});
};