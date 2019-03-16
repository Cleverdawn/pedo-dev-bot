import logger from '../../Logger/index'
import KaamelottSoundBoardSource  from '../../SourceManager/Sources/KaamelottSoundBoardSource';
import Command from './abs/Command';
import Quote from 'src/SourceManager/Quote';

class KaamelottSoundBoard extends Command {
	constructor () {
		super();
		this.name= 'kamm-sb';
		this.aliases= ['ksb'];
		this.description= 'Play Kaamelott quotes in your voice chat !';
		this.nonce= 666666;
	}

	public async execute(message, args): Promise<any> {
		let self = this;

		//console.log(KaamelottSoundBoardSource.getMatchingKaamelottQuotes(args[1]));

		let quote: Quote = KaamelottSoundBoardSource.getMatchingKaamelottQuotes(args[1])[0];

		let voiceChannel = message.member.voiceChannel;
		if(voiceChannel){
			let connection = await voiceChannel.join();
			let quoteAudioStream = await quote.fetchReadableStream();
			const dispatcher = connection.playStream(quoteAudioStream, { seek: 0, volume: 1 });
			dispatcher.on("end", () => voiceChannel.leave());
		}

	}

	public async reactionHandler(reaction, user) : Promise<any>{
	}
}

export default new KaamelottSoundBoard();