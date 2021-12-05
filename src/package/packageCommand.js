const package = require("./package")

module.exports = {

    new: {
        command: 'package new [number] [name]',
        desc: 'create a new package',
        handler: package.new,
        prompts: (argv) => {

            const prompts = []

            if (!argv.name) {
                prompts.push({
                    name: "name",
                    message: "Package name",
                    default: "schema",
                    type: "input",
                    validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
                });
            }

            if (!argv.number) {
                prompts.push({
                    name: "number",
                    message: "Package installation number",
                    default: "1",
                    type: "input",
                    validate: (input) => /^\d\d?\d?$/.test(input.match(input)) || "Should be a number from 0 - 999"
                })
            }
            return prompts
        }
    },

    number: {
        command: 'package number [number] [arithmatic]',
        desc: 'change package installation numbers',
        handler: package.number,
        prompts: (argv) => {
            const prompts = []

            if (!argv.number) {
                prompts.push({
                    name: "name",
                    message: "Package name",
                    default: "schema",
                    type: "input",
                    validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!"
                });
            }

            prompts.push({
                name: "number",
                message: "Package installation number",
                default: "1",
                type: "input",
                validate: (input) => /^\d\d?\d?$/.test(input.match(input)) || "Should be a number from 0 - 999"
            })
            return prompts
        }
    }


}

