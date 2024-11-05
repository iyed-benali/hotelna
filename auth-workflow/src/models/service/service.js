const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  hotelCode: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  roomNumber: {
    type: Number,
    required: true, // Set required to true if necessary
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "canceled"], 
    default: "pending",
  },
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
