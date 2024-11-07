const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 256,
  },
  password: {
    type: String,
    required: true,
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
  sounds: {
    type: Boolean,
    default: true,
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

HotelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Hotel = mongoose.model("Hotel", HotelSchema);
module.exports = Hotel;
