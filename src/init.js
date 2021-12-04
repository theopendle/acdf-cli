const chalk = require("chalk")
const errors = require("./errors")
const log = require("loglevel");
const fs = require('fs');

const { target } = require("./paths")

const PATH_PACKAGE_JSON = "package.json"

const DEV_DEPENDENCIES = {
    "@acdf/build": "^1.0.4"
}

module.exports = {
    updatePackageJson: () => {

        // Check that a package.json file exists
        if (!fs.existsSync(target(PATH_PACKAGE_JSON))) {
            throw new errors.PackageJsonError(`No '${PATH_PACKAGE_JSON}' file found. Please initialize a project in this directory using ${chalk.blue("npm init")}.`);
        }

        const packageObj = require(target(PATH_PACKAGE_JSON));
        packageObj.devDependencies = { ...packageObj.devDependencies, ...DEV_DEPENDENCIES }

        fs.writeFileSync(target(PATH_PACKAGE_JSON), JSON.stringify(packageObj, null, 2));
    },

    DEV_DEPENDENCIES: DEV_DEPENDENCIES
}