#! /usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const Parse = require('../lib/parse');

class App {
    constructor() {
        this.fileList = [];
        this.parse = new Parse();
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
                    const promps = [];
                    promps.push({
                        type: 'list',
                        name: 'filePath',
                        message: chalk.hex('#c0ca33')('Select a file'),
                        choices: this.parse.dirWalk(process.cwd())
                    });
                    inquirer.prompt(promps).then(answers => {
                        this.parse.getPath(answers.filePath, 'dc', true);
                    });
                } else {
                    this.parse.getPath(fileName, 'dc', false);
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
                        this.parse.getPath(answers.filePath, 'feedback', true);
                    });
                } else {
                    this.parse.getPath(fileName, 'feedback', false);
                }
            });

        program.parse(process.argv);
    }

}

new App();
