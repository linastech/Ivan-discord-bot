const uuid        = require('uuid/v1');
const Axios       = require('axios');
const Error       = require('../handlers/error');
const CFG         = require('config').get('movies').get('themoviedb');
const Helper      = require('../utils/helper');
const rndItem     = require('../utils/rndItem');

module.exports = {
  name: 'movies',
  displayMovie(message, data){
    message.channel.send(
      {
        "embed": {
          "url": "https://discordapp.com",
          "color": 2171170,
          "timestamp": data.release_date,
          "footer": {
            "text": "Release date"
          },
          "thumbnail": {
            "url": `https://image.tmdb.org/t/p/w500${data.poster_path}`
          },
          "fields": [
            {
              "name": data.title,
              "value": data.overview + `\n [More info](https://www.themoviedb.org/movie/${data.id})`
            }
          ]
        }
      }
    );
  },
  commands: {
    getmovie: {
      config: {
        cooldown: 5000,
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        identifier: uuid(),
      },
      aliases: ['searchmovie'],
      exec(message, args){
        if(args.length == 0){
          message.channel.send("Tell me what movie you're looking for!");
          return false;
        }

        //TODO API request rate limiting tracking (themoviedb has 40 requests per 10sec limit)        
        Axios({
          url: `https://api.themoviedb.org/3/search/movie`,
          params: {
            api_key: CFG.api_key,
            query: args.join(' '),
          }
        }).then(res => {
          if(res.data.results.length > 0){
            module.exports.displayMovie(message, res.data.results[0]);
          }else{
            message.channel.send("I cant find movie you're looking for!");
          }
        }).catch(err => Error.logError(err));
      }
    },
    rndmovie: {
      config: {
        cooldown: 10000,
        blackListed: {},
        permissions: [],
        botPermissions: [],
        guildCmdCfg: {},
        identifier: uuid(),
      },
      aliases: ['random-movie', 'randomovie'],
      total_pages: null,
      exec(message, args){
        let pageNumber;

        //generate random page number
        //first API call no page count is set
        if(this.total_pages == null)
          pageNumber = 1;
        else
          //i cant find a way to check total pages before making request
          //so im using 90% sum of total_pages retrieved in the last request to be safe
          pageNumber = rndItem.selectRange('rndmovie-pagenumber', 1, Helper.percent(this.total_pages, 90));

        //TODO API request rate limiting tracking (themoviedb has 40 requests per 10sec limit)        
        Axios({
          url: `https://api.themoviedb.org/3/discover/movie`,
          params: {
            api_key: CFG.api_key,
            page: toString(pageNumber),
          }
        }).then(res => {
          const data = rndItem.select("rndmovie", res.data.results);
          
          //keep total pages existing for the next call
          this.total_pages = res.data.total_pages;

          module.exports.displayMovie(message, data);
        }).catch(err => Error.logError(err));
      }
    },
  }
}