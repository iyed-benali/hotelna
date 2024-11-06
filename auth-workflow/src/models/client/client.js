const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: {
    type: [String],
    default: [],
  },
  recent_search: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
  },
  lat_long: {
    lat: { type: Number },
    long: { type: Number },
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  block_reason: {
    type: String,
  },
  blocked_at: {
    type: Date,
  },
});

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;
