/* Made by cohonesbrothers © 2019 */

exports.run = async (client, message) => {

	const xpEmoji = await Emoji.getEmoji('633740361419718666');
	const embed = new Discord.RichEmbed();

    if (!xpEmoji) return;

	if (message.mentions.members.size != 0) {
		const user = message.mentions.members.first();

   		let level = await Levels.getLevel(user.id);
   		let xp = await Levels.getXP(user.id);

		embed
			.setColor(client.lang.colors.othersCommandsEmbed)
			.setAuthor(user.displayName, user.user.avatarURL)
			.setThumbnail('attachment://level.png')
			.addField(`**Level** - ${level} (${xp}/${(client.config.leveling.base * level) * 2})`, client.lang.texts.xpCommandFooter, true)

	} else { 

   		let level = await Levels.getLevel(message.author.id);
   		let xp = await Levels.getXP(message.author.id);

		embed
			.setColor(client.lang.colors.othersCommandsEmbed)
			.setAuthor(message.member.displayName, message.author.avatarURL)
			.setThumbnail('attachment://level.png')
			.addField(`**Level** - ${level} (${xp}/${(client.config.leveling.base * level) * 2})`, client.lang.texts.xpCommandFooter, true)

	}

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/level.png',
	    name:'level.png'
	  }]
	});

	return;
};

exports.config = {
	type: "other",
	alias: "lvl",
	desc: client.lang.desc.level,
	usage: 'level [user]'
}