const Discord           = require('discord.js');
const CFG               = require('config').get('app');
const eventHandlers     = require('./handlers/event');
const dbHandler         = require('./handlers/database');
const modulesHandler    = require('./handlers/module'); 
const errorHandler      = require('./handlers/error'); 

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const client          = new Discord.Client();
client.DB             = dbHandler;
client.isCommand      = modulesHandler.isCommand;
client.commands       = modulesHandler.commands;
client.modules        = modulesHandler.modules;
client.eventHandlers  = eventHandlers;
client.errorHandler   = errorHandler;

client.login(CFG.token);

client.on('message', message => client.eventHandlers.get('message')(message));
client.on('guildCreate', guild => client.eventHandlers.get('guildCreate')(guild));