
define("services/models", [], function(){
    return {}
});

define("routes", [], function(){
    var default_route = { redirectTo: '/Screen1.html' };
    return {
        default:
            default_route, when: {
                '/': default_route,
                '/Screen1.html': {
                    c: '$Screen1/Screen1Controller',
                    t: '$Screen1/Screen1Template.html',
                    d: []
                }

            },
            otherwise: default_route,
            route_names: {
                'Screen1': '/Screen1.html'
            }
    }
});

define([ 'require'
    , 'lodash'
    , 'angular'
    , '$App/fhelper'
    , '$App/fconfig'
    , 'angular-mocks'
    , 'mocks'
], function (require, _) {

    var _ = require('lodash'),
        $aservice = require('$App/fhelper'),
		fConfig = require('$App/fconfig'),
        mocks = require('mocks');

    describe("Unit tests for helper", function () {
        var $rootScope, $location, $injector, $q, _AConfig, $parse, helperInst, configInst, $timeout;
        beforeEach(inject(function (_$rootScope_, _$location_, _$injector_, _$parse_, _$q_, _$timeout_) {
            $parse = _$parse_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $injector = _$injector_;
			$q = _$q_;
			$timeout = _$timeout_;
			configInst = fConfig($parse);
            configInst.init(mocks.configTest.context);
            helperInst = $aservice($rootScope, $location, $injector, $q, $parse, $timeout, configInst);

        }));
        describe("Factory helper", function () {
            it("should be defined", function () {
                expect($aservice).toBeDefined();
            });

            it("should navigate to page", function () {
                helperInst.navigateTo(mocks.helperTest.pages.page1);
                expect($location.url()).toEqual("/" + mocks.helperTest.pages.page1);
            });

            it("should execute function", function () {
                var testFn = function () {
                    return mocks.helperTest.templates.result;
                };
                expect(helperInst.url(testFn)).toEqual(mocks.helperTest.templates.result);
            });

            it("should return template", function () {
                var template = "template";
                expect(helperInst.url(template)).toEqual(template);
            });

            it("should return value", function () {
                expect(helperInst.url(mocks.helperTest.templates.template)).toEqual(mocks.configTest.context.right);
            });

            it("should parse object", function () {
                expect(helperInst.params_parse(mocks.configTest.context)).toEqual(mocks.configTest.context);
            });


            it("should defer injector service", function () {
                var promise = helperInst.defer_get("$parse");
                expect(promise).toBeDefined();
            });


            it("should return service from deffered resolve", function () {
                var promise = helperInst.defer_get("$parse"), result;
                promise.then(function (srv) {
                    result = srv;
                });
                $timeout.flush();
                $rootScope.$apply();
                expect(promise).toBeDefined();
            });

            it("should return require library", function () {
                expect(helperInst.getLibrary()).toBeDefined();
            });

            it("should contains Config obejct", function(){
                expect(helperInst.Config).toBeDefined();
            });

            it("should contains deprecated list of Config methods", function(){
                expect(helperInst.config).toBeDefined();
                expect(helperInst.configAdd).toBeDefined();
                expect(helperInst.getAll).toBeDefined();
                expect(helperInst.remove).toBeDefined();
                expect(helperInst.init).toBeDefined();
            });

        });
    });

});
