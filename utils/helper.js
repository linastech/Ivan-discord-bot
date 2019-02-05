const moment  = require('moment');
const chalk   = require('chalk');

module.exports = {
  log(message){
    console.log(chalk.blue(`[${moment().format( 'YYYY-MM-DD hh:mm:ss' )}]`), chalk.green(message));
  },
  responseError(message, channel){
    channel.send(
      {
        embed: {
          color: 11144735,
          description: `<:error:517907267291447306> ${message}`
        },
      }
    );
  },
  randomChance(){
    return Math.round((Math.random() * 100) + 0) > 50;
  },
  random(from, to){
    return Math.round((Math.random() * to) + from);
  },
  percent(input, percentage){
    return Math.round((input / 100) * percentage);
  },
}