exports.run = async (client, message, args) => {

  const balEmoji = await Emoji.getEmoji('633740361054814229');
 

  function isNumeric(n){
    return (typeof n == "number" && !isNaN(n));
  }

  if(!isNumeric(parseInt(args[0])) || !args || args.length < 0 || args[0] == 0 || args[0] == undefined || args[1] == undefined || !(args[1] == 't' || args[1] == 'h')) return Errors.invalidUsage(message, this.config.usage);

  if (!balEmoji) return;

  const bidCoins = parseInt(args[0]);
  const bidType = args[1];

  const coins = await Currency.getCoins(message.author.id);

  console.log(message.member.displayName);

  if (bidCoins > coins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins!`, message.author.avatarURL)

  const embed = new Discord.RichEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setThumbnail('attachment://war.png')
      .setDescription('**Coin Flip**\nYou flipped a coin and it lands on ')

    const coinType = Math.floor(Math.random() * Math.floor(2));

    message.channel.send({
      embed,
      files: [{
        attachment:'./images/casino/war.png',
        name:'war.png'
      }]
    }).then((msg) => {
      let type = 0; 

      var interVal = setInterval(function() {
        if (type == 3) type = 0;

        if (type == 0) embed.setDescription('**Coin Flip**\nYou flipped a coin and it lands on .');
        if (type == 1) embed.setDescription('**Coin Flip**\nYou flipped a coin and it lands on ..');
        if (type == 2) embed.setDescription('**Coin Flip**\nYou flipped a coin and it lands on ...');

        setTimeout(() => {
          msg.edit(embed)
        }, 200);


        type++;

      }, 1000);

      setTimeout(async () => {
        clearInterval(interVal);

        embed.setDescription('**Coin Flip**\nYou flipped a coin and it lands on **' + (coinType == 0 ? 'HEAD' : 'TAIL' ) + '**');
        //embed.setImage(coinType == 0 ? 'https://i.imgur.com/tipelxS.png' : 'https://i.imgur.com/Cqw92sp.png' );

          if ((coinType == 0 && bidType == 'h') || (coinType == 1 && bidType == 't')) {
            embed.setColor('#00FF00')

            await DB.Update(message.author.id, 0, coins + bidCoins, 0);

            embed.addField('\u200b', 'You won and received `` ' + bidCoins * 2 + '``' + balEmoji, true);
          }
          else
          {
            embed.setColor('#FF0000')

            await DB.Update(message.author.id, 0, coins - bidCoins, 0);

            embed.addField('\u200b', 'You lost `` ' + bidCoins + '``' + balEmoji, true);
          }

        msg.edit(embed);

      }, 6000);


    });


  
  

};

exports.config = {
  type: "casino",
  alias: "cf",
  desc: client.lang.desc.war,
  usage: 'coinflip <coins> <h/t>'
}