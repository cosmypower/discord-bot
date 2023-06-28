/* Made by cohonesbrothers © 2019 */

class Currency {

	async getCoins(discord_id) {

		return new Promise(function(resolve, reject) {
            db.query("SELECT `coins` FROM `users` WHERE `discord_id` = '" + discord_id + "'", function (err, result, fields) {
                if (err) throw err;

                resolve(result[0].coins)
            });
        });

	}

	async AddCoins(discord_id, coins) {
		let coinsDb = await this.getCoins(discord_id);

		await DB.Update(discord_id, 0, coinsDb + coins, 0);
	}

	async RemoveCoins(discord_id, coins) {
		let coinsDb = await this.getCoins(discord_id);

		if (coinsDb < coins) coins = 0;

		await DB.Update(discord_id, 0, coins, 0);
	}

}

global.Currency = new Currency();

module.exports = Currency;