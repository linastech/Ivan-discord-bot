const CFG       = require('config').get('app');
const Client    = require('./handlers/module'); //loads modules and returns Discord.js client
const i18n      = require('i18n');
const path      = require('path');

i18n.configure({
  objectNotation: true,
  locales:['en'],
  directory: path.dirname(require.main.filename)+'/locales',
});

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

Client.DB             = require('./handlers/database');
Client.eventHandlers  = require('./handlers/event');
Client.errHandler     = require('./handlers/error');

Client.login(CFG.token);

Client.on('message', message => Client.eventHandlers.get('message')(message));
Client.on('guildCreate', guild => Client.eventHandlers.get('guildCreate')(guild));