
const fs = require('fs');

const { handlebars } = require('./handlebars');
const mock = require('mock-fs');
const files = require("./files");
const paths = require("./paths");

const EXPECTED_CONTENT = "test";

function runWriteTemplateFileTest(relativeFilePath, targetDir, newFilename, expectedPath, argv) {
    const actualPath = files.writeTemplateFile(paths.template("test"), relativeFilePath, targetDir, newFilename, { ...argv, testProperty: EXPECTED_CONTENT, testName: "expected" })
    expectedPath = paths.target(expectedPath)

    expect(actualPath).toBe(expectedPath);
    expect(fs.existsSync(expectedPath)).toBe(true);
    expect(fs.readFileSync(expectedPath).toString()).toBe(EXPECTED_CONTENT);
}

function runWriteTemplateTest(templateDir, targetDir, expectedPaths, argv) {
    files.writeTemplate(paths.template("test"), templateDir, targetDir, { ...argv, testProperty: EXPECTED_CONTENT, testName: "expected" })

    expectedPaths.forEach(expectedPath => {
        expectedPath = paths.target(expectedPath)
        expect(fs.existsSync(expectedPath)).toBe(true);
        expect(fs.readFileSync(expectedPath).toString()).toBe(EXPECTED_CONTENT);
    })
}

describe('Writing files', () => {

    beforeEach(() => {
        mock({
            "src": {
                "test": {
                    "template": {
                        "test": "{{testProperty}}",
                        "test-{{testName}}": "{{testProperty}}"
                    }
                }
            },
            "target": {
                "src": {
                    "existing": "",
                    "level2": {}
                }
            }
        });
        jest.spyOn(process, 'cwd').mockReturnValue("target/src");
    });

    afterEach(() => {
        mock.restore();
        jest.clearAllMocks();
    });

    describe('Writing a single file', () => {

        it("it should write a new file", () => {
            runWriteTemplateFileTest("test", "", null, "test", {})
        })

        it("it should write a new file in a directory", () => {
            runWriteTemplateFileTest("test", "level2", null, "level2/test", {})
        })

        it("it should write a new file with a new name", () => {
            runWriteTemplateFileTest("test", "", "expected", "expected", {})
        })

        it("it should write a new file compiled name", () => {
            runWriteTemplateFileTest("test-{{testName}}", "", null, "test-expected", {})
        })

        it("it should abort if file already exists", () => {
            expect(() => runWriteTemplateFileTest("test", "", null, "existing", {})).toThrow()
        })

        it("it should overwrite if file already exists but force is true", () => {
            runWriteTemplateFileTest("test", "", "existing", "existing", { force: true })
        })

    });

    describe('Writing a directory', () => {

        it("it should write a new directory", () => {
            runWriteTemplateTest("", "", [
                "test",
                "test-expected"
            ], {})
        })

        it("it should write only directory contents", () => {
            // runTest("test", "level2", null, "level2/test")
        })
    });
});