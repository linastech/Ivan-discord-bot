const mongoose 	= require('mongoose');

module.exports = (connection) => {
  let Model = new mongoose.Schema({
    guildID:      { type: String, required: true  },
    userID:       { type: String, required: true  },
  })

  Model.statics.setLo = function(user, guild){
    const _this = this;
  }

  return connection.model('guild', Model);
}