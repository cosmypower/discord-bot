exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	var gangMember = await Gangs.getGang(message.member);
	var rankMember = await Gangs.getRank(message.member);

	function isNumeric(n){
         return (typeof n == "number" && !isNaN(n));
    }

    const coins = parseInt(args[1]);

    if(!isNumeric(parseInt(args[1])) || args[1] == 0 || args[1] == undefined) return Errors.invalidUsage(message, this.config.usage);

    var coinsMember = await Currency.getCoins(message.member.id);

    if (coins > coinsMember) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins`, message.author.avatarURL);
	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are not part of a gang', message.author.avatarURL);

    var gangCoins = await Gangs.getCoins(gangMember);

   	var gangCoinsLimit = await Gangs.getLimit(gangMember, "coins");

    if (gangCoins >= gangCoinsLimit) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The bank is full.`, message.author.avatarURL);
    if ((parseInt(gangCoins) + coins) > gangCoinsLimit) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can deposit only \`\`${gangCoinsLimit - gangCoins}\`\` ${balEmoji}.`, message.author.avatarURL);

    await DB.Update(message.author.id, 0, parseInt(coinsMember) - parseInt(coins), 0);
    await Gangs.addCoins(gangMember, parseInt(gangCoins) + parseInt(coins));

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang**\n\nYou succesfully deposited ``' + parseInt(coins) + '`` ' + balEmoji + ' in the bank.');

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/gang.png',
	    name:'gang.png'
	  }]
	})

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.deposit,
	usage: 'g deposit <coins>'
}