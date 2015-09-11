/* move into tests*/
(function(require){
    var config = {
        baseUrl: "app",
        paths: {
            'jasmine_f': '../libs/jasmine/lib/jasmine-core',
            'specs': '../test/specs',
            // target_code dependencies
            '$App': '../libs/apperyio',
            'x2js': '../libs/x2js/xml2json',
            'lodash': '../libs/lodash/dist/lodash',
            'angular' : '../libs/angular/angular',
            'angular-mocks' : '../libs/angular-mocks/angular-mocks',
            'mocks': '../test/mocks',
            '$squire': '../libs/squire/src/Squire',
            '$mocks_resolver': '../test/mocks_resolver'
        },
        shim: {
            'jasmine_f/boot': {
                deps: ['jasmine_f/jasmine-html']
            },
            'jasmine_f/jasmine-html': {
                deps: ['jasmine_f/jasmine']
            },
            'angular-mocks' : {
                deps: ['angular']
            },
            'x2js': {
                exports: 'X2JS'
            }
        }
    };
    require.config( config );

    require( ['require', 'lodash', 'jasmine_f/boot'], function( require ){
        require([
            'specs/fconfig.spec',
            'specs/fhelper.spec',
            'specs/entityapi.spec',
            'specs/slogin.spec'
        ], function(){
            window.onload();
        });
    });
}( require ));

