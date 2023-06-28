/* Made by cosmypower © 2019 */

const mysql = require('mysql');

class DatabaseManager {

	constructor(host, user, password, database) {
	    this.con = mysql.createConnection({
		  host: host,
		  user: user,
		  password: password,
		  database: database
		});

		global.db = this.con;
	}

	Connect() {
		this.con.connect(function(err) {

		  if (err) throw err;

		  console.log(clc.red("[DATABASE] ") + clc.yellow(`The bot has succesfully connected to the database. `));
		});
	}

	async GetUsers() {
		return new Promise(async (resolve, reject) => {
			await db.query("SELECT COUNT(*) AS count FROM `users`", async (err, result, fields) => {
				if (err) reject(err);

				resolve(result[0].count);
			});
		});	
	}

	Insert(discord_id) {
		this.con.query("INSERT INTO `users` (`discord_id`, `coins`, `level`, `xp`, `vc_minutes`, `tc_minutes`) VALUES ('" + discord_id + "', '0', '1', '0', '0', '0')", function (err, result, fields) {
		    if (err) throw err;

		    console.log(clc.red("[DATABASE] ") + clc.yellow("The user") + clc.red(client.users.get(discord_id).username) + clc.yellow(" has been succesfully added into the database!"));
		});
	}

	Update(discord_id, xp, coins, level) {
		let query = "";

		if (xp != 0 && coins == 0 && level == 0)
			query = "UPDATE `users` SET `xp` = '" + xp + "' WHERE `users`.`discord_id` = '" + discord_id + "';";
		else if (coins != 0 && level == 0 && xp == 0) 
			query = "UPDATE `users` SET `coins` = '" + coins + "' WHERE `users`.`discord_id` = '" + discord_id + "';";
		else if (level != 0 && coins == 0 && xp == 0)
			query = "UPDATE `users` SET `level` = '" + level + "' WHERE `users`.`discord_id` = '" + discord_id + "';"
		else if (xp != 0 && coins != 0 && level == 0) 
			query = "UPDATE `users` SET `xp` = '" + xp + "', `coins` = '" + coins + "' WHERE `users`.`discord_id` = '" + discord_id + "';";
		else if (level != 0 && xp != 0 && coins == 0)
			query = "UPDATE `users` SET `level` = '" + level + "', `xp` = '" + xp + "' WHERE `users`.`discord_id` = '" + discord_id + "';";
		else if (coins != 0 && level != 0 && xp == 0)
			query = "UPDATE `users` SET `xp` = '" + xp + "', `level` = '" + level + "' WHERE `users`.`discord_id` = '" + discord_id + "';";
		else
			query = "UPDATE `users` SET `xp` = '" + xp + "', `coins` = '" + coins + "', `level` = '" + level + "'  WHERE `users`.`discord_id` = '" + discord_id + "';";

		this.con.query(query, () => { });
	}

	async GetMinutes(discord_id, type) {
		type += '_minutes';

		return new Promise(function(resolve, reject) {
            db.query("SELECT `" + type + "` FROM `users` WHERE `discord_id` = '" + discord_id + "'", function (err, result, fields) {
                if (err) throw err;

                resolve(type == 'tc_minutes' ? result[0].tc_minutes : result[0].vc_minutes);
            });
        });

	}	

	UpdateChat(discord_id, type) {
		let minutes = await this.GetMinutes(discord_id, type);

		this.con.query("UPDATE `users` SET `" + (type + '_minutes') + "` = '" + (minutes + 1) + "' WHERE `discord_id` = '" + discord_id + "';", () => { });
	}

	CheckUser(user) {
		this.con.query("SELECT COUNT(*) AS count FROM `users` WHERE `discord_id` = '" + user.id + "'", (err, result, fields) => {
		    if (err) throw err;

		    if (user.bot || result[0].count > 0) return;

		    DB.Insert(user.id);
		});
	}

}

global.DB = new DatabaseManager(client.config.databaseInfo.host, client.config.databaseInfo.user, client.config.databaseInfo.password, client.config.databaseInfo.database);


module.exports = DatabaseManager;