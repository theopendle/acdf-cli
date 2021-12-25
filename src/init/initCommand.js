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
                    name: "campaignBuildVersion",
                    message: "The Adobe Campaign version",
                    default: "6.7",
                    type: "input",
                    validate: (input) => /.*/.test(input.match(input)) || "You shouldn't leave this field empty!"
                },
                {
                    name: "campaignBuildNumber",
                    message: "The Adobe Campaign build number",
                    default: "9343",
                    type: "input",
                    validate: (input) => /\d{4}/.test(input.match(input)) || "This should be a 4-digit number"
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

