import Discord from 'discord.js';
import fs from 'fs';
import appRootPath from 'app-root-path';
import logger from '../Logger/index';
import config from '../config';
import path from 'path';

let discordBotConfig = config.discordBot;

class DiscordBot{
	private bot;

	public async setup(){
		this.bot = new Discord.Client();
		this.bot.commands = new Discord.Collection();
		this.bot.reactionsHandlers = new Discord.Collection();
	
		let folderPath = `${appRootPath}/src/DiscordBot/Commands`;
		const commandFiles = fs.readdirSync(folderPath).filter((file) => fs.lstatSync(path.join(folderPath, file)).isFile());
	
		for (let file of commandFiles) {
			let commandModule = await import(`./Commands/${file}`);
			let command = commandModule.default;
			this.bot.commands.set(command.name, command);
			if(command.nonce) this.bot.reactionsHandlers.set(command.nonce, command);
		}
	
		this.bot.on('ready', this.ready.bind(this));
		this.bot.on('message', this.message.bind(this));
		this.bot.on('messageReactionAdd', this.messageReactionAdd.bind(this));
	
		return this.bot.login(discordBotConfig.token);
	}

	public getClient(){
		return this.bot;
	}

	public ready() {
		logger.info('Connected');
		logger.info('Logged in as: ');
		logger.info(`${this.bot.user.username} - (${this.bot.user.id})`);
		this.bot.user.setActivity(`Type ${ discordBotConfig.prefix }help`);
	}

	public message(message) {
		try{
			if (message.content.substring(0, discordBotConfig.prefix.length) === discordBotConfig.prefix) {
				const args = message.content.substring(discordBotConfig.prefix.length).split(/ +/);
	
				logger.info(`${message.content } : author : ${ message.author.tag } ; server : ${ message.guild ? message.guild.name : 'no guild '}`);
				const commandName = args[0];
	
				const command = this.bot.commands.get(commandName) || this.bot.commands.find(cmd => cmd.aliases && cmd.aliases.length > 0 && cmd.aliases.includes(commandName));
	
				if (!command) return;
	
				if(command.guildOnly && message.channel.type !== 'text') {
					return message.channel.send('This command is reserved to guilds.');
				}
				else if(command.ownerGuildOnly && ((message.member.id !== message.member.guild.ownerID) || message.author.tag !== 'Onodera#3602')) {
					return message.reply('You must be the owner of the guild to use this role');
				}
	
				if (command.args && args.length === 0) {
					let reply = 'You didn\'t provide any arguments.';
					if(command.usage) {
						reply += `\nThe usage would be : ${discordBotConfig.prefix}${commandName} ${command.usage}`;
					}
					return message.channel.send(reply);
				}
	
				command.execute(message, args);
	
			}
		}
		catch(error) {
			logger.error(`Bot On Message error ${ error}`);
		}
	}

	public messageReactionAdd(reaction, user) {
		try{
			if(user.id !== this.bot.user.id) {
				const command = this.bot.reactionsHandlers.get(reaction.message.nonce);
	
				if (!command) return;

				logger.info(`reaction : ${reaction._emoji.name} ; author : ${ user.tag } ; server : ${ reaction.message.guild ? reaction.message.guild.name : 'no guild '}`);
				
				command.reactionHandler(reaction, user);
			}
		}
		catch(error) {
			logger.error(`Bot On messageReactionAdd error ${ error}`);
		}
	}

	public getPrefix(){
		return discordBotConfig.prefix;
	}

}

export default new DiscordBot();