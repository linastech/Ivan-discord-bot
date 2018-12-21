const uuid        = require('uuid/v1');
const helper      = require('../utils/helper');
const ErrHandler  = require('../handlers/error');

const audioBots = {};

function isInVoiceChannel(message, channel){
  if(typeof channel === 'undefined'){
    helper.responseError("Please join a voice channel!", message.channel);
    return false;
  }else{
    return true;
  }
}

function createSession(channel){
  const guildID = channel.guild.id;
  const promise = new Promise(
    (resolve, reject) => {
      channel
        .join()
        .then(connection => {
           audioBots[guildID] = {
            conn:     connection,
            channel:  connection.channel,
            queue:    [],
          };

          resolve(true);
        })
        .catch(err => reject(err));
    }
  );

  return promise;
}

module.exports = {
  name: 'music', 
  commands: {
    leave: {
      config: {
        identifier: uuid(),
        blackListed: {},
      },
      aliases: [],
      exec(message){
        try{
          const guildID = message.guild.id;

          if(typeof  audioBots[guildID] === 'undefined'){
            throw new Error('Tried leaving voice channel but session does not exist!');
          }else{
            audioBots[guildID].conn.channel.leave();
          }
        }catch(error){
          ErrHandler.logError(error);
        }
      }
    },
    join: {
      config: {
        identifier: uuid(),
        blackListed: {},
      },
      aliases: [],
      exec(message){
        const channel = message.member.voiceChannel;
        if( isInVoiceChannel(message, channel)){
           createSession(channel);
        }
      }
    },
    pause: {
      config: {
        identifier: uuid(),
        blackListed: {},
      },
      aliases: [],
      exec(message){
        audioBots[message.guild.id].dispatch.pause();
      }
    },
    resume: {
      config: {
        identifier: uuid(),
        blackListed: {},
      },
      aliases: [],
      exec(message){
         audioBots[message.guild.id].dispatch.resume();
      }
    },
    play: {
      config: {
        identifier: uuid(),
        blackListed: {},
      },
      aliases: [],
      exec: async function(message){
        const guildID = message.guild.id;
        const channel = message.member.voiceChannel;
    
        if(! isInVoiceChannel(message, channel))
          return;
    
        if(typeof  audioBots[guildID] === 'undefined'){
          const sessionResponse = await  createSession(channel);
        }
    
        if( audioBots[guildID].channel.connection == null){
          
          await  audioBots[guildID].channel
            .join()
            .then(conn =>  audioBots[guildID].conn = conn)
        }
    
         audioBots[guildID].dispatch =  audioBots[guildID].conn.playFile('C:/projects/discordbot/test.mp3')
      }
    },
  }
}