const mongoose = require('mongoose');
const Music = require('../Music');

const playlistSchema = mongoose.Schema({
    name: {type: String, required: true},
    musics: [Music.schema]
})

module.exports = mongoose.model('Playlist', playlistSchema)