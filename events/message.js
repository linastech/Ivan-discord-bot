const CFG       = require('config').get('app');
const modules   = require('../handlers/module');

module.exports = message => {
  if(message.author.bot) return;

  //answering questions and reacting to trigger keywords
  if(modules.get('interactions').isInteraction(message)) return;

  //responding to "ivan show me @query"
  if(modules.get('imageSearch').isImageSearch(message)) return;

  //TODO ability to set custom prefix
  if(message.content.startsWith(CFG.prefix)){
    let params = message.content
      .substring(CFG.prefix.length)
      .match(/\S+/g)
      .map(arg => arg.toLowerCase().trim() );

    const command =  params.shift();

    if(modules.has(command)){
      modules.get(command).execute(message, params);
      return;
    }
  }

  modules.get('levels').handleExperience(message);
}