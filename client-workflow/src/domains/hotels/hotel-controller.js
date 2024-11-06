const bcrypt = require("bcryptjs");

const { Hotel } = require("../../../../auth-workflow/src/models/hotel/hotel");
const { Profile } = require("../../../../auth-workflow/src/models/Auth/auth");
const { mailSender } = require("");
const { createErrorResponse } = require("path_to_error_handling");

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
    // Verify profile ID and role
    const profile = await Profile.findById(profileId);
    if (!profile || profile.role !== "HOTEL-OWNER") {
      return res.status(400).json(createErrorResponse("Invalid profile ID or not authorized", 400));
    }

    // Generate unique hotel code
    const hotelCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Generate a secure random password for the hotel
    const generatedPassword = crypto.randomBytes(8).toString("hex");

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    // Create the new hotel instance
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
      location: { lat, long },
      password: hashedPassword,
      date: Date.now(), 
    });
    
    // Save the hotel to the database
    await newHotel.save();

    // Send email to the hotel with the generated password
    const emailBody = `
      <p>Dear ${hotelName},</p>
      <p>Your hotel account has been successfully created. Here are your login credentials:</p>
      <p><strong>Email:</strong> ${hotelEmail}</p>
      <p><strong>Password:</strong> ${generatedPassword}</p>
      <p>Please log in and change your password as soon as possible.</p>
      <p>Best regards,</p>
      <p>Your Company Team</p>
    `;
    await mailSender(hotelEmail, "Your Hotel Account Login Details", emailBody);

    // Send response to admin
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

