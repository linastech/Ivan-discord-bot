const mongoose    = require('mongoose');
const helper      = require('../helper.js');
const CFG         = require('config').get('database');

module.exports = (client) => {
  
  mongoose
  .connect(
    `mongodb://${CFG.host}:${CFG.port}/${CFG.database}`,
    { useNewUrlParser: true }
  ).then(
    () => {
      helper.log('Connected to the database');
    },
    err => {
      console.log(err)
      helper.logError(client, err);
      process.exit(1);
    }
  )

  return module.exports = {
    leaderboard:  require('./models/leaderboard')(mongoose.connection),
  }
}