const chalk = require("chalk");
const fs = require('fs');
const log = require('loglevel');
const path = require('path');

const files = require("../files");
const paths = require("../paths");

module.exports = {
    new: (argv) => {

        const targetFilepath = paths.target(argv.filepath);
        const filename = path.basename(argv.filepath);
        const targetDir = path.dirname(targetFilepath);

        if (!fs.existsSync(targetDir)) {
            log.info(`Creating folder: ${chalk.greenBright(targetDir)}`)
            fs.mkdirSync(targetDir, { recursive: true })
        }

        files.writeTemplateFile(paths.template("package"), "package.xml", paths.target(targetDir), filename, argv)
    }
}