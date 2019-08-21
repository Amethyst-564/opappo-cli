const XLSX = require('xlsx');

function parseDc(fileName) {
    if (fileName) {
        const filePath = `${process.cwd()}\\${fileName}`
        console.log('filePath: ', filePath);
        // XLSX.readFile(`${process.cwd()}\\${fileName}`);
    } else {
        console.log('path: ', process.cwd());
    }
}

function parseFeedback(fileName) {

}

exports.parseDc = parseDc;
exports.parseFeedback = parseFeedback;