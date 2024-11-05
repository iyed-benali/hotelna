const Service = require("../../../../auth-workflow/src/models/service/service");
const Hotel = require("../../../../auth-workflow/src/models/hotel/hotel");
const { createErrorResponse } = require("../../utils/error-handle");

exports.createServiceRequest = async (req, res) => {
  const { hotelCode, serviceDescription, roomNumber } = req.body;
  const clientId = req.user.id; 

  try {
    // Find the hotel by hotelCode
    const hotel = await Hotel.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json(createErrorResponse("Hotel not found", 404));
    }

    const newService = new Service({
      clientId,
      hotelId: hotel._id,
      hotelCode,
      roomNumber,
      serviceDescription,
      date: Date.now(),
    });

    await newService.save();
    res.status(201).json({
      message: "Service request created successfully.",
      service: newService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("Server error", 500));
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
  
