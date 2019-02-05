const mongoose    = require('mongoose');
const CFG         = require('config').get('database');
const Error       = require('../handlers/error');
const Helper      = require('../utils/helper');

mongoose.connect(
    `mongodb://${CFG.username}:${CFG.password}@${CFG.host}:${CFG.port}/${CFG.database}?authSource=${CFG.authSource}`,
    { useNewUrlParser: true }
  ).then(
    () => Helper.log('Connected to the database!'),
    err => {
      Error.logError(err);
      process.exit(1);
  });


module.exports = {
  messages:           require('../models/messages')(mongoose.connection),
  guilds:             require('../models/guilds')(mongoose.connection),
  levels:             require('../models/levels')(mongoose.connection),
  ['guild-cmd-cfg']:  require('../models/guild-cmd-cfg')(mongoose.connection),
}