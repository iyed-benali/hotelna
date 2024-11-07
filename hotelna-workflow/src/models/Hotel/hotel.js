const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode"); // Import QR code package
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
    default: false,
  },
  notifications: {
    type: Boolean,
    default: false,
  },
  qrCodeUrl: {
    type: String,
  },
});

// Pre-save hook for hashing password and generating QR code
HotelSchema.pre("save", async function (next) {
  // Hash the password if it has been modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

 
  if (this.isNew) {
    try {
      
        const qrData = {
          hotelCode: this.hotelCode,
          hotelName: this.hotelName,
          hotelPhone: this.hotelPhone,
        };
      
     
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      this.qrCodeUrl = qrCodeUrl; 
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const Hotel = mongoose.model("Hotel", HotelSchema);
module.exports = Hotel;
