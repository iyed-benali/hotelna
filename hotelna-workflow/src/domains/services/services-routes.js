const express = require("express");
const { createServiceRequest,getServicesByHotelId } = require("./services-controllers");
const  verifyToken  = require("../../middlwares/verify-token");
const router = express.Router();


router.post("/submit", verifyToken, createServiceRequest);

router.get("/:hotelId/hotel", getServicesByHotelId);

module.exports = router;
