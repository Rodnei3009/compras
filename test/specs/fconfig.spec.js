define([ 'require'
    , 'lodash'
    , 'angular'
    , 'angular-mocks'
    , '$App/fconfig'
    , 'mocks'
], function (require, _, angular) {
    var fConfig = require('$App/fconfig'),
        mocks = require('mocks');

    describe("fconfig test", function () {
        var parse, configInst;
        beforeEach(inject(function ($parse) {
            parse = $parse;
            configInst = fConfig(parse);
            configInst.init(mocks.configTest.context);
        }));

        it("config should be defined", function () {
            expect(fConfig).toBeDefined();
        });
        it("result should be undefined", function () {
            // configInst = fConfig(parse);
            // configInst.init(mocks.configTest.context);
            expect(configInst.get(mocks.configTest.expression.exp1)).not.toBeDefined();

        });
        it("getter should work", function () {
            expect(configInst.get(mocks.configTest.expression.exp)).toEqual(mocks.configTest.context.right);

        });


        it("should change a value", function () {
            configInst.add(mocks.configTest.expression.exp, mocks.configTest.expression.changeExp);
            expect(configInst.get(mocks.configTest.expression.exp)).toEqual(mocks.configTest.expression.changeExp);

        });

        it("should add key,value", function () {
            configInst.add(mocks.configTest.expression.addExp, mocks.configTest.expression.addValue);
            expect(configInst.get(mocks.configTest.expression.addExp)).toEqual(mocks.configTest.expression.addValue);
        });

        it("should response config", function () {
            expect(configInst.all()).toEqual(mocks.configTest.context);
        });

        it("should remove value", function () {
            configInst.remove(mocks.configTest.expression.exp);
            expect(configInst.get(mocks.configTest.expression.exp)).not.toBeDefined();
        });
    });

});
