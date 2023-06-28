exports.run = async (client, message, args) => {

  function isNumeric(n){
    return (typeof n == "number" && !isNaN(n));
  }

  const balEmoji = await Emoji.getEmoji('633740361054814229');
 
  if (!isNumeric(parseInt(args[0])) && args[0] == 'info') {

      const embed = new Discord.RichEmbed()
        .setAuthor(message.member.displayName, message.author.avatarURL)
        .setDescription('**Roulette**\n\nUsage: ``' + client.config.botinfo.prefix + this.config.usage + '``')
        .addField('Payout multipliers', '[x36] Straight\n[x3] Dozens (1-12, 13-24, 25-36)\n[x3] Columns (1st, 2nd, 3rd)\n[x2] Halves (1-18, 19-36)]\n[x2] Odd/Even')
        .setImage('attachment://roulette.png');

     return message.channel.send({
        embed,
        files: [{
          attachment:'./images/casino/roulette.png',
          name:'roulette.png'
        }]
     });

  }

  const bet = parseInt(args[0]);
  const numbers = args[1];

  const coins = await Currency.getCoins(message.author.id);
  const type = await Roulette.getType(numbers);

  if (bet > coins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins!`, message.author.avatarURL)

  if(!isNumeric(parseInt(args[0])) || !args || args.length < 0 || args[0] == 0 || args[1] == undefined || !type) return Errors.invalidUsage(message, this.config.usage);

  if (await Roulette.addUser(message.guild, message.member, bet, numbers) == false) return Errors.showError(message.author, message.channel, "#FF0000", `You can play roulette only one time per round!`, message.author.avatarURL);

  const embed = new Discord.RichEmbed()
    .setAuthor(message.member.displayName, message.author.avatarURL)
    .setDescription('**Roulette**\n\nYou have placed a bet of ``' + bet + '`` ' + balEmoji + ' on ``' + numbers + '``')
    .setThumbnail('attachment://war.png')
    .setColor('#A103FC')
    .setFooter('Time remaining: ' + (30 - rouletteTime) + ' seconds');

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
  alias: "rl",
  desc: client.lang.desc.roulette,
  usage: 'roulette <bet> <type>'
}