
const packages = require("./package");
const fs = require('fs');
const mock = require('mock-fs');

const PATH_TARGET_DIR = "/target";
const PATH_SRC_PACKAGES = PATH_TARGET_DIR + "/src/packages/";

function runTest(packageMockFs, expected) {
    mock({
        "/target": {
            "src": {
                "packages": packageMockFs
            }
        }
    });

    const actual = packages.findPackages(PATH_SRC_PACKAGES)

    expect(actual).toStrictEqual(expected);
}

describe('Finding existing packages', () => {
    beforeAll(() => {
        mock({});
    });

    it("it should return the existing packages", async () => {
        runTest(
            {
                "000.javascript.xml": "",
                "001.schema.xml": "",
                "002.operator.xml": "",
            },
            {
                "0": { name: "javascript", filepath: PATH_SRC_PACKAGES + "000.javascript.xml" },
                "1": { name: "schema", filepath: PATH_SRC_PACKAGES + "001.schema.xml" },
                "2": { name: "operator", filepath: PATH_SRC_PACKAGES + "002.operator.xml" },
            }
        )
    })

    it("it should exclude package with invalid names", async () => {
        runTest(
            {
                "000javascript.xml": "",
                "001.schema.xml": "",
            },
            {
                "1": { name: "schema", filepath: PATH_SRC_PACKAGES + "001.schema.xml" },
            }
        )
    })

    it("it should exclude packages with duplicate numbers but not names", async () => {
        runTest(
            {
                "000.javascript.xml": "",
                "001.schema.xml": "",
                "001.operators.xml": "",
                "002.schema.xml": "",
            },
            {
                "0": { name: "javascript", filepath: PATH_SRC_PACKAGES + "000.javascript.xml" },
                "1": { name: "schema", filepath: PATH_SRC_PACKAGES + "001.schema.xml" },
                "2": { name: "schema", filepath: PATH_SRC_PACKAGES + "002.schema.xml" },
            }
        )
    })

    afterAll(() => {
        mock.restore();
    });
});