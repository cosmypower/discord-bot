exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

    if (!balEmoji) return;

	let gangMember = await Gangs.getGang(message.member);
	let rankMember = await Gangs.getRank(message.member);

	if (rankMember == "OFFICER" || rankMember == "MEMBER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are already in a gang.\nIf you want to create a new one, make sure you type ``' + client.config.botinfo.prefix + 'g leave``', message.author.avatarURL);
	if (gangMember != "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You already have a created gang.\nIf you want to create a new one, make sure you type ``' + client.config.botinfo.prefix + 'g disband``', message.author.avatarURL);
    if (args[1] == undefined || args[1].length < 0) return Errors.invalidUsage(message, this.config.usage)

    embed.setColor(client.lang.colors.othersCommandsEmbed);
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

    let succesful = await Gangs.createGang(args[1], message.member);

    if (succesful) {
   		embed.setDescription('**Gang**\n\nYou succesfully created the gang named ' + args[1]);

   		message.channel.send({
		  embed,
		  files: [{
		    attachment:'./images/gang.png',
		    name:'gang.png'
		  }]
		});

    } else return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You can create only one gang!', message.author.avatarURL)

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.create,
	usage: 'g create <name>'
}