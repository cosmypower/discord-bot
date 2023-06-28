module.exports = (client, message) => {

    if (!global.hasInit) return;

    if (message.author.bot || message.channel.type === 'group' || !message.guild || message.author.id === client.user.id) {
        return;
    }

    if (message.mentions.members.size != 0) { 
        if (message.mentions.members.first().id == message.author.id) return Errors.showError(message.member.displayName, message.channel, "#ff8629", client.lang.errors.mentionSelf, message.author.avatarURL);
    }


    Levels.addXP(message.guild.members.get(message.author.id), message.guild, false);

    const args = message.content.slice(client.config.botinfo.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var cmd;

    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command))
    } else if (args[0]) {
        if (command == "g" && client.gangCmd.has(args[0]))
            cmd = client.gangCmd.get(args[0]);
    }

    if (args[0]) {
        if (command == "g" && !client.gangCmd.has(args[0]))
            cmd = client.commands.get(command);
        else if (command == "g" && client.gangCmd.has(args[0]))
            cmd = client.gangCmd.get(args[0]);
    }

    let other = message.guild.channels.find(channel => channel.name === client.lang.channels.other);
    let gang = message.guild.channels.find(channel => channel.name === client.lang.channels.gang);
    let casino = message.guild.channels.find(channel => channel.name === client.lang.channels.casino);

    if (!cmd) return;

    if (delaySet.has(message.author.id)) return Errors.showError(message.member.displayName, message.channel, "#ff8629", `You need to wait until you can use this command again!`, message.author.avatarURL);

    //if ((message.channel.id != other.id && cmd.config.type == 'other' ) || (message.channel.id != gang.id && cmd.config.type == 'gang') || (message.channel.id != casino.id && cmd.config.type == 'casino')) return message.delete(500);

    if (message.content.indexOf(client.config.botinfo.prefix) !== 0) return;

    cmd.run(client, message, args);

    if (message.member.hasPermission("ADMINISTRATOR")) return;

    delaySet.add(message.author.id);

    if (cmd.config.type == 'other')
    {
        setTimeout(() => {
            delaySet.delete(message.author.id);
        }, client.config.commandsInfo.othersDelay * 1000);
    }
    else if (cmd.config.type == 'gang')
    {
        setTimeout(() => {
            delaySet.delete(message.author.id);
        }, client.config.commandsInfo.gangDelay * 1000);
    }
    else 
    {
        setTimeout(() => {
            delaySet.delete(message.author.id);
        }, client.config.commandsInfo.casinoDelay * 1000);
    }

}