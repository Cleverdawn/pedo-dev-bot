import DiscordBot from '../index';
import Command from './abs/Command';

class HelpCommand extends Command {
	constructor () {
		super();
		this.name= 'help';
		this.aliases= ['h'];
		this.usage= '[command name]';
		this.description= 'Get explanations on the commands of the bot and the state of the server';
	}

	public async execute(message, args): Promise<any>{
		return message.channel.send(
			`${'```Markdown' +
			'\n# Actual Prefix : '}${ DiscordBot.getPrefix() }\n` +
			'\n# Commands : ' +
			'\n   - devMemes|d : random dev memes across the web ' +
			'\n   - kamm-sb|ksb [quote] : plays quotes from Kaamelott in voice chat ! Ex : '+ DiscordBot.getPrefix() + 'ksb poulette' +
			'\n   - help' +
			'\n' +
			'\n# GitHub :' +
			'\n   - Feel free to collaborate on the developpement of the bot : https://github.com/TomBerriot/dev-bot ' +
			'```'
		);
	}
}

export default new HelpCommand();