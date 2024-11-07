const  Hotel  = require("../../models/Hotel/hotel");
const  Profile  = require("../../models/Auth/auth");
const  mailSender  = require("../../utils/mail-sender");
const {createErrorResponse} = require('../../utils/error-handle')
const { generateRandomPassword } = require('../../utils/generate-password');
const bcrypt = require('bcrypt')
const Client = require('../../models/Client/client')
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
      email, 
      location 
    } = req.body;
    const { lat, long } = location;
  
    try {
      const profile = await Profile.findById(profileId);
    
      
      const hotelCode = Math.floor(1000 + Math.random() * 9000).toString();
  
      
      const generatedPassword = generateRandomPassword()
 
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
        email,
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
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${generatedPassword}</p>
        <p>Please log in and change your password as soon as possible.</p>
        <p>Best regards,</p>
        <p>Your Company Team</p>
      `;
      await mailSender(email, "Your Hotel Account Login Details", emailBody);
  
      // Send response to admin
      res.status(201).json({ message: "Hotel created successfully", hotel: newHotel });
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  exports.getAllHotels = async (req, res) => {
    try {
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  exports.getAllClients = async (req, res) => {
    try {
      const clients = await Client.find();  
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  exports.deleteHotel = async (req, res) => {
    const { hotelId } = req.params;  
    try {
      const hotel = await Hotel.findByIdAndDelete(hotelId);
      if (!hotel) {
        return res.status(404).json(createErrorResponse("Hotel not found", 404));
      }
      res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  exports.updateHotel = async (req, res) => {
    const { hotelId } = req.params; 
    const { 
      hotelName, 
      hotelAddress, 
      hotelCity, 
      hotelStars, 
      hotelRooms, 
      hotelPrice, 
      hotelDescription, 
      hotelImage, 
      hotelPhone, 
      email, 
      location 
    } = req.body;
    const { lat, long } = location;
  
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId, 
        { 
          hotelName, 
          hotelAddress, 
          hotelCity, 
          hotelStars, 
          hotelRooms, 
          hotelPrice, 
          hotelDescription, 
          hotelImage, 
          hotelPhone, 
          email, 
          location: { lat, long }
        },
        { new: true }
      );
  
      if (!updatedHotel) {
        return res.status(404).json(createErrorResponse("Hotel not found", 404));
      }
  
      res.status(200).json({ message: "Hotel updated successfully", hotel: updatedHotel });
    } catch (error) {
      console.error(error);
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  
        