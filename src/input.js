
const errors = require("./errors");
const inquirer = require("inquirer");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const log = require('loglevel');
const initCommand = require("./init/initCommand");
const packageCommand = require("./package/packageCommand");
const scriptCommand = require("./script/scriptCommand");
const chalk = require("chalk");
const { reorder } = require("./package/package");

/**
 * If the error is expected, the message is logged. If the error is unexpected,
 * the entire error is logged. 
 * 
 * @param {object} error 
 */
function handleError(error) {
    if (error instanceof errors.CliError) {
        log.error("\n" + chalk.redBright(error.message));

    } else {
        log.error(error);
    }
}

function provideOptions(yargs, command) {
    command.inputs.forEach(input => {
        const option = {
            ...(input.alias && { alias: input.alias }),
            type: input.dataType || "string",
            description: input.promptMessage || prompt.description
        }

        yargs.option(input.name, option)
    })
}

/**
 * Builds a yargs command that runs optional inquirer prompts before executing.
 * 
 * @param {object} command 
 * @returns 
 */
function provideCommand(command) {
    return {
        name: command.name,
        command: command.name,
        desc: command.desc,
        builder: yargs => provideOptions(yargs, command),
        handler: async argv => {
            const requiredPrompts = command.inputs
                .filter(input => {
                    // Prompt if we do not have arg
                    if (argv[input.name] == undefined) {
                        return true
                    }

                    // Prompt if we have arg, but it is invalid
                    if (!!input.validate) {
                        const invalid = input.validate(argv[input.name]) != true
                        if(invalid) log.warn(`Argument --${input.name} ${argv[input.name]} is invalid.`)
                        return invalid
                    }

                    // Otherwise, do not prompt
                    return false
                })
                .map(input => ({
                    name: input.name,
                    message: input.promptMessage,
                    default: input.default,
                    type: input.promptType,
                    choices: input.promptChoices,
                    validate: input.validate
                }))

            await inquirer.prompt(requiredPrompts)
                .then(answers => {
                    log.setLevel(argv.verbose ? "DEBUG" : "INFO");
                    try {
                        log.debug(`Running with arguments:`, argv)
                        command.handler({ ...argv, ...answers });
                    } catch (error) {
                        handleError(error)
                    }
                })
        }
    }
}

function readArgs() {
    yargs(hideBin(process.argv))
        .command(provideCommand(initCommand.init))
        .command("package", "manipulate packages", (yargs) => {
            yargs
                .command(provideCommand(packageCommand.new))
        })
        .command("script", "manipulate scripts", (yargs) => {
            yargs
                .command(provideCommand(scriptCommand.new))
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging'
        })
        .option('force', {
            alias: 'f',
            type: 'boolean',
            description: 'Overwrite existing files'
        })
        .help("h")
        .demandCommand()
        .parserConfiguration({
            "parse-numbers": false,
        })
        .parse()
}

module.exports = {
    readArgs: readArgs
}