const Service = require("../../../../auth-workflow/src/models/service/service");
const Client = require("../../../../auth-workflow/src/models/client/client");
const { createErrorResponse } = require("../../utils/error-handle");
const bcrypt = require('bcrypt')

exports.createServiceRequest = async (req, res) => {
  const { hotelCode, serviceDescription, roomNumber } = req.body;
  const clientId = req.user.id; 
  try {
    
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

exports.getClientServices = async (req, res) => {
    const { clientId } = req.params;
    try {
        // Find services associated with the client
        const services = await Service.find({ clientId });
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.modifyPassword = async (req, res) => {
    const { clientId } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const client = await Client.findOne({ _id: clientId });

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

      
        const isMatch = await bcrypt.compare(oldPassword, client.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

       
        client.password = hashedPassword;
        await client.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.modifyClientDetails = async (req, res) => {
    const { clientId } = req.params;
    const { fullName, email } = req.body;

    try {
        const client = await Client.findOne({ _id: clientId });

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

       
        if (email && email !== client.email) {
            const existingClient = await Client.findOne({ email });

            if (existingClient) {
                return res.status(400).json({ message: "Email already exists" });
            }

          
            client.email = email;
        }

     
        if (fullName) {
            client.fullName = fullName;
        }

        await client.save();
        res.status(200).json({ message: "Client details updated successfully", client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

  
