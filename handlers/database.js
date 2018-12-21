const mongoose    = require('mongoose');
const CFG         = require('config').get('database');
const Error       = require('../handlers/error');
const Helper      = require('../utils/helper');

mongoose.connect(
    `mongodb://${CFG.host}:${CFG.port}/${CFG.database}`,
    { useNewUrlParser: true }
  ).then(
    () => Helper.log('Connected to the database!'),
    err => {
      Error.logError(err);
      process.exit(1);
  });


module.exports = {
  levels:       require('../models/levels')(mongoose.connection),
  settings:     require('../models/guild')(mongoose.connection),
}