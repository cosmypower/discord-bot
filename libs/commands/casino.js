exports.run = async (client, message, args) => {
	let page = 1;
  let limit = 0;

  function isNumeric(n){
         return (typeof n == "number" && !isNaN(n));
  }

	if(args && args.length > 0) { page = args[0] };

  if (client.commands.size < (page * client.config.commandsInfo.helpCmdRow) || !isNumeric(parseInt(page))) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `That page doesn't exists.`, message.author.avatarURL)

	const embed = new Discord.RichEmbed()
      .setColor('#FF0000')
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setThumbnail(message.guild.iconURL)
      .setDescription('List of casino commands:')

    client.commands.every((cmd, commandName) => {
      if (cmd.config.type == 'other') return true;

      limit++;

      if (limit <= (page * client.config.commandsInfo.helpCmdRow) && limit >= (page * client.config.commandsInfo.helpCmdRow - client.config.commandsInfo.helpCmdRow)) {
     
        embed.addField('Command: ' + client.config.botinfo.prefix + commandName, '``' + cmd.config.desc + '``\n**Usage:** ' + client.config.botinfo.prefix + cmd.config.usage + '\n**Alias:** ' + (cmd.config.alias !== undefined ? cmd.config.alias : "N/A"));
      }

      return true;
    });

    embed.setFooter('Page ' + page + '/' + Math.ceil(client.commands.size / 10))

    message.channel.send(embed);

};

exports.config = {
	type: "other",
	desc: client.lang.desc.casino,
	usage: 'casino [page]'
}