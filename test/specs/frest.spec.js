define([ 'require'
    , 'lodash'
    , '$App/frest'
    , '$App/fhelper',
    , '$App/fconfig'
    , 'mocks'
], function ( require ) {
    var _ = require('lodash'),
        fRest = require('$App/frest'),
        fHelper = require('$App/fhelper'),
        fConfig = require('$App/fconfig'),
        mocks = require('mocks');

     describe("frest test", function () {
        var $rootScope, $location, $injector, $q, _AConfig, $parse, configInst, helperInst, fRestInst, $timeout;

        beforeEach(inject(function (_$rootScope_, _$location_, _$injector_, _$parse_, _$q_, _$timeout_) {
            $parse = _$parse_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $injector = _$injector_;
            $q = _$q_;
            $timeout = _$timeout_;
            configInst = fConfig($parse);
            configInst.init(mocks.configTest.context);
            helperInst = fHelper($rootScope, $location, $injector, $q, configInst, $parse, $timeout);
            fRestInst =  fRest(helperInst);
            f = new fRestInst();

        }));


        it("rest status should be false", function () {
            expect(f.status).toBeFalsy();
        });

        it("should be defined", function () {
            expect(f).toBeDefined();
        });

        it("should be mocks", function () {
            f.setDefaults(mocks.RESTService);
            expect(f.default_options.type).toEqual(mocks.RESTService.type);
            expect(f.default_options.echo).toEqual(mocks.RESTService.echo);
            expect(f.default_options.dataType).toEqual(mocks.RESTService.dataType);
            expect(f.default_options.url).toEqual(mocks.RESTService.url);
        });

        it("request should be empty", function () {
            expect(f.request).toEqual(new Object());
        });

        it("default_options should be undefined", function () {
          f.execute(mocks.RESTService);
          expect(f.default_options).toEqual(undefined);
        });

        it("rest should be defined", function () {
            f.setDefaults(mocks.RESTService);
            expect(f).toBeDefined();
        });

        it("promise should be defined", function () {
            f.setDefaults(mocks.RESTService);
            expect(f.execute()).toBeDefined();
        });

        it("promise should be defined (another definition)", function () {
           expect(f.execute(mocks.RESTService)).toBeDefined();
        });

        it("should return state", function () {
            f.setDefaults(mocks.RESTService);
            expect(f.execute().$$state.status).toEqual(0);
        });

        it("concatenate rests should be defined", function () {
            f.setDefaults(mocks.RESTService);
            expect(f.execute(mocks.RESTService2)).toBeDefined();
        });

        it("concatenate rests", function () {
            f.setDefaults(mocks.RESTService);
            f.execute(mocks.RESTService2);
            expect(f.request.type).toEqual(mocks.RESTService2.type);
            expect(f.request.echo).toEqual(mocks.RESTService2.echo);
            expect(f.request.dataType).toEqual(mocks.RESTService2.dataType);
            expect(f.request.url).toEqual(mocks.RESTService2.url);
        });

        it("frest.execute was called", function() {
            spyOn(f, 'execute');
            f.execute(mocks.RESTService);
            expect(f.execute).toHaveBeenCalled();
        });

        it("frest.execute was called with mocks", function () {
            spyOn(f, 'execute');
            f.execute(mocks.RESTService2);
            expect(f.execute).toHaveBeenCalledWith(mocks.RESTService2);
        });


    });
});
