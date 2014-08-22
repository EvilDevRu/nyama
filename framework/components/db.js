/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

var Sequelize = Nyama.components.Sequelize = require('sequelize');

/**
 * Database component.
 * @module Nyama.app.db
 * @property {Sequelize} sequelize
 * @property {object} type
 * @property {object} models models container.
 */
Nyama.defineClass('Nyama.components.Db', {
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

		this.models = {};
		this.sequelize = new Sequelize(params.database, params.username, params.password || '', params.options);
		this.sequelize
			.authenticate()
			.complete(function(error) {
				if (error) {
					Nyama.app.end(1, 'Unable to connect to the database: ' + error);
				}

				_.intel.debug('Connection has been established successfully.');

				var modelsPath = Nyama.app.getBasePath() + '/models/';
				if (_.fs.isDir(modelsPath)) {
					_.each(_.fs.readdirSync(modelsPath), function(fileName) {
						var module = require(modelsPath + fileName);
						this.models[module.model] = {
							columns: {},
							options: module.options || {}
						};

						_.each(module.columns || {}, function(value, key) {
							/*if (_.isString(value) || _.has(value, 'type')) {
							 //	Replace column types.
							 value = _.isString(value) ? { type: value.toUpperCase() } : value.toUpperCase();
							 value.type = _.has(value.type, 'length')
							 ? Sequelize[value.type](value.type.length)
							 : Sequelize[value.type];
							 }*/
							this.models[module.model].columns[key] = value;
						}, this);
					}, this);
				}

				callback();
			}.bind(this));
	},

	/**
	 * Return new model.
	 * @param {string} modelName
	 * @return {Model}
	 */
	model: function(modelName) {
		var model = this.models[modelName];
		return this.sequelize.define(modelName, model.columns, model.options);
	}
});
