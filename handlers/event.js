const path  = require('path');
const fs    = require('fs');

const events      = new Map();
const eventsDir   = path.dirname(require.main.filename)+'/events/';

fs.readdirSync(eventsDir).forEach(file => {
  const name = file.substr(0, file.length - 3);

  events.set(name, require(`${eventsDir}/${file}`));
});

module.exports = events;