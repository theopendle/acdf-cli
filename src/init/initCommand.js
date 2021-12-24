const init = require("./init")

module.exports = {
    init: {
        command: 'init',
        desc: 'initialze a new project in the current directory',
        handler: init.run,
        prompts: (argv) => {
            const prompts = [
                {
                    name: "namespace",
                    message: "The Adobe Campaign namespace for your project. eg: 'acdf'",
                    default: "acdf",
                    type: "input",
                    validate: (input) => /.*/.test(input.match(input)) || "You shouldn't leave this field empty!"
                },
                {
                    name: "campaignVersion",
                    message: "The Adobe Campaign version",
                    default: "6.7",
                    type: "input",
                    validate: (input) => /.*/.test(input.match(input)) || "You shouldn't leave this field empty!"
                },
                {
                    name: "campaignBuildVersion",
                    message: "The Adobe Campaign build version",
                    default: "9343",
                    type: "input",
                    validate: (input) => /\d{4}/.test(input.match(input)) || "You shouldn't leave this field empty!"
                }
            ]

            if (!argv.force) {
                prompts.push({
                    name: "force",
                    default: false,
                    message: "Overwrite existing files",
                    type: "confirm",
                });
            }

            return prompts
        }
    }
}

