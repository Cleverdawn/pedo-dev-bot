import Post from '../Post';
import Source from '../abs/Source';
import logger from '../../Logger'
import fetch from 'node-fetch';
import Quote, { IQuote } from '../Quote';

class KaamelottSoundBoardSource extends Source{
	private quotes : Quote[];
	
	constructor(){
		super('https://raw.githubusercontent.com/2ec0b4/kaamelott-soundboard/master/sounds')

		this.quotes = [];
		
		this.fetchSoundsJson()
		setTimeout(this.fetchSoundsJson.bind(this), 40000)
	}

	public getMatchingKaamelottQuotes(search: string) {
		return this.quotes.filter((quote: Quote) => {
			return quote.isMatchingToString(search);
		});
	};

	private async fetchSoundsJson(){
		try{
			logger.info('Kaamelott Quotes List is being fetched...')

			let res = await fetch(this.source + '/sounds.json')
			let json = await res.json();
			this.quotes = json.map((quote: IQuote) => new Quote(quote));

			logger.info('Kaamelott Quotes List fetched successfully')

			return this.quotes;
		}catch(e){
			logger.error('fetchSoundsJson error : ' + e.message)
		}
	}
};

export default new KaamelottSoundBoardSource();