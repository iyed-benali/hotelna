const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  hotelCode: {
    type: String,
    required: true,
    length: 4,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
