const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  firstName: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  lastName: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256,
    unique: true, 
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["ADMIN", "CLIENT","MACHINE-OWNER"],
    default: "CLIENT",
  },
  verified: {
    type: Boolean,
    default: false, 
  },
  token: {
    type: String,
    default: "",
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
