/* Made by cohonesbrothers © 2019 */

global.Discord = require('discord.js');
global.client = new Discord.Client();
client.config = require("./cfg/config.json");
client.lang = require("./cfg/lang.json");
client.superscript = require("./cfg/superscript.json");

global.clc = require('cli-color');

global.glob = require( 'glob' );
global.path = require( 'path' );
const Enmap = require("enmap");

global.delaySet = new Set();
global.hasInit = false;

client.gangCmd = new Enmap();
client.commands = new Enmap();
client.aliases = new Enmap();
client.cmdDesc = new Enmap();


const init = async () => {

	glob.sync( './libs/*.js' ).forEach( function( file ) {

	  require( path.resolve( file ) );
	  console.log(clc.red("[LOADER] " + clc.yellow("The file ") + file + clc.yellow("  has succesfully loaded!")));

	});

	glob.sync( './libs/systems/*.js' ).forEach( function( file ) {

	  require( path.resolve( file ) );
	  console.log(clc.red("[LOADER] " + clc.yellow("The system ") + file + clc.yellow("  has succesfully loaded!")));

	});

	glob.sync( './libs/events/*.js' ).forEach( function( file ) {

	  const evtName = (file.split("/")[3]).split(".")[0];
	  const event = require( `./libs/events/${evtName}.js` );

	  client.on(evtName, event.bind(null, client));

	});

	glob.sync( './libs/commands/*.js' ).forEach( function( file ) {

	  const commandName = ((file.split("/")[3]).split(".")[0]);
	  const command = require( `./libs/commands/${commandName}.js` );

	  client.commands.set(commandName, command);

	  if (command.config.alias !== 'undefined' && command.config.alias) {
	  	client.aliases.set(command.config.alias, commandName);
	  }
	  	
	});

	glob.sync( './libs/commands/gang/*.js' ).forEach( function( file ) {

	  const commandName = ((file.split("/")[4]).split(".")[0]);
	  const command = require( `./libs/commands/gang/${commandName}.js` );

	  client.gangCmd.set(commandName, command);
	  	
	});

	global.hasInit = true;

};

client.login(client.config.botinfo.token);

init();