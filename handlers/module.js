const Discord   = require('discord.js');
const CFG       = require('config').get('app');
const path      = require('path');
const fs        = require('fs');

module.exports.modules  = new Discord.Collection();
module.exports.commands = new Discord.Collection();

const modulesDir = path.dirname(require.main.filename)+'/modules/';

//read modules dir and load load modules
fs.readdirSync(modulesDir).forEach(file => {
  //load module file
  const module = require(`${modulesDir}/${file}`);

  //add all commands and aliases to Discord.Collection object
  //entry value will result to command object referance
  for(let key in module.commands){
    //add command
    exports.commands.set(key, module.commands[key]);

    //check if command has aliases
    if(module.commands[key].aliases.length > 0)
      //store every alias in commands collection
      module.commands[key].aliases.forEach(alias =>
        exports.commands.set(alias, module.commands[key])
      );
  };
  
  //set module object containing commands
  //and public methdos to modules collection
  exports.modules.set(module.name, module);
});

module.exports.isCommand = (message) => {
  //check for prefix
  if(!message.content.startsWith(CFG.prefix)) return false;

  let params = false;
  //extract command and params
  const cmdSetting = message.content
    .substring(CFG.prefix.length)
    .match(/\S+/g)
    .map(arg => arg.toLowerCase().trim() );

  //check if command exists
  if(message.client.commands.has(cmdSetting[0]))
    //return command with parsed arguments
    return cmdSetting;
  
  return false;
}