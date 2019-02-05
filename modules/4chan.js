const uuid        = require('uuid/v1');
const Axios       = require('axios');
const Error       = require('../handlers/error');
const CFG         = require('config').get('app');
const Helper      = require('../utils/helper');

module.exports = {
  name: '4chan',
  commands: {
    ['4chan']: {
      config: {
        identifier: uuid(),
        cooldown: 5000,
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        blackListed: {
          "475116815945564160": ['515880600524161034', '520653641623797760']
        },
      },
      aliases: [],
      exec(message, board){
        Axios({
          url: `https://a.4cdn.org/${board}/${Helper.random(1, 9)}.json`,
          method: 'get',
          responseType: 'json',
        }).then(res => {
          //get random thread
          const posts = res.data.threads[0, res.data.threads.length - 1].posts;

          //look for an image
          for(let post of posts){
            //make sure post has an image
            if(typeof post.filename !== 'undefined'){
              //post it to the channel
              message.channel.send({
                file: `https://i.4cdn.org/${board}/${post.tim}${post.ext}`
              })
              .catch(err => Error.logError(err));

              break;
            }
          }
        }).catch(err => Error.logError(err));
      }
    },
    ['4chan-boards']: {
      config: {
        cooldown: 30000,
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        identifier: uuid(),
      },
      aliases: [],
      exec(message){
        Axios({
          url: `https://a.4cdn.org/boards.json`,
          method: 'get',
          responseType: 'json',
        }).then(res => {
          let sfwColOne = "";
          let sfwColTwo = "";
          let nsfwList = "";

          //get sfw boards
          const sfw = res.data.boards.filter(item => item.ws_board == 1);

          //split SFW array in half to avoid hitting discord max msg length limit
          sfw.splice(0, Math.ceil(sfw.length / 2)).forEach(item => {
            sfwColOne += `\`/${item.board}/\` - **${item.title}** \n`;
          });

          sfw.forEach(item => {
            sfwColTwo += `\`/${item.board}/\` - **${item.title}** \n`;
          });

          //get nsfw boards
          res.data.boards.filter(item => item.ws_board == 0).forEach(item => {
            nsfwList += `\`/${item.board}/\` - **${item.title}** \n`;
          });

          message.channel.send({
            embed: {
              description: '```This is a list of all 4chan boards```',
              color: CFG.infoColor,
              fields: [
                {
                  name:     `SFW`,
                  value:    sfwColOne,
                  inline: true,
                },
                {
                  name:     `SFW`,
                  value:    sfwColTwo,
                  inline: true,
                },
                {
                  name:     `NSFW`,
                  value:    nsfwList,
                  inline: true,
                },
              ]
            }
          });
        }).catch(err => Error.logError(err));
      }
    }
  }
}