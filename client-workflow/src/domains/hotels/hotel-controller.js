const Hotel = require("../../../../auth-workflow/src/models/hotel/hotel"); 
const Profile = require("../../../../auth-workflow/src/models/Auth/auth"); 
const {createErrorResponse} = require("../../utils/error-handle");

  exports.createHotel = async (req, res) => {
    const { 
      profileId, 
      hotelName, 
      hotelAddress, 
      hotelCity, 
      hotelStars, 
      hotelRooms, 
      hotelPrice, 
      hotelDescription, 
      hotelImage, 
      hotelPhone, 
      hotelEmail, 
      location 
    } = req.body;
    const { lat, long } = location;

    try {

      const profile = await Profile.findById(profileId);
      if (!profile || profile.role !== "HOTEL-OWNER") {
        return res.status(400).json(createErrorResponse("Invalid profile ID or not authorized", 400));
      }
      
      const hotelCode = Math.floor(1000 + Math.random() * 9000).toString();

    
      const newHotel = new Hotel({
        profileId,
        hotelName,
        hotelAddress,
        hotelCity,
        hotelStars,
        hotelRooms,
        hotelPrice,
        hotelDescription,
        hotelImage,
        hotelPhone,
        hotelEmail,
        hotelCode,
        location: { 
          lat,
          long, 
        },
      
        date: Date.now(), 
      });
      await newHotel.save();
      res.status(201).json({ message: "Hotel created successfully", hotel: newHotel });
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
exports.getHotelById = async (req, res) => {
  const { id } = req.params; // Hotel ID from the URL

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

