const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const _ = require('lodash');
const chalk = require('chalk');
const MsgUtil = require('../utils/msgUtil');

class Parse {

  constructor() {
    this.msg = new MsgUtil();
  }

  test() {
    console.log('!', this);
  }

  /**
   * If there is no filename, the path is the current directory
   * @param {string} fileName from input
   * @param {string} type 'dc' or 'feedback'
   */
  getPath(fileName, type) {
    let fileList = [];
    if (fileName) {
      // single file
      if (this.isExcel(fileName)) {
        fileList.push({
          name: fileName,
          value: `${process.cwd()}\\${fileName}`
        });
      } else {
        this.msg.printErrByType('TypeError');
        process.exit(1);
      }
    } else {
      // files of the dir and sub dir
      fileList = this.dirWalk(process.cwd());
    }

    if (type === 'dc') {
      _.each(fileList, obj => {
        this.parseDc(obj.value);
      });
    }
    if (type === 'feedback') {
      _.each(fileList, obj => {
        this.parseFeedback(obj.value);
      });
    }
  }

  parseDc(filePath) {
    console.log('!!!this: ', this);
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
      this.msg.printErrByType(err.code);
    }
  }

  parseFeedback(filePath) {
    if (filePath) {
      this.msg.info('parse feedback: ', filePath);
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
    const res = list || [];
    try {
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
    } catch (err) {
      if (_.startsWith(err, 'Error: ')) {
        this.msg.printErrByType(_.split(err, ':')[1].trim());
      }
      this.msg.error(err);
    }

    return res;
  }

  getStaff(filePath) {
    const fileName = _.last(filePath.split('\\')) || _.last(filePath.split('/'));
    const staffReg = new RegExp('_(?<a>[0-9a-zA-Z]+?)_*for_*(?<b>[0-9a-zA-Z]+?)_', 'i');
    const matchObj = staffReg.exec(fileName);
    if (matchObj) {
      this.msg.info(`Staff: ${matchObj.groups.a} ==> ${matchObj.groups.b}`);
    }
  }
}

module.exports = Parse;
