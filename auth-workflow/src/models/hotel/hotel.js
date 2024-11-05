const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  hotelCode: {
    type: String,
    required: true,
    unique: true,
    length: 4,
  },
  hotelName: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  hotelAddress: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  hotelCity: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  hotelStars: {
    type: Number,
    required: true,
  },
  hotelRooms: {
    type: Number,
    required: true,
  },
  hotelPrice: {
    type: Number,
    required: true,
  },
  hotelDescription: {
    type: String,
    required: true,
  },
  hotelImage: {
    type: String,
    required: true,
  },
  hotelPhone: {
    type: String,
    required: true,
  },
  hotelEmail: {
    type: String,
    required: true,
    min: 6,
    max: 256,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const Hotel = mongoose.model("Hotel", HotelSchema);
module.exports = Hotel;
