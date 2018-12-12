const mongoose 	= require('mongoose');

module.exports = (connection) => {
  let Leaderboard = new mongoose.Schema({
    guildID:      { type: String, required: true  },
    userID:       { type: String, required: true  },
    username:     { type: String, required: true  },
    points:       { type: Number , required: true  },
    level:        { type: Number , default: 0  },
    nextLevel:    { type: Number , default: 100  },
  })

  Leaderboard.statics.increaseScore = function(user, guild){
    const _this = this;
    
    this.findOne(
      {guildID: guild.id, userID: user.id},
      function(err, document){
        if(document == null){
          _this.create({
            guildID:  guild.id,
            userID:   user.id,
            username: user.username,
            points:   1,
            level:    1,
            nextLevel: 16,
          })
        }else{
          document.points += 1;

          if(document.points > document.nextLevel){
            growthModifier = 1.6;

            document.level += 1;
            document.nextLevel = Math.floor(( document.level * 10 ) * ( document.level * growthModifier ));
          }

          document.save();
        }
      }
    );
  }

  return connection.model('leaderboard', Leaderboard);
}