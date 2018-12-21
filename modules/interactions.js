const uuid      = require('uuid/v1');
const Timer     = require('../utils/timer');
const CFG       = require('config').get('app');
const Helper    = require('../utils/helper');

//TODO properly setup cfg
const interactionCFG = {
  cooldown: 4000,
  identifier: uuid(),
};

module.exports = {
  name: 'interactions',
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
  },

  question(message, input){

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
    if(typeof matched === 'string' && Timer.isCoolingDown(message, interactionCFG) == false){
      //start the timer
      Timer.set(message, interactionCFG);

      //question asked is too short
      if(input.replace(`${CFG.name} ${matched}`, '').length < 3){
        this.emptyMessage(message);
        return true; 
      }

      const typeOfAnswer = answers[Helper.random(0, answers.length - 1)];
      const answer = typeOfAnswer[Helper.random(0, typeOfAnswer.length - 1)];

      this.respond(message, answer);

      return true;
    }else{
      return false;
    }
  },

  emptyMessage(message){
    return this.respond(message, "You didn't ask me anything...");
  },
  
  respond(message, response){
    message.channel.send(response);
    
    return true;
  },

  commands: {},
}