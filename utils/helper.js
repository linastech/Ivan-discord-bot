const util    = require('util');
const moment  = require('moment');
const chalk   = require('chalk');

module.exports = {
  log: (...args) => {
    console.log(
      chalk.blue(`[${moment().format( 'YYYY-MM-DD hh:mm:ss' )}]`), 
      args.join(' - ')
    )
  },
  logEvent: (client, type) => {
    helper.log(client.user.tag, type)
  },
  logError: (client, error) => {
    helper.log(client.user.tag, error)
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
  }
}