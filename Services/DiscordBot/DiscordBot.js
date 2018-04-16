const Discord = require('discord.js');
const bot = new Discord.Client();
const DevMemesFactory = require('../../SourceManager/DevMemesFactory').DevMemesFactory;

var ServiceManager = null;


var discordBotConfig = null;

function ready(){
    var logger = ServiceManager.getLogger();
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity("Type " + discordBotConfig.prefix + "help")
};

async function message(message){
    var logger = ServiceManager.getLogger();
    try{
        if (message.content.substring(0, discordBotConfig.prefix.length) === discordBotConfig.prefix) {
            var args = message.content.substring(discordBotConfig.prefix.length).split(' ');
            var cmd = args[0];
            switch(cmd) {
                case 'ping':
                    message.reply('Pong!');
                    break;
                case 'setPrefix':
                    if(args[1] === undefined) message.channel.send('You must provide a value for this command');
                    else {
                        discordBotConfig.prefix = args[1];
                        bot.user.setActivity("Type " + discordBotConfig.prefix + "help");
                        message.channel.send('The Command Prefix has been changed to : **' + discordBotConfig.prefix + '**');
                    }
                    break;
                case 'd':
                case 'devMemes':
                    DevMemesFactory.getRandomMeme()
                        .then(meme=>{
                            message.channel.send(
                                '```asciidoc'+
                                '\n# ' + meme.title +
                                '```',
                                {files: [meme.imgSource]}
                            ).catch(error=>{
                                logger.error(error + " " + meme.title + " " + meme.imgSource);
                            });
                        })
                        .catch(error=>{
                            logger.error("Dev Memes Command : " + error );
                        });
                    break;
                case 'lolis':
                    message.channel.send("THEY ARE THE BEST");
                    break;
                case 'RPS':
                    var i = Math.floor((Math.random() * 3) + 1);
                    var emote = "";
                    switch(i){
                        case 1:
                            emote = ":newspaper:";
                            break;
                        case 2:
                            emote = ":scissors:";
                            break;
                        case 3:
                            emote = ":full_moon:";
                            break;
                    }
                    message.reply(emote);
                    break;

                case "op":

                case 'help':
                    message.channel.send(
                        '```Markdown' +
                        '\n# Actual Prefix : ' + discordBotConfig.prefix+
                        '\n' +
                        '\n# Commands : ' +
                        '\n   - ping : Pong !' +
                        '\n   - setPrefix [value] : Change the prefix used before commands' +
                        '\n   - devMemes (shortcut : d) : random dev memes across the web ' +
                        '\n   - RPS : Rock, Paper, Scissors ! ' +
                        '\n   - help'+
                        '\n' +
                        '\n# GitHub :' +
                        '\n   - Feel free to collaborate on the developpement of the bot : https://github.com/Cleverdawn/pedo-dev-bot.git '+
                        '```'
                    );
                    break;
            }
        }
    }catch(error){
        logger.error("Bot On Message error " + error);
    }
};

module.exports.DiscordBot = {

    setup: function setup(serviceManager) {
        ServiceManager = serviceManager;

        discordBotConfig = ServiceManager.getConfig().discordBot;

        bot.on('ready', ready);
        bot.on('message', message);

        return bot.login(discordBotConfig.token);
    }
};