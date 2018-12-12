const Commands  = require('../commands.js');
const helper    = require('../helper.js');
const CFG       = require('config').get('app');
const CFGFun    = require('config').get('fun');

class Fun extends Commands{
  constructor(client){
    super(client);
    client.on('message', msg => this.messageSent(msg));

    this.timer = new Set();

    helper.log("Loaded plugin: Fun");
  } 

  messageSent(msg) {
    if(msg.author.bot)
      return;

    //when bot name gets called in all caps
    if(msg.content == CFG.name.toUpperCase()){
      msg.channel.send("WHAT KURVA?!");
      return;
    }

    const input = msg.content.toLowerCase();

    //questions directed at ivan (50/50 answers)
    if(this.question(msg, input))
      return;

    //responses to various words/sentances
    switch(input){
      case 'what does the fox say':
        msg.channel.send("SUKA NAXUI", {
          file: "https://i.imgur.com/xJIvl0c.png"
        });
      break;
      case 'tfw no gf':
        msg.channel.send("tfw no olga", {
            file: "http://theivan.wtf/memes/slavgf.png"
        });
      break;
      case 'fuck':
        msg.channel.send("cyka blyat");
      break;
    }
  }

  question(msg, input){
    const timerID = `${msg.guild.id}-${msg.author.id}`;

    //spam prevention timer
    if(this.timer.has(timerID))
      return false;

    //create new cooldown timer
    this.timer.add(timerID);

    //delete entry after set time has passed
    setTimeout(() => this.timer.delete(timerID), CFGFun.cooldown);

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
        this.emptyMessage(msg);
        return false; 
      }

      const typeOfAnswer = answers[helper.random(0, answers.length - 1)];
      const answer = typeOfAnswer[helper.random(0, typeOfAnswer.length - 1)];

      msg.channel.send(answer);

      return true;
    }else{
      return false;
    }
  }

  emptyMessage(msg){
    msg.channel.send("You didn't ask me anything...");
  }
}

module.exports = Fun;