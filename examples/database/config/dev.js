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
		db: {
			database: 'nyama',
			username: 'root',
			password: '123',
			options: {
				dialect: 'mysql', // or 'sqlite', 'postgres', 'mariadb'
				port: 3306 // or 5432 (for postgres)
			}
		}
	}
};