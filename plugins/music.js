const Commands  = require('../commands.js');
const helper    = require('../helper.js');
const DB        = require('../database/index.js');

class Music extends Commands{
  constructor(client){
    super(client);
    this.audioBots = {};

    
    this.registerCommand({
      aliases:    'join',
      callback:   this.join.bind(this),
    });

    this.registerCommand({
      aliases:    'play',
      callback:   this.play.bind(this),
    });

    this.registerCommand({
      aliases:    'leave',
      callback:   this.leave.bind(this),
    });

    this.registerCommand({
      aliases:    'pause',
      callback:   this.pause.bind(this),
    });

    this.registerCommand({
      aliases:    'resume',
      callback:   this.resume.bind(this),
    });

    helper.log("Loaded plugin: Music");
  }

  leave(msg){
    const guildID = msg.guild.id;

    if(typeof this.audioBots[guildID] === 'undefined'){
      helper.logError(this.client, 'Tried leaving voice channel but session does not exist!');
    }else{
      this.audioBots[guildID].conn.channel.leave();
    }
      
  }

  pause(msg){
    this.audioBots[msg.guild.id].dispatch.pause();
  }
 
  resume(msg){ 
    this.audioBots[msg.guild.id].dispatch.resume();
  }

  async play(msg){
    const guildID = msg.guild.id;
    const channel = msg.member.voiceChannel;

    if(!this.isInVoiceChannel(msg, channel))
      return;

    if(typeof this.audioBots[guildID] === 'undefined'){
      const sessionResponse = await this.createSession(channel);
      
      if(sessionResponse !== true){
        helper.logError(this.client, sessionResponse.error);
        return;
      }
    }

    if(this.audioBots[guildID].channel.connection == null){
      
      await this.audioBots[guildID].channel
        .join()
        .then(conn => this.audioBots[guildID].conn = conn)
    }

    this.audioBots[guildID].dispatch = this.audioBots[guildID].conn.playFile('C:/projects/discordbot/test.mp3')
  }

  join(msg){ 
    const channel = msg.member.voiceChannel;

    if(this.isInVoiceChannel(msg, channel)){
      this.createSession(channel);
    }
  }

  isInVoiceChannel(msg, channel){
    if(typeof channel === 'undefined'){
      helper.responseError("Please join a voice channel!", msg.channel);
      return false;
    }else{
      return true;
    }
  }

  createSession(channel){
    const guildID = channel.guild.id;
    const promise = new Promise(
      (resolve, reject) => {
        channel
          .join()
          .then(connection => {
            this.audioBots[guildID] = {
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

  startPlayer(session){

  }

}

module.exports = Music;