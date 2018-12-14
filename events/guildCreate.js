const CFG       = require('config').get('app');

module.exports = guild => {
  guild.channels
    .find(val => val.name === 'general')
    .send(`Privet amerikanski spies, my name is Ivan Ivanovski. \nIf you need me try calling me by my name or use \`${CFG.prefix}help\` command.`);
}