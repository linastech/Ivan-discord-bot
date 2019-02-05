module.exports.sendEmbed = (message, sess) => {
  let msg = `# Enqueued the song requested #\n \n`;
  const current = sess.queue[sess.queueIndex];
  const enqueued = sess.queue[sess.queue.length - 1];

  const currentTitle = (current.title.length > 15 ? current.title.substr(0, 15)+"..." : current.title);
  const enqueuedTitle = (enqueued.title.length > 15 ? enqueued.title.substr(0, 15)+"..." : enqueued.title);

  //previous song
  msg += `${sess.queueIndex+1}. [${currentTitle}](${current.duration}) Now playing\n`;

  //enqueued song position

  msg += `${sess.queue.length}. [${enqueuedTitle}](${enqueued.duration}) In position\n`;

  message.channel.send("```md\n"+msg+"```");
}