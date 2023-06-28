/* Made by cohonesbrothers © 2019 */

client.on("guildMemberAdd", async (member) => {
	if (member.user.bot) return;

	setTimeout(async () => {
    	await DB.CheckUser(user);
    }, 1000)

	let channel = member.guild.channels.find(channel => channel.name === client.lang.channels.welcome);
	let field;

	if (member.guild.members.size == 1)
		field = client.lang.texts.welcomeField.replace('%number%', member.guild.members.size + "st")
	else if (member.guild.members.size == 2)
		field = client.lang.texts.welcomeField.replace('%number%', member.guild.members.size + "nd")
	else if (member.guild.members.size == 3)
		field = client.lang.texts.welcomeField.replace('%number%', member.guild.members.size + "rd")
	else 
		field = client.lang.texts.welcomeField.replace('%number%', member.guild.members.size + "th")

	const embed = new Discord.RichEmbed()
		.setColor(client.lang.colors.welcomeEmbed)
		.setTitle(client.lang.texts.welcomeTitle.replace('%server%', member.guild.name))
		.setDescription(client.lang.texts.welcomeDesc.replace('%player%', member.displayName))
		.setThumbnail(member.user.avatarURL)
		.addField('\u200b', field, true)


	channel.send(embed);
});