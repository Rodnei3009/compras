define([
    'require', 'lodash', '$App/entity/typenotfounderror', '$App/entity/nomodelerror'
], function(require, _){
    "use strict";

    function _type(model){
        return model && (model.type || model.$ref);
    };

    var extend = _.extend, // older versions of lodash
        clone = _.clone,
        isArray = _.isArray,
        each = _.each,
        keys = _.keys,
        union = _.union,
        last = _.last,
        map = _.map,
        isObject = _.isObject,
        TypeNotFoundError = require('$App/entity/typenotfounderror'),
        NoModelError = require('$App/entity/nomodelerror'),
        ARRAY_PATH = '[i]';

    /**
     * EntityFactory base constructor for Instances of Model provided as argument
     * @param {Object} models Models description
     */
    function EntityFactory(models){
        this.default_undefined = false;
        this.models = models || [];

        /**
         * Base types
         * @type {Object}
         */
        this._types = {
            "string": function(model){
                return (model && model.default) || (this.default_undefined ? undefined : "");
            },
            "data": function(model){
                return (model && model.default) || (this.default_undefined ? undefined : "");
            },
            "number": function(model){
                return this.default_undefined ? undefined : parseInt( (model && model.default) || 0, 10);
            },
            "boolean": function(model){
                var result = (model && model.default) || (this.default_undefined ? undefined : false);
                if (typeof result == "string"){
                    result = (result.toLowerCase === "true") || (result === "1") || (parseInt(result, 10) > 0);
                } else if (typeof result == "number"){
                    result = result > 0;
                }
                return result;
            },
            "object": function(model){
                var result = {};
                if (model && model.properties){
                    for (var key in model.properties) {
                        result[key] = this._get(model.properties[key].type || model.properties[key].$ref, model.properties[key]);
                    }
                }
                return result;
            },
            "array": function(model){
                var result = [];
                if (model && model.items){
                    this._get(model.items.type || model.items.$ref, model.items);
                }
                if (model && model['default']){
                    result = model['default'];
                }
                result.__entity = this._get.bind( this, (model && model.items && (model.items.type || model.items.$ref) || 'string'), model && model.items );
                return result;
            },
            "null": function(model){
                return null;
            }
        };
    }

    EntityFactory.prototype = {
        /**
         * Retrieve instance of model specified by Name
         * @param  {String} name              Name of Model or Path to Model part
         * @param  {Object} defaults          Plain-object which will be merged to the instance
         * @return {Object}                   Instance of Model/Model part
         */
        get: function( name, defaults, default_undefined ){
            var result = null;

            if (typeof defaults == typeof undefined){
                this.default_undefined = default_undefined || false;
                result = this._get(name);
            } else {
                if (Object.prototype.toString.call(defaults) == "[object Object]"){
                    result = this._get(name);
                    result = this.__special_merge( result, defaults );
                } else {
                    result = defaults;
                }
            }

            return result;
        },
        /**
         * Recursive merge default value to Model Instance considering case with One Item in Array from XML
         * @param  {Object} from_model
         * @param  {Object} defaults
         * @return {Object}
         */
        __special_merge: function( from_model, defaults ){
            function merge(a, b){
                var result, tmp;
                if ( isObject(b) ) {
                    each( union(keys(a), keys(b)), function(k){
                        result = result || {};
                        if ( b.hasOwnProperty(k) ) {
                            // restoring array items
                            if ( isArray(a[k]) && a[k].hasOwnProperty('__entity')) {
                                tmp = a[k].__entity();
                                if ( !isArray(b[k]) ) {
                                    result[k] = [merge( tmp, b[k] )];
                                } else {
                                    result[k] = map( b[k], merge.bind(null, tmp) );
                                }
                            } else if ( isObject(a[k]) ) {
                                result[k] = merge( a[k], b[k] );
                            } else {
                                result[k] = b[k];
                            }
                        } else {
                            result[k] = a[k];
                        }
                    } );
                };
                result = result || b;
                return result;
            }
            return merge( from_model, defaults );
        },

        /**
         * Get base type
         * @param  {String} name Name of type
         * @return {Object}
         */
        __get_type: function(name){
            return this._types[name].apply(this, Array.prototype.slice.call(arguments, 1));
        },

        /**
         * Internal retrieving Instance of Model
         * @param  {String} name Model name
         * @return {Object}
         */
        _get: function(name){
            if (typeof this._types[name] == "function"){
                return this.__get_type.apply(this, arguments);
            } else {
                try {
                    this._add(name);
                } catch (e) {
                    if (e instanceof NoModelError){
                        throw new TypeNotFoundError(e.message);
                    }
                    throw e;
                }
                return this.__get_type.apply(this, arguments);
            }
        },

        /**
         * Expand user dot-path to internal path format for part of Model
         * @param  {String} name Path or Name of Model
         * @return {Array}      internal formatted path
         */
        _expand_path: function(name){
            var new_path = [],
                path = name.split('.');
            new_path = [path.shift()];
            for (var i = 0, l = path.length; i < l; i++) {
                if (path[i] == ARRAY_PATH){
                    new_path.push('items');
                } else {
                    new_path.push('properties');
                    new_path.push(path[i]);
                }
            }
            return new_path;
        },

        /**
         * Internal method for adding new Models
         * @param {String} name Model name
         */
        _add: function(name){
            var path = [], model;
            if (this.models[name] == undefined){
                if (name.indexOf('.') > -1){
                    path = this._expand_path(name);
                    model = clone( this.models[ path.shift() ] );
                    var l = path.length;
                    var i = 0;
                    while ( i < l ) {
                        var item = path[i];
                        if ( model.hasOwnProperty(item) ){
                            model = model[item];
                            i++;
                        } else {
                            model = this.models[ _type(model) ];
                            if ( typeof model == 'undefined' ) {
                                throw new NoModelError( _type(model) + ' not found' );
                            }
                        }
                    }
                } else {
                    throw new NoModelError("Can't found `" + name + "` model");
                }
            } else {
                model = this.models[name];
            }

            this.__add(name, model);
        },

        /**
         * Compile and add new Model
         * @param  {String} name  Model name
         * @param  {Object} model Model description
         */
        __add: function(name, model){
            this._types[name] = (function(self, key, md){
                var result = null,
                    res = null;
                try {
                    result = (function(v){
                        return function(){
                            var tmp = clone(v);
                            if ( v && v.hasOwnProperty('__entity') ) {
                                tmp.__entity = v.__entity;
                            }
                            return tmp;
                        };
                    })(self._get(md.type || md.$ref, md));
                } catch (e) {
                    if (e instanceof NoModelError){
                        result = self._add(key);
                    } else {
                        throw e;
                    }
                }
                return result;
            })(this, name, model);
        }
    }

    return EntityFactory;
});
