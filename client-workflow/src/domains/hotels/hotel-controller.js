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
    hotelCode, 
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
    
      date: Date.now(), // Use the current date
    });

    // Save the hotel to the database
    await newHotel.save();

    res.status(201).json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
