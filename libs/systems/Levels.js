/* Made by cohonesbrothers © 2019 */

const moment = require('moment');


class Levels {

	async getXP(discord_id) {

        return new Promise(function(resolve, reject) {
            db.query("SELECT `xp` FROM `users` WHERE `discord_id` = '" + discord_id + "'", function (err, result, fields) {
                if (err) throw err;

                   resolve(result[0].xp)
            });
        });

    }

	async getLevel(discord_id) {

		return new Promise(function(resolve, reject) {
            db.query("SELECT `level` FROM `users` WHERE `discord_id` = '" + discord_id + "'", function (err, result, fields) {
                if (err) throw err;

                   resolve(result[0].level)
            });
        });

	}

	async setLevel(member, level, guild) {

	  	let xp = await this.getXP(member.id);
		let channel = member.guild.channels.find(channel => channel.name === client.lang.channels.levelup)

		if (!xp) return;

		if (channel) {

			const embed = new Discord.RichEmbed()
				.setColor(client.lang.colors.levelupEmbed)
				.setTitle(client.lang.texts.levelupTitle.replace('%player%', member.displayName))
				.setThumbnail('https://i.imgur.com/g7XLG69.png')
				.setDescription(client.lang.texts.levelupField1.replace('%level%', level))
				.addField(client.lang.texts.levelupField2.replace('%xp%', ((client.config.leveling.base * level) * 2) - xp), client.lang.texts.levelupFooter, true)

			channel.send(`Hey, ${member}`).then((msg) => {
				msg.edit(embed);
			});

			if (level % 5 == 0) {
				if (level <= 100) {
					if (member.hasPermission("ADMINISTRATOR")) return;

					let oldRole = guild.roles.find(role => role.name === 'Level ' + (level - 5));

					let levelRole = guild.roles.find(role => role.name === 'Level ' + level);

					if (oldRole) {
						if (member.roles.has(oldRole.id))
							await member.removeRole(oldRole);
					}
					if (levelRole) {
						await member.addRole(levelRole);
					}
				}
			}

			await DB.Update(member.id, 0, 0, level);

		}

	}

	async addXP(member, guild, voicechat) {

		if (!voicechat) {
			if (moment().diff(member.timeout || 0) < 0)
	            return;

	        member.timeout = moment().add(1, 'minutes');
		}

	  	let xp = await this.getXP(member.id);
        let level = await this.getLevel(member.id);

		var gangMember = await Gangs.getGang(member);

		if (gangMember != "NONE") {
			var rankMember = await Gangs.getRank(member);
			var gangXPMultiplier = await Gangs.getMultiplier(gangMember, "xp");
	    	var gangCoinMultiplier = await Gangs.getMultiplier(gangMember, "coin");

	    	Currency.AddCoins(member.id, client.config.leveling.coinsMinute * client.config.shop.coin_xp.upgrades[gangCoinMultiplier]);
			await DB.Update(member.id, (xp + client.config.leveling.xpMinute * client.config.shop.coin_xp.upgrades[gangXPMultiplier]), 0, 0);
		} else {
			Currency.AddCoins(member.id, client.config.leveling.coinsMinute);
			await DB.Update(member.id, (xp + client.config.leveling.xpMinute), 0, 0);
		}
		
		await DB.UpdateChat(member.id, voicechat == true ? "vc" : "tc");

		if (xp >= (client.config.leveling.base * level) * 2)
			this.setLevel(member, level + 1, guild);

		xp = 0;
		level = 0;
	}

}	

global.Levels = new Levels();

module.exports = Levels;