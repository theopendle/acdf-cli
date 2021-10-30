#!/usr/bin/env node

const chalk = require('chalk');
const colorize = require('json-colorizer');
const inquirer = require("inquirer");

const constants = require("./src/constants");
const filesystem = require("./src/filesystem");

const TEMPLATE_DIR = `${__dirname}/template`;
const WORKING_DIR = process.cwd();

inquirer
    .prompt(constants.QUESTIONS)

    // Ask questions
    .then(answers => {
        console.log(colorize(JSON.stringify(answers, null, 4), constants.JSON_COLORS));
        return new Promise((resolve) => {
            inquirer
                .prompt({
                    name: "confirm",
                    type: "confirm",
                    message: "Confirm the project parameters"
                })
                .then((confirmAnswers => resolve({ ...answers, ...confirmAnswers })
                ));

        })
    })

    // Generate project
    .then(answers => {

        if (!answers || !answers.confirm) {
            console.log(chalk.red("Abandoning. No files were generated."));
            return;
        }

        console.log(chalk.blue("Generating project..."));

        filesystem.createDirectoryContents(WORKING_DIR, TEMPLATE_DIR, answers);
    });



