exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	var gangMember = await Gangs.getGang(message.member);
	var rankMember = await Gangs.getRank(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are not part of a gang', message.author.avatarURL);
    
    var gangCoins = await Gangs.getCoins(gangMember);
    var gangCoinsLimit = await Gangs.getLimit(gangMember, "coins");
    var gangMembersLimit = await Gangs.getLimit(gangMember, "members");
    var gangXPMultiplier = await Gangs.getMultiplier(gangMember, "xp");
    var gangCoinMultiplier = await Gangs.getMultiplier(gangMember, "coin");

    var gangLeader = await Gangs.getLeader(gangMember);

    var gangTax = await Gangs.getTax(gangMember);
    var gangUsers = await Gangs.GetUsers(gangMember);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang - ' + gangMember + '**');

	embed.addField('**XP Multiplier**', '``' + client.config.shop.coin_xp.upgrades[gangXPMultiplier] + 'x``', true)
	embed.addField('**Coin Multiplier**', '``' + client.config.shop.coin_xp.upgrades[gangCoinMultiplier] + 'x``', true)

	embed.addField('**Bank**', '``' + gangCoins + '/' + gangCoinsLimit + '`` ' + balEmoji, true)
	//embed.addField('**Daily Tax**', '``' + (gangTax * gangUsers) + '`` ' + balEmoji, true)

	var leaderField = 'Leader - ' + message.guild.members.get(gangLeader).user;
	var officersField = '\nOfficers - ';
	var membersField = '\nMembers - '

	let members = [];
	let membersNr = 0;

	let officersNr = 0;

    await db.query("SELECT * FROM `users` WHERE `gang` = '" + gangMember + "';", async (err, result, fields) => {
		let rows = JSON.parse(JSON.stringify(result));

		for await (var row of rows) {
			let member = message.guild.members.get(row.discord_id);

			if (row.rank == 2 || row.rank == 1) {
				await members.push({rank: row.rank, member: member});
			}
			
		}

		members.every(async (json) => {
			if (members.length > 0) {
				if (json.rank == 1) {

					membersField += json.member.user + " ";

					membersNr++;
				}
				if (json.rank == 2) {

					officersField += json.member.user + " ";

					officersNr++;
				} 
			}

			return true;
		});

	    embed.addField('**Members (' + gangUsers + '/' + gangMembersLimit + ')**', leaderField + (officersNr > 0 ? officersField : "") + (membersNr > 0 ? membersField : ""))

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
	desc: client.lang.desc.gang.info,
	usage: 'g info'
}