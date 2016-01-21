/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @license MIT
 */

'use strict';

/**
 * @class Application
 */
module.exports = function(config) {
	/**
	 * Initialize components.
	 */
	var initComponents = function() {
		var defer = _.Q.defer();

		_.Q.spawn(function*() {
			var files = _.union(
				yield _.io.glob(__dirname + '/components/*.js'),					//	Nyama components.
				yield _.io.glob(config.basePath + 'components/*.js')	//	User components.
			);

			yield _.Q.spawnMap(files, function*(file) {
				var name = _.io.baseName(file, 'Component.js').toLowerCase(),
					Component = require(file);

                //  If component have not config then don't load.
                if (!_.isUndefined(config.components[name]) && config.components[name] !== false) {
                    console.info('Load component:', name);

                    this[name] = new Component();
                    if (_.isFunction(this[name].init)) {
                        yield this[name].init(config);
                    }
                }
			}, this);

			defer.resolve();
		}, this);

		return defer.promise;
	}.bind(this);

	/**
	 * Init application.
	 */
	this.init = function() {
		var defer = _.Q.defer();

		_.Q.spawn(function*() {
			yield initComponents();
			defer.resolve();
		});

		return defer.promise;
	};
};