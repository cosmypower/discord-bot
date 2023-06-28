exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	if (message.mentions.members.size == 0) return Errors.invalidUsage(message, this.config.usage)
    const kicked = message.mentions.members.first();

	let gangMember = await Gangs.getGang(message.member);
	let rankMember = await Gangs.getRank(message.member);

	let gangKicked = await Gangs.getGang(kicked);
	let rankKicked = await Gangs.getRank(kicked);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "You are not part of a gang", message.author.avatarURL);
	if (gangKicked == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "That member is not part of a gang", message.author.avatarURL);
	if (gangMember != gangKicked) return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'That member is a part of another gang.', message.author.avatarURL);
	if (rankKicked == "LEADER" || (rankKicked == "OFICER" && rankMember == "OFFICER"))  return Errors.showError(message.member.displayName, message.channel, '#FF0000', "You can't kick that member.", message.author.avatarURL);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang**\n\nAre you sure you want to kick ``' + kicked.displayName + '``?');

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
   				embed.setColor('#00FF00')

   				msg.edit(embed);

   				return msg.delete(5000);
	        } else if (reaction.emoji.name == '👍'); {

				await Gangs.setRank(kicked, 0);

		        db.query("UPDATE `users` SET `gang`='NONE' WHERE  `discord_id`='" + kicked.id + "';", async function (err, result, fields) {
		            if (err) throw err;

					if (kicked.hasPermission("ADMINISTRATOR")) return true;

    				kicked.setNickname(kicked.user.username);
		        });

			    embed.setDescription('**Gang**\n\nYou succesfully kicked' + kicked.displayName + ' the gang!');

	            msg.edit(embed);

	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.kick,
	usage: 'g kick <user>'
}