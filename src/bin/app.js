#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Parse = require('../lib/parse');
const MsgUtil = require('../utils/msgUtil');

class App {

    constructor() {
        this.parse = new Parse();
        this.msg = new MsgUtil();
        this.initFunc();
    }

    initFunc() {
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
                if (options.select) {
                    const fileList = this.parse.dirWalk(process.cwd());
                    if (fileList.length === 0) {
                        this.msg.info('There is no Excel file under the current path');
                        process.exit();
                    }
                    const promps = [];
                    promps.push({
                        type: 'list',
                        name: 'filePath',
                        message: chalk.hex('#c0ca33')('Select a file'),
                        choices: this.parse.dirWalk(process.cwd())
                    });
                    inquirer.prompt(promps).then(answers => {
                        this.parse.parseDc(answers.filePath);
                    });
                } else {
                    this.parse.getPath(fileName, 'dc');
                }
            });

        program
            .command('feedback [fileName]')
            .alias('f')
            .description('parse a Feedback file')
            .option('-s, --select', 'Select a file')
            .action((fileName, options) => {
                if (options.select) {
                    const promps = [];
                    promps.push({
                        type: 'list',
                        name: 'filePath',
                        message: chalk.hex('#c0ca33')('Select a file'),
                        choices: this.parse.dirWalk(process.cwd())
                    });
                    inquirer.prompt(promps).then(answers => {
                        this.parse.parseFeedback(answers.filePath);
                    });
                } else {
                    this.parse.getPath(fileName, 'feedback');
                }
            });

        program.parse(process.argv);
    }

}

new App();
