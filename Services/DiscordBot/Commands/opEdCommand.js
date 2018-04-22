const AnimeFactory = require('../../../SourceManager/AnimeFactory').AnimeFactory;
const YoutubeApi = require('../../../SourceManager/YoutubeApi');
const ServiceManager = require('../../../ServiceManager');

const getAnimeVideoId = async function getAnimeVideoId(message, args) {
	const Youtube = YoutubeApi.getInstance();
	const logger = ServiceManager.getLogger();

	let opEd = (args[1] === 'op') ? 'opening' : 'ending';
	if(args[1] === 'oped') opEd = Math.floor(Math.random() * 2) === 1 ? 'opening' : 'ending';


	return AnimeFactory.getRandomAnime(args[1], args[2]).then(async anime => {
		if(!anime) {
			message.channel.send(`Error happened : Maybe check for the spelling of your username : **${args[2]}**`);
			return anime;
		}
		try{
			const videoId = await Youtube.getVideoId(anime + opEd);
			// console.log(`youtube id ${ videoId } anime : ${ anime}`);
			if(!videoId) {
				return getAnimeVideoId(message, args);
			}
			return videoId;
		}
		catch(err) {
			return getAnimeVideoId(message, args);
		}
	}).catch(err=>{
		return getAnimeVideoId(message, args);
	});
};

const execute = async function execute(message, args) {
	const Youtube = YoutubeApi.getInstance();
	const logger = ServiceManager.getLogger();

	if(args.length >= 3 && Number.isInteger(parseInt(args[3]))) {
		const promises = [];
		for(let i = 0; i < args[3]; i++) {
			promises.push(getAnimeVideoId(message, args));
		}
		Promise.all(promises)
			.then(ids=> {
				return Youtube.getPlayList(ids)
					.then(url => message.channel.send(url))
					.catch(error=>logger.error(`oped url shortener ${ error.toString()}`));
			})
			.catch(error=>logger.error(`oped list error ${ error.toString()}`));
	}
	else{
		Youtube.getVideo(getAnimeVideoId(message, args))
			.then(videoUrl => message.channel.send(videoUrl))
			.catch(error=>logger.error(`oped list ${ error.toString()}`));
	}
};

module.exports = {
	name: 'oped',
	args: true,
	aliases: ['op', 'ed'],
	usage: '< kitsu | mal > <username> [number of videos]',
	guildOnly: false,
	ownerGuildOnly:false,
	description: 'Get the opening or ending of a random anime of your completed anime library ! (Supports Kitsu ' +
	'and MyAnimeList accounts).\n Get a playlist by adding the number of songs you want ! ',
	execute,
};
