const chalk = require('chalk');
const fs = require("fs");
const glob = require("glob");
const handlebars = require('handlebars');
const ncp = require('ncp').ncp;

createInstanceConfFolders = (workingDir, answers) => {
    answers.instances.split(",")
        .forEach(instanceName => {
            instanceName = instanceName.trim();
            console.log(chalk.blue(`Creating '${instanceName}' instance configuration...`));

            const destination = `${workingDir}/src/conf/config-${instanceName}.d`;
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination);
            }
        })
};

processTemplateFiles = (workingDir, answers) => {
    glob(`${workingDir}/src/**/*.handlebars`, (err, files) => {
        if (err) {
            console.error(err);
            throw 'Could not find handlebars templates';
        }
        files.forEach(file => {
            const content = fs.readFileSync(file).toString();

            fs.writeFileSync(file.replace(".handlebars", ""), handlebars.compile(content)(answers));

            fs.rmSync(file);
        })
    })
};

module.exports = {

    createDirectoryContents: (workingDir, templateDir, answers) => {
        fs.readdirSync(templateDir)
            .forEach(rootFolder => {
                ncp(`${templateDir}/${rootFolder}`, `${workingDir}/${rootFolder}`, { clobber: true }, function (err) {
                    if (err) {
                        console.error(err);
                        throw 'Could not copy content from template project';
                    }

                    createInstanceConfFolders(workingDir, answers);
                    processTemplateFiles(workingDir, answers);
                });
            });
    }
}