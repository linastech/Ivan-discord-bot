const Discord   = require('discord.js');
const Commands  = require('../commands.js');
const helper    = require('../helper.js');
const DB        = require('../database/index.js');
const CFG       = require('config').get('app');

class Info extends Commands{
  constructor(client){
    super(client);

    this.registerCommand({
      aliases:    'help',
      callback:   this.help.bind(this),
    });

    helper.log("Loaded plugin: info");
  }

  help(msg){

    msg.channel.send({
      embed: {
        description: `
Privyet comrade, I'm slav discord bot capable of doing just about anything you want. \n
Try me out by simply calling me by name or use my commands listed below! \n 
For more info and settings go to my website: [${CFG.webName}](${CFG.webURL})\n
        `, 
        color: CFG.infoColor,
        fields: [
          {
            name:     `Leveling`,
            value:    
`\`${CFG.prefix}mylvl\`
\`${CFG.prefix}rewards\`
\`${CFG.prefix}leaderboard\``,
            inline: true
          },
          {
            name:     `Music`,
            value:
`\`${CFG.prefix}play\`
\`${CFG.prefix}skip\`
\`${CFG.prefix}back\`
\`${CFG.prefix}pause\`
\`${CFG.prefix}np\`
\`${CFG.prefix}resume\`
\`${CFG.prefix}volume\`
\`${CFG.prefix}search\`
\`${CFG.prefix}repeat\`
\`${CFG.prefix}clear\`
\`${CFG.prefix}join\`
\`${CFG.prefix}leave\`
\`${CFG.prefix}playlist\``,
            inline: true
          },
          {
            name:     `Moderation`,
            value:    
`\`${CFG.prefix}clean\`
\`${CFG.prefix}ban\`
\`${CFG.prefix}kick\`
\`${CFG.prefix}mute\``,
            inline: true
          },
          {
            name:     `Interactions`,
            value:    
`ivan show me something
ivan should i go to bed?`,
            inline: true
          },
          {
            name:     `Image`,
            value:    
`\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\``,
            inline: true
          },
          {
            name:     `Games`,
            value:    
`\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\`
\`${CFG.prefix}soon™\``,
            inline: true
          },
        ]
      }
    });
  }
}

module.exports = Info;