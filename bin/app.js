#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const parse = require('../lib/parse.js');

const fileList = [];

program.version('0.1.0');

program.on('--help', () => {
    console.log('\nExamples: \n$ opappo dc <fileName>\n$ opappo d  <fileName>');
});

program
    .command('dc [fileName]')
    .alias('d')
    .description('parse a DC file')
    .option('-s, --select', 'Select a file')
    .action((fileName, options) => {
        const promps = [];
        if (options.select) {
            dirWalk(process.cwd());

            promps.push({
                type: 'list',
                name: 'fileName',
                message: chalk.hex('#c0ca33')('Select a file'),
                choices: fileList
            });
            inquirer.prompt(promps).then(function (answers) {
                parse.parseDc(answers.fileName);
            });
        } else {
            parse.parseDc(fileName);
        }
    });

program
    .command('feedback [fileName]')
    .alias('f')
    .description('parse a FeedBack file')
    .action((fileName) => {
        parse.parseFeedback(fileName);
    });

program.parse(process.argv);

function dirWalk(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            const ext = _.last(fileName.split('.'));
            if (ext === 'xlsx' || ext === 'xls') {
                fileList.push({
                    name: chalk.hex('#f44336')(fileName),
                    value: fileName
                });
            }
        }
        if (stats.isDirectory()) {
            dirWalk(filePath);
        }
    });
}
