module.exports = async message => {
  //TODO DEV ONLY
  const whitelist = ["169189798764871680", "188129650952765442", "475160598783459348", "339368997684248586", "522424011167105025"];
  if(process.env['NODE_ENV'] == 'developement' && whitelist.indexOf(message.author.id) == -1)
    return;

  const client = message.client;

  if(message.author.bot) return;

  //answering questions and reacting to trigger keywords
  if(client.modules.get('interactions').isInteraction(message)) return;

  //responding to "ivan show me @query"
  if(client.modules.get('imageSearch').isImageSearch(message)) return;

  //check if command has been used and if its been run
  if(client.isCommandRun(message)) return;

  //handle user experience
  client.modules.get('levels').handleExperience(message);
}