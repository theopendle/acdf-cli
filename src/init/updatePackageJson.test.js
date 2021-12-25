
const errors = require("../errors")
const init = require('./init');
const fs = require('fs');
const mock = require('mock-fs');

function runTest(mockPackageJson) {
    mock({ "package.json": JSON.stringify(mockPackageJson) });
    const argv = init.updatePackageJson({});
    return {
        packageJson: JSON.parse(fs.readFileSync("package.json").toString()),
        argv: argv
    }
}

describe('Initialization', () => {
    beforeAll(() => {
        mock({});
    });

    it("should throw an error if no package.json is present", () => {
        expect(() => init.updatePackageJson()).toThrow(errors.CliError);
    })

    it("should add package json properties to argv", () => {
        const packageObj = {
            name: "test",
            scripts: {
                doSomething: ""
            },
            devDependencies: {
                dep: "1.0.0"
            }
        }
        const argv = runTest({ name: "test" }).argv;
        const packageJson = runTest({ name: "test" }).packageJson;
        expect(argv.project).toEqual(packageJson)
    })

    it("should add devDependencies and scripts to package.json", () => {
        const actual = runTest({ name: "test" }).packageJson;
        expect(actual.devDependencies).toEqual(init.PACKAGE_JSON.devDependencies)
        expect(actual.scripts).toEqual(init.PACKAGE_JSON.scripts)
    })

    it("should append devDependencies and scripts to package.json", () => {
        const packageObj = {
            name: "test",
            scripts: {
                doSomething: ""
            },
            devDependencies: {
                dep: "1.0.0"
            }
        }
        const actual = runTest(packageObj).packageJson;
        expect(actual.devDependencies).toEqual({ ...packageObj.devDependencies, ...init.PACKAGE_JSON.devDependencies });
        expect(actual.scripts).toEqual({ ...packageObj.scripts, ...init.PACKAGE_JSON.scripts });
    })

    afterAll(() => {
        mock.restore();
    });
});