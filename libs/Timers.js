/* Made by cosmypower © 2019 */

const { setIntervalAsync } = require('set-interval-async/dynamic')

setIntervalAsync(function() {
	if (global.hasInit)
	{
		let split = client.lang.channels.voicechat.split(', ');

		split.forEach((channelul) => {

			client.guilds.forEach((guild) => {

				let channel = guild.channels.find(channel => channel.name === channelul);

				if (channel) {
					channel.members.forEach((user) => {
		    			Levels.addXP(user, guild, true);
					});
				}

			});

		});
	}
	
}, 60000);

global.rouletteTime = 0;
let winners = [];

async function rouletteTimer() {
	
	if (global.hasInit) {

		if (Roulette.play_users.length > 0) {
			rouletteTime++;

			if (rouletteTime == 30) {
				let channel;

				const balEmoji = await Emoji.getEmoji('633740361054814229');
				const number = Roulette.roll;
				const color = await Roulette.getColor(number);

				var embed = Roulette.getEmbed;
				var strWinners = "";

				for await (const json of Roulette.play_users) {
					channel = json.guild.channels.find(channel => channel.name === client.lang.channels.casino);

					var type = await Roulette.getType(json.method);
					var multiplier = await Roulette.check(number, type, json.method);

					if (multiplier > 0)
					{
						await Currency.AddCoins(json.user.id, json.bet * multiplier);
						
						winners.push({guild: json.guild, user: json.user, bet: json.bet, multiplier: multiplier});
					} else {
						await Currency.RemoveCoins(json.user.id, json.bet);
					}
				}
			
				embed.setDescription('**Roulette**\n\nThe ball landed on ``' + number + '``' + `\:${color}_circle:`)

				winners.every(async (json) => {
					if (winners.length > 0) strWinners += `${json.user.displayName} - ${json.bet * json.multiplier} ${balEmoji}\n`;

					return true;
				});

				if (winners.length > 0) embed.addField('Winners', strWinners, true);
				else embed.addField('No winners!', '\u200b', true);

				if (channel) {
					channel.send({
				        embed,
				        files: [{
				          attachment:'./images/casino/roulettethumb.png',
				          name:'roulettethumb.png'
				        }]
					});
				}

				embed.fields = [];
				strWinners = "";
				winners = [];
				Roulette.reset();
				rouletteTime = 0;
			}
		}
	}

	setTimeout(rouletteTimer, 1000);
};

setTimeout(rouletteTimer, 1000);
