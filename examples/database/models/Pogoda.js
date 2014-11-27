/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014-2015
 * @license MIT
 */

'use strict';

module.exports = {
	model: 'Pogoda',
	columns: {
		city: Nyama.components.Sequelize.STRING,
		temp: Nyama.components.Sequelize.STRING,
		date_create: Nyama.components.Sequelize.DATE
	},
	options: {
		tableName: 'pogoda',
		timestamps: false
	}
};