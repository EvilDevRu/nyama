/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

/**
 * Nyama application class.
 * @private {object} _params
 * @class Application
 */
Nyama.defineClass('Nyama.base.Application', {
	/**
	 * @var {object} utils container.
	 */
	utils: {},

	/**
	 * @constructor
	 */
	constructor: function(params) {
		Nyama.app = this;
		this.config = params;
	},

	/**
	 * @returns {string} base path's application.
	 */
	getBasePath: function() {
		return this.config.basePath || (__dirname + '/../../application');
	},

	/**
	 * Init application.
	 * @param {Function} initCallback
	 */
	init: function(initCallback) {
		//	Load utils.
		var utils = _.map(_.fs.readdirSync(__dirname + '/../utils'), function(file) {
			return __dirname + '/../utils/' + file;
		});

		_.each(utils, function(file) {
			var name = _.fs.baseName(file, '.js'),
				className = _.str.ucFirst(name),
				params = _.isObject(this.config.utils) ? this.config.utils[name] : {};

			if (_.fs.isFile(file)) {
				require(file);
				this.utils[name] = new Nyama.utils[className](params);
			}
		}, this);

		//	Init components.
		var tasks = [],
			userComponentsPath = Nyama.app.getBasePath() + '/components',
			files = _.extend(
				//	Core components.
				_.map(_.fs.readdirSync(__dirname + '/../components'), function(file) {
					return __dirname + '/../components/' + file;
				}),
				//	User's components.
				_.fs.isDir(userComponentsPath) ? _.map(_.fs.readdirSync(userComponentsPath), function(file) {
					return Nyama.app.getBasePath() + '/components/' + file;
				}) : []
			);

		//	Load components.
		_.each(files, function(file) {
			tasks.push(function(callback) {
				var name = _.fs.baseName(file, '.js'),
					className = _.str.ucFirst(name);

				require(file);

				this[name] = new Nyama.components[className]();
				if (_.isFunction(this[name].init)) {
					this[name].init(_.isObject(this.config.components) ? this.config.components[name] : {}, callback);
				}
				else {
					callback();
				}
			}.bind(this));
		}, this);

		_.async.parallel(tasks, initCallback);
	},

	/**
	 * Run application.
	 */
	run: function() {
		this.init(function(error) {
			if (error) {
				this.end(1, error);
			}

			var commandName = _.str.ucFirst(_.first(process.argv.slice(2)) || 'index'),
				params = {};

			_.each(process.argv.slice(3), function(arg) {
				if (arg.substr(0, 2) === '--') {
					var _data = arg.split('=');
					params[_data[0].substr(2)] = _data[1];
				}
			});

			//	Execute!
			require(this.getBasePath() + '/commands/' + commandName.toLowerCase() + '.js')
				.apply(Nyama.app, [this, params]);
		}.bind(this));
	},

	/**
	 * Terminates the application.
	 * @param {number} code
	 * @param {string} message
	 */
	end: function(code, message) {
		if (message) {
			_.intel.error(message);
		}
		process.exit(code || 1);
	},

	/**
	 * Returns param value from config file.
	 * @param {string} key
	 * @param {mixin} defValue
	 */
	getParam: function(key, defValue) {
		return _.isUndefined(this.config.params[key]) ? defValue : this.config.params[key];
	}
});