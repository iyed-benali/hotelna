const express = require("express");
const router = express.Router();
const { createHotel } = require("./hotel-controller"); 
const verifyAdmin = require("../../middlwares/verify-admin"); 

// Route to create a new hotel
router.post("/create", verifyAdmin, createHotel);

module.exports = router;
