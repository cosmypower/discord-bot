/* Made by cohonesbrothers © 2019 */

exports.run = async (client, message) => {

	const xpEmoji = await Emoji.getEmoji('633740361419718666');
	const embed = new Discord.RichEmbed();

    if (!xpEmoji) return;

	if (message.mentions.members.size != 0) {
		const user = message.mentions.members.first();

   		let xp = await Levels.getXP(user.id);

		embed
			.setColor(client.lang.colors.othersCommandsEmbed)
			.setAuthor(user.displayName, user.user.avatarURL)
			.setThumbnail('attachment://power.png')
			.addField(`**XP** - ${xp} ${xpEmoji}`, client.lang.texts.xpCommandFooter, true)
	} else { 
   		let xp = await Levels.getXP(message.author.id);

		embed
			.setColor(client.lang.colors.othersCommandsEmbed)
			.setAuthor(message.member.displayName, message.author.avatarURL)
			.setThumbnail('attachment://power.png')
			.addField(`**XP** - ${xp} ${xpEmoji}`, client.lang.texts.xpCommandFooter, true)
	}

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/power.png',
	    name:'power.png'
	  }]
	});

	return;
};

exports.config = {
	type: "other",
	desc: client.lang.desc.xp,
	usage: 'xp [user]'
}