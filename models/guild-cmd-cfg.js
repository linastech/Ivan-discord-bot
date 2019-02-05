const mongoose 	  = require('mongoose');
const Error       = require('../handlers/error');

module.exports = (connection) => {
  let Model = new mongoose.Schema({
    _id:          mongoose.Schema.Types.ObjectId,
    guildID:      { type: String, required: true  },
    command:      { type: String, required: true  },
    config:       { type: Object, required: true  },
    messages:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' }],
  })

  Model.statics.setConfig = function(guildID, command, data){
    return this.updateOne(
      {
        guildID: guildID,
        command: command,
      },
      {
        guildID: guildID,
        command: command,
        config: data,
      },
      {upsert: true}
    )
    .exec();
  }

  Model.statics.getConfig = async function(guildID, command){
    try{
      return this.findOne({guildID: guildID, command: command});
    }catch(error){
      Error.logError(error);
    }
  }

  return connection.model('guild-cmd-cfg', Model);
}