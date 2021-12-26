const chalk = require("chalk")
const fs = require('fs');
const log = require('loglevel');
const path = require('path');

const errors = require("../errors");
const paths = require("../paths");

const REGEX_PACKAGE_NAME_AND_NUMBER = /^(\d{3})(\.\w+\.xml)$/g
const LENGTH_PACKAGE_NUMBER = 3

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

        map[parseInt(groups.number)] = { name: groups.name, filepath: filepath }
    }
    return map;
}

/**
 * Pads a package number with zeroes.
 * 
 * @param {string} number 
 * @returns the padded number as a string
 */
function pad(number) {
    const string = typeof number === "string"
        ? number
        : number.toString()

    if (string.length === 0 || string.length > 3) {
        throw `Cannot pad package number ${number}. Should be 1 - 3 digits.`
    }

    return string.padStart(LENGTH_PACKAGE_NUMBER, "0")
}

module.exports = {
    findPackages: findPackages,

    new: (argv) => {

        // Check that number is a valid integer
        const numberInt = parseInt(argv.number)
        if (!numberInt) {
            throw new errors.CliError(`Package number invalid. Please use an integer from ${chalk.blueBright("1")} to ${chalk.blueBright("999")}.`)
        }

        const numberString = numberInt.toString()
        const packageMap = findPackages(paths.target("src/packages"))

        // Warn if package number already exists
        if (packageMap[numberString]) {
            log.warn(`Package with number ${argv.numer} already exists: '${packageMap[numberString]}'`)
            // TODO
        }


        console.log(`Creating new package ${argv.number}-${argv.name}.xml`)
    },

    reorder: (argv) => {
        console.log(`REORDER`)
    }
}