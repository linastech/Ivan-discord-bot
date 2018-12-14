const path  = require('path');
const fs    = require('fs');

const modules     = new Map();
const modulesDir  = path.dirname(require.main.filename)+'/modules/';

fs.readdirSync(modulesDir).forEach(file => {
  const name = file.substr(0, file.length - 3);

  modules.set(name, new (require(`${modulesDir}/${file}`)));
});

module.exports = modules;