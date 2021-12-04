
const errors = require("./errors")
const init = require('../src/init');
const fs = require('fs');
const mock = require('mock-fs');
const { hasUncaughtExceptionCaptureCallback } = require('process');

describe('Initialization', () => {
    beforeAll(() => {
        mock({});
    });

    it("should throw an error if no package.json is present", () => {
        expect(() => init.updatePackageJson()).toThrow(errors.PackageJsonError);
    })

    it("test", () => {
        mock({
            "package.json": '{"name": "test"}'
        });
        init.updatePackageJson();

        const packageObj = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        expect(packageObj.devDependencies).toStrictEqual(init.DEV_DEPENDENCIES)
    })

    afterAll(() => {
        mock.restore();
    });
});