
const errors = require("./errors")
const init = require('../src/init');
const fs = require('fs');
const mock = require('mock-fs');

const { target, project, template } = require("./paths");

const TARGET_DIR = "/tmp/target";
const SIMPLE_SAMPLE_CONTENT = "sample";

describe('Initialization', () => {
    beforeAll(() => {
        mock({});
    });

    it("should throw an error if no package.json is present", () => {
        expect(() => init.updatePackageJson()).toThrow(errors.PackageJsonError);
    })

    it("should add devDependencies and scripts to package.json", () => {
        const packageObj = {
            name: "test",
        }
        mock({ "package.json": JSON.stringify(packageObj) });

        init.updatePackageJson();

        const actual = JSON.parse(fs.readFileSync("package.json").toString());

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
        mock({ "package.json": JSON.stringify(packageObj) });

        init.updatePackageJson();

        const actual = JSON.parse(fs.readFileSync("package.json").toString());

        expect(actual.devDependencies).toEqual({ ...packageObj.devDependencies, ...init.PACKAGE_JSON.devDependencies })
        expect(actual.scripts).toEqual({ ...packageObj.scripts, ...init.PACKAGE_JSON.scripts })
    })

    it("it should copy a template file into the target directory", async () => {
        mock({
            "template": {
                "sample.txt": SIMPLE_SAMPLE_CONTENT
            }
        });
        jest.spyOn(process, 'cwd').mockReturnValue(TARGET_DIR);

        init.processTemplateFiles()

        const samplePath = target("sample.txt");
        expect(fs.existsSync(samplePath)).toBe(true)

        const actual = fs.readFileSync(samplePath).toString();
        expect(actual).toStrictEqual(SIMPLE_SAMPLE_CONTENT);
    })



    afterAll(() => {
        mock.restore();
    });
});