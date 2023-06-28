/* Made by cohonesbrothers © 2019 */

exports.run = async (client, message, args) => {

	function isNumeric(n){
         return (typeof n == "number" && !isNaN(n));
    }

    if(!args || args.length < 0 || args[1] == 0 || args[1] == undefined || !isNumeric(parseInt(args[1]))) return Errors.invalidUsage(message, this.config.usage);
    
    const user = message.mentions.members.first();
	var payCoins = parseInt(args[1]);
	var authorCoins = await Currency.getCoins(message.author.id);
	var userCoins = await Currency.getCoins(user.id);

	if (user.id == message.author.id) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You can't give money yourself.`, message.author.avatarURL)
	if (payCoins > authorCoins) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `You don't have enough coins.`, message.author.avatarURL)

	await DB.Update(message.author.id, 0, authorCoins - payCoins, 0);
	await DB.Update(user.id, 0, userCoins + payCoins, 0);

	const embed = new Discord.RichEmbed()
		.setColor(client.lang.colors.othersCommandsEmbed)
    	.setThumbnail('attachment://currency.png')
    	.setAuthor(message.member.displayName, message.author.avatarURL)
		.setDescription(`Pay command\n\n**${message.author} gave ${user} ${payCoins} coins.**`)

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/currency.png',
	    name:'currency.png'
	  }]
	});
}

exports.config = {
	type: "other",
	alias: "give",
	desc: client.lang.desc.pay,
	usage: 'pay <@member> <coins>'
}