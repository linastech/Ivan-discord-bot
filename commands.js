const CFG       = require('config').get('app');

class Commands {
  constructor(client){
    this.client       = client;
    this.prefix       = CFG.prefix;
    this.commands     = [];

    client.on('message', msg => this.onMessage(msg));
  }

  onMessage(msg){
    let content = msg.content;

    if(!content.startsWith(this.prefix))
      return;

    let inputArgs = content
      .substring(this.prefix.length)
      .match(/\S+/g)
      .map(arg => arg.toLowerCase().trim() );

    const inputCommand =  inputArgs.shift();

    for(let command of this.commands){
      if(command.aliases == inputCommand){
        command.callback(msg, inputArgs);
        
        break;
      }
    }
  }

  registerCommand(params){ 
    this.commands.push(params);
  }
}

module.exports = Commands;