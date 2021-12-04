
const inquirer = require("inquirer");

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const INPUTS = [
    {
        common: {
            name: "namespace",
            default: "acdf",
            message: "The Adobe Campaign namespace for your project. eg: 'acdf'",
        },
        prompt: {
            type: "input",
            validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
        },
        option: {}
    },
    {
        common: {
            name: "force",
            default: false,
            message: "Overwrite existing files",
        },
        prompt: {
            type: "confirm",
        },
        option: {}
    },
    {
        common: {
            name: "verbose",
            default: false,
            message: "Run with verbose loggings",
        },
        option: {
            alias: "v"
        }
    }
]

async function readArgs() {
    return new Promise((resolve, reject) =>
        yargs(hideBin(process.argv))
            .command('init', 'initialze a new project in the current directory', () => { }, (argv) => {
                resolve(argv)
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
            .parse());
}

async function prompt(argv) {
    const prompts = INPUTS
        .filter(input => input.prompt)
        .map(input => ({ ...input.common, ...input.prompt }));

    return inquirer.prompt(prompts)
        .then(answers => ({ ...argv, ...answers }))
}

module.exports = {
    prompt: prompt,
    readArgs: readArgs
}