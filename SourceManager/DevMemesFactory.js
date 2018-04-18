const CodingLoveSource = require('./Sources/CodingLoveSource');


let ServiceManager = null;

let DevMemesSourceArray = null;

module.exports.DevMemesFactory = {

    setup: function setup(serviceManager) {
        ServiceManager = serviceManager;
        let CodingLove = new CodingLoveSource(ServiceManager, 'thecodinglove.com');
        DevMemesSourceArray = [
            CodingLove
        ];
    },
    getRandomMeme: function getRandomMeme() {
        let sourceIndex = Math.floor(Math.random() * DevMemesSourceArray.length);
        return DevMemesSourceArray[sourceIndex].getRandomMeme();
    },
};
