const package = require("./package")

VALIDATOR_PACKAGE_NUMBER = (input) => /^\d\d?\d?$/.test(input.match(input)) || "Should be a number from 0 - 999"

module.exports = {

    new: {
        name: 'new',
        desc: 'create a new package',
        handler: package.new,
        inputs: [
            {
                name: "name",
                promptMessage: "Package name",
                promptType: "input",
                default: "schema",
                validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
            },
            {
                name: "number",
                promptMessage: "Package installation number",
                promptType: "input",
                default: "1",
                validate: VALIDATOR_PACKAGE_NUMBER
            }

        ]
    },

    reorder: {
        name: 'reorder',
        desc: 'change package installation numbers',
        handler: package.reorder,
        inputs: [
            {
                name: "number",
                promptMessage: "Package installation number",
                promptType: "input",
                default: "1",
                validate: VALIDATOR_PACKAGE_NUMBER
            },
            {
                name: "target",
                promptMessage: "What number would you like the package to become?",
                promptType: "input",
                default: "1",
                validate: VALIDATOR_PACKAGE_NUMBER
            }
        ]
    },
}
