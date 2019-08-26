const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const _ = require('lodash');
const chalk = require('chalk');
const MsgUtil = require('../utils/msgUtil');

const ERR_MSG_DIR = {
    'ENOENT': 'ENOENT: no such file or directory',
    'EISDIR': 'EISDIR: illegal operation on a directory'
}

class Parse {

    constructor() {
        this.msg = new MsgUtil();
    }

    getPath(str, type, selectFlg) {
        let path = null;

        if (str) {
            if (selectFlg) {
                // from select list
                path = str;
            } else {
                // user input
                if (!this.isExcel(str)) {
                    console.error(chalk.hex('#990000')('文件格式不正确!!'));
                    process.exit(1);
                }
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
            this.msg.info(`parse dc: ${filePath}`);
            try {
                const workbook = XLSX.readFile(filePath);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                // calc number
                const totalNum = worksheet['B2'].v;
                const missNum = worksheet['C2'].v ? worksheet['C2'].v : 0;
                const adviceNum = worksheet['F2'].v ? worksheet['F2'].v : 0;
                const dcNum = missNum + adviceNum;
                this.msg.boxMsg(`Total: ${totalNum}\nMiss Count: ${missNum}\nAdvice Count: ${adviceNum}\n=================\nDC Count: ${dcNum}\n\n${dcNum === 0 ? 'good!' : ''} `);

                this.getStaff(filePath);
            } catch (err) {
                this.msg.info(ERR_MSG_DIR[err.code] ? '' : err);
                this.msg.info(ERR_MSG_DIR[err.code] ? ERR_MSG_DIR[err.code] : 'Unknown error');
            }

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
        const extReg = new RegExp('(.+?).xlsx*$', 'gi');
        return str.match(extReg) ? true : false;
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

    getStaff(filePath) {
        const fileName = _.last(filePath.split('\\')) || _.last(filePath.split('/'));
        const staffReg = new RegExp('_(?<a>[0-9a-zA-Z]+?)_*for_*(?<b>[0-9a-zA-Z]+?)_', 'i');
        const matchObj = staffReg.exec(fileName);
        if (matchObj) {
            console.log('staff', matchObj.groups.a, '==>', matchObj.groups.b);
        }
    }
}

module.exports = Parse;
