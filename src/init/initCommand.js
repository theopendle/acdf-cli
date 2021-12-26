const init = require("./init")

module.exports = {
    init: {
        name: 'init',
        desc: 'initialze a new project in the current directory',
        handler: init.run,
        inputs: [
            {
                name: "namespace",
                promptMessage: "The Adobe Campaign namespace for your project. eg: 'acdf'",
                promptType: "input",
                optionDescription: "Adobe Campaign namespace for your project",
                default: "acdf",
                validate: (input) => /.*/.test(input.match(input)) || "You shouldn't leave this field empty!"
            },
            {
                name: "campaignBuildVersion",
                promptMessage: "The Adobe Campaign version",
                promptType: "input",
                default: "6.7",
                validate: (input) => /.*/.test(input.match(input)) || "You shouldn't leave this field empty!"
            },
            {
                name: "campaignBuildNumber",
                promptMessage: "The Adobe Campaign build number",
                promptType: "input",
                default: "9343",
                validate: (input) => /\d{4}/.test(input.match(input)) || "This should be a 4-digit number"
            },
            {
                name: "force",
                alias: "f",
                promptMessage: "Overwrite existing files",
                promptType: "confirm",
                dataType: "boolean",
                default: false
            }
        ]
    }
}

