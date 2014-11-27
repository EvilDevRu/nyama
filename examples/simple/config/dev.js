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
		}
	},
	utils: {
		proxy: {
			fileName: __dirname + '/proxy.list',
			url: 'http://google.ru',
			regex: /Google/,
			timeout: 6000
		}
	},
	/**
	 * Use as Nyama.app.getParam('_PARAM_NAME_')
	 */
	params: {
		color: 'red'
	}
};