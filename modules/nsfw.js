const Helper      = require('../utils/helper');
const Axios       = require('axios');
const uuid        = require('uuid/v1');

module.exports = {
  name: 'nsfw',
  commands: {
    level: {
      config: {
        cooldown: 10000,
        blackListed: {
          "475116815945564160": ['515880600524161034', '520653641623797760']
        },
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        identifier: uuid(),
      },
      aliases: ['porn'],
      exec(message){
        Axios({
          url: `https://steppschuh-json-porn-v1.p.rapidapi.com/porn/`,
          headers: { ['X-RapidAPI-Key']: `` },
          params: {
            count: 10,
          }
        })
        .then(res => {
          //pick random entry
          const data = res.data.content[Helper.random(0, res.data.content.length -1)];
          
          //get random image from the video
          const imageKey = data.imageKeyIds[Helper.random(0, data.imageKeyIds.length - 1)];
        
          //fetch image
          Axios({
            url: `https://steppschuh-json-porn-v1.p.rapidapi.com/image/${imageKey}/600.jpg`,
            headers: { ['X-RapidAPI-Key']: `` },
            responseType: 'arraybuffer',
          })
          .then(res => {
            message.channel.send({
              file: Buffer.from(res.data, 'base64')
            })
          })
        })
        .catch(err => console.error(err))
      }
    }
  }
}