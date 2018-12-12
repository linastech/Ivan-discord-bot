const helper    = require('./helper.js');
const Discord   = require('discord.js');
const CFG       = require('config').get('app');

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const client    = new Discord.Client();
const dev       = process.env.NODE_ENV === 'dev';

client.login(CFG.token);

client.on('ready', event => {
  helper.logEvent(client, 'ready');
  
  require('./database/index.js')(client);
  require('./plugins.js')(client); 
});

client.on("guildCreate", guild => {
  
  guild.channels
    .find(val => val.name === 'general')
    .send(`Privet amerikanski spies, my name is Ivan Ivanovski. \nIf you need me try calling me by my name or use \`${config.prefix}help\` command.`);
});