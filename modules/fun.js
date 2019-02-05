const uuid = require('uuid/v1');
const Helper      = require('../utils/helper');

module.exports = {
  name: 'fun',
  commands: {
    rolldice: {
      config: {
        cooldown: 10000,
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        identifier: uuid(),
      },
      aliases: ["roll"],
      exec(message){

        const dices = [ 
          '<:dice_one:525723423364874247>',
          '<:dice_two:525723423326994442>',
          '<:dice_three:525723423150702593>',
          '<:dice_four:525723423297634319>',
          '<:dice_five:525723423201165322>',
          '<:dice_six:525723423339577370>'
        ];

        message.channel.send("```diff\n-The dice is about to roll get ready!```")
          .then(message => {
            setTimeout(() => rollDice(message), 1000);
          })
        
        let rolls = 0;
        let number = null;

        rollDice = (message) =>{
          if(rolls > 5){
            message.edit("```diff\n-The winning number is "+number+"! ```");
            return;
          }

          number = Helper.random(0, 5);
          let string = "```css\nIts rolling! -"+(number+1)+"-```\n";
          
          for(let amount = 0; amount < 10; amount++)
            string += ` ${dices[number]} `;

          message
            .edit(string)
            .then(message => {
              setTimeout(() => rollDice(message), 1000);
            });

          rolls++;
        }
      }
    }
  }
}