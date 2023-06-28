exports.run = async (client, message, args) => {

  const balEmoji = await Emoji.getEmoji('633740361054814229');

  if (!balEmoji) return;

  if(!args || args.length < 0 || args[1] == 0 || args[1] == undefined || message.mentions.members.size == 0) return Errors.invalidUsage(message, this.config.usage);

  const enemy = message.mentions.members.first();

  if (enemy.id == message.author.id) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't mention yourself.`)

  const bidCoins = parseInt(args[1]);
  const authorCoins = await Currency.getCoins(message.author.id);
  const enemyCoins = await Currency.getCoins(enemy.id);

  if (bidCoins > authorCoins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins!`, message.author.avatarURL)
  if (bidCoins > enemyCoins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `${enemy.displayName} doesn't have enough coins!`, message.author.avatarURL)

  const enemyNr = Math.floor(Math.random() * Math.floor(12)) + 2;
  const authorNr = Math.floor(Math.random() * Math.floor(12)) + 2;

  const enemyCard = await Emoji.getCard(enemyNr);
  const authorCard = await Emoji.getCard(authorNr);

  const embed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail('attachment://war.png')
      .setColor('#FFB700')

    embed.addField("**" + message.member.displayName + " Card**", authorCard + `\nCard value: **` + authorNr + '**', true);
    embed.addField("**" + enemy.displayName + " Card**", enemyCard + `\nCard value: **` + enemyNr + '**', true);

    message.channel.send(`${enemy}, ${message.author} has challenged you to a duel for ${bidCoins} ${balEmoji}.`).then((msg) => {
         msg.react('👍').then(() => msg.react('👎'));

         const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === enemy.id;
        };

        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
          .then(async (collected) => {
              const reaction = collected.first();

              if (reaction.emoji.name === '👎') {
                 return Errors.showError(enemy.displayName, message.channel, '#FF0000', `${enemy} didn't accepted the duel. So sad!`, message.author.avatarURL)
              } else if (reaction.emoji.name === '👍') {
                 if (enemyNr == authorNr) {

                   embed.setDescription("**Duel**\nIt's a tie! Nobody wins.")

                  } else {

                    if (authorNr > enemyNr) {

                      await DB.Update(message.author.id, 0, authorCoins + bidCoins, 0);
                      await DB.Update(enemy.id, 0, enemyCoins - bidCoins, 0);

                      embed.setDescription('**Duel**\n' + message.member.displayName  + ' won ' + bidCoins * 2 + balEmoji);

                    }
                    else {

                      await DB.Update(enemy.id, 0, enemyCoins + bidCoins, 0);
                      await DB.Update(message.author.id, 0, authorCoins - bidCoins, 0);

                      embed.setDescription('**Duel**\n' + enemy.displayName + ' won ' + bidCoins * 2 + balEmoji);
                    }

                  }

                message.channel.send({
                  embed,
                  files: [{
                    attachment:'./images/casino/war.png',
                    name:'war.png'
                  }]
                });

              }

          })
          .catch(collected => {
              msg.delete(5000);
          });

    });




};

exports.config = {
  type: "casino",
  desc: client.lang.desc.duel,
  usage: 'duel <player> <coins>'
}