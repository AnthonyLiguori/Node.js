const mongoose = require("mongoose");

const musicSchema = mongoose.Schema({
  name: { type: String, required: true },
  artist_id: { type: Schema.Types.ObjectId, required: true },
  album_id: { type: Schema.Types.ObjectId, required: true },
  duration: { type: Number, required: true },
  year: { type: Number, required: true },
});

module.exports = mongoose.model("Music", musicSchema);
