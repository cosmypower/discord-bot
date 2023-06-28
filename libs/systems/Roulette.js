class Roulette {

	constructor(client) {

		this.client = client;
		this.users = [];

		this.embed = new Discord.RichEmbed()
	        .setDescription('**Roulette**\n\nThe ball landed on: number x (col)!')
	        .setThumbnail('attachment://roulettethumb.png');
	}

	get getEmbed() {
		
		return this.embed;
	}

	get roll() {

    	return Math.floor(Math.random() * Math.floor(37));
	}

	get play_users() {
		
		return this.users;
	}

	reset() {

		this.users = [];
	}

	async addUser(guild, user, bet, method) {
		for await (const json of this.users) { 
			if (json.user.id == user.id) return false;
		}

		this.users.push({guild: guild, user: user, bet: bet, method: method});

		return true;
	}

	async check(number, type, betNumber) {
		number = parseInt(number);

		if (type == "straight" && number == betNumber) {
			return 36;
		} else if (type == "dozens" || type == "halves") {

			let array = betNumber.split('-');

			if (array[0] <= number && number <= array[1]) return (type == "dozens" ? 3 : 2);

		} else if (type == "columns") {

			if (betNumber == "3rd") {

				for (var i = 0; i <= 36; i += 3) {

					if (number == i) return 2;
				}

			} else if (betNumber == "2nd") {

				for (var i = -1; i <= 35; i += 3) {

					if (number == i) return 2;
				}

			} else {

				for (var i = -2; i <= 34; i += 3) {

					if (number == i) return 2;
				}

			}

		} else if (type == "colors") {

			var red = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

			if ((red.includes(number) && betNumber == "red") || (!red.includes(number) && betNumber == "black")) return 2; 
			
		} else if (type == "other") {

			const isOdd = number & 1 == true;

			if ((!isOdd && betNumber == "even") || (isOdd && betNumber == "odd")) return 2;

		} else return 0;
	}

	async getType(type) {
		if (type <= 36)
			return "straight";
		else if (type == "1-12" || type == "13-24" || type == "25-36")
			return "dozens";
		else if (type == "1st" || type == "2nd" || type == "3rd" )
			return "columns";
		else if (type == "1-18" || type == "19-36")
			return "halves";
		else if (type == "red" || type == "black")
			return "colors";
		else if (type == "odd" || type == "even")
			return "other";
		else
			return undefined;
	}

	async getColor(number) {
		var red = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

		return red.includes(number) ? "red" : "black";
	}


}

global.Roulette = new Roulette(client);

module.exports = Roulette;