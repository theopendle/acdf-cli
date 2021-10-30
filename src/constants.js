const CURR_DIR = process.cwd();

module.exports = {
    QUESTIONS: [
        {
            name: "dev-server",
            type: "input",
            message: "Type the base URL of your development server",
            validate: (input) => /./.test(input.match(input)) || "You shouldn't leave this field empty!",
            default: "https://adobecampaign.com"
        },
        {
            name: "instances",
            type: "input",
            message: "Provide a comma-separated list of instance names. eg: 'mta,mc,interaction'",
            validate: (input) => /[\w-]+,*/.test(input.match(input)) || "Please use only alphanumerics and '-' and '_'",
            default: "mta,mc"
        }
    ],
    JSON_COLORS: {
        colors: {
            STRING_KEY: 'green',
            STRING_LITERAL: 'white',
            NUMBER_LITERAL: 'blue'
        }}
}