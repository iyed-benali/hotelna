const bcrypt = require("bcryptjs");

const  Hotel  = require("../../models/Hotel/hotel");
const Service = require('../../models/Service/service')
const createErrorResponse = require('../../utils/error-handle')
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

exports.changeHotelPassword = async (req, res) => {
  const { hotelId } = req.params;  
  const { oldPassword, newPassword } = req.body;

  try {

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

   
    const isMatch = await bcrypt.compare(oldPassword, hotel.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    
    hotel.password = hashedNewPassword;
    await hotel.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getServicesByHotelId = async (req, res) => {
  const { hotelId } = req.params; 

  try {
    const services = await Service.find({ hotelId });
    if (!services.length) {
      return res.status(404).json(createErrorResponse("No services found for this hotel.", 404));
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
exports.getServiceById = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ ok: false, message: "Service not found." });
    }

    res.status(200).json({ ok: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error." });
  }
};



exports.modifyStatus = async (req, res) => {
  const { serviceId } = req.params;
  const { status, cancelDescription } = req.body;

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ ok: false, message: "Service not found." });
    }

    if (!["pending", "in_progress", "completed", "canceled"].includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status value." });
    }

    if (status === "canceled" && !cancelDescription) {
      return res.status(400).json({ ok: false, message: "Cancel description is required when canceling a service." });
    }

    
    service.status = status;
    service.cancelDescription = status === "canceled" ? cancelDescription : undefined

    await service.save();

    res.status(200).json({ ok: true, message: "Service status updated successfully.", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error." });
  }
};
