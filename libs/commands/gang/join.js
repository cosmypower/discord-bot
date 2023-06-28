exports.run = async (client, message, args) => {

	const embed = new Discord.RichEmbed();

	if (args[1] == undefined || args[1].length < 0) return Errors.invalidUsage(message, this.config.usage);

	let gangMember = await Gangs.getGang(message.author, false, args[1]);


	db.query("SELECT COUNT(*) AS count FROM `gangs` WHERE `gang_name` = '" + gangMember + "'", async (err, result, fields) => {
		if (err) throw err;

		if (result[0].count == 0) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `That gang doesn't exist.`, message.author.avatarURL);

		if (await Gangs.getGang(message.member) != "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You are part of a gang`, message.author.avatarURL);

		let users = await Gangs.GetUsers(gangMember);
		let membersLimit = await Gangs.get('members_limit', 'gang_name', gangMember);
		
		if (users + 1 > client.config.shop.member.upgrades[memberLimitLevel.members_limit]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang is full!`, message.author.avatarURL);
		
		db.query("SELECT `open` FROM `gangs` WHERE `gang_name` = '" + gangMember + "'", async (err, resulter, fields) => {
			console.log(resulter);
			if (resulter[0].open == 0) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `This gang is currently CLOSED and required an invitation to join.`, message.author.avatarURL);
		
			embed.setColor(client.lang.colors.othersCommandsEmbed);
		    embed.setThumbnail('attachment://gang.png')
		    embed.setAuthor(message.member.displayName, message.author.avatarURL)

		   	embed.setDescription('**Gang**\n\nAre you sure you want to join ``' + gangMember + '`` gang?');

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
			   		 	let succesful = await Gangs.invitePlayer(gangMember, message.member);
			   		 	
			   		 	if (succesful) {
				   		 	embed.setDescription('**Gang**\n\nYou succesfully joined the gang!');

				   			msg.edit(embed);
			   		 	}

			        }

			    }).catch(collected => {
			    	msg.delete(5000);
			    });

		    })

		});
	    
	});



};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.create,
	usage: 'g join <gang>'
}