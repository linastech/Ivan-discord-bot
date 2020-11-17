const path      = require('path');

module.exports = {
  app: {
    token:      null,
    prefix:     ">",
    alias:      "ivan",
    name:       "ivan",
    infoColor:  560805,
    webURL:     "https://ivan.shirase.cloud",
    webName:    "ivan.shirase.cloud",
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
    },
  },
  movies: {
    themoviedb: {
      api_key: '',
    },
  },
  database:         {
    host:     "127.0.0.1", 
    port:     "27017",
    username: "rnd",
    password: "",
    database: "ivan",
    authSource: "admin"
  }
}
