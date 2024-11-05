const express = require("express");
const router = express.Router();
const { createHotel,getHotelByCode,getHotelById,getAllHotelLocations } = require("./hotel-controller"); 
const verifyAdmin = require("../../middlwares/verify-admin"); 

// Route to create a new hotel
router.post("/create", verifyAdmin, createHotel);
router.get("/hotel-by-id/:id",getHotelById)
router.get("/hotel-by-code/:code",getHotelByCode)
router.get("/hotel-locations",getAllHotelLocations)

module.exports = router;
