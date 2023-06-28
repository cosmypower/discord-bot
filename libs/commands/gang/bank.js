exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	var gangMember = await Gangs.getGang(message.member);
	var rankMember = await Gangs.getRank(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are not part of a gang', message.author.avatarURL);
    
    var gangCoins = await Gangs.getCoins(gangMember);
    var gangLimit = await Gangs.getLimit(gangMember, "coins");

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang - ' + gangMember + '**');

	embed.addField('**Coins** - ``' + gangCoins  + '/' + gangLimit + '`` ' + balEmoji, 'Use ``' + client.config.botinfo.prefix + 'g deposit <amount>`` to add funds.', true)

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
	desc: client.lang.desc.gang.bank,
	usage: 'g bank'
}