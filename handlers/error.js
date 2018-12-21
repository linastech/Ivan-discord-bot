const moment      = require('moment');
const chalk       = require('chalk');
const parseError  = require('parse-error');

const object = {
  logError(error){
    //filename, line, row, message, type, stack
    const data = parseError(error);

    //log time and error message
    console.log( chalk.blue(`[${moment().format( 'YYYY-MM-DD hh:mm:ss' )}]`), chalk.yellow(data.type), ' - ', chalk.red(data.message) );

    //log file location
    console.log(chalk.blue('Location: '), chalk.green(data.filename));

    //log line number
    console.log(chalk.blue('Line: '), chalk.green(data.row));
  }
}

process.on('uncaughtException', error => object.logError(error));
process.on('unhandledRejection', error => object.logError(error));

module.exports = object;