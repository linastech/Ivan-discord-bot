const mongoose 	  = require('mongoose');
const Error       = require('../handlers/error');

module.exports = (connection) => {
  let Model = new mongoose.Schema({
    message:    { type: String, required: true  },
    userId:     { type: String, required: true  },
    id:         { type: String, required: true  },
    guild:      { type: mongoose.Schema.Types.ObjectId, ref: 'guilds' },
  });

  Model.statics.insertMessage = async function(message){
    //get guild objectId
    const guild = await connection.models.guilds.findOne({guildID: message.guild.id}, '_id');

    //TODO make sure guild document exists

    this.create(
      {
        message:  message.content,
        id:       message.id,
        userId:   message.author.id,
        guild:    guild._id,
      }
    );
  }

  Model.statics.test = function(message){
    this.findOne({id: "529352535086071823"})
      .populate('guild')
      .exec((err, data) => {
        if(err) console.log(err);

        console.log(data)
      })
  }

  return connection.model('messages', Model);
}