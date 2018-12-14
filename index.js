const Discord   = require('discord.js');
const CFG       = require('config').get('app');
const helper    = require('./utils/helper');
const events    = require('./handlers/event');
const DB        = require('./database/index');

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const client    = new Discord.Client();
client.DB = DB;

client.login(CFG.token);

client.on('message', message => events.get('message')(message));
client.on('guildCreate', guild => events.get('guildCreate')(guild));