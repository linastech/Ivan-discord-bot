const Discord   = require('discord.js');

module.exports = class levels{
  constructor(){
    this.cooldown = 3000;
    this.timer = new Set();
  }

  //TODO aliases for commands
  execute(message){
    const user = message.author;

    message.client.DB.leaderboard.findOne({userID: user.id, guildID: message.member.guild.id})
      .then(data => {
        if(data == null){
          message.channel.send("Kurva you have to talk first to get ranks!");
          return;
        }

        const embed = new Discord.RichEmbed()
          .setTitle(user.username)
          .setDescription(`**Level:** ${data.level} \n**Exp:** ${data.points} / ${data.nextLevel}\n**Rank:** N/A`)
          .setColor(0x00AE86)
          .setThumbnail(user.displayAvatarURL);

        message.channel.send({embed: embed});
      });
  }

  handleExperience(message){
    const user = message.author;

    //user recently sent a message
    if(this.timer.has(user.id)) return;
    
    this.timer.add(user.id);

    message.client.DB.leaderboard.increaseScore(user, message.guild);

    setTimeout(() => this.timer.delete(user.id), this.cooldown);
  }
}