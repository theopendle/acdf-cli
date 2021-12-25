const chalk = require("chalk")
const fs = require('fs');
const log = require('loglevel');
const path = require('path');

const errors = require("../errors");
const paths = require("../paths");

const REGEX_PACKAGE_NAME_AND_NUMBER = /^(\d{3})(\.\w+\.xml)$/g

/**
 * Recursively finds all packages in a directory into a map.
 * 
 * @param {string} filepath 
 * @param {object} map 
 * @returns a map where the key is the package number and the value is the package name
 */
function findPackages(filepath, map) {

    if (!map) {
        map = {};
    }

    if (fs.lstatSync(filepath).isDirectory()) {
        fs.readdirSync(filepath).forEach((child) => findPackages(path.resolve(filepath, child), map));

    } else {
        const fileBasename = path.basename(filepath)

        const regex = /(?<number>\d{3})\.(?<name>\w+)\.xml/;
        const match = fileBasename.match(regex)

        if (!match || !match.groups) {
            log.warn(`Found package with invalid file name nomenclature: '${filepath}'`)
            return map
        }

        const groups = match.groups

        // Warn if duplicate package numbers are found
        if (map[groups.number]) {
            log.warn(`Found duplicate package numbers: ${groups.number + map[groups.number]} and ${fileBasename}`)
            return map
        }

        map[parseInt(groups.number)] = groups.name
    }
    return map;
}

module.exports = {
    new: (argv) => {
        const numberInt = parseInt(argv.number)
        if (!numberInt) {
            throw new errors.CliError(`Package number invalid. Please use an integer from ${chalk.blueBright("1")} to ${chalk.blueBright("999")}.`)
        }

        const packageMap = findPackages(paths.target("src/packages"))
        console.log(packageMap)

        if (packageMap[numberInt]) {

        }


        console.log(`Creating new package ${argv.number}-${argv.name}.xml`)
    },
    number: (argv) => {
        console.log(`MOVE`)
    }
}

module.exports = {
    findPackages: findPackages
}