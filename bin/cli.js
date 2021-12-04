#!/usr/bin/env node

const init = require("../src/init");
const errors = require('../src/errors');
const log = require('loglevel');

try {
    init.updatePackageJson();
    init.processTemplateFiles();
} catch (error) {
    if (Object.keys(errors)
        .map(key => errors[key])
        .some(customError => error instanceof customError)) {

        log.error(error.message);

    } else {
        log.error(error);
    }
}