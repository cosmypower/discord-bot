exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	if (message.mentions.members.size == 0) return Errors.invalidUsage(message, this.config.usage)

    const promoted = message.mentions.members.first();

	let gangMember = await Gangs.getGang(message.member);
	let rankMember = await Gangs.getRank(message.member);

	let gangPromoted = await Gangs.getGang(promoted);
	let rankPromoted = await Gangs.getRank(promoted);

	if (gangMember != gangPromoted) return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'That member is a part of another gang.', message.author.avatarURL);
	if (rankPromoted == "DEFAULT") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'That member already has the default rank.')
	if (rankMember != "LEADER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "You can't demote other people.", message.author.avatarURL);
	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "You are not part of a gang", message.author.avatarURL);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang**\n\nAre you sure you want to demote ``' + promoted.displayName + '`` to default?');

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/gang.png',
	    name:'gang.png'
	  }]
	}).then(async (msg) => {
		msg.react('👍').then(() => msg.react('👎'));

		const filter = (reaction, user) => {
        	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    	};
	
	    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
	      	const reaction = collected.first();

	      	if (reaction.emoji.name === '👎') {
   				embed.setColor('#FF0000')

   				msg.edit(embed);

   				return msg.delete(5000);
	        } else if (reaction.emoji.name == '👍'); {

				await Gangs.setRank(promoted, 1);

			    embed.setDescription('**Gang**\n\n``' + promoted.displayName + '`` has been demoted to Default');

	            msg.edit(embed);
	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.demote,
	usage: 'g demote <user>'
}