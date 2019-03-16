import logger from '../Logger'
import fetch from 'node-fetch';
import fs from 'fs';

export interface IQuote {
	character: string;
	episode: string;
	file: string;
	title: string;
}

export default class Quote{
    public character: string;
	public episode: string;
	public file: string;
    public title: string;
    
	constructor(quoteObject: IQuote){
        this.character = quoteObject.character;
        this.episode = quoteObject.episode;
        this.file = quoteObject.file;
        this.title = quoteObject.title;
	}

	public isMatchingToString(str: string) {
        let search = str.toLowerCase();

		return this.character.includes(str) || this.episode.includes(str) || this.file.includes(str) || this.title.includes(str);
	};

	public getFileLink(){
		return 'https://raw.githubusercontent.com/2ec0b4/kaamelott-soundboard/master/sounds/' + this.file;
	}

	public async fetchReadableStream(){
		let res = await fetch(this.getFileLink())
		console.log(res.body)
		return res.body;
	} 
};