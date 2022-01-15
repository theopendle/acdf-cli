const chalk = require("chalk");
const fs = require('fs');
const log = require('loglevel');
const path = require('path');

const files = require("../files");
const paths = require("../paths");

const FILENAME_CONFIG = "acdf.config.json";
const PATH_CONFIG = paths.target(FILENAME_CONFIG)

function readConfig() {
    if (fs.existsSync(PATH_CONFIG)) {
        return require(PATH_CONFIG);
    }

    throw `Please provide an '${chalk.greenBright(FILENAME_CONFIG)}' file. You can generate one by running ${chalk.greenBright("acdf init")}`
}

module.exports = {
    new: (argv) => {

        argv = { ...argv, ...(readConfig()) };

        const filename = `${argv.name}.${argv.type}.js`;
        const testFilename = `${argv.name}.test.js`;
        const targetDir = paths.target("src/js", argv.directory);

        if (!fs.existsSync(targetDir)) {
            log.info(`Creating folder: ${chalk.greenBright(targetDir)}`)
            fs.mkdirSync(targetDir, { recursive: true })
        }

        files.writeTemplateFile(paths.template("script"), `${argv.type}.script`, paths.target(targetDir), filename, argv)
        files.writeTemplateFile(paths.template("script"), `${argv.type}.test`, paths.target(targetDir), testFilename, argv)
    }
}