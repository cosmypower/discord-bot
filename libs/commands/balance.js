exports.run = async (client, message) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

    if (!balEmoji) return;

    embed.setColor(client.lang.colors.othersCommandsEmbed);
    embed.setThumbnail('attachment://currency.png')

	if (message.mentions.members.size != 0) {
		const user = message.mentions.members.first();

   		let balance = await Currency.getCoins(user.id);

		embed
			.setAuthor(user.displayName, user.user.avatarURL)
			.addField(`**COINS** - ${balance} ${balEmoji}`, client.lang.texts.balanceCommandFooter, true)

	} else { 
    	let balance = await Currency.getCoins(message.author.id);

		embed
			.setAuthor(message.member.displayName, message.author.avatarURL)
			.addField(`**COINS** - ${balance} ${balEmoji}`, client.lang.texts.balanceCommandFooter, true)
	}

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/currency.png',
	    name:'currency.png'
	  }]
	});

};

exports.config = {
	type: "other",
	alias: "bal",
	desc: client.lang.desc.balance,
	usage: 'balance [user]'
}