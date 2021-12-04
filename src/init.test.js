
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

    it("test", () => {
        mock({
            "package.json": '{"name": "test"}'
        });
        init.updatePackageJson();

        const packageObj = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        expect(packageObj.devDependencies).toStrictEqual(init.DEV_DEPENDENCIES)
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