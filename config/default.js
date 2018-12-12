const path      = require('path');

module.exports = {
  app: {
    token:      null,
    prefix:     ">",
    alias:      "ivan",
    name:       "ivan",
    pluginDir:  "./plugins",
    infoColor:  560805,
    webURL:     "https://theivan.wtf",
    webName:    "theivan.wtf",
    root:       path.dirname(require.main.filename),
  },
  search: {
    bing: {
      subscriptionKey: "",
      customConfig: "",
    },
    google: {
      API:      "",
      engineId: ""
    },
    imgur: {
      ID:       "",
      secret:   "",
    }
  },
  fun: {
    cooldown: 3000,
  },
  leaderboard: {
    cooldown:   3000
  },
  database:         {
    host:     "127.0.0.1", 
    port:     "27017",
    database: "ivan",
  }
}