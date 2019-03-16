import logger from '../../Logger/index'
import DevMemesFactory from '../../SourceManager/DevMemesFactory';
import Command from './abs/Command';

class DevMemes extends Command {
	constructor () {
		super();
		this.name= 'devMemes';
		this.aliases= ['d', 'dev'];
		this.description= 'Get an infinite number of developers memes !';
		this.nonce= 666666;
	}

	public async execute(message, args): Promise<any> {
		let self = this;

		return DevMemesFactory.getRandomMeme().then(meme=>{
			if(meme.imgSource.includes('i.minus.com')) {
				self.execute(message, args);
				return 0;
			}
			message.channel.send(`# ${ meme.title}`, { files: [meme.imgSource], nonce: self.nonce, code: true })
				.then(msg=>{
					return msg.react('➕');
				})
				.catch(error=>{
					logger.error(`${error } ${ meme.title } ${ meme.imgSource } error code : ${ error.code}`);
					if(error.code === 40005 || error.code === 413) {
						message.channel.send('Image file of this meme was too large lol. Loading new dank meme. :incoming_envelope:');
					}
					else{
						message.channel.send('Meme too old, can\'t open dead link. Loading new dank meme. :incoming_envelope:');
					}
					self.execute(message, args);
				});
		}).catch(error=>{
			logger.error(`Dev Memes Command : ${ error}`);
		});
	}

	public async reactionHandler(reaction, user) : Promise<any>{
		if(reaction.count === 2 && reaction._emoji.name === '➕') {
			logger.info(`Dev Memes Command reaction ➕`);
			return this.execute(reaction.message, null);
		}
	}
}

export default new DevMemes();