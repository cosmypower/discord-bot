exports.run = async (client, message, args) => {

	const embed = new Discord.RichEmbed();

	let rank = await Gangs.getRank(message.member);
	let gangMember = await Gangs.getGang(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You are not part of a gang`, message.author.avatarURL);
	if (rank != "LEADER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't open the gang.`, message.author.avatarURL)

    embed.setColor(client.lang.colors.othersCommandsEmbed);
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

   	embed.setDescription('**Gang**\n\nAre you sure you want to make the gang closed?');

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

   				return msg.edit(embed);
	        } else if (reaction.emoji.name == '👍'); {

   			    db.query("UPDATE `gangs` SET `open`=0 WHERE `gang_name`='" + gangMember + "';", async function (err, result, fields) {
		            if (err) throw err;

		            embed.setDescription('**Gang**\n\nThe gang ``' + gangMember + '``is now CLOSED and requires an invitation to join.');

	   				msg.edit(embed);
		        });

	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.close,
	usage: 'g close'
}