exports.run = async (client, message, args) => {

  const balEmoji = await Emoji.getEmoji('633740361054814229');

  if(!args || args.length < 0 || args[0] == 0 || args[0] == undefined) return Errors.invalidUsage(message, this.config.usage);

  if (!balEmoji) return;

  const bidCoins = parseInt(args[0]);

  const coins = await Currency.getCoins(message.author.id);

  if (bidCoins > coins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins!`)

  const embed = new Discord.RichEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setThumbnail('attachment://war.png')

    const dealer = Math.floor(Math.random() * Math.floor(12)) + 2;
    const player = Math.floor(Math.random() * Math.floor(12)) + 2;
    const dealerEmoj = await Emoji.getCard(dealer);
    const playerEmoj = await Emoji.getCard(player);

    embed.addField("**Your Card**", playerEmoj + `\nCard value: **` + player + '**', true);
    embed.addField("**Dealer Card**", dealerEmoj + `\nCard value: **` + dealer + '**', true);

    if (player > dealer) {
      embed.setColor('#00FF00')

      await DB.Update(message.author.id, 0, coins + bidCoins, 0);

      embed.setDescription('**War**\nYou have won ' + bidCoins * 2 + balEmoji);
    }
    else if (player == dealer) {
      embed.setColor('#FFB700')

      embed.setDescription("**War**\nIt's a tie! Nobody wins.")
    }
    else
    {
      embed.setColor('#FF0000')

      await DB.Update(message.author.id, 0, coins - bidCoins, 0);

      embed.setDescription("**War**\nYou have lost " + bidCoins + balEmoji);
    }

    message.channel.send({
      embed,
      files: [{
        attachment:'./images/casino/war.png',
        name:'war.png'
      }]
    });

};

exports.config = {
  type: "casino",
  desc: client.lang.desc.war,
  usage: 'war <coins>'
}