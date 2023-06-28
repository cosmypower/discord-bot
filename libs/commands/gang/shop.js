exports.run = async (client, message, args) => {

	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const embed = new Discord.RichEmbed();

	var gangMember = await Gangs.getGang(message.member);
	var rankMember = await Gangs.getRank(message.member);

	if (gangMember == "NONE") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You are not part of a gang', message.author.avatarURL);
	if (rankMember != "LEADER" && rankMember != "OFFICER") return Errors.showError(message.member.displayName, message.channel, '#FF0000', 'You need to be the leader / the officer of the gang.', message.author.avatarURL);
    
    var gangCoins = await Gangs.getCoins(gangMember);

    embed.setColor('#FF00FF');
    embed.setThumbnail('attachment://gang_shop.png')
    embed.setAuthor(message.member.displayName, message.author.avatarURL)

	embed.setDescription('**Gang Shop**');

	embed.addField('**1.** Change Gang Name', 'Purchase a name change for your gang!', false)
	embed.addField('**2.** Bank Limit Upgrade', 'Increase the maximum capacity that your\ngang bank can hold.', false)
	embed.addField('**3.** Max Members Upgrade', 'Increase the maximum amount of\nmembers that can be in your gang.', false)
	embed.addField('**4.** Coin Multiplier Upgrade', 'Increase the amount of coins\n gained by all members of the gang.', false)
	embed.addField('**5.** XP Multiplier Upgrade', 'Increase the amount of experience\ngained by all members of the gang.', false)

	message.channel.send({
	  embed,
	  files: [{
	    attachment:'./images/gang_shop.png',
	    name:'gang_shop.png'
	  }]
	}).then(async (msg) => {
		msg.react('1⃣').then( () => msg.react('2⃣').then( () => msg.react('3⃣').then( () => msg.react('4⃣').then( () => msg.react('5⃣')))))

		const filter = (reaction, user) => {
        	return ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
    	};
	
	    msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] }).then(async (collected) => {
	      	const reaction = collected.first();

	      	embed.fields = [];
				
      		let bankLimitLevel = await Gangs.get('coins_limit', 'gang_name', gangMember);
      		let memberLimitLevel = await Gangs.get('members_limit', 'gang_name', gangMember);

      		var gangXPMultiplier = await Gangs.getMultiplier(gangMember, "xp");
			var gangCoinMultiplier = await Gangs.getMultiplier(gangMember, "coin");

      		if (reaction.emoji.name == '1⃣') {
				embed.setDescription(`**Purchase upgrade - Change Gang Name**\n\Purchase a name change for your gang!\n\n\n**Cost:** 2500 ${balEmoji}`);
      		} else if (reaction.emoji.name == '2⃣') {
				embed.setDescription(`**Purchase upgrade - Bank Limit Upgrade**\n\nIncrease the maximum capacity that your gang bank can hold.\n\nCurrent Maximum: ${client.config.shop.bank.upgrades[bankLimitLevel.coins_limit]}\nNew Maximum: ${client.config.shop.bank.upgrades[bankLimitLevel.coins_limit + 1]}\n\n\n**Cost:** ${client.config.shop.bank.prices[bankLimitLevel.coins_limit + 1]} ${balEmoji}`);
      		} else if (reaction.emoji.name == '3⃣') {
				embed.setDescription(`**Purchase upgrade - Max Members Upgrade**\n\nIncrease the maximum amount of members that can be in your gang.\n\nCurrent Maximum: ${client.config.shop.member.upgrades[memberLimitLevel.members_limit]}\nNew Maximum: ${client.config.shop.member.upgrades[memberLimitLevel.members_limit + 1]}\n\n\n**Cost:** ${client.config.shop.member.prices[memberLimitLevel.members_limit + 1]} ${balEmoji}`);
      		} else if (reaction.emoji.name == '4⃣') {
				embed.setDescription(`**Purchase upgrade - Coin Multiplier Upgrade**\n\nIncrease the amount of coins gained by all members of the gang.\n\nCurrent Maximum: ${client.config.shop.coin_xp.upgrades[gangCoinMultiplier]}x\nNew Maximum: ${client.config.shop.coin_xp.upgrades[gangCoinMultiplier + 1]}x\n\n\n**Cost:** ${client.config.shop.coin_xp.prices[gangCoinMultiplier + 1]} ${balEmoji}`);
      		} else if (reaction.emoji.name == '5⃣') {
				embed.setDescription(`**Purchase upgrade - XP Multiplier Upgrade**\n\nIncrease the amount of experience gained by all members of the gang.\n\nCurrent Maximum: ${client.config.shop.coin_xp.upgrades[gangXPMultiplier]}x\nNew Maximum: ${client.config.shop.coin_xp.upgrades[gangXPMultiplier + 1]}x\n\n\n**Cost:** ${client.config.shop.coin_xp.prices[gangXPMultiplier + 1]} ${balEmoji}`);
      		} else {
      			console.log(reaction.emoji.name);
      		}

			message.channel.send({
			  embed,
			  files: [{
			    attachment:'./images/gang_shop.png',
			    name:'gang_shop.png'
			  }]
			}).then(async (msg2) => {
				msg2.react('👍').then(() => msg2.react('👎'));

		        const filterYesOrNo = (reaction, user) => {
		            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
		        };

		        msg2.awaitReactions(filterYesOrNo, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
		            const reaction2 = collected.first();

		            if (reaction2.emoji.name === '👍') {

		            	if (reaction.emoji.name == '1⃣') {

		            		if (gangCoins < 2500) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang doesn't have enough coins.`, message.author.avatarURL);
			
							embed.setDescription('**Gang Shop**\nType below the new name of the gang!');

				      		msg.edit(embed)

				      		const msgFilter = m => m.author.id == message.author.id;

							message.channel.awaitMessages(msgFilter, {
								max: 1,
								time: 60000,
								errors: ['time'],
							})
							.then(async (collected) => {
								let newGangName = collected.first().content;

						   		let exists = await Gangs.get('COUNT(*) AS count', 'gang_name', newGangName);
								if (exists.count > 0)  return Errors.showError(message.member.displayName, message.channel, '#FF0000', `This gang already exists.`, message.author.avatarURL);

								db.query("SELECT * FROM `users` WHERE `gang` = '" + gangMember + "';", async (err, result, fields) => {
						   			let rows = JSON.parse(JSON.stringify(result));
	
									await Gangs.set('gangs', 'gang_name', newGangName, 'gang_name', gangMember);

									rows.forEach(async (row) => {
					   					let member = message.guild.members.get(row.discord_id);

										await Gangs.set('users', 'gang', newGangName, 'discord_id', member.id);

										console.log(row.toggle_suff);

										if (row.toggle_suff == 0) {
											if (member.hasPermission("ADMINISTRATOR")) return true;

				      						member.setNickname(member.user.username + ' ' + (await Gangs.toSuperScript(newGangName)));
				     					} 
									});

									await Gangs.addCoins(newGangName, gangCoins - 2500);

									embed.setDescription('**Gang Shop**\nThe gang name has been changed to ``' + newGangName + '``!');

									msg.edit(embed);
						        });
							})
							.catch(function(){
								msg.delete(5000);
							});

		            	} else if (reaction.emoji.name == '2⃣') {
		            		if (bankLimitLevel.coins_limit + 1 == 10) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `Your gang has this upgrade already maxed out.`, message.author.avatarURL);

							if (gangCoins < client.config.shop.bank.prices[bankLimitLevel.coins_limit + 1]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang doesn't have enough coins.`, message.author.avatarURL);
				      		
				      		await Gangs.set(`gangs`, `coins_limit`, bankLimitLevel.coins_limit + 1, `gang_name`, gangMember);

				      		await Gangs.addCoins(gangMember, gangCoins - client.config.shop.bank.prices[bankLimitLevel.coins_limit + 1])

				      		embed.setDescription(`*Gang Shop**\n\nYou have upgraded \`\`Bank Limit Upgrade\`\` to level \`\`${bankLimitLevel.coins_limit + 1}\`\``)

				      		msg2.edit(embed);
			      		} else if (reaction.emoji.name == '3⃣') {

			      			if (memberLimitLevel.members_limit + 1 == 5) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `Your gang has this upgrade already maxed out.`, message.author.avatarURL);

							if (gangCoins < client.config.shop.member.prices[bankLimitLevel.coins_limit + 1]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang doesn't have enough coins.`, message.author.avatarURL);
				      		
				      		await Gangs.set(`gangs`, `members_limit`, memberLimitLevel.members_limit + 1, `gang_name`, gangMember);

				      		await Gangs.addCoins(gangMember, gangCoins - client.config.shop.member.prices[memberLimitLevel.members_limit + 1])

				      		embed.setDescription(`*Gang Shop**\n\nYou have upgraded \`\`Max Members Upgrade\`\` to level \`\`${memberLimitLevel.members_limit + 1}\`\``)

				      		msg2.edit(embed);

			      		} else if (reaction.emoji.name == '4⃣') {

			      			if (gangCoinMultiplier + 1 == 10) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `Your gang has this upgrade already maxed out.`, message.author.avatarURL);

							if (gangCoins < client.config.shop.coin_xp.prices[gangCoinMultiplier + 1]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang doesn't have enough coins.`, message.author.avatarURL);
				      		
				      		await Gangs.set(`gangs`, `coin_multiplier`, gangCoinMultiplier + 1, `gang_name`, gangMember);

				      		await Gangs.addCoins(gangMember, gangCoins - client.config.shop.coin_xp.prices[gangCoinMultiplier + 1])

				      		embed.setDescription(`*Gang Shop**\n\nYou have upgraded \`\`Coin Multiplier Upgrade\`\` to level \`\`${gangCoinMultiplier + 1}\`\``)

				      		msg2.edit(embed);
			      			
			      		} else if (reaction.emoji.name == '5⃣') {
			      			
			      			if (gangXPMultiplier + 1 == 10) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `Your gang has this upgrade already maxed out.`, message.author.avatarURL);

							if (gangCoins < client.config.shop.coin_xp.prices[gangXPMultiplier + 1]) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `The gang doesn't have enough coins.`, message.author.avatarURL);
				      		
				      		await Gangs.set(`gangs`, `xp_multiplier`, gangXPMultiplier + 1, `gang_name`, gangMember);

				      		await Gangs.addCoins(gangMember, gangCoins - client.config.shop.coin_xp.prices[gangXPMultiplier + 1])

				      		embed.setDescription(`*Gang Shop**\n\nYou have upgraded \`\`XP Multiplier Upgrade\`\` to level \`\`${gangXPMultiplier + 1}\`\``)

				      		msg2.edit(embed);
      					}
		            }

		            msg.delete(1000);

		        }).catch(collected => {
		              msg.delete(5000);
		        });

			}).catch(collected => {
		    	msg.delete(5000);
		    });

      	})
    }).catch(collected => {
    	msg.delete(5000);
    });

};

exports.config = {
	type: "gang",
	desc: client.lang.desc.gang.bank,
	usage: 'g bank'
}