const {convertYouTubeDuration} = require('duration-iso-8601');
const {google}      = require('googleapis');
const child_process = require( 'child_process' );
const fs            = require('fs');
const youtubedl     = require('youtube-dl');
const ErrHandler    = require('../handlers/error');
const enqueuedSong  = require('../embeds/songEnqueued');
const songPreview   = require('../embeds/songPreview');

module.exports = {
  sessions: new Map(),
  youtubeAPI: google.youtube({
    version: 'v3',
    auth: 'AIzaSyAq7zPZva1bosJKcdEhlfC-D0uDrT6UZag',
  }),

  searchVideo: function(query){
    return new Promise((resolve, reject) => {
      //search for video and retrieve ID
      this.youtubeAPI.search.list({
        part: 'id',
        q: query,
        type: 'video',
        maxResults: 1,
      })
      .then(listRes => {
        //use retrieved video ID to get video info
        this.youtubeAPI.videos.list({
          part: 'contentDetails,snippet,id',
          id: listRes.data.items[0].id.videoId
        })
        .then(videoRes => {
          const video = videoRes.data.items[0];

          const data = {
            id: video.id,
            uploadedDate: video.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            author: video.snippet.channelTitle,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url,
            duration: convertYouTubeDuration(video.contentDetails.duration),
          };

          //get audio source
          this.parseYoutubeAudio(data.url)
            .then(audioSource => {
              data.audioSource = audioSource;

              resolve(data);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    });
  },
  parseYoutubeAudio: function(url){
    //TODO error handling
    return new Promise((resolve, reject) => {
      youtubedl.getInfo(
        url, 
        [],
        { 
          filter: 'audioonly',
          quality: 'lowestaudio'
        }, 
        (err, videoInfo) => {
          const info = videoInfo.formats.filter(format => format.abr == 50)[0].url;

          resolve(info);
        }
      )
    });
  },
  getSession: function(gid){
    let session;

    //session exists
    if(this.sessions.has(gid)){
      session = this.sessions.get(gid);
    //create new session
    }else{
      session = {
        queue:      [],
        conn:       null,
        dispatcher: null,
        ffmpeg:     null,
        queueIndex: 0,
        playing:    false,
      };

      this.sessions.set(gid, session);
    }

    return session;
  },
  parseQuery: function(query){
    //youtube link
    if(query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm) !== null){
      
    }

    //search on youtube
    return this.searchVideo(query);
  },
  queueSong: function(message, songData){
    const session = this.getSession(message.guild.id);
    
    session.queue.push(songData);

    if(session.playing)
      enqueuedSong.sendEmbed(message, session);
  },
  play: function(message){
    const session = this.getSession(message.guild.id);

    if(session.playing == true)
      return true;

    if(session.ffmpeg != null){
      session.ffmpeg.kill();
      setTimeout( ( ffmpeg ) => ffmpeg.kill( 'SIGKILL' ), 5000, session.ffmpeg );
      delete session.ffmpeg;
    }

    if(session.dispatcher != null)
      session.dispatcher.end();

    const options = [
      '-f', 'opus',
      '-ar', '48k',
      '-acodec', 'libopus',
      '-sample_fmt', 's16',
      '-vbr', 'off',
      '-b:a', '64000',
      '-loglevel', 'error',
      '-af', 'volume=0.1',
      'pipe:1'
    ];

    message.member.voiceChannel
      .join()
      .then(connection => {
        session.conn = connection;
        const audioData = session.queue[session.queue.length - 1];

        //set video url to download
        options.push('-i', audioData.audioSource);

        //start ffmpeg with video url to get it encoded for streaming
        session.ffmpeg = child_process.spawn('ffmpeg', options);

        session.ffmpeg.stderr.on('data', error => console.log(error.toString()));

        songPreview.sendEmbed(message, audioData);

        //stream extracted sound
        session.dispatcher = session.conn.playStream(session.ffmpeg.stdout);

        session.playing = true

        session.dispatcher.once('end', () => {
          this.playNext(message);
        });
      })
      .catch(error => ErrHandler.logError(error));
  },
  playNext(message){
    const session = this.getSession(message.guild.id);

    session.playing = false;

    if((session.queueIndex + 1) <= (session.queue.length - 1)){
      session.queueIndex++;
      this.play(message)
    }else{
      session.queueIndex = 0;
    }
  },
  leave: function(message){
    const gid = message.guild.id;
    //TODO premium instance for guilds instead of one unique
    if(this.sessions.has(gid)){
      this.sessions
        .get(gid)
        .conn
        .channel
        .leave();
    }
  },
}