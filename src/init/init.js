const chalk = require("chalk")
const errors = require("../errors")
const fs = require('fs');
const log = require("loglevel");

const { target, template } = require("../paths");
const files = require("../files");
const paths = require("../paths");

const PATH_PACKAGE_JSON = "package.json"

const PACKAGE_JSON = {
    scripts: {
        "build": "gulp && jest",
        "test": "gulp test && jest"
    },
    devDependencies: {
        "@acdf/build": "^1.0.4"
    }
}

/**
 * Updates the package.json file
 */
function updatePackageJson(argv) {

    // Check that a package.json file exists
    if (!fs.existsSync(target(PATH_PACKAGE_JSON))) {
        throw new errors.CliError(`No '${PATH_PACKAGE_JSON}' file found. Please initialize a project in this directory using ${chalk.blueBright("npm init")}.`);
    }

    const packageObj = JSON.parse(fs.readFileSync(PATH_PACKAGE_JSON).toString());

    packageObj.devDependencies = { ...packageObj.devDependencies, ...PACKAGE_JSON.devDependencies }
    packageObj.scripts = { ...packageObj.scripts, ...PACKAGE_JSON.scripts };

    fs.writeFileSync(target(PATH_PACKAGE_JSON), JSON.stringify(packageObj, null, 2));

    argv.project = packageObj;
    return argv;
}

module.exports = {
    updatePackageJson: updatePackageJson,
    PACKAGE_JSON: PACKAGE_JSON,

    run: (argv) => {
        argv = updatePackageJson(argv);
        files.writeTemplate(paths.template("init"), "", paths.target(""), argv);
        log.info(`\nInitialization complete! You should run ${chalk.greenBright("npm i")}.`)
    }
}