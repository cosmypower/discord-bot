exports.run = async (client, message, args) => {

	const embed = new Discord.RichEmbed();

	//if (args[1] == undefined || args[1].length < 0 || args[1] != "suffix") return Errors.invalidUsage(message, this.config.usage)
	let gangMember = await Gangs.getGang(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You are not part of a gang`, message.author.avatarURL);
	if (message.member.hasPermission("ADMINISTRATOR")) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't use the suffix!`, message.author.avatarURL);

    embed.setColor(client.lang.colors.othersCommandsEmbed);
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

    await db.query("SELECT `toggle_suff` FROM `users` WHERE `discord_id` = '" + message.author.id + "'", async function (err, result, fields) {
        if (err) throw err;

		if (result[0].toggle_suff == 1) {
   			embed.setDescription("**Gang**\n\nYou've toggled your suffix ON!");

   			embed.setColor('#00FF00');

   			message.member.setNickname(message.author.username + ' ' + (await Gangs.getGang(message.member, true)));
		} else {
   			embed.setDescription("**Gang**\n\nYou've toggled your suffix OFF!");

   			embed.setColor('#FF0000');

   			message.member.setNickname(message.author.username);
		}

   	 	db.query("UPDATE `users` SET `toggle_suff`='" + (result[0].toggle_suff == 0 ? 1 : 0) + "' WHERE `discord_id` = '" + message.author.id + "'", async function (err, result, fields) {
   	 		if (err) throw err;

		});

		message.channel.send({
		  embed,
		  files: [{
		    attachment:'./images/gang.png',
		    name:'gang.png'
		  }]
		})
    });
   
};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.toggle,
	usage: 'g toggle'
}