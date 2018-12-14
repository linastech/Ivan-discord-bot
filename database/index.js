const mongoose    = require('mongoose');
const CFG         = require('config').get('database');

mongoose
  .connect(
    `mongodb://${CFG.host}:${CFG.port}/${CFG.database}`,
    { useNewUrlParser: true }
  ).then(
    () => {
      //TODO console handler
      console.log('Connected to the database');
    },
    err => {
      //TODO console handler
      console.log(err);
      process.exit(1);
    }
  );

module.exports = {
  leaderboard:  require('./models/leaderboard')(mongoose.connection),
  settings:     require('./models/guild')(mongoose.connection),
}