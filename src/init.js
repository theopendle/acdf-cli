const chalk = require("chalk")
const errors = require("./errors")
const fs = require('fs');
const handlebars = require('handlebars');
const log = require("loglevel");
const path = require("path");

const { target, template } = require("./paths")

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

module.exports = {
    updatePackageJson: () => {

        // Check that a package.json file exists
        if (!fs.existsSync(target(PATH_PACKAGE_JSON))) {
            throw new errors.PackageJsonError(`No '${PATH_PACKAGE_JSON}' file found. Please initialize a project in this directory using ${chalk.blue("npm init")}.`);
        }

        const packageObj = JSON.parse(fs.readFileSync(PATH_PACKAGE_JSON).toString());

        packageObj.devDependencies = { ...packageObj.devDependencies, ...PACKAGE_JSON.devDependencies }
        packageObj.scripts = { ...packageObj.scripts, ...PACKAGE_JSON.scripts }

        fs.writeFileSync(target(PATH_PACKAGE_JSON), JSON.stringify(packageObj, null, 2));
    },

    processTemplateFiles: (compilationInput) => {
        readDir(template()).forEach(templateFilePath => {

            const fileRelativePath = path.relative(template(), templateFilePath);
            const targetFilepath = target(fileRelativePath);

            log.info(`Generating file ${fileRelativePath}`);

            if (fs.existsSync(targetFilepath)) {
                throw new errors.FileExistsError(`Cannot genereate file ${fileRelativePath} as this file already exists. ` +
                    `Please run with flag ${chalk.blueBright("--force")} or ${chalk.blueBright("-f")} to overrite existing files.`)
            }

            log.debug(`${templateFilePath}: Reading`);
            const content = fs.readFileSync(templateFilePath).toString();

            log.debug(`${templateFilePath}: Compiling`);
            const compiledContent = handlebars.compile(content)(compilationInput);

            log.debug(`${templateFilePath}: Writing`);

            // Write directory if required
            const targetDirpath = path.dirname(targetFilepath);
            if (!fs.existsSync(targetFilepath)) {
                fs.mkdirSync(targetDirpath, { recursive: true })
            }

            fs.writeFileSync(targetFilepath, compiledContent);
        })
    },

    PACKAGE_JSON: PACKAGE_JSON
}