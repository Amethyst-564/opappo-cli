const chalk = require('chalk');
const boxen = require('boxen');
const emoji = require('node-emoji');

const ERR_MSG_DIR = {
    'ENOENT': 'ENOENT: no such file or directory',
    'EISDIR': 'EISDIR: illegal operation on a directory',
    'TypeError': 'TypeError: Unsupported file type',
    'EPERM': 'EPERM: operation not permitted'
}

class MsgUtil {

    info(data, color = '#FFFFFF') {
        if (data) console.log(`${chalk.hex('#00bcd4')('INFO')} ${chalk.hex(color)(data)}`);
    }

    warn(data, color = '#FFFFFF') {
        if (data) console.warn(`${chalk.hex('#ffc107')('WARN')} ${chalk.hex(color)(data)}`);
    }

    error(data, color = '#FFFFFF') {
        if (data) console.error(`${chalk.hex('#f44336')('ERROR')} ${chalk.hex(color)(data)}`);
    }

    debug(data, color = '#FFFFFF') {
        if (data) console.log(`${chalk.hex('#b39ddb')('DEBUG')} ${chalk.hex(color)(data)}`);
    }

    printErrByType(type) {
        this.error(ERR_MSG_DIR[type] ? ERR_MSG_DIR[type] : 'Unknown error');
    }

    boxMsg(data, color = '#cddc39') {
        if (data) console.log(chalk.hex('#cddc39')(boxen(chalk.hex(color)(data), { padding: 1, margin: 1, borderStyle: 'bold' })));
    }
}

module.exports = MsgUtil;