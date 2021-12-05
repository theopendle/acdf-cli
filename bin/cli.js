#!/usr/bin/env node

const chalk = require('chalk');
const errors = require('../src/errors');
const log = require('loglevel');

const { readArgs } = require("../src/input");

async function run() {
    try {
        await readArgs();
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