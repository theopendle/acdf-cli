
const inquirer = require("inquirer");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const log = require('loglevel');
const initCommand = require("./init/initCommand");
const packageCommand = require("./package/packageCommand");


function provideCommand(command, resolve) {
    return {
        name: command.command,
        command: command.command,
        desc: command.desc,
        handler: (argv) => {
            inquirer.prompt(command.prompts(argv))
                .then(answers => {
                    log.setLevel(argv.verbose ? "DEBUG" : "INFO");
                    command.handler({ ...argv, ...answers });
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
            .command(packageNew)
            .command(packageNumber)
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