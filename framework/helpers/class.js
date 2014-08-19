'use strict';

/**
 * @type {function}
 */
function constructor() {
}

/**
 * @param childMethod
 * @param parentMethod
 * @return {Function}
 */
function coverVirtual(childMethod, parentMethod) {
	return function() {
		var old = this.__super;
		this.__super = parentMethod;
		var r = childMethod.apply(this, arguments);
		this.__super = old;
		return r;
	};
}

/**
 * @param childClass
 * @param newProperties
 */
function extendWithSuper(childClass, newProperties) {
	// Extend and setup virtual methods
	_.each(newProperties, function(value, key) {
		childClass[key] = (_.isFunction(value) && _.isFunction(childClass[key]) && childClass[key] !== constructor) ?
			coverVirtual(value, childClass[key]) :
			value;
	});

	// Default state
	if (!childClass.__super) {
		childClass.__super = constructor;
	}
}

/**
 * Extend class
 * @param {function} parentClass
 * @param {object} [protoProps]
 * @param {object} [staticProps]
 * @returns {function} New class
 */
function extend(parentClass, protoProps, staticProps) {
	var childClass;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your `extend` definition), or defaulted
	// by us to simply call the parent's constructor.
	if (protoProps && _.has(protoProps, 'constructor')) {
		childClass = coverVirtual(protoProps.constructor, parentClass);
	} else {
		childClass = function() {
			return parentClass.apply(this, arguments);
		};
	}

	// Add static properties to the constructor function, if supplied.
	_.extend(childClass, parentClass);
	extendWithSuper(childClass, staticProps);

	// Set the prototype chain to inherit from `parent`, without calling
	// `parent`'s constructor function.
	var Surrogate = function() {
		this.constructor = childClass;
	};
	Surrogate.prototype = parentClass.prototype;
	childClass.prototype = new Surrogate();

	// Add prototype properties (instance properties) to the subclass,
	// if supplied.
	if (protoProps) {
		extendWithSuper(childClass.prototype, protoProps);
	}

	return childClass;
}

var classes = module.exports = {
	/**
	 * @param {string} name Full namespace name
	 * @returns {object}
	 */
	namespace: function(name) {
		name = name ? name.split('.') : [];

		var currentScope = global;

		// Find or create
		for (var i = 0; i < name.length; i++) {
			var scopeName = name[i];

			if (!currentScope[scopeName]) {
				currentScope[scopeName] = {
					__className: name.slice(0, i).join('.'),
					__parentClassName: null
				};
			}
			currentScope = currentScope[scopeName];
		}

		return currentScope;
	},

	/**
	 * Method for define class
	 * @param {string} globalName
	 * @param {object} options
	 * @return {object}
	 */
	defineClass: function(globalName, options) {
		var parentClass = _.has(options, '__extends') ? options.__extends : null;
		var staticProperties = options.__static || {};

		if (parentClass === null) {
			parentClass = constructor;
		} else if (!_.isFunction(parentClass)) {
			throw new Error('Not found extend class for `' + globalName + '`.');
		}

		delete options.__extends;
		delete options.__static;

		// Split namespace
		var pos = globalName.lastIndexOf('.'),
			localName = globalName.substr(pos + 1);

		// Extend class
		var newClass = classes.namespace(globalName.substr(0, pos))[localName] = extend(parentClass, options, staticProperties);

		// Add name to class
		newClass.__className = newClass.prototype.__className = globalName;
		newClass.__parentClassName = newClass.prototype.__parentClassName = parentClass.__className || null;
		newClass.prototype.__static = newClass;

		return newClass;
	}
};