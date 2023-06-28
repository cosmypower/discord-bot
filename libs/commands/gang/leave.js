exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

    if (!balEmoji) return;

	let gangMember = await Gangs.getGang(message.member);
	let rankMember = await Gangs.getRank(message.member);

	if (rankMember == "LEADER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "As you are the leader, you must transfer ownership or disband the gang to leave.", message.author.avatarURL);
	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', "You are not part of a gang", message.author.avatarURL);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang**\n\nAre you sure you want to leave ``' + gangMember + '``?');

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
	   		 	db.query("DELETE FROM `gangs` WHERE `leader_id`=" + message.member.id, async function (err, result, fields) {
			        if (err) throw err;

					await Gangs.setRank(message.member, 0);

			        db.query("UPDATE `users` SET `gang`='NONE' WHERE  `discord_id`='" + message.member.id + "';", async function (err, result, fields) {
			            if (err) throw err;

						if (message.member.hasPermission("ADMINISTRATOR")) return true;

        				message.member.setNickname(message.author.username);
			        });

			        return true;
			    });

			    embed.setDescription('**Gang**\n\nYou succesfully left the gang!');

	            msg.edit(embed);

	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.leave,
	usage: 'g leave'
}