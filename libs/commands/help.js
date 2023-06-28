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
      .setDescription('List of commands:')

    client.commands.every((cmd, commandName) => {
      if (cmd.config.type == 'casino') return true;

      limit++;

      if (limit <= (page * client.config.commandsInfo.helpCmdRow) && limit >= (page * client.config.commandsInfo.helpCmdRow - client.config.commandsInfo.helpCmdRow)) {
        if (limit > client.config.commandsInfo.helpCmdRow && page == 2)
          embed.addField('Command: ' + client.config.botinfo.prefix + commandName, '``' + cmd.config.desc + '``\n**Usage:** ' + client.config.botinfo.prefix + cmd.config.usage + '\n**Alias:** ' + (cmd.config.alias !== undefined ? cmd.config.alias : "N/A"));
        else if (page != 2)
          embed.addField('Command: ' + client.config.botinfo.prefix + commandName, '``' + cmd.config.desc + '``\n**Usage:** ' + client.config.botinfo.prefix + cmd.config.usage + '\n**Alias:** ' + (cmd.config.alias !== undefined ? cmd.config.alias : "N/A"));

      }
      return true;
    });


    message.channel.send(embed);

};

exports.config = {
	type: "other",
	alias: "cmds",
	desc: client.lang.desc.help,
	usage: 'help [page]'
}