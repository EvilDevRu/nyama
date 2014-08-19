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
	 * @constructor
	 */
	constructor: function(params) {
		Nyama.app = this;
		this.params = params;
	},

	/**
	 * @returns {string} base path's application.
	 */
	getBasePath: function() {
		return this.params.basePath || (__dirname + '/../../application');
	},

	/**
	 * Init application.
	 * @param {Function} initCallback
	 */
	init: function(initCallback) {
		//	Init components.
		var tasks = [],
			userComponentsPath = Nyama.app.getBasePath() + '/components',
			files = _.extend(
				_.map(_.fs.readdirSync(__dirname + '/../components'), function(file) {
					return __dirname + '/../components/' + file;
				}),
				_.fs.isDir(userComponentsPath) ? _.map(_.fs.readdirSync(userComponentsPath), function(file) {
					return Nyama.app.getBasePath() + '/components/' + file;
				}) : []
			);

		_.each(files, function(file) {
			tasks.push(function(callback) {
				var name = _.fs.baseName(file, '.js'),
					className = _.str.ucFirst(name);

				require(file);

				this[name] = new Nyama.components[className]();
				if (_.isFunction(this[name].init)) {
					this[name].init(_.isObject(this.params.components) ? this.params.components[name] : {}, callback);
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
				command,
				parsedArgs,
				_params = {},
				params = [];

			require(this.getBasePath() + '/commands/' + commandName.toLowerCase() + '.js');

			command = new Nyama.commands[commandName]();
			parsedArgs = command.run.toString().match(/^function\s.*\((.*)\)/)[1].split(',');

			_.each(process.argv.slice(3), function(arg) {
				if (arg.substr(0, 2) === '--') {
					var _data = arg.split('=');
					_params[_data[0].substr(2)] = _data[1];
				}
			});

			_.each(parsedArgs, function(argument) {
				argument = (argument || '').trim();
				if (_params[argument]) {
					params.push(_params[argument]);
				}
			});

			//	Add app to params
			params.unshift(this);

			//	Execute!
			command.run.apply(command, params);
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
	}
});