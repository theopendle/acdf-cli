#!/usr/bin/env node

const chalk = require('chalk');
const errors = require('../src/errors');
const log = require('loglevel');

const { updatePackageJson, processTemplateFiles } = require("../src/init");
const { prompt, readArgs } = require("../src/input");

async function run() {
    try {
        let argv = await readArgs();
        argv = await prompt(argv);
        argv = await updatePackageJson(argv);

        console.log(JSON.stringify(argv, null, 2))

        log.setLevel(argv.verbose ? "DEBUG" : "INFO");
        processTemplateFiles(argv);

    } catch (error) {
        if (Object.keys(errors)
            .map(key => errors[key])
            .some(customError => error instanceof customError)) {

            log.error("\n" + chalk.redBright(error.message));

        } else {
            log.error(error);
        }
    }
}

run();