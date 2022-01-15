const script = require("./script")

VALIDATOR_PACKAGE_NUMBER = (input) => /^\d\d?\d?$/.test(input.match(input)) || "Should be a number from 0 - 999"

const SCRIPT_TYPES = [
    { name: "Activity (to be used in workflow)", value: "activity" },
    { name: "Library (to be imported by other scripts)", value: "library" },
    { name: "Typology (to be used in a typology rule)", value: "typology" },
]

module.exports = {

    new: {
        name: 'new',
        desc: 'create a new JS script',
        handler: script.new,
        inputs: [
            {
                name: "type",
                promptMessage: "Filepath relative to 'packages' folder",
                promptType: "list",
                promptChoices: SCRIPT_TYPES,
                validate: (input) => SCRIPT_TYPES.map(type => type.value).includes(input)
            },
            {
                name: "name",
                promptMessage: "Name of the script without any extensions",
                promptType: "input",
                default: "misc",
                validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
            },
            {
                name: "directory",
                promptMessage: "Directory in which to create the script, relative to the 'js' folder",
                promptType: "input",
                default: "common",
                validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
            }

        ]
    }
}
