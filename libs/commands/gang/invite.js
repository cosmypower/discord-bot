exports.run = async (client, message, args) => {

	const embed = new Discord.RichEmbed();

    if (message.mentions.members.size == 0) return Errors.invalidUsage(message, this.config.usage)

    const invited = message.mentions.members.first();
	let rank = await Gangs.getRank(message.member);
	let gangInvited = await Gangs.getGang(invited);
	let gangMember = await Gangs.getGang(message.member);


	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You are not part of a gang`, message.author.avatarURL);
	if (gangInvited != "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'That member is already a part of another gang.', message.author.avatarURL);
	if (rank != "OFFICER" && rank != "LEADER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't invite users.`, message.author.avatarURL)
	if (invited.id == message.author.id) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't mention yourself.`, message.author.avatarURL)
	if (await Gangs.getGang(message.member) == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You are not in a gang.`, message.author.avatarURL)

	let users = await Gangs.GetUsers(gangMember);
	let membersLimit = await Gangs.get('members_limit', 'gang_name', gangMember);
	
	if (users + 1 > client.config.shop.member.upgrades[memberLimitLevel.members_limit]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang is full!`, message.author.avatarURL);
	

    embed.setColor(client.lang.colors.othersCommandsEmbed);
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

   	embed.setDescription('**Gang**\n\n' + invited + ', the ' + rank.toLowerCase() + ' ' + message.author + ' of ``' + (await Gangs.getGang(message.member)) + '`` invited you in his gang. Do you accept?');

   	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/gang.png',
	    name:'gang.png'
	  }]
	}).then(async (msg) => {
		msg.react('👍').then(() => msg.react('👎'));

		const filter = (reaction, user) => {
        	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === invited.id;
    	};
	
	    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
	      	const reaction = collected.first();

	      	if (reaction.emoji.name === '👎') {
   				embed.setDescription('**Gang**\n\n' + invited + ` didn't accept the invite.`);
   				embed.setColor('#FF0000')

   				return msg.edit(embed);
	        } else if (reaction.emoji.name == '👍'); {
	   		 	let succesful = await Gangs.invitePlayer(await Gangs.getGang(message.member), invited, message.member);
	   		 	
	   		 	if (succesful) {
		   		 	embed.setDescription('**Gang**\n\n' + invited + ' accepted the gang invitation!');

		   			msg.edit(embed);
	   		 	}

	        }

	    }).catch(collected => {
	    	msg.delete(5000);
	    });

    })

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.create,
	usage: 'g invite <name>'
}