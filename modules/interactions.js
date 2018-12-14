const CFG       = require('config').get('app');
const helper    = require('../utils/helper');

module.exports = class interactions{
  constructor(){
    this.config = {
      cooldown: 3000
    }

    this.timer = new Set();
  }

  isInteraction(message) {

    //when bot name gets called in all caps
    if(message.content == CFG.name.toUpperCase())
      return this.respond(message, "WHAT KURWA?!");

    const input = message.content.toLowerCase();

    //questions directed at ivan (50/50 answers)
    if(this.question(message, input)) return true;

    if(input == 'fuck')
      return this.respond(message, "cyka blyat");

    //no matches found return false
    return false;
  }

  question(message, input){
    const timerID = `${message.guild.id}-${message.author.id}`;

    //spam prevention timer
    if(this.timer.has(timerID))
      return false;

    //create new cooldown timer
    this.timer.add(timerID);

    //delete entry after set time has passed
    setTimeout(() => this.timer.delete(timerID), this.config.cooldown);

    const matches = [ "should", "is", "are", "am i", "does", "do", "did", "will", "can", "do i" ];
    const answers = [
      //positive
      ["yes", "sure", "ya", "yeah", "i think so"],
      //negative
      ["no", "nope", "nah", "ya no", "lmao no"],
    ];

    const matched = matches.find(keyWord => {
      return input.startsWith(`${CFG.name} ${keyWord}`);
    });
      
    //if nothing is matched it would be boolean false
    if(typeof matched === 'string'){
      //question asked is too short
      if(input.replace(`${CFG.name} ${matched}`, '').length < 3){
        this.emptyMessage(message);
        return true; 
      }

      const typeOfAnswer = answers[helper.random(0, answers.length - 1)];
      const answer = typeOfAnswer[helper.random(0, typeOfAnswer.length - 1)];

      this.respond(message, answer);

      return true;
    }else{
      return false;
    }
  }

  emptyMessage(message){
    return this.respond(message, "You didn't ask me anything...");
  }
  
  respond(message, response){
    message.channel.send(response);
    
    return true;
  }
}