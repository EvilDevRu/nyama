/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

'use strict';

/**
 * Helper class, give support OOP in the application.
 * Based on habrahabr user code.
 */
module.exports = function(data) {
	var constructor = function() {},
		prototype = {},
		abstracts = data.__abstract || [],
		statics = data.__static || {},
		extend = data.extend || [];

	extend = _.isArray(extend) ? extend : [ extend ];

	if (!_.isUndefined(data.construct)) {
		constructor = data.construct;
	} else if (extend.length) {
		constructor = function() {
			//	Calling constructors of extending this class.
			if (extend) {
				for (var i = 0; i < extend.length; ++i) {
					extend[ i ].apply(this, arguments);
				}
			}
		};
	}

	_.each(extend, function(parent) {
		if (_.isFunction(parent.construct)) {
			parent.construct.call(constructor);
		}

		_.each(parent.prototype, function(fn, fnName) {
			if (_.isFunction(fn) && fnName !== 'construct') {
				prototype[ fnName ] = fn;
			}
		});

		//	Copy all function without constructor.
		_.each(parent, function(fn, fnName) {
			if (_.isFunction(fn) && fnName !== 'construct') {
				constructor[ fnName ] = fn;
			}
		});
	});

	//	Abstract methods.
	_.each(abstracts, function(method) {
		prototype[ method ] = function() {};
	});

	delete data.construct;
	delete data.__abstract;
	delete data.__static;
	delete data.extend;

	//	Methods of this class.
	_.each(data, function(fn, fnName) {
		if (_.isFunction(fn)) {
			prototype[ fnName ] = fn;
		}
	});

	//	Static methods.
	_.each(statics, function(fn, fnName) {
		if (_.isFunction(fn)) {
			constructor[ fnName ] = fn;
		}
	});

	//	Static constructor.
	if (_.isFunction(statics.construct)) {
		statics.construct.call(constructor);
	}

	constructor.prototype = prototype;
	constructor.functions = prototype;

	return constructor;
};