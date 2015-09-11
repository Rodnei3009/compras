/**
 * ApperyioProvider
 */
define(['require'
    , 'lodash'
    , 'routes'
], function(require, _){
    var routes = require('routes');
    var extend = _.extend,
        forEach = each = _.each,
        isString = _.isString,
        isFunction = _.isFunction,
        isObject = _.isObject,
        isBoolean = _.isBoolean,
        isArray = _.isArray,
        map = _.map

    function Apperyio($rootScope, $location, $injector, $q, $parse, $timeout /* other dependencies for extend base object*/ ){
        function A(){
            this.appery__config = {};
        };

        extend( A.prototype, {
            init: function(options){
                extend(this.appery__config, options || {});
            },

            /**
             * Navigate to route by name
             * @param  {String} path    [description]
             * @param  {Object} options [description]
             */
            navigateTo: function( path, options ){
                var route_names = routes.route_names;

                if ( route_names.hasOwnProperty(path) ){
                    path = route_names[path];
                }
                if ( isObject(options) ){
                    each( options, function(v, k){
                        path = path.replace( ':' + k, v.toString() );
                    } );
                }

                path = path.replace('*\\/', '/')
                    .replace('*\\', '')
                    .replace('*', '')
                    .replace('?', '');

                $location.path( path );
            },

            /**
             * Generate URL after parsing {template.entities} from system settings
             * @param  {String} template URL-template
             * @return {String}          URL-string
             */
            /**
             * Generate URL after running {template.entities} as function
             * @param  {Function} template URL-template function
             * @return {String}          URL-string
             */
            url: function(template /*, options*/){
                var options = arguments[1] || {},
                    R = /\{([\w\d_\$\.]+?)\}/,
                    m = [],
                    tmp = '',
                    getter, value;
                if ( this.Config ){
                    options = extend( options, this.Config.all() );
                }
                if (isFunction(template)){
                    return template.call(this, options);
                }
                m = template.match(R);
                tmp = template;
                while (m) {
                    getter = $parse(m[1]);
                    if (!_.isUndefined(value = getter(options))){
                        template = template.replace(m[0], value);
                        tmp = template;
                    } else {
                        tmp = template.replace(m[0], '');
                    }
                    m = tmp.match(R);
                }
                return template;
            },
            /**
             * Recursive parser for settings-objects. Invoke object properties and expand templates entries in value
             * @param  {Object} obj Settings object
             * @param  {Object} options OPTIONAL argument as additional dictionary for searching replaces
             * @return {Object}     Settings object
             */
            params_parse: function(obj /*, options*/){
                var options = arguments[1] || {},
                    result = {},
                    that = this;
                if (isString(obj) || isFunction(obj)){
                    return this.url(obj, options)
                }
                if (isBoolean(obj) || !isObject(obj)){
                    result = obj;
                } else {
                    if (isArray(obj)) {
                        result = [];
                    }
                    forEach(obj, function(value, key){
                        result[key] = that.params_parse(value, options)
                    });
                }
                return result;
            },

            /**
             * Just wrapper, reserved for future use
             *
             */
            log: function(){
                console.log.apply(console, arguments);
            },

            /**
             * Just wrapper, reserved for future use
             *
             */
            warn: function(){
                console.warn.apply(console, arguments);
            },

            /**
             * Deferred injector for external dependencies. Always returns Promise-object.
             * @param  {String} name Can be angular asset name for deferred injection or require asset name
             * @return {Promise}      Promise object
             */
            defer_get: function(name){
                var $timeout = this.get('$timeout');
                var $injector = this.get('$injector');
                var deferred = $q.defer();
                if ($injector.has(name)){
                    this.log('has name ' + name);
                    $timeout(function(){
                        deferred.resolve($injector.get(name));
                    }, 0);
                } else {
                    this.log('try to load ' + name);
                    require([name], function(c){
                        this.log('loaded ' + name);
                        $timeout(function(){

                            deferred.resolve(c);
                        }, 0);
                    })
                }
                return deferred.promise;
            },
            /**
             * Wrapper for $injector, reserved for future use
             */
            get: function(){
                return $injector.get.apply($injector, arguments);
            },

            /**
             * Wrapper for `require` function
             */
            getLibrary: function(){
                return require.apply(null, arguments);
            }
        });

        var result = new A();
        each( arguments, function (item){
            if (item.hasOwnProperty('$$Apperyio_name')) {
                result[item.$$Apperyio_name] = item;
                if ( item.$$Apperyio_name === 'Config' ){
                    var deprecated_rename = {
                        get: 'config',
                        add: 'configAdd',
                        all: 'getAll',
                        init: 'init',
                        remove: 'remove'
                    }
                    each(deprecated_rename, function(old_name, new_name){
                        if ( item.hasOwnProperty(new_name) ){
                            result[old_name] = (function(func, name, context, self){
                                return function(){
                                    self.warn( 'method "' + name + '" is deprecated. Please use this method from Config property' );
                                    return func.apply(context, arguments);
                                }
                            }(item[new_name], old_name, item, result));
                        }
                    });
                }
            }
        });
        each( arguments, function (item){
            if (item.hasOwnProperty('$$Apperyio_init')) {
                item.$$Apperyio_init( result );
            }
        });
        return result;
    }

    return Apperyio;
});
