define([ 'require', 'lodash', 'x2js' ], function( require, _ ){
    var merge = _.merge,
        isUndefined = _.isUndefined,
        isFunction = _.isFunction;

    return function($http, $timeout, Apperyio){
        var RESTClass = function(){
            var $$request = {};
            var $$default_options = {};
            var x2js = require('x2js');
            var inst = new x2js();
            var xml_str2json = inst.xml_str2json.bind( inst );

            function merge_requests( defaults, request ){
                return merge({}, defaults, request, function(a, b){
                    if ( isUndefined(b) ) {
                        return a;
                    }
                } );
            };

            return {
                setDefaults : function(){
                    var slice = Array.prototype.slice;
                    var options = slice.call(arguments, 0);
                    $$default_options = options[0];
                    return this;
                },
                execute : function( exec_request ){
                    var request = {};
                    if ( exec_request === undefined ){
                        request = $$default_options;
                    } else {
                        request = merge_requests( $$default_options, exec_request );
                    }
                    $$request = Apperyio.params_parse( request, request );

                    if ( request.hasOwnProperty('params') ) {
                        $$request = Apperyio.params_parse( $$request, request.params );
                    }
                    if ( request.hasOwnProperty('query') ) {
                        $$request = Apperyio.params_parse( $$request, request.query );
                    }

                    if ( request.hasOwnProperty('aio_config') ){
                        if ( request.aio_config.responseType.toLowerCase() == 'jsonp' ){
                            $$request.params.callback = 'JSON_CALLBACK';
                        }
                    }

                    if (request.hasOwnProperty('echo')){
                        var deferred = Apperyio.get('$q').defer();
                        var echo_data = request.echo;

                        if ( request.hasOwnProperty('aio_config') ){
                            var c = request.aio_config;
                            if ( c.responseType && c.responseType.toLowerCase() == 'xml' ){
                                echo_data = xml_str2json( request.echo );
                                if ( c.serviceName ) {
                                    echo_data = Apperyio.EntityAPI( c.serviceName + '.response.body', echo_data );
                                }
                            }
                            if ( c.responseType && c.responseType.toLowerCase() == 'json' ){
                                echo_data = JSON.parse( request.echo );
                            }
                        }

                        if ( request.hasOwnProperty('transformResponse') && isFunction(request.transformResponse) ) {
                            echo_data = request.transformResponse.call( null, echo_data ) || echo_data;
                        }

                        $timeout(function(){
                            deferred.resolve({
                                data: echo_data
                            });
                        }, 0);
                        return deferred.promise;
                    } else {
                        return $http($$request);
                    }
                }
            }
        };
        return RESTClass;
    }
});
