const bcrypt = require("bcryptjs");

const { Hotel } = require("../../../../auth-workflow/src/models/hotel/hotel");


exports.getHotelById = async (req, res) => {
  const { id } = req.params; 

  try {
    const hotel = await Hotel.findById(id).populate('profileId'); 
    if (!hotel) {
      return res.status(404).json({ ok: false, message: "Hotel not found." });
    }
    res.status(200).json({ ok: true, data: hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error." });
  }
};
exports.getHotelByCode = async (req, res) => {
  const { code } = req.params; 
  try {
    const hotel = await Hotel.findOne({ hotelCode: code }).populate('profileId');
    if (!hotel) {
      return res.status(404).json({ ok: false, message: "Hotel not found with this code." });
    }
    res.status(200).json({ ok: true, data: hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error." });
  }
};
exports.getAllHotelLocations = async (req, res) => {
  try {
    const hotels = await Hotel.find({}, 'hotelName hotelAddress location'); 
    if (hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found." });
    }

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

