const chalk = require('chalk');
const fs = require("fs");
const ncp = require('ncp').ncp;



module.exports = {

    createDirectoryContents: (workingDir, templateDir) => {
        fs.readdirSync(templateDir)
            .forEach(rootFolder => {
                ncp(`${templateDir}/${rootFolder}`, `${workingDir}/${rootFolder}`, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            })
    },

    createInstanceConfFolders: (workingDir, answers) => {
        console.log(JSON.stringify(answers, null, 4))
        answers.instances.split(",")
            .forEach(instanceName => {
                console.log(chalk.blue(`Creating '${instanceName}' instance configuration...`))
                fs.mkdirSync(`${workingDir}/src/conf/config-${instanceName}.d`);
            })
    },

    processTemplateFiles: () => {
        
    }
}