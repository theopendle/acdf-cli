
const errors = require("./errors");
const inquirer = require("inquirer");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const log = require('loglevel');
const initCommand = require("./init/initCommand");
const packageCommand = require("./package/packageCommand");
const chalk = require("chalk");

/**
 * If the error is expected, the message is logged. If the error is unexpected,
 * the entire error is logged. 
 * 
 * @param {object} error 
 */
function handleError(error) {
    if (Object.keys(errors)
        .map(key => errors[key])
        .some(customError => error instanceof customError)) {

        log.error("\n" + chalk.redBright(error.message));

    } else {
        log.error(error);
    }
}

/**
 * Builds a yargs command that runs optional inquirer prompts before executing.
 * 
 * @param {object} command 
 * @returns 
 */
function provideCommand(command) {
    return {
        name: command.command,
        command: command.command,
        desc: command.desc,
        handler: (argv) => {
            inquirer.prompt(command.prompts(argv))
                .then(answers => {
                    log.setLevel(argv.verbose ? "DEBUG" : "INFO");
                    try {
                        command.handler({ ...argv, ...answers });
                    } catch (error) {
                        handleError(error)
                    }
                })
        }
    }
}

async function readArgs() {
    return new Promise((resolve, reject) => {

        const init = provideCommand(initCommand.init, resolve)
        const packageNew = provideCommand(packageCommand.new, resolve)
        const packageNumber = provideCommand(packageCommand.number, resolve)

        yargs(hideBin(process.argv))
            .command(init)
            .command("package", "manipulate packages", (yargs) => {
                yargs
                    .command(packageNew)
                    .command(packageNumber)
            })
            .option('verbose', {
                alias: 'v',
                type: 'boolean',
                description: 'Run with verbose logging'
            })
            .option('force', {
                alias: 'f',
                type: 'boolean',
                description: 'Overwrite existing files during initialization'
            })
            .help("h")
            .demandCommand()
            .parse()
    })
}

module.exports = {
    readArgs: readArgs
}