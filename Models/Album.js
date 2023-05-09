const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  name: { type: String, required: true },
  artist_id: { type: Schema.Types.ObjectId, required: true },
  year: { type: Number, required: true },
});

module.exports = mongoose.model("Album", albumSchema);
