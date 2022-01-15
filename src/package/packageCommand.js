const package = require("./package")

VALIDATOR_PACKAGE_NUMBER = (input) => /^\d\d?\d?$/.test(input.match(input)) || "Should be a number from 0 - 999"

module.exports = {

    new: {
        name: 'new',
        desc: 'create a new package',
        handler: package.new,
        inputs: [
            {
                name: "filepath",
                promptMessage: "Filepath relative to 'packages' folder",
                promptType: "input",
                default: "common/000.newPackage.xml",
                validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
            }

        ]
    }
}
