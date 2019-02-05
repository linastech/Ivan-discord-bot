module.exports.sendEmbed = (message, videoData) => {
  const embed = {
    "embed": {
      "url": videoData.url,
      "color": 2171170,
      "timestamp": videoData.uploadedDate,
      "footer": {
        "text": "Uploaded"
      },
      "thumbnail": {
        "url": videoData.thumbnail
      },
      "fields": [
        {
          "name": videoData.author,
          "value": `[${videoData.title}](${videoData.url})`
        },
        {
          "name": "Duration",
          "value": videoData.duration
        },
      ]
    }
  };

  message.channel.send(embed);
}