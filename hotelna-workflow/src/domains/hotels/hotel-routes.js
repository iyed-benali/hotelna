const express = require("express");
const router = express.Router();
const {getHotelByCode,getHotelById,getAllHotelLocations,changeHotelPassword ,modifyStatus,getServicesByHotelId,getServiceById,toggleNotifications,toggleSounds} = require("./hotel-controller"); 



// Route to create a new hotel

router.get("/hotel-by-id/:id",getHotelById)
router.get("/hotel-by-code/:code",getHotelByCode)
router.get("/hotel-locations",getAllHotelLocations)
router.post("/hotel-password/:hotelId",changeHotelPassword)
router.get('/hotel-services/:hotelId',getServicesByHotelId)
router.get('/service/:serviceId', getServiceById);
router.patch('/service/:serviceId/status', modifyStatus);
router.put("/:hotelId/toggle-sounds", toggleSounds);
router.put("/:hotelId/toggle-notifications", toggleNotifications);


module.exports = router;
