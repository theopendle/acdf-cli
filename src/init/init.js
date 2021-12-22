const chalk = require("chalk")
const errors = require("../errors")
const fs = require('fs');
const handlebars = require('handlebars');
const log = require("loglevel");
const path = require("path");

const { target, template } = require("../paths");

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
 * Recursively reads all files in a directory into a flat list of paths.
 * 
 * @param {string} filepath 
 * @param {string[]} list 
 * @returns 
 */
function readDir(filepath, list) {

    if (!list) {
        list = [];
    }

    if (fs.lstatSync(filepath).isDirectory()) {
        fs.readdirSync(filepath).forEach((child) => readDir(path.resolve(filepath, child), list));

    } else {
        list.push(filepath)
    }
    return list;
}

/**
 * Updates the package.json file
 */
function updatePackageJson(argv) {

    // Check that a package.json file exists
    if (!fs.existsSync(target(PATH_PACKAGE_JSON))) {
        throw new errors.PackageJsonError(`No '${PATH_PACKAGE_JSON}' file found. Please initialize a project in this directory using ${chalk.blueBright("npm init")}.`);
    }

    const packageObj = JSON.parse(fs.readFileSync(PATH_PACKAGE_JSON).toString());

    packageObj.devDependencies = { ...packageObj.devDependencies, ...PACKAGE_JSON.devDependencies }
    packageObj.scripts = { ...packageObj.scripts, ...PACKAGE_JSON.scripts };

    fs.writeFileSync(target(PATH_PACKAGE_JSON), JSON.stringify(packageObj, null, 2));

    argv.project = packageObj;
    return argv;
}

function processTemplateFiles(argv) {
    handlebars.registerHelper('lowerCase', string => string.toLowerCase());
    handlebars.registerHelper('upperCase', string => string.toUpperCase());

    readDir(template("init")).forEach(templateFilePath => {

        const fileRelativePathTemplate = path.relative(template("init"), templateFilePath);
        const fileRelativePath = handlebars.compile(fileRelativePathTemplate)(argv);
        const targetFilepath = target(fileRelativePath);

        log.info(`Generating file ${fileRelativePath}`);

        if (fs.existsSync(targetFilepath)) {
            if (!argv.force) {
                throw new errors.FileExistsError(`Cannot generate file ${fileRelativePath} as this file already exists. ` +
                    `Please run with flag ${chalk.blueBright("--force")} or ${chalk.blueBright("-f")} to overrite existing files.`)
            }
        }

        log.debug(`${templateFilePath}: Reading`);
        const content = fs.readFileSync(templateFilePath).toString();

        log.debug(`${templateFilePath}: Compiling`);
        const compiledContent = handlebars.compile(content)(argv);

        log.debug(`${templateFilePath}: Writing`);

        // Write directory if required
        const targetDirpath = path.dirname(targetFilepath);
        if (!fs.existsSync(targetFilepath)) {
            fs.mkdirSync(targetDirpath, { recursive: true })
        }

        fs.writeFileSync(targetFilepath, compiledContent);
    })
}

module.exports = {
    updatePackageJson: updatePackageJson,
    processTemplateFiles: processTemplateFiles,
    PACKAGE_JSON: PACKAGE_JSON,

    run: (argv) => {
        argv = updatePackageJson(argv);
        processTemplateFiles(argv);
    }
}