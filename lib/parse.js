const XLSX = require('xlsx');

function parseDc(fileName) {
    if (fileName) {
        console.log('fileName: ', fileName);
        // XLSX.readFile(fileName);
    } else {
        console.log('path: ', process.cwd());
    }
}

function parseFeedback(fileName) {

}

exports.parseDc = parseDc;
exports.parseFeedback = parseFeedback;