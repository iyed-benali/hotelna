// models/Auth/auth.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
  verified: {
    type: Boolean,
    default: false,
  },
 
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
