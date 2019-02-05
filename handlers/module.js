const Discord   = require('discord.js');
const Timer     = require('../utils/timer');
const CFG       = require('config').get('app');
const path      = require('path');
const fs        = require('fs');
const Helper    = require('../utils/helper');

const client = new Discord.Client();

client.modules = new Discord.Collection();
client.commands = new Discord.Collection();

const modulesDir = path.dirname(require.main.filename)+'/modules/';

//read modules dir and load load modules
fs.readdirSync(modulesDir).forEach(file => {
  //load module file
  const module = require(`${modulesDir}/${file}`);

  //add all commands and aliases to Discord.Collection object
  //entry value will result to command object referance
  for(let key in module.commands){
    //add command
    client.commands.set(key, module.commands[key]);

    //check if command has aliases
    if(module.commands[key].aliases.length > 0)
      //store every alias in commands collection
      module.commands[key].aliases.forEach(alias =>
        client.commands.set(alias, module.commands[key])
      );
  };
  
  //set module object containing commands
  //and public methdos to modules collection
  client.modules.set(module.name, module);
});

//TOOD custom prefix
client.parseCommand = (message) => {
  try{
    const cmdObj = {};

    cmdObj.args = message.content
      .trim()
      .substring(CFG.prefix.length)
      .split(' ')

    cmdObj.command = cmdObj.args.shift();
    
    return cmdObj;
  }catch(err){ 
    message.client.errHandler.logError(err) 
    return false;
  }
}

client.isCommandRun = async (message) => {
  //TODO custom prefix setting
  if(message.content.startsWith(CFG.prefix)){
    //parse message into arguments
    const cmdObj = client.parseCommand(message);
  
    //check if command got succesfully parsed
    //and if command exists
    if(typeof cmdObj === 'object' && client.commands.has(cmdObj.command)){
      //get command object containing config and exec method
      const cmd = client.commands.get(cmdObj.command);

      //check if command requires bot to have certain perms enabled
      if(cmd.config.botPermissions.length > 0){
        //if bot has mod rights skip testing perms
        if(!message.member.guild.me.hasPermission("ADMINISTRATOR")){
          //check if every required perm is enabled for the bot
          if(cmd.config.botPermissions.every(perm => message.member.guild.me.hasPermission(perm)) === false){
            Helper.responseError("I am missing permissions to execute this command!", message.channel);
            return false;
          }
        }
      }

      //check if command has perms requirements and if user meets them
      if(cmd.config.permissions.length > 0){
        //admins have all perms
        if(!message.member.permissions.has('ADMINISTRATOR')){
          //check if user has all required perms
          if(cmd.config.permissions.every(perm => message.member.permissions.has(perm)) === false){
            Helper.responseError("You do not have required permissions to use this command!", message.channel);
            return false;
          }
        }
      }

      //check if command has guild config loaded from the DB
      if(typeof cmd.config.guildCmdCfg[message.guild.id] == 'undefined'){
        const cmdCfgData = await message.client.DB['guild-cmd-cfg'].getConfig(message.guild.id, cmdObj.command);

        if(cmdCfgData != null)
          cmd.config.guildCmdCfg[message.guild.id] = cmdCfgData.config;
      }

      //check if guild has any blacklisted users/channels
      if(typeof cmd.config.blackListed[message.guild.id] !== 'undefined'){
        //list is an array with channel_id, user_id, guild_id.
        //guild id existance means entire guild is blacklisted for this command
        const blackList = cmd.config.blackListed[message.guild.id];
        const testIds = [message.channel.id, message.author.id, message.guild.id];

        //test if any ids from the list are blacklisted
        const result = testIds.some( element => blackList.indexOf(element) > -1 )

        if(result === true) return false;
      }

      //check if cooldown timer for this command exists
      if(cmd.config.cooldown !== false ){
        //return if command is in cooldown
        if(Timer.isCoolingDown(message, cmd.config)) return true;

        //start the timer
        Timer.set(message, cmd.config);
      }
      
      // all test have passed, execute the command
      cmd.exec(message, cmdObj.args);

      return true;
    }      
  }else{
    return false;
  }
}

module.exports = client;