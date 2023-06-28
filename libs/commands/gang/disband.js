exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

    if (!balEmoji) return;

	let gangMember = await Gangs.getGang(message.member);
	let rankMember = await Gangs.getRank(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are not part of a gang', message.author.avatarURL);
	if (rankMember != "LEADER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You need to be the leader of a gang.', message.author.avatarURL);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang**\n\nAre you sure you want to disband the gang?');

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

   				return msg.edit(embed);
	        } else if (reaction.emoji.name == '👍'); {
	   		 	db.query("DELETE FROM `gangs` WHERE `leader_id`=" + message.member.id, async function (err, result, fields) {
			        if (err) throw err;

			        db.query("SELECT * FROM `users` WHERE `gang` = '" + gangMember + "';", async (err, result, fields) => {
    		   			let rows = JSON.parse(JSON.stringify(result));

    					for (var row of rows) {
    						let member = message.guild.members.get(row.discord_id);

    						await Gangs.setRank(member, 0);

					        db.query("UPDATE `users` SET `gang`='NONE' WHERE  `discord_id`='" + member.id + "';", async function (err, result, fields) {
					            if (err) throw err;

								if (member.hasPermission("ADMINISTRATOR")) return true;

	            				member.setNickname(member.user.username);
					        });
    					}
			        });

			        return true;
			    });

			    embed.setDescription('**Gang**\n\nYou succesfully disbanded the gang!');

	            msg.edit(embed);

	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.create,
	usage: 'g create <name>'
}