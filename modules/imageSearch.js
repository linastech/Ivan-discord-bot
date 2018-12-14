const Axios     = require('axios');
const Fetch     = require('node-fetch');
const CFGapp    = require('config').get('app');
const CFG       = require('config').get('search');
const jsonfile  = require('jsonfile');
const helper    = require('../utils/helper');

module.exports = class imageSearch{
  constructor(){
    this.dataFile = `${CFGapp.root}/data/search.json`;
    this.dataFileObj = null;

    //read and set data file which will be used to keep track of API calls and other info
    jsonfile.readFile(this.dataFile, (err, obj) => {
      if (err)
        helper.logError(client, err);
      else
        this.dataFileObj = obj;
    });
  }
  
  isImageSearch(message){
    const input = message.content.toLowerCase();

    //must start with the bot name
    if(!input.startsWith(`${CFGapp.name} show me`)) return false;
    
    const query = input.replace(`${CFGapp.name} show me`, "");

    this[this.dataFileObj.nextCall](message, query)
    this.balanceApiCalls();

    return true;
  }

  balanceApiCalls(){
    const callMadeTo = this.dataFileObj.nextCall;
    const stats = this.dataFileObj.statistics[callMadeTo];
    
    stats.callsMadeToday++;
    
    //limit reached remove service from the list for today
    if(stats.callsMadeToday >= stats.dailyQuota){
      stats.limitExceeded = true;
      this.dataFileObj.availableServices = this.dataFileObj.availableServices.filter(item => item !== callMadeTo)
    }

    //select next service to be used
    //TODO select services with higher limit more than ones with small limits like google (100/day)
    this.dataFileObj.nextCall = this.dataFileObj.availableServices[helper.random(0, this.dataFileObj.availableServices.length - 1)];
    this.dataFileObj.statistics[callMadeTo] = stats;
    
    jsonfile.writeFile(this.dataFile, this.dataFileObj, { spaces: 2, EOL: '\r\n' }, (err) => {
      if(err) helper.logError(client, err);
    })
  }
  
  bing(msg, query){
    Axios({
      url: `https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/images/search/`,
      headers: { ['Ocp-Apim-Subscription-Key']: CFG.bing.subscriptionKey },
      method: 'get',
      responseType: 'json',
      params: {
        q: query,
        safeSearch: "off",
        customConfig: CFG.bing.customConfig,
      }
    })
    .then(res => {
      const images = res.data.value;

      if(images.length == 0){
        msg.channel.send(`Pizdec, I can't find anything about ${query}!`);
      }else{
        msg.channel.send("this image came from bing", {
          file: images[helper.random(0, images.length - 1)].contentUrl
        })
      }
    })
    .catch(error => console.log(error));
  }

  imgur(msg, query){
    Axios({
      url: `https://api.imgur.com/3/gallery/search/viral/top/`,
      headers: { Authorization: `Client-ID ${CFG.imgur.ID}` },
      method: 'get',
      responseType: 'json',
      params: {
        mature: true,
        q_all: query,
      }
    })
    .then(res => {
      const pickImage = () => {
        
        const albumList = res.data.data;
        const album = albumList[helper.random(0, albumList.length -1)];
        let link

        if(album.is_album === true)
          link = album.images[helper.random(0, album.images.length -1)];
        else
          link = album;

        return link;
      }

      if(res.data.data.length == 0){
        msg.channel.send(`Pizdec, I can't find anything about ${query}!`);
      }else{
        let image = null;

        for(let i = 0; i < res.data.data.length; i++){
          image = pickImage();

          if(image.size < 7000000){
            image = image.link;
            break;
          }
        }

        if(image === null){
          msg.channel.send(`Pizdec, I can't find anything about${query}!`);
        }else{
          msg.channel.send("this image came from imgur", {
            file: image
          })
          .catch(error => helper.logError(this.client, error) );
        }
      }
    })
    .catch(error => helper.logError(this.client, error));
  }

  google(msg, query){
    Axios({
      url: 'https://www.googleapis.com/customsearch/v1/siterestrict/',
      method: 'get',
      responseType: 'json',
      params: {
        q:            query,
        cx:           CFG.google.engineId,
        key:          CFG.google.API,
        searchType:   "image",
        num:          10,
      }
    })
    .then(res => {
      if(typeof res.data.items == 'undefined'){
        msg.channel.send(`Pizdec, I can't find anything about ${query}!`);
      }else{
        let imageURL = res.data.items[helper.random(0, res.data.items.length - 1)].link;

        Fetch(imageURL)
          .then(res => res.buffer())
          .then(buffer => {
            msg.channel.send("this image came from google", {
              file: buffer
            })
            .catch(error => helper.logError(this.client, error) );
          })
          .catch(error => helper.logError(this.client, error) );
      }
    })
    .catch(error => {
      helper.logError(this.client, error)
    })
  }
}