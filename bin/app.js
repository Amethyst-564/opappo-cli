#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const parse = require('../lib/parse.js');

const fileList = [];

program
    .version('0.1.0');

program.on('--help', function () {
    console.log('\nExamples: \n$ opappo dc <filename>\n$ opappo d  <filename>');
});

program
    .command('dc [fileName]')
    .alias('d')
    .description('parse a DC file')
    .option('-s, --select', 'Select a file')
    .action((fileName, options) => {
        const promps = [];
        if (options.select) {
            // TODO set choices list
            fileDisplay(process.cwd());

            setTimeout(() => {
                promps.push({
                    type: 'list',
                    name: 'fileName',
                    message: chalk.hex('#cddc39')('Select a file'),
                    choices: fileList
                });
                inquirer.prompt(promps).then(function (answers) {
                    parse.parseDc(answers.fileName);
                });
            }, 500);


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

function fileDisplay(filePath) {
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            files.forEach(function (filename) {
                var filedir = path.join(filePath, filename);

                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        if (stats.isFile()) {
                            fileList.push({
                                name: filename,
                                value: filename
                            });
                        }
                        if (stats.isDirectory()) {
                            fileDisplay(filedir);
                        }
                    }
                })
            });
        }
    });
}