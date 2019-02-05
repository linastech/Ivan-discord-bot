const mongoose 	  = require('mongoose');
const Error       = require('../handlers/error');

module.exports = (connection) => {
  let Model = new mongoose.Schema({
    guildID:      { type: String, required: true  },
  });

  Model.statics.insertGuild = function(message){
    this.create({
      guildID: message.guild.id
    });
  }

  return connection.model('guilds', Model);
}