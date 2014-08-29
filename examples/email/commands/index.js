/**
 * Example show you, how you can you email with Nyama.
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
	 * @param {Nyama.app} app
	 */
	run: function(app) {
		app.email.send({
			from: '',
			to: '',
			subject: 'hello',
			text: 'hello world!'
		}, function(error) {
			if (error) {
				_.intel.info('I can\'t send email :( ' + error);
			}
			else {
				_.intel.info('Yes! I send it!');
			}
		});
	}
});