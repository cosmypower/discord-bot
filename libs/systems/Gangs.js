const { letterTrans } = require('custom-translate');

class Gangs {

	constructor() {

	}

	async getCoins(gang) {
		return new Promise(function(resolve, reject) {
            db.query("SELECT coins FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
                if (err) reject(err);

                resolve(result[0].coins);
            });
        });
	}

	async getLimit(gang, type) {
		type += "_limit";

 		return new Promise(function(resolve, reject) {
            db.query("SELECT " + type + " FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
                if (err) reject(err);

                resolve(type == "coins_limit" ? client.config.shop.bank.upgrades[result[0].coins_limit] : client.config.shop.member.upgrades[result[0].members_limit]);
            });
        });
	}

	async set(table, row, value, where1, where2) {
		return new Promise(function(resolve, reject) {
            db.query("UPDATE `" + table + "` SET `" + row + "`='" + value + "' WHERE `" + where1 + "`='" + where2 + "';", function (err, result, fields) {
                if (err) throw err;

                resolve(true);
            });
        });
	}

	async get(row, where1, where2) {
		return new Promise(function(resolve, reject) {
            db.query("SELECT " + row + " FROM `gangs` WHERE `" + where1 + "` = '" + where2 + "'", function (err, result, fields) {
                if (err) reject(err);

                resolve(result[0]);
            });
        });
	}

	async getTax(gang) {

		return new Promise(function(resolve, reject) {
            db.query("SELECT tax FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
                if (err) reject(err);

                resolve(result[0].tax);
            });
        });

	}

	async getMultiplier(gang, type) {
		type += "_multiplier";

		return new Promise(function(resolve, reject) {
            db.query("SELECT " + type + " FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
                if (err) reject(err);

                resolve(type == "coin_multiplier" ? result[0].coin_multiplier : result[0].xp_multiplier);
            });
        });

	}

	async addCoins(gang, coins) {
		return new Promise(function(resolve, reject) {
            db.query("UPDATE `gangs` SET `coins`='" + coins + "' WHERE `gang_name`='" + gang + "';", function (err, result, fields) {
                if (err) throw err;

                resolve(true);
            });
        });
	}

	async getLeader(gang) {
		return new Promise(function(resolve, reject) {
            db.query("SELECT leader_id FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
                if (err) throw err;

                resolve(result[0].leader_id);
            });
        });
	}

	async toSuperScript(str) {
		return letterTrans(str, client.superscript);
	}

	async getGang(user, suffix, gang) {

		return new Promise(function(resolve, reject) {

			if (!gang) {
				db.query("SELECT gang FROM `users` WHERE `discord_id` = '" + user.id + "'", function (err, result, fields) {
	                if (err) throw err;

	                if (suffix)
	                	resolve(letterTrans(result[0].gang, client.superscript))
	                else
						resolve(result[0].gang);
	                
	            });
			} else {
				db.query("SELECT COUNT(*) AS count FROM `gangs` WHERE `gang_name` = '" + gang + "'", async (err, result, fields) => {
					if (err) reject(err);

					if (result[0].count > 0) { 

						db.query("SELECT gang_name FROM `gangs` WHERE `gang_name` = '" + gang + "'", function (err, result, fields) {
			                if (err) throw err;

			                if (suffix)
			                	resolve(letterTrans(result[0].gang_name, client.superscript))
			                else
								resolve(result[0].gang_name);
			                
			            });

					} else { resolve("NONE"); }
				});
			}
           
        });

	}

	async getRank(user) {

		return new Promise(function(resolve, reject) {
            db.query("SELECT rank FROM `users` WHERE `discord_id` = '" + user.id + "'", function (err, result, fields) {
                if (err) throw err;

            	if (result[0].rank == 0) resolve("NONE");
				else if (result[0].rank == 1) resolve("DEFAULT");
				else if (result[0].rank == 2) resolve("OFFICER");
				else if (result[0].rank == 3) resolve("LEADER");
            });
        });

	}

	async GetUsers(gang) {
		return new Promise(function(resolve, reject) {
			db.query("SELECT COUNT(*) AS count FROM `users` WHERE `gang` = '" + gang + "'", async (err, result, fields) => {
				if (err) reject(err);

				resolve(result[0].count);
			});
		});	
	}

	async CheckGang(gang) {
		return new Promise(function(resolve, reject) {
			db.query("SELECT COUNT(*) AS count FROM `gangs` WHERE `gang_name` = '" + gang + "'", async (err, result, fields) => {
				if (err) reject(err);

				if (result[0].count > 0) { resolve(true); } else { resolve(false); }
			});
		});	
	}


	async invitePlayer(gangName, user, inviter) {
		let result = db.query("SELECT gang FROM `users` WHERE `discord_id` = '" + user.id + "'", async (err, result, fields) => {
			if (err) throw err;

			if (inviter) {
				let rank = await this.getRank(inviter);

				if (rank != "OFFICER" && rank != "LEADER") return false;
			}
			
			if (result[0].gang != "NONE") return false;

			db.query("UPDATE `users` SET `gang`='" + gangName + "' WHERE  `discord_id`='" + user.id + "';", async function (err, result, fields) {
	            if (err) throw err;

		        db.query("UPDATE `users` SET `rank`='1' WHERE  `discord_id`='" + user.id + "';", function (err, result, fields) {
		            if (err) throw err;

		            return true;
		        });

    			if (user.hasPermission("ADMINISTRATOR")) return true;

   				db.query("SELECT `toggle_suff` FROM `users` WHERE `discord_id` = '" + user.id + "'", async function (err, result, fields) {
   					if (result[0].toggle_suff == 0) {
   						user.setNickname(user.user.username + ' ' + letterTrans(gangName, client.superscript));
   					}
   				});

	            return true;
	        });

		});

		if (!result) return false;

		return true;
	}

	async createGang(gangName, leader) {
		if (gangName > 8) return false;

		let result = db.query("SELECT COUNT(*) AS count FROM `gangs` WHERE `gang_name` = '" + gangName + "'", async (err, result, fields) => {
		    if (err) throw err;

		    if (result[0].count > 0) return false;

		    db.query("INSERT INTO `gangs` (`gang_name`, `leader_id`) VALUES ('" + gangName + "', '" + leader.id + "')", async function (err, result, fields) {
	            if (err) throw err;

	            db.query("UPDATE `users` SET `gang`='" + gangName + "' WHERE  `discord_id`='" + leader.id + "';", async function (err, result, fields) {
		            if (err) throw err;

		            db.query("UPDATE `users` SET `rank`='3' WHERE  `discord_id`='" + leader.id + "';", function (err, result, fields) {
			            if (err) throw err;

			            return true;
			        });

    				if (leader.hasPermission("ADMINISTRATOR")) return true;

    				db.query("SELECT `toggle_suff` FROM `users` WHERE `discord_id` = '" + leader.id + "'", async function (err, result, fields) {
	   					if (result[0].toggle_suff == 0) {
	   						leader.setNickname(leader.user.username + ' ' + letterTrans(gangName, client.superscript));
	   					}
	   				});

		        });

	            return true;
	        });

		});

		if (!result) return false;

		return true;	
	}

	async setRank(user, rank) {
		db.query("UPDATE `users` SET `rank`='" + rank + "' WHERE  `discord_id`='" + user.id + "';", function (err, result, fields) {
            if (err) throw err;

            return true;
        });
	}
	
}

global.Gangs = new Gangs();

module.exports = Gangs;