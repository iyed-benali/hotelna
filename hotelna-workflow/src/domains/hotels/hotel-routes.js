const express = require("express");
const router = express.Router();
const {getHotelByCode,getHotelById,getAllHotelLocations } = require("./hotel-controller"); 


// Route to create a new hotel

router.get("/hotel-by-id/:id",getHotelById)
router.get("/hotel-by-code/:code",getHotelByCode)
router.get("/hotel-locations",getAllHotelLocations)

module.exports = router;
