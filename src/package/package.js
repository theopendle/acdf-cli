const chalk = require("chalk");
const { groupEnd } = require("console");
const fs = require('fs');
const log = require('loglevel');
const path = require('path');

const errors = require("../errors");
const paths = require("../paths");

const PATH_TARGET_PACKAGE_DIR = paths.target("src/packages")
const REGEX_PACKAGE_NAME_AND_NUMBER = /(?<number>\d{3})\.(?<name>\w+)\.xml/
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

        const regex = REGEX_PACKAGE_NAME_AND_NUMBER
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

        map[parseInt(groups.number)] = {
            name: groups.name,
            number: parseInt(groups.number),
            filepath: filepath,
        }
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

/**
 * Converts a string to an int. Throws an error if the parsing cannot be done.
 * 
 * @param {string} numberAsString 
 * @returns the number as an int
 */
function packageNumberAsInt(numberAsString) {
    // Check that number is a valid integer
    const numberInt = parseInt(numberAsString)
    if (!numberInt) {
        throw new errors.CliError(`Package number invalid. Please use an integer from ${chalk.blueBright("1")} to ${chalk.blueBright("999")}.`)
    }
    return numberInt
}

/**
 * Allocated the package with the new number. If the number is already taken, then the package order will
 * be shifter up one to make room.
 * 
 * eg: 1,2,3 update number 1 to 3 becomes 1,3,4
 * 
 * @param {object} packageMap 
 * @param {number} newNumber 
 * @param {object} package 
 * @returns the updated package map
 */
function updatePackageMap(packageMap, newNumber, package) {

    // Determine the new file for the package after update
    let newFilePath;
    if (packageMap.oldFilename) {
        const oldFilename = path.basename(package.filepath)
        newFilePath = package.filepath.replace(oldFilename, `${pad()}`)
    } else {
        newFilepath = path.resolve(PATH_TARGET_PACKAGE_DIR, `${pad(newNumber)}.${package.name}.xml`)
    }

    const newPackage = {
        ...package,
        newFilepath: newFilepath,
        newNumber: newNumber
    }

    // If the number is not used, then update the number and remove the original
    if (!packageMap[newNumber]) {
        packageMap[newNumber] = newPackage
        delete packageMap[package.number]
        return packageMap
    }

    // If the number is used, recurse
    updatePackageMap(packageMap, newNumber + 1, packageMap[newNumber])
    packageMap[newNumber] = newPackage
    delete packageMap[package.number]
    return packageMap
}

function writePackages(packageMap) {
    Object.keys(packageMap).forEach(key => {
        const pkg = packageMap[key]
        if (key != pkg.number) {
            log.info(`${pkg.filepath} -> ${pkg.newFilePath}`)
            fs.renameSync(pkg.filepath, pkg.newFilepath)
        }
    })
}

module.exports = {
    findPackages: findPackages,

    new: (argv) => {

        const numberInt = packageNumberAsInt(argv.number)
        const packageMap = findPackages(PATH_TARGET_PACKAGE_DIR)

        // Warn if package number already exists
        if (packageMap[numberString]) {
            log.warn(`Package with number ${argv.numer} already exists: '${packageMap[numberInt]}'`)
            // TODO
        }


        console.log(`Creating new package ${argv.number}-${argv.name}.xml`)
    },

    reorder: (argv) => {

        const numberInt = packageNumberAsInt(argv.number)
        let packageMap = findPackages(paths.target("src/packages"))

        const packageToReorder = packageMap[numberInt]

        if (!packageToReorder) {
            throw new errors.CliError(`Cannot reorder package number ${argv.number} as no such package exists`)
        }

        packageMap = updatePackageMap(packageMap, packageNumberAsInt(argv.target), packageToReorder)
        writePackages(packageMap)
    }
}