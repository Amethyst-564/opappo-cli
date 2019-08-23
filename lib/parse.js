const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const _ = require('lodash');
const chalk = require('chalk');

class Parse {

    getPath(str, type, selectFlg) {
        let path = null;

        if (str) {
            if (selectFlg) {
                // from select list
                path = str;
            } else {
                // user input
                path = `${process.cwd()}\\${str}`;
            }
        } else {
            path = `${process.cwd()}`;
        }

        if (type === 'dc') {
            this.parseDc(path);
        }
        if (type === 'feedback') {
            this.parseFeedback(path);
        }
    }

    parseDc(filePath) {
        if (filePath) {
            console.log('parse dc: ', filePath);
            // const workbook = XLSX.readFile(filePath);
            // console.log(workbook);
        }

    }

    parseFeedback(filePath) {
        if (filePath) {
            console.log('parse feedback: ', filePath);
        }
    }

    /**
    * Check the name ext 
    * @param {string} str name to be check
    */
    isExcel(str) {
        const ext = _.last(str.split('.'));
        return ext === 'xlsx' || ext === 'xls';
    }

    /**
     * walk the dir
     * @param {string} dirPath dir path to walk
     */
    dirWalk(dirPath, list) {
        const res = list ? list : [];
        const files = fs.readdirSync(dirPath);
        files.forEach((fileName) => {
            const filePath = path.join(dirPath, fileName);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                if (this.isExcel(fileName)) {
                    res.push({
                        name: chalk.hex('#f44336')(fileName),
                        value: filePath
                    });
                }
            }
            if (stats.isDirectory()) {
                this.dirWalk(filePath, res);
            }
        });

        return res;
    }
}

module.exports = Parse;
