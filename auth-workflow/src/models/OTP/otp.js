const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "Profile" },
  otp: { type: String },
  expiresAt: { type: Date },
  type: {
    type: String,
    enum: ['emailVerification', 'passwordReset'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
