/* Made by cohonesbrothers © 2019 */

class Errors {

	showError(name, channel, color, text, avatar) {
		const embed = new Discord.RichEmbed()
			.setColor(color)
			.setFooter(name, avatar)
    		.setThumbnail('attachment://warning.png')
			.setDescription('**Error!**')
			.addField('\u200b', text, true)

		channel.send({
			embed, 
			files: [{
			    attachment:'./images/warning.png',
			    name:'warning.png'
			}]
		});
	}

	invalidUsage(message, correctUsage) {
		const embed = new Discord.RichEmbed()
			.setColor('#328A7C')
			.setAuthor(message.author.username, message.author.avatarURL)
			.setDescription('Invalid syntax!')
			.addField('``Usage: ' + client.config.botinfo.prefix + correctUsage + '``', 'You can use aliases too!', true);

		message.channel.send(embed);
	}

}

global.Errors = new Errors();

module.exports = Errors;