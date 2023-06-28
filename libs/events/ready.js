module.exports = async () => {

	console.clear();

	console.log(clc.red(`Bot name: `) + clc.yellow(`${client.user.tag}`));
	console.log(clc.red(`Users count: `) + clc.yellow(`${client.users.size}`));

	console.log("");

	DB.Connect();

	await client.guilds.forEach(async (guild) => {
		if (guild.id != '633639125584707584' && guild.id != '633635326254120960') {
			await guild.members.forEach(async (user) => {
				if (!user.user.bot) {
				    await DB.CheckUser(user);
				}
			});
		}
	});


}
