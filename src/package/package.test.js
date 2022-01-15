
const packages = require("./package");
const fs = require('fs');
const handlebars = require('handlebars');
const mock = require('mock-fs');

function runTest(relativeFilePath) {
    packages.new({ filepath: relativeFilePath, namespace: "test"})

    const expectedContent = "Test: test"
    const expectedPath = `target/src/packages/${relativeFilePath}`;

    expect(fs.existsSync(expectedPath)).toBe(true);
    expect(fs.readFileSync(expectedPath).toString()).toBe(expectedContent);
}

describe('Creating a new package', () => {

    beforeEach(() => {
        mock({
            "src": {
                "package": {
                    "template": {
                        "package.xml": "Test: {{namespace}}"
                    }
                }
            },
            "target": {
                "src": {
                    "packages": {}
                }
            }
        });
        jest.spyOn(process, 'cwd').mockReturnValue("target/src");
    });

    it("it should create a new package at level 1", () => {
        runTest("test.xml")
    })

    it("it should create a new package at level 2", () => {
        runTest("common/test.xml")
    })

    it("it should create a new package at level 3", () => {
        runTest("application/mta/test.xml")
    })

    afterEach(() => {
        mock.restore();
        jest.clearAllMocks();
    });
});