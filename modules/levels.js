const Discord   = require('discord.js');
const uuid        = require('uuid/v1');

module.exports = {
  name: 'levels',
  //TODO add timer
  handleExperience(message){
    message.client.DB.levels.increaseScore(message.author, message.guild);
  },
  commands: {
    level: {
      config: {
        cooldown: 10000,
        blackListed: {},
        identifier: uuid(),
      },
      aliases: ['rank'],
      exec(message){
        const user = message.author;

        message.client.DB.levels.findOne({userID: user.id, guildID: message.member.guild.id})
          .then(data => {
            if(data == null){
              message.channel.send("Kurva you have to talk first to get ranks!");
            }else{
              const embed = new Discord.RichEmbed()
                .setTitle(user.username)
                .setDescription(`**Level:** ${data.level} \n**Exp:** ${data.points} / ${data.nextLevel}\n**Rank:** N/A`)
                .setColor(0x00AE86)
                .setThumbnail(user.displayAvatarURL);
      
              message.channel.send({embed: embed});
            }
          });
      }
    }
  }
}