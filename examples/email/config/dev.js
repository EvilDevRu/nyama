/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
 */

module.exports = {
	basePath: __dirname + '/..',
	components: {
		parser: {
			useProxy: false
		},
		email: {
			transport: {
				//	External transports.
				name: 'nodemailer-smtp-transport',
				host: 'smtp.list.ru',
				//	Standart stransport.
				//service: 'gmail',
				auth: {
					user: 'USER_NAME',
					pass: 'PASSWORD'
				}
			}
		},
		/**
		 * Use as Nyama.app.getParam('_PARAM_NAME_')
		 */
		params: {
			emails: ['destination@mail.com']
		}
	}
};