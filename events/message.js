const Timer = require('../utils/timer');

module.exports = async message => {
  if(message.author.bot) return;

  //answering questions and reacting to trigger keywords
  if(message.client.modules.get('interactions').isInteraction(message)) return;

  //responding to "ivan show me @query"
  if(message.client.modules.get('imageSearch').isImageSearch(message)) return;

  //check if message is a command, 
  //it will return array with [command, arg, arg..] if it is
  const parsedCMD = message.client.isCommand(message);
  let params = false;

  //it is a command
  if(Array.isArray(parsedCMD)){
    //TODO better argument handling
    if(parsedCMD.length > 1)
      params = parsedCMD[1];
    
    //get command
    const cmd = message.client.commands.get(parsedCMD[0]);

    //try selecting blacklisted users/channels or guild itself
    const blackListed = cmd.config.blackListed[message.guild.id];

    //list exists
    if(Array.isArray(blackListed)){
      //check for matching cases
      if(
        blackListed.indexOf(message.channel.id) > -1 ||
        blackListed.indexOf(message.author.id) > -1 ||
        blackListed.indexOf(message.guild.id) > -1
      )
      return;
    }

    //check if cooldown setting exists
    if(typeof cmd.config.cooldown === 'number'){
      //check if command is in cooldown
      if(Timer.isCoolingDown(message, cmd.config)) return;

      //start the timer
      Timer.set(message, cmd.config);
    }

    //execute command
    cmd.exec(message, params);

    return;
  }

  //handle user experience
  message.client.modules.get('levels').handleExperience(message);
}