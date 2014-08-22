/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

module.exports = {
	basePath: __dirname + '/..',
	components: {
		parser: {
			useProxy: true
		}
	},
	utils: {
		proxy: {
			fileName: __dirname + '/proxy.list',
			url: 'http://google.ru',
			regex: /Google/,
			timeout: 6000
		}
	}
};