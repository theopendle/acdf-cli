/**
 * Any objects, variables, functions or classes that you use in your scritps but 
 * are provided by the Adobe Campaign environment should be declasred in this 
 * file. 
 * 
 * This file serves two puposes:
 *   1. It is loaded during compilation in order to avoid compilation
 *      error by the GCC engine. FOr more information on this usage, see:
 *      https://developers.google.com/closure/compiler/docs/externs-and-exports
 * 
 *   2. It is loaded into the global scope during testing to avoid interpretation
 *      errors during test execution. Of course, if you wish to mock some
 *      functionality, you will have to override these declarations with a mock
 *      implementation.
 * 
 * For example, see the loging utilities declared below:
 */

/**
 * @fileoverview
 * @suppress {externsValidation} message
 */

// These methods have no implementation
global.logInfo = function (message) { }
global.logVerbose = function (message) { }
global.logWarning = function (message) { }
global.loadLibrary = function (name) { }

// This method will throw an error, which is useful in our tests
global.logError = function (message) {
    throw message;
}

// Add your externs here