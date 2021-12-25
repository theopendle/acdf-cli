
const packages = require("./package");
const fs = require('fs');
const mock = require('mock-fs');

const { target, project, template } = require("../paths");

const TARGET_DIR = "/tmp/target";
const SIMPLE_SAMPLE_CONTENT = "sample";

function runTest(packageMockFs, expected) {
    mock({
        "src": {
            "packages": packageMockFs
        }
    });
    jest.spyOn(process, 'cwd').mockReturnValue(TARGET_DIR);

    const actual = packages.findPackages("src/packages")

    expect(actual).toStrictEqual(expected);
}

describe('Finding existing packages', () => {
    beforeAll(() => {
        mock({});
    });

    it("it should return the existing packages", async () => {
        runTest(
            {
                "src": {
                    "packages": {
                        "000.javascript.xml": "",
                        "001.schema.xml": "",
                        "002.operator.xml": "",
                    }
                }
            },
            {
                "0": "javascript",
                "1": "schema",
                "2": "operator"
            }
        )
    })

    it("it should exclude package with invalid names", async () => {
        runTest(
            {
                "src": {
                    "packages": {
                        "000javascript.xml": "",
                        "001.schema.xml": "",
                    }
                }
            },
            {
                "1": "schema",
            }
        )
    })

    it("it should exclude packages with duplicate numbers but not names", async () => {
        runTest(
            {
                "src": {
                    "packages": {
                        "000.javascript.xml": "",
                        "001.schema.xml": "",
                        "001.operators.xml": "",
                        "002.schema.xml": "",
                    }
                }
            },
            {
                "0": "javascript",
                "1": "schema",
                "2": "schema",
            }
        )
    })

    afterAll(() => {
        mock.restore();
    });
});