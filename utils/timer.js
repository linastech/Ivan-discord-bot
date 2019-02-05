//key => guild_id, value => new Set() for storing timers
let timers = new Map();

module.exports = {  
  /**
   * Start a cooldown timer for one of the commands
   * in the channel user used the command
   * @param {object} discord.js client
   * @param {config} cmd config obj
   */
  set(message, config){
    //check if guild exists in the list
    if(timers.has(message.guild.id) === false)
      //create new guild
      timers.set(message.guild.id, new Set());

    const guild = timers.get(message.guild.id);
    const id = `${message.channel.id}.${message.author.id}.${config.identifier}`;
    
    //still in cooldown, do nothing
    if(guild.has(id)) return false;

    //add new timer
    guild.add(id);

    // delete id after cooldown period is over
    setTimeout( () => guild.delete(id), config.cooldown);
  },
  /**
   * Check if user has recently used a command
   * @param {object} discord.js client
   * @param {config} cmd config obj
   * @returns {boolean}
   */
  isCoolingDown(message, config){
    //nothing was sent in this guild yet just return false
    if(timers.has(message.guild.id) === false)
      return false;

    const guild = timers.get(message.guild.id);
    const id = `${message.channel.id}.${message.author.id}.${config.identifier}`;

    return guild.has(id);
  }
}