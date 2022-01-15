const chalk = require("chalk")
const fs = require('fs');
const handlebars = require('handlebars');
const log = require("loglevel");
const path = require('path');
const errors = require("./errors");
const paths = require("./paths");

/**
 * Reads, compiles and writes the contents of a template file to a target directory.
 * 
 * @param {string} templateDir the root directory holding the templates to write
 * @param {string} templatePath the path of the template (dir or file) relative to the templateDir
 * @param {string} targetDir the root directory where the template should be written
 * @param {string} newFilename the name of the file to write (null to keep template name)
 * @param {object} argv object containing templating properties
 * @returns {string} the absolute path of the file created
 */
function writeTemplateFile(templateDir, templatePath, targetDir, newFilename, argv) {

    const templateFilePath = path.resolve(templateDir, templatePath)

    // Use a different target filename if provided
    const filename = newFilename
        ? newFilename
        : path.basename(templatePath);
    const targetFilePath = handlebars.compile(path.resolve(path.dirname(paths.target(targetDir, templatePath)), filename))(argv)

    // If file exists and force is false, abort
    if (fs.existsSync(targetFilePath)) {
        if (!argv.force) {
            throw new errors.CliError(`Cannot generate file '${targetFilePath}' as this file already exists. ` +
                `Please run with flag ${chalk.blueBright("--force")} or ${chalk.blueBright("-f")} to overrite existing files.`)
        }
    }
    log.info(`Generating file ${chalk.greenBright(targetFilePath)}`);

    log.debug(`${targetFilePath}: Reading`);
    const content = fs.readFileSync(templateFilePath).toString();

    log.debug(`${targetFilePath}: Compiling`);
    const compiledContent = handlebars.compile(content)(argv);

    log.debug(`${targetFilePath}: Writing`);
    fs.writeFileSync(targetFilePath, compiledContent);

    return targetFilePath;
}

/**
 * Recursively reads, compiles and writes the contents of a template directory to a target directory.
 * 
 * @param {string} templateDir the root directory holding the templates to write
 * @param {string} templatePath the path of the template (dir or file) relative to the templateDir
 * @param {string} targetDir the root directory where the template should be written
 * @param {object} argv object containing templating properties
 */
function writeTemplate(templateDir, templatePath, targetDir, argv) {
    const templateDirPath = path.resolve(templateDir, templatePath);

    // If file, write
    if (fs.statSync(templateDirPath).isFile()) {
        writeTemplateFile(templateDir, templatePath, targetDir, null, argv)
        return;
    }

    // If directory, write directory and recurse on children
    const targetDirPath = handlebars.compile(paths.target(targetDir, templatePath))(argv);
    if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath);
    }
    fs.readdirSync(templateDirPath)
        .forEach(child => writeTemplate(templateDir, path.join(templatePath, child), targetDir, argv))

}

module.exports = {
    writeTemplateFile: writeTemplateFile,

    writeTemplate: function (templateDir, templatePath, targetDir, argv) {
        handlebars.registerHelper('lowerCase', string => string.toLowerCase());
        handlebars.registerHelper('upperCase', string => string.toUpperCase());
        writeTemplate(templateDir, templatePath, targetDir, argv);
    }
}