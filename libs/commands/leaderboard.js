function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

exports.run = async (client, message, args) => {

	let id = 0; 
	let type = "";
	let page = 1;

	if (args[0])
		type = (args[0]).toLowerCase();
	if (args[1])
		page = parseInt(args[1]);

	if (page == 0) page = 1;

	function isNumeric(n){
         return (typeof n == "number" && !isNaN(n));
    }

	if(!args || args.length < 0 || args[0] == undefined || (type != "xp" && type != "coin" && type != "coins" && type != "vc" && type != "tc") || ( page.length > 0 && isNumeric(page) ) ) return Errors.invalidUsage(message, this.config.usage);

	let usersSize = await DB.GetUsers();

	if (usersSize < (page * 10 - 10)) return Errors.showError(message.member.displayName, message.channel, '#FF0000', `That page doesn't exists.`, message.author.avatarURL)

	let query = "SELECT * FROM users ORDER BY coins DESC";

	if (type == "xp") {
		type = "XP";

		query = "SELECT * FROM users ORDER BY xp DESC";
	} else if (type == "coin" || type == "coins") {
		type = "Coins";

		query = "SELECT * FROM users ORDER BY coins DESC";
	} else if (type == "vc" || type == "tc") {
		type = type.toUpperCase();

		query = "SELECT * FROM users ORDER BY " + (type == "VC" ? 'vc_minutes' : 'tc_minutes') + " DESC";
	}

    let desc = '**Leaderboard: **' + type + '\n\n';

	var p = new Promise(function(resolve, reject) {
       db.query(query, function (err, result, fields) {
		    if (err) reject(err);

		    result = JSON.parse(JSON.stringify(result));

		    resolve(result)
		});
    });

	const embed = new Discord.RichEmbed()
	    .setAuthor(message.member.displayName, message.author.avatarURL)
	    .setColor('#A103FC')

  	const balEmoji = await Emoji.getEmoji('633740361054814229');
	const xpEmoji = await Emoji.getEmoji('633740361419718666');

    await p.then(async (rows) => {
    	for (var row of rows) {
    		id++;

    		let user = message.guild.members.get(row.discord_id);

    		if (user) {
    			
	    		if (user.id == message.author.id) { embed.setFooter('Your leaderboard position: #' + id + ' | Page ' + page + '/' + Math.ceil(usersSize / 10)) }

	    		if (id <= (page * 10) && id >= (page * 10 - 10)) {

	    			if (type == "Coins" || type == "XP") {
		    			desc += "**" + id + ": **" + user + " » " + (type == "Coins" ? (formatNumber(row.coins) + balEmoji) : (formatNumber(row.xp) + xpEmoji))  + "\n";
		    		} else if (type == "VC" || type == "TC") {
		    			desc += "**" + id + ": **" + user + " » **" + (type == "VC" ? formatNumber(row.vc_minutes) : formatNumber(row.tc_minutes)) + "** minutes\n";
		    		}
	    		}
    		}

    		
    	}
    })

	embed.setDescription(desc)

    message.channel.send(embed);
    id = 0;
};


exports.config = {
  type: "other",
  desc: client.lang.desc.leaderboard,
  usage: 'leaderboard <xp/coin/tc/vc> [page]'
}