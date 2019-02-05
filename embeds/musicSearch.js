const {convertYouTubeDuration} = require('duration-iso-8601');

module.exports.sendEmbed = (message, videoData) => {
  let text = `# 	Search Results 	#\n \n`;

  text += videoData.map((item, index) => {
    //youtube stores duration in ISO 8601
    const duration = convertYouTubeDuration(item.contentDetails.duration);
    
    return `${index+1}. [ ${item.snippet.title} ](${duration})\n`;
  }).join('');

  message.channel.send("```md\n"+text+"```");
}