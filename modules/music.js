const uuid          = require('uuid/v1');
const helper        = require('../utils/helper');
const musicPlayer   = require('../utils/musicPlayer');
const ErrHandler    = require('../handlers/error');
const Embed         = require('../embeds/musicSearch');

const cmdModule = {
  name: 'music',
  commands: {
    play: {
      config: {
        identifier: uuid(),
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
      },
      aliases: [],
      exec: async function(message, args){
        //if video url or name given attempt to retrieve song data
        if(args.length > 0){
          await musicPlayer.parseQuery(args.join(' '))
            .then(songData => {
              //add song to queue
              musicPlayer.queueSong(message, songData);
            })
            .catch(error => ErrHandler.logError(error));
        }
        
        musicPlayer.play(message);
      }
    },
    leave: {
      config: {
        identifier: uuid(),
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
      },
      aliases: [],
      exec: function(message){
        musicPlayer.leave(message);
      }
    },
    search: {
      config: {
        identifier: uuid(),
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
      },
      aliases: [],
      exec: function(message, args){
        //search for a list of videos
        musicPlayer.youtubeAPI.search.list({
          part: 'id',
          q: args[0],
          type: 'video'
        })
        .then(res => {
          //gather video ids so we could fetch their info
          const videoIds = res.data.items.map(item => item.id.videoId);
          
          //now get info of each found video
          musicPlayer.youtubeAPI.videos.list({
            part: 'contentDetails,snippet,id',
            id: videoIds.join(','),
          })
          .then(videoData => {
            Embed.sendEmbed(message, videoData.data.items);
          });
        });
      }
    },
    skip: {
      config: {
        identifier: uuid(),
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
      },
      aliases: [],
      exec: function(message){
        musicPlayer.playNext(message);
      }
    }
  }
}

module.exports = cmdModule;