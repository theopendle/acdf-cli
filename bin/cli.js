#!/usr/bin/env node

const chalk = require('chalk');
const errors = require('../src/errors');
const log = require('loglevel');

const { readArgs } = require("../src/input");

async function run() {
    readArgs()
}

run();