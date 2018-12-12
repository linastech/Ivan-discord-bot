const Discord   = require('discord.js');
const Commands  = require('../commands.js');
const helper    = require('../helper.js');
const DB        = require('../database/index.js');
const CFG       = require('config').get('leaderboard');
const timer     = new Set();

class Leaderboard extends Commands{
  constructor(client){
    super(client);

    this.registerCommand({
      aliases:    'rank',
      callback:   this.getRank.bind(this),
    });

    client.on('message', msg => this.messageSent(msg));

    helper.log("Loaded plugin: Leaderboard");
  }

  messageSent(msg) {
    const user = msg.author;

    //user recently sent a message
    if(timer.has(user.id) || user.bot || msg.author.bot || (process.env.NODE_ENV =="dev" && msg.author.id == "188129650952765442"))
      return;
    
    timer.add(user.id);

    DB.leaderboard.increaseScore(user, msg.guild);

    setTimeout(() => timer.delete(user.id), CFG.cooldown);
  } 

  getRank(msg){
    const user = msg.author;

    DB.leaderboard.findOne({userID: user.id, guildID: msg.member.guild.id})
      .then(data => {
        if(data == null){
          msg.channel.send("Kurva you have to talk first to get ranks!");
          return;
        }

        const embed = new Discord.RichEmbed()
          .setTitle(user.username)
          .setDescription(`**Level:** ${data.level} \n**Exp:** ${data.points} / ${data.nextLevel}\n**Rank:** N/A`)
          .setColor(0x00AE86)
          .setThumbnail(user.displayAvatarURL);

        msg.channel.send({embed: embed});
      })
  }
}

module.exports = Leaderboard;